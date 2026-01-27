import React from 'react';
import { ShieldAlert, Factory, HardHat, FileWarning, Search, CheckCircle2, ArrowRight, X, Gauge, Activity, Radio, Cpu, Crosshair, Zap, AlertTriangle, Users, Network, ScanLine, Database, ImageIcon, ChevronUp } from 'lucide-react';
import { IndustrialsHeroVisualizer } from './IndustrialsHeroVisualizer';
import { IndustryNavigationFooter } from './IndustryNavigationFooter';

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

const STATS = [
    { value: "-40%", label: "Unplanned Downtime" },
    { value: "500+", label: "Assets Connected" },
    { value: "0", label: "Critical Failures" }
];

export const IndustrialsPage: React.FC = () => {
    return (
        <div className="relative min-h-screen bg-[#020202] text-white pt-24 font-sans overflow-x-hidden selection:bg-[#f59e0b]/30 selection:text-[#f59e0b]">
            
            <section className="relative h-[80vh] min-h-[600px] flex flex-col items-center justify-center overflow-hidden border-b border-white/10">
                <div className="absolute inset-0 z-0">
                    <IndustrialsHeroVisualizer />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-[#020202]/80 z-10" />
                
                <div className="relative z-20 max-w-5xl px-6 text-center space-y-8">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 backdrop-blur-md">
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">Heavy Industry</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-serif text-white leading-[0.9] tracking-tighter">
                        Power through <br/>
                        <span className="text-amber-500 italic">complexity.</span>
                    </h1>
                    <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed font-light">
                        Stabilizing complex industrial operations where reliability is paramount.
                    </p>
                </div>
            </section>

            <section className="py-24 bg-[#050505] border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {STATS.map((stat, i) => (
                            <div key={i} className="text-center group">
                                <div className="text-5xl md:text-6xl font-mono font-bold text-white mb-2 tracking-tight group-hover:text-amber-400 transition-colors">
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
                    <FormattedContent text="**Downtime is expensive.** In heavy industry, reliability is not optional. We deploy **Predictive Maintenance** models that analyze vibration, heat, and output data to detect failures days before they happen.\n\nOur systems are built for the **edge**, running locally on factory floors with poor connectivity. We integrate with legacy SCADA systems and modern IoT sensors alike.\n\nEnsure **worker safety** and **asset longevity** with intelligence that never sleeps." />
                </div>
            </section>

            <IndustryNavigationFooter currentId="industrials" />
        </div>
    );
};