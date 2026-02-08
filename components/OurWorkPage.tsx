
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, BarChart3, Truck, Zap, Lock, Database, Globe, CheckCircle2, Cpu, ChevronRight, Terminal, AlertTriangle } from 'lucide-react';

// --- DATA ---
const CASE_STUDIES = [
    {
        id: 'energy',
        client: "Dept of Energy",
        title: "Grid Optimization",
        challenge: "Stabilizing a 40-year-old power grid under extreme weather loads.",
        solution: "Deployed predictive maintenance AI across 400 substations to anticipate failure points 48h in advance.",
        impact: "40% faster response",
        tags: ["Government", "Energy"],
        icon: Zap,
        color: "#f59e0b",
        visualMode: "pulse"
    },
    {
        id: 'logistics',
        client: "Global Logistics Co.",
        title: "Supply Chain Resilience",
        challenge: "Processing 10M+ customs documents annually with manual data entry bottlenecks.",
        solution: "Implemented GenAI agents to automate bill-of-lading extraction and customs filing.",
        impact: "10M+ docs automated",
        tags: ["Logistics", "Automation"],
        icon: Truck,
        color: "#3b82f6",
        visualMode: "flow"
    },
    {
        id: 'finance',
        client: "FinHealth Corp",
        title: "Secure Audit Trails",
        challenge: "Managing SOC2 compliance across a distributed, remote-first engineering team.",
        solution: "Built an automated 'airlock' system to redact PII and log all data access attempts.",
        impact: "100% audit pass rate",
        tags: ["Finance", "Security"],
        icon: Lock,
        color: "#10b981",
        visualMode: "shield"
    },
    {
        id: 'rail',
        client: "National Rail",
        title: "Legacy Modernization",
        challenge: "Converting 50 years of paper schematics into a queryable digital twin.",
        solution: "Used computer vision to digitize and index 500k+ engineering drawings.",
        impact: "50yrs data recovered",
        tags: ["Transport", "Data"],
        icon: Database,
        color: "#8b5cf6",
        visualMode: "network"
    }
];

// --- COMPONENTS ---

