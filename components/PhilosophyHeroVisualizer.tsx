
import React, { useEffect, useRef } from 'react';

export const PhilosophyHeroVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let w = canvas.width;
        let h = canvas.height;
        let frameId: number;
        let time = 0;

        // --- CONFIG ---
        const PARTICLE_COUNT = 550;
        const CAM_Z = 900;
        const PHASE_DURATION = 400; // Duration of each phase in frames
        
        // --- STATE ---
        // Float32Array: [x, y, z, tx, ty, tz, colorVariant]
        const data = new Float32Array(PARTICLE_COUNT * 7);
        
        // Initialize Scatter
        for(let i=0; i<PARTICLE_COUNT; i++) {
            const idx = i * 7;
            data[idx] = (Math.random() - 0.5) * 1200;
            data[idx+1] = (Math.random() - 0.5) * 1200;
            data[idx+2] = (Math.random() - 0.5) * 1200;
            data[idx+6] = Math.random(); // Color variant
        }

        let phase = 0; // 0: RINGS, 1: COLUMNS, 2: SPHERE
        let phaseTimer = 0;

        // --- TARGET GENERATORS ---
        
        const setTargetRings = (i: number) => {
            // Concentric rings (Alignment / Incentives)
            const idx = i * 7;
            const ringCount = 6;
            const ringIdx = i % ringCount;
            const radius = 120 + ringIdx * 50;
            // Distribute particles evenly around the ring
            const particlesPerRing = PARTICLE_COUNT / ringCount;
            const angle = (Math.floor(i / ringCount) / particlesPerRing) * Math.PI * 2;
            
            data[idx+3] = Math.cos(angle) * radius;
            data[idx+4] = Math.sin(angle) * radius * 0.3; // Flattened perspective
            data[idx+5] = Math.sin(angle * 2) * 30; // Gentle wave
        };

        const setTargetColumns = (i: number) => {
            // Vertical pillars (Embedded Engineering / Stability)
            const idx = i * 7;
            const cols = 8;
            const colIdx = i % cols;
            const radius = 220;
            const angle = (colIdx / cols) * Math.PI * 2;
            const height = 500;
            // Distribute vertically
            const yInfo = (Math.floor(i / cols) / (PARTICLE_COUNT/cols));
            const y = (yInfo - 0.5) * height;
            
            data[idx+3] = Math.cos(angle) * radius;
            data[idx+4] = y;
            data[idx+5] = Math.sin(angle) * radius;
        };

        const setTargetSphere = (i: number) => {
            // Fibonacci Sphere (Sovereignty / Network)
            const idx = i * 7;
            const phi = Math.acos(1 - 2 * (i + 0.5) / PARTICLE_COUNT);
            const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
            const r = 240;

            data[idx+3] = Math.cos(theta) * Math.sin(phi) * r;
            data[idx+4] = Math.sin(theta) * Math.sin(phi) * r;
            data[idx+5] = Math.cos(phi) * r;
        };

        const updateTargets = () => {
            for(let i=0; i<PARTICLE_COUNT; i++) {
                if (phase === 0) setTargetRings(i);
                else if (phase === 1) setTargetColumns(i);
                else setTargetSphere(i);
            }
        };
        // Initial setup
        updateTargets();

        // --- RENDER LOOP ---
        const render = () => {
            time += 0.005;
            phaseTimer++;

            // Cycle Phases
            if (phaseTimer > PHASE_DURATION) {
                phaseTimer = 0;
                phase = (phase + 1) % 3;
                updateTargets();
            }

            ctx.fillStyle = '#020202';
            ctx.fillRect(0, 0, w, h);

            const cx = w * 0.5;
            const cy = h * 0.5;

            // Gentle Camera Rotation
            const rotX = Math.sin(time * 0.5) * 0.15;
            const rotY = time * 0.2;
            const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
            const cosY = Math.cos(rotY), sinY = Math.sin(rotY);

            for(let i=0; i<PARTICLE_COUNT; i++) {
                const idx = i * 7;
                
                // LERP (Linear Interpolation) for smooth, non-bouncy movement
                // Speed = 0.03 (slower, deliberate movement)
                const speed = 0.03;
                data[idx] += (data[idx+3] - data[idx]) * speed;
                data[idx+1] += (data[idx+4] - data[idx+1]) * speed;
                data[idx+2] += (data[idx+5] - data[idx+2]) * speed;

                let x = data[idx];
                let y = data[idx+1];
                let z = data[idx+2];

                // 3D Rotation
                let tx = x * cosY - z * sinY;
                let tz = z * cosY + x * sinY;
                x = tx; z = tz;

                let ty = y * cosX - z * sinX;
                let tz2 = z * cosX + y * sinX;
                y = ty; z = tz2;

                // Project
                const scale = CAM_Z / (CAM_Z + z);
                
                if (scale > 0) {
                    const px = cx + x * scale;
                    const py = cy + y * scale;
                    const size = 1.8 * scale;
                    
                    const colVar = data[idx+6];
                    // Sage Green (739472) accents mixed with White
                    ctx.fillStyle = colVar > 0.85 ? '#739472' : '#ffffff';
                    ctx.globalAlpha = Math.min(1, scale * 0.7);
                    
                    ctx.beginPath();
                    ctx.arc(px, py, size, 0, Math.PI*2);
                    ctx.fill();
                }
            }
            ctx.globalAlpha = 1;

            frameId = requestAnimationFrame(render);
        };

        const handleResize = () => {
            if (canvas.parentElement) {
                w = canvas.width = canvas.parentElement.clientWidth;
                h = canvas.height = canvas.parentElement.clientHeight;
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

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-50" />;
};
