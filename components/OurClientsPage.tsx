
import React, { useEffect, useRef, useState } from 'react';
import { 
    Users, Handshake, ShieldCheck, Target, ArrowRight, 
    Truck, Zap, Activity, Factory, Briefcase, 
    Globe, Network, Layers, ChevronRight, ArrowUpRight, ScanLine,
    Database, Cpu, Lock, CheckCircle2, Terminal
} from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

// --- VISUALIZER: 3D CLIENT NETWORK GLOBE ---
const ClientNetworkVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            mouseRef.current = { 
                x: (e.clientX - w / 2) / (w / 2), 
                y: (e.clientY - h / 2) / (h / 2) 
            };
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let w = canvas.parentElement?.clientWidth || window.innerWidth;
        let h = canvas.parentElement?.clientHeight || 600;
        canvas.width = w;
        canvas.height = h;

        let time = 0;
        let frameId: number;

        // --- GLOBE CONFIG ---
        const GLOBE_RADIUS = Math.min(w, h) * 0.35;
        const DOT_COUNT = 300; 
        const CONNECTION_DIST = 60;
        
        interface Point3D { x: number, y: number, z: number; type: 'client' | 'hub' }
        interface ProjectedPoint { x: number, y: number, z: number; scale: number; type: 'client' | 'hub' }

        const points: Point3D[] = [];
        const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

        for (let i = 0; i < DOT_COUNT; i++) {
            const y = 1 - (i / (DOT_COUNT - 1)) * 2; 
            const radius = Math.sqrt(1 - y * y);
            const theta = phi * i;

            const x = Math.cos(theta) * radius;
            const z = Math.sin(theta) * radius;

            points.push({ 
                x: x * GLOBE_RADIUS, 
                y: y * GLOBE_RADIUS, 
                z: z * GLOBE_RADIUS,
                type: Math.random() > 0.94 ? 'hub' : 'client' // ~6% hubs
            });
        }

        // Buffer
        const projected: ProjectedPoint[] = new Array(DOT_COUNT).fill(null).map(() => ({ x: 0, y: 0, z: 0, scale: 0, type: 'client' }));

        const render = () => {
            time += 0.003; 
            ctx.fillStyle = '#020202';
            ctx.fillRect(0, 0, w, h);

            const cx = w / 2;
            const cy = h / 2;

            const targetRotX = mouseRef.current.y * 0.3;
            const targetRotY = mouseRef.current.x * 0.3 + time;

            const cosY = Math.cos(targetRotY);
            const sinY = Math.sin(targetRotY);
            const cosX = Math.cos(targetRotX);
            const sinX = Math.sin(targetRotX);

            // Project
            for(let i=0; i<DOT_COUNT; i++) {
                const p = points[i];
                let x1 = p.x * cosY - p.z * sinY;
                let z1 = p.z * cosY + p.x * sinY;
                let y1 = p.y * cosX - z1 * sinX;
                let z2 = z1 * cosX + p.y * sinX;

                const scale = 800 / (800 - z2); 
                projected[i].x = x1 * scale + cx;
                projected[i].y = y1 * scale + cy;
                projected[i].z = z2;
                projected[i].scale = scale;
                projected[i].type = p.type;
            }

            // Connections
            ctx.lineWidth = 0.5;
            for(let i=0; i<DOT_COUNT; i++) {
                const p1 = projected[i];
                if (p1.z < -100) continue; 

                if (p1.type === 'hub') {
                    for(let j=0; j<DOT_COUNT; j++) {
                        if (i === j) continue;
                        const p2 = projected[j];
                        if (p2.z < -100) continue;

                        const dx = p1.x - p2.x;
                        const dy = p1.y - p2.y;
                        const distSq = dx*dx + dy*dy;
                        const maxDist = CONNECTION_DIST * p1.scale;
                        
                        if (distSq < maxDist * maxDist) {
                            const dist = Math.sqrt(distSq);
                            const alpha = (1 - dist / maxDist) * 0.4;
                            ctx.strokeStyle = `rgba(105, 183, 178, ${alpha})`;
                            ctx.beginPath();
                            ctx.moveTo(p1.x, p1.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.stroke();
                        }
                    }
                }
            }

            // Dots
            for(let i=0; i<DOT_COUNT; i++) {
                const p = projected[i];
                if (p.z < -200) continue; 

                const alpha = Math.max(0.1, (p.z + GLOBE_RADIUS) / (GLOBE_RADIUS * 2));
                
                if (p.type === 'hub') {
                    ctx.fillStyle = '#fff';
                    ctx.shadowBlur = 10 * p.scale;
                    ctx.shadowColor = '#69B7B2';
                    const size = 2.5 * p.scale;
                    ctx.beginPath(); ctx.arc(p.x, p.y, size, 0, Math.PI*2); ctx.fill();
                    ctx.shadowBlur = 0;
                    
                    ctx.strokeStyle = `rgba(105, 183, 178, ${0.5 + Math.sin(time * 5) * 0.5})`;
                    ctx.beginPath(); ctx.arc(p.x, p.y, size * 2, 0, Math.PI*2); ctx.stroke();
                } else {
                    ctx.fillStyle = `rgba(105, 183, 178, ${alpha})`;
                    const size = 1.2 * p.scale;
                    ctx.beginPath(); ctx.arc(p.x, p.y, size, 0, Math.PI*2); ctx.fill();
                }
            }

            const grad = ctx.createRadialGradient(cx, cy, GLOBE_RADIUS * 0.8, cx, cy, GLOBE_RADIUS * 1.2);
            grad.addColorStop(0, 'rgba(105, 183, 178, 0.0)');
            grad.addColorStop(1, 'rgba(105, 183, 178, 0.05)');
            ctx.fillStyle = grad;
            ctx.beginPath(); ctx.arc(cx, cy, GLOBE_RADIUS * 1.2, 0, Math.PI*2); ctx.fill();

            frameId = requestAnimationFrame(render);
        };
        render();

        const handleResize = () => {
            if (canvas.parentElement) {
                w = canvas.parentElement.clientWidth;
                h = canvas.parentElement.clientHeight;
                canvas.width = w;
                canvas.height = h;
            }
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(frameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-80" />;
};

const INDUSTRIES = [
    {
        id: 'logistics',
        title: "Logistics & Supply Chain",
        desc: "Orchestrating global movement in real-time.",
        path: "our-clients/industries/logistics",
        icon: Truck,
        color: "#06b6d4"
    },
    {
        id: 'smb',
        title: "SMB Operations",
        desc: "Enterprise-grade tools for lean teams.",
        path: "our-clients/industries/smb-operations",
        icon: Briefcase,
        color: "#8b5cf6"
    },
    {
        id: 'industrials',
        title: "Industrial Systems",
        desc: "Reliability for heavy assets and manufacturing.",
        path: "our-clients/industries/industrials",
        icon: Factory,
        color: "#f59e0b"
    },
    {
        id: 'healthcare',
        title: "Healthcare",
        desc: "Compliance and capacity in critical care.",
        path: "our-clients/industries/healthcare",
        icon: Activity,
        color: "#14b8a6"
    },
    {
        id: 'resources',
        title: "Natural Resources",
        desc: "Managing physical constraints and geology.",
        path: "our-clients/industries/natural-resources",
        icon: Globe,
        color: "#10b981"
    }
];

const PHILOSOPHY = [
    {
        title: "Shared Risk",
        desc: "We don't charge for shelfware. Our contracts are structured around outcomes—we only succeed when your operational metrics improve.",
        icon: Handshake,
        color: "#10b981"
    },
    {
        title: "Deep Embedding",
        desc: "We deploy forward-engineers into your environment. We learn your acronyms, your bottlenecks, and your culture before writing code.",
        icon: Users,
        color: "#3b82f6"
    },
    {
        title: "Sovereignty First",
        desc: "Your data remains yours. Our architecture ensures intelligence models are trained on your data but owned by you, never shared.",
        icon: ShieldCheck,
        color: "#8b5cf6"
    },
    {
        title: "Long Horizons",
        desc: "Industrial transformation takes time. We build systems designed to last decades, not just until the next funding cycle.",
        icon: Target,
        color: "#f59e0b"
    }
];

const IMPACT_METRICS = [
    { label: "Assets Monitored", value: "$42B+", icon: Database },
    { label: "Uptime Protected", value: "99.99%", icon: Activity },
    { label: "Decisions Automated", value: "1.2M/day", icon: Cpu },
    { label: "Security Incidents", value: "0", icon: ShieldCheck },
];

const PARTNER_CODES = [
    "DOE_GRID_SECURE", "NHS_CLINICAL_OPS", "MAERSK_LOG_AI", 
    "RIO_MINING_AUTO", "FEDEX_SORT_OPT", "TESLA_MFG_FLOW",
    "SHELL_ASSET_INT", "PFIZER_COMP_TRK", "JP_MORGAN_RISK"
];

const PhilosophyCard: React.FC<{ item: typeof PHILOSOPHY[0] }> = ({ item }) => (
    <div className="relative group p-8 rounded-3xl bg-[#0c0c0e] border border-white/5 hover:border-white/10 transition-all duration-500 overflow-hidden hover:-translate-y-2">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div 
            className="absolute -right-12 -top-12 w-40 h-40 bg-[var(--card-color)] blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 rounded-full"
            style={{ '--card-color': item.color } as React.CSSProperties}
        />
        <div className="relative z-10">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white/50 group-hover:text-white group-hover:scale-110 transition-all duration-300 mb-6 border border-white/5 group-hover:bg-[var(--card-color)] group-hover:border-transparent shadow-lg" style={{ '--card-color': item.color } as React.CSSProperties}>
                <item.icon size={24} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4 group-hover:text-[var(--card-color)] transition-colors" style={{ '--card-color': item.color } as React.CSSProperties}>{item.title}</h3>
            <p className="text-sm text-white/50 leading-relaxed font-light border-l border-white/10 pl-4 group-hover:border-[var(--card-color)] transition-colors" style={{ '--card-color': item.color } as React.CSSProperties}>
                {item.desc}
            </p>
        </div>
    </div>
);

const MarqueeRow: React.FC = () => (
    <div className="w-full overflow-hidden bg-[#08080a] border-y border-white/5 py-6 flex relative">
        <div className="flex w-max animate-marquee gap-16">
            {[...PARTNER_CODES, ...PARTNER_CODES].map((code, i) => (
                <div key={i} className="flex items-center gap-3 opacity-30 hover:opacity-100 transition-opacity cursor-default group">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="font-mono text-xs tracking-[0.2em] text-white group-hover:text-[#69B7B2]">{code}</span>
                </div>
            ))}
        </div>
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#020202] to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#020202] to-transparent z-10" />
    </div>
);

export const OurClientsPage: React.FC = () => {
    const { navigateTo } = useNavigation();
    const [hoveredIndustry, setHoveredIndustry] = useState<string | null>(null);

    return (
        <div className="relative min-h-screen bg-[#020202] text-white pt-24 font-sans overflow-x-hidden selection:bg-[#69B7B2]/30 selection:text-[#69B7B2]">
            <style>
                {`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 60s linear infinite;
                }
                `}
            </style>

            <div className="relative h-[90vh] min-h-[700px] flex flex-col items-center justify-center text-center overflow-hidden border-b border-white/10">
                <div className="absolute inset-0 z-0">
                    <ClientNetworkVisualizer />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-[#020202]/80 z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#020202]/80 via-transparent to-[#020202]/80 z-10" />
                
                <div className="relative z-20 max-w-6xl px-6 space-y-10">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[#69B7B2]/30 bg-[#69B7B2]/10 backdrop-blur-md animate-in slide-in-from-top-8 duration-1000">
                        <div className="w-2 h-2 bg-[#69B7B2] rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#69B7B2]">Global Operations Network</span>
                    </div>

                    <h1 className="text-7xl md:text-9xl font-serif text-white leading-[0.9] tracking-tighter animate-in zoom-in-95 duration-1000">
                        Partners, Not <br/>
                        <span className="text-[#69B7B2] italic">Vendors.</span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto leading-relaxed font-light animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                        We don't sell software. We deploy infrastructure for the world's most critical industries.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                        <button 
                            onClick={() => document.getElementById('manifesto')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-8 py-4 bg-[#69B7B2] hover:bg-[#5aa09c] text-black font-bold uppercase tracking-widest text-xs rounded transition-all shadow-[0_0_30px_rgba(105,183,178,0.3)] hover:shadow-[0_0_50px_rgba(105,183,178,0.5)] active:scale-95"
                        >
                            Our Approach
                        </button>
                        <button 
                            onClick={() => navigateTo('contact')}
                            className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase tracking-widest text-xs rounded transition-colors backdrop-blur-md"
                        >
                            Join The Network
                        </button>
                    </div>
                </div>

                <div className="absolute bottom-12 left-12 hidden md:block text-left z-20">
                    <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">Active Nodes</div>
                    <div className="text-2xl font-mono text-[#69B7B2] font-bold">8,492</div>
                </div>
                <div className="absolute bottom-12 right-12 hidden md:block text-right z-20">
                    <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">System Status</div>
                    <div className="text-2xl font-mono text-green-500 font-bold">OPTIMAL</div>
                </div>
            </div>

            <MarqueeRow />

            <section className="py-24 bg-[#050505] border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {IMPACT_METRICS.map((metric, i) => (
                            <div key={i} className="text-center group cursor-default">
                                <div className="w-16 h-16 bg-[#0a0a0c] border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:border-[#69B7B2]/30 group-hover:text-[#69B7B2] transition-colors shadow-lg">
                                    <metric.icon size={32} strokeWidth={1} />
                                </div>
                                <div className="text-4xl md:text-5xl font-mono font-bold text-white mb-2 tracking-tight group-hover:scale-110 transition-transform duration-500">{metric.value}</div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">{metric.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="manifesto" className="py-32 bg-[#020202] relative">
                <div className="absolute top-0 right-0 p-64 bg-[#69B7B2]/5 blur-[120px] rounded-full pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-24">
                        <div className="inline-block border-b border-white/20 pb-2 mb-6">
                            <span className="text-xs font-mono uppercase tracking-widest text-white/60">The Anti-Vendor Model</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-serif text-white max-w-4xl mx-auto leading-tight">
                            We operate as a strategic extension of your team.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {PHILOSOPHY.map((item, i) => (
                            <PhilosophyCard key={i} item={item} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-32 bg-[#08080a] border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div>
                            <div className="text-[#69B7B2] font-mono text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Layers size={12} /> Deployment Sectors
                            </div>
                            <h2 className="text-4xl md:text-5xl font-serif text-white">Active Verticals</h2>
                        </div>
                        <button 
                            onClick={() => navigateTo('our-work')}
                            className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors group"
                        >
                            View Case Studies <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {INDUSTRIES.map((ind) => (
                            <div 
                                key={ind.id}
                                onClick={() => navigateTo(ind.path)}
                                onMouseEnter={() => setHoveredIndustry(ind.id)}
                                onMouseLeave={() => setHoveredIndustry(null)}
                                className="group relative h-96 bg-[#0c0c0e] border border-white/10 rounded-3xl overflow-hidden cursor-pointer hover:border-white/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col"
                            >
                                <div 
                                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none mix-blend-screen"
                                    style={{ background: `radial-gradient(circle at top left, ${ind.color}, transparent 70%)` }} 
                                />
                                <div className="absolute inset-x-0 h-px bg-white/20 top-0 opacity-0 group-hover:opacity-100 group-hover:animate-scan transition-opacity pointer-events-none blur-[1px]" />
                                
                                <div className="relative z-10 p-10 h-full flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div 
                                            className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-xl backdrop-blur-sm"
                                            style={{ 
                                                backgroundColor: hoveredIndustry === ind.id ? `${ind.color}10` : undefined,
                                                borderColor: hoveredIndustry === ind.id ? `${ind.color}40` : undefined,
                                                color: hoveredIndustry === ind.id ? ind.color : undefined 
                                            }}
                                        >
                                            <ind.icon size={32} strokeWidth={1.5} />
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 transform translate-x-4 group-hover:translate-x-0">
                                            <div className="p-2 rounded-full border border-white/10 bg-white/5 text-white">
                                                <ArrowUpRight size={16} />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                                            <ScanLine size={12} className="text-white/40" />
                                            <span className="text-[9px] font-mono uppercase tracking-widest text-white/40">Secure Access</span>
                                        </div>
                                        <h3 className="text-2xl font-serif text-white mb-3 group-hover:text-white transition-colors">
                                            {ind.title}
                                        </h3>
                                        <div className="h-0.5 w-8 bg-white/10 mb-4 group-hover:w-full transition-all duration-700" style={{ backgroundColor: hoveredIndustry === ind.id ? ind.color : undefined }} />
                                        <p className="text-sm text-white/50 leading-relaxed font-light group-hover:text-white/70 transition-colors">
                                            {ind.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-32 bg-[#020202] border-t border-white/5 text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="w-20 h-20 mx-auto bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/50 mb-8 animate-pulse">
                        <Terminal size={32} />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif text-white mb-8">Ready to initiate?</h2>
                    <p className="text-white/60 text-lg mb-12 max-w-xl mx-auto">
                        Let's discuss how we can deploy our infrastructure into your operations.
                    </p>
                    <button 
                        onClick={() => navigateTo('contact')}
                        className="px-12 py-5 bg-[#69B7B2] hover:bg-[#5aa09c] text-black font-bold uppercase tracking-widest text-xs rounded-full transition-colors shadow-[0_0_30px_rgba(105,183,178,0.3)] hover:shadow-[0_0_50px_rgba(105,183,178,0.5)] hover:scale-105 transform duration-300"
                    >
                        Start the Conversation
                    </button>
                </div>
            </section>

        </div>
    );
};
