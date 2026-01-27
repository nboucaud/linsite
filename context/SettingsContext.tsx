import React, { createContext, useContext, useState } from 'react';

interface SettingsContextType {
  showGlitches: boolean;
  showGrain: boolean;
  highContrast: boolean;
  toggleGlitches: () => void;
  toggleGrain: () => void;
  toggleContrast: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showGlitches, setShowGlitches] = useState(true);
  const [showGrain, setShowGrain] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  const toggleGlitches = () => setShowGlitches(prev => !prev);
  const toggleGrain = () => setShowGrain(prev => !prev);
  const toggleContrast = () => setHighContrast(prev => !prev);

  return (
    <SettingsContext.Provider value={{
      showGlitches,
      showGrain,
      highContrast,
      toggleGlitches,
      toggleGrain,
      toggleContrast
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
