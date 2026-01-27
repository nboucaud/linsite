
import React, { useState } from 'react';
import { useProgression } from '../context/ProgressionContext';
import { TRACK_STORIES, LORE_BIBLE } from '../lib/chapter-data';
import { TRACKS } from '../lib/data';
import { X, FileText, Lock, Fingerprint, Book, File } from 'lucide-react';

export const StoryArchive: React.FC = () => {
  const { viewingArchiveId, closeArchive } = useProgression();
  const [activeTab, setActiveTab] = useState<'track' | 'thesis'>('track');
  
  if (!viewingArchiveId) return null;

  const track = TRACKS.find(t => t.id === viewingArchiveId);
  const storyData = TRACK_STORIES[viewingArchiveId] || TRACK_STORIES['default'];

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 md:p-8 animate-in fade-in zoom-in duration-300">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={closeArchive} />
      
      <div className="relative w-full max-w-3xl bg-[#0a0a0c] border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header (Folder Tab Style) */}
        <div className="bg-white/5 border-b border-white/5 p-6 flex justify-between items-start">
            <div className="flex gap-4">
                <div className="w-12 h-12 bg-amber-glow/10 border border-amber-glow/20 rounded flex items-center justify-center text-amber-glow">
                    <FileText size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-serif text-white/90 tracking-wide">{storyData.title}</h2>
                    <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">{viewingArchiveId}</span>
                        <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-500 text-[9px] font-bold uppercase tracking-wider border border-green-500/20">Decrypted</span>
                    </div>
                </div>
            </div>
            <button onClick={closeArchive} className="text-white/30 hover:text-white transition-colors">
                <X size={24} />
            </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/5 bg-black/20">
            <button 
                onClick={() => setActiveTab('track')}
                className={`flex-1 py-3 text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'track' ? 'bg-white/5 text-white' : 'text-white/30 hover:bg-white/5'}`}
            >
                <File size={14} /> Mission Log
            </button>
            <button 
                onClick={() => setActiveTab('thesis')}
                className={`flex-1 py-3 text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'thesis' ? 'bg-white/5 text-amber-glow' : 'text-white/30 hover:bg-white/5'}`}
            >
                <Book size={14} /> The Thesis
            </button>
        </div>

        {/* Content (Typewriter/Document Style) */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
            
            {activeTab === 'track' ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {storyData.segments.map((segment, i) => (
                        <div key={i} className="relative pl-6 border-l border-white/10 group">
                            <span className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-[#1a1a1a] border border-white/10 group-hover:border-amber-glow/50 transition-colors" />
                            <p className="font-serif text-lg leading-relaxed text-white/80">
                                {segment}
                            </p>
                        </div>
                    ))}
                    <div className="mt-16 pt-8 border-t border-white/5 flex justify-between items-end opacity-50">
                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] uppercase tracking-widest text-white/30">Associated Audio Asset</span>
                            <span className="text-xs font-bold text-white/60">{(track?.title || 'UNKNOWN').toUpperCase()}</span>
                        </div>
                        <Fingerprint size={32} className="text-white/10" />
                    </div>
                </div>
            ) : (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {/* Header */}
                    <div className="text-center space-y-4 border-b border-white/10 pb-8">
                        <h1 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight">{LORE_BIBLE.title}</h1>
                        <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-amber-glow">{LORE_BIBLE.subtitle}</h2>
                        <p className="text-sm text-white/60 italic leading-relaxed max-w-xl mx-auto">"{LORE_BIBLE.abstract}"</p>
                    </div>

                    {/* Character Grid */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white/5 p-6 rounded-lg border border-white/5">
                            <div className="text-xs font-bold text-green-400 uppercase tracking-widest mb-4">CAREY YUAN</div>
                            <div className="space-y-4 text-sm text-white/70">
                                <p><strong className="text-white">Role:</strong> {LORE_BIBLE.carey.role}</p>
                                <p>{LORE_BIBLE.carey.philosophy}</p>
                                <p className="text-xs opacity-50 italic">Fatal Flaw: {LORE_BIBLE.carey.flaw}</p>
                            </div>
                        </div>
                        <div className="bg-white/5 p-6 rounded-lg border border-white/5">
                            <div className="text-xs font-bold text-red-400 uppercase tracking-widest mb-4">VICTOR YUAN</div>
                            <div className="space-y-4 text-sm text-white/70">
                                <p><strong className="text-white">Role:</strong> {LORE_BIBLE.victor.role}</p>
                                <p>{LORE_BIBLE.victor.philosophy}</p>
                                <p className="text-xs opacity-50 italic">Fatal Flaw: {LORE_BIBLE.victor.flaw}</p>
                            </div>
                        </div>
                    </div>

                    {/* Phases Summary */}
                    <div className="space-y-6">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 border-b border-white/5 pb-2">Narrative Progression</h3>
                        <div className="space-y-4 text-sm text-white/60">
                            <p><strong className="text-white">Phase I:</strong> The Manic Rise. Delusion of rewriting reality. (Victor, Momentum)</p>
                            <p><strong className="text-white">Phase II:</strong> The Breakdown. Reality hits. Exploitation of kindness. (Lender, Broadripple)</p>
                            <p><strong className="text-white">Phase III:</strong> The Tragedy. Defensive vacuum. Suffocation. (World in a Jar, Gloom)</p>
                            <p><strong className="text-white">Phase IV:</strong> The Synthesis. Clarity. Sincerity as survival. (Sincere Writer)</p>
                        </div>
                    </div>
                </div>
            )}

        </div>

      </div>
    </div>
  );
};
