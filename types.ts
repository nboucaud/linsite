
import { Explanation } from './lib/explanations';

export interface WordData {
  lyric: string;
  timeMs: number;
}

export type VisualStyle = 
  | 'neon-pulse' 
  | 'chromatic-ghost' 
  | 'kinetic-float' 
  | 'type-brutal' 
  | 'focus-depth' 
  | 'prism-split' 
  | 'weight-shift' 
  | 'strobe-sync' 
  | 'scanline-crt'
  | 'perspective-tilt'
  | 'nuclear-haze'
  | 'neural-spark'
  | 'snare-impact'
  | 'pillars'
  | 'boids'
  | 'spiders'
  | 'pendulum'
  | 'lorenz'
  | 'vhs-tracking'
  | 'containment-box'
  | 'chrome-liquid'
  | 'construct'
  | 'loom-weave';

export type LightingEffect = 
  | 'vertical-flow'
  | 'constellation-net'
  | 'retro-grid' 
  | 'spotlight-sway'
  | 'focus-depth';

export interface RhythmLayer {
  interval: number;
  offset: number;
  intensity: number;
}

export interface RhythmProfile {
  layers: {
    kick?: RhythmLayer;
    snare?: RhythmLayer;
    hihat?: RhythmLayer;
    melody?: RhythmLayer;
  };
}

export interface TrackLore {
  mood: 'manic' | 'depressed' | 'nostalgic' | 'analytical' | 'aggressive' | 'tired';
  productionNotes: string[]; 
  lyricFocus: string[]; 
  backstory: string; 
}

export interface MediaItem {
  type: 'image' | 'video';
  url: string;
  filename: string;
}

// --- NEW DEEP ANALYSIS TYPES ---
export interface DeepAnalysis {
  isDeep: boolean;
  meta?: {
    role: string;
    key_context: string;
    emotional_valence: string;
  };
  gan?: {
    generator: string;
    discriminator: string;
    truth: string;
  };
  nodes: {
    lyric: string;
    surface: string;
    deep: { category: string; text: string }[];
    rhymes?: { word: string; score: number }[];
  }[];
}

export interface TrackData {
  id: string;
  title: string;
  artist: string;
  audioSrc: string; 
  jsonSrc?: string; // Lyrics JSON
  explanationSrc?: string; // Explanations JSON
  coverArt: string;
  videoSrc?: string; // Legacy background video
  media?: MediaItem[]; // New carousel media
  stanzas: string[][]; 
  wordMap: WordData[];
  bpm: number;
  key?: string;
  color?: string; // HEX Color for UI theming
  visualStyle: VisualStyle;
  lightingEffect: LightingEffect;
  rhythmProfile?: RhythmProfile;
  // Unified Analysis Field
  analysis?: DeepAnalysis;
  // Legacy Fallback
  explanations?: Record<string, Explanation[]>;
  lore: TrackLore;
  hidden?: boolean; 
}

export interface AudioContextType {
  isPlaying: boolean;
  currentTrackId: string | null;
  currentTime: number; 
  duration: number;
  volume: number;
  isMuted: boolean;
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  selectTrack: (trackId: string) => void;
  togglePlayPause: () => void;
  trackAssets: Record<string, { image?: string; video?: string; audio?: string }>;
  updateAsset: (trackId: string, type: 'image' | 'video' | 'audio', value: string) => void;
}
