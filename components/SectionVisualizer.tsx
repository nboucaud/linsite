
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
            columns: [], // For translation mode
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
            state.columns = [];
            state.initializedMode = mode;

            if (mode === 'search') {
                // DATA MODERNIZATION: Chaos to Order
                const particleCount = 80;
                for(let i=0; i<particleCount; i++) {
                    state.particles.push({
                        x: Math.random() * w,
                        y: Math.random() * h,
                        vx: 2 + Math.random() * 1.5, // Faster base speed
                        vy: (Math.random() - 0.5) * 0.5, // Subtle drift
                        targetLane: Math.floor(Math.random() * 5), // 5 Clean Lanes
                        size: 0.5 + Math.random() * 0.5 // Base size
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
                // Initial setup handled dynamically in render to adapt to resizing
            }
            else if (mode === 'core') {
                // Initial setup handled dynamically in render to ensure center consistency
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
                const processLine = w * 0.4; // Scanner position
                const laneCount = 5;
                const laneHeight = h / laneCount;
                
                // 1. Draw Architecture (Right Side Grid)
                ctx.lineWidth = 1;
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'; // Subtle grid
                for(let i=0; i<laneCount; i++) {
                    const ly = i * laneHeight + laneHeight/2;
                    ctx.beginPath();
                    ctx.moveTo(processLine, ly);
                    ctx.lineTo(w, ly);
                    ctx.stroke();
                }

                // 2. Draw Strategy Layer (The Scanner Beam)
                const beamWidth = 2;
                // Beam Glow
                const scannerGlow = ctx.createLinearGradient(processLine, 0, processLine + 60, 0);
                scannerGlow.addColorStop(0, color);
                scannerGlow.addColorStop(1, 'transparent');
                ctx.fillStyle = scannerGlow;
                ctx.globalAlpha = 0.15;
                ctx.fillRect(processLine, 0, 60, h);
                
                // Solid Beam
                ctx.fillStyle = color;
                ctx.globalAlpha = 0.8;
                ctx.fillRect(processLine, 0, beamWidth, h);
                
                // 3. Process Data
                state.particles.forEach((p: any) => {
                    p.x += p.vx;
                    
                    if (p.x < processLine) {
                        // --- INPUT PHASE: RAW DATA ---
                        // Drifting, unstructured
                        p.y += p.vy;
                        
                        // Bounce off vertical bounds to keep in view
                        if (p.y < 0) p.y += h;
                        if (p.y > h) p.y -= h;
                        
                        // Visual: Faint, raw data points
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                        ctx.globalAlpha = 0.6;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI*2);
                        ctx.fill();
                        
                    } else {
                        // --- OUTPUT PHASE: STRUCTURED ASSETS ---
                        const targetY = p.targetLane * laneHeight + laneHeight/2;
                        
                        // Magnetic Snap to Architecture
                        const snapStrength = 0.15;
                        p.y += (targetY - p.y) * snapStrength; 
                        
                        // Acceleration post-process
                        p.x += 1.5; 

                        // Visual: High-Fidelity Data Packets
                        ctx.fillStyle = color;
                        ctx.globalAlpha = 1;
                        
                        // Packet Shape (Rectangle with rounded feel)
                        const packetWidth = 20 * p.size;
                        const packetHeight = 4;
                        
                        // Glow Effect
                        ctx.shadowColor = color;
                        ctx.shadowBlur = 10;
                        ctx.fillRect(p.x, p.y - packetHeight/2, packetWidth, packetHeight);
                        ctx.shadowBlur = 0;
                        
                        // Trailing Data Stream
                        if (Math.abs(p.y - targetY) < 1) {
                            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                            ctx.fillRect(p.x - packetWidth - 2, p.y - 1, 2, 2); // Little bits following
                        }
                    }

                    // Loop
                    if (p.x > w + 50) {
                        p.x = -20;
                        p.y = Math.random() * h;
                        // Randomize slightly for next pass
                        p.vx = 2 + Math.random() * 1.5;
                        p.targetLane = Math.floor(Math.random() * laneCount);
                    }
                });
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
                // KNOWLEDGE TREES: Radial Dependency Graph
                // Represents data linking to rules, linking to outcomes.

                // 1. Initialize Graph Structure (If empty)
                if (state.nodes.length === 0) {
                    // Root Node (Center)
                    state.nodes.push({ x: 0, y: 0, layer: 0, active: 0 });
                    
                    // Layer 1 (Primary Branches)
                    const l1Count = 6;
                    for(let i=0; i<l1Count; i++) {
                        const angle = (i / l1Count) * Math.PI * 2;
                        const r = 50;
                        state.nodes.push({ 
                            x: Math.cos(angle) * r, 
                            y: Math.sin(angle) * r, 
                            layer: 1, 
                            parent: 0,
                            active: 0
                        });
                    }
                    // Layer 2 (Secondary Nodes)
                    const l1Nodes = state.nodes.filter((n:any) => n.layer === 1);
                    l1Nodes.forEach((p:any, i:number) => {
                        const parentIdx = i + 1; // Index in main array
                        const pAngle = Math.atan2(p.y, p.x);
                        // Fan out 3 children per L1 node
                        for(let j=0; j<3; j++) {
                            const angle = pAngle + (j-1) * 0.5;
                            const r = 110;
                            state.nodes.push({
                                x: Math.cos(angle) * r,
                                y: Math.sin(angle) * r,
                                layer: 2,
                                parent: parentIdx,
                                active: 0
                            });
                        }
                    });
                }

                // 2. Logic: Pulse Root to emit signals
                if (Math.random() > 0.96) {
                    // Flash root
                    state.nodes[0].active = 1;
                    // Send signals to all L1 nodes
                    for(let i=1; i<=6; i++) {
                        state.particles.push({
                            from: 0, 
                            to: i, 
                            t: 0, 
                            speed: 0.05
                        });
                    }
                }

                // 3. Render
                ctx.translate(cx, cy);
                // Slowly rotate the entire graph for dynamism
                ctx.rotate(time * 0.1);

                // Draw Edges
                ctx.strokeStyle = 'rgba(255,255,255,0.1)';
                ctx.lineWidth = 1;
                state.nodes.forEach((n:any) => {
                    if (n.parent !== undefined) {
                        const p = state.nodes[n.parent];
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(n.x, n.y);
                        ctx.stroke();
                    }
                });

                // Draw Nodes
                state.nodes.forEach((n:any) => {
                    // Decay active state
                    if (n.active > 0) {
                        ctx.fillStyle = color;
                        ctx.shadowBlur = 15 * n.active;
                        ctx.shadowColor = color;
                        n.active -= 0.05;
                    } else {
                        ctx.fillStyle = n.layer === 0 ? color : 'rgba(255,255,255,0.2)';
                        ctx.shadowBlur = 0;
                    }
                    
                    const size = n.layer === 0 ? 5 : (n.layer === 1 ? 3 : 2);
                    ctx.beginPath(); ctx.arc(n.x, n.y, size, 0, Math.PI*2); ctx.fill();
                    ctx.shadowBlur = 0;
                });

                // Update & Draw Signal Packets
                for(let i=state.particles.length-1; i>=0; i--) {
                    const p = state.particles[i];
                    p.t += p.speed;
                    
                    const start = state.nodes[p.from];
                    const end = state.nodes[p.to];
                    
                    const currX = start.x + (end.x - start.x) * p.t;
                    const currY = start.y + (end.y - start.y) * p.t;
                    
                    ctx.fillStyle = '#fff';
                    ctx.shadowBlur = 5; ctx.shadowColor = '#fff';
                    ctx.fillRect(currX-1.5, currY-1.5, 3, 3);
                    ctx.shadowBlur = 0;
                    
                    if (p.t >= 1) {
                        // Hit destination: Trigger flash
                        end.active = 1;
                        
                        // If intermediate node (Layer 1), propagate to children (Layer 2)
                        if (end.layer < 2) {
                            state.nodes.forEach((n:any, idx:number) => {
                                if (n.parent === p.to) {
                                    state.particles.push({ 
                                        from: p.to, 
                                        to: idx, 
                                        t: 0, 
                                        speed: 0.05 + Math.random() * 0.02 
                                    });
                                }
                            });
                        }
                        
                        // Remove finished packet
                        state.particles.splice(i, 1);
                    }
                }

                ctx.rotate(-time * 0.1);
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
                // KNOWLEDGE CAPTURE: Unstructured Stream -> Structured Architecture
                
                // 1. Initialize Columns (Left Side) & Grid (Right Side) if needed
                const colWidth = 15;
                const numCols = Math.floor((w * 0.4) / colWidth);
                
                if (state.columns.length !== numCols) {
                    state.columns = Array.from({ length: numCols }, () => ({
                        y: Math.random() * h,
                        speed: 1 + Math.random() * 2,
                        chars: Array.from({ length: Math.ceil(h/15) }, () => String.fromCharCode(0x30A0 + Math.random() * 96)),
                        active: false
                    }));
                }

                const gridStartX = w * 0.5;
                const gridCols = 6; 
                const gridRows = 8;
                const cellW = (w * 0.4) / gridCols;
                const cellH = h / gridRows;
                const totalCells = gridCols * gridRows;
                
                if (state.grid.length !== totalCells) {
                    state.grid = Array.from({ length: totalCells }, (_, i) => ({
                        x: gridStartX + (i % gridCols) * cellW + cellW/2,
                        y: Math.floor(i / gridCols) * cellH + cellH/2,
                        filled: false,
                        alpha: 0.2
                    }));
                }

                // 2. Render Left Stream (Raw Data)
                ctx.font = '10px monospace';
                ctx.textAlign = 'center';
                
                state.columns.forEach((col: any, i: number) => {
                    const x = i * colWidth + 10;
                    col.y += col.speed;
                    if (col.y > h) col.y = -100;

                    // Draw Char Stream
                    const headRow = Math.floor(col.y / 15);
                    for(let r = 0; r < 8; r++) {
                        const charY = col.y - r * 15;
                        if (charY > 0 && charY < h) {
                            const opacity = 1 - (r / 8);
                            ctx.fillStyle = r === 0 ? '#fff' : 'rgba(255,255,255,0.3)';
                            ctx.globalAlpha = opacity * 0.5;
                            // Flicker char
                            const char = (Math.random() > 0.98) ? String.fromCharCode(0x30A0 + Math.random() * 96) : col.chars[r % col.chars.length];
                            ctx.fillText(char, x, charY);
                        }
                    }

                    // Random Extraction Event
                    if (!col.active && Math.abs(col.y - h/2) < 150 && Math.random() > 0.985) {
                        col.active = true;
                        
                        // Pick empty grid slot
                        const emptySlots = state.grid.filter((g: any) => !g.filled);
                        if (emptySlots.length > 0) {
                            const target = emptySlots[Math.floor(Math.random() * emptySlots.length)];
                            target.filled = true; // Reserve
                            
                            // Spawn Projectile
                            state.particles.push({
                                x: x,
                                y: col.y,
                                tx: target.x,
                                ty: target.y,
                                progress: 0,
                                speed: 0.04 + Math.random() * 0.02,
                                targetIdx: state.grid.indexOf(target)
                            });
                        }
                        
                        setTimeout(() => { col.active = false; }, 600);
                    }
                });

                // 3. Render Extraction Projectiles
                ctx.globalAlpha = 1;
                for (let i = state.particles.length - 1; i >= 0; i--) {
                    const p = state.particles[i];
                    p.progress += p.speed;
                    
                    const dx = p.tx - p.x;
                    const dy = p.ty - p.y;
                    const currX = p.x + dx * p.progress;
                    const currY = p.y + dy * p.progress;
                    
                    // Draw Head
                    ctx.fillStyle = color;
                    ctx.shadowBlur = 10; ctx.shadowColor = color;
                    ctx.fillRect(currX - 2, currY - 2, 4, 4);
                    ctx.shadowBlur = 0;
                    
                    // Draw Trail
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 1;
                    ctx.globalAlpha = 0.3;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(currX, currY);
                    ctx.stroke();
                    ctx.globalAlpha = 1;

                    if (p.progress >= 1) {
                        // Hit
                        const cell = state.grid[p.targetIdx];
                        if (cell) cell.alpha = 1.0;
                        state.particles.splice(i, 1);
                    }
                }

                // 4. Render Structured Grid (Right)
                state.grid.forEach((cell: any) => {
                    if (cell.filled) {
                        cell.alpha = Math.max(0.4, cell.alpha - 0.03); // Decay flash
                    } else {
                        cell.alpha = 0.1;
                    }

                    const size = Math.min(cellW, cellH) * 0.6;
                    
                    ctx.strokeStyle = color;
                    ctx.globalAlpha = cell.alpha;
                    ctx.lineWidth = 1;
                    
                    // Draw Bracket Shape
                    const s2 = size/2;
                    ctx.beginPath();
                    ctx.moveTo(cell.x - s2, cell.y - s2 + 4);
                    ctx.lineTo(cell.x - s2, cell.y - s2);
                    ctx.lineTo(cell.x - s2 + 4, cell.y - s2);
                    
                    ctx.moveTo(cell.x + s2, cell.y + s2 - 4);
                    ctx.lineTo(cell.x + s2, cell.y + s2);
                    ctx.lineTo(cell.x + s2 - 4, cell.y + s2);
                    ctx.stroke();
                    
                    if (cell.filled) {
                        ctx.fillStyle = color;
                        ctx.globalAlpha = cell.alpha * 0.6;
                        ctx.fillRect(cell.x - s2 + 3, cell.y - s2 + 3, size - 6, size - 6);
                        
                        // Occasionally clear filled slots to keep animation going
                        if (Math.random() > 0.998) cell.filled = false;
                    }
                });

                // 5. Separator
                ctx.strokeStyle = 'rgba(255,255,255,0.1)';
                ctx.globalAlpha = 0.3;
                ctx.beginPath(); ctx.moveTo(w * 0.45, 20); ctx.lineTo(w * 0.45, h - 20); ctx.stroke();
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
