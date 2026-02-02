
import React, { useEffect, useRef } from 'react';

export const ComplianceVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        // alpha: false improves compositing performance
        const ctx = canvas.getContext('2d', { alpha: false });
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
        
        // Reusable objects to reduce GC
        class Particle {
            x: number; y: number; z: number;
            vx: number; vy: number; vz: number;
            target: Point3D | null;
            color: string;
            size: number;
            // Cache projected coordinates to avoid recalc during batching
            px: number = 0;
            py: number = 0;
            scale: number = 0;
            
            constructor() {
                this.x = (Math.random() - 0.5) * width * 2;
                this.y = (Math.random() - 0.5) * height * 2;
                this.z = (Math.random() - 0.5) * 1000;
                this.vx = (Math.random() - 0.5) * 2.5;
                this.vy = (Math.random() - 0.5) * 2.5;
                this.vz = (Math.random() - 0.5) * 2.5;
                this.target = null;
                this.color = '#94a3b8'; 
                this.size = 2;
            }

            update(width: number, height: number) {
                // PHASE 0: UNSECURED
                if (currentPhase === 0) {
                    this.x += this.vx;
                    this.y += this.vy;
                    this.z += this.vz;
                    
                    if (Math.abs(this.x) > width) this.vx *= -1;
                    if (Math.abs(this.y) > height) this.vy *= -1;
                    if (Math.abs(this.z) > 1000) this.vz *= -1;

                    this.color = Math.random() > 0.9 ? '#69B7B2' : '#cbd5e1'; 
                    this.size = 2;
                }
                // PHASE 1: ANALYZING
                else if (currentPhase === 1) {
                    const angle = Math.atan2(this.y, this.x) + 0.05;
                    const dist = Math.sqrt(this.x*this.x + this.y*this.y);
                    const targetDist = Math.max(50, dist * 0.98); 
                    
                    this.x = Math.cos(angle) * targetDist;
                    this.y = Math.sin(angle) * targetDist;
                    this.z = this.z * 0.98; 

                    this.color = '#22d3ee'; 
                    this.size = 2;
                }
                // PHASE 2: SECURED
                else if (currentPhase === 2 && this.target) {
                    this.x += (this.target.x - this.x) * 0.05;
                    this.y += (this.target.y - this.y) * 0.05;
                    this.z += (this.target.z - this.z) * 0.05;
                    
                    this.color = '#69B7B2'; 
                    this.size = 1.5;
                }
            }

            project(cx: number, cy: number, rotX: number, rotY: number) {
                // 3D Rotation
                let x = this.x, y = this.y, z = this.z;
                
                // Rotate Y
                const cosY = Math.cos(rotY);
                const sinY = Math.sin(rotY);
                let x1 = x * cosY - z * sinY;
                let z1 = z * cosY + x * sinY;
                x = x1; z = z1;

                // Rotate X
                const cosX = Math.cos(rotX);
                const sinX = Math.sin(rotX);
                let y1 = y * cosX - z * sinX;
                let z2 = z * cosX + y * sinX;
                y = y1; z = z2;

                const scale = PERSPECTIVE / (PERSPECTIVE + z);
                this.scale = scale;
                this.px = cx + x * scale;
                this.py = cy + y * scale;
            }
        }

        const particles: Particle[] = Array.from({length: PARTICLE_COUNT}, () => new Particle());

        // --- GEOMETRY GENERATION ---
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
        particles.forEach((p, i) => {
            if (sphereTargets[i]) p.target = sphereTargets[i];
        });

        // --- RENDER LOOP ---
        const render = () => {
            time += 0.005; 
            phaseTimer += 1; 

            // Phase Switching Logic
            if (currentPhase === 0 && phaseTimer > 400) { currentPhase = 1; phaseTimer = 0; } 
            else if (currentPhase === 1 && phaseTimer > 300) { currentPhase = 2; phaseTimer = 0; } 
            else if (currentPhase === 2 && phaseTimer > 600) { 
                currentPhase = 0; 
                phaseTimer = 0;
                particles.forEach(p => {
                    p.vx = (Math.random() - 0.5) * 10;
                    p.vy = (Math.random() - 0.5) * 10;
                    p.vz = (Math.random() - 0.5) * 10;
                });
            }

            // Clear Background
            ctx.fillStyle = 'rgba(2, 2, 2, 0.25)'; // Slower fade for better trails
            ctx.fillRect(0, 0, width, height);

            const cx = width / 2;
            const cy = height / 2;
            const rotX = time * 0.2;
            const rotY = time * 0.3;

            // 1. UPDATE & PROJECT
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles[i].update(width, height);
                particles[i].project(cx, cy, rotX, rotY);
            }

            // 2. BATCH DRAW LINES (Only in Phase 2)
            if (currentPhase === 2) {
                const pulse = Math.sin(time * 5) * 0.5 + 0.5;
                ctx.strokeStyle = `rgba(105, 183, 178, ${0.1 + pulse * 0.2})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                
                for (let i = 0; i < PARTICLE_COUNT; i++) {
                    const p1 = particles[i];
                    if (p1.scale <= 0) continue;

                    // Only connect to immediate neighbors in array for performance (pseudo-spatial)
                    for(let j=1; j<=3; j++) {
                        const p2 = particles[(i+j) % PARTICLE_COUNT];
                        if (p2.scale > 0 && p1.target && p2.target) {
                            ctx.moveTo(p1.px, p1.py);
                            ctx.lineTo(p2.px, p2.py);
                        }
                    }
                }
                ctx.stroke();
            }

            // 3. BATCH DRAW PARTICLES
            // Group 1: Primary Colors (Teal/Cyan)
            ctx.beginPath();
            ctx.fillStyle = currentPhase === 1 ? '#22d3ee' : '#69B7B2';
            let hasPrimary = false;

            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const p = particles[i];
                if (p.scale <= 0) continue;
                
                // If it matches primary color or we are in phase 1/2
                if (currentPhase > 0 || p.color === '#69B7B2') {
                    hasPrimary = true;
                    const s = p.size * p.scale;
                    ctx.rect(p.px - s/2, p.py - s/2, s, s);
                }
            }
            if (hasPrimary) ctx.fill();

            // Group 2: Secondary Colors (Slate - only in Phase 0)
            if (currentPhase === 0) {
                ctx.beginPath();
                ctx.fillStyle = '#cbd5e1';
                let hasSecondary = false;
                for (let i = 0; i < PARTICLE_COUNT; i++) {
                    const p = particles[i];
                    if (p.scale > 0 && p.color !== '#69B7B2') {
                        hasSecondary = true;
                        const s = p.size * p.scale;
                        ctx.rect(p.px - s/2, p.py - s/2, s, s);
                    }
                }
                if (hasSecondary) ctx.fill();
            }

            // HUD Text
            ctx.font = '12px monospace';
            ctx.textAlign = 'center';
            if (currentPhase === 0) {
                ctx.fillStyle = `rgba(148, 163, 184, ${0.5 + Math.random()*0.5})`;
                ctx.fillText("/// ANALYZING DATA STREAM ///", cx, cy + 250);
            } else if (currentPhase === 1) {
                ctx.fillStyle = '#22d3ee';
                ctx.fillText("/// ENCRYPTING PROTOCOLS ///", cx, cy + 250);
                
                // Ring batch
                ctx.strokeStyle = `rgba(34, 211, 238, ${Math.random()})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(cx, cy, 220 - (phaseTimer/300)*200, 0, Math.PI*2);
                ctx.stroke();

            } else if (currentPhase === 2) {
                ctx.fillStyle = '#69B7B2';
                ctx.fillText("/// SYSTEM SECURED ///", cx, cy + 250);
                
                // Scanline batch
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
