
import React, { useState, useRef, useEffect } from 'react';
import { Pickaxe, Droplets, Zap, Flame, Globe, AlertTriangle, ArrowRight, X, ScanLine, Activity, Mountain, Wind, Cpu, Layers, ImageIcon, ChevronUp, Radar, MapPin } from 'lucide-react';
import { ResourcesHeroVisualizer } from './ResourcesHeroVisualizer';
import { IndustryNavigationFooter } from './IndustryNavigationFooter';
import { ViewportSlot } from './ViewportSlot';

// --- UTILS ---
const FormattedContent: React.FC<{ text: string }> = ({ text }) => {
    if (!text) return null;
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

const ImagePlaceholder: React.FC<{ type: 'wide' | 'portrait' | 'square', label: string, src?: string }> = ({ type, label, src }) => {
    const aspect = type === 'wide' ? 'aspect-[21/9]' : type === 'portrait' ? 'aspect-[3/4]' : 'aspect-square';
    const widthClass = type === 'wide' ? 'w-full' : 'w-full';
    const [hasError, setHasError] = useState(false);
    
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

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !isVisible || hasError) return;
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

            const scanY = (time * 1.2) % h;
            ctx.fillStyle = 'rgba(16, 185, 129, 0.1)'; 
            ctx.fillRect(0, scanY, w, 2);

            if (Math.random() > 0.85) {
                for(let i=0; i<3; i++) {
                    const px = Math.random() * w;
                    const py = Math.random() * h;
                    ctx.fillStyle = 'rgba(16, 185, 129, 0.5)';
                    ctx.fillRect(px, py, 2, 2);
                }
            }

            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(10, 10, 4, 1);
            ctx.fillRect(10, 10, 1, 4);
            ctx.fillRect(w-14, h-14, 4, 1);
            ctx.fillRect(w-11, h-14, 1, 4);

            animationFrameId = requestAnimationFrame(render);
        };
        render();

        return () => cancelAnimationFrame(animationFrameId);
    }, [isVisible, hasError]);
    
    return (
        <div ref={containerRef} className={`my-16 group cursor-default ${widthClass} transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className={`w-full ${aspect} bg-[#0c0c0e] border border-white/10 rounded-lg flex flex-col items-center justify-center relative overflow-hidden group shadow-2xl`}>
                {src && !hasError ? (
                    <>
                        <img 
                            src={src} 
                            alt="" 
                            onError={() => setHasError(true)}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-60 mix-blend-screen" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out skew-x-12 pointer-events-none" />
                    </>
                ) : (
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                )}
            </div>
        </div>
    );
};

const STATS = [
    {
        value: "10 Yr Low",
        label: "Refinery Investment",
        desc: "Global refinery investment set to fall to its lowest level in a decade by 2025, raising acute asset integrity concerns.",
        source: "IEA",
        icon: Flame,
        color: "#ef4444", 
        url: "https://www.iea.org/reports/world-energy-investment-2025"
    },
    {
        value: "72%",
        label: "Grid Bottleneck",
        desc: "Power executives cite grid infrastructure capacity as their 'very or extremely challenging' hurdle for expansion.",
        source: "Deloitte",
        icon: Zap,
        color: "#fbbf24", 
        url: "https://www2.deloitte.com/us/en/insights/industry/power-and-utilities/power-and-utilities-industry-outlook.html"
    },
    {
        value: "40%",
        label: "Water Gap",
        desc: "Expected gap between global water supply and demand by 2030, driving need for efficiency.",
        source: "McKinsey",
        icon: Droplets,
        color: "#06b6d4",
        url: "#"
    },
    {
        value: "$1.7T",
        label: "Mining Capex",
        desc: "Required investment in mining to meet net-zero targets by 2050.",
        source: "WoodMac",
        icon: Pickaxe,
        color: "#a855f7",
        url: "#"
    },
    {
        value: "50%",
        label: "Rare Earth Demand",
        desc: "Projected increase in demand for critical minerals by 2030.",
        source: "IEA",
        icon: Mountain,
        color: "#10b981",
        url: "#"
    },
    {
        value: "2030",
        label: "Net Zero Targets",
        desc: "Aggressive decarbonization goals creating operational pressure across sectors.",
        source: "UN",
        icon: Globe,
        color: "#3b82f6",
        url: "#"
    }
];

const PILLARS = [
    {
        id: 'exploration',
        title: "Resource Exploration & Modeling",
        shortDesc: "Data-driven subsurface and geospatial analysis.",
        icon: Pickaxe,
        color: '#10b981', // Emerald
        visualMode: 'seismic',
        content: {
            problem: "Resource exploration is a high-stakes gamble. Whether drilling for oil, mining for minerals, or siting renewables, decisions are made based on incomplete subsurface data. Geological models are often static, failing to update as new data comes in from drilling or sensors.\n\n**The gap between model and reality creates massive financial risk.** Dry holes, poor yields, and unexpected geological hazards cost billions annually. Teams struggle to integrate diverse data sources—seismic, well logs, satellite imagery—into a coherent, living model of the resource.",
            intervene: "We intervene by turning static geological models into dynamic, learning systems. By integrating real-time data from the field, we update resource estimates and risk profiles continuously. **Intervention occurs at the decision point: where to drill, where to dig, how to value an asset.**\n\nThis approach reduces uncertainty and allows exploration teams to adapt strategies as they learn more about the subsurface. It transforms exploration from a series of discrete bets into a continuous process of refinement.",
            approach: "Our approach leverages advanced data fusion and probabilistic modeling. We don't just provide a single answer; we provide a range of outcomes with associated confidence levels. This allows leaders to make risk-adjusted decisions.\n\nSupport focuses on integrating siloed data sets to create a holistic view of the resource. By applying AI to interpret seismic data and well logs, we uncover patterns that human analysts might miss, guiding exploration to high-potential zones."
        }
    },
    {
        id: 'production',
        title: "Production Optimization",
        shortDesc: "Maximizing yield and efficiency in extraction.",
        icon: Droplets,
        color: '#06b6d4', // Cyan
        visualMode: 'fluid',
        content: {
            problem: "Once a resource is found, the challenge shifts to extraction. Production efficiency is often hampered by equipment downtime, suboptimal process parameters, and changing reservoir conditions. **Operators rely on lagging indicators to adjust production, leading to lost yield and higher costs.**\n\nIn complex processing facilities like refineries or mineral processing plants, thousands of variables interact. Human operators cannot optimize these in real-time, leading to steady-state operations that leave value on the table.",
            intervene: "Intervention focuses on real-time process control. We deploy AI agents that monitor thousands of sensor points to predict process drifts and equipment failures before they impact production. **The goal is to move from reactive troubleshooting to predictive optimization.**\n\nThis means adjusting choke settings, pump speeds, or chemical injection rates dynamically to match changing conditions. It ensures that assets are operating at their true potential, not just a safe baseline.",
            approach: "We approach production as a continuous flow problem. By creating digital twins of production systems, we can simulate the impact of adjustments before applying them. This allows for safe experimentation and rapid optimization.\n\nOur systems provide operators with actionable recommendations, not just alarms. This augments human decision-making, allowing operators to focus on complex problem-solving while the AI handles routine optimization."
        }
    },
    {
        id: 'grid',
        title: "Grid & Infrastructure",
        shortDesc: "Balancing supply and demand in complex networks.",
        icon: Zap,
        color: '#f59e0b', // Amber
        visualMode: 'grid',
        content: {
            problem: "The energy transition is placing unprecedented strain on grid infrastructure. Intermittent renewables, distributed generation, and EV charging are creating volatility that legacy grids were not designed to handle. **Grid operators face a balancing act: maintaining stability while integrating new, unpredictable assets.**\n\nVisibility into the low-voltage network is often poor, making it difficult to manage local congestion or voltage issues. Planning for upgrades is slow and often based on outdated assumptions about load growth.",
            intervene: "We intervene by providing high-resolution visibility and control. Our platforms ingest data from smart meters, SCADA systems, and weather forecasts to create a real-time view of grid health. **Intervention occurs at the network edge, managing distributed assets to support grid stability.**\n\nThis allows operators to defer costly infrastructure upgrades by utilizing existing capacity more effectively through demand response and topology optimization.",
            approach: "Our approach treats the grid as a dynamic, bidirectional network. We use AI to forecast load and generation at a granular level, enabling proactive balancing. By automating routine switching and dispatch decisions, we free up operators to manage critical events.\n\nWe support the transition to a more flexible, resilient grid that can accommodate the demands of a decarbonized future."
        }
    },
    {
        id: 'environment',
        title: "Environmental Monitoring",
        shortDesc: "Managing impact and compliance in real-time.",
        icon: Globe,
        color: '#10b981', // Green
        visualMode: 'topo',
        content: {
            problem: "Industrial operations have a profound impact on the environment. Compliance with regulations regarding emissions, water usage, and land reclamation is mandatory but often managed via retrospective reporting. **Incidents like leaks or spills are often detected too late, causing environmental damage and reputational harm.**\n\nCompanies lack real-time situational awareness of their environmental footprint. Data is siloed in different departments, making it difficult to see the holistic picture of impact.",
            intervene: "We intervene by deploying real-time environmental monitoring networks. Integrating data from IoT sensors, satellite imagery, and drones, we provide continuous oversight of emissions and impact. **Intervention happens the moment a threshold is approached, not after it is crossed.**\n\nThis proactive stance allows companies to prevent incidents and demonstrate rigorous stewardship to regulators and the public.",
            approach: "We approach environmental management as an operational imperative, not just a compliance box-checking exercise. By correlating operational data with environmental metrics, we help identify the root causes of emissions or waste.\n\nOur tools support transparency and accountability, enabling companies to operate responsibly within their communities and meet their sustainability commitments."
        }
    }
];

// --- VISUALIZERS ---

const SeismicVisualizer: React.FC<{ color: string }> = ({ color }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let w = canvas.width = 300;
        let h = canvas.height = 300;
        let t = 0; let frameId: number;
        
        const render = () => {
            t += 0.1;
            ctx.clearRect(0,0,w,h);
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            
            for(let i=0; i<10; i++) {
                ctx.beginPath();
                for(let x=0; x<w; x+=5) {
                    const y = h/2 + (i-5)*20 + Math.sin(x*0.05 + t + i)*10 * Math.sin(x*0.01);
                    if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
                }
                ctx.stroke();
            }
            frameId = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(frameId);
    }, [color]);
    return <canvas ref={canvasRef} className="w-full h-full" />;
};

