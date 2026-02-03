
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

        // CONFIG
        const PAPER_COLS = 30;
        const PAPER_ROWS = 40;
        const SHEET_W = 220;
        const SHEET_H = 320;
        
        // INK SETTINGS
        const LINES_OF_TEXT = 14;
        const CHARS_PER_LINE = 18;
        
        // BUFFERS
        // We have Paper Particles (Grid) and Ink Particles (Text)
        const paperCount = PAPER_COLS * PAPER_ROWS;
        const inkCount = LINES_OF_TEXT * CHARS_PER_LINE;
        const totalCount = paperCount + inkCount;
        
        // Layout: [x, y, z, tx, ty, tz, baseU, baseV, type (0=paper, 1=ink)]
        const STRIDE = 9;
        const data = new Float32Array(totalCount * STRIDE);

        // --- INIT DATA ---
        let ptr = 0;
        
        // 1. INIT PAPER GRID
        for(let r=0; r<PAPER_ROWS; r++) {
            for(let c=0; c<PAPER_COLS; c++) {
                const u = c / (PAPER_COLS-1);
                const v = r / (PAPER_ROWS-1);
                
                data[ptr++] = 0; // x
                data[ptr++] = 0; // y
                data[ptr++] = 0; // z
                data[ptr++] = 0; // tx
                data[ptr++] = 0; // ty
                data[ptr++] = 0; // tz
                data[ptr++] = u;
                data[ptr++] = v;
                data[ptr++] = 0; // Type 0 = Paper
            }
        }

        // 2. INIT INK PARTICLES
        for(let l=0; l<LINES_OF_TEXT; l++) {
            const lineY = 0.15 + (l / LINES_OF_TEXT) * 0.7; // Text block area
            for(let c=0; c<CHARS_PER_LINE; c++) {
                const charX = 0.15 + (c / CHARS_PER_LINE) * 0.7; 
                
                // Add some randomness to look like handwriting/text blocks
                if (Math.random() > 0.85) continue; // Random spaces

                const u = charX + (Math.random()-0.5)*0.02;
                const v = lineY + (Math.random()-0.5)*0.005;

                data[ptr++] = 0;
                data[ptr++] = 0;
                data[ptr++] = 0;
                data[ptr++] = 0;
                data[ptr++] = 0;
                data[ptr++] = 0;
                data[ptr++] = u;
                data[ptr++] = v;
                data[ptr++] = 1; // Type 1 = Ink
            }
        }

        // STATE MACHINE
        // 0: Plane Flying
        // 1: Unfolding (Plane -> Sheet)
        // 2: Unwriting (Ink lifts off)
        // 3: Reset/Morph (Chaos -> Plane)
        let phase = 0;
        let phaseTimer = 0;
        
        // --- TRANSFORM LOGIC ---
        const getPlanePos = (u: number, v: number, target: {x:number, y:number, z:number}) => {
            // Fold logic: Map 2D UV sheet to 3D Paper Plane shape
            
            // Spine is u=0.5. Nose is v=0. Tail is v=1.
            const foldAngle = Math.PI / 3; // 60 deg wings
            
            // Central axis along Z
            // Shift origin so center of plane is (0,0,0)
            const spineZ = (v - 0.5) * SHEET_H;
            
            // Distance from spine (Width)
            const dist = Math.abs(u - 0.5) * SHEET_W;
            
            // Wing Fold: If u < 0.5 rotate left, else right
            const angle = (u < 0.5 ? 1 : -1) * foldAngle;
            
            // Basic V-shape
            let x = Math.cos(angle) * dist;
            let y = Math.sin(angle) * dist; 
            let z = spineZ;

            // Dart Sweep: Sweep wings back based on distance from spine
            // This gives it the arrow/fighter jet shape
            z -= Math.abs(x) * 1.2; 

            target.x = x;
            target.y = y;
            target.z = z;
        };

        const getSheetPos = (u: number, v: number, target: {x:number, y:number, z:number}) => {
            target.x = (u - 0.5) * SHEET_W;
            target.y = (v - 0.5) * SHEET_H;
            target.z = 0;
        };

        const updateParticles = () => {
            for(let i=0; i<totalCount; i++) {
                const idx = i * STRIDE;
                const u = data[idx+6];
                const v = data[idx+7];
                const type = data[idx+8];

                const tObj = {x:0, y:0, z:0};

                if (phase === 0) {
                    // PHASE: PLANE FLYING
                    getPlanePos(u, v, tObj);
                    // Add flight wobble / wind
                    tObj.y += Math.sin(time * 5 + u * 10) * 5;
                    tObj.x += Math.cos(time * 3 + v * 10) * 2;
                } else if (phase === 1) {
                    // PHASE: SHEET UNFOLDED
                    getSheetPos(u, v, tObj);
                } else if (phase === 2) {
                    // PHASE: UNWRITING
                    getSheetPos(u, v, tObj);
                    if (type === 1) { // Ink
                        // Ink floats away into the ether
                        const lift = phaseTimer * 0.8; // Speed up lift
                        
                        // Noise movement
                        const noiseX = Math.sin(lift * 0.05 + i) * 20;
                        const noiseY = Math.cos(lift * 0.05 + i) * 20;
                        
                        tObj.z += lift * 3 + Math.random() * 5; // Lift off page
                        tObj.x += noiseX;
                        tObj.y += noiseY;
                    }
                } else {
                    // PHASE: RESET (Implode to Plane)
                    getPlanePos(u, v, tObj);
                }

                // Interpolation (Smoothing)
                // Fast reset in phase 3, smooth otherwise
                const lerp = phase === 3 ? 0.1 : 0.08; 
                data[idx] += (tObj.x - data[idx]) * lerp;
                data[idx+1] += (tObj.y - data[idx+1]) * lerp;
                data[idx+2] += (tObj.z - data[idx+2]) * lerp;
            }
        };

        const render = () => {
            time += 0.01;
            phaseTimer++;

            // Animation Sequencer
            if (phase === 0 && phaseTimer > 250) { phase = 1; phaseTimer = 0; } // Fly -> Unfold
            if (phase === 1 && phaseTimer > 100) { phase = 2; phaseTimer = 0; } // Unfold -> Unwrite
            if (phase === 2 && phaseTimer > 180) { phase = 3; phaseTimer = 0; } // Unwrite -> Reset
            if (phase === 3 && phaseTimer > 60) { phase = 0; phaseTimer = 0; }  // Reset -> Fly

            ctx.fillStyle = '#020202';
            ctx.fillRect(0, 0, w, h);

            updateParticles();

            // Responsive Center
            const cx = w > 1024 ? w * 0.75 : w * 0.5;
            const cy = h * 0.5;

            // Camera Motion Logic
            let rotX = 0, rotY = 0, rotZ = 0;

            if (phase === 0) {
                // Flying: Bank and turn slightly
                rotX = -0.3; // Pitch down
                rotY = Math.sin(time * 0.5) * 0.2 + time * 0.2; // Spin slowly
                rotZ = Math.sin(time) * 0.1; // Bank
            } else if (phase === 1) {
                // Unfolding: Stabilize to face camera
                const t = Math.min(1, phaseTimer / 80);
                rotX = -0.3 * (1-t);
                rotY = ((Math.sin(time * 0.5) * 0.2 + time * 0.2) % (Math.PI*2)) * (1-t); // Decelerate spin
                rotZ = 0;
            } else if (phase === 2) {
                // Unwriting: Static flat view
                rotX = 0; rotY = 0; rotZ = 0;
            } else {
                // Reset: Chaos spin
                rotX = Math.random() * 0.2; rotY = Math.random() * 0.2;
            }

            // 3D Projection Matrix (Euler)
            const cz = Math.cos(rotZ), sz = Math.sin(rotZ);
            const cx_rot = Math.cos(rotX), sx_rot = Math.sin(rotX);
            const cy_rot = Math.cos(rotY), sy_rot = Math.sin(rotY);

            for(let i=0; i<totalCount; i++) {
                const idx = i * STRIDE;
                let x = data[idx];
                let y = data[idx+1];
                let z = data[idx+2];
                const type = data[idx+8];

                // 1. Rotate Z
                let x1 = x * cz - y * sz;
                let y1 = x * sz + y * cz;
                x = x1; y = y1;

                // 2. Rotate X
                let y2 = y * cx_rot - z * sx_rot;
                let z2 = y * sx_rot + z * cx_rot;
                y = y2; z = z2;

                // 3. Rotate Y
                let x3 = x * cy_rot - z * sy_rot;
                let z3 = x * sy_rot + z * cy_rot;
                x = x3; z = z3;

                // 4. Perspective Projection
                const camDist = 1000;
                const scale = camDist / (camDist + z);
                
                const px = cx + x * scale;
                const py = cy + y * scale;

                if (scale > 0) {
                    // Fade logic for ink
                    let alpha = Math.min(1, scale);
                    if (phase === 2 && type === 1) {
                        alpha *= Math.max(0, 1 - phaseTimer/150);
                    }

                    if (type === 0) {
                        // Paper Particle (Teal)
                        ctx.fillStyle = `rgba(105, 183, 178, ${0.4 * alpha})`; 
                        ctx.fillRect(px, py, 2*scale, 2*scale);
                    } else {
                        // Ink Particle (Amber)
                        ctx.fillStyle = `rgba(251, 191, 36, ${alpha})`; 
                        ctx.beginPath(); ctx.arc(px, py, 1.5*scale, 0, Math.PI*2); ctx.fill();
                    }
                }
            }

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
