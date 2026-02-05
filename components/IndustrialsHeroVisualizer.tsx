
import React, { useEffect, useRef } from 'react';

const IndustrialsHeroVisualizerComponent: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null); // Add ref to container for sizing

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current; // Use container ref
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d', { alpha: false }); // Optimize: No alpha channel
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
        const createCasing = () => {
            const verts: number[] = [];
            // Reduced density for performance stability
            for (let z = -250; z <= 250; z += 45) { 
                const r = (130 + Math.sin(z * 0.008) * 15) * MODEL_SCALE;
                for (let a = 0; a < Math.PI * 2; a += 0.4) { // Reduced angular resolution
                    verts.push(Math.cos(a) * r, Math.sin(a) * r, z);
                }
            }
            return new Float32Array(verts);
        };

        const casing = createCasing();

        // Config for the stages
        const STAGES = 5; // Reduced from 6 to 5 for perf
        const STAGE_SPACING = 90;
        const STAGE_OFFSET = -180;

        const render = () => {
            // Cycle time to prevent float precision loss over very long sessions
            time = (time + 0.005) % 10000; 
            
            ctx.fillStyle = '#020202';
            ctx.fillRect(0, 0, width, height);

            // Camera Rotation Matrices
            const rotY = time * 0.2;
            const rotX = Math.sin(time * 0.25) * 0.15;
            const cy_cos = Math.cos(rotY), cy_sin = Math.sin(rotY);
            const cx_cos = Math.cos(rotX), cx_sin = Math.sin(rotX);

            // --- DRAW CASING (Batch Points) ---
            ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
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
                    // Optimization: Rects are faster than arcs
                    ctx.rect(px, py, 1.5 * scale, 1.5 * scale);
                }
            }
            ctx.fill();

            // --- DRAW ROTORS (Vector Lines) ---
            for (let s = 0; s < STAGES; s++) {
                const zPos = STAGE_OFFSET + s * STAGE_SPACING;
                const dir = s % 2 === 0 ? 1 : -1;
                const rotorAngle = time * 2.5 * dir;
                
                const bladeCount = 12; // Fixed count for stability
                const angleStep = (Math.PI * 2) / bladeCount;

                ctx.beginPath();
                ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)'; // Amber
                ctx.lineWidth = 1;

                const rInner = 40 * MODEL_SCALE;
                const rOuter = 115 * MODEL_SCALE;

                for (let b = 0; b < bladeCount; b++) {
                    // Optimization: Calculate world angle once
                    const totalAngle = rotorAngle + (b * angleStep);
                    const t_cos = Math.cos(totalAngle);
                    const t_sin = Math.sin(totalAngle);
                    // Twist outer edge
                    const t_cos_twist = Math.cos(totalAngle + 0.3); 
                    const t_sin_twist = Math.sin(totalAngle + 0.3);

                    // Inner Vertex
                    const ix = rInner * t_cos;
                    const iy = rInner * t_sin;
                    const iz = zPos;

                    // Outer Vertex
                    const ox = rOuter * t_cos_twist;
                    const oy = rOuter * t_sin_twist;
                    const oz = zPos;

                    // Transform Inner
                    let itx = ix * cy_cos - iz * cy_sin;
                    let itz = iz * cy_cos + ix * cy_sin;
                    let ity = iy * cx_cos - itz * cx_sin;
                    let itz2 = itz * cx_cos + iy * cx_sin;

                    // Transform Outer
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
            if (containerRef.current && canvas) {
                const rect = containerRef.current.getBoundingClientRect();
                // Limit DPR to 2 to prevent massive canvases on mobile/retina causing slow down
                const dpr = Math.min(window.devicePixelRatio || 1, 2); 
                
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;
                
                // Reset context scale after resize
                ctx.setTransform(1, 0, 0, 1, 0, 0); 
                ctx.scale(dpr, dpr);
                
                width = rect.width;
                height = rect.height;
                cx = width * 0.65;
                cy = height * 0.5;
            }
        };
        
        window.addEventListener('resize', handleResize);
        handleResize(); // Init size
        render(); // Start loop

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(frameId);
        };
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 w-full h-full">
            <canvas ref={canvasRef} className="block w-full h-full" />
        </div>
    );
};

// Use memo to prevent re-renders from parent updates
export const IndustrialsHeroVisualizer = React.memo(IndustrialsHeroVisualizerComponent);
