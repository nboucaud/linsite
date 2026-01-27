
import React, { useState } from 'react';
import { Download, Package, CheckCircle, ArrowLeft, Code, FileText, Terminal } from 'lucide-react';
import JSZip from 'jszip';
import { useNavigation } from '../context/NavigationContext';

// --- README CONTENT ---
const README_CODE = `# Infogito Hero Visualizers

This bundle contains the high-fidelity, canvas-based animation engines used in the Infogito interface.

## Contents

1. **SmallBusinessHeroVisualizer.tsx** - Particle morphing engine (Cloud -> Sphere -> Cube).
2. **LogisticsHeroVisualizer.tsx** - 3-Phase Supply Chain (Conveyor, Globe, Sorter).
3. **IndustrialsHeroVisualizer.tsx** - 3D Rotating Turbine Engine.
4. **HealthcareHeroVisualizer.tsx** - Rotating DNA Double Helix.
5. **ResourcesHeroVisualizer.tsx** - 3D Terrain & Resource Scanner.

## Technical Requirements

*   **Framework:** React 18+ (Functional Components, Hooks)
*   **Language:** TypeScript
*   **Dependencies:** None (Pure HTML5 Canvas API)
*   **Styling:** Tailwind CSS classes are used for the container (e.g., \`w-full h-full\`). You can replace these with standard CSS if needed.

## Integration Guide

1.  **Copy the Files:** Drop the \`.tsx\` files into your components directory.
2.  **Parent Container:** These components are designed to fill their parent container. Ensure the parent \`div\` has a defined width and height (and \`position: relative\` is often helpful).

\`\`\`tsx
import { LogisticsHeroVisualizer } from './LogisticsHeroVisualizer';

const MyPage = () => {
  return (
    <div style={{ width: '100%', height: '600px', position: 'relative', background: '#000' }}>
      <LogisticsHeroVisualizer />
    </div>
  );
};
\`\`\`

## Customization

*   **Colors:** Look for \`ctx.fillStyle\` or \`ctx.strokeStyle\` variables at the top of the \`render\` function to change themes.
*   **Speed:** Adjust \`time += 0.01\` increments to speed up or slow down animations.
*   **Resolution:** The components automatically handle resizing, but you can hardcode \`width\` and \`height\` in the \`useEffect\` if necessary.

## License

Internal Use Only. Copyright 2026 Infogito.
`;

// --- SOURCE CODE STRINGS ---

