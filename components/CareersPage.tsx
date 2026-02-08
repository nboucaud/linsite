
import React from 'react';
import { NeuralBackground } from './NeuralBackground';
import { ArrowRight, Beaker, Code, Cpu, Globe, Heart, Zap, Sparkles, Mail, Users, BookOpen } from 'lucide-react';
import { SiteFooter } from './SiteFooter';

const VALUES = [
    { icon: Code, title: "Self-Directed", desc: "There is no curriculum and no manager. You decide what you want to learn and how you want to build it." },
    { icon: Users, title: "Generous Peers", desc: "We select for kindness and curiosity. The environment is built on pair programming and shared discovery." },
    { icon: Beaker, title: "Experimental Rigor", desc: "We explore the edges of industrial AI. Failure is encouraged if it leads to a deeper understanding of the system." },
    { icon: Zap, title: "Deep Work", desc: "A sanctuary from commercial pressure. No deadlines, no stand-ups—just long, uninterrupted blocks of focus." }
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
                    Get significantly better <br/> at <span className="text-purple-400 italic">what you do.</span>
                </h1>
                <p className="text-lg text-white/50 max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 leading-relaxed">
                    Infogito Labs is a self-directed research retreat for engineers, designers, and thinkers. 
                    We provide the space, the infrastructure, and the community—you bring the curiosity.
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

            {/* MANIFESTO / EXPLANATION */}
            <div className="max-w-4xl mx-auto px-6 mb-32 space-y-8 text-center md:text-left">
                <h2 className="text-3xl font-serif text-white">Why we built this.</h2>
                <div className="text-white/60 text-lg leading-relaxed space-y-6 font-light">
                    <p>
                        We believe that the best engineering happens when you have the freedom to follow your curiosity down the rabbit hole, without the constraints of product roadmaps or quarterly goals.
                    </p>
                    <p>
                        Infogito Labs is not a bootcamp. We don't have teachers. It is a retreat where experienced builders come to recharge, learn a new stack, write a new language, or solve a problem that has been nagging them for years. It is about the joy of programming and the pursuit of mastery.
                    </p>
                    <p>
                        Whether you are taking a sabbatical, looking to pivot your career into AI, or just want to spend six weeks building something weird with smart, kind people—this is the place for you.
                    </p>
                </div>
            </div>

            {/* APPLY SECTION */}
            <div className="bg-[#08080a] border-y border-white/5 py-32 text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-500/10 text-purple-400 mb-8 ring-1 ring-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                        <BookOpen size={32} />
                    </div>
                    <h2 className="text-4xl font-serif text-white mb-6">Applications are open.</h2>
                    <p className="text-white/50 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
                        We run rolling 6-week and 12-week batches. Admission is free, and we offer grants for underrepresented groups in technology.
                    </p>
                    <a 
                        href="mailto:labs@infogito.com"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs rounded hover:bg-purple-400 transition-colors shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]"
                    >
                        Apply to the Lab <ArrowRight size={16} />
                    </a>
                </div>
            </div>

            <SiteFooter />

        </div>
    );
};
