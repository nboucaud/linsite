
import React, { useEffect, useRef, useState } from 'react';
import { Target, Shield, Users, Clock, ArrowRight, Binary, Fingerprint, History, Cpu, Globe, Zap, FileText, User, Sparkles, Code, Network, Layers, Database, Lock, ScanLine, Terminal, ChevronDown } from 'lucide-react';

// --- VISUALIZERS ---

const OriginVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let w = canvas.width = canvas.parentElement?.clientWidth || 800;
        let h = canvas.height = canvas.parentElement?.clientHeight || 600;
        let frame = 0;

        // Nodes: Chaos to Order
        const nodes = Array.from({ length: 60 }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            targetX: w / 2 + (Math.random() - 0.5) * 300, // Target cloud center
            targetY: h / 2 + (Math.random() - 0.5) * 300,
            phase: Math.random() * Math.PI * 2
        }));

        const render = () => {
            frame++;
            const time = frame * 0.01;

            ctx.fillStyle = '#020202';
            ctx.fillRect(0, 0, w, h);

            const cx = w / 2;
            const cy = h / 2;

            // Draw Central Core (The Institution)
            const pulse = 1 + Math.sin(time * 1.5) * 0.05;
            
            // Outer glow
            const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 400);
            gradient.addColorStop(0, 'rgba(105, 183, 178, 0.15)');
            gradient.addColorStop(0.4, 'rgba(105, 183, 178, 0.02)');
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fillRect(0,0,w,h);

            // Orbit Rings
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.ellipse(cx, cy, 150 * pulse, 150 * pulse, time * 0.1, 0, Math.PI*2); ctx.stroke();
            ctx.beginPath(); ctx.ellipse(cx, cy, 250, 250, -time * 0.05, 0, Math.PI*2); ctx.stroke();

            // Nodes
            nodes.forEach(n => {
                // Orbital Physics + Attraction
                const dx = cx - n.x;
                const dy = cy - n.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                // Gentle pull to center
                n.vx += dx * 0.0001;
                n.vy += dy * 0.0001;
                
                n.x += n.vx;
                n.y += n.vy;
                
                // Draw Connections
                if (dist < 200) {
                    ctx.strokeStyle = `rgba(105, 183, 178, ${0.1 + (1 - dist/200) * 0.2})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(n.x, n.y);
                    ctx.lineTo(cx, cy);
                    ctx.stroke();
                }

                ctx.fillStyle = dist < 200 ? '#69B7B2' : 'rgba(255,255,255,0.2)';
                ctx.beginPath(); ctx.arc(n.x, n.y, n.size, 0, Math.PI*2); ctx.fill();
            });

            requestAnimationFrame(render);
        };
        render();

        const handleResize = () => {
            if (canvas.parentElement) {
                w = canvas.width = canvas.parentElement.clientWidth;
                h = canvas.height = canvas.parentElement.clientHeight;
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />;
};

const DecryptedText: React.FC<{ text: string; className?: string; reveal?: boolean }> = ({ text, className = "", reveal = true }) => {
    const [display, setDisplay] = useState(text);
    const [active, setActive] = useState(false);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";

    useEffect(() => {
        if (reveal) setActive(true);
    }, [reveal]);

    const handleMouseOver = () => {
        setActive(true);
    };

    useEffect(() => {
        if (!active) return;

        let iterations = 0;
        const interval = setInterval(() => {
            setDisplay(
                text.split("").map((letter, index) => {
                    if (index < iterations) {
                        return text[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join("")
            );

            if (iterations >= text.length) {
                clearInterval(interval);
                setActive(false);
            }
            iterations += 1/2; 
        }, 30);

        return () => clearInterval(interval);
    }, [active, text]);

    return (
        <span 
            className={`${className} font-mono cursor-default`}
            onMouseEnter={handleMouseOver}
        >
            {display}
        </span>
    );
};

const ScrollReveal: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entry.target);
            }
        }, { threshold: 0.1 });

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`}>
            {children}
        </div>
    );
};

// --- COMPONENTS ---