const SMB_CODE = `import React, { useEffect, useRef } from 'react';

export const SmallBusinessHeroVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let w = canvas.width = canvas.parentElement?.clientWidth || 800;
        let h = canvas.height = canvas.parentElement?.clientHeight || 600;
        let frameId: number;
        let time = 0;

        // 3D PARTICLE ENGINE
        const PARTICLE_COUNT = 800;
        const CAM_Z = 800;
        const CX = w * 0.5;
        const CY = h * 0.5;

        interface Point3D { x: number; y: number; z: number }
        interface Particle {
            current: Point3D;
            target: Point3D;
            color: string;
            size: number;
        }

        const particles: Particle[] = [];
        let phase = 0; // 0: CLOUD, 1: SPHERE, 2: CUBE
        let phaseTimer = 0;
        const PHASE_DURATION = 400; 

        // Generators
        const getCloudPoint = (): Point3D => {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI * 2;
            const rMain = 250 + Math.random() * 50;
            const rTube = 80 + Math.random() * 40;
            return {
                x: (rMain + rTube * Math.cos(phi)) * Math.cos(theta),
                y: (rMain + rTube * Math.cos(phi)) * Math.sin(theta),
                z: rTube * Math.sin(phi)
            };
        };

        const getSpherePoint = (i: number, total: number, radius: number): Point3D => {
            const phi = Math.acos(-1 + (2 * i) / total);
            const theta = Math.sqrt(total * Math.PI) * phi;
            return {
                x: radius * Math.cos(theta) * Math.sin(phi),
                y: radius * Math.sin(theta) * Math.sin(phi),
                z: radius * Math.cos(phi)
            };
        };

        const getCubePoint = (i: number, total: number): Point3D => {
            const dim = Math.floor(Math.cbrt(total));
            const idx = i % (dim*dim*dim);
            const x = (idx % dim);
            const y = Math.floor((idx / dim) % dim);
            const z = Math.floor(idx / (dim * dim));
            const spacing = 40;
            const offset = (dim * spacing) / 2;
            return {
                x: x * spacing - offset,
                y: y * spacing - offset,
                z: z * spacing - offset
            };
        };

        // Init
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const colors = ['#8b5cf6', '#a78bfa', '#22d3ee', '#c4b5fd'];
            particles.push({
                current: getCloudPoint(),
                target: getCloudPoint(),
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() > 0.9 ? 2.5 : 1.2
            });
        }

        const setTargetShape = (shape: number) => {
            particles.forEach((p, i) => {
                if (shape === 0) p.target = getCloudPoint();
                else if (shape === 1) p.target = getSpherePoint(i, PARTICLE_COUNT, 220);
                else if (shape === 2) p.target = getCubePoint(i, PARTICLE_COUNT);
            });
        };

        const render = () => {
            time += 0.008;
            phaseTimer++;

            if (phaseTimer > PHASE_DURATION) {
                phaseTimer = 0;
                phase = (phase + 1) % 3;
                setTargetShape(phase);
            }

            ctx.fillStyle = '#020202';
            ctx.fillRect(0, 0, w, h);

            const rotX = time * 0.3 + (mouseRef.current.y * 0.1);
            const rotY = time * 0.4 + (mouseRef.current.x * 0.1);

            const sorted = [];
            
            for(let i=0; i<particles.length; i++) {
                const p = particles[i];
                const dx = p.target.x - p.current.x;
                const dy = p.target.y - p.current.y;
                const dz = p.target.z - p.current.z;
                
                p.current.x += dx * 0.04;
                p.current.y += dy * 0.04;
                p.current.z += dz * 0.04;

                if (phase === 0) {
                    p.current.x += Math.sin(time * 2 + i) * 0.5;
                    p.current.y += Math.cos(time * 3 + i) * 0.5;
                }

                let x = p.current.x; let y = p.current.y; let z = p.current.z;
                
                let tx = x * Math.cos(rotY) - z * Math.sin(rotY);
                let tz = z * Math.cos(rotY) + x * Math.sin(rotY);
                x = tx; z = tz;

                let ty = y * Math.cos(rotX) - z * Math.sin(rotX);
                let tz2 = z * Math.cos(rotX) + y * Math.sin(rotX);
                y = ty; z = tz2;

                const scale = CAM_Z / (CAM_Z + z);
                
                if (scale > 0) {
                    sorted.push({
                        x: CX + x * scale,
                        y: CY + y * scale,
                        z: z,
                        scale: scale,
                        color: p.color,
                        size: p.size
                    });
                }
            }

            sorted.sort((a, b) => b.z - a.z);

            for(let i=0; i<sorted.length; i++) {
                const s = sorted[i];
                const alpha = Math.min(1, (s.scale * 0.7));
                ctx.globalAlpha = alpha;
                ctx.fillStyle = s.color;
                
                if (phase === 2) {
                    const size = Math.max(1, s.size * s.scale);
                    ctx.fillRect(s.x - size/2, s.y - size/2, size, size);
                } else {
                    ctx.beginPath();
                    ctx.arc(s.x, s.y, s.size * s.scale, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            ctx.globalAlpha = 1;

            if (phase !== 0) {
                ctx.strokeStyle = phase === 2 ? 'rgba(34, 211, 238, 0.15)' : 'rgba(139, 92, 246, 0.1)';
                ctx.lineWidth = 0.5;
                for(let i=0; i<sorted.length; i+=2) {
                    const p1 = sorted[i];
                    for(let j=1; j<4; j++) {
                        if (i+j >= sorted.length) break;
                        const p2 = sorted[i+j];
                        const dist = Math.sqrt((p1.x-p2.x)**2 + (p1.y-p2.y)**2);
                        if (dist < 30 * p1.scale) {
                            ctx.beginPath();
                            ctx.moveTo(p1.x, p1.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.stroke();
                        }
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
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: ((e.clientX - rect.left) / w) * 2 - 1,
                y: ((e.clientY - rect.top) / h) * 2 - 1
            };
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(frameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="w-full h-full block" />;
};`;

