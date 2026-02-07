
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ShieldCheck, Server, Activity, GitMerge, Database, Lock, ChevronRight, Code, Terminal, Building2, Truck, Briefcase, Factory, ArrowUpRight, ChevronLeft, Loader2, Key, CheckCircle2, Handshake, Users, Target, Cpu, Layers, ArrowRight, Radio, Sparkles, Layout, Bot, BarChart3, Scan, Network } from 'lucide-react';
import { SectionVisualizer } from './SectionVisualizer';

const SOLUTIONS = [
    {
        id: 'daas',
        title: "Data Strategy & Modernization",
        shortDesc: "Organizing fragmented data landscapes into an intentional foundation that supports real workflows.",
        longContent: [
            "Teams operate across multiple systems, spreadsheets, software platforms, documents, and tacit operational knowledge that rarely align into a coherent structure. Data Strategy and Modernization focuses on organizing this fragmented landscape into an intentional foundation that supports how work actually happens.",
            "We work with organizations to identify internal and external data sources, design structured data architectures aligned to real workflows, and build and modernize data pipelines that connect legacy systems with modern platforms. This includes establishing governance, traceability, and compliance layers while preparing environments for analytics, automation, and AI deployment.",
            "The result goes beyond cleaned data and key performance indicators. When information flows are structured correctly, teams gain visibility across handoffs, reduce friction between departments, and create a scalable base for decision systems and intelligent tools."
        ],
        icon: Database,
        color: "#69B7B2", 
        tag: "MODERNIZE",
        mode: 'search'
    },
    {
        id: 'capture',
        title: "Knowledge Capture",
        shortDesc: "Surfacing tacit expertise and translating regulatory requirements into structured frameworks.",
        longContent: [
            "Even the best teams carry splintered knowledge. It lives in the tribe: in seasoned operators, in side conversations, in inbox threads, in sticky notes, in “how we usually handle it,” and in the quiet rules people follow without writing them down.",
            "Knowledge Capture is about bringing that lived intelligence into the open. We work with teams to surface tacit expertise, clarify unwritten rules, document decision logic, and translate regulatory and compliance requirements into structured, usable frameworks that reflect how work actually gets done.",
            "When knowledge is formalized without stripping away its context, organizations reduce single points of failure and protect themselves from risk. Tribal expertise becomes institutional memory, compliance becomes operationalized rather than reactive, and teams gain clarity without losing their hard-earned practical wisdom."
        ],
        icon: Scan,
        color: "#f59e0b",
        tag: "FORMALIZE",
        mode: 'translation'
    },
    {
        id: 'trees',
        title: "Knowledge Trees",
        shortDesc: "Linking information to action: connecting datasets, workflows, rules, and decisions.",
        longContent: [
            "Data lives in one system, policies in another, workflows in people’s habits, and outcomes in reports that rarely explain how they were produced. Teams sense that everything is connected, but the relationships between data, rules, decisions, and results are rarely mapped in a coherent or navigable way.",
            "We build structured frameworks that link information to action: connecting datasets to workflows, workflows to rules, rules to decisions, and decisions to measurable impact. This architecture allows organizations to analyze dependencies, anticipate ripple effects, and understand how changes in one area influence the system as a whole.",
            "When these relationships are explicit, prediction becomes more reliable and analysis becomes contextual rather than isolated. Knowledge Trees provide the structural layer that enables agents, analytics systems, and human teams to operate with shared intelligence instead of fragmented insight."
        ],
        icon: Network,
        color: "#ef4444", 
        tag: "STRUCTURE",
        mode: 'core'
    },
    {
        id: 'bridge',
        title: "Bridge AI",
        shortDesc: "Connecting intelligent agents directly to specific teams, grounded in operational reality.",
        longContent: [
            "Most teams are told to “use AI,” but the tools they’re given don’t understand their role, their constraints, or the rules they operate under. People end up copying and pasting context, double-checking outputs against policy, and quietly deciding not to trust systems that weren’t built around how they actually work.",
            "Bridge AI connects intelligent agents directly to specific teams and responsibilities. Each staff member receives an AI agent mapped to their function, drawing from structured Knowledge Trees, approved data sources, workflow logic, and compliance boundaries so support is grounded in operational reality rather than generic outputs.",
            "The result is not a chatbot floating above the organization, but embedded intelligence that understands handoffs, dependencies, and risk. Teams move faster because the agent already knows the rules, the context, and the downstream impact of a decision. Making AI feel less like an experiment and more like a reliable sidekick in the work you do."
        ],
        icon: Bot,
        color: "#8b5cf6", 
        tag: "DEPLOY",
        mode: 'swarm'
    },
    {
        id: 'strategy',
        title: "Strategy Builder",
        shortDesc: "Structuring decision pathways to generate strategies grounded in real constraints.",
        longContent: [
            "There are moments when the numbers shift and no one immediately knows why. Revenue drops without warning, a compliance exposure surfaces, a contract is at risk, a safety threshold is crossed, or a decision made months ago starts cascading into consequences that were never fully mapped. Leaders are expected to respond instantly. Even when the logic chain behind the problem doesn’t make sense.",
            "Strategy Builder structures the decision pathways that most organizations carry informally in their heads. By connecting live data, operational rules, and Knowledge Trees, it builds traceable chains of logic that map triggers to impact and impact to coordinated response, generating prescriptive and reactive strategies grounded in real constraints rather than guesswork.",
            "When something critical happens, teams are no longer navigating blind or relying on individual heroics. The system outlines consequences, surfaces trade-offs, and provides structured response pathways so leaders are not carrying the weight of uncertainty alone."
        ],
        icon: BarChart3,
        color: "#06b6d4",
        tag: "MODEL",
        mode: 'logic'
    },
    {
        id: 'workforce',
        title: "Workforce Augmentation",
        shortDesc: "Contextual capability development grounded in your own knowledge structures.",
        longContent: [
            "Organizations spend heavily on training programs, certifications, and workshops. Yet employees often return to their desks unchanged. Whether it is SQL, analytics, compliance literacy, leadership development, workflow systems, or AI usage, training is frequently generic and disconnected from the knowledge structures, constraints, and pressures that define real work.",
            "Workforce Augmentation makes capability development contextual and role-specific by grounding it in your own Knowledge Capture and Knowledge Trees. Each employee is paired with a personalized AI sidekick aligned to their function, drawing from structured internal knowledge, operational rules, and workflow logic, while managers curate and design targeted learning pathways tied directly to performance gaps and strategic priorities.",
            "Training is no longer imported from outside or detached from reality. It emerges from your own data, your own knowledge, and your own systems. Surfacing development moments in real time and strengthening capability exactly where operational intelligence requires it most."
        ],
        icon: Users,
        color: "#ec4899",
        tag: "AUGMENT",
        mode: 'identity'
    }
];

