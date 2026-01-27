
import React, { useState, useEffect, useRef } from 'react';
import { MoveRight, Shield, Database, Search, EyeOff, Lock, BarChart3, Shuffle, UserCheck, ChevronDown, Globe, Zap, Fingerprint, Network, FileText, CheckCircle2, Server, Key, Box, Download, Mail, Phone, Terminal, Radio, Building2, Truck, Briefcase, Factory, Activity, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { NeuralBackground } from './NeuralBackground';
import { SectionVisualizer } from './SectionVisualizer';
import { HeroVisualizer } from './HeroVisualizer';
import { UseCaseShowcase } from './UseCaseShowcase';
import { FeatureShowcase } from './FeatureShowcase';
import { useNavigation } from '../context/NavigationContext';

// Import Industry Hero Visualizers
import { LogisticsHeroVisualizer } from './LogisticsHeroVisualizer';
import { SmallBusinessHeroVisualizer } from './SmallBusinessHeroVisualizer';
import { IndustrialsHeroVisualizer } from './IndustrialsHeroVisualizer';
import { HealthcareHeroVisualizer } from './HealthcareHeroVisualizer';
import { ResourcesHeroVisualizer } from './ResourcesHeroVisualizer';

const Typewriter: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
    const [display, setDisplay] = useState('');
    useEffect(() => {
        let t = setTimeout(() => {
            let i = 0;
            const interval = setInterval(() => {
                setDisplay(text.substring(0, i + 1));
                i++;
                if (i === text.length) clearInterval(interval);
            }, 40);
            return () => clearInterval(interval);
        }, delay);
        return () => clearTimeout(t);
    }, [text, delay]);
    return <span className="font-serif italic text-white/80">{display}</span>;
};

