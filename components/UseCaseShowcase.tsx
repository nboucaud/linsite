
import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Server, Activity, GitMerge, Database, Lock, ChevronRight, Code, Terminal, Cpu, Scan, Zap, Network, Bot, BarChart3, Users } from 'lucide-react';
import { SectionVisualizer } from './SectionVisualizer';

const SOLUTIONS = [
    {
        id: 'daas',
        title: "Data-as-a-Service (DaaS)",
        desc: "This service works directly with your organization to locate and extract hard-to-reach knowledge, including tribal knowledge, operational memory, contextual practices, regulatory constraints, competitive intelligence, and experiential reasoning.",
        icon: Database,
        color: "#69B7B2", 
        tag: "EXTRACT",
        mode: 'search'
    },
    {
        id: 'capture',
        title: "Knowledge Capture",
        desc: "We identify and formalize the rules, assumptions, constraints, and potential failure points embedded in your operations. Capturing how work is actually governed, not just how it is documented.",
        icon: Scan,
        color: "#f59e0b",
        tag: "FORMALIZE",
        mode: 'translation'
    },
    {
        id: 'trees',
        title: "Knowledge Trees",
        desc: "This tool designs and structures representations of your knowledge that preserve relationships, dependencies, and rules, enabling operational logic, traceability, and reasoning across people, roles, systems, rules, and procedures.",
        icon: Network,
        color: "#ef4444", 
        tag: "STRUCTURE",
        mode: 'core'
    },
    {
        id: 'bridge',
        title: "Bridge AI",
        desc: "This tool deploys purpose-built agents that operate on shared knowledge trees, allowing agents to reason within defined workflows, understand their roles, and coordinate with other agents based on shared operational context.",
        icon: Bot,
        color: "#8b5cf6", 
        tag: "DEPLOY",
        mode: 'swarm'
    },
    {
        id: 'strategy',
        title: "Strategy Builder",
        desc: "This tool uses structured organizational knowledge to enable decision-makers to model scenarios, test assumptions, and explore the operational consequences of different strategies through predictive and prescriptive analysis.",
        icon: BarChart3,
        color: "#06b6d4",
        tag: "MODEL",
        mode: 'logic'
    },
    {
        id: 'workforce',
        title: "Workforce Augmentation",
        desc: "This tool supports teams by embedding knowledge into workflows, helping junior staff learn faster, senior staff offload cognitive burden, and organizations sustain expertise as people and roles change.",
        icon: Users,
        color: "#ec4899",
        tag: "AUGMENT",
        mode: 'identity'
    }
];

