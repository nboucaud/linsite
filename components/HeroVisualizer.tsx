
import React, { useEffect, useRef } from 'react';

export const HeroVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false }); // Optimization
        if (!ctx) return;

        let width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
        let height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
        let frameId: number;
        let time = 0;

        // Camera State
        let targetRotX = 0;
        let targetRotY = 0;

        // Particles
        const PARTICLE_COUNT = 800;
        const particles = new Float32Array(PARTICLE_COUNT * 3); // x, y, z
        const colors = new Uint8Array(PARTICLE_COUNT); // 0 or 1

        // Initialize particles in a sphere/globe shape
        const phi = Math.PI * (3 - Math.sqrt(5)); 
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const y = 1 - (i / (PARTICLE_COUNT - 1)) * 2; 
            const radius = Math.sqrt(1 - y * y);
            const theta = phi * i; 
            const x = Math.cos(theta) * radius;
            const z = Math.sin(theta) * radius;
            
            particles[i * 3] = x * 350;
            particles[i * 3 + 1] = y * 350;
            particles[i * 3 + 2] = z * 350;
            
            colors[i] = Math.random() > 0.85 ? 1 : 0; // 1 = Accent, 0 = White
        }

        const render = () => {
            time += 0.005;
            
            // Clear
            ctx.fillStyle = '#020202';
            ctx.fillRect(0, 0, width, height);

            const cx = width / 2;
            const cy = height / 2;
            const perspective = 800;

            // Camera Smoothing
            const mouseX = mouseRef.current.x;
            const mouseY = mouseRef.current.y;
            
            targetRotY += (mouseX * 0.2 - targetRotY) * 0.05;
            targetRotX += (mouseY * 0.2 - targetRotX) * 0.05;

            // Apply base rotation from time
            const autoRotY = time * 0.2;
            
            const rotY = targetRotY + autoRotY;
            const rotX = targetRotX;

            const cosY = Math.cos(rotY);
            const sinY = Math.sin(rotY);
            const cosX = Math.cos(rotX); 
            const sinX = Math.sin(rotX);

            ctx.lineWidth = 1;

            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const px = particles[i * 3];
                const py = particles[i * 3 + 1];
                const pz = particles[i * 3 + 2];

                // Rotate Y
                let x = px * cosY - pz * sinY;
                let z = pz * cosY + px * sinY;
                
                // Rotate X
                let y = py * cosX - z * sinX;
                z = z * cosX + py * sinX;

                // Project
                const scale = perspective / (perspective + z + 500);
                const screenX = cx + x * scale;
                const screenY = cy + y * scale;

                if (scale > 0 && z > -perspective) {
                    const size = Math.max(0.5, scale * 2);
                    const alpha = Math.min(1, (z + 400) / 800); 
                    
                    ctx.globalAlpha = Math.max(0.1, alpha);
                    ctx.fillStyle = colors[i] === 1 ? '#69B7B2' : '#ffffff';
                    
                    ctx.beginPath();
                    ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            
            ctx.globalAlpha = 1;
            frameId = requestAnimationFrame(render);
        };

        const handleResize = () => {
            if (canvas.parentElement) {
                width = canvas.parentElement.clientWidth;
                height = canvas.parentElement.clientHeight;
                canvas.width = width;
                canvas.height = height;
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / width) * 2 - 1;
            const y = ((e.clientY - rect.top) / height) * 2 - 1;
            mouseRef.current = { x, y };
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

    return <canvas ref={canvasRef} className="block w-full h-full opacity-60" />;
};
