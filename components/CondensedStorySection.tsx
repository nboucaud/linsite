import React, { useEffect, useRef } from 'react';
import { TrackData } from '../types';
import { StanzaLine } from './StanzaLine';
import { useAudio } from '../context/AudioContext';

interface CondensedStorySectionProps {
  track: TrackData;
}

export const CondensedStorySection: React.FC<CondensedStorySectionProps> = ({ track }) => {
  const { isPlaying, currentTime, currentTrackId } = useAudio();
  const activeStanzaRef = useRef<HTMLDivElement | null>(null);
  
  const getActiveStanzaIndex = () => {
    if (currentTrackId !== track.id) return -1;
    const currentTimeMs = currentTime * 1000;
    
    let globalWordIndex = 0;
    for (let s = 0; s < track.stanzas.length; s++) {
      const stanza = track.stanzas[s];
      let stanzaWordCount = 0;
      stanza.forEach(line => stanzaWordCount += line.trim().split(/\s+/).length);
      
      const firstWordOfStanza = track.wordMap[globalWordIndex];
      const nextStanzaWordIndex = globalWordIndex + stanzaWordCount;
      const firstWordOfNextStanza = track.wordMap[nextStanzaWordIndex];
      
      const startMs = firstWordOfStanza?.timeMs || 0;
      const endMs = firstWordOfNextStanza?.timeMs || Infinity;

      if (currentTimeMs >= startMs && currentTimeMs < endMs) {
        return s;
      }
      globalWordIndex += stanzaWordCount;
    }
    return -1;
  };

  const activeStanzaIndex = getActiveStanzaIndex();

  useEffect(() => {
    if (isPlaying && activeStanzaIndex !== -1 && activeStanzaRef.current) {
      activeStanzaRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeStanzaIndex, isPlaying]);

  let wordCountTracker = 0;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-12 pb-64">
      <div className="space-y-24">
        {track.stanzas.map((stanza, stanzaIndex) => {
          const isActive = stanzaIndex === activeStanzaIndex;
          const isPast = stanzaIndex < activeStanzaIndex && activeStanzaIndex !== -1;
          
          return (
            <div 
              key={stanzaIndex} 
              ref={isActive ? activeStanzaRef : null}
              className={`relative group transition-all duration-700 ${
                isActive 
                  ? 'opacity-100 scale-100 translate-x-0' 
                  : isPast 
                    ? 'opacity-20 scale-95 -translate-y-4 grayscale blur-[0.5px]' 
                    : 'opacity-40 hover:opacity-70 scale-95 translate-y-4'
              }`}
            >
              <div className={`absolute -left-10 top-0 bottom-0 w-px transition-all duration-1000 ${isActive ? 'bg-sea-blue h-full opacity-100 shadow-[0_0_15px_#4ade80]' : 'bg-slate-800 h-0 opacity-0'}`} />
              
              {stanza.map((line, lineIndex) => {
                const currentStartIndex = wordCountTracker;
                const wordsInLine = line.trim().split(/\s+/).length;
                wordCountTracker += wordsInLine;

                return (
                  <StanzaLine
                    key={`${stanzaIndex}-${lineIndex}`}
                    line={line}
                    startIndex={currentStartIndex}
                    track={track}
                    isPaused={!isPlaying}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
