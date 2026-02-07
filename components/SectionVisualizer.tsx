
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
            links: [], 
            grid: [],
            columns: [], 
            task: null, 
            agent: { state: 'idle', t: 0, heldBox: null, armHeight: 0, armExt: 0 },
            boxes: [], 
            stack: [],
            // Identity Mode State
            cards: [],
            spawnTimer: 0,
            // Logic/Strategy Mode State
            packets: [],
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
            state.packets = [];
            state.agent = { state: 'idle', t: 0, heldBox: null, armHeight: 0, armExt: 0 };
            
            // Identity specific
            state.cards = [];
            state.spawnTimer = 0;

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
                // STRATEGY BUILDER: Concrete Flowchart Layout
                // Layer 1: Inputs
                state.nodes.push({ id: 0, x: w * 0.15, y: h * 0.3, label: "DEMAND SPIKE", type: 'trigger', active: 0 });
                state.nodes.push({ id: 1, x: w * 0.15, y: h * 0.7, label: "INVENTORY LOW", type: 'trigger', active: 0 });
                
                // Layer 2: Logic/Process
                state.nodes.push({ id: 2, x: w * 0.45, y: h * 0.5, label: "ALLOCATION LOGIC", type: 'process', active: 0 });
                
                // Layer 3: Decision/Action
                state.nodes.push({ id: 3, x: w * 0.75, y: h * 0.25, label: "PRIORITY: RETAIL", type: 'action', active: 0 });
                state.nodes.push({ id: 4, x: w * 0.75, y: h * 0.75, label: "LIMIT WHOLESALE", type: 'action', active: 0 });

                // Edges
                state.links.push({ from: 0, to: 2 });
                state.links.push({ from: 1, to: 2 });
                state.links.push({ from: 2, to: 3 });
                state.links.push({ from: 2, to: 4 });
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
        };

        const render = () => {
            time += 0.007; // SLOWED DOWN BY 30%
            const w = state.width;
            const h = state.height;
            const cx = w/2;
            const cy = h/2;

            ctx.clearRect(0, 0, w, h);
            
            // ... (Keeping existing render logic for other modes) ...
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
                // --- STRATEGY BUILDER ---
                
                // Spawn Packets
                if (Math.random() > 0.98) {
                    const startNodes = state.nodes.filter((n: any) => n.type === 'trigger');
                    const start = startNodes[Math.floor(Math.random() * startNodes.length)];
                    state.nodes.forEach((n: any) => { if(n.id === start.id) n.active = 1.0; });
                    
                    // Find links from this start
                    const links = state.links.filter((l: any) => l.from === start.id);
                    links.forEach((l: any) => {
                        state.packets.push({
                            fromId: l.from, toId: l.to, progress: 0, speed: 0.02 + Math.random() * 0.01
                        });
                    });
                }

                // Draw Links
                ctx.lineWidth = 2;
                state.links.forEach((l: any) => {
                    const n1 = state.nodes.find((n: any) => n.id === l.from);
                    const n2 = state.nodes.find((n: any) => n.id === l.to);
                    
                    const grad = ctx.createLinearGradient(n1.x, n1.y, n2.x, n2.y);
                    grad.addColorStop(0, 'rgba(255,255,255,0.1)');
                    grad.addColorStop(1, 'rgba(255,255,255,0.05)');
                    ctx.strokeStyle = grad;
                    
                    // Elbow connector
                    ctx.beginPath();
                    ctx.moveTo(n1.x, n1.y);
                    const midX = (n1.x + n2.x) / 2;
                    ctx.bezierCurveTo(midX, n1.y, midX, n2.y, n2.x, n2.y);
                    ctx.stroke();
                });

                // Draw Packets
                for (let i = state.packets.length - 1; i >= 0; i--) {
                    const p = state.packets[i];
                    p.progress += p.speed;
                    
                    const n1 = state.nodes.find((n: any) => n.id === p.fromId);
                    const n2 = state.nodes.find((n: any) => n.id === p.toId);
                    
                    // Bezier calc matching link
                    const midX = (n1.x + n2.x) / 2;
                    const t = p.progress;
                    const invT = 1 - t;
                    
                    // Cubic Bezier formula: (1-t)^3*P0 + 3*(1-t)^2*t*P1 + 3*(1-t)*t^2*P2 + t^3*P3
                    // Control points: P0=(n1.x, n1.y), P1=(midX, n1.y), P2=(midX, n2.y), P3=(n2.x, n2.y)
                    
                    const x = invT*invT*invT*n1.x + 3*invT*invT*t*midX + 3*invT*t*t*midX + t*t*t*n2.x;
                    const y = invT*invT*invT*n1.y + 3*invT*invT*t*n1.y + 3*invT*t*t*n2.y + t*t*t*n2.y;

                    ctx.fillStyle = color;
                    ctx.shadowBlur = 10; ctx.shadowColor = color;
                    ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI*2); ctx.fill();
                    ctx.shadowBlur = 0;

                    if (p.progress >= 1) {
                        // Trigger destination node
                        n2.active = 1.0;
                        
                        // Propagate
                        const nextLinks = state.links.filter((l: any) => l.from === n2.id);
                        nextLinks.forEach((l: any) => {
                            state.packets.push({ fromId: l.from, toId: l.to, progress: 0, speed: 0.02 });
                        });
                        
                        state.packets.splice(i, 1);
                    }
                }

                // Draw Nodes
                state.nodes.forEach((n: any) => {
                    const isActive = n.active > 0.01;
                    if (n.active > 0) n.active *= 0.95;

                    ctx.save();
                    ctx.translate(n.x, n.y);
                    
                    // Node Shape
                    if (n.type === 'trigger') {
                        // Diamond
                        ctx.fillStyle = isActive ? color : '#1a1a1c';
                        ctx.strokeStyle = isActive ? '#fff' : 'rgba(255,255,255,0.2)';
                        ctx.beginPath(); ctx.moveTo(0, -20); ctx.lineTo(20, 0); ctx.lineTo(0, 20); ctx.lineTo(-20, 0); ctx.closePath();
                    } else if (n.type === 'process') {
                        // Rectangle
                        ctx.fillStyle = isActive ? color : '#1a1a1c';
                        ctx.strokeStyle = isActive ? '#fff' : 'rgba(255,255,255,0.2)';
                        ctx.beginPath(); ctx.roundRect(-40, -20, 80, 40, 4);
                    } else {
                        // Pill (Action)
                        ctx.fillStyle = isActive ? color : '#1a1a1c';
                        ctx.strokeStyle = isActive ? '#fff' : 'rgba(255,255,255,0.2)';
                        ctx.beginPath(); ctx.roundRect(-30, -15, 60, 30, 15);
                    }
                    
                    ctx.globalAlpha = isActive ? 0.8 : 0.5;
                    ctx.fill();
                    ctx.globalAlpha = 1;
                    ctx.lineWidth = 1;
                    ctx.stroke();

                    // Label
                    ctx.fillStyle = '#fff';
                    ctx.font = '9px monospace';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    // ctx.fillText(n.label, 0, 30); // Below node
                    
                    // Draw Label Box
                    const textW = ctx.measureText(n.label).width;
                    ctx.fillStyle = 'rgba(0,0,0,0.6)';
                    ctx.fillRect(-textW/2 - 4, 22, textW + 8, 14);
                    ctx.fillStyle = isActive ? color : '#888';
                    ctx.fillText(n.label, 0, 29);

                    ctx.restore();
                });
            }
            else if (mode === 'core') {
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
                const beltY = h * 0.65; // Base input level (Centered Lower)
                const inputEnd = w * 0.45;
                const outputStart = w * 0.55;
                const agentX = w * 0.5;
                const agentBaseY = beltY + 40;
                
                const boxSize = 18;
                const speed = 1.0; // Slower conveyor
                const animSpeed = 0.03;

                const COLORS = ['#22d3ee', '#a78bfa', '#fbbf24']; // Cyan, Purple, Amber
                const TARGET_YS = [beltY - 80, beltY - 40, beltY];

                const lastBox = state.boxes.length > 0 ? state.boxes[state.boxes.length - 1] : null;
                const safeToSpawn = !lastBox || (lastBox.x > 80); 

                if (safeToSpawn && Math.random() > 0.99) {
                    const typeIdx = Math.floor(Math.random() * 3);
                    state.boxes.push({
                        x: -20,
                        y: beltY - boxSize,
                        w: boxSize,
                        h: boxSize,
                        color: COLORS[typeIdx],
                        targetLane: typeIdx,
                        state: 'conveyor_in' // conveyor_in, lifted, conveyor_out
                    });
                }

                ctx.fillStyle = 'rgba(255,255,255,0.1)';
                ctx.fillRect(0, beltY, inputEnd, 4);
                TARGET_YS.forEach(y => {
                    ctx.fillRect(outputStart, y + boxSize, w - outputStart, 4);
                });

                ctx.fillStyle = 'rgba(255,255,255,0.2)';
                const dashOffset = (time * 60) % 40; 
                for(let i=0; i<inputEnd; i+=40) {
                    const x = i + dashOffset;
                    if(x < inputEnd) ctx.fillRect(x, beltY, 4, 4);
                }
                TARGET_YS.forEach(y => {
                    for(let i=outputStart; i<w; i+=40) {
                        const x = i + dashOffset; 
                        if(x > outputStart) ctx.fillRect(x, y + boxSize, 4, 4);
                    }
                });

                const agent = state.agent;
                ctx.fillStyle = '#333';
                ctx.fillRect(agentX - 15, agentBaseY - 20, 30, 20); 
                
                const pivotX = agentX;
                const pivotY = agentBaseY - 20;

                let armX = pivotX;
                let armY = beltY - 60; // Idle height
                let grabberGap = 10;

                if (agent.state === 'idle') {
                    const target = state.boxes.find((b: any) => 
                        b.state === 'conveyor_in' && 
                        b.x > inputEnd - 60 && 
                        b.x < inputEnd
                    );
                    if (target) {
                        agent.state = 'reaching';
                        agent.targetBox = target;
                        agent.t = 0;
                    }
                }

                if (agent.state === 'reaching') {
                    agent.t += animSpeed;
                    const t = Math.min(1, agent.t);
                    const b = agent.targetBox;
                    if(b.x < inputEnd - 20) b.x += speed;
                    armX = pivotX + (b.x + b.w/2 - pivotX) * t;
                    armY = (pivotY - 80) + (b.y - (pivotY - 80)) * t;
                    if (t >= 1) { agent.state = 'grasping'; agent.t = 0; }
                } 
                else if (agent.state === 'grasping') {
                    agent.t += animSpeed * 2;
                    grabberGap = 10 * (1 - Math.min(1, agent.t));
                    armX = agent.targetBox.x + agent.targetBox.w/2;
                    armY = agent.targetBox.y;
                    if (agent.t >= 1) { agent.state = 'moving'; agent.targetBox.state = 'lifted'; agent.t = 0; }
                }
                else if (agent.state === 'moving') {
                    agent.t += animSpeed;
                    const t = Math.min(1, agent.t);
                    const b = agent.targetBox;
                    const targetY = TARGET_YS[b.targetLane];
                    
                    const startX = inputEnd - 20;
                    const targetX = outputStart + 20;
                    
                    armX = startX + (targetX - startX) * t;
                    const midY = Math.min(beltY, targetY) - 60;
                    armY = (1-t)*(1-t)*beltY + 2*(1-t)*t*midY + t*t*targetY;
                    
                    grabberGap = 0;
                    b.x = armX - b.w/2;
                    b.y = armY;

                    if (t >= 1) { agent.state = 'releasing'; agent.t = 0; }
                }
                else if (agent.state === 'releasing') {
                    agent.t += animSpeed * 2;
                    const b = agent.targetBox;
                    armX = b.x + b.w/2;
                    armY = b.y;
                    grabberGap = 10 * Math.min(1, agent.t);
                    
                    if (agent.t >= 1) {
                        b.state = 'conveyor_out';
                        b.y = TARGET_YS[b.targetLane];
                        agent.state = 'returning';
                        agent.targetBox = null;
                        agent.t = 0;
                    }
                }
                else if (agent.state === 'returning') {
                    agent.t += animSpeed;
                    const t = Math.min(1, agent.t);
                    const startX = outputStart + 20;
                    const startY = armY;
                    const targetX = pivotX;
                    const targetY = beltY - 60;
                    armX = startX + (targetX - startX) * t;
                    armY = startY + (targetY - startY) * t;
                    if (t >= 1) agent.state = 'idle';
                }
                else {
                    armX = pivotX + Math.sin(time * 2) * 5;
                    armY = beltY - 60 + Math.cos(time * 3) * 5;
                }

                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(pivotX, pivotY);
                const elbowX = (pivotX + armX) / 2 - 20; 
                const elbowY = Math.min(pivotY, armY) - 30;
                ctx.quadraticCurveTo(elbowX, elbowY, armX, armY);
                ctx.stroke();
                
                ctx.fillStyle = '#fff';
                ctx.beginPath(); ctx.arc(pivotX, pivotY, 3, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(armX, armY, 3, 0, Math.PI*2); ctx.fill();
                
                ctx.save();
                ctx.translate(armX, armY);
                ctx.fillStyle = color;
                ctx.fillRect(-8 - grabberGap/2, -5, 4, 15);
                ctx.fillRect(4 + grabberGap/2, -5, 4, 15);
                ctx.restore();

                for (let i = state.boxes.length - 1; i >= 0; i--) {
                    const b = state.boxes[i];
                    if (b.state === 'conveyor_in') {
                        if (agent.targetBox !== b || agent.state === 'reaching') {
                             if (b.x < inputEnd - 20) b.x += speed; 
                        }
                    } else if (b.state === 'conveyor_out') {
                        b.x += speed;
                    }
                    if (b.x > w + 20) { state.boxes.splice(i, 1); continue; }

                    ctx.fillStyle = b.color;
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = 1;
                    ctx.fillRect(b.x, b.y, b.w, b.h);
                    ctx.strokeRect(b.x, b.y, b.w, b.h);
                    ctx.fillStyle = 'rgba(0,0,0,0.3)';
                    ctx.fillRect(b.x + 2, b.y + 2, 4, 4);
                }
            }
            else if (mode === 'translation') {
                const colWidth = 140; 
                const numCols = 2; 
                const SNIPPETS = ["POST /api/v1/ingest", "{ id: '8f3a' }", "WARN: Latency", "Converting...", "0x4F3E21", "SELECT * FROM logs", "Processing...", "struct Node", "ERROR: Timeout", "> System.init()"];

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
                    col.y -= col.speed;
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
                    ctx.strokeStyle = color; ctx.globalAlpha = cell.alpha; ctx.lineWidth = 1;
                    ctx.strokeRect(cell.x - s/2, cell.y - s/2, s, s);
                    if (cell.filled) {
                        ctx.fillStyle = color; ctx.globalAlpha = cell.alpha * 0.6;
                        ctx.fillRect(cell.x - s/2 + 2, cell.y - s/2 + 2, s - 4, s - 4);
                        if (Math.random() > 0.995) cell.filled = false;
                    }
                });
            }
            else if (mode === 'identity') {
                // --- WORKFORCE AUGMENTATION: KNOWLEDGE CARDS ---
                
                // Spawn logic
                state.spawnTimer++;
                if (state.spawnTimer > 120) { // Every ~2 seconds
                    state.spawnTimer = 0;
                    state.cards.push({
                        x: w + 200,
                        y: h / 2,
                        targetX: w / 2,
                        state: 'entering', // entering -> scanning -> exiting
                        scanProgress: 0,
                        id: Math.floor(Math.random() * 9000) + 1000,
                        role: Math.random() > 0.5 ? 'OPERATOR' : 'ANALYST',
                        topic: Math.random() > 0.5 ? 'SAFETY_PROTO' : 'OPTIMIZATION'
                    });
                }

                // Render Cards
                for (let i = 0; i < state.cards.length; i++) {
                    const c = state.cards[i];
                    const CARD_W = 240;
                    const CARD_H = 140;
                    const r = 8; // Border radius

                    // Physics / State
                    if (c.state === 'entering') {
                        c.x += (c.targetX - c.x) * 0.1;
                        if (Math.abs(c.x - c.targetX) < 2) {
                            c.state = 'scanning';
                        }
                    } else if (c.state === 'scanning') {
                        c.scanProgress += 0.015;
                        if (c.scanProgress >= 1) {
                            c.state = 'exiting';
                            c.targetX = -250;
                        }
                    } else if (c.state === 'exiting') {
                        c.x += (c.targetX - c.x) * 0.08;
                        if (c.x < -200) {
                            state.cards.splice(i, 1);
                            i--;
                            continue;
                        }
                    }

                    // Render
                    ctx.save();
                    ctx.translate(c.x, c.y);
                    
                    // Shadow
                    ctx.shadowColor = 'rgba(0,0,0,0.5)';
                    ctx.shadowBlur = 30;
                    ctx.shadowOffsetY = 10;

                    // Card Background
                    ctx.fillStyle = '#121214';
                    ctx.beginPath();
                    ctx.moveTo(-CARD_W/2 + r, -CARD_H/2);
                    ctx.lineTo(-CARD_W/2 + CARD_W - r, -CARD_H/2);
                    ctx.quadraticCurveTo(-CARD_W/2 + CARD_W, -CARD_H/2, -CARD_W/2 + CARD_W, -CARD_H/2 + r);
                    ctx.lineTo(-CARD_W/2 + CARD_W, -CARD_H/2 + CARD_H - r);
                    ctx.quadraticCurveTo(-CARD_W/2 + CARD_W, -CARD_H/2 + CARD_H, -CARD_W/2 + CARD_W - r, -CARD_H/2 + CARD_H);
                    ctx.lineTo(-CARD_W/2 + r, -CARD_H/2 + CARD_H);
                    ctx.quadraticCurveTo(-CARD_W/2, -CARD_H/2 + CARD_H, -CARD_W/2, -CARD_H/2 + CARD_H - r);
                    ctx.lineTo(-CARD_W/2, -CARD_H/2 + r);
                    ctx.quadraticCurveTo(-CARD_W/2, -CARD_H/2, -CARD_W/2 + r, -CARD_H/2);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                    ctx.shadowOffsetY = 0;

                    // Card Border (highlight based on state)
                    ctx.strokeStyle = c.state === 'scanning' ? color : 'rgba(255,255,255,0.1)';
                    ctx.lineWidth = c.state === 'scanning' ? 2 : 1;
                    ctx.stroke();

                    // Content - Header
                    ctx.fillStyle = c.state === 'scanning' || c.state === 'exiting' ? '#fff' : '#888';
                    ctx.font = 'bold 12px monospace';
                    ctx.textAlign = 'left';
                    ctx.fillText(`${c.role} // ${c.topic}`, -CARD_W/2 + 20, -CARD_H/2 + 30);

                    // Content - ID
                    ctx.fillStyle = 'rgba(255,255,255,0.3)';
                    ctx.font = '10px monospace';
                    ctx.fillText(`ID: #${c.id}`, -CARD_W/2 + 20, -CARD_H/2 + 45);

                    // Content - Abstract Body Text Lines
                    ctx.fillStyle = 'rgba(255,255,255,0.1)';
                    ctx.fillRect(-CARD_W/2 + 20, -CARD_H/2 + 65, CARD_W - 40, 6);
                    ctx.fillRect(-CARD_W/2 + 20, -CARD_H/2 + 80, CARD_W - 80, 6);

                    // Scan Bar / Progress
                    if (c.state === 'scanning' || c.state === 'exiting') {
                        const pct = c.state === 'exiting' ? 1 : c.scanProgress;
                        
                        // Progress Track
                        ctx.fillStyle = 'rgba(255,255,255,0.05)';
                        ctx.fillRect(-CARD_W/2 + 20, CARD_H/2 - 30, CARD_W - 40, 4);
                        
                        // Fill
                        ctx.fillStyle = color;
                        ctx.shadowColor = color;
                        ctx.shadowBlur = 10;
                        ctx.fillRect(-CARD_W/2 + 20, CARD_H/2 - 30, (CARD_W - 40) * pct, 4);
                        ctx.shadowBlur = 0;

                        // Status Text
                        ctx.font = 'bold 10px sans-serif';
                        ctx.textAlign = 'right';
                        ctx.fillText(c.state === 'exiting' ? 'KNOWLEDGE SYNCED' : 'AUGMENTING...', CARD_W/2 - 20, CARD_H/2 - 15);
                    }

                    // Scanline Effect (Vertical Laser)
                    if (c.state === 'scanning') {
                        const scanX = -CARD_W/2 + (c.scanProgress * CARD_W);
                        const grad = ctx.createLinearGradient(scanX, -CARD_H/2, scanX + 20, -CARD_H/2);
                        grad.addColorStop(0, 'rgba(255,255,255,0)');
                        grad.addColorStop(0.5, 'rgba(255,255,255,0.1)'); // Shine
                        grad.addColorStop(1, 'rgba(255,255,255,0)');
                        ctx.fillStyle = grad;
                        ctx.fillRect(-CARD_W/2, -CARD_H/2, CARD_W, CARD_H);
                    }

                    ctx.restore();
                }
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
