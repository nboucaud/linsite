
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
        { label: "Business Operations", path: "our-clients/industries/business-operations" },
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
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({});
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleNav = (path: string) => {
    navigateTo(path);
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    setMobileExpanded({});
  };

  const toggleMobileSection = (label: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMobileExpanded(prev => ({...prev, [label]: !prev[label]}));
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[500] ${mobileMenuOpen ? 'bg-[#020202]' : 'bg-[#020202]/90 backdrop-blur-md'} border-b border-white/10 transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-6 h-24 md:h-28 flex items-center justify-between relative z-[520]">
          {/* LOGO */}
          <button onClick={() => handleNav('platform')} className="flex items-center gap-3 group h-full overflow-hidden flex-shrink-0">
            <img 
              src="https://uapriywlkpcpupdp.public.blob.vercel-storage.com/brand_logo_infogito.webp" 
              alt="Infogito Logo" 
              className="h-[80%] md:h-[115%] w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
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
                        transition-all duration-200 origin-top z-[550]
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

          {/* INFOGITO LABS - Special Item (Hidden) */}
          {/* 
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
          */}


          {/* CONTACT BUTTON */}
          <button 
            onClick={() => handleNav('contact')} 
            className="px-6 py-2 rounded-full bg-white/5 hover:bg-white hover:text-black text-white transition-all duration-300 hover:scale-105 active:scale-95 font-medium"
          >
            Get In Touch
          </button>
          
        </div>

        {/* MOBILE TOGGLE */}
        <button 
            className="lg:hidden text-white/70 hover:text-white transition-colors p-2 z-[530] relative" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <div 
        className={`
            lg:hidden fixed inset-0 bg-[#020202] z-[490] 
            transition-transform duration-300 ease-out
            pt-32 px-6 overflow-y-auto
            ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="space-y-6 pb-20">
            {Object.entries(SITEMAP).map(([label, data]) => (
                <div key={label} className="border-b border-white/10 pb-6 animate-in slide-in-from-right-4 fade-in duration-500">
                    <button 
                        onClick={(e) => data.items ? toggleMobileSection(label, e) : handleNav(data.path)} 
                        className="text-2xl font-serif text-white mb-2 w-full text-left flex justify-between items-center py-2"
                    >
                        {label}
                        {data.items && (
                            <ChevronDown 
                                size={20} 
                                className={`text-white/50 transition-transform duration-300 ${mobileExpanded[label] ? 'rotate-180' : ''}`} 
                            />
                        )}
                    </button>
                    
                    {/* Collapsible Content - Distinct Visual Box */}
                    {data.items && mobileExpanded[label] && (
                        <div className="mt-4 bg-[#111] border border-white/10 rounded-xl p-2 animate-in slide-in-from-top-2 fade-in duration-200 shadow-inner">
                            {data.items.map(item => (
                                <button 
                                    key={item.path} 
                                    onClick={() => handleNav(item.path)} 
                                    className="block w-full text-left text-white/70 hover:text-white hover:bg-white/5 py-3 px-4 rounded-lg transition-colors text-base font-medium"
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            ))}
            
            {/* 
            <button 
                onClick={() => handleNav('about/careers')} 
                className="w-full text-left text-xl font-serif text-purple-400 mb-8 block animate-in slide-in-from-right-4 fade-in duration-500 py-2"
            >
                Infogito Labs
            </button>
            */}


            <button 
                onClick={() => handleNav('contact')} 
                className="w-full py-4 bg-[#69B7B2] text-black font-bold uppercase tracking-widest text-sm rounded-lg shadow-lg"
            >
                Get In Touch
            </button>
        </div>
      </div>
    </>
  );
};
