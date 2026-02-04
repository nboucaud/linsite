
import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Server, Activity, GitMerge, Database, Lock, ChevronRight, Code, Terminal, Cpu, Scan, Zap, Network, Bot, BarChart3, Users, CheckCircle2, FileJson, ArrowRight, Radio } from 'lucide-react';
import { SectionVisualizer } from './SectionVisualizer';

const SOLUTIONS = [
    {
        id: 'daas',
        title: "Data-as-a-Service (DaaS)",
        desc: "This service works directly with your organization to locate and extract hard-to-reach knowledge, including tribal knowledge, operational memory, contextual practices, regulatory constraints, competitive intelligence, and experiential reasoning.",
        icon: Database,
        color: "#69B7B2", 
        tag: "EXTRACT",
        mode: 'search',
        output: "Structured Knowledge Graph"
    },
    {
        id: 'capture',
        title: "Knowledge Capture",
        desc: "We identify and formalize the rules, assumptions, constraints, and potential failure points embedded in your operations. Capturing how work is actually governed, not just how it is documented.",
        icon: Scan,
        color: "#f59e0b",
        tag: "FORMALIZE",
        mode: 'translation',
        output: "Operational Rulebook v1.0"
    },
    {
        id: 'trees',
        title: "Knowledge Trees",
        desc: "This tool designs and structures representations of your knowledge that preserve relationships, dependencies, and rules, enabling operational logic, traceability, and reasoning across people, roles, systems, rules, and procedures.",
        icon: Network,
        color: "#ef4444", 
        tag: "STRUCTURE",
        mode: 'core',
        output: "Decision Tree Logic"
    },
    {
        id: 'bridge',
        title: "Bridge AI",
        desc: "This tool deploys purpose-built agents that operate on shared knowledge trees, allowing agents to reason within defined workflows, understand their roles, and coordinate with other agents based on shared operational context.",
        icon: Bot,
        color: "#8b5cf6", 
        tag: "DEPLOY",
        mode: 'swarm',
        output: "Agent Swarm Active"
    },
    {
        id: 'strategy',
        title: "Strategy Builder",
        desc: "This tool uses structured organizational knowledge to enable decision-makers to model scenarios, test assumptions, and explore the operational consequences of different strategies through predictive and prescriptive analysis.",
        icon: BarChart3,
        color: "#06b6d4",
        tag: "MODEL",
        mode: 'logic',
        output: "Scenario Forecast Report"
    },
    {
        id: 'workforce',
        title: "Workforce Augmentation",
        desc: "This tool supports teams by embedding knowledge into workflows, helping junior staff learn faster, senior staff offload cognitive burden, and organizations sustain expertise as people and roles change.",
        icon: Users,
        color: "#ec4899",
        tag: "AUGMENT",
        mode: 'identity',
        output: "Workforce Capacity +40%"
    }
];

const TerminalOutput: React.FC<{ output: string; color: string }> = ({ output, color }) => {
    const [lines, setLines] = useState<string[]>([]);
    
    useEffect(() => {
        setLines([]);
        const steps = [
            "Initializing handshake...",
            "Decrypting stream...",
            "Parsing structure...",
            "Optimizing...",
            `>> ${output}`
        ];
        
        const timeouts: any[] = [];
        let accumulatedDelay = 0;

        steps.forEach((step, i) => {
            accumulatedDelay += Math.random() * 300 + 200;
            const t = setTimeout(() => {
                setLines(prev => {
                    const newLines = [...prev, step];
                    return newLines.slice(-6); // Keep last 6 lines
                });
            }, accumulatedDelay);
            timeouts.push(t);
        });

        return () => timeouts.forEach(clearTimeout);
    }, [output]);

    return (
        <div className="font-mono text-[10px] space-y-2 h-full flex flex-col justify-end pb-2">
            {lines.map((line, i) => (
                <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                    <span className="text-white/20 shrink-0 select-none">
                        {new Date().toLocaleTimeString([], {hour12: false, hour:'2-digit', minute:'2-digit', second:'2-digit'})}
                    </span>
                    <span 
                        className={`break-words ${line.startsWith('>>') ? 'text-white font-bold bg-white/10 px-2 py-1 rounded w-full border-l-2 shadow-lg' : 'text-white/60'}`} 
                        style={{ borderColor: line.startsWith('>>') ? color : 'transparent' }}
                    >
                        {line}
                    </span>
                </div>
            ))}
            <div className="animate-pulse text-[#69B7B2] font-bold">_</div>
        </div>
    );
};

