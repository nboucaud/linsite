
import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { ChevronDown, Menu, X, Beaker } from 'lucide-react';

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
    items: [
        { label: "Logistics", path: "our-clients/industries/logistics" },
        { label: "SMB Operations", path: "our-clients/industries/smb-operations" },
        { label: "Industrial Systems", path: "our-clients/industries/industrials" },
        { label: "Healthcare", path: "our-clients/industries/healthcare" },
        { label: "Natural Resources", path: "our-clients/industries/natural-resources" }
    ]
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
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#020202]/90 backdrop-blur-md border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-24 md:h-28 flex items-center justify-between">
        {/* LOGO */}
        <button onClick={() => handleNav('platform')} className="flex items-center gap-3 group z-50 h-full overflow-hidden">
          {/* Scaled image to crop top/bottom whitespace. Reduced to 115% */}
          <img 
            src="https://uapriywlkpcpupdp.public.blob.vercel-storage.com/brand_logo_infogito.webp" 
            alt="Infogito Logo" 
            className="h-[115%] w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
          />
        </button>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-white/60">
          {Object.entries(SITEMAP).map(([label, data]) => (
            <div 
                key={label} 
                className="relative group h-full flex items-center" 
                onMouseEnter={() => setActiveDropdown(label)} 
                onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                onClick={() => handleNav(data.path)}
                className={`flex items-center gap-1 hover:text-white transition-colors py-8 ${currentPath.startsWith(data.path) ? 'text-[#69B7B2]' : ''}`}
              >
                {label}
                {(data.children || data.items) && (
                    <ChevronDown size={12} className={`transition-transform duration-300 ${activeDropdown === label ? 'rotate-180' : ''}`} />
                )}
              </button>

              {/* DROPDOWN */}
              {(data.children || data.items) && (
                <div 
                    className={`
                        absolute top-[80%] left-0 w-[240px] bg-[#0a0a0c] border border-white/10 rounded-xl shadow-2xl p-2 
                        transition-all duration-200 origin-top
                        flex flex-col gap-1
                        ${activeDropdown === label ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}
                    `}
                >
                  {/* Items */}
                  {data.items?.map(item => (
                      <button 
                        key={item.path} 
                        onClick={(e) => { e.stopPropagation(); handleNav(item.path); }} 
                        className="block w-full text-left text-white/60 hover:text-white text-xs hover:bg-white/5 p-3 rounded-lg transition-colors font-medium"
                      >
                          {item.label}
                      </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* CONTACT BUTTON */}
          <button 
            onClick={() => handleNav('contact')} 
            className="px-6 py-2 rounded-full bg-white/5 hover:bg-white hover:text-black text-white transition-all duration-300 hover:scale-105 active:scale-95 font-medium"
          >
            Get In Touch
          </button>

          {/* INFOGITO LABS - Special Item */}
          <button 
            onClick={() => handleNav('about/careers')} 
            className="group relative flex items-center gap-2 px-4 py-2 rounded-full overflow-hidden transition-all duration-300 hover:bg-white/5"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
            <Beaker size={14} className="text-purple-400 group-hover:text-purple-300 transition-colors group-hover:rotate-12" />
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent font-bold tracking-wide group-hover:from-purple-300 group-hover:to-indigo-300">
                Infogito Labs
            </span>
          </button>
          
        </div>

        {/* MOBILE TOGGLE */}
        <button 
            className="lg:hidden text-white/70 hover:text-white transition-colors p-2" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <div className={`lg:hidden fixed inset-0 bg-[#020202] z-40 transition-transform duration-300 pt-36 px-6 overflow-y-auto ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="space-y-8 pb-12">
            {Object.entries(SITEMAP).map(([label, data]) => (
                <div key={label} className="border-b border-white/10 pb-6 animate-in slide-in-from-right-4 fade-in duration-500">
                    <button 
                        onClick={() => handleNav(data.path)} 
                        className="text-2xl font-serif text-white mb-4 block w-full text-left"
                    >
                        {label}
                    </button>
                    
                    {data.items && (
                        <div className="pl-4 space-y-4 border-l border-white/10 ml-1">
                            {data.items.map(item => (
                                <button 
                                    key={item.path} 
                                    onClick={() => handleNav(item.path)} 
                                    className="block text-white/60 text-base hover:text-[#69B7B2] transition-colors text-left w-full"
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            ))}
            
            <button 
                onClick={() => handleNav('contact')} 
                className="w-full py-4 bg-[#69B7B2] text-black font-bold uppercase tracking-widest text-sm rounded-lg"
            >
                Get In Touch
            </button>

            <button 
                onClick={() => handleNav('about/careers')} 
                className="w-full text-left text-xl font-serif text-purple-400 mb-8 block animate-in slide-in-from-right-4 fade-in duration-500"
            >
                Infogito Labs
            </button>
        </div>
      </div>
    </nav>
  );
};
