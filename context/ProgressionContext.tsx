
import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRACKS } from '../lib/data';

interface ProgressionContextType {
  unlockedTrackIds: string[];
  completedChapterIds: string[];
  activeChapterTrackId: string | null;
  viewingArchiveId: string | null;
  startChapter: (trackId: string) => void;
  openArchive: (trackId: string) => void;
  closeArchive: () => void;
  completeChapter: (trackId: string) => void;
  closeChapter: () => void;
  isTrackLocked: (trackId: string) => boolean;
  isChapterCompleted: (trackId: string) => boolean;
}

const ProgressionContext = createContext<ProgressionContextType | undefined>(undefined);

export const ProgressionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // UNLOCK ALL TRACKS BY DEFAULT
  const [unlockedTrackIds, setUnlockedTrackIds] = useState<string[]>(() => {
    return TRACKS.map(t => t.id);
  });

  const [completedChapterIds, setCompletedChapterIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('walled_garden_completed_chapters');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeChapterTrackId, setActiveChapterTrackId] = useState<string | null>(null);
  const [viewingArchiveId, setViewingArchiveId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('walled_garden_unlocks', JSON.stringify(unlockedTrackIds));
  }, [unlockedTrackIds]);

  useEffect(() => {
    localStorage.setItem('walled_garden_completed_chapters', JSON.stringify(completedChapterIds));
  }, [completedChapterIds]);

  const startChapter = (trackId: string) => {
    setActiveChapterTrackId(trackId);
  };

  const openArchive = (trackId: string) => {
    setViewingArchiveId(trackId);
  }

  const closeArchive = () => {
    setViewingArchiveId(null);
  }

  const completeChapter = (trackId: string) => {
    if (!completedChapterIds.includes(trackId)) {
        setCompletedChapterIds(prev => [...prev, trackId]);
    }
  };

  const closeChapter = () => {
    setActiveChapterTrackId(null);
  };

  const isTrackLocked = (trackId: string) => {
    // Force return false to ensure everything is visually unlocked
    return false;
  };

  const isChapterCompleted = (trackId: string) => {
    return completedChapterIds.includes(trackId);
  };

  return (
    <ProgressionContext.Provider value={{
      unlockedTrackIds,
      completedChapterIds,
      activeChapterTrackId,
      viewingArchiveId,
      startChapter,
      openArchive,
      closeArchive,
      completeChapter,
      closeChapter,
      isTrackLocked,
      isChapterCompleted
    }}>
      {children}
    </ProgressionContext.Provider>
  );
};

export const useProgression = () => {
  const context = useContext(ProgressionContext);
  if (!context) throw new Error('useProgression must be used within a ProgressionProvider');
  return context;
};
