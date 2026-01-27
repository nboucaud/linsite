
import React, { useState, useRef, useEffect } from 'react';
import { PlayCircle } from 'lucide-react';

interface AlbumArtProps {
  src: string;
  videoSrc?: string;
  title: string;
  isPlaying: boolean;
  className?: string;
}

export const AlbumArt: React.FC<AlbumArtProps> = ({ src, videoSrc, title, isPlaying, className }) => {
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // --- CROSS-FADE LOGIC ---
  const [activeSrc, setActiveSrc] = useState(src);
  const [bufferSrc, setBufferSrc] = useState(src);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (src !== activeSrc) {
        // 1. Lock the current image into the buffer (background)
        setBufferSrc(activeSrc);
        // 2. Update the active image (foreground) but keep it hidden initially via opacity
        setActiveSrc(src);
        setIsTransitioning(true);

        // 3. Trigger the fade-in animation slightly after render
        const startTimer = setTimeout(() => {
            setIsTransitioning(false);
        }, 50);

        // 4. Sync buffer after transition is theoretically complete (cleanup)
        const endTimer = setTimeout(() => {
            setBufferSrc(src);
        }, 1000); // Matches duration-1000

        return () => { clearTimeout(startTimer); clearTimeout(endTimer); };
    }
  }, [src, activeSrc]);

  // Handle video playback based on showVideo state
  useEffect(() => {
    if (videoRef.current) {
      if (showVideo) {
        videoRef.current.play().catch(e => console.log("Video autoplay prevented", e));
      } else {
        videoRef.current.pause();
      }
    }
  }, [showVideo]);

  // Auto-play video if provided
  useEffect(() => {
      if (videoSrc) setShowVideo(true);
      else setShowVideo(false);
  }, [videoSrc]);

  const toggleMedia = () => {
    if (videoSrc) {
      setShowVideo(prev => !prev);
    }
  };

  return (
    <div 
      className={`relative group perspective-1000 ${videoSrc ? 'cursor-pointer' : ''} ${className || 'w-64 h-64 md:w-96 md:h-96 mx-auto mb-12'}`}
      onClick={toggleMedia}
    >
      <div className={`absolute inset-0 bg-black/60 rounded-lg blur-3xl transform translate-y-8 scale-90 ${className ? 'opacity-40' : ''}`} />
      
      <div className={`relative w-full h-full rounded-lg overflow-hidden border border-white/10 shadow-2xl transition-all duration-1000 ease-out transform ${
        isPlaying && !className ? 'scale-105 rotate-1' : 'scale-100'
      }`}>
        
        {/* --- IMAGE LAYERS --- */}
        <div className={`absolute inset-0 transition-opacity duration-700 ${showVideo ? 'opacity-0' : 'opacity-100'}`}>
           
           {/* Buffer Image (Previous Track) - Stays visible behind while new one fades in */}
           <img 
            src={bufferSrc} 
            alt={title} 
            className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] contrast-[1.1]"
           />

           {/* Active Image (New Track) - Fades in */}
           <img 
            src={activeSrc} 
            alt={title} 
            className={`absolute inset-0 w-full h-full object-cover grayscale-[0.2] contrast-[1.1] transition-opacity duration-1000 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
           />
        </div>

        {/* --- VIDEO LAYER --- */}
        {videoSrc && (
          <video
            ref={videoRef}
            src={videoSrc}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${showVideo ? 'opacity-100' : 'opacity-0'}`}
            loop
            muted
            playsInline
          />
        )}
        
        {/* Texture Overlays */}
        <div className="absolute inset-0 record-rim-light mix-blend-overlay opacity-30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        
        {/* Playback Glow */}
        {isPlaying && !className && (
          <div className="absolute -inset-2 bg-amber-glow/5 blur-xl animate-pulse pointer-events-none" />
        )}

        {/* Hint to play video if available and not showing */}
        {videoSrc && !showVideo && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="bg-black/40 backdrop-blur-sm p-3 rounded-full text-white/80 transform scale-75 group-hover:scale-100 transition-transform">
                    <PlayCircle size={24} />
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
