
import React, { useState, useEffect, useRef } from 'react';
import { Send, MapPin, Mail, Globe, CheckCircle2, ArrowRight, Radio, Building2, ChevronDown, CheckSquare } from 'lucide-react';

// --- SHADER 1: CONTACT BACKGROUND ---
const ContactBackgroundShader: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const gl = canvas.getContext('webgl2');
        if (!gl) return;

        const vsSource = `#version 300 es
            in vec2 position;
            void main() {
                gl_Position = vec4(position, 0.0, 1.0);
            }
        `;

        const fsSource = `#version 300 es
            precision highp float;
            uniform vec2 resolution;
            uniform float time;
            out vec4 fragColor;

            void main() {
                vec2 r = resolution;
                float t = time * 0.2; 
                vec4 o = vec4(0.0);
                
                // Centered UVs - Corrected to look into -Z
                vec2 uv = (gl_FragCoord.xy - r * 0.5) / min(r.x, r.y);
                
                // ZOOM: Scale UVs down to zoom in (0.75 scale = ~33% zoom in)
                uv *= 0.75;

                vec3 rd = normalize(vec3(uv, -1.0));
                
                float z = 0.0;
                float d = 0.0;
                
                for(float i=0.0; i<40.0; i++) {
                    vec3 p = z * rd;
                    
                    // Domain distortion: p=vec3(atan(p.z+=9.,p.x+1.)*2., .6*p.y+t+t, length(p.xz)-3.)
                    // p.z += 9.
                    p.z += 9.0;
                    
                    // x' = atan(z, x+1)*2
                    float nx = atan(p.z, p.x + 1.0) * 2.0;
                    
                    // y' = .6y + 2t
                    float ny = 0.6 * p.y + t + t;
                    
                    // z' = length(xz) - 3
                    float nz = length(p.xz) - 3.0;
                    
                    vec3 p_loop = vec3(nx, ny, nz);
                    
                    // Inner Loop
                    for(float j=1.0; j<7.0; j++) {
                        p_loop += sin(p_loop.yzx * j + t + 0.5 * i) / j;
                    }
                    
                    // Distance field
                    vec3 v3 = 0.3 * cos(p_loop) - 0.3;
                    d = 0.4 * length(vec4(v3, p_loop.z)); 
                    
                    // Safer d to prevent explosion
                    d = max(d, 0.002);
                    
                    z += d;
                    
                    // Color accumulation
                    // o += (cos(p.y+i*.4+vec4(6,1,2,0))+1.)/d
                    o += (cos(p_loop.y + i * 0.4 + vec4(6.0, 1.0, 2.0, 0.0)) + 1.0) / d;
                }
                
                // Tone mapping
                o = tanh(o * o / 6000.0);
                
                // BRIGHTNESS: Decrease by 12.5%
                o *= 0.875;
                
                // Output
                fragColor = vec4(o.rgb, 1.0);
            }
        `;

        const createShader = (type: number, source: string) => {
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            return shader;
        };

        const vertexShader = createShader(gl.VERTEX_SHADER, vsSource);
        const fragmentShader = createShader(gl.FRAGMENT_SHADER, fsSource);
        if (!vertexShader || !fragmentShader) return;

        const program = gl.createProgram();
        if (!program) return;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.useProgram(program);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

        const positionLoc = gl.getAttribLocation(program, "position");
        gl.enableVertexAttribArray(positionLoc);
        gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

        const timeLoc = gl.getUniformLocation(program, "time");
        const resLoc = gl.getUniformLocation(program, "resolution");

        let startTime = Date.now();
        let frameId: number;

        const render = () => {
            if (!canvas || !container) return;
            const dpr = window.devicePixelRatio || 1;
            const displayWidth = container.clientWidth;
            const displayHeight = container.clientHeight;
            
            if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
                canvas.width = displayWidth * dpr;
                canvas.height = displayHeight * dpr;
                gl.viewport(0, 0, canvas.width, canvas.height);
            }

            gl.uniform2f(resLoc, canvas.width, canvas.height);
            gl.uniform1f(timeLoc, (Date.now() - startTime) * 0.001);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            frameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(frameId);
            gl.deleteProgram(program);
        };
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 w-full h-full bg-[#020202]">
            <canvas ref={canvasRef} className="block w-full h-full opacity-60 mix-blend-screen" />
        </div>
    );
};