const FluidVisualizer: React.FC<{ color: string }> = ({ color }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let w = canvas.width = 300;
        let h = canvas.height = 300;
        let t = 0; let frameId: number;
        const particles: any[] = [];
        for(let i=0; i<50; i++) particles.push({x: Math.random()*w, y: Math.random()*h, r: Math.random()*5+2});

        const render = () => {
            t += 0.02;
            ctx.clearRect(0,0,w,h);
            ctx.fillStyle = color;
            
            particles.forEach(p => {
                p.y -= 1;
                p.x += Math.sin(p.y*0.05 + t);
                if(p.y < 0) { p.y = h; p.x = Math.random()*w; }
                ctx.globalAlpha = 0.5;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
            });
            frameId = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(frameId);
    }, [color]);
    return <canvas ref={canvasRef} className="w-full h-full" />;
};

const GridVisualizer: React.FC<{ color: string }> = ({ color }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let w = canvas.width = 300;
        let h = canvas.height = 300;
        let t = 0; let frameId: number;

        const render = () => {
            t += 0.05;
            ctx.clearRect(0,0,w,h);
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            
            // Draw node network
            const cols = 5; const rows = 5;
            const spacex = w/cols; const spacey = h/rows;
            
            for(let i=0; i<cols; i++) {
                for(let j=0; j<rows; j++) {
                    const x = i*spacex + spacex/2;
                    const y = j*spacey + spacey/2;
                    
                    const active = Math.sin(i*j + t) > 0.5;
                    ctx.globalAlpha = active ? 1 : 0.2;
                    
                    ctx.beginPath(); ctx.arc(x,y, 3, 0, Math.PI*2); ctx.stroke();
                    if(active) {
                        ctx.fillStyle = color; ctx.fill();
                        // Connector
                        if(i<cols-1) { ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+spacex, y); ctx.stroke(); }
                        if(j<rows-1) { ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x, y+spacey); ctx.stroke(); }
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

const TopoVisualizer: React.FC<{ color: string }> = ({ color }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let w = canvas.width = 300;
        let h = canvas.height = 300;
        let t = 0; let frameId: number;

        const render = () => {
            t += 0.01;
            ctx.clearRect(0,0,w,h);
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            
            for(let r=50; r<150; r+=20) {
                ctx.beginPath();
                for(let a=0; a<=Math.PI*2; a+=0.1) {
                    const noise = Math.sin(a*5 + t)*10 + Math.cos(a*3 - t)*10;
                    const rad = r + noise;
                    const x = w/2 + Math.cos(a)*rad;
                    const y = h/2 + Math.sin(a)*rad;
                    if(a===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
                }
                ctx.closePath();
                ctx.stroke();
            }
            frameId = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(frameId);
    }, [color]);
    return <canvas ref={canvasRef} className="w-full h-full" />;
};

const ModalBackground: React.FC<{ mode: string, color: string }> = ({ mode, color }) => {
    return (
        <div className="absolute inset-0 w-full h-full opacity-30">
            {mode === 'seismic' && <SeismicVisualizer color={color} />}
            {mode === 'fluid' && <FluidVisualizer color={color} />}
            {mode === 'grid' && <GridVisualizer color={color} />}
            {mode === 'topo' && <TopoVisualizer color={color} />}
        </div>
    );
};

const StatCard: React.FC<{ stat: typeof STATS[0], index: number }> = ({ stat, index }) => {
    return (
        <a 
            href={stat.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-8 bg-[#0c0c0e] border border-white/5 rounded-2xl transition-all duration-500 overflow-hidden hover:-translate-y-1 block cursor-pointer"
            style={{ '--card-color': stat.color } as React.CSSProperties}
        >
            <div className="absolute inset-0 border border-transparent group-hover:border-[var(--card-color)] opacity-0 group-hover:opacity-50 rounded-2xl transition-all duration-500 pointer-events-none" />
            <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -right-6 -bottom-6 text-white/5 group-hover:text-[var(--card-color)] group-hover:opacity-10 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12 pointer-events-none">
                {React.createElement(stat.icon, { size: 100, strokeWidth: 0.5 })}
            </div>

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

const DomainCard: React.FC<{ pillar: any, onClick: () => void }> = ({ pillar, onClick }) => {
    return (
        <div 
            onClick={onClick}
            className="group relative h-[450px] bg-[#0c0c0e] border border-white/10 rounded-3xl overflow-hidden cursor-pointer hover:border-white/30 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col"
        >
            <div className="absolute inset-0 opacity-40 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-screen">
                <ModalBackground mode={pillar.visualMode} color={pillar.color} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-transparent opacity-80" />
            <div className="relative z-10 p-8 flex flex-col h-full pointer-events-none">
                <div className="w-12 h-12 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center text-white/50 group-hover:text-white group-hover:scale-110 transition-all backdrop-blur-md mb-auto group-hover:bg-white/10 group-hover:border-white/20">
                    {React.createElement(pillar.icon, { size: 20 })}
                </div>
                <div className="bg-[#0c0c0e]/80 backdrop-blur-xl p-6 -mx-8 -mb-8 border-t border-white/10 group-hover:border-white/20 transition-colors">
                    <h3 className="text-lg font-serif text-white mb-2 group-hover:text-emerald-400 transition-colors">{pillar.title}</h3>
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

export const NaturalResourcesPage: React.FC = () => {
    const [expandedPillarId, setExpandedPillarId] = useState<string | null>(null);
    const activePillar = PILLARS.find(p => p.id === expandedPillarId);

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
                        <div className="absolute inset-0 z-0 opacity-100">
                            <ResourcesHeroVisualizer />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#020202] via-[#020202]/90 to-transparent z-10" />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#020202] via-transparent to-[#020202] z-10" />
                        
                        <div className="relative z-20 max-w-[1800px] mx-auto px-6 md:px-12 w-full text-center md:text-left pointer-events-none">
                            <div className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-widest mb-8 animate-in slide-in-from-bottom-4 duration-700 backdrop-blur-md">
                                <Mountain size={14} />
                                <span>Natural Resources</span>
                            </div>
                            <h1 className="text-5xl md:text-8xl font-serif text-white mb-8 max-w-5xl leading-[0.95] tracking-tight">
                                Exploration, Production, and <span className="text-emerald-500 italic">Sustainability.</span>
                            </h1>
                            <p className="text-xl text-white/60 max-w-2xl leading-relaxed mb-12 font-light">
                                Managing operations defined by geology, long time horizons, and irreversible extraction decisions.
                            </p>
                            <div className="flex flex-col md:flex-row gap-4 pointer-events-auto">
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
                            <h2 className="text-3xl md:text-4xl font-serif text-white mb-12">The Physical Constraint</h2>
                            <p className="text-lg md:text-xl text-white/60 leading-relaxed text-justify font-light max-w-4xl mx-auto">
                                The Natural Resource sector operates at the intersection of geology, physics, and markets. Unlike manufacturing, the raw material is not ordered but found. The primary constraints—reservoir pressure, ore grade, topography—are physical and immovable. Success depends on the ability to model the subsurface accurately, optimize extraction in harsh environments, and manage the environmental impact of operations. As easily accessible resources deplete, operators are forced into more challenging frontiers, requiring deeper intelligence and stricter operational control.
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

                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {PILLARS.map((pillar) => (
                                        <DomainCard 
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
                    <IndustryNavigationFooter currentId="resources" />
                </>
            )}

            {/* --- DETAIL MODAL --- */}
            {activePillar && (
                <div 
                    ref={modalRef}
                    onScroll={handleScroll}
                    className="fixed inset-0 z-[200] bg-[#020202] overflow-y-auto animate-in fade-in duration-300 custom-scrollbar"
                >
                    {/* Progress Bar */}
                    <div className="fixed top-0 left-0 h-1 bg-emerald-500 z-[210] transition-all duration-100 ease-out" style={{ width: `${scrollProgress * 100}%` }} />

                    <div className="min-h-screen flex flex-col relative">
                        
                        {/* Immersive Background */}
                        <div className="fixed inset-0 z-0">
                            <ModalBackground mode={activePillar.visualMode} color={activePillar.color} />
                            <div className="absolute inset-0 bg-gradient-to-b from-[#020202] via-[#020202]/80 to-[#020202]" />
                        </div>

                        {/* Header */}
                        <div className="fixed top-0 left-0 right-0 h-24 bg-[#0a0a0c]/90 backdrop-blur-xl border-b border-white/10 z-[210] flex items-center px-8 md:px-12 justify-between">
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
                                            <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest">The Challenge</h3>
                                        </div>
                                        <FormattedContent text={activePillar.content.problem} />
                                    </section>
                                    
                                    {/* VISUAL BREAK 1: WIDE */}
                                    <ImagePlaceholder 
                                        type="wide" 
                                        label="Subsurface Scan" 
                                        src={`https://jar5gzlwdkvsnpqa.public.blob.vercel-storage.com/New_Img.2.15/infg-technician-in-full-hazmat-suit-taking-sample-in-forest-area.webp`}
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
                                            label="Seismic Model" 
                                            src={`https://jar5gzlwdkvsnpqa.public.blob.vercel-storage.com/New_Img.2.15/infg-industrial-rail-line-passing-fuel-storage-tanks-and-pipelines.webp`}
                                        />
                                        <ImagePlaceholder 
                                            type="portrait" 
                                            label="Process Control" 
                                            src={`https://jar5gzlwdkvsnpqa.public.blob.vercel-storage.com/New_Img.2.15/infg-two-industrial-engineers-inspecting-valves-and-piping-in-plant-room.webp`}
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
                                        label="Field Operations" 
                                        src={`https://jar5gzlwdkvsnpqa.public.blob.vercel-storage.com/New_Img.2.15/infg-large-crane-working-at-industrial-port-during-sunset-hour.webp`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Back To Top FAB */}
                        <button 
                            onClick={scrollToTop}
                            className={`fixed bottom-8 right-8 z-[210] p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full text-white transition-all duration-500 transform ${showBackToTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
                        >
                            <ChevronUp size={24} />
                        </button>

                        {/* Footer Close */}
                        <div className="fixed bottom-0 left-0 right-0 h-24 flex items-center justify-center pointer-events-none z-[210] bg-gradient-to-t from-black to-transparent">
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
