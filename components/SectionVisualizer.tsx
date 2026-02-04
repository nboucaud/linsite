
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
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let frameId: number;
        let time = 0;
        let width = 0;
        let height = 0;

        // --- STATE STORAGE ---
        // We use a mutable object to hold particle state so it persists across frames
        const state: any = {
            particles: [],
            grid: []
        };

        // --- INITIALIZERS ---
        const initSearch = () => {
            state.particles = [];
            for(let i=0; i<50; i++) {
                state.particles.push({
                    theta: Math.random() * Math.PI * 2,
                    phi: Math.random() * Math.PI,
                    r: 80 + Math.random() * 60, // Radius
                    speed: (Math.random() - 0.5) * 0.02
                });
            }
        };

        const initRedaction = () => {
            state.particles = [];
            const cols = 8;
            const rows = 12;
            const cellW = width / cols;
            const cellH = height / rows;
            for(let y=0; y<rows; y++) {
                for(let x=0; x<cols; x++) {
                    if(Math.random() > 0.3) {
                        state.particles.push({
                            x: x * cellW + 5,
                            y: y * cellH + 5,
                            w: cellW - 10,
                            h: cellH - 10,
                            active: false
                        });
                    }
                }
            }
        };

        const initLogic = () => {
            state.grid = [
                { x: width * 0.2, y: height * 0.2 },
                { x: width * 0.8, y: height * 0.2 },
                { x: width * 0.5, y: height * 0.5 },
                { x: width * 0.2, y: height * 0.8 },
                { x: width * 0.8, y: height * 0.8 }
            ];
            state.particles = [];
            for(let i=0; i<10; i++) {
                state.particles.push({
                    from: Math.floor(Math.random() * state.grid.length),
                    to: Math.floor(Math.random() * state.grid.length),
                    progress: Math.random(),
                    speed: 0.02 + Math.random() * 0.03
                });
            }
        };

        const initSwarm = () => {
            state.particles = [];
            for(let i=0; i<40; i++) {
                state.particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random()-0.5) * 2,
                    vy: (Math.random()-0.5) * 2
                });
            }
        };

        const initTranslation = () => {
            state.particles = [];
            const cols = Math.floor(width / 15);
            for(let i=0; i<cols; i++) {
                state.particles.push({
                    x: i * 15,
                    y: Math.random() * height,
                    speed: 1 + Math.random() * 2,
                    char: String.fromCharCode(0x30A0 + Math.random() * 96),
                    updateRate: Math.floor(Math.random() * 10) + 5
                });
            }
        };

        const initShield = () => {
            state.particles = [];
            // Hexagon rings
            for(let r=30; r<120; r+=20) {
                const count = Math.floor((r * Math.PI * 2) / 20);
                for(let i=0; i<count; i++) {
                    state.particles.push({
                        angle: (Math.PI * 2 / count) * i,
                        radius: r,
                        active: 0
                    });
                }
            }
        };

        const initCore = () => {
            state.particles = []; // Just uses time
        };

        const initIdentity = () => {
            state.particles = [];
            for(let i=0; i<100; i++) {
                state.particles.push({
                    angle: Math.random() * Math.PI * 2,
                    r: 40 + Math.random() * 80,
                    speed: (Math.random() - 0.5) * 0.05
                });
            }
        };

        // --- MAIN INIT ROUTER ---
        const initialize = () => {
            if (width === 0 || height === 0) return;
            
            if (mode === 'search') initSearch();
            else if (mode === 'redaction') initRedaction();
            else if (mode === 'logic') initLogic();
            else if (mode === 'swarm') initSwarm();
            else if (mode === 'translation') initTranslation();
            else if (mode === 'shield') initShield();
            else if (mode === 'core') initCore();
            else initIdentity(); // Identity & default
        };

        // --- RENDERERS ---
        const render = () => {
            time += 0.016;
            ctx.clearRect(0, 0, width, height);
            
            // Subtle background tint
            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            ctx.fillRect(0,0,width,height);

            const cx = width / 2;
            const cy = height / 2;

            if (mode === 'search') {
                ctx.translate(cx, cy);
                state.particles.forEach((p: any) => {
                    p.theta += p.speed;
                    // Project 3D point
                    const x = p.r * Math.sin(p.phi) * Math.cos(p.theta);
                    const y = p.r * Math.sin(p.phi) * Math.sin(p.theta);
                    const z = p.r * Math.cos(p.phi);
                    
                    const scale = 300 / (300 + z);
                    const alpha = (z + 100) / 200; // Depth fade
                    
                    if (scale > 0) {
                        ctx.fillStyle = color;
                        ctx.globalAlpha = Math.max(0.1, alpha);
                        ctx.beginPath();
                        ctx.arc(x * scale, y * scale, 2 * scale, 0, Math.PI*2);
                        ctx.fill();
                        
                        // Connecting lines
                        if (Math.random() > 0.99) {
                            ctx.strokeStyle = color;
                            ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(x*scale, y*scale); ctx.stroke();
                        }
                    }
                });
                ctx.translate(-cx, -cy);
            }

            else if (mode === 'redaction') {
                const scanLine = (Math.sin(time) * 0.5 + 0.5) * height;
                state.particles.forEach((p: any) => {
                    // Check if scanline passed
                    if (Math.abs(p.y - scanLine) < 50) {
                        ctx.fillStyle = color;
                        ctx.globalAlpha = 0.8;
                    } else {
                        ctx.fillStyle = 'rgba(255,255,255,0.1)';
                        ctx.globalAlpha = 0.3;
                    }
                    ctx.fillRect(p.x, p.y, p.w, p.h);
                });
                // Draw Scanline
                ctx.fillStyle = '#fff';
                ctx.globalAlpha = 0.5;
                ctx.fillRect(0, scanLine, width, 2);
            }

            else if (mode === 'logic') {
                // Draw Nodes
                ctx.fillStyle = 'rgba(255,255,255,0.1)';
                state.grid.forEach((n: any) => {
                    ctx.beginPath(); ctx.arc(n.x, n.y, 4, 0, Math.PI*2); ctx.fill();
                });

                // Draw Paths
                ctx.strokeStyle = 'rgba(255,255,255,0.05)';
                ctx.beginPath();
                state.grid.forEach((n1: any, i: number) => {
                    state.grid.forEach((n2: any, j: number) => {
                        if (i < j) { ctx.moveTo(n1.x, n1.y); ctx.lineTo(n2.x, n2.y); }
                    });
                });
                ctx.stroke();

                // Draw Packets
                state.particles.forEach((p: any) => {
                    p.progress += p.speed;
                    if (p.progress >= 1) {
                        p.progress = 0;
                        p.from = Math.floor(Math.random() * state.grid.length);
                        p.to = Math.floor(Math.random() * state.grid.length);
                    }
                    const n1 = state.grid[p.from];
                    const n2 = state.grid[p.to];
                    const x = n1.x + (n2.x - n1.x) * p.progress;
                    const y = n1.y + (n2.y - n1.y) * p.progress;
                    
                    ctx.fillStyle = color;
                    ctx.shadowColor = color;
                    ctx.shadowBlur = 10;
                    ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI*2); ctx.fill();
                    ctx.shadowBlur = 0;
                });
            }

            else if (mode === 'swarm') {
                state.particles.forEach((p: any) => {
                    // Pull to center
                    const dx = cx - p.x;
                    const dy = cy - p.y;
                    p.vx += dx * 0.001;
                    p.vy += dy * 0.001;
                    
                    // Add Noise
                    p.vx += (Math.random()-0.5) * 0.2;
                    p.vy += (Math.random()-0.5) * 0.2;
                    
                    // Friction
                    p.vx *= 0.96;
                    p.vy *= 0.96;
                    
                    p.x += p.vx;
                    p.y += p.vy;
                    
                    ctx.fillStyle = color;
                    ctx.fillRect(p.x, p.y, 2, 2);
                });
                
                // Connect neighbors
                ctx.strokeStyle = color;
                ctx.globalAlpha = 0.15;
                ctx.beginPath();
                for(let i=0; i<state.particles.length; i++) {
                    for(let j=i+1; j<state.particles.length; j++) {
                        const p1 = state.particles[i];
                        const p2 = state.particles[j];
                        const d = Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
                        if (d < 40) {
                            ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
                        }
                    }
                }
                ctx.stroke();
            }

            else if (mode === 'translation') {
                ctx.font = '12px monospace';
                state.particles.forEach((p: any) => {
                    p.y += p.speed;
                    if (p.y > height) p.y = 0;
                    
                    if (Math.floor(time * 60) % p.updateRate === 0) {
                        p.char = String.fromCharCode(0x30A0 + Math.random() * 96);
                    }
                    
                    const distToCenter = Math.abs(p.x - cx);
                    const alpha = Math.max(0.1, 1 - distToCenter / (width/2));
                    
                    if (p.x < cx) {
                        ctx.fillStyle = 'rgba(255,255,255,0.2)';
                        ctx.fillText(p.char, p.x, p.y);
                    } else {
                        ctx.fillStyle = color;
                        ctx.globalAlpha = alpha;
                        ctx.fillRect(p.x, p.y, 8, 8);
                    }
                });
                // Divider
                ctx.strokeStyle = color;
                ctx.globalAlpha = 0.5;
                ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, height); ctx.stroke();
            }

            else if (mode === 'shield') {
                ctx.translate(cx, cy);
                state.particles.forEach((p: any) => {
                    if (Math.random() > 0.99) p.active = 1;
                    p.active *= 0.95;
                    
                    const x = Math.cos(p.angle) * p.radius;
                    const y = Math.sin(p.angle) * p.radius;
                    
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(p.angle); // Align hexagon
                    
                    ctx.strokeStyle = color;
                    ctx.globalAlpha = 0.1 + p.active;
                    ctx.beginPath();
                    for(let i=0; i<6; i++) {
                        const a = i * Math.PI / 3;
                        const hx = Math.cos(a) * 8;
                        const hy = Math.sin(a) * 8;
                        if(i===0) ctx.moveTo(hx, hy); else ctx.lineTo(hx, hy);
                    }
                    ctx.closePath();
                    ctx.stroke();
                    if(p.active > 0.5) {
                        ctx.fillStyle = color;
                        ctx.fill();
                    }
                    
                    ctx.restore();
                });
                ctx.translate(-cx, -cy);
            }

            else if (mode === 'core') {
                ctx.translate(cx, cy);
                
                for(let i=0; i<3; i++) {
                    const r = 40 + i * 25;
                    const angle = time * (i % 2 === 0 ? 1 : -1) * (1 + i * 0.2);
                    
                    ctx.rotate(angle);
                    
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 2;
                    ctx.shadowBlur = 15; ctx.shadowColor = color;
                    
                    ctx.beginPath();
                    ctx.arc(0, 0, r, 0, Math.PI * 1.5);
                    ctx.stroke();
                    
                    ctx.shadowBlur = 0;
                    ctx.rotate(-angle); // Reset rotation for next ring
                }
                
                // Central Pulse
                const pulse = 10 + Math.sin(time * 5) * 5;
                ctx.fillStyle = '#fff';
                ctx.beginPath(); ctx.arc(0,0, pulse, 0, Math.PI*2); ctx.fill();
                
                ctx.translate(-cx, -cy);
            }

            else if (mode === 'identity' || mode === 'predictive') {
                ctx.translate(cx, cy);
                ctx.rotate(time * 0.2);
                
                state.particles.forEach((p: any) => {
                    p.angle += p.speed;
                    const x = Math.cos(p.angle) * p.r;
                    const y = Math.sin(p.angle) * p.r;
                    
                    ctx.fillStyle = color;
                    ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI*2); ctx.fill();
                    
                    // Connect to center if close
                    if (Math.random() > 0.98) {
                        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
                        ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(0,0); ctx.stroke();
                    }
                });
                ctx.translate(-cx, -cy);
            }

            ctx.globalAlpha = 1;
            frameId = requestAnimationFrame(render);
        };

        const handleResize = () => {
            if (container.clientWidth > 0 && container.clientHeight > 0) {
                width = container.clientWidth;
                height = container.clientHeight;
                canvas.width = width;
                canvas.height = height;
                initialize();
            }
        };

        // Resize Observer
        const observer = new ResizeObserver(handleResize);
        observer.observe(container);
        
        handleResize(); // First run
        render();

        return () => {
            observer.disconnect();
            cancelAnimationFrame(frameId);
        };
    }, [mode, color]);

    return (
        <div ref={containerRef} className="w-full h-full relative bg-black/20">
            <canvas ref={canvasRef} className="block" style={{ width: '100%', height: '100%' }} />
        </div>
    );
};
