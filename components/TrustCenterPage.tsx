
import React, { useEffect, useRef, useState } from 'react';
import { 
    Shield, Lock, Key, Server, Globe, FileCheck, Eye, 
    CheckCircle2, AlertTriangle, Fingerprint, Network, 
    Database, FileText, ChevronDown, Terminal, ScanLine, 
    Cpu, Activity, Zap, Search, Layout, Command, Hexagon,
    ShieldCheck, UserCheck, RefreshCw, X, Square, Minimize,
    ArrowRight, ArrowLeft, Anchor, FileCode, Siren, HardDrive,
    Radar, Ban, Globe2, Hash, ChevronRight, Binary, Layers,
    Users
} from 'lucide-react';
import { NeuralBackground } from './NeuralBackground';
import { useNavigation } from '../context/NavigationContext';
import { SiteFooter } from './SiteFooter';

// --- VISUALIZER ENGINE: ABSTRACT SECURITY ---
// Persistent particle system that morphs between security states
const AbstractSecurityVisualizer: React.FC<{ mode: string; color?: string }> = ({ mode, color = '#69B7B2' }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<any[]>([]);
    const reqRef = useRef<number>(null);

    // Initialize particles once
    useEffect(() => {
        // Create 200 particles
        if (particlesRef.current.length === 0) {
            for(let i=0; i<200; i++) {
                particlesRef.current.push({
                    x: Math.random() * 800,
                    y: Math.random() * 600,
                    tx: Math.random() * 800, // Target X
                    ty: Math.random() * 600, // Target Y
                    r: Math.random() * 2 + 1,
                    alpha: 0.5 + Math.random() * 0.5
                });
            }
        }
    }, []);

    // Update Targets based on Mode
    useEffect(() => {
        const canvas = canvasRef.current;
        const w = canvas?.parentElement?.clientWidth || 800;
        const h = canvas?.parentElement?.clientHeight || 600;
        const particles = particlesRef.current;
        const cx = w/2; 
        const cy = h/2;

        if (mode === 'isolation') {
            // Two separate clusters (Silo)
            particles.forEach((p, i) => {
                const cluster = i % 2;
                const center = cluster === 0 ? {x: w*0.3, y: h*0.5} : {x: w*0.7, y: h*0.5};
                const angle = Math.random() * Math.PI * 2;
                // Gaussian-like distribution
                const r = (Math.random() + Math.random() + Math.random()) / 3 * 150; 
                p.tx = center.x + Math.cos(angle) * r;
                p.ty = center.y + Math.sin(angle) * r;
            });
        } else if (mode === 'encryption') {
            // Matrix Grid
            const cols = 20;
            const rows = 10;
            const spacingX = w / (cols + 1);
            const spacingY = h / (rows + 1);
            particles.forEach((p, i) => {
                const col = i % cols;
                const row = Math.floor(i / cols) % rows;
                p.tx = spacingX * (col + 1) + (Math.random()-0.5)*5;
                p.ty = spacingY * (row + 1) + (Math.random()-0.5)*5;
            });
        } else if (mode === 'redaction') {
            // Lines with gaps
            const lines = 12;
            const perLine = Math.floor(particles.length / lines);
            const lineWidth = w * 0.8;
            const startX = w * 0.1;
            
            particles.forEach((p, i) => {
                const line = Math.floor(i / perLine);
                const posInLine = (i % perLine) / perLine;
                
                // Redact middle section
                let x = startX + posInLine * lineWidth;
                if (x > w*0.4 && x < w*0.6) {
                    x = (x < w*0.5) ? w*0.38 : w*0.62;
                }
                
                p.tx = x + (Math.random()-0.5)*5;
                p.ty = (h/(lines+1)) * (line+1) + (Math.random()-0.5)*2;
            });
        } else if (mode === 'audit') {
            // Sine wave stream (Log timeline)
            particles.forEach((p, i) => {
                const t = i / particles.length;
                p.tx = w * 0.1 + t * w * 0.8;
                p.ty = h/2 + Math.sin(t * Math.PI * 4) * 100 + (Math.random()-0.5)*40;
            });
        } else {
            // Default Cloud
            particles.forEach((p, i) => {
                const angle = Math.random() * Math.PI * 2;
                const r = Math.random() * 250;
                p.tx = cx + Math.cos(angle) * r;
                p.ty = cy + Math.sin(angle) * r;
            });
        }
    }, [mode]);

    // Animation Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const render = () => {
            // Resize handling inside loop
            const rect = canvas.parentElement?.getBoundingClientRect();
            if (rect && (canvas.width !== rect.width || canvas.height !== rect.height)) {
                canvas.width = rect.width;
                canvas.height = rect.height;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw Connections First (Background)
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = mode === 'redaction' ? '#ef4444' : mode === 'audit' ? '#f59e0b' : color;
            ctx.globalAlpha = 0.1;
            ctx.beginPath();
            
            const parts = particlesRef.current;
            // Only connect nearby particles
            for(let i=0; i<parts.length; i++) {
                const p1 = parts[i];
                // Check a few neighbors to simulate connectivity without O(N^2)
                for(let j=1; j<=3; j++) {
                    const p2 = parts[(i+j) % parts.length];
                    const distSq = (p1.x-p2.x)**2 + (p1.y-p2.y)**2;
                    if (distSq < 2500) { // 50px distance
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                    }
                }
            }
            ctx.stroke();

            // Update & Draw Particles
            ctx.fillStyle = mode === 'redaction' ? '#ef4444' : mode === 'audit' ? '#f59e0b' : color;
            
            parts.forEach(p => {
                // SLOWER LERP: Decreased from 0.15 to 0.05
                p.x += (p.tx - p.x) * 0.05;
                p.y += (p.ty - p.y) * 0.05;
                
                ctx.globalAlpha = p.alpha;
                ctx.beginPath(); 
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); 
                ctx.fill();
            });

            reqRef.current = requestAnimationFrame(render);
        };
        render();

        return () => {
            if (reqRef.current) cancelAnimationFrame(reqRef.current);
        };
    }, [mode, color]); 

    return <canvas ref={canvasRef} className="w-full h-full" />;
};

