
import React, { useMemo } from 'react';
import { TrackData } from '../types';
import { X, FileText, BrainCircuit, ScanLine, Microscope, Terminal, Layers, ArrowRight, Hash, Search } from 'lucide-react';

interface InsightArchiveProps {
  track: TrackData;
  onClose: () => void;
}

// Utility to render text with bold markers like **text**
const FormattedText: React.FC<{ text: string }> = ({ text }) => {
    // Safety check: ensure text is a string
    if (typeof text !== 'string') {
        return <span>{String(text || "")}</span>;
    }

    const parts = text.split(/(\*\*.*?\*\*)/g);
    return (
        <span>
            {parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i} className="text-white font-bold text-amber-glow">{part.slice(2, -2)}</strong>;
                }
                return <span key={i}>{part}</span>;
            })}
        </span>
    );
};

export const InsightArchive: React.FC<InsightArchiveProps> = ({ track, onClose }) => {
  const analysis = track.analysis;
  const hasAnalysis = analysis && analysis.nodes && analysis.nodes.length > 0;

  // Scroll to section handler
  const scrollToSection = (id: string) => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-0 md:p-8 animate-in fade-in zoom-in-95 duration-300">
      
      {/* 1. BACKDROP */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl z-0" onClick={onClose} />
      
      {/* 2. MAIN DOSSIER CONTAINER */}
      <div className="relative w-full max-w-[90rem] h-full md:h-[90vh] bg-[#0c0c0e] rounded-none md:rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col z-10">
        
        {/* HEADER TOOLBAR */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 bg-[#08080a]">
            <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-amber-glow/10 rounded flex items-center justify-center text-amber-glow">
                    <BrainCircuit size={18} />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-widest">{track.title}</h2>
                    <span className="text-[10px] text-white/40 font-mono">ARCHIVAL ANALYSIS RECORD</span>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors">
                <X size={20} />
            </button>
        </div>

        {/* CONTENT BODY (Split View) */}
        <div className="flex-1 flex overflow-hidden">
            
            {/* LEFT SIDEBAR (TOC) - Hidden on mobile */}
            <div className="hidden md:flex w-72 flex-col border-r border-white/10 bg-[#08080a] overflow-y-auto custom-scrollbar">
                <div className="p-4">
                    <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4 px-2">Lyrical Breakdown</div>
                    {hasAnalysis && analysis.nodes.map((node, i) => (
                        <button 
                            key={i}
                            onClick={() => scrollToSection(`section-${i}`)}
                            className="w-full text-left p-3 rounded hover:bg-white/5 text-xs text-white/60 hover:text-white transition-colors group flex gap-3 mb-1"
                        >
                            <span className="font-mono text-white/20 group-hover:text-amber-glow">{(i+1).toString().padStart(2, '0')}</span>
                            <span className="truncate">{Array.isArray(node.lyric) ? node.lyric[0] : node.lyric}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* RIGHT MAIN CONTENT */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0c0c0e] relative">
                
                {!hasAnalysis ? (
                    <div className="h-full flex flex-col items-center justify-center text-white/30 gap-4">
                        <Search size={48} />
                        <p className="font-mono text-xs uppercase tracking-widest">No archival data found.</p>
                        <p className="text-xs max-w-md text-center">Ensure the JSON source is correctly mapped in the library.</p>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto p-8 md:p-16 space-y-16">
                        
                        {/* 1. HERO: GAN SYNTHESIS */}
                        {analysis.gan && (
                            <div className="bg-white/5 border border-white/10 rounded-xl p-8 space-y-8">
                                <div className="flex items-center gap-3 text-amber-glow mb-2 border-b border-white/10 pb-4">
                                    <Terminal size={18} />
                                    <span className="text-xs font-bold uppercase tracking-[0.2em]">System Synthesis</span>
                                </div>
                                
                                <div className="grid md:grid-cols-2 gap-12">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-xs font-bold text-green-400 uppercase tracking-widest">
                                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                            Generator Perspective
                                        </div>
                                        <p className="text-sm leading-relaxed text-white/80 font-serif italic">
                                            "{analysis.gan.generator}"
                                        </p>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-widest">
                                            <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                                            Discriminator Perspective
                                        </div>
                                        <p className="text-sm leading-relaxed text-white/80 font-serif italic">
                                            "{analysis.gan.discriminator}"
                                        </p>
                                    </div>
                                </div>

                                {analysis.gan.truth && (
                                    <div className="pt-6 border-t border-white/10 mt-2">
                                        <div className="text-[10px] text-white/40 uppercase tracking-widest mb-2 font-mono">Latent Truth</div>
                                        <p className="text-white text-base leading-relaxed">
                                            <FormattedText text={analysis.gan.truth} />
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 2. NODES LIST */}
                        <div className="space-y-24">
                            {analysis.nodes.map((node, idx) => (
                                <div key={idx} id={`section-${idx}`} className="scroll-mt-24 group">
                                    {/* Lyric Header */}
                                    <div className="flex gap-6 mb-6">
                                        <span className="font-mono text-sm text-white/20 mt-1">{(idx+1).toString().padStart(2, '0')}</span>
                                        <h3 className="text-2xl md:text-3xl font-serif text-white leading-tight italic">
                                            "{Array.isArray(node.lyric) ? node.lyric[0] : node.lyric}"
                                        </h3>
                                    </div>

                                    {/* Content Block */}
                                    <div className="ml-0 md:ml-12 pl-6 border-l border-white/10 space-y-8 group-hover:border-amber-glow/30 transition-colors">
                                        
                                        {/* Surface Meaning */}
                                        <div className="bg-[#1a1a1c] p-6 rounded-lg border border-white/5">
                                            <div className="flex items-center gap-2 mb-2 text-white/40">
                                                <Layers size={14} />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">Surface Translation</span>
                                            </div>
                                            <p className="text-sm md:text-base text-white/80 leading-relaxed">
                                                <FormattedText text={node.surface} />
                                            </p>
                                        </div>

                                        {/* Deep Context Points */}
                                        <div className="space-y-6">
                                            {node.deep.map((item, dIdx) => (
                                                <div key={dIdx} className="flex gap-4 items-start">
                                                    <div className="mt-1 w-6 h-6 rounded bg-amber-glow/10 flex items-center justify-center text-amber-glow flex-shrink-0">
                                                        <Microscope size={12} />
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest block mb-1">
                                                            {item.category}
                                                        </span>
                                                        <p className="text-sm md:text-base text-white/90 leading-relaxed">
                                                            <FormattedText text={item.text} />
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Rhymes (If Available) */}
                                        {node.rhymes && node.rhymes.length > 0 && (
                                            <div className="flex flex-wrap gap-2 pt-4">
                                                {node.rhymes.map((r, rIdx) => (
                                                    <div key={rIdx} className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] font-mono text-white/60 flex items-center gap-2">
                                                        <span>{r.word}</span>
                                                        <span className="text-green-400">{r.score}/10</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* END MARKER */}
                        <div className="flex justify-center pt-24 pb-12 opacity-30">
                            <Hash size={24} />
                        </div>

                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};
