
import React, { useEffect, useRef } from 'react';

const ResourcesHeroVisualizerComponent: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let w = canvas.parentElement?.clientWidth || 800;
        let h = canvas.parentElement?.clientHeight || 600;
        canvas.width = w;
        canvas.height = h;

        let frame = 0;
        let animationFrameId: number;
        
        // --- PERFORMANCE CONTROL ---
        let lastTime = 0;
        const TARGET_FPS = 60;
        const FRAME_INTERVAL = 1000 / TARGET_FPS;

        const extractions: { x: number, y: number, life: number, code: string, color: string }[] = [];
        const NODE_COLORS = ['#f59e0b', '#06b6d4', '#d946ef', '#ef4444', '#10b981', '#f43f5e'];

        const render = (timestamp: number) => {
            animationFrameId = requestAnimationFrame(render);

            const deltaTime = timestamp - lastTime;
            if (deltaTime < FRAME_INTERVAL) return;
            lastTime = timestamp - (deltaTime % FRAME_INTERVAL);

            frame++;
            const time = frame * 0.013; // SLOWED from 0.015
            const scroll = frame * 1.3; // SLOWED from 1.5

            ctx.fillStyle = '#020202';
            ctx.fillRect(0, 0, w, h);

            const lines = 45; 
            const step = h / lines;
            const scanX = (time * 200) % (w + 400) - 200;

            for (let i = 0; i < lines; i++) {
                const yBase = i * step + step/2;
                
                ctx.beginPath();
                ctx.lineWidth = 1.5;
                
                const hue = 150 + (i / lines) * 80 + Math.sin(time * 0.2) * 10;
                
                for (let x = 0; x < w; x += 6) {
                    const worldX = x + scroll;
                    
                    const base = Math.sin(worldX * 0.003 + i * 0.05) * 30;
                    const detail = Math.cos(worldX * 0.012 + time * 0.5) * 10;
                    const micro = Math.sin(worldX * 0.04) * 4;
                    const glitch = (i % 7 === 0 && Math.sin(worldX * 0.1) > 0.8) ? 8 : 0; 
                    
                    const offset = base + detail + micro + glitch;
                    
                    const distToScan = Math.abs(x - scanX);
                    const scanInfluence = Math.max(0, 1 - distToScan / 100);
                    
                    const finalY = yBase + offset - (scanInfluence * 5);
                    
                    if (x === 0) ctx.moveTo(x, finalY);
                    else ctx.lineTo(x, finalY);
                }

                if (scanX > -150 && scanX < w + 150) {
                    const grad = ctx.createLinearGradient(scanX - 100, 0, scanX + 100, 0);
                    grad.addColorStop(0, `hsla(${hue}, 60%, 50%, 0.1)`);
                    grad.addColorStop(0.5, `hsla(${hue}, 90%, 80%, 0.8)`);
                    grad.addColorStop(1, `hsla(${hue}, 60%, 50%, 0.1)`);
                    ctx.strokeStyle = grad;
                } else {
                    ctx.strokeStyle = `hsla(${hue}, 60%, 50%, 0.12)`;
                }
                
                ctx.stroke();
            }

            const dotCount = 10;
            for(let j=0; j<dotCount; j++) {
                const nodeColor = NODE_COLORS[j % NODE_COLORS.length];
                const dx = (j * (w / dotCount) + (w/dotCount/2)) % w;
                const dy = (h * 0.35) + Math.sin(frame * 0.02 + j * 100) * (h * 0.35) + (h * 0.15);
                
                const distToScan = Math.abs(dx - scanX);
                
                if (distToScan < 5 && Math.random() > 0.97) {
                    const tooClose = extractions.some(e => Math.abs(e.x - dx) < 20);
                    if (!tooClose) {
                        extractions.push({ 
                            x: dx, 
                            y: dy, 
                            life: 1.0, 
                            code: Math.floor(Math.random() * 1000).toString(),
                            color: nodeColor
                        });
                    }
                }

                if (distToScan < 70) {
                    ctx.fillStyle = nodeColor;
                    ctx.shadowColor = nodeColor;
                    ctx.shadowBlur = 15;
                    
                    const pulse = 1 + Math.sin(frame * 0.2) * 0.3;
                    ctx.beginPath();
                    ctx.arc(dx, dy, 3 * pulse, 0, Math.PI*2);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                } else {
                    ctx.strokeStyle = `rgba(255,255,255,0.1)`;
                    ctx.beginPath();
                    ctx.arc(dx, dy, 1.5, 0, Math.PI*2);
                    ctx.stroke();
                }
            }

            for (let i = extractions.length - 1; i >= 0; i--) {
                const ex = extractions[i];
                ex.life -= 0.012; 

                if (ex.life <= 0) {
                    extractions.splice(i, 1);
                    continue;
                }

                const beamAlpha = Math.sin(ex.life * Math.PI) * 0.6; 
                
                ctx.save();
                const beamGrad = ctx.createLinearGradient(0, ex.y, 0, 0);
                beamGrad.addColorStop(0, ex.color); 
                beamGrad.addColorStop(1, 'transparent'); 
                
                ctx.globalAlpha = beamAlpha;
                ctx.fillStyle = beamGrad;
                const beamWidth = 2;
                ctx.fillRect(ex.x - beamWidth/2, 0, beamWidth, ex.y);
                ctx.restore();

                const travelProgress = Math.pow(1 - ex.life, 2); 
                const packetY = ex.y - (travelProgress * ex.y);
                
                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = '#fff'; ctx.shadowBlur = 10;
                ctx.fillRect(ex.x - 2, packetY - 2, 4, 4);
                ctx.shadowBlur = 0;

                if (ex.life > 0.4) {
                    ctx.fillStyle = ex.color;
                    ctx.globalAlpha = beamAlpha;
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
        
        render(0);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

export const ResourcesHeroVisualizer = React.memo(ResourcesHeroVisualizerComponent);
