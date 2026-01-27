
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
            const time = frame * 0.008; // Slower, deeper time scale
            const scroll = frame * 2.0; // Smoother scroll speed

            // 1. Clear Screen
            ctx.fillStyle = '#020202';
            ctx.fillRect(0, 0, w, h);

            // 2. Draw "Strata" Lines (High Fidelity Terrain)
            const lines = 55; // High density
            const step = h / lines;
            // Scanner moves back and forth
            const scanX = (w/2) + Math.sin(time * 0.5) * (w * 0.4);

            for (let i = 0; i < lines; i++) {
                // Perspective spacing (lines get closer at the top/horizon)
                // Normalize i (0 to 1)
                const normI = i / lines;
                const perspectiveY = h * (0.2 + Math.pow(normI, 1.2) * 0.8);
                
                ctx.beginPath();
                
                // Varied line color based on depth
                // Fade from dark distance to bright foreground
                const alpha = normI * 0.6 + 0.1;
                const hue = 160 + (1-normI) * 60; // Emerald to Blue shift
                
                // Higher resolution X loop (step 3 instead of 6) for smoothness
                for (let x = 0; x <= w; x += 3) {
                    const worldX = x + scroll;
                    const worldZ = i * 50; // "Z" depth coordinate

                    // --- TERRAIN MATH ---
                    
                    // 1. Base Rolling Hills (Low Frequency)
                    let elevation = Math.sin(worldX * 0.002 + worldZ * 0.001) * 40;

                    // 2. Ridged Noise (Sharp Peaks)
                    // (1 - abs(sin(x))) creates sharp ridges. 
                    const ridge1 = Math.pow(1 - Math.abs(Math.sin(worldX * 0.006 + worldZ * 0.005 + time * 0.2)), 3);
                    elevation -= ridge1 * 50; // Digs deep canyons

                    // 3. Craggy Detail (High Frequency)
                    const detail = Math.cos(worldX * 0.03) * Math.sin(worldZ * 0.1) * 6;
                    elevation += detail;

                    // 4. "The Shelf" - Occasional flat plateaus
                    const plateau = Math.sin(worldX * 0.001 + 100);
                    if (plateau > 0.8) {
                        elevation *= 0.2; // Flatten it out
                    }

                    // 5. Interaction with Scan Line
                    const distToScan = Math.abs(x - scanX);
                    // Scanner creates a "data spike" or "flattening" visualization
                    const scanInfluence = Math.max(0, 1 - distToScan / 120);
                    const scanEffect = Math.sin(x * 0.2) * 5 * scanInfluence;

                    const finalY = perspectiveY + elevation + scanEffect;
                    
                    if (x === 0) ctx.moveTo(x, finalY);
                    else ctx.lineTo(x, finalY);
                }

                // Complex Gradient for Scanner Highlight
                const grad = ctx.createLinearGradient(scanX - 150, 0, scanX + 150, 0);
                grad.addColorStop(0, `hsla(${hue}, 60%, 20%, ${alpha * 0.2})`);
                grad.addColorStop(0.5, `hsla(${hue - 40}, 90%, 80%, ${alpha})`); // Bright scan center
                grad.addColorStop(1, `hsla(${hue}, 60%, 20%, ${alpha * 0.2})`);
                
                // Fallback for parts of line not covered by gradient
                // We use strokeStyle with a fallback pattern or just careful composition
                ctx.lineWidth = 1 + normI * 1.5; // Thicker lines in foreground
                
                // Trick to apply gradient only near scan, base color elsewhere
                if (scanX < -150 || scanX > w + 150) {
                     ctx.strokeStyle = `hsla(${hue}, 50%, 40%, ${alpha * 0.3})`;
                } else {
                     ctx.strokeStyle = grad;
                }
                
                // Apply a base stroke first for continuity (optional, can be expensive)
                // Just using the gradient + fallback logic above for performance
                
                ctx.stroke();
            }

            // 3. Draw "Resources" & Logic for Extraction
            // Resource nodes spawn relative to terrain features
            const dotCount = 8;
            for(let j=0; j<dotCount; j++) {
                const nodeColor = NODE_COLORS[j % NODE_COLORS.length];
                
                // Nodes move with the scroll to feel grounded
                // We calculate a virtual X that wraps
                const virtualX = (j * (w / dotCount) + scroll * 0.5) % (w + 200) - 100;
                
                // If off screen, don't draw
                if (virtualX < -50 || virtualX > w + 50) continue;

                // Calculate Y based on our terrain math at this X and a specific "depth" (i)
                const depthIndex = Math.floor(lines * 0.7); // 70% down the screen
                const worldZ = depthIndex * 50;
                
                // Re-run simplified terrain math for Y placement
                let elevation = Math.sin(virtualX * 0.002 + worldZ * 0.001) * 40;
                const ridge1 = Math.pow(1 - Math.abs(Math.sin(virtualX * 0.006 + worldZ * 0.005 + time * 0.2)), 3);
                elevation -= ridge1 * 50;
                const perspectiveY = h * (0.2 + Math.pow(0.7, 1.2) * 0.8);
                const dy = perspectiveY + elevation;

                const distToScan = Math.abs(virtualX - scanX);
                
                // Trigger Extraction?
                // Only if scanner is close AND random chance
                if (distToScan < 30 && Math.random() > 0.98) {
                    const tooClose = extractions.some(e => Math.abs(e.x - virtualX) < 40);
                    if (!tooClose) {
                        extractions.push({ 
                            x: virtualX, 
                            y: dy, 
                            life: 1.0, 
                            code: ["AU", "FE", "CU", "LI", "RE"][Math.floor(Math.random()*5)] + "-" + Math.floor(Math.random() * 99),
                            color: nodeColor
                        });
                    }
                }

                // Draw Passive Node (Buried resource)
                const pulse = 1 + Math.sin(frame * 0.2 + j) * 0.3;
                
                if (distToScan < 100) {
                    // Revealed by scanner
                    ctx.fillStyle = '#fff';
                    ctx.shadowColor = nodeColor;
                    ctx.shadowBlur = 20;
                    ctx.beginPath(); ctx.arc(virtualX, dy, 3 * pulse, 0, Math.PI*2); ctx.fill();
                    ctx.shadowBlur = 0;
                    
                    // Vertical indicator line
                    ctx.strokeStyle = nodeColor;
                    ctx.globalAlpha = 0.5;
                    ctx.beginPath(); ctx.moveTo(virtualX, dy); ctx.lineTo(virtualX, dy - 20); ctx.stroke();
                    ctx.globalAlpha = 1;
                } else {
                    // Hidden/Faint
                    ctx.fillStyle = 'rgba(255,255,255,0.1)';
                    ctx.beginPath(); ctx.arc(virtualX, dy, 1.5, 0, Math.PI*2); ctx.fill();
                }
            }

            // 4. Render Active Extractions (Data Beams)
            for (let i = extractions.length - 1; i >= 0; i--) {
                const ex = extractions[i];
                ex.life -= 0.015;

                // Move X with scroll slightly to feel grounded
                ex.x -= 1.0; 

                if (ex.life <= 0) {
                    extractions.splice(i, 1);
                    continue;
                }

                // Vertical Extraction Beam
                const beamHeight = 150 * (1 - ex.life);
                const beamAlpha = Math.sin(ex.life * Math.PI) * 0.8; 
                
                ctx.save();
                const beamGrad = ctx.createLinearGradient(0, ex.y, 0, ex.y - beamHeight);
                beamGrad.addColorStop(0, ex.color); 
                beamGrad.addColorStop(1, 'transparent'); 
                
                ctx.globalAlpha = beamAlpha;
                ctx.fillStyle = beamGrad;
                ctx.fillRect(ex.x - 1, ex.y - beamHeight, 2, beamHeight);
                ctx.restore();

                // Floating Label
                if (ex.life > 0.2) {
                    ctx.fillStyle = '#fff';
                    ctx.font = 'bold 10px monospace';
                    ctx.fillText(ex.code, ex.x + 6, ex.y - beamHeight);
                    
                    // Hexagon container for code
                    ctx.strokeStyle = ex.color;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    const hx = ex.x; const hy = ex.y - beamHeight - 3;
                    const r = 8;
                    for(let k=0; k<6; k++) {
                        const a = k * Math.PI/3;
                        const px = hx + Math.cos(a)*r; 
                        const py = hy + Math.sin(a)*r;
                        if(k===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
                    }
                    ctx.closePath();
                    ctx.stroke();
                }
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
