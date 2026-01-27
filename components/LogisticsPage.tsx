
import React, { useState, useRef, useEffect } from 'react';
import { Truck, Package, Globe, Navigation, FileText, X, ArrowRight, Activity, AlertTriangle, ScanLine, Box, Database, TrendingUp, Layers, CheckCircle2, ShieldCheck, DollarSign, BarChart3, Scale, Clock, EyeOff, ImageIcon, ChevronUp } from 'lucide-react';
import { LogisticsHeroVisualizer } from './LogisticsHeroVisualizer';
import { IndustryNavigationFooter } from './IndustryNavigationFooter';

// --- UTILS ---
const FormattedContent: React.FC<{ text: string }> = ({ text }) => {
    if (!text) return null;
    return (
        <div className="space-y-8 font-sans text-xl leading-relaxed text-white/80">
            {text.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="max-w-4xl">
                    {paragraph.split(/(\*\*.*?\*\*)/g).map((part, i) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={i} className="text-white font-medium text-cyan-400 font-sans">{part.slice(2, -2)}</strong>;
                        }
                        return <span key={i}>{part}</span>;
                    })}
                </p>
            ))}
        </div>
    );
};

const ImagePlaceholder: React.FC<{ type: 'wide' | 'portrait' | 'square', label: string, caption?: string }> = ({ type, label, caption }) => {
    const aspect = type === 'wide' ? 'aspect-[21/9]' : type === 'portrait' ? 'aspect-[3/4]' : 'aspect-square';
    const widthClass = type === 'wide' ? 'w-full' : 'w-full';
    
    // Intersection Observer for Reveal Effect
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        }, { threshold: 0.1 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);
    
    return (
        <div ref={ref} className={`my-16 group cursor-default ${widthClass} transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className={`w-full ${aspect} bg-[#0c0c0e] border border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center relative overflow-hidden group`}>
                {/* Animated Grid Background */}
                <div className="absolute inset-0 opacity-10 transition-transform duration-[20s] ease-linear group-hover:scale-110" 
                     style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
                />
                
                {/* Scanline */}
                <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400/20 blur-sm animate-[scan_3s_linear_infinite]" />

                <div className="z-10 flex flex-col items-center text-white/30 group-hover:text-cyan-400/50 transition-colors">
                    <div className="p-6 rounded-full border border-white/10 bg-black/20 backdrop-blur-md mb-4 group-hover:border-cyan-400/30 transition-colors">
                        <ImageIcon size={48} strokeWidth={1} />
                    </div>
                    <div className="text-xs font-mono uppercase tracking-widest">{label}</div>
                    <div className="text-[10px] opacity-50 mt-1 border border-white/10 px-2 py-0.5 rounded">{type.toUpperCase()} IMAGE</div>
                </div>
            </div>
            {caption && (
                <div className="mt-4 flex gap-4 text-xs font-mono text-white/40 border-l border-cyan-500/30 pl-4">
                    <span className="text-cyan-500">FIG</span>
                    <span>{caption}</span>
                </div>
            )}
        </div>
    );
};

// --- DATA ---

const STATS = [
    { 
        value: "$2.3T", 
        label: "Macro Cost Center", 
        desc: "U.S. business logistics costs account for 8.7% of GDP. Manufacturers are seeking to monetize their own logistics capabilities.", 
        source: "CSCMP", 
        icon: DollarSign, 
        color: "#10b981",
        url: "https://cscmp.org/" 
    },
    { 
        value: "ISO 28000", 
        label: "Standards Adoption", 
        desc: "Regulatory complexity drives segmentation. A formal compliance framework to govern risk across networks.", 
        source: "ISO", 
        icon: ShieldCheck, 
        color: "#f59e0b",
        url: "#" 
    },
    { 
        value: "$420.8B", 
        label: "2035 Projection", 
        desc: "Global manufacturing logistics market growing at 9.0% CAGR due to demand for flow management.", 
        source: "U.S. Chamber", 
        icon: TrendingUp, 
        color: "#3b82f6",
        url: "#" 
    },
    { 
        value: "56.1%", 
        label: "Supplier Delays", 
        desc: "PMI Supplier Deliveries Index indicates slower shipments, directly disrupting factory logistics and scheduling.", 
        source: "ISM", 
        icon: Clock, 
        color: "#ef4444",
        url: "#" 
    },
    { 
        value: "1 Month", 
        label: "Lost Time", 
        desc: "Productive time lost annually due to logistics breakdowns, translating into billions in lost revenue.", 
        source: "Fictiv", 
        icon: AlertTriangle, 
        color: "#8b5cf6",
        url: "#" 
    },
    { 
        value: "$100k", 
        label: "Penalty Exposure", 
        desc: "Potential ISF non-compliance fines per shipment. Multiple violations can escalate quickly.", 
        source: "Global Training", 
        icon: Scale, 
        color: "#ec4899",
        url: "#" 
    }
];

const PILLARS = [
    {
        id: 'commercial',
        title: "Commercial Flow Analytics",
        shortDesc: "Pricing, sourcing, margin tied to movement.",
        icon: TrendingUp,
        color: '#10b981', // Emerald
        visualMode: 'inventory',
        content: {
            problem: "In 2026, logistics operations are enshrouded in commercial decisions that are meant to be locked in before movement can truly begin. Rates are negotiated, capacity is sourced, and service commitments are made based on assumed transit times, clean handoffs, and stable network conditions. Once goods enter motion, however, those assumptions immediately start to break.\n\nMost organizations discover the problem only after the fact. Financial reviews show underperformance without explaining where it originated. Operational teams see friction but lack a way to connect it back to pricing, sourcing, or contract terms. As a result, the same deals are re-signed, the same assumptions are reused, and the same leakage repeats.\n\nDwell accumulates at facilities that were priced as pass-throughs. Appointments slip, rehandling increases, and routing changes introduce cost and delay that were never reflected in the original deal. These losses rarely appear as discrete failures. Instead, they surface as margin erosion spreads thinly across moves, partners, and weeks, making them difficult to isolate and harder to correct.\n\nThe core issue is not execution alone. There is also the absence system that ties commercial commitments to how flow actually behaves once goods are in motion. Without that linkage, leaders are forced to price in the abstract and absorb losses in execution, with no durable way to learn from the network they operate.",
            intervene: "Logistics organizations are operating in a moment where historical averages no longer hold. Volatility has become structural: capacity shifts faster than contracts, networks change faster than pricing cycles, and execution conditions diverge from assumptions almost immediately. In this environment, the problem is not that leaders lack data, but that commercial and operational realities are evaluated on different clocks.\n\nWe intervene at the point where commercial commitments meet execution in motion. This work focuses on reconnecting pricing, sourcing, and service terms to the conditions that actually govern flow: dwell, handoff friction, rerouting, disruption, and constraint. Rather than optimizing in hindsight, the goal is to surface where margin exposure is forming as movement unfolds, while there is still time to respond.\n\nThis is not about predicting a perfect outcome. It is about restoring feedback between execution and strategy, so pricing reflects reality, sourcing reflects constraint, and learning happens before losses are absorbed.\n\nOur approach treats flow as the primary unit of analysis, not transactions or reports. We pay attention to where time accumulates, where responsibility changes hands, and where small deviations begin to compound. By preserving context across facilities, carriers, and partners, we help organizations see how their network is teaching them, and adjust commercial decisions accordingly.",
            approach: "The work begins by refusing false urgency. In logistics environments, speed is often confused with progress, and noise is mistaken for signal. The first move is to reduce confusion without reducing momentum, to strip away the distractions that hide where flow is actually tightening, where responsibility is fragmenting, and where margin is quietly leaking. This approach treats commercial and operational teams as part of the same system, not competing functions. Support is oriented around building shared situational understanding: how pricing assumptions collide with execution, how small delays turn into structural costs, and how decisions made upstream are experienced downstream. The goal is not alignment through process, but alignment through clarity.\n\nAttention is placed deliberately at the points most organizations avoid: handoffs, exceptions, and moments where accountability blurs. Rather than smoothing over these frictions, the work makes them visible and actionable while there is still time to intervene. Learning is pulled forward into the present, not deferred to quarterly reviews or post-mortems. Going forward, the emphasis is on strengthening feedback between movement and decision-making. Pricing adapts because execution teaches. Sourcing evolves because constraints are understood early. Leaders regain the ability to respond with intent instead of reacting after losses are absorbed. This is about keeping operations fast, but no longer blind, and ensuring that growth does not come at the cost of repeated, avoidable mistakes."
        }
    },
    {
        id: 'custody',
        title: "Chain-of-Custody Governance",
        shortDesc: "Ownership, liability, compliance at handoffs.",
        icon: ShieldCheck,
        color: '#f59e0b', // Amber
        visualMode: 'customs',
        content: {
            problem: "In logistics operations, custody is assumed to be clear until something goes wrong. Goods move through factories, yards, warehouses, carriers, ports, and brokers every day, often without incident. But when a shipment is damaged, delayed, seized, stolen, or audited, the question is never abstract: Who had control at that moment, and who can prove it?\n\nMost organizations cannot answer that cleanly. Custody changes hands faster than documentation updates, responsibility is split across contracts and systems, and critical context is lost at handoffs. Physical control, legal ownership, and regulatory obligation rarely align in real time. By the time an issue surfaces, movement has already continued, evidence is incomplete, and accountability is contested.\n\nCompliance frameworks assume orderly transitions. Real logistics does not. Exceptions, workarounds, and informal practices fill the gaps between organizations, especially under pressure. These gaps are where exposure accumulates: at the dock, at the gate, at the border, during reconsignment, or after hours when no single party clearly owns the outcome. What makes this problem persistent is that it often stays invisible until the stakes are high. A missed filing, an unsigned transfer, or an undocumented custody change may not matter on a good day. On a bad day, it becomes a fine, a claim, a seizure, or a dispute that no one is prepared to defend. The failure is not that people did not act in good faith. It is that the system did not preserve responsibility as goods moved.",
            intervene: "The work begins before something breaks. Instead of waiting for a claim, an audit, or a dispute to force clarity, attention is placed on the moments where custody quietly shifts and risk begins to accumulate. This is where prevention lives: at handoffs, exceptions, and edge cases that rarely trigger alarms but determine outcomes later.\n\nThe focus is on reinforcing responsibility while goods are still moving. Systems are brought in to preserve context as custody changes, so control, documentation, and obligation do not lag behind execution. Rather than adding new layers of oversight, the emphasis is on making existing transitions legible: who had control, under what conditions, and with what evidence.\n\nThis work strengthens the connective tissue between organizations. Factories, warehouses, carriers, and brokers continue to operate at speed, but shared understanding replaces assumption. When deviations occur, they surface early, while there is still time to correct course, clarify ownership, or intervene before exposure compounds. Prevention here is not about tightening the reins. It is about reducing ambiguity. By treating custody as something that must be actively maintained, not passively assumed, operations stay fast without becoming fragile. The result is fewer surprises, cleaner handoffs, and the confidence that when responsibility matters most, it is already accounted for.",
            approach: "Going forward, the goal is confidence under motion. Not the false calm of control, but the earned calm that comes from knowing accountability is intact and support is present. This is about moving through complexity together — protecting people as much as systems, and ensuring that even in moments of stress, no one is navigating the consequences alone.\n\nIn environments shaped by constant motion and pressure, the work is not to eliminate uncertainty, but to make it manageable. Support shows up as steadiness: helping teams stay oriented when conditions change, when responsibility crosses boundaries, and when decisions have to be made before everything is fully known.\n\nThis support is grounded in continuity. Systems are put in place to carry context forward so teams are not forced to reconstruct events after the fact. As goods move and custody shifts, shared understanding moves with them. When questions arise, answers already exist. When something deviates, it is seen early, while there is still room to respond without escalation.\n\nThe emphasis is on reinforcement and augmentation. Existing expertise is respected, existing workflows are preserved, and judgment remains human. What changes is the weight carried by individuals. Fewer assumptions, fewer blind spots, fewer moments where someone is left holding responsibility without evidence."
        }
    },
    {
        id: 'transport',
        title: "Transport Logistics and Optimization",
        shortDesc: "Routing, delays, capacity, disruption, fair evasion, optimization.",
        icon: Truck,
        color: '#06b6d4', // Cyan
        visualMode: 'fleet',
        content: {
            problem: "In transport systems, failure rarely announces itself. It creeps in as minor delay, an overloaded segment, a missed connection that seems recoverable at first. Then options narrow. Slack disappears. Recovery windows close. By the time disruption is visible, movement is already constrained by the decisions made earlier in the day.\n\nIn these moments, timing is no longer a metric. It becomes the governing force. And without a way to sense, adapt, and recover in motion, even well-run systems can lose control faster than they can respond. The deeper risk is not inefficiency. It is loss of maneuverability. When timing drifts out of alignment across routes, assets, and crews, systems stop being adjustable. They become brittle. Small disruptions begin to dictate outcomes, forcing reactive choices that trade fairness, reliability, or safety just to keep things moving.\n\nMost transport environments are managed through static plans layered on top of dynamic reality. Schedules assume compliance. Models assume clean inputs. Optimization assumes conditions will hold long enough to matter. But real networks operate under interference: congestion, weather, labor gaps, equipment imbalance, policy constraints, and human behavior that does not follow scripts.\n\nWhat operators fear most is not being wrong, it is being late to know. When signals surface too slowly, interventions arrive after leverage is gone. Reroutes increase congestion elsewhere. Delays cascade into missed shifts and stranded assets. Decisions meant to stabilize the system end up amplifying strain.",
            intervene: "The instinct in transport logistics has been to chase efficiency by removing people from the loop. Replace the driver. Automate the decision. Optimize away judgment. In practice, this often strips systems of the very adaptability they rely on when conditions change. But the intervention is happening elsewhere. It happens by strengthening human command, not bypassing it. Attention is placed on communication, situational awareness, and the ability to coordinate action as timing begins to drift. Rather than treating variability as noise to be eliminated, the work focuses on helping teams recognize it early and respond together.\n\nThis means augmenting, not replacing. Operators, dispatchers, drivers, and controllers remain at the center, but they are supported by systems that surface emerging constraints, clarify tradeoffs, and preserve shared understanding as decisions evolve. When plans break, people do not scramble in isolation. They act with context, with visibility into how their choices affect the rest of the network.\n\nIn a landscape shaped by constant change, efficiency alone is brittle. Resilience comes from communication that keeps pace with movement, and from systems that help people adapt in motion rather than locking them into decisions made under outdated assumptions. This is where momentum is protected. By giving the experts the tools they need to navigate change as it unfolds.",
            approach: "Going forward, this is about confidence in motion. Knowing that when conditions refuse to cooperate, context will not disappear, communication will not collapse, and responsibility will not fall on one person alone. In complex systems, no one should have to carry the weight by themselves. This work exists to make sure they don’t have to.\n\nSupport here is not about taking control away. It is about standing alongside the people who already understand how these systems really work. The experience, intuition, and judgment that keep transport moving under pressure are treated as assets, not inefficiencies to be engineered out.\n\nThis support shows up as continuity and reinforcement. As conditions shift, systems help carry shared understanding forward so teams are not forced to relearn the same lessons in moments of stress. Communication stays intact as timing drifts. Decisions remain grounded in the realities operators see on the ground, not just in models or schedules that no longer apply.\n\nThe work affirms what many already know to be true: that effective transport depends on people who can sense change early, adapt quickly, and coordinate with others under constraint. Rather than questioning that expertise, support is designed to amplify it, making good judgment easier to exercise and harder to ignore."
        }
    }
];

const ECOSYSTEM = [
    "Samsara", "Project44", "FourKites", "Flexport", "WiseTech Global (CargoWise)", 
    "Descartes", "Oracle TM", "Blue Yonder", "SAP TM", "Geotab", 
    "Manhattan Associates", "C.H. Robinson", "Uber Freight", "Convoy", "Maersk (TradeLens)"
];

// ... (VISUALIZERS KEPT UNCHANGED) ...
const FleetVisualizer: React.FC<{ color: string }> = ({ color }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const w = canvas.width = 300;
        const h = canvas.height = 300;
        
        // Grid units moving
        const units = Array.from({length: 15}, () => ({
            x: Math.floor(Math.random() * 10) * 30 + 15,
            y: Math.floor(Math.random() * 10) * 30 + 15,
            tx: Math.floor(Math.random() * 10) * 30 + 15,
            ty: Math.floor(Math.random() * 10) * 30 + 15,
            speed: 0.5 + Math.random() * 0.5
        }));

        let frameId: number;
        const render = () => {
            ctx.clearRect(0,0,w,h);
            
            // Grid Lines
            ctx.strokeStyle = 'rgba(255,255,255,0.05)';
            ctx.lineWidth = 1;
            for(let x=0; x<w; x+=30) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
            for(let y=0; y<h; y+=30) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }

            units.forEach(u => {
                // Move towards target
                const dx = u.tx - u.x;
                const dy = u.ty - u.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                if (dist < 1) {
                    // Pick new target
                    u.tx = Math.floor(Math.random() * 10) * 30 + 15;
                    u.ty = Math.floor(Math.random() * 10) * 30 + 15;
                } else {
                    u.x += (dx/dist) * u.speed;
                    u.y += (dy/dist) * u.speed;
                }

                // Draw path
                ctx.strokeStyle = color;
                ctx.globalAlpha = 0.2;
                ctx.beginPath(); ctx.moveTo(u.x, u.y); ctx.lineTo(u.tx, u.ty); ctx.stroke();
                ctx.globalAlpha = 1;

                // Draw Unit
                ctx.fillStyle = color;
                ctx.shadowBlur = 5; ctx.shadowColor = color;
                ctx.beginPath(); ctx.arc(u.x, u.y, 2.5, 0, Math.PI*2); ctx.fill();
                ctx.shadowBlur = 0;
            });
            frameId = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(frameId);
    }, [color]);
    return <canvas ref={canvasRef} className="w-full h-full" />;
};

