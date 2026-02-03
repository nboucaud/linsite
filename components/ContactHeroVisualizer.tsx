
import React, { useEffect, useRef } from 'react';

const ContactHeroVisualizerComponent: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas) return;
        
        // Changed to alpha: true to allow CSS background layering
        const ctx = canvas.getContext('2d', { alpha: true });
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
        let meshOpacity = 1; 
        
        // --- GEOMETRY DATA STRUCTURES ---
        const SHEET_SIZE = 150; 
        
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

        // START AS PLANE
        const currentVerts = planeVerts.map(v => ({...v}));
        const worldVertsBuffer = flatVerts.map(() => ({ x: 0, y: 0, z: 0, px: 0, py: 0, scale: 0 }));
        
        // Start far away for fly-in
        const planePos = { x: 0, y: 0, z: 2500 };
        const planeVel = { x: 0, y: 0, z: -15 }; 
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
                    p.color = type === 'data' ? '#FACC15' : type === 'ember' ? '#fbbf24' : '#ffffff';
                    p.type = type;
                    break; 
                }
            }
        };

        const render = () => {
            frameId = requestAnimationFrame(render);
            if (!isVisible) return;

            globalTime += 0.016;

            ctx.clearRect(0, 0, width, height);

            targetRotY += (mouseX * 0.1 - targetRotY) * 0.05;
            targetRotX += (mouseY * 0.1 - targetRotX) * 0.05;

            const cosY = Math.cos(targetRotX);
            const sinY = Math.sin(targetRotX);
            const cosX = Math.cos(targetRotY); 
            const sinX = Math.sin(targetRotY);

            // --- PHASE LOGIC (REVERSED) ---
            if (phase === 0) { // FLIGHT IN
                phaseTimer += 0.01;
                planePos.z += planeVel.z;
                
                planeRot.z = Math.sin(globalTime) * 0.1;
                planeRot.y = Math.cos(globalTime * 0.5) * 0.1;

                meshOpacity = Math.min(1, (3000 - planePos.z) / 1000);

                if(Math.random() > 0.5) spawnParticle('ember', planePos.x, planePos.y, planePos.z, 50);
                
                if (planePos.z <= 0) {
                    planePos.z = 0;
                    phase = 1;
                    phaseTimer = 0;
                }
            }
            else if (phase === 1) { // UNFOLD
                phaseTimer += 0.015;
                const t = Math.min(1, phaseTimer);
                const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

                for(let i=0; i<9; i++) {
                    currentVerts[i].x = lerp(planeVerts[i].x, flatVerts[i].x, ease);
                    currentVerts[i].y = lerp(planeVerts[i].y, flatVerts[i].y, ease);
                    currentVerts[i].z = lerp(planeVerts[i].z, flatVerts[i].z, ease);
                }
                
                planeRot.x *= 0.95;
                planeRot.y *= 0.95;
                planeRot.z *= 0.95;

                if (t >= 1) {
                    phase = 2;
                    phaseTimer = 0;
                }
            }
            else if (phase === 2) { // DISSOLVE
                phaseTimer += 0.01;
                meshOpacity = Math.max(0, 1 - phaseTimer); 
                
                for(let i=0; i<9; i++) {
                    const noiseX = (Math.random() - 0.5) * 10 * phaseTimer;
                    const noiseY = (Math.random() - 0.5) * 10 * phaseTimer;
                    currentVerts[i].x += noiseX;
                    currentVerts[i].y += noiseY;
                    currentVerts[i].z += (Math.random()) * 5; 
                }

                if (Math.random() > 0.8) spawnParticle('data', 0, 0, 0, 200 * phaseTimer);

                if (phaseTimer > 1.5) { 
                    phase = 3; 
                    phaseTimer = 0; 
                }
            }
            else if (phase === 3) { // RESET
                loopSeed += 13.7;
                meshOpacity = 0;
                
                planePos.x = 0; planePos.y = 0; planePos.z = 2500;
                planeRot.x = 0; planeRot.y = 0; planeRot.z = 0;
                
                for(let i=0; i<9; i++) {
                    currentVerts[i].x = planeVerts[i].x;
                    currentVerts[i].y = planeVerts[i].y;
                    currentVerts[i].z = planeVerts[i].z;
                }
                
                phase = 0;
            }

            // --- TRANSFORM & PROJECT ---
            for(let i=0; i<9; i++) {
                const v = currentVerts[i];
                
                let x = v.x; let y = v.y; let z = v.z;
                
                const cosRY = Math.cos(planeRot.y); const sinRY = Math.sin(planeRot.y);
                const cosRX = Math.cos(planeRot.x); const sinRX = Math.sin(planeRot.x);
                const cosRZ = Math.cos(planeRot.z); const sinRZ = Math.sin(planeRot.z);

                let x1 = x * cosRZ - y * sinRZ;
                let y1 = x * sinRZ + y * cosRZ;
                x = x1; y = y1;

                let x2 = x * cosRY - z * sinRY;
                let z2 = z * cosRY + x * sinRY;
                x = x2; z = z2;

                let y2 = y * cosRX - z * sinRX;
                let z3 = z * cosRX + y * sinRX;
                y = y2; z = z3;

                x += planePos.x;
                y += planePos.y;
                z += planePos.z;

                let y3 = y * cosY - z * sinY;
                let z4 = z * cosY + y * sinY;
                let x3 = x * cosX - z4 * sinX;
                let z5 = z4 * cosX + x * sinX;

                const scale = FL / (FL + z5);
                const buff = worldVertsBuffer[i];
                buff.x = x3; buff.y = y3; buff.z = z5;
                buff.px = cx + x3 * scale;
                buff.py = cy + y3 * scale;
                buff.scale = scale;
            }

            if (meshOpacity > 0.01) {
                const accentFill = `rgba(250, 204, 21, ${meshOpacity * 0.25})`; 
                const baseFill = `rgba(255, 255, 255, ${meshOpacity * 0.05})`;
                
                ctx.lineWidth = 1;
                ctx.strokeStyle = `rgba(250, 204, 21, ${0.4 * meshOpacity})`; 

                const addTri = (i1: number, i2: number, i3: number) => {
                    const p1 = worldVertsBuffer[i1];
                    const p2 = worldVertsBuffer[i2];
                    const p3 = worldVertsBuffer[i3];
                    if (p1.z < -FL+10 || p2.z < -FL+10 || p3.z < -FL+10) return;
                    
                    ctx.moveTo(p1.px, p1.py);
                    ctx.lineTo(p2.px, p2.py);
                    ctx.lineTo(p3.px, p3.py);
                    ctx.lineTo(p1.px, p1.py);
                };

                ctx.beginPath();
                addTri(0, 1, 3);
                addTri(1, 2, 5);
                addTri(3, 4, 6);
                addTri(4, 5, 8);
                ctx.fillStyle = baseFill;
                ctx.fill();
                ctx.stroke();

                ctx.beginPath();
                addTri(1, 4, 3);
                addTri(1, 4, 5);
                addTri(4, 7, 6);
                addTri(4, 7, 8);
                ctx.fillStyle = accentFill;
                ctx.fill();
                ctx.stroke();
                
                const p1 = worldVertsBuffer[1]; const p4 = worldVertsBuffer[4]; const p7 = worldVertsBuffer[7];
                if(p1.z > -FL) {
                    ctx.beginPath();
                    ctx.strokeStyle = '#FBBF24'; 
                    ctx.lineWidth = 2;
                    ctx.moveTo(p1.px, p1.py); ctx.lineTo(p4.px, p4.py); ctx.lineTo(p7.px, p7.py); 
                    ctx.stroke();
                }
            }

            for(let i=0; i<MAX_PARTICLES; i++) {
                const p = particles[i];
                if (!p.active) continue;

                p.x += p.vx; p.y += p.vy; p.z += p.vz;
                p.life -= 0.02;

                if (p.life <= 0 || p.z > 3000) {
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
                    ctx.globalAlpha = p.life * meshOpacity;
                    
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
            mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouseY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        };

        const handleResize = () => {
            if (containerRef.current && canvasRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                canvasRef.current.width = rect.width;
                canvasRef.current.height = rect.height;
                width = rect.width;
                height = rect.height;
                cx = width / 2;
                cy = height / 2;
            }
        };

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

export const ContactHeroVisualizer = React.memo(ContactHeroVisualizerComponent);