export const UseCaseShowcase: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);
    const [beamSourceY, setBeamSourceY] = useState(0);
    const listRef = useRef<HTMLDivElement>(null);
    
    // Auto-cycle logic
    useEffect(() => {
        if (isPaused) return;
        
        const duration = 5000; 
        const interval = 50;   
        
        const timer = setInterval(() => {
            setProgress(prev => {
                const next = prev + (interval / duration) * 100;
                if (next >= 100) {
                    setActiveIndex(idx => (idx + 1) % SOLUTIONS.length);
                    return 0;
                }
                return next;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [isPaused, activeIndex]);

    // Dynamic Beam Source Positioning
    useEffect(() => {
        const updateBeam = () => {
            if (!listRef.current) return;
            const buttons = listRef.current.children;
            const activeButton = buttons[activeIndex] as HTMLElement;
            
            if (activeButton) {
                // Calculate center Y of active button relative to container
                const containerTop = listRef.current.offsetTop;
                const buttonTop = activeButton.offsetTop;
                const buttonHeight = activeButton.offsetHeight;
                setBeamSourceY(buttonTop + buttonHeight / 2);
            }
        };

        updateBeam();
        // Recalculate after render/transition
        const t = setTimeout(updateBeam, 350); 
        window.addEventListener('resize', updateBeam);
        return () => {
            window.removeEventListener('resize', updateBeam);
            clearTimeout(t);
        };
    }, [activeIndex]);

    const activeItem = SOLUTIONS[activeIndex];
    const beamTargetY = 300; // Center of iPhone/Container
    const beamWidth = 60; // Width of SVG area

    return (
        <div className="py-32 bg-[#030303] border-b border-white/5 relative overflow-hidden">
            {/* Background Tech Mesh */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                style={{ 
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', 
                    backgroundSize: '40px 40px' 
                }} 
            />

            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                
                {/* Section Header */}
                <div className="mb-20 text-center md:text-left">
                    <h2 className="text-4xl md:text-6xl font-serif text-white leading-none">
                        Our <span className="text-white/40">Tools.</span>
                    </h2>
                </div>

                {/* --- THE PIPELINE INTERFACE --- */}
                {/* Grid: [List 400px] [Beam 60px] [Phone 320px] [Beam 60px] [Output Rest] */}
                <div className="flex flex-col lg:flex-row gap-0 relative items-start lg:items-center justify-center">
                    
                    {/* SECTION 1: INPUT LIST */}
                    <div ref={listRef} className="w-full lg:w-[400px] relative z-20 flex flex-col space-y-3 shrink-0">
                        {SOLUTIONS.map((item, idx) => {
                            const isActive = idx === activeIndex;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => { setActiveIndex(idx); setProgress(0); setIsPaused(true); }}
                                    onMouseEnter={() => setIsPaused(true)}
                                    onMouseLeave={() => setIsPaused(false)}
                                    className={`
                                        group relative w-full text-left transition-all duration-300 rounded-xl border overflow-hidden
                                        ${isActive 
                                            ? 'bg-[#151517] border-white/20 shadow-lg' 
                                            : 'bg-[#0a0a0c] border-white/5 h-14 hover:border-white/10 hover:bg-[#111]'
                                        }
                                    `}
                                >
                                    {/* Progress Bar (Active Only) */}
                                    {isActive && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-current transition-all duration-100 ease-linear" 
                                             style={{ height: `${progress}%`, color: item.color }} 
                                        />
                                    )}

                                    <div className={`relative px-4 py-3 flex h-full ${isActive ? 'items-start' : 'items-center'}`}>
                                        {/* Number */}
                                        <div className="w-8 flex-shrink-0 text-right mr-4">
                                            <span className={`font-mono text-xs ${isActive ? 'text-white' : 'text-white/20'}`}>
                                                0{idx + 1}
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h3 className={`font-bold transition-colors ${isActive ? 'text-white text-base mb-2' : 'text-white/50 text-sm group-hover:text-white/80'}`}>
                                                    {item.title}
                                                </h3>
                                                {!isActive && <ChevronRight size={14} className="text-white/10 group-hover:text-white/30" />}
                                            </div>
                                            
                                            {/* EXPANDED TEXT: No truncation, full height */}
                                            {isActive && (
                                                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                                    <p className="text-white/60 text-xs leading-relaxed pb-2 whitespace-normal h-auto">
                                                        {item.desc}
                                                    </p>
                                                    <span 
                                                        className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border inline-block mt-2"
                                                        style={{ borderColor: item.color, color: item.color }}
                                                    >
                                                        {item.tag}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* PIPE 1: LIST TO PHONE */}
                    <div className="hidden lg:block relative w-[60px] h-[600px] shrink-0">
                        <svg className="w-full h-full overflow-visible absolute top-0 left-0">
                            {/* Static Track */}
                            <path 
                                d={`M 0,${beamSourceY} C 30,${beamSourceY} 30,${beamTargetY} 60,${beamTargetY}`}
                                fill="none"
                                stroke="rgba(255,255,255,0.05)"
                                strokeWidth="3"
                            />
                            {/* Active Beam */}
                            <path 
                                d={`M 0,${beamSourceY} C 30,${beamSourceY} 30,${beamTargetY} 60,${beamTargetY}`}
                                fill="none"
                                stroke={activeItem.color}
                                strokeWidth="2"
                                className="transition-all duration-500 ease-out"
                                style={{ filter: `drop-shadow(0 0 8px ${activeItem.color})` }}
                            />
                            {/* Pulse Packet */}
                            <circle r="3" fill="#fff">
                                <animateMotion 
                                    dur="1s" 
                                    repeatCount="indefinite"
                                    path={`M 0,${beamSourceY} C 30,${beamSourceY} 30,${beamTargetY} 60,${beamTargetY}`}
                                />
                            </circle>
                        </svg>
                    </div>

                    {/* SECTION 2: IPHONE INTERFACE */}
                    <div className="relative w-[320px] h-[640px] shrink-0 mt-8 lg:mt-0 transform transition-transform hover:scale-[1.02] duration-500">
                        {/* Frame */}
                        <div className="absolute inset-0 bg-[#1a1a1a] rounded-[3rem] shadow-2xl border-[6px] border-[#2a2a2a] ring-1 ring-white/10 z-20 pointer-events-none">
                            {/* Buttons */}
                            <div className="absolute top-24 -left-2 w-1 h-8 bg-[#2a2a2a] rounded-l-md" />
                            <div className="absolute top-36 -left-2 w-1 h-12 bg-[#2a2a2a] rounded-l-md" />
                            <div className="absolute top-28 -right-2 w-1 h-16 bg-[#2a2a2a] rounded-r-md" />
                        </div>

                        {/* Screen */}
                        <div className="absolute inset-[6px] bg-black rounded-[2.5rem] overflow-hidden z-10 flex flex-col relative">
                            
                            {/* Dynamic Island */}
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-50 flex items-center justify-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#111]" />
                                <div className="w-1.5 h-1.5 rounded-full bg-[#050505] border border-white/10" />
                            </div>

                            {/* Status Bar */}
                            <div className="h-12 w-full flex justify-between items-center px-6 pt-2 z-40 text-white select-none">
                                <span className="text-[10px] font-bold">9:41</span>
                                <div className="flex gap-1">
                                    <div className="w-4 h-2.5 bg-white rounded-[2px]" />
                                </div>
                            </div>

                            {/* App Header */}
                            <div className="px-6 pt-2 pb-4 z-30">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                        <activeItem.icon size={20} color={activeItem.color} />
                                    </div>
                                    <div>
                                        <div className="text-[9px] font-bold uppercase tracking-widest text-white/50">Running Module</div>
                                        <h3 className="text-xl font-serif text-white">{activeItem.title.split(' ')[0]}</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Visualizer Area */}
                            <div className="flex-1 relative mx-2 rounded-2xl overflow-hidden bg-[#0c0c0e] border border-white/10">
                                <div className="absolute inset-0">
                                    {/* KEY IS CRITICAL FOR RE-MOUNTING ON CHANGE */}
                                    <SectionVisualizer key={activeItem.id} mode={activeItem.mode as any} color={activeItem.color} />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                                
                                {/* Floating Overlay Data */}
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="bg-white/10 backdrop-blur-md border border-white/10 p-3 rounded-xl flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: activeItem.color }} />
                                        <div className="flex-1">
                                            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-white animate-[dash_2s_ease-in-out_infinite]" style={{ width: '60%' }} />
                                            </div>
                                        </div>
                                        <span className="text-[9px] font-mono text-white/70">PROCCESSING</span>
                                    </div>
                                </div>
                            </div>

                            {/* App Footer */}
                            <div className="h-20 px-6 flex items-center justify-between z-30 bg-black">
                                <div className="flex flex-col">
                                    <span className="text-[9px] text-white/30 uppercase">Latency</span>
                                    <span className="text-xs font-mono text-white">12ms</span>
                                </div>
                                <div className="w-px h-8 bg-white/10" />
                                <div className="flex flex-col text-right">
                                    <span className="text-[9px] text-white/30 uppercase">Status</span>
                                    <span className="text-xs font-bold text-green-400">Optimal</span>
                                </div>
                            </div>

                            {/* Home Indicator */}
                            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-50" />
                        </div>
                    </div>

                    {/* PIPE 2: PHONE TO OUTPUT */}
                    <div className="hidden lg:flex relative w-[60px] items-center justify-center">
                        <div className="w-full h-[2px] bg-white/5 relative overflow-hidden">
                            <div 
                                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent to-white/50 animate-[shimmer_1.5s_infinite]"
                                style={{ backgroundColor: activeItem.color }} 
                            />
                        </div>
                        <ArrowRight className="absolute text-white/20" size={16} />
                    </div>

                    {/* SECTION 3: OUTPUT TERMINAL - UPGRADED UI */}
                    <div className="lg:w-[320px] relative z-20 mt-8 lg:mt-0 flex flex-col gap-4">
                        
                        {/* Main Data Card */}
                        <div className="bg-[#0c0c0e]/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden relative group h-[280px] flex flex-col shadow-2xl ring-1 ring-white/5">
                            
                            {/* Decorative Header */}
                            <div className="h-10 bg-white/5 border-b border-white/5 flex items-center justify-between px-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-[pulse_2s_infinite]" />
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-white/60">Live Stream</span>
                                </div>
                                <div className="flex gap-1.5">
                                    <div className="w-1 h-1 rounded-full bg-white/20" />
                                    <div className="w-1 h-1 rounded-full bg-white/20" />
                                    <div className="w-1 h-1 rounded-full bg-white/20" />
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 p-4 bg-black/40 relative">
                                {/* Scanlines */}
                                <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
                                
                                <TerminalOutput key={activeItem.id} output={activeItem.output} color={activeItem.color} />
                            </div>

                            {/* Footer Metrics */}
                            <div className="h-12 bg-white/[0.02] border-t border-white/5 flex items-center px-4 justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[8px] uppercase tracking-widest text-white/30">Confidence</span>
                                    <span className="text-xs font-mono font-bold text-green-400">99.8%</span>
                                </div>
                                <div className="h-6 w-px bg-white/10" />
                                <div className="flex flex-col items-end">
                                    <span className="text-[8px] uppercase tracking-widest text-white/30">Latency</span>
                                    <span className="text-xs font-mono font-bold text-white/70">14ms</span>
                                </div>
                            </div>
                        </div>

                        {/* Secondary Action Card */}
                        <div className="bg-[#151517] border border-white/5 rounded-xl p-4 flex items-center gap-4 transition-all hover:border-white/20 group cursor-pointer">
                            <div 
                                className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-500"
                                style={{ backgroundColor: `${activeItem.color}20`, color: activeItem.color }}
                            >
                                <CheckCircle2 size={18} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white mb-0.5 group-hover:text-[#69B7B2] transition-colors">Integration Ready</h4>
                                <p className="text-[10px] text-white/40">JSON payload generated successfully.</p>
                            </div>
                            <ArrowRight size={14} className="ml-auto text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};
