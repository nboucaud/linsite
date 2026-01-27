
import React, { useMemo } from 'react';
import { useAudio } from '../context/AudioContext';
import { TrackData } from '../types';
import { Play } from 'lucide-react';

interface StanzaLineProps {
  line: string;
  startIndex: number;
  track: TrackData;
  isPaused: boolean;
}

const getStableRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

export const StanzaLine: React.FC<StanzaLineProps> = ({ line, startIndex, track, isPaused }) => {
  const { currentTime, currentTrackId, seek } = useAudio();
  
  const words = useMemo(() => line.trim().split(/\s+/), [line]);
  const beatDuration = 60 / track.bpm;

  // Determine if this specific line is "Active" in time
  const isActiveLine = useMemo(() => {
    if (currentTrackId !== track.id) return false;
    const wordCount = words.length;
    // Get time range
    const firstWord = track.wordMap[startIndex];
    const lastWord = track.wordMap[startIndex + wordCount - 1];
    
    if (!firstWord) return false;
    
    const startTime = firstWord.timeMs;
    // If last word missing, default to some duration
    const endTime = lastWord ? lastWord.timeMs + 500 : startTime + 2000;
    
    const timeMs = currentTime * 1000;
    // Add a slight buffer before and after for smoother transition
    return timeMs >= startTime - 500 && timeMs < endTime;
  }, [currentTime, currentTrackId, track.id, startIndex, words.length]);

  // Action: Seek Audio (Clicking the Text)
  const handleSeek = (e: React.MouseEvent) => {
    e.stopPropagation();
    const firstWord = track.wordMap[startIndex];
    if (firstWord) {
      seek(firstWord.timeMs / 1000);
    }
  };

  const getWordStyle = (isActive: boolean, hasPassed: boolean, progress: number) => {
    const style: React.CSSProperties = {};
    const effect = track.visualStyle;

    if (isActive) {
      style.opacity = 1;
      style.color = '#ffffff';
    }

    switch (effect) {
      case 'neon-pulse':
      case 'nuclear-haze':
        if (isActive) {
          const color1 = effect === 'nuclear-haze' ? '239, 68, 68' : '252, 211, 77';
          const color2 = effect === 'nuclear-haze' ? '248, 113, 113' : '251, 191, 36';
          style.textShadow = `0 0 15px rgba(${color1}, 0.6), 0 0 30px rgba(${color2}, 0.4)`;
          style.transform = `scale(${1 + Math.sin(progress * Math.PI) * 0.05})`;
        }
        break;
      case 'chromatic-ghost':
      case 'neural-spark':
      case 'vhs-tracking':
        if (isActive) {
          const shift = Math.sin(progress * Math.PI) * (effect === 'neural-spark' ? 5 : 3);
          style.textShadow = `${shift}px 0 0 rgba(255,0,0,0.8), -${shift}px 0 0 rgba(0,255,255,0.8)`;
          if (effect === 'vhs-tracking') style.filter = 'blur(0.5px)';
        }
        break;
      case 'prism-split':
      case 'chrome-liquid':
        if (isActive) {
          style.filter = `hue-rotate(${progress * 360}deg) saturate(150%) brightness(1.2)`;
          if (effect === 'chrome-liquid') {
             style.background = 'linear-gradient(to bottom, #fff, #9ca3af, #fff)';
             style.WebkitBackgroundClip = 'text';
             style.color = 'transparent';
          }
        }
        break;
      case 'focus-depth':
        if (!isActive && !isPaused) {
          style.filter = 'blur(1px)';
          style.opacity = 0.6; 
        } else if (isActive) {
          style.filter = 'blur(0px)';
          style.transform = `scale(1.1)`;
          style.zIndex = 50;
        }
        break;
      case 'perspective-tilt':
      case 'lorenz':
        if (isActive) {
          style.transform = `perspective(500px) rotateY(${Math.sin(progress * Math.PI) * (effect === 'lorenz' ? 30 : 20)}deg)`;
        }
        break;
      case 'scanline-crt':
        if (isActive) {
          style.fontFamily = 'monospace';
          style.backgroundColor = 'rgba(255,255,255,0.15)'; 
          style.padding = '0 6px';
        }
        break;
      case 'kinetic-float':
      case 'boids':
      case 'spiders':
      case 'loom-weave':
        if (isActive) {
          const yOffset = Math.sin(progress * Math.PI * 2) * -8;
          style.transform = `translateY(${yOffset}px)`;
          style.letterSpacing = '0.05em';
          if (effect === 'spiders') style.letterSpacing = '0.15em';
        }
        break;
      case 'type-brutal':
      case 'pillars':
      case 'construct':
      case 'containment-box':
        if (isActive) {
          style.backgroundColor = '#ffffff';
          style.color = '#000000';
          style.fontFamily = 'sans-serif'; 
          style.fontWeight = 900;
          style.textTransform = 'uppercase';
          style.padding = '0 8px';
          style.boxShadow = '4px 4px 0px rgba(252, 211, 77, 1)';
          if (effect === 'containment-box') style.border = '2px solid white';
        }
        break;
      case 'weight-shift':
      case 'pendulum':
        if (isActive) {
          style.transform = `scaleX(${1 + Math.sin(progress * Math.PI) * 0.2})`;
          style.fontWeight = 'bold';
          if (effect === 'pendulum') style.transform += ` rotate(${Math.sin(progress * Math.PI * 2) * 5}deg)`;
        }
        break;
      case 'strobe-sync':
      case 'snare-impact':
          if (isActive) {
              if (effect === 'snare-impact') style.transform = `scale(${1 + Math.sin(progress * Math.PI) * 0.3})`;
          }
          break;
    }
    return style;
  };

  const getWordClasses = (isActive: boolean, hasPassed: boolean, globalIndex: number) => {
    let classes = "transition-all duration-300 inline-block mx-1.5 align-baseline relative select-none font-serif ";

    if (isPaused) {
      classes += "text-white/60 hover:text-white/80 ";
    } else {
      if (isActive) {
        classes += "text-white z-20 font-bold "; 
        if (track.visualStyle === 'strobe-sync' || track.visualStyle === 'snare-impact' || track.visualStyle === 'neural-spark') classes += "animate-strobe ";
      } else if (hasPassed) {
        classes += "text-white/40 blur-[0.5px] grayscale "; 
      } else {
        classes += "text-white/50 "; 
        const rand = getStableRandom(globalIndex + (track.bpm || 0));
        if (rand > 0.3) {
            if (rand > 0.9) classes += "animate-dance-bounce ";
            else if (rand > 0.8) classes += "animate-dance-sway "; 
            else if (rand > 0.7) classes += "animate-dance-shiver ";
            else if (rand > 0.6) classes += "animate-dance-compress "; 
            else if (rand > 0.5) classes += "animate-dance-float ";  
            else if (rand > 0.42) classes += "animate-dance-skew ";   
            else if (rand > 0.36) classes += "animate-dance-dim ";    
            else classes += "animate-dance-blur ";                   
        }
      }
    }
    return classes;
  };

  const highlightLyricWords = () => {
    const renderedWords: React.ReactNode[] = [];
    const isActiveTrack = currentTrackId === track.id;
    const currentTimeMs = currentTime * 1000;

    words.forEach((wordText, localIndex) => {
      const globalIndex = startIndex + localIndex;
      const wordData = track.wordMap[globalIndex];
      const nextWordData = track.wordMap[globalIndex + 1];
      
      if (!wordData) return;

      const startTime = wordData.timeMs;
      const endTime = nextWordData ? nextWordData.timeMs : startTime + 600;
      const duration = endTime - startTime;
      
      const isActive = isActiveTrack && currentTimeMs >= startTime && currentTimeMs < endTime;
      const hasPassed = isActiveTrack && currentTimeMs >= endTime;
      const wordProgress = isActive ? Math.min(1, Math.max(0, (currentTimeMs - startTime) / duration)) : 0;

      const rand = getStableRandom(globalIndex);
      let delayOffset = 0;
      if (rand > 0.75) delayOffset = 0; 
      else if (rand > 0.5) delayOffset = beatDuration / 2; 
      else if (rand > 0.25) delayOffset = beatDuration / 4; 
      else delayOffset = beatDuration * 0.75;

      renderedWords.push(
        <span 
          key={`${globalIndex}-${wordText}`} 
          className={getWordClasses(isActive, hasPassed, globalIndex)}
          style={{
            ...getWordStyle(isActive, hasPassed, wordProgress),
            '--beat': `${beatDuration}s`,
            '--delay': `-${delayOffset}s`
          } as any}
        >
          {isActive && (
            <span 
              className="absolute -bottom-1 left-0 right-0 h-[2px] bg-amber-glow shadow-[0_0_15px_#fcd34d] transition-all rounded-full"
              style={{ width: `${wordProgress * 100}%` }}
            />
          )}
          {wordText}
        </span>
      );
    });

    return renderedWords;
  };

  return (
    <div 
      className={`
        relative group/line flex items-start py-3 md:py-4 px-3 md:px-0 rounded-2xl transition-all duration-500
        ${isActiveLine 
            ? 'bg-black/60 backdrop-blur-md md:bg-transparent md:backdrop-blur-none shadow-2xl md:shadow-none border border-white/10 md:border-transparent scale-[1.02] md:scale-100' 
            : 'hover:bg-white/[0.05] md:hover:bg-white/[0.02]'
        }
      `}
    >
      
      {/* LYRIC TEXT (Seek Action) */}
      <div 
        onClick={handleSeek}
        className="flex-1 cursor-crosshair relative z-10 pl-4 md:pl-0"
        title="Click text to jump to this point in the song"
      >
          <div className="leading-snug text-2xl md:text-4xl lg:text-5xl">
            {highlightLyricWords()}
          </div>
      </div>

      {/* HOVER JUMP HINT */}
      <div className="hidden group-hover/line:flex flex-shrink-0 items-center pr-4 pt-3 opacity-0 transition-opacity duration-300 delay-100 group-hover/line:opacity-30">
            <button onClick={handleSeek} className="text-[9px] uppercase tracking-widest text-white border border-white/30 px-3 py-1 rounded-full flex items-center gap-2">
            <Play size={8} fill="currentColor" /> Jump
            </button>
      </div>

    </div>
  );
};
