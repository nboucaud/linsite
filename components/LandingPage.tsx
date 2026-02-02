
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { MoveRight, Shield, Lock, UserCheck, ChevronDown, Globe, Box, Mail, Terminal, Building2, Truck, Briefcase, Factory, Activity, ArrowUpRight, ChevronLeft, ChevronRight, Loader2, Server, Key, CheckCircle2 } from 'lucide-react';
import { HeroVisualizer } from './HeroVisualizer'; // Keep Hero synchronous for instant LCP
import { useNavigation } from '../context/NavigationContext';
import { ViewportSlot } from './ViewportSlot';

// --- LAZY LOADED COMPONENTS ---
const UseCaseShowcase = React.lazy(() => import('./UseCaseShowcase').then(module => ({ default: module.UseCaseShowcase })));
const FeatureShowcase = React.lazy(() => import('./FeatureShowcase').then(module => ({ default: module.FeatureShowcase })));

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

// --- SHADER 1: CONTACT BACKGROUND (Optimized) ---
const ContactBackgroundShader: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        // Use standard webgl for better compatibility if webgl2 fails, but stick to 2 for shader syntax
        const gl = canvas.getContext('webgl2', { alpha: false, preserveDrawingBuffer: false });
        if (!gl) return;

        const vsSource = `#version 300 es
            in vec2 position;
            void main() {
                gl_Position = vec4(position, 0.0, 1.0);
            }
        `;

        const fsSource = `#version 300 es
            precision mediump float; // Reduced precision for background
            uniform vec2 resolution;
            uniform float time;
            out vec4 fragColor;

            void main() {
                vec2 r = resolution;
                float t = time * 0.2; 
                vec4 o = vec4(0.0);
                vec2 uv = (gl_FragCoord.xy - r * 0.5) / min(r.x, r.y);
                uv *= 0.75;
                vec3 rd = normalize(vec3(uv, -1.0));
                float z = 0.0;
                float d = 0.0;
                
                // Reduced iterations from 30 to 16 for background performance
                for(float i=0.0; i<16.0; i++) { 
                    vec3 p = z * rd;
                    p.z += 9.0;
                    float nx = atan(p.z, p.x + 1.0) * 2.0;
                    float ny = 0.6 * p.y + t + t;
                    float nz = length(p.xz) - 3.0;
                    vec3 p_loop = vec3(nx, ny, nz);
                    
                    // Reduced inner loop
                    for(float j=1.0; j<4.0; j++) { 
                        p_loop += sin(p_loop.yzx * j + t + 0.5 * i) / j;
                    }
                    vec3 v3 = 0.3 * cos(p_loop) - 0.3;
                    d = 0.4 * length(vec4(v3, p_loop.z)); 
                    d = max(d, 0.02); // Increased min distance to reduce overdraw
                    z += d;
                    o += (cos(p_loop.y + i * 0.4 + vec4(6.0, 1.0, 2.0, 0.0)) + 1.0) / d;
                }
                o = tanh(o * o / 6000.0);
                o *= 0.875;
                fragColor = vec4(o.rgb, 1.0);
            }
        `;

        const createShader = (type: number, source: string) => {
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            return shader;
        };

        const vertexShader = createShader(gl.VERTEX_SHADER, vsSource);
        const fragmentShader = createShader(gl.FRAGMENT_SHADER, fsSource);
        if (!vertexShader || !fragmentShader) return;

        const program = gl.createProgram();
        if (!program) return;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.useProgram(program);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

        const positionLoc = gl.getAttribLocation(program, "position");
        gl.enableVertexAttribArray(positionLoc);
        gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

        const timeLoc = gl.getUniformLocation(program, "time");
        const resLoc = gl.getUniformLocation(program, "resolution");

        let startTime = Date.now();
        let frameId: number;

        const render = () => {
            if (!canvas || !container) return;
            // Cap DPI for performance on 4k screens
            const dpr = Math.min(window.devicePixelRatio, 1.5); 
            const displayWidth = container.clientWidth;
            const displayHeight = container.clientHeight;
            
            if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
                canvas.width = displayWidth * dpr;
                canvas.height = displayHeight * dpr;
                gl.viewport(0, 0, canvas.width, canvas.height);
            }

            gl.uniform2f(resLoc, canvas.width, canvas.height);
            gl.uniform1f(timeLoc, (Date.now() - startTime) * 0.001);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            frameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(frameId);
            gl.deleteProgram(program);
        };
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 w-full h-full bg-[#020202]">
            <canvas ref={canvasRef} className="block w-full h-full opacity-60 mix-blend-screen" />
        </div>
    );
};

