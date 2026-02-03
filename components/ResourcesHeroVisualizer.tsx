
import React, { useEffect, useRef } from 'react';

export const ResourcesHeroVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let frame = 0;
        let animationFrameId: number;

        // Optimization: Object pooling for extractions
        const MAX_EXTRACTIONS = 20;
        const extractions: Float32Array = new Float32Array(MAX_EXTRACTIONS * 5); // x, y, life, colorIndex, codeIndex
        // Using index to reference static color/code arrays to avoid string allocs
        for(let i=0; i<MAX_EXTRACTIONS; i++) extractions[i*5 + 2] = 0; // Set life to 0 (inactive)

        const NODE_COLORS = ['#f59e0b', '#06b6d4', '#d946ef', '#ef4444', '#10b981', '#f43f5e'];
        
        const spawnExtraction = (x: number, y: number, colorIdx: number) => {
            for (let i = 0; i < MAX_EXTRACTIONS; i++) {
                if (extractions[i*5 + 2] <= 0) {
                    extractions[i*5] = x;
                    extractions[i*5+1] = y;
                    extractions[i*5+2] = 1.0; // Life
                    extractions[i*5+3] = colorIdx;
                    extractions[i*5+4] = Math.random(); // Random Code Seed
                    break;
                }
            }
        };

        const render = () => {
            frame++;
            const time = frame * 0.013;
            const scroll = frame * 1.3;

            ctx.fillStyle = '#020202';
            ctx.fillRect(0, 0, width, height);

            const lines = 40; // Reduced slightly for perf
            const step = height / lines;
            const scanX = (time * 200) % (width + 400) - 200;

            // 1. Draw Strata Lines
            // Optimized: Fewer sine calls, simple arithmetic
            ctx.lineWidth = 1.5;
            
            for (let i = 0; i < lines; i++) {
                const yBase = i * step + step/2;
                const hue = 150 + (i / lines) * 80;
                
                ctx.beginPath();
                ctx.strokeStyle = `hsla(${hue}, 60%, 50%, 0.15)`; // Base color

                // Dynamic Scan Logic
                const isInScan = scanX > -100 && scanX < width + 100;
                if (isInScan) {
                    // Create gradient only if near scan
                    const grad = ctx.createLinearGradient(scanX - 100, 0, scanX + 100, 0);
                    grad.addColorStop(0, `hsla(${hue}, 60%, 50%, 0.1)`);
                    grad.addColorStop(0.5, `hsla(${hue}, 90%, 80%, 0.8)`);
                    grad.addColorStop(1, `hsla(${hue}, 60%, 50%, 0.1)`);
                    ctx.strokeStyle = grad;
                }

                // Draw Line Segment
                // Increment x by 8 instead of 6 for 25% fewer points
                for (let x = 0; x < width; x += 8) {
                    const worldX = x + scroll;
                    
                    // Simple noise approximation
                    const base = Math.sin(worldX * 0.003 + i * 0.05) * 30;
                    const detail = Math.cos(worldX * 0.01 + time * 0.5) * 8;
                    
                    const distToScan = Math.abs(x - scanX);
                    // Optimized scan influence (no Math.max inside loop if possible)
                    const scanInfluence = distToScan < 80 ? (1 - distToScan / 80) * 5 : 0;
                    
                    const y = yBase + base + detail - scanInfluence;
                    
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }

            // 2. Resource Nodes
            const dotCount = 8;
            const sectionWidth = width / dotCount;
            
            for(let j=0; j<dotCount; j++) {
                const colorIdx = j % NODE_COLORS.length;
                const nodeColor = NODE_COLORS[colorIdx];
                
                const dx = (j * sectionWidth + (sectionWidth/2)) % width;
                const dy = (height * 0.4) + Math.sin(frame * 0.02 + j * 100) * (height * 0.2);
                
                const distToScan = Math.abs(dx - scanX);
                
                // Trigger?
                if (distToScan < 5 && Math.random() > 0.98) {
                    spawnExtraction(dx, dy, colorIdx);
                }

                if (distToScan < 70) {
                    ctx.fillStyle = nodeColor;
                    ctx.shadowColor = nodeColor;
                    ctx.shadowBlur = 15;
                    const pulse = 1 + Math.sin(frame * 0.2) * 0.3;
                    ctx.beginPath(); ctx.arc(dx, dy, 3 * pulse, 0, Math.PI*2); ctx.fill();
                    ctx.shadowBlur = 0;
                } else {
                    ctx.strokeStyle = `rgba(255,255,255,0.1)`;
                    ctx.beginPath(); ctx.arc(dx, dy, 1.5, 0, Math.PI*2); ctx.stroke();
                }
            }

            // 3. Render Extractions
            for (let i = 0; i < MAX_EXTRACTIONS; i++) {
                const life = extractions[i*5 + 2];
                if (life <= 0) continue;

                // Decay
                extractions[i*5 + 2] -= 0.012;
                
                const x = extractions[i*5];
                const y = extractions[i*5 + 1];
                const color = NODE_COLORS[extractions[i*5 + 3]];
                const code = Math.floor(extractions[i*5 + 4] * 1000);

                const beamAlpha = Math.sin(life * Math.PI) * 0.6;
                
                // Beam
                ctx.save();
                ctx.globalAlpha = beamAlpha;
                ctx.fillStyle = color;
                ctx.fillRect(x - 1, 0, 2, y);
                ctx.restore();

                // Packet
                const travelY = y - (Math.pow(1 - life, 2) * y);
                ctx.fillStyle = '#fff';
                ctx.fillRect(x - 2, travelY - 2, 4, 4);

                // Text
                if (life > 0.4) {
                    ctx.fillStyle = color;
                    ctx.globalAlpha = beamAlpha;
                    ctx.font = '10px monospace';
                    ctx.fillText(`[${code}]`, x + 8, travelY);
                    ctx.globalAlpha = 1;
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        const handleResize = () => {
            if (canvas.parentElement) {
                const rect = canvas.parentElement.getBoundingClientRect();
                const dpr = window.devicePixelRatio || 1;
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;
                ctx.scale(dpr, dpr);
                width = rect.width;
                height = rect.height;
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{width: '100%', height: '100%'}} />;
};