// --- COMPONENT: DATA SOVEREIGNTY SECTION (Restored) ---
const DataSovereigntySection: React.FC = () => {
    const [activeMode, setActiveMode] = useState('isolation');

    const cards = [
        {
            id: 'isolation',
            title: "Strict Isolation",
            desc: "Single-tenant architecture ensures zero crossover.",
            icon: Server
        },
        {
            id: 'encryption',
            title: "Field Encryption",
            desc: "Data is encrypted at rest and in transit.",
            icon: Lock
        },
        {
            id: 'redaction',
            title: "PII Redaction",
            desc: "Automatic stripping of sensitive identifiers.",
            icon: Eye
        },
        {
            id: 'audit',
            title: "Immutable Logs",
            desc: "Every action is recorded and traceable.",
            icon: FileCheck
        }
    ];

    return (
        <section className="py-32 bg-[#050505] border-b border-white/5 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                
                <div className="mb-16 text-center">
                    <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Your Data Stays Yours</h2>
                    <p className="text-xl text-white/50 max-w-3xl mx-auto leading-relaxed font-light">
                        Our architecture is built on the principle of radical sovereignty. We do not train on your data, we do not share it, and we do not claim ownership.
                    </p>
                </div>

                <div className="relative w-full h-[600px] bg-[#0c0c0e] rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex flex-col">
                    
                    {/* Visualizer Stage */}
                    <div className="absolute inset-0 z-0">
                        <AbstractSecurityVisualizer mode={activeMode} color="#69B7B2" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-transparent opacity-80" />
                    </div>

                    {/* Interactive Cards Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {cards.map((card) => {
                                const isActive = activeMode === card.id;
                                return (
                                    <button
                                        key={card.id}
                                        onMouseEnter={() => setActiveMode(card.id)}
                                        className={`group relative p-6 rounded-xl border text-left transition-all duration-300 ${
                                            isActive 
                                            ? 'bg-white/10 border-white/20 shadow-lg backdrop-blur-md translate-y-0' 
                                            : 'bg-black/40 border-white/5 hover:bg-white/5 hover:border-white/10 backdrop-blur-sm translate-y-2 hover:translate-y-0'
                                        }`}
                                    >
                                        <div className={`mb-4 w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${isActive ? 'bg-[#69B7B2] text-black' : 'bg-white/5 text-white/50 group-hover:text-white'}`}>
                                            <card.icon size={20} />
                                        </div>
                                        <h3 className={`text-lg font-bold mb-2 transition-colors ${isActive ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                                            {card.title}
                                        </h3>
                                        <p className="text-xs text-white/50 leading-relaxed">
                                            {card.desc}
                                        </p>
                                        {isActive && (
                                            <div className="absolute inset-0 border-2 border-[#69B7B2]/30 rounded-xl pointer-events-none animate-pulse" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
};

// --- VISUALIZER: THE TRI-STATE DEFENSE (Right Justified, 3 Steps) ---
const TrustHeroVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let w = canvas.width = canvas.parentElement?.clientWidth || 800;
        let h = canvas.height = canvas.parentElement?.clientHeight || 600;
        
        let time = 0;
        let frameId: number;

        // Configuration
        const PARTICLE_COUNT = 400;
        const PHASE_DURATION = 300; // Frames per phase
        const TRANSITION_DURATION = 100; // Frames for smooth interpolation

        // State
        let phase = 0; // 0: Ring, 1: Cube, 2: Shield
        let phaseTimer = 0;
        
        interface Point3D { x: number, y: number, z: number }
        interface Particle {
            x: number; y: number; z: number;
            tx: number; ty: number; tz: number; // Target
            color: string;
        }

        const particles: Particle[] = [];

        // --- SHAPE GENERATORS ---

        // Shape 1: Orbiting Ring (Scanning)
        const getRingPoint = (i: number): Point3D => {
            const angle = (i / PARTICLE_COUNT) * Math.PI * 2 * 3; // 3 loops
            const r = 180 + Math.random() * 40;
            return {
                x: Math.cos(angle) * r,
                y: (Math.random() - 0.5) * 40, // Flat disk
                z: Math.sin(angle) * r
            };
        };

        // Shape 2: Cube Lattice (Structure)
        const getCubePoint = (i: number): Point3D => {
            const side = Math.ceil(Math.cbrt(PARTICLE_COUNT));
            const spacing = 220 / side;
            const x = (i % side) * spacing - 110;
            const y = (Math.floor(i / side) % side) * spacing - 110;
            const z = (Math.floor(i / (side * side))) * spacing - 110;
            return { x, y, z };
        };

        // Shape 3: Shield (Protection)
        const getShieldPoint = (i: number): Point3D => {
            // Parametric shield-ish shape
            const ratio = i / PARTICLE_COUNT; // 0 to 1
            const layer = Math.floor(ratio * 20); // 20 layers vertically
            const y = -150 + (layer / 20) * 300; // Top to bottom
            
            const normY = (y + 50) / 200; 
            const widthAtY = 160 * Math.cos(normY * 1.5); // Curve
            
            const angle = (i % 20) / 20 * Math.PI * 2; 
            const x = Math.sin(angle) * widthAtY;
            const z = Math.cos(angle) * Math.max(0, widthAtY * 0.5); // Curved front

            return { x, y, z: z - 20 };
        };

        // Initialize Particles
        for(let i=0; i<PARTICLE_COUNT; i++) {
            const p = getRingPoint(i);
            particles.push({
                x: p.x, y: p.y, z: p.z,
                tx: p.x, ty: p.y, tz: p.z,
                color: Math.random() > 0.8 ? '#ffffff' : '#69B7B2'
            });
        }

        const setTargets = (pIdx: number) => {
            particles.forEach((p, i) => {
                let target: Point3D;
                if (pIdx === 0) target = getRingPoint(i);
                else if (pIdx === 1) target = getCubePoint(i);
                else target = getShieldPoint(i);
                
                p.tx = target.x;
                p.ty = target.y;
                p.tz = target.z;
            });
        };

        const render = () => {
            time += 0.005; // SLOWED (was 0.01)
            phaseTimer++;

            // Phase Switching Logic
            if (phaseTimer > PHASE_DURATION * 2) { // SLOWED (doubled duration)
                phaseTimer = 0;
                phase = (phase + 1) % 3;
                setTargets(phase);
            }

            // Clear
            ctx.fillStyle = '#020202';
            ctx.fillRect(0, 0, w, h);

            // Responsive Center: Right justified on large screens
            const cx = w > 1024 ? w * 0.75 : w * 0.5;
            const cy = h * 0.5;

            // Rotation
            const rotY = time * 0.2;
            const rotX = Math.sin(time * 0.5) * 0.1;

            // Update & Draw
            ctx.lineWidth = 1;
            
            const isStable = phaseTimer > TRANSITION_DURATION && phaseTimer < (PHASE_DURATION * 2 - TRANSITION_DURATION);
            
            particles.forEach((p, i) => {
                // Lerp to target
                p.x += (p.tx - p.x) * 0.02; // SLOWED Lerp (was 0.05)
                p.y += (p.ty - p.y) * 0.02;
                p.z += (p.tz - p.z) * 0.02;

                // Add slight noise based on phase
                let nx = p.x, ny = p.y, nz = p.z;
                if (phase === 0) { // Ring scans
                    ny += Math.sin(time * 5 + p.x * 0.1) * 10;
                }

                // Rotate
                let x = nx * Math.cos(rotY) - nz * Math.sin(rotY);
                let z = nz * Math.cos(rotY) + nx * Math.sin(rotY);
                let y = ny * Math.cos(rotX) - z * Math.sin(rotX);
                z = z * Math.cos(rotX) + ny * Math.sin(rotX);

                // Project
                const scale = 500 / (500 + z);
                const px = cx + x * scale;
                const py = cy + y * scale;

                if (scale > 0) {
                    const alpha = Math.min(1, (scale - 0.2));
                    ctx.globalAlpha = alpha;
                    ctx.fillStyle = p.color;
                    const size = scale * 1.5;
                    ctx.beginPath(); ctx.arc(px, py, size, 0, Math.PI*2); ctx.fill();
                    
                    // Connect neighbors for structure feel
                    if (isStable && i % 8 === 0 && phase !== 0) {
                         const neighbor = particles[(i+1)%PARTICLE_COUNT];
                         // Simplified projection for neighbor
                         let nx2 = neighbor.x * Math.cos(rotY) - neighbor.z * Math.sin(rotY);
                         let nz2 = neighbor.z * Math.cos(rotY) + neighbor.x * Math.sin(rotY);
                         let ny2 = neighbor.y * Math.cos(rotX) - nz2 * Math.sin(rotX);
                         nz2 = nz2 * Math.cos(rotX) + neighbor.y * Math.sin(rotX);
                         
                         const scale2 = 500 / (500 + nz2);
                         if (scale2 > 0) {
                             ctx.strokeStyle = `rgba(105, 183, 178, ${0.15 * alpha})`;
                             ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(cx + nx2 * scale2, cy + ny2 * scale2); ctx.stroke();
                         }
                    }
                }
            });
            ctx.globalAlpha = 1;

            // HUD Elements (Right Side)
            if (w > 1024) {
                const progress = phaseTimer / (PHASE_DURATION * 2);
                ctx.fillStyle = 'rgba(105, 183, 178, 0.1)';
                ctx.fillRect(cx - 50, cy + 290, 100, 2);
                ctx.fillStyle = '#69B7B2';
                ctx.fillRect(cx - 50, cy + 290, 100 * progress, 2);
            }

            frameId = requestAnimationFrame(render);
        };
        render();

        const handleResize = () => {
            if (canvas.parentElement) {
                w = canvas.width = canvas.parentElement.clientWidth;
                h = canvas.height = canvas.parentElement.clientHeight;
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(frameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

// --- VISUALIZERS: GOVERNANCE DASHBOARD ---
const ThreatMap: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let w = canvas.parentElement?.clientWidth || 300;
        let h = canvas.parentElement?.clientHeight || 300;
        canvas.width = w; canvas.height = h;
        
        let time = 0; let frameId: number;
        const pings: {x:number, y:number, life:number, color: string}[] = [];
        
        const render = () => {
            time += 0.005; // SLOWED (was 0.01)
            ctx.clearRect(0,0,w,h);
            
            // Draw World Dots (Fake Map)
            ctx.fillStyle = 'rgba(255,255,255,0.05)';
            for(let i=0; i<150; i++) {
                const x = (Math.sin(i * 123.4) * 0.4 + 0.5) * w;
                const y = (Math.cos(i * 567.8) * 0.3 + 0.5) * h;
                ctx.fillRect(x,y, 2, 2);
            }

            if (Math.random() > 0.98) pings.push({ x: Math.random() * w, y: Math.random() * h, life: 1.0, color: Math.random() > 0.5 ? '#ef4444' : '#f59e0b' });
            
            for (let i = pings.length - 1; i >= 0; i--) {
                const p = pings[i];
                p.life -= 0.01; // SLOWED Decay
                if (p.life <= 0) { pings.splice(i, 1); continue; }
                
                ctx.strokeStyle = p.color; ctx.lineWidth = 1; ctx.globalAlpha = p.life;
                ctx.beginPath(); ctx.arc(p.x, p.y, (1-p.life)*30, 0, Math.PI*2); ctx.stroke();
                
                ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI*2); ctx.fill();
                
                // Connection line to center
                ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(w/2, h/2); 
                ctx.strokeStyle = `rgba(255,255,255,${p.life * 0.1})`; ctx.stroke();
            }
            
            // Central HQ
            ctx.globalAlpha = 1;
            ctx.fillStyle = '#10b981'; ctx.beginPath(); ctx.arc(w/2, h/2, 4, 0, Math.PI*2); ctx.fill();
            ctx.shadowBlur = 10; ctx.shadowColor = '#10b981'; ctx.stroke(); ctx.shadowBlur = 0;

            frameId = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(frameId);
    }, []);
    return <canvas ref={canvasRef} className="w-full h-full" />;
};

const LiveGraph: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        let w = canvas.parentElement?.clientWidth || 300;
        let h = canvas.parentElement?.clientHeight || 150;
        canvas.width = w; canvas.height = h;
        
        const data: number[] = Array(60).fill(h/2);
        let t = 0; let frameId: number;
        
        const render = () => {
            t += 0.15; // SLOWED (was 0.3 in prev or 0.1)
            ctx.clearRect(0,0,w,h);
            
            // Update Data
            data.shift();
            const noise = (Math.random() - 0.5) * 15;
            const wave = Math.sin(t) * 10;
            // Base level hovers around middle, spikes occasionally
            const spike = Math.random() > 0.95 ? (Math.random() > 0.5 ? 40 : -40) : 0;
            data.push(h/2 + wave + noise + spike);
            
            // Draw Area
            ctx.beginPath(); 
            const step = w / (data.length - 1);
            ctx.moveTo(0, h); // Start bottom left
            for(let i=0; i<data.length; i++) {
                const x = i * step; const y = data[i];
                ctx.lineTo(x,y);
            }
            ctx.lineTo(w, h); // End bottom right
            ctx.closePath();
            
            const grad = ctx.createLinearGradient(0, 0, 0, h);
            grad.addColorStop(0, 'rgba(105, 183, 178, 0.4)');
            grad.addColorStop(1, 'rgba(105, 183, 178, 0.0)');
            ctx.fillStyle = grad;
            ctx.fill();

            // Draw Line
            ctx.beginPath();
            ctx.strokeStyle = '#69B7B2'; 
            ctx.lineWidth = 2;
            for(let i=0; i<data.length; i++) {
                const x = i * step; const y = data[i];
                if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
            }
            ctx.stroke();

            frameId = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(frameId);
    }, []);
    return <canvas ref={canvasRef} className="w-full h-full" />;
};

// --- GOVERNANCE DASHBOARD ---
const GovernanceWindow = () => {
    const [activeTab, setActiveTab] = useState<'monitor' | 'policy' | 'threats' | 'config'>('monitor');
    const [scanProgress, setScanProgress] = useState(0);
    const [events, setEvents] = useState([
        { id: 1, type: 'check', text: 'Identity Verified: Admin_01', time: 'Just now' },
        { id: 2, type: 'check', text: 'Encryption Key Rotated', time: '2m ago' },
        { id: 3, type: 'alert', text: 'Port 443 Traffic Spike', time: '15m ago' },
    ]);
    const scrollRef = useRef<HTMLDivElement>(null);

    // SLOWED SCANLINE: 60ms interval, increment by 1
    useEffect(() => {
        const interval = setInterval(() => { setScanProgress(p => (p + 1) % 100); }, 60);
        return () => clearInterval(interval);
    }, []);

    // Add random logs
    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.6) {
                const newEvent = {
                    id: Date.now(),
                    type: Math.random() > 0.9 ? 'alert' : 'check',
                    text: Math.random() > 0.5 ? 'System Integrity Check Passed' : 'New Secure Session Established',
                    time: new Date().toLocaleTimeString()
                };
                setEvents(prev => [newEvent, ...prev.slice(0, 7)]);
            }
        }, 3000); // SLOWED LOGS
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full bg-[#0a0a0c]/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px] animate-in zoom-in-95 duration-700 delay-200 group hover:border-[#69B7B2]/50 transition-colors backdrop-blur-xl relative font-sans">
            <div className="absolute top-0 left-0 h-1 bg-[#69B7B2] shadow-[0_0_20px_#69B7B2] z-20 transition-all duration-75 ease-linear" style={{ width: `${scanProgress}%` }} />
            <div className="h-12 border-b border-white/5 flex items-center justify-between px-6 bg-[#08080a]">
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] opacity-80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] opacity-80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F] opacity-80" />
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-white/30 uppercase tracking-widest">
                    <ShieldCheck size={10} /> Active Sentinel
                </div>
                <div className="w-10" />
            </div>
            <div className="h-14 border-b border-white/5 flex items-center px-6 gap-2 bg-[#0c0c0e]/50 overflow-x-auto">
                {[{id: 'monitor', l: 'Live Monitor'}, {id: 'policy', l: 'Policy'}, {id: 'threats', l: 'Threats'}, {id: 'config', l: 'Config'}].map((tab, i) => (
                    <button 
                        key={i} 
                        onClick={() => setActiveTab(tab.id as any)} 
                        className={`text-xs font-bold px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                            activeTab === tab.id 
                            ? 'bg-[#69B7B2]/10 text-[#69B7B2] border border-[#69B7B2]/20' 
                            : 'text-white/40 hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                    >
                        {tab.l}
                    </button>
                ))}
            </div>
            <div className="flex-1 relative overflow-hidden bg-[#050505]">
                <div className="absolute inset-0 p-6 overflow-y-auto custom-scrollbar">
                    {activeTab === 'monitor' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            {/* Graph Area */}
                            <div className="h-32 bg-[#0a0a0c] rounded-xl border border-white/5 overflow-hidden relative shadow-inner">
                                <div className="absolute top-3 left-3 text-[9px] text-white/40 font-mono flex items-center gap-2">
                                    <Activity size={10} /> NETWORK_TRAFFIC_INBOUND
                                </div>
                                <LiveGraph />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#151517] p-4 rounded-xl border border-white/5 flex items-center justify-between">
                                    <div><div className="text-[9px] text-white/40 uppercase tracking-wider mb-1">Firewall</div><div className="text-green-400 font-bold text-sm">Active</div></div>
                                    <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
                                        <Activity size={16} className="animate-pulse" />
                                    </div>
                                </div>
                                <div className="bg-[#151517] p-4 rounded-xl border border-white/5 flex items-center justify-between">
                                    <div><div className="text-[9px] text-white/40 uppercase tracking-wider mb-1">Intrusion Prev.</div><div className="text-[#69B7B2] font-bold text-sm">Scanning</div></div>
                                    <div className="p-2 rounded-lg bg-[#69B7B2]/10 border border-[#69B7B2]/20 text-[#69B7B2]">
                                        <ScanLine size={16} className="animate-spin-slow" />
                                    </div>
                                </div>
                            </div>

                            {/* Scrolling Log */}
                            <div className="bg-[#0a0a0c] rounded-xl border border-white/5 overflow-hidden">
                                <div className="px-4 py-2 border-b border-white/5 bg-white/[0.02] text-[9px] font-bold text-white/30 uppercase tracking-widest flex justify-between items-center">
                                    <span>System Event Stream</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                </div>
                                <div className="max-h-40 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0c]/80 pointer-events-none z-10" />
                                    <div className="divide-y divide-white/5 p-2">
                                        {events.map((ev) => (
                                            <div key={ev.id} className="px-3 py-2 flex items-center justify-between hover:bg-white/[0.02] transition-colors animate-in slide-in-from-top-1 duration-300">
                                                <div className="flex items-center gap-3">
                                                    {ev.type === 'check' ? <CheckCircle2 size={12} className="text-green-400" /> : <AlertTriangle size={12} className="text-[#f59e0b]" />}
                                                    <span className={`text-[10px] font-mono ${ev.type === 'alert' ? 'text-[#f59e0b]' : 'text-white/60'}`}>{ev.text}</span>
                                                </div>
                                                <span className="text-[9px] text-white/20 font-mono">{ev.time}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'policy' && (
                        <div className="space-y-3 animate-in fade-in duration-300">
                            {[{l: 'Data Retention: 7 Years', s: 'Active', c: 'green'}, {l: 'MFA Enforcement', s: 'Strict', c: 'green'}, {l: 'Encryption Level', s: 'AES-256', c: 'green'}, {l: 'Guest Access', s: 'Disabled', c: 'red'}, {l: 'API Rate Limit', s: '1000/min', c: 'yellow'}].map((p, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-[#151517] rounded-xl border border-white/5 hover:border-white/20 transition-all cursor-default group">
                                    <span className="text-xs font-bold text-white/70 group-hover:text-white uppercase tracking-wider">{p.l}</span>
                                    <div className={`px-2 py-1 rounded bg-${p.c === 'green' ? 'green' : p.c === 'red' ? 'red' : 'yellow'}-500/10 text-${p.c === 'green' ? 'green' : p.c === 'red' ? 'red' : 'yellow'}-400 text-[9px] font-bold uppercase border border-${p.c === 'green' ? 'green' : p.c === 'red' ? 'red' : 'yellow'}-500/20`}>{p.s}</div>
                                </div>
                            ))}
                        </div>
                    )}
                    {activeTab === 'threats' && (
                        <div className="h-full flex flex-col relative animate-in fade-in duration-300">
                            <div className="absolute inset-0 rounded-xl overflow-hidden border border-white/5 bg-[#08080a]">
                                <ThreatMap />
                                <div className="absolute top-4 left-4 p-3 bg-black/60 backdrop-blur-md rounded-lg border border-white/10">
                                    <div className="text-[9px] text-white/40 font-bold uppercase tracking-widest mb-1">Global Threat Level</div>
                                    <div className="text-lg font-bold text-green-400">Low</div>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'config' && (
                        <div className="flex flex-col items-center justify-center h-full text-white/30 space-y-4">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                <Terminal size={32} />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-bold text-white/50">Configuration Locked</p>
                                <p className="text-[10px] font-mono mt-1 text-white/20 uppercase tracking-widest">Admin Access Required</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- VISUALIZER: INFRASTRUCTURE ---
const InfrastructureVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    useEffect(() => {
        const handleMove = (e: MouseEvent) => { if (canvasRef.current) { const r = canvasRef.current.getBoundingClientRect(); mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top }; } };
        window.addEventListener('mousemove', handleMove); return () => window.removeEventListener('mousemove', handleMove);
    }, []);
    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d'); if (!ctx) return;
        let w = canvas.width = canvas.parentElement?.clientWidth || 300; let h = canvas.height = canvas.parentElement?.clientHeight || 300;
        let time = 0; let frameId: number;
        const render = () => {
            time += 0.025; // SLOWED (was 0.05)
            ctx.clearRect(0,0,w,h);
            const size = 30; const rows = Math.ceil(h / (size * 1.5)) + 1; const cols = Math.ceil(w / (size * Math.sqrt(3))) + 1;
            for(let r=0; r<rows; r++) { for(let c=0; c<cols; c++) {
                const xOffset = (r % 2) * (size * Math.sqrt(3) / 2); const x = c * size * Math.sqrt(3) + xOffset - 20; const y = r * size * 1.5 - 20;
                const dx = x - mouseRef.current.x; const dy = y - mouseRef.current.y; const dist = Math.sqrt(dx*dx + dy*dy);
                const active = Math.max(0, 1 - dist/150);
                if (active > 0.1 || Math.random() > 0.995) {
                    ctx.strokeStyle = `rgba(105, 183, 178, ${active * 0.8 + 0.1})`; ctx.fillStyle = `rgba(105, 183, 178, ${active * 0.2})`; ctx.lineWidth = 1;
                    ctx.beginPath(); for(let i=0; i<6; i++) { const angle = Math.PI/3 * i + Math.PI/6; const hx = x + Math.cos(angle) * (size - 2); const hy = y + Math.sin(angle) * (size - 2); if(i===0) ctx.moveTo(hx,hy); else ctx.lineTo(hx,hy); } ctx.closePath(); ctx.stroke(); if (active > 0.5) ctx.fill();
                }
            }}
            for(let i=0; i<5; i++) { const px = (time * 100 + i * 200) % (w+100) - 50; const py = h/2 + Math.sin(time + i)*50; ctx.fillStyle = '#fff'; ctx.shadowBlur = 10; ctx.shadowColor = '#fff'; ctx.fillRect(px, py, 4, 4); ctx.shadowBlur = 0; }
            frameId = requestAnimationFrame(render);
        };
        render(); return () => cancelAnimationFrame(frameId);
    }, []);
    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />;
};

// --- VISUALIZERS: BACKGROUNDS ---
const BadgeConstellation: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d'); if (!ctx) return;
        let w = canvas.width = canvas.parentElement?.clientWidth || 300; let h = canvas.height = canvas.parentElement?.clientHeight || 200;
        const nodes: any[] = []; for(let i=0; i<30; i++) nodes.push({ x: Math.random()*w, y: Math.random()*h, vx: Math.random()-0.5, vy: Math.random()-0.5 });
        let frameId: number;
        const render = () => {
            ctx.clearRect(0,0,w,h); ctx.fillStyle = '#69B7B2'; ctx.strokeStyle = 'rgba(105, 183, 178, 0.1)';
            // SLOWED (was 1.5)
            nodes.forEach(n => { n.x += n.vx * 0.75; n.y += n.vy * 0.75; if(n.x<0||n.x>w) n.vx*=-1; if(n.y<0||n.y>h) n.vy*=-1; ctx.beginPath(); ctx.arc(n.x, n.y, 1.5, 0, Math.PI*2); ctx.fill(); });
            for(let i=0; i<nodes.length; i++) { for(let j=i+1; j<nodes.length; j++) { const d = Math.sqrt((nodes[i].x-nodes[j].x)**2 + (nodes[i].y-nodes[j].y)**2); if(d<100) { ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke(); } } }
            frameId = requestAnimationFrame(render);
        };
        render(); return () => cancelAnimationFrame(frameId);
    }, []);
    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-50" />;
};

const InteractiveCard: React.FC<{ item: any, index: number }> = ({ item, index }) => {
    return (
        <div className="group relative p-8 bg-[#0c0c0e] border border-white/5 rounded-2xl transition-all duration-500 overflow-hidden hover:-translate-y-1 block cursor-default"
             style={{ '--card-color': item.color } as React.CSSProperties}>
            <div className="absolute inset-0 border border-transparent group-hover:border-[var(--card-color)] opacity-0 group-hover:opacity-50 rounded-2xl transition-all duration-500 pointer-events-none" />
            <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white transition-colors border border-white/5 group-hover:bg-[var(--card-color)] group-hover:border-transparent shadow-lg mb-6">
                    {React.createElement(item.icon, { size: 24 })}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-[var(--card-color)] transition-colors">{item.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed group-hover:text-white/80 transition-colors">
                    {item.desc}
                </p>
            </div>
        </div>
    );
};

// --- ENTERPRISE SECURITY TABLE (Redesigned) ---
const EnterpriseSecurityTable = () => {
    const rows = [
        { feature: "Unique Production Auth", standard: "Unique SSH Key & Datastore Auth", impact: "Access restricted to authorized secure mechanisms only." },
        { feature: "Encryption Key Mgmt", standard: "Restricted Privileged Access", impact: "Keys limited to authorized users with verified business need." },
        { feature: "Infrastructure Monitoring", standard: "Real-time Performance Alerting", impact: "Proactive alerts when predefined system thresholds are met." },
        { feature: "Network Hardening", standard: "Segmented Architecture", impact: "Firewalls and segmentation protect data from unauthorized access." },
        { feature: "System Hardening", standard: "CIS Benchmarks & Routine Patching", impact: "Servers hardened based on industry best practices." },
        { feature: "Change Management", standard: "Formal Auth & Documentation", impact: "All changes tested and approved prior to production." },
        { feature: "Penetration Testing", standard: "Annual Third-Party Audits", impact: "Proactive remediation of vulnerabilities per SLAs." },
        { feature: "Incident Response", standard: "Tested BC/DR Plans", impact: "Annual testing ensures continuity during potential disruptions." },
        { feature: "Data Lifecycle Mgmt", standard: "NIST Purging Protocols", impact: "Confidential data securely removed upon service termination." },
        { feature: "Organizational Oversight", standard: "Board Risk Assessments", impact: "Senior management actively oversees cybersecurity risks." },
    ];

    return (
        <div className="w-full max-w-7xl mx-auto">
            {/* Header Row (Desktop) */}
            <div className="hidden md:grid grid-cols-12 gap-8 px-8 py-6 border-b border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/40 font-mono">
                <div className="col-span-4 pl-12">Security Control</div>
                <div className="col-span-4">Technical Specification</div>
                <div className="col-span-4">Business Implication</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-white/5 border-t border-white/5">
                {rows.map((row, i) => (
                    <div key={i} className="group grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 p-8 hover:bg-white/[0.02] transition-colors items-start border-l-2 border-transparent hover:border-[#69B7B2]">
                        {/* Column 1: Feature */}
                        <div className="md:col-span-4">
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-[#69B7B2]/5 text-[#69B7B2] border border-[#69B7B2]/10 group-hover:bg-[#69B7B2] group-hover:text-black transition-all">
                                    <ShieldCheck size={18} />
                                </div>
                                <h3 className="text-lg font-serif text-white group-hover:text-[#69B7B2] transition-colors">
                                    {row.feature}
                                </h3>
                            </div>
                        </div>

                        {/* Column 2: Standard */}
                        <div className="md:col-span-4 pt-1">
                            <div className="md:hidden text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">Standard</div>
                            <div className="text-xs font-mono text-[#69B7B2] bg-[#69B7B2]/5 border border-[#69B7B2]/10 px-3 py-2 rounded-md inline-block w-full md:w-auto">
                                {row.standard}
                            </div>
                        </div>

                        {/* Column 3: Impact */}
                        <div className="md:col-span-4 pt-1">
                            <div className="md:hidden text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">Impact</div>
                            <p className="text-sm text-white/50 leading-relaxed font-light">
                                {row.impact}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const TrustCenterPage: React.FC = () => {
    const { navigateTo } = useNavigation();

    return (
        <div className="relative min-h-screen bg-[#020202] text-white font-sans overflow-x-hidden selection:bg-[#69B7B2]/30 selection:text-[#69B7B2]">
            
            {/* --- HERO SECTION --- */}
            <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#020202] pt-20">
                <div className="absolute inset-0 opacity-100">
                    <TrustHeroVisualizer />
                </div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020202_90%)] pointer-events-none" />

                {/* Left-Aligned Text Block (Desktop) */}
                <div className="relative z-10 w-full max-w-7xl px-6 md:px-12 flex flex-col items-center md:items-start text-center md:text-left pointer-events-none">
                    
                    <div className="space-y-4 mix-blend-screen pt-12 md:max-w-2xl">
                         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6 animate-in slide-in-from-top-4 duration-700 shadow-[0_0_20px_rgba(105,183,178,0.2)]">
                            <ShieldCheck size={12} className="text-[#69B7B2]" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Trust Center</span>
                        </div>
                        <h1 className="font-serif text-5xl md:text-7xl leading-[1.1] tracking-tight text-white animate-in zoom-in-95 duration-1000">
                            Infogito Security <br/> <span className="italic text-[#69B7B2]">and Governance.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-white/70 leading-relaxed font-light mt-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                             In a landscape where data is often fragmented and AI is opaque, we provide a suite of tools that restores power to your organization.
                        </p>
                    </div>
                </div>
                
                <div className="absolute bottom-12 animate-bounce text-white/20 left-1/2 -translate-x-1/2 md:left-12 md:translate-x-0">
                    <ChevronDown size={24} />
                </div>
            </section>

            {/* --- TRUST BADGES --- */}
            <section className="py-16 border-y border-white/5 bg-[#030303] relative overflow-hidden">
                <BadgeConstellation />
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                    <div className="text-left md:w-1/3">
                        <span className="text-xs font-mono uppercase tracking-widest text-[#69B7B2] font-bold block mb-2">Compliance Baseline</span>
                        <h3 className="text-2xl font-serif text-white leading-tight">Built for the most demanding regulatory environments.</h3>
                    </div>
                    
                    <div className="flex flex-wrap justify-center md:justify-end gap-x-12 gap-y-6 text-white/70 md:w-2/3">
                        {['ISO 27001', 'SOC 2 Type II', 'HIPAA', 'GDPR', 'CCPA'].map((badge, i) => (
                            <div key={i} className="flex items-center gap-3 font-bold text-lg group cursor-default">
                                <div className="p-2 rounded-full bg-white/5 border border-white/10 text-[#69B7B2] group-hover:bg-[#69B7B2]/10 transition-colors group-hover:scale-110 duration-300 shadow-[0_0_15px_rgba(105,183,178,0.1)]">
                                    <Shield size={20} />
                                </div>
                                <span className="group-hover:text-white transition-colors font-mono tracking-tight">{badge}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- SECTION 1: DATA SOVEREIGNTY (RESTORED) --- */}
            <DataSovereigntySection />

            {/* --- SECTION 2: GOVERNANCE --- */}
            <section className="py-32 bg-[#020202] border-b border-white/5 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-12">
                            <div>
                                <div className="inline-flex items-center gap-2 mb-6 text-[#69B7B2] font-mono text-xs uppercase tracking-widest bg-[#69B7B2]/10 px-3 py-1 rounded-full border border-[#69B7B2]/20">
                                    <Cpu size={14} /> Informed Governance
                                </div>
                                <h2 className="text-5xl font-serif text-white mb-6 leading-tight">
                                    Granular Access & <br/> Client Leadership.
                                </h2>
                                <p className="text-xl text-white/50 leading-relaxed font-light">
                                    You hold total authority over your knowledge and its distribution. We provide the infrastructure and guidance necessary for you to maintain compliance and performance in your operation without ever navigating technical complexities alone.
                                </p>
                            </div>

                            <div className="space-y-6">
                                {[
                                    { title: "Guided Administration", desc: "You manage your own data execution. We facilitate this through best-practice templates that help you configure your permissions with confidence.", icon: ShieldCheck },
                                    { title: "Intelligent Data Markings", desc: "You apply Markings to protect sensitive data. Our tools highlight PII/PHI sensitivity, ensuring restrictions propagate correctly through every synthesized plan.", icon: Fingerprint },
                                    { title: "Strategic Power Delegation", desc: "You manage roles like Viewer, Editor, or Analyst. We provide pre-aligned, industry-standard role templates to help you delegate power accurately.", icon: Network },
                                    { title: "Transparency and Reasoning", desc: "The system empowers you to reason about who has access to what resource and why. Authorization is always tied to clear, verifiable attributes.", icon: Eye },
                                    { title: "Requesting Justification", desc: "You can oversee high-stakes actions through Checkpoints. Require specific workflows to be accompanied by a formal justification for a robust audit trail.", icon: FileText },
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-6 group p-6 rounded-2xl bg-[#0a0a0c] border border-white/5 hover:border-[#69B7B2]/30 transition-all cursor-default hover:bg-[#69B7B2]/5">
                                        <div className="mt-1">
                                            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-[#69B7B2] group-hover:bg-[#69B7B2]/10 transition-all">
                                                <item.icon size={24} />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-serif text-white mb-2 group-hover:text-[#69B7B2] transition-colors">{item.title}</h4>
                                            <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-4 bg-[#69B7B2]/10 blur-3xl rounded-full opacity-20 pointer-events-none" />
                            <GovernanceWindow />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SECTION 3: DATA PROTECTION & COMPLIANCE (INTERACTIVE) --- */}
            <section className="py-32 bg-[#050505] border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-serif text-white mb-6">Data Protection and Compliance</h2>
                        <p className="text-xl text-white/50 max-w-3xl mx-auto leading-relaxed font-light">
                            We fulfill legal requirements by building compliance directly into the data foundation. Our tools provide the technical means for you to adhere to global privacy standards while maximizing the profit-potential of your data.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "GDPR", desc: "We implement Privacy by Design to fulfill European data protection requirements. Our tools allow for precise data minimization and ensure that your Right to be Forgotten is technically enforceable.", icon: Globe, color: "#3b82f6" },
                            { title: "CCPA and CPRA", desc: "We provide the tools for you to fulfill Right to Know requests instantly. Because our system tracks the lineage of knowledge from raw batch to final plan, you can demonstrate exactly how data is being managed.", icon: Search, color: "#8b5cf6" },
                            { title: "Audit Readiness", desc: "By converting your data into knowledge via standardized frameworks, we create a continuous audit trail. This ensures that you are always in a state of Audit Readiness for any regulatory inspection.", icon: FileCode, color: "#10b981" }
                        ].map((item, i) => (
                            <InteractiveCard key={i} item={item} index={i+5} />
                        ))}
                    </div>
                </div>
            </section>

            {/* --- SECTION 4: INFRASTRUCTURE SECURITY --- */}
            <section className="py-32 bg-[#020202] border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-16 items-center">
                    <div className="lg:w-1/2">
                        <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                            <HardDrive size={12} className="text-[#69B7B2]" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Hardened Environment</span>
                        </div>
                        <h2 className="text-4xl font-serif text-white mb-6">Infrastructure Security and Resilience</h2>
                        <p className="text-lg text-white/50 leading-relaxed font-light mb-8">
                            Our tools are hosted in a hardened environment designed to protect your mission-critical operations.
                        </p>
                        
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="mt-1 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#69B7B2] border border-white/10 shrink-0">
                                    <Lock size={14} />
                                </div>
                                <div>
                                    <h4 className="text-white font-serif font-bold mb-1">Zero-Trust Architecture</h4>
                                    <p className="text-sm text-white/50">No user, agent, or service is trusted by default. Every request must be authenticated and authorized against your managed access rules.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="mt-1 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#69B7B2] border border-white/10 shrink-0">
                                    <Activity size={14} />
                                </div>
                                <div>
                                    <h4 className="text-white font-serif font-bold mb-1">Proactive Monitoring</h4>
                                    <p className="text-sm text-white/50">We utilize 24/7/365 monitoring and regular third-party assessments to ensure your workspace remains secure against evolving technical risks.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="mt-1 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#69B7B2] border border-white/10 shrink-0">
                                    <Network size={14} />
                                </div>
                                <div>
                                    <h4 className="text-white font-serif font-bold mb-1">Network Segmentation</h4>
                                    <p className="text-sm text-white/50">We enforce strict hardening and encryption between the ingestion layer, the processing layer where frameworks are applied, and the knowledge layer.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="lg:w-1/2 w-full h-[400px] relative rounded-3xl overflow-hidden bg-[#0c0c0e] border border-white/10 shadow-2xl group">
                        <InfrastructureVisualizer />
                        
                        {/* Overlay Badges */}
                        <div className="absolute inset-0 z-10 grid grid-cols-2 gap-4 p-8 pointer-events-none">
                             {['SOC 2', 'HIPAA', 'ISO 27001', 'FEDRAMP'].map((std, i) => (
                                <div key={i} className="flex flex-col items-center justify-center text-center p-4 bg-black/40 border border-white/5 rounded-2xl backdrop-blur-sm opacity-50 group-hover:opacity-80 transition-opacity">
                                    <ShieldCheck size={24} className="text-[#69B7B2] mb-2" />
                                    <span className="text-xs font-bold font-mono text-white">{std}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SECTION 5: SECURITY SPECS TABLE --- */}
            <section className="py-32 bg-[#08080a] border-b border-white/5">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl font-serif text-white mb-6">Enterprise Security Baseline</h2>
                            <p className="text-lg text-white/50 leading-relaxed font-light">
                                We reject the notion of pay-walling core security. Every client receives our full suite of enterprise-grade protections by default.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 text-[#69B7B2] text-xs font-mono uppercase tracking-widest bg-[#69B7B2]/10 px-4 py-2 rounded-full border border-[#69B7B2]/20">
                            <Terminal size={14} /> Default Config
                        </div>
                    </div>

                    <EnterpriseSecurityTable />
                </div>
            </section>

            <section className="py-32 bg-[#020202] border-t border-white/5 text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="w-20 h-20 mx-auto bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/50 mb-8 animate-pulse">
                        <Terminal size={32} />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif text-white mb-8">Ready to Secure Your Operations?</h2>
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

            <SiteFooter />

        </div>
    );
};
