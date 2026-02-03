
import React, { useEffect, useRef } from 'react';

export const HealthcareHeroVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let time = 0;
        let frameId: number;

        const BASE_PAIRS = 45; 
        const ROTATION_SPEED = 0.013;

        // Pre-calculate helix positions (normalized -1 to 1)
        // We only calculate x/z relations once, then scale/rotate in render
        const helixMap = new Float32Array(BASE_PAIRS * 2); // angle, offset
        for(let i=0; i<BASE_PAIRS; i++) {
            helixMap[i*2] = i * 0.4; // angle offset
            helixMap[i*2+1] = i; // linear offset index
        }

        const render = () => {
            time += 0.9;
            ctx.fillStyle = '#020202';
            ctx.fillRect(0, 0, width, height);

            const cy = height / 2;
            const amplitude = 80;
            // Responsive spacing based on width
            const spacing = width / (BASE_PAIRS - 4);
            const scanX = (time * 3) % (width + 300) - 150;

            // Batch arrays
            ctx.lineWidth = 1;
            
            for (let i = 0; i < BASE_PAIRS; i++) {
                // Calculate X position with wrapping for infinite scroll illusion
                const xBase = (i * spacing + time * 0.5) % (width + spacing * 4) - spacing * 2;
                
                // Skip off-screen
                if (xBase < -50 || xBase > width + 50) continue;

                // Dynamic calculations
                const angle = helixMap[i*2] + time * ROTATION_SPEED;
                
                const sinA = Math.sin(angle);
                const cosA = Math.cos(angle); // Z-depth
                
                const y1 = cy + sinA * amplitude;
                const y2 = cy + Math.sin(angle + Math.PI) * amplitude; // Opposite strand
                
                const z1 = cosA; // 1 to -1
                const z2 = -cosA;

                // Scan Logic
                const distToScan = Math.abs(xBase - scanX);
                const isScanned = distToScan < 80;
                const scanIntensity = isScanned ? (1 - distToScan / 80) : 0;

                // Color
                // Base Teal: rgba(20, 184, 166, ...)
                // Scanned White: rgba(255, 255, 255, ...)
                
                const alphaBase = 0.2 + (z1 + 1) * 0.3; // Depth fog
                
                // --- DRAW CONNECTION ---
                ctx.beginPath();
                ctx.moveTo(xBase, y1);
                ctx.lineTo(xBase, y2);
                if (isScanned) {
                    ctx.strokeStyle = `rgba(255, 255, 255, ${scanIntensity * 0.8})`;
                    ctx.lineWidth = 2;
                } else {
                    ctx.strokeStyle = 'rgba(20, 184, 166, 0.15)';
                    ctx.lineWidth = 1;
                }
                ctx.stroke();

                // --- DRAW NODES ---
                const drawNode = (y: number, z: number) => {
                    const scale = 1 + z * 0.3;
                    const size = 3 * scale;
                    
                    ctx.beginPath();
                    ctx.arc(xBase, y, size, 0, Math.PI * 2);
                    
                    if (isScanned) {
                        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(alphaBase, scanIntensity)})`;
                    } else {
                        ctx.fillStyle = `rgba(45, 212, 191, ${alphaBase})`;
                    }
                    ctx.fill();
                };

                drawNode(y1, z1);
                drawNode(y2, z2);
            }

            frameId = requestAnimationFrame(render);
        };

        const handleResize = () => {
            if (canvas.parentElement) {
                const rect = canvas.parentElement.getBoundingClientRect();
                const dpr = window.devicePixelRatio || 1;
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;
                ctx.scale(dpr, dpr);
                width = rect.width;
                height = rect.height;
            }
        };
        
        window.addEventListener('resize', handleResize);
        handleResize();
        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(frameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{width: '100%', height: '100%'}} />;
};
