
import React, { useState, useRef, useEffect } from 'react';
import { Pickaxe, Droplets, Zap, Flame, Globe, AlertTriangle, ArrowRight, X, ScanLine, Activity, Mountain, Wind, Cpu, Layers, ImageIcon, ChevronUp } from 'lucide-react';
import { ResourcesHeroVisualizer } from './ResourcesHeroVisualizer';
import { IndustryNavigationFooter } from './IndustryNavigationFooter';
import { ViewportSlot } from './ViewportSlot';

// --- UTILS ---
const FormattedContent: React.FC<{ text: string }> = ({ text }) => {
    return (
        <div className="space-y-8 font-sans text-xl leading-relaxed text-white/80">
            {text.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="max-w-4xl">
                    {paragraph.split(/(\*\*.*?\*\*)/g).map((part, i) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={i} className="text-white font-medium text-emerald-500 font-sans">{part.slice(2, -2)}</strong>;
                        }
                        return <span key={i}>{part}</span>;
                    })}
                </p>
            ))}
        </div>
    );
};

const ImagePlaceholder: React.FC<{ type: 'wide' | 'portrait' | 'square', label: string, caption?: string, src?: string }> = ({ type, label, caption, src }) => {
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
            <div className={`w-full ${aspect} bg-[#0c0c0e] border border-white/10 rounded-lg flex flex-col items-center justify-center relative overflow-hidden group shadow-2xl`}>
                {src ? (
                    <>
                        <img 
                            src={src} 
                            alt={label}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out skew-x-12 pointer-events-none" />
                    </>
                ) : (
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                )}
            </div>
            {caption && (
                <div className="mt-4 flex gap-4 text-xs font-mono text-white/40 border-l border-emerald-500/30 pl-4">
                    <span className="text-emerald-500">IMAGE:</span>
                    <span>{caption}</span>
                </div>
            )}
        </div>
    );
};

// --- DATA ---

const STATS = [
    {
        value: "10 Yr Low",
        label: "Refinery Investment",
        desc: "Global refinery investment set to fall to its lowest level in a decade by 2025, raising acute asset integrity concerns.",
        source: "IEA",
        icon: Flame,
        color: "#ef4444", // Red
        url: "https://www.iea.org/reports/world-energy-investment-2025"
    },
    {
        value: "72%",
        label: "Grid Bottleneck",
        desc: "Power executives cite grid infrastructure capacity as their 'very or extremely challenging' hurdle for expansion.",
        source: "Deloitte",
        icon: Zap,
        color: "#fbbf24", // Amber
        url: "https://www.deloitte.com/us/en/insights/industry/power-and-utilities/power-and-utilities-industry-outlook/2025.html"
    },
    {
        value: "C- Grade",
        label: "Water Infrastructure",
        desc: "US drinking water infrastructure rating, with a $625 billion investment gap needed for safety and compliance.",
        source: "ASCE",
        icon: Droplets,
        color: "#3b82f6", // Blue
        url: "https://infrastructurereportcard.org/"
    },
    {
        value: "-10%",
        label: "Mining Margins",
        desc: "Top 40 global miners saw EBITDA drop 10%, forcing operational efficiency to offset rising costs.",
        source: "PwC",
        icon: Pickaxe,
        color: "#a8a29e", // Stone
        url: "https://www.pwc.com/gx/en/industries/energy-utilities-resources/publications/mine.html"
    },
    {
        value: "$170B",
        label: "Power for AI",
        desc: "Direct requirement for new power generation capacity just to meet the surge in AI baseload demand.",
        source: "IEA",
        icon: Cpu, 
        color: "#8b5cf6", // Purple
        url: "https://www.iea.org/reports/world-energy-investment-2025"
    },
    {
        value: "#1 Risk",
        label: "Geoeconomic",
        desc: "Systemic geoeconomic confrontation ranked as top global risk for 2026, threatening resource flows.",
        source: "WEF",
        icon: Globe,
        color: "#10b981", // Emerald
        url: "https://www.weforum.org/publications/global-risks-report-2026/"
    }
];

