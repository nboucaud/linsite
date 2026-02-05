
import React, { useState, useRef, useEffect } from 'react';
import { ShieldAlert, Factory, HardHat, FileWarning, Search, CheckCircle2, ArrowRight, X, Gauge, Activity, Radio, Cpu, Crosshair, Zap, AlertTriangle, Users, Network, ScanLine, Database, ImageIcon, ChevronUp } from 'lucide-react';
import { IndustrialsHeroVisualizer } from './IndustrialsHeroVisualizer';
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
                            return <strong key={i} className="text-white font-medium text-amber-500 font-sans">{part.slice(2, -2)}</strong>;
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
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                )}
            </div>
            {caption && (
                <div className="mt-4 flex gap-4 text-xs font-mono text-white/40 border-l border-amber-500/30 pl-4">
                    <span className="text-amber-500">IMAGE:</span>
                    <span>{caption}</span>
                </div>
            )}
        </div>
    );
};

// --- DATA ---

const STATS = [
    {
        value: "74%",
        label: "The Hidden Factory",
        desc: "Companies still struggle to move AI beyond 'pilot' stages due to data fragmentation.",
        source: "BCG",
        type: "tech",
        url: "https://www.bcg.com/press/24october2024-ai-adoption-in-2024-74-of-companies-struggle-to-achieve-and-scale-value"
    },
    {
        value: "$2.3M",
        label: "Hourly Downtime Cost",
        desc: "Cost of unplanned downtime for large industrial facilities has doubled since 2019.",
        source: "Siemens",
        type: "alert",
        url: "https://assets.new.siemens.com/siemens/assets/api/uuid:3d606495-dbe0-43e4-80b1-d04e27ada920/dics-b10153-00-7600truecostofdowntime2022-144.pdf"
    },
    {
        value: "66%",
        label: "The Experience Gap",
        desc: "Industrial leaders report new hires are 'not fully prepared' to handle complex legacy tasks.",
        source: "Deloitte",
        type: "human",
        url: "https://www.deloitte.com/us/en/insights/industry/manufacturing-industrial-products/manufacturing-industry-outlook.html"
    },
    {
        value: "2.6M",
        label: "Safety Incidents",
        desc: "Nonfatal workplace injuries reported annually, confirming physical work remains hazardous.",
        source: "BLS",
        type: "alert",
        url: "https://www.bls.gov/news.release/osh.nr0.htm"
    },
    {
        value: "90%",
        label: "Supply Visibility Gaps",
        desc: "Leaders report material challenges with visibility gaps beyond Tier 1 suppliers.",
        source: "McKinsey",
        type: "network",
        url: "https://www.mckinsey.com/capabilities/operations/our-insights/supply-chain-risk-survey"
    },
    {
        value: "33%",
        label: "Total Energy Use",
        desc: "The industrial sector accounts for a third of U.S. end-use energy consumption.",
        source: "EIA",
        type: "power",
        url: "https://www.eia.gov/outlooks/aeo/"
    }
];

