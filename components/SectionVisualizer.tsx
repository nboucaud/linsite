
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
        
        // Dimensions
        let w = 0;
        let h = 0;
        let dpr = 1;

        // --- PARTICLE STATE ---
        // We use normalized coordinates (0.0 to 1.0) so it works at ANY resolution
        const particles: any[] = [];
        const staticGrid: any[] = [];

        // --- INITIALIZERS ---
        const init = () => {
            particles.length = 0;
            staticGrid.length = 0;

            if (mode === 'search') {
                for(let i=0; i<30; i++) {
                    particles.push({
                        // Spherical coords for 3D orbit
                        theta: Math.random() * Math.PI * 2,
                        phi: Math.random() * Math.PI,
                        radius: 0.3 + Math.random() * 0.2, // 30% to 50% of screen width
                        speed: (Math.random() - 0.5) * 0.02
                    });
                }
            }
            else if (mode === 'redaction') {
                // Create a grid of blocks
                const rows = 16; 
                const cols = 8; 
                for(let r=0; r<rows; r++) {
                    for(let c=0; c<cols; c++) {
                        if (Math.random() > 0.4) {
                            particles.push({
                                x: c / cols, // 0.0 - 1.0
                                y: r / rows, // 0.0 - 1.0
                                w: (1/cols) * 0.8,
                                h: (1/rows) * 0.6,
                                redacted: false
                            });
                        }
                    }
                }
            }
            else if (mode === 'logic') {
                // Nodes
                staticGrid.push({ x: 0.2, y: 0.5, id: 0 });
                staticGrid.push({ x: 0.5, y: 0.25, id: 1 });
                staticGrid.push({ x: 0.5, y: 0.75, id: 2 });
                staticGrid.push({ x: 0.8, y: 0.5, id: 3 });
                // Packets
                for(let i=0; i<6; i++) {
                    particles.push({
                        path: Math.floor(Math.random() * 4), // 0: 0->1, 1: 0->2, 2: 1->3, 3: 2->3
                        progress: Math.random(),
                        speed: 0.01 + Math.random() * 0.01
                    });
                }
            }
            else if (mode === 'shield') {
                // Hexes
                for (let r=0; r<6; r++) {
                    const count = r * 6 || 1;
                    for (let i=0; i<count; i++) {
                        particles.push({
                            angle: (Math.PI * 2 / count) * i,
                            dist: r * 0.12, // Normalized distance
                            active: 0
                        });
                    }
                }
            }
            else if (mode === 'swarm') {
                for (let i=0; i<15; i++) {
                    particles.push({
                        x: 0.5, y: 0.5,
                        vx: (Math.random()-0.5) * 0.01,
                        vy: (Math.random()-0.5) * 0.01,
                        history: []
                    });
                }
            }
            else if (mode === 'translation') {
                for(let i=0; i<40; i++) {
                    particles.push({
                        x: Math.random(),
                        y: Math.random(),
                        speed: 0.005 + Math.random() * 0.01,
                        char: String.fromCharCode(0x30A0 + Math.random() * 96)
                    });
                }
            }
            else if (mode === 'identity') {
                for(let i=0; i<100; i++) {
                    particles.push({
                        angle: i * 0.1,
                        radiusBase: i * 0.006,
                        offset: Math.random() * Math.PI
                    });
                }
            }
            else if (mode === 'core') {
                // Rings handled in render
            }
        };

        const render = () => {
            if (!ctx) return;
            time += 0.01;
            
            // Clear
            ctx.clearRect(0, 0, w, h);
            
            // Background dim
            ctx.fillStyle = 'rgba(0,0,0,0.2)'; 
            ctx.fillRect(0,0,w,h);

            const cx = w / 2;
            const cy = h / 2;
            const minDim = Math.min(w, h);

            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            if (mode === 'search') {
                ctx.translate(cx, cy);
                particles.forEach(p => {
                    p.theta += p.speed;
                    // Rotate
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
                    }
                });
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // Reset to base scale
            }

            else if (mode === 'redaction') {
                const scanLineY = (time * 0.5) % 1.2 - 0.1; // -0.1 to 1.1 range
                
                particles.forEach(p => {
                    const py = p.y * h;
                    const px = p.x * w;
                    const ph = p.h * h;
                    const pw = p.w * w;
                    
                    const scanPos = scanLineY * h;
                    const isPassed = scanPos > py;
                    
                    if (isPassed) {
                        ctx.fillStyle = color;
                        ctx.globalAlpha = 0.8;
                    } else {
                        ctx.fillStyle = 'rgba(255,255,255,0.1)';
                        ctx.globalAlpha = 1;
                    }
                    ctx.fillRect(px, py, pw, ph);
                });
                
                // Scan Line
                const sy = scanLineY * h;
                if (sy > 0 && sy < h) {
                    ctx.fillStyle = '#fff';
                    ctx.globalAlpha = 1;
                    ctx.shadowColor = color;
                    ctx.shadowBlur = 10;
                    ctx.fillRect(0, sy, w, 2);
                    ctx.shadowBlur = 0;
                }
            }

            else if (mode === 'logic') {
                // Draw Paths
                ctx.strokeStyle = 'rgba(255,255,255,0.1)';
                ctx.lineWidth = 2;
                
                // Nodes
                const n0 = { x: staticGrid[0].x * w, y: staticGrid[0].y * h };
                const n1 = { x: staticGrid[1].x * w, y: staticGrid[1].y * h };
                const n2 = { x: staticGrid[2].x * w, y: staticGrid[2].y * h };
                const n3 = { x: staticGrid[3].x * w, y: staticGrid[3].y * h };
                
                const drawPath = (a: any, b: any) => {
                    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
                };
                drawPath(n0, n1); drawPath(n0, n2); drawPath(n1, n3); drawPath(n2, n3);

                // Packets
                particles.forEach(p => {
                    p.progress += p.speed;
                    if (p.progress >= 1) p.progress = 0;
                    
                    let start, end;
                    if (p.path === 0) { start = n0; end = n1; }
                    else if (p.path === 1) { start = n0; end = n2; }
                    else if (p.path === 2) { start = n1; end = n3; }
                    else { start = n2; end = n3; }
                    
                    const curX = start.x + (end.x - start.x) * p.progress;
                    const curY = start.y + (end.y - start.y) * p.progress;
                    
                    ctx.fillStyle = color;
                    ctx.shadowBlur = 8; ctx.shadowColor = color;
                    ctx.beginPath(); ctx.arc(curX, curY, 4, 0, Math.PI*2); ctx.fill();
                    ctx.shadowBlur = 0;
                });

                // Draw Node Bases
                ctx.fillStyle = '#1a1a1a';
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                [n0, n1, n2, n3].forEach(n => {
                    ctx.beginPath(); ctx.arc(n.x, n.y, 6, 0, Math.PI*2); ctx.fill(); ctx.stroke();
                });
            }

            else if (mode === 'shield') {
                ctx.translate(cx, cy);
                particles.forEach(p => {
                    if (Math.random() > 0.98) p.active = 1;
                    p.active *= 0.95;
                    
                    const r = p.dist * minDim;
                    const x = Math.cos(p.angle) * r;
                    const y = Math.sin(p.angle) * r;
                    
                    ctx.fillStyle = color;
                    ctx.globalAlpha = 0.2 + p.active;
                    ctx.beginPath();
                    
                    // Draw Hex
                    const size = minDim * 0.04;
                    for(let i=0; i<6; i++) {
                        const a = Math.PI/3 * i;
                        const hx = x + Math.cos(a) * size;
                        const hy = y + Math.sin(a) * size;
                        if (i===0) ctx.moveTo(hx, hy); else ctx.lineTo(hx, hy);
                    }
                    ctx.closePath();
                    ctx.fill();
                    if (p.active > 0.1) {
                        ctx.strokeStyle = '#fff';
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                });
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            }

            else if (mode === 'swarm') {
                ctx.strokeStyle = color;
                ctx.lineWidth = 1;
                
                // Mouse interaction simulator (center pull)
                particles.forEach(p => {
                    // Pull to center
                    const dx = 0.5 - p.x;
                    const dy = 0.5 - p.y;
                    p.vx += dx * 0.0005;
                    p.vy += dy * 0.0005;
                    
                    // Noise
                    p.vx += (Math.random() - 0.5) * 0.002;
                    p.vy += (Math.random() - 0.5) * 0.002;
                    
                    p.x += p.vx;
                    p.y += p.vy;
                    
                    // Draw
                    const px = p.x * w;
                    const py = p.y * h;
                    
                    ctx.globalAlpha = 1;
                    ctx.beginPath(); ctx.arc(px, py, 2, 0, Math.PI*2); ctx.fill();
                    
                    // History trail
                    p.history.push({x: px, y: py});
                    if (p.history.length > 10) p.history.shift();
                    
                    ctx.beginPath();
                    p.history.forEach((h: any, i: number) => {
                        if (i===0) ctx.moveTo(h.x, h.y); else ctx.lineTo(h.x, h.y);
                    });
                    ctx.globalAlpha = 0.3;
                    ctx.stroke();
                });
                
                // Connect
                ctx.globalAlpha = 0.1;
                for(let i=0; i<particles.length; i++) {
                    for(let j=i+1; j<particles.length; j++) {
                        const p1 = particles[i];
                        const p2 = particles[j];
                        const dist = Math.sqrt(Math.pow((p1.x-p2.x)*w, 2) + Math.pow((p1.y-p2.y)*h, 2));
                        if (dist < 100) {
                            ctx.beginPath(); 
                            ctx.moveTo(p1.x*w, p1.y*h); 
                            ctx.lineTo(p2.x*w, p2.y*h); 
                            ctx.stroke();
                        }
                    }
                }
            }

            else if (mode === 'core') {
                ctx.translate(cx, cy);
                const pulse = 1 + Math.sin(time * 3) * 0.1;
                
                ctx.fillStyle = color;
                ctx.shadowBlur = 30; ctx.shadowColor = color;
                ctx.beginPath(); ctx.arc(0, 0, minDim * 0.1 * pulse, 0, Math.PI*2); ctx.fill();
                ctx.shadowBlur = 0;

                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                
                for(let i=0; i<3; i++) {
                    ctx.rotate(time * (i%2 === 0 ? 1 : -1) + i);
                    ctx.beginPath();
                    ctx.arc(0, 0, minDim * (0.15 + i * 0.08), 0, Math.PI * 1.5);
                    ctx.globalAlpha = 0.5;
                    ctx.stroke();
                }
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            }

            else if (mode === 'translation') {
                ctx.font = '12px monospace';
                const splitX = w * 0.5;
                
                particles.forEach(p => {
                    p.y += p.speed;
                    if (p.y > 1) p.y = 0;
                    
                    const py = p.y * h;
                    const px = p.x * w;
                    
                    if (px < splitX) {
                        ctx.fillStyle = 'rgba(255,255,255,0.3)';
                        ctx.fillText(p.char, px, py);
                    } else {
                        // Rect representation
                        ctx.fillStyle = color;
                        const wGrid = 15;
                        const hGrid = 4;
                        // Snap to grid
                        const gx = Math.floor(px / wGrid) * wGrid;
                        const gy = Math.floor(py / (hGrid*2)) * (hGrid*2);
                        ctx.fillRect(gx, gy, wGrid - 2, hGrid);
                    }
                });
                
                ctx.strokeStyle = color;
                ctx.beginPath(); ctx.moveTo(splitX, 0); ctx.lineTo(splitX, h); ctx.stroke();
            }

            else if (mode === 'identity') {
                ctx.translate(cx, cy);
                ctx.rotate(-time * 0.5);
                
                particles.forEach((p, i) => {
                    const r = p.radiusBase * minDim + Math.sin(time * 5 + p.offset) * 10;
                    const x = Math.cos(p.angle) * r;
                    const y = Math.sin(p.angle) * r;
                    
                    ctx.fillStyle = color;
                    ctx.globalAlpha = 0.6 + Math.sin(time * 10 + i) * 0.4;
                    ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI*2); ctx.fill();
                });
                
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            }

            frameId = requestAnimationFrame(render);
        };

        const handleResize = () => {
            if (canvas.parentElement) {
                const rect = canvas.parentElement.getBoundingClientRect();
                dpr = window.devicePixelRatio || 1;
                
                // Actual pixels
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;
                
                // CSS display size
                canvas.style.width = `${rect.width}px`;
                canvas.style.height = `${rect.height}px`;
                
                // Scale context
                ctx.scale(dpr, dpr);
                
                w = rect.width;
                h = rect.height;
                
                init();
            }
        };

        // ResizeObserver is more robust than window.resize for elements
        const observer = new ResizeObserver(() => {
            handleResize();
        });
        observer.observe(containerRef.current);

        handleResize();
        render();

        return () => {
            observer.disconnect();
            cancelAnimationFrame(frameId);
        };
    }, [mode, color]);

    return (
        <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-black/20">
            <canvas 
                ref={canvasRef} 
                className="block"
            />
            {/* Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay" style={{ background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }} />
        </div>
    );
};
