
import React, { useEffect, useRef } from 'react';

export const PhilosophyHeroVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let w = canvas.width;
        let h = canvas.height;
        let frameId: number;
        let time = 0;

        // --- CONFIG ---
        const PARTICLE_COUNT = 700;
        const CAM_Z = 1000;
        const PHASE_DURATION = 600; // Frames per phase (approx 10s)
        const TRANSITION_DURATION = 120; // Frames for morphing

        // --- STATE ---
        // x, y, z: Current Position
        // tx, ty, tz: Target Position
        // r, g, b: Current Color
        // tr, tg, tb: Target Color
        const data = new Float32Array(PARTICLE_COUNT * 12); 
        
        let phase = 0; // 0: GYRO (Amber), 1: TOWER (Blue), 2: PRISM (Green)
        let phaseTimer = 0;

        // --- SHAPE GENERATORS ---

        // SHAPE 1: GYROSCOPE (Alignment)
        const setGyroTarget = (i: number, total: number) => {
            const idx = i * 12;
            const ringSize = total / 3;
            const ringIndex = Math.floor(i / ringSize); // 0, 1, 2
            const posInRing = i % ringSize;
            const angle = (posInRing / ringSize) * Math.PI * 2;
            
            const radius = 180;
            const thick = 20; // Thickness of ring

            let x, y, z;

            // Add slight thickness variation
            const thickness = (Math.random() - 0.5) * thick;

            if (ringIndex === 0) {
                // Ring X
                x = 0 + thickness;
                y = Math.cos(angle) * radius;
                z = Math.sin(angle) * radius;
            } else if (ringIndex === 1) {
                // Ring Y
                x = Math.cos(angle) * (radius * 0.8);
                y = 0 + thickness;
                z = Math.sin(angle) * (radius * 0.8);
            } else {
                // Ring Z
                x = Math.cos(angle) * (radius * 0.6);
                y = Math.sin(angle) * (radius * 0.6);
                z = 0 + thickness;
            }

            data[idx+3] = x;
            data[idx+4] = y;
            data[idx+5] = z;

            // Target Color: Amber (#f59e0b -> 245, 158, 11)
            data[idx+9] = 245; 
            data[idx+10] = 158;
            data[idx+11] = 11;
        };

        // SHAPE 2: MONOLITH / TOWER (Engineering)
        const setTowerTarget = (i: number, total: number) => {
            const idx = i * 12;
            
            // Build a 3D grid tower
            const layers = 20;
            const perLayer = Math.floor(total / layers);
            const layerIdx = Math.floor(i / perLayer);
            const posInLayer = i % perLayer;
            
            const height = 500;
            const width = 140;
            
            const y = -height/2 + (layerIdx / layers) * height;
            
            // Square profile
            const side = Math.floor(posInLayer / (perLayer/4)); // 0,1,2,3 sides
            const offset = (posInLayer % (perLayer/4)) / (perLayer/4); // 0 to 1 along side
            
            let x, z;
            const wHalf = width / 2;

            if (side === 0) { x = -wHalf + offset * width; z = -wHalf; }
            else if (side === 1) { x = wHalf; z = -wHalf + offset * width; }
            else if (side === 2) { x = wHalf - offset * width; z = wHalf; }
            else { x = -wHalf; z = wHalf - offset * width; }

            data[idx+3] = x;
            data[idx+4] = y;
            data[idx+5] = z;

            // Target Color: Cyan (#06b6d4 -> 6, 182, 212)
            data[idx+9] = 6;
            data[idx+10] = 182;
            data[idx+11] = 212;
        };

        // SHAPE 3: PRISM / DIAMOND (Sovereignty)
        const setPrismTarget = (i: number, total: number) => {
            const idx = i * 12;
            // Octahedron/Icosahedron approximation
            const phi = Math.acos(1 - 2 * (i / total));
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;
            
            // Faceted look: Snap angles to create flat planes
            const snap = 8; // Number of vertical facets
            const phiSnap = Math.floor(phi * snap) / snap;
            const thetaSnap = Math.floor(theta * snap) / snap;

            const radius = 220;
            
            data[idx+3] = radius * Math.sin(phiSnap) * Math.cos(thetaSnap);
            data[idx+4] = radius * Math.sin(phiSnap) * Math.sin(thetaSnap);
            data[idx+5] = radius * Math.cos(phiSnap);

            // Target Color: Emerald (#10b981 -> 16, 185, 129)
            data[idx+9] = 16;
            data[idx+10] = 185;
            data[idx+11] = 129;
        };

        const updateTargets = () => {
            for(let i=0; i<PARTICLE_COUNT; i++) {
                if (phase === 0) setGyroTarget(i, PARTICLE_COUNT);
                else if (phase === 1) setTowerTarget(i, PARTICLE_COUNT);
                else setPrismTarget(i, PARTICLE_COUNT);
            }
        };

        // Initial setup
        // Random start positions
        for(let i=0; i<PARTICLE_COUNT; i++) {
            const idx = i * 12;
            data[idx] = (Math.random()-0.5) * 1000;
            data[idx+1] = (Math.random()-0.5) * 1000;
            data[idx+2] = (Math.random()-0.5) * 1000;
            // Init color to white
            data[idx+6] = 255; data[idx+7] = 255; data[idx+8] = 255;
        }
        updateTargets();

        // --- RENDER LOOP ---
        const render = () => {
            time += 0.008;
            phaseTimer++;

            // Phase Switching
            if (phaseTimer > PHASE_DURATION) {
                phaseTimer = 0;
                phase = (phase + 1) % 3;
                updateTargets();
            }

            ctx.fillStyle = '#020202';
            ctx.fillRect(0, 0, w, h);

            const cx = w * 0.5;
            const cy = h * 0.5;

            // Camera Rotation
            let rotX = 0;
            let rotY = 0;

            if (phase === 0) { // Gyro: Multi-axis spin
                rotX = time * 0.5;
                rotY = time * 0.3;
            } else if (phase === 1) { // Tower: Slow turntable
                rotX = 0.2; // Slight tilt
                rotY = time * 0.2;
            } else { // Prism: Tumble
                rotX = time * 0.4;
                rotY = time * 0.4;
            }

            const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
            const cosY = Math.cos(rotY), sinY = Math.sin(rotY);

            // Determine lerp speed based on transition
            // Fast at start of transition, then settle
            const morphSpeed = phaseTimer < TRANSITION_DURATION ? 0.03 : 0.005;

            // BATCH DRAWING
            // We draw lines between neighbors to create "solid" wireframe look
            // Using a simple distance check on projected 2D coords is expensive O(N^2)
            // Instead, we connect sequential particles since our generators order them spatially.
            
            ctx.lineWidth = 1.5;
            
            for(let i=0; i<PARTICLE_COUNT; i++) {
                const idx = i * 12;

                // 1. MORPH POSITION (LERP)
                data[idx] += (data[idx+3] - data[idx]) * morphSpeed;
                data[idx+1] += (data[idx+4] - data[idx+1]) * morphSpeed;
                data[idx+2] += (data[idx+5] - data[idx+2]) * morphSpeed;

                // 2. MORPH COLOR (LERP)
                data[idx+6] += (data[idx+9] - data[idx+6]) * 0.05;
                data[idx+7] += (data[idx+10] - data[idx+7]) * 0.05;
                data[idx+8] += (data[idx+11] - data[idx+8]) * 0.05;

                // 3. PROJECT
                let x = data[idx];
                let y = data[idx+1];
                let z = data[idx+2];

                // Rotation
                let tx = x * cosY - z * sinY;
                let tz = z * cosY + x * sinY;
                x = tx; z = tz;

                let ty = y * cosX - z * sinX;
                let tz2 = z * cosX + y * sinX;
                y = ty; z = tz2;

                const scale = CAM_Z / (CAM_Z + z);
                const px = cx + x * scale;
                const py = cy + y * scale;

                if (scale > 0) {
                    const r = Math.floor(data[idx+6]);
                    const g = Math.floor(data[idx+7]);
                    const b = Math.floor(data[idx+8]);
                    const color = `rgb(${r},${g},${b})`;

                    // Draw Point
                    ctx.fillStyle = color;
                    // Phase 2 (Tower) uses squares, others use circles
                    const size = scale * (phase === 1 ? 2.5 : 1.5);
                    
                    if (phase === 1) ctx.fillRect(px - size/2, py - size/2, size, size);
                    else {
                        ctx.beginPath();
                        ctx.arc(px, py, size, 0, Math.PI*2);
                        ctx.fill();
                    }

                    // Draw Wireframe Connectors (Sequential)
                    // Connect to next particle if it's close (part of same structure)
                    if (i < PARTICLE_COUNT - 1) {
                        // Look ahead to next particle
                        const nIdx = (i + 1) * 12;
                        // Use TARGET positions to determine connectivity logic (cleaner lines)
                        // If targets are close, we connect current positions.
                        const dx = data[idx+3] - data[nIdx+3];
                        const dy = data[idx+4] - data[nIdx+4];
                        const dz = data[idx+5] - data[nIdx+5];
                        const distSq = dx*dx + dy*dy + dz*dz;

                        // Threshold depends on shape
                        const threshold = phase === 1 ? 2500 : 900; // Tower needs longer vertical connections? No, generator logic.

                        if (distSq < threshold) {
                            // Project neighbor
                            let nx = data[nIdx]; let ny = data[nIdx+1]; let nz = data[nIdx+2];
                            
                            let ntx = nx * cosY - nz * sinY;
                            let ntz = nz * cosY + nx * sinY;
                            nx = ntx; nz = ntz;
                            
                            let nty = ny * cosX - nz * sinX;
                            let ntz2 = nz * cosX + ny * sinX;
                            ny = nty;

                            const nScale = CAM_Z / (CAM_Z + ntz2);
                            const nPx = cx + nx * nScale;
                            const nPy = cy + ny * nScale;

                            if (nScale > 0) {
                                ctx.strokeStyle = `rgba(${r},${g},${b},${0.15 * scale})`;
                                ctx.beginPath();
                                ctx.moveTo(px, py);
                                ctx.lineTo(nPx, nPy);
                                ctx.stroke();
                            }
                        }
                    }
                }
            }

            frameId = requestAnimationFrame(render);
        };

        const handleResize = () => {
            if (canvas.parentElement) {
                w = canvas.width = canvas.parentElement.clientWidth;
                h = canvas.height = canvas.parentElement.clientHeight;
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

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-80" />;
};
