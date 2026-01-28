
import React, { useEffect, useRef } from 'react';

const HeroVisualizerComponent: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        // OPTIMIZATION: alpha: false hints the browser that we don't need transparency 
        // against the webpage background, speeding up compositing.
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let width = canvas.width;
        let height = canvas.height;
        let frameId: number;

        // --- 3D ENGINE SETTINGS ---
        const FL = 800;
        let cx = width / 2;
        let cy = height / 2;
        let mouseX = 0;
        let mouseY = 0;
        let targetRotX = 0;
        let targetRotY = 0;

        // --- ANIMATION STATE ---
        let phase = 0; 
        let phaseTimer = 0;
        let globalTime = 0;
        let loopSeed = 0; 
        let meshOpacity = 0; 
        
        // --- PERFORMANCE CONTROL ---
        let lastTime = 0;
        const TARGET_FPS = 60;
        const FRAME_INTERVAL = 1000 / TARGET_FPS;

        // --- GEOMETRY ---
        const SHEET_SIZE = 150; 
        
        // Base structures (Static allocations moved out of render loop concepts)
        const flatVerts = [
            { x: -SHEET_SIZE, y: -SHEET_SIZE * 1.4, z: 0 }, { x: 0, y: -SHEET_SIZE * 1.4, z: 0 }, { x: SHEET_SIZE, y: -SHEET_SIZE * 1.4, z: 0 },
            { x: -SHEET_SIZE, y: 0, z: 0 },                 { x: 0, y: 0, z: 0 },                 { x: SHEET_SIZE, y: 0, z: 0 },
            { x: -SHEET_SIZE, y: SHEET_SIZE * 1.4, z: 0 },  { x: 0, y: SHEET_SIZE * 1.4, z: 0 },  { x: SHEET_SIZE, y: SHEET_SIZE * 1.4, z: 0 }
        ];

        const planeVerts = [
            { x: 0, y: -SHEET_SIZE * 1.8, z: -20 },   { x: 0, y: -SHEET_SIZE * 1.8, z: -20 },   { x: 0, y: -SHEET_SIZE * 1.8, z: -20 },
            { x: -SHEET_SIZE * 1.2, y: SHEET_SIZE, z: 20 }, { x: 0, y: -SHEET_SIZE * 0.5, z: -50 }, { x: SHEET_SIZE * 1.2, y: SHEET_SIZE, z: 20 },
            { x: -20, y: SHEET_SIZE * 1.4, z: 0 },     { x: 0, y: SHEET_SIZE * 1.4, z: 0 },      { x: 20, y: SHEET_SIZE * 1.4, z: 0 }
        ];

        // Mutable working buffers
        const currentVerts = flatVerts.map(v => ({...v}));
        const worldVertsBuffer = flatVerts.map(() => ({ x: 0, y: 0, z: 0, px: 0, py: 0, scale: 0 }));
        
        let planePos = { x: 0, y: 0, z: 0 };
        let planeVel = { x: 0, y: 0, z: 0 };
        let planeRot = { x: 0, y: 0, z: 0 };

        // --- PARTICLES ---
        interface Particle {
            x: number; y: number; z: number;
            vx: number; vy: number; vz: number;
            life: number;
            color: string;
            type: 'data' | 'trail' | 'ember';
            active: boolean;
        }
        
        const MAX_PARTICLES = 100;
        const particles: Particle[] = [];
        // Init pool
        for(let i=0; i<MAX_PARTICLES; i++) {
            particles.push({ x:0, y:0, z:0, vx:0, vy:0, vz:0, life:0, color:'#fff', type:'ember', active: false });
        }

        // --- HELPERS ---
        const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

        const spawnParticle = (type: 'data' | 'trail' | 'ember', ox: number, oy: number, oz: number, spread: number) => {
            // Find inactive particle
            const p = particles.find(p => !p.active);
            if (!p) return;

            p.active = true;
            p.x = ox + (Math.random()-0.5) * spread;
            p.y = oy + (Math.random()-0.5) * spread;
            p.z = oz + (Math.random()-0.5) * spread;
            p.vx = (Math.random()-0.5) * (type === 'ember' ? 5 : 2);
            p.vy = (Math.random()-0.5) * (type === 'ember' ? 5 : 2);
            p.vz = type === 'trail' ? 10 : (Math.random()-0.5) * 5;
            p.life = 1.0;
            p.color = type === 'data' ? '#69B7B2' : type === 'ember' ? '#f59e0b' : '#ffffff';
            p.type = type;
        };

        // --- MAIN LOOP ---
        const render = (timestamp: number) => {
            frameId = requestAnimationFrame(render);

            // OPTIMIZATION: Cap Frame Rate
            const deltaTime = timestamp - lastTime;
            if (deltaTime < FRAME_INTERVAL) return;
            
            // Adjust for catch-up, but cap to prevent spiral
            lastTime = timestamp - (deltaTime % FRAME_INTERVAL);

            globalTime += 0.016;
            
            // Fast Clear
            ctx.fillStyle = 'rgba(2, 2, 2, 0.3)';
            ctx.fillRect(0, 0, width, height);

            targetRotY += (mouseX * 0.5 - targetRotY) * 0.05;
            targetRotX += (mouseY * 0.5 - targetRotX) * 0.05;

            // Pre-calc rotation matrices
            const cosY = Math.cos(targetRotX);
            const sinY = Math.sin(targetRotX);
            const cosX = Math.cos(targetRotY); 
            const sinX = Math.sin(targetRotY);

            // --- PHASE LOGIC ---
            if (phase === 0) { // COALESCE
                phaseTimer += 0.006;
                meshOpacity = Math.min(1, phaseTimer);
                const t = Math.min(1, phaseTimer / 2.0);
                const ease = 1 - Math.pow(1 - t, 4); 
                
                for(let i=0; i<9; i++) {
                    const float = Math.sin(globalTime * 2 + i) * 20 * (1-ease);
                    const noiseX = Math.sin(i * 12.3 + loopSeed) * 1200 + float;
                    const noiseY = Math.cos(i * 45.6 + loopSeed) * 800 + float;
                    const noiseZ = Math.sin(i * 78.9 + loopSeed) * 1000 - 500;
                    
                    currentVerts[i].x = lerp(noiseX, flatVerts[i].x, ease);
                    currentVerts[i].y = lerp(noiseY, flatVerts[i].y, ease);
                    currentVerts[i].z = lerp(noiseZ, flatVerts[i].z, ease);
                }

                if (Math.random() > 0.85 && phaseTimer < 1.5) spawnParticle('data', 0, 0, 0, 800);
                if (phaseTimer > 2.5) { phase = 1; phaseTimer = 0; meshOpacity = 1; }
            }
            else if (phase === 1) { // FOLD
                phaseTimer += 0.012;
                const t = Math.min(1, phaseTimer);
                const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

                for(let i=0; i<9; i++) {
                    currentVerts[i].x = lerp(flatVerts[i].x, planeVerts[i].x, ease);
                    currentVerts[i].y = lerp(flatVerts[i].y, planeVerts[i].y, ease);
                    currentVerts[i].z = lerp(flatVerts[i].z, planeVerts[i].z, ease);
                }
                
                if (t > 0.8) {
                    cx = width/2 + (Math.random()-0.5)*5;
                    cy = height/2 + (Math.random()-0.5)*5;
                } else {
                    cx = width/2; cy = height/2;
                }

                if (phaseTimer > 1.2) { 
                    phase = 2; phaseTimer = 0;
                    const angle = (Math.random() - 0.5) * 2.5;
                    const lift = (Math.random() - 0.5) * 1.0;
                    planeVel = { x: Math.sin(angle) * 8, y: Math.sin(lift) * 6, z: 18 };
                }
            }
            else if (phase === 2) { // FLIGHT
                phaseTimer += 0.016;
                planeVel.z += 0.85;
                planePos.x += planeVel.x;
                planePos.y += planeVel.y;
                planePos.z += planeVel.z;

                const targetBank = planeVel.x * 0.03;
                planeRot.z += (targetBank - planeRot.z) * 0.1;
                const targetPitch = planeVel.y * 0.03;
                planeRot.x += (targetPitch - planeRot.x) * 0.1;
                planeRot.y += planeVel.x * 0.002;

                if (planePos.z > 2000) meshOpacity = Math.max(0, 1 - ((planePos.z - 2000) / 1500));

                if(Math.random() > 0.5) spawnParticle('ember', planePos.x, planePos.y, planePos.z, 10);
                if(Math.random() > 0.8) spawnParticle('trail', planePos.x, planePos.y, planePos.z, 20);

                if (planePos.z > 3500) { phase = 3; phaseTimer = 0; }
            }
            else if (phase === 3) { // RESET
                planePos = { x: 0, y: 0, z: 0 };
                planeVel = { x: 0, y: 0, z: 0 };
                planeRot = { x: 0, y: 0, z: 0 };
                loopSeed += 13.7;
                meshOpacity = 0;
                phase = 0;
            }

            // --- TRANSFORM & PROJECT ---
            for(let i=0; i<9; i++) {
                const v = currentVerts[i];
                let x = v.x + planePos.x;
                let y = v.y + planePos.y;
                let z = v.z + planePos.z;

                if (phase === 2) {
                    // Local Rotation (Inline for speed)
                    // Y-rot
                    let tx = x * Math.cos(planeRot.y) - z * Math.sin(planeRot.y);
                    let tz = z * Math.cos(planeRot.y) + x * Math.sin(planeRot.y);
                    x = tx; z = tz;
                    // X-rot (Skipping Z rot calc for visual approximation speedup)
                    let ty = y * Math.cos(planeRot.x) - z * Math.sin(planeRot.x);
                    let tz2 = z * Math.cos(planeRot.x) + y * Math.sin(planeRot.x);
                    y = ty; z = tz2;
                }

                // Global Rotation
                let y1 = y * cosY - z * sinY;
                let z1 = z * cosY + y * sinY;
                let x1 = x * cosX - z1 * sinX;
                let z2 = z1 * cosX + x * sinX;

                const scale = FL / (FL + z2);
                worldVertsBuffer[i].x = x1;
                worldVertsBuffer[i].y = y1;
                worldVertsBuffer[i].z = z2;
                worldVertsBuffer[i].px = cx + x1 * scale;
                worldVertsBuffer[i].py = cy + y1 * scale;
                worldVertsBuffer[i].scale = scale;
            }

            // --- DRAW MESH ---
            if (meshOpacity > 0.01) {
                const accentFill = phase === 2 ? `rgba(105,183,178,0.2)` : 'rgba(255,255,255,0.1)';
                
                ctx.lineWidth = 1;
                ctx.strokeStyle = `rgba(255,255,255,${0.1 * meshOpacity})`;

                // Helper to draw tri
                const dt = (i1: number, i2: number, i3: number, fill: string) => {
                    const p1 = worldVertsBuffer[i1];
                    const p2 = worldVertsBuffer[i2];
                    const p3 = worldVertsBuffer[i3];
                    if (p1.z < -FL+10 || p2.z < -FL+10 || p3.z < -FL+10) return;
                    
                    ctx.fillStyle = fill;
                    ctx.beginPath();
                    ctx.moveTo(p1.px, p1.py);
                    ctx.lineTo(p2.px, p2.py);
                    ctx.lineTo(p3.px, p3.py);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                };

                ctx.globalAlpha = meshOpacity;
                dt(0, 1, 3, `rgba(255,255,255,0.05)`);
                dt(1, 4, 3, accentFill);
                dt(1, 2, 5, `rgba(255,255,255,0.05)`);
                dt(1, 4, 5, accentFill);
                dt(3, 4, 6, `rgba(255,255,255,0.05)`);
                dt(4, 5, 8, `rgba(255,255,255,0.05)`);
                dt(4, 7, 6, accentFill);
                dt(4, 7, 8, accentFill);
                
                const p1 = worldVertsBuffer[1]; const p4 = worldVertsBuffer[4]; const p7 = worldVertsBuffer[7];
                if(p1.z > -FL) {
                    ctx.strokeStyle = phase === 1 ? '#f59e0b' : '#69B7B2';
                    ctx.lineWidth = 2;
                    ctx.beginPath(); ctx.moveTo(p1.px, p1.py); ctx.lineTo(p4.px, p4.py); ctx.lineTo(p7.px, p7.py); ctx.stroke();
                }
                ctx.globalAlpha = 1;
            }

            // --- DRAW PARTICLES ---
            for(let i=0; i<MAX_PARTICLES; i++) {
                const p = particles[i];
                if (!p.active) continue;

                p.x += p.vx; p.y += p.vy; p.z += p.vz;
                p.life -= 0.02;

                if (p.life <= 0 || p.z > 2000) {
                    p.active = false;
                    continue;
                }

                // Rotate Particle
                let y1 = p.y * cosY - p.z * sinY;
                let z1 = p.z * cosY + p.y * sinY;
                let x1 = p.x * cosX - z1 * sinX;
                let z2 = z1 * cosX + p.x * sinX;

                const scale = FL / (FL + z2);
                if (scale > 0) {
                    const px = cx + x1 * scale;
                    const py = cy + y1 * scale;
                    
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = p.life * (phase === 2 ? meshOpacity : 1);
                    
                    if (p.type === 'data') {
                        ctx.fillText(Math.random() > 0.5 ? "1" : "0", px, py);
                    } else {
                        // OPTIMIZATION: Use rect instead of arc for particles
                        const size = (p.type === 'trail' ? 3 : 6) * scale;
                        ctx.fillRect(px - size/2, py - size/2, size, size);
                    }
                }
            }
            ctx.globalAlpha = 1;
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouseY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        };

        const handleResize = () => {
            if (canvas.parentElement) {
                // OPTIMIZATION: Cap internal resolution at 1:1 CSS pixels
                // Prevents performance nosedive on 4k/Retina screens
                const rect = canvas.parentElement.getBoundingClientRect();
                canvas.width = rect.width;
                canvas.height = rect.height;
                
                width = canvas.width;
                height = canvas.height;
                cx = width / 2;
                cy = height / 2;
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);
        handleResize();
        frameId = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(frameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

// Optimization: Prevent re-renders from parent state changes
export const HeroVisualizer = React.memo(HeroVisualizerComponent);
