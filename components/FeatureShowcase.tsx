
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
    ShieldCheck, AlertCircle, Activity, Scale, Eye, FileText, CheckCircle2, 
    Database, ChevronRight, Share2, BookOpen, FileCheck, 
    Scan, Layout, Layers, Maximize, Circle, AlertTriangle, User, Calendar,
    Check, Loader2, X, BrainCircuit, Play, Pause, ArrowRight, Lock, 
    MessageSquare, Search, Zap, Command, GitBranch, Network, Wifi, Cpu,
    Terminal, FileCode, ArrowUpRight, Bot, Ticket, Users, MousePointer2,
    HardDrive, BarChart, ChevronDown, RefreshCw, ThumbsUp, ThumbsDown,
    Minimize, Square, Target, Award, Camera, CornerDownRight, HelpCircle, ArrowLeft, Send
} from 'lucide-react';
import { SectionVisualizer } from './SectionVisualizer';

// --- UTILS ---
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// --- SPEED VISUALIZER (Effect at bottom of video) ---
const SpeedVisualizer = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = canvas.parentElement?.clientWidth || 0;
        let height = canvas.height = canvas.parentElement?.clientHeight || 0;
        
        const count = 180;
        const particles: any[] = [];

        // 3D Perspective Settings
        const fl = 300; // Focal length
        
        const resetParticle = (p: any) => {
            // Distribute particles in 3D space
            // Favor the "floor" (positive Y relative to horizon) for the condensed bottom effect
            const isFloor = Math.random() > 0.3; 
            const yBase = isFloor ? Math.random() * 800 : (Math.random() - 0.5) * 800;
            
            p.x = (Math.random() - 0.5) * width * 4; 
            p.y = yBase;
            p.z = 200 + Math.random() * 1500;
            
            // Velocity: Moving towards camera (Z decreases) and slightly left (X decreases)
            p.vz = 8 + Math.random() * 15;
            p.vx = 4 + Math.random() * 6; // Left drift
            p.size = 1 + Math.random() * 2;
            
            return p;
        };

        for(let i=0; i<count; i++) {
            particles.push(resetParticle({}));
        }

        let frameId: number;
        const render = () => {
            ctx.clearRect(0, 0, width, height);
            
            // Vanishing Point: Slightly right and up to simulate "Head On + Left Drift"
            const vpX = width * 0.7; 
            const vpY = height * 0.4; 

            particles.forEach(p => {
                // Move
                p.z -= p.vz;
                p.x -= p.vx;

                // Reset if behind camera or out of bounds
                if (p.z <= 10 || p.x < -width * 2) {
                    resetParticle(p);
                    p.z = 1500;
                }

                // Project
                const scale = fl / (fl + p.z);
                const px = vpX + p.x * scale;
                const py = vpY + p.y * scale;

                // Density/Opacity Logic
                const isBottom = py > height * 0.85; // Bottom 15%
                
                // Base opacity: Much lower for ambient particles, higher for bottom floor
                let alpha = isBottom ? 0.8 : 0.15;
                
                // Fade in/out based on Z depth
                alpha *= Math.min(1, (1500 - p.z) / 500); 
                // Fade out if it gets too close to edges
                if (px < 0 || px > width || py < 0 || py > height) alpha *= 0.5;

                if (alpha > 0.01) {
                    // Draw Streak (Motion Blur)
                    const pastScale = fl / (fl + (p.z + p.vz * 3));
                    const pastPx = vpX + (p.x + p.vx * 3) * pastScale;
                    const pastPy = vpY + p.y * pastScale;

                    const grad = ctx.createLinearGradient(px, py, pastPx, pastPy);
                    grad.addColorStop(0, `rgba(105, 183, 178, ${alpha})`);
                    grad.addColorStop(1, `rgba(105, 183, 178, 0)`);

                    ctx.strokeStyle = grad;
                    ctx.lineWidth = p.size * scale * (isBottom ? 1.5 : 0.8);
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    ctx.moveTo(px, py);
                    ctx.lineTo(pastPx, pastPy);
                    ctx.stroke();
                }
            });

            frameId = requestAnimationFrame(render);
        };
        render();

        const resize = () => {
            if (canvas.parentElement) {
                width = canvas.width = canvas.parentElement.clientWidth;
                height = canvas.height = canvas.parentElement.clientHeight;
            }
        };
        window.addEventListener('resize', resize);
        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return <canvas ref={canvasRef} className="w-full h-full" />;
};

