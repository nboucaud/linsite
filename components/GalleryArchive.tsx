
import React, { useState, useMemo, useRef } from 'react';
import { TRACKS } from '../lib/data';
import { TrackData } from '../types';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon, Film, Scan, Quote } from 'lucide-react';

// --- TYPES ---

interface GalleryAsset {
  type: 'image' | 'video';
  subtype: 'poster' | 'official-video' | 'unwrapped';
  url: string;
}

interface EnrichedTrack {
  track: TrackData;
  assets: GalleryAsset[];
  analysis: {
    visualSummary: string;
    lyricConnection: string;
    keywords: string[];
  };
}

// --- STATIC ANALYSIS DATA ---
const ANALYSES: Record<string, { visualSummary: string, lyricConnection: string, keywords: string[] }> = {
    'track-victor-ep': {
        visualSummary: "Subject is obscured by high-contrast monochrome filtering. The composition is dominated by vertical scanlines and digital noise, suggesting a signal being intercepted or encrypted. The face is barely visible, replaced by a structural void.",
        lyricConnection: "Matches the lyric 'Chrome-plated planner.' The visual erasure of the human face corresponds to the 'Iron Lung' armor—Victor has replaced the biological vulnerability of the face with the hardness of the machine.",
        keywords: ["Construct", "Encryption", "Armor"]
    },
    'track-broadripple': {
        visualSummary: "Thermal blooming effects in red and black. The subject appears to be in motion, with significant motion blur distorting the edges of the silhouette. The lighting suggests an external, flickering light source, possibly fire.",
        lyricConnection: "Directly links to 'Accelerant' and 'Scrambling in cars.' The visual distortion mimics the panic of the 95 BPM tempo. The red hue is not warmth, but alert-state cortisol.",
        keywords: ["Panic", "Thermal", "Velocity"]
    },
    'track-cogsci': {
        visualSummary: "Geometric overlays resembling neural schematics or constellations. The subject's head is framed by a golden halo of wireframe nodes. The expression is detached, looking upward.",
        lyricConnection: "Visualizes 'Relearning things I thought I knew.' The wireframe represents the 'Confined tomb of designs'—the analytical mind mapping itself in real-time, trapping the subject in a loop of logic.",
        keywords: ["Schematic", "Loop", "Golden"]
    },
    'track-rumdrum': {
        visualSummary: "Cyan and white ripples distorting the visual field. The texture resembles liquid interference patterns or light refracting through glass. The image feels unstable, as if projected on water.",
        lyricConnection: "The liquid distortion connects to 'The Rum Drum' as a double entendre for alcohol and heartbeat. The instability mirrors the 'Bubblegum breath'—a fragile attempt to mask the chaos underneath.",
        keywords: ["Liquid", "Refraction", "Tide"]
    },
    'track-monumental': {
        visualSummary: "Heavy, stone-like textures. The color palette is desaturated slate and gray. Vertical composition lines imply towering height and crushing weight. The subject is small relative to the frame.",
        lyricConnection: "Illustrates 'Systemic failure' and 'Ballast stones.' The visual weight represents the institutional pressure (The Bursar, The Bank) bearing down on the individual.",
        keywords: ["Concrete", "Scale", "Oppression"]
    },
    'track-lender': {
        visualSummary: "Green phosphorous glow, similar to a CRT monitor or radar screen. The subject is fragmented, appearing as digital artifacts rather than flesh. A transactional aesthetic.",
        lyricConnection: "Links to 'Can you lend me an ear?' The CRT aesthetic suggests the transaction has been digitized. The humanity has been converted into data to be borrowed and traded.",
        keywords: ["Transaction", "Phosphor", "Digital"]
    },
    'track-gloom': {
        visualSummary: "Deep purple shadows consuming the frame. The lighting is low-key, emphasizing the isolation of the subject. There is a texture of 'rain' or static grain overlaying the image.",
        lyricConnection: "Depicts 'Orpheus in the valley.' The darkness isn't just absence of light; it's the 'Wooden Room' of the basement. The static represents the silence of the 'dead AirPods'.",
        keywords: ["Shadow", "Static", "Depression"]
    },
    'track-earnest': {
        visualSummary: "Soft, lavender and pastel tones. The focus depth is shallow, creating a dreamlike, intimate atmosphere. Organic textures (paper, grain) replace the harsh digital noise of previous tracks.",
        lyricConnection: "Reflects 'Sewing beads, flowing seeds.' The visual softness contradicts the 'Furnace.' It is the visual manifestation of the 'Quiet Rebellion'—growth happening in secret.",
        keywords: ["Organic", "Growth", "Softness"]
    },
    'track-stranger': {
        visualSummary: "High-contrast red and black. The silhouette is sharp, almost cut out from the background. The 'Stranger' is faceless, represented by a void or a mask.",
        lyricConnection: "The final integration. 'I am just a Stranger.' The lack of features suggests that Victor and Carey have merged—the identity is no longer split, but it is also no longer recognizable.",
        keywords: ["Integration", "Void", "Finality"]
    }
};

