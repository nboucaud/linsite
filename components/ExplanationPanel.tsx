
import React from 'react';
import { Explanation } from '../lib/explanations';
import { Quote, Sparkles } from 'lucide-react';

interface ExplanationPanelProps {
  lineText: string | null;
  explanations: Explanation[];
  onClose: () => void;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ lineText, explanations, onClose }) => {
  if (!lineText) return null;

  return (
    <div className="fixed top-0 right-0 w-full md:w-[480px] h-full bg-[#0a0a0c]/95 backdrop-blur-3xl z-[150] shadow-[-30px_0_60px_rgba(0,0,0,0.8)] border-l border-white/10 flex flex-col animate-in slide-in-from-right duration-500">
      
      {/* Header / Nav */}
      <div className="flex justify-between items-center p-8 border-b border-white/5 bg-gradient-to-r from-white/5 to-transparent">
        <div className="flex items-center gap-3 text-amber-glow/80">
            <Sparkles size={16} />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Lyric Intelligence</span>
        </div>
        <button 
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/20 text-white/50 hover:text-white transition-all"
        >
            ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-8 md:p-10 space-y-12">
            
            {/* The Subject (Lyric) */}
            <div className="relative group">
                <Quote size={40} className="absolute -top-4 -left-4 text-white/5 rotate-180" />
                <h2 className="relative z-10 text-2xl md:text-3xl font-serif italic text-white/90 leading-tight">
                    "{lineText}"
                </h2>
                <div className="w-12 h-1 bg-amber-glow mt-6 rounded-full opacity-50" />
            </div>

            {/* Analysis Cards */}
            <div className="space-y-6">
                {explanations.map((exp, i) => {
                const Icon = exp.icon;
                return (
                    <div 
                        key={i} 
                        className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.05] transition-colors group/card"
                    >
                        {/* Card Header */}
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-amber-glow/10 border border-amber-glow/20 flex items-center justify-center text-amber-glow group-hover/card:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(251,191,36,0.1)]">
                                {Icon && <Icon size={18} />}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] uppercase tracking-[0.25em] text-white/40 font-bold group-hover/card:text-amber-glow transition-colors">
                                    Category
                                </span>
                                <span className="text-sm font-sans font-bold text-white/90 tracking-wide">
                                    {exp.category}
                                </span>
                            </div>
                        </div>

                        {/* Card Content */}
                        <div className="relative pl-4 border-l border-white/10 group-hover/card:border-amber-glow/30 transition-colors">
                            <p className="text-white/70 font-sans text-sm md:text-base leading-loose tracking-wide">
                                {exp.text}
                            </p>
                        </div>
                    </div>
                );
                })}
            </div>

            {/* Footer decoration */}
            <div className="pt-12 flex justify-center opacity-20">
                <div className="flex gap-2">
                    <div className="w-1 h-1 bg-white rounded-full" />
                    <div className="w-1 h-1 bg-white rounded-full" />
                    <div className="w-1 h-1 bg-white rounded-full" />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