const PILLARS = [
    {
        id: 'reliability',
        title: "Operational Reliability Analytics",
        shortDesc: "Maintaining stable performance across equipment, processes, and operating conditions.",
        icon: Gauge,
        color: '#f59e0b', // Amber
        visualMode: 'waveform',
        content: {
            problem: "Industrial reliability challenges rarely stem from a single failure or isolated asset. Instead, they emerge from **accumulated variability across equipment, processes, materials, and operating conditions.** Small deviations, missed inspections, deferred maintenance, and gradual process drift compound over time until they surface as unplanned downtime or degraded performance.\n\nThe core challenge is not a lack of information, but limited operational visibility into how reliability erodes across interconnected systems. Without clearer insight into patterns of degradation and variance, organizations remain vulnerable to recurring failures that undermine productivity, safety, and planning confidence.\n\nMany organizations struggle to distinguish between normal operational noise and early warning signals. Data exists across control systems, maintenance logs, and inspection records, but it is often fragmented, retrospective, or disconnected from how work is actually executed. As a result, teams are forced into reactive maintenance cycles, addressing failures after they occur rather than stabilizing performance before disruptions escalate.",
            intervene: "Effective reliability intervention respects the realities of industrial operations. It integrates with how maintenance is planned, how operators respond to anomalies, and how reliability decisions are made under constraint. **In reliability work, intervention does not begin at the point of failure. It begins upstream, where variability first appears.**\n\nWe believe that the best interventions occur at the level of operating conditions, maintenance decisions, and process behavior. This includes how inspections are prioritized, how maintenance timing is adjusted, and how process variance accumulates across interconnected systems. The goal is not perfect prediction, but earlier awareness and more informed tradeoffs between uptime, risk, and intervention cost.",
            approach: "We believe that this work begins by establishing a clear understanding of operating baselines—what 'normal' looks like across equipment, processes, and conditions—before attempting to improve anything. In industrial environments, reliability is approached as a discipline. Variability is examined in context, with attention to how assets interact, how maintenance decisions are sequenced, and how operating practices influence long-term performance.\n\nRather than chasing isolated metrics, the approach emphasizes consistency over time. Signals are evaluated alongside maintenance history, operating conditions, and process changes, allowing teams to distinguish between transient disturbances and meaningful degradation. The objective is to support informed decisions about when to intervene, when to defer, and when to accept risk as part of normal operations."
        }
    },
    {
        id: 'quality',
        title: "Quality & Safety Operations",
        shortDesc: "Enforcing standards and controls where quality, safety, and compliance intersect.",
        icon: ShieldAlert,
        color: '#ef4444', // Red
        visualMode: 'radar',
        content: {
            problem: "When enforcement depends too heavily on manual oversight and after-the-fact audits, organizations struggle to detect emerging risk early. Over time, this leads to compliance fatigue, uneven safety culture, and increased exposure during audits or incidents. **Quality and safety breakdowns are rarely caused by the absence of standards.** They occur when standards are inconsistently applied, poorly enforced, or disconnected from daily operational reality.\n\nNonconformances, near misses, and safety incidents often reveal deeper issues in process discipline, training consistency, and accountability. Yet many quality and safety systems are heavily documentation-driven, focusing on record-keeping rather than real-time operational control. This creates a gap between what procedures specify and how work is actually performed under pressure.",
            intervene: "In quality and safety, intervention centers on execution and regulatory knowledge that surpasses the policies and procedures that inspire them. This work focuses on how standards are applied in practice across shifts, sites, and contractors. **Intervention occurs where deviations are most likely to propagate: at handoffs, during process changes, and after incidents.**\n\nThe emphasis is on strengthening traceability, reinforcing accountability, and ensuring that corrective actions are embedded into how work is actually performed. Rather than relying solely on audits, this approach intervenes earlier, where signals of nonconformance or unsafe behavior first appear. The objective is sustained discipline under real operating conditions, not compliance on paper.",
            approach: "Quality and safety are approached as systems of execution. The emphasis is on how standards are interpreted, applied, and reinforced in daily work, particularly in environments where multiple teams, contractors, and shifts intersect.\n\nWe believe that effective quality and safety operations rely on **repeatable enforcement and transparent follow-through.** The approach favors clear ownership, consistent escalation, and practical feedback loops that strengthen discipline without disrupting throughput. This work begins by aligning expectations across roles, ensuring that requirements are clear, enforceable, and embedded into operational routines."
        }
    },
    {
        id: 'workforce',
        title: "Industrial Knowledge & Workforce",
        shortDesc: "Preserving operational expertise across shifts, roles, and workforce transitions.",
        icon: HardHat,
        color: '#06b6d4', // Cyan
        visualMode: 'network',
        content: {
            problem: "Industrial operations rely heavily on **tacit knowledge**—the practical understanding of how equipment behaves and how work is actually performed. Much of this expertise is learned over time and passed informally, often never captured in systems. Without deliberate mechanisms to preserve this context, organizations become increasingly dependent on individuals.\n\nAs experienced workers exit the workforce and operations grow more complex, preserving institutional knowledge becomes a critical operational concern. Critical context is lost during shift changes, contractor transitions, and retirements, leaving gaps in understanding that only become visible when problems occur. We naturally underestimate the operational risk created by knowledge loss because it does not appear on balance sheets or dashboards.",
            intervene: "In knowledge-intensive industrial environments, intervention begins where experience is transferred, or fails to be transferred. The focus is on moments where operational understanding moves between people: shift changes, turnover, and onboarding. **Intervention occurs at the level of practical knowledge:** how procedures are interpreted, how exceptions are handled, and how adjustments are made.\n\nThis approach treats knowledge as situational and time-bound. It intervenes where context is most likely to be lost, ensuring that operational understanding persists even as personnel rotate. The goal is not to replace experience, but to prevent its disappearance.",
            approach: "Knowledge preservation in industrial operations is approached through **continuity, not accumulation.** The focus is on identifying which forms of expertise are essential to safe and reliable execution. Rather than attempting to capture everything, these efforts emphasize relevance—what operators need to know to perform work correctly.\n\nKnowledge is treated as contextual and situational, shaped by equipment behavior and local practice. By supporting consistent handoffs and clear procedures as practiced, organizations reduce dependence on individual memory and strengthen their ability to operate safely and predictably over time."
        }
    }
];

