
import React, { useEffect, useRef, useState } from 'react';
import { 
    Users, Handshake, ShieldCheck, Target, ArrowRight, 
    Truck, Zap, Activity, Factory, Briefcase, 
    Globe, Network, Layers, ChevronRight, ArrowUpRight, ScanLine,
    Database, Cpu, Lock, CheckCircle2, Terminal, ChevronDown, ChevronLeft, Play, X, Heart, Trophy
} from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { ViewportSlot } from './ViewportSlot';
import { ClientsHeroVisualizer } from './ClientsHeroVisualizer';

// Import Industry Hero Visualizers for the Carousel
import { LogisticsHeroVisualizer } from './LogisticsHeroVisualizer';
import { SmallBusinessHeroVisualizer } from './SmallBusinessHeroVisualizer';
import { IndustrialsHeroVisualizer } from './IndustrialsHeroVisualizer';
import { HealthcareHeroVisualizer } from './HealthcareHeroVisualizer';
import { ResourcesHeroVisualizer } from './ResourcesHeroVisualizer';

const INDUSTRIES = [
    {
        id: 'logistics',
        title: "Logistics",
        subtitle: "Global Supply Chain",
        desc: "Operational decisions shaped by real-time movement, accumulated context, and constrained physical systems.",
        path: "our-clients/industries/logistics",
        icon: Truck,
        color: "#06b6d4",
        Visualizer: LogisticsHeroVisualizer
    },
    {
        id: 'smb',
        title: "Business Operations",
        subtitle: "High-Velocity Strategy",
        desc: "Rapid decision cycles and resource allocation for organizations scaling without enterprise overhead.",
        path: "our-clients/industries/business-operations",
        icon: Briefcase,
        color: "#8b5cf6",
        Visualizer: SmallBusinessHeroVisualizer
    },
    {
        id: 'industrials',
        title: "Industrial Systems",
        subtitle: "Asset Reliability",
        desc: "Stabilizing complex manufacturing operations where reliability, safety, and performance are inseparable.",
        path: "our-clients/industries/industrials",
        icon: Factory,
        color: "#f59e0b",
        Visualizer: IndustrialsHeroVisualizer
    },
    {
        id: 'healthcare',
        title: "Healthcare",
        subtitle: "Clinical Operations",
        desc: "Reducing operational risk, bottlenecks, and compliance overhead in regulated care environments.",
        path: "our-clients/industries/healthcare",
        icon: Activity,
        color: "#14b8a6",
        Visualizer: HealthcareHeroVisualizer
    },
    {
        id: 'resources',
        title: "Natural Resources",
        subtitle: "Physical Constraints",
        desc: "Managing operations defined by geology, long time horizons, and irreversible extraction decisions.",
        path: "our-clients/industries/natural-resources",
        icon: Globe,
        color: "#10b981",
        Visualizer: ResourcesHeroVisualizer
    }
];

