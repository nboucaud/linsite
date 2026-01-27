
import React, { useEffect, useRef, useState } from 'react';
import { Star, MapPin, Zap, TrendingUp, Activity, Radar } from 'lucide-react';

export const ReputationRadar: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // AI Mode always active now
    const [aiActive, setAiActive] = useState(true);
    
    // --- CANVAS ENGINE ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let frameId: number;
        let time = 0;
        
        // Configuration
        const MAX_RADIUS = 300;
        const ORBIT_SPEED = 0.02; // Slower, more deliberate sweep
        const BEAM_WIDTH = Math.PI * 0.25;
        const BEAM_RANGE = 280;
        const TARGET_COUNT = 40;

        // State Objects
        interface Target {
            x: number; y: number;
            angle: number; dist: number;
            type: 'good' | 'bad' | 'neutral';
            active: number; // 0 to 1 opacity
            size: number;
        }

        let targets: Target[] = [];

        // Init Targets
        const init = () => {
            targets = [];
            for (let i = 0; i < TARGET_COUNT; i++) {
                const angle = Math.random() * Math.PI * 2;
                const dist = 40 + Math.random() * 200; // Keep within view
                const rand = Math.random();
                const type = rand > 0.8 ? 'bad' : rand > 0.4 ? 'good' : 'neutral';
                
                targets.push({
                    x: Math.cos(angle) * dist,
                    y: Math.sin(angle) * dist,
                    angle,
                    dist,
                    type,
                    active: 0,
                    size: type === 'neutral' ? 1.5 : 3
                });
            }
        };
        init();

        const render = () => {
            time += 1;
            
            // Resize logic
            const rect = canvas.getBoundingClientRect();
            if (canvas.width !== rect.width || canvas.height !== rect.height) {
                canvas.width = rect.width;
                canvas.height = rect.height;
            }
            
            const w = canvas.width;
            const h = canvas.height;
            const cx = w / 2;
            const cy = h / 2;

            // 1. CLEAR & FADE
            ctx.fillStyle = 'rgba(10, 10, 12, 0.15)'; 
            ctx.fillRect(0, 0, w, h);

            // 2. GRID (The Market Floor)
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
            ctx.lineWidth = 1;
            // Radial Grid
            [50, 100, 150, 200, 250].forEach(r => {
                ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
            });
            // Crosshairs
            ctx.beginPath();
            ctx.moveTo(cx, 0); ctx.lineTo(cx, h);
            ctx.moveTo(0, cy); ctx.lineTo(w, cy);
            ctx.stroke();

            // 3. THE BEAM (Lighthouse)
            const rotation = time * ORBIT_SPEED;
            const beamStart = rotation - BEAM_WIDTH / 2;
            const beamEnd = rotation + BEAM_WIDTH / 2;

            ctx.save();
            ctx.translate(cx, cy);
            
            // Beam Gradient (Volumetric Light)
            const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, BEAM_RANGE);
            grad.addColorStop(0, 'rgba(105, 183, 178, 0.6)');
            grad.addColorStop(0.5, 'rgba(105, 183, 178, 0.1)');
            grad.addColorStop(1, 'transparent');

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, BEAM_RANGE, beamStart, beamEnd);
            ctx.fill();

            // Beam Edges (Hard Light)
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(beamStart) * BEAM_RANGE, Math.sin(beamStart) * BEAM_RANGE);
            ctx.stroke();
            
            // 4. BEAM PARTICLES
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            for(let i=0; i<5; i++) {
                const r = Math.random() * BEAM_RANGE;
                const a = beamStart + Math.random() * BEAM_WIDTH;
                const px = Math.cos(a) * r;
                const py = Math.sin(a) * r;
                ctx.fillRect(px, py, 1, 1);
            }

            ctx.restore();

            // 5. TARGETS
            targets.forEach(t => {
                let normTargetAngle = (t.angle % (Math.PI * 2));
                let normBeamAngle = (rotation % (Math.PI * 2));
                if (normTargetAngle < 0) normTargetAngle += Math.PI * 2;
                if (normBeamAngle < 0) normBeamAngle += Math.PI * 2;

                const angleDiff = Math.abs(normTargetAngle - normBeamAngle);
                const isHit = (angleDiff < BEAM_WIDTH / 2 || angleDiff > Math.PI * 2 - BEAM_WIDTH / 2) && t.dist < BEAM_RANGE;

                if (isHit) {
                    t.active = Math.min(1, t.active + 0.2); 
                } else {
                    t.active = Math.max(0, t.active - 0.02); 
                }

                if (t.active > 0.01) {
                    const px = cx + t.x;
                    const py = cy + t.y;
                    
                    ctx.save();
                    ctx.globalAlpha = t.active;
                    
                    if (t.type === 'good') {
                        ctx.fillStyle = '#FBBF24'; // Amber
                        ctx.shadowColor = '#FBBF24'; ctx.shadowBlur = 10;
                        ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI*2); ctx.fill();
                        
                        // Connection line
                        ctx.strokeStyle = 'rgba(251, 191, 36, 0.15)';
                        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke();
                    } 
                    else if (t.type === 'bad') {
                        ctx.fillStyle = '#ef4444';
                        ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 15;
                        ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI*2); ctx.fill();
                        
                        ctx.strokeStyle = '#ef4444';
                        ctx.beginPath(); ctx.arc(px, py, 8 + Math.sin(time*0.5)*4, 0, Math.PI*2); ctx.stroke();
                    } 
                    else {
                        ctx.fillStyle = '#64748b';
                        ctx.beginPath(); ctx.arc(px, py, 1.5, 0, Math.PI*2); ctx.fill();
                    }
                    
                    ctx.restore();
                }
            });

            // 6. THE LIGHTHOUSE
            ctx.fillStyle = '#fff';
            ctx.shadowColor = '#69B7B2';
            ctx.shadowBlur = 20;
            ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI*2); ctx.fill();
            ctx.shadowBlur = 0;

            frameId = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(frameId);
    }, []);

    return (
        <div className="bg-[#0a0a0c] border border-white/10 rounded-3xl p-8 relative overflow-hidden flex flex-col h-full">
            
            {/* AMBIENT GLOW */}
            <div className="absolute top-0 right-0 p-40 blur-[100px] pointer-events-none bg-[#69B7B2]/10" />

            {/* HEADER */}
            <div className="w-full flex justify-between items-start mb-8 z-10">
                <div className="space-y-1">
                    <h3 className="text-xl font-serif text-white">Market Vision</h3>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#69B7B2] animate-pulse" />
                        <p className="text-white/50 text-[10px] uppercase tracking-widest font-bold">
                            AI Monitoring Active
                        </p>
                    </div>
                </div>
                
                <div className="p-2 bg-white/5 rounded-full border border-white/10 text-white/30">
                    <Radar size={16} className="animate-spin-slow" />
                </div>
            </div>

            {/* VISUALIZATION STAGE */}
            <div className="relative flex-1 min-h-[300px] w-full rounded-2xl overflow-hidden border border-white/5 bg-[#050505] shadow-inner mb-8 group cursor-crosshair">
                
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
                
                {/* Overlay Grid UI */}
                <div className="absolute inset-0 pointer-events-none opacity-20" 
                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
                />
                
                {/* Center Reticle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white/10 rounded-full flex items-center justify-center pointer-events-none">
                    <div className="w-full h-full rounded-full border-t border-l border-white/30 animate-spin-slow opacity-100" />
                </div>

                {/* HUD Data */}
                <div className="absolute bottom-4 right-4 text-right font-mono text-[9px] text-[#69B7B2] pointer-events-none">
                    <div>SCAN_MODE: AUTONOMOUS</div>
                    <div>COVERAGE: 100%</div>
                </div>
            </div>

            {/* LIVE STATS GRID */}
            <div className="grid grid-cols-3 gap-4 w-full z-10">
                <div className="bg-[#111] rounded-xl p-4 text-center border border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-amber-glow/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="text-2xl font-bold mb-1 text-white scale-110">
                        4.9
                    </div>
                    <div className="text-[9px] text-white/30 uppercase tracking-wider flex justify-center items-center gap-1.5 font-bold">
                        <Star size={10} className="text-amber-glow fill-amber-glow" /> Rating
                    </div>
                </div>

                <div className="bg-[#111] rounded-xl p-4 text-center border border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[#69B7B2]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="text-2xl font-bold mb-1 text-[#69B7B2] scale-110">
                        #1
                    </div>
                    <div className="text-[9px] text-white/30 uppercase tracking-wider flex justify-center items-center gap-1.5 font-bold">
                        <MapPin size={10} /> Local Rank
                    </div>
                </div>

                <div className="bg-[#111] rounded-xl p-4 text-center border border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="text-2xl font-bold mb-1 text-green-400 scale-110">
                        +42%
                    </div>
                    <div className="text-[9px] text-white/30 uppercase tracking-wider flex justify-center items-center gap-1.5 font-bold">
                        <TrendingUp size={10} /> Inbound
                    </div>
                </div>
            </div>
        </div>
    );
};
