
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
        const state: any = {
            width: 0,
            height: 0,
            particles: [],
            nodes: [],
            links: [], // For core mode network
            grid: [],
            columns: [], // For translation mode
            task: null, // For swarm mode (legacy ref, reused for agent state)
            agent: { state: 'idle', t: 0, heldBox: null, armHeight: 0, armExt: 0 }, // New Agent State
            boxes: [], // Conveyor items
            stack: [], // Processed items
            initializedMode: null
        };

        const resize = () => {
            const rect = container.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;
            
            ctx.scale(dpr, dpr);
            
            state.width = rect.width;
            state.height = rect.height;
            
            if (mode !== state.initializedMode) {
                init(rect.width, rect.height);
            }
        };

        const init = (w: number, h: number) => {
            state.particles = [];
            state.nodes = [];
            state.links = [];
            state.grid = [];
            state.columns = [];
            state.task = null;
            state.boxes = [];
            state.stack = [];
            state.agent = { state: 'idle', t: 0, heldBox: null, armHeight: 0, armExt: 0 };
            state.initializedMode = mode;

            if (mode === 'search') {
                const particleCount = 80;
                for(let i=0; i<particleCount; i++) {
                    state.particles.push({
                        x: Math.random() * w,
                        y: Math.random() * h,
                        vx: 2 + Math.random() * 1.5,
                        vy: (Math.random() - 0.5) * 0.5,
                        targetLane: Math.floor(Math.random() * 5),
                        size: 0.5 + Math.random() * 0.5
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
            else if (mode === 'core') {
                // NETWORK INITIALIZATION
                state.nodes.push({ x: 0, y: 0, layer: 0, active: 0, angle: 0, r: 0 });
                const rings = [6, 12, 24]; 
                const radii = [60, 120, 180]; 
                rings.forEach((count, ringIdx) => {
                    const radius = radii[ringIdx];
                    for(let i=0; i<count; i++) {
                        const angle = (i / count) * Math.PI * 2;
                        const offset = (Math.random() - 0.5) * 20;
                        state.nodes.push({
                            x: Math.cos(angle) * (radius + offset),
                            y: Math.sin(angle) * (radius + offset),
                            layer: ringIdx + 1,
                            active: 0,
                            angle: angle,
                            r: radius
                        });
                    }
                });
                for(let i=0; i<state.nodes.length; i++) {
                    const n1 = state.nodes[i];
                    if (n1.layer === 1) {
                        state.links.push({ from: 0, to: i });
                    }
                    if (n1.layer < rings.length) {
                        const nextLayerNodes = state.nodes.map((n: any, idx: number) => ({...n, idx})).filter((n: any) => n.layer === n1.layer + 1);
                        nextLayerNodes.sort((a:any, b:any) => {
                            const d1 = Math.abs(a.angle - n1.angle);
                            const d2 = Math.abs(b.angle - n1.angle);
                            return d1 - d2;
                        });
                        if(nextLayerNodes[0]) state.links.push({ from: i, to: nextLayerNodes[0].idx });
                        if(nextLayerNodes[1]) state.links.push({ from: i, to: nextLayerNodes[1].idx });
                    }
                    const sameLayer = state.nodes.map((n: any, idx: number) => ({...n, idx})).filter((n: any) => n.layer === n1.layer && n.idx !== i);
                    let closest = null; let minD = 100;
                    sameLayer.forEach((n: any) => {
                        let d = Math.abs(n.angle - n1.angle);
                        if (d > Math.PI) d = Math.PI * 2 - d; 
                        if (d < minD) { minD = d; closest = n.idx; }
                    });
                    if (closest !== null && i < closest) state.links.push({ from: i, to: closest });
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
            
            if (mode === 'search') {
                const processLine = w * 0.4;
                const laneCount = 5;
                const laneHeight = h / laneCount;
                
                ctx.lineWidth = 1;
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
                for(let i=0; i<laneCount; i++) {
                    const ly = i * laneHeight + laneHeight/2;
                    ctx.beginPath(); ctx.moveTo(processLine, ly); ctx.lineTo(w, ly); ctx.stroke();
                }

                const scannerGlow = ctx.createLinearGradient(processLine, 0, processLine + 60, 0);
                scannerGlow.addColorStop(0, color);
                scannerGlow.addColorStop(1, 'transparent');
                ctx.fillStyle = scannerGlow;
                ctx.globalAlpha = 0.15;
                ctx.fillRect(processLine, 0, 60, h);
                
                ctx.fillStyle = color;
                ctx.globalAlpha = 0.8;
                ctx.fillRect(processLine, 0, 2, h);
                
                state.particles.forEach((p: any) => {
                    p.x += p.vx;
                    if (p.x < processLine) {
                        p.y += p.vy;
                        if (p.y < 0) p.y += h;
                        if (p.y > h) p.y -= h;
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                        ctx.globalAlpha = 0.6;
                        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI*2); ctx.fill();
                    } else {
                        const targetY = p.targetLane * laneHeight + laneHeight/2;
                        p.y += (targetY - p.y) * 0.15; 
                        p.x += 1.5; 
                        ctx.fillStyle = color;
                        ctx.globalAlpha = 1;
                        const packetWidth = 20 * p.size;
                        const packetHeight = 4;
                        ctx.shadowColor = color; ctx.shadowBlur = 10;
                        ctx.fillRect(p.x, p.y - packetHeight/2, packetWidth, packetHeight);
                        ctx.shadowBlur = 0;
                    }
                    if (p.x > w + 50) {
                        p.x = -20;
                        p.y = Math.random() * h;
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
                ctx.fillStyle = 'rgba(255,255,255,0.1)';
                state.nodes.forEach((n: any) => {
                    ctx.beginPath(); ctx.arc(n.x, n.y, 4, 0, Math.PI*2); ctx.fill();
                });
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
                // KNOWLEDGE NETWORK (Mesh)
                if (Math.random() > 0.96) {
                    state.nodes[0].active = 1; 
                    const startLink = state.links.filter((l: any) => l.from === 0)[Math.floor(Math.random() * 6)];
                    if (startLink) {
                        state.particles.push({
                            linkIdx: state.links.indexOf(startLink),
                            t: 0,
                            speed: 0.08
                        });
                    }
                }

                ctx.translate(cx, cy);
                ctx.rotate(time * 0.05);

                ctx.strokeStyle = 'rgba(255,255,255,0.08)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                state.links.forEach((l: any) => {
                    const n1 = state.nodes[l.from];
                    const n2 = state.nodes[l.to];
                    ctx.moveTo(n1.x, n1.y);
                    ctx.lineTo(n2.x, n2.y);
                });
                ctx.stroke();

                state.nodes.forEach((n:any) => {
                    if (n.active > 0) {
                        ctx.fillStyle = color;
                        ctx.shadowBlur = 10 * n.active;
                        ctx.shadowColor = color;
                        n.active -= 0.05;
                    } else {
                        ctx.fillStyle = n.layer === 0 ? color : 'rgba(255,255,255,0.3)';
                        ctx.shadowBlur = 0;
                    }
                    const size = n.layer === 0 ? 4 : 2;
                    ctx.beginPath(); ctx.arc(n.x, n.y, size, 0, Math.PI*2); ctx.fill();
                    ctx.shadowBlur = 0;
                });

                for(let i=state.particles.length-1; i>=0; i--) {
                    const p = state.particles[i];
                    p.t += p.speed;
                    const link = state.links[p.linkIdx];
                    if (!link) { state.particles.splice(i,1); continue; }
                    const n1 = state.nodes[link.from];
                    const n2 = state.nodes[link.to];
                    const currX = n1.x + (n2.x - n1.x) * p.t;
                    const currY = n1.y + (n2.y - n1.y) * p.t;
                    ctx.fillStyle = '#fff';
                    ctx.shadowBlur = 5; ctx.shadowColor = '#fff';
                    ctx.fillRect(currX-1.5, currY-1.5, 3, 3);
                    ctx.shadowBlur = 0;
                    if (p.t >= 1) {
                        n2.active = 1;
                        if (n2.layer < 3 && Math.random() > 0.3) {
                            const nextLinks = state.links.map((l: any, idx: number) => ({...l, idx})).filter((l: any) => l.from === link.to);
                            if (nextLinks.length > 0) {
                                const nextL = nextLinks[Math.floor(Math.random() * nextLinks.length)];
                                state.particles.push({ linkIdx: nextL.idx, t: 0, speed: 0.08 });
                            }
                        }
                        state.particles.splice(i, 1);
                    }
                }
                ctx.rotate(-time * 0.05);
                ctx.translate(-cx, -cy);
            }
            else if (mode === 'swarm') {
                // BRIDGE AI: Conveyor Belt & Agent
                const beltY = h * 0.75;
                const agentX = w * 0.6;
                const boxSize = 24;
                const speed = 2;

                // 1. Spawn Boxes (Left side)
                if (Math.random() > 0.985) {
                    state.boxes.push({
                        x: -50,
                        y: beltY - boxSize,
                        w: boxSize,
                        h: boxSize,
                        state: 'conveyor', // conveyor, lifted, processed
                        type: Math.random() > 0.8 ? 'priority' : 'normal'
                    });
                }

                // 2. Draw Conveyor Belt
                ctx.fillStyle = 'rgba(255,255,255,0.1)';
                ctx.fillRect(0, beltY, w, 4);
                
                // Moving dashes on belt
                ctx.fillStyle = 'rgba(255,255,255,0.2)';
                const dashOffset = (time * 100) % 40;
                for(let i=0; i<w; i+=40) {
                    ctx.fillRect(i + dashOffset - 40, beltY, 4, 4);
                }

                // 3. Agent Logic
                const agent = state.agent;
                // Agent Base
                ctx.fillStyle = '#333';
                ctx.fillRect(agentX - 10, beltY + 10, 20, 20); // Base pedestal
                
                // Arm Pivot
                const pivotX = agentX;
                const pivotY = beltY + 10;
                
                // Identify target box
                if (agent.state === 'idle') {
                    // Look for box near pickup zone (agentX - 50)
                    const target = state.boxes.find((b: any) => b.state === 'conveyor' && b.x > agentX - 80 && b.x < agentX - 20);
                    if (target) {
                        agent.state = 'reaching';
                        agent.targetBox = target;
                        agent.t = 0;
                    }
                }

                // Agent Animation State Machine
                let armX = pivotX;
                let armY = pivotY - 40; // Default rest height
                let grabberOpen = 10; 

                if (agent.state === 'reaching') {
                    agent.t += 0.05;
                    const t = Math.min(1, agent.t);
                    const b = agent.targetBox;
                    
                    // IK-ish movement to box
                    armX = pivotX + (b.x + b.w/2 - pivotX) * t;
                    armY = (pivotY - 60) + (b.y - (pivotY - 60)) * t; // Arc down? No, straight reach for industrial look
                    
                    if (t >= 1) {
                        agent.state = 'lifting';
                        agent.t = 0;
                        b.state = 'lifted';
                    }
                } else if (agent.state === 'lifting') {
                    agent.t += 0.04;
                    const t = Math.min(1, agent.t);
                    const b = agent.targetBox;
                    
                    // Move box to stack position (Right of agent)
                    const stackX = agentX + 80;
                    const stackY = beltY - boxSize * (state.stack.length + 1); // Stack upwards
                    
                    armX = pivotX + (stackX - pivotX) * t; // Swing right
                    armY = (pivotY - 60) - 40 * Math.sin(t * Math.PI); // Arc up
                    
                    // Update box pos to follow arm
                    b.x = armX - b.w/2;
                    b.y = armY + 10; 
                    grabberOpen = 0; // Closed

                    if (t >= 1) {
                        // Drop
                        b.state = 'processed';
                        b.y = stackY;
                        state.stack.push(b);
                        // Remove from active boxes list? No, keep it there but static
                        state.agent.targetBox = null;
                        state.agent.state = 'returning';
                        state.agent.t = 0;
                    }
                } else if (agent.state === 'returning') {
                    agent.t += 0.05;
                    const t = Math.min(1, agent.t);
                    // Return to idle hover
                    const idleX = agentX;
                    const idleY = beltY - 60;
                    
                    armX = (agentX + 80) + (idleX - (agentX + 80)) * t;
                    armY = (beltY - 60) - 20 * Math.sin(t * Math.PI);
                    
                    if (t >= 1) {
                        agent.state = 'idle';
                    }
                } else {
                    // Idle Hover
                    armX = agentX;
                    armY = beltY - 60 + Math.sin(time * 5) * 5;
                }

                // Draw Agent Arm
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                
                // Shoulder to Elbow
                ctx.beginPath();
                ctx.moveTo(pivotX, pivotY);
                ctx.lineTo(pivotX, armY - 20); // Vertical stem
                ctx.lineTo(armX, armY); // Forearm
                ctx.stroke();
                
                // Joint
                ctx.fillStyle = '#fff';
                ctx.beginPath(); ctx.arc(pivotX, pivotY, 3, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(pivotX, armY - 20, 3, 0, Math.PI*2); ctx.fill();
                
                // Grabber
                ctx.strokeRect(armX - 6 - grabberOpen/2, armY, 4, 10);
                ctx.strokeRect(armX + 2 + grabberOpen/2, armY, 4, 10);


                // 4. Update & Draw Boxes
                for (let i = state.boxes.length - 1; i >= 0; i--) {
                    const b = state.boxes[i];
                    
                    if (b.state === 'conveyor') {
                        b.x += speed;
                        if (b.x > w) {
                            state.boxes.splice(i, 1); // Remove if missed
                            continue;
                        }
                    } else if (b.state === 'processed') {
                        // Stack decay logic (if stack gets too high, remove bottom)
                        if (state.stack.length > 5) {
                             state.stack.shift(); // Remove oldest
                             // Shift y of others down? 
                             state.stack.forEach((sb: any, idx: number) => {
                                 sb.y = beltY - boxSize * (idx + 1);
                             });
                             // Remove this box from main array if it was the shifted one
                             if (!state.stack.includes(b)) {
                                 state.boxes.splice(i, 1);
                                 continue;
                             }
                        }
                    }

                    // Draw Box
                    ctx.fillStyle = b.state === 'processed' ? color : (b.type === 'priority' ? '#ef4444' : 'rgba(255,255,255,0.2)');
                    ctx.strokeStyle = b.state === 'processed' ? '#fff' : color;
                    ctx.lineWidth = 1;
                    
                    ctx.fillRect(b.x, b.y, b.w, b.h);
                    ctx.strokeRect(b.x, b.y, b.w, b.h);
                    
                    // Label
                    if (b.state === 'processed') {
                        ctx.fillStyle = '#fff';
                        ctx.fillRect(b.x + 8, b.y + 8, 8, 8); // "Data" icon
                    }
                }
            }
            else if (mode === 'translation') {
                // KNOWLEDGE CAPTURE (Code Ingestion)
                const colWidth = 140; 
                const numCols = 2; 
                
                const SNIPPETS = [
                    "POST /api/v1/ingest HTTP/1.1",
                    "{ id: '8f3a', type: 'blob' }",
                    "WARN: Latency > 200ms",
                    "Converting stream...",
                    "0x4F3E21 0x0021FF",
                    "SELECT * FROM raw_logs",
                    "Processing batch #4921",
                    "struct Node { val: i32 }",
                    "ERROR: Timeout (retry 1)",
                    "> System.init()",
                    "import { transform } from 'etl'",
                    "User_Agent: Mozilla/5.0",
                    "Connection: Keep-Alive"
                ];

                if (state.columns.length === 0) {
                    state.columns = Array.from({ length: numCols }, (_, i) => ({
                        x: 20 + i * (colWidth + 10),
                        y: Math.random() * h,
                        speed: 0.5 + Math.random() * 0.5,
                        items: Array.from({ length: 15 }, () => ({
                            text: SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)],
                            y: 0 
                        }))
                    }));
                }

                // Grid Init
                const gridStartX = w * 0.55;
                const gridCols = 6; const gridRows = 8;
                const cellW = (w * 0.4) / gridCols; const cellH = h / gridRows;
                if (state.grid.length === 0) {
                    for(let i=0; i<gridCols*gridRows; i++) {
                        state.grid.push({
                            x: gridStartX + (i % gridCols) * cellW + cellW/2,
                            y: Math.floor(i / gridCols) * cellH + cellH/2,
                            filled: false, alpha: 0.2
                        });
                    }
                }

                ctx.font = '10px monospace';
                ctx.textAlign = 'left';
                
                state.columns.forEach((col: any) => {
                    col.y -= col.speed; // Scroll UP
                    if (col.y < -300) col.y = h; 

                    col.items.forEach((item: any, i: number) => {
                        const yPos = col.y + i * 20;
                        const drawnY = yPos % (h + 300) - 50;
                        
                        if (drawnY > -20 && drawnY < h + 20) {
                            const isScanned = Math.abs(drawnY - h/2) < 20;
                            
                            ctx.fillStyle = isScanned ? '#fff' : 'rgba(255,255,255,0.3)';
                            if (isScanned) {
                                if (Math.random() > 0.98) {
                                    const empty = state.grid.filter((g: any) => !g.filled);
                                    if (empty.length > 0) {
                                        const t = empty[Math.floor(Math.random() * empty.length)];
                                        t.filled = true;
                                        state.particles.push({
                                            x: col.x + 80, y: drawnY,
                                            tx: t.x, ty: t.y,
                                            progress: 0, speed: 0.05,
                                            target: t
                                        });
                                    }
                                }
                            }
                            ctx.fillText(item.text, col.x, drawnY);
                        }
                    });
                });

                ctx.fillStyle = color;
                ctx.globalAlpha = 0.1;
                ctx.fillRect(0, h/2 - 20, w * 0.45, 40);
                ctx.globalAlpha = 0.8;
                ctx.fillRect(0, h/2, w * 0.45, 1);

                ctx.globalAlpha = 1;
                for (let i = state.particles.length - 1; i >= 0; i--) {
                    const p = state.particles[i];
                    p.progress += p.speed;
                    const t = p.progress;
                    const lx = p.x + (p.tx - p.x) * t;
                    const ly = p.y + (p.ty - p.y) * t;

                    ctx.fillStyle = color;
                    ctx.fillRect(lx - 2, ly - 2, 4, 4);
                    
                    if (p.progress >= 1) {
                        p.target.alpha = 1.0;
                        state.particles.splice(i, 1);
                    }
                }

                state.grid.forEach((cell: any) => {
                    if (cell.filled) cell.alpha = Math.max(0.4, cell.alpha - 0.02);
                    else cell.alpha = 0.1;
                    
                    const s = Math.min(cellW, cellH) * 0.6;
                    ctx.strokeStyle = color;
                    ctx.globalAlpha = cell.alpha;
                    ctx.lineWidth = 1;
                    ctx.strokeRect(cell.x - s/2, cell.y - s/2, s, s);
                    
                    if (cell.filled) {
                        ctx.fillStyle = color;
                        ctx.globalAlpha = cell.alpha * 0.6;
                        ctx.fillRect(cell.x - s/2 + 2, cell.y - s/2 + 2, s - 4, s - 4);
                        if (Math.random() > 0.995) cell.filled = false;
                    }
                });
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

        const observer = new ResizeObserver(() => { resize(); });
        observer.observe(container);
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
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }} />
        </div>
    );
};
