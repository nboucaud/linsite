
import React, { useEffect, useRef, useMemo, useState } from 'react';
import { useAudio } from '../context/AudioContext';
import { TRACKS } from '../lib/data';
import { LightingEffect } from '../types';

export const StageLighting: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isPlaying, currentTrackId, trackAssets } = useAudio();
  
  // --- TRANSITION LOGIC ---
  const [visibleTrackId, setVisibleTrackId] = useState(currentTrackId);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (currentTrackId !== visibleTrackId) {
      // 1. Fade out
      setOpacity(0);
      
      const t = setTimeout(() => {
        // 2. Swap visual source while invisible
        setVisibleTrackId(currentTrackId);
        
        // 3. Fade in
        requestAnimationFrame(() => {
            setOpacity(1);
        });
      }, 600); // Transition duration (must match CSS)

      return () => clearTimeout(t);
    }
  }, [currentTrackId, visibleTrackId]);

  // Use visibleTrackId for all rendering logic instead of currentTrackId
  const currentTrack = useMemo(() => TRACKS.find(t => t.id === visibleTrackId), [visibleTrackId]);

  const activeVideo = useMemo(() => {
    return trackAssets[visibleTrackId || '']?.video;
  }, [visibleTrackId, trackAssets]);

  useEffect(() => {
    if (videoRef.current) {
      // Reload if source changed
      if (videoRef.current.src !== activeVideo && activeVideo) {
          videoRef.current.src = activeVideo;
          videoRef.current.load();
      }

      if (isPlaying) videoRef.current.play().catch(() => {});
      else videoRef.current.pause();
    }
  }, [isPlaying, activeVideo]);

  // --- CANVAS ENGINE ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || activeVideo) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;
    
    // BPM Pulse Calculation
    const bpm = currentTrack?.bpm || 90;
    const beatInterval = 60 / bpm; 
    const effectMode: LightingEffect = currentTrack?.lightingEffect || 'vertical-flow';

    // --- SHARED UTILS ---
    const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

    // --- EFFECTS CLASSES ---

    // 1. Vertical Flow (Blocks)
    class LightBlock {
      x: number; width: number; speed: number; opacity: number; hue: number;
      constructor(w: number) { this.reset(w); }
      reset(w: number) {
        this.x = Math.random() * w;
        this.width = randomRange(20, 150);
        this.speed = randomRange(-0.5, 0.5);
        this.opacity = randomRange(0.02, 0.08);
        this.hue = Math.random() > 0.5 ? randomRange(200, 260) : randomRange(160, 200); 
      }
      update(w: number) {
        this.x += this.speed;
        if (this.x > w) this.x = -this.width;
        if (this.x < -this.width) this.x = w;
      }
      draw(ctx: CanvasRenderingContext2D, h: number) {
        const g = ctx.createLinearGradient(this.x, 0, this.x + this.width, 0);
        g.addColorStop(0, `hsla(${this.hue}, 60%, 50%, 0)`);
        g.addColorStop(0.5, `hsla(${this.hue}, 60%, 50%, ${this.opacity})`);
        g.addColorStop(1, `hsla(${this.hue}, 60%, 50%, 0)`);
        ctx.fillStyle = g;
        ctx.fillRect(this.x, 0, this.width, h);
      }
    }

    // 2. Retro Grid (Synthwave style)
    class GridLine {
      z: number; speed: number;
      constructor() { this.reset(); }
      reset() {
        this.z = randomRange(0, 100);
        this.speed = 0.5;
      }
      update(pulse: number) {
        this.z -= this.speed * (1 + pulse * 2);
        if (this.z <= 0) this.z = 100;
      }
      draw(ctx: CanvasRenderingContext2D, w: number, h: number, pulse: number) {
        const cx = w / 2;
        const cy = h / 2;
        const perspective = 200;
        
        // Draw Horizontal Lines
        const scale = perspective / (this.z + perspective);
        const y = cy + (h/2) * scale * 0.5 + 100; // Floor offset
        
        ctx.strokeStyle = `rgba(167, 139, 250, ${0.1 + (1 - this.z/100) * 0.3})`;
        ctx.lineWidth = 1 + (1-this.z/100) * 2;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    }

    // 3. Constellation Net (Nodes)
    class Node {
      x: number; y: number; vx: number; vy: number;
      constructor(w: number, h: number) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = randomRange(-0.5, 0.5);
        this.vy = randomRange(-0.5, 0.5);
      }
      update(w: number, h: number) {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;
      }
      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Init Arrays
    let blocks: LightBlock[] = [];
    let gridLines: GridLine[] = [];
    let nodes: Node[] = [];
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Re-init based on mode
      if (effectMode === 'vertical-flow') {
        blocks = Array.from({ length: 15 }, () => new LightBlock(canvas.width));
      } else if (effectMode === 'retro-grid') {
        gridLines = Array.from({ length: 20 }, () => new GridLine());
      } else if (effectMode === 'constellation-net') {
        nodes = Array.from({ length: 60 }, () => new Node(canvas.width, canvas.height));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      time += 0.01;
      const now = Date.now() / 1000;
      const beatProgress = (now % beatInterval) / beatInterval;
      const pulse = isPlaying ? Math.pow(1 - beatProgress, 3) : 0; 
      
      // Clear
      ctx.fillStyle = 'rgba(6, 6, 8, 0.3)'; // Slightly darker trails
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalCompositeOperation = 'screen';

      if (effectMode === 'vertical-flow') {
        blocks.forEach(b => {
          b.update(canvas.width);
          b.draw(ctx, canvas.height);
        });

      } else if (effectMode === 'retro-grid') {
        // Draw Vertical Perspective Lines
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        ctx.strokeStyle = `rgba(45, 212, 191, 0.1)`;
        ctx.lineWidth = 1;
        for(let i = -10; i <= 10; i++) {
           ctx.beginPath();
           ctx.moveTo(cx + i * 50, cy); // Horizon
           ctx.lineTo(cx + i * 300, canvas.height);
           ctx.stroke();
        }
        
        // Draw Moving Horizontal Lines
        gridLines.forEach(l => {
          l.update(pulse);
          l.draw(ctx, canvas.width, canvas.height, pulse);
        });
        
        // Horizon Glow
        const g = ctx.createLinearGradient(0, cy, 0, canvas.height);
        g.addColorStop(0, `rgba(167, 139, 250, ${0.2 + pulse * 0.2})`);
        g.addColorStop(0.5, 'transparent');
        ctx.fillStyle = g;
        ctx.fillRect(0, cy, canvas.width, canvas.height/2);

      } else if (effectMode === 'constellation-net') {
        nodes.forEach(n => {
          n.update(canvas.width, canvas.height);
          n.draw(ctx);
        });

        // Draw connections
        ctx.lineWidth = 0.5;
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist < 150) {
              const opacity = (1 - dist / 150) * 0.2 * (1 + pulse);
              ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.stroke();
            }
          }
        }

      } else if (effectMode === 'spotlight-sway') {
         const sway1 = Math.sin(time * 0.5) * 0.5;
         const sway2 = Math.cos(time * 0.3) * 0.5;
         
         const drawBeam = (x: number, angle: number, color: string) => {
            ctx.save();
            ctx.translate(x, -100);
            ctx.rotate(angle);
            const g = ctx.createLinearGradient(-100, 0, 100, canvas.height * 1.5);
            g.addColorStop(0, color);
            g.addColorStop(1, 'transparent');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.moveTo(-50, 0);
            ctx.lineTo(50, 0);
            ctx.lineTo(300, canvas.height * 1.5);
            ctx.lineTo(-300, canvas.height * 1.5);
            ctx.fill();
            ctx.restore();
         };
         
         drawBeam(canvas.width * 0.2, sway1 + 0.2, `rgba(167, 139, 250, ${0.1 + pulse * 0.1})`);
         drawBeam(canvas.width * 0.8, sway2 - 0.2, `rgba(251, 191, 36, ${0.1 + pulse * 0.1})`);
      }

      ctx.globalCompositeOperation = 'source-over';
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, currentTrack, activeVideo, currentTrack?.lightingEffect]);

  // Apply smooth opacity transition to the entire container
  return (
    <div 
        className="fixed inset-0 z-[1] pointer-events-none overflow-hidden transition-opacity duration-700 ease-in-out" 
        style={{ opacity }}
    >
      {activeVideo ? (
        <div className="absolute inset-0 bg-black">
          <video 
            ref={videoRef}
            src={activeVideo}
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover opacity-60 mix-blend-screen transition-opacity duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-80" />
        </div>
      ) : (
        <canvas ref={canvasRef} className="w-full h-full" />
      )}
    </div>
  );
};
