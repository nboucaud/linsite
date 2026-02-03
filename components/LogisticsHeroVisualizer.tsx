
import React, { useEffect, useRef } from 'react';

const LogisticsHeroVisualizerComponent: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let w = canvas.parentElement?.clientWidth || window.innerWidth;
        let h = canvas.parentElement?.clientHeight || window.innerHeight;
        let frame = 0;
        let frameId: number;
        
        const PHASE_DURATION = 900; 
        
        // --- 1. INDUCTION (Packages) ---
        interface PackageBox { x: number, y: number, w: number, h: number, speed: number, type: 'standard' | 'priority' | 'hazardous' }
        const packages: PackageBox[] = [];
        for(let i=0; i<100; i++) {
            packages.push({
                x: Math.random() * w * 1.5,
                y: Math.random() * h,
                w: 20 + Math.random() * 30,
                h: 10 + Math.random() * 20,
                speed: (1.8 + Math.random() * 2.7) * 0.67, // SLOWED
                type: Math.random() > 0.9 ? 'hazardous' : Math.random() > 0.8 ? 'priority' : 'standard'
            });
        }

        // --- 2. NETWORK (Globe) ---
        interface GlobePoint { x: number, y: number, z: number, r: number }
        const globePoints: GlobePoint[] = [];
        const count = 600;
        const r = 250;
        const phi = Math.PI * (3 - Math.sqrt(5));
        for(let i=0; i<count; i++) {
            const y = 1 - (i / (count - 1)) * 2;
            const radius = Math.sqrt(1 - y * y);
            const theta = phi * i;
            const x = Math.cos(theta) * radius;
            const z = Math.sin(theta) * radius;
            globePoints.push({ x: x*r, y: y*r, z: z*r, r: Math.random() > 0.95 ? 3 : 1.5 });
        }

        // --- 3. SORTATION (Radial) ---
        interface SortParticle { r: number, angle: number, speed: number, color: string }
        const sortParticles: SortParticle[] = [];
        for(let i=0; i<150; i++) {
            sortParticles.push({
                r: Math.random() * 50,
                angle: Math.random() * Math.PI * 2,
                speed: (1.8 + Math.random() * 3.6) * 0.67, // SLOWED
                color: Math.random() > 0.5 ? '#10b981' : '#f59e0b'
            });
        }

        const render = () => {
            frame++;
            const cycle = frame % (PHASE_DURATION * 3);
            let activePhase = 0;
            
            if (cycle < PHASE_DURATION) activePhase = 0;
            else if (cycle < PHASE_DURATION * 2) activePhase = 1;
            else activePhase = 2;

            ctx.fillStyle = '#020202';
            ctx.fillRect(0, 0, w, h);

            if (activePhase === 0) {
                // --- INDUCTION BATCHED ---
                packages.forEach(p => {
                    p.x -= p.speed;
                    if (p.x < -100) { p.x = w + Math.random() * 200; p.y = Math.random() * h; }
                });

                // Batch 1: Standard (Cyan)
                ctx.fillStyle = '#06b6d4';
                ctx.beginPath();
                for (const p of packages) {
                    if (p.type === 'standard') ctx.rect(p.x, p.y, p.w, p.h);
                }
                ctx.fill();

                // Batch 2: Priority (Amber)
                ctx.fillStyle = '#f59e0b';
                ctx.beginPath();
                for (const p of packages) {
                    if (p.type === 'priority') ctx.rect(p.x, p.y, p.w, p.h);
                }
                ctx.fill();

                // Batch 3: Hazardous (Red)
                ctx.fillStyle = '#ef4444';
                ctx.beginPath();
                for (const p of packages) {
                    if (p.type === 'hazardous') ctx.rect(p.x, p.y, p.w, p.h);
                }
                ctx.fill();

                // 3D Sides (Batch)
                ctx.fillStyle = 'rgba(255,255,255,0.1)';
                ctx.beginPath();
                for (const p of packages) {
                    ctx.moveTo(p.x, p.y); 
                    ctx.lineTo(p.x+10, p.y-10); 
                    ctx.lineTo(p.x+p.w+10, p.y-10); 
                    ctx.lineTo(p.x+p.w, p.y);
                }
                ctx.fill();

            } else if (activePhase === 1) {
                // --- GLOBE BATCHED ---
                ctx.save();
                ctx.translate(w * 0.75, h * 0.5);
                const time = frame * 0.003; // SLOWED from 0.0045
                const cosT = Math.cos(time);
                const sinT = Math.sin(time);

                const bluePoints: number[] = []; 
                const amberPoints: number[] = []; 

                for (let i = 0; i < globePoints.length; i++) {
                    const p = globePoints[i];
                    let x = p.x * cosT - p.z * sinT;
                    let z = p.z * cosT + p.x * sinT;
                    
                    if (z > -200) {
                        const scale = 500 / (500 + z);
                        const size = p.r * scale;
                        const px = x * scale;
                        const py = p.y * scale;
                        
                        if (p.r > 2) {
                            amberPoints.push(px, py, size);
                        } else {
                            bluePoints.push(px, py, size);
                        }
                    }
                }

                // Draw Blue
                ctx.fillStyle = '#06b6d4';
                ctx.beginPath();
                for(let i=0; i<bluePoints.length; i+=3) {
                    ctx.rect(bluePoints[i], bluePoints[i+1], bluePoints[i+2], bluePoints[i+2]);
                }
                ctx.fill();

                // Draw Amber
                ctx.fillStyle = '#f59e0b';
                ctx.beginPath();
                for(let i=0; i<amberPoints.length; i+=3) {
                    ctx.rect(amberPoints[i], amberPoints[i+1], amberPoints[i+2], amberPoints[i+2]);
                }
                ctx.fill();

                ctx.restore();

            } else {
                // --- SORTATION BATCHED ---
                ctx.save();
                ctx.translate(w * 0.75, h * 0.5);
                
                const greenParticles: number[] = [];
                const amberParticles: number[] = [];

                for (let i = 0; i < sortParticles.length; i++) {
                    const p = sortParticles[i];
                    p.r += p.speed;
                    p.angle += 0.03; // SLOWED from 0.045
                    if (p.r > 300) { p.r = 60; p.angle = Math.random() * Math.PI * 2; }
                    
                    const px = Math.cos(p.angle) * p.r;
                    const py = Math.sin(p.angle) * p.r;
                    
                    if (p.color === '#10b981') greenParticles.push(px, py);
                    else amberParticles.push(px, py);
                }

                // Draw Green
                ctx.fillStyle = '#10b981';
                ctx.beginPath();
                for(let i=0; i<greenParticles.length; i+=2) {
                    ctx.rect(greenParticles[i], greenParticles[i+1], 3, 3);
                }
                ctx.fill();

                // Draw Amber
                ctx.fillStyle = '#f59e0b';
                ctx.beginPath();
                for(let i=0; i<amberParticles.length; i+=2) {
                    ctx.rect(amberParticles[i], amberParticles[i+1], 3, 3);
                }
                ctx.fill();

                ctx.restore();
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
        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(frameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

export const LogisticsHeroVisualizer = React.memo(LogisticsHeroVisualizerComponent);
