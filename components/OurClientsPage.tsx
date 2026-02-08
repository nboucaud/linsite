
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
    Users, Handshake, ShieldCheck, Target, ArrowRight, 
    Truck, Zap, Activity, Factory, Briefcase, 
    Globe, Network, Layers, ChevronRight, ArrowUpRight, ScanLine,
    Database, Cpu, Lock, CheckCircle2, Terminal, ChevronDown, ChevronLeft, Play, X, Heart, Trophy, FileText, FileBarChart, FileCode, FileDigit, Volume2, VolumeX
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

// --- ARCADE GAME ENGINE ---

const TILE_SIZE = 24;
// A tighter, more complex maze layout
const LEVEL_MAP = [
    "11111111111111111111111111111",
    "10000000000001100000000000001",
    "10111111011101101110111111011",
    "13111111011101101110111111311",
    "10111111011101101110111111011",
    "10000000000000000000000000001",
    "10111101101111111101101111011",
    "10111101101111111101101111011",
    "10000001100001100001100000001",
    "11111101111121121111101111111",
    "22222101122222222221101222222",
    "1111110112111--11121101111111",
    "22222200021444444120002222222", // Tunnel
    "11111101121111111121101111111",
    "22222101122222222221101222222",
    "11111101101111111101101111111",
    "10000000000001100000000000001",
    "10111101111101101111101111011",
    "13001100000000000000001100311",
    "11101101101111111101101101111",
    "10000001100001100001100000001",
    "11111111111111111111111111111",
];

// 0=Dot, 1=Wall, 2=Empty, 3=Power, 4=GhostHouse, -=Gate

interface Pos { x: number, y: number }
interface Dir { x: number, y: number }

interface Entity {
    pos: Pos;
    dir: Dir;
    nextDir: Dir;
    speed: number;
    stopped: boolean;
}

interface GhostEntity extends Entity {
    id: number;
    color: string;
    mode: 'scatter' | 'chase' | 'frightened' | 'eaten';
    target: Pos;
}

// Audio Engine
const playSound = (type: 'eat' | 'power' | 'die' | 'start' | 'waka') => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;
        
        if (type === 'eat') {
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.linearRampToValueAtTime(600, now + 0.05);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        } else if (type === 'power') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.linearRampToValueAtTime(1200, now + 0.3);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        } else if (type === 'start') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.setValueAtTime(440, now + 0.2);
            osc.frequency.setValueAtTime(880, now + 0.4);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.6);
            osc.start(now);
            osc.stop(now + 0.6);
        }
    } catch(e) {}
};

