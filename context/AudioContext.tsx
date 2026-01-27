
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AudioContextType, TrackData } from '../types';
import { TRACKS } from '../lib/data';

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(TRACKS[0].id);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  
  // Local asset mappings (persisted in localStorage)
  // We filter out 'audio' blobs on load because they expire on session refresh.
  const [trackAssets, setTrackAssets] = useState<Record<string, { image?: string; video?: string; audio?: string }>>(() => {
    try {
        const saved = localStorage.getItem('walled_garden_assets');
        if (!saved) return {};
        const parsed = JSON.parse(saved);
        
        // Clean up session-only blob URLs so we don't show "Local File Loaded" for broken links
        Object.keys(parsed).forEach(key => {
            if (parsed[key].audio && parsed[key].audio.startsWith('blob:')) {
                delete parsed[key].audio;
            }
        });
        return parsed;
    } catch(e) {
        return {};
    }
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number>(null);

  useEffect(() => {
    // Only persist image/video strings, audio blobs are session only usually, but we try anyway
    // Note: Blob URLs expire on unload, so this is just for text inputs.
    localStorage.setItem('walled_garden_assets', JSON.stringify(trackAssets));
  }, [trackAssets]);

  useEffect(() => {
    audioRef.current = new Audio();
    const audio = audioRef.current;
    audio.volume = volume;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };

    const handleError = (e: ErrorEvent) => {
        console.warn("Audio playback error handled:", e);
        setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError as any);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError as any);
      audio.pause();
      audio.src = "";
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowLeft':
          if (audioRef.current) seek(Math.max(0, audioRef.current.currentTime - 5));
          break;
        case 'ArrowRight':
          if (audioRef.current) seek(Math.min(duration, audioRef.current.currentTime + 5));
          break;
        case 'KeyM':
          toggleMute();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [duration, isPlaying]);

  const updateTime = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      animationFrameRef.current = requestAnimationFrame(updateTime);
    }
  };

  // Consolidated Audio Control Effect
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrackId) return;

    const track = TRACKS.find(t => t.id === currentTrackId);
    if (!track) return;

    // CHECK FOR ASSET OVERRIDE
    const overrideSrc = trackAssets[currentTrackId]?.audio;
    const finalSrc = overrideSrc || track.audioSrc;

    // GUARD: If no source, stop.
    if (!finalSrc) {
        setIsPlaying(false);
        return;
    }

    // Sync Source
    // Check if it's a blob url or absolute path to avoid reloading same src
    if (audio.src !== finalSrc && audio.src !== new URL(finalSrc, window.location.href).href) {
      audio.src = finalSrc;
      audio.load();
    }

    // Sync Playback State
    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Ignore AbortError as it's a normal result of track switching or pausing quickly
          // Also ignore NotSupportedError which happens with dummy/empty links
          if (error.name !== 'AbortError' && error.name !== 'NotSupportedError') {
            console.error("Playback failed:", error);
            setIsPlaying(false);
          }
        });
      }
      animationFrameRef.current = requestAnimationFrame(updateTime);
    } else {
      audio.pause();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, currentTrackId, trackAssets]); // Added trackAssets dependency

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);
  const togglePlayPause = () => setIsPlaying(prev => !prev);
  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const selectTrack = (trackId: string) => {
    if (trackId !== currentTrackId) {
      setCurrentTrackId(trackId);
      setIsPlaying(true);
    }
  };

  const toggleMute = () => setIsMuted(prev => !prev);

  const updateAsset = (trackId: string, type: 'image' | 'video' | 'audio', value: string) => {
    setTrackAssets(prev => ({
      ...prev,
      [trackId]: {
        ...prev[trackId],
        [type]: value
      }
    }));
  };

  return (
    <AudioContext.Provider value={{
      isPlaying,
      currentTrackId,
      currentTime,
      duration,
      volume,
      isMuted,
      play,
      pause,
      seek,
      selectTrack,
      togglePlayPause,
      setVolume,
      toggleMute,
      trackAssets,
      updateAsset
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within an AudioProvider');
  return context;
};
