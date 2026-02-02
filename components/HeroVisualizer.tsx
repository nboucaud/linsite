
import React, { useEffect, useRef } from 'react';

const HeroVisualizerComponent: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas) return;
        
        // OPTIMIZATION: alpha: false eliminates the browser's need to composite 
        // the canvas against the DOM background.
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let width = canvas.width;
        let height = canvas.height;
        let cx = width / 2;
        let cy = height / 2;
        
        let frameId: number;
        let isVisible = true;

        // --- 3D ENGINE SETTINGS ---
        const FL = 800;
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
        
        // --- GEOMETRY DATA STRUCTURES ---
        const SHEET_SIZE = 150; 
        
        // Pre-allocate objects to avoid Garbage Collection during render loop
        const createVec = (x: number, y: number, z: number) => ({ x, y, z });
        
        const flatVerts = [
            createVec(-SHEET_SIZE, -SHEET_SIZE * 1.4, 0), createVec(0, -SHEET_SIZE * 1.4, 0), createVec(SHEET_SIZE, -SHEET_SIZE * 1.4, 0),
            createVec(-SHEET_SIZE, 0, 0),                 createVec(0, 0, 0),                 createVec(SHEET_SIZE, 0, 0),
            createVec(-SHEET_SIZE, SHEET_SIZE * 1.4, 0),  createVec(0, SHEET_SIZE * 1.4, 0),  createVec(SHEET_SIZE, SHEET_SIZE * 1.4, 0)
        ];

        const planeVerts = [
            createVec(0, -SHEET_SIZE * 1.8, -20),   createVec(0, -SHEET_SIZE * 1.8, -20),   createVec(0, -SHEET_SIZE * 1.8, -20),
            createVec(-SHEET_SIZE * 1.2, SHEET_SIZE, 20), createVec(0, -SHEET_SIZE * 0.5, -50), createVec(SHEET_SIZE * 1.2, SHEET_SIZE, 20),
            createVec(-20, SHEET_SIZE * 1.4, 0),     createVec(0, SHEET_SIZE * 1.4, 0),      createVec(20, SHEET_SIZE * 1.4, 0)
        ];

        // Mutable state vectors
        const currentVerts = flatVerts.map(v => ({...v}));
        const worldVertsBuffer = flatVerts.map(() => ({ x: 0, y: 0, z: 0, px: 0, py: 0, scale: 0 }));
        
        const planePos = { x: 0, y: 0, z: 0 };
        const planeVel = { x: 0, y: 0, z: 0 };
        const planeRot = { x: 0, y: 0, z: 0 };

        // --- PARTICLES ---
        const MAX_PARTICLES = 60;
        const particles = Array.from({ length: MAX_PARTICLES }, () => ({
            x: 0, y: 0, z: 0,
            vx: 0, vy: 0, vz: 0,
            life: 0,
            color: '#fff',
            type: 'ember' as 'data' | 'trail' | 'ember',
            active: false
        }));

        const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

        const spawnParticle = (type: 'data' | 'trail' | 'ember', ox: number, oy: number, oz: number, spread: number) => {
            // Find first inactive particle to reuse memory
            for (let i = 0; i < MAX_PARTICLES; i++) {
                const p = particles[i];
                if (!p.active) {
                    p.active = true;
                    p.x = ox + (Math.random() - 0.5) * spread;
                    p.y = oy + (Math.random() - 0.5) * spread;
                    p.z = oz + (Math.random() - 0.5) * spread;
                    p.vx = (Math.random() - 0.5) * (type === 'ember' ? 5 : 2);
                    p.vy = (Math.random() - 0.5) * (type === 'ember' ? 5 : 2);
                    p.vz = type === 'trail' ? 10 : (Math.random() - 0.5) * 5;
                    p.life = 1.0;
                    p.color = type === 'data' ? '#69B7B2' : type === 'ember' ? '#f59e0b' : '#ffffff';
                    p.type = type;
                    break; 
                }
            }
        };

        const render = () => {
            frameId = requestAnimationFrame(render);
            if (!isVisible) return;

            globalTime += 0.016;

            // OPTIMIZATION: Single fillRect with low opacity creates the trail effect.
            // No need to clearRect + fillRect(black) + fillRect(opacity).
            // This is a 2x reduction in full-screen draw calls.
            ctx.fillStyle = 'rgba(2, 2, 2, 0.25)';
            ctx.fillRect(0, 0, width, height);

            // Camera Smoothing
            targetRotY += (mouseX * 0.5 - targetRotY) * 0.05;
            targetRotX += (mouseY * 0.5 - targetRotX) * 0.05;

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
                    // Pre-calc noise factors to avoid repetitive Math calls
                    const idx = i * 1.0;
                    const noiseX = Math.sin(idx * 12.3 + loopSeed) * 1200 + float;
                    const noiseY = Math.cos(idx * 45.6 + loopSeed) * 800 + float;
                    const noiseZ = Math.sin(idx * 78.9 + loopSeed) * 1000 - 500;
                    
                    const cv = currentVerts[i];
                    const fv = flatVerts[i];
                    cv.x = lerp(noiseX, fv.x, ease);
                    cv.y = lerp(noiseY, fv.y, ease);
                    cv.z = lerp(noiseZ, fv.z, ease);
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
                    // Shake effect
                    cx = width/2 + (Math.random()-0.5)*5;
                    cy = height/2 + (Math.random()-0.5)*5;
                } else {
                    cx = width/2; cy = height/2;
                }

                if (phaseTimer > 1.2) { 
                    phase = 2; phaseTimer = 0;
                    // Reset vectors
                    planePos.x = 0; planePos.y = 0; planePos.z = 0;
                    planeRot.x = 0; planeRot.y = 0; planeRot.z = 0;
                    
                    const angle = (Math.random() - 0.5) * 2.5;
                    const lift = (Math.random() - 0.5) * 1.0;
                    planeVel.x = Math.sin(angle) * 8;
                    planeVel.y = Math.sin(lift) * 6;
                    planeVel.z = 18;
                }
            }
            else if (phase === 2) { // FLIGHT
                phaseTimer += 0.016;
                planeVel.z += 0.85;
                planePos.x += planeVel.x;
                planePos.y += planeVel.y;
                planePos.z += planeVel.z;

                // Banking logic
                const targetBank = planeVel.x * 0.03;
                planeRot.z += (targetBank - planeRot.z) * 0.1;
                const targetPitch = planeVel.y * 0.03;
                planeRot.x += (targetPitch - planeRot.x) * 0.1;
                planeRot.y += planeVel.x * 0.002;

                if (planePos.z > 2000) meshOpacity = Math.max(0, 1 - ((planePos.z - 2000) / 1500));

                if(Math.random() > 0.5) spawnParticle('ember', planePos.x, planePos.y, planePos.z, 10);
                if(Math.random() > 0.8) spawnParticle('trail', planePos.x, planePos.y, planePos.z, 20);

                if (planePos.z > 3500) { 
                    phase = 3; 
                    phaseTimer = 0; 
                }
            }
            else if (phase === 3) { // RESET
                loopSeed += 13.7;
                meshOpacity = 0;
                phase = 0;
                cx = width/2; cy = height/2;
            }

            // --- TRANSFORM & PROJECT (BATCHED) ---
            for(let i=0; i<9; i++) {
                const v = currentVerts[i];
                let x = v.x + planePos.x;
                let y = v.y + planePos.y;
                let z = v.z + planePos.z;

                if (phase === 2) {
                    // Apply Plane Rotation Matrix
                    const cosRY = Math.cos(planeRot.y); const sinRY = Math.sin(planeRot.y);
                    const cosRX = Math.cos(planeRot.x); const sinRX = Math.sin(planeRot.x);
                    
                    let tx = x * cosRY - z * sinRY;
                    let tz = z * cosRY + x * sinRY;
                    x = tx; z = tz;
                    let ty = y * cosRX - z * sinRX;
                    let tz2 = z * cosRX + y * sinRX;
                    y = ty; z = tz2;
                }

                // Apply Camera Rotation Matrix
                let y1 = y * cosY - z * sinY;
                let z1 = z * cosY + y * sinY;
                let x1 = x * cosX - z1 * sinX;
                let z2 = z1 * cosX + x * sinX;

                const scale = FL / (FL + z2);
                const buff = worldVertsBuffer[i];
                buff.x = x1; buff.y = y1; buff.z = z2;
                buff.px = cx + x1 * scale;
                buff.py = cy + y1 * scale;
                buff.scale = scale;
            }

            // --- DRAW MESH (BATCHED) ---
            // Instead of drawing each triangle individually (which changes context state),
            // we batch "base" polygons and "accent" polygons to reduce draw calls.
            if (meshOpacity > 0.01) {
                const accentFill = phase === 2 ? `rgba(105,183,178,${meshOpacity * 0.2})` : `rgba(255,255,255,${meshOpacity * 0.1})`;
                const baseFill = `rgba(255,255,255,${meshOpacity * 0.05})`;
                
                ctx.lineWidth = 1;
                ctx.strokeStyle = `rgba(255,255,255,${0.1 * meshOpacity})`;

                // Helper to add path
                const addTri = (i1: number, i2: number, i3: number) => {
                    const p1 = worldVertsBuffer[i1];
                    const p2 = worldVertsBuffer[i2];
                    const p3 = worldVertsBuffer[i3];
                    // Culling check
                    if (p1.z < -FL+10 || p2.z < -FL+10 || p3.z < -FL+10) return;
                    
                    ctx.moveTo(p1.px, p1.py);
                    ctx.lineTo(p2.px, p2.py);
                    ctx.lineTo(p3.px, p3.py);
                    ctx.lineTo(p1.px, p1.py);
                };

                // BATCH 1: Base Triangles
                ctx.beginPath();
                addTri(0, 1, 3);
                addTri(1, 2, 5);
                addTri(3, 4, 6);
                addTri(4, 5, 8);
                ctx.fillStyle = baseFill;
                ctx.fill();
                ctx.stroke();

                // BATCH 2: Accent Triangles
                ctx.beginPath();
                addTri(1, 4, 3);
                addTri(1, 4, 5);
                addTri(4, 7, 6);
                addTri(4, 7, 8);
                ctx.fillStyle = accentFill;
                ctx.fill();
                ctx.stroke();
                
                // Highlight Line
                const p1 = worldVertsBuffer[1]; const p4 = worldVertsBuffer[4]; const p7 = worldVertsBuffer[7];
                if(p1.z > -FL) {
                    ctx.beginPath();
                    ctx.strokeStyle = phase === 1 ? '#f59e0b' : '#69B7B2';
                    ctx.lineWidth = 2;
                    ctx.moveTo(p1.px, p1.py); ctx.lineTo(p4.px, p4.py); ctx.lineTo(p7.px, p7.py); 
                    ctx.stroke();
                }
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
                        ctx.font = '10px monospace';
                        ctx.fillText("1", px, py);
                    } else {
                        const size = (p.type === 'trail' ? 3 : 6) * scale;
                        ctx.fillRect(px - size/2, py - size/2, size, size);
                    }
                }
            }
            ctx.globalAlpha = 1;
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            // Simple normalization
            mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouseY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        };

        const handleResize = () => {
            if (containerRef.current && canvasRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                // OPTIMIZATION: Match canvas dimensions 1:1 with CSS pixels
                // This avoids high-DPI scaling overhead which causes 4x pixel processing on Retina
                canvasRef.current.width = rect.width;
                canvasRef.current.height = rect.height;
                width = rect.width;
                height = rect.height;
                cx = width / 2;
                cy = height / 2;
            }
        };

        // Visibility handling to stop rendering when off-screen
        const observer = new IntersectionObserver(([entry]) => {
            isVisible = entry.isIntersecting;
        }, { threshold: 0.01 });
        
        if (containerRef.current) observer.observe(containerRef.current);

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);
        handleResize();
        render();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            if (containerRef.current) observer.unobserve(containerRef.current);
            cancelAnimationFrame(frameId);
        };
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 w-full h-full bg-[#020202]">
            <canvas ref={canvasRef} className="block w-full h-full" />
        </div>
    );
};

export const HeroVisualizer = React.memo(HeroVisualizerComponent);
