
import React, { useEffect, useRef } from 'react';

export const SmallBusinessHeroVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let frameId: number;
        let time = 0;

        const PARTICLE_COUNT = 900; 
        const CAM_Z = 1000;
        const P_STRIDE = 8;
        const particles = new Float32Array(PARTICLE_COUNT * P_STRIDE);
        
        // Colors: Violet, Blue, Cyan, White
        const PALETTE = ['#8b5cf6', '#3b82f6', '#22d3ee', '#ffffff'];

        // Init
        for(let i=0; i<PARTICLE_COUNT; i++) {
            const idx = i * P_STRIDE;
            particles[idx] = (Math.random()-0.5) * 500;
            particles[idx+1] = (Math.random()-0.5) * 500;
            particles[idx+2] = (Math.random()-0.5) * 500;
            particles[idx+6] = Math.floor(Math.random() * 4); // Color Index
            particles[idx+7] = 0.5 + Math.random(); // Size
        }

        let phase = 0; 
        let phaseTimer = 0;
        const PHASE_DURATION = 450; 
        const TRANSITION_SPEED = 0.04;

        // Generators
        const setCloudTargets = () => {
            for(let i=0; i<PARTICLE_COUNT; i++) {
                const idx = i * P_STRIDE;
                const r = 250 + Math.random() * 100;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos((Math.random() * 2) - 1);
                
                particles[idx+3] = r * Math.sin(phi) * Math.cos(theta);
                particles[idx+4] = r * Math.sin(phi) * Math.sin(theta);
                particles[idx+5] = r * Math.cos(phi);
            }
        };

        const setCubeTargets = () => {
            const dim = Math.ceil(Math.cbrt(PARTICLE_COUNT));
            const spacing = 40;
            const offset = (dim * spacing) / 2;
            for(let i=0; i<PARTICLE_COUNT; i++) {
                const idx = i * P_STRIDE;
                const x = i % dim;
                const y = Math.floor(i / dim) % dim;
                const z = Math.floor(i / (dim * dim));
                particles[idx+3] = x * spacing - offset;
                particles[idx+4] = y * spacing - offset;
                particles[idx+5] = z * spacing - offset;
            }
        };

        const setChaosTargets = () => {
             for(let i=0; i<PARTICLE_COUNT; i++) {
                const idx = i * P_STRIDE;
                particles[idx+3] = (Math.random() - 0.5) * 800;
                particles[idx+4] = (Math.random() - 0.5) * 600;
                particles[idx+5] = (Math.random() - 0.5) * 600;
             }
        };

        const updateTargets = () => {
             if (phase === 0) setCloudTargets();
             else if (phase === 1) setCubeTargets();
             else setChaosTargets();
        }
        setCloudTargets();

        // Render Loop
        const render = () => {
            time += 0.01;
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

            // Camera
            const rotY = time * 0.3 + (mouseRef.current.x * 0.2);
            const rotX = Math.sin(time * 0.2) * 0.2 + (mouseRef.current.y * 0.2);
            const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
            const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

            // Batches for drawing (Avoids 900 separate draw calls)
            const batches: number[][] = [[], [], [], []]; 

            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const idx = i * P_STRIDE;
                
                // LERP
                particles[idx] += (particles[idx+3] - particles[idx]) * TRANSITION_SPEED;
                particles[idx+1] += (particles[idx+4] - particles[idx+1]) * TRANSITION_SPEED;
                particles[idx+2] += (particles[idx+5] - particles[idx+2]) * TRANSITION_SPEED;

                let x = particles[idx];
                let y = particles[idx+1];
                let z = particles[idx+2];

                // Noise in Chaos phase
                if (phase === 2) {
                    x += Math.sin(time * 3 + i) * 2;
                    y += Math.cos(time * 2 + i) * 2;
                }

                // Rotate
                let x1 = x * cosY - z * sinY;
                let z1 = z * cosY + x * sinY;
                let y1 = y * cosX - z1 * sinX;
                let z2 = z1 * cosX + y * sinX;

                const scale = CAM_Z / (CAM_Z + z2);
                
                if (scale > 0) {
                    const px = cx + x1 * scale;
                    const py = cy + y1 * scale;
                    const size = particles[idx+7] * scale * (phase === 1 ? 2.5 : 2); 
                    const colorIdx = particles[idx+6];
                    
                    // Push to appropriate color batch
                    batches[colorIdx].push(px, py, size);
                }
            }

            // Draw Batches
            for (let c = 0; c < 4; c++) {
                const batch = batches[c];
                if (batch.length === 0) continue;
                
                ctx.fillStyle = PALETTE[c];
                ctx.beginPath();
                for (let k = 0; k < batch.length; k += 3) {
                    // Use Rect for speed, resembles digital data
                    ctx.rect(batch[k] - batch[k+2]/2, batch[k+1] - batch[k+2]/2, batch[k+2], batch[k+2]);
                }
                ctx.fill();
            }

            frameId = requestAnimationFrame(render);
        };

        const handleResize = () => {
            if (canvas.parentElement) {
                const rect = canvas.parentElement.getBoundingClientRect();
                const dpr = window.devicePixelRatio || 1;
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;
                ctx.scale(dpr, dpr);
                width = rect.width;
                height = rect.height;
                updateTargets();
            }
        };
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: ((e.clientX - rect.left) / width) * 2 - 1,
                y: ((e.clientY - rect.top) / height) * 2 - 1
            };
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        handleResize();
        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(frameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ width: '100%', height: '100%' }} />;
};