const LOGISTICS_CODE = `import React, { useEffect, useRef } from 'react';

export const LogisticsHeroVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let w = canvas.parentElement?.clientWidth || window.innerWidth;
        let h = canvas.parentElement?.clientHeight || window.innerHeight;
        let frame = 0;
        let frameId: number;
        
        const PHASE_DURATION = 900; 
        
        // --- 1. INDUCTION (Packages) ---
        interface PackageBox { x: number, y: number, w: number, h: number, speed: number, type: 'standard' | 'priority' | 'hazardous' }
        const packages: PackageBox[] = [];
        for(let i=0; i<100; i++) {
            packages.push({
                x: Math.random() * w * 1.5,
                y: Math.random() * h,
                w: 20 + Math.random() * 30,
                h: 10 + Math.random() * 20,
                speed: 2 + Math.random() * 3,
                type: Math.random() > 0.9 ? 'hazardous' : Math.random() > 0.8 ? 'priority' : 'standard'
            });
        }

        // --- 2. NETWORK (Globe) ---
        interface GlobePoint { x: number, y: number, z: number, r: number }
        const globePoints: GlobePoint[] = [];
        const count = 600;
        const r = 250;
        const phi = Math.PI * (3 - Math.sqrt(5));
        for(let i=0; i<count; i++) {
            const y = 1 - (i / (count - 1)) * 2;
            const radius = Math.sqrt(1 - y * y);
            const theta = phi * i;
            const x = Math.cos(theta) * radius;
            const z = Math.sin(theta) * radius;
            globePoints.push({ x: x*r, y: y*r, z: z*r, r: Math.random() > 0.95 ? 3 : 1.5 });
        }

        // --- 3. SORTATION (Radial) ---
        interface SortParticle { r: number, angle: number, speed: number, color: string }
        const sortParticles: SortParticle[] = [];
        for(let i=0; i<150; i++) {
            sortParticles.push({
                r: Math.random() * 50,
                angle: Math.random() * Math.PI * 2,
                speed: 2 + Math.random() * 4,
                color: Math.random() > 0.5 ? '#10b981' : '#f59e0b'
            });
        }

        const render = () => {
            frame++;
            const cycle = frame % (PHASE_DURATION * 3);
            let activePhase = 0;
            let opacity = 1;
            
            if (cycle < PHASE_DURATION) activePhase = 0;
            else if (cycle < PHASE_DURATION * 2) activePhase = 1;
            else activePhase = 2;

            ctx.fillStyle = '#020202';
            ctx.fillRect(0, 0, w, h);

            if (activePhase === 0) {
                // Induction Draw
                packages.forEach(p => {
                    p.x -= p.speed;
                    if (p.x < -100) { p.x = w + Math.random() * 200; p.y = Math.random() * h; }
                    const color = p.type === 'hazardous' ? '#ef4444' : p.type === 'priority' ? '#f59e0b' : '#06b6d4';
                    ctx.fillStyle = color;
                    ctx.fillRect(p.x, p.y, p.w, p.h);
                    // 3D Side
                    ctx.fillStyle = 'rgba(255,255,255,0.1)';
                    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x+10, p.y-10); ctx.lineTo(p.x+p.w+10, p.y-10); ctx.lineTo(p.x+p.w, p.y); ctx.fill();
                });
            } else if (activePhase === 1) {
                // Globe Draw
                ctx.save();
                ctx.translate(w * 0.75, h * 0.5);
                const time = frame * 0.005;
                globePoints.forEach(p => {
                    let x = p.x * Math.cos(time) - p.z * Math.sin(time);
                    let z = p.z * Math.cos(time) + p.x * Math.sin(time);
                    const scale = 500 / (500 + z);
                    if (z > -200) {
                        ctx.fillStyle = p.r > 2 ? '#f59e0b' : '#06b6d4';
                        ctx.beginPath(); ctx.arc(x * scale, p.y * scale, p.r * scale, 0, Math.PI*2); ctx.fill();
                    }
                });
                ctx.restore();
            } else {
                // Sortation Draw
                ctx.save();
                ctx.translate(w * 0.75, h * 0.5);
                sortParticles.forEach(p => {
                    p.r += p.speed;
                    p.angle += 0.05;
                    if (p.r > 300) { p.r = 60; p.angle = Math.random() * Math.PI * 2; }
                    const px = Math.cos(p.angle) * p.r;
                    const py = Math.sin(p.angle) * p.r;
                    ctx.fillStyle = p.color;
                    ctx.beginPath(); ctx.arc(px, py, 2, 0, Math.PI*2); ctx.fill();
                });
                ctx.restore();
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
        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(frameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};`;

