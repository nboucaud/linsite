
import React, { useState, useEffect, useRef } from 'react';
import { 
    Zap, Compass, LineChart, Puzzle, 
    Scale, Database, AlertTriangle, ShieldAlert, Bot, Rocket,
    ArrowRight, X, ScanLine, Target, Microscope, ImageIcon, ChevronUp
} from 'lucide-react';
import { SmallBusinessHeroVisualizer } from './SmallBusinessHeroVisualizer';
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
                            return <strong key={i} className="text-white font-medium text-purple-400 font-sans">{part.slice(2, -2)}</strong>;
                        }
                        return <span key={i}>{part}</span>;
                    })}
                </p>
            ))}
        </div>
    );
};

// Enhanced Image Component with JS Canvas Overlay
const ImagePlaceholder: React.FC<{ type: 'wide' | 'portrait' | 'square', label: string, src?: string, blend?: boolean }> = ({ type, label, src, blend }) => {
    const aspect = type === 'wide' ? 'aspect-[21/9]' : type === 'portrait' ? 'aspect-[3/4]' : 'aspect-square';
    const widthClass = type === 'wide' ? 'w-full' : 'w-full';
    
    // Intersection Observer for Reveal Effect
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        }, { threshold: 0.1 });
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    // Canvas Effect (The ".js" part)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !isVisible) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;

        const render = () => {
            time += 1;
            const w = canvas.parentElement?.clientWidth || 300;
            const h = canvas.parentElement?.clientHeight || 300;
            canvas.width = w;
            canvas.height = h;

            ctx.clearRect(0, 0, w, h);

            // 1. Scanline
            const scanY = (time * 2) % h;
            ctx.fillStyle = 'rgba(168, 85, 247, 0.1)'; // Purple tint
            ctx.fillRect(0, scanY, w, 2);

            // 2. Random Glitch Blocks
            if (Math.random() > 0.9) {
                const bw = Math.random() * 100;
                const bh = Math.random() * 5;
                const bx = Math.random() * w;
                const by = Math.random() * h;
                ctx.fillStyle = 'rgba(168, 85, 247, 0.4)';
                ctx.fillRect(bx, by, bw, bh);
            }

            // 3. Corner UI
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 1;
            // TL
            ctx.beginPath(); ctx.moveTo(10, 30); ctx.lineTo(10, 10); ctx.lineTo(30, 10); ctx.stroke();
            // BR
            ctx.beginPath(); ctx.moveTo(w-10, h-30); ctx.lineTo(w-10, h-10); ctx.lineTo(w-30, h-10); ctx.stroke();

            animationFrameId = requestAnimationFrame(render);
        };
        render();

        return () => cancelAnimationFrame(animationFrameId);
    }, [isVisible]);
    
    return (
        <div ref={containerRef} className={`my-16 group cursor-default ${widthClass} transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className={`w-full ${aspect} bg-[#0c0c0e] border border-white/10 rounded-lg flex flex-col items-center justify-center relative overflow-hidden group shadow-2xl`}>
                {src ? (
                    <>
                        <img 
                            src={src} 
                            alt={label}
                            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${blend ? 'mix-blend-multiply contrast-125' : ''}`}
                        />
                        {/* Canvas Overlay */}
                        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-60 mix-blend-screen" />
                        
                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out skew-x-12 pointer-events-none" />
                    </>
                ) : (
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                )}
            </div>
        </div>
    );
};

// --- DATA ---

const STATS = [
    {
        value: "29%",
        label: "The Scaling Gap",
        desc: "Only 29% of companies <$100M revenue scale AI successfully vs 50% of large enterprises.",
        source: "McKinsey",
        icon: Scale,
        color: "#f472b6", // Pink
        url: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai-how-organizations-are-rewiring-to-capture-value#/"
    },
    {
        value: "92%",
        label: "Tech ROI Failure",
        desc: "Operations leaders report recent tech investments have not fully delivered expected results.",
        source: "PwC",
        icon: AlertTriangle,
        color: "#fbbf24", // Amber
        url: "https://www.pwc.com/us/en/services/consulting/business-transformation/digital-supply-chain-survey.html"
    },
    {
        value: "75%",
        label: "Data Risk",
        desc: "Small business owners indicate limited access to data would directly harm operations.",
        source: "U.S. Chamber",
        icon: Database,
        color: "#ef4444", // Red
        url: "https://www.uschamber.com/technology/empowering-small-business-the-impact-of-technology-on-u-s-small-business"
    },
    {
        value: "15%",
        label: "Autonomous Decisions",
        desc: "Of day-to-day work decisions will be made autonomously by AI agents by 2028.",
        source: "Gartner",
        icon: Bot,
        color: "#8b5cf6", // Purple
        url: "https://www.gartner.com/en/articles/top-technology-trends-2026"
    },
    {
        value: "51%",
        label: "Digital Risk",
        desc: "Private leaders cite cyber threats as top enterprise concern, shifting governance focus.",
        source: "Deloitte",
        icon: ShieldAlert,
        color: "#3b82f6", // Blue
        url: "https://www.deloitte.com/us/en/services/deloitte-private/articles/private-company-governance.html"
    },
    {
        value: "79%",
        label: "Pilot Purgatory",
        desc: "Organizations piloting GenAI remain stuck in experimentation, unable to bridge to value.",
        source: "Deloitte",
        icon: Rocket,
        color: "#10b981", // Emerald
        url: "https://www.deloitte.com/us/en/services/deloitte-private/articles/private-company-governance.html"
    }
];

const PILLARS = [
    {
        id: 'strategy',
        title: "Business Operations Strategy",
        shortDesc: "Turning day-to-day decisions into coordinated operating plans.",
        subtitle: "Aligning forecasting, resource allocation, and priorities without slowing velocity.",
        icon: Compass,
        color: '#8b5cf6', // Violet
        visualMode: 'alignment',
        content: {
            problem: "In lean organizations, operational decisions rarely happen in isolation. Hiring, budgeting, delivery, and growth planning often move simultaneously, with limited separation between strategic intent and daily execution. As a result, leaders are asked to make consequential decisions quickly, often without the benefit of consolidated views or long planning cycles.\n\nThe challenge is not a lack of effort or insight, but the **difficulty of maintaining alignment as the organization grows.** As teams expand and responsibilities diversify, assumptions that once lived in a founder’s head become harder to communicate consistently. Forecasts, priorities, and resource decisions can drift out of sync, even when everyone is working toward the same goals.\n\nOver time, this creates friction, not because strategy is missing, but because it is distributed across tools, conversations, and individuals. The problem is sustaining clarity and coordination without slowing the organization’s natural pace.",
            intervene: "The moment intervention matters most is when decisions start compounding faster than alignment. In growing organizations, it becomes increasingly difficult to see how individual choices, like hiring, pricing, capacity, delivery, interact across the business in real time.\n\nIntervention focuses on **restoring a shared operating picture.** This means clarifying how forecasts, priorities, and constraints connect across functions, so decisions reinforce each other instead of competing for attention. The emphasis is on coordination and augmentation across teams. Creating enough structure to support scale without disrupting momentum.\n\nThis work intervenes at the level of decision context: ensuring leaders have visibility into tradeoffs before they become commitments, and that teams are operating from the same assumptions as the organization grows.",
            approach: "We always want to slow down the noise for our clients, without slowing down business operations. In fast-moving organizations, clarity is often buried under urgency. The work here is about **creating space for better decisions while preserving momentum.**\n\nSupport focuses on helping leaders see how leaders see how operational choices connect—where constraints are forming, where capacity is tightening, and where decisions made today will echo tomorrow. This is done by strengthening shared understanding across functions, not by introducing rigid planning layers. The intent is to make coordination easier, not heavier. Support shows up as clearer framing, better timing, and fewer surprises as the organization grows and adapts."
        }
    },
    {
        id: 'revenue',
        title: "Revenue & Market Intelligence",
        shortDesc: "Understanding demand, growth, and customer behavior as conditions evolve.",
        subtitle: "Separating meaningful patterns from temporary noise in volatile markets.",
        icon: LineChart,
        color: '#3b82f6', // Blue
        visualMode: 'signal',
        content: {
            problem: "Revenue signals in SMB environments tend to arrive unevenly. Customer behavior shifts, channels perform inconsistently, and attribution is rarely straightforward. Leaders are often forced to interpret performance using partial data, anecdotal feedback, or short-term trends that may not reflect underlying demand.\n\nWe recognize that the **difficulty lies in separating meaningful patterns from temporary noise.** Growth decisions must be made before certainty is available, yet overreacting to early signals can be as costly as ignoring them. Teams may track metrics diligently, but still struggle to connect marketing activity, customer behavior, and long-term revenue outcomes into a coherent picture. This creates a tension between speed and confidence. The problem is not insight itself, but knowing which signals to trust as conditions evolve and the business scales.",
            intervene: "With every client, we start by acknowledging that curving uncertainty and complexity is part of the growth process. Market signals are rarely clean, and waiting for perfect clarity is not an option. The role here is not to simplify reality, but to help teams navigate it with confidence.\n\nSupport focuses on improving how revenue signals are interpreted, connecting marketing activity, customer behavior, and performance outcomes into a **coherent narrative that evolves over time.** This allows leaders to make adjustments without constantly resetting strategy or second-guessing decisions. The aim is steadier judgment. Support helps teams trust their understanding of the market even when conditions shift and outcomes lag behind actions.",
            approach: "Support starts by acknowledging that uncertainty is part of growth. Market signals are rarely clean, and waiting for perfect clarity is not an option. The role here is not to simplify reality, but to help teams navigate it with confidence.\n\nSupport focuses on improving how revenue signals are interpreted, like connecting marketing activity, customer behavior, and performance outcomes into a coherent narrative that evolves over time. This allows leaders to make adjustments without constantly resetting strategy or second-guessing decisions.\n\nThe aim is always to foster **steadier judgment and decision-making for our clients**, based on the intelligence that they believe in. We believe that this helps teams trust their understanding of the market even when conditions shift and outcomes lag behind actions."
        }
    },
    {
        id: 'technology',
        title: "Technology Design & Adoption",
        shortDesc: "Building systems that support how work actually gets done.",
        subtitle: "Aligning tools with operational reality to reduce friction and friction.",
        icon: Puzzle,
        color: '#10b981', // Emerald
        visualMode: 'architecture',
        content: {
            problem: "Technology in growing organizations is rarely chosen all at once. Systems are added incrementally to address immediate needs, like managing requests, tracking work, and supporting customers. Often under time pressure and without the benefit of long-term architectural planning. Over time, these tools begin to overlap, creating friction rather than efficiency.\n\nWith technology design and adoption, it is rarely about “poor decision-making”. It is about the reality that **early technology choices are made before future scale is clear.** As workflows become more complex, teams may find themselves adapting their work to fit tools that were never designed to support evolving processes. This can slow execution, increase manual effort, and make it harder to maintain shared visibility. The problem is not technology adoption itself, but ensuring that systems continue to support how work is actually done as the organization grows.",
            intervene: "Technology stops helping when it starts shaping work instead of supporting it. As systems accumulate, friction often shows up not as failure, but as extra steps, workarounds, and duplicated effort. Intervention occurs at the intersection of workflows and systems.\n\nThe focus is on **aligning tools with how work actually happens, in real time.** Through requests, approvals, handoffs, reporting, and sometimes, tribal knowledge. We create technologies with our clients that reduce effort and prioritizes human judgement and interaction, rather than redistributes it. This includes evaluating what to simplify, what to connect, and what to leave untouched. The goal is not to replace systems, but to ensure they remain useful as the organization evolves. Intervention supports clarity, continuity, and scale without recreating the overhead of enterprise environments.",
            approach: "More than anything, this support begins by respecting the systems already in place. Most organizations arrive here having made reasonable technology choices under real constraints. The challenge is rarely starting over, it’s **keeping tools useful as work changes.**\n\nSupport focuses on reducing friction where it shows up: unnecessary handoffs, duplicated work, and unclear ownership. This involves aligning systems with workflows so technology quietly supports execution rather than demanding attention. The goal is continuity. Support ensures that tools remain assets as the organization scales, without introducing complexity that slows teams down or pulls focus away from the work itself."
        }
    }
];

// ... (VISUALIZERS & COMPONENTS KEPT SAME AS PREVIOUS)
// RE-ADDING VISUALIZERS FOR FILE INTEGRITY

const AlignmentVisualizer: React.FC<{ color: string }> = ({ color }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let frameId: number;
        const boids: any[] = [];
        for(let i=0; i<60; i++) boids.push({x: Math.random()*300, y: Math.random()*300, vx: Math.random()*2-1, vy: Math.random()*2-1});
        const render = () => {
            ctx.clearRect(0,0,canvas.width,canvas.height);
            boids.forEach(b => {
                b.x += b.vx; b.y += b.vy;
                if(b.x<0||b.x>300) b.vx*=-1; if(b.y<0||b.y>300) b.vy*=-1;
                ctx.fillStyle=color; ctx.beginPath(); ctx.arc(b.x,b.y,2,0,Math.PI*2); ctx.fill();
            });
            frameId = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(frameId);
    }, [color]);
    return <canvas ref={canvasRef} className="w-full h-full" width={300} height={300} />;
};

const SignalVisualizer: React.FC<{ color: string }> = ({ color }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let t = 0; let frameId: number;
        const render = () => {
            t+=0.1; ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.strokeStyle=color; ctx.beginPath();
            for(let x=0; x<300; x+=5) ctx.lineTo(x, 150 + Math.sin(x*0.05 + t)*20);
            ctx.stroke();
            frameId=requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(frameId);
    }, [color]);
    return <canvas ref={canvasRef} className="w-full h-full" width={300} height={300} />;
};

const ArchitectureVisualizer: React.FC<{ color: string }> = ({ color }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let t = 0; let frameId: number;
        const render = () => {
            t+=0.02; ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.strokeStyle=color;
            const s = 40;
            for(let x=0; x<300; x+=s) for(let y=0; y<300; y+=s) {
                if(Math.sin(x*y + t) > 0) ctx.strokeRect(x,y,s,s);
            }
            frameId=requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(frameId);
    }, [color]);
    return <canvas ref={canvasRef} className="w-full h-full" width={300} height={300} />;
};

const ModalBackground: React.FC<{ mode: string, color: string }> = ({ mode, color }) => {
    return <div className="absolute inset-0 bg-black/50" />; 
};

const StatCard: React.FC<{ stat: typeof STATS[0], index: number }> = ({ stat, index }) => {
    return (
        <a 
            href={stat.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-8 bg-[#0c0c0e] border border-white/5 rounded-3xl transition-all duration-500 overflow-hidden hover:-translate-y-1 hover:shadow-2xl block cursor-pointer"
            style={{ '--card-color': stat.color } as React.CSSProperties}
        >
            <div className="absolute inset-0 border border-transparent group-hover:border-[var(--card-color)] opacity-0 group-hover:opacity-100 rounded-3xl transition-all duration-500 pointer-events-none" />
            <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -right-6 -bottom-6 text-white/5 group-hover:text-[var(--card-color)] group-hover:opacity-10 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12 pointer-events-none">
                {React.createElement(stat.icon, { size: 120, strokeWidth: 0.5 })}
            </div>
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-white transition-colors group-hover:bg-[var(--card-color)] group-hover:border-transparent group-hover:shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                        {React.createElement(stat.icon, { size: 24 })}
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 group-hover:text-[var(--card-color)] transition-colors border border-white/10 px-2 py-1 rounded bg-[#0a0a0c]">
                        {stat.source}
                    </span>
                </div>
                <div className="mt-auto">
                    <div className="text-4xl lg:text-5xl font-mono font-bold text-white mb-2 tracking-tighter group-hover:text-[var(--card-color)] transition-colors">
                        {stat.value}
                    </div>
                    <h4 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4 group-hover:text-white transition-colors">{stat.label}</h4>
                    <div className="h-px w-full bg-white/10 mb-4 group-hover:bg-white/20" />
                    <p className="text-sm text-white/50 leading-relaxed group-hover:text-white/80 transition-colors">
                        {stat.desc}
                    </p>
                </div>
            </div>
        </a>
    );
};

const TiltPillarCard: React.FC<{ pillar: any, onClick: () => void }> = ({ pillar, onClick }) => {
    return (
        <div 
            onClick={onClick}
            className="group relative h-[450px] bg-[#0c0c0e] border border-white/10 rounded-3xl overflow-hidden cursor-pointer hover:border-white/30 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col"
        >
            <div className="absolute inset-0 opacity-40 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-screen">
                {pillar.visualMode === 'alignment' && <AlignmentVisualizer color={pillar.color} />}
                {pillar.visualMode === 'signal' && <SignalVisualizer color={pillar.color} />}
                {pillar.visualMode === 'architecture' && <ArchitectureVisualizer color={pillar.color} />}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-transparent opacity-80" />
            <div className="relative z-10 p-8 flex flex-col h-full pointer-events-none">
                <div className="w-12 h-12 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center text-white/50 group-hover:text-white group-hover:scale-110 transition-all backdrop-blur-md mb-auto group-hover:bg-white/10 group-hover:border-white/20">
                    {React.createElement(pillar.icon, { size: 20 })}
                </div>
                <div className="bg-[#0c0c0e]/80 backdrop-blur-xl p-6 -mx-8 -mb-8 border-t border-white/10 group-hover:border-white/20 transition-colors">
                    <h3 className="text-lg font-serif text-white mb-2 group-hover:text-purple-400 transition-colors">{pillar.title}</h3>
                    <p className="text-xs text-white/50 leading-relaxed mb-4 line-clamp-3">{pillar.shortDesc}</p>
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-white/30 group-hover:text-white transition-colors">
                        <span>Initialize Protocol</span>
                        <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN PAGE ---

export const SmallBusinessPage: React.FC = () => {
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
        <div className="relative min-h-screen bg-[#020202] text-white pt-24 font-sans overflow-x-hidden selection:bg-purple-500/30 selection:text-purple-400">
            
            {!expandedPillarId && (
                <>
                    {/* --- HERO --- */}
                    <div className="relative h-[85vh] min-h-[600px] flex flex-col justify-center border-b border-white/10 bg-[#020202] overflow-hidden animate-in fade-in duration-500">
                        {/* FIX: Absolute Positioning to prevent layout push */}
                        <div className="absolute inset-0 z-0">
                            <SmallBusinessHeroVisualizer />
                        </div>
                        
                        <div className="absolute inset-0 bg-gradient-to-r from-[#020202] via-[#020202]/85 to-transparent z-10" />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#020202] via-transparent to-[#020202] z-10" />

                        <div className="relative z-20 max-w-[1800px] mx-auto px-6 md:px-12 w-full text-center md:text-left pointer-events-none">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 text-[10px] font-bold uppercase tracking-widest mb-8 animate-in slide-in-from-bottom-4 duration-700 backdrop-blur-md pointer-events-auto">
                                <Zap size={14} />
                                <span>SMB Operations</span>
                            </div>
                            <h1 className="text-5xl md:text-8xl font-serif text-white mb-8 max-w-4xl leading-[0.95] tracking-tight">
                                Lean, High-Velocity <br/>
                                <span className="text-purple-500 italic">Organizations.</span>
                            </h1>
                            <p className="text-xl text-white/60 max-w-2xl leading-relaxed mb-12 font-light">
                                SMB Operations are defined by rapid decision cycles, constrained resources, and the need to scale without enterprise overhead.
                            </p>
                            <div className="flex flex-col md:flex-row gap-4 pointer-events-auto">
                                <button onClick={() => document.getElementById('strategic-domains')?.scrollIntoView({behavior: 'smooth'})} className="px-8 py-4 bg-purple-500 hover:bg-purple-400 text-black font-bold uppercase tracking-widest text-xs rounded transition-all shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                                    Explore Strategy
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* --- CONTEXT --- */}
                    <ViewportSlot minHeight="600px">
                        <section className="py-32 bg-[#050505] border-b border-white/5 relative">
                            <div className="absolute top-0 right-0 p-64 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />
                            
                            <div className="max-w-[1800px] mx-auto px-6 md:px-12 text-center relative z-10">
                                <h2 className="text-3xl md:text-4xl font-serif text-white mb-12">The Scaling Paradox</h2>
                                <p className="text-lg md:text-xl text-white/60 leading-relaxed text-justify font-light max-w-4xl mx-auto">
                                    SMB Operations refers to small and mid-sized businesses where operational decisions, revenue strategy, analytics, and technology adoption are tightly coupled and continuously evolving. Unlike large enterprises, SMBs operate without the buffer of specialized departments. Planning, execution, and adjustment occur simultaneously. As SMBs grow, operational complexity increases faster than formal structure. Success depends on integrated systems that support planning, execution, and scaling while preserving speed, accountability, and adaptability.
                                </p>
                            </div>
                        </section>
                    </ViewportSlot>

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

                    {/* --- NEW CROSS-NAVIGATION FOOTER --- */}
                    <IndustryNavigationFooter currentId="smb" />
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
                    <div className="fixed top-0 left-0 h-1 bg-purple-500 z-[120] transition-all duration-100 ease-out" style={{ width: `${scrollProgress * 100}%` }} />

                    <div className="min-h-screen flex flex-col relative">
                        
                        {/* Immersive Background */}
                        <div className="fixed inset-0 z-0">
                            <ModalBackground mode={activePillar.visualMode} color={activePillar.color} />
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
                                    <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-500 text-[10px] font-bold uppercase tracking-widest animate-in slide-in-from-top-4 duration-700">
                                        <Zap size={12} />
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
                                    <ImagePlaceholder 
                                        type="wide" 
                                        label="Current State" 
                                        src="https://jar5gzlwdkvsnpqa.public.blob.vercel-storage.com/info_site_wireframe_city_blueprint.jpg" 
                                        blend={true}
                                    />

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
                                        <ImagePlaceholder 
                                            type="portrait" 
                                            label="Signal Analysis" 
                                            src="https://jar5gzlwdkvsnpqa.public.blob.vercel-storage.com/info_site_corporate_modernism_brushed_aluminum_polished_glass_diffuse_daylight_rectilinear_architecture.jpg" 
                                        />
                                        <ImagePlaceholder 
                                            type="portrait" 
                                            label="Action Loop" 
                                            src="https://jar5gzlwdkvsnpqa.public.blob.vercel-storage.com/info_site_matte_polymer_modular_grid_technical_learning.jpg" 
                                        />
                                    </div>

                                    {/* SECTION 3: APPROACH */}
                                    <section>
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-12 h-px bg-purple-500/50" />
                                            <h3 className="text-xs font-bold text-purple-500 uppercase tracking-widest">Operational Approach</h3>
                                        </div>
                                        <FormattedContent text={activePillar.content.approach} />
                                    </section>

                                    {/* FINAL VISUAL */}
                                    <ImagePlaceholder 
                                        type="square" 
                                        label="Unified View" 
                                        src="https://jar5gzlwdkvsnpqa.public.blob.vercel-storage.com/info_site_striped_textile_polished_acetate_soft_diffused_illumination_contemplative_professionalism.jpg" 
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
                            <button onClick={handleClose} className="pointer-events-auto px-8 py-3 bg-white hover:bg-purple-400 text-black font-bold uppercase tracking-widest text-xs rounded-full shadow-lg transition-colors">
                                Close Module
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};