// 1. TEXT DECRYPTION EFFECT
const DecryptText: React.FC<{ text: string, speed?: number, reveal?: boolean }> = ({ text, speed = 30, reveal = true }) => {
    const [display, setDisplay] = useState("");
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    
    useEffect(() => {
        if (!reveal) return;
        let iterations = 0;
        const interval = setInterval(() => {
            setDisplay(
                text.split("").map((letter, index) => {
                    if (index < iterations) return text[index];
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join("")
            );
            if (iterations >= text.length) clearInterval(interval);
            iterations += 1 / 2; // Decryption speed
        }, speed);
        return () => clearInterval(interval);
    }, [text, reveal, speed]);

    return <span>{display}</span>;
};

// 2. BACKGROUND VISUALIZER (The Synthesis Engine)
const WorkVisualizer: React.FC<{ activeColor: string, mode: string }> = ({ activeColor, mode }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let w = canvas.width = canvas.parentElement?.clientWidth || 800;
        let h = canvas.height = canvas.parentElement?.clientHeight || 600;
        let time = 0;
        let frameId: number;

        // Particles
        const particles: {x: number, y: number, vx: number, vy: number, life: number, state: 'raw' | 'processed'}[] = [];

        const render = () => {
            time += 0.01;
            
            // Soft clear for trails
            ctx.fillStyle = 'rgba(2, 2, 2, 0.2)';
            ctx.fillRect(0, 0, w, h);

            const cx = w/2;
            const cy = h/2;

            // Spawn Raw Data (Chaos) from left
            if (particles.length < 100) {
                particles.push({
                    x: 0,
                    y: Math.random() * h,
                    vx: 2 + Math.random() * 3,
                    vy: (Math.random() - 0.5) * 2,
                    life: 1,
                    state: 'raw'
                });
            }

            // Iterate backwards to allow safe removal
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                
                // PHYSICS
                if (p.state === 'raw') {
                    // Move towards center
                    const dx = cx - p.x;
                    const dy = cy - p.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    
                    p.vx += (dx/dist) * 0.2;
                    p.vy += (dy/dist) * 0.2;
                    p.x += p.vx;
                    p.y += p.vy;

                    // Processing Zone (Center)
                    if (dist < 50) {
                        p.state = 'processed';
                        // Shoot out to right as beam
                        p.vx = 10 + Math.random() * 5;
                        p.vy = 0;
                        p.y = cy + (Math.random() - 0.5) * 20; // Tight grouping
                    }
                } else {
                    // Processed Beam
                    p.x += p.vx;
                }

                // DRAW
                ctx.fillStyle = p.state === 'raw' ? '#555' : activeColor;
                
                if (p.state === 'raw') {
                    ctx.fillRect(p.x, p.y, 2, 2);
                } else {
                    // Glowing Beam Lines
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = activeColor;
                    ctx.fillRect(p.x, p.y, 20, 2);
                    ctx.shadowBlur = 0;
                }

                // Recycle
                if (p.x > w || p.x < 0 || p.y > h || p.y < 0) {
                    particles.splice(i, 1);
                }
            }

            // CENTRAL PROCESSOR
            ctx.strokeStyle = activeColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(cx, cy, 40, 0, Math.PI * 2);
            ctx.stroke();
            
            // Rotating ring
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(time * 2);
            ctx.beginPath();
            ctx.arc(0, 0, 50, 0, Math.PI * 1.5);
            ctx.strokeStyle = 'rgba(255,255,255,0.2)';
            ctx.stroke();
            ctx.restore();

            frameId = requestAnimationFrame(render);
        };
        render();

        const handleResize = () => {
            if (canvas.parentElement) {
                w = canvas.width = canvas.parentElement.clientWidth;
                h = canvas.height = canvas.parentElement.clientHeight;
            }
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(frameId);
        };
    }, [activeColor, mode]);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60 pointer-events-none mix-blend-screen" />;
};

