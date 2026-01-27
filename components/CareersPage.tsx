
import React from 'react';
import { NeuralBackground } from './NeuralBackground';
import { ArrowRight, Beaker, Code, Cpu, Globe, Heart, Zap, Sparkles, Mail } from 'lucide-react';

const VALUES = [
    { icon: Beaker, title: "Lab Mindset", desc: "We experiment constantly. Failure is just data gathering." },
    { icon: Heart, title: "Earnest Work", desc: "We care deeply about the craft. No cynicism allowed." },
    { icon: Globe, title: "Real Impact", desc: "Our code runs critical infrastructure, not ad networks." },
    { icon: Zap, title: "High Velocity", desc: "Ship fast, learn fast. We deploy to production daily." }
];

export const CareersPage: React.FC = () => {
    return (
        <div className="relative min-h-screen bg-[#020202] text-white pt-24 font-sans overflow-x-hidden">
            
            {/* HERO */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <Sparkles size={12} />
                    <span>Join the Lab</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight animate-in zoom-in-95 duration-700 delay-100">
                    Build the operating system <br/> for the <span className="text-purple-400 italic">real world.</span>
                </h1>
                <p className="text-lg text-white/50 max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                    We're a team of engineers, designers, and researchers obsessed with solving the hardest problems in government and industry.
                </p>
            </div>

            {/* VALUES GRID */}
            <div className="max-w-7xl mx-auto px-6 mb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {VALUES.map((val, i) => (
                        <div key={i} className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl hover:bg-white/[0.05] transition-colors group">
                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white/50 group-hover:text-purple-400 group-hover:scale-110 transition-all mb-6">
                                <val.icon size={24} />
                            </div>
                            <h3 className="font-bold text-white mb-2">{val.title}</h3>
                            <p className="text-sm text-white/50 leading-relaxed">{val.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CONTACT US (Replaces Open Positions) */}
            <div className="bg-[#08080a] border-y border-white/5 py-32 text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-500/10 text-purple-400 mb-8 ring-1 ring-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                        <Mail size={32} />
                    </div>
                    <h2 className="text-4xl font-serif text-white mb-6">We're always looking for talent.</h2>
                    <p className="text-white/50 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
                        We don't post generic job listings. If you're an engineer, designer, or researcher obsessed with industrial complexity, we want to hear from you directly.
                    </p>
                    <a 
                        href="mailto:careers@infogito.com"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs rounded hover:bg-purple-400 transition-colors shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]"
                    >
                        Contact Our Team <ArrowRight size={16} />
                    </a>
                </div>
            </div>

        </div>
    );
};