const HEALTHCARE_CODE = `import React, { useEffect, useRef } from 'react';

export const HealthcareHeroVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = canvas.parentElement?.clientWidth || 800;
        let height = canvas.height = canvas.parentElement?.clientHeight || 600;
        let time = 0;
        let frameId: number;

        const BASE_PAIRS = 30;
        const ROTATION_SPEED = 0.015;

        const render = () => {
            time += 1;
            ctx.fillStyle = '#020202';
            ctx.fillRect(0, 0, width, height);

            const cx = width / 2;
            const cy = height / 2;
            const amplitude = 80;
            const spacing = width / (BASE_PAIRS - 2);
            const scanX = (time * 3) % (width + 300) - 150;

            for (let i = -2; i < BASE_PAIRS + 2; i++) {
                const xBase = (i * spacing + time * 0.5) % (width + spacing * 4) - spacing * 2;
                const angle = i * 0.4 + time * ROTATION_SPEED;
                
                const distToScan = Math.abs(xBase - scanX);
                const isScanned = distToScan < 80;
                const scanIntensity = Math.max(0, 1 - distToScan / 80);

                const y1 = cy + Math.sin(angle) * amplitude;
                const z1 = Math.cos(angle);
                const y2 = cy + Math.sin(angle + Math.PI) * amplitude;
                const z2 = Math.cos(angle + Math.PI);

                if (xBase > -50 && xBase < width + 50) {
                    ctx.lineWidth = isScanned ? 2 : 1;
                    const strokeColor = isScanned ? \`rgba(255, 255, 255, \${scanIntensity * 0.8})\` : \`rgba(20, 184, 166, 0.1)\`;
                    ctx.strokeStyle = strokeColor;
                    ctx.beginPath(); ctx.moveTo(xBase, y1); ctx.lineTo(xBase, y2); ctx.stroke();
                }

                const scale1 = 1 + z1 * 0.3;
                ctx.beginPath(); ctx.arc(xBase, y1, 4 * scale1, 0, Math.PI*2); 
                ctx.fillStyle = isScanned ? \`rgba(255, 255, 255, \${scanIntensity})\` : \`rgba(45, 212, 191, \${0.2 + (z1+1)*0.3})\`;
                ctx.fill();

                const scale2 = 1 + z2 * 0.3;
                ctx.beginPath(); ctx.arc(xBase, y2, 4 * scale2, 0, Math.PI*2);
                ctx.fill();
            }

            frameId = requestAnimationFrame(render);
        };

        const handleResize = () => {
            if (canvas.parentElement) {
                width = canvas.width = canvas.parentElement.clientWidth;
                height = canvas.height = canvas.parentElement.clientHeight;
            }
        };
        window.addEventListener('resize', handleResize);
        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(frameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};`;

