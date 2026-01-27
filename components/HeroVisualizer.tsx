
import React, { useEffect, useRef } from 'react';

export const HeroVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
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
        let phase = 0; // 0: Coalesce, 1: Fold, 2: Flight, 3: Reset
        let phaseTimer = 0;
        let globalTime = 0;
        let loopSeed = 0; // To vary the starting positions each loop
        let meshOpacity = 0; // Control visibility

        // --- GEOMETRY ---
        interface Point3D { x: number; y: number; z: number; }
        const SHEET_SIZE = 150; 
        
        const flatVerts: Point3D[] = [
            { x: -SHEET_SIZE, y: -SHEET_SIZE * 1.4, z: 0 }, { x: 0, y: -SHEET_SIZE * 1.4, z: 0 }, { x: SHEET_SIZE, y: -SHEET_SIZE * 1.4, z: 0 },
            { x: -SHEET_SIZE, y: 0, z: 0 },                 { x: 0, y: 0, z: 0 },                 { x: SHEET_SIZE, y: 0, z: 0 },
            { x: -SHEET_SIZE, y: SHEET_SIZE * 1.4, z: 0 },  { x: 0, y: SHEET_SIZE * 1.4, z: 0 },  { x: SHEET_SIZE, y: SHEET_SIZE * 1.4, z: 0 }
        ];

        const planeVerts: Point3D[] = [
            { x: 0, y: -SHEET_SIZE * 1.8, z: -20 },   { x: 0, y: -SHEET_SIZE * 1.8, z: -20 },   { x: 0, y: -SHEET_SIZE * 1.8, z: -20 },
            { x: -SHEET_SIZE * 1.2, y: SHEET_SIZE, z: 20 }, { x: 0, y: -SHEET_SIZE * 0.5, z: -50 }, { x: SHEET_SIZE * 1.2, y: SHEET_SIZE, z: 20 },
            { x: -20, y: SHEET_SIZE * 1.4, z: 0 },     { x: 0, y: SHEET_SIZE * 1.4, z: 0 },      { x: 20, y: SHEET_SIZE * 1.4, z: 0 }
        ];

        let currentVerts: Point3D[] = JSON.parse(JSON.stringify(flatVerts));
        
        let planePos = { x: 0, y: 0, z: 0 };
        let planeVel = { x: 0, y: 0, z: 0 };
        let planeRot = { x: 0, y: 0, z: 0 };

        // --- PARTICLES ---
        interface Particle {
            x: number; y: number; z: number;
            vx: number; vy: number; vz: number;
            life: number;
            maxLife: number;
            color: string;
            type: 'data' | 'trail' | 'ember';
        }
        let particles: Particle[] = [];

        // --- HELPERS ---
        const project = (p: Point3D) => {
            const scale = FL / (FL + p.z);
            return {
                x: cx + p.x * scale,
                y: cy + p.y * scale,
                scale: scale,
                z: p.z
            };
        };

        const rotate = (p: Point3D, rx: number, ry: number, rz: number) => {
            let x = p.x, y = p.y, z = p.z;
            let y1 = y * Math.cos(rx) - z * Math.sin(rx);
            let z1 = z * Math.cos(rx) + y * Math.sin(rx);
            y = y1; z = z1;
            let x1 = x * Math.cos(ry) - z * Math.sin(ry);
            let z2 = z * Math.cos(ry) + x * Math.sin(ry);
            x = x1; z = z2;
            let x2 = x * Math.cos(rz) - y * Math.sin(rz);
            let y2 = y * Math.cos(rz) + x * Math.sin(rz);
            x = x2; y = y2;
            return { x, y, z };
        };

        const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

        const spawnParticles = (count: number, type: 'data' | 'trail' | 'ember', origin: Point3D, spread: number) => {
            for(let i=0; i<count; i++) {
                particles.push({
                    x: origin.x + (Math.random()-0.5) * spread,
                    y: origin.y + (Math.random()-0.5) * spread,
                    z: origin.z + (Math.random()-0.5) * spread,
                    vx: (Math.random()-0.5) * (type === 'ember' ? 5 : 2),
                    vy: (Math.random()-0.5) * (type === 'ember' ? 5 : 2),
                    vz: type === 'trail' ? 10 : (Math.random()-0.5) * 5,
                    life: 1.0,
                    maxLife: 1.0,
                    color: type === 'data' ? '#69B7B2' : type === 'ember' ? '#f59e0b' : '#ffffff',
                    type
                });
            }
        };

        const drawTri = (v1: Point3D, v2: Point3D, v3: Point3D, color: string, stroke: boolean = true) => {
            const p1 = project(v1);
            const p2 = project(v2);
            const p3 = project(v3);

            if (p1.z < -FL + 10 || p2.z < -FL + 10 || p3.z < -FL + 10) return;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.closePath();
            
            // Apply global opacity
            ctx.globalAlpha = meshOpacity;
            ctx.fillStyle = color;
            ctx.fill();
            if (stroke) {
                ctx.strokeStyle = `rgba(255,255,255,${0.1 * meshOpacity})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
        };

        // --- MAIN LOOP ---
        const render = () => {
            globalTime += 0.016;
            ctx.fillStyle = 'rgba(2, 2, 2, 0.3)'; // Trail
            ctx.fillRect(0, 0, width, height);

            targetRotY += (mouseX * 0.5 - targetRotY) * 0.05;
            targetRotX += (mouseY * 0.5 - targetRotX) * 0.05;

            // --- PHASE LOGIC ---
            
            // PHASE 0: COALESCE (Smoother entry)
            if (phase === 0) {
                phaseTimer += 0.006; // SLOWED DOWN (was 0.01)
                
                // Fade in over first 1 second
                meshOpacity = Math.min(1, phaseTimer);

                // Wait a bit before fully snapping (2.5s duration)
                const t = Math.min(1, phaseTimer / 2.0);
                const ease = 1 - Math.pow(1 - t, 4); // Quartic ease out
                
                for(let i=0; i<9; i++) {
                    // Unique noise per vertex + seed for loop variation
                    // Floating effect before snap
                    const float = Math.sin(globalTime * 2 + i) * 20 * (1-ease);
                    
                    const noiseX = Math.sin(i * 12.3 + loopSeed) * 1200 + float;
                    const noiseY = Math.cos(i * 45.6 + loopSeed) * 800 + float;
                    const noiseZ = Math.sin(i * 78.9 + loopSeed) * 1000 - 500;
                    
                    currentVerts[i].x = lerp(noiseX, flatVerts[i].x, ease);
                    currentVerts[i].y = lerp(noiseY, flatVerts[i].y, ease);
                    currentVerts[i].z = lerp(noiseZ, flatVerts[i].z, ease);
                }

                if (Math.random() > 0.8 && phaseTimer < 1.5) {
                    spawnParticles(1, 'data', { x: 0, y: 0, z: 0 }, 800);
                }

                if (phaseTimer > 2.5) { phase = 1; phaseTimer = 0; meshOpacity = 1; }
            }

            // PHASE 1: FOLD (Snap)
            else if (phase === 1) {
                phaseTimer += 0.012; // SLOWED DOWN (was 0.02)
                const t = Math.min(1, phaseTimer);
                const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

                for(let i=0; i<9; i++) {
                    currentVerts[i].x = lerp(flatVerts[i].x, planeVerts[i].x, ease);
                    currentVerts[i].y = lerp(flatVerts[i].y, planeVerts[i].y, ease);
                    currentVerts[i].z = lerp(flatVerts[i].z, planeVerts[i].z, ease);
                }
                
                // Impact shake
                if (t > 0.8) {
                    cx = width/2 + (Math.random()-0.5)*5;
                    cy = height/2 + (Math.random()-0.5)*5;
                } else {
                    cx = width/2; cy = height/2;
                }

                if (phaseTimer > 1.2) { 
                    phase = 2; phaseTimer = 0;
                    // CALCULATE RANDOM FLY-OFF VECTOR
                    const angle = (Math.random() - 0.5) * 2.5; // Wide horizontal spread (+/- 70 deg roughly)
                    const lift = (Math.random() - 0.5) * 1.0; // Moderate vertical spread
                    
                    // SLOWED LAUNCH VELOCITY
                    planeVel = { 
                        x: Math.sin(angle) * 8, // was 12
                        y: Math.sin(lift) * 6,  // was 10
                        z: 18 // was 25
                    };
                }
            }

            // PHASE 2: FLIGHT (Fly & Fade)
            else if (phase === 2) {
                phaseTimer += 0.016;
                
                // Acceleration
                planeVel.z += 0.85; // SLOWED ACCELERATION (was 1.8)
                
                // Apply Velocity
                planePos.x += planeVel.x;
                planePos.y += planeVel.y;
                planePos.z += planeVel.z;

                // Banking & Pitching Logic
                // Bank (Z-Roll) based on horizontal velocity (lean into turn)
                // If moving right (+X), bank right (+Z)
                const targetBank = planeVel.x * 0.03;
                planeRot.z += (targetBank - planeRot.z) * 0.1;

                // Pitch (X-Roll) based on vertical velocity
                // If moving up (-Y), pitch up (-X)
                const targetPitch = planeVel.y * 0.03;
                planeRot.x += (targetPitch - planeRot.x) * 0.1;

                // Slight drift spin
                planeRot.y += planeVel.x * 0.002;

                // FADE OUT LOGIC (End of loop)
                if (planePos.z > 2000) {
                    const fade = 1 - ((planePos.z - 2000) / 1500); // Fade over 1500 units
                    meshOpacity = Math.max(0, fade);
                }

                spawnParticles(5, 'ember', planePos, 10);
                spawnParticles(2, 'trail', planePos, 20);

                if (planePos.z > 3500) {
                    phase = 3; phaseTimer = 0;
                }
            }

            // PHASE 3: SILENT RESET
            else if (phase === 3) {
                planePos = { x: 0, y: 0, z: 0 };
                planeVel = { x: 0, y: 0, z: 0 };
                planeRot = { x: 0, y: 0, z: 0 };
                loopSeed += 13.7; // Change randomness
                meshOpacity = 0; // Invisible start
                phase = 0;
            }

            // --- RENDER GEOMETRY ---
            const worldVerts = currentVerts.map(v => {
                let x = v.x + planePos.x;
                let y = v.y + planePos.y;
                let z = v.z + planePos.z;

                if (phase === 2) {
                    // Apply flight rotation relative to plane center
                    const r = rotate({x: v.x, y: v.y, z: v.z}, planeRot.x, planeRot.y, planeRot.z);
                    x = r.x + planePos.x; y = r.y + planePos.y; z = r.z + planePos.z;
                }
                
                // Global mouse rotation
                return rotate({x, y, z}, targetRotX, targetRotY, 0);
            });

            const color = phase === 2 ? '#69B7B2' : '#e5e5e5';
            const accentRGB = '105,183,178';
            
            // Draw logic (same topology)
            drawTri(worldVerts[0], worldVerts[1], worldVerts[3], `rgba(255,255,255,0.05)`);
            drawTri(worldVerts[1], worldVerts[4], worldVerts[3], color === '#69B7B2' ? `rgba(${accentRGB},0.2)` : 'rgba(255,255,255,0.1)');
            drawTri(worldVerts[1], worldVerts[2], worldVerts[5], `rgba(255,255,255,0.05)`);
            drawTri(worldVerts[1], worldVerts[4], worldVerts[5], color === '#69B7B2' ? `rgba(${accentRGB},0.2)` : 'rgba(255,255,255,0.1)');
            drawTri(worldVerts[3], worldVerts[4], worldVerts[6], `rgba(255,255,255,0.05)`);
            drawTri(worldVerts[4], worldVerts[5], worldVerts[8], `rgba(255,255,255,0.05)`);
            drawTri(worldVerts[4], worldVerts[7], worldVerts[6], color === '#69B7B2' ? `rgba(${accentRGB},0.4)` : 'rgba(255,255,255,0.15)'); 
            drawTri(worldVerts[4], worldVerts[7], worldVerts[8], color === '#69B7B2' ? `rgba(${accentRGB},0.4)` : 'rgba(255,255,255,0.15)');

            const p1 = project(worldVerts[1]); const p4 = project(worldVerts[4]); const p7 = project(worldVerts[7]);
            if (p1.z > -FL && meshOpacity > 0.01) {
                ctx.globalAlpha = meshOpacity;
                ctx.strokeStyle = phase === 1 ? '#f59e0b' : color;
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p4.x, p4.y); ctx.lineTo(p7.x, p7.y); ctx.stroke();
                ctx.globalAlpha = 1;
            }

            // --- PARTICLES ---
            for(let i=particles.length-1; i>=0; i--) {
                const p = particles[i];
                p.x += p.vx; p.y += p.vy; p.z += p.vz;
                p.life -= 0.02;

                if (p.life <= 0 || p.z > 2000) { // Cull far particles
                    particles.splice(i, 1);
                    continue;
                }

                const pr = rotate(p, targetRotX, targetRotY, 0);
                const pp = project(pr);
                
                if (pp.scale > 0) {
                    ctx.fillStyle = p.color;
                    // Particles also fade if mesh is fading in Flight phase
                    ctx.globalAlpha = p.life * (phase === 2 ? meshOpacity : 1); 
                    const size = (p.type === 'data' ? 2 : p.type === 'trail' ? 4 : 8) * pp.scale;
                    
                    if (p.type === 'data') {
                         ctx.fillText(Math.random() > 0.5 ? "1" : "0", pp.x, pp.y);
                    } else {
                        ctx.beginPath(); ctx.arc(pp.x, pp.y, size, 0, Math.PI*2); ctx.fill();
                    }
                    ctx.globalAlpha = 1;
                }
            }
            
            frameId = requestAnimationFrame(render);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = ((e.clientX - rect.left) / width) * 2 - 1;
            mouseY = ((e.clientY - rect.top) / height) * 2 - 1;
        };

        const handleResize = () => {
            if (canvas.parentElement) {
                canvas.width = canvas.parentElement.clientWidth;
                canvas.height = canvas.parentElement.clientHeight;
                width = canvas.width;
                height = canvas.height;
                cx = width / 2;
                cy = height / 2;
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);
        handleResize();
        render();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(frameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};