// --- SCENARIO DATA ---
const SCENARIOS = [
    {
        id: 'safety',
        title: "Safety Audit",
        type: "Compliance Check",
        color: "blue",
        // STAGE 1: INGEST (Chat)
        ingest: { 
            file: 'Q3_Safety_Audit.pdf', 
            initialQuestion: 'Does this audit pass the new ISO compliance standards?', 
            size: '2.4 MB', 
            type: 'PDF',
            summary: { type: "Compliance Report", entities: 14, confidence: "99.2%", riskLevel: "Critical" }
        },
        // STAGE 2: CAPTURE (Extraction)
        capture: {
            snippet: "Inspection Date: 2024-09-14\n\n...ISO-27001 Clause 4.2: Obstruction of egress path detected in Sector 4 hallway. Fire Door #42 obstructed by temporary scaffolding...",
            fields: [
                { label: "Violation Type", value: "Physical Safety", confidence: 0.98 },
                { label: "Regulation", value: "ISO-27001 / OSHA 1910", confidence: 0.99 },
                { label: "Fine Exposure", value: "$14,000 / violation", confidence: 0.85 },
                { label: "Location", value: "Sector 4 Hallway", confidence: 0.92 }
            ],
            highlightText: "Obstruction of egress path",
        },
        // STAGE 3: MAP (Knowledge Graph) - Reverted to richer data structure
        map: { 
            nodes: [
                { id: 'A', label: 'Safety Officer', sub: 'Person', type: 'person', x: -80, y: -40, details: "Role: L3 Admin" },
                { id: 'B', label: 'Violation Found', sub: 'Critical Alert', type: 'alert', x: 100, y: -20, details: "ISO-27001 Clause 4.2: Obstruction of egress path. Severity: High." }, 
                { id: 'C', label: 'Sept 14th', sub: 'Date', type: 'date', x: -30, y: 80, details: "T-minus 2 days" },
                { id: 'D', label: 'Section 4.2', sub: 'Clause', type: 'tag', x: 70, y: 60, details: "Egress Rules" },
                { id: 'E', label: 'Facilities', sub: 'Dept', type: 'dept', x: -100, y: 30, details: "Unit: Sector 4" }
            ],
            connections: [
                { from: 'A', to: 'E' },
                { from: 'B', to: 'D' },
                { from: 'B', to: 'E' },
                { from: 'A', to: 'C' },
                { from: 'E', to: 'B' }
            ]
        },
        // STAGE 4: REASON (Analysis)
        reason: {
            steps: [
                { type: 'observation', text: "Detected 'Obstruction' in fire egress path." },
                { type: 'inference', text: "Matches OSHA 1910 blockage criteria." },
                { type: 'implication', text: "Immediate regulatory violation. High fine risk." },
                { type: 'decision', text: "Recommend immediate dispatch of facilities team." }
            ]
        },
        // STAGE 5: BRIDGE (Manager Chat)
        bridge: {
            agentName: "Agent",
            history: [
                { role: 'agent', text: "I've flagged a critical safety violation in Sector 4." }
            ],
            options: [
                { label: "What is the specific violation?", response: "ISO-27001 Clause 4.2: Egress obstruction. Fire Door #42 is blocked." },
                { label: "Who is on shift?", response: "Mike is the current Safety Officer for Sector 4." },
                { label: "Create a ticket.", response: "Understood. Creating high-priority Jira ticket for facilities." }
            ]
        },
        // STAGE 6: ACT (Execution)
        act: {
            title: "Remediation Workflow",
            tasks: [
                "Authenticate with Jira API",
                "Create Ticket: PROJ-442",
                "Assign to: Facilities_Team",
                "Send Slack Alert to #safety-ops",
                "Log Compliance Incident #9921"
            ]
        },
        // STAGE 7: LEARN (Training)
        learn: {
            question: "What is the minimum clearance for a fire exit under OSHA 1910?",
            options: ["18 inches", "28 inches", "36 inches", "48 inches"],
            correct: 1, // Index
            explanation: "28 inches is the minimum width at all points for an exit route."
        }
    }
];

// --- SHARED UI ---

const WindowHeader = ({ title, stageId }: { title: string, stageId: string }) => (
    <div className="h-12 border-b border-white/5 flex items-center justify-center md:justify-between px-6 bg-[#0c0c0e] select-none rounded-tl-3xl shadow-sm z-20 relative">
        <div className="flex items-center gap-4">
            <div className="flex gap-2 group">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50 group-hover:brightness-110 transition-all cursor-pointer" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50 group-hover:brightness-110 transition-all cursor-pointer" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50 group-hover:brightness-110 transition-all cursor-pointer" />
            </div>
        </div>
        <div className="hidden md:flex items-center gap-4 text-[10px] font-mono uppercase tracking-widest text-white/30">
            <div className="flex items-center gap-3">
                <button className="hover:text-white transition-colors"><Minimize size={12} /></button>
                <button className="hover:text-white transition-colors"><Square size={10} /></button>
                <button className="hover:text-white transition-colors"><X size={12} /></button>
            </div>
        </div>
    </div>
);