const CustomsVisualizer: React.FC<{ color: string }> = ({ color }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const w = canvas.width = 300;
        const h = canvas.height = 300;
        let t = 0;
        let frameId: number;

        const render = () => {
            t += 1.5;
            ctx.clearRect(0,0,w,h);
            
            // Document Rect
            const docW = 140; const docH = 180;
            const dx = (w-docW)/2; const dy = (h-docH)/2;
            
            ctx.strokeStyle = 'rgba(255,255,255,0.2)';
            ctx.lineWidth = 1;
            ctx.strokeRect(dx, dy, docW, docH);
            
            // Scan Line position
            const scanY = dy + (t % (docH + 40));
            const isScanning = scanY >= dy && scanY <= dy + docH;

            // Text Lines
            for(let i=0; i<10; i++) {
                const ly = dy + 30 + i*15;
                const isProcessed = scanY > ly;
                
                ctx.fillStyle = isProcessed ? color : 'rgba(255,255,255,0.1)';
                if (isProcessed) ctx.shadowBlur = 5; ctx.shadowColor = color;
                ctx.fillRect(dx + 20, ly, docW - 40, 4);
                ctx.shadowBlur = 0;
            }

            // Scanner Beam
            if (isScanning) {
                ctx.fillStyle = '#fff';
                ctx.shadowColor = '#fff'; ctx.shadowBlur = 10;
                ctx.fillRect(dx - 10, scanY, docW + 20, 2);
                ctx.shadowBlur = 0;
            }
            
            // Result Stamp
            if (!isScanning && t % (docH + 40) > docH) {
                ctx.save();
                ctx.translate(w/2, h/2);
                ctx.rotate(-0.2);
                ctx.strokeStyle = '#10b981'; // Green for Verified
                ctx.lineWidth = 3;
                ctx.strokeRect(-40, -15, 80, 30);
                ctx.fillStyle = '#10b981';
                ctx.font = "bold 12px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText("VERIFIED", 0, 5);
                ctx.restore();
            }

            frameId = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(frameId);
    }, [color]);
    return <canvas ref={canvasRef} className="w-full h-full" />;
};

