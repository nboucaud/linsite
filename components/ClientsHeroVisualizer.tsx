
import React, { useEffect, useRef } from 'react';

export const ClientsHeroVisualizer: React.FC = () => {
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
        const CAM_Z = 1200;
        const SCALE = 350;
        
        // Icosahedron Vertices (Golden Ratio)
        const t = (1.0 + Math.sqrt(5.0)) / 2.0;
        const rawVerts = [
            [-1,  t,  0], [ 1,  t,  0], [-1, -t,  0], [ 1, -t,  0],
            [ 0, -1,  t], [ 0,  1,  t], [ 0, -1, -t], [ 0,  1, -t],
            [ t,  0, -1], [ t,  0,  1], [-t,  0, -1], [-t,  0,  1]
        ];

        // Connections (Indices)
        const edges = [
            [0, 11], [0, 5], [0, 1], [0, 7], [0, 10],
            [1, 0], [1, 5], [1, 9], [1, 8], [1, 7],
            [2, 3], [2, 4], [2, 11], [2, 10], [2, 6],
            [3, 2], [3, 4], [3, 9], [3, 8], [3, 6],
            [4, 2], [4, 3], [4, 9], [4, 5], [4, 11],
            [5, 0], [5, 1], [5, 9], [5, 4], [5, 11],
            [6, 2], [6, 3], [6, 8], [6, 7], [6, 10],
            [7, 0], [7, 1], [7, 8], [7, 6], [7, 10],
            [8, 1], [8, 3], [8, 6], [8, 7], [8, 9],
            [9, 1], [9, 3], [9, 4], [9, 5], [9, 8],
            [10, 0], [10, 2], [10, 6], [10, 7], [10, 11],
            [11, 0], [11, 2], [11, 4], [11, 5], [11, 10]
        ];

        // Normalize vertices
        const nodes = rawVerts.map(v => {
            const len = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
            return { x: v[0]/len * SCALE, y: v[1]/len * SCALE, z: v[2]/len * SCALE };
        });

        // Add sub-nodes on edges for complexity
        const subNodes: {x:number, y:number, z:number}[] = [];
        edges.forEach(e => {
            const n1 = nodes[e[0]];
            const n2 = nodes[e[1]];
            // Midpoint
            subNodes.push({
                x: (n1.x + n2.x) / 2,
                y: (n1.y + n2.y) / 2,
                z: (n1.z + n2.z) / 2
            });
        });

        const render = () => {
            time += 0.005; // Slow, stable rotation
            
            ctx.fillStyle = '#020202';
            ctx.fillRect(0, 0, w, h);

            const cx = w > 1024 ? w * 0.75 : w * 0.5;
            const cy = h * 0.5;

            // Rotation
            const rotY = time;
            const rotX = Math.sin(time * 0.5) * 0.2;

            const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
            const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

            const project = (p: {x:number, y:number, z:number}) => {
                let x = p.x * cosY - p.z * sinY;
                let z = p.z * cosY + p.x * sinY;
                let y = p.y * cosX - z * sinX;
                z = z * cosX + p.y * sinX;
                const scale = CAM_Z / (CAM_Z + z);
                return { x: cx + x * scale, y: cy + y * scale, z, scale };
            };

            const projNodes = nodes.map(project);
            const projSub = subNodes.map(project);

            // Draw Core Structure (Background Faces? No, wireframe is cleaner)
            
            // 1. Draw Edges (Heavy)
            ctx.lineWidth = 2;
            edges.forEach(e => {
                const p1 = projNodes[e[0]];
                const p2 = projNodes[e[1]];
                
                if (p1.z > -500 && p2.z > -500) {
                    const depth = (p1.scale + p2.scale) / 2;
                    ctx.strokeStyle = `rgba(105, 183, 178, ${0.1 * depth})`;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });

            // 2. Draw Sub-Nodes (Data points)
            projSub.forEach(p => {
                if (p.z > -500) {
                    const size = 1.5 * p.scale;
                    ctx.fillStyle = `rgba(255, 255, 255, ${0.3 * p.scale})`;
                    ctx.beginPath(); ctx.arc(p.x, p.y, size, 0, Math.PI*2); ctx.fill();
                }
            });

            // 3. Draw Main Nodes (Hubs)
            projNodes.forEach((p, i) => {
                if (p.z > -500) {
                    // Pulse
                    const pulse = Math.sin(time * 5 + i) * 0.2 + 1;
                    const size = 6 * p.scale * pulse;
                    
                    // Glow
                    ctx.fillStyle = 'rgba(105, 183, 178, 0.2)';
                    ctx.beginPath(); ctx.arc(p.x, p.y, size * 2, 0, Math.PI*2); ctx.fill();

                    // Core
                    ctx.fillStyle = '#69B7B2';
                    ctx.beginPath(); ctx.arc(p.x, p.y, size * 0.5, 0, Math.PI*2); ctx.fill();
                    
                    // Label (Abstract ID)
                    if (p.scale > 0.8) {
                        ctx.fillStyle = `rgba(255,255,255,${(p.scale-0.8)*2})`;
                        ctx.font = '8px monospace';
                        ctx.fillText(`NODE_${i.toString().padStart(2,'0')}`, p.x + 10, p.y);
                    }
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
        handleResize();
        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(frameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full mix-blend-screen" />;
};
