
import React, { useEffect, useRef } from 'react';

// --- VISUALIZER ENGINES ---
export const VISUALIZERS: Record<string, (ctx: CanvasRenderingContext2D, w: number, h: number, time: number) => void> = {
    'default': (ctx, w, h, time) => {
        ctx.save();
        ctx.translate(w/2, h/2);
        const slices = 12;
        const angleStep = (Math.PI * 2) / slices;
        for (let i = 0; i < slices; i++) {
            ctx.save();
            ctx.rotate(i * angleStep + time * 0.05);
            if (i % 2 === 1) ctx.scale(1, -1); 
            ctx.beginPath();
            ctx.moveTo(0, 0);
            const r1 = 100 + Math.sin(time * 2) * 20;
            const r2 = 200 + Math.cos(time * 1.5) * 30;
            ctx.lineTo(r1, 50);
            ctx.bezierCurveTo(r1 + 50, 100, r2 - 50, 150, r2, 0);
            ctx.strokeStyle = `hsla(${(time * 20 + i * 30) % 360}, 60%, 50%, 0.15)`;
            ctx.stroke();
            ctx.restore();
        }
        ctx.restore();
    }
};

export const VisualizerCanvas: React.FC<{ active: boolean; trackId: string; className?: string }> = ({ active, trackId, className }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let frameId: number;
        let time = 0;

        const render = () => {
            time += 0.01;
            
            if (canvas.width !== canvas.parentElement?.clientWidth || canvas.height !== canvas.parentElement?.clientHeight) {
                canvas.width = canvas.parentElement?.clientWidth || 800;
                canvas.height = canvas.parentElement?.clientHeight || 600;
            }

            const w = canvas.width;
            const h = canvas.height;

            ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'; 
            ctx.fillRect(0, 0, w, h);

            if (active) {
                ctx.globalCompositeOperation = 'screen';
                // Always use default for now
                const visualizer = VISUALIZERS['default'];
                visualizer(ctx, w, h, time);
                ctx.globalCompositeOperation = 'source-over';
            }
            
            frameId = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(frameId);
    }, [active, trackId]);

    return <canvas ref={canvasRef} className={`block w-full h-full ${className || ''}`} />;
};