const InventoryVisualizer: React.FC<{ color: string }> = ({ color }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const w = canvas.width = 300;
        const h = canvas.height = 300;
        let t = 0;
        let frameId: number;

        const drawIsoCube = (x: number, y: number, size: number, color: string, opacity: number) => {
            ctx.globalAlpha = opacity;
            // Top
            ctx.fillStyle = color; // Brightest
            ctx.beginPath();
            ctx.moveTo(x, y - size);
            ctx.lineTo(x + size, y - size/2 - size);
            ctx.lineTo(x, y - size*2);
            ctx.lineTo(x - size, y - size/2 - size);
            ctx.fill();
            
            // Right
            ctx.fillStyle = 'rgba(0,0,0,0.3)'; // Shadow
            ctx.beginPath();
            ctx.moveTo(x, y - size);
            ctx.lineTo(x + size, y - size/2 - size);
            ctx.lineTo(x + size, y - size/2);
            ctx.lineTo(x, y);
            ctx.fill();

            // Left
            ctx.fillStyle = 'rgba(0,0,0,0.1)'; // Slight Shadow
            ctx.beginPath();
            ctx.moveTo(x, y - size);
            ctx.lineTo(x - size, y - size/2 - size);
            ctx.lineTo(x - size, y - size/2);
            ctx.lineTo(x, y);
            ctx.fill();
            ctx.globalAlpha = 1;
        }

        const render = () => {
            t += 0.05;
            ctx.clearRect(0,0,w,h);
            
            const size = 15;
            const startX = w/2;
            const startY = h/3;

            // Draw back to front
            for(let r=0; r<4; r++) {
                for(let c=0; c<4; c++) {
                    const x = startX + (c - r) * size;
                    const y = startY + (c + r) * (size/2);
                    
                    // Base
                    drawIsoCube(x, y, size, '#333', 0.5);

                    // Dynamic Stacks
                    const stackHeight = Math.abs(Math.sin(t + r + c)) * 3;
                    const count = Math.floor(stackHeight) + 1;
                    
                    for(let h=0; h<count; h++) {
                        const isTop = h === count - 1;
                        const cubeColor = isTop ? color : '#555';
                        drawIsoCube(x, y - (h+1) * size, size, cubeColor, isTop ? 1 : 0.6);
                    }
                }
            }
            frameId = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(frameId);
    }, [color]);
    return <canvas ref={canvasRef} className="w-full h-full" />;
};

