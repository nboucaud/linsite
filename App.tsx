
import React from 'react';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { GlobalNav } from './components/GlobalNav';

// Page Components
import { LandingPage } from './components/LandingPage'; // Serves as "Platform" now
import { CompliancePage } from './components/CompliancePage'; // Serves as Security & Privacy
import { SmallBusinessPage } from './components/SmallBusinessPage'; // Serves as SMB
import { GenericPage } from './components/GenericPage';
import { ContactPage } from './components/ContactPage';
import { OurWorkPage } from './components/OurWorkPage';
import { LogisticsPage } from './components/LogisticsPage';
import { HealthcarePage } from './components/HealthcarePage';
import { IndustrialsPage } from './components/IndustrialsPage';
import { NaturalResourcesPage } from './components/NaturalResourcesPage';
import { OurClientsPage } from './components/OurClientsPage'; 
import { CareersPage } from './components/CareersPage';
import { DownloadHeroesPage } from './components/DownloadHeroesPage';
import { TrustCenterPage } from './components/TrustCenterPage'; // Newly added

// Simple Home Redirector or Splash
const HomePage = () => {
    // Ideally this would be a high level intro, but for now we reuse GenericPage or redirect
    return (
        <GenericPage 
            title="Intelligence for the Real World." 
            subtitle="Infogito bridges the gap between complex enterprise data and actionable human insight." 
            category="Welcome" 
        />
    );
};

const MainContent = () => {
  const { currentPath } = useNavigation();

  // ROUTING LOGIC
  
  // 1. TOP LEVEL PAGES
  if (currentPath === 'contact') return <ContactPage />;
  if (currentPath === 'our-clients') return <OurClientsPage />; 
  if (currentPath === 'about/careers') return <CareersPage />;
  if (currentPath === 'download-heroes') return <DownloadHeroesPage />;
  if (currentPath === 'trust-center') return <TrustCenterPage />; // New Route
  
  // 2. EXACT MATCHES FOR EXISTING COMPLEX PAGES
  if (currentPath === 'platform' || currentPath === 'home') {
      return <LandingPage />;
  }
  if (currentPath === 'platform/features/security-and-privacy') {
      return <CompliancePage />;
  }
  if (currentPath === 'our-clients/industries/smb-operations') {
      return <SmallBusinessPage />;
  }
  if (currentPath === 'our-clients/industries/logistics') {
      return <LogisticsPage />;
  }
  if (currentPath === 'our-clients/industries/healthcare') {
      return <HealthcarePage />;
  }
  if (currentPath === 'our-clients/industries/industrials') {
      return <IndustrialsPage />;
  }
  if (currentPath === 'our-clients/industries/natural-resources') {
      return <NaturalResourcesPage />;
  }
  
  if (currentPath === 'platform/features/agentic-workflows') {
      return <GenericPage title="Agentic Workflows" subtitle="Build complex autonomous agents visually." category="Platform Feature" />;
  }

  // 3. SECTION ROOTS
  if (currentPath.startsWith('our-work')) {
      return <OurWorkPage />;
  }

  // 4. PATTERN MATCHING FOR GENERIC PAGES (Catch-all for subpages not explicitly handled)
  
  // INDUSTRIES
  if (currentPath.startsWith('our-clients/industries/')) {
      const industry = currentPath.split('/').pop()?.replace(/-/g, ' ');
      return <GenericPage title={industry || "Industry"} subtitle="Tailored AI solutions for your specific sector requirements." category="Industry Solution" />;
  }

  // FEATURES
  if (currentPath.startsWith('platform/features/')) {
      const feature = currentPath.split('/').pop()?.replace(/-/g, ' ');
      return <GenericPage title={feature || "Feature"} subtitle="Powerful capabilities built into the core of the Infogito platform." category="Platform Feature" />;
  }

  // Default / 404 Fallback to Home
  return <HomePage />;
};

const App: React.FC = () => {
  return (
    <NavigationProvider>
      <GlobalNav />
      {/* Standard padding handled by page components */}
      <div>
        <MainContent />
      </div>
    </NavigationProvider>
  );
};

export default App;
