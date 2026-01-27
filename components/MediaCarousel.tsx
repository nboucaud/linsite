
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaItem } from '../types';

interface MediaCarouselProps {
    items?: MediaItem[];
}

export const MediaCarousel: React.FC<MediaCarouselProps> = ({ items }) => {
    // Logic: Start with the Main Video (any video that ISN'T a 'decon' video).
    // If none, fallback to Decon video. If none, fallback to first item (Poster).
    const [currentIndex, setCurrentIndex] = useState(() => {
        if (!items || items.length === 0) return 0;
        
        // 1. Try to find a MAIN video (not decon)
        const mainVideoIndex = items.findIndex(i => i.type === 'video' && !i.filename.toLowerCase().includes('decon'));
        if (mainVideoIndex !== -1) return mainVideoIndex;

        // 2. Try to find ANY video (Decon fallback)
        const anyVideoIndex = items.findIndex(i => i.type === 'video');
        if (anyVideoIndex !== -1) return anyVideoIndex;

        // 3. Fallback to start
        return 0;
    });

    // transitionState: 'idle' | 'out' (covering content) | 'in' (revealing content)
    const [transitionState, setTransitionState] = useState<'idle' | 'out' | 'in'>('idle');
    const [videoReady, setVideoReady] = useState(false);
    const navigatingRef = useRef(false);

    // Reset index intelligently when items change
    useEffect(() => {
        if (!items || items.length === 0) {
            setCurrentIndex(0);
            return;
        }
        
        // Same logic as initial state
        let nextIndex = 0;
        const mainVideoIndex = items.findIndex(i => i.type === 'video' && !i.filename.toLowerCase().includes('decon'));
        if (mainVideoIndex !== -1) {
            nextIndex = mainVideoIndex;
        } else {
            const anyVideoIndex = items.findIndex(i => i.type === 'video');
            if (anyVideoIndex !== -1) nextIndex = anyVideoIndex;
        }

        setCurrentIndex(nextIndex);
        setTransitionState('idle');
        setVideoReady(false);
        navigatingRef.current = false;
    }, [items]);

    if (!items || items.length === 0) return null;

    const currentItem = items[currentIndex];
    const hasMultiple = items.length > 1;

    const changeIndex = (newIndex: number) => {
        if (navigatingRef.current) return;
        navigatingRef.current = true;
        
        // 1. Trigger "Out" animation (Cover with Black/Glitch Overlay)
        setTransitionState('out');

        // 2. Wait for cover to fully appear (300ms matches CSS duration)
        setTimeout(() => {
            setCurrentIndex(newIndex);
            setVideoReady(false); // Reset readiness for new item
            
            const nextItem = items[newIndex];
            
            // If it's an image, we can reveal immediately after a brief delay for DOM paint
            if (nextItem.type !== 'video') {
                setTimeout(() => {
                    setTransitionState('in'); // Reveal
                    // Release navigation lock after reveal completes
                    setTimeout(() => {
                        setTransitionState('idle');
                        navigatingRef.current = false;
                    }, 300);
                }, 50);
            }
            // If it's a video, we wait for handleVideoCanPlay to trigger the 'in' state
        }, 300);
    };

    const next = () => changeIndex((currentIndex + 1) % items.length);
    const prev = () => changeIndex((currentIndex - 1 + items.length) % items.length);

    // --- VIDEO EVENTS ---

    const handleVideoLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
        // "Bite into the front" - Skip first 0.15s
        e.currentTarget.currentTime = 0.15;
    };

    const handleVideoCanPlay = () => {
        // Video is ready to play.
        // If we are mid-transition (navigating), this is the signal to reveal.
        if (navigatingRef.current) {
            setVideoReady(true);
            setTransitionState('in');
            setTimeout(() => {
                setTransitionState('idle');
                navigatingRef.current = false;
            }, 300);
        }
    };

    const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
        const vid = e.currentTarget;
        if (!vid.duration) return;

        // "Bite into the end" - Skip last 0.6s
        if (vid.currentTime >= vid.duration - 0.6) {
            if (!navigatingRef.current) {
                if (items.length === 1) {
                    vid.currentTime = 0.15; // Loop single video with trim
                    vid.play();
                } else {
                    next();
                }
            }
        }
    };

    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[22rem] h-[22rem] md:w-[30rem] md:h-[30rem] z-30">
            {/* Glass Container */}
            <div className="w-full h-full relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-white/[0.03] backdrop-blur-md group">
                
                {/* --- TRANSITION OVERLAY (The Curtain) --- */}
                {/* Covers the content during transition so we never see the empty container background */}
                <div 
                    className={`absolute inset-0 z-20 bg-[#080808] flex items-center justify-center transition-opacity duration-300 pointer-events-none ${
                        transitionState === 'idle' ? 'opacity-0' : 'opacity-100'
                    }`}
                >
                    {/* Glitch / Load Effect in Center */}
                    {transitionState !== 'idle' && (
                        <div className="relative">
                            <div className="w-16 h-0.5 bg-amber-glow/50 blur-[2px] animate-pulse" />
                            <div className="absolute top-0 left-0 w-16 h-0.5 bg-white mix-blend-overlay animate-ping" />
                        </div>
                    )}
                </div>

                {/* --- MEDIA CONTENT --- */}
                <div className={`w-full h-full transition-transform duration-500 ${transitionState !== 'idle' ? 'scale-95' : 'scale-100'}`}>
                    {currentItem.type === 'video' ? (
                        <video 
                            key={currentItem.url}
                            src={currentItem.url} 
                            autoPlay 
                            muted 
                            loop={false} 
                            playsInline
                            onLoadedMetadata={handleVideoLoadedMetadata}
                            onCanPlay={handleVideoCanPlay}
                            onTimeUpdate={handleTimeUpdate}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <img 
                            key={currentItem.url}
                            src={currentItem.url} 
                            alt="Track Asset" 
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>

                {/* Gloss Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none mix-blend-overlay z-10" />
                <div className="absolute inset-0 ring-1 ring-white/10 rounded-2xl pointer-events-none z-10" />

                {/* Controls */}
                {hasMultiple && (
                    <>
                        <button 
                            onClick={(e) => { e.stopPropagation(); prev(); }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/80 text-white/50 hover:text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm z-30"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); next(); }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/80 text-white/50 hover:text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm z-30"
                        >
                            <ChevronRight size={20} />
                        </button>
                        
                        {/* Pagination Dots */}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 pointer-events-none z-30">
                            {items.map((_, idx) => (
                                <div 
                                    key={idx} 
                                    className={`w-1.5 h-1.5 rounded-full shadow-sm transition-all duration-300 ${idx === currentIndex ? 'bg-amber-glow scale-125' : 'bg-white/30'}`} 
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
            
            {/* Ambient Glow Behind */}
            <div className="absolute -inset-4 bg-amber-glow/5 blur-3xl -z-10 rounded-full opacity-50 pointer-events-none" />
        </div>
    );
};
