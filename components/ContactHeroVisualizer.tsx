
import React, { useEffect, useRef } from 'react';

export const ContactHeroVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { innerWidth, innerHeight } = window;
            mouseRef.current = {
                x: (e.clientX - innerWidth / 2) / (innerWidth / 2),
                y: (e.clientY - innerHeight / 2) / (innerHeight / 2)
            };
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let w = canvas.width = canvas.parentElement?.clientWidth || 800;
        let h = canvas.height = canvas.parentElement?.clientHeight || 600;
        let frameId: number;
        let time = 0;

        // --- ENGINE CONFIG ---
        const PARTICLE_COUNT = 600;
        const CAM_Z = 1200;
        
        // --- DATA LAYOUT ---
        // Using Float32Array for performance (cache locality)
        // [currentX, currentY, currentZ, targetX, targetY, targetZ, velocityX, velocityY, velocityZ, size, colorIdx]
        const P_STRIDE = 11;
        const data = new Float32Array(PARTICLE_COUNT * P_STRIDE);
        
        // Color Palette: Teal (System), Amber (Active), White (Data), Red (Alert)
        const PALETTE = ['#69B7B2', '#f59e0b', '#ffffff', '#ef4444'];
        
        // Render Buffers for Depth Sorting
        const renderOrder = new Int32Array(PARTICLE_COUNT);
        const depthBuffer = new Float32Array(PARTICLE_COUNT);

        // --- INITIALIZATION ---
        for(let i=0; i<PARTICLE_COUNT; i++) {
            const idx = i * P_STRIDE;
            // Start at random positions
            data[idx] = (Math.random() - 0.5) * 1000;
            data[idx+1] = (Math.random() - 0.5) * 1000;
            data[idx+2] = (Math.random() - 0.5) * 1000;
            
            // Random attributes
            data[idx+9] = 1.5 + Math.random(); // Size
            data[idx+10] = Math.floor(Math.random() * 3); // Color (0-2)
            
            renderOrder[i] = i;
        }

        let phase = 0; // 0: Broadcast, 1: Handshake, 2: Link
        let phaseTimer = 0;
        const PHASE_DURATION = 500;

        // --- GEOMETRY GENERATORS ---

        const setTargetBroadcast = (i: number) => {
            const idx = i * P_STRIDE;
            // Expanding Sphere with Noise
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 350 + Math.random() * 200; // Wide scatter
            
            data[idx+3] = r * Math.sin(phi) * Math.cos(theta);
            data[idx+4] = r * Math.sin(phi) * Math.sin(theta);
            data[idx+5] = r * Math.cos(phi);
        };

        const setTargetHandshake = (i: number) => {
            const idx = i * P_STRIDE;
            // Three Interlocking Gyroscopic Rings
            const ringIdx = i % 3;
            const angle = (i / PARTICLE_COUNT) * Math.PI * 2 * 3; // Spread around rings
            const r = 250;
            
            let tx, ty, tz;
            
            if (ringIdx === 0) { // Flat Ring
                tx = Math.cos(angle) * r;
                ty = Math.sin(angle) * r;
                tz = Math.sin(angle * 6) * 20; // Ripple
            } else if (ringIdx === 1) { // Vertical Ring
                tx = Math.cos(angle) * r;
                ty = Math.sin(angle * 6) * 20;
                tz = Math.sin(angle) * r;
            } else { // Cross Ring
                tx = Math.sin(angle * 6) * 20;
                ty = Math.cos(angle) * r;
                tz = Math.sin(angle) * r;
            }
            
            data[idx+3] = tx;
            data[idx+4] = ty;
            data[idx+5] = tz;
        };

        const setTargetNetwork = (i: number) => {
            const idx = i * P_STRIDE;
            // Fibonacci Sphere (Perfect Uniform Distribution)
            const samples = PARTICLE_COUNT;
            const phi = Math.acos(1 - 2 * (i + 0.5) / samples);
            const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
            const r = 220;

            data[idx+3] = Math.cos(theta) * Math.sin(phi) * r;
            data[idx+4] = Math.sin(theta) * Math.sin(phi) * r;
            data[idx+5] = Math.cos(phi) * r;
        };

        const updateTargets = () => {
            for(let i=0; i<PARTICLE_COUNT; i++) {
                if (phase === 0) setTargetBroadcast(i);
                else if (phase === 1) setTargetHandshake(i);
                else setTargetNetwork(i);
            }
        };
        updateTargets(); // Initial state

        // --- RENDER LOOP ---
        const render = () => {
            time += 0.01;
            phaseTimer++;

            // Cycle Phases
            if (phaseTimer > PHASE_DURATION) {
                phaseTimer = 0;
                phase = (phase + 1) % 3;
                updateTargets();
            }

            // Responsive Center: Shift right on large screens to avoid text overlap
            const CX = w > 1024 ? w * 0.75 : w * 0.5;
            const CY = h * 0.5;

            // Input & Auto Rotation
            const targetRotX = mouseRef.current.y * 0.5;
            const targetRotY = mouseRef.current.x * 0.5;
            const autoRotY = time * 0.2;
            const rotX = targetRotX;
            const rotY = targetRotY + autoRotY;

            const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
            const cosY = Math.cos(rotY), sinY = Math.sin(rotY);

            // Physics Constants
            const SPRING = 0.03;
            const DAMPING = 0.92;

            // 1. UPDATE PHYSICS & TRANSFORM
            for(let i=0; i<PARTICLE_COUNT; i++) {
                const idx = i * P_STRIDE;

                // Spring Force Calculation
                const dx = data[idx+3] - data[idx];
                const dy = data[idx+4] - data[idx+1];
                const dz = data[idx+5] - data[idx+2];

                data[idx+6] += dx * SPRING; // vx
                data[idx+7] += dy * SPRING; // vy
                data[idx+8] += dz * SPRING; // vz

                data[idx+6] *= DAMPING;
                data[idx+7] *= DAMPING;
                data[idx+8] *= DAMPING;

                // Update Position
                data[idx] += data[idx+6];
                data[idx+1] += data[idx+7];
                data[idx+2] += data[idx+8];

                // Temporary Vars for Projection
                let x = data[idx];
                let y = data[idx+1];
                let z = data[idx+2];

                // Add "Signal Noise" during Broadcast phase
                if (phase === 0) {
                    x += Math.sin(time * 5 + i) * 8;
                    y += Math.cos(time * 3 + i) * 8;
                }

                // 3D Rotation Matrix
                let tx = x * cosY - z * sinY;
                let tz = z * cosY + x * sinY;
                x = tx; z = tz;

                let ty = y * cosX - z * sinX;
                let tz2 = z * cosX + y * sinX;
                y = ty; z = tz2;

                // Store Depth for Sorting
                depthBuffer[i] = z;
            }

            // 2. SORT (Painter's Algorithm)
            renderOrder.sort((a, b) => depthBuffer[b] - depthBuffer[a]);

            // Clear Canvas
            ctx.fillStyle = '#020202';
            ctx.fillRect(0, 0, w, h);

            // 3. DRAW
            ctx.lineWidth = 1;
            
            for(let i=0; i<PARTICLE_COUNT; i++) {
                const pIdx = renderOrder[i]; // Index of particle to draw
                const idx = pIdx * P_STRIDE;
                const z = depthBuffer[pIdx]; // Rotated Z
                
                const scale = CAM_Z / (CAM_Z + z);
                
                // Culling
                if (z > -CAM_Z + 50 && scale > 0) {
                    // Re-rotate to get Screen X/Y (faster than storing in 2nd buffer)
                    let x = data[idx]; let y = data[idx+1]; let zRaw = data[idx+2];
                    if (phase === 0) { x += Math.sin(time*5+pIdx)*8; y += Math.cos(time*3+pIdx)*8; }
                    
                    let tx = x * cosY - zRaw * sinY;
                    let tz = zRaw * cosY + x * sinY;
                    x = tx; zRaw = tz;
                    let ty = y * cosX - zRaw * sinX;
                    y = ty;

                    const px = CX + x * scale;
                    const py = CY + y * scale;
                    const size = data[idx+9] * scale;
                    const colorIdx = data[idx+10];
                    const alpha = Math.min(1, scale * 0.8);

                    // NETWORK CONNECTIONS (Link Phase)
                    // Connect to nearby particles in the sorted Z-list (Pseudo-spatial)
                    if ((phase === 2 || phase === 1) && i % 4 === 0 && i < PARTICLE_COUNT - 1) {
                        const nextPIdx = renderOrder[i+1];
                        // We approximate neighbor pos based on Z-proximity for efficiency
                        // This creates a cool "depth-slice" connection effect
                        const nIdx = nextPIdx * P_STRIDE;
                        let nx = data[nIdx]; let ny = data[nIdx+1]; let nz = data[nIdx+2];
                        
                        let ntx = nx * cosY - nz * sinY;
                        let ntz = nz * cosY + nx * sinY;
                        nx = ntx; nz = ntz;
                        let nty = ny * cosX - nz * sinX;
                        ny = nty;
                        
                        const nScale = CAM_Z / (CAM_Z + nz);
                        const nPx = CX + nx * nScale;
                        const nPy = CY + ny * nScale;

                        const dist = Math.abs(px - nPx) + Math.abs(py - nPy);
                        if (dist < 100 * scale) {
                            ctx.strokeStyle = `rgba(105, 183, 178, ${0.2 * alpha})`;
                            ctx.beginPath();
                            ctx.moveTo(px, py);
                            ctx.lineTo(nPx, nPy);
                            ctx.stroke();
                        }
                    }

                    // Draw Particle
                    ctx.fillStyle = PALETTE[colorIdx];
                    ctx.globalAlpha = alpha;
                    ctx.beginPath();
                    ctx.arc(px, py, size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            ctx.globalAlpha = 1;

            // Progress Bar (Simplified - No Text)
            const progress = phaseTimer / PHASE_DURATION;
            ctx.fillStyle = 'rgba(255,255,255,0.1)';
            ctx.fillRect(CX - 50, h - 50, 100, 2);
            ctx.fillStyle = '#69B7B2';
            ctx.fillRect(CX - 50, h - 50, 100 * progress, 2);

            frameId = requestAnimationFrame(render);
        };

        const handleResize = () => {
            if (canvas.parentElement) {
                w = canvas.width = canvas.parentElement.clientWidth;
                h = canvas.height = canvas.parentElement.clientHeight;
            }
        };
        window.addEventListener('resize', handleResize);
        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(frameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="block w-full h-full opacity-70 mix-blend-screen" />;
};
