import React from 'react';
import { Pickaxe, Droplets, Zap, Flame, Globe, AlertTriangle, ArrowRight, X, ScanLine, Activity, Mountain, Wind, Cpu, Layers, ImageIcon, ChevronUp } from 'lucide-react';
import { ResourcesHeroVisualizer } from './ResourcesHeroVisualizer';
import { IndustryNavigationFooter } from './IndustryNavigationFooter';

const FormattedContent: React.FC<{ text: string }> = ({ text }) => {
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

const STATS = [
    { value: "+15%", label: "Yield Increase" },
    { value: "Real-time", label: "Geology Analysis" },
    { value: "100%", label: "ESG Tracking" }
];

export const NaturalResourcesPage: React.FC = () => {
    return (
        <div className="relative min-h-screen bg-[#020202] text-white pt-24 font-sans overflow-x-hidden selection:bg-[#10b981]/30 selection:text-[#10b981]">
            
            <section className="relative h-[80vh] min-h-[600px] flex flex-col items-center justify-center overflow-hidden border-b border-white/10">
                <div className="absolute inset-0 z-0">
                    <ResourcesHeroVisualizer />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-[#020202]/80 z-10" />
                
                <div className="relative z-20 max-w-5xl px-6 text-center space-y-8">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">Energy & Mining</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-serif text-white leading-[0.9] tracking-tighter">
                        Unearthed <br/>
                        <span className="text-emerald-500 italic">efficiency.</span>
                    </h1>
                    <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed font-light">
                        Operations defined by physical constraints and long time horizons.
                    </p>
                </div>
            </section>

            <section className="py-24 bg-[#050505] border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {STATS.map((stat, i) => (
                            <div key={i} className="text-center group">
                                <div className="text-5xl md:text-6xl font-mono font-bold text-white mb-2 tracking-tight group-hover:text-emerald-400 transition-colors">
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
                    <FormattedContent text="**Extraction is irreversible.** Decisions made today affect yield for decades. We use **AI-driven geological modeling** to optimize extraction paths and minimize waste.\n\nOur platform integrates **sustainability metrics** directly into operational dashboards, ensuring ESG compliance isn't an afterthought but a core driver.\n\nFrom **remote rig monitoring** to **grid load balancing**, we bring digital precision to the physical world." />
                </div>
            </section>

            <IndustryNavigationFooter currentId="resources" />
        </div>
    );
};