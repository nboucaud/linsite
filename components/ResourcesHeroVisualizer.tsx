
import React, { useEffect, useRef } from 'react';

export const ResourcesHeroVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let w = canvas.parentElement?.clientWidth || 800;
        let h = canvas.parentElement?.clientHeight || 600;
        canvas.width = w;
        canvas.height = h;

        let frame = 0;
        let animationFrameId: number;

        // State for dynamic events
        const extractions: { x: number, y: number, life: number, code: string, color: string }[] = [];
        const NODE_COLORS = ['#f59e0b', '#06b6d4', '#d946ef', '#ef4444', '#10b981', '#f43f5e'];

        const render = () => {
            frame++;
            const time = frame * 0.008; 
            const scroll = frame * 2.0;

            ctx.fillStyle = '#020202';
            ctx.fillRect(0, 0, w, h);

            // 2. Draw "Strata" Lines (Restored High Density)
            const lines = 55; // Restored from 35
            const step = h / lines;
            const scanX = (w/2) + Math.sin(time * 0.5) * (w * 0.4);

            for (let i = 0; i < lines; i++) {
                const normI = i / lines;
                const perspectiveY = h * (0.2 + Math.pow(normI, 1.2) * 0.8);
                
                ctx.beginPath();
                
                const alpha = normI * 0.6 + 0.1;
                const hue = 160 + (1-normI) * 60; 
                
                // Restored Step: 3px (was 8px)
                for (let x = 0; x <= w; x += 3) {
                    const worldX = x + scroll;
                    const worldZ = i * 50; 

                    // Complex Terrain Math
                    let elevation = Math.sin(worldX * 0.002 + worldZ * 0.001) * 40;
                    
                    // Complex ridges
                    const ridge1 = Math.pow(1 - Math.abs(Math.sin(worldX * 0.006 + time * 0.2)), 3);
                    elevation -= ridge1 * 50; 

                    // Scanner Interaction
                    const distToScan = Math.abs(x - scanX);
                    if (distToScan < 120) {
                        const scanInfluence = 1 - distToScan / 120;
                        elevation += Math.sin(x * 0.2) * 5 * scanInfluence;
                    }

                    const finalY = perspectiveY + elevation;
                    
                    if (x === 0) ctx.moveTo(x, finalY);
                    else ctx.lineTo(x, finalY);
                }

                ctx.strokeStyle = `hsla(${hue}, 50%, 40%, ${alpha * 0.3})`;
                ctx.lineWidth = 1 + normI;
                
                if (scanX > -150 && scanX < w + 150) {
                    const grad = ctx.createLinearGradient(scanX - 100, 0, scanX + 100, 0);
                    grad.addColorStop(0, `hsla(${hue}, 50%, 40%, ${alpha * 0.3})`);
                    grad.addColorStop(0.5, `hsla(${hue - 40}, 90%, 80%, ${alpha})`);
                    grad.addColorStop(1, `hsla(${hue}, 50%, 40%, ${alpha * 0.3})`);
                    ctx.strokeStyle = grad;
                }
                
                ctx.stroke();
            }

            // 3. Draw Resources & Extraction (Restored Count)
            const dotCount = 15; // Restored from 6
            for(let j=0; j<dotCount; j++) {
                const nodeColor = NODE_COLORS[j % NODE_COLORS.length];
                const virtualX = (j * (w / dotCount) + scroll * 0.5) % (w + 200) - 100;
                
                if (virtualX < -50 || virtualX > w + 50) continue;

                const perspectiveY = h * (0.2 + Math.pow(0.7, 1.2) * 0.8);
                const dy = perspectiveY + Math.sin(virtualX * 0.002) * 40; // Approx Y

                const distToScan = Math.abs(virtualX - scanX);
                
                // Trigger Extraction
                if (distToScan < 30 && Math.random() > 0.99) { 
                    const tooClose = extractions.some(e => Math.abs(e.x - virtualX) < 40);
                    if (!tooClose) {
                        extractions.push({ 
                            x: virtualX, y: dy, life: 1.0, 
                            code: "RES-" + Math.floor(Math.random() * 99),
                            color: nodeColor
                        });
                    }
                }

                if (distToScan < 100) {
                    ctx.fillStyle = '#fff';
                    ctx.shadowColor = nodeColor;
                    ctx.shadowBlur = 10;
                    ctx.beginPath(); ctx.arc(virtualX, dy, 3, 0, Math.PI*2); ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }

            // 4. Render Active Extractions
            for (let i = extractions.length - 1; i >= 0; i--) {
                const ex = extractions[i];
                ex.life -= 0.02;
                ex.x -= 1.0; 

                if (ex.life <= 0) {
                    extractions.splice(i, 1);
                    continue;
                }

                const beamHeight = 150 * (1 - ex.life);
                ctx.fillStyle = ex.color;
                ctx.globalAlpha = Math.sin(ex.life * Math.PI) * 0.6;
                ctx.fillRect(ex.x - 1, ex.y - beamHeight, 2, beamHeight);
                ctx.globalAlpha = 1;
            }

            animationFrameId = requestAnimationFrame(render);
        };

        const handleResize = () => {
            if (canvas.parentElement) {
                w = canvas.parentElement.clientWidth;
                h = canvas.parentElement.clientHeight;
                canvas.width = w;
                canvas.height = h;
            }
        };
        window.addEventListener('resize', handleResize);
        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};