const INDUSTRIALS_CODE = `import React, { useEffect, useRef } from 'react';

export const IndustrialsHeroVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let w = canvas.width = canvas.parentElement?.clientWidth || 800;
        let h = canvas.height = canvas.parentElement?.clientHeight || 600;
        let time = 0;
        let frameId: number;

        const CAM_Z = 600;
        const CX = w * 0.65;
        const CY = h * 0.5;
        const MODEL_SCALE = 1.4;

        interface Point { x: number, y: number, z: number }
        const parts: { points: Point[], rotationSpeed: number, color: string, type: string }[] = [];

        // CASING
        const casingPoints: Point[] = [];
        for (let z = -250; z <= 250; z += 30) {
            const r = (130 + Math.sin(z * 0.008) * 15) * MODEL_SCALE;
            for (let a = 0; a < Math.PI * 2; a += 0.2) {
                casingPoints.push({ x: Math.cos(a) * r, y: Math.sin(a) * r, z: z });
            }
        }
        parts.push({ points: casingPoints, rotationSpeed: 0.001, color: 'rgba(255, 255, 255, 0.2)', type: 'casing' });

        // ROTORS
        for (let i = 0; i < 6; i++) {
            const z = -200 + i * 80;
            const pts: Point[] = [];
            const rOuter = 115 * MODEL_SCALE;
            const bladeCount = 12 + (i%2)*4;
            for (let b = 0; b < bladeCount; b++) {
                const angle = (Math.PI * 2 / bladeCount) * b;
                pts.push({ x: Math.cos(angle) * 40 * MODEL_SCALE, y: Math.sin(angle) * 40 * MODEL_SCALE, z });
                pts.push({ x: Math.cos(angle + 0.3) * rOuter, y: Math.sin(angle + 0.3) * rOuter, z });
            }
            parts.push({ points: pts, rotationSpeed: 0.15 * (i%2===0?1:-1), color: 'rgba(245, 158, 11, 0.8)', type: 'rotor' });
        }

        const render = () => {
            time += 0.01;
            ctx.fillStyle = '#020202';
            ctx.fillRect(0, 0, w, h);

            const camRotY = time * 0.2;
            const camRotX = Math.sin(time * 0.25) * 0.15;

            parts.forEach(part => {
                const currentRot = time * part.rotationSpeed * 50;
                ctx.beginPath();
                for (let i = 0; i < part.points.length; i++) {
                    let p = part.points[i];
                    let x = p.x, y = p.y, z = p.z;

                    if (part.type === 'rotor') {
                        const ca = Math.cos(currentRot), sa = Math.sin(currentRot);
                        const nx = x * ca - y * sa, ny = x * sa + y * ca;
                        x = nx; y = ny;
                    }

                    let tx = x * Math.cos(camRotY) - z * Math.sin(camRotY);
                    let tz = z * Math.cos(camRotY) + x * Math.sin(camRotY);
                    x = tx; z = tz;
                    let ty = y * Math.cos(camRotX) - z * Math.sin(camRotX);
                    let tz2 = z * Math.cos(camRotX) + y * Math.sin(camRotX);
                    y = ty; z = tz2;

                    const scale = CAM_Z / (CAM_Z + z);
                    const px = CX + x * scale;
                    const py = CY + y * scale;

                    if (scale > 0) {
                        if (part.type === 'rotor') {
                            if (i % 2 === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                        } else {
                            ctx.moveTo(px + 1, py); ctx.arc(px, py, 1.5 * scale, 0, Math.PI*2);
                        }
                    }
                }
                if (part.type === 'rotor') {
                    ctx.strokeStyle = part.color; ctx.stroke();
                } else {
                    ctx.fillStyle = part.color; ctx.fill();
                }
            });

            frameId = requestAnimationFrame(render);
        };

        const handleResize = () => {
            if (canvas.parentElement) {
                w = canvas.width = canvas.parentElement.clientWidth;
                h = canvas.height = canvas.parentElement.clientHeight;
            }
        };
        window.addEventListener('resize', handleResize);
        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(frameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};`;