// ... (HolographicGlobe and SecurityVisualizer remain unchanged - omitted for brevity to focus on Footer update, assuming existing file structure maintained) ...
const HolographicGlobe: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvasRef.current?.getBoundingClientRect();
            if (rect) {
                mouseRef.current = {
                    x: (e.clientX - rect.left) / rect.width * 2 - 1,
                    y: (e.clientY - rect.top) / rect.height * 2 - 1
                };
            }
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.parentElement?.clientWidth || 800;
        let height = canvas.parentElement?.clientHeight || 600;
        canvas.width = width;
        canvas.height = height;
        
        let frame = 0;
        let animationFrameId: number;

        // --- GLOBE CONFIG ---
        const GLOBE_RADIUS = 220;
        const DOT_COUNT = 600;
        const DOT_SIZE = 1.5;
        
        const points: {x: number, y: number, z: number}[] = [];
        const phi = Math.PI * (3 - Math.sqrt(5)); 

        for (let i = 0; i < DOT_COUNT; i++) {
            const y = 1 - (i / (DOT_COUNT - 1)) * 2; 
            const radius = Math.sqrt(1 - y * y); 
            const theta = phi * i; 

            const x = Math.cos(theta) * radius;
            const z = Math.sin(theta) * radius;

            points.push({ x: x * GLOBE_RADIUS, y: y * GLOBE_RADIUS, z: z * GLOBE_RADIUS });
        }

        const render = () => {
            frame++;
            const time = frame * 0.005;

            ctx.clearRect(0, 0, width, height); 

            const cx = width * 0.5; 
            const cy = height * 0.5;

            const rotX = time * 0.3 + (mouseRef.current.y * 0.2);
            const rotY = time * 0.5 + (mouseRef.current.x * 0.2);

            const projected = points.map(p => {
                let x1 = p.x * Math.cos(rotY) - p.z * Math.sin(rotY);
                let z1 = p.z * Math.cos(rotY) + p.x * Math.sin(rotY);
                
                let y1 = p.y * Math.cos(rotX) - z1 * Math.sin(rotX);
                let z2 = z1 * Math.cos(rotX) + p.y * Math.sin(rotX);

                const scale = 400 / (400 - z2); 
                return {
                    x: x1 * scale + cx,
                    y: y1 * scale + cy,
                    z: z2,
                    scale
                };
            });

            projected.forEach(p => {
                if (p.scale > 0) { 
                    const alpha = (p.z + GLOBE_RADIUS) / (GLOBE_RADIUS * 2); 
                    ctx.fillStyle = `rgba(105, 183, 178, ${Math.max(0.1, alpha)})`;
                    const size = DOT_SIZE * p.scale;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            // Connections
            ctx.strokeStyle = 'rgba(105, 183, 178, 0.15)';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            for (let i = 0; i < projected.length; i += 8) {
                const p1 = projected[i];
                if (p1.z < 0) continue; 

                for (let j = 1; j < 6; j++) {
                    const p2 = projected[(i + j * 7) % projected.length];
                    const dist = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
                    
                    if (dist < 60) {
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                    }
                }
            }
            ctx.stroke();

            animationFrameId = requestAnimationFrame(render);
        };
        render();

        const handleResize = () => {
            if (canvas.parentElement) {
                width = canvas.parentElement.clientWidth;
                height = canvas.parentElement.clientHeight;
                canvas.width = width;
                canvas.height = height;
            }
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

const SecurityVisualizer: React.FC<{ mode: string | null }> = ({ mode }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let w = canvas.parentElement?.clientWidth || 800;
        let h = canvas.parentElement?.clientHeight || 600;
        canvas.width = w;
        canvas.height = h;

        let time = 0;
        let particles: any[] = [];

        // Initialize particles
        for(let i=0; i<80; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 1,
                vy: (Math.random() - 0.5) * 1,
                size: Math.random() * 2,
                angle: Math.random() * Math.PI * 2,
                aesInit: false
            });
        }

        let animationFrameId: number;

        const render = () => {
            time += 0.02;
            
            // Clear but leave trail for some modes
            ctx.fillStyle = 'rgba(5, 5, 5, 0.2)';
            ctx.fillRect(0, 0, w, h);
            ctx.globalCompositeOperation = 'source-over';

            const cx = w/2;
            const cy = h/2;

            if (mode === 'airgap') {
                // ISOLATION RING
                const r = 250;
                
                // Shield pulse
                ctx.shadowBlur = 20;
                ctx.shadowColor = '#ef4444';
                ctx.strokeStyle = `rgba(239, 68, 68, ${0.5 + Math.sin(time * 2) * 0.2})`;
                ctx.lineWidth = 3;
                ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
                ctx.shadowBlur = 0;

                // Repel particles
                particles.forEach(p => {
                    p.x += p.vx * 2;
                    p.y += p.vy * 2;
                    
                    const dx = p.x - cx;
                    const dy = p.y - cy;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    
                    // Bounce off boundary
                    if (dist > r - 10 && dist < r + 10) {
                        const angle = Math.atan2(dy, dx);
                        p.vx = -Math.cos(angle) * 2;
                        p.vy = -Math.sin(angle) * 2;
                    }
                    
                    // Wrap screen
                    if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
                    if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;

                    // Color based on inside/outside
                    ctx.fillStyle = dist < r ? '#10b981' : '#ef4444';
                    ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
                });
                
                // Center text
                ctx.font = '10px monospace';
                ctx.fillStyle = '#ef4444';
                ctx.textAlign = 'center';
                ctx.fillText("AIRGAP_PROTOCOL_ACTIVE", cx, cy + r + 20);
            } 
            else if (mode === 'rbac') {
                // HIERARCHY TREE
                const levels = 3;
                const levelHeight = 100;
                
                particles.forEach((p, i) => {
                    const level = i % levels;
                    const targetY = cy + (level - 1) * levelHeight;
                    const spread = (w * 0.6) / (levels + 1);
                    const targetX = cx + ((i % 5) - 2) * spread + Math.sin(time + i) * 20;

                    p.x += (targetX - p.x) * 0.05;
                    p.y += (targetY - p.y) * 0.05;

                    ctx.fillStyle = level === 0 ? '#10b981' : level === 1 ? '#3b82f6' : '#64748b';
                    
                    // Connections to parent
                    if (level > 0) {
                        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
                        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(cx, cy + (level-2)*levelHeight); ctx.stroke();
                    }

                    ctx.beginPath(); ctx.arc(p.x, p.y, p.size + (level === 0 ? 3 : 0), 0, Math.PI*2); ctx.fill();
                });
                
                // Scanner
                const scanY = cy - 150 + (time * 100) % 300;
                ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
                ctx.fillRect(0, scanY, w, 20);
            }
            else if (mode === 'aes') {
                // DATA STREAM NETWORK (Spinning Number Particles)
                const pulse = 1 + Math.sin(time * 10) * 0.1;
                ctx.fillStyle = '#eab308'; // Yellow
                ctx.shadowBlur = 30 * pulse;
                ctx.shadowColor = '#eab308';
                ctx.beginPath(); ctx.arc(cx, cy, 15, 0, Math.PI*2); ctx.fill();
                ctx.shadowBlur = 0;

                ctx.strokeStyle = 'rgba(234, 179, 8, 0.5)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(cx, cy, 30, time * 5, time * 5 + Math.PI * 1.5);
                ctx.stroke();

                ctx.font = '10px monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                particles.forEach((p, i) => {
                    if (!p.aesInit) {
                        p.x = cx;
                        p.y = cy;
                        const angle = Math.random() * Math.PI * 2;
                        const speed = 2 + Math.random() * 3;
                        p.vx = Math.cos(angle) * speed;
                        p.vy = Math.sin(angle) * speed;
                        p.char = Math.random() > 0.5 ? "1" : "0";
                        p.aesInit = true;
                    }

                    p.x += p.vx;
                    p.y += p.vy;
                    
                    const dx = p.x - cx;
                    const dy = p.y - cy;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    const currentAngle = Math.atan2(dy, dx);
                    const newAngle = currentAngle + 0.02;
                    p.x = cx + Math.cos(newAngle) * dist;
                    p.y = cy + Math.sin(newAngle) * dist;

                    ctx.fillStyle = `rgba(234, 179, 8, ${1 - dist/400})`;
                    ctx.fillText(p.char, p.x, p.y);

                    for (let j = i + 1; j < particles.length; j++) {
                        const p2 = particles[j];
                        const d2 = Math.pow(p.x - p2.x, 2) + Math.pow(p.y - p2.y, 2);
                        if (d2 < 2500) { 
                            ctx.strokeStyle = `rgba(234, 179, 8, ${0.2 * (1 - dist/400)})`;
                            ctx.beginPath();
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.stroke();
                        }
                    }

                    if (dist > 400) {
                        p.x = cx;
                        p.y = cy;
                        p.char = Math.random() > 0.5 ? "1" : "0";
                        const a = Math.random() * Math.PI * 2;
                        const s = 2 + Math.random() * 3;
                        p.vx = Math.cos(a) * s;
                        p.vy = Math.sin(a) * s;
                    }
                });
            }
            else if (mode === 'tenant') {
                // ISOLATED SILO (FORTRESS)
                const siloWidth = 80;
                const siloHeight = 300;
                
                ctx.strokeStyle = '#a855f7'; 
                ctx.lineWidth = 2;
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#a855f7';
                
                const xLeft = cx - siloWidth/2;
                const xRight = cx + siloWidth/2;
                
                ctx.beginPath();
                ctx.moveTo(xLeft, cy - siloHeight/2); ctx.lineTo(xLeft, cy + siloHeight/2);
                ctx.moveTo(xRight, cy - siloHeight/2); ctx.lineTo(xRight, cy + siloHeight/2);
                ctx.stroke();
                
                ctx.shadowBlur = 0;
                
                ctx.fillStyle = 'rgba(168, 85, 247, 0.05)';
                ctx.fillRect(xLeft, cy - siloHeight/2, siloWidth, siloHeight);
                
                const scanY = cy - siloHeight/2 + (time * 60) % siloHeight;
                ctx.fillStyle = '#a855f7';
                ctx.fillRect(xLeft, scanY, siloWidth, 2);
                
                ctx.strokeStyle = 'rgba(168, 85, 247, 0.2)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.ellipse(cx, cy, 100, 30, time * 0.5, 0, Math.PI * 2);
                ctx.stroke();
                ctx.beginPath();
                ctx.ellipse(cx, cy, 100, 30, -time * 0.5, 0, Math.PI * 2);
                ctx.stroke();

                particles.forEach(p => {
                    p.x += p.vx * 3;
                    p.y += p.vy * 3;
                    
                    if (p.x > xLeft - 10 && p.x < xRight + 10 && p.y > cy - siloHeight/2 && p.y < cy + siloHeight/2) {
                        if (p.x < cx) p.vx = -Math.abs(p.vx * 1.5);
                        else p.vx = Math.abs(p.vx * 1.5);
                    }
                    
                    if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
                    if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
                    
                    ctx.fillStyle = 'rgba(168, 85, 247, 0.3)';
                    ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
                });
                
                ctx.fillStyle = '#fff';
                ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI*2); ctx.fill();
                
                ctx.fillStyle = '#a855f7';
                ctx.font = '10px monospace';
                ctx.textAlign = 'center';
                ctx.fillText("TENANT_ISOLATION_ACTIVE", cx, cy + siloHeight/2 + 20);
            }
            else {
                // IDLE: Starfield
                particles.forEach(p => {
                    if (p.aesInit) {
                        p.vx = (Math.random() - 0.5) * 1;
                        p.vy = (Math.random() - 0.5) * 1;
                        p.aesInit = false;
                    }

                    p.x += p.vx * 0.2;
                    p.y += p.vy * 0.2;
                    
                    if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
                    if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
                    
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
                    ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
                });
            }

            animationFrameId = requestAnimationFrame(render);
        };
        
        render();
        
        const handleResize = () => {
             if (canvas.parentElement) {
                 w = canvas.parentElement.clientWidth;
                 h = canvas.parentElement.clientHeight;
                 canvas.width = w; canvas.height = h;
             }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [mode]);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen opacity-60" />;
};

