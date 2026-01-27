
import React, { useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';
import { ROW_VISUALIZERS } from '../lib/landing-visualizers';

export const TrackRow = React.forwardRef<HTMLDivElement, { track: any, index: number, onClick: () => void, isCentered: boolean }>(({ track, index, onClick, isCentered }, ref) => {
    const [isHovered, setIsHovered] = useState(false);
    const [binaryTitle, setBinaryTitle] = useState(track.title);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const active = isHovered || isCentered;

    useEffect(() => {
        if (track.id === '17') {
            const interval = setInterval(() => {
                let s = "";
                for(let i=0; i<12; i++) s += Math.random() > 0.5 ? "1" : "0";
                setBinaryTitle(s);
            }, 60);
            return () => clearInterval(interval);
        } else {
            setBinaryTitle(track.title);
        }
    }, [track.id, track.title]);

    useEffect(() => {
        if (!active) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let frameId: number;
        let time = 0;
        const visualizer = ROW_VISUALIZERS[track.id] || ROW_VISUALIZERS['default'];
        const render = () => {
            time += 0.02;
            if (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight) {
                canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
            }
            if (canvas.width > 0 && canvas.height > 0) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                visualizer(ctx, canvas.width, canvas.height, time);
            }
            frameId = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(frameId);
    }, [active, track.id]);

    return (
        <div 
            ref={ref}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative border-b border-white/10 transition-all duration-300 cursor-pointer overflow-hidden min-h-[140px] flex flex-col justify-center"
            style={{ borderColor: active ? track.color : 'rgba(255,255,255,0.1)' }}
        >
            {track.img && (
                <div className="absolute inset-0 z-0">
                    <img 
                        src={track.img} 
                        className={`w-full h-full object-cover transition-all duration-700 ease-out ${active ? 'opacity-30 grayscale-0 scale-105' : 'opacity-0 grayscale scale-100'}`}
                        alt=""
                    />
                    <div className={`absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-100'}`} />
                </div>
            )}
            <div className={`absolute inset-0 z-10 mix-blend-screen transition-opacity duration-300 ${active ? 'opacity-70' : 'opacity-0'}`}>
                {active && <canvas ref={canvasRef} className="w-full h-full opacity-100" />}
            </div>
            
            <div className={`relative z-20 flex flex-col md:flex-row w-full px-6 md:px-10 py-3 gap-6 md:gap-12 items-baseline md:items-center transition-all duration-300 text-white`}>
                <span 
                    className="font-mono text-sm md:text-base font-bold transition-all duration-300"
                    style={{ color: active ? track.color : 'rgba(255,255,255,0.3)', transform: active ? 'scale(1.2)' : 'scale(1)' }}
                >
                    {(index + 1).toString().padStart(2, '0')}
                </span>
                
                <h3 
                    className={`flex-1 font-serif text-4xl md:text-5xl lg:text-6xl tracking-tighter leading-none transition-all duration-300 transform ${track.id === '17' ? 'line-through decoration-white/30 decoration-4' : ''}`}
                    style={{ 
                        transform: active ? 'translateX(24px) scale(1.05)' : 'translateX(0)', 
                        color: active ? '#fff' : (track.id === '17' ? '#666' : '#e5e5e5'),
                        textShadow: active ? `0 0 30px ${track.color}` : 'none',
                        fontFamily: track.id === '17' ? 'monospace' : undefined
                    }}
                >
                    {binaryTitle}
                </h3>
                
                <div className="flex items-center gap-6 md:w-64 justify-end">
                        <span 
                            className="hidden md:inline-block font-mono text-[9px] uppercase tracking-[0.2em] border px-3 py-1 rounded-full transition-all duration-300 whitespace-nowrap"
                            style={{ 
                                borderColor: active ? track.color : 'rgba(255,255,255,0.1)', 
                                color: active ? track.color : 'rgba(255,255,255,0.4)',
                                backgroundColor: active ? 'rgba(0,0,0,0.8)' : 'transparent'
                            }}
                        >
                            {track.role}
                        </span>
                        <div 
                            className="w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300"
                            style={{ 
                                borderColor: active ? track.color : 'rgba(255,255,255,0.1)',
                                backgroundColor: active ? track.color : 'transparent',
                                color: active ? '#000' : 'transparent',
                                transform: active ? 'scale(1.2) rotate(90deg)' : 'scale(1) rotate(0deg)',
                                boxShadow: active ? `0 0 20px ${track.color}` : 'none'
                            }}
                        >
                            <Play size={20} fill="currentColor" />
                        </div>
                </div>
            </div>
            
            <div className={`absolute bottom-4 left-0 right-0 overflow-hidden transition-opacity duration-300 pointer-events-none z-20 ${active ? 'opacity-100' : 'opacity-0'}`}>
                <div className="flex whitespace-nowrap animate-marquee" style={{ color: track.color, opacity: 0.8, textShadow: `0 0 10px ${track.color}` }}>
                    {[...Array(10)].map((_, idx) => (<span key={idx} className="text-[10px] font-mono uppercase tracking-widest mx-4">{track.desc} ///</span>))}
                </div>
            </div>
        </div>
    );
});

TrackRow.displayName = 'TrackRow';
