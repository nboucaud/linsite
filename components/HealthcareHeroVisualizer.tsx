
import React, { useEffect, useRef } from 'react';

const HealthcareHeroVisualizerComponent: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let width = canvas.width;
        let height = canvas.height;
        let time = 0;
        let frameId: number;

        // --- PERFORMANCE CONTROL ---
        let lastTime = 0;
        const TARGET_FPS = 60;
        const FRAME_INTERVAL = 1000 / TARGET_FPS;

        const BASE_PAIRS = 30;
        const ROTATION_SPEED = 0.015;

        const render = (timestamp: number) => {
            frameId = requestAnimationFrame(render);

            const deltaTime = timestamp - lastTime;
            if (deltaTime < FRAME_INTERVAL) return;
            lastTime = timestamp - (deltaTime % FRAME_INTERVAL);

            time += 1;
            ctx.fillStyle = '#020202';
            ctx.fillRect(0, 0, width, height);

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

                const sinA = Math.sin(angle);
                const cosA = Math.cos(angle);
                
                const y1 = cy + sinA * amplitude;
                const z1 = cosA;
                const y2 = cy + Math.sin(angle + Math.PI) * amplitude;
                const z2 = Math.cos(angle + Math.PI);

                if (xBase > -50 && xBase < width + 50) {
                    ctx.lineWidth = isScanned ? 2 : 1;
                    const strokeColor = isScanned ? `rgba(255, 255, 255, ${scanIntensity * 0.8})` : `rgba(20, 184, 166, 0.1)`;
                    ctx.strokeStyle = strokeColor;
                    ctx.beginPath(); ctx.moveTo(xBase, y1); ctx.lineTo(xBase, y2); ctx.stroke();
                }

                // OPTIMIZATION: Rects instead of arcs
                const scale1 = 2 + z1 * 1.5;
                const scale2 = 2 + z2 * 1.5;
                
                ctx.fillStyle = isScanned ? `rgba(255, 255, 255, ${scanIntensity})` : `rgba(45, 212, 191, ${0.2 + (z1+1)*0.3})`;
                ctx.fillRect(xBase - scale1, y1 - scale1, scale1 * 2, scale1 * 2);

                ctx.fillStyle = isScanned ? `rgba(255, 255, 255, ${scanIntensity})` : `rgba(45, 212, 191, ${0.2 + (z2+1)*0.3})`;
                ctx.fillRect(xBase - scale2, y2 - scale2, scale2 * 2, scale2 * 2);
            }
        };

        const handleResize = () => {
            if (canvas.parentElement) {
                const rect = canvas.parentElement.getBoundingClientRect();
                width = canvas.width = rect.width;
                height = canvas.height = rect.height;
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

export const HealthcareHeroVisualizer = React.memo(HealthcareHeroVisualizerComponent);