const DEFAULT_ANALYSIS = {
    visualSummary: "Abstract visual data processing. Generative textures suggest a conflict between organic and synthetic layers.",
    lyricConnection: "Visualizes the tension between the 'Architect' (structure) and the 'Inhabitant' (emotion).",
    keywords: ["Synthesis", "Abstract", "Data"]
};

export const GalleryArchive: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  // --- STATE ---
  const [trackIndex, setTrackIndex] = useState(0);
  const [assetIndices, setAssetIndices] = useState<Record<number, number>>({});
  
  // Transition State ('idle' = showing, 'out' = curtain down, 'in' = curtain up)
  const [transitionState, setTransitionState] = useState<'idle' | 'out' | 'in'>('idle');
  const navigatingRef = useRef(false);

  // --- DATA PREP ---
  const galleryData: EnrichedTrack[] = useMemo(() => {
    return TRACKS.map(t => {
        const assets: GalleryAsset[] = [];
        
        // 1. Poster (Cover Art)
        if (t.coverArt) {
            assets.push({ type: 'image', subtype: 'poster', url: t.coverArt });
        }

        // 2. Videos
        if (t.media) {
            t.media.forEach(m => {
                if (m.type === 'video') {
                    const isDecon = m.filename.toLowerCase().includes('decon');
                    assets.push({
                        type: 'video',
                        subtype: isDecon ? 'unwrapped' : 'official-video',
                        url: m.url
                    });
                }
            });
        }

        // Sort: Poster -> Official Video -> Unwrapped
        const sortOrder = { 'poster': 0, 'official-video': 1, 'unwrapped': 2 };
        assets.sort((a, b) => sortOrder[a.subtype] - sortOrder[b.subtype]);

        return {
            track: t,
            assets,
            analysis: ANALYSES[t.id] || DEFAULT_ANALYSIS
        };
    }).filter(t => t.assets.length > 0);
  }, []);

  const currentTrackData = galleryData[trackIndex];
  const currentAssetIndex = assetIndices[trackIndex] || 0;
  const currentAsset = currentTrackData.assets[currentAssetIndex];

  // --- NAVIGATION CONTROLLER ---
  const switchContent = (newTrackIdx: number, newAssetIdx: number) => {
      if (navigatingRef.current) return;
      navigatingRef.current = true;
      
      // 1. Drop Curtain
      setTransitionState('out');

      // 2. Wait for cover (CSS duration 300ms)
      setTimeout(() => {
          setTrackIndex(newTrackIdx);
          setAssetIndices(prev => ({ ...prev, [newTrackIdx]: newAssetIdx }));
          
          // Check type of next asset
          const nextAsset = galleryData[newTrackIdx].assets[newAssetIdx];
          
          // If Image: Reveal immediately after brief paint delay
          if (nextAsset.type !== 'video') {
              setTimeout(() => triggerReveal(), 50);
          }
          // If Video: Wait for onCanPlay event to triggerReveal()
      }, 300);
  };

  const triggerReveal = () => {
      setTransitionState('in');
      setTimeout(() => {
          setTransitionState('idle');
          navigatingRef.current = false;
      }, 300);
  };

  const handleNextTrack = () => {
      const nextIdx = (trackIndex + 1) % galleryData.length;
      switchContent(nextIdx, assetIndices[nextIdx] || 0);
  };

  const handlePrevTrack = () => {
      const prevIdx = (trackIndex - 1 + galleryData.length) % galleryData.length;
      switchContent(prevIdx, assetIndices[prevIdx] || 0);
  };

  const handleAssetSelect = (idx: number) => {
      if (idx === currentAssetIndex) return;
      switchContent(trackIndex, idx);
  };

  const getSubtypeLabel = (subtype: string) => {
      switch(subtype) {
          case 'poster': return "Official Poster";
          case 'official-video': return "Official Video";
          case 'unwrapped': return "Unwrapped";
          default: return "Media Asset";
      }
  };

  // --- VIDEO ENGINE (EXACT LYRIC PAGE REPLICA) ---
  
  const handleVideoLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
      // "Bite into the front" - Skip first 0.15s to avoid black frames
      e.currentTarget.currentTime = 0.15;
  };

  const handleVideoCanPlay = () => {
      // Trigger reveal only when data is actually ready
      if (navigatingRef.current) {
          triggerReveal();
      }
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const vid = e.currentTarget;
      if (!vid.duration) return;

      // "Bite into the end" - Skip last 0.6s to create seamless loop
      if (vid.currentTime >= vid.duration - 0.6) {
          if (!navigatingRef.current) {
              vid.currentTime = 0.15; // Loop back to start (trimmed)
              vid.play();
          }
      }
  };

  // --- RENDER ---
  return (
    <div className="fixed inset-0 z-[200] bg-[#050505] flex flex-col md:flex-row overflow-hidden font-sans text-slate-300 animate-in fade-in duration-500">
        
        {/* --- BACKGROUND LAYER (STATIC IMAGE) --- */}
        <div className="absolute inset-0 z-0 pointer-events-none">
            <img 
                src={currentTrackData.track.coverArt} 
                className="w-full h-full object-cover blur-3xl scale-110 opacity-30 transition-all duration-1000" 
                alt="" 
            />
            <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* --- CLOSE BUTTON --- */}
        <button onClick={onClose} className="absolute top-6 right-6 z-50 p-3 bg-black/20 hover:bg-white/10 rounded-full backdrop-blur-md text-white/50 hover:text-white transition-all">
            <X size={24} />
        </button>

        {/* --- LEFT: MEDIA STAGE (65%) --- */}
        <div className="relative w-full md:w-[65%] h-[50vh] md:h-full flex flex-col justify-center items-center bg-black/20 backdrop-blur-sm border-r border-white/5">
            
            {/* Main Asset Container (Styled like MediaCarousel) */}
            <div className="relative w-full h-full max-w-[90%] max-h-[80%] flex items-center justify-center">
                
                {/* GLASS CONTAINER */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-white/[0.03] backdrop-blur-md">
                    
                    {/* THE CURTAIN (Transition Overlay) */}
                    <div 
                        className={`absolute inset-0 z-20 bg-[#080808] flex items-center justify-center transition-opacity duration-300 pointer-events-none ${
                            transitionState === 'idle' ? 'opacity-0' : 'opacity-100'
                        }`}
                    >
                        {/* Glitch / Load Effect */}
                        {transitionState !== 'idle' && (
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-12 h-0.5 bg-amber-glow/50 blur-[2px] animate-pulse" />
                                <div className="text-[9px] uppercase tracking-widest text-white/30 font-mono">Decoding Signal...</div>
                            </div>
                        )}
                    </div>

                    {/* MEDIA CONTENT */}
                    <div className={`w-full h-full transition-transform duration-500 ${transitionState !== 'idle' ? 'scale-95' : 'scale-100'}`}>
                        {currentAsset.type === 'image' ? (
                            <img 
                                src={currentAsset.url} 
                                className="w-full h-full object-contain"
                                alt="Asset"
                            />
                        ) : (
                            <video 
                                key={currentAsset.url} // Forces remount
                                src={currentAsset.url} 
                                className="w-full h-full object-contain"
                                autoPlay
                                loop={false} // Handled manually
                                muted // REQUIRED for autoplay reliability
                                playsInline
                                onLoadedMetadata={handleVideoLoadedMetadata}
                                onCanPlay={handleVideoCanPlay}
                                onTimeUpdate={handleTimeUpdate}
                            />
                        )}
                    </div>

                    {/* Gloss Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none mix-blend-overlay z-10" />
                    <div className="absolute inset-0 ring-1 ring-white/10 rounded-2xl pointer-events-none z-10" />
                </div>
            </div>

            {/* Asset Switcher (Filmstrip) */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-30">
                {currentTrackData.assets.map((asset, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleAssetSelect(idx)}
                        className={`group relative h-12 md:h-16 aspect-video rounded-md overflow-hidden border transition-all duration-300 ${idx === currentAssetIndex ? 'border-amber-glow scale-110 shadow-[0_0_15px_rgba(251,191,36,0.4)]' : 'border-white/20 opacity-50 hover:opacity-100'}`}
                    >
                        {asset.type === 'video' ? (
                            <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                                <Film size={16} className="text-white/50" />
                            </div>
                        ) : (
                            <img src={asset.url} className="w-full h-full object-cover" alt="" />
                        )}
                        {/* Tooltip */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest font-mono">
                            {getSubtypeLabel(asset.subtype)}
                        </div>
                    </button>
                ))}
            </div>

            {/* Track Navigation Arrows (Mobile Overlays) */}
            <button onClick={handlePrevTrack} className="absolute left-4 top-1/2 -translate-y-1/2 p-4 text-white/30 hover:text-white transition-colors md:hidden">
                <ChevronLeft size={32} />
            </button>
            <button onClick={handleNextTrack} className="absolute right-4 top-1/2 -translate-y-1/2 p-4 text-white/30 hover:text-white transition-colors md:hidden">
                <ChevronRight size={32} />
            </button>
        </div>

        {/* --- RIGHT: ANALYSIS DOSSIER (35%) --- */}
        <div className="relative w-full md:w-[35%] h-[50vh] md:h-full bg-[#08080a]/90 backdrop-blur-xl border-t md:border-t-0 md:border-l border-white/10 flex flex-col">
            
            {/* Header / Track Info */}
            <div className="p-8 border-b border-white/5 flex-shrink-0">
                <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-amber-glow/70 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-glow animate-pulse" />
                            Archival Record
                        </div>
                        <h2 className="text-4xl font-serif text-white leading-none tracking-tight">
                            {currentTrackData.track.title}
                        </h2>
                    </div>
                    
                    {/* Desktop Nav Controls */}
                    <div className="hidden md:flex gap-2">
                        <button onClick={handlePrevTrack} className="p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 transition-all active:scale-95">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={handleNextTrack} className="p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 transition-all active:scale-95">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex gap-4 text-[10px] font-mono text-white/40 uppercase tracking-wider">
                    <span>{currentTrackData.track.bpm} BPM</span>
                    <span>///</span>
                    <span>{currentTrackData.track.key || 'Unknown Key'}</span>
                    <span>///</span>
                    <span>{currentTrackData.track.visualStyle.replace(/-/g, ' ')}</span>
                </div>
            </div>

            {/* Scrollable Analysis Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
                
                {/* 1. Visual Analysis */}
                <div className={`transition-all duration-700 delay-100 ${transitionState !== 'idle' ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                    <div className="flex items-center gap-3 text-white/90 mb-4">
                        <div className="p-1.5 bg-indigo-500/10 rounded text-indigo-400">
                            <Scan size={16} />
                        </div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Visual Syntax</h3>
                    </div>
                    <p className="text-sm leading-loose text-white/60 font-serif border-l-2 border-indigo-500/20 pl-4">
                        {currentTrackData.analysis.visualSummary}
                    </p>
                </div>

                {/* 2. Lyric Connection */}
                <div className={`transition-all duration-700 delay-200 ${transitionState !== 'idle' ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                    <div className="flex items-center gap-3 text-white/90 mb-4">
                        <div className="p-1.5 bg-emerald-500/10 rounded text-emerald-400">
                            <Quote size={16} />
                        </div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Lyrical Linkage</h3>
                    </div>
                    <p className="text-sm leading-loose text-white/60 font-serif border-l-2 border-emerald-500/20 pl-4">
                        {currentTrackData.analysis.lyricConnection}
                    </p>
                </div>

                {/* 3. Keywords */}
                <div className={`transition-all duration-700 delay-300 ${transitionState !== 'idle' ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                    <div className="flex flex-wrap gap-2">
                        {currentTrackData.analysis.keywords.map((kw, i) => (
                            <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-md text-[10px] uppercase tracking-widest text-white/50">
                                #{kw}
                            </span>
                        ))}
                    </div>
                </div>

            </div>

            {/* Asset Metadata Footer */}
            <div className="p-6 bg-black/40 border-t border-white/5 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${currentAsset.type === 'video' ? 'bg-amber-glow/10 text-amber-glow' : 'bg-blue-400/10 text-blue-400'}`}>
                        {currentAsset.type === 'video' ? <Film size={18} /> : <ImageIcon size={18} />}
                    </div>
                    <div>
                        <div className="text-xs font-bold text-white uppercase tracking-wider mb-0.5">
                            {getSubtypeLabel(currentAsset.subtype)}
                        </div>
                        <div className="text-[9px] font-mono text-white/30 truncate max-w-[200px]">
                            {currentAsset.url.split('/').pop()}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
  );
};