// --- 1. INGEST (Chat & Processing) ---
const InputTerminal = ({ active, scenario }: { active: boolean, scenario: any }) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [inputValue, setInputValue] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);
    const hasInitialized = useRef(false);
    
    // Initial Sequence
    useEffect(() => {
        if (!active) {
            setMessages([]);
            hasInitialized.current = false;
            return;
        }
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        // Simulate upload
        setTimeout(() => {
            setMessages(prev => [...prev, { type: 'upload', file: scenario.ingest.file, size: scenario.ingest.size }]);
        }, 500);
        
        // Simulate initial system msg
        setTimeout(() => {
            setMessages(prev => [...prev, { type: 'system', text: "Document uploaded. Ready for analysis." }]);
        }, 1200);

    }, [active, scenario]);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim()) return;

        const text = inputValue;
        setInputValue("");
        setMessages(prev => [...prev, { type: 'user', text }]);

        // Simulate thinking and response
        setTimeout(() => {
            setMessages(prev => [...prev, { type: 'typing' }]);
            setTimeout(() => {
                setMessages(prev => {
                    const filtered = prev.filter(m => m.type !== 'typing');
                    // Simple echo logic for demo
                    return [...filtered, { type: 'system', text: `Analyzing query: "${text}"... Found 3 related entities in document.` }];
                });
            }, 1500);
        }, 500);
    };

    return (
        <div className="h-full flex flex-col bg-[#0c0c0e] relative overflow-hidden">
            <div className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto custom-scrollbar scroll-smooth" ref={scrollRef}>
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 fade-in duration-300`}>
                        {m.type === 'upload' && (
                            <div className="relative group overflow-hidden flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-[#151517] w-full max-w-md shadow-lg">
                                <div className="w-10 h-10 rounded-lg bg-[#69B7B2]/10 border border-[#69B7B2]/20 flex items-center justify-center text-[#69B7B2]">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white">{m.file}</div>
                                    <div className="text-[10px] text-white/40 font-mono flex items-center gap-2">
                                        {m.size} <span className="w-1 h-1 bg-white/20 rounded-full"/> PDF
                                    </div>
                                </div>
                                <div className="ml-auto text-green-400"><CheckCircle2 size={16} /></div>
                            </div>
                        )}
                        {m.type === 'typing' && (
                            <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-[#1a1a1c] border border-white/10 flex gap-1 items-center w-16">
                                <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        )}
                        {(m.type !== 'upload' && m.type !== 'typing') && (
                            <div className={`px-5 py-3 rounded-2xl text-xs font-medium max-w-[80%] shadow-sm ${
                                m.type === 'user' 
                                ? 'bg-white text-black rounded-tr-sm' 
                                : 'bg-[#1a1a1c] text-white/80 rounded-tl-sm border border-white/10'
                            }`}>
                                {m.type === 'system' && <span className="text-[#69B7B2] font-bold mr-2 font-mono text-[10px] uppercase">SYS &gt;</span>}
                                {m.text}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
            {/* Input Bar */}
            <div className="p-4 bg-[#0a0a0c] border-t border-white/10">
                <form onSubmit={handleSend} className="relative flex items-center gap-2">
                    <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask a question about this document..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-3 text-sm text-white focus:outline-none focus:border-[#69B7B2] transition-colors font-sans"
                    />
                    <button type="submit" className="p-3 bg-[#69B7B2] text-black rounded-full hover:bg-white transition-colors disabled:opacity-50">
                        <Send size={16} />
                    </button>
                </form>
            </div>
        </div>
    );
};

// --- 2. CAPTURE (Extraction Visualizer) ---
const CaptureTerminal = ({ active, scenario }: { active: boolean, scenario: any }) => {
    const [verifiedFields, setVerifiedFields] = useState<number[]>([]);

    const toggleVerify = (idx: number) => {
        if (verifiedFields.includes(idx)) {
            setVerifiedFields(prev => prev.filter(i => i !== idx));
        } else {
            setVerifiedFields(prev => [...prev, idx]);
        }
    };

    return (
        <div className="h-full flex flex-col md:flex-row bg-[#0c0c0e] p-8 gap-8">
            {/* Left: Source Doc */}
            <div className="flex-1 bg-white/5 rounded-xl border border-white/10 p-6 relative overflow-hidden font-mono text-xs text-white/60 leading-relaxed group">
                <div className="absolute top-0 right-0 p-2 bg-black/50 text-[9px] uppercase tracking-widest text-white/30 rounded-bl-lg border-b border-l border-white/5">Raw Source</div>
                <p className="whitespace-pre-wrap relative z-10">
                    {scenario.capture.snippet.replace(scenario.capture.highlightText, '')} 
                    <span className="bg-red-500/20 text-red-300 border-b border-red-500/50 px-1 mx-1 animate-pulse rounded font-bold cursor-help" title="Risk Identified">
                        {scenario.capture.highlightText}
                    </span>
                </p>
            </div>

            {/* Right: Extracted Structured Data */}
            <div className="flex-1 space-y-4 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-[#69B7B2] text-[10px] font-bold uppercase tracking-widest animate-in fade-in slide-in-from-left duration-500">
                        <Scan size={14} /> Extraction Complete
                    </div>
                    <div className="text-[10px] text-white/40 font-mono">
                        {verifiedFields.length}/{scenario.capture.fields.length} Verified
                    </div>
                </div>
                
                <div className="space-y-3">
                    {scenario.capture.fields.map((field: any, i: number) => {
                        const isVerified = verifiedFields.includes(i);
                        return (
                            <div 
                                key={i}
                                onClick={() => toggleVerify(i)}
                                className={`
                                    flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-300
                                    ${isVerified 
                                        ? 'bg-green-500/10 border-green-500/30' 
                                        : 'bg-[#151517] border-white/10 hover:border-white/20 hover:bg-white/5'
                                    }
                                `}
                            >
                                <div>
                                    <div className="text-[9px] text-white/40 uppercase tracking-wider mb-1">{field.label}</div>
                                    <div className={`text-sm font-bold ${isVerified ? 'text-green-400' : 'text-white'}`}>{field.value}</div>
                                </div>
                                
                                {isVerified ? (
                                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 animate-in zoom-in">
                                        <Check size={16} strokeWidth={3} />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-end">
                                        <div className="text-[9px] font-mono text-[#69B7B2]">{Math.floor(field.confidence * 100)}% Conf</div>
                                        <div className="text-[9px] text-white/20 uppercase tracking-widest mt-1">Click to Verify</div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// --- 3. MAP (Interactive Graph) ---
const BlueprintGraph = ({ active, scenario }: { active: boolean, scenario: any }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [tooltip, setTooltip] = useState<{x:number, y:number, text: string, sub: string, details?: string} | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let w = canvas.width = canvas.parentElement?.clientWidth || 600;
        let h = canvas.height = canvas.parentElement?.clientHeight || 400;
        let time = 0;
        let frameId: number;
        let mouseX = -1000, mouseY = -1000;

        const handleMouseMove = (e: MouseEvent) => {
            const r = canvas.getBoundingClientRect();
            mouseX = e.clientX - r.left;
            mouseY = e.clientY - r.top;
        };
        canvas.addEventListener('mousemove', handleMouseMove);

        const render = () => {
            time += 0.01;
            ctx.fillStyle = '#0c0c0e';
            ctx.fillRect(0, 0, w, h);

            // Subtle Grid
            ctx.strokeStyle = 'rgba(255,255,255,0.03)';
            ctx.lineWidth = 1;
            const gridSize = 40;
            const offsetX = (time * 10) % gridSize;
            for (let x = offsetX; x < w; x += gridSize) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
            for (let y = 0; y < h; y += gridSize) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

            const scale = Math.min(w, h) / 300; 
            const cx = w / 2;
            const cy = h / 2;
            let hovered: any = null;

            // Connections
            scenario.map.connections.forEach((conn: any) => {
                const n1 = scenario.map.nodes.find((n:any) => n.id === conn.from);
                const n2 = scenario.map.nodes.find((n:any) => n.id === conn.to);
                if (n1 && n2) {
                    const x1 = cx + n1.x * scale;
                    const y1 = cy + n1.y * scale;
                    const x2 = cx + n2.x * scale;
                    const y2 = cy + n2.y * scale;

                    ctx.strokeStyle = 'rgba(105, 183, 178, 0.2)';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                    
                    // Moving Packet
                    const packetProgress = (time * 0.5 + (n1.x + n2.x)*0.01) % 1;
                    const px = x1 + (x2 - x1) * packetProgress;
                    const py = y1 + (y2 - y1) * packetProgress;
                    ctx.fillStyle = '#fff';
                    ctx.beginPath(); ctx.arc(px, py, 2, 0, Math.PI*2); ctx.fill();
                }
            });

            // Nodes
            scenario.map.nodes.forEach((n: any) => {
                const nx = cx + n.x * scale + Math.sin(time + n.x) * 3;
                const ny = cy + n.y * scale + Math.cos(time + n.y) * 3;
                const dist = Math.sqrt((mouseX-nx)**2 + (mouseY-ny)**2);
                const isHovered = dist < 20;
                if (isHovered) hovered = n;

                const baseColor = n.type === 'alert' ? '#ef4444' : '#69B7B2';
                
                // Glow
                if (n.type === 'alert' || isHovered) {
                    ctx.shadowBlur = 20; ctx.shadowColor = baseColor;
                } else {
                    ctx.shadowBlur = 0;
                }

                ctx.fillStyle = isHovered ? '#fff' : baseColor;
                ctx.beginPath(); ctx.arc(nx, ny, isHovered ? 8 : 5, 0, Math.PI*2); ctx.fill();
                ctx.shadowBlur = 0;
                
                // Pulse Ring
                if (n.type === 'alert') {
                    ctx.strokeStyle = '#ef4444';
                    ctx.beginPath(); ctx.arc(nx, ny, 10 + Math.sin(time*5)*4, 0, Math.PI*2); ctx.stroke();
                }

                // Label
                ctx.fillStyle = isHovered ? '#fff' : 'rgba(255,255,255,0.5)';
                ctx.font = `bold ${10}px monospace`;
                ctx.textAlign = 'center';
                ctx.fillText(n.label, nx, ny + 25);
            });

            if (hovered) {
                setTooltip({ x: mouseX, y: mouseY, text: hovered.label, sub: hovered.sub, details: hovered.details });
                canvas.style.cursor = 'pointer';
            } else {
                setTooltip(null);
                canvas.style.cursor = 'default';
            }
            frameId = requestAnimationFrame(render);
        };
        render();
        return () => { canvas.removeEventListener('mousemove', handleMouseMove); cancelAnimationFrame(frameId); };
    }, [active, scenario]);

    return (
        <div className="h-full w-full relative bg-[#0c0c0e]">
            <canvas ref={canvasRef} className="w-full h-full block" />
            {tooltip && (
                <div 
                    className="absolute z-20 bg-[#1a1a1c]/90 backdrop-blur-md border border-white/20 p-4 rounded-xl shadow-2xl pointer-events-none animate-in fade-in zoom-in-95 duration-200 max-w-xs"
                    style={{ left: tooltip.x + 20, top: tooltip.y - 20 }}
                >
                    <div className="text-xs font-bold text-white mb-1">{tooltip.text}</div>
                    <div className="text-[9px] text-white/50 uppercase tracking-widest mb-2 border-b border-white/10 pb-2">{tooltip.sub}</div>
                    <div className="text-[10px] text-white/70 leading-relaxed font-mono">{tooltip.details}</div>
                </div>
            )}
        </div>
    );
};

// --- 4. REASON (Analysis & Prompt) ---
const AnalysisPanel = ({ active, scenario }: { active: boolean, scenario: any }) => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        if (!active) setStep(0);
    }, [active]);

    const nextStep = () => setStep(prev => Math.min(prev + 1, scenario.reason.steps.length));

    return (
        <div className="h-full flex flex-col p-8 bg-[#0c0c0e] justify-center items-center">
            <div className="w-full max-w-xl space-y-8">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2 text-[#69B7B2] font-mono text-[10px] uppercase tracking-widest">
                        <BrainCircuit size={14} className="animate-pulse" /> Chain of Thought
                    </div>
                    <div className="text-white/30 text-xs font-mono">
                        Step {step} / {scenario.reason.steps.length}
                    </div>
                </div>

                {/* Steps */}
                <div className="space-y-4">
                    {scenario.reason.steps.map((s: any, i: number) => {
                        const isVisible = i < step;
                        const isCurrent = i === step - 1;
                        
                        return (
                            <div 
                                key={i}
                                className={`
                                    p-4 rounded-xl border transition-all duration-500
                                    ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-20 translate-x-4 grayscale'}
                                    ${isCurrent ? 'bg-[#151517] border-white/20 scale-105 shadow-xl' : 'bg-transparent border-transparent'}
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isVisible ? 'bg-white text-black' : 'bg-white/10 text-white/30'}`}>
                                        {i + 1}
                                    </div>
                                    <div>
                                        <div className={`text-[10px] uppercase tracking-widest font-bold mb-1 ${
                                            s.type === 'decision' ? 'text-green-400' :
                                            s.type === 'implication' ? 'text-red-400' :
                                            'text-[#69B7B2]'
                                        }`}>
                                            {s.type}
                                        </div>
                                        <div className={`text-sm ${isVisible ? 'text-white' : 'text-white/40'}`}>{s.text}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Controls */}
                <div className="flex justify-center pt-8">
                    <button 
                        onClick={nextStep}
                        disabled={step >= scenario.reason.steps.length}
                        className="group relative px-8 py-3 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-full hover:bg-[#69B7B2] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        {step >= scenario.reason.steps.length ? 'Analysis Complete' : 'Next Deduction'}
                        <ArrowRight size={14} className="inline ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

            </div>
        </div>
    );
};

// --- 5. BRIDGE (Chatbot Manager) ---
const BridgeTerminal = ({ active, scenario }: { active: boolean, scenario: any }) => {
    const [history, setHistory] = useState<any[]>(scenario.bridge.history);
    
    useEffect(() => {
        if (!active) setHistory(scenario.bridge.history);
    }, [active, scenario]);

    const handleOption = (option: any) => {
        // Add User Choice
        setHistory(prev => [...prev, { role: 'user', text: option.label }]);
        
        // Simulate Agent Reply
        setTimeout(() => {
            setHistory(prev => [...prev, { role: 'agent', text: option.response }]);
        }, 600);
    };

    return (
        <div className="h-full bg-[#0c0c0e] flex flex-col p-6">
            <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar px-2 mb-4">
                {history.map((msg: any, i: number) => (
                    <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 border ${msg.role === 'user' ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' : 'bg-[#69B7B2]/20 border-[#69B7B2]/50 text-[#69B7B2]'}`}>
                            {msg.role === 'user' ? 'MG' : <Bot size={16} />}
                        </div>
                        
                        {/* Message Bubble */}
                        <div className={`max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed shadow-lg ${
                            msg.role === 'user' 
                            ? 'bg-white text-black rounded-tr-sm' 
                            : 'bg-[#1a1a1c] text-white/90 border border-white/10 rounded-tl-sm'
                        }`}>
                            <div className={`text-[9px] font-bold uppercase tracking-widest mb-2 opacity-50 flex items-center gap-2 ${msg.role === 'user' ? 'text-black/50' : 'text-white/50'}`}>
                                {msg.role === 'user' ? "You (Manager)" : scenario.bridge.agentName}
                            </div>
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-white/10">
                {scenario.bridge.options.map((opt: any, i: number) => (
                    <button 
                        key={i}
                        onClick={() => handleOption(opt)}
                        className="p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 text-left text-xs text-white/80 transition-all hover:scale-[1.02]"
                    >
                        <span className="text-[10px] text-white/30 uppercase tracking-widest block mb-1">Option {i+1}</span>
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

// --- 6. ACT (Execution Steps) ---
const ActionCenter = ({ active, scenario }: { active: boolean, scenario: any }) => {
    const [stepIndex, setStepIndex] = useState(0);
    const [isExecuting, setIsExecuting] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    
    const startExecution = () => {
        setIsExecuting(true);
        setStepIndex(0);
    };

    useEffect(() => {
        if (!active) {
            setIsExecuting(false);
            setStepIndex(0);
            setIsComplete(false);
            return;
        }

        if (isExecuting && stepIndex < scenario.act.tasks.length) {
            const timer = setTimeout(() => {
                setStepIndex(prev => prev + 1);
            }, 800);
            return () => clearTimeout(timer);
        } else if (stepIndex >= scenario.act.tasks.length && isExecuting) {
            setIsComplete(true);
        }
    }, [active, isExecuting, stepIndex, scenario.act.tasks.length]);

    return (
        <div className="h-full flex flex-col items-center justify-center p-8 bg-[#0c0c0e]">
            <div className="w-full max-w-md space-y-8">
                
                {!isExecuting && !isComplete ? (
                    <div className="text-center animate-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-[#69B7B2]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#69B7B2]/20 animate-pulse">
                            <Bot size={32} className="text-[#69B7B2]" />
                        </div>
                        <h3 className="text-xl font-serif text-white mb-2">Ready to Execute</h3>
                        <p className="text-sm text-white/50 mb-8">Agent is standing by to perform the assigned workflow.</p>
                        <button 
                            onClick={startExecution}
                            className="bg-[#69B7B2] hover:bg-[#5aa09c] text-black px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm shadow-[0_0_30px_rgba(105,183,178,0.4)] flex items-center gap-3 mx-auto transition-all active:scale-95 hover:scale-105"
                        >
                            <Zap size={18} fill="currentColor" /> Authorize & Run
                        </button>
                    </div>
                ) : (
                    <div className="bg-[#151517] border border-white/10 rounded-xl p-6 space-y-4 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
                        <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
                            <div className={`w-2 h-2 rounded-full ${isComplete ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`} />
                            <div className="flex-1">
                                <span className="text-xs font-bold text-white uppercase tracking-widest block">{scenario.act.title}</span>
                                <span className="text-[9px] text-white/30 font-mono">{isComplete ? 'COMPLETE' : 'RUNNING_TASKS'}</span>
                            </div>
                            <Activity size={14} className={isComplete ? 'text-green-500' : 'text-amber-500'} />
                        </div>
                        
                        <div className="space-y-3 font-mono text-xs">
                            {scenario.act.tasks.map((task: string, i: number) => (
                                <div 
                                    key={i} 
                                    className={`flex items-center gap-4 transition-all duration-300 ${i <= stepIndex ? 'opacity-100 translate-x-0' : 'opacity-30 -translate-x-2'}`}
                                >
                                    <div className={`w-5 h-5 rounded flex items-center justify-center border text-[9px] ${
                                        i < stepIndex 
                                            ? 'bg-green-500/20 border-green-500/50 text-green-400' 
                                            : i === stepIndex && !isComplete
                                                ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 animate-pulse'
                                                : 'border-white/10 text-white/20'
                                    }`}>
                                        {i < stepIndex ? <Check size={10} strokeWidth={4} /> : i + 1}
                                    </div>
                                    <span className={i <= stepIndex ? "text-white/80" : "text-white/30"}>{task}</span>
                                </div>
                            ))}
                        </div>
                        
                        {isComplete && (
                            <div className="mt-6 pt-4 border-t border-white/10 text-center animate-in zoom-in">
                                <button className="bg-white text-black px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors shadow-lg flex items-center gap-2 mx-auto">
                                    <Ticket size={14} /> View Ticket
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- 7. LEARN (Quiz) ---
const KnowledgeBase = ({ active, scenario }: { active: boolean, scenario: any }) => {
    const [selected, setSelected] = useState<number | null>(null);
    const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

    useEffect(() => { 
        if (!active) {
            setSelected(null);
            setStatus('idle');
        } 
    }, [active]);

    const handleSelect = (idx: number) => {
        if (status !== 'idle') return;
        setSelected(idx);
        if (idx === scenario.learn.correct) {
            setStatus('correct');
        } else {
            setStatus('wrong');
        }
    };

    return (
        <div className="h-full flex flex-col items-center justify-center p-8 bg-[#0c0c0e]">
            <div className="w-full max-w-md space-y-8 text-center">
                
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                    <BookOpen size={12} />
                    <span>Pop Quiz</span>
                </div>

                <h3 className="text-xl font-serif text-white mb-8">{scenario.learn.question}</h3>

                <div className="space-y-3">
                    {scenario.learn.options.map((opt: string, i: number) => {
                        let btnClass = "border-white/10 bg-white/5 hover:bg-white/10 text-white/70";
                        if (selected === i) {
                            if (status === 'correct') btnClass = "border-green-500 bg-green-500/20 text-green-400";
                            else if (status === 'wrong') btnClass = "border-red-500 bg-red-500/20 text-red-400";
                        } else if (status !== 'idle' && i === scenario.learn.correct) {
                            btnClass = "border-green-500 bg-green-500/10 text-green-400 opacity-50"; // Show correct answer
                        }

                        return (
                            <button
                                key={i}
                                onClick={() => handleSelect(i)}
                                className={`w-full p-4 rounded-xl border text-sm font-bold transition-all duration-300 ${btnClass}`}
                            >
                                {opt}
                            </button>
                        );
                    })}
                </div>

                {status === 'correct' && (
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm animate-in zoom-in">
                        <div className="font-bold flex items-center justify-center gap-2 mb-1"><Award size={16}/> Correct</div>
                        <div className="opacity-80 text-xs">{scenario.learn.explanation}</div>
                    </div>
                )}
                
                {status === 'wrong' && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm animate-in zoom-in">
                        <div className="font-bold mb-1">Incorrect</div>
                        <div className="opacity-80 text-xs">Try again next time.</div>
                    </div>
                )}

            </div>
        </div>
    );
};

// --- MAIN CONTAINER ---
export const FeatureShowcase: React.FC = () => {
    const [activeStage, setActiveStage] = useState(0);
    const [isPaused, setIsPaused] = useState(true); // Default to manual nav now
    const scenario = SCENARIOS[0]; 

    const stages = [
        { id: 'ingest', label: 'Ingest', icon: FileText, comp: InputTerminal },
        { id: 'capture', label: 'Capture', icon: Target, comp: CaptureTerminal },
        { id: 'map', label: 'Map', icon: Network, comp: BlueprintGraph },
        { id: 'reason', label: 'Reason', icon: BrainCircuit, comp: AnalysisPanel },
        { id: 'bridge', label: 'Bridge', icon: MessageSquare, comp: BridgeTerminal },
        { id: 'act', label: 'Act', icon: Zap, comp: ActionCenter },
        { id: 'learn', label: 'Learn', icon: BookOpen, comp: KnowledgeBase },
    ];

    const nextStage = () => { setActiveStage(prev => (prev + 1) % 7); setIsPaused(true); };
    const prevStage = () => { setActiveStage(prev => (prev - 1 + 7) % 7); setIsPaused(true); };

    return (
        <section className="py-32 bg-[#020202] border-t border-white/5 relative">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Header */}
                <div className="mb-12 md:flex md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-6xl font-serif text-white leading-tight">
                            Agents designed to think like <span className="text-white/40">you do.</span>
                        </h2>
                    </div>
                </div>

                {/* Main Content Layout - Flex Row for Sidecar Video */}
                <div className="flex flex-col lg:flex-row items-end w-full relative group gap-0">
                    
                    {/* Main Window - Connects to Video on the right */}
                    <div className="w-full lg:flex-1 bg-[#0a0a0c] border border-white/10 rounded-l-[2rem] rounded-tr-[2rem] rounded-br-none border-r-0 shadow-2xl overflow-hidden flex flex-col md:flex-row h-[750px] ring-1 ring-white/5 relative z-10">
                        
                        {/* Sidebar Nav */}
                        <div className="w-full md:w-64 bg-[#08080a] border-b md:border-b-0 md:border-r border-white/5 flex flex-col z-20">
                            <div className="p-8 hidden md:block">
                                <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">Workflow Stages</div>
                                <div className="h-0.5 w-8 bg-[#69B7B2]" />
                            </div>
                            
                            <div className="flex-1 p-4 space-x-2 md:space-x-0 md:space-y-2 flex md:block overflow-x-auto custom-scrollbar">
                                {stages.map((stage, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => { setActiveStage(idx); setIsPaused(true); }}
                                        className={cn(
                                            "flex-1 md:w-full flex items-center gap-4 px-5 py-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 relative overflow-hidden group/btn min-w-[140px]",
                                            activeStage === idx 
                                                ? "bg-[#151517] text-white shadow-lg border border-white/10" 
                                                : "text-white/30 hover:text-white hover:bg-white/5 border border-transparent"
                                        )}
                                    >
                                        <div className={`relative z-10 transition-transform duration-300 ${activeStage === idx ? 'scale-110' : ''}`}>
                                            <stage.icon size={18} className={activeStage === idx ? "text-[#69B7B2]" : "text-current opacity-50 group-hover/btn:opacity-100"} />
                                        </div>
                                        <span className="relative z-10">{stage.label}</span>
                                        
                                        {/* Active Indicator Line */}
                                        {activeStage === idx && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#69B7B2]" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 relative bg-[#0c0c0e] flex flex-col">
                            
                            {/* OS Header */}
                            <WindowHeader title={scenario.title} stageId={stages[activeStage].id} />

                            {/* Stage View */}
                            <div className="flex-1 relative overflow-hidden bg-black/20">
                                {stages.map((stage, idx) => {
                                    const Component = stage.comp;
                                    return (
                                        <div 
                                            key={idx}
                                            className={cn(
                                                "absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] flex flex-col",
                                                activeStage === idx 
                                                    ? "opacity-100 z-10 translate-y-0 scale-100 filter-none" 
                                                    : "opacity-0 z-0 translate-y-4 scale-95 blur-sm pointer-events-none"
                                            )}
                                        >
                                            <Component active={activeStage === idx} scenario={scenario} />
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Bottom Navigation Control Bar */}
                            <div className="h-16 border-t border-white/5 bg-[#0a0a0c] flex items-center justify-between px-8 z-20">
                                <button onClick={prevStage} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors group/nav">
                                    <ArrowLeft size={14} className="group-hover/nav:-translate-x-1 transition-transform" />
                                    Previous Step
                                </button>
                                
                                <div className="flex gap-2">
                                    {stages.map((_, i) => (
                                        <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${i === activeStage ? 'bg-[#69B7B2] w-4' : 'bg-white/10'}`} />
                                    ))}
                                </div>

                                <button onClick={nextStage} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors group/nav">
                                    Next Step
                                    <ArrowRight size={14} className="group-hover/nav:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* The "Sidecar" Video Module - Bottom Right */}
                    <div className="relative w-full lg:w-[320px] h-[320px] bg-[#0a0a0c] border-y border-r border-white/10 border-l-0 rounded-r-[2rem] rounded-tl-[2rem] rounded-bl-none overflow-hidden z-20 -ml-px shadow-2xl shrink-0 mt-[-1px] lg:mt-0">
                        {/* Seam Hider to merge left border */}
                        <div className="absolute left-[-1px] top-0 bottom-0 w-[2px] bg-[#0a0a0c] z-30" />

                        <video 
                            src="https://jar5gzlwdkvsnpqa.public.blob.vercel-storage.com/Untitled%20design%20%2847%29.webm"
                            autoPlay 
                            loop 
                            muted 
                            playsInline
                            className="w-full h-full object-cover opacity-80 mix-blend-screen"
                        />
                        
                        {/* Speed Lines Effect */}
                        <div className="absolute inset-0 z-10 pointer-events-none mix-blend-screen">
                            <SpeedVisualizer />
                        </div>

                        {/* Gradient to blend seamlessly into the UI below */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0c]/20 to-[#0a0a0c]" />
                    </div>
                </div>

            </div>
            
            {/* Animation Style for Dash */}
            <style>{`
                @keyframes dash {
                    from { stroke-dashoffset: 63; }
                    to { stroke-dashoffset: 0; }
                }
            `}</style>
        </section>
    );
};
