
import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { ChevronDown, Menu, X, ChevronRight } from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
}

interface NavSection {
  path: string;
  items?: NavItem[];
  children?: Record<string, NavSection>;
}

const SITEMAP: Record<string, NavSection> = {
  "Our Clients": {
    path: "our-clients",
    // Removed specific Industry children links to prevent deep navigation
  },
  "Trust Center": {
    path: "trust-center"
  }
};

export const GlobalNav: React.FC = () => {
  const { navigateTo, currentPath } = useNavigation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleNav = (path: string) => {
    navigateTo(path);
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#020202]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        {/* LOGO (Navigates to Landing/Platform) */}
        <button onClick={() => handleNav('platform')} className="flex items-center gap-3 group z-50">
          <img src="https://uapriywlkpcpupdp.public.blob.vercel-storage.com/brand_logo_infogito.webp" alt="Infogito Logo" className="h-12 md:h-16 w-auto object-contain transition-transform group-hover:scale-105" />
        </button>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-white/60">
          {Object.entries(SITEMAP).map(([label, data]) => (
            <div key={label} className="relative group" onMouseEnter={() => setActiveDropdown(label)} onMouseLeave={() => setActiveDropdown(null)}>
              <button 
                onClick={() => handleNav(data.path)}
                className={`flex items-center gap-1 hover:text-white transition-colors py-8 ${currentPath.startsWith(data.path) ? 'text-[#69B7B2]' : ''}`}
              >
                {label}
                {(data.children || data.items) && <ChevronDown size={12} className={`transition-transform duration-300 ${activeDropdown === label ? 'rotate-180' : ''}`} />}
              </button>

              {/* MEGA MENU DROPDOWN (If items exist) */}
              {(data.children || data.items) && (
                <div className={`absolute top-full left-0 w-[500px] bg-[#0a0a0c] border border-white/10 rounded-xl shadow-2xl p-6 grid grid-cols-2 gap-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0`}>
                  
                  {/* DIRECT ITEMS */}
                  {data.items && (
                      <div className="col-span-2 space-y-2">
                          {data.items.map(item => (
                              <button key={item.path} onClick={(e) => { e.stopPropagation(); handleNav(item.path); }} className="block w-full text-left text-white/60 hover:text-[#69B7B2] text-sm hover:bg-white/5 p-2 rounded transition-colors">
                                  {item.label}
                              </button>
                          ))}
                      </div>
                  )}

                  {/* NESTED CHILDREN */}
                  {data.children && Object.entries(data.children).map(([subLabel, subData]) => (
                    <div key={subLabel}>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3 border-b border-white/5 pb-2">
                        {subLabel}
                      </h4>
                      <div className="space-y-1">
                        {subData.items?.map(item => (
                          <button
                            key={item.path}
                            onClick={(e) => { e.stopPropagation(); handleNav(item.path); }}
                            className="block w-full text-left text-xs text-white/60 hover:text-white hover:pl-2 transition-all duration-200 py-1.5"
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          <button onClick={() => handleNav('contact')} className="hover:text-white transition-colors">Get In Touch</button>
        </div>

        {/* MOBILE TOGGLE */}
        <button className="lg:hidden text-white/70" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-24 left-0 w-full h-[calc(100vh-6rem)] bg-[#020202] overflow-y-auto p-6 space-y-6">
            {Object.entries(SITEMAP).map(([label, data]) => (
                <div key={label} className="border-b border-white/10 pb-4">
                    <button onClick={() => handleNav(data.path)} className="text-xl font-serif text-white mb-4 block w-full text-left">{label}</button>
                    
                    {data.items && (
                        <div className="pl-4 space-y-3 mb-4">
                            {data.items.map(item => (
                                <button key={item.path} onClick={() => handleNav(item.path)} className="block text-white/60 text-sm">{item.label}</button>
                            ))}
                        </div>
                    )}

                    {data.children && Object.entries(data.children).map(([subLabel, subData]) => (
                        <div key={subLabel} className="pl-4 mb-4">
                            <div className="text-[10px] uppercase text-white/30 mb-2">{subLabel}</div>
                            <div className="space-y-3 pl-2 border-l border-white/10">
                                {subData.items?.map(item => (
                                    <button key={item.path} onClick={() => handleNav(item.path)} className="block text-white/60 text-sm text-left">{item.label}</button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
            <button onClick={() => handleNav('contact')} className="text-xl font-serif text-white block w-full text-left">Get In Touch</button>
        </div>
      )}
    </nav>
  );
};
