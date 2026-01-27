
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

// --- SHADER 1: CONTACT BACKGROUND ---
const ContactBackgroundShader: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const gl = canvas.getContext('webgl2');
        if (!gl) return;

        const vsSource = `#version 300 es
            in vec2 position;
            void main() {
                gl_Position = vec4(position, 0.0, 1.0);
            }
        `;

        const fsSource = `#version 300 es
            precision highp float;
            uniform vec2 resolution;
            uniform float time;
            out vec4 fragColor;

            void main() {
                vec2 r = resolution;
                float t = time * 0.2; 
                vec4 o = vec4(0.0);
                
                // Centered UVs - Corrected to look into -Z
                vec2 uv = (gl_FragCoord.xy - r * 0.5) / min(r.x, r.y);
                
                // ZOOM: Scale UVs down to zoom in (0.75 scale = ~33% zoom in)
                uv *= 0.75;

                vec3 rd = normalize(vec3(uv, -1.0));
                
                float z = 0.0;
                float d = 0.0;
                
                for(float i=0.0; i<40.0; i++) {
                    vec3 p = z * rd;
                    
                    // Domain distortion
                    p.z += 9.0;
                    
                    float nx = atan(p.z, p.x + 1.0) * 2.0;
                    float ny = 0.6 * p.y + t + t;
                    float nz = length(p.xz) - 3.0;
                    
                    vec3 p_loop = vec3(nx, ny, nz);
                    
                    for(float j=1.0; j<7.0; j++) {
                        p_loop += sin(p_loop.yzx * j + t + 0.5 * i) / j;
                    }
                    
                    vec3 v3 = 0.3 * cos(p_loop) - 0.3;
                    d = 0.4 * length(vec4(v3, p_loop.z)); 
                    d = max(d, 0.002);
                    z += d;
                    
                    o += (cos(p_loop.y + i * 0.4 + vec4(6.0, 1.0, 2.0, 0.0)) + 1.0) / d;
                }
                
                o = tanh(o * o / 6000.0);
                o *= 0.875; // Brightness adjust
                
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
            const dpr = window.devicePixelRatio || 1;
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

// --- SHADER 2: ELEMENT SHADER (Dimmed) ---
const ContactElementShader: React.FC<{ className?: string }> = ({ className = "" }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const gl = canvas.getContext('webgl2');
        if (!gl) return;

        const vsSource = `#version 300 es
            in vec2 position;
            void main() {
                gl_Position = vec4(position, 0.0, 1.0);
            }
        `;

        const fsSource = `#version 300 es
            precision highp float;
            uniform vec2 resolution;
            uniform float time;
            out vec4 fragColor;

            void main() {
                vec2 r = resolution;
                float t = time * 0.5;
                vec4 o = vec4(0.0);
                
                vec2 uv = (gl_FragCoord.xy - r * 0.5) / min(r.x, r.y);
                vec3 rd = normalize(vec3(uv, 1.0));
                
                vec3 c = vec3(0.0);
                vec3 p = vec3(0.0);
                float z = 0.0;
                float f = 0.0;
                
                for(float i=0.0; i<40.0; i++) {
                    p = z * rd;
                    p.z -= t;
                    c = p;
                    
                    float f_loop = 0.3;
                    for(int j=0; j<5; j++) {
                        f_loop += 1.0;
                        p += cos(p.yzx * f_loop + i / 0.4) / f_loop;
                    }
                    
                    p = mix(c, p, 0.3);
                    
                    float term = dot(cos(p), sin(p.yzx / 0.6)) + abs(p.y) - 3.0;
                    f = 0.2 * abs(term);
                    z += f;
                    
                    o += (cos(z + vec4(6.0, 1.0, 2.0, 0.0)) + 2.0) / f / z;
                }
                
                o = tanh(o / 800.0);
                o *= 0.16; // Dim for readability
                
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
            const dpr = window.devicePixelRatio || 1;
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
        <div ref={containerRef} className={`absolute inset-0 w-full h-full bg-[#0c0c0e] ${className}`}>
            <canvas ref={canvasRef} className="block w-full h-full opacity-100" />
            <div className="absolute inset-0 bg-black/60" /> {/* Extra overlay for contrast */}
        </div>
    );
};