export const OurWorkPage: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    
    const activeProject = CASE_STUDIES[activeIndex];

    const handleSelect = (index: number) => {
        if (index === activeIndex) return;
        setIsAnimating(true);
        setTimeout(() => {
            setActiveIndex(index);
            setIsAnimating(false);
        }, 300); // Wait for fade out
    };

    return (
        <div className="relative min-h-screen bg-[#020202] text-white pt-24 font-sans overflow-x-hidden selection:bg-[#69B7B2]/30 selection:text-[#69B7B2]">
            
            {/* HERO TITLE */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 mb-12">
                <div className="flex items-center gap-3 text-[#69B7B2] text-[10px] font-bold uppercase tracking-[0.2em] mb-4 animate-in slide-in-from-top-4 duration-700">
                    <Terminal size={14} />
                    <span>Case Logs // Declassified</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-serif text-white animate-in zoom-in-95 duration-700 delay-100">
                    Deployed <span className="text-[#69B7B2] italic">Reality.</span>
                </h1>
            </div>

            {/* MAIN INTERFACE CONTAINER */}
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24 h-[800px] lg:h-[650px]">
                
                {/* 1. SIDEBAR SELECTOR (4 Cols) */}
                <div className="lg:col-span-4 flex flex-col gap-3 h-full overflow-y-auto custom-scrollbar pr-2 animate-in slide-in-from-left duration-700 delay-200">
                    {CASE_STUDIES.map((project, idx) => (
                        <button
                            key={project.id}
                            onClick={() => handleSelect(idx)}
                            className={`group relative p-6 rounded-xl border text-left transition-all duration-300 ${
                                activeIndex === idx 
                                ? 'bg-[#151517] border-[#69B7B2]/50 shadow-[0_0_30px_rgba(105,183,178,0.1)] scale-[1.02]' 
                                : 'bg-[#0a0a0c] border-white/10 hover:bg-[#151517] hover:border-white/20'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-[10px] font-mono uppercase tracking-widest ${activeIndex === idx ? 'text-[#69B7B2]' : 'text-white/30'}`}>
                                    0{idx+1} // {project.tags[0]}
                                </span>
                                {activeIndex === idx && <div className="w-2 h-2 rounded-full bg-[#69B7B2] animate-pulse" />}
                            </div>
                            <h3 className={`text-lg font-bold transition-colors ${activeIndex === idx ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                                {project.client}
                            </h3>
                            <p className="text-xs text-white/40 mt-1 truncate">{project.title}</p>
                            
                            {/* Hover Progress Bar */}
                            <div className={`absolute bottom-0 left-0 h-1 bg-[#69B7B2] transition-all duration-300 ${activeIndex === idx ? 'w-full' : 'w-0 group-hover:w-full opacity-50'}`} />
                        </button>
                    ))}
                    
                    <div className="mt-auto p-6 rounded-xl bg-gradient-to-br from-[#69B7B2]/10 to-transparent border border-[#69B7B2]/20 text-center">
                        <h4 className="text-sm font-bold text-white mb-2">Have a similar challenge?</h4>
                        <button className="w-full py-3 bg-[#69B7B2] hover:bg-[#5aa09c] text-black font-bold uppercase tracking-widest text-[10px] rounded transition-colors">
                            Initiate Project
                        </button>
                    </div>
                </div>

                {/* 2. ACTIVE DOSSIER (8 Cols) */}
                <div className="lg:col-span-8 relative rounded-3xl overflow-hidden bg-[#0a0a0c] border border-white/10 shadow-2xl animate-in zoom-in-95 duration-700 delay-300">
                    
                    {/* Visualizer Background */}
                    <div className="absolute inset-0 z-0">
                        <WorkVisualizer activeColor={activeProject.color} mode={activeProject.visualMode} />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c] via-[#0a0a0c]/80 to-transparent" />
                    </div>

                    {/* Content Layer */}
                    <div className={`relative z-10 p-8 md:p-12 h-full flex flex-col justify-between transition-opacity duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                        
                        {/* Header */}
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white shadow-xl backdrop-blur-md" style={{ color: activeProject.color }}>
                                    <activeProject.icon size={28} />
                                </div>
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-serif text-white">{activeProject.title}</h2>
                                    <div className="flex gap-2 mt-2">
                                        {activeProject.tags.map(tag => (
                                            <span key={tag} className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] font-bold uppercase tracking-widest text-white/50">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Dynamic Text Section */}
                            <div className="space-y-8 max-w-2xl">
                                <div>
                                    <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <AlertTriangle size={12} /> The Challenge
                                    </div>
                                    <p className="text-lg text-white/80 leading-relaxed font-light border-l-2 border-red-500/30 pl-4">
                                        <DecryptText text={activeProject.challenge} speed={10} />
                                    </p>
                                </div>
                                
                                <div>
                                    <div className="text-[10px] font-bold text-[#69B7B2] uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <Cpu size={12} /> The Solution
                                    </div>
                                    <p className="text-lg text-white/80 leading-relaxed font-light border-l-2 border-[#69B7B2]/30 pl-4">
                                        <DecryptText text={activeProject.solution} speed={15} />
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Impact Footer */}
                        <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                            <div>
                                <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">Impact Metric</div>
                                <div className="text-4xl md:text-5xl font-mono font-bold text-white tracking-tighter" style={{ textShadow: `0 0 30px ${activeProject.color}40` }}>
                                    <DecryptText text={activeProject.impact} speed={50} />
                                </div>
                            </div>
                            
                            <button className="group flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-widest transition-all">
                                <span>Read Full Case</span>
                                <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center transform group-hover:translate-x-1 transition-transform">
                                    <ChevronRight size={14} />
                                </div>
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* LOGO STRIP */}
            <div className="border-t border-white/5 py-12 bg-black">
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center opacity-30 grayscale hover:grayscale-0 transition-all duration-1000">
                    <Globe size={32} />
                    <Database size={32} />
                    <Cpu size={32} />
                    <Lock size={32} />
                    <Zap size={32} />
                </div>
            </div>

        </div>
    );
};
