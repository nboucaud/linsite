
import React, { useEffect, useRef } from 'react';

export const LogisticsHeroVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        // Alpha: false for performance (no composition with background)
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let frameId: number;
        let time = 0;

        // --- CONFIG ---
        const COLS = 50; 
        const ROWS = 24;
        const PARTICLE_COUNT = COLS * ROWS; 
        const CAM_Z = 1200;
        const PHASE_DURATION = 600;
        const TRANSITION_SPEED = 0.04;
        
        // --- STATE & BUFFERS ---
        // Layout: [x, y, z, tx, ty, tz, colorType]
        const P_STRIDE = 7;
        const data = new Float32Array(PARTICLE_COUNT * P_STRIDE);
        
        // Project buffers (Allocated ONCE to avoid GC)
        const projX = new Float32Array(PARTICLE_COUNT);
        const projY = new Float32Array(PARTICLE_COUNT);
        const projScale = new Float32Array(PARTICLE_COUNT);

        // Initialize state
        for(let i=0; i<PARTICLE_COUNT; i++) {
            const idx = i * P_STRIDE;
            data[idx] = (Math.random() - 0.5) * 2000;
            data[idx+1] = (Math.random() - 0.5) * 2000;
            data[idx+2] = (Math.random() - 0.5) * 2000;
            
            // Color: 0=Cyan, 1=Amber, 2=White
            const rand = Math.random();
            data[idx+6] = rand > 0.9 ? 1 : (rand > 0.7 ? 2 : 0);
        }

        let phase = 0; 
        let phaseTimer = 0;

        // --- GEOMETRY GENERATORS ---
        const setTargetPlane = () => {
            const spacingX = 35;
            const spacingY = 35;
            const offsetX = (COLS * spacingX) / 2;
            const offsetY = (ROWS * spacingY) / 2;
            for(let i=0; i<PARTICLE_COUNT; i++) {
                const idx = i * P_STRIDE;
                const col = i % COLS;
                const row = Math.floor(i / COLS);
                data[idx+3] = col * spacingX - offsetX;
                data[idx+4] = row * spacingY - offsetY;
                data[idx+5] = Math.sin(col * 0.2) * 40 + Math.cos(row * 0.2) * 40;
            }
        };

        const setTargetSphere = () => {
            const radius = 300;
            for(let i=0; i<PARTICLE_COUNT; i++) {
                const idx = i * P_STRIDE;
                const col = i % COLS;
                const row = Math.floor(i / COLS);
                const lat = (row / (ROWS - 1)) * Math.PI - Math.PI / 2;
                const lon = (col / (COLS - 1)) * Math.PI * 2;
                data[idx+3] = radius * Math.cos(lat) * Math.cos(lon);
                data[idx+4] = radius * Math.sin(lat);
                data[idx+5] = radius * Math.cos(lat) * Math.sin(lon);
            }
        };

        const setTargetTorus = () => {
            const R = 260; const r = 90;
            for(let i=0; i<PARTICLE_COUNT; i++) {
                const idx = i * P_STRIDE;
                const col = i % COLS;
                const row = Math.floor(i / COLS);
                const u = (col / COLS) * Math.PI * 2;
                const v = (row / ROWS) * Math.PI * 2;
                data[idx+3] = (R + r * Math.cos(v)) * Math.cos(u);
                data[idx+4] = (R + r * Math.cos(v)) * Math.sin(u);
                data[idx+5] = r * Math.sin(v);
            }
        };

        const updateTargets = () => {
            if (phase === 0) setTargetPlane();
            else if (phase === 1) setTargetSphere();
            else setTargetTorus();
        };
        setTargetPlane();

        // --- RENDER LOOP ---
        const render = () => {
            time += 0.015;
            phaseTimer++;
            if (phaseTimer > PHASE_DURATION) {
                phaseTimer = 0;
                phase = (phase + 1) % 3;
                updateTargets();
            }

            ctx.fillStyle = '#020202';
            ctx.fillRect(0, 0, width, height);

            const cx = width * 0.75;
            const cy = height * 0.5;

            // Camera Matrices
            const rotY = time * 0.2;
            const rotX = Math.sin(time * 0.15) * 0.2;
            const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
            const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

            // 1. UPDATE & PROJECT
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const idx = i * P_STRIDE;
                
                // LERP
                const tx = data[idx+3], ty = data[idx+4], tz = data[idx+5];
                data[idx] += (tx - data[idx]) * TRANSITION_SPEED;
                data[idx+1] += (ty - data[idx+1]) * TRANSITION_SPEED;
                data[idx+2] += (tz - data[idx+2]) * TRANSITION_SPEED;

                let x = data[idx];
                let y = data[idx+1];
                let z = data[idx+2];

                // Wave effect (only phase 0)
                if (phase === 0) z += Math.sin(x * 0.03 + time * 4) * 20;

                // 3D Rotation
                let x1 = x * cosY - z * sinY;
                let z1 = z * cosY + x * sinY;
                let y1 = y * cosX - z1 * sinX;
                let z2 = z1 * cosX + y * sinX;

                const scale = CAM_Z / (CAM_Z + z2);
                projScale[i] = scale;
                
                if (scale > 0) {
                    projX[i] = cx + x1 * scale;
                    projY[i] = cy + y1 * scale;
                }
            }

            // 2. DRAW CONNECTIONS (Single Batch Path)
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)'; // Cyan lines
            ctx.lineWidth = 0.8; 

            for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c < COLS; c++) {
                    const i = r * COLS + c;
                    if (projScale[i] <= 0) continue;

                    // Right Neighbor
                    if (c < COLS - 1) {
                        const right = i + 1;
                        if (projScale[right] > 0) {
                            ctx.moveTo(projX[i], projY[i]);
                            ctx.lineTo(projX[right], projY[right]);
                        }
                    }
                    // Down Neighbor
                    if (r < ROWS - 1) {
                        const down = i + COLS;
                        if (projScale[down] > 0) {
                            ctx.moveTo(projX[i], projY[i]);
                            ctx.lineTo(projX[down], projY[down]);
                        }
                    }
                }
            }
            ctx.stroke();

            // 3. DRAW NODES (Batch By Color)
            // Function to draw all nodes of a specific color type
            const drawBatch = (color: string, typeVal: number) => {
                ctx.fillStyle = color;
                ctx.beginPath();
                for (let i = 0; i < PARTICLE_COUNT; i++) {
                    // Fast check for color type
                    if (Math.abs(data[i * P_STRIDE + 6] - typeVal) > 0.1) continue;
                    if (projScale[i] <= 0) continue;

                    const size = (1.5 + Math.sin(time * 5 + i) * 0.5) * projScale[i];
                    ctx.rect(projX[i] - size/2, projY[i] - size/2, size, size);
                }
                ctx.fill();
            };

            drawBatch('#06b6d4', 0); // Cyan
            drawBatch('#f59e0b', 1); // Amber
            drawBatch('#ffffff', 2); // White

            frameId = requestAnimationFrame(render);
        };

        const handleResize = () => {
            if (canvas.parentElement) {
                const dpr = window.devicePixelRatio || 1;
                const rect = canvas.parentElement.getBoundingClientRect();
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;
                ctx.scale(dpr, dpr);
                width = rect.width;
                height = rect.height;
                updateTargets();
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(frameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ width: '100%', height: '100%' }} />;
};
