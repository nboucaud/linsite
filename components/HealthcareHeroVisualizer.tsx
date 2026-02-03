
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

        let lastTime = 0;
        const TARGET_FPS = 60;
        const FRAME_INTERVAL = 1000 / TARGET_FPS;

        const BASE_PAIRS = 40; 
        const ROTATION_SPEED = 0.013; // SLOWED from 0.015

        const baseLines: number[] = []; 
        const scanLines: {x1:number, y1:number, x2:number, y2:number, alpha:number}[] = [];
        const baseNodes1: number[] = []; 
        const baseNodes2: number[] = []; 
        const scanNodes: {x:number, y:number, size:number, alpha:number}[] = [];

        const render = (timestamp: number) => {
            frameId = requestAnimationFrame(render);

            const deltaTime = timestamp - lastTime;
            if (deltaTime < FRAME_INTERVAL) return;
            lastTime = timestamp - (deltaTime % FRAME_INTERVAL);

            time += 0.9; // SLOWED from 1.0
            ctx.fillStyle = '#020202';
            ctx.fillRect(0, 0, width, height);

            const cy = height / 2;
            const amplitude = 80;
            const spacing = width / (BASE_PAIRS - 4);
            const scanX = (time * 3) % (width + 300) - 150;

            baseLines.length = 0;
            scanLines.length = 0;
            baseNodes1.length = 0;
            baseNodes2.length = 0;
            scanNodes.length = 0;

            for (let i = -2; i < BASE_PAIRS + 2; i++) {
                const xBase = (i * spacing + time * 0.5) % (width + spacing * 4) - spacing * 2;
                if (xBase < -50 || xBase > width + 50) continue;

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

                if (isScanned) {
                    scanLines.push({ x1: xBase, y1: y1, x2: xBase, y2: y2, alpha: scanIntensity });
                } else {
                    baseLines.push(xBase, y1, xBase, y2);
                }

                const scale1 = 2 + z1 * 1.5; 
                const scale2 = 2 + z2 * 1.5;

                if (isScanned) {
                    scanNodes.push({ x: xBase - scale1, y: y1 - scale1, size: scale1*2, alpha: scanIntensity });
                    scanNodes.push({ x: xBase - scale2, y: y2 - scale2, size: scale2*2, alpha: scanIntensity });
                } else {
                    baseNodes1.push(xBase - scale1, y1 - scale1, scale1 * 2);
                    baseNodes2.push(xBase - scale2, y2 - scale2, scale2 * 2);
                }
            }

            ctx.strokeStyle = 'rgba(20, 184, 166, 0.15)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            for(let i=0; i<baseLines.length; i+=4) {
                ctx.moveTo(baseLines[i], baseLines[i+1]);
                ctx.lineTo(baseLines[i+2], baseLines[i+3]);
            }
            ctx.stroke();

            ctx.lineWidth = 2;
            for(const line of scanLines) {
                ctx.strokeStyle = `rgba(255, 255, 255, ${line.alpha * 0.8})`;
                ctx.beginPath();
                ctx.moveTo(line.x1, line.y1);
                ctx.lineTo(line.x2, line.y2);
                ctx.stroke();
            }

            ctx.fillStyle = '#2dd4bf'; 
            ctx.globalAlpha = 0.4;
            ctx.beginPath();
            const allBase = [...baseNodes1, ...baseNodes2]; 
            for(let i=0; i<allBase.length; i+=3) {
                ctx.rect(allBase[i], allBase[i+1], allBase[i+2], allBase[i+2]);
            }
            ctx.fill();
            ctx.globalAlpha = 1.0;

            ctx.fillStyle = '#ffffff';
            for(const node of scanNodes) {
                ctx.globalAlpha = node.alpha;
                ctx.beginPath();
                ctx.rect(node.x, node.y, node.size, node.size);
                ctx.fill();
            }
            ctx.globalAlpha = 1.0;
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