const INDUSTRY_CARDS = [
    { 
        id: 'logistics', 
        title: "Logistics", 
        subtitle: "Supply Chain",
        desc: "Operational decisions shaped by real-time movement, accumulated context, and constrained physical systems.", 
        icon: Truck, 
        color: "#06b6d4",
        path: "our-clients/industries/logistics",
        Visualizer: LogisticsHeroVisualizer
    },
    { 
        id: 'smb', 
        title: "SMB Operations", 
        subtitle: "Growth Strategy",
        desc: "Rapid decision cycles, constrained resources, and the need to scale without enterprise overhead.", 
        icon: Briefcase, 
        color: "#8b5cf6",
        path: "our-clients/industries/smb-operations",
        Visualizer: SmallBusinessHeroVisualizer
    },
    { 
        id: 'industrials', 
        title: "Industrials", 
        subtitle: "Heavy Assets",
        desc: "Stabilizing complex industrial operations where reliability, safety, and performance are inseparable.", 
        icon: Factory, 
        color: "#f59e0b",
        path: "our-clients/industries/industrials",
        Visualizer: IndustrialsHeroVisualizer
    },
    { 
        id: 'healthcare', 
        title: "Healthcare", 
        subtitle: "Clinical Ops",
        desc: "Reducing operational risk, bottlenecks, and compliance overhead in regulated care environments.", 
        icon: Activity, 
        color: "#14b8a6",
        path: "our-clients/industries/healthcare",
        Visualizer: HealthcareHeroVisualizer
    },
    { 
        id: 'resources', 
        title: "Natural Resources", 
        subtitle: "Energy & Mining",
        desc: "Operations defined by physical constraints, long time horizons, and irreversible decisions.", 
        icon: Globe, 
        color: "#10b981",
        path: "our-clients/industries/natural-resources",
        Visualizer: ResourcesHeroVisualizer
    }
];

