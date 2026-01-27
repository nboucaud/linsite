
import React, { useState, useEffect, useRef } from 'react';
import { ChallengeData } from '../lib/chapter-data';
import { Waves, Zap, RefreshCw, Check, ArrowRight, X, AlertCircle, BarChart3, Eye, EyeOff, HelpCircle, Lightbulb } from 'lucide-react';

interface ChallengeProps {
  data: ChallengeData;
  onComplete: () => void;
}

const ParticleBurst: React.FC<{ x: number; y: number }> = ({ x, y }) => {
    return (
        <div className="absolute pointer-events-none z-50" style={{ left: x, top: y }}>
            {[...Array(8)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-1 h-1 bg-amber-glow rounded-full animate-ping"
                    style={{
                        transform: `rotate(${i * 45}deg) translate(20px)`,
                        animationDuration: '0.5s'
                    }}
                />
            ))}
        </div>
    );
};

// --- 1. TUNER (CANVAS) ---
const TunerChallenge: React.FC<ChallengeProps> = ({ data, onComplete }) => {
  const [frequency, setFrequency] = useState(50);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const target = data.tunerData?.targetFrequency || 82;
  const tolerance = data.tunerData?.tolerance || 2;
  const distance = Math.abs(frequency - target);
  const signalStrength = Math.max(0, 1 - distance / 20);
  
  useEffect(() => {
    if (distance < tolerance && !isUnlocked) {
      setIsUnlocked(true);
      setTimeout(onComplete, 2000);
    }
  }, [distance, isUnlocked, onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let frameId: number;
    const render = () => {
      ctx.fillStyle = '#060608';
      ctx.fillRect(0,0,canvas.width,canvas.height);
      const noise = (1 - signalStrength) * 60;
      ctx.strokeStyle = isUnlocked ? '#4ade80' : `hsla(45, 100%, 60%, ${0.2 + signalStrength})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      for(let i=0; i<canvas.width; i+=4) {
        const t = Date.now() * 0.005;
        const wave = Math.sin(t + i * 0.02) * (signalStrength * 50);
        const interference = Math.random() * noise;
        const y = canvas.height/2 + wave + interference;
        if(i===0) ctx.moveTo(i,y); else ctx.lineTo(i,y);
      }
      ctx.stroke();
      if (signalStrength > 0.5) {
          ctx.fillStyle = `rgba(255,255,255,${(signalStrength - 0.5) * 0.1})`;
          ctx.fillRect(0, canvas.height/2 - 2, canvas.width, 4);
      }
      frameId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(frameId);
  }, [signalStrength, isUnlocked]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full aspect-video bg-black rounded-3xl border-2 border-white/5 overflow-hidden mb-8 shadow-inner ring-1 ring-white/10">
        <canvas ref={canvasRef} width={800} height={450} className="w-full h-full" />
        <div className={`absolute inset-0 flex items-center justify-center p-12 text-center transition-all duration-1000 ${isUnlocked ? 'opacity-100 blur-0' : 'opacity-0 blur-lg'}`} style={{ opacity: Math.max(0, signalStrength - 0.2) }}>
            <div className={`font-serif italic text-3xl md:text-4xl ${isUnlocked ? 'text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]' : 'text-amber-glow'}`}>"{data.tunerData?.quote}"</div>
        </div>
      </div>
      <div className="w-full flex items-center gap-4 bg-white/5 p-4 rounded-full border border-white/5">
        <Waves size={20} className="text-white/20 ml-2" />
        <input 
            type="range" min="0" max="100" step="0.1" value={frequency}
            onChange={(e) => setFrequency(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-black rounded-full appearance-none accent-amber-glow cursor-pointer"
        />
        <div className="font-mono text-xs text-amber-glow w-16 text-right">{frequency.toFixed(1)}Hz</div>
      </div>
    </div>
  );
};

// --- 2. SLIDE PUZZLE ---
const SlidePuzzleChallenge: React.FC<ChallengeProps> = ({ data, onComplete }) => {
  const gridSize = data.slideData?.gridSize || 3;
  const [tiles, setTiles] = useState<number[]>([]);
  const [isSolved, setIsSolved] = useState(false);

  useEffect(() => {
    const total = gridSize * gridSize;
    let init = Array.from({ length: total }, (_, i) => i);
    for(let i = 0; i < 20; i++) {
        const empty = init.indexOf(total-1);
        const neighbors = [];
        if (Math.floor(empty/gridSize) > 0) neighbors.push(empty-gridSize);
        if (Math.floor(empty/gridSize) < gridSize-1) neighbors.push(empty+gridSize);
        if (empty % gridSize > 0) neighbors.push(empty-1);
        if (empty % gridSize < gridSize-1) neighbors.push(empty+1);
        const swap = neighbors[Math.floor(Math.random()*neighbors.length)];
        [init[empty], init[swap]] = [init[swap], init[empty]];
    }
    setTiles(init);
  }, [gridSize]);

  const handleMove = (idx: number) => {
    if(isSolved) return;
    const empty = tiles.indexOf(gridSize * gridSize - 1);
    const r = Math.floor(idx / gridSize), c = idx % gridSize;
    const er = Math.floor(empty / gridSize), ec = empty % gridSize;
    if(Math.abs(r - er) + Math.abs(c - ec) === 1) {
        const next = [...tiles];
        [next[idx], next[empty]] = [next[empty], next[idx]];
        setTiles(next);
        if(next.every((v, i) => v === i)) {
            setIsSolved(true);
            setTimeout(onComplete, 1500);
        }
    }
  };

  return (
    <div className="relative">
        <div className={`grid gap-1.5 p-3 bg-[#111] rounded-[2rem] border-4 border-white/10 shadow-2xl transition-all duration-1000 ${isSolved ? 'border-green-500/50 shadow-[0_0_50px_rgba(74,222,128,0.2)]' : ''}`} style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)`, width: '400px', height: '400px' }}>
        {tiles.map((v, i) => {
            const empty = v === gridSize * gridSize - 1;
            return (
            <div 
                key={i} onClick={() => handleMove(i)}
                className={`relative rounded-lg overflow-hidden transition-all duration-200 ${empty ? 'opacity-0 pointer-events-none' : 'cursor-pointer hover:brightness-110 active:scale-95 border border-white/5'}`}
                style={{ 
                    backgroundImage: `url(${data.slideData?.imageUrl})`, 
                    backgroundSize: `${gridSize * 100}%`, 
                    backgroundPosition: `${(v % gridSize) * (100/(gridSize-1))}% ${Math.floor(v/gridSize) * (100/(gridSize-1))}%`,
                    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
                }}
            />
            );
        })}
        </div>
        {isSolved && <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-[2rem] animate-in fade-in duration-500">
             <Check className="text-green-400 w-16 h-16 drop-shadow-[0_0_15px_rgba(74,222,128,1)]" />
        </div>}
    </div>
  );
};

// --- 3. CIRCUIT PUZZLE ---
const CircuitChallenge: React.FC<ChallengeProps> = ({ data, onComplete }) => {
    const d = data.circuitData!;
    const size = d.gridSize;
    const [grid, setGrid] = useState<{type: number, rot: number}[][]>([]);
    const [powered, setPowered] = useState<boolean[][]>([]);
    const [solved, setSolved] = useState(false);

    useEffect(() => {
        const newGrid = d.layout.map(row => row.map(type => ({
            type,
            rot: Math.floor(Math.random() * 4) * 90
        })));
        setGrid(newGrid);
    }, [d]);

    useEffect(() => {
        if (grid.length === 0) return;
        const newPowered = Array(size).fill(0).map(() => Array(size).fill(false));
        const queue: [number, number][] = [d.start];
        newPowered[d.start[0]][d.start[1]] = true;
        
        // Connects logic: 'dir' is the direction from current cell to neighbor (0=Up, 1=Right, 2=Down, 3=Left)
        const connects = (type: number, rot: number, dir: number) => {
            const eff = (dir - rot/90 + 4) % 4;
            if (type === 1) return eff === 0 || eff === 2;
            if (type === 2) return eff === 0 || eff === 1;
            if (type === 3) return eff !== 3;
            if (type === 4) return true;
            return false;
        };
        const visited = new Set<string>();
        visited.add(`${d.start[0]},${d.start[1]}`);
        
        while (queue.length > 0) {
            const [r, c] = queue.shift()!;
            const cell = grid[r][c];
            const neighbors = [
                {r: r-1, c: c, dir: 0, opp: 2},
                {r: r, c: c+1, dir: 1, opp: 3},
                {r: r+1, c: c, dir: 2, opp: 0},
                {r: r, c: c-1, dir: 3, opp: 1}
            ];
            for (const n of neighbors) {
                if (n.r >= 0 && n.r < size && n.c >= 0 && n.c < size) {
                    const neighbor = grid[n.r][n.c];
                    if (connects(cell.type, cell.rot, n.dir) && connects(neighbor.type, neighbor.rot, n.opp)) {
                        if (!visited.has(`${n.r},${n.c}`)) {
                            visited.add(`${n.r},${n.c}`);
                            newPowered[n.r][n.c] = true;
                            queue.push([n.r, n.c]);
                        }
                    }
                }
            }
        }
        setPowered(newPowered);
        if (newPowered[d.end[0]][d.end[1]] && !solved) {
            setSolved(true);
            setTimeout(onComplete, 1500);
        }
    }, [grid, d.start, d.end, size, solved, onComplete]);

    const rotate = (r: number, c: number) => {
        if(solved) return;
        setGrid(prev => {
            const next = [...prev];
            next[r] = [...prev[r]];
            next[r][c] = { ...prev[r][c], rot: (prev[r][c].rot + 90) % 360 };
            return next;
        });
    };

    const getPieceSVG = (type: number, color: string) => {
        const stroke = color;
        const width = 6;
        switch(type) {
            case 1: // Straight
                return <path d="M 50 0 L 50 100" stroke={stroke} strokeWidth={width} strokeLinecap="round" />;
            case 2: // Corner
                return <path d="M 50 0 L 50 50 L 100 50" stroke={stroke} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" fill="none" />;
            case 3: // Tee
                return <path d="M 50 0 L 50 100 M 50 50 L 100 50" stroke={stroke} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />;
            case 4: // Cross
                return <path d="M 50 0 L 50 100 M 0 50 L 100 50" stroke={stroke} strokeWidth={width} strokeLinecap="round" />;
            default: return null;
        }
    };

    return (
        <div className="flex flex-col items-center">
             <div className="grid gap-2 p-6 bg-[#0a0a0c] rounded-xl border border-white/10" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
                {grid.map((row, r) => row.map((cell, c) => {
                    const isStart = r === d.start[0] && c === d.start[1];
                    const isEnd = r === d.end[0] && c === d.end[1];
                    const isPowered = powered[r] && powered[r][c];
                    
                    return (
                        <div 
                            key={`${r}-${c}`}
                            onClick={() => cell.type !== 0 && rotate(r, c)}
                            className={`w-16 h-16 rounded-lg flex items-center justify-center transition-all duration-300 relative overflow-hidden ${cell.type === 0 ? 'bg-transparent' : 'bg-white/5 cursor-pointer hover:bg-white/10'} ${isPowered ? 'shadow-[0_0_15px_rgba(251,191,36,0.3)] border border-amber-glow/50' : 'border border-transparent'}`}
                        >
                            <svg 
                                viewBox="0 0 100 100" 
                                className="w-full h-full p-2 transition-transform duration-300"
                                style={{ transform: `rotate(${cell.rot}deg)` }}
                            >
                                {getPieceSVG(cell.type, isPowered ? '#fbbf24' : '#555')}
                            </svg>
                            
                            {isStart && <div className="absolute w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e] z-10 top-1 left-1" />}
                            {isEnd && <div className={`absolute w-3 h-3 rounded-full z-10 transition-all bottom-1 right-1 ${isPowered ? 'bg-amber-glow scale-150 shadow-[0_0_20px_#fbbf24]' : 'bg-red-500'}`} />}
                        </div>
                    );
                }))}
             </div>
        </div>
    );
};

// --- 5. REDACTION PUZZLE ---
const RedactionChallenge: React.FC<ChallengeProps> = ({ data, onComplete }) => {
  const d = data.redactionData!;
  const words = d.fullText.split(/\s+/);
  const [visible, setVisible] = useState<boolean[]>(new Array(words.length).fill(false));
  const [solved, setSolved] = useState(false);

  const toggleWord = (index: number) => {
    if (solved) return;
    const currentVisibleCount = visible.filter(v => v).length;
    if (!visible[index] && currentVisibleCount >= d.maxVisible) return;

    setVisible(prev => {
        const next = [...prev];
        next[index] = !next[index];
        const selectedIndices = next.map((v, i) => v ? i : -1).filter(i => i !== -1);
        const hasAllRequired = d.requiredIndices.every(i => selectedIndices.includes(i));
        const hasNoForbidden = !d.forbiddenIndices.some(i => selectedIndices.includes(i));
        if (hasAllRequired && hasNoForbidden) {
             setSolved(true);
             setTimeout(onComplete, 1500);
        }
        return next;
    });
  };

  return (
    <div className="w-full max-w-2xl bg-[#0a0a0c] p-8 rounded-xl border border-white/10 font-mono text-lg leading-loose shadow-2xl relative">
        <div className="absolute top-0 right-0 p-4 text-[10px] text-white/30 tracking-widest uppercase">
            Visible: {visible.filter(v => v).length} / {d.maxVisible}
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-4">
            {words.map((word, i) => {
                const isVis = visible[i];
                return (
                    <span 
                        key={i}
                        onClick={() => toggleWord(i)}
                        className={`
                            relative px-1 cursor-pointer transition-all duration-300 select-none
                            ${isVis ? 'text-amber-glow bg-amber-glow/10' : 'bg-black text-transparent hover:bg-white/10'}
                        `}
                    >
                        <span className={isVis ? '' : 'opacity-0'}>{word}</span>
                        {!isVis && (
                            <span className="absolute inset-0 bg-white/20 h-4 my-auto w-full group-hover:bg-white/30" />
                        )}
                        <span className={`absolute inset-0 bg-white h-4 my-auto w-full transition-transform duration-300 origin-left ${isVis ? 'scale-x-0' : 'scale-x-100'}`} />
                    </span>
                )
            })}
        </div>
        {solved && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl animate-in fade-in">
                <div className="flex items-center gap-4 text-green-400 text-xl tracking-[0.3em] font-bold border-2 border-green-500/50 p-6 rounded-lg bg-black">
                    <Check size={32} /> DECLASSIFIED
                </div>
            </div>
        )}
    </div>
  );
};

// --- 6. EQUALIZER PUZZLE ---
const EqualizerChallenge: React.FC<ChallengeProps> = ({ data, onComplete }) => {
    const d = data.equalizerData!;
    const [values, setValues] = useState<number[]>(new Array(d.labels.length).fill(50));
    const [solved, setSolved] = useState(false);

    useEffect(() => {
        const isMatch = values.every((v, i) => Math.abs(v - d.targetValues[i]) <= d.tolerance);
        if (isMatch && !solved) {
            setSolved(true);
            setTimeout(onComplete, 1500);
        }
    }, [values, d, solved]);

    const handleChange = (index: number, val: number) => {
        setValues(prev => {
            const next = [...prev];
            next[index] = val;
            return next;
        });
    };

    return (
        <div className="w-full max-w-2xl bg-[#111] p-8 rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-end h-56 mb-12 gap-6 px-4 relative">
                 {/* Target Line Indicators (Improved Visibility) */}
                 <div className="absolute inset-x-4 bottom-0 top-0 flex justify-between items-end pointer-events-none z-0">
                    {d.targetValues.map((t, i) => (
                        <div key={`target-${i}`} className="w-full mx-3 relative h-full">
                            <div className="absolute w-full border-t-2 border-dashed border-white/30" style={{ bottom: `${t}%` }}>
                                <span className="absolute -top-6 left-0 right-0 text-center text-[9px] text-white/30 font-mono">TARGET</span>
                            </div>
                        </div>
                    ))}
                 </div>

                 {values.map((v, i) => {
                     const isCorrect = Math.abs(v - d.targetValues[i]) <= d.tolerance;
                     return (
                        <div key={i} className="relative flex-1 h-full bg-white/5 rounded-t-lg group overflow-hidden border border-white/5">
                            {/* Fader Bar */}
                            <div 
                                className={`absolute bottom-0 inset-x-0 transition-all duration-300 ${
                                    isCorrect 
                                        ? 'bg-green-500 shadow-[0_0_30px_#22c55e]' 
                                        : 'bg-amber-glow/80'
                                }`} 
                                style={{ height: `${v}%` }} 
                            />
                            
                            {/* Value Display */}
                            <div className={`absolute bottom-2 inset-x-0 text-center text-[10px] font-mono font-bold transition-colors ${isCorrect ? 'text-black' : 'text-black/50'}`}>
                                {v}%
                            </div>

                            {/* Status Icon */}
                            {isCorrect && (
                                <div className="absolute top-2 inset-x-0 flex justify-center animate-in zoom-in duration-300">
                                    <div className="w-4 h-4 rounded-full bg-black/20 text-white flex items-center justify-center">
                                        <Check size={10} strokeWidth={4} />
                                    </div>
                                </div>
                            )}

                            <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={v} 
                                onChange={(e) => handleChange(i, parseInt(e.target.value))}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-ns-resize z-20"
                                {...({ orient: "vertical" } as any)}
                            />
                        </div>
                     )
                 })}
            </div>
            
            <div className="flex justify-between px-4 pb-2">
                {d.labels.map((l, i) => (
                    <div key={i} className="text-[10px] font-mono font-bold text-white/60 uppercase tracking-widest rotate-[-45deg] origin-left translate-y-4 w-12 truncate">
                        {l}
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- 7. QUIZ PUZZLE ---
const QuizChallenge: React.FC<ChallengeProps> = ({ data, onComplete }) => {
    const d = data.quizData!;
    const [selected, setSelected] = useState<number | null>(null);
    const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

    const handleSelect = (idx: number) => {
        if (status === 'correct') return;
        setSelected(idx);
        if (idx === d.correctIndex) {
            setStatus('correct');
            setTimeout(onComplete, 2000);
        } else {
            setStatus('wrong');
            setTimeout(() => {
                setStatus('idle');
                setSelected(null);
            }, 1000);
        }
    };

    return (
        <div className="w-full max-w-xl">
            <div className="bg-white/5 p-6 rounded-xl border border-white/10 mb-6">
                <h4 className="text-xl font-serif text-white leading-relaxed">{d.question}</h4>
            </div>
            <div className="grid gap-4">
                {d.options.map((opt, i) => {
                    let stateClass = "bg-black border-white/10 hover:bg-white/5 text-white/70";
                    if (selected === i) {
                        if (status === 'correct') stateClass = "bg-green-500/20 border-green-500 text-green-400";
                        if (status === 'wrong') stateClass = "bg-red-500/20 border-red-500 text-red-400";
                        if (status === 'idle') stateClass = "bg-amber-glow/20 border-amber-glow text-amber-glow";
                    }
                    return (
                        <button 
                            key={i}
                            onClick={() => handleSelect(i)}
                            className={`w-full text-left p-4 rounded-lg border transition-all duration-200 font-mono text-sm ${stateClass}`}
                        >
                            <span className="opacity-50 mr-4">0{i+1}</span>
                            {opt}
                        </button>
                    )
                })}
            </div>
            {status === 'correct' && (
                <div className="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg text-green-400 text-sm animate-in slide-in-from-top-2">
                    <span className="font-bold mr-2">ANALYSIS:</span> {d.explanation}
                </div>
            )}
        </div>
    );
};

// --- 8. COMPOSITOR (ELITE) ---
const CompositorChallenge: React.FC<ChallengeProps> = ({ data, onComplete }) => {
    const layers = data.compositorData?.layers || [];
    const [pos, setPos] = useState<Record<string, {x: number, y: number}>>(() => {
        const init: any = {};
        layers.forEach(l => init[l.id] = { x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 });
        return init;
    });
    const [drag, setDrag] = useState<string | null>(null);
    const [locked, setLocked] = useState<string[]>([]);
    const [bursts, setBursts] = useState<{id: number, x: number, y: number}[]>([]);
    const ref = useRef<HTMLDivElement>(null);

    const triggerBurst = (x: number, y: number) => {
        const id = Date.now();
        setBursts(prev => [...prev, { id, x, y }]);
        setTimeout(() => setBursts(prev => prev.filter(b => b.id !== id)), 1000);
    };

    useEffect(() => {
        const move = (e: any) => {
            if(!drag || !ref.current) return;
            const r = ref.current.getBoundingClientRect();
            const clientX = e.clientX ?? e.touches?.[0]?.clientX;
            const clientY = e.clientY ?? e.touches?.[0]?.clientY;
            const x = ((clientX - r.left) / r.width * 100);
            const y = ((clientY - r.top) / r.height * 100);
            setPos(prev => ({ ...prev, [drag]: { x, y } }));
        };
        const up = () => {
            if(!drag) return;
            const l = layers.find(layer => layer.id === drag);
            if (!l) return;
            const dist = Math.sqrt(Math.pow(pos[drag].x - l.targetX, 2) + Math.pow(pos[drag].y - l.targetY, 2));
            if(dist < l.tolerance) {
                setPos(p => ({ ...p, [drag]: { x: l.targetX, y: l.targetY } }));
                setLocked(prev => {
                    const next = [...prev, drag];
                    if(next.length === layers.length) setTimeout(onComplete, 1500);
                    return next;
                });
                const r = ref.current?.getBoundingClientRect();
                if (r) {
                    const absoluteX = (l.targetX / 100) * r.width;
                    const absoluteY = (l.targetY / 100) * r.height;
                    triggerBurst(absoluteX, absoluteY);
                }
            }
            setDrag(null);
        };
        window.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
        window.addEventListener('touchmove', move); window.addEventListener('touchend', up);
        return () => {
            window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up);
            window.removeEventListener('touchmove', move); window.removeEventListener('touchend', up);
        }
    }, [drag, pos, layers, onComplete]);

    return (
        <div className="flex flex-col items-center w-full">
            <div 
                ref={ref} 
                className="relative w-full max-w-[500px] aspect-[3/4] bg-[#e5e5e5] rounded-sm overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/20 select-none"
                style={{ cursor: drag ? 'grabbing' : 'default' }}
            >
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <div className="absolute inset-0 overflow-visible pointer-events-none z-[100]">
                    {bursts.map(b => <ParticleBurst key={b.id} x={b.x} y={b.y} />)}
                </div>
                {layers.map((l, i) => (
                    <div 
                        key={l.id} 
                        onMouseDown={() => !locked.includes(l.id) && setDrag(l.id)}
                        onTouchStart={() => !locked.includes(l.id) && setDrag(l.id)}
                        className={`absolute flex items-center justify-center transition-all duration-200 
                            ${locked.includes(l.id) ? 'pointer-events-none z-0' : 'cursor-grab hover:scale-105 active:scale-95 z-50 shadow-xl'}
                        `}
                        style={{ 
                            left: `${pos[l.id].x}%`, 
                            top: `${pos[l.id].y}%`, 
                            width: `${l.width}%`, 
                            transform: 'translate(-50%, -50%)', 
                            zIndex: drag === l.id ? 100 : locked.includes(l.id) ? i + 1 : 50,
                            mixBlendMode: locked.includes(l.id) ? (l.blendMode as any || 'normal') : 'normal',
                            opacity: drag === l.id ? 0.9 : 1
                        }}
                    >
                        {l.type === 'text' ? (
                            <div className="font-black text-black leading-none whitespace-nowrap" style={{ fontSize: 'clamp(1rem, 5vw, 4rem)', letterSpacing: '-0.05em' }}>
                                {l.content}
                            </div>
                        ) : l.type === 'image' && l.src ? (
                            <img src={l.src} alt="" className="w-full h-auto object-contain pointer-events-none" />
                        ) : (
                            <div className="w-full aspect-square" style={{ backgroundColor: l.color }} />
                        )}
                        {!locked.includes(l.id) && (
                            <div className="absolute -inset-2 border-2 border-amber-glow/50 rounded-lg opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
                        )}
                    </div>
                ))}
                {locked.length === layers.length && (
                    <div className="absolute inset-0 bg-amber-glow/10 mix-blend-overlay animate-pulse pointer-events-none" />
                )}
            </div>
            <div className="mt-8 flex items-center gap-6 bg-black/40 px-6 py-3 rounded-full border border-white/10">
                <div className="flex flex-col items-end">
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Fragments Synced</span>
                    <span className="text-xl font-serif text-white">{locked.length} <span className="text-white/20">/</span> {layers.length}</span>
                </div>
            </div>
        </div>
    );
};

export const ChallengeInterface: React.FC<ChallengeProps> = (props) => {
  const [showHint, setShowHint] = useState(false);
  
  return (
    <div className="w-full space-y-12 flex flex-col items-center">
        <div className="text-center space-y-4 max-w-lg">
            <h3 className="text-3xl font-serif text-white tracking-tight uppercase flex items-center justify-center gap-3">
                <Zap size={24} className={`text-amber-glow ${props.data.type.includes('hard') ? 'animate-pulse' : ''}`} />
                {props.data.title}
            </h3>
            <p className="text-xs font-mono text-white/50 tracking-[0.15em] border-t border-white/10 pt-4">
                {props.data.description}
            </p>
            {props.data.hint && (
                <div className="pt-2">
                    {!showHint ? (
                        <button 
                            onClick={() => setShowHint(true)}
                            className="text-[10px] uppercase tracking-widest text-amber-glow/50 hover:text-amber-glow flex items-center gap-2 mx-auto transition-colors"
                        >
                            <HelpCircle size={12} /> Access Hint Protocol
                        </button>
                    ) : (
                        <div className="bg-amber-glow/5 border border-amber-glow/10 rounded-lg p-3 mx-auto max-w-xs animate-in fade-in slide-in-from-top-2">
                             <div className="flex items-center gap-2 text-amber-glow mb-1 justify-center">
                                <Lightbulb size={12} />
                                <span className="text-[9px] font-bold uppercase tracking-widest">Guidance</span>
                             </div>
                             <p className="text-xs text-white/70 italic leading-relaxed">{props.data.hint}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
        
        {props.data.type === 'tuner' && <TunerChallenge {...props} />}
        {props.data.type === 'slide-puzzle' && <SlidePuzzleChallenge {...props} />}
        {props.data.type === 'circuit' && <CircuitChallenge {...props} />}
        {props.data.type === 'redaction' && <RedactionChallenge {...props} />}
        {props.data.type === 'equalizer' && <EqualizerChallenge {...props} />}
        {props.data.type === 'quiz' && <QuizChallenge {...props} />}
        {(props.data.type === 'compositor' || props.data.type === 'hard-compositor') && <CompositorChallenge {...props} />}
    </div>
  );
};
    