const SecurityVisualizer: React.FC<{ mode: string | null }> = ({ mode }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<any[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let w = canvas.parentElement?.clientWidth || 800;
        let h = canvas.parentElement?.clientHeight || 600;
        canvas.width = w;
        canvas.height = h;

        const cx = w / 2;
        const cy = h / 2;

        // Initialize particles if empty
        if (particlesRef.current.length === 0) {
            for (let i = 0; i < 200; i++) {
                particlesRef.current.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 2 + 1,
                    color: 'rgba(255, 255, 255, 0.2)',
                    // Mode specific memory
                    aesChar: Math.random() > 0.5 ? '1' : '0'
                });
            }
        }

        let animationFrameId: number;
        let time = 0;

        const render = () => {
            time += 0.02;
            
            // Clear with heavy trail for motion blur effect
            ctx.fillStyle = 'rgba(5, 5, 5, 0.2)';
            ctx.fillRect(0, 0, w, h);
            ctx.globalCompositeOperation = 'source-over';

            const particles = particlesRef.current;

            // --- DRAW & UPDATE PARTICLES ---
            particles.forEach((p, i) => {
                let forceX = 0;
                let forceY = 0;
                let friction = 0.94;
                let speedLimit = 3;
                let targetColor = 'rgba(255, 255, 255, 0.15)'; 

                // --- PHYSICS FIELDS ---
                
                if (mode === 'airgap') {
                    // Ring Repulsion
                    const r = 250;
                    const dx = p.x - cx;
                    const dy = p.y - cy;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    
                    if (dist < r - 10) {
                        // Trap inside
                        const angle = Math.atan2(dy, dx) + 0.05;
                        const tx = cx + Math.cos(angle) * (dist * 0.99); // Spiral in slightly
                        const ty = cy + Math.sin(angle) * (dist * 0.99);
                        forceX = (tx - p.x) * 0.1;
                        forceY = (ty - p.y) * 0.1;
                        targetColor = '#10b981';
                    } else if (dist < r + 30) {
                        // Bounce boundary
                        const angle = Math.atan2(dy, dx);
                        forceX = Math.cos(angle) * 0.8;
                        forceY = Math.sin(angle) * 0.8;
                        targetColor = '#ef4444';
                    } else {
                        // Drift outside
                        forceX = (Math.random() - 0.5) * 0.05;
                        forceY = (Math.random() - 0.5) * 0.05;
                        targetColor = '#ef4444';
                    }
                } 
                else if (mode === 'rbac') {
                    // Hierarchy Nodes
                    const levels = 3;
                    const levelHeight = 100;
                    const level = i % levels;
                    const spread = (w * 0.5) / (levels + 1);
                    const tx = cx + ((i % 5) - 2) * spread;
                    const ty = cy + (level - 1) * levelHeight + Math.sin(time + i)*5;
                    
                    forceX = (tx - p.x) * 0.04;
                    forceY = (ty - p.y) * 0.04;
                    friction = 0.85; // Heavier damping
                    
                    targetColor = level === 0 ? '#10b981' : level === 1 ? '#3b82f6' : '#64748b';
                }
                else if (mode === 'aes') {
                    // Vortex Stream
                    const dx = p.x - cx;
                    const dy = p.y - cy;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    const targetR = 150 + Math.sin(i * 0.1) * 100;
                    
                    const angle = Math.atan2(dy, dx);
                    const tangent = angle + (dist < targetR ? 0.1 : -0.05); // Spiral behavior
                    
                    const tx = cx + Math.cos(tangent) * targetR;
                    const ty = cy + Math.sin(tangent) * targetR;
                    
                    forceX = (tx - p.x) * 0.03;
                    forceY = (ty - p.y) * 0.03;
                    targetColor = '#eab308';
                }
                else if (mode === 'tenant') {
                    // Containment Box
                    const boxW = 200;
                    const boxH = 300;
                    const left = cx - boxW/2;
                    const right = cx + boxW/2;
                    const top = cy - boxH/2;
                    const bottom = cy + boxH/2;
                    
                    if (p.x > left && p.x < right && p.y > top && p.y < bottom) {
                        // Inside: Bounce
                        if (p.x + p.vx > right || p.x + p.vx < left) p.vx *= -1;
                        if (p.y + p.vy > bottom || p.y + p.vy < top) p.vy *= -1;
                    } else {
                        // Outside: Attract
                        forceX = (cx - p.x) * 0.04;
                        forceY = (cy - p.y) * 0.04;
                    }
                    targetColor = '#a855f7';
                }
                else {
                    // IDLE: Starfield Drift
                    forceX = (Math.random() - 0.5) * 0.02;
                    forceY = (Math.random() - 0.5) * 0.02;
                    // Gentle wrap
                    if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
                    if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
                    targetColor = 'rgba(255, 255, 255, 0.2)';
                }

                // Apply Physics
                p.vx += forceX;
                p.vy += forceY;
                p.vx *= friction;
                p.vy *= friction;
                
                // Cap speed
                const s = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
                if (s > speedLimit) {
                    p.vx = (p.vx/s) * speedLimit;
                    p.vy = (p.vy/s) * speedLimit;
                }

                p.x += p.vx;
                p.y += p.vy;

                // Render
                ctx.fillStyle = targetColor;
                
                if (mode === 'aes' && Math.random() > 0.5) {
                    // Draw binary for AES
                    ctx.font = '10px monospace';
                    ctx.fillText(p.aesChar, p.x, p.y);
                } else {
                    // Standard dot
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
                    ctx.fill();
                }

                // Connectors for RBAC
                if (mode === 'rbac' && i % 3 === 0) {
                    const parent = particles[Math.max(0, i-1)];
                    if (parent) {
                        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
                        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(parent.x, parent.y); ctx.stroke();
                    }
                }
            });

            // --- STATIC OVERLAYS ---
            if (mode === 'airgap') {
                ctx.strokeStyle = '#ef4444';
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.arc(cx, cy, 250, 0, Math.PI*2); ctx.stroke();
                ctx.fillStyle = '#ef4444'; ctx.textAlign = 'center'; ctx.font = '10px monospace';
                ctx.fillText("AIRGAP_PROTOCOL", cx, cy + 270);
            } else if (mode === 'tenant') {
                ctx.strokeStyle = '#a855f7';
                ctx.lineWidth = 2;
                ctx.strokeRect(cx - 100, cy - 150, 200, 300);
                ctx.fillStyle = '#a855f7'; ctx.textAlign = 'center'; ctx.font = '10px monospace';
                ctx.fillText("SINGLE_TENANT_SILO", cx, cy + 170);
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

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen opacity-80" />;
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

      {/* --- 7. CONTACT SECTION (Refreshed with High-Fidelity Shaders) --- */}
      <section id="contact" className="relative py-24 bg-[#0c0c0e] border-t border-white/10 overflow-hidden">
          {/* Global Visualizer Background */}
          <div className="absolute inset-0 z-0">
              <ContactBackgroundShader />
              <div className="absolute inset-0 bg-gradient-to-r from-[#020202] via-[#020202]/80 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-16 items-center">
              {/* Left Column */}
              <div className="w-full lg:w-1/2 space-y-12">
                  <div className="space-y-6">
                      <h2 className="text-5xl md:text-7xl font-serif text-white leading-tight drop-shadow-xl">
                          Let’s talk about your <br/> <span className="text-[#69B7B2] italic">operational reality.</span>
                      </h2>
                      <p className="text-xl text-white/60 font-light max-w-md border-l border-white/20 pl-6 drop-shadow-md">
                          Every engagement starts with understanding how your organization actually works.
                      </p>
                  </div>

                  {/* HQ Card with Element Shader */}
                  <div className="relative group overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
                      <ContactElementShader />
                      
                      <div className="relative p-10 flex items-start justify-between z-10">
                          <div>
                              <div className="flex items-center gap-3 mb-4">
                                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                                  <span className="text-[10px] font-mono text-green-500 uppercase tracking-widest">Headquarters</span>
                              </div>
                              <h3 className="text-3xl font-serif text-white mb-2">New York City</h3>
                              <p className="text-white/60 text-sm mb-6 max-w-[200px] leading-relaxed">
                                  New York, NY
                              </p>
                              
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

              {/* Right Column (Form) */}
              <div className="w-full lg:w-1/2">
                  <div className="relative rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden group border border-white/10">
                      
                      {/* Form Container Shader */}
                      <ContactElementShader />

                      {formState === 'sent' ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0c0c0e]/80 backdrop-blur-xl animate-in fade-in duration-500 z-20">
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
                                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 group-focus-within/field:text-[#69B7B2] transition-colors">Inquiry Type</label>
                                      <div className="relative">
                                          <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#69B7B2] focus:bg-black/60 transition-all appearance-none cursor-pointer font-sans backdrop-blur-sm">
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
                                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 group-focus-within/field:text-[#69B7B2] transition-colors">Message</label>
                                      <textarea rows={4} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#69B7B2] focus:bg-black/60 transition-all resize-none placeholder:text-white/20 font-sans backdrop-blur-sm" placeholder="Tell us about your needs..." />
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
