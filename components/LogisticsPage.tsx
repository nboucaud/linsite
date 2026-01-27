import React from 'react';
import { Truck, Package, Globe, Navigation, FileText, X, ArrowRight, Activity, AlertTriangle, ScanLine, Box, Database, TrendingUp, Layers, CheckCircle2, ShieldCheck, DollarSign, BarChart3, Scale, Clock, EyeOff, ImageIcon, ChevronUp } from 'lucide-react';
import { LogisticsHeroVisualizer } from './LogisticsHeroVisualizer';
import { IndustryNavigationFooter } from './IndustryNavigationFooter';

const FormattedContent: React.FC<{ text: string }> = ({ text }) => {
    if (!text) return null;
    return (
        <div className="space-y-8 font-sans text-xl leading-relaxed text-white/80">
            {text.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="max-w-4xl">
                    {paragraph.split(/(\*\*.*?\*\*)/g).map((part, i) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={i} className="text-white font-medium text-cyan-400 font-sans">{part.slice(2, -2)}</strong>;
                        }
                        return <span key={i}>{part}</span>;
                    })}
                </p>
            ))}
        </div>
    );
};

const STATS = [
    { value: "99.9%", label: "Tracking Accuracy" },
    { value: "-12%", label: "Fuel Consumption" },
    { value: "<1s", label: "Data Latency" }
];

export const LogisticsPage: React.FC = () => {
    return (
        <div className="relative min-h-screen bg-[#020202] text-white pt-24 font-sans overflow-x-hidden selection:bg-[#06b6d4]/30 selection:text-[#06b6d4]">
            
            <section className="relative h-[80vh] min-h-[600px] flex flex-col items-center justify-center overflow-hidden border-b border-white/10">
                <div className="absolute inset-0 z-0">
                    <LogisticsHeroVisualizer />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-[#020202]/80 z-10" />
                
                <div className="relative z-20 max-w-5xl px-6 text-center space-y-8">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">Global Supply Chain</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-serif text-white leading-[0.9] tracking-tighter">
                        Total visibility, <br/>
                        <span className="text-cyan-500 italic">zero lag.</span>
                    </h1>
                    <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed font-light">
                        Real-time orchestration for complex logistical networks.
                    </p>
                </div>
            </section>

            <section className="py-24 bg-[#050505] border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {STATS.map((stat, i) => (
                            <div key={i} className="text-center group">
                                <div className="text-5xl md:text-6xl font-mono font-bold text-white mb-2 tracking-tight group-hover:text-cyan-400 transition-colors">
                                    {stat.value}
                                </div>
                                <div className="text-xs font-bold uppercase tracking-widest text-white/40">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-32 bg-[#020202]">
                <div className="max-w-4xl mx-auto px-6">
                    <FormattedContent text="**Supply chains are fragile.** One missed connection can ripple into millions in losses. We build digital twins of your entire operation, tracking every container, truck, and pallet in real-time.\n\nOur system predicts bottlenecks before they happen. **'Route Optimization'** isn't just about shortest distance; it's about weather, traffic patterns, and port congestion. \n\nWe deliver actionable insights to the dispatch floor, ensuring your goods move as efficiently as your data." />
                </div>
            </section>

            <IndustryNavigationFooter currentId="logistics" />
        </div>
    );
};