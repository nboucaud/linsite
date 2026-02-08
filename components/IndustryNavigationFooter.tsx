
import React from 'react';
import { Truck, Briefcase, Factory, Activity, Globe, ArrowRight } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

interface Industry {
    id: string;
    title: string;
    desc: string;
    path: string;
    icon: any;
    color: string;
}

const INDUSTRIES: Industry[] = [
    { id: 'logistics', title: "Logistics", desc: "Global movement & coordination.", path: "our-clients/industries/logistics", icon: Truck, color: "#06b6d4" },
    { id: 'smb', title: "Business Operations", desc: "High-velocity lean tooling.", path: "our-clients/industries/business-operations", icon: Briefcase, color: "#8b5cf6" },
    { id: 'industrials', title: "Industrials", desc: "Heavy asset reliability.", path: "our-clients/industries/industrials", icon: Factory, color: "#f59e0b" },
    { id: 'healthcare', title: "Healthcare", desc: "Compliance & capacity.", path: "our-clients/industries/healthcare", icon: Activity, color: "#14b8a6" },
    { id: 'resources', title: "Resources", desc: "Physical constraints.", path: "our-clients/industries/natural-resources", icon: Globe, color: "#10b981" }
];

export const IndustryNavigationFooter: React.FC<{ currentId: string }> = ({ currentId }) => {
    const { navigateTo } = useNavigation();
    const others = INDUSTRIES.filter(i => i.id !== currentId);

    return (
        <section className="py-24 bg-[#020202] border-t border-white/10 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/5 via-[#020202] to-[#020202] pointer-events-none" />
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2 font-mono flex items-center gap-2">
                            <span className="w-2 h-2 bg-[#69B7B2] rounded-full animate-pulse" />
                            System-Wide Intelligence
                        </div>
                        <h2 className="text-3xl md:text-4xl font-serif text-white">
                            The Connected Economy.
                        </h2>
                    </div>
                    <p className="text-white/50 text-sm max-w-md leading-relaxed">
                        Infogito doesn't just solve isolated problems. We build the operating system for the physical world, connecting insights across supply chains, care networks, and industrial grids.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {others.map((item) => (
                        <button 
                            key={item.id}
                            onClick={() => navigateTo(item.path)}
                            className="group relative p-6 bg-[#0a0a0c] border border-white/5 hover:border-white/20 rounded-xl text-left transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 rounded-lg bg-white/5 text-white/60 group-hover:text-white group-hover:bg-white/10 transition-colors" style={{ color: item.color }}>
                                        <item.icon size={20} />
                                    </div>
                                    <ArrowRight size={16} className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                </div>
                                
                                <div className="mt-auto">
                                    <h3 className="font-bold text-white text-lg mb-1 group-hover:text-white transition-colors">{item.title}</h3>
                                    <p className="text-xs text-white/40 group-hover:text-white/60">{item.desc}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
                
                {/* Standard Footer Links underneath */}
                <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center opacity-40 text-[10px] uppercase tracking-widest font-mono text-white">
                    <div className="flex gap-6 mb-4 md:mb-0">
                        <span>© 2026 Infogito LLC</span>
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Security</a>
                    </div>
                    <div>
                        Deployed in New York, NY
                    </div>
                </div>
            </div>
        </section>
    );
};