const TerminalPacmanGame: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [gameState, setGameState] = useState<'start' | 'playing' | 'won' | 'gameover'>('start');
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [muted, setMuted] = useState(false);

    // Refs for game loop state to avoid re-renders
    const state = useRef({
        map: [] as number[][],
        player: { pos: {x:14, y:17}, dir: {x:-1, y:0}, nextDir: {x:-1, y:0}, speed: 0.12, stopped: false } as Entity,
        ghosts: [] as GhostEntity[],
        frame: 0,
        scaredTimer: 0,
        score: 0,
        particles: [] as {x:number, y:number, life:number, color:string, size:number}[]
    });

    const initGame = () => {
        // Parse Map
        state.current.map = LEVEL_MAP.map(row => row.split('').map(c => {
            if (c === '-') return 2; // Treat gate as empty for movement logic override
            return parseInt(c);
        }));

        state.current.score = 0;
        state.current.scaredTimer = 0;
        state.current.particles = [];
        setScore(0);
        setLives(3);
        
        resetPositions();
        setGameState('playing');
        if(!muted) playSound('start');
    };

    const resetPositions = () => {
        state.current.player = { 
            pos: {x:14, y:23}, // Spawns near bottom center
            dir: {x:0, y:0}, 
            nextDir: {x:0, y:0}, 
            speed: 0.15, 
            stopped: true 
        };

        state.current.ghosts = [
            { id: 0, pos: {x:13, y:11}, dir: {x:1, y:0}, nextDir: {x:1, y:0}, speed: 0.14, stopped: false, color: '#ef4444', mode: 'scatter', target: {x:25, y:0} }, // Red
            { id: 1, pos: {x:14, y:11}, dir: {x:-1, y:0}, nextDir: {x:-1, y:0}, speed: 0.13, stopped: false, color: '#f472b6', mode: 'scatter', target: {x:0, y:0} }, // Pink
            { id: 2, pos: {x:13, y:13}, dir: {x:1, y:0}, nextDir: {x:1, y:0}, speed: 0.12, stopped: false, color: '#06b6d4', mode: 'scatter', target: {x:25, y:28} }, // Cyan
            { id: 3, pos: {x:14, y:13}, dir: {x:-1, y:0}, nextDir: {x:-1, y:0}, speed: 0.12, stopped: false, color: '#f59e0b', mode: 'scatter', target: {x:0, y:28} }  // Orange
        ];
    };

    // --- GAME LOOP ---
    useEffect(() => {
        if (gameState !== 'playing') return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        let animationFrameId: number;

        const isWall = (x: number, y: number) => {
            const gy = Math.floor(y);
            const gx = Math.floor(x);
            if (gy < 0 || gy >= state.current.map.length || gx < 0 || gx >= state.current.map[0].length) return true;
            return state.current.map[gy][gx] === 1;
        };

        const checkCollision = (ent: Entity) => {
            // Check center point for collision
            const cx = ent.pos.x + 0.5;
            const cy = ent.pos.y + 0.5;
            
            // Look ahead
            const nextX = ent.pos.x + ent.dir.x * ent.speed;
            const nextY = ent.pos.y + ent.dir.y * ent.speed;
            
            // Check tile we are entering
            const tileX = Math.floor(nextX + 0.5 + ent.dir.x * 0.45);
            const tileY = Math.floor(nextY + 0.5 + ent.dir.y * 0.45);

            // Tunnel
            if (tileX < 0) { ent.pos.x = state.current.map[0].length - 1; return false; }
            if (tileX >= state.current.map[0].length) { ent.pos.x = 0; return false; }

            if (isWall(tileX, tileY)) {
                // Align to grid
                ent.pos.x = Math.round(ent.pos.x);
                ent.pos.y = Math.round(ent.pos.y);
                return true;
            }
            return false;
        };

        const tryTurn = (ent: Entity) => {
            // Only turn if close to center of tile
            const cx = Math.floor(ent.pos.x) + 0.5;
            const cy = Math.floor(ent.pos.y) + 0.5;
            const dist = Math.sqrt((ent.pos.x + 0.5 - cx)**2 + (ent.pos.y + 0.5 - cy)**2);

            if (dist < ent.speed) {
                // Check if turn is valid
                const tx = Math.round(ent.pos.x) + ent.nextDir.x;
                const ty = Math.round(ent.pos.y) + ent.nextDir.y;
                
                if (!isWall(tx, ty)) {
                    ent.pos.x = Math.round(ent.pos.x);
                    ent.pos.y = Math.round(ent.pos.y);
                    ent.dir = ent.nextDir;
                    return true;
                }
            }
            return false;
        };

        const render = () => {
            // Dimensions
            const mapW = state.current.map[0].length;
            const mapH = state.current.map.length;
            const scale = Math.min(canvas.width / mapW, canvas.height / mapH);
            const offX = (canvas.width - mapW * scale) / 2;
            const offY = (canvas.height - mapH * scale) / 2;

            ctx.fillStyle = '#0c0c0e';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.save();
            ctx.translate(offX, offY);
            ctx.scale(scale, scale);

            // 1. Draw Map
            ctx.lineWidth = 0.15;
            state.current.map.forEach((row, y) => {
                row.forEach((cell, x) => {
                    if (cell === 1) {
                        ctx.strokeStyle = '#1e3a8a';
                        ctx.strokeRect(x + 0.2, y + 0.2, 0.6, 0.6);
                        // Connect neighbors visual logic omitted for brevity, using simple blocks style
                        ctx.fillStyle = 'rgba(30, 58, 138, 0.3)';
                        ctx.fillRect(x + 0.25, y + 0.25, 0.5, 0.5);
                    } else if (cell === 0) {
                        ctx.fillStyle = '#94a3b8';
                        ctx.fillRect(x + 0.45, y + 0.45, 0.1, 0.1);
                    } else if (cell === 3) {
                        ctx.fillStyle = '#fbbf24';
                        if (state.current.frame % 30 < 15) {
                            ctx.beginPath(); ctx.arc(x + 0.5, y + 0.5, 0.25, 0, Math.PI*2); ctx.fill();
                        }
                    }
                });
            });

            // 2. Update Player
            const p = state.current.player;
            tryTurn(p);
            if (!checkCollision(p)) {
                p.pos.x += p.dir.x * p.speed;
                p.pos.y += p.dir.y * p.speed;
            }

            // Eat Dots
            const pgx = Math.round(p.pos.x);
            const pgy = Math.round(p.pos.y);
            const cell = state.current.map[pgy]?.[pgx];
            
            if (cell === 0 || cell === 3) {
                // Center check
                const dx = p.pos.x - pgx;
                const dy = p.pos.y - pgy;
                if (Math.sqrt(dx*dx + dy*dy) < 0.4) {
                    state.current.map[pgy][pgx] = 2; // Eat
                    state.current.score += (cell === 3 ? 50 : 10);
                    setScore(state.current.score);
                    if (!muted) playSound(cell === 3 ? 'power' : 'eat');
                    
                    if (cell === 3) {
                        state.current.scaredTimer = 600;
                        state.current.ghosts.forEach(g => { 
                            if(g.mode !== 'eaten') { g.mode = 'frightened'; g.dir = {x: -g.dir.x, y: -g.dir.y}; }
                        });
                    }

                    // Check Win
                    let dotsLeft = 0;
                    state.current.map.forEach(r => r.forEach(c => { if(c===0||c===3) dotsLeft++; }));
                    if (dotsLeft === 0) setGameState('won');
                }
            }

            // Draw Player
            ctx.fillStyle = '#eab308';
            ctx.beginPath();
            const mouth = Math.abs(Math.sin(state.current.frame * 0.2)) * 0.25 * Math.PI;
            const angle = Math.atan2(p.dir.y, p.dir.x);
            ctx.arc(p.pos.x + 0.5, p.pos.y + 0.5, 0.4, angle + mouth, angle + Math.PI*2 - mouth);
            ctx.lineTo(p.pos.x + 0.5, p.pos.y + 0.5);
            ctx.fill();

            // 3. Update Ghosts
            if (state.current.scaredTimer > 0) state.current.scaredTimer--;
            else {
                state.current.ghosts.forEach(g => { if(g.mode === 'frightened') g.mode = 'chase'; });
            }

            state.current.ghosts.forEach(g => {
                // AI Logic (Simple)
                const gcx = Math.floor(g.pos.x) + 0.5;
                const gcy = Math.floor(g.pos.y) + 0.5;
                
                // If at center, pick new dir
                if (Math.abs(g.pos.x + 0.5 - gcx) < 0.1 && Math.abs(g.pos.y + 0.5 - gcy) < 0.1) {
                    const dirs = [{x:0, y:-1}, {x:0, y:1}, {x:-1, y:0}, {x:1, y:0}];
                    const validDirs = dirs.filter(d => 
                        !isWall(Math.round(g.pos.x) + d.x, Math.round(g.pos.y) + d.y) &&
                        !(d.x === -g.dir.x && d.y === -g.dir.y) // Don't reverse
                    );

                    if (validDirs.length > 0) {
                        // Pick best dir towards target
                        let target = g.mode === 'chase' ? p.pos : (g.mode === 'frightened' ? {x: Math.random()*28, y: Math.random()*31} : g.target);
                        if (g.mode === 'eaten') target = {x: 13.5, y: 11};

                        // Sort by dist to target
                        validDirs.sort((a, b) => {
                            const da = (g.pos.x + a.x - target.x)**2 + (g.pos.y + a.y - target.y)**2;
                            const db = (g.pos.x + b.x - target.x)**2 + (g.pos.y + b.y - target.y)**2;
                            return da - db;
                        });
                        g.dir = validDirs[0];
                    } else {
                        // Dead end
                        g.dir = {x: -g.dir.x, y: -g.dir.y};
                    }
                }

                // Move
                const speed = g.mode === 'eaten' ? 0.2 : (g.mode === 'frightened' ? 0.06 : g.speed);
                g.pos.x += g.dir.x * speed;
                g.pos.y += g.dir.y * speed;

                // Draw Ghost
                const color = g.mode === 'frightened' ? (state.current.scaredTimer < 120 && Math.floor(state.current.frame/10)%2===0 ? '#fff' : '#3b82f6') : (g.mode === 'eaten' ? 'transparent' : g.color);
                
                ctx.fillStyle = color;
                const gx = g.pos.x + 0.5; const gy = g.pos.y + 0.5;
                
                if (g.mode !== 'eaten') {
                    ctx.beginPath();
                    ctx.arc(gx, gy - 0.1, 0.4, Math.PI, 0);
                    ctx.lineTo(gx + 0.4, gy + 0.4);
                    ctx.lineTo(gx - 0.4, gy + 0.4);
                    ctx.fill();
                }

                // Eyes
                ctx.fillStyle = 'white';
                ctx.beginPath(); ctx.arc(gx - 0.15, gy - 0.15, 0.12, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(gx + 0.15, gy - 0.15, 0.12, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = 'black';
                ctx.beginPath(); ctx.arc(gx - 0.15 + g.dir.x*0.05, gy - 0.15 + g.dir.y*0.05, 0.06, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(gx + 0.15 + g.dir.x*0.05, gy - 0.15 + g.dir.y*0.05, 0.06, 0, Math.PI*2); ctx.fill();

                // Collision
                if (Math.abs(g.pos.x - p.pos.x) < 0.5 && Math.abs(g.pos.y - p.pos.y) < 0.5) {
                    if (g.mode === 'frightened') {
                        g.mode = 'eaten';
                        state.current.score += 200;
                        setScore(state.current.score);
                        state.current.particles.push({x: gx, y: gy, life: 1, color: '#fff', size: 0.5});
                    } else if (g.mode === 'chase' || g.mode === 'scatter') {
                        setLives(prev => {
                            if (prev <= 1) setGameState('gameover');
                            resetPositions();
                            return prev - 1;
                        });
                    }
                }
            });

            // Particles
            for(let i=state.current.particles.length-1; i>=0; i--) {
                const pt = state.current.particles[i];
                pt.life -= 0.02;
                if(pt.life <= 0) { state.current.particles.splice(i, 1); continue; }
                ctx.globalAlpha = pt.life;
                ctx.fillStyle = pt.color;
                ctx.font = 'bold 0.5px sans-serif';
                ctx.fillText("200", pt.x, pt.y - (1-pt.life));
            }
            ctx.globalAlpha = 1;

            ctx.restore();
            state.current.frame++;
            animationFrameId = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrameId);
    }, [gameState]);

    // Input Handler
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                const map = { ArrowUp: {x:0, y:-1}, ArrowDown: {x:0, y:1}, ArrowLeft: {x:-1, y:0}, ArrowRight: {x:1, y:0} };
                state.current.player.nextDir = map[e.key as keyof typeof map];
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    // Update High Score
    useEffect(() => {
        if (score > highScore) setHighScore(score);
    }, [score]);

    return (
        <div ref={containerRef} className="relative w-full max-w-7xl mx-auto aspect-video bg-[#0c0c0e] rounded-3xl overflow-hidden border border-white/10 shadow-2xl mb-12 group select-none flex flex-col">
            
            {/* Header / HUD */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-10 pointer-events-none">
                <div className="flex gap-12">
                    <div>
                        <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-1">Current Score</div>
                        <div className="text-3xl font-mono text-white leading-none">{score.toString().padStart(6, '0')}</div>
                    </div>
                    <div>
                        <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-1">High Score</div>
                        <div className="text-3xl font-mono text-[#69B7B2] leading-none">{highScore.toString().padStart(6, '0')}</div>
                    </div>
                </div>
                
                <div className="flex items-center gap-6 pointer-events-auto">
                    <button onClick={() => setMuted(!muted)} className="text-white/30 hover:text-white transition-colors">
                        {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <div className="flex gap-2">
                        {[...Array(3)].map((_, i) => (
                            <Heart key={i} size={24} className={`${i < lives ? 'text-red-500 fill-red-500' : 'text-white/10 fill-white/5'} transition-colors`} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Canvas */}
            <canvas ref={canvasRef} width={800} height={600} className="w-full h-full object-contain" />

            {/* Overlays */}
            {gameState === 'start' && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 transition-opacity duration-500">
                    <button
                        onClick={initGame}
                        className="group relative w-24 h-24 bg-[#1a1a1c] rounded-full flex items-center justify-center mb-8 transition-all border-t border-white/10 border-b border-black/50 shadow-[0_6px_0_#000,0_10px_20px_rgba(0,0,0,0.5)] active:shadow-[0_0_0_#000] active:translate-y-[6px] hover:bg-[#252528] active:border-b-0"
                    >
                        <Play size={40} className="text-white/40 group-hover:text-[#69B7B2] transition-colors ml-1" fill="currentColor" />
                        <div className="absolute inset-0 rounded-full ring-1 ring-white/5 pointer-events-none" />
                    </button>
                    <h2 className="text-3xl font-serif text-white mb-2">Ingestion Protocol</h2>
                    <p className="text-white/50 font-mono text-sm uppercase tracking-widest">Click to Initialize Agent</p>
                </div>
            )}

            {gameState === 'gameover' && (
                <div className="absolute inset-0 bg-red-900/40 backdrop-blur-md flex flex-col items-center justify-center z-20 animate-in fade-in zoom-in duration-300">
                    <div className="text-6xl font-black text-white mb-4 tracking-tighter drop-shadow-lg">SIGNAL LOST</div>
                    <div className="text-xl text-white/80 font-mono mb-8">FINAL SCORE: {score}</div>
                    <button onClick={initGame} className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-full hover:bg-gray-200 transition-colors">
                        Reboot System
                    </button>
                </div>
            )}

            {/* CRT Scanline Effect Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]" />
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-gradient-to-b from-white/10 to-transparent animate-scan" />
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
                <div className="max-w-6xl mx-auto px-6">
                    
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
