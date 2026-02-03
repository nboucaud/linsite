
import React, { useEffect, useRef } from 'react';

export const ClientsHeroVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        // alpha: false improves performance
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let w = canvas.width;
        let h = canvas.height;
        let frameId: number;
        let time = 0;

        // --- GEODESIC CONFIG ---
        const RADIUS = 280;
        const CAM_Z = 900;
        
        // Define Vertices for a rudimentary geodesic approximation (Icosahedron base subdivided)
        // Simplification: We'll generate points on a sphere using Fibonacci lattice for even distribution
        // This looks cleaner and more "engineered" than a random cloud
        const NODE_COUNT = 150;
        const nodes: {x:number, y:number, z:number, active: number}[] = [];
        
        const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

        for(let i=0; i<NODE_COUNT; i++) {
            const y = 1 - (i / (NODE_COUNT - 1)) * 2; // y goes from 1 to -1
            const radiusAtY = Math.sqrt(1 - y * y); // radius at y
            
            const theta = phi * i; 
            
            const x = Math.cos(theta) * radiusAtY;
            const z = Math.sin(theta) * radiusAtY;
            
            nodes.push({ 
                x: x * RADIUS, 
                y: y * RADIUS, 
                z: z * RADIUS,
                active: Math.random() // Random initial pulse phase
            });
        }

        // Pre-calculate connections (edges)
        // Connect each node to its nearest neighbors to form the "Lattice"
        const edges: {p1: number, p2: number}[] = [];
        for(let i=0; i<NODE_COUNT; i++) {
            for(let j=i+1; j<NODE_COUNT; j++) {
                const d = Math.pow(nodes[i].x - nodes[j].x, 2) + 
                          Math.pow(nodes[i].y - nodes[j].y, 2) + 
                          Math.pow(nodes[i].z - nodes[j].z, 2);
                
                // Threshold for connection (squared distance)
                if (d < 4500) { 
                    edges.push({p1: i, p2: j});
                }
            }
        }

        const render = () => {
            time += 0.003; // Slow, stable rotation
            
            ctx.fillStyle = '#020202';
            ctx.fillRect(0, 0, w, h);

            const cx = w > 1024 ? w * 0.75 : w * 0.5; // Offset right on desktop
            const cy = h * 0.5;

            // Rotation Matrices
            const rotY = time;
            const rotX = Math.sin(time * 0.5) * 0.2; // Gentle tilt

            const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
            const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

            // Project Nodes
            const projectedNodes: {x:number, y:number, z:number, scale:number, active: number}[] = [];
            
            for(let i=0; i<NODE_COUNT; i++) {
                const n = nodes[i];
                
                // Rotate
                let x = n.x * cosY - n.z * sinY;
                let z = n.z * cosY + n.x * sinY;
                let y = n.y * cosX - z * sinX;
                z = z * cosX + n.y * sinX;

                // Perspective
                const scale = CAM_Z / (CAM_Z + z);
                
                projectedNodes.push({
                    x: cx + x * scale,
                    y: cy + y * scale,
                    z: z,
                    scale: scale,
                    active: n.active
                });
            }

            // Draw Edges (The Infrastructure)
            ctx.lineWidth = 1;
            ctx.beginPath();
            for(let i=0; i<edges.length; i++) {
                const e = edges[i];
                const p1 = projectedNodes[e.p1];
                const p2 = projectedNodes[e.p2];

                // Visibility check
                if (p1.scale > 0 && p2.scale > 0 && p1.z > -CAM_Z + 50 && p2.z > -CAM_Z + 50) {
                    // Depth cueing for opacity
                    const depthAlpha = Math.min(1, (p1.scale + p2.scale) * 0.15);
                    
                    // "Pulse" packet logic traveling along edge?
                    // Simplified: just draw line for structure
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                }
            }
            ctx.strokeStyle = 'rgba(105, 183, 178, 0.12)'; // Faint Teal Structure
            ctx.stroke();

            // Draw Data Packets (Flow)
            // We simulate packets moving between random connected nodes
            const packetCount = 20;
            const packetTime = time * 5;
            
            ctx.fillStyle = '#ffffff';
            for(let i=0; i<packetCount; i++) {
                // Use hash-like selection to keep packets stable on specific edges
                const edgeIdx = Math.floor((i * 13.37 + packetTime) % edges.length); 
                const e = edges[edgeIdx];
                const p1 = projectedNodes[e.p1];
                const p2 = projectedNodes[e.p2];
                
                if (p1.z > -500 && p2.z > -500) { // Only draw foreground packets
                    const progress = (packetTime + i) % 1;
                    const px = p1.x + (p2.x - p1.x) * progress;
                    const py = p1.y + (p2.y - p1.y) * progress;
                    
                    const size = 2 * ((p1.scale + p2.scale) / 2);
                    ctx.beginPath();
                    ctx.arc(px, py, size, 0, Math.PI*2);
                    ctx.fill();
                }
            }

            // Draw Nodes (The Endpoints)
            for(let i=0; i<NODE_COUNT; i++) {
                const p = projectedNodes[i];
                if (p.scale <= 0) continue;

                // Pulse the active nodes
                const pulse = Math.sin(time * 3 + p.active * 10) * 0.5 + 0.5;
                const size = (1.5 + pulse) * p.scale;
                const alpha = Math.min(1, p.scale * 0.5);

                ctx.fillStyle = `rgba(105, 183, 178, ${alpha})`; // Teal
                ctx.beginPath();
                ctx.arc(p.x, p.y, size, 0, Math.PI*2);
                ctx.fill();
                
                // Highlight rare "Hub" nodes
                if (i % 20 === 0) {
                    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
                    ctx.lineWidth = 1 * p.scale;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, size * 2, 0, Math.PI*2);
                    ctx.stroke();
                }
            }

            frameId = requestAnimationFrame(render);
        };

        const handleResize = () => {
            if (canvas.parentElement) {
                const rect = canvas.parentElement.getBoundingClientRect();
                w = canvas.width = rect.width;
                h = canvas.height = rect.height;
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