// --- CAROUSEL COMPONENT ---
const IndustryCarousel: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const count = INDUSTRIES.length;

    const next = () => setActiveIndex((prev) => (prev + 1) % count);
    const prev = () => setActiveIndex((prev) => (prev - 1 + count) % count);

    const activeItem = INDUSTRIES[activeIndex];

    return (
        <div className="relative w-full h-[700px] flex items-center justify-center overflow-hidden">
            
            {/* Dynamic Background */}
            <div 
                className="absolute inset-0 transition-all duration-1000 ease-in-out pointer-events-none"
                style={{
                    background: `radial-gradient(circle at 50% 50%, ${activeItem.color}20, transparent 70%)`
                }}
            />

            {/* Cards Container */}
            <div className="relative w-full max-w-7xl h-full mx-auto">
                {INDUSTRIES.map((item, index) => {
                    let offset = (index - activeIndex);
                    if (offset < -Math.floor(count / 2)) offset += count;
                    if (offset > Math.floor(count / 2)) offset -= count;
                    
                    const isActive = offset === 0;
                    const isVisible = Math.abs(offset) <= 1; // Strict optimization: Only load active and adjacent

                    if (!isVisible) return null;

                    const zIndex = isActive ? 20 : 10 - Math.abs(offset);
                    const opacity = isActive ? 1 : 0.4;
                    const scale = isActive ? 1 : 0.85;
                    const translateX = offset * 110; 

                    return (
                        <div 
                            key={item.id}
                            className="absolute top-1/2 left-1/2 w-[340px] md:w-[400px] h-[500px] transition-all duration-700 cubic-bezier(0.25, 0.8, 0.25, 1) cursor-pointer"
                            style={{
                                transform: `translate(-50%, -50%) translateX(${translateX}%) scale(${scale})`,
                                zIndex,
                                opacity
                            }}
                            onClick={() => {
                                if (!isActive) setActiveIndex(index);
                            }}
                        >
                            <div className="relative w-full h-full rounded-3xl bg-[#0c0c0e] overflow-hidden shadow-2xl group border border-white/10 hover:border-white/20 transition-colors">
                                
                                {/* Visualizer - CONDITIONAL RENDERING */}
                                <div className={`absolute inset-0 transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                                    {isActive ? (
                                        <item.Visualizer />
                                    ) : (
                                        <div className="absolute inset-0 bg-black/40" /> 
                                    )}
                                </div>

                                {/* Content Overlay */}
                                <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black via-black/50 to-transparent">
                                    <div className={`transition-all duration-500 transform ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-80'}`}>
                                        <div className="flex items-center gap-3 mb-4 text-[var(--card-color)]" style={{'--card-color': item.color} as any}>
                                            <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                                                <item.icon size={20} />
                                            </div>
                                            <span className="text-xs font-bold uppercase tracking-widest">{item.subtitle}</span>
                                        </div>
                                        
                                        <h3 className="text-3xl md:text-4xl font-serif text-white mb-4 leading-none">{item.title}</h3>
                                        <p className="text-sm text-white/70 leading-relaxed mb-8 line-clamp-3">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>

                                {isActive && (
                                    <div 
                                        className="absolute inset-0 rounded-3xl pointer-events-none border-2 border-[var(--card-color)] opacity-50 shadow-[0_0_30px_var(--card-color)] transition-all"
                                        style={{'--card-color': item.color} as any}
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <button onClick={prev} className="absolute left-4 md:left-12 z-30 p-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white backdrop-blur-md transition-all active:scale-95">
                <ChevronLeft size={24} />
            </button>
            <button onClick={next} className="absolute right-4 md:right-12 z-30 p-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white backdrop-blur-md transition-all active:scale-95">
                <ChevronRight size={24} />
            </button>
        </div>
    );
};

// --- PACMAN GAME ENGINES & TYPES ---

type FileType = 'PDF' | 'DOCX' | 'XLSX' | 'PPTX' | 'LOG';

interface GameEntity {
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;
}

interface Ghost extends GameEntity {
    speed: number;
    type: 'chaser' | 'ambusher' | 'wanderer';
    state: 'normal' | 'scared' | 'eaten';
}

interface GameFile extends GameEntity {
    type: FileType;
    points: number;
    eaten: boolean;
    speed: number;
}

interface PowerUp extends GameEntity {
    active: boolean;
}

const TerminalPacmanGame: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Game State
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
    const [highScore, setHighScore] = useState(0);

    // Engine Refs (Mutable to avoid re-renders)
    const playerPos = useRef({ x: 300, y: 150 });
    const playerDir = useRef(0); // Angle in radians
    const ghosts = useRef<Ghost[]>([]);
    const files = useRef<GameFile[]>([]);
    const powerUps = useRef<PowerUp[]>([]);
    const particles = useRef<any[]>([]);
    const powerModeTimer = useRef(0);
    const frameRef = useRef<number>(null);
    const lastMousePos = useRef({ x: 300, y: 150 });

    const CANVAS_W = 600;
    const CANVAS_H = 300;
    const PLAYER_SIZE = 24;

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current || gameState !== 'playing') return;
        const rect = containerRef.current.getBoundingClientRect();
        lastMousePos.current = {
            x: Math.max(PLAYER_SIZE, Math.min(CANVAS_W - PLAYER_SIZE, e.clientX - rect.left)),
            y: Math.max(PLAYER_SIZE, Math.min(CANVAS_H - PLAYER_SIZE, e.clientY - rect.top))
        };
    };

    const initGame = () => {
        setScore(0);
        setLives(3);
        setGameState('playing');
        playerPos.current = { x: 100, y: 150 };
        lastMousePos.current = { x: 300, y: 150 };
        
        // Init Ghosts
        ghosts.current = [
            { x: CANVAS_W + 50, y: 50, w: 24, h: 24, color: '#ef4444', speed: 2.2, type: 'chaser', state: 'normal' }, // Red
            { x: CANVAS_W + 100, y: 150, w: 24, h: 24, color: '#f472b6', speed: 2.0, type: 'ambusher', state: 'normal' }, // Pink
            { x: CANVAS_W + 150, y: 250, w: 24, h: 24, color: '#22d3ee', speed: 1.8, type: 'wanderer', state: 'normal' } // Cyan
        ];
        
        files.current = [];
        powerUps.current = [];
        particles.current = [];
        powerModeTimer.current = 0;
    };

    useEffect(() => {
        if (gameState !== 'playing') return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let frame = 0;

        const render = () => {
            frame++;
            ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

            // --- 1. BACKGROUND GRID ---
            ctx.fillStyle = '#0a0a0c';
            ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
            ctx.strokeStyle = 'rgba(255,255,255,0.03)';
            ctx.lineWidth = 1;
            const offset = (frame * 1) % 40;
            for(let x=-offset; x<CANVAS_W; x+=40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x, CANVAS_H); ctx.stroke(); }
            for(let y=0; y<CANVAS_H; y+=40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(CANVAS_W, y); ctx.stroke(); }

            // --- 2. PLAYER LOGIC ---
            // Move towards mouse
            const dx = lastMousePos.current.x - playerPos.current.x;
            const dy = lastMousePos.current.y - playerPos.current.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist > 2) {
                const moveSpeed = 4;
                playerPos.current.x += (dx / dist) * moveSpeed;
                playerPos.current.y += (dy / dist) * moveSpeed;
                playerDir.current = Math.atan2(dy, dx);
            }

            // Draw Player
            ctx.save();
            ctx.translate(playerPos.current.x, playerPos.current.y);
            ctx.rotate(playerDir.current);
            const mouth = Math.abs(Math.sin(frame * 0.2)) * 0.25 * Math.PI;
            
            ctx.fillStyle = '#3b82f6'; // Blue Infogito Pacman
            ctx.shadowColor = 'rgba(59, 130, 246, 0.6)'; ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(0, 0, PLAYER_SIZE/2, mouth, Math.PI * 2 - mouth);
            ctx.lineTo(0, 0);
            ctx.fill();
            ctx.restore();

            // --- 3. FILES LOGIC ---
            if (frame % 45 === 0) {
                const typeInfo = [
                    { t: 'PDF', c: '#ef4444', p: 100 },
                    { t: 'DOCX', c: '#3b82f6', p: 100 },
                    { t: 'XLSX', c: '#10b981', p: 150 },
                    { t: 'PPTX', c: '#f97316', p: 150 },
                    { t: 'LOG', c: '#a8a29e', p: 50 }
                ][Math.floor(Math.random() * 5)];
                
                files.current.push({
                    x: CANVAS_W + 50,
                    y: Math.random() * (CANVAS_H - 40) + 20,
                    w: 24, h: 30,
                    type: typeInfo.t as FileType,
                    color: typeInfo.c,
                    points: typeInfo.p,
                    eaten: false,
                    speed: 2 + Math.random()
                });
            }

            for (let i = files.current.length - 1; i >= 0; i--) {
                const f = files.current[i];
                f.x -= f.speed;
                
                // Draw File
                if (!f.eaten) {
                    ctx.fillStyle = f.color;
                    ctx.shadowBlur = 0;
                    ctx.fillRect(f.x, f.y - f.h/2, f.w, f.h);
                    ctx.fillStyle = 'white';
                    ctx.fillRect(f.x, f.y - f.h/2, f.w, 8); // Top bar
                    ctx.font = 'bold 8px sans-serif';
                    ctx.fillStyle = 'black';
                    ctx.textAlign = 'left';
                    ctx.fillText(f.type, f.x + 2, f.y - f.h/2 + 7);

                    // Collision
                    if (Math.abs(f.x - playerPos.current.x) < 20 && Math.abs(f.y - playerPos.current.y) < 20) {
                        f.eaten = true;
                        setScore(s => s + f.points);
                        // Particles
                        for(let k=0; k<8; k++) {
                            particles.current.push({
                                x: f.x, y: f.y,
                                vx: (Math.random()-0.5)*5, vy: (Math.random()-0.5)*5,
                                life: 1.0, color: f.color
                            });
                        }
                    }
                }

                if (f.x < -50 || f.eaten) {
                    if (f.x < -50 || (f.eaten && frame % 5 === 0)) files.current.splice(i, 1);
                }
            }

            // --- 4. POWER UP LOGIC ---
            if (powerModeTimer.current > 0) powerModeTimer.current--;
            
            if (frame % 600 === 0 && powerModeTimer.current <= 0) { // Rare spawn
                powerUps.current.push({
                    x: CANVAS_W + 50,
                    y: Math.random() * (CANVAS_H - 40) + 20,
                    w: 20, h: 20,
                    color: '#fbbf24', // Amber
                    active: true
                });
            }

            for (let i = powerUps.current.length - 1; i >= 0; i--) {
                const p = powerUps.current[i];
                p.x -= 2.5;
                
                // Draw PowerUp
                ctx.fillStyle = p.color;
                ctx.shadowColor = p.color; ctx.shadowBlur = 20;
                ctx.beginPath(); ctx.arc(p.x, p.y, 8 + Math.sin(frame * 0.2)*2, 0, Math.PI*2); ctx.fill();
                
                // Collision
                if (Math.abs(p.x - playerPos.current.x) < 25 && Math.abs(p.y - playerPos.current.y) < 25) {
                    powerUps.current.splice(i, 1);
                    powerModeTimer.current = 300; // 5 seconds (assuming 60fps)
                    // Set ghosts to scared
                    ghosts.current.forEach(g => { if(g.state !== 'eaten') g.state = 'scared'; });
                } else if (p.x < -50) {
                    powerUps.current.splice(i, 1);
                }
            }

            // --- 5. GHOSTS LOGIC ---
            ghosts.current.forEach(g => {
                // Respawn Logic
                if (g.x < -50) {
                    g.x = CANVAS_W + 50;
                    g.y = Math.random() * CANVAS_H;
                    g.state = 'normal';
                }

                // AI Movement
                let tx = playerPos.current.x;
                let ty = playerPos.current.y;

                if (g.state === 'scared') {
                    // Run away from player
                    tx = g.x + (g.x - playerPos.current.x);
                    ty = g.y + (g.y - playerPos.current.y);
                } else if (g.state === 'eaten') {
                    // Run off screen quickly
                    tx = -100;
                    ty = g.y;
                } else {
                    // Normal chase variants
                    if (g.type === 'ambusher') tx += 100; // Aim ahead
                    if (g.type === 'wanderer') { tx = g.x - 100; ty = g.y + Math.sin(frame * 0.05)*50; }
                }

                const dx = tx - g.x;
                const dy = ty - g.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                const speed = g.state === 'eaten' ? 6 : (g.state === 'scared' ? 1.5 : g.speed);

                if (dist > 0) {
                    g.x += (dx / dist) * speed;
                    g.y += (dy / dist) * speed;
                } else {
                    g.x -= speed; // Default scroll left
                }

                // Draw Ghost
                const ghostColor = g.state === 'scared' ? (powerModeTimer.current < 60 && Math.floor(frame/10)%2===0 ? '#fff' : '#3b82f6') : (g.state === 'eaten' ? 'transparent' : g.color);
                
                if (g.state !== 'eaten') {
                    ctx.save();
                    ctx.translate(g.x, g.y);
                    ctx.fillStyle = ghostColor;
                    ctx.shadowColor = ghostColor; ctx.shadowBlur = 10;
                    
                    // Head
                    ctx.beginPath();
                    ctx.arc(0, -2, 12, Math.PI, 0);
                    ctx.lineTo(12, 12);
                    // Feet
                    for(let k=1; k<=3; k++) ctx.lineTo(12 - 8*k, k%2===0 ? 12 : 8);
                    ctx.lineTo(-12, -2);
                    ctx.fill();

                    // Eyes
                    if (g.state !== 'scared') {
                        ctx.fillStyle = 'white';
                        ctx.beginPath(); ctx.arc(-4, -4, 3, 0, Math.PI*2); ctx.fill();
                        ctx.beginPath(); ctx.arc(4, -4, 3, 0, Math.PI*2); ctx.fill();
                        ctx.fillStyle = 'black'; // Pupils
                        ctx.beginPath(); ctx.arc(-4 + (dx/dist)*1.5, -4 + (dy/dist)*1.5, 1.5, 0, Math.PI*2); ctx.fill();
                        ctx.beginPath(); ctx.arc(4 + (dx/dist)*1.5, -4 + (dy/dist)*1.5, 1.5, 0, Math.PI*2); ctx.fill();
                    } else {
                        // Scared face
                        ctx.fillStyle = '#fbbf24'; // Mouth
                        ctx.fillRect(-6, 2, 12, 2);
                        ctx.fillRect(-6, 6, 12, 2);
                    }
                    ctx.restore();
                } else {
                    // Draw floating eyes for eaten state
                    ctx.save();
                    ctx.translate(g.x, g.y);
                    ctx.fillStyle = 'white';
                    ctx.beginPath(); ctx.arc(-4, -4, 3, 0, Math.PI*2); ctx.fill();
                    ctx.beginPath(); ctx.arc(4, -4, 3, 0, Math.PI*2); ctx.fill();
                    ctx.restore();
                }

                // Player Collision
                if (g.state !== 'eaten' && Math.abs(g.x - playerPos.current.x) < 20 && Math.abs(g.y - playerPos.current.y) < 20) {
                    if (g.state === 'scared') {
                        g.state = 'eaten';
                        setScore(s => s + 500);
                        // Score popup particle
                        particles.current.push({ x: g.x, y: g.y, vx: 0, vy: -1, life: 2.0, color: '#fff', text: '500' });
                    } else {
                        // Damage
                        setLives(l => {
                            if (l <= 1) {
                                setGameState('gameover');
                                return 0;
                            }
                            // Reset positions on hit
                            playerPos.current = { x: 100, y: 150 };
                            ghosts.current.forEach((gh, idx) => {
                                gh.x = CANVAS_W + 50 + idx*50;
                                gh.y = Math.random() * CANVAS_H;
                            });
                            return l - 1;
                        });
                    }
                }
            });

            // --- 6. PARTICLES ---
            for (let i = particles.current.length - 1; i >= 0; i--) {
                const p = particles.current[i];
                p.x += p.vx; p.y += p.vy;
                p.life -= 0.05;
                if (p.life <= 0) { particles.current.splice(i, 1); continue; }
                
                ctx.globalAlpha = Math.min(1, p.life);
                ctx.fillStyle = p.color;
                if (p.text) {
                    ctx.font = 'bold 12px sans-serif';
                    ctx.fillText(p.text, p.x, p.y);
                } else {
                    ctx.fillRect(p.x, p.y, 4, 4);
                }
                ctx.globalAlpha = 1;
            }

            // End Power Mode check
            if (powerModeTimer.current === 1) {
                ghosts.current.forEach(g => { if(g.state === 'scared') g.state = 'normal'; });
            }

            frameRef.current = requestAnimationFrame(render);
        };
        
        render();
        return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
    }, [gameState]);

    // Update High Score
    useEffect(() => {
        if (score > highScore) setHighScore(score);
    }, [score]);

    return (
        <div ref={containerRef} className="relative w-full max-w-2xl mx-auto h-[300px] bg-[#0c0c0e] rounded-xl overflow-hidden border border-white/10 shadow-2xl mb-12 group select-none" onMouseMove={handleMouseMove}>
            
            {gameState === 'start' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md z-50 transition-opacity duration-500">
                    <button
                        onClick={(e) => { e.stopPropagation(); initGame(); }}
                        className="group relative w-24 h-24 bg-[#1a1a1c] rounded-full flex items-center justify-center mb-8 transition-all border-t border-white/10 border-b border-black/50 shadow-[0_6px_0_#000,0_10px_20px_rgba(0,0,0,0.5)] active:shadow-[0_0_0_#000] active:translate-y-[6px] hover:bg-[#252528]"
                    >
                        <Terminal size={40} className="text-white/40 group-hover:text-[#69B7B2] transition-colors" />
                        <div className="absolute inset-0 rounded-full ring-1 ring-white/5 pointer-events-none" />
                    </button>
                    <h3 className="text-2xl font-serif text-white mb-2 tracking-tight">Ingestion Protocol</h3>
                    <p className="text-white/50 text-sm mb-8 font-mono">Click button above to initialize agent.</p>
                </div>
            )}

            {gameState === 'gameover' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/40 backdrop-blur-md z-30">
                    <div className="text-4xl font-black text-white mb-2 tracking-tighter">CONNECTION LOST</div>
                    <div className="text-xl text-white/80 mb-6 font-mono">DATA INGESTED: {score}</div>
                    <button 
                        onClick={initGame}
                        className="px-8 py-3 bg-white text-black hover:bg-gray-200 font-bold uppercase tracking-widest text-xs rounded-full transition-colors"
                    >
                        Reboot System
                    </button>
                </div>
            )}

            <canvas 
                ref={canvasRef} 
                width={CANVAS_W} 
                height={CANVAS_H}
                className="absolute inset-0 w-full h-full cursor-none block" 
            />
            
            {/* HUD */}
            {(gameState === 'playing' || gameState === 'gameover') && (
                <div className="absolute top-4 left-6 z-20 flex gap-8 w-full pr-12">
                    <div>
                        <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Score</div>
                        <div className="text-xl font-mono text-white leading-none">{score.toString().padStart(6, '0')}</div>
                    </div>
                    <div>
                        <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest">High Score</div>
                        <div className="text-xl font-mono text-[#69B7B2] leading-none">{highScore.toString().padStart(6, '0')}</div>
                    </div>
                    <div className="ml-auto flex gap-1">
                        {[...Array(3)].map((_, i) => (
                            <Heart key={i} size={16} className={`${i < lives ? 'text-red-500 fill-red-500' : 'text-white/20'}`} />
                        ))}
                    </div>
                </div>
            )}

            {gameState === 'playing' && (
                <>
                    <button 
                        onClick={() => setGameState('start')}
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white/50 hover:text-white transition-colors z-30"
                    >
                        <X size={16} />
                    </button>
                    
                    <div className="absolute bottom-4 left-0 right-0 text-center text-[9px] text-white/20 font-mono uppercase tracking-widest pointer-events-none">
                        Mouse Controls Active /// Collect Documents /// Avoid Red Nodes
                    </div>
                </>
            )}
        </div>
    );
};

