
import React, { useEffect, useRef } from 'react';

export const IndustrialsHeroVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let cx = 0;
        let cy = 0;
        
        let frameId: number;
        let time = 0;

        const CAM_Z = 600;
        const MODEL_SCALE = 1.4;

        // --- GEOMETRY PRE-CALCULATION ---
        // Using flat arrays for [x, y, z] is faster than objects
        // Structure: [x, y, z, x, y, z...]
        
        const createCasing = () => {
            const verts: number[] = [];
            for (let z = -250; z <= 250; z += 40) { // Reduced density for performance
                const r = (130 + Math.sin(z * 0.008) * 15) * MODEL_SCALE;
                for (let a = 0; a < Math.PI * 2; a += 0.3) {
                    verts.push(Math.cos(a) * r, Math.sin(a) * r, z);
                }
            }
            return new Float32Array(verts);
        };

        const createRotor = () => {
            const verts: number[] = [];
            // Single rotor blade shape
            const rOuter = 115 * MODEL_SCALE;
            const rInner = 40 * MODEL_SCALE;
            
            // We'll rotate this single definition in the render loop
            // Define points: Inner, Outer
            verts.push(rInner, 0, 0); // Inner 1
            verts.push(rOuter, 10, 0); // Outer 1 (twisted)
            return new Float32Array(verts);
        };

        const casing = createCasing();
        const rotorTemplate = createRotor();

        // Config for the 6 stages
        const STAGES = 6;
        const STAGE_SPACING = 80;
        const STAGE_OFFSET = -200;

        const render = () => {
            time += 0.005; // Base Speed
            
            // Clear
            ctx.fillStyle = '#020202';
            ctx.fillRect(0, 0, width, height);

            // Camera Rotation Matrices
            const rotY = time * 0.2;
            const rotX = Math.sin(time * 0.25) * 0.15;
            const cy_cos = Math.cos(rotY), cy_sin = Math.sin(rotY);
            const cx_cos = Math.cos(rotX), cx_sin = Math.sin(rotX);

            // --- DRAW CASING ---
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.beginPath();
            
            for (let i = 0; i < casing.length; i += 3) {
                const x = casing[i];
                const y = casing[i+1];
                const z = casing[i+2];

                // Camera Transform
                const tx = x * cy_cos - z * cy_sin;
                const tz = z * cy_cos + x * cy_sin;
                
                const ty = y * cx_cos - tz * cx_sin;
                const tz2 = tz * cx_cos + y * cx_sin;

                const scale = CAM_Z / (CAM_Z + tz2);
                
                if (scale > 0) {
                    const px = cx + tx * scale;
                    const py = cy + ty * scale;
                    // Optimization: Draw tiny rects instead of arc for massive speedup
                    ctx.rect(px, py, 1.5 * scale, 1.5 * scale);
                }
            }
            ctx.fill();

            // --- DRAW ROTORS ---
            for (let s = 0; s < STAGES; s++) {
                const zPos = STAGE_OFFSET + s * STAGE_SPACING;
                // Alternating rotation directions
                const dir = s % 2 === 0 ? 1 : -1;
                const rotorAngle = time * 2.5 * dir; // Speed multiplier
                
                const r_cos = Math.cos(rotorAngle);
                const r_sin = Math.sin(rotorAngle);

                const bladeCount = 12 + (s % 2) * 4;
                const angleStep = (Math.PI * 2) / bladeCount;

                ctx.beginPath();
                ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)'; // Amber
                ctx.lineWidth = 1;

                // Draw all blades for this stage
                for (let b = 0; b < bladeCount; b++) {
                    const bladeAngle = b * angleStep;
                    const b_cos = Math.cos(bladeAngle);
                    const b_sin = Math.sin(bladeAngle);

                    // Inner Point (Rotated by Blade Index then by Rotor Spin)
                    // Simplified: We know inner is at r=40, z=zPos
                    const rInner = 40 * MODEL_SCALE;
                    const rOuter = 115 * MODEL_SCALE;

                    // Compute world positions
                    // 1. Blade Local Rotation
                    // 2. Rotor Spin
                    // 3. Camera Transform
                    
                    // Optimization: Combine blade and rotor angles
                    const totalAngle = rotorAngle + bladeAngle;
                    const t_cos = Math.cos(totalAngle);
                    const t_sin = Math.sin(totalAngle);
                    const t_cos_twist = Math.cos(totalAngle + 0.3); // Twist for outer
                    const t_sin_twist = Math.sin(totalAngle + 0.3);

                    // Inner Vertex
                    const ix = rInner * t_cos;
                    const iy = rInner * t_sin;
                    const iz = zPos;

                    // Outer Vertex
                    const ox = rOuter * t_cos_twist;
                    const oy = rOuter * t_sin_twist;
                    const oz = zPos;

                    // Camera Transform - Inner
                    let itx = ix * cy_cos - iz * cy_sin;
                    let itz = iz * cy_cos + ix * cy_sin;
                    let ity = iy * cx_cos - itz * cx_sin;
                    let itz2 = itz * cx_cos + iy * cx_sin;

                    // Camera Transform - Outer
                    let otx = ox * cy_cos - oz * cy_sin;
                    let otz = oz * cy_cos + ox * cy_sin;
                    let oty = oy * cx_cos - otz * cx_sin;
                    let otz2 = otz * cx_cos + oy * cx_sin;

                    const iScale = CAM_Z / (CAM_Z + itz2);
                    const oScale = CAM_Z / (CAM_Z + otz2);

                    if (iScale > 0 && oScale > 0) {
                        ctx.moveTo(cx + itx * iScale, cy + ity * iScale);
                        ctx.lineTo(cx + otx * oScale, cy + oty * oScale);
                    }
                }
                ctx.stroke();
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
                cx = width * 0.65;
                cy = height * 0.5;
            }
        };
        
        window.addEventListener('resize', handleResize);
        handleResize();
        frameId = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(frameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{width: '100%', height: '100%'}} />;
};
