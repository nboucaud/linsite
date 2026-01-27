
import React from 'react';
import { NeuralBackground } from './NeuralBackground';
import { ArrowRight, ChevronRight, Hexagon, Layers, Zap } from 'lucide-react';

interface GenericPageProps {
    title: string;
    subtitle: string;
    category: string;
}

export const GenericPage: React.FC<GenericPageProps> = ({ title, subtitle, category }) => {
    return (
        <div className="relative min-h-screen bg-[#020202] text-white pt-24 font-sans overflow-hidden">
            
            {/* Background */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
                <NeuralBackground colorHex="#69B7B2" speedModifier={0.5} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#020202] via-transparent to-[#020202] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 flex flex-col items-center text-center">
                
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 animate-in slide-in-from-top-4 duration-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#69B7B2] animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">{category}</span>
                </div>

                {/* Title */}
                <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight animate-in zoom-in-95 duration-700 delay-100">
                    {title}
                </h1>

                <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                    {subtitle}
                </p>

                {/* Placeholder Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                    {[
                        { icon: Layers, title: "Deep Integration", desc: "Seamlessly connects with your existing infrastructure." },
                        { icon: Hexagon, title: "Modular Design", desc: "Scale up or down based on your specific operational needs." },
                        { icon: Zap, title: "Real-time Intelligence", desc: "Live data processing for immediate actionable insights." }
                    ].map((card, i) => (
                        <div key={i} className="bg-[#0a0a0c]/80 border border-white/10 p-8 rounded-2xl backdrop-blur-md hover:border-[#69B7B2]/30 transition-colors text-left group">
                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <card.icon className="text-[#69B7B2]" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                            <p className="text-sm text-white/50 leading-relaxed">{card.desc}</p>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-16 flex flex-col md:flex-row gap-4 animate-in fade-in duration-1000 delay-500">
                    <button className="px-8 py-4 bg-[#69B7B2] hover:bg-[#5aa09c] text-black font-bold uppercase tracking-widest text-xs rounded transition-colors shadow-[0_0_20px_rgba(105,183,178,0.4)] flex items-center justify-center gap-2">
                        Get Started <ArrowRight size={16} />
                    </button>
                    <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase tracking-widest text-xs rounded transition-colors flex items-center justify-center gap-2">
                        View Documentation <ChevronRight size={16} />
                    </button>
                </div>

            </div>
        </div>
    );
};
