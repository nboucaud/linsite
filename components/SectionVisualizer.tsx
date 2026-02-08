
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
        
        // --- HELPER: Polyfill for roundRect ---
        const drawRoundedRect = (x: number, y: number, w: number, h: number, r: number) => {
            if (ctx.roundRect) {
                ctx.beginPath();
                ctx.roundRect(x, y, w, h, r);
                return;
            }
            // Fallback for browsers without roundRect
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.lineTo(x + w - r, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + r);
            ctx.lineTo(x + w, y + h - r);
            ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            ctx.lineTo(x + r, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - r);
            ctx.lineTo(x, y + r);
            ctx.quadraticCurveTo(x, y, x + r, y);
            ctx.closePath();
        };

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
            // Identity Mode (Flashcard) State
            cards: [],
            activeCardIndex: 0,
            swipeProgress: 0, // 0 to 1
            swipeDirection: 1, // 1 = right, -1 = left
            cardState: 'reading', // reading, swiping
            cardTimer: 0,
            // Logic/Strategy Mode State
            packets: [],
            initializedMode: null
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
            
            state.initializedMode = mode;

            if (mode === 'identity') {
                // Initialize Flashcards
                state.cards = [
                    { category: "POLICY_UPDATE", title: "Data Retention", text: "Purge cycles set to 90 days.", color: "#3b82f6" },
                    { category: "WORKFLOW", title: "Approval Chain", text: "New vendor requires VP sign-off.", color: "#10b981" },
                    { category: "COMPLIANCE", title: "PII Detection", text: "Filter updated for EU-West-1.", color: "#f59e0b" },
                    { category: "TRAINING", title: "Phishing Alert", text: "Report suspicious email headers.", color: "#ef4444" },
                    { category: "STRATEGY", title: "Q3 Targets", text: "Focus on retention metrics.", color: "#8b5cf6" }
                ];
                state.activeCardIndex = 0;
                state.cardState = 'reading';
                state.cardTimer = 0;
                state.swipeProgress = 0;
            }
            else if (mode === 'search') {
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
            else if (mode === 'logic') {
                // STRATEGY BUILDER
                state.nodes.push({ id: 0, x: w * 0.15, y: h * 0.3, label: "DEMAND SPIKE", type: 'trigger', active: 0 });
                state.nodes.push({ id: 1, x: w * 0.15, y: h * 0.7, label: "INVENTORY LOW", type: 'trigger', active: 0 });
                state.nodes.push({ id: 2, x: w * 0.45, y: h * 0.5, label: "ALLOCATION LOGIC", type: 'process', active: 0 });
                state.nodes.push({ id: 3, x: w * 0.75, y: h * 0.25, label: "PRIORITY: RETAIL", type: 'action', active: 0 });
                state.nodes.push({ id: 4, x: w * 0.75, y: h * 0.75, label: "LIMIT WHOLESALE", type: 'action', active: 0 });
                state.links.push({ from: 0, to: 2 });
                state.links.push({ from: 1, to: 2 });
                state.links.push({ from: 2, to: 3 });
                state.links.push({ from: 2, to: 4 });
            }
            else if (mode === 'core') {
                // KNOWLEDGE TREE
                state.nodes.push({id:0, x: 0, y: 0, layer: 0});
                const layerCounts = [6, 12, 18];
                let idCounter = 1;
                for(let i=0; i<layerCounts[0]; i++) {
                    const angle = (i / layerCounts[0]) * Math.PI * 2;
                    state.nodes.push({
                        id: idCounter++,
                        x: Math.cos(angle) * 60,
                        y: Math.sin(angle) * 60,
                        layer: 1
                    });
                }
                for(let i=0; i<layerCounts[1]; i++) {
                    const angle = (i / layerCounts[1]) * Math.PI * 2 + 0.2;
                    state.nodes.push({
                        id: idCounter++,
                        x: Math.cos(angle) * 120,
                        y: Math.sin(angle) * 120,
                        layer: 2
                    });
                }
                for(let i=1; i<=layerCounts[0]; i++) {
                    state.links.push({from: 0, to: i});
                }
                for(let i=0; i<layerCounts[1]; i++) {
                    const targetNodeId = 1 + layerCounts[0] + i;
                    const sourceNodeId = 1 + Math.floor(i / 2);
                    if(state.nodes[targetNodeId] && state.nodes[sourceNodeId]) {
                        state.links.push({from: sourceNodeId, to: targetNodeId});
                    }
                }
            }
        };

        const resize = () => {
            const rect = container.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;

            const dpr = window.devicePixelRatio || 1;
            
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;
            
            ctx.scale(dpr, dpr);
            
            state.width = rect.width;
            state.height = rect.height;
            
            if (mode !== state.initializedMode || Math.abs(state.width - rect.width) > 10) {
                init(rect.width, rect.height);
            }
        };

        const render = () => {
            time += 0.01;
            const w = state.width;
            const h = state.height;
            const cx = w/2;
            const cy = h/2;

            ctx.clearRect(0, 0, w, h);
            
            if (mode === 'identity') {
                // --- FLASHCARD ENGINE ---
                
                // Logic
                if (state.cardState === 'reading') {
                    state.cardTimer++;
                    if (state.cardTimer > 180) { // 3 seconds read time
                        state.cardState = 'swiping';
                        state.swipeDirection = Math.random() > 0.5 ? 1 : -1;
                    }
                } else if (state.cardState === 'swiping') {
                    state.swipeProgress += 0.04;
                    if (state.swipeProgress >= 1.5) { // Gone off screen
                        state.cardState = 'reading';
                        state.cardTimer = 0;
                        state.swipeProgress = 0;
                        state.activeCardIndex = (state.activeCardIndex + 1) % state.cards.length;
                    }
                }

                // Drawing Configuration
                const cardW = 180;
                const cardH = 240;
                
                // Draw Background Stack (3 cards)
                for(let i=3; i>0; i--) {
                    const idx = (state.activeCardIndex + i) % state.cards.length;
                    const card = state.cards[idx];
                    
                    const offset = i * 4;
                    const scale = 1 - (i * 0.05);
                    const alpha = 1 - (i * 0.2);
                    
                    ctx.save();
                    ctx.translate(cx, cy + offset);
                    ctx.scale(scale, scale);
                    ctx.globalAlpha = alpha * 0.5;
                    
                    // Card Body
                    ctx.fillStyle = '#1a1a1c';
                    ctx.shadowBlur = 10; ctx.shadowColor = 'rgba(0,0,0,0.5)';
                    drawRoundedRect(-cardW/2, -cardH/2, cardW, cardH, 12);
                    ctx.fill();
                    
                    // Top Bar
                    ctx.fillStyle = card.color;
                    ctx.beginPath();
                    // Clip top rounded part manually or just draw a rect if simple
                    // Simple top bar
                    drawRoundedRect(-cardW/2, -cardH/2, cardW, 6, 4);
                    ctx.fill();

                    ctx.restore();
                }

                // Draw Active Card
                const activeCard = state.cards[state.activeCardIndex];
                
                let activeX = cx;
                let activeY = cy;
                let activeRot = 0;
                let activeAlpha = 1;

                if (state.cardState === 'swiping') {
                    const t = state.swipeProgress;
                    activeX = cx + (t * w * 0.8 * state.swipeDirection);
                    activeY = cy + Math.abs(Math.sin(t * Math.PI)) * 50;
                    activeRot = t * 0.2 * state.swipeDirection;
                    activeAlpha = 1 - Math.min(1, t * 0.8);
                }

                ctx.save();
                ctx.translate(activeX, activeY);
                ctx.rotate(activeRot);
                ctx.globalAlpha = activeAlpha;

                // Card Body
                ctx.fillStyle = '#1a1a1c';
                ctx.strokeStyle = 'rgba(255,255,255,0.1)';
                ctx.lineWidth = 1;
                ctx.shadowBlur = 20; ctx.shadowColor = 'rgba(0,0,0,0.5)';
                drawRoundedRect(-cardW/2, -cardH/2, cardW, cardH, 12);
                ctx.fill();
                ctx.stroke();
                ctx.shadowBlur = 0;

                // Color Bar
                ctx.fillStyle = activeCard.color;
                // Top rounded rect
                ctx.beginPath();
                ctx.moveTo(-cardW/2 + 12, -cardH/2);
                ctx.lineTo(cardW/2 - 12, -cardH/2);
                ctx.quadraticCurveTo(cardW/2, -cardH/2, cardW/2, -cardH/2 + 12);
                ctx.lineTo(cardW/2, -cardH/2 + 20);
                ctx.lineTo(-cardW/2, -cardH/2 + 20);
                ctx.lineTo(-cardW/2, -cardH/2 + 12);
                ctx.quadraticCurveTo(-cardW/2, -cardH/2, -cardW/2 + 12, -cardH/2);
                ctx.fill();

                // Text Content
                ctx.textAlign = 'center';
                ctx.fillStyle = activeCard.color;
                ctx.font = 'bold 9px monospace';
                ctx.fillText(activeCard.category, 0, -cardH/2 + 35);

                ctx.fillStyle = '#fff';
                ctx.font = 'bold 16px sans-serif';
                // Simple wrap for title if needed, but keeping short
                ctx.fillText(activeCard.title, 0, -20);

                ctx.fillStyle = 'rgba(255,255,255,0.6)';
                ctx.font = '11px sans-serif';
                const words = activeCard.text.split(' ');
                let line = "";
                let ly = 10;
                for(let i=0; i<words.length; i++) {
                    const testLine = line + words[i] + " ";
                    if (ctx.measureText(testLine).width > cardW - 30) {
                        ctx.fillText(line, 0, ly);
                        line = words[i] + " ";
                        ly += 16;
                    } else {
                        line = testLine;
                    }
                }
                ctx.fillText(line, 0, ly);

                // Progress Bar at bottom
                if (state.cardState === 'reading') {
                    const p = state.cardTimer / 180;
                    ctx.fillStyle = 'rgba(255,255,255,0.1)';
                    ctx.fillRect(-cardW/2 + 20, cardH/2 - 20, cardW - 40, 4);
                    ctx.fillStyle = activeCard.color;
                    ctx.fillRect(-cardW/2 + 20, cardH/2 - 20, (cardW - 40) * p, 4);
                }

                ctx.restore();
            }
            else if (mode === 'search') {
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
                // Add dummy particles if empty
                if (state.particles.length === 0) {
                    for(let i=0; i<50; i++) {
                        state.particles.push({x: Math.random()*w, y: Math.random()*h, w: 20+Math.random()*40, h: 6});
                    }
                }
                
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
                // Spawn Packets
                if (Math.random() > 0.98) {
                    const startNodes = state.nodes.filter((n: any) => n.type === 'trigger');
                    if (startNodes.length > 0) {
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
                }

                // Draw Links
                ctx.lineWidth = 2;
                state.links.forEach((l: any) => {
                    const n1 = state.nodes.find((n: any) => n.id === l.from);
                    const n2 = state.nodes.find((n: any) => n.id === l.to);
                    
                    if (n1 && n2) {
                        const grad = ctx.createLinearGradient(n1.x, n1.y, n2.x, n2.y);
                        grad.addColorStop(0, 'rgba(255,255,255,0.1)');
                        grad.addColorStop(1, 'rgba(255,255,255,0.05)');
                        ctx.strokeStyle = grad;
                        
                        ctx.beginPath();
                        ctx.moveTo(n1.x, n1.y);
                        const midX = (n1.x + n2.x) / 2;
                        ctx.bezierCurveTo(midX, n1.y, midX, n2.y, n2.x, n2.y);
                        ctx.stroke();
                    }
                });

                // Draw Packets
                for (let i = state.packets.length - 1; i >= 0; i--) {
                    const p = state.packets[i];
                    p.progress += p.speed;
                    
                    const n1 = state.nodes.find((n: any) => n.id === p.fromId);
                    const n2 = state.nodes.find((n: any) => n.id === p.toId);
                    
                    if (n1 && n2) {
                        const midX = (n1.x + n2.x) / 2;
                        const t = p.progress;
                        const invT = 1 - t;
                        
                        const x = invT*invT*invT*n1.x + 3*invT*invT*t*midX + 3*invT*t*t*midX + t*t*t*n2.x;
                        const y = invT*invT*invT*n1.y + 3*invT*invT*t*n1.y + 3*invT*t*t*n2.y + t*t*t*n2.y;

                        ctx.fillStyle = color;
                        ctx.shadowBlur = 10; ctx.shadowColor = color;
                        ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI*2); ctx.fill();
                        ctx.shadowBlur = 0;

                        if (p.progress >= 1) {
                            n2.active = 1.0;
                            const nextLinks = state.links.filter((l: any) => l.from === n2.id);
                            nextLinks.forEach((l: any) => {
                                state.packets.push({ fromId: l.from, toId: l.to, progress: 0, speed: 0.02 });
                            });
                            state.packets.splice(i, 1);
                        }
                    }
                }

                // Draw Nodes
                state.nodes.forEach((n: any) => {
                    const isActive = n.active > 0.01;
                    if (n.active > 0) n.active *= 0.95;

                    ctx.save();
                    ctx.translate(n.x, n.y);
                    
                    if (n.type === 'trigger') {
                        ctx.fillStyle = isActive ? color : '#1a1a1c';
                        ctx.strokeStyle = isActive ? '#fff' : 'rgba(255,255,255,0.2)';
                        ctx.beginPath(); ctx.moveTo(0, -20); ctx.lineTo(20, 0); ctx.lineTo(0, 20); ctx.lineTo(-20, 0); ctx.closePath();
                    } else if (n.type === 'process') {
                        ctx.fillStyle = isActive ? color : '#1a1a1c';
                        ctx.strokeStyle = isActive ? '#fff' : 'rgba(255,255,255,0.2)';
                        drawRoundedRect(-40, -20, 80, 40, 4);
                    } else {
                        ctx.fillStyle = isActive ? color : '#1a1a1c';
                        ctx.strokeStyle = isActive ? '#fff' : 'rgba(255,255,255,0.2)';
                        drawRoundedRect(-30, -15, 60, 30, 15);
                    }
                    
                    ctx.globalAlpha = isActive ? 0.8 : 0.5;
                    ctx.fill();
                    ctx.globalAlpha = 1;
                    ctx.lineWidth = 1;
                    ctx.stroke();

                    ctx.fillStyle = '#fff';
                    ctx.font = '9px monospace';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    
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
                    const startLinks = state.links.filter((l: any) => l.from === 0);
                    if (startLinks.length > 0) {
                        const startLink = startLinks[Math.floor(Math.random() * startLinks.length)];
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
                    if (n1 && n2) {
                        ctx.moveTo(n1.x, n1.y);
                        ctx.lineTo(n2.x, n2.y);
                    }
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
                    
                    if (n1 && n2) {
                        const currX = n1.x + (n2.x - n1.x) * p.t;
                        const currY = n1.y + (n2.y - n1.y) * p.t;
                        ctx.fillStyle = '#fff';
                        ctx.shadowBlur = 5; ctx.shadowColor = '#fff';
                        ctx.fillRect(currX-1.5, currY-1.5, 3, 3);
                        ctx.shadowBlur = 0;
                        if (p.t >= 1) {
                            n2.active = 1;
                            // Propagate
                            if (n2.layer < 3 && Math.random() > 0.3) {
                                const nextLinks = state.links
                                    .map((l: any, idx: number) => ({...l, idx}))
                                    .filter((l: any) => l.from === link.to);
                                    
                                if (nextLinks.length > 0) {
                                    const nextL = nextLinks[Math.floor(Math.random() * nextLinks.length)];
                                    state.particles.push({ linkIdx: nextL.idx, t: 0, speed: 0.08 });
                                }
                            }
                            state.particles.splice(i, 1);
                        }
                    } else {
                        state.particles.splice(i, 1);
                    }
                }
                ctx.rotate(-time * 0.05);
                ctx.translate(-cx, -cy);
            }
            // ... (Other modes: swarm, translation - omitted for brevity as they weren't reported broken, but pattern holds)
            else if (mode === 'swarm') {
                // (Keeping swarm logic intact as it was stable)
                // ... (Swarm logic from original file) ...
                // Re-inserted swarm logic for completeness to avoid regression
                const beltY = h * 0.65; 
                const inputEnd = w * 0.45;
                const outputStart = w * 0.55;
                const agentX = w * 0.5;
                const agentBaseY = beltY + 40;
                
                const boxSize = 18;
                const speed = 1.0; 
                const animSpeed = 0.03;

                const COLORS = ['#22d3ee', '#a78bfa', '#fbbf24']; 
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
                        state: 'conveyor_in' 
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
                let armY = beltY - 60; 
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
                    if (b) {
                        if(b.x < inputEnd - 20) b.x += speed;
                        armX = pivotX + (b.x + b.w/2 - pivotX) * t;
                        armY = (pivotY - 80) + (b.y - (pivotY - 80)) * t;
                        if (t >= 1) { agent.state = 'grasping'; agent.t = 0; }
                    } else {
                        agent.state = 'idle'; // Reset if target gone
                    }
                } 
                else if (agent.state === 'grasping') {
                    agent.t += animSpeed * 2;
                    grabberGap = 10 * (1 - Math.min(1, agent.t));
                    if (agent.targetBox) {
                        armX = agent.targetBox.x + agent.targetBox.w/2;
                        armY = agent.targetBox.y;
                    }
                    if (agent.t >= 1) { agent.state = 'moving'; if(agent.targetBox) agent.targetBox.state = 'lifted'; agent.t = 0; }
                }
                else if (agent.state === 'moving') {
                    agent.t += animSpeed;
                    const t = Math.min(1, agent.t);
                    const b = agent.targetBox;
                    if (b) {
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
                }
                else if (agent.state === 'releasing') {
                    agent.t += animSpeed * 2;
                    const b = agent.targetBox;
                    if (b) {
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
            } else if (mode === 'translation') {
                // Translation mode logic
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

            ctx.globalAlpha = 1;
            frameId = requestAnimationFrame(render);
        };

        const observer = new ResizeObserver(() => { 
            // Debounce resize to prevent loop error
            window.requestAnimationFrame(() => resize()); 
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
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }} />
        </div>
    );
};
