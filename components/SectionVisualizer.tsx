
import React, { useEffect, useRef } from 'react';

interface SectionVisualizerProps {
    mode: 'search' | 'redaction' | 'logic' | 'core' | 'shield' | 'swarm' | 'predictive' | 'translation' | 'identity';
    color: string;
}

export const SectionVisualizer: React.FC<SectionVisualizerProps> = ({ mode, color }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let frameId: number;
        let time = 0;
        
        // Dynamic Dimensions
        let w = canvas.parentElement?.clientWidth || 300;
        let h = canvas.parentElement?.clientHeight || 500;
        canvas.width = w;
        canvas.height = h;

        // --- STATE INIT ---
        
        // SEARCH
        const searchNodes = Array.from({ length: 40 }, () => ({
            r: Math.random() * (Math.min(w, h) * 0.35),
            theta: Math.random() * Math.PI * 2,
            phi: Math.random() * Math.PI,
            speed: (Math.random() - 0.5) * 0.013
        }));

        // REDACTION (Document Scanner)
        const redactBlocks: {x: number, y: number, w: number, h: number, redacted: boolean}[] = [];
        const rRows = 12;
        const rCols = 6;
        for(let r=0; r<rRows; r++) {
            for(let c=0; c<rCols; c++) {
                if(Math.random() > 0.3) {
                    redactBlocks.push({
                        x: 20 + c * ((w-40)/rCols) + (Math.random() * 5),
                        y: 20 + r * ((h-40)/rRows),
                        w: ((w-40)/rCols) - 10,
                        h: 8,
                        redacted: false
                    });
                }
            }
        }

        // LOGIC (Directed Graph Flow)
        const logicNodes = [
            { x: w * 0.2, y: h * 0.5, id: 0 }, 
            { x: w * 0.5, y: h * 0.25, id: 1 }, 
            { x: w * 0.5, y: h * 0.75, id: 2 }, 
            { x: w * 0.8, y: h * 0.5, id: 3 }  
        ];
        const logicPaths = [
            { from: 0, to: 1 }, { from: 0, to: 2 }, 
            { from: 1, to: 3 }, { from: 2, to: 3 },
            { from: 1, to: 2 } 
        ];
        const logicPackets: { from: number, to: number, progress: number, speed: number }[] = [];

        // CORE (Reactor)
        const coreRings = [0.2, 0.4, 0.6, 0.8];
        
        // SHIELD (Hex)
        const shieldHexes: {x:number, y:number, active: number}[] = [];
        const hexSize = 20;
        for(let r=0; r<8; r++) {
            const count = 6 * r || 1;
            for(let i=0; i<count; i++) {
                const angle = (Math.PI*2/count)*i;
                const dist = r * hexSize * 1.5;
                shieldHexes.push({
                    x: Math.cos(angle) * dist,
                    y: Math.sin(angle) * dist,
                    active: 0
                });
            }
        }

        // SWARM (Tactical Pings)
        const swarmPings: {x: number, y: number, life: number, maxR: number}[] = [];

        // PREDICTIVE (Cone of Uncertainty)
        const predPaths = Array.from({length: 5}, (_, i) => ({
            offset: (i - 2) * 0.25, // spread
            phase: Math.random() * Math.PI * 2
        }));

        // TRANSLATION (Matrix to Grid)
        const transParticles = Array.from({length: 60}, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            speed: (2 + Math.random() * 3) * 0.67, 
            char: String.fromCharCode(0x30A0 + Math.random() * 96) // Katakana
        }));

        // IDENTITY (Spiral)
        const identPoints = Array.from({length: 120}, (_, i) => ({
            angle: i * 0.15,
            dist: i * 1.0, // Tighter spiral for mobile
            pulse: Math.random() * Math.PI
        }));

        const render = () => {
            time += 0.0067;
            
            // Fade clear
            ctx.fillStyle = 'rgba(5, 5, 5, 0.2)'; 
            ctx.fillRect(0, 0, w, h);
            
            const cx = w / 2;
            const cy = h / 2;

            if (mode === 'search') {
                ctx.translate(cx, cy);
                ctx.rotate(time * 0.1);
                
                searchNodes.forEach(n => {
                    n.theta += n.speed;
                    const x = n.r * Math.sin(n.phi) * Math.cos(n.theta);
                    const y = n.r * Math.sin(n.phi) * Math.sin(n.theta);
                    const z = n.r * Math.cos(n.phi);
                    
                    const scale = 200 / (200 + z);
                    const alpha = (z + 150) / 300;
                    
                    if (scale > 0) {
                        ctx.fillStyle = color;
                        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
                        ctx.beginPath();
                        ctx.arc(x * scale, y * scale, 2 * scale, 0, Math.PI*2);
                        ctx.fill();
                        
                        if (Math.random() > 0.99) {
                            ctx.strokeStyle = color;
                            ctx.lineWidth = 0.5;
                            ctx.beginPath();
                            ctx.moveTo(x*scale, y*scale);
                            ctx.lineTo(0,0);
                            ctx.stroke();
                        }
                    }
                });
                ctx.globalAlpha = 1;
                ctx.setTransform(1,0,0,1,0,0);
            }

            else if (mode === 'redaction') {
                const scanSpeed = 100;
                const scanY = (time * scanSpeed) % (h + 100) - 50;
                
                redactBlocks.forEach(b => {
                    if (scanY < 0) b.redacted = false;
                    if (scanY > b.y && !b.redacted) b.redacted = true;

                    if (b.redacted) {
                        ctx.fillStyle = color;
                        ctx.globalAlpha = 0.8;
                        ctx.fillRect(b.x, b.y, b.w, b.h);
                    } else {
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                        ctx.fillRect(b.x, b.y, b.w, b.h);
                        if (Math.abs(scanY - b.y) < 20) {
                            ctx.fillStyle = '#fff';
                            ctx.fillRect(b.x, b.y, b.w, b.h);
                        }
                    }
                });
                ctx.globalAlpha = 1;

                ctx.shadowBlur = 15;
                ctx.shadowColor = color;
                ctx.fillStyle = '#fff';
                ctx.fillRect(0, scanY, w, 2);
                
                const g = ctx.createLinearGradient(0, scanY, 0, scanY - 40);
                g.addColorStop(0, color);
                g.addColorStop(1, 'transparent');
                ctx.fillStyle = g;
                ctx.fillRect(0, scanY - 40, w, 40);
                ctx.shadowBlur = 0;
            }

            else if (mode === 'logic') {
                if (Math.random() > 0.94) {
                    const path = logicPaths[Math.floor(Math.random() * logicPaths.length)];
                    logicPackets.push({ from: path.from, to: path.to, progress: 0, speed: (0.01 + Math.random()*0.02) * 0.67 });
                }

                ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                logicPaths.forEach(p => {
                    // Safety check for resize
                    if (logicNodes[p.from] && logicNodes[p.to]) {
                        const start = logicNodes[p.from];
                        const end = logicNodes[p.to];
                        // Rescale logic nodes to current w/h
                        const sx = start.id === 0 ? w*0.2 : start.id === 3 ? w*0.8 : w*0.5;
                        const sy = start.id === 1 ? h*0.25 : start.id === 2 ? h*0.75 : h*0.5;
                        const ex = end.id === 0 ? w*0.2 : end.id === 3 ? w*0.8 : w*0.5;
                        const ey = end.id === 1 ? h*0.25 : end.id === 2 ? h*0.75 : h*0.5;
                        ctx.moveTo(sx, sy);
                        ctx.lineTo(ex, ey);
                    }
                });
                ctx.stroke();

                for (let i = logicPackets.length - 1; i >= 0; i--) {
                    const p = logicPackets[i];
                    p.progress += p.speed;
                    
                    const startId = logicNodes[p.from].id;
                    const endId = logicNodes[p.to].id;
                    const sx = startId === 0 ? w*0.2 : startId === 3 ? w*0.8 : w*0.5;
                    const sy = startId === 1 ? h*0.25 : startId === 2 ? h*0.75 : h*0.5;
                    const ex = endId === 0 ? w*0.2 : endId === 3 ? w*0.8 : w*0.5;
                    const ey = endId === 1 ? h*0.25 : endId === 2 ? h*0.75 : h*0.5;

                    if (p.progress >= 1) {
                        ctx.fillStyle = '#fff';
                        ctx.beginPath(); ctx.arc(ex, ey, 8, 0, Math.PI*2); ctx.fill();
                        logicPackets.splice(i, 1);
                        continue;
                    }

                    const x = sx + (ex - sx) * p.progress;
                    const y = sy + (ey - sy) * p.progress;

                    ctx.fillStyle = color;
                    ctx.shadowBlur = 5;
                    ctx.shadowColor = color;
                    ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI*2); ctx.fill();
                    ctx.shadowBlur = 0;
                }

                logicNodes.forEach(n => {
                    const nx = n.id === 0 ? w*0.2 : n.id === 3 ? w*0.8 : w*0.5;
                    const ny = n.id === 1 ? h*0.25 : n.id === 2 ? h*0.75 : h*0.5;
                    ctx.fillStyle = '#1a1a1a';
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(nx, ny - 15); ctx.lineTo(nx + 15, ny);
                    ctx.lineTo(nx, ny + 15); ctx.lineTo(nx - 15, ny);
                    ctx.closePath();
                    ctx.fill(); ctx.stroke();
                });
            }

            else if (mode === 'core') {
                ctx.translate(cx, cy);
                const coreTime = time * 1.5;
                const pulse = 1 + Math.sin(coreTime * 5) * 0.1;
                ctx.fillStyle = color;
                ctx.shadowBlur = 30 * pulse;
                ctx.shadowColor = color;
                ctx.beginPath(); ctx.arc(0, 0, 30, 0, Math.PI*2); ctx.fill();
                ctx.shadowBlur = 0;

                coreRings.forEach((r, i) => {
                    ctx.save();
                    const radius = 50 + i * 25;
                    ctx.rotate(coreTime * (i % 2 === 0 ? 1 : -1) * (1 - i * 0.1));
                    ctx.strokeStyle = color;
                    ctx.globalAlpha = 0.3;
                    ctx.lineWidth = 2;
                    ctx.beginPath(); ctx.arc(0, 0, radius, 0, Math.PI * 1.5); ctx.stroke();
                    ctx.fillStyle = '#fff'; ctx.fillRect(radius - 2, -2, 4, 4);
                    ctx.restore();
                });
                ctx.setTransform(1,0,0,1,0,0);
            }

            else if (mode === 'shield') {
                ctx.translate(cx, cy);
                shieldHexes.forEach(h => {
                    if (Math.random() > 0.99) h.active = 1;
                    h.active *= 0.96;
                    ctx.strokeStyle = color;
                    ctx.fillStyle = color;
                    ctx.globalAlpha = 0.1 + h.active;
                    ctx.beginPath();
                    for(let i=0; i<6; i++) {
                        const a = Math.PI/3 * i;
                        const hx = h.x + Math.cos(a) * 10;
                        const hy = h.y + Math.sin(a) * 10;
                        if(i===0) ctx.moveTo(hx, hy); else ctx.lineTo(hx, hy);
                    }
                    ctx.closePath(); ctx.stroke();
                    if (h.active > 0.1) ctx.fill();
                });
                ctx.globalAlpha = 1;
                ctx.setTransform(1,0,0,1,0,0);
            }

            else if (mode === 'swarm') {
                if (Math.random() > 0.96) {
                    swarmPings.push({ x: Math.random() * w, y: Math.random() * h, life: 0, maxR: 30 + Math.random() * 50 });
                }
                for (let i = swarmPings.length - 1; i >= 0; i--) {
                    const p = swarmPings[i];
                    p.life += 0.0067;
                    if (p.life > 1) { swarmPings.splice(i, 1); continue; }
                    ctx.strokeStyle = color; ctx.lineWidth = 2 * (1 - p.life); ctx.globalAlpha = 1 - p.life;
                    ctx.beginPath(); ctx.arc(p.x, p.y, p.maxR * p.life, 0, Math.PI*2); ctx.stroke();
                    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI*2); ctx.fill();
                    
                    // Connections
                    for (let j = i + 1; j < swarmPings.length; j++) {
                        const p2 = swarmPings[j];
                        const dx = p.x - p2.x; const dy = p.y - p2.y;
                        const dist = Math.sqrt(dx*dx + dy*dy);
                        if (dist < 100) {
                            ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.globalAlpha = (1 - dist/100) * 0.5;
                            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
                        }
                    }
                }
                ctx.globalAlpha = 1;
            }

            else if (mode === 'predictive') {
                ctx.lineWidth = 2;
                predPaths.forEach((p, i) => {
                    ctx.beginPath();
                    ctx.strokeStyle = i === 2 ? color : 'rgba(255,255,255,0.1)'; 
                    for(let x=0; x<w; x+=5) {
                        const progress = x/w;
                        const divergence = progress * progress * 100 * p.offset;
                        const y = h/2 + Math.sin(x * 0.02 - time * 5) * 40 + Math.sin(time * 3 + p.phase) * divergence;
                        if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
                    }
                    ctx.stroke();
                });
                const scanX = (time * 100) % w;
                ctx.fillStyle = color; ctx.globalAlpha = 0.1;
                ctx.fillRect(scanX, 0, 30, h);
                ctx.globalAlpha = 1;
            }

            else if (mode === 'translation') {
                ctx.font = '10px monospace';
                const split = w * 0.6;
                transParticles.forEach(p => {
                    p.y += p.speed;
                    if (p.y > h) p.y = 0;
                    if (p.x < split) {
                        ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.fillText(p.char, p.x, p.y);
                    } else {
                        ctx.fillStyle = color;
                        const gx = Math.floor(p.x / 20) * 20; const gy = Math.floor(p.y / 10) * 10;
                        ctx.fillRect(gx, gy, 15, 2);
                    }
                });
                ctx.beginPath(); ctx.moveTo(split, 0); ctx.lineTo(split, h);
                ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
            }

            else if (mode === 'identity') {
                ctx.translate(cx, cy);
                ctx.rotate(-time * 0.2);
                identPoints.forEach((p, i) => {
                    const r = p.dist + Math.sin(time * 3 + i * 0.1) * 2;
                    const x = Math.cos(p.angle) * r; const y = Math.sin(p.angle) * r;
                    ctx.fillStyle = color; ctx.globalAlpha = 0.5 + Math.sin(time * 5 + p.pulse) * 0.5;
                    ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI*2); ctx.fill();
                });
                ctx.globalAlpha = 1;
                ctx.setTransform(1,0,0,1,0,0);
                
                const angle = time * 2;
                ctx.translate(cx, cy); ctx.rotate(angle);
                const g = ctx.createLinearGradient(0,0,120,0);
                g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, color);
                ctx.fillStyle = g;
                ctx.beginPath(); ctx.moveTo(0,0); ctx.arc(0,0,120,0, 0.2); ctx.fill();
                ctx.setTransform(1,0,0,1,0,0);
            }

            frameId = requestAnimationFrame(render);
        };

        const handleResize = () => {
            if (canvas.parentElement) {
                w = canvas.width = canvas.parentElement.clientWidth;
                h = canvas.height = canvas.parentElement.clientHeight;
                render(); // Force re-render to update center points immediately
            }
        };

        window.addEventListener('resize', handleResize);
        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(frameId);
        };
    }, [mode, color]);

    return (
        <div className="w-full h-full relative overflow-hidden bg-black/20">
            <canvas 
                ref={canvasRef} 
                className="w-full h-full object-cover opacity-80 mix-blend-screen"
            />
            {/* Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }} />
        </div>
    );
};
