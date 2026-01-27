
import React, { useState, useEffect, useMemo } from 'react';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';
import { useProgression } from '../context/ProgressionContext';
import { TRACK_STORIES } from '../lib/chapter-data';
import { TRACKS } from '../lib/data';
import { VisualizerCanvas } from './VisualizerCanvas';

export const ChapterSession: React.FC = () => {
  const { activeChapterTrackId, closeChapter, completeChapter } = useProgression();
  const [currentSlide, setCurrentSlide] = useState(0);

  const trackData = activeChapterTrackId ? TRACKS.find(t => t.id === activeChapterTrackId) : undefined;
  const storyData = activeChapterTrackId ? (TRACK_STORIES[activeChapterTrackId] || TRACK_STORIES['default']) : TRACK_STORIES['default'];

  const contentSegments = useMemo(() => {
      return [...storyData.segments, "END_OF_ENTRY"];
  }, [storyData]);
  
  const isLastSlide = currentSlide === contentSegments.length - 1;

  const nextSlide = () => {
    if (currentSlide < contentSegments.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      if (activeChapterTrackId) {
        completeChapter(activeChapterTrackId);
        closeChapter();
      }
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  useEffect(() => {
    if (activeChapterTrackId) {
      setCurrentSlide(0);
    }
  }, [activeChapterTrackId]);

  useEffect(() => {
    if (!activeChapterTrackId) return;
    const handleKey = (e: KeyboardEvent) => {
        if(e.key === 'ArrowRight') nextSlide();
        if(e.key === 'ArrowLeft') prevSlide();
        if(e.key === 'Escape') closeChapter();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentSlide, activeChapterTrackId, contentSegments]);

  if (!activeChapterTrackId) return null;

  const toRoman = (num: number) => {
      const lookup: any = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1};
      let roman = '', i;
      for ( i in lookup ) {
        while ( num >= lookup[i] ) {
          roman += i;
          num -= lookup[i];
        }
      }
      return roman;
  }

  return (
    <div className="fixed inset-0 z-[200] bg-museum-black flex flex-col md:flex-row animate-in fade-in duration-500 text-museum-paper">
      
      {/* LEFT: VISUAL CONTEXT (60%) */}
      <div className="relative w-full md:w-[60%] h-[40vh] md:h-full bg-black border-b md:border-b-0 md:border-r border-white/10 overflow-hidden group">
         {/* Visualizer Layer - Passes active TrackID for unique visuals */}
         <div className="absolute inset-0 opacity-60">
            <VisualizerCanvas active={true} trackId={activeChapterTrackId} />
         </div>
         
         {/* Gradient Overlay */}
         <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/80 pointer-events-none" />

         {/* Title Overlay */}
         <div className="absolute top-12 left-12 z-10 mix-blend-difference">
             <h3 className="font-serif text-3xl md:text-5xl text-white italic tracking-tight">{trackData?.title}</h3>
             <div className="w-12 h-1 bg-amber-glow mt-4 shadow-[0_0_15px_#fbbf24]" />
         </div>
      </div>

      {/* RIGHT: NARRATIVE (40%) */}
      <div className="relative w-full md:w-[40%] h-[60vh] md:h-full bg-museum-black flex flex-col p-12 md:p-20 justify-between">
          
          <button onClick={closeChapter} className="absolute top-8 right-8 p-3 text-white/30 hover:text-white transition-colors z-50">
            <X size={24} />
          </button>

          <div className="flex-1 flex flex-col justify-center relative">
             {/* Chapter Marker */}
             <div className="mb-8 flex items-center gap-3 opacity-60">
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-amber-glow">
                    {isLastSlide ? 'Conclusion' : `Part ${toRoman(currentSlide + 1)}`}
                </span>
                <div className="h-px flex-1 bg-white/20" />
             </div>
             
             {/* Content */}
             <div className="min-h-[200px] flex items-center">
                <h2 key={currentSlide} className="text-2xl md:text-3xl lg:text-4xl font-serif text-white leading-relaxed animate-in fade-in slide-in-from-right-4 duration-700">
                    {contentSegments[currentSlide] === "END_OF_ENTRY" ? ( 
                        <span className="text-white/40 italic">"Entry archived. The narrative continues in the silence."</span> 
                    ) : ( 
                        contentSegments[currentSlide] 
                    )}
                </h2>
             </div>
          </div>

          <div className="pt-12 border-t border-white/10 flex flex-col gap-8">
               <div className="flex items-center justify-between">
                   <button 
                    onClick={prevSlide} 
                    disabled={currentSlide === 0} 
                    className="p-4 rounded-full border border-white/10 hover:border-white/30 text-white/40 hover:text-white transition-all disabled:opacity-0 active:scale-95"
                   >
                    <ChevronLeft size={20} />
                   </button>
                   
                   <div className="text-xs font-mono text-white/30 tracking-widest">
                        {currentSlide + 1} / {contentSegments.length}
                   </div>

                   <button 
                    onClick={nextSlide} 
                    className="flex items-center gap-4 px-8 py-4 bg-white text-black hover:bg-amber-glow hover:text-black rounded-full transition-all group active:scale-95 shadow-lg"
                   >
                       <span className="text-xs font-bold uppercase tracking-widest">{isLastSlide ? 'Close' : 'Next'}</span>
                       <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                   </button>
               </div>
          </div>
      </div>
    </div>
  );
};
