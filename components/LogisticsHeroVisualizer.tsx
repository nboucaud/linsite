
import React, { useEffect, useRef } from 'react';

const LogisticsHeroVisualizerComponent: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        // OPTIMIZATION: alpha: false for faster compositing
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let w = canvas.width;
        let h = canvas.height;
        let frame = 0;
        let frameId: number;
        
        // --- PERFORMANCE CONTROL ---
        let lastTime = 0;
        const TARGET_FPS = 60;
        const FRAME_INTERVAL = 1000 / TARGET_FPS;
        
        const PHASE_DURATION = 900; 
        
        // --- 1. INDUCTION (Packages) ---
        interface PackageBox { x: number, y: number, w: number, h: number, speed: number, type: 'standard' | 'priority' | 'hazardous' }
        const packages: PackageBox[] = [];
        for(let i=0; i<80; i++) { // Reduced count slightly
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
        const count = 500; // Reduced count
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

        const render = (timestamp: number) => {
            frameId = requestAnimationFrame(render);

            // OPTIMIZATION: Cap Frame Rate
            const deltaTime = timestamp - lastTime;
            if (deltaTime < FRAME_INTERVAL) return;
            lastTime = timestamp - (deltaTime % FRAME_INTERVAL);

            frame++;
            const cycle = frame % (PHASE_DURATION * 3);
            let activePhase = 0;
            
            if (cycle < PHASE_DURATION) activePhase = 0;
            else if (cycle < PHASE_DURATION * 2) activePhase = 1;
            else activePhase = 2;

            ctx.fillStyle = '#020202';
            ctx.fillRect(0, 0, w, h);

            if (activePhase === 0) {
                // Induction Draw
                for(let i=0; i<packages.length; i++) {
                    const p = packages[i];
                    p.x -= p.speed;
                    if (p.x < -100) { p.x = w + Math.random() * 200; p.y = Math.random() * h; }
                    
                    const color = p.type === 'hazardous' ? '#ef4444' : p.type === 'priority' ? '#f59e0b' : '#06b6d4';
                    ctx.fillStyle = color;
                    ctx.fillRect(p.x, p.y, p.w, p.h);
                    
                    // 3D Side
                    ctx.fillStyle = 'rgba(255,255,255,0.1)';
                    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x+10, p.y-10); ctx.lineTo(p.x+p.w+10, p.y-10); ctx.lineTo(p.x+p.w, p.y); ctx.fill();
                }
            } else if (activePhase === 1) {
                // Globe Draw
                const time = frame * 0.005;
                const cx = w * 0.75;
                const cy = h * 0.5;
                const cosT = Math.cos(time);
                const sinT = Math.sin(time);

                for(let i=0; i<globePoints.length; i++) {
                    const p = globePoints[i];
                    let x = p.x * cosT - p.z * sinT;
                    let z = p.z * cosT + p.x * sinT;
                    const scale = 500 / (500 + z);
                    
                    if (z > -200) {
                        ctx.fillStyle = p.r > 2 ? '#f59e0b' : '#06b6d4';
                        // OPTIMIZATION: Rects instead of arcs
                        const s = p.r * scale;
                        ctx.fillRect(cx + x * scale, cy + p.y * scale, s, s);
                    }
                }
            } else {
                // Sortation Draw
                const cx = w * 0.75;
                const cy = h * 0.5;
                for(let i=0; i<sortParticles.length; i++) {
                    const p = sortParticles[i];
                    p.r += p.speed;
                    p.angle += 0.05;
                    if (p.r > 300) { p.r = 60; p.angle = Math.random() * Math.PI * 2; }
                    
                    const px = cx + Math.cos(p.angle) * p.r;
                    const py = cy + Math.sin(p.angle) * p.r;
                    
                    ctx.fillStyle = p.color;
                    // OPTIMIZATION: Rects
                    ctx.fillRect(px, py, 3, 3);
                }
            }
        };

        const handleResize = () => {
            if (canvas.parentElement) {
                // OPTIMIZATION: 1:1 Pixel Ratio
                const rect = canvas.parentElement.getBoundingClientRect();
                w = canvas.width = rect.width;
                h = canvas.height = rect.height;
            }
        };
        
        window.addEventListener('resize', handleResize);
        handleResize();
        frameId = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(frameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

export const LogisticsHeroVisualizer = React.memo(LogisticsHeroVisualizerComponent);
