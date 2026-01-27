
import React, { useEffect, useRef } from 'react';

interface NeuralBackgroundProps {
    inverted?: boolean;
    colorHex?: string;
    speedModifier?: number;
    densityModifier?: number;
}

export const NeuralBackground: React.FC<NeuralBackgroundProps> = ({ 
    inverted = false, 
    colorHex, 
    speedModifier = 1,
    densityModifier = 1
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const hexToHue = (hex: string): number => {
      hex = hex.replace(/^#/, '');
      let bigint = parseInt(hex, 16);
      let r = (bigint >> 16) & 255;
      let g = (bigint >> 8) & 255;
      let b = bigint & 255;
      r /= 255; g /= 255; b /= 255;
      let max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h = 0;
      if (max !== min) {
          let d = max - min;
          switch (max) {
              case r: h = (g - b) / d + (g < b ? 6 : 0); break;
              case g: h = (b - r) / d + 2; break;
              case b: h = (r - g) / d + 4; break;
          }
          h /= 6;
      }
      return h * 360;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    let frame = 0;
    
    let w = canvas.width;
    let h = canvas.height;

    const fixedHue = colorHex ? hexToHue(colorHex) : null;

    const initParticles = () => {
        particles = [];
        frame = 0;
        w = canvas.width;
        h = canvas.height;

        // Increased base density slightly for fuller look
        const layers = 16;
        const baseParticles = 120 * densityModifier; 
        
        for (let l = 0; l < layers; l++) {
            for (let i = 0; i < baseParticles; i++) {
                let hueBase = fixedHue !== null 
                    ? fixedHue + (Math.random() * 40 - 20)
                    : (100 + l * 20) % 360; 
                
                let noiseScale = 0.002 + (Math.abs(Math.sin(l * 0.5)) * 0.008); 
                let speedMult = (0.5 + (l % 4) * 0.4 + Math.random() * 0.5) * speedModifier;
                let lineWidth = (l % 4 === 0) ? 2.5 : 1;
                let opacityBase = (l % 4 === 0) ? 0.8 : 0.4;

                particles.push({
                    x: Math.random() * w, // Ensure random distribution across full width
                    y: Math.random() * h,
                    vx: 0,
                    vy: 0,
                    hue: hueBase,
                    noiseScale: noiseScale,
                    speedMult: speedMult,
                    lineWidth: lineWidth,
                    opacityBase: opacityBase,
                    layer: l
                });
            }
        }
    };

    const render = () => {
        frame++;
        
        // Slightly darker trail for cleaner look
        if (inverted) {
            ctx.fillStyle = 'rgba(224, 224, 224, 0.2)'; 
        } else {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'; 
        }
        ctx.fillRect(0, 0, w, h);

        const time = frame * 0.005;
        
        particles.forEach(p => {
            const angle = (Math.cos(p.x * p.noiseScale + time) + Math.sin(p.y * p.noiseScale + time)) * Math.PI;
            
            p.vx += Math.cos(angle) * 0.05 * p.speedMult;
            p.vy += Math.sin(angle) * 0.05 * p.speedMult;
            
            p.vx *= 0.94; 
            p.vy *= 0.94;
            
            p.x += p.vx;
            p.y += p.vy;
            
            // Wrap around logic
            if (p.x < 0) p.x = w;
            if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h;
            if (p.y > h) p.y = 0;
            
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - p.vx * 2, p.y - p.vy * 2);
            
            const lightness = inverted ? '35%' : '60%';
            ctx.strokeStyle = `hsla(${p.hue}, 80%, ${lightness}, ${p.opacityBase})`;
            
            ctx.lineWidth = p.lineWidth;
            ctx.stroke();
        });

        animationFrameId = requestAnimationFrame(render);
    };

    const resize = () => {
        if (canvas.parentElement) {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
            initParticles();
        }
    };

    window.addEventListener('resize', resize);
    resize();
    render();

    return () => {
        window.removeEventListener('resize', resize);
        cancelAnimationFrame(animationFrameId);
    };
  }, [inverted, colorHex, speedModifier, densityModifier]);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
};
