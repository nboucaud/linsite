
import React, { useEffect, useRef } from 'react';

export const HealthcareHeroVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = canvas.parentElement?.clientWidth || 800;
        let height = canvas.height = canvas.parentElement?.clientHeight || 600;
        let time = 0;
        let frameId: number;

        const BASE_PAIRS = 30;
        const ROTATION_SPEED = 0.015;

        const render = () => {
            time += 1;
            ctx.fillStyle = '#020202';
            ctx.fillRect(0, 0, width, height);

            const cx = width / 2;
            const cy = height / 2;
            const amplitude = 80;
            const spacing = width / (BASE_PAIRS - 2);
            const scanX = (time * 3) % (width + 300) - 150;

            for (let i = -2; i < BASE_PAIRS + 2; i++) {
                const xBase = (i * spacing + time * 0.5) % (width + spacing * 4) - spacing * 2;
                const angle = i * 0.4 + time * ROTATION_SPEED;
                
                const distToScan = Math.abs(xBase - scanX);
                const isScanned = distToScan < 80;
                const scanIntensity = Math.max(0, 1 - distToScan / 80);

                const y1 = cy + Math.sin(angle) * amplitude;
                const z1 = Math.cos(angle);
                const y2 = cy + Math.sin(angle + Math.PI) * amplitude;
                const z2 = Math.cos(angle + Math.PI);

                if (xBase > -50 && xBase < width + 50) {
                    ctx.lineWidth = isScanned ? 2 : 1;
                    const strokeColor = isScanned ? `rgba(255, 255, 255, ${scanIntensity * 0.8})` : `rgba(20, 184, 166, 0.1)`;
                    ctx.strokeStyle = strokeColor;
                    ctx.beginPath(); ctx.moveTo(xBase, y1); ctx.lineTo(xBase, y2); ctx.stroke();
                }

                const scale1 = 1 + z1 * 0.3;
                ctx.beginPath(); ctx.arc(xBase, y1, 4 * scale1, 0, Math.PI*2); 
                ctx.fillStyle = isScanned ? `rgba(255, 255, 255, ${scanIntensity})` : `rgba(45, 212, 191, ${0.2 + (z1+1)*0.3})`;
                ctx.fill();

                const scale2 = 1 + z2 * 0.3;
                ctx.beginPath(); ctx.arc(xBase, y2, 4 * scale2, 0, Math.PI*2);
                ctx.fill();
            }

            frameId = requestAnimationFrame(render);
        };

        const handleResize = () => {
            if (canvas.parentElement) {
                width = canvas.width = canvas.parentElement.clientWidth;
                height = canvas.height = canvas.parentElement.clientHeight;
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
