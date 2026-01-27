
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, X } from 'lucide-react';

export const Manifesto: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [skipHovered, setSkipHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Check if previously seen
  useEffect(() => {
    const seen = sessionStorage.getItem('walled_garden_exhibition_opened');
    if (seen) setIsVisible(false);
  }, []);

  const phrases = [
    { line1: "Entropy is the", line2: "default state." },
    { line1: "The signal decays", line2: "in open air." },
    { line1: "So we build structures", line2: "to contain the hum." },
    { line1: "Architecture for", line2: "the invisible." },
    { line1: "A Walled Garden", line2: "for the mind." },
    { line1: "Enter the", line2: "Exhibition." }
  ];

  // --- NAVIGATION LOGIC ---
  const handleEnter = useCallback(() => {
    sessionStorage.setItem('walled_garden_exhibition_opened', 'true');
    setIsVisible(false);
  }, []);

  const handleNext = useCallback(() => {
    if (activeSlide < phrases.length - 1) {
      setActiveSlide(prev => prev + 1);
    } else {
      handleEnter();
    }
  }, [activeSlide, phrases.length, handleEnter]);

  const handlePrev = useCallback(() => {
    if (activeSlide > 0) {
      setActiveSlide(prev => prev - 1);
    }
  }, [activeSlide]);

  const handleSkipAll = useCallback(() => {
      handleEnter();
  }, [handleEnter]);

  // --- TIMER ENGINE ---
  useEffect(() => {
    if (!isVisible) return;

    let start = performance.now();
    let frameId: number;
    const DURATION = 4500; // 4.5 seconds per slide

    const loop = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(100, (elapsed / DURATION) * 100);
      setProgress(p);

      if (p < 100) {
        frameId = requestAnimationFrame(loop);
      } else {
        handleNext();
      }
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [activeSlide, isVisible, handleNext]);

  // --- KEYBOARD CONTROLS ---
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input (unlikely here but good practice)
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.code) {
        case 'Space':
        case 'Enter':
        case 'ArrowRight':
          e.preventDefault();
          handleNext();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handlePrev();
          break;
        case 'Escape':
          handleSkipAll();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, handleNext, handlePrev, handleSkipAll]);


  // --- VISUALS ENGINE (CANVAS) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisible) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;
    let time = 0;
    
    // Slide-specific state
    let particles: any[] = [];

    const initSlide = (slideIndex: number, w: number, h: number) => {
        particles = [];
        const cx = w/2;
        const cy = h/2;

        if (slideIndex === 0) { // ENTROPY
            for(let i=0; i<150; i++) {
                particles.push({
                    x: cx, y: cy,
                    vx: (Math.random() - 0.5) * 10,
                    vy: (Math.random() - 0.5) * 10,
                    size: Math.random() * 2,
                    life: Math.random()
                });
            }
        } else if (slideIndex === 2) { // STRUCTURES: Rising Monoliths (Brutalist Architecture)
            const colCount = Math.floor(w / 30); // Width of pillars
            const colWidth = w / colCount;
            for(let i=0; i<colCount; i++) {
                particles.push({
                    x: i * colWidth,
                    width: colWidth - 2, // Slight gap
                    currentHeight: Math.random() * h * 0.1, // Start low
                    targetHeight: Math.random() * h * 0.7 + (h * 0.1), // Varied skyline
                    speed: 0.02 + Math.random() * 0.03, // Independent rise speeds
                    hue: 120 // Sage green base
                });
            }
        } else if (slideIndex === 3) { // INVISIBLE (Flow Field - Simple)
            for(let i=0; i<100; i++) {
                particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    angle: Math.random() * Math.PI * 2,
                    speed: 1 + Math.random() * 2
                });
            }
        } else if (slideIndex === 4) { // GARDEN (Orbital)
            for(let i=0; i<200; i++) {
                particles.push({
                    angle: Math.random() * Math.PI * 2,
                    radius: 100 + Math.random() * 150,
                    speed: 0.01 + Math.random() * 0.02
                });
            }
        } else if (slideIndex === 5) { // ENTER (Neural Flow 2x)
            const count = 800;
            for(let i=0; i<count; i++) {
                const l = i % 16;
                let hueBase = (100 + l * 20) % 360; 
                let noiseScale = 0.002 + (Math.abs(Math.sin(l * 0.5)) * 0.008); 
                // 2x Speed Multiplier applied here
                let speedMult = (0.5 + (l % 4) * 0.4 + Math.random() * 0.5) * 2.5; 
                
                particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: 0,
                    vy: 0,
                    hue: hueBase + Math.random() * 15,
                    noiseScale,
                    speedMult,
                    lineWidth: (l % 4 === 0) ? 2.5 : 1,
                    opacityBase: (l % 4 === 0) ? 0.8 : 0.4
                });
            }
        }
    };

    const handleResize = () => {
        if(canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initSlide(activeSlide, canvas.width, canvas.height);
        }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Init

    const render = () => {
        time += 0.01;
        const w = canvas.width;
        const h = canvas.height;
        const cx = w / 2;
        const cy = h / 2;

        // Fade effect for trails
        // For slide 5 we want a lighter trail like the landing page inverted or just standard dark
        ctx.fillStyle = activeSlide === 5 ? 'rgba(0, 0, 0, 0.15)' : 'rgba(8, 8, 8, 0.15)'; 
        ctx.fillRect(0, 0, w, h);
        
        ctx.globalCompositeOperation = 'screen';

        switch (activeSlide) {
            case 0: // ENTROPY: Chaos / Explosion
                ctx.fillStyle = '#fff';
                particles.forEach((p, i) => {
                    p.x += p.vx;
                    p.y += p.vy;
                    // Bounce
                    if (p.x < 0 || p.x > w) p.vx *= -1;
                    if (p.y < 0 || p.y > h) p.vy *= -1;
                    
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Connect chaos randomly
                    if (i % 5 === 0) {
                        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
                        ctx.beginPath();
                        ctx.moveTo(cx, cy);
                        ctx.lineTo(p.x, p.y);
                        ctx.stroke();
                    }
                });
                break;
            
            case 1: // DECAY: Glitchy Sine Wave
                ctx.strokeStyle = '#80729C'; // Muted Purple
                ctx.lineWidth = 3;
                ctx.beginPath();
                const amplitude = 100;
                const frequency = 0.02;
                
                for(let x=0; x<w; x+=5) {
                    // Base Wave
                    let y = cy + Math.sin(x * frequency + time * 5) * amplitude;
                    
                    // Glitch Logic
                    const noise = Math.random() > 0.9 ? (Math.random() - 0.5) * 100 : 0;
                    const interference = Math.sin(x * 0.1 - time * 20) * 20;
                    
                    if (Math.random() > 0.95) ctx.lineTo(x, y + noise); // Sharp spikes
                    else ctx.lineTo(x, y + interference);
                }
                ctx.stroke();
                
                // Scanlines
                ctx.fillStyle = 'rgba(255,255,255,0.05)';
                ctx.fillRect(0, (time * 200) % h, w, 5);
                break;

            case 2: // STRUCTURES: Rising Monoliths (Brutalist Architecture)
                particles.forEach((p, i) => {
                    // Easing animation towards target height
                    p.currentHeight += (p.targetHeight - p.currentHeight) * p.speed;
                    
                    // Occasionally shift target height to simulate "building" or "breathing"
                    if (Math.abs(p.targetHeight - p.currentHeight) < 5 && Math.random() > 0.99) {
                        p.targetHeight = Math.random() * (h * 0.7) + (h * 0.1);
                    }

                    const y = h - p.currentHeight;
                    
                    // Draw the Structure
                    const grad = ctx.createLinearGradient(p.x, y, p.x, h);
                    grad.addColorStop(0, 'rgba(115, 148, 114, 0.4)'); // Sage top
                    grad.addColorStop(1, 'rgba(115, 148, 114, 0.05)'); // Fade bottom
                    
                    ctx.fillStyle = grad;
                    ctx.fillRect(p.x, y, p.width, p.currentHeight);
                    
                    // Hard cap at the top (The Roof/Limit)
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    ctx.fillRect(p.x, y, p.width, 2);
                });
                break;

            case 3: // INVISIBLE: Flow Field (Smoke)
                ctx.strokeStyle = 'rgba(181, 243, 245, 0.15)'; // Ice Blue
                ctx.lineWidth = 1;
                
                particles.forEach(p => {
                    // Update angle based on Perlin-ish noise (simple sin/cos mix)
                    const angle = (Math.cos(p.x * 0.005 + time) + Math.sin(p.y * 0.005)) * Math.PI * 2;
                    
                    const oldX = p.x;
                    const oldY = p.y;
                    
                    p.x += Math.cos(angle) * p.speed;
                    p.y += Math.sin(angle) * p.speed;
                    
                    if (p.x < 0) p.x = w;
                    if (p.x > w) p.x = 0;
                    if (p.y < 0) p.y = h;
                    if (p.y > h) p.y = 0;
                    
                    ctx.beginPath();
                    ctx.moveTo(oldX, oldY);
                    ctx.lineTo(p.x, p.y);
                    ctx.stroke();
                });
                break;

            case 4: // WALLED GARDEN: Protective Ring
                ctx.translate(cx, cy);
                particles.forEach(p => {
                    p.angle += p.speed;
                    const x = Math.cos(p.angle) * p.radius;
                    const y = Math.sin(p.angle) * p.radius;
                    
                    // Orbit trail
                    ctx.fillStyle = `rgba(251, 191, 36, ${0.5 + Math.sin(time + p.angle)*0.5})`; // Amber
                    ctx.beginPath();
                    ctx.arc(x, y, 1.5, 0, Math.PI*2);
                    ctx.fill();
                });
                
                // Core
                ctx.beginPath();
                ctx.strokeStyle = '#FBBF24';
                ctx.lineWidth = 2;
                ctx.arc(0, 0, 80 + Math.sin(time * 5) * 5, 0, Math.PI*2);
                ctx.stroke();
                ctx.translate(-cx, -cy);
                break;

            case 5: // ENTER: Neural Flow (High Fidelity)
                // Use a different time scale for flow field to match Landing Page feel
                const tFlow = frameId * 0.005 * 2.0; // 2x Speed
                
                particles.forEach(p => {
                    const angle = (Math.cos(p.x * p.noiseScale + tFlow) + Math.sin(p.y * p.noiseScale + tFlow)) * Math.PI;
                    
                    p.vx += Math.cos(angle) * 0.05 * p.speedMult;
                    p.vy += Math.sin(angle) * 0.05 * p.speedMult;
                    
                    // Friction
                    p.vx *= 0.94; 
                    p.vy *= 0.94;
                    
                    p.x += p.vx;
                    p.y += p.vy;
                    
                    if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
                    if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;

                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x - p.vx * 2, p.y - p.vy * 2);
                    
                    ctx.strokeStyle = `hsla(${p.hue}, 70%, 60%, ${p.opacityBase})`;
                    ctx.lineWidth = p.lineWidth;
                    ctx.stroke();
                });
                break;
        }

        ctx.globalCompositeOperation = 'source-over';
        frameId = requestAnimationFrame(render);
    };
    
    render();
    return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(frameId);
    };
  }, [activeSlide, isVisible]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-[400] bg-museum-black flex flex-col items-center justify-center transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      
      {/* 1. LAYER 1: VIDEO (Only on Final Slide) */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${activeSlide === 5 ? 'opacity-50' : 'opacity-0'}`}>
          <video 
            src="https://yfvjva8h23yczien.public.blob.vercel-storage.com/Posters/Videos/Missing_draft_one/Van%20Gogh%20Video.webm"
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover mix-blend-screen"
          />
      </div>

      {/* 2. LAYER 2: CANVAS (PARTICLES) */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-80 mix-blend-screen" />
      
      {/* 3. LAYER 3: VIGNETTE */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 pointer-events-none" />

      {/* Skip All (Escape Hatch) */}
      <button 
        onClick={handleSkipAll}
        className="absolute top-8 right-8 z-30 flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white/30 hover:text-white transition-all text-[10px] uppercase tracking-widest font-bold"
      >
        <span>Skip Intro</span>
        <X size={12} />
      </button>

      {/* Kinetic Typography Container */}
      <div className="relative z-10 max-w-5xl px-8 w-full h-[300px] flex items-center justify-center">
        {phrases.map((phrase, index) => (
          <div 
            key={index}
            className={`absolute w-full text-center transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
              index === activeSlide 
                ? 'opacity-100 blur-0 scale-100 translate-y-0' 
                : index < activeSlide 
                  ? 'opacity-0 blur-xl scale-95 -translate-y-12' // Exit Up
                  : 'opacity-0 blur-xl scale-105 translate-y-12' // Enter from Down
            }`}
          >
            <h1 className="font-serif text-5xl md:text-8xl lg:text-9xl text-museum-paper leading-tight tracking-tight mix-blend-screen">
              <span className="block mb-2 md:mb-6 opacity-60 font-normal text-3xl md:text-5xl font-sans tracking-widest uppercase">{phrase.line1}</span>
              <span className="block text-sage-green font-italic italic">{phrase.line2}</span>
            </h1>
          </div>
        ))}
      </div>

      {/* Bottom Control Bar */}
      <div className="absolute bottom-16 w-full flex justify-between px-8 md:px-16 items-end z-20">
        
        {/* Progress Dots */}
        <div className="flex gap-2">
            {phrases.map((_, i) => (
                <button 
                    key={i} 
                    onClick={() => setActiveSlide(i)}
                    className={`h-1 rounded-full transition-all duration-700 hover:bg-white/40 ${i === activeSlide ? 'w-12 bg-sage-green' : 'w-2 bg-white/10'}`}
                />
            ))}
        </div>

        {/* Primary Action Button with Load Circle */}
        <button 
            onClick={handleNext}
            onMouseEnter={() => setSkipHovered(true)}
            onMouseLeave={() => setSkipHovered(false)}
            className="group flex items-center gap-6"
        >
            <span className="text-[10px] uppercase tracking-[0.3em] font-sans font-bold text-white/50 group-hover:text-white transition-colors">
                {activeSlide === phrases.length - 1 ? 'Enter Garden' : 'Continue'}
            </span>
            
            {/* Circle Loader Container */}
            <div className={`relative w-12 h-12 flex items-center justify-center rounded-full transition-all duration-500 ${skipHovered ? 'scale-110' : 'scale-100'}`}>
                {/* SVG Progress Circle */}
                <svg className="absolute inset-0 w-full h-full rotate-[-90deg]" viewBox="0 0 40 40">
                    {/* Track */}
                    <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                    {/* Indicator */}
                    <circle 
                        cx="20" cy="20" r="18" 
                        fill="none" 
                        stroke={activeSlide === phrases.length - 1 ? '#739472' : '#ffffff'} 
                        strokeWidth="2" 
                        strokeDasharray={113} 
                        strokeDashoffset={113 - (113 * progress) / 100} 
                        strokeLinecap="round"
                        className="transition-all duration-100 ease-linear"
                    />
                </svg>

                {/* Center Icon */}
                <div className={`relative z-10 transition-transform duration-300 ${skipHovered ? 'translate-x-1' : ''}`}>
                    <ArrowRight size={16} className={activeSlide === phrases.length - 1 ? "text-sage-green" : "text-white"} />
                </div>
            </div>
        </button>
      </div>
    </div>
  );
};