const ECOSYSTEM = [
    "Siemens", "Rockwell Automation", "Honeywell", "ABB", "Schneider Electric", 
    "AVEVA", "GE Digital", "PTC", "Emerson", "Yokogawa", 
    "SAP", "Oracle", "IBM", "Microsoft Azure", "AWS"
];

// ... (VISUALIZERS KEPT UNCHANGED) ...
const WaveformVisualizer = ({ color }: { color: string }) => (
    <div className="w-full h-full flex items-center justify-center opacity-60 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" 
             style={{ 
                 backgroundImage: `linear-gradient(${color}20 1px, transparent 1px), linear-gradient(90deg, ${color}20 1px, transparent 1px)`, 
                 backgroundSize: '40px 40px',
                 animation: 'pan-grid 20s linear infinite'
             }} 
        />
        
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute w-40 h-40 border-2 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" style={{ borderColor: color, opacity: 0.2 }} />
            <div className="absolute w-32 h-32 border border-dashed rounded-full animate-[spin_10s_linear_infinite]" style={{ borderColor: color, opacity: 0.4 }} />
            <div className="w-20 h-20 bg-gradient-to-br from-transparent to-current rounded-full opacity-20 animate-pulse" style={{ color }} />
        </div>

        <div className="absolute inset-0 flex items-center">
            <svg className="w-full h-32" preserveAspectRatio="none">
                <path d="M0,16 Q50,0 100,16 T200,16 T300,16 T400,16" 
                      fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.3">
                    <animate attributeName="d" dur="6s" repeatCount="indefinite"
                             values="M0,16 Q50,-20 100,16 T200,16 T300,16 T400,16; M0,16 Q50,50 100,16 T200,16 T300,16 T400,16; M0,16 Q50,-20 100,16 T200,16 T300,16 T400,16" />
                </path>
                <path d="M0,16 Q50,0 100,16 T200,16 T300,16 T400,16" 
                      fill="none" stroke={color} strokeWidth="2" strokeOpacity="0.8">
                    <animate attributeName="d" dur="2s" repeatCount="indefinite"
                             values="M0,16 Q20,30 40,16 T80,16 T120,16 T160,16 T200,16 T240,16 T280,16 T320,16 T360,16 T400,16;
                                     M0,16 Q20,-10 40,16 T80,16 T120,16 T160,16 T200,16 T240,16 T280,16 T320,16 T360,16 T400,16;
                                     M0,16 Q20,30 40,16 T80,16 T120,16 T160,16 T200,16 T240,16 T280,16 T320,16 T360,16 T400,16" />
                </path>
            </svg>
        </div>

        <div className="absolute bottom-10 left-10 flex gap-1 items-end h-8">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="w-1 bg-current animate-[pulse_1s_ease-in-out_infinite]" 
                     style={{ color, height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }} />
            ))}
        </div>
        
        <style>{`
            @keyframes pan-grid {
                0% { background-position: 0 0; }
                100% { background-position: 40px 40px; }
            }
        `}</style>
    </div>
);

