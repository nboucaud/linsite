
import React, { useEffect, useRef } from 'react';

interface SectionVisualizerProps {
    mode: 'search' | 'redaction' | 'logic' | 'core' | 'shield' | 'swarm' | 'predictive' | 'translation' | 'identity';
    color: string;
}

export const SectionVisualizer: React.FC<SectionVisualizerProps> = ({ mode, color }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;
        
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let frameId: number;
        let time = 0;
        
        // --- STATE MANAGEMENT ---
        // We maintain state in a mutable object to persist across frames without React re-renders
        const state: any = {
            width: 0,
            height: 0,
            particles: [],
            nodes: [],
            grid: [],
            initializedMode: null
        };

        const resize = () => {
            const rect = container.getBoundingClientRect();
            // Scaling for high DPI displays
            const dpr = window.devicePixelRatio || 1;
            
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            
            // CSS size
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;
            
            // Normalize coordinate system
            ctx.scale(dpr, dpr);
            
            state.width = rect.width;
            state.height = rect.height;
            
            // Re-init if dimensions changed significantly or first run
            if (mode !== state.initializedMode) {
                init(rect.width, rect.height);
            }
        };

        const init = (w: number, h: number) => {
            state.particles = [];
            state.nodes = [];
            state.grid = [];
            state.initializedMode = mode;

            if (mode === 'search') {
                for(let i=0; i<40; i++) {
                    state.particles.push({
                        theta: Math.random() * Math.PI * 2,
                        phi: Math.acos((Math.random() * 2) - 1),
                        radius: 60 + Math.random() * 40,
                        speed: (Math.random() - 0.5) * 0.02
                    });
                }
            }
            else if (mode === 'redaction') {
                const cols = 8;
                const rows = 12;
                const cw = w / cols;
                const ch = h / rows;
                for(let r=0; r<rows; r++) {
                    for(let c=0; c<cols; c++) {
                        if (Math.random() > 0.4) {
                            state.particles.push({
                                x: c * cw + 5, y: r * ch + 5,
                                w: cw - 10, h: ch - 10,
                                active: false
                            });
                        }
                    }
                }
            }
            else if (mode === 'logic') {
                state.nodes = [
                    {x: w*0.2, y: h*0.2}, {x: w*0.8, y: h*0.2},
                    {x: w*0.5, y: h*0.5},
                    {x: w*0.2, y: h*0.8}, {x: w*0.8, y: h*0.8}
                ];
                for(let i=0; i<8; i++) {
                    state.particles.push({
                        from: Math.floor(Math.random()*5),
                        to: Math.floor(Math.random()*5),
                        prog: Math.random(),
                        speed: 0.01 + Math.random() * 0.02
                    });
                }
            }
            else if (mode === 'swarm') {
                for(let i=0; i<30; i++) {
                    state.particles.push({
                        x: w/2, y: h/2,
                        vx: (Math.random()-0.5)*2,
                        vy: (Math.random()-0.5)*2
                    });
                }
            }
            else if (mode === 'translation') {
                const cols = Math.floor(w / 16);
                for(let i=0; i<cols; i++) {
                    state.particles.push({
                        x: i * 16,
                        y: Math.random() * h,
                        speed: 1 + Math.random() * 2,
                        char: String.fromCharCode(0x30A0 + Math.random() * 96)
                    });
                }
            }
            else if (mode === 'identity') {
                for(let i=0; i<60; i++) {
                    state.particles.push({
                        angle: Math.random() * Math.PI * 2,
                        r: 30 + Math.random() * 80,
                        speed: (Math.random() - 0.5) * 0.03
                    });
                }
            }
        };

        const render = () => {
            time += 0.01;
            const w = state.width;
            const h = state.height;
            const cx = w/2;
            const cy = h/2;

            ctx.clearRect(0, 0, w, h);
            
            // Draw Mode Specifics
            if (mode === 'search') {
                ctx.translate(cx, cy);
                state.particles.forEach((p: any) => {
                    p.theta += p.speed;
                    const x = p.radius * Math.sin(p.phi) * Math.cos(p.theta);
                    const y = p.radius * Math.sin(p.phi) * Math.sin(p.theta);
                    const z = p.radius * Math.cos(p.phi);
                    const scale = 200 / (200 + z);
                    
                    if (scale > 0) {
                        ctx.fillStyle = color;
                        ctx.globalAlpha = 0.6 * scale;
                        ctx.beginPath();
                        ctx.arc(x*scale, y*scale, 2*scale, 0, Math.PI*2);
                        ctx.fill();
                    }
                });
                ctx.translate(-cx, -cy);
            }
            else if (mode === 'redaction') {
                const scanY = (time * 100) % (h + 100) - 50;
                state.particles.forEach((p: any) => {
                    const dist = Math.abs(p.y - scanY);
                    if (dist < 50) {
                        ctx.fillStyle = color;
                        ctx.globalAlpha = 1 - (dist/50);
                        ctx.fillRect(p.x, p.y, p.w, p.h);
                    } else {
                        ctx.fillStyle = 'rgba(255,255,255,0.05)';
                        ctx.globalAlpha = 1;
                        ctx.fillRect(p.x, p.y, p.w, p.h);
                    }
                });
                ctx.fillStyle = '#fff';
                ctx.fillRect(0, scanY, w, 2);
            }
            else if (mode === 'logic') {
                // Nodes
                ctx.fillStyle = 'rgba(255,255,255,0.1)';
                state.nodes.forEach((n: any) => {
                    ctx.beginPath(); ctx.arc(n.x, n.y, 4, 0, Math.PI*2); ctx.fill();
                });
                // Packets
                state.particles.forEach((p: any) => {
                    p.prog += p.speed;
                    if (p.prog >= 1) {
                        p.prog = 0;
                        p.from = Math.floor(Math.random() * state.nodes.length);
                        p.to = Math.floor(Math.random() * state.nodes.length);
                    }
                    const n1 = state.nodes[p.from];
                    const n2 = state.nodes[p.to];
                    const x = n1.x + (n2.x - n1.x) * p.prog;
                    const y = n1.y + (n2.y - n1.y) * p.prog;
                    
                    ctx.fillStyle = color;
                    ctx.shadowBlur = 5; ctx.shadowColor = color;
                    ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI*2); ctx.fill();
                    ctx.shadowBlur = 0;
                });
            }
            else if (mode === 'core') {
                ctx.translate(cx, cy);
                for(let i=0; i<3; i++) {
                    ctx.rotate(time * (i%2==0?1:-1) * (1+i*0.5));
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 2;
                    ctx.beginPath(); ctx.arc(0,0, 40 + i*30, 0, Math.PI*1.5); ctx.stroke();
                    ctx.rotate(-time * (i%2==0?1:-1) * (1+i*0.5));
                }
                ctx.fillStyle = color;
                ctx.shadowBlur = 20; ctx.shadowColor = color;
                ctx.beginPath(); ctx.arc(0,0, 15 + Math.sin(time*5)*5, 0, Math.PI*2); ctx.fill();
                ctx.shadowBlur = 0;
                ctx.translate(-cx, -cy);
            }
            else if (mode === 'swarm') {
                state.particles.forEach((p: any) => {
                    // Center gravity
                    p.vx += (cx - p.x) * 0.001;
                    p.vy += (cy - p.y) * 0.001;
                    p.x += p.vx;
                    p.y += p.vy;
                    
                    ctx.fillStyle = color;
                    ctx.fillRect(p.x, p.y, 2, 2);
                });
                
                // Lines
                ctx.strokeStyle = color;
                ctx.globalAlpha = 0.2;
                ctx.beginPath();
                for(let i=0; i<state.particles.length; i++) {
                    for(let j=i+1; j<state.particles.length; j++) {
                        const p1 = state.particles[i];
                        const p2 = state.particles[j];
                        const d = Math.abs(p1.x-p2.x) + Math.abs(p1.y-p2.y);
                        if (d < 50) {
                            ctx.moveTo(p1.x, p1.y);
                            ctx.lineTo(p2.x, p2.y);
                        }
                    }
                }
                ctx.stroke();
            }
            else if (mode === 'translation') {
                ctx.font = '10px monospace';
                state.particles.forEach((p: any) => {
                    p.y += p.speed;
                    if (p.y > h) p.y = 0;
                    
                    const dist = Math.abs(p.x - cx);
                    const alpha = Math.max(0.1, 1 - dist/(w/2));
                    
                    if (p.x < cx) {
                        ctx.fillStyle = 'rgba(255,255,255,0.3)';
                        ctx.fillText(p.char, p.x, p.y);
                    } else {
                        ctx.fillStyle = color;
                        ctx.globalAlpha = alpha;
                        ctx.fillRect(p.x, p.y, 8, 8);
                    }
                });
                ctx.strokeStyle = color;
                ctx.globalAlpha = 0.5;
                ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();
            }
            else if (mode === 'identity') {
                ctx.translate(cx, cy);
                ctx.rotate(time * 0.2);
                state.particles.forEach((p: any) => {
                    p.angle += p.speed;
                    const x = Math.cos(p.angle) * p.r;
                    const y = Math.sin(p.angle) * p.r;
                    ctx.fillStyle = color;
                    ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI*2); ctx.fill();
                    if (Math.random() > 0.98) {
                        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
                        ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(x,y); ctx.stroke();
                    }
                });
                ctx.translate(-cx, -cy);
            }

            ctx.globalAlpha = 1;
            frameId = requestAnimationFrame(render);
        };

        // Resize Observer to handle layout changes
        const observer = new ResizeObserver(() => {
            resize();
        });
        observer.observe(container);
        
        // Initial setup
        resize();
        render();

        return () => {
            observer.disconnect();
            cancelAnimationFrame(frameId);
        };
    }, [mode, color]);

    return (
        <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-[#0c0c0e]">
            <canvas ref={canvasRef} className="block absolute top-0 left-0" />
            {/* Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }} />
        </div>
    );
};