// --- SHADER 2: ELEMENT SHADER (Static or Very Simple) ---
const ContactElementShader: React.FC<{ className?: string }> = ({ className = "" }) => {
    return (
        <div className={`absolute inset-0 w-full h-full bg-[#0c0c0e] ${className}`}>
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
            }} />
        </div>
    );
};

// --- SECURITY VISUALIZER (Canvas 2D - Optimized) ---
const SecurityVisualizer: React.FC<{ mode: string | null }> = ({ mode }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<any[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false }); // Optimize compositing
        if (!ctx) return;

        let w = canvas.parentElement?.clientWidth || 800;
        let h = canvas.parentElement?.clientHeight || 600;
        canvas.width = w;
        canvas.height = h;

        const cx = w / 2;
        const cy = h / 2;

        if (particlesRef.current.length === 0) {
            for (let i = 0; i < 80; i++) { // Reduced count from 150 to 80
                particlesRef.current.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 2 + 1,
                });
            }
        }

        let animationFrameId: number;
        
        const render = () => {
            // Simplified clear
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, w, h);
            
            const particles = particlesRef.current;

            ctx.fillStyle = mode ? '#69B7B2' : 'rgba(255, 255, 255, 0.2)';
            
            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                
                if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
                ctx.fill();
            });

            if (mode === 'airgap') {
                ctx.strokeStyle = '#ef4444';
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.arc(cx, cy, 150, 0, Math.PI*2); ctx.stroke();
            } 

            animationFrameId = requestAnimationFrame(render);
        };
        
        render();
        
        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [mode]);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen opacity-80" />;
};

