
import React, { useEffect, useRef } from 'react';

interface SectionVisualizerProps {
    mode: string;
    color: string;
}

export const SectionVisualizer: React.FC<SectionVisualizerProps> = ({ mode, color }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;

        // Force resize handling in the render loop to guarantee it catches layout changes
        const render = () => {
            if (!canvas.parentElement) return;
            
            // Sync canvas buffer size with display size
            // This resets the context state, so we must set styles every frame
            const rect = canvas.parentElement.getBoundingClientRect();
            if (canvas.width !== rect.width || canvas.height !== rect.height) {
                canvas.width = rect.width;
                canvas.height = rect.height;
            }

            const w = canvas.width;
            const h = canvas.height;
            const cx = w / 2;
            const cy = h / 2;

            time += 0.05;

            // 1. Fade Background (Trails)
            ctx.fillStyle = 'rgba(12, 12, 14, 0.2)';
            ctx.fillRect(0, 0, w, h);

            // 2. Draw Center Pulse
            const pulseSize = 20 + Math.sin(time * 2) * 5;
            ctx.shadowBlur = 20;
            ctx.shadowColor = color;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(cx, cy, pulseSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // 3. Draw Orbiting Ring
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(cx, cy, 60, time, time + Math.PI);
            ctx.stroke();

            // 4. Draw Waveform
            ctx.beginPath();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            for (let x = 0; x < w; x += 5) {
                const y = cy + Math.sin(x * 0.02 + time * 3) * 30 * Math.sin(time);
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // 5. Debug Text (To confirm Props)
            ctx.fillStyle = '#fff';
            ctx.font = '10px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`MODE: ${mode.toUpperCase()}`, cx, h - 20);

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => cancelAnimationFrame(animationFrameId);
    }, [mode, color]);

    return (
        <div className="w-full h-full relative bg-[#0c0c0e]">
            <canvas ref={canvasRef} className="block w-full h-full" />
        </div>
    );
};
