
import React, { useEffect, useRef } from 'react';

export const LogisticsHeroVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let frameId: number;
        let frame = 0;

        // --- CONFIG ---
        const PARTICLE_COUNT = 800; // Increased count for better density
        const PHASE_DURATION = 900;
        
        // --- STATE MANAGED VIA TYPED ARRAYS (Zero GC) ---
        // Layout: [x, y, z, vx, vy, vz, type, size, active]
        const P_STRIDE = 9;
        const particles = new Float32Array(PARTICLE_COUNT * P_STRIDE);
        
        // 0: Standard, 1: Priority, 2: Hazardous
        const TYPE_STD = 0, TYPE_PRI = 1, TYPE_HAZ = 2;

        const initParticles = (w: number, h: number) => {
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const idx = i * P_STRIDE;
                resetParticle(idx, w, h);
            }
        };

        const resetParticle = (idx: number, w: number, h: number) => {
            particles[idx] = Math.random() * w;     // x
            particles[idx+1] = Math.random() * h;   // y
            particles[idx+2] = (Math.random() - 0.5) * 500; // z
            
            // Velocity
            particles[idx+3] = -(2 + Math.random() * 3); // vx
            particles[idx+4] = 0; // vy
            particles[idx+5] = 0; // vz

            // Type & Meta
            const rand = Math.random();
            particles[idx+6] = rand > 0.9 ? TYPE_HAZ : rand > 0.75 ? TYPE_PRI : TYPE_STD;
            particles[idx+7] = 20 + Math.random() * 30; // size (width)
            particles[idx+8] = 1; // active
        };

        const render = () => {
            frame++;
            const cycle = frame % (PHASE_DURATION * 3);
            let activePhase = 0; // 0: Induction, 1: Globe, 2: Sort
            
            if (cycle < PHASE_DURATION) activePhase = 0;
            else if (cycle < PHASE_DURATION * 2) activePhase = 1;
            else activePhase = 2;

            // Clear with trail effect for smoother visuals
            ctx.fillStyle = 'rgba(2, 2, 2, 0.3)';
            ctx.fillRect(0, 0, width, height);

            const cx = width * 0.75;
            const cy = height * 0.5;
            const time = frame * 0.005;

            // --- BATCHING ARRAYS ---
            // We use standard arrays for batching coordinates to pass to path drawing
            // Clearing length is faster than reallocating
            const batchBlue: number[] = [];
            const batchAmber: number[] = [];
            const batchRed: number[] = [];
            const batchGreen: number[] = []; // For sortation

            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const idx = i * P_STRIDE;
                
                // --- PHASE 0: LINEAR INDUCTION ---
                if (activePhase === 0) {
                    particles[idx] += particles[idx+3]; // x += vx
                    
                    // Reset if off screen
                    if (particles[idx] < -50) {
                        particles[idx] = width + 50;
                        particles[idx+1] = Math.random() * height;
                    }

                    // Push to batch
                    const type = particles[idx+6];
                    const x = particles[idx];
                    const y = particles[idx+1];
                    const size = particles[idx+7];

                    // Simple 3D box effect
                    if (type === TYPE_HAZ) {
                        batchRed.push(x, y, size);
                    } else if (type === TYPE_PRI) {
                        batchAmber.push(x, y, size);
                    } else {
                        batchBlue.push(x, y, size);
                    }
                } 
                
                // --- PHASE 1: GLOBE NETWORK ---
                else if (activePhase === 1) {
                    // Parametric Globe Math
                    // We reuse the index to map to a fibonacci sphere
                    const phi = Math.acos(1 - 2 * (i / PARTICLE_COUNT));
                    const theta = Math.sqrt(PARTICLE_COUNT * Math.PI) * phi;
                    
                    const r = 250;
                    let x = r * Math.cos(theta) * Math.sin(phi);
                    let y = r * Math.sin(theta) * Math.sin(phi);
                    let z = r * Math.cos(phi);

                    // Rotation
                    let tx = x * Math.cos(time) - z * Math.sin(time);
                    let tz = z * Math.cos(time) + x * Math.sin(time);
                    x = tx; z = tz;

                    const scale = 500 / (500 + z);
                    
                    if (z > -200) { // Culling
                        const px = cx + x * scale;
                        const py = cy + y * scale;
                        const pSize = (particles[idx+6] === TYPE_PRI ? 3 : 1.5) * scale;

                        if (particles[idx+6] === TYPE_PRI) batchAmber.push(px, py, pSize);
                        else batchBlue.push(px, py, pSize);
                    }
                }

                // --- PHASE 2: RADIAL SORTATION ---
                else {
                    // Reuse x/y storage for polar coords: x=radius, y=angle
                    // Re-initialize for this phase if needed (simplified logic here uses stateless projection)
                    
                    // Calculate dynamic spiral
                    const speed = particles[idx+3] * -1; // reuse velocity magnitude
                    const r = (frame * speed + i * 5) % (Math.min(width, height) * 0.6);
                    const angle = i * 0.1 + frame * 0.02;

                    const px = cx + Math.cos(angle) * r;
                    const py = cy + Math.sin(angle) * r;

                    const type = particles[idx+6];
                    if (type === TYPE_STD) batchGreen.push(px, py, 2);
                    else batchAmber.push(px, py, 2);
                }
            }

            // --- RENDER BATCHES ---
            
            // Helper for rectangles (Phase 0) or Circles (Phase 1/2)
            const drawBatch = (list: number[], color: string, isRect: boolean) => {
                if (list.length === 0) return;
                ctx.fillStyle = color;
                ctx.beginPath();
                for (let k = 0; k < list.length; k+=3) {
                    if (isRect) {
                        // Draw box + 3D side
                        ctx.rect(list[k], list[k+1], list[k+2], 10);
                    } else {
                        ctx.moveTo(list[k], list[k+1]);
                        ctx.arc(list[k], list[k+1], list[k+2], 0, Math.PI * 2);
                    }
                }
                ctx.fill();
                
                // Add detail for rects
                if (isRect) {
                    ctx.fillStyle = 'rgba(255,255,255,0.1)';
                    ctx.beginPath();
                    for (let k = 0; k < list.length; k+=3) {
                        const x = list[k], y = list[k+1], w = list[k+2];
                        ctx.moveTo(x, y);
                        ctx.lineTo(x+5, y-5);
                        ctx.lineTo(x+w+5, y-5);
                        ctx.lineTo(x+w, y);
                    }
                    ctx.fill();
                }
            };

            const isRect = activePhase === 0;
            drawBatch(batchBlue, '#06b6d4', isRect);
            drawBatch(batchAmber, '#f59e0b', isRect);
            drawBatch(batchRed, '#ef4444', isRect);
            drawBatch(batchGreen, '#10b981', isRect);

            frameId = requestAnimationFrame(render);
        };

        const handleResize = () => {
            if (canvas.parentElement) {
                const rect = canvas.parentElement.getBoundingClientRect();
                // DPR Handling for sharp text/lines on Retina
                const dpr = window.devicePixelRatio || 1;
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;
                
                // Scale context to match
                ctx.scale(dpr, dpr);
                
                // Logical Size
                width = rect.width;
                height = rect.height;
                
                initParticles(width, height);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Init
        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(frameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ width: '100%', height: '100%' }} />;
};
