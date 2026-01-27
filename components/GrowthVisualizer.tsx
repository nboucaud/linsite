
import React, { useEffect, useRef } from 'react';

export const GrowthVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // --- ENGINE STATE ---
        let animationFrameId: number;
        let w = 0;
        let h = 0;
        let tick = 0;
        
        // Phase Control
        let phase = 0; 
        let phaseTimer = 0;

        // --- CONSTANTS ---
        const STEM_COUNT = 6; // Fewer stems for cleaner look
        const GROWTH_SPEED = 2; // Slower
        const BLOOM_DURATION = 200; 
        const WITHER_DURATION = 250;

        // --- ENTITIES ---
        
        class Stem {
            x: number; y: number;
            points: {x: number, y: number}[];
            angle: number;
            width: number;
            colorHue: number;
            speed: number;
            curveFrequency: number;
            maxHeight: number;
            
            constructor(startX: number, startY: number) {
                this.x = startX;
                this.y = startY;
                this.points = [{x: startX, y: startY}];
                this.angle = -Math.PI / 2; // Up
                this.width = 2 + Math.random() * 3; // Thinner
                this.colorHue = 150 + Math.random() * 30; // Deep Green/Teal range
                this.speed = GROWTH_SPEED + Math.random() * 0.5;
                this.curveFrequency = (Math.random() - 0.5) * 0.05; // Less frantic curving
                this.maxHeight = h * (0.3 + Math.random() * 0.4); 
            }

            grow() {
                if (this.y < this.maxHeight) return;

                // Gentle steering
                this.angle += Math.sin(tick * 0.05) * this.curveFrequency;
                // Stronger righting force to keep them mostly vertical
                this.angle += (-Math.PI/2 - this.angle) * 0.03;

                this.x += Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed;

                this.points.push({x: this.x, y: this.y});
                this.width *= 0.998; // Very slow taper
            }

            draw(ctx: CanvasRenderingContext2D) {
                if (this.points.length < 2) return;

                ctx.beginPath();
                ctx.moveTo(this.points[0].x, this.points[0].y);
                
                for (let i = 1; i < this.points.length - 2; i++) {
                    const xc = (this.points[i].x + this.points[i + 1].x) / 2;
                    const yc = (this.points[i].y + this.points[i + 1].y) / 2;
                    ctx.quadraticCurveTo(this.points[i].x, this.points[i].y, xc, yc);
                }
                if (this.points.length > 2) {
                    const last = this.points[this.points.length-1];
                    ctx.lineTo(last.x, last.y);
                }

                // Much deeper, subtler colors
                let lightness = 30; // Darker base
                let alpha = 0.6; 
                
                if (phase === 2) {
                    // Wither to dark grey/brown
                    lightness = Math.max(10, 30 - phaseTimer * 0.2);
                    alpha = Math.max(0, 0.6 - phaseTimer/200);
                }

                ctx.strokeStyle = `hsla(${this.colorHue}, 60%, ${lightness}%, ${alpha})`;
                ctx.lineWidth = Math.max(0.5, this.width);
                ctx.lineCap = 'round';
                ctx.stroke();
            }
        }

        class Flower {
            x: number; y: number;
            size: number = 0;
            targetSize: number;
            petalCount: number;
            hue: number;
            rotation: number = 0;
            spinSpeed: number;
            
            vx: number = 0; vy: number = 0;
            isFalling: boolean = false;
            opacity: number = 0;

            constructor(x: number, y: number) {
                this.x = x;
                this.y = y;
                this.targetSize = 10 + Math.random() * 15; // Smaller flowers
                this.petalCount = 4 + Math.floor(Math.random() * 4);
                this.hue = 35 + Math.random() * 15; // Narrow Amber/Gold range
                this.spinSpeed = (Math.random() - 0.5) * 0.02;
            }

            update() {
                if (phase === 1) {
                    // Bloom slowly
                    this.opacity = Math.min(0.8, this.opacity + 0.01);
                    this.size += (this.targetSize - this.size) * 0.03;
                    this.rotation += this.spinSpeed;
                } 
                else if (phase === 2) {
                    // Fall gently
                    if (!this.isFalling) {
                        this.isFalling = true;
                        this.vx = (Math.random() - 0.5) * 1.5;
                        this.vy = 0.5;
                    }
                    this.x += this.vx;
                    this.y += this.vy;
                    this.vy += 0.05; // Low gravity
                    this.rotation += this.spinSpeed;
                    this.opacity -= 0.005;
                }
            }

            draw(ctx: CanvasRenderingContext2D) {
                if (this.size < 0.5 || this.opacity <= 0) return;

                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);

                // Very subtle glow
                ctx.shadowBlur = phase === 2 ? 0 : 10;
                ctx.shadowColor = `hsla(${this.hue}, 80%, 40%, 0.5)`;

                // Petals
                ctx.fillStyle = `hsla(${this.hue}, 70%, 50%, ${this.opacity})`;
                ctx.strokeStyle = `hsla(${this.hue}, 90%, 70%, ${this.opacity * 0.5})`;
                ctx.lineWidth = 0.5;

                for (let i = 0; i < this.petalCount; i++) {
                    ctx.beginPath();
                    ctx.rotate((Math.PI * 2) / this.petalCount);
                    ctx.moveTo(0, 0);
                    ctx.bezierCurveTo(this.size/2, -this.size/2, this.size, -this.size/4, this.size, 0);
                    ctx.bezierCurveTo(this.size, this.size/4, this.size/2, this.size/2, 0, 0);
                    ctx.fill();
                    ctx.stroke();
                }
                
                // Center dot
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(0, 0, 1.5, 0, Math.PI*2);
                ctx.fill();

                ctx.restore();
            }
        }

        // --- INSTANCES ---
        let stems: Stem[] = [];
        let flowers: Flower[] = [];

        const reset = () => {
            w = canvas.width = canvas.parentElement?.clientWidth || 800;
            h = canvas.height = canvas.parentElement?.clientHeight || 600;
            
            stems = [];
            flowers = [];
            phase = 0;
            phaseTimer = 0;
            tick = 0;

            const spacing = w / (STEM_COUNT + 1);
            for(let i=0; i<STEM_COUNT; i++) {
                // More centered distribution
                const x = (w * 0.3) + Math.random() * (w * 0.4);
                stems.push(new Stem(x, h + 10));
            }
        };

        const loop = () => {
            tick++;
            
            // Heavier trail for darker background
            ctx.fillStyle = 'rgba(5, 8, 10, 0.25)'; 
            ctx.fillRect(0, 0, w, h);

            // --- PHASE LOGIC ---
            if (phase === 0) {
                let allDone = true;
                stems.forEach(stem => {
                    stem.grow();
                    if (stem.y > stem.maxHeight) allDone = false;
                });
                
                if (allDone || tick > 300) {
                    phase = 1;
                    stems.forEach(s => {
                        const tip = s.points[s.points.length - 1];
                        flowers.push(new Flower(tip.x, tip.y));
                    });
                }
            } 
            else if (phase === 1) {
                phaseTimer++;
                if (phaseTimer > BLOOM_DURATION) {
                    phase = 2;
                    phaseTimer = 0;
                }
            } 
            else if (phase === 2) {
                phaseTimer++;
                if (phaseTimer > WITHER_DURATION) {
                    reset();
                }
            }

            // --- RENDER ---
            // Removed 'screen' composite mode for lower intensity
            ctx.globalCompositeOperation = 'source-over';
            
            stems.forEach(s => s.draw(ctx));
            
            flowers.forEach(f => {
                f.update();
                f.draw(ctx);
            });

            // Very occasional, faint firefly
            if (phase === 1 && Math.random() > 0.95) {
                const f = flowers[Math.floor(Math.random() * flowers.length)];
                if (f) {
                    const angle = Math.random() * Math.PI * 2;
                    const r = Math.random() * f.size * 1.5;
                    const px = f.x + Math.cos(angle) * r;
                    const py = f.y + Math.sin(angle) * r;
                    ctx.fillStyle = 'rgba(255, 255, 200, 0.3)';
                    ctx.beginPath(); ctx.arc(px, py, 1, 0, Math.PI*2); ctx.fill();
                }
            }

            animationFrameId = requestAnimationFrame(loop);
        };

        const handleResize = () => {
            if (canvas.parentElement) {
                w = canvas.width = canvas.parentElement.clientWidth;
                h = canvas.height = canvas.parentElement.clientHeight;
                reset();
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); 
        loop();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="w-full h-full block opacity-70" />; // Lower overall opacity
};
