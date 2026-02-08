
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { MoveRight, Shield, Lock, UserCheck, ChevronDown, Globe, Box, Mail, Terminal, Building2, Truck, Briefcase, Factory, Activity, ArrowUpRight, ChevronLeft, ChevronRight, Loader2, Server, Key, CheckCircle2, Handshake, Users, ShieldCheck, Target, Database, Cpu, Layers, ArrowRight, Radio, CheckSquare } from 'lucide-react';
import { HeroVisualizer } from './HeroVisualizer'; // Keep Hero synchronous for instant LCP
import { useNavigation } from '../context/NavigationContext';
import { ViewportSlot } from './ViewportSlot';
import { ContactHeroVisualizer } from './ContactHeroVisualizer';
import { PhilosophyHeroVisualizer } from './PhilosophyHeroVisualizer';
import { Recaptcha } from './Recaptcha';

// --- LAZY LOADED COMPONENTS ---
const UseCaseShowcase = React.lazy(() => import('./UseCaseShowcase').then(module => ({ default: module.UseCaseShowcase })));
const FeatureShowcase = React.lazy(() => import('./FeatureShowcase').then(module => ({ default: module.FeatureShowcase })));

// Import Industry Hero Visualizers
import { LogisticsHeroVisualizer } from './LogisticsHeroVisualizer';
import { SmallBusinessHeroVisualizer } from './SmallBusinessHeroVisualizer';
import { IndustrialsHeroVisualizer } from './IndustrialsHeroVisualizer';
import { HealthcareHeroVisualizer } from './HealthcareHeroVisualizer';
import { ResourcesHeroVisualizer } from './ResourcesHeroVisualizer';

const Typewriter: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
    const [display, setDisplay] = useState('');
    useEffect(() => {
        let t = setTimeout(() => {
            let i = 0;
            const interval = setInterval(() => {
                setDisplay(text.substring(0, i + 1));
                i++;
                if (i === text.length) clearInterval(interval);
            }, 40);
            return () => clearInterval(interval);
        }, delay);
        return () => clearTimeout(t);
    }, [text, delay]);
    return <span className="font-serif italic text-white/80">{display}</span>;
};

const INDUSTRIES = [
    {
        id: 'logistics',
        title: "Logistics",
        subtitle: "Global Supply Chain",
        desc: "Operational decisions shaped by real-time movement, accumulated context, and constrained physical systems.",
        path: "our-clients/industries/logistics",
        icon: Truck,
        color: "#06b6d4",
        Visualizer: LogisticsHeroVisualizer
    },
    {
        id: 'smb',
        title: "Business Operations",
        subtitle: "High-Velocity Strategy",
        desc: "Rapid decision cycles and resource allocation for organizations scaling without enterprise overhead.",
        path: "our-clients/industries/smb-operations",
        icon: Briefcase,
        color: "#8b5cf6",
        Visualizer: SmallBusinessHeroVisualizer
    },
    {
        id: 'industrials',
        title: "Industrial Systems",
        subtitle: "Asset Reliability",
        desc: "Stabilizing complex manufacturing operations where reliability, safety, and performance are inseparable.",
        path: "our-clients/industries/industrials",
        icon: Factory,
        color: "#f59e0b",
        Visualizer: IndustrialsHeroVisualizer
    },
    {
        id: 'healthcare',
        title: "Healthcare",
        subtitle: "Clinical Operations",
        desc: "Reducing operational risk, bottlenecks, and compliance overhead in regulated care environments.",
        path: "our-clients/industries/healthcare",
        icon: Activity,
        color: "#14b8a6",
        Visualizer: HealthcareHeroVisualizer
    },
    {
        id: 'resources',
        title: "Natural Resources",
        subtitle: "Physical Constraints",
        desc: "Managing operations defined by geology, long time horizons, and irreversible extraction decisions.",
        path: "our-clients/industries/natural-resources",
        icon: Globe,
        color: "#10b981",
        Visualizer: ResourcesHeroVisualizer
    }
];

