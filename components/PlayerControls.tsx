
import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useAudio } from '../context/AudioContext';
import { TRACKS } from '../lib/data';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, LayoutGrid, Music2, Gamepad2, BookOpen, User, Sparkles } from 'lucide-react';

interface PlayerControlsProps {
    onToggleGame: () => void;
    onToggleCurator: () => void;
    onToggleChapters: () => void;
    onToggleInsights: () => void;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({ onToggleGame, onToggleCurator, onToggleChapters, onToggleInsights }) => {
  const { 
    isPlaying, 
    togglePlayPause, 
    currentTime, 
    duration, 
    seek, 
    currentTrackId,
    selectTrack,
    volume,
    setVolume,
    toggleMute,
    isMuted,
    trackAssets
  } = useAudio();

  const [localSeek, setLocalSeek] = useState<number | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const visibleTracks = useMemo(() => TRACKS.filter(t => !t.hidden), []);

  const currentTrack = useMemo(() => 
    TRACKS.find(t => t.id === currentTrackId), 
  [currentTrackId]);

  const activeImage = trackAssets[currentTrackId || '']?.image || currentTrack?.coverArt;

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const displayTime = localSeek !== null ? localSeek : currentTime;
  const progressPercent = duration ? (displayTime / duration) * 100 : 0;

  // Next/Prev Logic respects hidden tracks
  const handleNext = () => {
      const idx = visibleTracks.findIndex(t => t.id === currentTrackId);
      if (idx !== -1) {
          const nextTrack = visibleTracks[(idx + 1) % visibleTracks.length];
          selectTrack(nextTrack.id);
      }
  };

  const handlePrev = () => {
      const idx = visibleTracks.findIndex(t => t.id === currentTrackId);
      if (idx !== -1) {
          const prevTrack = visibleTracks[(idx - 1 + visibleTracks.length) % visibleTracks.length];
          selectTrack(prevTrack.id);
      }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[140] flex flex-col justify-end pointer-events-none">
      
      {/* 1. DRAWER BACKDROP (Click to close) */}
      {showLibrary && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[-1] pointer-events-auto" 
            onClick={() => setShowLibrary(false)} 
          />
      )}

      {/* 2. MAIN CONTAINER (Drawer + Bar) */}
      <div className={`w-full transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${showLibrary ? 'translate-y-0' : 'translate-y-0'}`}>
        
        {/* A. LIBRARY DRAWER */}
        <div 
            className={`
                w-full bg-[#0a0a0c]/95 backdrop-blur-xl border-t border-white/10 rounded-t-[2rem] 
                transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] overflow-hidden pointer-events-auto
                ${showLibrary ? 'h-64 opacity-100 translate-y-0' : 'h-0 opacity-0 translate-y-4'}
            `}
        >
            <div className="absolute top-4 left-8 text-[10px] font-bold uppercase tracking-widest text-white/30">
                Select Track
            </div>

            <div 
                ref={scrollContainerRef}
                className="flex items-center px-12 h-full overflow-x-auto custom-scrollbar relative gap-6"
            >
            {visibleTracks.map((track, index) => {
                const isTrackActive = track.id === currentTrackId;
                const assetImg = trackAssets[track.id]?.image || track.coverArt;
                
                return (
                <button
                    key={track.id}
                    onClick={() => selectTrack(track.id)}
                    className={`relative group w-28 flex flex-col gap-2 transition-all duration-500 flex-shrink-0 text-left ${isTrackActive ? 'scale-105 opacity-100' : 'opacity-50 hover:opacity-80 hover:scale-105'}`}
                >
                    <div className={`relative w-full aspect-square rounded-xl overflow-hidden border shadow-xl transition-all ${
                        isTrackActive ? 'border-amber-glow/50 shadow-amber-glow/20' : 'border-white/10'
                    }`}>
                        <img src={assetImg} className="w-full h-full object-cover" alt="" />
                        {isTrackActive && isPlaying && <div className="absolute inset-0 bg-amber-glow/10 animate-pulse" />}
                    </div>
                    
                    <div className="text-center">
                        <div className={`text-[9px] font-serif truncate transition-colors ${isTrackActive ? 'text-amber-glow' : 'text-white/80'}`}>{track.title}</div>
                        <div className="text-[7px] uppercase tracking-widest text-white/30 mt-0.5">Track {index + 1}</div>
                    </div>
                </button>
                )
            })}
            
            {/* End Spacer */}
            <div className="w-8" />
            </div>
        </div>

        {/* B. CONTROL BAR */}
        <div className="relative pointer-events-auto bg-[#060608]/90 backdrop-blur-xl border-t border-white/10 h-20 md:h-24 flex items-center px-6 md:px-8 gap-4 md:gap-8 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            
            {/* Absolute Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/5 cursor-pointer group hover:h-1 transition-all">
                <div className="h-full bg-amber-glow shadow-[0_0_15px_#fcd34d] relative transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                <input
                    type="range" min={0} max={duration || 100} value={displayTime}
                    onChange={(e) => setLocalSeek(Number(e.target.value))}
                    onMouseUp={() => { if (localSeek !== null) { seek(localSeek); setLocalSeek(null); }}}
                    className="absolute inset-0 w-full h-4 -top-2 opacity-0 cursor-pointer"
                    disabled={!currentTrackId}
                />
            </div>

            {/* Left: Metadata */}
            <div className="flex items-center gap-4 min-w-[140px] md:min-w-[240px]">
                <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden border border-white/10 group flex-shrink-0">
                    <img src={activeImage} className="w-full h-full object-cover grayscale-[0.2]" alt="" />
                    <div 
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                        onClick={() => setShowLibrary(!showLibrary)}
                    >
                        <LayoutGrid size={16} className="text-white" />
                    </div>
                </div>
                <div className="overflow-hidden hidden md:block">
                    <h4 className="text-white font-serif text-sm leading-none truncate mb-1.5">{currentTrack?.title || "Select a Track"}</h4>
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] uppercase tracking-[0.2em] text-white/30 truncate">{currentTrack?.artist || "LOCKED"}</span>
                        <span className="w-0.5 h-0.5 rounded-full bg-white/10" />
                        <span className="text-[9px] font-mono text-amber-glow/60">{formatTime(displayTime)} / {formatTime(duration)}</span>
                    </div>
                </div>
            </div>

