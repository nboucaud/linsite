
import React, { useState, useMemo } from 'react';
import { useAudio } from '../context/AudioContext';
import { TRACKS } from '../lib/data';
import { X, User, Mail, ArrowRight, Disc, Radio, Fingerprint, Activity, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { NeuralBackground } from './NeuralBackground';

export const AboutMe: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { selectTrack, currentTrackId, isPlaying } = useAudio();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [mediaIndex, setMediaIndex] = useState(0);

  // Get The Mantra track data
  const mantraTrack = useMemo(() => TRACKS.find(t => t.id === 'track-mantra'), []);
  const mediaItems = mantraTrack?.media || [];
  
  // Handlers for media cycling
  const nextMedia = (e: React.MouseEvent) => {
      e.stopPropagation();
      setMediaIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const prevMedia = (e: React.MouseEvent) => {
      e.stopPropagation();
      setMediaIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  const currentMedia = mediaItems[mediaIndex];

  const handleSubscribe = (e: React.FormEvent) => {
      e.preventDefault();
      setSubscribed(true);
      setTimeout(() => {
          setEmail('');
          setSubscribed(false);
      }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-[#050505] text-[#e0e0e0] animate-in fade-in duration-500 flex flex-col md:flex-row overflow-hidden font-sans">
        
        {/* Background Ambience */}
        <div className="absolute inset-0 opacity-20 pointer-events-none z-0">
            <NeuralBackground inverted={false} />
        </div>

        {/* Close Button */}
        <button 
            onClick={onClose} 
            className="absolute top-6 right-6 md:top-8 md:right-8 z-50 p-4 text-white/30 hover:text-white transition-colors hover:rotate-90 duration-300"
        >
            <X size={24} />
        </button>

        {/* LEFT COLUMN: VISUAL IDENTITY & MEDIA CYCLER */}
        <div className="relative w-full md:w-1/2 h-[40vh] md:h-full border-r border-white/10 overflow-hidden group">
            <div className="absolute inset-0 bg-amber-glow/10 mix-blend-overlay z-10 pointer-events-none" />
            
            {/* Active Media Item */}
            {currentMedia?.type === 'video' ? (
                <video 
                    src={currentMedia.url} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-[2s] scale-105 group-hover:scale-100"
                />
            ) : (
                <img 
                    src={currentMedia?.url} 
                    className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-[2s] scale-105 group-hover:scale-100"
                    alt="The Mantra Asset"
                />
            )}
            
            {/* Cycling Controls (Visible on Hover) */}
            {mediaItems.length > 1 && (
                <>
                    <button 
                        onClick={prevMedia}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 hover:bg-black/60 text-white/30 hover:text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button 
                        onClick={nextMedia}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 hover:bg-black/60 text-white/30 hover:text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                        <ChevronRight size={24} />
                    </button>
                    {/* Dots */}
                    <div className="absolute top-8 left-0 right-0 flex justify-center gap-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {mediaItems.map((_, idx) => (
                            <div key={idx} className={`w-1.5 h-1.5 rounded-full ${idx === mediaIndex ? 'bg-amber-glow' : 'bg-white/30'}`} />
                        ))}
                    </div>
                </>
            )}

            {/* Overlay Text */}
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 bg-gradient-to-t from-black/90 to-transparent z-20 pointer-events-none">
                <div className="overflow-hidden">
                    <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tighter text-white mix-blend-difference opacity-90 translate-y-0 transition-transform duration-700">
                        CAREY<br/>YUAN
                    </h1>
                </div>
                <div className="mt-4 flex items-center gap-4 text-white/40 text-xs font-mono uppercase tracking-[0.3em]">
                    <span className="w-8 h-px bg-white/40" />
                    <span>The Architect</span>
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN: CONTENT & CONTROL */}
        <div className="w-full md:w-1/2 h-full flex flex-col relative z-10 bg-[#0a0a0c]/90 backdrop-blur-2xl">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-20 space-y-16">
                
                {/* 1. BIO SECTION */}
                <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700 delay-100">
                    <div className="flex items-center gap-3 text-amber-glow/60 text-[10px] font-bold font-mono uppercase tracking-[0.2em]">
                        <User size={12} />
                        <span>Profile Data</span>
                    </div>
                    <p className="font-serif text-xl md:text-2xl leading-relaxed text-white/90">
                        "The Walled Garden is an attempt to create a sanctuary for thought in an environment hostile to depth."
                    </p>
                    <div className="space-y-6 text-sm font-sans text-white/50 leading-loose max-w-md">
                        <p>
                            Growing up, the house was never quiet. My parents exclusively played Caribbean music. These weren't just rhythms; they were conscious, direct attempts to address class struggle and post-colonial identity. You couldn't just listen; you had to understand the machinery of the culture.
                        </p>
                        <p>
                            When I eventually stepped up to the mic, that was the priority. I wasn't interested in abstraction for its own sake. I wanted to analyze the systems we live in with the same rigor.
                        </p>
                        <p>
                            I am a multi-disciplinary artist and engineer operating out of New York City. My practice is obsessed with the texture of memory and the digital preservation of the self. This project is the synthesis of that obsession—heavily influenced by <strong>David Hume's</strong> bundle theory, <strong>Seymour Papert's</strong> constructionism, and the analytical frameworks of <strong>Cognitive Science</strong>.
                        </p>
                    </div>
                </div>

                {/* 2. THE MANTRA (HIDDEN TRACK) */}
                <div className="animate-in slide-in-from-bottom-8 duration-700 delay-200">
                    <div className="relative p-8 md:p-10 border border-white/10 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent hover:from-white/[0.05] transition-all group overflow-hidden">
                        {/* Background Glitch */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />
                        <div className="absolute top-0 right-0 p-6 text-white/5 group-hover:text-amber-glow/10 transition-colors">
                            <Radio size={64} />
                        </div>
                        
                        <h3 className="text-2xl font-serif text-white mb-2 relative z-10">The Mantra</h3>
                        <p className="text-[10px] text-amber-glow font-mono uppercase tracking-widest mb-8 relative z-10 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-glow animate-pulse" />
                            Hidden Track /// Restricted Access
                        </p>
                        
                        <button 
                            onClick={() => { selectTrack('track-mantra'); }}
                            className="relative z-10 flex items-center gap-4 text-white/60 hover:text-white transition-colors group/btn"
                        >
                            <div className={`w-14 h-14 rounded-full border border-white/20 group-hover/btn:border-amber-glow group-hover/btn:bg-amber-glow/10 flex items-center justify-center transition-all ${currentTrackId === 'track-mantra' && isPlaying ? 'animate-spin-slow border-amber-glow text-amber-glow' : ''}`}>
                                {currentTrackId === 'track-mantra' && isPlaying ? <Activity size={20} /> : <Play size={20} className="ml-1" />}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold uppercase tracking-[0.2em] group-hover/btn:text-amber-glow transition-colors">
                                    {currentTrackId === 'track-mantra' && isPlaying ? 'Transmitting Signal' : 'Initiate Playback'}
                                </span>
                                <span className="text-[9px] text-white/30 font-mono mt-1">72 BPM /// C MAJOR</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* 3. NEWSLETTER */}
                <div className="space-y-8 pt-12 border-t border-white/10 animate-in slide-in-from-bottom-8 duration-700 delay-300">
                    <div className="flex items-center gap-3 text-white/30 text-[10px] font-bold font-mono uppercase tracking-[0.2em]">
                        <Activity size={12} />
                        <span>Signal Frequency</span>
                    </div>
                    
                    {!subscribed ? (
                        <form onSubmit={handleSubscribe} className="relative max-w-md">
                            <input 
                                type="email" 
                                placeholder="Enter email frequency..."
                                className="w-full bg-transparent border-b border-white/20 text-lg md:text-xl font-serif text-white placeholder:text-white/20 focus:outline-none focus:border-amber-glow py-4 pr-12 transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button type="submit" className="absolute right-0 top-4 text-white/30 hover:text-amber-glow transition-colors">
                                <ArrowRight size={24} />
                            </button>
                        </form>
                    ) : (
                        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg inline-flex items-center gap-3 text-green-400 font-mono text-xs tracking-widest animate-in fade-in">
                            <Fingerprint size={16} /> 
                            <span>TRANSMISSION LINK ESTABLISHED</span>
                        </div>
                    )}
                </div>

                {/* Footer Metadata */}
                <div className="pt-24 opacity-30 text-[9px] font-mono uppercase tracking-[0.4em] text-center md:text-left">
                    Walled Garden v2.0 /// NYC 2025
                </div>

            </div>
        </div>
    </div>
  );
};