const IndustryCarousel: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const { navigateTo } = useNavigation();
    const count = INDUSTRY_CARDS.length;

    const next = () => setActiveIndex((prev) => (prev + 1) % count);
    const prev = () => setActiveIndex((prev) => (prev - 1 + count) % count);

    // Get the active item for background logic
    const activeItem = INDUSTRY_CARDS[activeIndex];

    return (
        <div className="relative w-full h-[700px] flex items-center justify-center overflow-hidden">
            
            {/* Dynamic Atmospheric Background */}
            <div 
                className="absolute inset-0 transition-all duration-1000 ease-in-out pointer-events-none"
                style={{
                    background: `radial-gradient(circle at 50% 50%, ${activeItem.color}20, transparent 70%)`
                }}
            />

            {/* Cards */}
            <div className="relative w-full max-w-7xl h-full mx-auto">
                {INDUSTRY_CARDS.map((item, index) => {
                    // Calculate relative position
                    let offset = (index - activeIndex);
                    // Handle wrap-around logic for correct positioning
                    if (offset < -Math.floor(count / 2)) offset += count;
                    if (offset > Math.floor(count / 2)) offset -= count;
                    
                    const isActive = offset === 0;
                    const isVisible = Math.abs(offset) <= 1;

                    // Performance optimization: Don't render far off cards
                    if (!isVisible && Math.abs(offset) > 1) return null; 

                    const style: React.CSSProperties = {
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: 'min(380px, 85vw)',
                        height: '500px',
                        transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
                        zIndex: isActive ? 20 : 10,
                        opacity: isActive ? 1 : 0.6, // Increased opacity for better visibility of neighbors
                        transform: isActive 
                            ? 'translate(-50%, -50%) scale(1)' 
                            : `translate(calc(-50% + ${offset * 110}%), -50%) scale(0.85)`,
                        filter: isActive ? 'none' : 'grayscale(100%)', // No blur, just darkness/grayscale
                    };

                    return (
                        <div 
                            key={item.id}
                            style={style}
                            className="cursor-pointer"
                            onClick={() => {
                                if (isActive) navigateTo(item.path);
                                else setActiveIndex(index);
                            }}
                        >
                            {/* Card Container */}
                            <div className="relative w-full h-full rounded-3xl bg-[#0c0c0e] group shadow-2xl">
                                
                                {/* Inner Content (Clipped) */}
                                <div className="absolute inset-0 rounded-3xl overflow-hidden">
                                    {/* Visualizer Background (Only active and immediate neighbors) */}
                                    {Math.abs(offset) <= 1 && (
                                        <div className="absolute inset-0">
                                            <item.Visualizer />
                                            {/* Global Card Overlay - Darker to recede visualizer */}
                                            <div className="absolute inset-0 bg-black/40" />
                                        </div>
                                    )}
                                    
                                    {/* Text Section Overlay - Strong gradient for text contrast, no blur */}
                                    <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e]/95 to-transparent pointer-events-none" />

                                    {/* Overlay Content */}
                                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                        <div className={`transition-all duration-500 relative z-10 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                                            <div className="flex items-center gap-3 mb-4 text-[var(--card-color)]" style={{'--card-color': item.color} as any}>
                                                <item.icon size={24} />
                                                <span className="text-xs font-bold uppercase tracking-widest">{item.subtitle}</span>
                                            </div>
                                            <h3 className="text-3xl font-serif text-white mb-4 leading-none">{item.title}</h3>
                                            <p className="text-sm text-white/60 leading-relaxed mb-6">{item.desc}</p>
                                            <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white hover:text-[var(--card-color)] transition-colors">
                                                Explore Sector <ArrowUpRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Active Border Overlay (Outside Clipping) */}
                                <div 
                                    className="absolute inset-0 rounded-3xl pointer-events-none transition-all duration-500"
                                    style={{
                                        border: '1px solid',
                                        borderColor: isActive ? `${item.color}80` : 'rgba(255,255,255,0.1)', // 50% opacity for active
                                        boxShadow: isActive ? `0 0 40px ${item.color}15` : 'none'
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Navigation Buttons */}
            <button onClick={prev} className="absolute left-4 md:left-8 z-30 p-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all backdrop-blur-md active:scale-95">
                <ChevronLeft size={24} />
            </button>
            <button onClick={next} className="absolute right-4 md:right-8 z-30 p-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all backdrop-blur-md active:scale-95">
                <ChevronRight size={24} />
            </button>
        </div>
    );
};

export const LandingPage: React.FC = () => {
  const [bootSequence, setBootSequence] = useState(false);
  const [activeSecurityFeature, setActiveSecurityFeature] = useState<string | null>(null);
  const [formState, setFormState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const { navigateTo } = useNavigation();

  useEffect(() => { setBootSequence(true); }, []);

  const scrollToFeatures = () => {
    const el = document.getElementById('features');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setFormState('sending');
      setTimeout(() => setFormState('sent'), 2000);
  };

  const securityFeatures = [
      { id: 'airgap', label: 'Air-Gapped Ready', icon: Server, color: 'text-red-400', border: 'hover:border-red-500/50', bg: 'hover:bg-red-500/10' },
      { id: 'rbac', label: 'Role-Based Access', icon: UserCheck, color: 'text-blue-400', border: 'hover:border-blue-500/50', bg: 'hover:bg-blue-500/10' },
      { id: 'aes', label: 'AES-256 Encryption', icon: Key, color: 'text-yellow-400', border: 'hover:border-yellow-500/50', bg: 'hover:bg-yellow-500/10' },
      { id: 'tenant', label: 'Single Tenant', icon: Box, color: 'text-purple-400', border: 'hover:border-purple-500/50', bg: 'hover:bg-purple-500/10' },
  ];

  return (
    <div className="relative min-h-screen bg-[#020202] text-white font-sans overflow-x-hidden selection:bg-[#69B7B2]/30 selection:text-[#69B7B2]">
      
      {/* HEADER REMOVED: Managed by GlobalNav */}

      {/* --- 1. HERO --- */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#020202] pt-20">
        <div className="absolute inset-0 opacity-100">
            <HeroVisualizer />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020202_90%)] pointer-events-none" />

        <div className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center text-center space-y-8 pointer-events-none">
            
            <div className="space-y-4 mix-blend-screen pt-12">
                <h1 className="font-serif text-4xl md:text-7xl leading-[1.1] tracking-tight text-white animate-in zoom-in-95 duration-1000">
                    We help organizations locate, understand, and mobilize their <span className="italic text-[#69B7B2]">knowledge.</span>
                </h1>
            </div>

            <div className="max-w-2xl mx-auto min-h-[3rem] flex items-center justify-center pt-4">
                {bootSequence && (
                    <div className="text-lg md:text-xl text-white/70 leading-relaxed">
                        <Typewriter text="Context is King." delay={1000} />
                    </div>
                )}
            </div>
            
            <div className="pt-8 pointer-events-auto animate-in fade-in duration-1000 delay-700 flex flex-col md:flex-row gap-4">
                <button onClick={scrollToFeatures} className="px-8 py-4 bg-[#69B7B2] hover:brightness-110 text-black font-bold uppercase tracking-widest text-xs rounded transition-all flex items-center gap-3">
                    Learn More
                    <ChevronDown size={16} />
                </button>
                <button onClick={() => navigateTo('our-clients')} className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-widest text-xs rounded transition-colors backdrop-blur-md border border-white/5">
                    Explore Industries
                </button>
            </div>
        </div>
        
        <button 
            onClick={scrollToFeatures}
            className="absolute bottom-12 animate-bounce text-white/20 hover:text-white transition-colors cursor-pointer pointer-events-auto p-4 z-50"
        >
            <ChevronDown size={24} />
        </button>
      </section>

      {/* --- 2. SECURITY BANNER (MOVED UP) --- */}
      <section id="security" className="relative py-24 bg-[#050505] border-t border-white/10 overflow-hidden">
          {/* VISUALIZER LAYER */}
          <SecurityVisualizer mode={activeSecurityFeature} />
          
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-2xl mx-auto mb-8 flex items-center justify-center text-white backdrop-blur-md border border-white/10">
                  <Lock size={32} />
              </div>
              <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">Your data stays yours.</h2>
              <p className="text-lg text-white/50 leading-relaxed mb-12">
                  We offer on-premise deployment options for total sovereignty. No data ever leaves your secure enclave without explicit authorization.
              </p>
              
              {/* INTERACTIVE BUTTONS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {securityFeatures.map((feat) => (
                      <button 
                        key={feat.id}
                        onMouseEnter={() => setActiveSecurityFeature(feat.id)}
                        onMouseLeave={() => setActiveSecurityFeature(null)}
                        className={`group p-4 border border-white/10 rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-3 backdrop-blur-sm ${activeSecurityFeature === feat.id ? `${feat.border} ${feat.bg} scale-105 shadow-2xl` : 'hover:bg-white/5'}`}
                      >
                          <feat.icon size={20} className={`transition-colors ${activeSecurityFeature === feat.id ? feat.color : 'text-white/40'}`} />
                          <span className={`text-xs font-mono uppercase tracking-widest font-bold transition-colors ${activeSecurityFeature === feat.id ? 'text-white' : 'text-white/40'}`}>
                              {feat.label}
                          </span>
                      </button>
                  ))}
              </div>
          </div>
      </section>

      {/* --- 3. TRUST BADGES --- */}
      <section className="py-16 border-y border-white/5 bg-[#030303]">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="text-left md:w-1/3">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#69B7B2] font-bold block mb-2">Trusted Standard</span>
                  <h3 className="text-2xl font-serif text-white leading-tight">Engineered for regulated and high-trust environments.</h3>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-end gap-x-12 gap-y-6 text-white/70 md:w-2/3">
                  {['ISO 27001', 'SOC 2', 'HIPAA', 'GDPR'].map((badge, i) => (
                      <div key={i} className="flex items-center gap-3 font-bold text-lg group cursor-default">
                          <div className="p-2 rounded-full bg-white/5 border border-white/10 text-[#69B7B2] group-hover:bg-[#69B7B2]/10 transition-colors">
                              <Shield size={20} />
                          </div>
                          <span className="group-hover:text-white transition-colors">{badge}</span>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* --- 4. MAIN FEATURES (NEW INTERACTIVE SHOWCASE) --- */}
      <div id="features">
        <FeatureShowcase />
      </div>

      {/* --- 5. INDUSTRY PORTAL (Replaces Feature Grid) --- */}
      <section className="py-32 bg-[#080808] border-y border-white/5 relative overflow-hidden">
          {/* Note: The background gradient here is removed/overridden by the IndustryCarousel's atmospheric glow */}
          
          <div className="w-full">
              <div className="text-center mb-20 px-6 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6">
                      <Globe size={12} className="text-[#69B7B2]" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Everything Else you Need</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Built for Mission-Critical Workflows</h2>
                  <p className="text-white/50 text-lg max-w-2xl mx-auto">
                      Deep vertical specialization where generic AI fails. We speak the language of your operations.
                  </p>
              </div>
              
              {/* REPLACED GRID WITH CAROUSEL */}
              <IndustryCarousel />
          </div>
      </section>

      {/* --- 6. SOLUTIONS SHOWCASE --- */}
      <section id="solutions" className="relative bg-[#020202]">
          <UseCaseShowcase />
      </section>

      {/* --- 7. CONTACT SECTION (Embedded from ContactPage) --- */}
      <section id="contact" className="relative py-24 bg-[#0c0c0e] border-t border-white/10 overflow-hidden">
          {/* Globe Background */}
          <div className="absolute inset-0 opacity-40 pointer-events-none">
              <HolographicGlobe />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-[#020202]/80 pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-16 items-center">
              {/* Left Column */}
              <div className="w-full lg:w-1/2 space-y-12">
                  <div className="space-y-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#69B7B2]/10 border border-[#69B7B2]/20 text-[#69B7B2] text-[10px] font-bold uppercase tracking-widest">
                          <Radio size={12} className="animate-pulse" />
                          <span>Contact Us</span>
                      </div>
                      <h2 className="text-5xl md:text-7xl font-serif text-white leading-tight">
                          Let’s talk about your <br/> <span className="text-[#69B7B2] italic">operational reality.</span>
                      </h2>
                      <p className="text-xl text-white/60 font-light max-w-md border-l border-white/20 pl-6">
                          Every engagement starts with understanding how your organization actually works.
                      </p>
                  </div>

                  <div className="relative group overflow-hidden p-1 rounded-3xl bg-gradient-to-br from-white/10 to-transparent">
                      <div className="absolute inset-0 bg-[#0a0a0c] rounded-3xl m-[1px]" />
                      <div className="relative p-8">
                          <div className="flex items-center gap-3 mb-4">
                              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                              <span className="text-[10px] font-mono text-green-500 uppercase tracking-widest">Headquarters</span>
                          </div>
                          <h3 className="text-2xl font-serif text-white mb-2">New York City</h3>
                          <p className="text-white/40 text-sm mb-6 leading-relaxed">
                              New York, NY
                          </p>
                          <div className="flex flex-col gap-3">
                              <a href="mailto:connect@infogito.com" className="flex items-center gap-3 text-white/60 hover:text-white transition-colors group/link">
                                  <div className="p-1.5 bg-white/5 rounded text-[#69B7B2] group-hover/link:bg-[#69B7B2] group-hover/link:text-black transition-all"><Mail size={14} /></div>
                                  <span className="text-sm font-mono">connect@infogito.com</span>
                              </a>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Right Column (Form) */}
              <div className="w-full lg:w-1/2">
                  <div className="relative bg-[#0c0c0e]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden group">
                      
                      {/* Animated Scanline Background */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(105,183,178,0.05)_50%,transparent_100%)] h-[200%] w-full animate-[scan_10s_linear_infinite] pointer-events-none" />

                      {formState === 'sent' ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0c0c0e] animate-in fade-in duration-500 z-20">
                              <div className="w-24 h-24 bg-[#69B7B2]/10 rounded-full flex items-center justify-center text-[#69B7B2] mb-8 border border-[#69B7B2]/20 shadow-[0_0_30px_rgba(105,183,178,0.2)]">
                                  <CheckCircle2 size={48} />
                              </div>
                              <h3 className="text-3xl font-serif text-white mb-2">Message Sent</h3>
                              <p className="text-white/50 text-sm max-w-xs text-center leading-relaxed">
                                  Your message has been logged. An engineer will get back to you shortly.
                              </p>
                              <button 
                                  onClick={() => setFormState('idle')}
                                  className="mt-12 text-xs font-bold uppercase tracking-widest text-[#69B7B2] hover:text-white transition-colors flex items-center gap-2"
                              >
                                  <Terminal size={14} /> Send Another
                              </button>
                          </div>
                      ) : (
                          <form onSubmit={handleContactSubmit} className="space-y-8 relative z-10">
                              
                              <div className="space-y-6">
                                  <div className="grid grid-cols-2 gap-6">
                                      <div className="space-y-2 group/field">
                                          <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1 group-focus-within/field:text-[#69B7B2] transition-colors">First Name</label>
                                          <input type="text" required className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#69B7B2] focus:bg-white/[0.05] transition-all placeholder:text-white/10 font-sans" placeholder="Jane" />
                                      </div>
                                      <div className="space-y-2 group/field">
                                          <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1 group-focus-within/field:text-[#69B7B2] transition-colors">Last Name</label>
                                          <input type="text" required className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#69B7B2] focus:bg-white/[0.05] transition-all placeholder:text-white/10 font-sans" placeholder="Doe" />
                                      </div>
                                  </div>
                                  
                                  <div className="space-y-2 group/field">
                                      <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1 group-focus-within/field:text-[#69B7B2] transition-colors">Work Email</label>
                                      <input type="email" required className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#69B7B2] focus:bg-white/[0.05] transition-all placeholder:text-white/10 font-sans" placeholder="jane@company.com" />
                                  </div>

                                  <div className="space-y-2 group/field">
                                      <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1 group-focus-within/field:text-[#69B7B2] transition-colors">Inquiry Type</label>
                                      <div className="relative">
                                          <select className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#69B7B2] focus:bg-white/[0.05] transition-all appearance-none cursor-pointer font-sans">
                                              <option className="bg-[#0a0a0c]">Enterprise Platform Demo</option>
                                              <option className="bg-[#0a0a0c]">Partnership Inquiry</option>
                                              <option className="bg-[#0a0a0c]">Technical Support</option>
                                              <option className="bg-[#0a0a0c]">Careers</option>
                                          </select>
                                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
                                              <ChevronDown size={14} />
                                          </div>
                                      </div>
                                  </div>

                                  <div className="space-y-2 group/field">
                                      <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1 group-focus-within/field:text-[#69B7B2] transition-colors">Message</label>
                                      <textarea rows={4} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#69B7B2] focus:bg-white/[0.05] transition-all resize-none placeholder:text-white/10 font-sans" placeholder="Tell us about your needs..." />
                                  </div>
                              </div>

                              <button 
                                  type="submit" 
                                  disabled={formState === 'sending'}
                                  className="w-full bg-[#69B7B2] hover:bg-[#5aa09c] text-black font-bold uppercase tracking-widest text-xs py-5 rounded-xl transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(105,183,178,0.2)] hover:shadow-[0_0_50px_rgba(105,183,178,0.4)] disabled:opacity-50 disabled:cursor-not-allowed group/btn relative overflow-hidden"
                              >
                                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                                  <span className="relative z-10 flex items-center gap-3">
                                      {formState === 'sending' ? (
                                          <>Sending Message...</>
                                      ) : (
                                          <>
                                              Start a conversation 
                                              <MoveRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                          </>
                                      )}
                                  </span>
                              </button>
                          </form>
                      )}
                  </div>
              </div>
          </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-black border-t border-white/10 pt-16 pb-8 text-sm">
          <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
                  <div className="col-span-2 md:col-span-1 space-y-4">
                      <div className="flex items-center gap-3">
                          <img src="https://uapriywlkpcpupdp.public.blob.vercel-storage.com/brand_logo_infogito.webp" alt="Infogito" className="h-10 w-auto opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
                      </div>
                      <p className="text-white/40 text-xs leading-relaxed mt-4">
                          Helping organizations to locate, understand, and mobilize their knowledge.
                          <br />New York, NY
                      </p>
                  </div>
                  <div>
                      <h4 className="text-white font-bold mb-6 text-xs uppercase tracking-widest">Our Clients</h4>
                      <ul className="space-y-3 text-white/50 text-xs">
                          <li><button onClick={() => navigateTo('our-clients/industries/logistics')} className="hover:text-[#69B7B2] transition-colors text-left">Logistics</button></li>
                          <li><button onClick={() => navigateTo('our-clients/industries/smb-operations')} className="hover:text-[#69B7B2] transition-colors text-left">SMB Operations</button></li>
                          <li><button onClick={() => navigateTo('our-clients/industries/industrials')} className="hover:text-[#69B7B2] transition-colors text-left">Industrials</button></li>
                          <li><button onClick={() => navigateTo('our-clients/industries/healthcare')} className="hover:text-[#69B7B2] transition-colors text-left">Healthcare</button></li>
                          <li><button onClick={() => navigateTo('our-clients/industries/natural-resources')} className="hover:text-[#69B7B2] transition-colors text-left">Natural Resources</button></li>
                      </ul>
                  </div>
                  <div>
                      <h4 className="text-white font-bold mb-6 text-xs uppercase tracking-widest">Company</h4>
                      <ul className="space-y-3 text-white/50 text-xs">
                          <li><button onClick={() => navigateTo('about')} className="hover:text-[#69B7B2] transition-colors text-left">About</button></li>
                          <li><button onClick={() => navigateTo('contact')} className="hover:text-[#69B7B2] transition-colors text-left">Get In Touch</button></li>
                          <li><button onClick={() => navigateTo('about/careers')} className="hover:text-[#69B7B2] transition-colors text-left">Careers</button></li>
                          <li><button onClick={() => navigateTo('trust-center')} className="hover:text-[#69B7B2] transition-colors text-left">Trust Center</button></li>
                      </ul>
                  </div>
                  <div>
                      <h4 className="text-white font-bold mb-6 text-xs uppercase tracking-widest">Connect</h4>
                      <ul className="space-y-3 text-white/50 text-xs">
                          <li><a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[#69B7B2] transition-colors">LinkedIn</a></li>
                          <li><a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-[#69B7B2] transition-colors">Twitter</a></li>
                          <li><a href="mailto:connect@infogito.com" className="hover:text-[#69B7B2] transition-colors">connect@infogito.com</a></li>
                      </ul>
                  </div>
              </div>
              <div className="border-t border-white/5 pt-8 flex justify-between items-center">
                  <div className="text-white/30 text-[10px] font-mono uppercase tracking-widest">
                      © 2026 Infogito LLC. All rights reserved.
                  </div>
              </div>
          </div>
      </footer>

    </div>
  );
};