const PILLARS = [
    {
        id: 'energy',
        title: "Energy Refinement",
        shortDesc: "Operating complex systems where safety, throughput, and asset integrity are inseparable.",
        icon: Flame,
        color: '#f97316', // Orange
        visualMode: 'distillation',
        content: {
            problem: "Energy refinement operations sit at the intersection of aging infrastructure, tightening safety expectations, and volatile market conditions. Facilities are expected to run continuously, often beyond their original design life, while absorbing changes in feedstock, demand patterns, and regulatory scrutiny. Over time, incremental adjustments accumulate, increasing operational stress without clear visibility into system-wide risk.\n\nDecision-making in this environment is constrained by legacy systems, deferred capital investment, and the high cost of unplanned outages. Maintenance tradeoffs are rarely binary; teams must weigh short-term throughput against long-term asset integrity, often with limited margin for error. Small deviations in process conditions can propagate quickly, yet the signals that precede major incidents are difficult to isolate amid normal operational variability.\n\nThe challenge is not knowing that risk exists, but understanding where it concentrates and how it evolves across interconnected systems. Without clearer insight into these dynamics, operators are forced to manage complex facilities reactively, under conditions where mistakes carry serious safety, financial, and environmental consequences.",
            intervene: "In energy refinement, intervention begins inside the operating envelope of the facility, where throughput, safety margins, and asset condition intersect. Attention is focused on how systems behave under sustained load, how process adjustments accumulate over time, and where stress concentrates across interconnected units.\n\nIntervention occurs at decision points that shape long-term performance: maintenance deferral choices, operating parameter changes, and responses to early signs of degradation. Rather than isolating assets, the work considers how upstream and downstream dependencies influence risk propagation within the plant.\n\nThe emphasis is on improving situational awareness across process, maintenance, and operations teams, enabling earlier recognition of conditions that threaten stability. The goal is to support disciplined intervention before variability escalates into incidents, outages, or irreversible damage.",
            approach: "To us, the real starting point is not transformation, but a clear understanding of how facilities behave under sustained load, how constraints interact, and where tolerance margins narrow over time. The approach prioritizes coherence across operations, maintenance, and engineering, ensuring that decisions about throughput, inspection, and intervention are informed by shared context rather than isolated metrics. Attention is given to how small changes accumulate, how stress migrates across systems, and how long-term asset integrity is affected by short-term tradeoffs.\n\nThis work values stability over novelty. Improvement is framed as strengthening control, reinforcing safe operating practices, and supporting decisions that preserve optionality in environments where recovery from error is slow and costly."
        }
    },
    {
        id: 'renewables',
        title: "Renewables & Sustainability",
        shortDesc: "Scaling energy systems constrained by geography, intermittency, and infrastructure readiness.",
        icon: Wind,
        color: '#22c55e', // Green
        visualMode: 'grid',
        content: {
            problem: "Renewable energy operations are shaped by factors that cannot be engineered away. Generation is inherently variable, site-dependent, and constrained by environmental conditions, while infrastructure readiness often lags behind deployment ambitions. As renewable capacity expands, the gap between installed assets and grid integration capability becomes increasingly apparent.\n\nThe core challenge lies in managing systems designed for stability within environments defined by fluctuation. Without approaches that account for physical limits and infrastructure dependencies, renewable operations risk underperformance, not due to lack of generation potential, but due to misalignment between assets, networks, and long-term operational realities.\n\nOperators must navigate uncertainty across multiple dimensions at once. This can include weather variability, interconnection delays, transmission bottlenecks, and evolving regulatory frameworks. Planning assumptions that hold at smaller scales break down as systems grow, exposing fragility in forecasting, coordination, and long-term reliability.",
            intervene: "In renewable and sustainable energy systems, intervention centers on alignment rather than control. The work focuses on the boundaries between generation assets, grid infrastructure, and regulatory frameworks, where mismatches in timing, capacity, and assumptions often emerge.\n\nIntervention takes place during planning and coordination phases. Interconnection design, capacity forecasting, and infrastructure sequencing, where long-term constraints are established. Attention is given to how variability is absorbed across the system and how operational decisions ripple through transmission, storage, and demand.\n\nRather than attempting to eliminate intermittency, intervention strengthens resilience by improving coordination across assets and stakeholders. The objective is to reduce fragility in systems that must operate reliably despite environmental and infrastructural uncertainty.",
            approach: "Rather than forcing stability onto inherently variable systems, our work prioritizes that same resilience we see in our clients' effort. Building operational practices that absorb fluctuation, respect constraints, and maintain reliability as systems expand and conditions evolve.\n\nOur approach emphasizes sequencing and coordination, aligning development timelines, infrastructure readiness, and operational assumptions before scale is pursued. Variability is treated as a design condition, not an anomaly, and planning reflects the realities of intermittency, congestion, and delayed interconnection.\n\nWe believe renewable and sustainable energy systems should be approached as networks of interdependent systems, rather than standalone assets. The focus is on understanding how generation, storage, transmission, and demand interact over time, and where physical and regulatory limits shape what is realistically achievable."
        }
    },
    {
        id: 'mining',
        title: "Mineral Extraction",
        shortDesc: "Managing extraction operations where geology, safety, and economics intersect.",
        icon: Pickaxe,
        color: '#a8a29e', // Stone
        visualMode: 'lidar',
        content: {
            problem: "Mineral extraction operations are governed by geology, not design intent. Once a site is developed, decisions about layout, sequencing, and equipment deployment are difficult to reverse. As conditions change underground or across a site, operators must adapt within fixed constraints, often with incomplete or evolving information.\n\nThe challenge our clients experience is often in sustaining performance and safety across long extraction horizons while responding to conditions that resist standardization. When insight into these dynamics is limited, organizations become increasingly exposed to disruptions that are costly to correct once they surface.\n\nSafety risks, equipment availability, and production targets are tightly coupled, making tradeoffs unavoidable. Variability in ore quality, ground conditions, and environmental factors introduces uncertainty that cannot be fully eliminated through planning alone. Over time, these uncertainties compound, affecting cost structures, workforce demands, and operational predictability.",
            intervene: "In mineral extraction, intervention occurs at the interface between geological reality and operational execution. The focus is on how plans adapt to changing conditions underground or across a site, and how risk is managed when variability exceeds expectations.\n\nIntervention is concentrated in sequencing decisions, equipment utilization strategies, and safety controls where uncertainty has the greatest operational impact. This includes how information from the field is incorporated into planning, how crews respond to abnormal conditions, and how tradeoffs are made between production targets and risk exposure.\n\nThe emphasis is on reinforcing decision-making under constraint, supporting operators and supervisors as they navigate irreversible choices in environments where correction is costly and delay compound risk.",
            approach: "We work with our clients from the approach that in 2026, mineral extraction is rooted in a lot of uncertainty. Geological variability, site conditions, and environmental exposure shape every operational decision, limiting the effectiveness of rigid plans or generalized optimization. Our work reinforces the disciplined adaptation of our clients. We support teams as they navigate irreversible choices and ensure that operational learning is carried forward across phases of extraction. The goal is sustained performance in environments where flexibility is limited and error compounds quickly.\n\nOur solutions center around adaptive execution within fixed constraints. Planning, sequencing, and safety practices are continuously recalibrated as conditions change, with attention to how information from the field informs supervisory judgment and risk management. Decisions are framed around exposure and consequence, not just output."
        }
    },
    {
        id: 'water',
        title: "Water Purification",
        shortDesc: "Maintaining safe and reliable water systems under aging infrastructure and regulatory pressure.",
        icon: Droplets,
        color: '#0ea5e9', // Sky Blue
        visualMode: 'filter',
        content: {
            problem: "Failures in this domain rarely emerge suddenly. Instead, they develop through deferred maintenance, workforce shortages, gradual system degradation, and increasing complexity across treatment processes. Operators must manage compliance and safety across systems that were often built for different demand profiles and regulatory expectations.\n\nWater purification systems operate under continuous public scrutiny, yet much of their risk accumulates quietly. Aging infrastructure, constrained budgets, and increasing regulatory requirements place sustained pressure on facilities tasked with delivering consistent water quality day after day.\n\nFor many of our clients, the challenge then becomes maintaining reliability and trust over time, particularly when system upgrades are slow and operational margins are thin. Without improved visibility into how risks build and interact across infrastructure, organizations struggle to prevent small issues from becoming systemic failures with significant public and regulatory consequences.",
            intervene: "In water purification systems, intervention begins with the slow-moving dynamics that shape long-term reliability. The focus is on how infrastructure conditions, maintenance practices, and regulatory compliance interact over extended time horizons.\n\nIntervention occurs at points where small degradations accumulate: treatment process adjustments, asset maintenance prioritization, and workforce continuity. Attention is given to how operational decisions made today influence compliance risk and service quality years into the future.\n\nRather than responding only to acute failures, intervention strengthens early visibility into system health and performance. The objective is to stabilize operations in environments where trust, safety, and regulatory accountability depend on sustained reliability rather than rapid change.",
            approach: "Rather than prioritizing rapid modernization, this work supports steady improvement that aligns operational capability with regulatory expectations and public responsibility. Success is measured by sustained safety, predictable service, and resilience under changing environmental and demand conditions.\n\nWater purification systems are approached with a focus on durability and public trust. The work begins by recognizing that reliability is achieved through consistent execution over long periods, often within aging infrastructure and constrained investment cycles. We approach this work with an emphasis on incremental stability. How to strengthen maintenance practices, reinforce process control, and ensure that compliance requirements are met without relying on heroic effort. Attention is given to how workforce continuity, documentation discipline, and asset condition interact to influence long-term performance"
        }
    }
];