const INDUSTRY_CARDS = [
    { 
        id: 'logistics', 
        title: "Logistics", 
        subtitle: "Supply Chain",
        desc: "Operational decisions shaped by real-time movement.", 
        icon: Truck, 
        color: "#06b6d4",
        path: "our-clients/industries/logistics",
        Visualizer: LogisticsHeroVisualizer
    },
    { 
        id: 'smb', 
        title: "SMB Operations", 
        subtitle: "Growth Strategy",
        desc: "Rapid decision cycles and resource allocation.", 
        icon: Briefcase, 
        color: "#8b5cf6",
        path: "our-clients/industries/smb-operations",
        Visualizer: SmallBusinessHeroVisualizer
    },
    { 
        id: 'industrials', 
        title: "Industrials", 
        subtitle: "Heavy Assets",
        desc: "Stabilizing complex industrial operations.", 
        icon: Factory, 
        color: "#f59e0b",
        path: "our-clients/industries/industrials",
        Visualizer: IndustrialsHeroVisualizer
    },
    { 
        id: 'healthcare', 
        title: "Healthcare", 
        subtitle: "Clinical Ops",
        desc: "Reducing operational risk in regulated care.", 
        icon: Activity, 
        color: "#14b8a6",
        path: "our-clients/industries/healthcare",
        Visualizer: HealthcareHeroVisualizer
    },
    { 
        id: 'resources', 
        title: "Natural Resources", 
        subtitle: "Energy & Mining",
        desc: "Operations defined by physical constraints.", 
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

    const activeItem = INDUSTRY_CARDS[activeIndex];

    return (
        <div className="relative w-full h-[700px] flex items-center justify-center overflow-hidden">
            
            {/* Background Halo for Active Item */}
            <div 
                className="absolute inset-0 transition-all duration-1000 ease-in-out pointer-events-none"
                style={{
                    background: `radial-gradient(circle at 50% 50%, ${activeItem.color}20, transparent 70%)`
                }}
            />

            <div className="relative w-full max-w-7xl h-full mx-auto">
                {INDUSTRY_CARDS.map((item, index) => {
                    let offset = (index - activeIndex);
                    if (offset < -Math.floor(count / 2)) offset += count;
                    if (offset > Math.floor(count / 2)) offset -= count;
                    
                    const isActive = offset === 0;
                    const isVisible = Math.abs(offset) <= 1; 

                    // Strict Optimization: Do not render DOM if far away
                    if (!isVisible) return null;

                    const style: React.CSSProperties = {
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: 'min(380px, 85vw)',
                        height: '500px',
                        transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
                        zIndex: isActive ? 20 : 10,
                        opacity: isActive ? 1 : 0.4, 
                        transform: isActive 
                            ? 'translate(-50%, -50%) scale(1)' 
                            : `translate(calc(-50% + ${offset * 110}%), -50%) scale(0.85)`,
                        filter: isActive ? 'none' : 'grayscale(100%) blur(1px)', 
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
                            <div className="relative w-full h-full rounded-3xl bg-[#0c0c0e] group shadow-2xl overflow-hidden border border-white/10">
                                
                                {/* 
                                    CRITICAL OPTIMIZATION:
                                    Only mount the Heavy WebGL Visualizer if this card is ACTIVE.
                                    Neighbors get a static placeholder or just a dark background.
                                    This saves 4 simultaneous WebGL contexts.
                                */}
                                {isActive ? (
                                    <div className="absolute inset-0">
                                        <item.Visualizer />
                                        <div className="absolute inset-0 bg-black/40" />
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-black" />
                                )}
                                    
                                <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e]/95 to-transparent pointer-events-none" />

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

                                {isActive && (
                                    <div 
                                        className="absolute inset-0 rounded-3xl pointer-events-none transition-all duration-500"
                                        style={{
                                            border: '1px solid',
                                            borderColor: isActive ? `${item.color}80` : 'rgba(255,255,255,0.1)',
                                            boxShadow: isActive ? `0 0 40px ${item.color}15` : 'none'
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

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
      
      {/* --- 1. HERO (IMMEDIATE LOAD) --- */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#020202] pt-20">
        <div className="absolute inset-0 opacity-100">
            {/* Critical LCP Element - kept eager */}
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
      </section>

      {/* --- 2. SECURITY BANNER (LAZY LOADED) --- */}
      <ViewportSlot minHeight="600px">
          <section id="security" className="relative py-24 bg-[#050505] border-t border-white/10 overflow-hidden">
              <SecurityVisualizer mode={activeSecurityFeature} />
              <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl mx-auto mb-8 flex items-center justify-center text-white backdrop-blur-md border border-white/10">
                      <Lock size={32} />
                  </div>
                  <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">Your data stays yours.</h2>
                  <p className="text-lg text-white/50 leading-relaxed mb-12">
                      We offer on-premise deployment options for total sovereignty. No data ever leaves your secure enclave without explicit authorization.
                  </p>
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
      </ViewportSlot>

      {/* --- 3. TRUST BADGES --- */}
      <section className="py-16 border-y border-white/5 bg-[#030303]">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="text-left md:w-1/3">
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

      {/* --- 4. MAIN FEATURES (LAZY) --- */}
      <ViewportSlot minHeight="800px" id="features">
          <Suspense fallback={<div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-white/20"/></div>}>
             <FeatureShowcase />
          </Suspense>
      </ViewportSlot>

      {/* --- 5. INDUSTRY PORTAL (LAZY) --- */}
      <ViewportSlot minHeight="800px">
          <section className="py-32 bg-[#080808] border-y border-white/5 relative overflow-hidden">
              <div className="w-full">
                  <div className="text-center mb-20 px-6 relative z-10">
                      <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Built for Mission-Critical Workflows</h2>
                      <p className="text-white/50 text-lg max-w-2xl mx-auto">
                          Deep vertical specialization where generic AI fails. We speak the language of your operations.
                      </p>
                  </div>
                  {/* Heavy Carousel Component - Now Optimized Internally */}
                  <IndustryCarousel />
              </div>
          </section>
      </ViewportSlot>

      {/* --- 6. SOLUTIONS SHOWCASE (LAZY) --- */}
      <ViewportSlot minHeight="700px" id="solutions">
          <Suspense fallback={<div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-white/20"/></div>}>
            <UseCaseShowcase />
          </Suspense>
      </ViewportSlot>

      {/* --- 7. CONTACT SECTION (LAZY) --- */}
      <ViewportSlot minHeight="600px" id="contact">
          <section className="relative py-24 bg-[#0c0c0e] border-t border-white/10 overflow-hidden">
              <div className="absolute inset-0 z-0">
                  <ContactBackgroundShader />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#020202] via-[#020202]/80 to-transparent" />
              </div>

              <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-16 items-center">
                  <div className="w-full lg:w-1/2 space-y-12">
                      <div className="space-y-6">
                          <h2 className="text-5xl md:text-7xl font-serif text-white leading-tight drop-shadow-xl">
                              Let’s talk about your <br/> <span className="text-[#69B7B2] italic">operational reality.</span>
                          </h2>
                          <p className="text-xl text-white/60 font-light max-w-md border-l border-white/20 pl-6 drop-shadow-md">
                              Every engagement starts with understanding how your organization actually works.
                          </p>
                      </div>
                      <div className="relative group overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
                          <ContactElementShader />
                          <div className="relative p-10 flex items-start justify-between z-10">
                              <div>
                                  <div className="flex items-center gap-3 mb-4">
                                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                                      <span className="text-[10px] font-mono text-green-500 uppercase tracking-widest">Headquarters</span>
                                  </div>
                                  <h3 className="text-3xl font-serif text-white mb-2">New York City</h3>
                                  <p className="text-white/60 text-sm mb-6 max-w-[200px] leading-relaxed">New York, NY</p>
                                  <div className="flex flex-col gap-3">
                                      <a href="mailto:connect@infogito.com" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group/link">
                                          <div className="p-1.5 bg-white/10 rounded text-[#69B7B2] group-hover/link:bg-[#69B7B2] group-hover/link:text-black transition-all">
                                              <Mail size={14} />
                                          </div>
                                          <span className="text-sm font-mono">connect@infogito.com</span>
                                      </a>
                                  </div>
                              </div>
                              <div className="hidden md:flex w-24 h-24 bg-[#69B7B2]/10 rounded-2xl items-center justify-center border border-[#69B7B2]/20 backdrop-blur-md">
                                  <Building2 size={40} className="text-[#69B7B2] opacity-80" strokeWidth={1} />
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="w-full lg:w-1/2">
                      <div className="relative rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden group border border-white/10">
                          <ContactElementShader />
                          {formState === 'sent' ? (
                              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0c0c0e]/80 backdrop-blur-xl animate-in fade-in duration-500 z-20">
                                  <div className="w-24 h-24 bg-[#69B7B2]/10 rounded-full flex items-center justify-center text-[#69B7B2] mb-8 border border-[#69B7B2]/20 shadow-[0_0_30px_rgba(105,183,178,0.2)]">
                                      <CheckCircle2 size={48} />
                                  </div>
                                  <h3 className="text-3xl font-serif text-white mb-2">Message Sent</h3>
                                  <button onClick={() => setFormState('idle')} className="mt-12 text-xs font-bold uppercase tracking-widest text-[#69B7B2] hover:text-white transition-colors flex items-center gap-2">
                                      <Terminal size={14} /> Send Another
                                  </button>
                              </div>
                          ) : (
                              <form onSubmit={handleContactSubmit} className="space-y-8 relative z-10">
                                  <div className="space-y-6">
                                      <div className="grid grid-cols-2 gap-6">
                                          <div className="space-y-2 group/field">
                                              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 group-focus-within/field:text-[#69B7B2] transition-colors">First Name</label>
                                              <input type="text" required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#69B7B2] focus:bg-black/60 transition-all placeholder:text-white/20 font-sans backdrop-blur-sm" placeholder="Jane" />
                                          </div>
                                          <div className="space-y-2 group/field">
                                              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 group-focus-within/field:text-[#69B7B2] transition-colors">Last Name</label>
                                              <input type="text" required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#69B7B2] focus:bg-black/60 transition-all placeholder:text-white/20 font-sans backdrop-blur-sm" placeholder="Doe" />
                                          </div>
                                      </div>
                                      <div className="space-y-2 group/field">
                                          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 group-focus-within/field:text-[#69B7B2] transition-colors">Work Email</label>
                                          <input type="email" required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#69B7B2] focus:bg-black/60 transition-all placeholder:text-white/20 font-sans backdrop-blur-sm" placeholder="jane@company.com" />
                                      </div>
                                      <div className="space-y-2 group/field">
                                          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 group-focus-within/field:text-[#69B7B2] transition-colors">Message</label>
                                          <textarea rows={4} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#69B7B2] focus:bg-black/60 transition-all resize-none placeholder:text-white/20 font-sans backdrop-blur-sm" placeholder="Tell us about your needs..." />
                                      </div>
                                  </div>
                                  <button type="submit" disabled={formState === 'sending'} className="w-full bg-[#69B7B2] hover:bg-[#5aa09c] text-black font-bold uppercase tracking-widest text-xs py-5 rounded-xl transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(105,183,178,0.2)] hover:shadow-[0_0_50px_rgba(105,183,178,0.4)] disabled:opacity-50 disabled:cursor-not-allowed group/btn relative overflow-hidden">
                                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                                      <span className="relative z-10 flex items-center gap-3">
                                          {formState === 'sending' ? 'Sending Message...' : <>Start a conversation <MoveRight size={16} className="group-hover/btn:translate-x-1 transition-transform" /></>}
                                      </span>
                                  </button>
                              </form>
                          )}
                      </div>
                  </div>
              </div>
          </section>
      </ViewportSlot>

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
