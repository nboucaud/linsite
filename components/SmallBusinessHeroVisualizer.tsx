
import React, { useEffect, useRef } from 'react';

export const SmallBusinessHeroVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let w = canvas.width = canvas.parentElement?.clientWidth || 800;
        let h = canvas.height = canvas.parentElement?.clientHeight || 600;
        let frameId: number;
        let time = 0;

        // --- 3D PARTICLE ENGINE ---
        const PARTICLE_COUNT = 800; // High count for granularity
        const CAM_Z = 800;
        const CX = w * 0.5;
        const CY = h * 0.5;

        // Particle State
        interface Point3D { x: number; y: number; z: number }
        interface Particle {
            current: Point3D;
            target: Point3D;
            color: string;
            size: number;
        }

        const particles: Particle[] = [];

        // PHASE CONTROL
        let phase = 0; // 0: CLOUD, 1: SPHERE, 2: CUBE
        let phaseTimer = 0;
        const PHASE_DURATION = 400; 

        // --- GENERATORS ---
        
        const getCloudPoint = (): Point3D => {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI * 2;
            const rMain = 250 + Math.random() * 50;
            const rTube = 80 + Math.random() * 40;
            
            return {
                x: (rMain + rTube * Math.cos(phi)) * Math.cos(theta),
                y: (rMain + rTube * Math.cos(phi)) * Math.sin(theta),
                z: rTube * Math.sin(phi)
            };
        };

        const getSpherePoint = (i: number, total: number, radius: number): Point3D => {
            const phi = Math.acos(-1 + (2 * i) / total);
            const theta = Math.sqrt(total * Math.PI) * phi;
            return {
                x: radius * Math.cos(theta) * Math.sin(phi),
                y: radius * Math.sin(theta) * Math.sin(phi),
                z: radius * Math.cos(phi)
            };
        };

        const getCubePoint = (i: number, total: number): Point3D => {
            const dim = Math.floor(Math.cbrt(total));
            const idx = i % (dim*dim*dim); 
            
            const x = (idx % dim);
            const y = Math.floor((idx / dim) % dim);
            const z = Math.floor(idx / (dim * dim));
            
            const spacing = 40;
            const offset = (dim * spacing) / 2;
            
            return {
                x: x * spacing - offset,
                y: y * spacing - offset,
                z: z * spacing - offset
            };
        };

        // --- INIT ---
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const colors = ['#8b5cf6', '#a78bfa', '#22d3ee', '#c4b5fd'];
            particles.push({
                current: getCloudPoint(),
                target: getCloudPoint(),
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() > 0.9 ? 2.5 : 1.2
            });
        }

        const setTargetShape = (shape: number) => {
            particles.forEach((p, i) => {
                if (shape === 0) p.target = getCloudPoint();
                else if (shape === 1) p.target = getSpherePoint(i, PARTICLE_COUNT, 220);
                else if (shape === 2) p.target = getCubePoint(i, PARTICLE_COUNT);
            });
        };

        const render = () => {
            time += 0.008;
            phaseTimer++;

            // Phase Switching
            if (phaseTimer > PHASE_DURATION) {
                phaseTimer = 0;
                phase = (phase + 1) % 3;
                setTargetShape(phase);
            }

            // Clear
            ctx.fillStyle = '#020202';
            ctx.fillRect(0, 0, w, h);

            // Rotations
            const rotX = time * 0.3 + (mouseRef.current.y * 0.1);
            const rotY = time * 0.4 + (mouseRef.current.x * 0.1);

            // Render Particles
            const sorted = [];
            
            for(let i=0; i<particles.length; i++) {
                const p = particles[i];
                
                const dx = p.target.x - p.current.x;
                const dy = p.target.y - p.current.y;
                const dz = p.target.z - p.current.z;
                
                p.current.x += dx * 0.04;
                p.current.y += dy * 0.04;
                p.current.z += dz * 0.04;

                // Add entropy ONLY in Cloud phase
                if (phase === 0) {
                    p.current.x += Math.sin(time * 2 + i) * 0.5;
                    p.current.y += Math.cos(time * 3 + i) * 0.5;
                }

                // Rotation
                let x = p.current.x;
                let y = p.current.y;
                let z = p.current.z;

                // Rotate Y
                let tx = x * Math.cos(rotY) - z * Math.sin(rotY);
                let tz = z * Math.cos(rotY) + x * Math.sin(rotY);
                x = tx; z = tz;

                // Rotate X
                let ty = y * Math.cos(rotX) - z * Math.sin(rotX);
                let tz2 = z * Math.cos(rotX) + y * Math.sin(rotX);
                y = ty; z = tz2;

                // Project
                const scale = CAM_Z / (CAM_Z + z);
                
                if (scale > 0) {
                    sorted.push({
                        x: CX + x * scale,
                        y: CY + y * scale,
                        z: z,
                        scale: scale,
                        color: p.color,
                        size: p.size
                    });
                }
            }

            // Sort by Z for proper occlusion/depth
            sorted.sort((a, b) => b.z - a.z);

            // Draw
            for(let i=0; i<sorted.length; i++) {
                const s = sorted[i];
                
                // Depth Fog
                const alpha = Math.min(1, (s.scale * 0.7)); // Fade distant points
                
                ctx.globalAlpha = alpha;
                ctx.fillStyle = s.color;
                
                if (phase === 2) {
                    // Cube Phase: Draw sharp squares (Pixels)
                    const size = Math.max(1, s.size * s.scale);
                    ctx.fillRect(s.x - size/2, s.y - size/2, size, size);
                } else {
                    // Sphere/Cloud Phase: Draw soft circles
                    ctx.beginPath();
                    ctx.arc(s.x, s.y, s.size * s.scale, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            ctx.globalAlpha = 1;

            // Connecting Lines (Only for structured phases)
            if (phase !== 0) {
                ctx.strokeStyle = phase === 2 ? 'rgba(34, 211, 238, 0.15)' : 'rgba(139, 92, 246, 0.1)';
                ctx.lineWidth = 0.5;
                
                for(let i=0; i<sorted.length; i+=2) {
                    const p1 = sorted[i];
                    for(let j=1; j<4; j++) {
                        if (i+j >= sorted.length) break;
                        const p2 = sorted[i+j];
                        
                        const dist = Math.sqrt((p1.x-p2.x)**2 + (p1.y-p2.y)**2);
                        if (dist < 30 * p1.scale) {
                            ctx.beginPath();
                            ctx.moveTo(p1.x, p1.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.stroke();
                        }
                    }
                }
            }

            frameId = requestAnimationFrame(render);
        };
        render();

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: ((e.clientX - rect.left) / w) * 2 - 1,
                y: ((e.clientY - rect.top) / h) * 2 - 1
            };
        };

        const handleResize = () => {
            if (canvas.parentElement) {
                w = canvas.parentElement.clientWidth;
                h = canvas.parentElement.clientHeight;
                canvas.width = w; canvas.height = h;
            }
        };
        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(frameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="w-full h-full block opacity-80" />;
};
