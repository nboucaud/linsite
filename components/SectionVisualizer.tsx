
import React, { useEffect, useRef } from 'react';

interface SectionVisualizerProps {
    mode: 'search' | 'redaction' | 'logic' | 'core' | 'shield' | 'swarm' | 'predictive' | 'translation' | 'identity';
    color: string;
}

export const SectionVisualizer: React.FC<SectionVisualizerProps> = ({ mode, color }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Store simulation state in refs so they persist across re-renders and resizes without clearing
    const stateRef = useRef({
        particles: [] as any[],
        staticGrid: [] as any[],
        initialized: false,
        width: 0,
        height: 0
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;
        
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let frameId: number;
        let time = 0;

        // --- INITIALIZATION (Run Once per Mode) ---
        const init = () => {
            const state = stateRef.current;
            state.particles = [];
            state.staticGrid = [];

            if (mode === 'search') {
                for(let i=0; i<40; i++) {
                    state.particles.push({
                        theta: Math.random() * Math.PI * 2,
                        phi: Math.random() * Math.PI,
                        radius: 0.2 + Math.random() * 0.3,
                        speed: (Math.random() - 0.5) * 0.02
                    });
                }
            }
            else if (mode === 'redaction') {
                const rows = 12; 
                const cols = 6; 
                for(let r=0; r<rows; r++) {
                    for(let c=0; c<cols; c++) {
                        if (Math.random() > 0.4) {
                            state.particles.push({
                                x: c / cols, y: r / rows,
                                w: (1/cols) * 0.8, h: (1/rows) * 0.6,
                                redacted: false
                            });
                        }
                    }
                }
            }
            else if (mode === 'logic') {
                // Fixed Nodes
                state.staticGrid = [
                    { x: 0.2, y: 0.5 }, { x: 0.5, y: 0.2 }, 
                    { x: 0.5, y: 0.8 }, { x: 0.8, y: 0.5 }
                ];
                // Moving Packets
                for(let i=0; i<8; i++) {
                    state.particles.push({
                        pathStart: Math.floor(Math.random() * 4),
                        pathEnd: Math.floor(Math.random() * 4),
                        progress: Math.random(),
                        speed: 0.01 + Math.random() * 0.01
                    });
                }
            }
            else if (mode === 'shield') {
                for (let r=1; r<=5; r++) {
                    const count = r * 6;
                    for (let i=0; i<count; i++) {
                        state.particles.push({
                            angle: (Math.PI * 2 / count) * i,
                            dist: r * 0.1,
                            active: 0
                        });
                    }
                }
            }
            else if (mode === 'swarm') {
                for (let i=0; i<20; i++) {
                    state.particles.push({
                        x: 0.5, y: 0.5,
                        vx: (Math.random()-0.5) * 0.01,
                        vy: (Math.random()-0.5) * 0.01,
                        history: []
                    });
                }
            }
            else if (mode === 'translation') {
                for(let i=0; i<50; i++) {
                    state.particles.push({
                        x: Math.random(),
                        y: Math.random(),
                        speed: 0.002 + Math.random() * 0.005,
                        char: String.fromCharCode(0x30A0 + Math.random() * 96)
                    });
                }
            }
            else if (mode === 'identity') {
                for(let i=0; i<80; i++) {
                    state.particles.push({
                        angle: i * 0.15,
                        radiusBase: i * 0.005,
                        offset: Math.random() * Math.PI
                    });
                }
            }
            
            state.initialized = true;
        };

        // Initialize immediately
        init();

        // --- RENDER LOOP ---
        const render = () => {
            time += 0.01;
            const w = stateRef.current.width;
            const h = stateRef.current.height;

            // Safety check: if 0x0, wait for resize
            if (w === 0 || h === 0) {
                frameId = requestAnimationFrame(render);
                return;
            }

            // Clear Screen
            ctx.clearRect(0, 0, w, h);
            
            // Draw background explicitly to ensure visibility against parent
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; 
            ctx.fillRect(0, 0, w, h);

            const cx = w / 2;
            const cy = h / 2;
            const minDim = Math.min(w, h);

            // Save context before any transformations
            ctx.save();

            if (mode === 'search') {
                ctx.translate(cx, cy);
                stateRef.current.particles.forEach(p => {
                    p.theta += p.speed;
                    const r = p.radius * minDim;
                    const x = r * Math.sin(p.phi) * Math.cos(p.theta);
                    const y = r * Math.sin(p.phi) * Math.sin(p.theta);
                    const z = r * Math.cos(p.phi);
                    
                    const scale = 400 / (400 + z);
                    const alpha = (z + r) / (2 * r);
                    
                    if (scale > 0) {
                        ctx.fillStyle = color;
                        ctx.globalAlpha = Math.max(0.1, alpha);
                        ctx.beginPath();
                        ctx.arc(x * scale, y * scale, 3 * scale, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // Connecting lines
                        if (Math.random() > 0.98) {
                            ctx.strokeStyle = color;
                            ctx.lineWidth = 0.5;
                            ctx.beginPath(); ctx.moveTo(x*scale, y*scale); ctx.lineTo(0,0); ctx.stroke();
                        }
                    }
                });
            }

            else if (mode === 'redaction') {
                const scanY = (time * 0.5) % 1.2 - 0.1;
                const scanPx = scanY * h;
                
                stateRef.current.particles.forEach(p => {
                    const py = p.y * h;
                    const px = p.x * w;
                    const pw = p.w * w;
                    const ph = p.h * h;
                    
                    const isRedacted = scanPx > py;
                    
                    if (isRedacted) {
                        ctx.fillStyle = color;
                        ctx.globalAlpha = 0.8;
                    } else {
                        ctx.fillStyle = 'rgba(255,255,255,0.1)';
                        ctx.globalAlpha = 1;
                    }
                    ctx.fillRect(px + 10, py + 10, pw - 4, ph - 4);
                });
                
                // Scan Line
                if (scanPx > 0 && scanPx < h) {
                    ctx.shadowBlur = 10; ctx.shadowColor = color;
                    ctx.fillStyle = '#fff'; ctx.fillRect(0, scanPx, w, 2);
                    ctx.shadowBlur = 0;
                }
            }

            else if (mode === 'logic') {
                // Nodes
                const nodes = stateRef.current.staticGrid.map((n: any) => ({
                    x: n.x * w, y: n.y * h
                }));
                
                // Draw Connections
                ctx.strokeStyle = 'rgba(255,255,255,0.1)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                for(let i=0; i<nodes.length; i++) {
                    for(let j=i+1; j<nodes.length; j++) {
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                    }
                }
                ctx.stroke();

                // Packets
                stateRef.current.particles.forEach(p => {
                    p.progress += p.speed;
                    if (p.progress >= 1) {
                        p.progress = 0;
                        p.pathStart = Math.floor(Math.random() * nodes.length);
                        p.pathEnd = Math.floor(Math.random() * nodes.length);
                    }
                    
                    const start = nodes[p.pathStart];
                    const end = nodes[p.pathEnd];
                    const x = start.x + (end.x - start.x) * p.progress;
                    const y = start.y + (end.y - start.y) * p.progress;
                    
                    ctx.fillStyle = color;
                    ctx.shadowBlur = 5; ctx.shadowColor = color;
                    ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI*2); ctx.fill();
                    ctx.shadowBlur = 0;
                });

                // Draw Nodes
                nodes.forEach((n: any) => {
                    ctx.fillStyle = '#000';
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 2;
                    ctx.beginPath(); ctx.arc(n.x, n.y, 6, 0, Math.PI*2); 
                    ctx.fill(); ctx.stroke();
                });
            }

            else if (mode === 'shield') {
                ctx.translate(cx, cy);
                stateRef.current.particles.forEach(p => {
                    if (Math.random() > 0.98) p.active = 1;
                    p.active *= 0.95;
                    
                    const r = p.dist * minDim;
                    const x = Math.cos(p.angle) * r;
                    const y = Math.sin(p.angle) * r;
                    
                    ctx.fillStyle = color;
                    ctx.globalAlpha = 0.1 + p.active;
                    
                    // Draw Hex
                    const size = minDim * 0.05;
                    ctx.beginPath();
                    for(let i=0; i<6; i++) {
                        const a = Math.PI/3 * i;
                        ctx.lineTo(x + Math.cos(a)*size, y + Math.sin(a)*size);
                    }
                    ctx.closePath();
                    ctx.fill();
                    
                    if (p.active > 0.1) {
                        ctx.strokeStyle = '#fff';
                        ctx.stroke();
                    }
                });
            }

            else if (mode === 'swarm') {
                stateRef.current.particles.forEach(p => {
                    // Center attraction
                    const dx = 0.5 - p.x;
                    const dy = 0.5 - p.y;
                    p.vx += dx * 0.0005;
                    p.vy += dy * 0.0005;
                    
                    // Move
                    p.x += p.vx; p.y += p.vy;
                    
                    const px = p.x * w;
                    const py = p.y * h;
                    
                    ctx.fillStyle = color;
                    ctx.globalAlpha = 1;
                    ctx.beginPath(); ctx.arc(px, py, 2, 0, Math.PI*2); ctx.fill();
                    
                    // Trail
                    p.history.push({x: px, y: py});
                    if (p.history.length > 8) p.history.shift();
                    
                    ctx.beginPath();
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 1;
                    p.history.forEach((h: any, i: number) => {
                        if (i===0) ctx.moveTo(h.x, h.y); else ctx.lineTo(h.x, h.y);
                    });
                    ctx.stroke();
                });
                
                // Networking
                ctx.strokeStyle = color;
                ctx.globalAlpha = 0.2;
                ctx.beginPath();
                const parts = stateRef.current.particles;
                for(let i=0; i<parts.length; i++) {
                    for(let j=i+1; j<parts.length; j++) {
                        const p1 = parts[i]; const p2 = parts[j];
                        const d = Math.sqrt(Math.pow((p1.x-p2.x)*w, 2) + Math.pow((p1.y-p2.y)*h, 2));
                        if (d < 60) {
                            ctx.moveTo(p1.x*w, p1.y*h);
                            ctx.lineTo(p2.x*w, p2.y*h);
                        }
                    }
                }
                ctx.stroke();
            }

            else if (mode === 'core') {
                ctx.translate(cx, cy);
                const pulse = 1 + Math.sin(time * 3) * 0.1;
                
                ctx.fillStyle = color;
                ctx.shadowBlur = 30; ctx.shadowColor = color;
                ctx.beginPath(); ctx.arc(0, 0, minDim * 0.15 * pulse, 0, Math.PI*2); ctx.fill();
                ctx.shadowBlur = 0;

                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                
                for(let i=0; i<3; i++) {
                    ctx.rotate(time * (i%2 === 0 ? 1 : -1) + i);
                    ctx.beginPath();
                    ctx.arc(0, 0, minDim * (0.25 + i * 0.1), 0, Math.PI * 1.5);
                    ctx.globalAlpha = 0.6;
                    ctx.stroke();
                }
            }

            else if (mode === 'translation') {
                ctx.font = '12px monospace';
                const splitX = w * 0.6;
                
                stateRef.current.particles.forEach(p => {
                    p.y += p.speed;
                    if (p.y > 1) p.y = 0;
                    
                    const py = p.y * h;
                    const px = p.x * w;
                    
                    if (px < splitX) {
                        ctx.fillStyle = 'rgba(255,255,255,0.4)';
                        ctx.fillText(p.char, px, py);
                    } else {
                        // Data Block
                        ctx.fillStyle = color;
                        const gx = Math.floor(px / 20) * 20;
                        const gy = Math.floor(py / 12) * 12;
                        ctx.fillRect(gx, gy, 12, 4);
                    }
                });
                
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(splitX, 0); ctx.lineTo(splitX, h); ctx.stroke();
            }

            else if (mode === 'identity') {
                ctx.translate(cx, cy);
                ctx.rotate(-time * 0.5);
                
                stateRef.current.particles.forEach((p, i) => {
                    const r = p.radiusBase * minDim + Math.sin(time * 5 + p.offset) * 10;
                    const x = Math.cos(p.angle) * r;
                    const y = Math.sin(p.angle) * r;
                    
                    ctx.fillStyle = color;
                    ctx.globalAlpha = 0.5 + Math.sin(time * 10 + i) * 0.5;
                    ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI*2); ctx.fill();
                });
            }

            ctx.restore();
            frameId = requestAnimationFrame(render);
        };

        const handleResize = () => {
            if (containerRef.current && canvasRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const dpr = window.devicePixelRatio || 1;
                
                // Logical size
                stateRef.current.width = rect.width;
                stateRef.current.height = rect.height;

                // Physical size for sharpness
                canvasRef.current.width = rect.width * dpr;
                canvasRef.current.height = rect.height * dpr;
                
                // Context scaling
                ctx.scale(dpr, dpr);
                
                // CSS size
                canvasRef.current.style.width = `${rect.width}px`;
                canvasRef.current.style.height = `${rect.height}px`;
            }
        };

        // Resize Observer
        const observer = new ResizeObserver(() => {
            handleResize();
        });
        observer.observe(containerRef.current);

        // Initial setup
        handleResize();
        render();

        return () => {
            observer.disconnect();
            cancelAnimationFrame(frameId);
        };
    }, [mode, color]);

    return (
        <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-black">
            <canvas ref={canvasRef} className="block absolute top-0 left-0" />
            {/* Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay" style={{ background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }} />
        </div>
    );
};
