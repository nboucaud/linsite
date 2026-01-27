
import React, { useEffect, useRef } from 'react';

export const ComplianceVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = canvas.parentElement?.clientWidth || 800;
        let height = canvas.height = canvas.parentElement?.clientHeight || 600;
        
        let frameId: number;
        let time = 0;

        // --- CONFIG ---
        const PARTICLE_COUNT = 300;
        const PERSPECTIVE = 600;
        
        // --- PHASES ---
        // 0: UNSECURED (Chaos) -> 1: ANALYZING (Vortex) -> 2: SECURED (Lattice)
        let currentPhase = 0;
        let phaseTimer = 0;

        interface Point3D { x: number, y: number, z: number }
        
        class Particle {
            x: number; y: number; z: number;
            vx: number; vy: number; vz: number;
            target: Point3D | null;
            color: string;
            size: number;
            
            constructor() {
                this.x = (Math.random() - 0.5) * width * 2;
                this.y = (Math.random() - 0.5) * height * 2;
                this.z = (Math.random() - 0.5) * 1000;
                // Slower initial velocity
                this.vx = (Math.random() - 0.5) * 2.5;
                this.vy = (Math.random() - 0.5) * 2.5;
                this.vz = (Math.random() - 0.5) * 2.5;
                this.target = null;
                this.color = '#94a3b8'; // Default slate
                this.size = 2;
            }

            update(t: number) {
                // PHASE 0: UNSECURED - Chaotic Brownian Motion (Slower)
                if (currentPhase === 0) {
                    this.x += this.vx;
                    this.y += this.vy;
                    this.z += this.vz;
                    
                    // Bounce off virtual walls
                    if (Math.abs(this.x) > width) this.vx *= -1;
                    if (Math.abs(this.y) > height) this.vy *= -1;
                    if (Math.abs(this.z) > 1000) this.vz *= -1;

                    // UPDATED: No longer pure white. Uses desaturated blue/slate.
                    this.color = Math.random() > 0.9 ? '#69B7B2' : '#cbd5e1'; 
                    this.size = Math.random() * 2 + 1;
                }
                
                // PHASE 1: ANALYZING - Suction Vortex
                else if (currentPhase === 1) {
                    // Spiral towards center
                    const angle = Math.atan2(this.y, this.x) + 0.05; // Slower rotation
                    const dist = Math.sqrt(this.x*this.x + this.y*this.y);
                    const targetDist = Math.max(50, dist * 0.98); // Gentler suction
                    
                    this.x = Math.cos(angle) * targetDist;
                    this.y = Math.sin(angle) * targetDist;
                    this.z = this.z * 0.98; 

                    this.color = '#22d3ee'; // Cyan
                    this.size = 2;
                }

                // PHASE 2: SECURED - Crystal Lattice Lock
                else if (currentPhase === 2 && this.target) {
                    // Lerp to target geometry (Slower easing)
                    this.x += (this.target.x - this.x) * 0.05;
                    this.y += (this.target.y - this.y) * 0.05;
                    this.z += (this.target.z - this.z) * 0.05;
                    
                    this.color = '#69B7B2'; // Brand Teal
                    this.size = 1.5;
                }
            }

            draw(ctx: CanvasRenderingContext2D, cx: number, cy: number, rotX: number, rotY: number) {
                // 3D Rotation
                let x = this.x, y = this.y, z = this.z;
                
                // Rotate Y
                let x1 = x * Math.cos(rotY) - z * Math.sin(rotY);
                let z1 = z * Math.cos(rotY) + x * Math.sin(rotY);
                x = x1; z = z1;

                // Rotate X
                let y1 = y * Math.cos(rotX) - z * Math.sin(rotX);
                let z2 = z * Math.cos(rotX) + y * Math.sin(rotX);
                y = y1; z = z2;

                // Project
                const scale = PERSPECTIVE / (PERSPECTIVE + z);
                if (scale <= 0) return; // Behind camera

                const px = cx + x * scale;
                const py = cy + y * scale;
                const pSize = this.size * scale;

                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(px, py, pSize, 0, Math.PI*2);
                ctx.fill();
            }
        }

        const particles: Particle[] = Array.from({length: PARTICLE_COUNT}, () => new Particle());

        // --- GEOMETRY GENERATION (The Shield/Lock) ---
        const generateSpherePoints = (count: number, radius: number): Point3D[] => {
            const points: Point3D[] = [];
            const phi = Math.PI * (3 - Math.sqrt(5)); 
            for (let i = 0; i < count; i++) {
                const y = 1 - (i / (count - 1)) * 2; 
                const radiusAtY = Math.sqrt(1 - y * y);
                const theta = phi * i; 
                const x = Math.cos(theta) * radiusAtY;
                const z = Math.sin(theta) * radiusAtY;
                points.push({ x: x * radius, y: y * radius, z: z * radius });
            }
            return points;
        };
        
        const sphereTargets = generateSpherePoints(PARTICLE_COUNT, 200);

        // Assign targets once
        particles.forEach((p, i) => {
            if (sphereTargets[i]) p.target = sphereTargets[i];
        });

        // --- RENDER LOOP ---
        const render = () => {
            // SLOW DOWN: 50% Speed
            time += 0.005; 
            phaseTimer += 1; // Timer still ticks frames

            // Phase Switching Logic
            if (currentPhase === 0 && phaseTimer > 400) { // Chaos
                currentPhase = 1; 
                phaseTimer = 0;
            } else if (currentPhase === 1 && phaseTimer > 300) { // Vortex
                currentPhase = 2; 
                phaseTimer = 0;
            } else if (currentPhase === 2 && phaseTimer > 600) { // Locked
                // EXPLODE reset
                currentPhase = 0;
                phaseTimer = 0;
                particles.forEach(p => {
                    p.vx = (Math.random() - 0.5) * 10; // Slower explosion
                    p.vy = (Math.random() - 0.5) * 10;
                    p.vz = (Math.random() - 0.5) * 10;
                });
            }

            // Canvas Clear
            ctx.fillStyle = 'rgba(2, 2, 2, 0.2)'; // Heavy trails
            ctx.fillRect(0, 0, width, height);

            const cx = width / 2;
            const cy = height / 2;
            const rotX = time * 0.2;
            const rotY = time * 0.3;

            // Draw Connection Lines (Only in Phase 2)
            if (currentPhase === 2) {
                const pulse = Math.sin(time * 5) * 0.5 + 0.5; // 0 to 1
                ctx.strokeStyle = `rgba(105, 183, 178, ${0.1 + pulse * 0.2})`; // Brand teal pulse
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                
                // Connect particles to neighbors
                for (let i = 0; i < particles.length; i++) {
                    const p1 = particles[i];
                    // Check next few particles
                    for(let j=1; j<=3; j++) {
                        const p2 = particles[(i+j) % particles.length];
                        if (p1.target && p2.target) {
                            let x1 = p1.x, y1 = p1.y, z1 = p1.z;
                            let x1_r = x1*Math.cos(rotY)-z1*Math.sin(rotY); let z1_r = z1*Math.cos(rotY)+x1*Math.sin(rotY);
                            let y1_r = y1*Math.cos(rotX)-z1_r*Math.sin(rotX); let z1_rr = z1_r*Math.cos(rotX)+y1*Math.sin(rotX);
                            const s1 = PERSPECTIVE/(PERSPECTIVE+z1_rr);

                            let x2 = p2.x, y2 = p2.y, z2 = p2.z;
                            let x2_r = x2*Math.cos(rotY)-z2*Math.sin(rotY); let z2_r = z2*Math.cos(rotY)+x2*Math.sin(rotY);
                            let y2_r = y2*Math.cos(rotX)-z2_r*Math.sin(rotX); let z2_rr = z2_r*Math.cos(rotX)+y2*Math.sin(rotX);
                            const s2 = PERSPECTIVE/(PERSPECTIVE+z2_rr);

                            if (s1 > 0 && s2 > 0) {
                                ctx.moveTo(cx + x1_r*s1, cy + y1_r*s1);
                                ctx.lineTo(cx + x2_r*s2, cy + y2_r*s2);
                            }
                        }
                    }
                }
                ctx.stroke();
            }

            // Draw Particles
            particles.forEach(p => {
                p.update(time);
                p.draw(ctx, cx, cy, rotX, rotY);
            });

            // HUD Text
            ctx.font = '12px monospace';
            ctx.textAlign = 'center';
            if (currentPhase === 0) {
                ctx.fillStyle = `rgba(148, 163, 184, ${0.5 + Math.random()*0.5})`; // Slate instead of white
                ctx.fillText("/// ANALYZING DATA STREAM ///", cx, cy + 250);
            } else if (currentPhase === 1) {
                ctx.fillStyle = '#22d3ee';
                ctx.fillText("/// ENCRYPTING PROTOCOLS ///", cx, cy + 250);
                
                // Draw suction ring
                ctx.strokeStyle = `rgba(34, 211, 238, ${Math.random()})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(cx, cy, 220 - (phaseTimer/300)*200, 0, Math.PI*2); // Slower contraction
                ctx.stroke();

            } else if (currentPhase === 2) {
                ctx.fillStyle = '#69B7B2';
                ctx.fillText("/// SYSTEM SECURED ///", cx, cy + 250);
                
                // Scanline
                const scanY = cy - 220 + (phaseTimer % 100) * 4.4;
                ctx.fillStyle = 'rgba(105, 183, 178, 0.1)';
                ctx.fillRect(cx - 250, scanY, 500, 5);
            }

            frameId = requestAnimationFrame(render);
        };

        const handleResize = () => {
            if (canvas.parentElement) {
                canvas.width = canvas.parentElement.clientWidth;
                canvas.height = canvas.parentElement.clientHeight;
                width = canvas.width;
                height = canvas.height;
            }
        };

        window.addEventListener('resize', handleResize);
        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(frameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="w-full h-full block opacity-100" />;
};
