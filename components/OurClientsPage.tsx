
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
    Users, Handshake, ShieldCheck, Target, ArrowRight, 
    Truck, Zap, Activity, Factory, Briefcase, 
    Globe, Network, Layers, ChevronRight, ArrowUpRight, ScanLine,
    Database, Cpu, Lock, CheckCircle2, Terminal, ChevronDown, ChevronLeft, Play, X, Heart, Trophy, FileText, FileBarChart, FileCode, FileDigit
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

// --- PACMAN GAME ENGINES ---

const TILE_SIZE = 24;
const MAP_LAYOUT = [
    "1111111111111111111111111111",
    "1000000000000110000000000001",
    "1011110111110110111110111101",
    "1311110111110110111110111131",
    "1011110111110110111110111101",
    "1000000000000000000000000001",
    "1011110110111111110110111101",
    "1011110110111111110110111101",
    "1000000110000110000110000001",
    "1111110111112112111110111111",
    "2222210112222222222110122222",
    "2222210112111--1112110122222",
    "1111110112122222212110111111",
    "2222220002122222212000222222", // Tunnel
    "1111110112122222212110111111",
    "2222210112111111112110122222",
    "2222210112222222222110122222",
    "1111110110111111110110111111",
    "1000000000000110000000000001",
    "1011110111110110111110111101",
    "1300110000000000000000110031",
    "1110110110111111110110110111",
    "1000000110000110000110000001",
    "1111111111111111111111111111",
];

// Map codes: 0=Dot, 1=Wall, 2=Empty, 3=PowerFile, - = GhostGate

interface Entity {
    x: number; // Grid coordinates (float for smooth movement)
    y: number;
    dir: {x: number, y: number};
    nextDir: {x: number, y: number};
    speed: number;
}

interface Ghost extends Entity {
    id: number;
    color: string;
    type: 'chaser' | 'ambusher' | 'wanderer' | 'random';
    state: 'normal' | 'scared' | 'eaten';
    scaredTimer: number;
}