// --- SHADER 2: ELEMENT SHADER (Dimmed) ---
const ContactElementShader: React.FC<{ className?: string }> = ({ className }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const gl = canvas.getContext('webgl2');
        if (!gl) return;

        const vsSource = `#version 300 es
            in vec2 position;
            void main() {
                gl_Position = vec4(position, 0.0, 1.0);
            }
        `;

        const fsSource = `#version 300 es
            precision highp float;
            uniform vec2 resolution;
            uniform float time;
            out vec4 fragColor;

            void main() {
                vec2 r = resolution;
                float t = time * 0.5;
                vec4 o = vec4(0.0);
                
                vec2 uv = (gl_FragCoord.xy - r * 0.5) / min(r.x, r.y);
                vec3 rd = normalize(vec3(uv, 1.0));
                
                vec3 c = vec3(0.0);
                vec3 p = vec3(0.0);
                float z = 0.0;
                float f = 0.0;
                
                for(float i=0.0; i<40.0; i++) {
                    p = z * rd;
                    p.z -= t;
                    c = p;
                    
                    float f_loop = 0.3;
                    for(int j=0; j<5; j++) {
                        f_loop += 1.0;
                        p += cos(p.yzx * f_loop + i / 0.4) / f_loop;
                    }
                    
                    p = mix(c, p, 0.3);
                    
                    float term = dot(cos(p), sin(p.yzx / 0.6)) + abs(p.y) - 3.0;
                    f = 0.2 * abs(term);
                    z += f;
                    
                    o += (cos(z + vec4(6.0, 1.0, 2.0, 0.0)) + 2.0) / f / z;
                }
                
                o = tanh(o / 800.0);
                
                // Dim brightness significantly for text readability
                // Reduced an additional 33% from 0.25 -> ~0.16
                o *= 0.16; 
                
                fragColor = vec4(o.rgb, 1.0);
            }
        `;

        const createShader = (type: number, source: string) => {
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            return shader;
        };

        const vertexShader = createShader(gl.VERTEX_SHADER, vsSource);
        const fragmentShader = createShader(gl.FRAGMENT_SHADER, fsSource);
        if (!vertexShader || !fragmentShader) return;

        const program = gl.createProgram();
        if (!program) return;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.useProgram(program);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

        const positionLoc = gl.getAttribLocation(program, "position");
        gl.enableVertexAttribArray(positionLoc);
        gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

        const timeLoc = gl.getUniformLocation(program, "time");
        const resLoc = gl.getUniformLocation(program, "resolution");

        let startTime = Date.now();
        let frameId: number;

        const render = () => {
            if (!canvas || !container) return;
            const dpr = window.devicePixelRatio || 1;
            const displayWidth = container.clientWidth;
            const displayHeight = container.clientHeight;
            
            if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
                canvas.width = displayWidth * dpr;
                canvas.height = displayHeight * dpr;
                gl.viewport(0, 0, canvas.width, canvas.height);
            }

            gl.uniform2f(resLoc, canvas.width, canvas.height);
            gl.uniform1f(timeLoc, (Date.now() - startTime) * 0.001);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            frameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(frameId);
            gl.deleteProgram(program);
        };
    }, []);

    return (
        <div ref={containerRef} className={`absolute inset-0 w-full h-full bg-[#0c0c0e] ${className}`}>
            <canvas ref={canvasRef} className="block w-full h-full opacity-100" />
            <div className="absolute inset-0 bg-black/60" /> {/* Extra overlay for contrast */}
        </div>
    );
};