const ECOSYSTEM = [
    "Esri", "SAP", "Oracle", "IBM", "Palantir", "Bentley Systems", "Hexagon", "Trimble", "Honeywell", "Wood Mackenzie", "Halliburton", "AVEVA", "Siemens Energy", "Schlumberger", "Veolia"
];

// --- VISUALIZERS ---

// 1. REFINERY: DISTILLATION (Particles Separation)
const DistillationVisualizer: React.FC<{ color: string }> = ({ color }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        let w = canvas.width = 300;
        let h = canvas.height = 300;

        const particles: any[] = [];
        for(let i=0; i<60; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                density: Math.random(), // 0 = light (top), 1 = heavy (bottom)
                speed: 0.5 + Math.random()
            });
        }

        let frameId: number;
        const render = () => {
            if (canvas.parentElement) {
                w = canvas.width = canvas.parentElement.clientWidth;
                h = canvas.height = canvas.parentElement.clientHeight;
            }
            ctx.clearRect(0,0,w,h);
            
            // Draw Tank Lines
            ctx.strokeStyle = 'rgba(255,255,255,0.1)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(w*0.3, 0); ctx.lineTo(w*0.3, h);
            ctx.moveTo(w*0.7, 0); ctx.lineTo(w*0.7, h);
            ctx.stroke();
            
            // Separation Levels
            [0.2, 0.4, 0.6, 0.8].forEach(lvl => {
                ctx.beginPath(); ctx.moveTo(w*0.3, h*lvl); ctx.lineTo(w*0.7, h*lvl); ctx.stroke();
            });

            particles.forEach(p => {
                const targetY = p.density * h;
                // Move towards target density height
                p.y += (targetY - p.y) * 0.05;
                p.x += (Math.random()-0.5) * 2;
                
                // Keep in bounds
                if(p.x < w*0.35) p.x = w*0.35;
                if(p.x > w*0.65) p.x = w*0.65;

                ctx.fillStyle = color;
                ctx.globalAlpha = 0.5 + (1-p.density)*0.5;
                ctx.beginPath(); ctx.arc(p.x, p.y, 2 + (1-p.density)*3, 0, Math.PI*2); ctx.fill();
            });
            ctx.globalAlpha = 1;
            frameId = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(frameId);
    }, [color]);
    return <canvas ref={canvasRef} className="w-full h-full" />;
};