const RESOURCES_CODE = `import React, { useEffect, useRef } from 'react';

export const ResourcesHeroVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let w = canvas.parentElement?.clientWidth || 800;
        let h = canvas.parentElement?.clientHeight || 600;
        canvas.width = w;
        canvas.height = h;

        let frame = 0;
        let animationFrameId: number;

        // State for dynamic events
        const extractions: { x: number, y: number, life: number, code: string, color: string }[] = [];
        const NODE_COLORS = ['#f59e0b', '#06b6d4', '#d946ef', '#ef4444', '#10b981', '#f43f5e'];

        const render = () => {
            frame++;
            const time = frame * 0.015;
            const scroll = frame * 1.5; // Horizontal terrain movement

            // 1. Clear Screen
            ctx.fillStyle = '#020202';
            ctx.fillRect(0, 0, w, h);

            // 2. Draw "Strata" Lines (Complex Multi-Frequency Waves)
            const lines = 45; // Increased line count for density
            const step = h / lines;
            const scanX = (time * 200) % (w + 400) - 200;

            for (let i = 0; i < lines; i++) {
                const yBase = i * step + step/2;
                
                ctx.beginPath();
                ctx.lineWidth = 1.5;
                
                // Varied line color based on depth/index
                // Emerald (150) to Blue (210) to Purple (260) shift
                const hue = 150 + (i / lines) * 80 + Math.sin(time * 0.2) * 10;
                
                for (let x = 0; x < w; x += 6) {
                    // Create terrain noise using scrolling X
                    const worldX = x + scroll;
                    
                    // Layered Frequencies for complexity
                    const base = Math.sin(worldX * 0.003 + i * 0.05) * 30;
                    const detail = Math.cos(worldX * 0.012 + time * 0.5) * 10;
                    const micro = Math.sin(worldX * 0.04) * 4;
                    const glitch = (i % 7 === 0 && Math.sin(worldX * 0.1) > 0.8) ? 8 : 0; // Occasional structured ridges
                    
                    const offset = base + detail + micro + glitch;
                    
                    // Interaction with Scan Line
                    const distToScan = Math.abs(x - scanX);
                    const scanInfluence = Math.max(0, 1 - distToScan / 80);
                    
                    // Scan "flattens" or "analyzes" the terrain slightly
                    const finalY = yBase + offset - (scanInfluence * 5);
                    
                    if (x === 0) ctx.moveTo(x, finalY);
                    else ctx.lineTo(x, finalY);
                }

                // Complex Gradient for Scan Highlight
                const grad = ctx.createLinearGradient(scanX - 100, 0, scanX + 100, 0);
                grad.addColorStop(0, \`hsla(\${hue}, 60%, 50%, 0.1)\`);
                grad.addColorStop(0.2, \`hsla(\${hue}, 60%, 60%, 0.3)\`);
                grad.addColorStop(0.5, \`hsla(\${hue - 30}, 90%, 80%, 0.8)\`); // Bright highlight in contrasting hue
                grad.addColorStop(0.8, \`hsla(\${hue}, 60%, 60%, 0.3)\`);
                grad.addColorStop(1, \`hsla(\${hue}, 60%, 50%, 0.1)\`);
                
                // Fallback for parts of line not covered by gradient
                if (scanX < -150 || scanX > w + 150) {
                    ctx.strokeStyle = \`hsla(\${hue}, 60%, 50%, 0.12)\`;
                } else {
                    ctx.strokeStyle = grad;
                }
                
                ctx.stroke();
            }

            // 3. Draw "Resources" & Logic for Extraction
            const dotCount = 10;
            for(let j=0; j<dotCount; j++) {
                const nodeColor = NODE_COLORS[j % NODE_COLORS.length];
                
                // Fixed screen positions for potential resource nodes
                const dx = (j * (w / dotCount) + (w/dotCount/2)) % w;
                // Y position fluctuates with a noise function
                const dy = (h * 0.35) + Math.sin(frame * 0.02 + j * 100) * (h * 0.35) + (h * 0.15);
                
                const distToScan = Math.abs(dx - scanX);
                
                // Trigger Extraction?
                if (distToScan < 5 && Math.random() > 0.97) {
                    const tooClose = extractions.some(e => Math.abs(e.x - dx) < 20);
                    if (!tooClose) {
                        extractions.push({ 
                            x: dx, 
                            y: dy, 
                            life: 1.0, 
                            code: Math.floor(Math.random() * 1000).toString(),
                            color: nodeColor
                        });
                    }
                }

                // Draw Passive Node
                if (distToScan < 70) {
                    // Active State
                    ctx.fillStyle = nodeColor;
                    ctx.shadowColor = nodeColor;
                    ctx.shadowBlur = 15;
                    
                    const pulse = 1 + Math.sin(frame * 0.2) * 0.3;
                    ctx.beginPath();
                    ctx.arc(dx, dy, 3 * pulse, 0, Math.PI*2);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                } else {
                    // Passive State (Faint Outline)
                    ctx.strokeStyle = \`rgba(255,255,255,0.1)\`;
                    ctx.beginPath();
                    ctx.arc(dx, dy, 1.5, 0, Math.PI*2);
                    ctx.stroke();
                }
            }

            // 4. Render Active Extractions
            for (let i = extractions.length - 1; i >= 0; i--) {
                const ex = extractions[i];
                ex.life -= 0.012; // Slower decay

                if (ex.life <= 0) {
                    extractions.splice(i, 1);
                    continue;
                }

                // Vertical Extraction Beam
                const beamAlpha = Math.sin(ex.life * Math.PI) * 0.6; 
                
                ctx.save();
                const beamGrad = ctx.createLinearGradient(0, ex.y, 0, 0);
                beamGrad.addColorStop(0, ex.color); 
                beamGrad.addColorStop(1, 'transparent'); 
                
                ctx.globalAlpha = beamAlpha;
                ctx.fillStyle = beamGrad;
                const beamWidth = 2;
                ctx.fillRect(ex.x - beamWidth/2, 0, beamWidth, ex.y);
                ctx.restore();

                // Data Packet travelling up
                const travelProgress = Math.pow(1 - ex.life, 2); // Accelerate up
                const packetY = ex.y - (travelProgress * ex.y);
                
                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = '#fff'; ctx.shadowBlur = 10;
                ctx.fillRect(ex.x - 2, packetY - 2, 4, 4);
                ctx.shadowBlur = 0;

                // Floating Label
                if (ex.life > 0.4) {
                    ctx.fillStyle = ex.color;
                    ctx.globalAlpha = beamAlpha;
                    ctx.font = '10px monospace';
                    ctx.fillText(\`[\${ex.code}]\`, ex.x + 8, packetY);
                    ctx.globalAlpha = 1;
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        const handleResize = () => {
            if (canvas.parentElement) {
                w = canvas.parentElement.clientWidth;
                h = canvas.parentElement.clientHeight;
                canvas.width = w;
                canvas.height = h;
            }
        };
        window.addEventListener('resize', handleResize);
        
        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};`;