export const ContactPage: React.FC = () => {
    const [formState, setFormState] = useState<'idle' | 'sending' | 'sent'>('idle');
    const [sector, setSector] = useState('');
    const [otherSector, setOtherSector] = useState('');
    const [captchaChecked, setCaptchaChecked] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!captchaChecked) {
            alert("Please verify you are human.");
            return;
        }
        setFormState('sending');
        setTimeout(() => setFormState('sent'), 2000);
    };

    return (
        <div className="relative min-h-screen bg-[#020202] text-white pt-24 font-sans overflow-x-hidden selection:bg-[#69B7B2]/30 selection:text-[#69B7B2]">
            
            {/* Visualizer Background (Global) */}
            <div className="fixed inset-0 z-0">
                <ContactBackgroundShader />
                <div className="absolute inset-0 bg-gradient-to-r from-[#020202] via-[#020202]/80 to-transparent" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-20 min-h-[85vh] items-center">
                
                {/* LEFT: Context & Offices */}
                <div className="w-full lg:w-1/2 space-y-16">
                    <div className="animate-in slide-in-from-left duration-700">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#69B7B2]/10 border border-[#69B7B2]/20 text-[#69B7B2] text-[10px] font-bold uppercase tracking-widest mb-8 backdrop-blur-sm">
                            <Radio size={12} className="animate-pulse" />
                            <span>Contact Us</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-serif text-white mb-8 leading-[0.9] tracking-tighter drop-shadow-2xl">
                            Get In <br/>
                            <span className="text-[#69B7B2] italic">Touch.</span>
                        </h1>
                        <p className="text-xl text-white/70 leading-relaxed max-w-lg font-light border-l border-white/20 pl-6 drop-shadow-lg">
                            Conversations start here — whether you’re exploring ideas, partnerships, or practical questions. It all starts with a conversation.
                        </p>
                    </div>

                    {/* MAIN HQ CARD */}
                    <div className="animate-in slide-in-from-bottom-8 duration-700 delay-100">
                        <div className="relative group overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
                            {/* Card Shader Background */}
                            <ContactElementShader />
                            
                            <div className="relative p-10 flex items-start justify-between z-10">
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                                        <span className="text-[10px] font-mono text-green-500 uppercase tracking-widest">Headquarters</span>
                                    </div>
                                    <h3 className="text-3xl font-serif text-white mb-2">New York City</h3>
                                    <p className="text-white/60 text-sm mb-6 max-w-[200px] leading-relaxed">
                                        New York, NY
                                    </p>
                                    
                                    <div className="flex flex-col gap-3">
                                        <a href="mailto:connect@infogito.com" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group/link">
                                            <div className="p-1.5 bg-white/10 rounded text-[#69B7B2] group-hover/link:bg-[#69B7B2] group-hover/link:text-black transition-all">
                                                <Mail size={14} />
                                            </div>
                                            <span className="text-sm font-mono">connect@infogito.com</span>
                                        </a>
                                    </div>
                                </div>

                                <div className="hidden md:flex w-24 h-24 bg-[#69B7B2]/10 rounded-2xl items-center justify-center border border-[#69B7B2]/20 backdrop-blur-md">
                                    <Building2 size={40} className="text-[#69B7B2] opacity-80" strokeWidth={1} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: The Form */}
                <div className="w-full lg:w-1/2 animate-in fade-in slide-in-from-right duration-700 delay-300">
                    <div className="relative rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden group border border-white/10">
                        
                        {/* Form Shader Background */}
                        <ContactElementShader />

                        {formState === 'sent' ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0c0c0e]/80 backdrop-blur-xl animate-in fade-in duration-500 z-20">
                                <div className="w-24 h-24 bg-[#69B7B2]/10 rounded-full flex items-center justify-center text-[#69B7B2] mb-8 border border-[#69B7B2]/20 shadow-[0_0_30px_rgba(105,183,178,0.2)]">
                                    <CheckCircle2 size={48} />
                                </div>
                                <h3 className="text-3xl font-serif text-white mb-2">Message Sent</h3>
                                <p className="text-white/50 text-sm max-w-xs text-center leading-relaxed">
                                    Your message has been logged. An engineer will get back to you shortly.
                                </p>
                                <button 
                                    onClick={() => setFormState('idle')}
                                    className="mt-12 text-xs font-bold uppercase tracking-widest text-[#69B7B2] hover:text-white transition-colors flex items-center gap-2"
                                >
                                    <Globe size={14} /> Send Another
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                                
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2 group/field">
                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 group-focus-within/field:text-[#69B7B2] transition-colors">First Name</label>
                                            <input type="text" required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#69B7B2] focus:bg-black/60 transition-all placeholder:text-white/20 font-sans backdrop-blur-sm" placeholder="Jane" />
                                        </div>
                                        <div className="space-y-2 group/field">
                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 group-focus-within/field:text-[#69B7B2] transition-colors">Last Name</label>
                                            <input type="text" required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#69B7B2] focus:bg-black/60 transition-all placeholder:text-white/20 font-sans backdrop-blur-sm" placeholder="Doe" />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2 group/field">
                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 group-focus-within/field:text-[#69B7B2] transition-colors">Any Email</label>
                                        <input type="email" required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#69B7B2] focus:bg-black/60 transition-all placeholder:text-white/20 font-sans backdrop-blur-sm" placeholder="jane@company.com" />
                                    </div>

                                    <div className="space-y-2 group/field">
                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 group-focus-within/field:text-[#69B7B2] transition-colors">How can we help?</label>
                                        <div className="relative">
                                            <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#69B7B2] focus:bg-black/60 transition-all appearance-none cursor-pointer font-sans backdrop-blur-sm">
                                                <option className="bg-[#0a0a0c]">General Question / Conversation</option>
                                                <option className="bg-[#0a0a0c]">Exploring Ideas or Use Cases</option>
                                                <option className="bg-[#0a0a0c]">Research or Collaboration</option>
                                                <option className="bg-[#0a0a0c]">Pilot or Proof of Concept</option>
                                                <option className="bg-[#0a0a0c]">Platform Questions</option>
                                                <option className="bg-[#0a0a0c]">Speaking, Advisory, or Writing</option>
                                                <option className="bg-[#0a0a0c]">Careers</option>
                                                <option className="bg-[#0a0a0c]">Something Else</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
                                                <ChevronDown size={14} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 group/field">
                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 group-focus-within/field:text-[#69B7B2] transition-colors">What sector best describes your work? (optional)</label>
                                        <div className="relative">
                                            <select 
                                                value={sector}
                                                onChange={(e) => setSector(e.target.value)}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#69B7B2] focus:bg-black/60 transition-all appearance-none cursor-pointer font-sans backdrop-blur-sm"
                                            >
                                                <option className="bg-[#0a0a0c]" value="">Select Sector...</option>
                                                <option className="bg-[#0a0a0c]">Public Sector / Government</option>
                                                <option className="bg-[#0a0a0c]">Education & Research</option>
                                                <option className="bg-[#0a0a0c]">Healthcare & Life Sciences</option>
                                                <option className="bg-[#0a0a0c]">Nonprofit / Social Impact</option>
                                                <option className="bg-[#0a0a0c]">Technology / Software</option>
                                                <option className="bg-[#0a0a0c]">Industrial, Infrastructure & Natural Resources</option>
                                                <option className="bg-[#0a0a0c]">Finance & Professional Services</option>
                                                <option className="bg-[#0a0a0c]">Media, Arts & Creative</option>
                                                <option className="bg-[#0a0a0c]">Hospitality & Tourism</option>
                                                <option className="bg-[#0a0a0c]">Prefer Not To Say</option>
                                                <option className="bg-[#0a0a0c]">Other</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
                                                <ChevronDown size={14} />
                                            </div>
                                        </div>
                                    </div>

                                    {sector === 'Other' && (
                                        <div className="space-y-2 group/field animate-in fade-in slide-in-from-top-2">
                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 group-focus-within/field:text-[#69B7B2] transition-colors">Please Specify</label>
                                            <input 
                                                type="text" 
                                                value={otherSector} 
                                                onChange={(e) => setOtherSector(e.target.value)}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#69B7B2] focus:bg-black/60 transition-all placeholder:text-white/20 font-sans backdrop-blur-sm" 
                                                placeholder="Your sector..." 
                                            />
                                        </div>
                                    )}

                                    <div className="space-y-2 group/field">
                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 group-focus-within/field:text-[#69B7B2] transition-colors">Tell Us About Yourself.</label>
                                        <textarea rows={4} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#69B7B2] focus:bg-black/60 transition-all resize-none placeholder:text-white/20 font-sans backdrop-blur-sm" placeholder="Tell us about your needs..." />
                                    </div>

                                    {/* CAPTCHA PLACEHOLDER */}
                                    <div 
                                        className={`flex items-center gap-4 p-4 rounded-xl border transition-colors cursor-pointer ${captchaChecked ? 'bg-[#69B7B2]/10 border-[#69B7B2]/30' : 'bg-black/30 border-white/10 hover:bg-black/50'}`}
                                        onClick={() => setCaptchaChecked(!captchaChecked)}
                                    >
                                        <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${captchaChecked ? 'bg-[#69B7B2] border-[#69B7B2] text-black' : 'border-white/30'}`}>
                                            {captchaChecked && <CheckSquare size={16} />}
                                        </div>
                                        <span className="text-sm text-white/70 select-none">I am human</span>
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={formState === 'sending'}
                                    className="w-full bg-[#69B7B2] hover:bg-[#5aa09c] text-black font-bold uppercase tracking-widest text-xs py-5 rounded-xl transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(105,183,178,0.2)] hover:shadow-[0_0_50px_rgba(105,183,178,0.4)] disabled:opacity-50 disabled:cursor-not-allowed group/btn relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                                    <span className="relative z-10 flex items-center gap-3">
                                        {formState === 'sending' ? (
                                            <>Sending Message...</>
                                        ) : (
                                            <>
                                                Get In Touch 
                                                <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </span>
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
