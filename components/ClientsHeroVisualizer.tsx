
import React, { useEffect, useRef } from 'react';

export const ClientsHeroVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        // Enabled alpha for transparent background rendering
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let w = canvas.width;
        let h = canvas.height;
        let frameId: number;
        let time = 0;

        // --- GEODESIC CONFIG ---
        const RADIUS = 280;
        const CAM_Z = 900;
        
        const NODE_COUNT = 150;
        const nodes: {x:number, y:number, z:number, active: number}[] = [];
        
        const phi = Math.PI * (3 - Math.sqrt(5)); 

        for(let i=0; i<NODE_COUNT; i++) {
            const y = 1 - (i / (NODE_COUNT - 1)) * 2; 
            const radiusAtY = Math.sqrt(1 - y * y); 
            
            const theta = phi * i; 
            
            const x = Math.cos(theta) * radiusAtY;
            const z = Math.sin(theta) * radiusAtY;
            
            nodes.push({ 
                x: x * RADIUS, 
                y: y * RADIUS, 
                z: z * RADIUS,
                active: Math.random() 
            });
        }

        const edges: {p1: number, p2: number}[] = [];
        for(let i=0; i<NODE_COUNT; i++) {
            for(let j=i+1; j<NODE_COUNT; j++) {
                const d = Math.pow(nodes[i].x - nodes[j].x, 2) + 
                          Math.pow(nodes[i].y - nodes[j].y, 2) + 
                          Math.pow(nodes[i].z - nodes[j].z, 2);
                
                if (d < 4500) { 
                    edges.push({p1: i, p2: j});
                }
            }
        }

        const render = () => {
            time += 0.003;
            
            if (w === 0 || h === 0) return; // Prevent rendering on zero size

            // Clear canvas while maintaining transparency
            ctx.clearRect(0, 0, w, h);

            const cx = w > 1024 ? w * 0.75 : w * 0.5; 
            const cy = h * 0.5;

            const rotY = time;
            const rotX = Math.sin(time * 0.5) * 0.2; 

            const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
            const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

            const projectedNodes: {x:number, y:number, z:number, scale:number, active: number}[] = [];
            
            for(let i=0; i<NODE_COUNT; i++) {
                const n = nodes[i];
                
                let x = n.x * cosY - n.z * sinY;
                let z = n.z * cosY + n.x * sinY;
                let y = n.y * cosX - z * sinX;
                z = z * cosX + n.y * sinX;

                const scale = CAM_Z / (CAM_Z + z);
                
                projectedNodes.push({
                    x: cx + x * scale,
                    y: cy + y * scale,
                    z: z,
                    scale: scale,
                    active: n.active
                });
            }

            ctx.lineWidth = 1;
            ctx.beginPath();
            for(let i=0; i<edges.length; i++) {
                const e = edges[i];
                const p1 = projectedNodes[e.p1];
                const p2 = projectedNodes[e.p2];

                if (p1.scale > 0 && p2.scale > 0 && p1.z > -CAM_Z + 50 && p2.z > -CAM_Z + 50) {
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                }
            }
            ctx.strokeStyle = 'rgba(105, 183, 178, 0.12)'; 
            ctx.stroke();

            const packetCount = 20;
            const packetTime = time * 5;
            
            ctx.fillStyle = '#ffffff';
            for(let i=0; i<packetCount; i++) {
                const edgeIdx = Math.floor((i * 13.37 + packetTime) % edges.length); 
                const e = edges[edgeIdx];
                const p1 = projectedNodes[e.p1];
                const p2 = projectedNodes[e.p2];
                
                if (p1.z > -500 && p2.z > -500) { 
                    const progress = (packetTime + i) % 1;
                    const px = p1.x + (p2.x - p1.x) * progress;
                    const py = p1.y + (p2.y - p1.y) * progress;
                    
                    const size = 2 * ((p1.scale + p2.scale) / 2);
                    ctx.beginPath();
                    ctx.arc(px, py, size, 0, Math.PI*2);
                    ctx.fill();
                }
            }

            for(let i=0; i<NODE_COUNT; i++) {
                const p = projectedNodes[i];
                if (p.scale <= 0) continue;

                const pulse = Math.sin(time * 3 + p.active * 10) * 0.5 + 0.5;
                const size = (1.5 + pulse) * p.scale;
                const alpha = Math.min(1, p.scale * 0.5);

                ctx.fillStyle = `rgba(105, 183, 178, ${alpha})`; 
                ctx.beginPath();
                ctx.arc(p.x, p.y, size, 0, Math.PI*2);
                ctx.fill();
                
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
                if (rect.width > 0 && rect.height > 0) {
                    w = canvas.width = rect.width;
                    h = canvas.height = rect.height;
                }
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