const RadarVisualizer = ({ color }: { color: string }) => (
    <div className="w-full h-full flex items-center justify-center opacity-60 relative overflow-hidden">
        <div className="absolute w-[140%] h-[140%] border border-white/5 rounded-full opacity-20" 
             style={{ background: `repeating-radial-gradient(transparent 0, transparent 49px, ${color}20 50px)` }} />
        
        <div className="absolute w-[80%] h-[80%] border-2 border-dashed rounded-full animate-[spin_20s_linear_infinite]" 
             style={{ borderColor: color, opacity: 0.3 }} />
             
        <div className="absolute w-[60%] h-[60%] border-t-2 border-b-2 rounded-full animate-[spin_10s_linear_infinite_reverse]" 
             style={{ borderColor: color, opacity: 0.5 }} />

        <div className="absolute w-[120%] h-[120%] animate-[spin_3s_linear_infinite]">
            <div className="w-full h-1/2 bg-gradient-to-l from-transparent via-transparent to-transparent border-r-2 origin-bottom"
                 style={{ 
                     borderRightColor: color,
                     background: `conic-gradient(from 0deg, transparent 270deg, ${color}30 360deg)` 
                 }} />
        </div>

        {[...Array(4)].map((_, i) => (
            <div key={i} 
                 className="absolute w-4 h-4 border border-current flex items-center justify-center animate-ping"
                 style={{ 
                     color,
                     top: `${20 + Math.random() * 60}%`,
                     left: `${20 + Math.random() * 60}%`,
                     animationDuration: `${2 + Math.random()}s`,
                     animationDelay: `${i * 0.5}s`
                 }}>
                 <div className="w-1 h-1 bg-current" />
            </div>
        ))}
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full h-px bg-white/10" />
            <div className="h-full w-px bg-white/10 absolute" />
            <div className="w-4 h-4 border border-white/50" />
        </div>
    </div>
);