export const UseCaseShowcase: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);
    const [beamSourceY, setBeamSourceY] = useState(0);
    
    // Auto-cycle logic
    useEffect(() => {
        if (isPaused) return;
        
        const duration = 5000; // 5 seconds per slide
        const interval = 50;   // Update freq
        
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

    // Dynamic Beam Positioning
    useEffect(() => {
        const updateBeam = () => {
            // Get root font size for rem calculation stability
            const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize || '16');
            
            // Dimensions based on Tailwind classes:
            // Inactive Item: h-16 (4rem)
            // Active Item: h-32 (8rem)
            // Gap: space-y-4 (1rem)
            const inactiveHeight = 4 * rootFontSize;
            const activeHeight = 8 * rootFontSize;
            const gap = 1 * rootFontSize;

            // Calculate Y position relative to the top of the container
            // The active item is at index `activeIndex`.
            // All items BEFORE it are inactive.
            // Y = (Sum of previous items & gaps) + (Half of active item height)
            const topPosition = activeIndex * (inactiveHeight + gap);
            const centerPosition = topPosition + (activeHeight / 2);
            
            setBeamSourceY(centerPosition);
        };

        updateBeam();
        window.addEventListener('resize', updateBeam);
        return () => window.removeEventListener('resize', updateBeam);
    }, [activeIndex]);

    const activeItem = SOLUTIONS[activeIndex];

    const beamTargetY = 300; // Center of the 600px visualizer
    const beamWidth = 48;

    return (
        <div className="py-32 bg-[#030303] border-b border-white/5 relative overflow-hidden">
            {/* Background Tech Mesh */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                style={{ 
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', 
                    backgroundSize: '40px 40px' 
                }} 
            />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                
                {/* Section Header */}
                <div className="mb-20 text-center md:text-left">
                    <h2 className="text-4xl md:text-6xl font-serif text-white leading-none">
                        Our <span className="text-white/40">Tools.</span>
                    </h2>
                </div>

                {/* --- THE PIPELINE INTERFACE --- */}
                {/* Explicit 3-Column Grid for perfect alignment: [List: 5fr] [Connector: 48px] [Visualizer: 7fr] */}
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_48px_minmax(0,7fr)] gap-0 relative">
                    
                    {/* LEFT: THE LIST (Input Stream) */}
                    <div className="lg:col-auto relative z-20 flex flex-col space-y-4">
                        {SOLUTIONS.map((item, idx) => {
                            const isActive = idx === activeIndex;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => { setActiveIndex(idx); setProgress(0); setIsPaused(true); }}
                                    onMouseEnter={() => setIsPaused(true)}
                                    onMouseLeave={() => setIsPaused(false)}
                                    className={`
                                        group relative w-full text-left transition-all duration-500 rounded-xl border overflow-hidden
                                        ${isActive 
                                            ? 'bg-[#151517] border-white/20 h-32' 
                                            : 'bg-[#0a0a0c] border-white/5 h-16 hover:border-white/10 hover:bg-[#111]'
                                        }
                                    `}
                                >
                                    {/* Progress Bar Background (Active Only) */}
                                    {isActive && (
                                        <div className="absolute bottom-0 left-0 h-0.5 bg-current transition-all duration-100 ease-linear" 
                                             style={{ width: `${progress}%`, color: item.color }} 
                                        />
                                    )}

                                    <div className="relative p-4 flex items-center h-full">
                                        {/* Number / Status */}
                                        <div className="w-12 flex-shrink-0 flex flex-col items-center justify-center border-r border-white/5 mr-4 h-full">
                                            <span className={`font-mono text-xs ${isActive ? 'text-white' : 'text-white/20'}`}>
                                                0{idx + 1}
                                            </span>
                                            {isActive && <div className="w-1.5 h-1.5 rounded-full mt-2 animate-pulse" style={{ backgroundColor: item.color }} />}
                                        </div>

                                        {/* Text Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className={`font-bold transition-colors ${isActive ? 'text-white text-lg' : 'text-white/50 text-sm group-hover:text-white/80'}`}>
                                                    {item.title}
                                                </h3>
                                                <span 
                                                    className={`text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border ${isActive ? 'opacity-100' : 'opacity-0'}`}
                                                    style={{ borderColor: item.color, color: item.color }}
                                                >
                                                    {item.tag}
                                                </span>
                                            </div>
                                            
                                            <div className={`transition-all duration-500 overflow-hidden ${isActive ? 'max-h-20 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                                                <p className="text-white/50 text-xs leading-relaxed line-clamp-2">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Arrow Hint */}
                                        {!isActive && (
                                            <div className="ml-4 text-white/10 group-hover:text-white/30 transition-colors">
                                                <ChevronRight size={16} />
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* CENTER: THE CONNECTION BEAM (Desktop Only) */}
                    <div className="hidden lg:block relative z-10 w-full h-full">
                        <svg className="w-full h-full overflow-visible absolute top-0 left-0">
                            {/* The Beam Path */}
                            <path 
                                d={`M 0,${beamSourceY} C ${beamWidth/2},${beamSourceY} ${beamWidth/2},${beamTargetY} ${beamWidth},${beamTargetY}`}
                                fill="none"
                                stroke={activeItem.color}
                                strokeWidth="3"
                                className="transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                                style={{ filter: `drop-shadow(0 0 8px ${activeItem.color})` }}
                            />
                            
                            {/* Source Dot */}
                            <circle 
                                cx="0" 
                                cy={beamSourceY} 
                                r="4" 
                                fill={activeItem.color}
                                className="transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                            />

                            {/* Target Dot */}
                            <circle 
                                cx={beamWidth} 
                                cy={beamTargetY} 
                                r="4" 
                                fill={activeItem.color} 
                            />

                            {/* Moving Packet */}
                            <circle r="4" fill="#fff">
                                <animateMotion 
                                    dur="1.5s" 
                                    repeatCount="indefinite"
                                    path={`M 0,${beamSourceY} C ${beamWidth/2},${beamSourceY} ${beamWidth/2},${beamTargetY} ${beamWidth},${beamTargetY}`}
                                    calcMode="spline"
                                    keyTimes="0;1"
                                    keySplines="0.4 0 0.2 1"
                                />
                            </circle>
                        </svg>
                    </div>

                    {/* RIGHT: THE PROCESSING CORE (Visualizer) */}
                    <div className="lg:col-auto relative h-[500px] lg:h-[600px] mt-8 lg:mt-0">
                        {/* The Monitor Frame */}
                        <div className="absolute inset-0 bg-[#0c0c0e] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col group">
                            
                            {/* Monitor Header (Minimalist) */}
                            <div className="h-12 bg-white/5 border-b border-white/5 flex items-center justify-between px-6">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/50" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
                                </div>
                            </div>

                            {/* Main Display Area */}
                            <div className="flex-1 relative bg-black/50">
                                <div className="absolute inset-0">
                                    <SectionVisualizer mode={activeItem.mode as any} color={activeItem.color} />
                                </div>
                                
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[length:100%_2px,3px_100%] opacity-20" />
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)] z-10 pointer-events-none" />

                                <div className="absolute bottom-8 left-8 z-20">
                                    <div className="flex items-end gap-4">
                                        <div 
                                            className="w-16 h-16 rounded-xl bg-black/50 border border-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-lg transition-all duration-500"
                                            style={{ 
                                                borderColor: activeItem.color,
                                                boxShadow: `0 0 30px ${activeItem.color}20` 
                                            }}
                                        >
                                            <activeItem.icon size={32} />
                                        </div>
                                        <div>
                                            <div className="text-3xl font-serif text-white leading-none mb-1">{activeItem.title}</div>
                                            <div className="text-[10px] font-mono text-white/50 uppercase tracking-widest">
                                                Tool {activeIndex + 1} / {SOLUTIONS.length}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/30 z-20" />
                                <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/30 z-20" />
                                <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/30 z-20" />
                                <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/30 z-20" />
                            </div>
                        </div>
                        
                        <div 
                            className="absolute -inset-4 blur-3xl opacity-20 -z-10 transition-colors duration-700"
                            style={{ backgroundColor: activeItem.color }} 
                        />
                    </div>

                </div>
            </div>
        </div>
    );
};
