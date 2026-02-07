
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
            // Identity Mode (Learning Feed) State
            feedState: 'reading', // reading -> selecting -> feedback -> swiping
            feedTimer: 0,
            currentCardIndex: 0,
            swipeOffset: 0,
            streak: 42,
            xp: 1250,
            cursor: { x: 0, y: 0, targetX: 0, targetY: 0, clicking: false },
            feedCards: [
                { 
                    type: 'SECURITY_ALERT', 
                    bg: ['#1e1b4b', '#312e81'], // Indigo
                    author: "@SecurOps_Bot",
                    q: "Phishing Attempt Detected", 
                    sub: "Email from 'IT-Support' asks for password reset via external link.", 
                    opts: ["Click & Verify", "Report as Phishing"], 
                    correct: 1, 
                    likes: "12.4k",
                    comments: "402"
                },
                { 
                    type: 'SAFETY_PROTOCOL', 
                    bg: ['#451a03', '#78350f'], // Amber
                    author: "@SiteSafety_Lead",
                    q: "Forklift Zone Violation", 
                    sub: "Pedestrian observed in yellow zone while lift is active.", 
                    opts: ["Sound Alarm", "Ignore"], 
                    correct: 0, 
                    likes: "8.2k",
                    comments: "156"
                },
                { 
                    type: 'DATA_PRIVACY', 
                    bg: ['#022c22', '#115e59'], // Emerald
                    author: "@Compliance_AI",
                    q: "PII in Ticket Comments", 
                    sub: "Customer posted credit card info in support chat.", 
                    opts: ["Leave it", "Redact Immediately"], 
                    correct: 1, 
                    likes: "45k",
                    comments: "2.1k"
                },
                { 
                    type: 'ETHICS_CHECK', 
                    bg: ['#4c0519', '#9f1239'], // Rose
                    author: "@HR_Partner",
                    q: "Vendor Gift Policy", 
                    sub: "Supplier offers front-row tickets worth $500.", 
                    opts: ["Decline Gift", "Accept Gift"], 
                    correct: 0, 
                    likes: "3.1k",
                    comments: "89"
                }
            ],
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
            state.feedState = 'reading';
            state.feedTimer = 0;
            state.currentCardIndex = 0;
            state.swipeOffset = 0;
            state.cursor = { x: w/2, y: h*0.8, targetX: w/2, targetY: h*0.8, clicking: false };

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
        };

        const render = () => {
            time += 0.01;
            const w = state.width;
            const h = state.height;
            const cx = w/2;
            const cy = h/2;

            ctx.clearRect(0, 0, w, h);
            
            if (mode === 'identity') {
                // --- "SkillStream": Corporate Learning Feed ---
                
                // 1. UPDATE STATE & PHYSICS
                state.feedTimer++;
                const card = state.feedCards[state.currentCardIndex];
                
                // -- Cursor Simulation Logic --
                if (state.feedState === 'reading') {
                    // Idle hover
                    state.cursor.targetX = w/2 + Math.sin(time) * 30;
                    state.cursor.targetY = h * 0.7 + Math.cos(time * 1.5) * 30;
                    
                    if (state.feedTimer > 100) { 
                        state.feedState = 'selecting';
                    }
                } 
                else if (state.feedState === 'selecting') {
                    // Move to correct button
                    const btnH = 50;
                    const spacing = 15;
                    const btnY = h * 0.65 + card.correct * (btnH + spacing) + btnH/2;
                    
                    state.cursor.targetX = w/2;
                    state.cursor.targetY = btnY;
                    
                    // Snap click when close
                    const dx = state.cursor.targetX - state.cursor.x;
                    const dy = state.cursor.targetY - state.cursor.y;
                    if (Math.sqrt(dx*dx + dy*dy) < 5) {
                        state.cursor.clicking = true;
                        state.feedState = 'feedback';
                        state.feedTimer = 0;
                        state.streak++;
                        state.xp += 150;
                        
                        // Explosion
                        for(let i=0; i<40; i++) {
                            state.particles.push({
                                x: state.cursor.x,
                                y: state.cursor.y,
                                vx: (Math.random()-0.5) * 15,
                                vy: (Math.random()-0.5) * 15 - 5,
                                life: 1.0,
                                color: ['#4ade80', '#fbbf24', '#ffffff'][Math.floor(Math.random()*3)]
                            });
                        }
                    }
                }
                else if (state.feedState === 'feedback') {
                    state.cursor.clicking = false;
                    if (state.feedTimer > 60) { 
                        state.feedState = 'swiping';
                        state.cursor.targetY = h * 0.2; // Move up to swipe
                        state.feedTimer = 0;
                    }
                }
                else if (state.feedState === 'swiping') {
                    // Lerp Offset
                    state.swipeOffset += (-h - state.swipeOffset) * 0.15;
                    
                    // Reset
                    if (Math.abs(state.swipeOffset + h) < 5) {
                        state.currentCardIndex = (state.currentCardIndex + 1) % state.feedCards.length;
                        state.swipeOffset = 0;
                        state.feedState = 'reading';
                        state.feedTimer = 0;
                        state.cursor.y = h + 100; // Reset cursor pos
                    }
                }

                // Cursor Physics
                state.cursor.x += (state.cursor.targetX - state.cursor.x) * 0.15;
                state.cursor.y += (state.cursor.targetY - state.cursor.y) * 0.15;

                // -- RENDER --
                
                ctx.save();
                ctx.translate(0, state.swipeOffset);

                // 1. Dynamic Video Background (Simulated)
                const grad = ctx.createLinearGradient(0, 0, 0, h);
                grad.addColorStop(0, card.bg[0]);
                grad.addColorStop(1, card.bg[1]);
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, w, h);
                
                // Animated Abstract Blobs (The "Content")
                ctx.save();
                ctx.globalAlpha = 0.2;
                ctx.fillStyle = '#fff';
                for(let i=0; i<3; i++) {
                    const bx = (Math.sin(time + i) * 100 + w/2);
                    const by = (Math.cos(time * 0.5 + i) * 100 + h/2);
                    ctx.beginPath(); ctx.arc(bx, by, 80 + i*20, 0, Math.PI*2); ctx.fill();
                }
                ctx.restore();

                // 2. Right Sidebar (Social Actions)
                const rightMargin = w - 40;
                const bottomMargin = h - 100;
                
                // Avatar
                ctx.beginPath(); ctx.arc(rightMargin, bottomMargin - 160, 18, 0, Math.PI*2); 
                ctx.fillStyle = '#fff'; ctx.fill();
                ctx.lineWidth = 2; ctx.strokeStyle = '#22c55e'; ctx.stroke();
                
                // Heart
                ctx.fillStyle = state.feedState === 'feedback' ? '#ef4444' : 'rgba(255,255,255,0.8)';
                ctx.font = '24px serif'; ctx.textAlign='center'; ctx.fillText('♥', rightMargin, bottomMargin - 100);
                ctx.font = '10px sans-serif'; ctx.fillStyle='#fff'; ctx.fillText(card.likes, rightMargin, bottomMargin - 85);

                // Comment
                ctx.fillStyle = 'rgba(255,255,255,0.8)';
                ctx.font = '24px serif'; ctx.fillText('💬', rightMargin, bottomMargin - 40);
                ctx.font = '10px sans-serif'; ctx.fillStyle='#fff'; ctx.fillText(card.comments, rightMargin, bottomMargin - 25);

                // 3. Bottom Content Overlay
                ctx.textAlign = 'left';
                
                // Author Tag
                ctx.font = 'bold 12px sans-serif'; ctx.fillStyle = '#fff';
                ctx.fillText(card.author, 20, h * 0.42);
                
                // Question
                ctx.font = 'bold 18px sans-serif'; 
                ctx.shadowColor="rgba(0,0,0,0.5)"; ctx.shadowBlur=4;
                ctx.fillText(card.q, 20, h * 0.42 + 25);
                ctx.shadowBlur=0;
                
                // Subtext
                ctx.font = '12px sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.8)';
                const subWidth = ctx.measureText(card.sub).width;
                if (subWidth > w - 80) {
                    ctx.fillText(card.sub.substring(0, 30) + "...", 20, h * 0.42 + 45);
                } else {
                    ctx.fillText(card.sub, 20, h * 0.42 + 45);
                }

                // 4. Interactive Options
                card.opts.forEach((opt: string, i: number) => {
                    const btnH = 50;
                    const spacing = 15;
                    const btnW = w * 0.75;
                    const btnX = (w - btnW) / 2;
                    const btnY = h * 0.65 + i * (btnH + spacing);
                    
                    const isCorrect = i === card.correct;
                    const isSelected = (state.feedState === 'feedback' || state.feedState === 'swiping') && isCorrect;
                    
                    // Glassmorphism Button
                    ctx.fillStyle = isSelected ? '#22c55e' : 'rgba(255,255,255,0.15)';
                    if (isSelected) {
                        ctx.shadowColor = '#22c55e'; ctx.shadowBlur = 20;
                    } else {
                        ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
                    }
                    
                    ctx.beginPath(); ctx.roundRect(btnX, btnY, btnW, btnH, 12); ctx.fill();
                    
                    // Text
                    ctx.fillStyle = '#fff'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
                    ctx.fillText(opt, w/2, btnY + 30);
                    
                    // Reset Shadow
                    ctx.shadowBlur = 0;
                });

                // 5. Success Feedback Banner
                if (state.feedState === 'feedback' || state.feedState === 'swiping') {
                    const bannerY = state.feedState === 'feedback' ? 
                        h - 80 - Math.min(1, state.feedTimer/10) * 20 : // Pop up
                        h - 100 + state.feedTimer; // Slide down
                    
                    ctx.fillStyle = '#22c55e';
                    ctx.fillRect(0, bannerY, w, 150);
                    
                    ctx.fillStyle = '#fff';
                    ctx.font = 'bold 20px sans-serif'; ctx.textAlign = 'left';
                    ctx.fillText("Nice work!", 20, bannerY + 40);
                    ctx.font = '12px sans-serif';
                    ctx.fillText(`Streak: ${state.streak} 🔥  XP: ${state.xp}`, 20, bannerY + 65);
                }

                // 6. Particles
                for (let i = state.particles.length - 1; i >= 0; i--) {
                    const p = state.particles[i];
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.8; // Gravity
                    p.life -= 0.02;
                    
                    if (p.life <= 0) {
                        state.particles.splice(i, 1);
                        continue;
                    }
                    
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = p.life;
                    ctx.fillRect(p.x, p.y, 5, 5); 
                }
                ctx.globalAlpha = 1;

                // 7. Header UI (Progress Bar)
                const totalCards = state.feedCards.length;
                const segW = (w - 40 - (totalCards-1)*5) / totalCards;
                for(let i=0; i<totalCards; i++) {
                    ctx.fillStyle = i <= state.currentCardIndex ? '#fff' : 'rgba(255,255,255,0.2)';
                    ctx.fillRect(20 + i*(segW+5), 20, segW, 4);
                }

                ctx.restore(); // End Translate

                // --- NEW: Suspended Pill Cutout (Dynamic Island) ---
                ctx.save();
                const pillW = 100;
                const pillH = 30;
                const pillY = h * 0.05; 
                const pillX = w/2 - pillW/2;
                
                ctx.shadowColor = 'rgba(0,0,0,0.8)';
                ctx.shadowBlur = 15;
                ctx.shadowOffsetY = 5;

                ctx.fillStyle = '#000';
                ctx.beginPath();
                ctx.roundRect(pillX, pillY, pillW, pillH, 50);
                ctx.fill();
                ctx.shadowBlur = 0; 

                // FaceID / Camera sensor details
                ctx.fillStyle = '#1a1a1a';
                ctx.beginPath();
                ctx.arc(pillX + pillW - 25, pillY + pillH/2, 8, 0, Math.PI*2);
                ctx.fill();
                
                ctx.fillStyle = '#080808';
                ctx.beginPath();
                ctx.arc(pillX + pillW - 25, pillY + pillH/2, 3, 0, Math.PI*2);
                ctx.fill();
                
                ctx.restore();

                // 8. Simulated Cursor Overlay
                if (state.feedState !== 'swiping') {
                    ctx.shadowBlur = 10; ctx.shadowColor = 'rgba(0,0,0,0.5)';
                    ctx.fillStyle = '#fff';
                    // Arrow cursor
                    ctx.beginPath();
                    ctx.moveTo(state.cursor.x, state.cursor.y);
                    ctx.lineTo(state.cursor.x + 12, state.cursor.y + 12);
                    ctx.lineTo(state.cursor.x + 5, state.cursor.y + 12);
                    ctx.lineTo(state.cursor.x, state.cursor.y + 18);
                    ctx.closePath();
                    ctx.fill();
                    
                    // Click Ripple
                    if (state.cursor.clicking) {
                        ctx.strokeStyle = 'rgba(255,255,255,0.8)';
                        ctx.lineWidth = 2;
                        ctx.beginPath(); ctx.arc(state.cursor.x, state.cursor.y, 20, 0, Math.PI*2); ctx.stroke();
                    }
                    ctx.shadowBlur = 0;
                }
            }
            // ... (Existing logic for other modes)
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
                        ctx.beginPath(); ctx.roundRect(-40, -20, 80, 40, 4);
                    } else {
                        ctx.fillStyle = isActive ? color : '#1a1a1c';
                        ctx.strokeStyle = isActive ? '#fff' : 'rgba(255,255,255,0.2)';
                        ctx.beginPath(); ctx.roundRect(-30, -15, 60, 30, 15);
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
            // ... (Other modes omitted for brevity, logic remains in 'render')
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
