
import React, { useEffect, useRef } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { Shield } from 'lucide-react';

const CompBackVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let w = canvas.parentElement?.clientWidth || 300;
        let h = canvas.parentElement?.clientHeight || 300;
        canvas.width = w; canvas.height = h;

        const nodes: any[] = []; 
        for(let i=0; i<40; i++) {
            nodes.push({ 
                x: Math.random()*w, 
                y: Math.random()*h, 
                vx: (Math.random()-0.5) * 0.5, 
                vy: (Math.random()-0.5) * 0.5 
            });
        }

        let frameId: number;
        const render = () => {
            // Smooth trails
            ctx.clearRect(0, 0, w, h);
            
            // Draw connections
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = 'rgba(105, 183, 178, 0.15)'; 
            
            for(let i=0; i<nodes.length; i++) {
                const n = nodes[i];
                n.x += n.vx; 
                n.y += n.vy;
                
                // Wrap
                if(n.x < 0) n.x = w; if(n.x > w) n.x = 0;
                if(n.y < 0) n.y = h; if(n.y > h) n.y = 0;

                ctx.fillStyle = '#69B7B2';
                ctx.beginPath(); ctx.arc(n.x, n.y, 1.5, 0, Math.PI*2); ctx.fill();

                for(let j=i+1; j<nodes.length; j++) {
                    const n2 = nodes[j];
                    const d = (n.x-n2.x)**2 + (n.y-n2.y)**2;
                    if(d < 15000) { // approx 122px
                        ctx.beginPath(); 
                        ctx.moveTo(n.x, n.y); 
                        ctx.lineTo(n2.x, n2.y); 
                        ctx.stroke(); 
                    }
                }
            }
            frameId = requestAnimationFrame(render);
        };
        render();

        const resize = () => {
            if (canvas.parentElement) {
                w = canvas.width = canvas.parentElement.clientWidth;
                h = canvas.height = canvas.parentElement.clientHeight;
            }
        };
        window.addEventListener('resize', resize);
        return () => { 
            window.removeEventListener('resize', resize); 
            cancelAnimationFrame(frameId); 
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" />;
};

export const SiteFooter: React.FC = () => {
    const { navigateTo } = useNavigation();

    return (
        <footer className="relative bg-[#020202] border-t border-white/10 overflow-hidden font-sans">
            {/* Visualizer Background */}
            <div className="absolute inset-0 z-0">
                <CompBackVisualizer />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-transparent" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-20">
                    
                    {/* Brand Column */}
                    <div className="md:col-span-4 space-y-6">
                        <img 
                            src="https://uapriywlkpcpupdp.public.blob.vercel-storage.com/brand_logo_infogito.webp" 
                            alt="Infogito" 
                            className="h-8 w-auto opacity-80"
                        />
                        <p className="text-white/50 text-sm leading-relaxed max-w-xs">
                            Mobilizing knowledge for high-stakes operations. We build the immune system for the information age.
                        </p>
                        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#69B7B2]">
                            <div className="w-2 h-2 bg-[#69B7B2] rounded-full animate-pulse" />
                            System Operational
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div className="md:col-span-2">
                        <h4 className="text-white font-bold text-sm mb-6">Platform</h4>
                        <ul className="space-y-4 text-sm text-white/50">
                            <li><button onClick={() => navigateTo('platform')} className="hover:text-white transition-colors">Overview</button></li>
                            <li><button onClick={() => navigateTo('platform/features/agentic-workflows')} className="hover:text-white transition-colors">Agent Workflows</button></li>
                            <li><button onClick={() => navigateTo('platform/features/security-and-privacy')} className="hover:text-white transition-colors">Security & Governance</button></li>
                            <li><button onClick={() => navigateTo('trust-center')} className="hover:text-white transition-colors flex items-center gap-2"><Shield size={12} /> Trust Center</button></li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div className="md:col-span-3">
                        <h4 className="text-white font-bold text-sm mb-6">Industries</h4>
                        <ul className="space-y-4 text-sm text-white/50">
                            <li><button onClick={() => navigateTo('our-clients/industries/logistics')} className="hover:text-white transition-colors">Logistics</button></li>
                            <li><button onClick={() => navigateTo('our-clients/industries/business-operations')} className="hover:text-white transition-colors">Business Operations</button></li>
                            <li><button onClick={() => navigateTo('our-clients/industries/industrials')} className="hover:text-white transition-colors">Industrial Systems</button></li>
                            <li><button onClick={() => navigateTo('our-clients/industries/healthcare')} className="hover:text-white transition-colors">Healthcare</button></li>
                            <li><button onClick={() => navigateTo('our-clients/industries/natural-resources')} className="hover:text-white transition-colors">Natural Resources</button></li>
                        </ul>
                    </div>

                    {/* Links Column 3 */}
                    <div className="md:col-span-3">
                        <h4 className="text-white font-bold text-sm mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-white/50">
                            <li><button onClick={() => navigateTo('about/careers')} className="hover:text-white transition-colors">Infogito Labs</button></li>
                            <li><button onClick={() => navigateTo('our-clients')} className="hover:text-white transition-colors">Our Clients</button></li>
                            <li><button onClick={() => navigateTo('contact')} className="hover:text-white transition-colors">Contact Us</button></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest font-mono text-white/30">
                    <div>© 2026 Infogito LLC. All Rights Reserved.</div>
                    <div className="flex gap-8">
                        <button className="hover:text-white transition-colors">Privacy Policy</button>
                        <button className="hover:text-white transition-colors">Terms of Service</button>
                        <span>NYC /// LDN /// SGP</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