// 2. RENEWABLES: GRID SYNC (Sine Waves + Mouse Distortion)
const GridSyncVisualizer: React.FC<{ color: string }> = ({ color }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            if (canvasRef.current) {
                const r = canvasRef.current.getBoundingClientRect();
                mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
            }
        };
        const el = canvasRef.current;
        if(el) el.addEventListener('mousemove', handleMove);
        return () => { if(el) el.removeEventListener('mousemove', handleMove); }
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        let w = canvas.width = 300;
        let h = canvas.height = 300;

        let t = 0;
        let frameId: number;
        const render = () => {
            if (canvas.parentElement) {
                w = canvas.width = canvas.parentElement.clientWidth;
                h = canvas.height = canvas.parentElement.clientHeight;
            }
            t += 0.05;
            ctx.clearRect(0,0,w,h);
            
            // Supply Wave (Green)
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            for(let x=0; x<w; x+=5) {
                const dist = Math.abs(x - mouseRef.current.x);
                const influence = Math.max(0, 1 - dist/100) * 20;
                const y = h/2 + Math.sin(x * 0.03 + t) * 40 + influence;
                if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
            }
            ctx.stroke();

            // Demand Wave (White - softened opacity)
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255,255,255,0.15)'; // Softer white
            for(let x=0; x<w; x+=5) {
                const dist = Math.abs(x - mouseRef.current.x);
                const influence = Math.max(0, 1 - dist/100) * 20;
                // Slight phase offset
                const y = h/2 + Math.sin(x * 0.03 + t + 0.5) * 40 - influence; 
                if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
            }
            ctx.stroke();
            
            // Sync nodes
            if (Math.sin(t) > 0.9) {
                ctx.fillStyle = '#fff';
                ctx.beginPath(); ctx.arc(w/2, h/2 + 40, 3, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(w/2, h/2 - 40, 3, 0, Math.PI*2); ctx.fill();
            }

            frameId = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(frameId);
    }, [color]);
    return <canvas ref={canvasRef} className="w-full h-full" />;
};

