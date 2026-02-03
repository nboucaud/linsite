
import React, { useEffect, useRef } from 'react';

export const SmallBusinessHeroVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let w = canvas.width = canvas.parentElement?.clientWidth || 800;
        let h = canvas.height = canvas.parentElement?.clientHeight || 600;
        let frameId: number;
        let time = 0;

        // 3D PARTICLE ENGINE
        const PARTICLE_COUNT = 800;
        const CAM_Z = 800;
        let CX = w * 0.5;
        let CY = h * 0.5;

        // Particle State
        const particles = new Float32Array(PARTICLE_COUNT * 9); 
        const colors = ['#8b5cf6', '#a78bfa', '#22d3ee', '#c4b5fd'];
        const particleColors = new Uint8Array(PARTICLE_COUNT);

        const renderOrder = new Int32Array(PARTICLE_COUNT);
        const depthBuffer = new Float32Array(PARTICLE_COUNT);

        let phase = 0; // 0: CLOUD, 1: SPHERE, 2: CUBE
        let phaseTimer = 0;
        const PHASE_DURATION = 400; 

        // Generators
        const setCloudTarget = (i: number) => {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI * 2;
            const rMain = 250 + Math.random() * 50;
            const rTube = 80 + Math.random() * 40;
            
            const idx = i * 9;
            particles[idx + 3] = (rMain + rTube * Math.cos(phi)) * Math.cos(theta); // tx
            particles[idx + 4] = (rMain + rTube * Math.cos(phi)) * Math.sin(theta); // ty
            particles[idx + 5] = rTube * Math.sin(phi); // tz
        };

        const setSphereTarget = (i: number, total: number, radius: number) => {
            const phi = Math.acos(-1 + (2 * i) / total);
            const theta = Math.sqrt(total * Math.PI) * phi;
            
            const idx = i * 9;
            particles[idx + 3] = radius * Math.cos(theta) * Math.sin(phi);
            particles[idx + 4] = radius * Math.sin(theta) * Math.sin(phi);
            particles[idx + 5] = radius * Math.cos(phi);
        };

        const setCubeTarget = (i: number, total: number) => {
            const dim = Math.floor(Math.cbrt(total));
            const remainder = i % (dim*dim*dim);
            const x = (remainder % dim);
            const y = Math.floor((remainder / dim) % dim);
            const z = Math.floor(remainder / (dim * dim));
            const spacing = 40;
            const offset = (dim * spacing) / 2;
            
            const idx = i * 9;
            particles[idx + 3] = x * spacing - offset;
            particles[idx + 4] = y * spacing - offset;
            particles[idx + 5] = z * spacing - offset;
        };

        // Initialize
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const idx = i * 9;
            setCloudTarget(i); 
            particles[idx] = particles[idx+3];
            particles[idx+1] = particles[idx+4];
            particles[idx+2] = particles[idx+5];
            
            particleColors[i] = Math.floor(Math.random() * colors.length);
            particles[idx+7] = Math.random() > 0.9 ? 2.5 : 1.2; // Size
            particles[idx+8] = Math.random() * Math.PI * 2; // Offset
            
            renderOrder[i] = i;
        }

        const setTargetShape = (shape: number) => {
            for(let i=0; i<PARTICLE_COUNT; i++) {
                if (shape === 0) setCloudTarget(i);
                else if (shape === 1) setSphereTarget(i, PARTICLE_COUNT, 220);
                else if (shape === 2) setCubeTarget(i, PARTICLE_COUNT);
            }
        };

        const render = () => {
            time += 0.007; // SLOWED from 0.008
            phaseTimer++;

            if (phaseTimer > PHASE_DURATION) {
                phaseTimer = 0;
                phase = (phase + 1) % 3;
                setTargetShape(phase);
            }

            ctx.fillStyle = '#020202';
            ctx.fillRect(0, 0, w, h);

            const rotX = time * 0.3 + (mouseRef.current.y * 0.1);
            const rotY = time * 0.4 + (mouseRef.current.x * 0.1);
            const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
            const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

            // 1. UPDATE & PROJECT
            for(let i=0; i<PARTICLE_COUNT; i++) {
                const idx = i * 9;
                
                // Lerp current to target
                particles[idx] += (particles[idx+3] - particles[idx]) * 0.04;
                particles[idx+1] += (particles[idx+4] - particles[idx+1]) * 0.04;
                particles[idx+2] += (particles[idx+5] - particles[idx+2]) * 0.04;

                let x = particles[idx];
                let y = particles[idx+1];
                let z = particles[idx+2];

                // Add noise for Cloud phase
                if (phase === 0) {
                    const offset = particles[idx+8];
                    x += Math.sin(time * 2 + offset) * 2;
                    y += Math.cos(time * 3 + offset) * 2;
                }

                // Rotate
                let tx = x * cosY - z * sinY;
                let tz = z * cosY + x * sinY;
                x = tx; z = tz;

                let ty = y * cosX - z * sinX;
                let tz2 = z * cosX + y * sinX;
                y = ty; z = tz2;

                // Store projected Z for sorting
                depthBuffer[i] = z;
            }

            // 2. SORT
            renderOrder.sort((a, b) => depthBuffer[b] - depthBuffer[a]);

            // 3. DRAW
            for(let i=0; i<PARTICLE_COUNT; i++) {
                const pIdx = renderOrder[i];
                const z = depthBuffer[pIdx];
                const scale = CAM_Z / (CAM_Z + z);

                if (scale > 0) {
                    const idx = pIdx * 9;
                    let x = particles[idx];
                    let y = particles[idx+1];
                    let zRaw = particles[idx+2];
                    
                    if (phase === 0) {
                        const offset = particles[idx+8];
                        x += Math.sin(time * 2 + offset) * 2;
                        y += Math.cos(time * 3 + offset) * 2;
                    }

                    let tx = x * cosY - zRaw * sinY;
                    let tz = zRaw * cosY + x * sinY;
                    x = tx; zRaw = tz;

                    let ty = y * cosX - zRaw * sinX;
                    y = ty;

                    const px = CX + x * scale;
                    const py = CY + y * scale;
                    const size = particles[idx+7] * scale;
                    
                    ctx.fillStyle = colors[particleColors[pIdx]];
                    ctx.globalAlpha = Math.min(1, scale * 0.7);
                    
                    ctx.fillRect(px - size/2, py - size/2, size, size);
                }
            }
            ctx.globalAlpha = 1;

            frameId = requestAnimationFrame(render);
        };

        const handleResize = () => {
            if (canvas.parentElement) {
                w = canvas.width = canvas.parentElement.clientWidth;
                h = canvas.height = canvas.parentElement.clientHeight;
                CX = w * 0.5;
                CY = h * 0.5;
            }
        };
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: ((e.clientX - rect.left) / w) * 2 - 1,
                y: ((e.clientY - rect.top) / h) * 2 - 1
            };
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(frameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="w-full h-full block" />;
};
