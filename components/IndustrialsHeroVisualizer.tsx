
import React, { useEffect, useRef } from 'react';

const IndustrialsHeroVisualizerComponent: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let w = canvas.width;
        let h = canvas.height;
        let time = 0;
        let frameId: number;

        // --- PERFORMANCE CONTROL ---
        let lastTime = 0;
        const TARGET_FPS = 60;
        const FRAME_INTERVAL = 1000 / TARGET_FPS;

        const CAM_Z = 600;
        let CX = w * 0.65;
        let CY = h * 0.5;
        const MODEL_SCALE = 1.4;

        interface Point { x: number, y: number, z: number }
        const parts: { points: Point[], rotationSpeed: number, color: string, type: string }[] = [];

        // CASING (Optimized)
        const casingPoints: Point[] = [];
        // Increased step from 30 to 60 for performance
        for (let z = -250; z <= 250; z += 60) {
            const r = (130 + Math.sin(z * 0.008) * 15) * MODEL_SCALE;
            for (let a = 0; a < Math.PI * 2; a += 0.4) {
                casingPoints.push({ x: Math.cos(a) * r, y: Math.sin(a) * r, z: z });
            }
        }
        parts.push({ points: casingPoints, rotationSpeed: 0.001, color: 'rgba(255, 255, 255, 0.2)', type: 'casing' });

        // ROTORS
        for (let i = 0; i < 6; i++) {
            const z = -200 + i * 80;
            const pts: Point[] = [];
            const rOuter = 115 * MODEL_SCALE;
            const bladeCount = 8 + (i%2)*4;
            for (let b = 0; b < bladeCount; b++) {
                const angle = (Math.PI * 2 / bladeCount) * b;
                pts.push({ x: Math.cos(angle) * 40 * MODEL_SCALE, y: Math.sin(angle) * 40 * MODEL_SCALE, z });
                pts.push({ x: Math.cos(angle + 0.3) * rOuter, y: Math.sin(angle + 0.3) * rOuter, z });
            }
            parts.push({ points: pts, rotationSpeed: 0.15 * (i%2===0?1:-1), color: 'rgba(245, 158, 11, 0.8)', type: 'rotor' });
        }

        const render = (timestamp: number) => {
            frameId = requestAnimationFrame(render);

            const deltaTime = timestamp - lastTime;
            if (deltaTime < FRAME_INTERVAL) return;
            lastTime = timestamp - (deltaTime % FRAME_INTERVAL);

            time += 0.01;
            
            // Fast clear
            ctx.fillStyle = '#020202';
            ctx.fillRect(0, 0, w, h);

            const camRotY = time * 0.2;
            const camRotX = Math.sin(time * 0.25) * 0.15;
            
            const cosCY = Math.cos(camRotY), sinCY = Math.sin(camRotY);
            const cosCX = Math.cos(camRotX), sinCX = Math.sin(camRotX);

            for(let j=0; j<parts.length; j++) {
                const part = parts[j];
                const currentRot = time * part.rotationSpeed * 50;
                const cosR = Math.cos(currentRot);
                const sinR = Math.sin(currentRot);
                
                ctx.beginPath();
                
                const pts = part.points;
                const len = pts.length;
                
                for (let i = 0; i < len; i++) {
                    const p = pts[i];
                    let x = p.x, y = p.y, z = p.z;

                    if (part.type === 'rotor') {
                        const nx = x * cosR - y * sinR;
                        const ny = x * sinR + y * cosR;
                        x = nx; y = ny;
                    }

                    const tx = x * cosCY - z * sinCY;
                    const tz = z * cosCY + x * sinCY;
                    x = tx; z = tz;
                    
                    const ty = y * cosCX - z * sinCX;
                    const tz2 = z * cosCX + y * sinCX;
                    y = ty; z = tz2;

                    const scale = CAM_Z / (CAM_Z + z);
                    
                    if (scale > 0) {
                        const px = CX + x * scale;
                        const py = CY + y * scale;

                        if (part.type === 'rotor') {
                            if (i % 2 === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                        } else {
                            // OPTIMIZATION: Rect instead of Arc
                            ctx.rect(px, py, 2 * scale, 2 * scale);
                        }
                    }
                }
                
                if (part.type === 'rotor') {
                    ctx.strokeStyle = part.color; ctx.stroke();
                } else {
                    ctx.fillStyle = part.color; ctx.fill();
                }
            }
        };

        const handleResize = () => {
            if (canvas.parentElement) {
                const rect = canvas.parentElement.getBoundingClientRect();
                w = canvas.width = rect.width;
                h = canvas.height = rect.height;
                CX = w * 0.65;
                CY = h * 0.5;
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

export const IndustrialsHeroVisualizer = React.memo(IndustrialsHeroVisualizerComponent);