// 3. MINING: LIDAR SCAN (Vertical Depth + Ore Sparkles)
const MiningVisualizer: React.FC<{ color: string }> = ({ color }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        let w = canvas.width = 300;
        let h = canvas.height = 300;

        let t = 0;
        let frameId: number;
        
        // Ore Deposits
        const ores = Array.from({length: 10}, () => ({
            x: Math.random() * w,
            y: 50 + Math.random() * 250,
            val: Math.random()
        }));
        
        // Strata Layers
        const layers = [
            { y: 50, color: '#444' },
            { y: 120, color: '#333' },
            { y: 200, color: '#222' },
            { y: 280, color: '#111' }
        ];

        const render = () => {
            if (canvas.parentElement) {
                w = canvas.width = canvas.parentElement.clientWidth;
                h = canvas.height = canvas.parentElement.clientHeight;
            }
            t += 2;
            ctx.clearRect(0,0,w,h);
            
            // Draw Layers
            layers.forEach(l => {
                ctx.fillStyle = l.color;
                ctx.fillRect(0, l.y, w, 70);
            });

            // Draw Ores (Hidden mostly)
            ores.forEach(o => {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.beginPath(); ctx.arc(o.x, o.y, 3, 0, Math.PI*2); ctx.fill();
            });

            // Borehole
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(w/2 - 20, 0, 40, h);
            ctx.strokeStyle = color;
            ctx.strokeRect(w/2 - 20, 0, 40, h);

            // Scan Line
            const scanY = t % h;
            ctx.fillStyle = color;
            ctx.shadowBlur = 10; ctx.shadowColor = color;
            ctx.fillRect(w/2 - 30, scanY, 60, 2);
            ctx.shadowBlur = 0;

            // Highlight Ores when scanned
            ores.forEach(o => {
                if (Math.abs(o.y - scanY) < 10 && Math.abs(o.x - w/2) < 40) {
                    ctx.fillStyle = '#fff';
                    ctx.shadowBlur = 5; ctx.shadowColor = '#fff';
                    ctx.beginPath(); ctx.arc(o.x, o.y, 4, 0, Math.PI*2); ctx.fill();
                    ctx.shadowBlur = 0;
                }
            });

            frameId = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(frameId);
    }, [color]);
    return <canvas ref={canvasRef} className="w-full h-full" />;
};

// 4. WATER: FILTRATION (Flow)
const WaterVisualizer: React.FC<{ color: string }> = ({ color }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        let w = canvas.width = 300;
        let h = canvas.height = 300;

        const particles: any[] = [];
        for(let i=0; i<50; i++) particles.push({ x: Math.random()*w, y: Math.random()*h, speed: 1+Math.random() });

        let frameId: number;
        const render = () => {
            if (canvas.parentElement) {
                w = canvas.width = canvas.parentElement.clientWidth;
                h = canvas.height = canvas.parentElement.clientHeight;
            }
            ctx.clearRect(0,0,w,h);
            
            // Filter Barrier
            ctx.fillStyle = 'rgba(255,255,255,0.1)';
            ctx.fillRect(w/2 - 2, 0, 4, h);

            particles.forEach(p => {
                p.x += p.speed;
                if (p.x > w) p.x = 0;
                
                // Change color after filter
                if (p.x > w/2) {
                    ctx.fillStyle = color; // Pure
                    ctx.globalAlpha = 0.8;
                } else {
                    ctx.fillStyle = '#555'; // Dirty
                    ctx.globalAlpha = 0.4;
                }
                
                ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI*2); ctx.fill();
            });
            ctx.globalAlpha = 1;
            frameId = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(frameId);
    }, [color]);
    return <canvas ref={canvasRef} className="w-full h-full" />;
};

