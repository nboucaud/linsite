
import React, { createContext, useContext, useState, useEffect } from 'react';

// We now support any string path for the complex sitemap
export type PagePath = string;

interface NavigationContextType {
  currentPath: PagePath;
  navigateTo: (path: PagePath) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to platform as the "home" experience if requested, or root '/'
  const [currentPath, setCurrentPath] = useState<PagePath>('platform');

  const navigateTo = (path: PagePath) => {
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  // Optional: Handle browser back button (simple implementation)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.path) {
        setCurrentPath(event.state.path);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <NavigationContext.Provider value={{ currentPath, navigateTo }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) throw new Error('useNavigation must be used within NavigationProvider');
  return context;
};
