
import React, { useEffect, useRef } from 'react';

export const ClientsHeroVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let w = canvas.width;
        let h = canvas.height;
        let frameId: number;
        let time = 0;

        // --- CONFIG ---
        const PARTICLE_COUNT = 400;
        const PHASE_DURATION = 300; // Frames per phase
        
        // --- PHASE STATE ---
        let phase = 0; // 0: DISCOVER (Nodes), 1: STREAM (Flow), 2: CONNECT (Mesh)
        let phaseTimer = 0;

        interface Point {
            x: number; y: number; z: number;
            tx: number; ty: number; tz: number; // Target
            color: string;
        }

        const particles: Point[] = [];

        // Initialize scattered
        for(let i=0; i<PARTICLE_COUNT; i++) {
            particles.push({
                x: (Math.random() - 0.5) * 1000,
                y: (Math.random() - 0.5) * 1000,
                z: (Math.random() - 0.5) * 1000,
                tx: 0, ty: 0, tz: 0,
                color: Math.random() > 0.8 ? '#ffffff' : '#69B7B2'
            });
        }

        // --- GEOMETRY GENERATORS ---
        const setDiscoveryTargets = () => {
            // Random floating cloud
            particles.forEach(p => {
                const theta = Math.random() * Math.PI * 2;
                const r = 200 + Math.random() * 300;
                p.tx = Math.cos(theta) * r;
                p.ty = (Math.random() - 0.5) * 400;
                p.tz = Math.sin(theta) * r;
            });
        };

        const setStreamTargets = () => {
            // Horizontal streams
            particles.forEach((p, i) => {
                const streamIdx = i % 5; // 5 streams
                const t = (i / PARTICLE_COUNT) * Math.PI * 4;
                p.tx = (Math.random() - 0.5) * 800;
                p.ty = (streamIdx - 2) * 100;
                p.tz = Math.sin(t) * 100;
            });
        };

        const setConnectTargets = () => {
            // Globe / Network
            const phi = Math.PI * (3 - Math.sqrt(5));
            particles.forEach((p, i) => {
                const y = 1 - (i / (PARTICLE_COUNT - 1)) * 2;
                const r = Math.sqrt(1 - y * y);
                const theta = phi * i;
                const radius = 250;
                p.tx = Math.cos(theta) * r * radius;
                p.ty = y * radius;
                p.tz = Math.sin(theta) * r * radius;
            });
        };

        // Initial Set
        setDiscoveryTargets();

        const render = () => {
            time += 0.005;
            phaseTimer++;

            if (phaseTimer > PHASE_DURATION) {
                phaseTimer = 0;
                phase = (phase + 1) % 3;
                if (phase === 0) setDiscoveryTargets();
                else if (phase === 1) setStreamTargets();
                else setConnectTargets();
            }

            ctx.fillStyle = '#020202';
            ctx.fillRect(0, 0, w, h);

            const cx = w * 0.5;
            const cy = h * 0.5;
            const fl = 800;

            const rotY = time * 0.2;
            const rotX = Math.sin(time * 0.3) * 0.1;

            const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
            const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

            // BATCH DRAWING
            // We'll draw connections first if in CONNECT phase
            if (phase === 2 && phaseTimer > 50) {
                ctx.lineWidth = 0.5;
                ctx.strokeStyle = `rgba(105, 183, 178, ${Math.min(1, (phaseTimer-50)/100) * 0.15})`;
                ctx.beginPath();
                for (let i = 0; i < PARTICLE_COUNT; i+=2) {
                    const p1 = particles[i];
                    // Very simple neighbor check in array space (fast approximation)
                    const p2 = particles[(i+1) % PARTICLE_COUNT];
                    
                    // Need projected coords for p2? No, let's just project everything first or do it inline
                    // Doing inline for perf
                    let x1 = p1.x, y1 = p1.y, z1 = p1.z;
                    let x2 = p2.x, y2 = p2.y, z2 = p2.z;
                    
                    // Rotate P1
                    let tx = x1 * cosY - z1 * sinY; let tz = z1 * cosY + x1 * sinY; x1 = tx; z1 = tz;
                    let ty = y1 * cosX - z1 * sinX; let tz2 = z1 * cosX + y1 * sinX; y1 = ty; z1 = tz2;
                    
                    // Rotate P2
                    let tx2 = x2 * cosY - z2 * sinY; let tz2_ = z2 * cosY + x2 * sinY; x2 = tx2; z2 = tz2_;
                    let ty2 = y2 * cosX - z2 * sinX; let tz2__ = z2 * cosX + y2 * sinX; y2 = ty2; z2 = tz2__;

                    const scale1 = fl / (fl + z1);
                    const scale2 = fl / (fl + z2);

                    if (scale1 > 0 && scale2 > 0) {
                        ctx.moveTo(cx + x1 * scale1, cy + y1 * scale1);
                        ctx.lineTo(cx + x2 * scale2, cy + y2 * scale2);
                    }
                }
                ctx.stroke();
            }

            // PARTICLES
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const p = particles[i];
                
                // Physics
                p.x += (p.tx - p.x) * 0.05;
                p.y += (p.ty - p.y) * 0.05;
                p.z += (p.tz - p.z) * 0.05;

                // Add Flow motion in Phase 1
                if (phase === 1) {
                    p.x += 2;
                    if (p.x > 400) p.x = -400;
                }

                // Rotation
                let x = p.x, y = p.y, z = p.z;
                let tx = x * cosY - z * sinY;
                let tz = z * cosY + x * sinY;
                x = tx; z = tz;

                let ty = y * cosX - z * sinX;
                let tz2 = z * cosX + y * sinX;
                y = ty; z = tz2;

                const scale = fl / (fl + z);
                
                if (scale > 0) {
                    const px = cx + x * scale;
                    const py = cy + y * scale;
                    const size = (phase === 2 ? 1.5 : 2.5) * scale;
                    
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = Math.min(1, scale * 0.8);
                    ctx.beginPath(); ctx.arc(px, py, size, 0, Math.PI * 2); ctx.fill();
                }
            }
            ctx.globalAlpha = 1;

            frameId = requestAnimationFrame(render);
        };

        const handleResize = () => {
            if (canvas.parentElement) {
                const rect = canvas.parentElement.getBoundingClientRect();
                w = canvas.width = rect.width;
                h = canvas.height = rect.height;
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(frameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};
