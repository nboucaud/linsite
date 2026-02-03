
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { MoveRight, Shield, Lock, UserCheck, ChevronDown, Globe, Box, Mail, Terminal, Building2, Truck, Briefcase, Factory, Activity, ArrowUpRight, ChevronLeft, ChevronRight, Loader2, Server, Key, CheckCircle2, Handshake, Users, ShieldCheck, Target, Database, Cpu, Layers, ArrowRight } from 'lucide-react';
import { HeroVisualizer } from './HeroVisualizer'; // Keep Hero synchronous for instant LCP
import { useNavigation } from '../context/NavigationContext';
import { ViewportSlot } from './ViewportSlot';
import { ContactHeroVisualizer } from './ContactHeroVisualizer';

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
        title: "SMB Operations",
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
                                if (!isActive) setActiveIndex(index);
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
                                        
                                        <h3 className="text-3xl md:text-4xl font-serif text-white mb-4 leading-none">{item.title}</h3>
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

const IMPACT_METRICS = [
    { label: "Assets Optimized", value: "$42B+", icon: Database },
    { label: "Uptime Maintained", value: "99.9%", icon: Activity },
    { label: "Decisions Supported", value: "1.2M/day", icon: Cpu },
    { label: "Security Incidents", value: "0", icon: ShieldCheck },
];

const PARTNER_CODES = [
    "DOE_GRID_SECURE", "NHS_CLINICAL_OPS", "MAERSK_LOG_AI", 
    "RIO_MINING_AUTO", "FEDEX_SORT_OPT", "TESLA_MFG_FLOW",
    "SHELL_ASSET_INT", "PFIZER_COMP_TRK", "JP_MORGAN_RISK"
];

const MarqueeRow: React.FC = () => (
    <div className="w-full overflow-hidden bg-[#08080a] border-y border-white/5 py-6 flex relative">
        <div className="flex w-max animate-marquee gap-16">
            {[...PARTNER_CODES, ...PARTNER_CODES].map((code, i) => (
                <div key={i} className="flex items-center gap-3 opacity-30 hover:opacity-100 transition-opacity cursor-default group">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="font-mono text-xs tracking-[0.2em] text-white group-hover:text-[#69B7B2]">{code}</span>
                </div>
            ))}
        </div>
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#020202] to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#020202] to-transparent z-10" />
    </div>
);

export const LandingPage: React.FC = () => {
    const { navigateTo } = useNavigation();

    return (
        <div className="relative min-h-screen bg-[#020202] text-white pt-24 font-sans overflow-x-hidden selection:bg-[#69B7B2]/30 selection:text-[#69B7B2]">
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
            <section className="relative h-[90vh] w-full flex flex-col items-center justify-center text-center overflow-hidden border-b border-white/10 bg-[#020202]">
                <div className="absolute inset-0 z-0">
                    <HeroVisualizer />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-[#020202]/50 z-10" />
                
                <div className="relative z-20 max-w-6xl px-6 space-y-10">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[#69B7B2]/30 bg-[#69B7B2]/10 backdrop-blur-md animate-in slide-in-from-top-8 duration-1000 shadow-[0_0_20px_rgba(105,183,178,0.2)]">
                        <div className="w-2 h-2 bg-[#69B7B2] rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#69B7B2]">Global Operations Network</span>
                    </div>

                    {/* REDUCED HERO TEXT SIZE */}
                    <h1 className="text-5xl md:text-7xl font-serif text-white leading-[0.9] tracking-tighter animate-in zoom-in-95 duration-1000 drop-shadow-2xl">
                        Intelligence for <br/>
                        <span className="text-[#69B7B2] italic">The Physical World.</span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed font-light animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                        Bridging the gap between complex enterprise data and actionable human insight.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                        <button 
                            onClick={() => document.getElementById('manifesto')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-8 py-4 bg-[#69B7B2] hover:bg-[#5aa09c] text-black font-bold uppercase tracking-widest text-xs rounded transition-all shadow-[0_0_30px_rgba(105,183,178,0.3)] hover:shadow-[0_0_50px_rgba(105,183,178,0.5)] active:scale-95"
                        >
                            Explore Platform
                        </button>
                    </div>
                </div>
                
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/20 animate-bounce z-20">
                    <ChevronDown size={24} />
                </div>
            </section>

            <MarqueeRow />

            <section className="py-24 bg-[#050505] border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {IMPACT_METRICS.map((metric, i) => (
                            <div key={i} className="text-center group cursor-default">
                                <div className="w-16 h-16 bg-[#0a0a0c] border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:border-[#69B7B2]/30 group-hover:text-[#69B7B2] transition-colors shadow-lg">
                                    <metric.icon size={32} strokeWidth={1} />
                                </div>
                                <div className="text-4xl md:text-5xl font-mono font-bold text-white mb-2 tracking-tight group-hover:scale-110 transition-transform duration-500">{metric.value}</div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">{metric.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- MANIFESTO SECTION --- */}
            <ViewportSlot minHeight="800px" id="manifesto">
                <section className="relative py-32 bg-black overflow-hidden border-b border-white/10">
                    {/* Updated to use new Shared Visualizer instead of WebGL Shader */}
                    <div className="absolute inset-0 z-0 bg-[#020202]">
                         <ContactHeroVisualizer />
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

            <section className="py-32 bg-[#020202] border-t border-white/5 text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="w-20 h-20 mx-auto bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/50 mb-8 animate-pulse">
                        <Terminal size={32} />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif text-white mb-8">Ready to initiate?</h2>
                    <p className="text-white/60 text-lg mb-12 max-w-xl mx-auto">
                        Let's discuss how we can deploy our infrastructure into your operations.
                    </p>
                    <button 
                        onClick={() => navigateTo('contact')}
                        className="px-12 py-5 bg-[#69B7B2] hover:bg-[#5aa09c] text-black font-bold uppercase tracking-widest text-xs rounded-full transition-colors shadow-[0_0_30px_rgba(105,183,178,0.3)] hover:shadow-[0_0_50px_rgba(105,183,178,0.5)] hover:scale-105 transform duration-300"
                    >
                        Start the Conversation
                    </button>
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