const LogisticsBackground: React.FC<{ mode: string, color: string }> = ({ mode, color }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let w = canvas.width = window.innerWidth;
        let h = canvas.height = window.innerHeight;
        let time = 0;
        let frameId: number;

        const render = () => {
            time += 0.01;
            ctx.fillStyle = 'rgba(2,2,2,0.1)';
            ctx.fillRect(0,0,w,h);

            if (mode === 'fleet') {
                // Moving Grid Lines
                const offset = (time * 50) % 50;
                ctx.strokeStyle = 'rgba(255,255,255,0.05)';
                for(let x=0; x<w; x+=50) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
                ctx.beginPath(); ctx.moveTo(0, h/2); ctx.lineTo(w, h/2); ctx.stroke();
                
                // Nodes
                for(let i=0; i<10; i++) {
                    const x = (i*150 + time*100) % w;
                    const y = h/2 + Math.sin(x*0.01)*50;
                    ctx.fillStyle = color;
                    ctx.fillRect(x,y,4,4);
                }
            } 
            else if (mode === 'customs') {
                // Matrix Rain
                ctx.fillStyle = color;
                ctx.font = '10px monospace';
                for(let i=0; i<w; i+=30) {
                    if (Math.random() > 0.95) {
                        const y = Math.random() * h;
                        ctx.fillText(String.fromCharCode(0x30A0 + Math.random()*96), i, y);
                    }
                }
            } 
            else if (mode === 'inventory') {
                // Cubes
                ctx.strokeStyle = color;
                ctx.lineWidth = 1;
                for(let i=0; i<20; i++) {
                    const x = Math.random() * w;
                    const y = (time * 50 + i * 50) % h;
                    ctx.globalAlpha = 0.2;
                    ctx.strokeRect(x, y, 20, 20);
                }
                ctx.globalAlpha = 1;
            }
            
            frameId = requestAnimationFrame(render);
        };
        render();
        
        const resize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(frameId); };
    }, [mode, color]);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30" />;
};