const TimelineItem: React.FC<{ year: string; title: string; desc: string; icon: any; align: 'left' | 'right'; isLast?: boolean }> = ({ year, title, desc, icon: Icon, align, isLast }) => {
    return (
        <ScrollReveal className={`relative flex items-start justify-between w-full mb-0 group ${align === 'left' ? 'flex-row-reverse' : ''}`}>
            
            {/* CONTENT */}
            <div className={`w-[42%] ${align === 'left' ? 'text-right pr-12 pb-24' : 'pl-12 pb-24'}`}>
                <div className={`flex flex-col ${align === 'left' ? 'items-end' : 'items-start'}`}>
                    <div className="text-[10px] font-bold font-mono text-[#69B7B2] uppercase tracking-widest mb-3 flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-[#69B7B2] animate-pulse" />
                        {year}
                    </div>
                    <h3 className="text-3xl font-serif text-white mb-4 group-hover:text-[#69B7B2] transition-colors duration-300">{title}</h3>
                    <p className="text-white/60 text-base leading-relaxed font-light">{desc}</p>
                </div>
            </div>

            {/* CENTER NODE & LINE */}
            <div className="absolute left-1/2 -translate-x-1/2 h-full flex flex-col items-center">
                {/* Node */}
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#0a0a0c] border border-white/10 z-10 group-hover:border-[#69B7B2] group-hover:scale-110 transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                    <Icon size={20} className="text-white/40 group-hover:text-[#69B7B2] transition-colors" />
                </div>
                
                {/* Connecting Line (Beam) */}
                {!isLast && (
                    <div className="flex-1 w-px bg-white/5 relative overflow-hidden my-2">
                        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-[#69B7B2] to-transparent animate-[shimmer_3s_infinite]" />
                    </div>
                )}
            </div>

            {/* SPACER */}
            <div className="w-[42%]" />
        </ScrollReveal>
    );
};

const AgentDossier: React.FC<{ member: any }> = ({ member }) => {
    return (
        <div className="group relative h-[420px] bg-[#0c0c0e] rounded-xl overflow-hidden border border-white/10 hover:border-[#69B7B2]/50 transition-all duration-500 perspective-1000">
            {/* Holographic Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#69B7B2]/0 to-[#69B7B2]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
            
            {/* Scanline */}
            <div className="absolute inset-x-0 h-px bg-[#69B7B2]/50 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:animate-scan z-20 blur-[1px]" />

            {/* Header Metadata */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-30">
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-mono text-[#69B7B2] uppercase tracking-widest px-2 py-0.5 rounded bg-[#69B7B2]/10 border border-[#69B7B2]/20">
                        {member.code}
                    </span>
                </div>
                <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/30 group-hover:text-white group-hover:bg-[#69B7B2] group-hover:border-[#69B7B2] transition-all">
                    <User size={14} />
                </div>
            </div>

            {/* Avatar / Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0c]">
                <div className="w-full h-full opacity-10 group-hover:opacity-20 transition-all duration-700 scale-105 group-hover:scale-100 mix-blend-screen flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                     <Fingerprint size={180} strokeWidth={0.5} className="text-white group-hover:text-[#69B7B2] transition-colors duration-500" />
                </div>
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/90 to-transparent z-30">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-2xl font-serif text-white mb-1 group-hover:text-[#69B7B2] transition-colors">
                        <DecryptedText text={member.name} reveal={false} />
                    </h3>
                    <p className="text-xs text-white/50 mb-4 font-light tracking-wide font-mono">{member.role}</p>
                    
                    <div className="h-0 group-hover:h-auto opacity-0 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                        <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
                            <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/40">
                                <span>Clearance</span>
                                <span className="text-white">Level 5</span>
                            </div>
                            <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/40">
                                <span>Previous</span>
                                <span className="text-white">Ex-{member.prev}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- PHILOSOPHY SECTION: THE STACK ---
const IntelligenceStack = () => {
    const [activeLayer, setActiveLayer] = useState(0);

    const layers = [
        { title: "The Interface (Command)", desc: "Presenting actionable intelligence to human decision-makers in real-time.", color: "#69B7B2", icon: Terminal },
        { title: "The Engine (Reasoning)", desc: "Applying causal inference to determine not just what happened, but why.", color: "#f59e0b", icon: Cpu },
        { title: "The Lattice (Context)", desc: "Mapping relationships between entities. Understanding that 'Project X' is linked to 'Client Y'.", color: "#22d3ee", icon: Network },
        { title: "The Substrate (Raw Data)", desc: "Ingesting unstructured chaos—PDFs, legacy databases, voice logs—without losing fidelity.", color: "#64748b", icon: Database }
    ];

    return (
        <div className="flex flex-col md:flex-row gap-12 items-center">
            {/* Left: Graphic */}
            <div className="w-full md:w-1/2 flex flex-col gap-4">
                {layers.map((layer, i) => (
                    <div 
                        key={i}
                        onMouseEnter={() => setActiveLayer(i)}
                        className={`
                            relative h-20 rounded-xl border transition-all duration-500 cursor-default flex items-center px-8 gap-6
                            ${activeLayer === i 
                                ? 'bg-[#151517] border-white/20 scale-105 shadow-2xl z-10' 
                                : 'bg-[#0a0a0c] border-white/5 opacity-50 hover:opacity-80 scale-100 z-0'
                            }
                        `}
                    >
                        <div className="text-lg font-mono font-bold text-white/20">0{4-i}</div>
                        <div 
                            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${activeLayer === i ? 'bg-white/10 text-white' : 'bg-transparent text-white/30'}`}
                            style={{ color: activeLayer === i ? layer.color : undefined }}
                        >
                            <layer.icon size={20} />
                        </div>
                        <div className="font-serif text-lg text-white">{layer.title.split(' (')[0]}</div>
                        
                        {/* Connecting Line (Visual only) */}
                        {activeLayer === i && (
                            <div className="absolute right-0 top-1/2 w-12 h-px bg-white/20 md:hidden" />
                        )}
                    </div>
                ))}
            </div>

            {/* Right: Detail */}
            <div className="w-full md:w-1/2 h-[300px] relative">
                {layers.map((layer, i) => (
                    <div 
                        key={i}
                        className={`absolute inset-0 transition-all duration-700 flex flex-col justify-center ${activeLayer === i ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12 pointer-events-none'}`}
                    >
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2" style={{ color: layer.color }}>
                            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: layer.color }} />
                            Active Layer
                        </div>
                        <h3 className="text-3xl font-serif text-white mb-6 leading-tight">
                            {layer.title}
                        </h3>
                        <p className="text-lg text-white/60 leading-relaxed border-l-2 border-white/10 pl-6">
                            {layer.desc}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const AboutPage: React.FC = () => {
    return (
        <div className="relative min-h-screen bg-[#020202] text-white pt-24 font-sans overflow-x-hidden selection:bg-[#69B7B2]/30 selection:text-[#69B7B2]">
            
            {/* HERO SECTION */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">
                <div className="absolute inset-0 z-0 opacity-100 pointer-events-none">
                    <OriginVisualizer />
                </div>
                
                <div className="relative z-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 animate-in slide-in-from-top-8 duration-700">
                        <Terminal size={12} className="text-[#69B7B2]" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">System Origin</span>
                    </div>
                    
                    <h1 className="text-6xl md:text-9xl font-serif text-white mb-8 leading-[0.85] tracking-tight mix-blend-screen animate-in zoom-in-95 duration-1000">
                        The Rescue <br/>
                        <span className="text-[#69B7B2] italic">Mission.</span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        We built Infogito to save institutional memory from the entropy of modern data systems.
                    </p>
                </div>
            </section>

            {/* PHILOSOPHY: THE STACK */}
            <section className="py-32 bg-[#050505] border-y border-white/5">
                <div className="max-w-6xl mx-auto px-6">
                    <ScrollReveal className="mb-20 text-center">
                        <h2 className="text-3xl font-serif text-white mb-4">The Intelligence Stack</h2>
                        <p className="text-white/50">We don't just "do AI." We rebuild the way organizations think, layer by layer.</p>
                    </ScrollReveal>

                    <IntelligenceStack />
                </div>
            </section>

            {/* INTERACTIVE TIMELINE */}
            <section className="relative py-32 bg-[#020202]">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(105,183,178,0.05),transparent)] pointer-events-none" />
                
                <div className="relative z-10 max-w-5xl mx-auto px-6">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 -translate-x-1/2 z-0 hidden md:block" />
                    
                    <TimelineItem 
                        year="2024" 
                        title="The Signal" 
                        desc="Identifying the critical gap: Industrial sectors were drowning in unstructured data while AI was hallucinating poetry. We built the first 'Truth Engine' prototype to anchor LLMs to ground truth."
                        icon={Binary}
                        align="right"
                    />
                    <TimelineItem 
                        year="2025" 
                        title="The Breach" 
                        desc="First major deployment in the energy sector. Our system predicted a grid failure 48 hours in advance using only archived maintenance logs, proving the value of 'dormant data'."
                        icon={Zap}
                        align="left"
                    />
                    <TimelineItem 
                        year="2026" 
                        title="The Network" 
                        desc="Expanded to Healthcare and Logistics. The launch of the 'Walled Garden' architecture allowed secure, air-gapped deployment for government clients requiring zero-trust environments."
                        icon={Network}
                        align="right"
                    />
                    <TimelineItem 
                        year="2027" 
                        title="The Standard" 
                        desc="Infogito becomes the de-facto operating system for regulated industries. Intelligence is no longer a luxury; it is the primary infrastructure for decision making."
                        icon={Shield}
                        align="left"
                        isLast={true}
                    />
                </div>
            </section>

            {/* MANIFESTO GRID */}
            <section className="py-32 border-t border-white/5 bg-[#050505] relative">
                <div className="absolute inset-0 opacity-20 pointer-events-none" 
                    style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
                />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <ScrollReveal className="mb-20 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 mb-4 text-[#69B7B2] font-mono text-xs uppercase tracking-widest">
                            <Target size={14} /> Mission Parameters
                        </div>
                        <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">Core Directives</h2>
                        <p className="text-white/50 max-w-xl">The operating principles hard-coded into our culture.</p>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                        {[
                            { title: "Zero Hallucination", desc: "If the AI doesn't know, it says 'I don't know'. Accuracy over fluency. We build tools for engineers, not poets.", icon: FileText, color: "text-red-400" },
                            { title: "Radical Sovereignty", desc: "Your data never trains our models. It stays in your garden, forever. We sell the engine, not the fuel.", icon: Fingerprint, color: "text-[#69B7B2]" },
                            { title: "Human Command", desc: "AI suggests; Humans decide. We build tools for pilots, not autopilots. Accountability remains with the operator.", icon: User, color: "text-amber-400" }
                        ].map((item, i) => (
                            <ScrollReveal key={i} className={`delay-[${i*200}ms]`}>
                                <div className="h-full bg-[#0a0a0c] border border-white/10 p-10 hover:bg-[#0f0f11] transition-colors group">
                                    <div className={`w-12 h-12 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 mb-8 ${item.color} group-hover:scale-110 transition-transform`}>
                                        <item.icon size={24} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                                    <p className="text-white/50 leading-relaxed text-sm">{item.desc}</p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* TEAM SECTION */}
            <section className="py-32 bg-[#020202] border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <ScrollReveal className="flex justify-between items-end mb-16">
                        <div>
                            <div className="text-[#69B7B2] font-mono text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Users size={12} /> Active Personnel
                            </div>
                            <h2 className="text-4xl font-serif text-white">The Architects</h2>
                        </div>
                        <button className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors group">
                            View Roster <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { name: "Sarah Chen", role: "Chief Systems Architect", prev: "DARPA", code: "SYS_ADMIN_01" },
                            { name: "Marcus Thorne", role: "Head of Security", prev: "NSA", code: "SEC_OPS_LEAD" },
                            { name: "Elena Vos", role: "Product Lead", prev: "SpaceX", code: "PROD_DEV_HEAD" },
                            { name: "David Kim", role: "Research Director", prev: "DeepMind", code: "R&D_DIRECTOR" },
                        ].map((member, i) => (
                            <ScrollReveal key={i} className={`delay-[${i*100}ms]`}>
                                <AgentDossier member={member} />
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOUNDER'S NOTE */}
            <section className="py-32 bg-[#08080a] border-t border-white/5">
                <ScrollReveal className="max-w-4xl mx-auto px-6 text-center">
                    <div className="mb-8 text-6xl text-white/10 font-serif font-bold">"</div>
                    <h3 className="text-3xl md:text-5xl font-serif text-white leading-tight mb-12">
                        We are building the <span className="text-white decoration-1 underline decoration-white/20 underline-offset-8">immune system</span> <br/> for the information age.
                    </h3>
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center border border-white/10 text-white/50">
                            <User size={24} />
                        </div>
                        <div className="text-left">
                            <div className="text-white font-bold text-sm">Alex Mercer</div>
                            <div className="text-white/40 text-xs uppercase tracking-widest font-mono">Founder & CEO</div>
                        </div>
                    </div>
                </ScrollReveal>
            </section>

        </div>
    );
};
