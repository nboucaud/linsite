import React from 'react';
import { 
    Zap, Compass, LineChart, Puzzle, 
    Scale, Database, AlertTriangle, ShieldAlert, Bot, Rocket,
    ArrowRight, X, ScanLine, Target, Microscope, ImageIcon, ChevronUp, ChevronDown
} from 'lucide-react';
import { SmallBusinessHeroVisualizer } from './SmallBusinessHeroVisualizer';
import { IndustryNavigationFooter } from './IndustryNavigationFooter';

const FormattedContent: React.FC<{ text: string }> = ({ text }) => {
    if (!text) return null;
    return (
        <div className="space-y-8 font-sans text-xl leading-relaxed text-white/80">
            {text.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="max-w-4xl">
                    {paragraph.split(/(\*\*.*?\*\*)/g).map((part, i) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={i} className="text-white font-medium text-purple-400 font-sans">{part.slice(2, -2)}</strong>;
                        }
                        return <span key={i}>{part}</span>;
                    })}
                </p>
            ))}
        </div>
    );
};

const STATS = [
    { value: "29%", label: "Reduction in OpEx" },
    { value: "1.5x", label: "Faster Decision Cycles" },
    { value: "0", label: "Additional Headcount" }
];

export const SmallBusinessPage: React.FC = () => {
    return (
        <div className="relative min-h-screen bg-[#020202] text-white pt-24 font-sans overflow-x-hidden selection:bg-[#8b5cf6]/30 selection:text-[#8b5cf6]">
            
            {/* HERO */}
            <section className="relative h-[80vh] min-h-[600px] flex flex-col items-center justify-center overflow-hidden border-b border-white/10">
                <div className="absolute inset-0 z-0">
                    <SmallBusinessHeroVisualizer />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-[#020202]/80 z-10" />
                
                <div className="relative z-20 max-w-5xl px-6 text-center space-y-8">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-md">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-400">SMB Operations</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-serif text-white leading-[0.9] tracking-tighter">
                        Scale without <br/>
                        <span className="text-purple-500 italic">the bloat.</span>
                    </h1>
                    <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed font-light">
                        Enterprise-grade intelligence tools, Rightsized for agile teams.
                    </p>
                </div>
            </section>

            {/* STATS */}
            <section className="py-24 bg-[#050505] border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {STATS.map((stat, i) => (
                            <div key={i} className="text-center group">
                                <div className="text-5xl md:text-6xl font-mono font-bold text-white mb-2 tracking-tight group-hover:text-purple-400 transition-colors">
                                    {stat.value}
                                </div>
                                <div className="text-xs font-bold uppercase tracking-widest text-white/40">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CONTENT */}
            <section className="py-32 bg-[#020202]">
                <div className="max-w-4xl mx-auto px-6">
                    <FormattedContent text="**Small teams move fast.** But they often lack the data infrastructure to make decisions with the same fidelity as their enterprise competitors.\n\nWe provide a **'Fractional Data Science'** model. Instead of hiring a team of engineers, you plug into our platform. We unify your fragmented tools—CRM, Accounting, Project Management—into a single **Knowledge Graph**.\n\nThis allows you to ask complex questions like **'Which marketing channel has the highest lifetime value?'** or **'Where is our cash flow bottleneck?'** without touching a spreadsheet." />
                </div>
            </section>

            <IndustryNavigationFooter currentId="smb" />
        </div>
    );
};