// --- COMPONENTS ---

const StatCard: React.FC<{ stat: typeof STATS[0], index: number }> = ({ stat, index }) => {
    return (
        <a 
            href={stat.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-8 bg-[#0c0c0e] border border-white/5 rounded-2xl transition-all duration-500 overflow-hidden hover:-translate-y-1 hover:shadow-2xl cursor-pointer block"
            style={{ '--card-color': stat.color } as React.CSSProperties}
        >
            <div className="absolute inset-0 border border-transparent group-hover:border-[var(--card-color)] opacity-0 group-hover:opacity-100 rounded-2xl transition-all duration-500 pointer-events-none" />
            
            {/* Watermark */}
            <div className="absolute -right-6 -bottom-6 text-white/5 group-hover:text-[var(--card-color)] group-hover:opacity-10 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12 pointer-events-none">
                {React.createElement(stat.icon, { size: 100, strokeWidth: 0.5 })}
            </div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white transition-colors border border-white/5 group-hover:bg-[var(--card-color)] group-hover:border-transparent">
                        {React.createElement(stat.icon, { size: 24 })}
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 group-hover:text-[var(--card-color)] transition-colors border border-white/10 px-2 py-1 rounded bg-[#0a0a0c]">
                        {stat.source}
                    </span>
                </div>
                
                <div className="text-4xl font-mono font-bold text-white mb-2 tracking-tight group-hover:scale-105 transition-transform origin-left">
                    {stat.value}
                </div>
                <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-4 group-hover:text-white transition-colors">{stat.label}</h4>
                
                <p className="text-sm text-white/60 leading-relaxed border-t border-white/5 pt-4 group-hover:border-white/10 transition-colors">
                    {stat.desc}
                </p>
            </div>
        </a>
    );
};

const TiltPillarCard: React.FC<{ pillar: any, onClick: () => void }> = ({ pillar, onClick }) => {
    return (
        <div 
            onClick={onClick}
            className="group relative h-[450px] bg-[#0c0c0e] border border-white/10 rounded-3xl overflow-hidden cursor-pointer hover:border-white/30 transition-all duration-500 hover:shadow-2xl flex flex-col"
        >
            {/* Visual */}
            <div className="absolute inset-0 opacity-30 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                {pillar.visualMode === 'fleet' && <FleetVisualizer color={pillar.color} />}
                {pillar.visualMode === 'customs' && <CustomsVisualizer color={pillar.color} />}
                {pillar.visualMode === 'inventory' && <InventoryVisualizer color={pillar.color} />}
            </div>

            {/* Content */}
            <div className="relative z-10 p-8 flex flex-col h-full pointer-events-none">
                <div className="w-12 h-12 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center text-white/50 group-hover:text-white group-hover:scale-110 transition-all backdrop-blur-md mb-auto">
                    {React.createElement(pillar.icon, { size: 20 })}
                </div>

                <div className="bg-[#0c0c0e]/90 backdrop-blur-xl p-6 -mx-8 -mb-8 border-t border-white/10">
                    <h3 className="text-lg font-serif text-white mb-2 group-hover:text-cyan-400 transition-colors">{pillar.title}</h3>
                    <p className="text-xs text-white/50 leading-relaxed mb-4 line-clamp-3">{pillar.shortDesc}</p>
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-white/30 group-hover:text-white transition-colors">
                        <span>Initialize</span>
                        <ArrowRight size={10} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export const LogisticsPage: React.FC = () => {
    const [expandedPillarId, setExpandedPillarId] = useState<string | null>(null);
    const activePillar = PILLARS.find(p => p.id === expandedPillarId);
    
    // Scroll Progress Hook logic
    const modalRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [showBackToTop, setShowBackToTop] = useState(false);

    const handleScroll = () => {
        if (!modalRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = modalRef.current;
        const progress = scrollTop / (scrollHeight - clientHeight);
        setScrollProgress(progress);
        setShowBackToTop(scrollTop > 500);
    };

    const scrollToTop = () => {
        if (modalRef.current) {
            modalRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleExpand = (id: string) => {
        setExpandedPillarId(id);
        // No window scroll needed as modal is fixed, but nice to reset
        window.scrollTo(0, 0);
    };

    const handleClose = () => {
        setExpandedPillarId(null);
        setTimeout(() => {
            document.getElementById('strategic-domains')?.scrollIntoView({ behavior: 'instant', block: 'start' });
        }, 10);
    };

    return (
        <div className="relative min-h-screen bg-[#020202] text-white pt-24 font-sans overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-400">
            <style>
                {`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 40s linear infinite;
                }
                `}
            </style>

            {!expandedPillarId && (
                <>
                    {/* --- HERO --- */}
                    <div className="relative h-[85vh] min-h-[600px] flex flex-col justify-center border-b border-white/10 bg-[#020202] overflow-hidden animate-in fade-in duration-500">
                        {/* 3-STAGE VISUALIZER */}
                        <div className="absolute inset-0 z-0">
                            <LogisticsHeroVisualizer />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#020202] via-[#020202]/90 to-transparent z-10" />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#020202] via-transparent to-[#020202] z-10" />

                        <div className="relative z-20 max-w-[1800px] mx-auto px-6 md:px-12 w-full text-center md:text-left pointer-events-none">
                            <div className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-[10px] font-bold uppercase tracking-widest mb-8 animate-in slide-in-from-bottom-4 duration-700 backdrop-blur-md">
                                <Truck size={14} />
                                <span>Logistics</span>
                            </div>
                            <h1 className="text-5xl md:text-8xl font-serif text-white mb-8 max-w-5xl leading-[0.95] tracking-tight">
                                Movement, Handoff, <br/>
                                and <span className="text-cyan-500 italic">Coordination.</span>
                            </h1>
                            <p className="text-xl text-white/60 max-w-2xl leading-relaxed mb-12 font-light">
                                Operational decisions shaped by real-time movement, accumulated context, and constrained physical systems.
                            </p>
                            <div className="flex flex-col md:flex-row gap-4 pointer-events-auto">
                                <button onClick={() => document.getElementById('strategic-domains')?.scrollIntoView({behavior: 'smooth'})} className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase tracking-widest text-xs rounded transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                                    Explore Strategy
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* --- CONTEXT --- */}
                    <section className="py-32 bg-[#050505] border-b border-white/5 relative">
                        <div className="max-w-[1800px] mx-auto px-6 md:px-12 text-center">
                            <h2 className="text-3xl md:text-4xl font-serif text-white mb-8">The Macro Cost Center</h2>
                            <p className="text-lg md:text-xl text-white/60 leading-relaxed text-justify font-light max-w-4xl mx-auto">
                                In the U.S., Logistics is a macro cost center. Some of the largest manufacturers and retailers are seeking to monetize their own logistics capabilities while viewing their supply chain successes as a service to market and profit from. Logistics operations center on protecting flow across networks where goods, responsibility, and risk are constantly transferred between organizations. These environments are shaped less by planning than by execution under interruption.
                            </p>
                        </div>
                    </section>

                    {/* --- STATS --- */}
                    <section className="py-24 bg-[#08080a] border-b border-white/5">
                        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {STATS.map((stat, i) => (
                                    <StatCard key={i} stat={stat} index={i} />
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* --- PILLARS --- */}
                    <section id="strategic-domains" className="py-24 bg-[#020202] scroll-mt-24">
                        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
                            <div className="mb-20 text-center">
                                <h2 className="text-4xl font-serif text-white mb-6">Strategic Domains</h2>
                                <p className="text-white/50 max-w-2xl mx-auto">Core operational pillars where we deploy intelligence.</p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                {PILLARS.map((pillar) => (
                                    <TiltPillarCard 
                                        key={pillar.id}
                                        pillar={pillar}
                                        onClick={() => handleExpand(pillar.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* --- ECOSYSTEM --- */}
                    <section className="py-24 border-t border-white/5 bg-[#050505]">
                        <div className="max-w-[1800px] mx-auto px-6 md:px-12 text-center">
                            <p className="text-xs font-mono uppercase tracking-widest text-white/30 mb-12">Integrated Ecosystem</p>
                            <div className="relative w-full overflow-hidden">
                                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10" />
                                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10" />
                                <div className="flex w-max animate-marquee">
                                    {[...ECOSYSTEM, ...ECOSYSTEM].map((tech, i) => (
                                        <div key={i} className="mx-8 text-white/40 font-serif text-xl hover:text-cyan-500 transition-colors cursor-default whitespace-nowrap">
                                            {tech}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* --- NEW CROSS-NAVIGATION FOOTER --- */}
                    <IndustryNavigationFooter currentId="logistics" />
                </>
            )}

            {/* --- DETAIL MODAL --- */}
            {activePillar && (
                <div 
                    ref={modalRef} 
                    onScroll={handleScroll}
                    className="fixed inset-0 z-[100] bg-[#020202] overflow-y-auto animate-in fade-in duration-300 custom-scrollbar"
                >
                    {/* Progress Bar */}
                    <div className="fixed top-0 left-0 h-1 bg-cyan-500 z-[120] transition-all duration-100 ease-out" style={{ width: `${scrollProgress * 100}%` }} />

                    <div className="min-h-screen flex flex-col relative">
                        
                        {/* Immersive Background */}
                        <div className="fixed inset-0 z-0">
                            <LogisticsBackground mode={activePillar.visualMode} color={activePillar.color} />
                            <div className="absolute inset-0 bg-gradient-to-b from-[#020202] via-[#020202]/95 to-[#020202]" />
                        </div>

                        {/* Header */}
                        <div className="fixed top-0 left-0 right-0 h-24 bg-[#0a0a0c]/90 backdrop-blur-xl border-b border-white/10 z-[110] flex items-center px-8 md:px-12 justify-between">
                            <div className="flex items-center gap-6">
                                <button onClick={handleClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                                <div className="h-8 w-px bg-white/10" />
                                <div className="flex items-center gap-3">
                                    {React.createElement(activePillar.icon, { size: 18, color: activePillar.color })}
                                    <h2 className="text-lg font-serif text-white hidden md:block">{activePillar.title}</h2>
                                </div>
                            </div>
                            
                            <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest hidden md:block">
                                Reading Progress: {Math.round(scrollProgress * 100)}%
                            </div>
                        </div>

                        {/* NEW EDITORIAL LAYOUT */}
                        <div className="relative z-10 pt-32 pb-32 w-full flex justify-center">
                            <div className="max-w-[1600px] w-full px-6 md:px-20">
                                
                                {/* Article Header */}
                                <div className="mb-24 text-center">
                                    <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-500 text-[10px] font-bold uppercase tracking-widest animate-in slide-in-from-top-4 duration-700">
                                        <Truck size={12} />
                                        <span>Strategic Domain</span>
                                    </div>
                                    <h1 className="text-5xl md:text-8xl font-serif text-white mb-8 leading-[1.1] tracking-tight animate-in zoom-in-95 duration-700 delay-100">
                                        {activePillar.title}
                                    </h1>
                                    <p className="text-xl md:text-3xl text-white/60 leading-relaxed font-light max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                                        {activePillar.shortDesc}
                                    </p>
                                </div>

                                {/* Main Content Column */}
                                <div className="max-w-4xl mx-auto space-y-32">
                                    
                                    {/* SECTION 1: PROBLEM */}
                                    <section className="animate-in slide-in-from-bottom-8 duration-1000 delay-300">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-12 h-px bg-red-500/50" />
                                            <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest">The Friction</h3>
                                        </div>
                                        <FormattedContent text={activePillar.content.problem} />
                                    </section>
                                    
                                    {/* VISUAL BREAK 1: WIDE */}
                                    <ImagePlaceholder type="wide" label="Network Overview" caption="Visualizing the breakdown in traditional linear logistics models." />

                                    {/* SECTION 2: INTERVENTION */}
                                    <section>
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-12 h-px bg-amber-400/50" />
                                            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest">Intervention Point</h3>
                                        </div>
                                        <FormattedContent text={activePillar.content.intervene} />
                                    </section>

                                    {/* VISUAL BREAK 2: PORTRAIT GRID */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
                                        <ImagePlaceholder type="portrait" label="Node Analysis" caption="Detailed view of a single failure point." />
                                        <ImagePlaceholder type="portrait" label="Flow Correction" caption="Automated rerouting protocol in action." />
                                    </div>

                                    {/* SECTION 3: APPROACH */}
                                    <section>
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-12 h-px bg-cyan-400/50" />
                                            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Operational Approach</h3>
                                        </div>
                                        <FormattedContent text={activePillar.content.approach} />
                                    </section>

                                    {/* FINAL VISUAL */}
                                    <ImagePlaceholder type="square" label="System Harmony" caption="The target state: Synchronized movement across the entire value chain." />
                                </div>
                            </div>
                        </div>

                        {/* Back To Top FAB */}
                        <button 
                            onClick={scrollToTop}
                            className={`fixed bottom-8 right-8 z-[120] p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full text-white transition-all duration-500 transform ${showBackToTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
                        >
                            <ChevronUp size={24} />
                        </button>

                        {/* Footer Close */}
                        <div className="fixed bottom-0 left-0 right-0 h-24 flex items-center justify-center pointer-events-none z-[110] bg-gradient-to-t from-black to-transparent">
                            <button onClick={handleClose} className="pointer-events-auto px-8 py-3 bg-white hover:bg-cyan-400 text-black font-bold uppercase tracking-widest text-xs rounded-full shadow-lg transition-colors">
                                Close Module
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};