const PHILOSOPHY = [
    { title: "Aligned Incentives", desc: "We structure engagements around outcomes, not seat licenses. Our success is tied directly to the operational improvements we deliver.", icon: Handshake, color: "#10b981" },
    { title: "Embedded Engineering", desc: "Our forward-engineers integrate directly with your teams to understand the nuanced language and bottlenecks of your specific operation.", icon: Users, color: "#3b82f6" },
    { title: "Data Sovereignty", desc: "Your data remains your asset. Our architecture ensures that models are trained on your context and deployed within your secure perimeter.", icon: ShieldCheck, color: "#8b5cf6" },
    { title: "Long-Term Reliability", desc: "We build systems designed for decades of service, prioritizing durability and maintainability over short-term feature velocity.", icon: Target, color: "#f59e0b" }
];

const PARTNER_CODES = [
    "DOE_GRID_SECURE", "NHS_CLINICAL_OPS", "MAERSK_LOG_AI", 
    "RIO_MINING_AUTO", "FEDEX_SORT_OPT", "TESLA_MFG_FLOW",
    "SHELL_ASSET_INT", "PFIZER_COMP_TRK", "JP_MORGAN_RISK"
];

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

            {/* --- HERO SECTION (IMMEDIATE) --- */}
            <section className="relative h-[90vh] w-full flex flex-col items-center justify-center text-center overflow-hidden border-b border-white/10 bg-[#020202]">
                <div className="absolute inset-0 z-0">
                    <ClientsHeroVisualizer />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-[#020202]/50 z-10" />
                
                <div className="relative z-20 max-w-6xl px-6 space-y-10">
                    {/* TAG REMOVED */}

                    <h1 className="text-6xl md:text-8xl font-serif text-white leading-[0.9] tracking-tighter animate-in zoom-in-95 duration-1000 drop-shadow-2xl">
                        Partners, Not <br/>
                        <span className="text-[#69B7B2] italic">Vendors.</span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed font-light animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                        We deploy critical infrastructure for the world's most demanding industries.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                        <button 
                            onClick={() => document.getElementById('manifesto')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-8 py-4 bg-[#69B7B2] hover:bg-[#5aa09c] text-black font-bold uppercase tracking-widest text-xs rounded transition-all shadow-[0_0_30px_rgba(105,183,178,0.3)] hover:shadow-[0_0_50px_rgba(105,183,178,0.5)] active:scale-95"
                        >
                            Our Approach
                        </button>
                    </div>
                </div>
                
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/20 animate-bounce z-20">
                    <ChevronDown size={24} />
                </div>
            </section>

            <MarqueeRow />

            {/* --- MANIFESTO SECTION (LAZY LOADED) --- */}
            <ViewportSlot minHeight="800px" id="manifesto">
                <section className="relative py-32 bg-black overflow-hidden border-b border-white/10">
                    <div className="absolute inset-0 z-0">
                        {/* We use ClientsHeroVisualizer here as well or a static shader, but kept generic for now or reuse ClientsHero */}
                        <ClientsHeroVisualizer /> 
                        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
                        <div className="absolute inset-0 bg-black/40" />
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                            <div className="lg:sticky lg:top-32">
                                <div className="inline-block border-b border-white/20 pb-2 mb-6">
                                    <span className="text-xs font-mono uppercase tracking-widest text-white/60">The Partnership Model</span>
                                </div>
                                <h2 className="text-5xl md:text-7xl font-serif text-white leading-tight mb-8">
                                    We operate as a strategic extension of your team.
                                </h2>
                                <p className="text-xl text-white/60 font-light leading-relaxed max-w-lg">
                                    Traditional vendor relationships are transactional. We build operational capabilities that become a permanent part of your infrastructure.
                                </p>
                            </div>

                            <div className="flex flex-col divide-y divide-white/10 border-t border-b border-white/10 bg-black/20 backdrop-blur-sm rounded-xl">
                                {PHILOSOPHY.map((item, i) => (
                                    <div key={i} className="group py-8 px-6 hover:bg-white/5 transition-all duration-300">
                                        <div className="flex items-start gap-6">
                                            <div 
                                                className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-white/40 group-hover:text-white group-hover:scale-110 transition-all duration-300 flex-shrink-0"
                                                style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                                            >
                                                <item.icon size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-serif text-white mb-2 group-hover:text-[var(--hover-color)] transition-colors" style={{ '--hover-color': item.color } as React.CSSProperties}>
                                                    {item.title}
                                                </h3>
                                                <p className="text-white/50 text-base leading-relaxed font-light group-hover:text-white/80 transition-colors">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </ViewportSlot>

            {/* --- INDUSTRY CAROUSEL SECTION (LAZY LOADED) --- */}
            <ViewportSlot minHeight="800px">
                <section className="py-32 bg-[#08080a] border-t border-white/5 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                            <div>
                                <div className="text-[#69B7B2] font-mono text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Layers size={12} /> Deployment Sectors
                                </div>
                                <h2 className="text-4xl md:text-5xl font-serif text-white">Active Verticals</h2>
                            </div>
                        </div>

                        <IndustryCarousel />
                    </div>
                </section>
            </ViewportSlot>

            <section className="py-32 bg-[#020202] border-t border-white/5 text-center">
                <div className="max-w-3xl mx-auto px-6">
                    
                    <TerminalPacmanGame />
                    
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