// --- CAROUSEL COMPONENT ---
const IndustryCarousel: React.FC = () => {
    const { navigateTo } = useNavigation();
    const [activeIndex, setActiveIndex] = useState(0);
    const count = INDUSTRIES.length;

    const next = () => setActiveIndex((prev) => (prev + 1) % count);
    const prev = () => setActiveIndex((prev) => (prev - 1 + count) % count);

    const activeItem = INDUSTRIES[activeIndex];

    return (
        <div className="relative w-full h-[700px] flex items-center justify-center overflow-hidden">
            
            {/* Dynamic Background */}
            <div 
                className="absolute inset-0 transition-all duration-1000 ease-in-out pointer-events-none"
                style={{
                    background: `radial-gradient(circle at 50% 50%, ${activeItem.color}20, transparent 70%)`
                }}
            />

            {/* Cards Container */}
            <div className="relative w-full max-w-7xl h-full mx-auto">
                {INDUSTRIES.map((item, index) => {
                    let offset = (index - activeIndex);
                    if (offset < -Math.floor(count / 2)) offset += count;
                    if (offset > Math.floor(count / 2)) offset -= count;
                    
                    const isActive = offset === 0;
                    const isVisible = Math.abs(offset) <= 1; // Load active + adjacent

                    if (!isVisible) return null;

                    const zIndex = isActive ? 20 : 10 - Math.abs(offset);
                    const opacity = isActive ? 1 : 0.4;
                    const scale = isActive ? 1 : 0.85;
                    const translateX = offset * 110; 

                    return (
                        <div 
                            key={item.id}
                            className="absolute top-1/2 left-1/2 w-[340px] md:w-[400px] h-[500px] transition-all duration-700 cubic-bezier(0.25, 0.8, 0.25, 1) cursor-pointer"
                            style={{
                                transform: `translate(-50%, -50%) translateX(${translateX}%) scale(${scale})`,
                                zIndex,
                                opacity
                            }}
                            onClick={() => {
                                if (!isActive) {
                                    setActiveIndex(index);
                                } else {
                                    navigateTo(item.path);
                                }
                            }}
                        >
                            <div className="relative w-full h-full rounded-3xl bg-[#0c0c0e] overflow-hidden shadow-2xl group border border-white/10 hover:border-white/20 transition-colors">
                                
                                {/* Visualizer - RENDER IF VISIBLE */}
                                <div className={`absolute inset-0 transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-40 grayscale blur-[1px]'}`}>
                                    {isVisible ? (
                                        <item.Visualizer />
                                    ) : (
                                        <div className="absolute inset-0 bg-black/40" /> 
                                    )}
                                </div>

                                {/* Content Overlay */}
                                <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black via-black/50 to-transparent">
                                    <div className={`transition-all duration-500 transform ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-80'}`}>
                                        <div className="flex items-center gap-3 mb-4 text-[var(--card-color)]" style={{'--card-color': item.color} as any}>
                                            <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                                                <item.icon size={20} />
                                            </div>
                                            <span className="text-xs font-bold uppercase tracking-widest">{item.subtitle}</span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 group-hover:gap-4 transition-all duration-300">
                                            <h3 className="text-3xl md:text-4xl font-serif text-white mb-4 leading-none">{item.title}</h3>
                                            {isActive && (
                                                <div className="mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10 rounded-full p-1">
                                                    <ArrowUpRight size={20} className="text-white" />
                                                </div>
                                            )}
                                        </div>
                                        
                                        <p className="text-sm text-white/70 leading-relaxed mb-8 line-clamp-3">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>

                                {isActive && (
                                    <div 
                                        className="absolute inset-0 rounded-3xl pointer-events-none border-2 border-[var(--card-color)] opacity-50 shadow-[0_0_30px_var(--card-color)] transition-all"
                                        style={{'--card-color': item.color} as any}
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <button onClick={prev} className="absolute left-4 md:left-12 z-30 p-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white backdrop-blur-md transition-all active:scale-95">
                <ChevronLeft size={24} />
            </button>
            <button onClick={next} className="absolute right-4 md:right-12 z-30 p-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white backdrop-blur-md transition-all active:scale-95">
                <ChevronRight size={24} />
            </button>
        </div>
    );
};

const PHILOSOPHY = [
    { title: "Aligned Incentives", desc: "We structure engagements around outcomes, not seat licenses. Our success is tied directly to the operational improvements we deliver.", icon: Handshake, color: "#10b981" },
    { title: "Embedded Engineering", desc: "Our forward-engineers integrate directly with your teams to understand the nuanced language and bottlenecks of your specific operation.", icon: Users, color: "#3b82f6" },
    { title: "Data Sovereignty", desc: "Your data remains your asset. Our architecture ensures that models are trained on your context but deployed within your secure perimeter.", icon: ShieldCheck, color: "#8b5cf6" },
    { title: "Long-Term Reliability", desc: "We build systems designed for decades of service, prioritizing durability and maintainability over short-term feature velocity.", icon: Target, color: "#f59e0b" }
];

const CLIENTS = [
    "Department of Energy", 
    "National Health Service", 
    "Maersk", 
    "Rio Tinto", 
    "FedEx", 
    "Tesla",
    "Shell", 
    "Pfizer", 
    "J.P. Morgan"
];

const MarqueeRow: React.FC = () => (
    <div id="partners" className="w-full bg-[#08080a] border-y border-white/5 py-10 flex flex-col items-center relative overflow-hidden">
        <div className="text-[#69B7B2] font-mono text-[10px] uppercase tracking-widest mb-8 flex items-center gap-2 z-20">
             <Cpu size={12} /> Our Tech Partners
        </div>
        <div className="w-full overflow-hidden flex relative z-10">
            <div className="flex w-max animate-marquee gap-24">
                {[...CLIENTS, ...CLIENTS, ...CLIENTS].map((client, i) => (
                    <div key={i} className="flex items-center gap-3 opacity-40 hover:opacity-100 transition-opacity cursor-default group">
                        <span className="font-serif text-xl text-white group-hover:text-[#69B7B2] transition-colors tracking-wide whitespace-nowrap">{client}</span>
                    </div>
                ))}
            </div>
            {/* Gradients to match container background #08080a */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#08080a] to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#08080a] to-transparent z-10" />
        </div>
    </div>
);

export const LandingPage: React.FC = () => {
    const { navigateTo } = useNavigation();
    
    // --- CONTACT FORM STATE ---
    const [formState, setFormState] = useState<'idle' | 'sending' | 'sent'>('idle');
    const [sector, setSector] = useState('');
    const [otherSector, setOtherSector] = useState('');
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!captchaToken) {
            alert("Please verify you are human.");
            return;
        }
        setFormState('sending');
        setTimeout(() => setFormState('sent'), 2000);
    };

    return (
        <div className="relative min-h-screen bg-[#020202] text-white pt-24 md:pt-28 font-sans overflow-x-hidden selection:bg-[#69B7B2]/30 selection:text-[#69B7B2]">
            <style>
                {`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 60s linear infinite;
                }
                `}
            </style>

            {/* --- HERO SECTION --- */}
            <section className="relative min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-7rem)] w-full flex flex-col items-center justify-center text-center overflow-hidden border-b border-white/10 bg-[#020202]">
                <div className="absolute inset-0 z-0">
                    <HeroVisualizer />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-[#020202]/50 z-10" />
                
                <div className="relative z-20 max-w-6xl px-6 space-y-10">
                    <h1 className="text-5xl md:text-7xl font-serif text-white leading-[0.9] tracking-tighter animate-in zoom-in-95 duration-1000 drop-shadow-2xl">
                        We help organizations locate, understand, and <br/>
                        <span className="text-[#69B7B2] italic">mobilize their knowledge.</span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed font-light animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                        Bridging the gap between complex enterprise data and actionable human insight.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                        <button 
                            onClick={() => navigateTo('contact')}
                            className="px-8 py-4 bg-[#69B7B2] hover:bg-[#5aa09c] text-black font-bold uppercase tracking-widest text-xs rounded transition-all shadow-[0_0_30px_rgba(105,183,178,0.3)] hover:shadow-[0_0_50px_rgba(105,183,178,0.5)] active:scale-95"
                        >
                            Get In Touch
                        </button>
                    </div>
                </div>
                
                <button 
                    onClick={() => document.getElementById('partners')?.scrollIntoView({ behavior: 'smooth' })}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/20 hover:text-white transition-colors animate-bounce z-20 p-2 cursor-pointer"
                >
                    <ChevronDown size={24} />
                </button>
            </section>

            <MarqueeRow />

            {/* --- MANIFESTO SECTION --- */}
            <ViewportSlot minHeight="800px" id="manifesto">
                <section className="relative py-32 bg-black overflow-hidden border-b border-white/10">
                    {/* NEW VISUALIZER: Philosophy (Smooth 3-Phase Animation) */}
                    <div className="absolute inset-0 z-0 bg-[#020202]">
                         <PhilosophyHeroVisualizer />
                         <div className="absolute inset-0 bg-black/60" />
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                            <div className="lg:sticky lg:top-32">
                                <div className="inline-block border-b border-white/20 pb-2 mb-6">
                                    <span className="text-xs font-mono uppercase tracking-widest text-white/60">The Philosophy</span>
                                </div>
                                <h2 className="text-5xl md:text-7xl font-serif text-white leading-tight mb-8">
                                    We operate as a strategic extension of your team.
                                </h2>
                                <p className="text-xl text-white/60 font-light leading-relaxed max-w-lg">
                                    Traditional vendor relationships are transactional. We build operational capabilities that become a permanent part of your infrastructure.
                                </p>
                            </div>

                            <div className="flex flex-col divide-y divide-white/10 border-t border-b border-white/10 bg-black/20 backdrop-blur-sm rounded-xl">
                                {PHILOSOPHY.map((item, i) => (
                                    <div key={i} className="group py-8 px-6 hover:bg-white/5 transition-all duration-300">
                                        <div className="flex items-start gap-6">
                                            <div 
                                                className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-white/40 group-hover:text-white group-hover:scale-110 transition-all duration-300 flex-shrink-0"
                                                style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                                            >
                                                <item.icon size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-serif text-white mb-2 group-hover:text-[var(--hover-color)] transition-colors" style={{ '--hover-color': item.color } as React.CSSProperties}>
                                                    {item.title}
                                                </h3>
                                                <p className="text-white/50 text-base leading-relaxed font-light group-hover:text-white/80 transition-colors">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </ViewportSlot>

            {/* --- INDUSTRY CAROUSEL SECTION --- */}
            <ViewportSlot minHeight="800px">
                <section className="py-32 bg-[#08080a] border-t border-white/5 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                            <div>
                                <div className="text-[#69B7B2] font-mono text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Layers size={12} /> Deployment Sectors
                                </div>
                                <h2 className="text-4xl md:text-5xl font-serif text-white">Active Verticals</h2>
                            </div>
                        </div>

                        <IndustryCarousel />
                    </div>
                </section>
            </ViewportSlot>

            {/* LAZY LOAD HEAVY COMPONENTS */}
            <Suspense fallback={<div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-white/20"/></div>}>
                <UseCaseShowcase />
            </Suspense>

            <Suspense fallback={<div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-white/20"/></div>}>
                <FeatureShowcase />
            </Suspense>

            {/* --- CONTACT SECTION (INTEGRATED) --- */}
            <section className="relative py-32 bg-[#020202] border-t border-white/5 overflow-hidden">
                {/* Visualizer Background (Scoped) */}
                <div className="absolute inset-0 z-0">
                    <ContactHeroVisualizer />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#020202] via-[#020202]/90 to-transparent" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-20 items-center">
                    
                    {/* LEFT: Context & Offices */}
                    <div className="w-full lg:w-1/2 space-y-16">
                        <div className="animate-in slide-in-from-left duration-700">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#69B7B2]/10 border border-[#69B7B2]/20 text-[#69B7B2] text-[10px] font-bold uppercase tracking-widest mb-8 backdrop-blur-sm">
                                <Radio size={12} className="animate-pulse" />
                                <span>Contact Us</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-serif text-white mb-8 leading-[0.9] tracking-tighter drop-shadow-2xl">
                                Get In <br/>
                                <span className="text-[#69B7B2] italic">Touch.</span>
                            </h1>
                            <p className="text-xl text-white/70 leading-relaxed max-w-lg font-light border-l border-white/20 pl-6 drop-shadow-lg">
                                Conversations start here — whether you’re exploring ideas, partnerships, or practical questions. It all starts with a conversation.
                            </p>
                        </div>

                        {/* MAIN HQ CARD */}
                        <div className="animate-in slide-in-from-bottom-8 duration-700 delay-100">
                            <div className="relative group overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-[#0c0c0e]/80 backdrop-blur-md">
                                {/* Card Background Decoration */}
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
                                
                                <div className="relative p-10 flex items-start justify-between z-10">
                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                                            <span className="text-[10px] font-mono text-green-500 uppercase tracking-widest">Headquarters</span>
                                        </div>
                                        <h3 className="text-3xl font-serif text-white mb-2">New York City</h3>
                                        <p className="text-white/60 text-sm mb-6 max-w-[200px] leading-relaxed">
                                            New York, NY
                                        </p>
                                        
                                        <div className="flex flex-col gap-3">
                                            <a href="mailto:connect@infogito.com" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group/link">
                                                <div className="p-1.5 bg-white/10 rounded text-[#69B7B2] group-hover/link:bg-[#69B7B2] group-hover/link:text-black transition-all">
                                                    <Mail size={14} />
                                                </div>
                                                <span className="text-sm font-mono">connect@infogito.com</span>
                                            </a>
                                        </div>
                                    </div>

                                    <div className="hidden md:flex w-24 h-24 bg-[#69B7B2]/10 rounded-2xl items-center justify-center border border-[#69B7B2]/20 backdrop-blur-md overflow-hidden p-4">
                                        <img 
                                            src="https://jar5gzlwdkvsnpqa.public.blob.vercel-storage.com/Gito%20AI%20%283%29.webp" 
                                            alt="Gito AI" 
                                            className="w-full h-full object-contain opacity-80"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: The Form */}
                    <div className="w-full lg:w-1/2 animate-in fade-in slide-in-from-right duration-700 delay-300">
                        <div className="relative rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden group border border-white/10 bg-[#0c0c0e]/90 backdrop-blur-xl">
                            
                            {/* Static Background Pattern */}
                            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                                 style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
                            />

                            {formState === 'sent' ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0c0c0e]/95 backdrop-blur-xl animate-in fade-in duration-500 z-20">
                                    <div className="w-24 h-24 bg-[#69B7B2]/10 rounded-full flex items-center justify-center text-[#69B7B2] mb-8 border border-[#69B7B2]/20 shadow-[0_0_30px_rgba(105,183,178,0.2)]">
                                        <CheckCircle2 size={48} />
                                    </div>
                                    <h3 className="text-3xl font-serif text-white mb-2">Message Sent</h3>
                                    <p className="text-white/50 text-sm max-w-xs text-center leading-relaxed">
                                        Your message has been logged. An engineer will get back to you shortly.
                                    </p>
                                    <button 
                                        onClick={() => setFormState('idle')}
                                        className="mt-12 text-xs font-bold uppercase tracking-widest text-[#69B7B2] hover:text-white transition-colors flex items-center gap-2"
                                    >
                                        <Globe size={14} /> Send Another
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2 group/field">
                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 group-focus-within/field:text-[#69B7B2] transition-colors">First Name</label>
                                                <input type="text" required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#69B7B2] focus:bg-black/60 transition-all placeholder:text-white/20 font-sans backdrop-blur-sm" placeholder="Jane" />
                                            </div>
                                            <div className="space-y-2 group/field">
                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 group-focus-within/field:text-[#69B7B2] transition-colors">Last Name</label>
                                                <input type="text" required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#69B7B2] focus:bg-black/60 transition-all placeholder:text-white/20 font-sans backdrop-blur-sm" placeholder="Doe" />
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2 group/field">
                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 group-focus-within/field:text-[#69B7B2] transition-colors">Any Email</label>
                                            <input type="email" required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#69B7B2] focus:bg-black/60 transition-all placeholder:text-white/20 font-sans backdrop-blur-sm" placeholder="jane@company.com" />
                                        </div>

                                        <div className="space-y-2 group/field">
                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 group-focus-within/field:text-[#69B7B2] transition-colors">How can we help?</label>
                                            <div className="relative">
                                                <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#69B7B2] focus:bg-black/60 transition-all appearance-none cursor-pointer font-sans backdrop-blur-sm">
                                                    <option className="bg-[#0a0a0c]">General Question / Conversation</option>
                                                    <option className="bg-[#0a0a0c]">Exploring Ideas or Use Cases</option>
                                                    <option className="bg-[#0a0a0c]">Research or Collaboration</option>
                                                    <option className="bg-[#0a0a0c]">Pilot or Proof of Concept</option>
                                                    <option className="bg-[#0a0a0c]">Platform Questions</option>
                                                    <option className="bg-[#0a0a0c]">Speaking, Advisory, or Writing</option>
                                                    <option className="bg-[#0a0a0c]">Careers</option>
                                                    <option className="bg-[#0a0a0c]">Something Else</option>
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
                                                    <ChevronDown size={14} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2 group/field">
                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 group-focus-within/field:text-[#69B7B2] transition-colors">What sector best describes your work? (optional)</label>
                                            <div className="relative">
                                                <select 
                                                    value={sector}
                                                    onChange={(e) => setSector(e.target.value)}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#69B7B2] focus:bg-black/60 transition-all appearance-none cursor-pointer font-sans backdrop-blur-sm"
                                                >
                                                    <option className="bg-[#0a0a0c]" value="">Select Sector...</option>
                                                    <option className="bg-[#0a0a0c]">Public Sector / Government</option>
                                                    <option className="bg-[#0a0a0c]">Education & Research</option>
                                                    <option className="bg-[#0a0a0c]">Healthcare & Life Sciences</option>
                                                    <option className="bg-[#0a0a0c]">Nonprofit / Social Impact</option>
                                                    <option className="bg-[#0a0a0c]">Technology / Software</option>
                                                    <option className="bg-[#0a0a0c]">Industrial, Infrastructure & Natural Resources</option>
                                                    <option className="bg-[#0a0a0c]">Finance & Professional Services</option>
                                                    <option className="bg-[#0a0a0c]">Media, Arts & Creative</option>
                                                    <option className="bg-[#0a0a0c]">Hospitality & Tourism</option>
                                                    <option className="bg-[#0a0a0c]">Prefer Not To Say</option>
                                                    <option className="bg-[#0a0a0c]">Other</option>
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
                                                    <ChevronDown size={14} />
                                                </div>
                                            </div>
                                        </div>

                                        {sector === 'Other' && (
                                            <div className="space-y-2 group/field animate-in fade-in slide-in-from-top-2">
                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 group-focus-within/field:text-[#69B7B2] transition-colors">Please Specify</label>
                                                <input 
                                                    type="text" 
                                                    value={otherSector} 
                                                    onChange={(e) => setOtherSector(e.target.value)}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#69B7B2] focus:bg-black/60 transition-all placeholder:text-white/20 font-sans backdrop-blur-sm" 
                                                    placeholder="Your sector..." 
                                                />
                                            </div>
                                        )}

                                        <div className="space-y-2 group/field">
                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 group-focus-within/field:text-[#69B7B2] transition-colors">Tell Us About Yourself.</label>
                                            <textarea rows={4} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#69B7B2] focus:bg-black/60 transition-all resize-none placeholder:text-white/20 font-sans backdrop-blur-sm" placeholder="Tell us about your needs..." />
                                        </div>

                                        {/* RECAPTCHA */}
                                        <div className="pt-2">
                                            <Recaptcha onChange={setCaptchaToken} theme="dark" />
                                        </div>
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={formState === 'sending' || !captchaToken}
                                        className="w-full bg-[#69B7B2] hover:bg-[#5aa09c] text-black font-bold uppercase tracking-widest text-xs py-5 rounded-xl transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(105,183,178,0.2)] hover:shadow-[0_0_50px_rgba(105,183,178,0.4)] disabled:opacity-50 disabled:cursor-not-allowed group/btn relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                                        <span className="relative z-10 flex items-center gap-3">
                                            {formState === 'sending' ? (
                                                <>Sending Message...</>
                                            ) : (
                                                <>
                                                    Get In Touch 
                                                    <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </span>
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <footer className="bg-black border-t border-white/10 pt-16 pb-8 text-sm">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center opacity-50">
                    <div className="mb-4 md:mb-0">
                        <img src="https://uapriywlkpcpupdp.public.blob.vercel-storage.com/brand_logo_infogito.webp" alt="Infogito" className="h-6 w-auto grayscale" />
                    </div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-white/50">
                        © 2026 Infogito LLC. All Rights Reserved.
                    </div>
                </div>
            </footer>

        </div>
    );
};
