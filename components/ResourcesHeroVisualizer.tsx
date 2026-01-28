
import React, { useEffect, useRef } from 'react';

const ResourcesHeroVisualizerComponent: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
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

        // State for dynamic events
        const extractions: { x: number, y: number, life: number, code: string, color: string }[] = [];
        const NODE_COLORS = ['#f59e0b', '#06b6d4', '#d946ef', '#ef4444', '#10b981', '#f43f5e'];

        const render = (timestamp: number) => {
            frameId = requestAnimationFrame(render);

            const deltaTime = timestamp - lastTime;
            if (deltaTime < FRAME_INTERVAL) return;
            lastTime = timestamp - (deltaTime % FRAME_INTERVAL);

            frame++;
            const time = frame * 0.015;
            const scroll = frame * 1.5; // Horizontal terrain movement

            ctx.fillStyle = '#020202';
            ctx.fillRect(0, 0, w, h);

            // 2. Draw "Strata" Lines (Optimized)
            const lines = 35; 
            const step = h / lines;
            const scanX = (time * 200) % (w + 400) - 200;

            for (let i = 0; i < lines; i++) {
                const yBase = i * step + step/2;
                
                ctx.beginPath();
                ctx.lineWidth = 1.5;
                
                const alpha = i / lines * 0.6 + 0.1;
                const hue = 160 + (1 - i/lines) * 60; 
                
                // Optimized Step: 10px instead of 6px
                for (let x = 0; x <= w; x += 10) {
                    const worldX = x + scroll;
                    const worldZ = i * 50; 

                    let elevation = Math.sin(worldX * 0.002 + worldZ * 0.001) * 40;
                    const ridge1 = Math.pow(1 - Math.abs(Math.sin(worldX * 0.006 + time * 0.2)), 3);
                    elevation -= ridge1 * 50; 

                    const distToScan = Math.abs(x - scanX);
                    if (distToScan < 120) {
                        const scanInfluence = 1 - distToScan / 120;
                        elevation += Math.sin(x * 0.2) * 5 * scanInfluence;
                    }

                    const perspectiveY = h * (0.2 + Math.pow(i/lines, 1.2) * 0.8);
                    const finalY = perspectiveY + elevation;
                    
                    if (x === 0) ctx.moveTo(x, finalY);
                    else ctx.lineTo(x, finalY);
                }

                if (scanX > -150 && scanX < w + 150) {
                    const grad = ctx.createLinearGradient(scanX - 100, 0, scanX + 100, 0);
                    grad.addColorStop(0, `hsla(${hue}, 50%, 40%, ${alpha * 0.3})`);
                    grad.addColorStop(0.5, `hsla(${hue - 40}, 90%, 80%, ${alpha})`);
                    grad.addColorStop(1, `hsla(${hue}, 50%, 40%, ${alpha * 0.3})`);
                    ctx.strokeStyle = grad;
                } else {
                    ctx.strokeStyle = `hsla(${hue}, 60%, 50%, 0.12)`;
                }
                ctx.stroke();
            }

            // 3. Draw "Resources"
            const dotCount = 8;
            for(let j=0; j<dotCount; j++) {
                const nodeColor = NODE_COLORS[j % NODE_COLORS.length];
                const dx = (j * (w / dotCount) + (w/dotCount/2)) % w;
                const dy = (h * 0.35) + Math.sin(frame * 0.02 + j * 100) * (h * 0.35) + (h * 0.15);
                
                const distToScan = Math.abs(dx - scanX);
                
                if (distToScan < 5 && Math.random() > 0.98) {
                    const tooClose = extractions.some(e => Math.abs(e.x - dx) < 20);
                    if (!tooClose) {
                        extractions.push({ 
                            x: dx, y: dy, life: 1.0, 
                            code: "RES-" + Math.floor(Math.random() * 99),
                            color: nodeColor
                        });
                    }
                }

                if (distToScan < 70) {
                    ctx.fillStyle = nodeColor;
                    const pulse = 1 + Math.sin(frame * 0.2) * 0.3;
                    // OPTIMIZATION: Rects
                    const size = 6 * pulse;
                    ctx.fillRect(dx - size/2, dy - size/2, size, size);
                } else {
                    ctx.fillStyle = `rgba(255,255,255,0.1)`;
                    ctx.fillRect(dx - 1.5, dy - 1.5, 3, 3);
                }
            }

            // 4. Render Active Extractions
            for (let i = extractions.length - 1; i >= 0; i--) {
                const ex = extractions[i];
                ex.life -= 0.015;
                ex.x -= 1.5; // Match scroll

                if (ex.life <= 0) {
                    extractions.splice(i, 1);
                    continue;
                }

                const beamHeight = 150 * (1 - ex.life);
                ctx.fillStyle = ex.color;
                ctx.globalAlpha = Math.sin(ex.life * Math.PI) * 0.6;
                ctx.fillRect(ex.x - 1, ex.y - beamHeight, 2, beamHeight);
                ctx.globalAlpha = 1;

                const travelProgress = Math.pow(1 - ex.life, 2); 
                const packetY = ex.y - (travelProgress * ex.y);
                
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(ex.x - 2, packetY - 2, 4, 4);

                if (ex.life > 0.4) {
                    ctx.fillStyle = ex.color;
                    ctx.globalAlpha = Math.sin(ex.life * Math.PI) * 0.6;
                    ctx.font = '10px monospace';
                    ctx.fillText(`[${ex.code}]`, ex.x + 8, packetY);
                    ctx.globalAlpha = 1;
                }
            }
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
        
        frameId = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(frameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

export const ResourcesHeroVisualizer = React.memo(ResourcesHeroVisualizerComponent);