// --- BACKGROUND FOR MODAL ---
const ResourceBackground: React.FC<{ mode: string, color: string }> = ({ mode, color }) => {
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

        // MODE 1: DISTILLATION (Bubbles)
        const bubbles = Array.from({length: 50}, () => ({
            x: Math.random() * w, y: Math.random() * h,
            r: Math.random() * 20 + 5,
            speed: Math.random() * 2 + 0.5
        }));

        const render = () => {
            time += 0.01;
            ctx.fillStyle = 'rgba(2,2,2,0.2)';
            ctx.fillRect(0,0,w,h);

            if (mode === 'distillation') {
                bubbles.forEach(b => {
                    b.y -= b.speed;
                    if (b.y < -50) b.y = h + 50;
                    ctx.fillStyle = color;
                    ctx.globalAlpha = 0.1 + (b.r / 30);
                    ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI*2); ctx.fill();
                });
            } 
            else if (mode === 'grid') {
                ctx.strokeStyle = color;
                ctx.lineWidth = 1;
                ctx.globalAlpha = 0.2;
                
                // Perspective Grid
                const lines = 20;
                
                for(let i=0; i<lines; i++) {
                    const offset = (time * 100 + i * 100) % (h);
                    const y = (h/2) + offset; // Below horizon
                    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
                    
                    const x = (time * 50 + i * (w/lines)) % w;
                    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
                }
            } 
            else if (mode === 'lidar') {
                const scanX = (time * 200) % w;
                ctx.fillStyle = color;
                ctx.globalAlpha = 0.1;
                ctx.fillRect(scanX, 0, 50, h);
                
                // Random points
                for(let i=0; i<20; i++) {
                    const rx = Math.random() * w;
                    const ry = Math.random() * h;
                    if (Math.abs(rx - scanX) < 100) {
                        ctx.globalAlpha = 0.8;
                        ctx.fillRect(rx, ry, 2, 2);
                    }
                }
            }
            else if (mode === 'filter') {
                ctx.fillStyle = color;
                for(let i=0; i<w; i+=20) {
                    const y = h/2 + Math.sin(i * 0.01 + time) * 50;
                    ctx.globalAlpha = 0.1;
                    ctx.fillRect(i, y, 10, h);
                }
            }

            ctx.globalAlpha = 1;
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

// --- ENHANCED STAT CARD ---
const StatCard: React.FC<{ stat: typeof STATS[0], index: number }> = ({ stat, index }) => {
    const cardRef = useRef<HTMLAnchorElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <a 
            ref={cardRef}
            href={stat.url}
            target="_blank"
            rel="noopener noreferrer"
            onMouseMove={handleMouseMove}
            className="group relative p-8 bg-[#0c0c0e] border border-white/5 rounded-2xl transition-all duration-500 overflow-hidden hover:-translate-y-1 block cursor-pointer"
            style={{ '--card-color': stat.color } as React.CSSProperties}
        >
            <div className="absolute inset-0 border border-transparent group-hover:border-[var(--card-color)] opacity-0 group-hover:opacity-50 rounded-2xl transition-all duration-500 pointer-events-none" />
            
            {/* Interactive Spotlight */}
            <div 
                className="pointer-events-none absolute -inset-px transition duration-300 opacity-0 group-hover:opacity-100"
                style={{ 
                    background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, ${stat.color}15, transparent 40%)` 
                }}
            />

            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none" 
                 style={{ 
                     backgroundImage: `linear-gradient(${stat.color} 1px, transparent 1px), linear-gradient(90deg, ${stat.color} 1px, transparent 1px)`, 
                     backgroundSize: '30px 30px' 
                 }} 
            />
            
            {/* Watermark Icon */}
            <div className="absolute -right-8 -bottom-8 text-white/5 group-hover:text-[var(--card-color)] group-hover:opacity-10 transition-all duration-700 pointer-events-none transform group-hover:scale-110 group-hover:rotate-12">
                {React.createElement(stat.icon, { size: 140, strokeWidth: 0.5 })}
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white transition-colors border border-white/5 group-hover:bg-[var(--card-color)] group-hover:border-transparent shadow-lg">
                            {React.createElement(stat.icon, { size: 24 })}
                        </div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 group-hover:text-[var(--card-color)] transition-colors border border-white/10 px-2 py-1 rounded bg-[#0a0a0c]">
                            {stat.source}
                        </span>
                    </div>
                    
                    <div className="text-4xl md:text-5xl font-mono font-bold text-white mb-2 tracking-tight group-hover:scale-105 transition-transform origin-left">
                        {stat.value}
                    </div>
                    <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-4 group-hover:text-white transition-colors">{stat.label}</h4>
                </div>

                <p className="text-sm text-white/60 leading-relaxed border-t border-white/5 pt-4 group-hover:border-white/10 transition-colors">
                    {stat.desc}
                </p>
            </div>
        </a>
    );
};

// --- PILLAR CARD WITH 3D TILT ---
const TiltPillarCard: React.FC<{ pillar: any, onClick: () => void }> = ({ pillar, onClick }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg)");

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -5; // Max 5 deg tilt
        const rotateY = ((x - centerX) / centerX) * 5;

        setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
    };

    const handleMouseLeave = () => {
        setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg)");
    };

    return (
        <div 
            ref={cardRef}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="group relative h-[450px] bg-[#0c0c0e] border border-white/10 rounded-3xl overflow-hidden cursor-pointer hover:border-white/30 transition-all duration-300 hover:shadow-2xl flex flex-col"
            style={{ transform, transition: 'transform 0.1s ease-out' }}
        >
            {/* Visual */}
            <div className="absolute inset-0 opacity-30 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                {pillar.visualMode === 'distillation' && <DistillationVisualizer color={pillar.color} />}
                {pillar.visualMode === 'grid' && <GridSyncVisualizer color={pillar.color} />}
                {pillar.visualMode === 'lidar' && <MiningVisualizer color={pillar.color} />}
                {pillar.visualMode === 'filter' && <WaterVisualizer color={pillar.color} />}
            </div>

            {/* Content */}
            <div className="relative z-10 p-8 flex flex-col h-full pointer-events-none">
                <div className="w-12 h-12 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center text-white/50 group-hover:text-white group-hover:scale-110 transition-all backdrop-blur-md mb-auto">
                    {React.createElement(pillar.icon, { size: 20 })}
                </div>

                <div className="bg-[#0c0c0e]/90 backdrop-blur-xl p-6 -mx-8 -mb-8 border-t border-white/10">
                    <h3 className="text-lg font-serif text-white mb-2 group-hover:text-emerald-400 transition-colors">{pillar.title}</h3>
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

export const NaturalResourcesPage: React.FC = () => {
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
        window.scrollTo(0, 0);
    };

    const handleClose = () => {
        setExpandedPillarId(null);
        setTimeout(() => {
            document.getElementById('strategic-domains')?.scrollIntoView({ behavior: 'instant', block: 'start' });
        }, 10);
    };

    return (
        <div className="relative min-h-screen bg-[#020202] text-white pt-24 font-sans overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-400">
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
                        {/* 3D Topography Background */}
                        <div className="absolute inset-0 z-0">
                            <ResourcesHeroVisualizer />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-[#020202]/80 z-10" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#020202] via-transparent to-[#020202] z-10" />

                        <div className="relative z-20 max-w-[1800px] mx-auto px-6 md:px-12 w-full text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-widest mb-8 animate-in slide-in-from-bottom-4 duration-700 backdrop-blur-md">
                                <Mountain size={14} />
                                <span>Natural Resources</span>
                            </div>
                            <h1 className="text-5xl md:text-8xl font-serif text-white mb-8 max-w-4xl leading-[0.95] tracking-tight">
                                Physical Limits. <br/>
                                <span className="text-emerald-500 italic">Infinite Complexity.</span>
                            </h1>
                            <p className="text-xl text-white/60 max-w-2xl leading-relaxed mb-12 font-light">
                                Operations defined by physical constraints, long time horizons, and irreversible decisions.
                            </p>
                            <div className="flex flex-col md:flex-row gap-4">
                                <button onClick={() => document.getElementById('strategic-domains')?.scrollIntoView({behavior: 'smooth'})} className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-widest text-xs rounded transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                                    Explore Strategy
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* --- CONTEXT --- */}
                    <section className="py-32 bg-[#050505] border-b border-white/5 relative">
                        <div className="absolute top-0 right-0 p-64 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
                        
                        <div className="max-w-[1800px] mx-auto px-6 md:px-12 text-center relative z-10">
                            <h2 className="text-3xl md:text-4xl font-serif text-white mb-12">The Hard Asset Reality</h2>
                            <p className="text-lg md:text-xl text-white/60 leading-relaxed text-justify font-light max-w-4xl mx-auto">
                                Natural Resources sectors operate against hard physical limits. Geology is fixed, weather is unpredictable, and infrastructure is capital-intensive. Success depends on maximizing yield and efficiency within these unyielding constraints. As resource scarcity grows and sustainability mandates tighten, operators must balance extraction targets with environmental stewardship and community license to operate. The challenge is not just finding resources, but managing the complex interplay of physical, economic, and regulatory variables that define modern extraction and generation.
                            </p>
                        </div>
                    </section>

                    {/* --- STATS GRID --- */}
                    <section className="py-24 bg-[#08080a] border-b border-white/5">
                        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {STATS.map((stat, i) => (
                                    <StatCard key={i} stat={stat} index={i} />
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* --- PILLARS --- */}
                    <ViewportSlot minHeight="800px" id="strategic-domains">
                        <section className="py-24 bg-[#020202] scroll-mt-24">
                            <div className="max-w-[1800px] mx-auto px-6 md:px-12">
                                <div className="text-center mb-20">
                                    <h2 className="text-4xl font-serif text-white mb-6">Strategic Domains</h2>
                                    <p className="text-white/50 max-w-2xl mx-auto">Core operational pillars where we deploy intelligence.</p>
                                </div>

                                <div className="grid md:grid-cols-3 gap-8">
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
                    </ViewportSlot>

                    {/* --- ECOSYSTEM FOOTER --- */}
                    <section className="py-32 border-t border-white/5 bg-[#050505]">
                        <div className="max-w-[1800px] mx-auto px-6 md:px-12 text-center">
                            <p className="text-xs font-mono uppercase tracking-widest text-white/30 mb-12">Integrated Ecosystem</p>
                            
                            <div className="relative w-full overflow-hidden mb-16">
                                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10" />
                                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10" />
                                
                                <div className="flex w-max animate-marquee">
                                    {[...ECOSYSTEM, ...ECOSYSTEM].map((tech, i) => (
                                        <div key={i} className="mx-8 text-white/40 font-serif text-2xl hover:text-emerald-500 transition-colors cursor-default whitespace-nowrap">
                                            {tech}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* --- NEW CROSS-NAVIGATION FOOTER --- */}
                    <IndustryNavigationFooter currentId="resources" />
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
                    <div className="fixed top-0 left-0 h-1 bg-emerald-500 z-[120] transition-all duration-100 ease-out" style={{ width: `${scrollProgress * 100}%` }} />

                    <div className="min-h-screen flex flex-col relative">
                        
                        {/* Immersive Background */}
                        <div className="fixed inset-0 z-0">
                            <ResourceBackground mode={activePillar.visualMode} color={activePillar.color} />
                            <div className="absolute inset-0 bg-gradient-to-b from-[#020202] via-[#020202]/80 to-[#020202]" />
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
                                    <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-widest animate-in slide-in-from-top-4 duration-700">
                                        <Mountain size={12} />
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
                                            <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest">The Problem</h3>
                                        </div>
                                        <FormattedContent text={activePillar.content.problem} />
                                    </section>
                                    
                                    {/* VISUAL BREAK 1: WIDE */}
                                    <ImagePlaceholder 
                                        type="wide" 
                                        label="Geological Scan" 
                                        caption="Mapping subterranean constraints." 
                                        src="https://jar5gzlwdkvsnpqa.public.blob.vercel-storage.com/info_site_topographical_wireframe_emerald_grid_dark_void_contour_lines.jpg"
                                    />

                                    {/* SECTION 2: INTERVENTION */}
                                    <section>
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-12 h-px bg-amber-400/50" />
                                            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest">The Intervention</h3>
                                        </div>
                                        <FormattedContent text={activePillar.content.intervene} />
                                    </section>

                                    {/* VISUAL BREAK 2: PORTRAIT GRID */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
                                        <ImagePlaceholder 
                                            type="portrait" 
                                            label="Asset Monitor" 
                                            caption="Real-time equipment telemetry." 
                                            src="https://jar5gzlwdkvsnpqa.public.blob.vercel-storage.com/info_site_industrial_complex_volumetric_steam_concrete_cooling_tower_steel_piping_utilitarian_geometry_natural_daylight.jpg"
                                        />
                                        <ImagePlaceholder 
                                            type="portrait" 
                                            label="Extraction Plan" 
                                            caption="Optimized sequencing model." 
                                            src="https://jar5gzlwdkvsnpqa.public.blob.vercel-storage.com/info_site_laser_projection_industrial_polymer_forged_steel_technical_inspection_nocturnal_maintenance.jpg"
                                        />
                                    </div>

                                    {/* SECTION 3: APPROACH */}
                                    <section>
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-12 h-px bg-emerald-500/50" />
                                            <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Our Approach</h3>
                                        </div>
                                        <FormattedContent text={activePillar.content.approach} />
                                    </section>

                                    {/* FINAL VISUAL */}
                                    <ImagePlaceholder 
                                        type="square" 
                                        label="System Overview" 
                                        caption="Integrated resource management dashboard." 
                                        src="https://jar5gzlwdkvsnpqa.public.blob.vercel-storage.com/info_site_matte_polymer_bins_diffuse_overhead_illumination_orthogonal_storage_grid_complex_mechanical_assemblies_collaborative_technical_learning.jpg"
                                    />
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
                            <button onClick={handleClose} className="pointer-events-auto px-8 py-3 bg-white hover:bg-emerald-400 text-black font-bold uppercase tracking-widest text-xs rounded-full shadow-lg transition-colors">
                                Close Module
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};