export const UseCaseShowcase: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [beamSourceY, setBeamSourceY] = useState(0);
    const listRef = useRef<HTMLDivElement>(null);
    
    // Dynamic Beam Source Positioning
    useEffect(() => {
        const updateBeam = () => {
            if (!listRef.current) return;
            const buttons = listRef.current.children;
            const activeButton = buttons[activeIndex] as HTMLElement;
            
            if (activeButton) {
                const buttonTop = activeButton.offsetTop;
                const buttonHeight = activeButton.offsetHeight;
                setBeamSourceY(buttonTop + buttonHeight / 2);
            }
        };

        updateBeam();
        const t = setTimeout(updateBeam, 350); 
        window.addEventListener('resize', updateBeam);
        return () => {
            window.removeEventListener('resize', updateBeam);
            clearTimeout(t);
        };
    }, [activeIndex]);

    const activeItem = SOLUTIONS[activeIndex];
    const beamTargetY = 290; // Center of 581px Visualizer Card

    const handleNext = () => setActiveIndex(prev => (prev + 1) % SOLUTIONS.length);
    const handlePrev = () => setActiveIndex(prev => (prev - 1 + SOLUTIONS.length) % SOLUTIONS.length);

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
                {/* Grid: [List 400px] [Beam 60px] [Visualizer 282px] [Beam 60px] [Output Rest] */}
                <div className="flex flex-col lg:flex-row gap-0 relative items-start lg:items-center justify-center">
                    
                    {/* SECTION 1: INPUT LIST */}
                    <div ref={listRef} className="w-full lg:w-[380px] relative z-20 flex flex-col space-y-3 shrink-0">
                        {SOLUTIONS.map((item, idx) => {
                            const isActive = idx === activeIndex;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => setActiveIndex(idx)}
                                    className={`
                                        group relative w-full text-left transition-all duration-300 rounded-xl border overflow-hidden
                                        ${isActive 
                                            ? 'bg-[#151517] border-white/20 shadow-lg' 
                                            : 'bg-[#0a0a0c] border-white/5 h-14 hover:border-white/10 hover:bg-[#111]'
                                        }
                                    `}
                                >
                                    <div className={`relative px-4 py-3 flex h-full ${isActive ? 'items-start' : 'items-center'}`}>
                                        <div className="w-8 flex-shrink-0 text-right mr-4">
                                            <span className={`font-mono text-xs ${isActive ? 'text-white' : 'text-white/20'}`}>
                                                0{idx + 1}
                                            </span>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h3 className={`font-bold transition-colors ${isActive ? 'text-white text-base mb-2' : 'text-white/50 text-sm group-hover:text-white/80'}`}>
                                                    {item.title}
                                                </h3>
                                                {!isActive && <ChevronRight size={14} className="text-white/10 group-hover:text-white/30" />}
                                            </div>
                                            
                                            {isActive && (
                                                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                                    <p className="text-white/60 text-xs leading-relaxed pb-2 whitespace-normal h-auto">
                                                        {item.shortDesc}
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

                    {/* PIPE 1: LIST TO VISUALIZER */}
                    <div className="hidden lg:block relative w-[60px] h-[581px] shrink-0">
                        <svg className="w-full h-full overflow-visible absolute top-0 left-0">
                            <path 
                                d={`M 0,${beamSourceY} C 30,${beamSourceY} 30,${beamTargetY} 60,${beamTargetY}`}
                                fill="none"
                                stroke="rgba(255,255,255,0.05)"
                                strokeWidth="3"
                            />
                            <path 
                                d={`M 0,${beamSourceY} C 30,${beamSourceY} 30,${beamTargetY} 60,${beamTargetY}`}
                                fill="none"
                                stroke={activeItem.color}
                                strokeWidth="2"
                                className="transition-all duration-500 ease-out"
                                style={{ filter: `drop-shadow(0 0 8px ${activeItem.color})` }}
                            />
                            <circle r="3" fill="#fff">
                                <animateMotion 
                                    dur="1s" 
                                    repeatCount="indefinite"
                                    path={`M 0,${beamSourceY} C 30,${beamSourceY} 30,${beamTargetY} 60,${beamTargetY}`}
                                />
                            </circle>
                        </svg>
                    </div>

                    {/* SECTION 2: VISUALIZER UI CARD (581px Height x 282px Width) */}
                    <div className="relative w-[282px] h-[581px] shrink-0 mt-8 lg:mt-0 flex flex-col">
                        <div className="w-full h-full bg-[#0c0c0e] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden relative flex flex-col group hover:border-white/20 transition-colors">
                            {/* Canvas Stage - Pure Visual */}
                            <div className="flex-1 relative bg-black">
                                <SectionVisualizer key={activeItem.id} mode={activeItem.mode as any} color={activeItem.color} />
                            </div>
                        </div>
                    </div>

                    {/* PIPE 2: VISUALIZER TO OUTPUT */}
                    <div className="hidden lg:flex relative w-[60px] items-center justify-center">
                        <div className="w-full h-[2px] bg-white/5 relative overflow-hidden">
                            <div 
                                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent to-white/50 animate-[shimmer_1.5s_infinite]"
                                style={{ backgroundColor: activeItem.color }} 
                            />
                        </div>
                        <ArrowRight className="absolute text-white/20" size={16} />
                    </div>

                    {/* SECTION 3: OUTPUT CARD */}
                    <div className="lg:w-[480px] relative z-20 mt-8 lg:mt-0 flex flex-col justify-center h-[500px]">
                        <div 
                            key={activeItem.id} 
                            className="bg-[#0c0c0e]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl ring-1 ring-white/5 flex flex-col h-full animate-in fade-in slide-in-from-left-4 duration-500"
                        >
                            <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-6">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 shadow-lg text-white transition-colors duration-500" style={{ color: activeItem.color }}>
                                    <activeItem.icon size={24} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: activeItem.color }} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Active Module</span>
                                    </div>
                                    <h3 className="text-2xl font-serif text-white">{activeItem.title}</h3>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6">
                                <p className="text-white/80 text-sm leading-relaxed font-light">
                                    {activeItem.longContent[0]}
                                </p>
                                <p className="text-white/80 text-sm leading-relaxed font-light">
                                    {activeItem.longContent[1]}
                                </p>
                                
                                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-1 h-full transition-colors duration-500" style={{ backgroundColor: activeItem.color }} />
                                    <div className="flex items-start gap-3 relative z-10">
                                        <Sparkles size={16} className="text-white/40 mt-1 shrink-0" />
                                        <div>
                                            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-2">Key Outcome</h4>
                                            <p className="text-white/70 text-sm leading-relaxed">
                                                {activeItem.longContent[2]}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* MANUAL NAVIGATION FOOTER */}
                            <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center">
                                <button 
                                    onClick={handlePrev}
                                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors group px-3 py-2 rounded-lg hover:bg-white/5"
                                >
                                    <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                                    <span>Previous</span>
                                </button>
                                <span className="text-[10px] font-mono text-white/20">
                                    {activeIndex + 1} / {SOLUTIONS.length}
                                </span>
                                <button 
                                    onClick={handleNext}
                                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors group px-3 py-2 rounded-lg hover:bg-white/5"
                                >
                                    <span>Next</span>
                                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
