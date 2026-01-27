
// --- VISUALIZERS FOR LANDING PAGE ROWS ---
export const ROW_VISUALIZERS: Record<string, (ctx: CanvasRenderingContext2D, w: number, h: number, time: number) => void> = {
    // 01 VICTOR: REALISTIC DRAGONFLIES (STEERING FLIGHT)
    '01': (ctx, w, h, time) => {
        const count = 13;
        
        const drawDragonfly = (x: number, y: number, scale: number, rot: number, color: string, i: number) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rot); 

            // Hover vib
            const vib = Math.sin(time * 20 + i) * 1;
            ctx.translate(0, vib);

            // TAIL (Left - trailing)
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(-8 * scale, 0);
            ctx.lineTo(-45 * scale, 2 * scale);
            ctx.lineTo(-45 * scale, -2 * scale);
            ctx.fill();
            
            // Segments on tail
            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            for(let j=1; j<8; j++) {
                ctx.fillRect((-10 - j*4)*scale, -2*scale, 2*scale, 4*scale);
            }
            
            // THORAX
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.ellipse(0, 0, 8 * scale, 5 * scale, 0, 0, Math.PI*2);
            ctx.fill();
            
            // HEAD (Right - leading)
            ctx.fillStyle = '#ecfccb';
            ctx.beginPath();
            ctx.arc(8 * scale, 0, 5 * scale, 0, Math.PI*2);
            ctx.fill();
            
            // EYES
            ctx.fillStyle = 'rgba(0,0,0,0.6)';
            ctx.beginPath(); ctx.arc(10*scale, -3*scale, 2*scale, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(10*scale, 3*scale, 2*scale, 0, Math.PI*2); ctx.fill();
            
            // WINGS
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 0.5;
            const flutter = Math.sin(time * 60 + i * 10) * 0.8;
            
            // Top wings (Left/Right relative to body axis) -> Visualized Top/Bottom in 2D
            ctx.beginPath();
            ctx.ellipse(-2 * scale, -12 * scale, 30 * scale, 7 * scale * Math.abs(flutter), -0.2, 0, Math.PI*2);
            ctx.fill(); ctx.stroke();
            
            // Bottom wings
            ctx.beginPath();
            ctx.ellipse(-2 * scale, 12 * scale, 30 * scale, 7 * scale * Math.abs(flutter), 0.2, 0, Math.PI*2);
            ctx.fill(); ctx.stroke();
            
            ctx.restore();
        };

        for(let i=0; i<count; i++) {
            // MOVEMENT
            const speed = 40 + (i % 5) * 15; // px per unit time
            const tOffset = i * 777;
            
            // Position
            const t = time + tOffset;
            
            // x moves linearly right
            const x = (t * speed) % (w + 200) - 100;
            
            // Y is sinusoidal based on Time (steering behavior)
            const yBase = h/2;
            const yAmp = h * 0.35;
            const freq = 0.5 + (i % 3) * 0.2;
            // Mixed sine waves for organic path
            const y = yBase + Math.sin(t * freq) * yAmp + Math.cos(t * freq * 2.1) * (yAmp * 0.4);
            
            // Rotation (Derivative for facing)
            const dy = (Math.cos(t * freq) * freq * yAmp) - (Math.sin(t * freq * 2.1) * freq * 2.1 * (yAmp * 0.4));
            const rot = Math.atan2(dy, speed); // speed is dx/dt (approx constant)
            
            // Color Palette: Green -> Cyan -> Blue
            // Hues: 80 (Lime) to 210 (Blue)
            const hue = 80 + (i * 17) % 130; 
            const color = `hsla(${hue}, 75%, 55%, 1)`;
            
            const scale = 0.4 + (Math.sin(i)*0.5 + 0.5) * 0.3; // 0.4 to 0.7
            
            drawDragonfly(x, y, scale, rot, color, i);
        }
    },
    // 17 THE GLITCH
    '17': (ctx, w, h, time) => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '10px monospace';
        for(let i=0; i<30; i++) {
            const x = Math.random() * w; const y = Math.random() * h;
            if (Math.random() > 0.5) ctx.fillText(Math.random() > 0.5 ? '1' : '0', x, y);
        }
    },
    'default': (ctx, w, h, time) => { ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.fillRect(0,0,w,h); }
};