const NetworkVisualizer = ({ color }: { color: string }) => (
    <div className="w-full h-full relative overflow-hidden opacity-60">
        <div className="absolute inset-0 opacity-10" 
             style={{ 
                 backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`, 
                 backgroundSize: '30px 30px' 
             }} 
        />

        <svg className="w-full h-full absolute inset-0">
            <defs>
                <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                    <path d="M0,0 L10,5 L0,10" fill={color} opacity="0.5" />
                </marker>
            </defs>

            <g stroke={color} strokeWidth="1" strokeOpacity="0.2">
                <line x1="20%" y1="20%" x2="50%" y2="50%" />
                <line x1="80%" y1="20%" x2="50%" y2="50%" />
                <line x1="20%" y1="80%" x2="50%" y2="50%" />
                <line x1="80%" y1="80%" x2="50%" y2="50%" />
                <line x1="50%" y1="20%" x2="50%" y2="80%" />
                <line x1="20%" y1="50%" x2="80%" y2="50%" />
            </g>

            <circle r="3" fill="#fff">
                <animateMotion path="M 20 20 L 50 50" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle r="3" fill="#fff">
                <animateMotion path="M 80 80 L 50 50" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle r="3" fill="#fff">
                <animateMotion path="M 50 20 L 50 80" dur="4s" repeatCount="indefinite" />
            </circle>
            <circle r="2" fill={color}>
                <animateMotion path="M 20 50 L 80 50" dur="2.5s" repeatCount="indefinite" />
            </circle>

            {[
                { cx: "50%", cy: "50%", r: 6 },
                { cx: "20%", cy: "20%", r: 4 },
                { cx: "80%", cy: "20%", r: 4 },
                { cx: "20%", cy: "80%", r: 4 },
                { cx: "80%", cy: "80%", r: 4 },
                { cx: "50%", cy: "20%", r: 3 },
                { cx: "50%", cy: "80%", r: 3 },
                { cx: "20%", cy: "50%", r: 3 },
                { cx: "80%", cy: "50%", r: 3 }
            ].map((node, i) => (
                <circle key={i} cx={node.cx} cy={node.cy} r={node.r} fill="#000" stroke={color} strokeWidth="2">
                    <animate attributeName="r" values={`${node.r};${node.r + 2};${node.r}`} dur={`${1 + i * 0.2}s`} repeatCount="indefinite" />
                    <animate attributeName="stroke-opacity" values="0.5;1;0.5" dur={`${1 + i * 0.2}s`} repeatCount="indefinite" />
                </circle>
            ))}
        </svg>
    </div>
);

const ModalBackground: React.FC<{ mode: string, color: string }> = ({ mode, color }) => {
    return (
        <div className="absolute inset-0 w-full h-full opacity-30">
            {mode === 'waveform' && <WaveformVisualizer color={color} />}
            {mode === 'radar' && <RadarVisualizer color={color} />}
            {mode === 'network' && <NetworkVisualizer color={color} />}
        </div>
    );
};

const StatCard: React.FC<{ stat: typeof STATS[0], index: number }> = ({ stat, index }) => {
    const cardRef = useRef<HTMLAnchorElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    // Config based on index/type to assign icons and colors since they aren't in the data array for Industrials
    const config = [
        { hex: '#22d3ee', icon: Cpu },       // Tech
        { hex: '#ef4444', icon: AlertTriangle }, // Alert
        { hex: '#a78bfa', icon: Users },    // Human
        { hex: '#fb923c', icon: ShieldAlert }, // Safety
        { hex: '#34d399', icon: Network }, // Network
        { hex: '#facc15', icon: Zap }       // Power
    ][index];

    const Icon = config.icon;

    return (
        <a 
            ref={cardRef}
            href={stat.url}
            target="_blank"
            rel="noopener noreferrer"
            onMouseMove={handleMouseMove}
            className="group relative p-8 bg-[#0c0c0e] border border-white/5 rounded-2xl transition-all duration-500 overflow-hidden hover:-translate-y-1 block cursor-pointer"
            style={{ '--card-color': config.hex } as React.CSSProperties}
        >
            <div className="absolute inset-0 border border-transparent group-hover:border-[var(--card-color)] opacity-0 group-hover:opacity-50 rounded-2xl transition-all duration-500 pointer-events-none" />
            
            {/* Interactive Spotlight */}
            <div 
                className="pointer-events-none absolute -inset-px transition duration-300 opacity-0 group-hover:opacity-100"
                style={{ 
                    background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, ${config.hex}15, transparent 40%)` 
                }}
            />

            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none" 
                 style={{ 
                     backgroundImage: `linear-gradient(${config.hex} 1px, transparent 1px), linear-gradient(90deg, ${config.hex} 1px, transparent 1px)`, 
                     backgroundSize: '30px 30px' 
                 }} 
            />
            
            {/* Watermark Icon */}
            <div className="absolute -right-8 -bottom-8 text-white/5 group-hover:text-[var(--card-color)] group-hover:opacity-10 transition-all duration-700 pointer-events-none transform group-hover:scale-110 group-hover:rotate-12">
                {React.createElement(Icon, { size: 140, strokeWidth: 0.5 })}
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white transition-colors border border-white/5 group-hover:bg-[var(--card-color)] group-hover:border-transparent shadow-lg">
                            {React.createElement(Icon, { size: 24 })}
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
            {/* Visualizer Background */}
            <div className="absolute inset-0 opacity-40 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-screen">
                {pillar.visualMode === 'waveform' && <WaveformVisualizer color={pillar.color} />}
                {pillar.visualMode === 'radar' && <RadarVisualizer color={pillar.color} />}
                {pillar.visualMode === 'network' && <NetworkVisualizer color={pillar.color} />}
            </div>

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-transparent opacity-80" />

            {/* Content */}
            <div className="relative z-10 p-8 flex flex-col h-full pointer-events-none">
                <div className="w-12 h-12 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center text-white/50 group-hover:text-white group-hover:scale-110 transition-all backdrop-blur-md mb-auto group-hover:bg-white/10 group-hover:border-white/20">
                    {React.createElement(pillar.icon, { size: 20 })}
                </div>

                <div className="bg-[#0c0c0e]/80 backdrop-blur-xl p-6 -mx-8 -mb-8 border-t border-white/10 group-hover:border-white/20 transition-colors">
                    <h3 className="text-lg font-serif text-white mb-2 group-hover:text-amber-400 transition-colors">{pillar.title}</h3>
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

export const IndustrialsPage: React.FC = () => {
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
        <div className="relative min-h-screen bg-[#020202] text-white pt-24 font-sans overflow-x-hidden selection:bg-amber-500/30 selection:text-amber-400">
            
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
                            <IndustrialsHeroVisualizer />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#020202] via-[#020202]/90 to-transparent z-10" />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#020202] via-transparent to-[#020202] z-10" />
                        
                        <div className="relative z-20 max-w-[1800px] mx-auto px-6 md:px-12 w-full text-center md:text-left pointer-events-none">
                            <div className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-8 animate-in slide-in-from-bottom-4 duration-700 backdrop-blur-md">
                                <Factory size={14} />
                                <span>Industrial Systems</span>
                            </div>
                            <h1 className="text-5xl md:text-8xl font-serif text-white mb-8 max-w-5xl leading-[0.95] tracking-tight">
                                Operational Control, Reliability, and <span className="text-amber-500 italic">Optimization.</span>
                            </h1>
                            <p className="text-xl text-white/60 max-w-2xl leading-relaxed mb-12 font-light">
                                Stabilizing complex industrial operations where reliability, safety, and performance are inseparable.
                            </p>
                            <div className="flex flex-col md:flex-row gap-4 pointer-events-auto">
                                <button onClick={() => document.getElementById('strategic-domains')?.scrollIntoView({behavior: 'smooth'})} className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-widest text-xs rounded transition-all shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                                    Explore Strategy
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* --- CONTEXT --- */}
                    <section className="py-32 bg-[#050505] border-b border-white/5 relative">
                        <div className="absolute top-0 right-0 p-64 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
                        
                        <div className="max-w-[1800px] mx-auto px-6 md:px-12 text-center relative z-10">
                            <h2 className="text-3xl md:text-4xl font-serif text-white mb-12">The Brownfield Reality</h2>
                            <p className="text-lg md:text-xl text-white/60 leading-relaxed text-justify font-light max-w-4xl mx-auto">
                                The Industrial sector operates in environments where performance depends on control, repeatability, and safe execution across tightly coupled systems. Manufacturing lines, facilities, and asset-intensive operations must function continuously under physical constraints, regulatory oversight, and variable demand, where small deviations can escalate into downtime, safety incidents, or quality failures. As industrial systems become more software-driven and interconnected, operational complexity has increased faster than organizational visibility.
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

                    {/* --- ECOSYSTEM FOOTER --- */}
                    <section className="py-32 border-t border-white/5 bg-[#050505]">
                        <div className="max-w-[1800px] mx-auto px-6 md:px-12 text-center">
                            <p className="text-xs font-mono uppercase tracking-widest text-white/30 mb-12">Integrated Ecosystem</p>
                            
                            <div className="relative w-full overflow-hidden mb-16">
                                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10" />
                                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10" />
                                
                                <div className="flex w-max animate-marquee">
                                    {[...ECOSYSTEM, ...ECOSYSTEM].map((tech, i) => (
                                        <div key={i} className="mx-8 text-white/40 font-serif text-2xl hover:text-amber-500 transition-colors cursor-default whitespace-nowrap">
                                            {tech}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* --- NEW CROSS-NAVIGATION FOOTER --- */}
                    <IndustryNavigationFooter currentId="industrials" />
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
                    <div className="fixed top-0 left-0 h-1 bg-amber-500 z-[120] transition-all duration-100 ease-out" style={{ width: `${scrollProgress * 100}%` }} />

                    <div className="min-h-screen flex flex-col relative">
                        
                        {/* Immersive Background */}
                        <div className="fixed inset-0 z-0">
                            <ModalBackground mode={activePillar.visualMode} color={activePillar.color} />
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
                                    <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-widest animate-in slide-in-from-top-4 duration-700">
                                        <Factory size={12} />
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
                                        label="Site Schematic" 
                                        caption="Identifying zones of high variance." 
                                        src="https://jar5gzlwdkvsnpqa.public.blob.vercel-storage.com/info_site_industrial_steel_lattice_weathered_metal_low_angle_natural_daylight_mechanical_geometry.jpg"
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
                                            label="Asset Sensor" 
                                            caption="Real-time telemetry feed." 
                                            src="https://jar5gzlwdkvsnpqa.public.blob.vercel-storage.com/AutomatedWeavingMachinesOperatingInLargeTextileManufacturingFactory.webp"
                                        />
                                        <ImagePlaceholder 
                                            type="portrait" 
                                            label="Maintenance Log" 
                                            caption="Predictive maintenance schedule." 
                                            src="https://jar5gzlwdkvsnpqa.public.blob.vercel-storage.com/GlovedHandsAssemblingPrecisionMetalComponentOnBlueWorkSurface.webp"
                                        />
                                    </div>

                                    {/* SECTION 3: APPROACH */}
                                    <section>
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-12 h-px bg-amber-500/50" />
                                            <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest">Our Approach</h3>
                                        </div>
                                        <FormattedContent text={activePillar.content.approach} />
                                    </section>

                                    {/* FINAL VISUAL */}
                                    <ImagePlaceholder 
                                        type="square" 
                                        label="Control Room" 
                                        caption="Centralized oversight for distributed assets." 
                                        src="https://jar5gzlwdkvsnpqa.public.blob.vercel-storage.com/ThreeDiverseMaleFactoryWorkersInHardHatsAndSafetyVestsOperatingIndustrialMachinery.webp"
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
                            <button onClick={handleClose} className="pointer-events-auto px-8 py-3 bg-white hover:bg-amber-400 text-black font-bold uppercase tracking-widest text-xs rounded-full shadow-lg transition-colors">
                                Close Module
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};