export const DownloadHeroesPage: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'zipping' | 'ready'>('idle');
    const { navigateTo } = useNavigation();

    const handleDownload = async () => {
        setStatus('zipping');
        const zip = new JSZip();
        
        // Add Source Files
        zip.file("SmallBusinessHeroVisualizer.tsx", SMB_CODE);
        zip.file("LogisticsHeroVisualizer.tsx", LOGISTICS_CODE);
        zip.file("HealthcareHeroVisualizer.tsx", HEALTHCARE_CODE);
        zip.file("IndustrialsHeroVisualizer.tsx", INDUSTRIALS_CODE);
        zip.file("ResourcesHeroVisualizer.tsx", RESOURCES_CODE);
        
        // Add Build Instructions
        zip.file("README.md", README_CODE);

        // Generate
        const content = await zip.generateAsync({ type: "blob" });
        
        // Download
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = "infogito-hero-visualizers.zip";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setStatus('ready');
        setTimeout(() => setStatus('idle'), 2000);
    };

    return (
        <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center p-8">
            <button 
                onClick={() => navigateTo('platform')} 
                className="absolute top-8 left-8 flex items-center gap-2 text-white/50 hover:text-white transition-colors"
            >
                <ArrowLeft size={20} /> Back to Platform
            </button>

            <div className="max-w-2xl w-full text-center space-y-8">
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto border border-white/10 animate-in zoom-in duration-500">
                    <Package size={40} className="text-white/80" />
                </div>
                
                <div>
                    <h1 className="text-4xl font-serif text-white mb-4">Hero Visualizers Source</h1>
                    <p className="text-white/50 leading-relaxed">
                        Download the full, high-fidelity TypeScript/React source code for the 5 industry hero engines.
                        Includes complex 3D projection logic, particle systems, and build instructions.
                    </p>
                </div>

                <div className="grid gap-2 text-left bg-[#0c0c0e] p-6 rounded-xl border border-white/10 font-mono text-xs text-white/60 shadow-inner">
                    <div className="flex items-center gap-3 text-white/80 border-b border-white/5 pb-2 mb-2">
                        <Code size={14} /> <span>/components/</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle size={12} /> SmallBusinessHeroVisualizer.tsx
                    </div>
                    <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle size={12} /> LogisticsHeroVisualizer.tsx
                    </div>
                    <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle size={12} /> HealthcareHeroVisualizer.tsx
                    </div>
                    <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle size={12} /> IndustrialsHeroVisualizer.tsx
                    </div>
                    <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle size={12} /> ResourcesHeroVisualizer.tsx
                    </div>
                    <div className="flex items-center gap-2 text-blue-400 border-t border-white/5 pt-2 mt-2">
                        <FileText size={12} /> README.md <span className="text-white/30 ml-auto opacity-50">Build Instructions</span>
                    </div>
                </div>

                <button
                    onClick={handleDownload}
                    disabled={status === 'zipping'}
                    className="w-full py-4 bg-white hover:bg-gray-200 text-black font-bold uppercase tracking-widest text-sm rounded-xl transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                    {status === 'zipping' ? (
                        <>Compressing...</>
                    ) : status === 'ready' ? (
                        <>Download Started!</>
                    ) : (
                        <>
                            <Download size={18} /> Download .ZIP Bundle
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
