
import React, { useEffect, useRef } from 'react';

export const LogisticsHeroVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let w = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
        let h = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
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
                speed: 2 + Math.random() * 3,
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
                speed: 2 + Math.random() * 4,
                color: Math.random() > 0.5 ? '#10b981' : '#f59e0b'
            });
        }

        const render = () => {
            frame++;
            const cycle = frame % (PHASE_DURATION * 3);
            let activePhase = 0;
            let opacity = 1;
            
            if (cycle < PHASE_DURATION) activePhase = 0;
            else if (cycle < PHASE_DURATION * 2) activePhase = 1;
            else activePhase = 2;

            ctx.fillStyle = '#020202';
            ctx.fillRect(0, 0, w, h);

            if (activePhase === 0) {
                // Induction Draw
                packages.forEach(p => {
                    p.x -= p.speed;
                    if (p.x < -100) { p.x = w + Math.random() * 200; p.y = Math.random() * h; }
                    const color = p.type === 'hazardous' ? '#ef4444' : p.type === 'priority' ? '#f59e0b' : '#06b6d4';
                    ctx.fillStyle = color;
                    ctx.fillRect(p.x, p.y, p.w, p.h);
                    // 3D Side
                    ctx.fillStyle = 'rgba(255,255,255,0.1)';
                    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x+10, p.y-10); ctx.lineTo(p.x+p.w+10, p.y-10); ctx.lineTo(p.x+p.w, p.y); ctx.fill();
                });
            } else if (activePhase === 1) {
                // Globe Draw
                ctx.save();
                ctx.translate(w * 0.75, h * 0.5);
                const time = frame * 0.005;
                globePoints.forEach(p => {
                    let x = p.x * Math.cos(time) - p.z * Math.sin(time);
                    let z = p.z * Math.cos(time) + p.x * Math.sin(time);
                    const scale = 500 / (500 + z);
                    if (z > -200) {
                        ctx.fillStyle = p.r > 2 ? '#f59e0b' : '#06b6d4';
                        ctx.beginPath(); ctx.arc(x * scale, p.y * scale, p.r * scale, 0, Math.PI*2); ctx.fill();
                    }
                });
                ctx.restore();
            } else {
                // Sortation Draw
                ctx.save();
                ctx.translate(w * 0.75, h * 0.5);
                sortParticles.forEach(p => {
                    p.r += p.speed;
                    p.angle += 0.05;
                    if (p.r > 300) { p.r = 60; p.angle = Math.random() * Math.PI * 2; }
                    const px = Math.cos(p.angle) * p.r;
                    const py = Math.sin(p.angle) * p.r;
                    ctx.fillStyle = p.color;
                    ctx.beginPath(); ctx.arc(px, py, 2, 0, Math.PI*2); ctx.fill();
                });
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
