
export type ChallengeType = 'tuner' | 'slide-puzzle' | 'circuit' | 'compositor' | 'hard-compositor' | 'redaction' | 'equalizer' | 'quiz';

export interface PuzzleData {
  id: string;
  question: string;
  answer: string;
  hint: string;
}

export interface ChallengeData {
  id: string;
  type: ChallengeType;
  title: string;
  description: string;
  hint?: string;
  tunerData?: {
    targetFrequency: number;
    tolerance: number;
    quote: string;
    author: string;
    topic: string;
  };
  slideData?: {
    imageUrl: string;
    gridSize: number;
  };
  circuitData?: {
    gridSize: number;
    start: [number, number]; 
    end: [number, number];
    layout: number[][]; 
  };
  compositorData?: {
    background: string;
    layers: {
      id: string;
      src?: string; 
      type: 'image' | 'text' | 'shape';
      content?: string;
      targetX: number; 
      targetY: number; 
      width: number; 
      tolerance: number;
      color?: string;
      blendMode?: 'normal' | 'multiply' | 'screen' | 'overlay' | 'difference' | 'exclusion';
      rotation?: number; 
    }[];
  };
  redactionData?: {
    fullText: string;
    requiredIndices: number[];
    forbiddenIndices: number[];
    maxVisible: number;
  };
  equalizerData?: {
    labels: string[];
    targetValues: number[];
    tolerance: number;
  };
  quizData?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export const LORE_BIBLE = {
    title: "System Architecture",
    subtitle: "Infogito Platform Overview",
    abstract: "Operational intelligence for the enterprise.",
    sections: {},
    carey: { role: "", philosophy: "", flaw: "", markers: "" },
    victor: { role: "", philosophy: "", flaw: "", markers: "" }
};

export const TRACK_STORIES: Record<string, { title: string; segments: string[] }> = {
  'default': {
      title: "SYSTEM LOG",
      segments: [
          "Initializing secure environment.",
          "Access granted to authorized personnel only."
      ]
  }
};

export const PUZZLES: PuzzleData[] = [];
export const CHALLENGES: ChallengeData[] = [];