            {/* Center: Playback Engine */}
            <div className="flex-1 flex justify-center items-center gap-6 md:gap-10">
                <button 
                    className="text-white/20 hover:text-white transition-colors active:scale-95 p-2"
                    onClick={handlePrev}
                >
                    <SkipBack size={20} />
                </button>
                
                <button 
                    onClick={togglePlayPause}
                    disabled={!currentTrackId}
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-500 active:scale-95 ${
                    isPlaying ? 'bg-amber-glow text-black shadow-[0_0_30px_rgba(252,211,77,0.4)]' : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                    }`}
                >
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-1" />}
                </button>

                <button 
                    className="text-white/20 hover:text-white transition-colors active:scale-95 p-2"
                    onClick={handleNext}
                >
                    <SkipForward size={20} />
                </button>
            </div>

            {/* Right: Tools & Modes */}
            <div className="flex items-center gap-4 md:gap-6 min-w-[140px] md:min-w-[240px] justify-end">
                
                {/* Main App Modes */}
                <div className="flex items-center gap-1 md:gap-2 mr-2 md:mr-4 border-r border-white/10 pr-4">
                    <button onClick={onToggleInsights} className="p-2 text-white/40 hover:text-amber-glow transition-colors hover:bg-white/5 rounded-full" title="Deconstructed Lyrics">
                        <Sparkles size={18} />
                    </button>
                    <button onClick={onToggleGame} className="p-2 text-white/40 hover:text-amber-glow transition-colors hover:bg-white/5 rounded-full" title="Games">
                        <Gamepad2 size={18} />
                    </button>
                    <button onClick={onToggleChapters} className="p-2 text-white/40 hover:text-amber-glow transition-colors hover:bg-white/5 rounded-full" title="Chapters">
                        <BookOpen size={18} />
                    </button>
                    <button onClick={onToggleCurator} className="p-2 text-white/40 hover:text-amber-glow transition-colors hover:bg-white/5 rounded-full" title="Carey">
                        <User size={18} />
                    </button>
                </div>

                <div className="hidden md:flex items-center gap-3 group/volume">
                    <button onClick={toggleMute} className="text-white/30 hover:text-white transition-colors">
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                    <div className="w-0 overflow-hidden group-hover/volume:w-20 transition-all duration-300">
                        <input 
                        type="range" min="0" max="1" step="0.01" value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-20 h-1 bg-white/10 appearance-none rounded-full cursor-pointer accent-white"
                        />
                    </div>
                </div>
                
                {/* Mobile Library Toggle (Only visible on small screens) */}
                <button 
                    onClick={() => setShowLibrary(!showLibrary)}
                    className="md:hidden p-2 text-white/50 hover:text-white"
                >
                    <LayoutGrid size={20} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
