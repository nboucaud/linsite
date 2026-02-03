
import React, { useEffect, useRef } from 'react';

export const ContactHeroVisualizer: React.FC = () => {
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

        // --- CONFIGURATION ---
        const SHEET_W = 200;
        const SHEET_H = 280;
        const GRID_RES = 12; // Grid density for folding
        const INK_LINES = 12;
        const CHARS_PER_LINE = 20;
        
        // --- DATA STRUCTURES ---
        
        // 1. PAPER MESH (Grid of points)
        // We track UVs to handle folding logic
        const paperNodes: {u: number, v: number, x: number, y: number, z: number}[] = [];
        for(let y=0; y<=GRID_RES; y++) {
            for(let x=0; x<=GRID_RES; x++) {
                paperNodes.push({
                    u: x/GRID_RES,
                    v: y/GRID_RES,
                    x: 0, y: 0, z: 0
                });
            }
        }

        // 2. INK PARTICLES
        // Attached to UV space initially, then detach
        const inkParticles: {u: number, v: number, x: number, y: number, z: number, detached: boolean, dx: number, dy: number, dz: number}[] = [];
        for(let l=0; l<INK_LINES; l++) {
            const lineY = 0.15 + (l / INK_LINES) * 0.7;
            for(let c=0; c<CHARS_PER_LINE; c++) {
                if (Math.random() > 0.8) continue; // Random spaces
                const charX = 0.15 + (c / CHARS_PER_LINE) * 0.7 + (Math.random()-0.5)*0.01;
                inkParticles.push({
                    u: charX,
                    v: lineY,
                    x: 0, y: 0, z: 0,
                    detached: false,
                    dx: 0, dy: 0, dz: 0
                });
            }
        }

        // --- STATE MACHINE ---
        // 0: FLIGHT (Plane moving)
        // 1: LANDING (Plane stopping)
        // 2: UNFOLD (Morph to Sheet)
        // 3: UNWRITE (Ink lifts off)
        // 4: RESET (Fade out)
        let phase = 0;
        let phaseTimer = 0;
        let globalZ = 0; // Movement of the whole object

        // --- TRANSFORM FUNCTIONS ---

        // Maps UV (0-1) to 3D Paper Plane shape
        const getPlanePosition = (u: number, v: number, out: {x:number, y:number, z:number}) => {
            // Fold logic: 
            // Center spine is u=0.5
            // Wings fold up/out
            const foldAngle = Math.PI * 0.45; 
            const center = 0.5;
            const distFromCenter = Math.abs(u - center) * SHEET_W;
            const isLeft = u < center;
            
            // Base Plane coords
            let x = distFromCenter * Math.cos(foldAngle) * (isLeft ? -1 : 1);
            let y = distFromCenter * Math.sin(foldAngle); // Wings go up
            let z = (v - 0.5) * SHEET_H;

            // Dart shape taper
            // Reduce width at nose (v=0)
            const taper = 0.2 + 0.8 * v; // Nose is narrow
            x *= taper;
            y *= taper;

            out.x = x; 
            out.y = y; 
            out.z = z;
        };

        // Maps UV (0-1) to Flat Sheet
        const getSheetPosition = (u: number, v: number, out: {x:number, y:number, z:number}) => {
            out.x = (u - 0.5) * SHEET_W;
            out.y = (v - 0.5) * SHEET_H; // Vertical sheet
            out.z = 0;
        };

        const render = () => {
            time += 0.01;
            phaseTimer++;

            // Phase Switching
            if (phase === 0 && phaseTimer > 200) { phase = 1; phaseTimer = 0; } // Fly -> Land
            if (phase === 1 && phaseTimer > 60) { phase = 2; phaseTimer = 0; } // Land -> Unfold
            if (phase === 2 && phaseTimer > 120) { phase = 3; phaseTimer = 0; } // Unfold -> Unwrite
            if (phase === 3 && phaseTimer > 250) { phase = 4; phaseTimer = 0; } // Unwrite -> Reset
            if (phase === 4 && phaseTimer > 60) { phase = 0; phaseTimer = 0; globalZ = -800; } // Reset -> Fly

            ctx.fillStyle = '#020202';
            ctx.fillRect(0, 0, w, h);

            const cx = w > 1024 ? w * 0.75 : w * 0.5;
            const cy = h * 0.5;

            // --- ANIMATION LOGIC ---
            
            let morphFactor = 0; // 0 = Plane, 1 = Sheet
            let globalRotX = 0;
            let globalRotY = 0;
            let globalRotZ = 0;

            if (phase === 0) { // FLYING
                morphFactor = 0;
                globalZ += 6; // Fly forward
                globalRotZ = Math.sin(time * 2) * 0.1; // Bank
                globalRotX = -Math.PI / 2; // Face forward
            } else if (phase === 1) { // LANDING
                morphFactor = 0;
                // Slow down rotation to face camera flat
                const t = phaseTimer / 60;
                // Smooth step to orient for unfolding
                globalRotX = -Math.PI/2 * (1-t); 
                globalRotZ = 0;
            } else if (phase === 2) { // UNFOLDING
                const t = Math.min(1, phaseTimer / 100);
                // Ease out elastic
                morphFactor = t;
            } else if (phase === 3) { // UNWRITING
                morphFactor = 1;
            } else { // RESET
                morphFactor = 1 - (phaseTimer / 60); // Quick fold back?
                globalZ -= 20; // Fly away backward
            }

            const planePos = {x:0, y:0, z:0};
            const sheetPos = {x:0, y:0, z:0};

            // --- UPDATE & DRAW PAPER ---
            ctx.strokeStyle = `rgba(105, 183, 178, ${0.3})`;
            ctx.lineWidth = 1;
            ctx.beginPath();

            // Draw as grid lines
            for(let i=0; i<paperNodes.length; i++) {
                const n = paperNodes[i];
                getPlanePosition(n.u, n.v, planePos);
                getSheetPosition(n.u, n.v, sheetPos);

                // Lerp
                let x = planePos.x + (sheetPos.x - planePos.x) * morphFactor;
                let y = planePos.y + (sheetPos.y - planePos.y) * morphFactor;
                let z = planePos.z + (sheetPos.z - planePos.z) * morphFactor;

                // Global Transform
                // Rotate
                const grx = globalRotX;
                let y1 = y * Math.cos(grx) - z * Math.sin(grx);
                let z1 = z * Math.cos(grx) + y * Math.sin(grx);
                y = y1; z = z1;

                let x1 = x * Math.cos(globalRotZ) - y * Math.sin(globalRotZ);
                let y2 = y * Math.cos(globalRotZ) + x * Math.sin(globalRotZ);
                x = x1; y = y2;

                z += globalZ + 400; // Camera offset

                // Project
                const scale = 800 / (800 + z);
                const px = cx + x * scale;
                const py = cy + y * scale;

                n.x = px; n.y = py; n.z = z; // Store projected for lines

                // Draw dots at nodes
                if (z > -700) {
                    ctx.fillStyle = `rgba(105, 183, 178, ${0.5 * morphFactor + 0.1})`;
                    ctx.fillRect(px, py, 1.5, 1.5);
                }
            }

            // Connect Grid
            for(let y=0; y<GRID_RES; y++) {
                for(let x=0; x<GRID_RES; x++) {
                    const i = y * (GRID_RES+1) + x;
                    const right = i + 1;
                    const down = i + (GRID_RES+1);
                    
                    const p1 = paperNodes[i];
                    if (p1.z < -700) continue;

                    const pRight = paperNodes[right];
                    const pDown = paperNodes[down];

                    if (x < GRID_RES) {
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(pRight.x, pRight.y);
                    }
                    if (y < GRID_RES) {
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(pDown.x, pDown.y);
                    }
                }
            }
            ctx.stroke();

            // --- UPDATE & DRAW INK ---
            ctx.fillStyle = '#fbbf24'; // Amber
            
            for(let i=0; i<inkParticles.length; i++) {
                const p = inkParticles[i];
                
                // Base Position (Same interpolation as paper)
                getPlanePosition(p.u, p.v, planePos);
                getSheetPosition(p.u, p.v, sheetPos);
                
                let x = planePos.x + (sheetPos.x - planePos.x) * morphFactor;
                let y = planePos.y + (sheetPos.y - planePos.y) * morphFactor;
                let z = planePos.z + (sheetPos.z - planePos.z) * morphFactor;

                // UNWRITING LOGIC
                if (phase === 3) {
                    // Detach logic
                    if (!p.detached) {
                        // Start detaching based on time + random variance
                        if (Math.random() < 0.05) {
                            p.detached = true;
                            p.dx = (Math.random()-0.5) * 2;
                            p.dy = -(Math.random() * 2 + 1); // Float UP
                            p.dz = (Math.random()-0.5) * 5;
                        }
                    }
                } else if (phase === 4 || phase === 0) {
                    p.detached = false;
                    p.dx = 0; p.dy = 0; p.dz = 0;
                }

                if (p.detached) {
                    // Add noise movement
                    x += p.dx * phaseTimer * 0.1 + Math.sin(time * 5 + i) * 5;
                    y += p.dy * phaseTimer * 0.1;
                    z += p.dz * phaseTimer * 0.1 + 50; // Lift off surface
                }

                // Global Transform (Same as Paper)
                const grx = globalRotX;
                let y1 = y * Math.cos(grx) - z * Math.sin(grx);
                let z1 = z * Math.cos(grx) + y * Math.sin(grx);
                y = y1; z = z1;

                let x1 = x * Math.cos(globalRotZ) - y * Math.sin(globalRotZ);
                let y2 = y * Math.cos(globalRotZ) + x * Math.sin(globalRotZ);
                x = x1; y = y2;

                z += globalZ + 400;

                // Project
                const scale = 800 / (800 + z);
                const px = cx + x * scale;
                const py = cy + y * scale;

                if (scale > 0 && z > -700) {
                    // Fade out as they float away
                    let alpha = 1;
                    if (p.detached) alpha = Math.max(0, 1 - (phaseTimer / 200));
                    
                    ctx.globalAlpha = alpha;
                    const size = p.detached ? 2 * scale : 1.5 * scale;
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

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full mix-blend-screen opacity-90" />;
};
