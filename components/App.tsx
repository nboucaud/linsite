
import React, { Suspense } from 'react';
import { NavigationProvider, useNavigation } from '../context/NavigationContext';
import { GlobalNav } from './components/GlobalNav';
import { Loader2 } from 'lucide-react';

// --- EAGER IMPORTS (Critical Path) ---
// LandingPage remains eager to ensure the Largest Contentful Paint (LCP) is fast.
import { LandingPage } from './components/LandingPage'; 

// --- LAZY IMPORTS (Code Splitting) ---
// These components are split into separate chunks and loaded only when requested.
const CompliancePage = React.lazy(() => import('./components/CompliancePage').then(module => ({ default: module.CompliancePage })));
const SmallBusinessPage = React.lazy(() => import('./components/SmallBusinessPage').then(module => ({ default: module.SmallBusinessPage })));
const ContactPage = React.lazy(() => import('./components/ContactPage').then(module => ({ default: module.ContactPage })));
const OurWorkPage = React.lazy(() => import('./components/OurWorkPage').then(module => ({ default: module.OurWorkPage })));
const LogisticsPage = React.lazy(() => import('./components/LogisticsPage').then(module => ({ default: module.LogisticsPage })));
const HealthcarePage = React.lazy(() => import('./components/HealthcarePage').then(module => ({ default: module.HealthcarePage })));
const IndustrialsPage = React.lazy(() => import('./components/IndustrialsPage').then(module => ({ default: module.IndustrialsPage })));
const NaturalResourcesPage = React.lazy(() => import('./components/NaturalResourcesPage').then(module => ({ default: module.NaturalResourcesPage })));
const OurClientsPage = React.lazy(() => import('./components/OurClientsPage').then(module => ({ default: module.OurClientsPage })));
const CareersPage = React.lazy(() => import('./components/CareersPage').then(module => ({ default: module.CareersPage })));
const TrustCenterPage = React.lazy(() => import('./components/TrustCenterPage').then(module => ({ default: module.TrustCenterPage })));
const GenericPage = React.lazy(() => import('./components/GenericPage').then(module => ({ default: module.GenericPage })));

// --- LOADING STATE ---
const PageLoader = () => (
  <div className="min-h-screen w-full bg-[#020202] flex items-center justify-center z-0">
    <div className="flex flex-col items-center gap-4">
      <Loader2 size={32} className="text-[#69B7B2] animate-spin" />
      <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest animate-pulse">Initializing...</span>
    </div>
  </div>
);

// Simple Home Redirector or Splash
const HomePage = () => {
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
  if (currentPath === 'trust-center') return <TrustCenterPage />;
  
  // 2. EXACT MATCHES FOR EXISTING COMPLEX PAGES
  if (currentPath === 'platform' || currentPath === 'home') {
      return <LandingPage />;
  }
  if (currentPath === 'platform/features/security-and-privacy') {
      return <CompliancePage />;
  }
  if (currentPath === 'our-clients/industries/business-operations') {
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
      return <GenericPage title="Agent Workflows" subtitle="Build complex autonomous agents visually." category="Platform Feature" />;
  }

  // 3. SECTION ROOTS
  if (currentPath.startsWith('our-work')) {
      return <OurWorkPage />;
  }

  // 4. PATTERN MATCHING FOR GENERIC PAGES
  
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
      {/* 
        Suspense Boundary:
        Catches the loading state of lazy components.
        This allows the GlobalNav to remain interactive while the page loads.
      */}
      <Suspense fallback={<PageLoader />}>
        <MainContent />
      </Suspense>
    </NavigationProvider>
  );
};

export default App;