const TerminalPacmanGame: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover' | 'won'>('start');
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [highScore, setHighScore] = useState(0);

    // Game Refs
    const player = useRef<Entity>({ x: 13.5, y: 23, dir: {x:0, y:0}, nextDir: {x:0, y:0}, speed: 0.15 });
    const ghosts = useRef<Ghost[]>([]);
    const mapData = useRef<number[][]>([]);
    const frameRef = useRef<number>(null);
    const scaredTimer = useRef(0);

    // Initialize Game
    const initGame = () => {
        // Parse Map
        mapData.current = MAP_LAYOUT.map(row => row.split('').map(c => {
            if(c === '-') return 2; // Treat gate as empty for now (ghosts can pass special logic)
            return parseInt(c);
        }));

        player.current = { x: 13.5, y: 15, dir: {x:0, y:0}, nextDir: {x:0, y:0}, speed: 0.12 }; // Slower speed
        
        // Init Ghosts
        ghosts.current = [
            { id: 0, x: 12, y: 13, dir: {x:1, y:0}, nextDir: {x:1, y:0}, speed: 0.11, color: '#ef4444', type: 'chaser', state: 'normal', scaredTimer: 0 },
            { id: 1, x: 15, y: 13, dir: {x:-1, y:0}, nextDir: {x:-1, y:0}, speed: 0.1, color: '#f472b6', type: 'ambusher', state: 'normal', scaredTimer: 0 },
            { id: 2, x: 13.5, y: 11, dir: {x:0, y:1}, nextDir: {x:0, y:1}, speed: 0.1, color: '#06b6d4', type: 'wanderer', state: 'normal', scaredTimer: 0 },
            { id: 3, x: 13.5, y: 13, dir: {x:0, y:-1}, nextDir: {x:0, y:-1}, speed: 0.1, color: '#f59e0b', type: 'random', state: 'normal', scaredTimer: 0 }
        ];

        setScore(0);
        setLives(3);
        setGameState('playing');
        scaredTimer.current = 0;
    };

    // Keyboard Input
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (gameState !== 'playing') return;
            // Prevent default scrolling for arrow keys
            if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
                e.preventDefault();
            }

            switch(e.code) {
                case 'ArrowUp': player.current.nextDir = {x: 0, y: -1}; break;
                case 'ArrowDown': player.current.nextDir = {x: 0, y: 1}; break;
                case 'ArrowLeft': player.current.nextDir = {x: -1, y: 0}; break;
                case 'ArrowRight': player.current.nextDir = {x: 1, y: 0}; break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState]);

    // Game Loop
    useEffect(() => {
        if (gameState !== 'playing') return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Scale canvas for retina
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        // Grid fitting
        const cols = MAP_LAYOUT[0].length;
        const rows = MAP_LAYOUT.length;
        // Center the maze
        const mazeWidth = cols * TILE_SIZE;
        const mazeHeight = rows * TILE_SIZE;
        const offsetX = (rect.width - mazeWidth) / 2;
        const offsetY = (rect.height - mazeHeight) / 2;

        const isWall = (x: number, y: number) => {
            if (x < 0 || x >= cols || y < 0 || y >= rows) return true;
            return mapData.current[Math.floor(y)][Math.floor(x)] === 1;
        };

        const moveEntity = (e: Entity) => {
            // Try changing direction if centered on tile
            const centerX = Math.floor(e.x) + 0.5;
            const centerY = Math.floor(e.y) + 0.5;
            const dist = Math.sqrt((e.x - centerX)**2 + (e.y - centerY)**2);

            if (dist < e.speed) {
                // We are at center, can turn?
                if (e.nextDir.x !== 0 || e.nextDir.y !== 0) {
                    const nextTileX = Math.floor(e.x) + e.nextDir.x;
                    const nextTileY = Math.floor(e.y) + e.nextDir.y;
                    if (!isWall(nextTileX, nextTileY)) {
                        e.x = centerX; e.y = centerY; // Snap
                        e.dir = e.nextDir;
                        e.nextDir = {x:0, y:0};
                    }
                }
            }

            // Move
            const nextX = e.x + e.dir.x * e.speed;
            const nextY = e.y + e.dir.y * e.speed;
            
            // Wall Collision Check (Ahead)
            // Check tile center of where we are going
            const checkX = Math.floor(nextX + e.dir.x * 0.45);
            const checkY = Math.floor(nextY + e.dir.y * 0.45);

            // Tunnel Handling
            if (checkX < 0) { e.x = cols - 1; return; }
            if (checkX >= cols) { e.x = 0; return; }

            if (!isWall(checkX, checkY)) {
                e.x = nextX;
                e.y = nextY;
            } else {
                // Hit wall, snap to center of current tile
                e.x = Math.floor(e.x) + 0.5;
                e.y = Math.floor(e.y) + 0.5;
            }
        };

        const render = () => {
            // Clear
            ctx.fillStyle = '#0a0a0c';
            ctx.fillRect(0, 0, rect.width, rect.height);
            
            ctx.save();
            ctx.translate(offsetX, offsetY);

            // 1. Draw Map
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const cell = mapData.current[y][x];
                    const px = x * TILE_SIZE;
                    const py = y * TILE_SIZE;

                    if (cell === 1) {
                        ctx.fillStyle = '#1e3a8a'; // Dark blue wall base
                        ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                        ctx.strokeStyle = '#3b82f6'; // Neon blue outline
                        ctx.lineWidth = 1;
                        ctx.strokeRect(px + 4, py + 4, TILE_SIZE - 8, TILE_SIZE - 8);
                    } else if (cell === 0) {
                        // Pellet
                        ctx.fillStyle = '#94a3b8';
                        ctx.fillRect(px + TILE_SIZE/2 - 2, py + TILE_SIZE/2 - 2, 4, 4);
                    } else if (cell === 3) {
                        // Power Pellet (File Icon)
                        // Simple file shape
                        ctx.fillStyle = '#fbbf24';
                        ctx.beginPath();
                        ctx.moveTo(px + 6, py + 4);
                        ctx.lineTo(px + 14, py + 4);
                        ctx.lineTo(px + 18, py + 8);
                        ctx.lineTo(px + 18, py + 20);
                        ctx.lineTo(px + 6, py + 20);
                        ctx.fill();
                        // Fold
                        ctx.fillStyle = '#d97706';
                        ctx.beginPath(); ctx.moveTo(px+14, py+4); ctx.lineTo(px+14, py+8); ctx.lineTo(px+18, py+8); ctx.fill();
                        
                        // Text label tiny
                        ctx.font = "bold 6px sans-serif";
                        ctx.fillStyle = "black";
                        ctx.fillText("PDF", px+7, py+16);
                    }
                }
            }

            // 2. Move & Draw Player
            moveEntity(player.current);
            const p = player.current;
            ctx.fillStyle = '#eab308'; // Yellow
            ctx.beginPath();
            // Mouth logic based on dir and time
            const mouthOpen = Math.abs(Math.sin(Date.now() / 100)) * 0.2 + 0.05;
            let startAngle = 0;
            if (p.dir.x === 1) startAngle = 0;
            if (p.dir.x === -1) startAngle = Math.PI;
            if (p.dir.y === 1) startAngle = Math.PI/2;
            if (p.dir.y === -1) startAngle = -Math.PI/2;
            
            ctx.arc(p.x * TILE_SIZE + TILE_SIZE/2, p.y * TILE_SIZE + TILE_SIZE/2, TILE_SIZE/2 - 2, startAngle + mouthOpen * Math.PI, startAngle + (2 - mouthOpen) * Math.PI);
            ctx.lineTo(p.x * TILE_SIZE + TILE_SIZE/2, p.y * TILE_SIZE + TILE_SIZE/2);
            ctx.fill();

            // 3. Collect Items
            const pGx = Math.floor(p.x);
            const pGy = Math.floor(p.y);
            // Relaxed collision for items
            if (pGx >= 0 && pGx < cols && pGy >= 0 && pGy < rows) {
                const cell = mapData.current[pGy][pGx];
                if (cell === 0) { // Pellet
                    mapData.current[pGy][pGx] = 2; // Empty
                    setScore(s => s + 10);
                } else if (cell === 3) { // Power
                    mapData.current[pGy][pGx] = 2;
                    setScore(s => s + 50);
                    // Scare ghosts
                    ghosts.current.forEach(g => { 
                        if(g.state !== 'eaten') g.state = 'scared'; 
                        g.speed = 0.06; // Slow down
                    });
                    scaredTimer.current = 600; // Frames
                }
            }

            // 4. Ghost AI & Draw
            if (scaredTimer.current > 0) {
                scaredTimer.current--;
                if (scaredTimer.current <= 0) {
                    ghosts.current.forEach(g => {
                        if(g.state === 'scared') g.state = 'normal';
                        g.speed = 0.1; // Restore speed
                    });
                }
            }

            ghosts.current.forEach(g => {
                // Simple AI: Move straight, turn at intersection
                const gx = Math.floor(g.x);
                const gy = Math.floor(g.y);
                const centerX = gx + 0.5;
                const centerY = gy + 0.5;
                
                // If at center of tile
                if (Math.abs(g.x - centerX) < 0.1 && Math.abs(g.y - centerY) < 0.1) {
                    // Decide new direction
                    const possibleDirs = [];
                    if (!isWall(gx, gy-1) && g.dir.y !== 1) possibleDirs.push({x:0, y:-1}); // Up (cant go down immediately)
                    if (!isWall(gx, gy+1) && g.dir.y !== -1) possibleDirs.push({x:0, y:1}); // Down
                    if (!isWall(gx-1, gy) && g.dir.x !== 1) possibleDirs.push({x:-1, y:0}); // Left
                    if (!isWall(gx+1, gy) && g.dir.x !== -1) possibleDirs.push({x:1, y:0}); // Right

                    if (possibleDirs.length > 0) {
                        // Choice logic
                        if (g.state === 'scared') {
                            // Random
                            g.dir = possibleDirs[Math.floor(Math.random() * possibleDirs.length)];
                        } else {
                            // Try to move towards player (simple heuristic)
                            // Sort dirs by distance to player
                            possibleDirs.sort((a, b) => {
                                const distA = Math.sqrt((gx+a.x - p.x)**2 + (gy+a.y - p.y)**2);
                                const distB = Math.sqrt((gx+b.x - p.x)**2 + (gy+b.y - p.y)**2);
                                return distA - distB;
                            });
                            // Pick best with some randomness for personality
                            g.dir = possibleDirs[0]; 
                            if (g.type === 'random' && possibleDirs.length > 1 && Math.random() > 0.5) g.dir = possibleDirs[1];
                        }
                    } else {
                        // Dead end, reverse
                        g.dir = { x: -g.dir.x, y: -g.dir.y };
                    }
                }
                
                g.x += g.dir.x * g.speed;
                g.y += g.dir.y * g.speed;

                // Draw Ghost
                const ghostColor = g.state === 'scared' ? (scaredTimer.current < 120 && Math.floor(Date.now()/200)%2===0 ? '#fff' : '#3b82f6') : g.color;
                
                ctx.fillStyle = ghostColor;
                const gPx = g.x * TILE_SIZE + TILE_SIZE/2;
                const gPy = g.y * TILE_SIZE + TILE_SIZE/2;
                
                ctx.beginPath();
                ctx.arc(gPx, gPy - 2, TILE_SIZE/2 - 2, Math.PI, 0);
                ctx.lineTo(gPx + TILE_SIZE/2 - 2, gPy + TILE_SIZE/2 - 2);
                // Feet
                for(let k=1; k<=3; k++) ctx.lineTo(gPx + TILE_SIZE/2 - 2 - (k*(TILE_SIZE-4)/3), (k%2===0 ? gPy+TILE_SIZE/2-2 : gPy+TILE_SIZE/2-5));
                ctx.lineTo(gPx - TILE_SIZE/2 + 2, gPy - 2);
                ctx.fill();

                // Eyes
                ctx.fillStyle = 'white';
                ctx.beginPath(); ctx.arc(gPx - 4, gPy - 4, 3, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(gPx + 4, gPy - 4, 3, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = 'black';
                ctx.beginPath(); ctx.arc(gPx - 4 + g.dir.x*1.5, gPy - 4 + g.dir.y*1.5, 1.5, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(gPx + 4 + g.dir.x*1.5, gPy - 4 + g.dir.y*1.5, 1.5, 0, Math.PI*2); ctx.fill();

                // Collision with Player
                const distToPlayer = Math.sqrt((g.x - p.x)**2 + (g.y - p.y)**2);
                if (distToPlayer < 0.8) {
                    if (g.state === 'scared') {
                        g.state = 'eaten';
                        g.x = 13.5; g.y = 11; // Respawn box
                        g.state = 'normal';
                        setScore(s => s + 200);
                    } else {
                        // Die
                        setLives(l => {
                            if (l <= 1) {
                                setGameState('gameover');
                                return 0;
                            }
                            // Reset positions
                            player.current.x = 13.5; player.current.y = 23;
                            ghosts.current.forEach((gh, idx) => {
                                gh.x = [12, 15, 13.5, 13.5][idx];
                                gh.y = [13, 13, 11, 13][idx];
                            });
                            return l - 1;
                        });
                    }
                }
            });

            ctx.restore();
            frameRef.current = requestAnimationFrame(render);
        };

        render();
        return () => { if(frameRef.current) cancelAnimationFrame(frameRef.current); };
    }, [gameState]);

    // High Score tracking
    useEffect(() => {
        if (score > highScore) setHighScore(score);
    }, [score]);

    return (
        <div ref={containerRef} className="relative w-full max-w-5xl mx-auto h-[650px] bg-[#0c0c0e] rounded-3xl overflow-hidden border border-white/10 shadow-2xl mb-12 group select-none">
            
            {/* START SCREEN OVERLAY */}
            {gameState === 'start' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md z-50 transition-opacity duration-500">
                    <button
                        onClick={(e) => { e.stopPropagation(); initGame(); }}
                        className="group relative w-32 h-32 bg-[#1a1a1c] rounded-full flex items-center justify-center mb-8 transition-all border-t border-white/10 border-b border-black/50 shadow-[0_6px_0_#000,0_10px_20px_rgba(0,0,0,0.5)] active:shadow-[0_0_0_#000] active:translate-y-[6px] hover:bg-[#252528]"
                    >
                        <Play size={48} className="text-white/40 group-hover:text-[#69B7B2] ml-2 transition-colors" fill="currentColor" />
                        <div className="absolute inset-0 rounded-full ring-1 ring-white/5 pointer-events-none" />
                    </button>
                    <h3 className="text-4xl font-serif text-white mb-2 tracking-tight">System Ingestion</h3>
                    <p className="text-white/50 text-base mb-8 font-mono">Collect data packets. Avoid firewall ghosts.</p>
                    <div className="flex gap-4 text-xs font-mono text-white/30 uppercase tracking-widest">
                        <span className="flex items-center gap-1 border border-white/10 px-2 py-1 rounded"><ArrowUpRight size={10} /> Arrow Keys to Move</span>
                    </div>
                </div>
            )}

            {/* GAME OVER OVERLAY */}
            {gameState === 'gameover' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/40 backdrop-blur-md z-50 animate-in fade-in duration-300">
                    <div className="text-6xl font-black text-white mb-4 tracking-tighter drop-shadow-lg">CONNECTION LOST</div>
                    <div className="text-2xl text-white/80 mb-8 font-mono">DATA INGESTED: {score}</div>
                    <button 
                        onClick={initGame}
                        className="px-10 py-4 bg-white text-black hover:bg-gray-200 font-bold uppercase tracking-widest text-sm rounded-full transition-colors shadow-lg"
                    >
                        Reboot System
                    </button>
                </div>
            )}

            <canvas 
                ref={canvasRef} 
                className="absolute inset-0 w-full h-full cursor-none block" 
            />
            
            {/* HUD */}
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-40 pointer-events-none">
                <div className="flex gap-8">
                    <div>
                        <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Current Session</div>
                        <div className="text-3xl font-mono text-white leading-none">{score.toString().padStart(6, '0')}</div>
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Record</div>
                        <div className="text-3xl font-mono text-[#69B7B2] leading-none">{highScore.toString().padStart(6, '0')}</div>
                    </div>
                </div>
                
                <div className="flex gap-2">
                    {[...Array(3)].map((_, i) => (
                        <Heart key={i} size={24} className={`${i < lives ? 'text-red-500 fill-red-500' : 'text-white/10 fill-white/5'} transition-all`} />
                    ))}
                </div>
            </div>

            {/* Footer Hints */}
            {gameState === 'playing' && (
                <div className="absolute bottom-6 w-full text-center pointer-events-none">
                    <div className="inline-flex items-center gap-6 bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/5 text-[10px] font-mono text-white/40 uppercase tracking-widest">
                        <span className="flex items-center gap-2"><div className="w-2 h-2 bg-[#fbbf24] rounded-sm" /> +50 PTS (Power)</span>
                        <span className="flex items-center gap-2"><div className="w-2 h-2 bg-[#94a3b8] rounded-sm" /> +10 PTS (Data)</span>
                        <span className="flex items-center gap-2 text-red-400"><div className="w-2 h-2 bg-red-500 rounded-full" /> Avoid</span>
                    </div>
                </div>
            )}

            {gameState === 'playing' && (
                <button 
                    onClick={() => setGameState('start')}
                    className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/20 rounded-full text-white/30 hover:text-white transition-colors z-50 pointer-events-auto"
                >
                    <X size={20} />
                </button>
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
