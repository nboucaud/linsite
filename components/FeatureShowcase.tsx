
import React, { useState, useEffect, useRef } from 'react';
import { 
    Activity, FileText, CheckCircle2, 
    Database, Search, Zap, Network, 
    Bot, X, ArrowLeft, ArrowRight,
    Folder, Image as ImageIcon, FileSpreadsheet, MoreVertical,
    Grid, List, Lock, Layout,
    Terminal, Code, Play, Check,
    Cpu, BarChart3, RefreshCw, Layers,
    MessageSquare, Briefcase, CreditCard,
    HardDrive, Plus,
    GitMerge,
    Bell, Settings,
    Server, Trash2, Sparkles, Mail,
    Globe, Shield, FileJson, Share2,
    PlayCircle, PauseCircle, Scan,
    Cloud, Box, ChevronRight,
    ArrowUp
} from 'lucide-react';

// --- UTILS ---
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// --- SHARED COMPONENTS ---

const WindowHeader = ({ title, icon: Icon, videoRef, isVideoPlaying, toggleVideo }: any) => (
    <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-[#0a0a0c] select-none z-20 relative">
        <div className="flex items-center gap-4">
            <div className="flex gap-2 group">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50" />
            </div>
            <div className="h-6 w-px bg-white/10 mx-2" />
            <div className="flex items-center gap-3 text-white/80 text-xs font-bold font-mono uppercase tracking-widest bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                <Icon size={14} className="text-[#69B7B2]" />
                <span>{title}</span>
            </div>
        </div>

        {/* GITO AGENT - RIGHT SIDE, CLEAN LOOK */}
        <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-2">
                <span className="text-[10px] font-bold text-white/90">Gito AI</span>
                <span className="text-[9px] text-[#69B7B2] font-mono animate-pulse">ONLINE</span>
            </div>
            <div className="relative group cursor-pointer" onClick={toggleVideo}>
                <div className="absolute -inset-1 bg-gradient-to-r from-[#69B7B2] to-blue-500 rounded-full opacity-20 group-hover:opacity-50 blur transition duration-500" />
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20 bg-black">
                    <video 
                        ref={videoRef}
                        src="https://jar5gzlwdkvsnpqa.public.blob.vercel-storage.com/Untitled%20design%20%2847%29.webm"
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        className="w-full h-full object-cover transform scale-110"
                    />
                    {!isVideoPlaying && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <PlayCircle size={16} className="text-white" />
                        </div>
                    )}
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-black rounded-full z-10" />
            </div>
        </div>
    </div>
);

// --- 1. LOCATE (Simulated File System) ---
const LocateApp = ({ active }: { active: boolean }) => {
    const [scannedCount, setScannedCount] = useState(0);
    
    useEffect(() => {
        if(active) {
            setScannedCount(0);
            const interval = setInterval(() => {
                setScannedCount(prev => Math.min(prev + 1, 8));
            }, 200);
            return () => clearInterval(interval);
        }
    }, [active]);

    const integrations = [
        { name: "Google Drive", type: "cloud", icon: Cloud, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", items: "14.2k items" },
        { name: "Dropbox", type: "cloud", icon: Box, color: "text-indigo-400", bg: "bg-indigo-400/10", border: "border-indigo-400/20", items: "8.1k items" },
        { name: "AWS S3 Bucket", type: "server", icon: Server, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20", items: "1.2TB data" },
        { name: "Salesforce", type: "db", icon: Database, color: "text-sky-400", bg: "bg-sky-400/10", border: "border-sky-400/20", items: "450k records" },
        { name: "SharePoint", type: "cloud", icon: Globe, color: "text-teal-400", bg: "bg-teal-400/10", border: "border-teal-400/20", items: "Indexing..." },
        { name: "Notion Workspace", type: "doc", icon: FileText, color: "text-white", bg: "bg-white/10", border: "border-white/20", items: "Connected" },
    ];

    return (
        <div className="w-full h-full bg-[#0c0c0e] flex flex-col font-sans">
            <div className="h-12 border-b border-white/5 flex items-center px-6 justify-between bg-[#151517]">
                <div className="flex items-center gap-3 text-white/40 text-xs">
                    <span className="hover:text-white cursor-pointer transition-colors">Data Sources</span>
                    <ChevronRight size={12} />
                    <span className="text-white font-medium">Active Integrations</span>
                </div>
                <button className="bg-[#69B7B2] hover:bg-[#5aa09c] text-black text-[10px] font-bold px-4 py-1.5 rounded-full flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(105,183,178,0.2)]">
                    <Plus size={12} /> Connect New Source
                </button>
            </div>

            <div className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {integrations.map((s, i) => {
                        const isScanned = i < scannedCount;
                        return (
                            <div key={i} className={`group bg-[#121214] border border-white/5 hover:border-white/10 p-5 rounded-2xl relative overflow-hidden transition-all duration-500 hover:-translate-y-1 ${isScanned ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-xl ${s.bg} ${s.color} border ${s.border}`}>
                                        <s.icon size={20} />
                                    </div>
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    </div>
                                </div>
                                <h4 className="text-white font-bold text-sm mb-1">{s.name}</h4>
                                <p className="text-white/40 text-xs font-mono">{s.items}</p>
                                
                                {/* Hover Effect */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                        );
                    })}
                    
                    {/* Add Button */}
                    <div className="border border-dashed border-white/10 hover:border-white/30 rounded-2xl flex flex-col items-center justify-center gap-3 text-white/20 hover:text-white/60 transition-all cursor-pointer bg-white/[0.01] hover:bg-white/[0.03] group">
                        <div className="w-10 h-10 rounded-full bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors">
                            <Plus size={20} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest">Add Integration</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 2. STREAM (AI Agent Data Processing) ---
const StreamApp = ({ active }: { active: boolean }) => {
    const [events, setEvents] = useState<any[]>([]);
    
    // Simulate incoming data stream
    useEffect(() => {
        if (!active) {
            setEvents([]);
            return;
        }

        const templates = [
            { type: 'invoice', raw: "INV-2921 from Acme Corp ($4,200) - Overdue", color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" },
            { type: 'email', raw: "Subject: Project Alpha delays - Urgent", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
            { type: 'log', raw: "Error: Database timeout on cluster us-east-1", color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20" },
            { type: 'slack', raw: "@channel deployment failed in staging", color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" }
        ];

        const interval = setInterval(() => {
            const template = templates[Math.floor(Math.random() * templates.length)];
            const newEvent = {
                id: Date.now(),
                ...template,
                status: 'pending', // pending -> processing -> done
                agent: null
            };
            
            setEvents(prev => [newEvent, ...prev].slice(0, 5)); // Keep last 5
        }, 1500);

        return () => clearInterval(interval);
    }, [active]);

    // Simulate Agent Processing
    useEffect(() => {
        if (!active) return;
        
        const processInterval = setInterval(() => {
            setEvents(prev => {
                // Find pending event
                const targetIdx = prev.findIndex(e => e.status === 'pending');
                if (targetIdx === -1) return prev; // Nothing to do

                const next = [...prev];
                // Start processing
                next[targetIdx] = { ...next[targetIdx], status: 'processing', agent: 'Analyzer_Bot' };
                
                // Finish processing shortly after
                setTimeout(() => {
                    setEvents(curr => {
                        const doneNext = [...curr];
                        const doneIdx = doneNext.findIndex(e => e.id === next[targetIdx].id);
                        if (doneIdx !== -1) {
                            doneNext[doneIdx] = { ...doneNext[doneIdx], status: 'done', agent: null };
                        }
                        return doneNext;
                    });
                }, 1000);

                return next;
            });
        }, 800);

        return () => clearInterval(processInterval);
    }, [active]);

    return (
        <div className="w-full h-full bg-[#0a0a0c] flex flex-col font-mono text-xs overflow-hidden relative">
            {/* Header */}
            <div className="h-10 bg-[#111] border-b border-white/5 flex items-center px-4 gap-4">
                <div className="flex items-center gap-2 text-green-400">
                    <Activity size={12} className="animate-pulse" />
                    <span className="font-bold">LIVE_INGEST</span>
                </div>
                <div className="flex-1 h-px bg-white/5" />
                <div className="text-white/30">Processing Stream...</div>
            </div>

            {/* Stream Content */}
            <div className="flex-1 p-6 space-y-4 overflow-hidden relative">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '100% 20px' }} />

                {events.map((ev) => (
                    <div key={ev.id} className="relative pl-8 group animate-in slide-in-from-top-4 duration-500">
                        {/* Timeline Line */}
                        <div className="absolute left-3 top-0 bottom-0 w-px bg-white/10 group-last:bg-gradient-to-b group-last:from-white/10 group-last:to-transparent" />
                        
                        {/* Status Dot */}
                        <div className={`absolute left-[9px] top-4 w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                            ev.status === 'done' ? 'bg-[#69B7B2] shadow-[0_0_8px_#69B7B2]' : 
                            ev.status === 'processing' ? 'bg-amber-400 animate-ping' : 
                            'bg-white/20'
                        }`} />

                        <div className={`relative p-4 rounded-xl border transition-all duration-500 ${
                            ev.status === 'processing' ? 'bg-[#151517] border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)] translate-x-2' : 
                            ev.status === 'done' ? 'bg-[#0f1110] border-[#69B7B2]/20 opacity-60' : 
                            'bg-transparent border-transparent opacity-40'
                        }`}>
                            
                            {/* Agent Cursor Overlay */}
                            {ev.status === 'processing' && (
                                <div className="absolute -right-3 -top-3 flex items-center gap-2 bg-amber-500 text-black px-3 py-1 rounded-full text-[9px] font-bold animate-bounce z-10 shadow-lg border border-white/20">
                                    <Bot size={12} /> Analyzing...
                                </div>
                            )}

                            <div className="flex justify-between items-center mb-2">
                                <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider ${ev.bg} ${ev.color} ${ev.border} border`}>
                                    {ev.type === 'invoice' && <FileText size={10} />}
                                    {ev.type === 'email' && <Mail size={10} />}
                                    {ev.type === 'log' && <Terminal size={10} />}
                                    {ev.type === 'slack' && <MessageSquare size={10} />}
                                    {ev.type}
                                </div>
                                <span className="text-white/20 font-mono text-[9px]">{new Date(ev.id).toLocaleTimeString([], {hour12: false, minute:'2-digit', second:'2-digit'})}</span>
                            </div>
                            
                            <div className="text-white/80 truncate font-sans text-sm mb-1">{ev.raw}</div>
                            
                            {/* Enrichment Data */}
                            {ev.status === 'done' && (
                                <div className="mt-3 flex gap-2 animate-in fade-in">
                                    <span className="bg-[#69B7B2]/10 text-[#69B7B2] px-2 py-0.5 rounded border border-[#69B7B2]/20 flex items-center gap-1 text-[10px] font-bold uppercase">
                                        <CheckCircle2 size={10} /> Validated
                                    </span>
                                    <span className="bg-white/5 text-white/40 px-2 py-0.5 rounded border border-white/10 text-[10px] uppercase">
                                        Routed to ERP
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- 3. CONTEXT (Schema Mapping) ---
const ContextApp = ({ active }: { active: boolean }) => {
    return (
        <div className="w-full h-full bg-[#0f0f11] flex flex-col relative overflow-hidden">
            {/* Split View */}
            <div className="flex-1 flex">
                {/* Left: Unstructured Source */}
                <div className="w-1/2 border-r border-white/5 p-6 space-y-4">
                    <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <FileText size={12} /> Source Document
                    </div>
                    <div className="text-white/60 text-xs leading-relaxed font-mono p-6 bg-white/5 rounded-xl border border-white/5 shadow-inner">
                        <span className="bg-blue-500/20 text-blue-300 px-1 rounded">INVOICE #9921</span><br/><br/>
                        Vendor: <span className="bg-purple-500/20 text-purple-300 px-1 rounded">Acme Corp</span><br/>
                        Date: <span className="bg-green-500/20 text-green-300 px-1 rounded">Oct 24, 2025</span><br/>
                        Items: Server Racks (x4)<br/>
                        Total: <span className="bg-amber-500/20 text-amber-300 px-1 rounded">$12,400.00</span>
                    </div>
                </div>

                {/* Center: Connector Lines (Canvas simulated via SVG) */}
                <div className="absolute inset-0 pointer-events-none">
                    <svg className="w-full h-full">
                        <path d="M 250 140 C 350 140, 350 100, 450 100" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_1s_linear_infinite]" />
                        <path d="M 250 160 C 350 160, 350 160, 450 160" fill="none" stroke="#a855f7" strokeWidth="2" strokeOpacity="0.5" />
                        <path d="M 250 220 C 350 220, 350 240, 450 240" fill="none" stroke="#f59e0b" strokeWidth="2" strokeOpacity="0.5" />
                    </svg>
                </div>

                {/* Right: Structured Schema */}
                <div className="w-1/2 p-6 space-y-4 bg-[#0a0a0c]">
                    <div className="text-[10px] font-bold text-[#69B7B2] uppercase tracking-widest mb-2 flex items-center gap-2">
                        <FileJson size={12} /> Normalized Schema
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-[#1a1a1c] border border-blue-500/30">
                            <span className="text-blue-400 text-xs font-bold font-mono">id</span>
                            <span className="text-white text-xs">"INV-9921"</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-[#1a1a1c] border border-purple-500/30">
                            <span className="text-purple-400 text-xs font-bold font-mono">entity</span>
                            <span className="text-white text-xs">"Acme Corp"</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-[#1a1a1c] border border-white/5">
                            <span className="text-gray-500 text-xs font-bold font-mono">date_iso</span>
                            <span className="text-white text-xs">"2025-10-24"</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-[#1a1a1c] border border-amber-500/30">
                            <span className="text-amber-400 text-xs font-bold font-mono">amount</span>
                            <span className="text-white text-xs">12400.00</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 4. CAPTURE (Logic Builder) ---
const CaptureApp = ({ active }: { active: boolean }) => {
    return (
        <div className="w-full h-full bg-[#111113] relative overflow-hidden">
            {/* Dot Grid */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

            <div className="absolute inset-0 flex items-center justify-center">
                {/* Flowchart */}
                <div className="relative w-full max-w-lg h-64">
                    {/* Node 1 */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 bg-[#1a1a1c] border border-white/10 rounded-xl p-3 shadow-xl z-10 flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><Mail size={16}/></div>
                        <div>
                            <div className="text-[10px] text-white/40 uppercase font-bold">Trigger</div>
                            <div className="text-xs text-white font-bold">Invoice Received</div>
                        </div>
                    </div>

                    {/* Connecting Line Vertical */}
                    <div className="absolute top-8 left-1/2 w-0.5 h-16 bg-white/10 -translate-x-1/2">
                        <div className="absolute top-0 left-0 w-full h-1/2 bg-[#69B7B2] animate-[drop_1.5s_infinite]" />
                    </div>

                    {/* Node 2 (Logic) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 bg-[#1a1a1c] border border-amber-500/30 rounded-xl p-3 shadow-xl z-10 flex items-center gap-3">
                        <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg"><GitMerge size={16}/></div>
                        <div>
                            <div className="text-[10px] text-white/40 uppercase font-bold">Logic</div>
                            <div className="text-xs text-white font-bold">Amount {'>'} $10k?</div>
                        </div>
                    </div>

                    {/* Paths */}
                    <div className="absolute top-[calc(50%+2rem)] left-1/2 w-32 h-16 border-l-2 border-b-2 border-white/10 rounded-bl-3xl -translate-x-full" />
                    <div className="absolute top-[calc(50%+2rem)] right-1/2 w-32 h-16 border-r-2 border-b-2 border-white/10 rounded-br-3xl -translate-x-0" />

                    {/* Leaf Nodes */}
                    <div className="absolute bottom-0 left-8 w-32 bg-[#1a1a1c] border border-white/10 rounded-lg p-2 text-center shadow-lg">
                        <div className="text-[10px] text-red-400 font-bold">Flag for Review</div>
                    </div>
                    <div className="absolute bottom-0 right-8 w-32 bg-[#1a1a1c] border border-white/10 rounded-lg p-2 text-center shadow-lg">
                        <div className="text-[10px] text-green-400 font-bold">Auto-Approve</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 5. CONTROL (Graph) ---
const ControlApp = ({ active }: { active: boolean }) => {
    return (
        <div className="w-full h-full bg-[#050505] relative overflow-hidden flex items-center justify-center">
            {/* Central Node */}
            <div className="absolute z-20 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.3)] animate-pulse">
                <Shield size={32} className="text-black" />
            </div>

            {/* Orbiting Satellites */}
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                <div 
                    key={i}
                    className="absolute w-64 h-1 bg-gradient-to-r from-white/20 to-transparent origin-left"
                    style={{ transform: `rotate(${deg + (active ? i*10 : 0)}deg)` }}
                >
                    <div className="absolute right-0 -top-4 w-8 h-8 bg-[#1a1a1c] border border-white/20 rounded-full flex items-center justify-center z-10 hover:scale-125 transition-transform cursor-pointer">
                        <div className="w-2 h-2 bg-[#69B7B2] rounded-full" />
                    </div>
                </div>
            ))}
            
            {/* Sidebar Overlay */}
            <div className="absolute left-6 top-6 bg-black/80 backdrop-blur border border-white/10 p-4 rounded-xl w-48 shadow-2xl">
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Knowledge Graph</div>
                <div className="space-y-2">
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-[#69B7B2]" />
                    </div>
                    <div className="flex justify-between text-[10px] text-white/60">
                        <span>Entities</span>
                        <span>842</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 6. BRIDGE (Chat Interface) ---
const BridgeApp = ({ active }: { active: boolean }) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [step, setStep] = useState(0);

    // Automation sequence
    useEffect(() => {
        if (!active) {
            setMessages([]);
            setStep(0);
            return;
        }

        const script = [
            { type: 'user', content: 'Audit the Q3 vendor contracts for liability risks.', delay: 1000 },
            { type: 'system', sources: ['SharePoint / Legal', 'Salesforce / Vendors', 'Email / Q3_Thread'], delay: 2000 },
            { type: 'assistant', content: "I've analyzed 14 documents. Primary risk found in **Acme Corp** agreement: The indemnity clause (Section 4.2) conflicts with our standard policy regarding third-party damages.", delay: 4000 }
        ];

        let timeouts: ReturnType<typeof setTimeout>[] = [];
        let accumulatedDelay = 0;

        script.forEach((msg, idx) => {
            accumulatedDelay += msg.delay;
            timeouts.push(setTimeout(() => {
                setMessages(prev => [...prev, msg]);
                setStep(idx + 1);
            }, accumulatedDelay));
        });

        // Loop
        const resetTime = accumulatedDelay + 5000;
        const loop = setInterval(() => {
            setMessages([]);
            setStep(0);
            let loopDelay = 0;
            script.forEach((msg) => {
                loopDelay += msg.delay;
                setTimeout(() => {
                    setMessages(prev => [...prev, msg]);
                }, loopDelay);
            });
        }, resetTime);

        return () => {
            timeouts.forEach(clearTimeout);
            clearInterval(loop);
        };
    }, [active]);

    return (
        <div className="flex flex-col h-full bg-[#0a0a0c] font-sans relative overflow-hidden">
            {/* Background Hint */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <Bot size={200} />
            </div>

            {/* Header */}
            <div className="h-12 border-b border-white/5 flex items-center justify-between px-4 bg-[#0c0c0e]">
                <div className="flex items-center gap-2 text-white/60 text-xs font-medium">
                    <Sparkles size={14} className="text-[#69B7B2]" />
                    Bridge Assistant
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-white/30">Context Window:</span>
                    <span className="text-[10px] font-mono text-green-400">128k</span>
                </div>
            </div>

            {/* Chat Stream */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                        
                        {/* User Msg */}
                        {msg.type === 'user' && (
                            <div className="bg-[#1a1a1c] border border-white/10 text-white/90 px-4 py-3 rounded-2xl rounded-tr-sm max-w-[85%] text-sm shadow-lg">
                                {msg.content}
                            </div>
                        )}

                        {/* System Integration Event */}
                        {msg.type === 'system' && (
                            <div className="flex items-center gap-3 my-2 pl-2 w-full">
                                <div className="w-0.5 h-8 bg-gradient-to-b from-[#69B7B2] to-transparent" />
                                <div className="flex flex-wrap gap-2">
                                    {msg.sources.map((s: string, idx: number) => (
                                        <div key={idx} className="flex items-center gap-2 bg-[#69B7B2]/10 border border-[#69B7B2]/20 text-[#69B7B2] px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide">
                                            <Database size={10} /> {s}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Assistant Msg */}
                        {msg.type === 'assistant' && (
                            <div className="flex gap-4 max-w-[90%]">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#69B7B2] to-blue-600 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                                    <Bot size={16} />
                                </div>
                                <div className="space-y-3">
                                    <div className="bg-transparent text-white/80 text-sm leading-relaxed">
                                        {msg.content.split('**').map((part: string, idx: number) => 
                                            idx % 2 === 1 ? <strong key={idx} className="text-white bg-white/10 px-1 rounded">{part}</strong> : part
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="text-[10px] border border-white/10 px-2 py-1 rounded hover:bg-white/5 transition-colors text-white/40 hover:text-white flex items-center gap-1">
                                            <FileText size={10} /> View Source
                                        </button>
                                        <button className="text-[10px] border border-white/10 px-2 py-1 rounded hover:bg-white/5 transition-colors text-white/40 hover:text-white flex items-center gap-1">
                                            <Share2 size={10} /> Share
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                
                {/* Typing Indicator */}
                {step === 0 && (
                    <div className="flex justify-end animate-pulse">
                        <div className="bg-white/5 px-4 py-2 rounded-2xl rounded-tr-sm">
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                                <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                                <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-[#0a0a0c] border-t border-white/5 relative z-10">
                {/* Context Pills attached to input */}
                <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
                    <button className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 text-[10px] font-bold uppercase tracking-wider hover:bg-blue-500/20 transition-colors">
                        <Cloud size={10} /> Salesforce
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-400 text-[10px] font-bold uppercase tracking-wider hover:bg-orange-500/20 transition-colors">
                        <HardDrive size={10} /> AWS S3
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-white/40 text-[10px] font-bold uppercase tracking-wider hover:text-white transition-colors">
                        <Plus size={10} /> Add Source
                    </button>
                </div>

                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#69B7B2]/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-[#151517] border border-white/10 rounded-xl flex items-center p-1 shadow-2xl">
                        <button className="p-2 text-white/30 hover:text-white transition-colors">
                            <Plus size={18} />
                        </button>
                        <input 
                            type="text" 
                            placeholder="Message Bridge..." 
                            className="flex-1 bg-transparent border-none focus:outline-none text-sm text-white px-2 placeholder:text-white/20"
                            readOnly
                        />
                        <button className="p-2 bg-[#69B7B2] text-black rounded-lg hover:bg-white transition-colors">
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 7. REFLECT (Metrics) ---
const ReflectApp = ({ active }: { active: boolean }) => {
    return (
        <div className="w-full h-full bg-[#08080a] p-8 flex flex-col justify-center items-center">
            <div className="w-full max-w-sm space-y-6">
                <div className="flex items-center justify-between text-white mb-2">
                    <span className="text-sm font-bold">Model Accuracy</span>
                    <span className="text-[#69B7B2] font-mono">98.4%</span>
                </div>
                <div className="h-32 flex items-end gap-1">
                    {[40, 65, 50, 80, 75, 90, 85, 95, 92, 98].map((h, i) => (
                        <div key={i} className="flex-1 bg-white/10 hover:bg-[#69B7B2] transition-colors rounded-t-sm" style={{ height: `${h}%` }} />
                    ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                        <div className="text-2xl font-bold text-white mb-1">12ms</div>
                        <div className="text-[9px] text-white/40 uppercase tracking-widest">Latency</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                        <div className="text-2xl font-bold text-white mb-1">0</div>
                        <div className="text-[9px] text-white/40 uppercase tracking-widest">Hallucinations</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN CONTAINER ---
export const FeatureShowcase: React.FC = () => {
    const [activeStage, setActiveStage] = useState(0);
    const [isVideoPlaying, setIsVideoPlaying] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    const stages = [
        { id: 'locate', label: 'Locate', desc: "Connect & Index", icon: HardDrive, comp: LocateApp },
        { id: 'stream', label: 'Stream', desc: "Real-time Feed", icon: Activity, comp: StreamApp },
        { id: 'context', label: 'Context', desc: "Schema Map", icon: Layers, comp: ContextApp },
        { id: 'capture', label: 'Capture', desc: "Logic Builder", icon: Zap, comp: CaptureApp },
        { id: 'control', label: 'Control', desc: "Knowledge Graph", icon: Network, comp: ControlApp },
        { id: 'bridge', label: 'Bridge', desc: "Chat Assistant", icon: Bot, comp: BridgeApp },
        { id: 'reflect', label: 'Reflect', desc: "Optimization", icon: RefreshCw, comp: ReflectApp },
    ];

    const toggleVideo = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsVideoPlaying(true);
            } else {
                videoRef.current.pause();
                setIsVideoPlaying(false);
            }
        }
    };

    return (
        <section className="py-24 md:py-32 bg-[#020202] border-t border-white/5 relative">
            <div className="max-w-[1400px] mx-auto px-6">
                
                {/* Header */}
                <div className="mb-16 md:flex md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-6xl font-serif text-white leading-tight">
                            AI models that <span className="text-[#69B7B2] italic">think like you do.</span>
                        </h2>
                        <p className="mt-6 text-lg text-white/50 font-light">
                            Seven specialized engines working in concert to locate, understand, and act on your enterprise data.
                        </p>
                    </div>
                </div>

                {/* --- MAIN INTERFACE --- */}
                <div className="flex flex-col lg:flex-row h-[700px] lg:h-[650px] bg-[#0c0c0e] rounded-3xl border border-white/10 shadow-2xl overflow-hidden ring-1 ring-white/5 relative z-10">
                    
                    {/* LEFT SIDEBAR NAVIGATION */}
                    <div className="w-full lg:w-64 bg-[#08080a] border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col">
                        
                        {/* Sidebar Header */}
                        <div className="p-6 hidden lg:block">
                            <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2">Modules</div>
                            <div className="h-0.5 w-8 bg-[#69B7B2]" />
                        </div>

                        {/* Nav Items */}
                        <div className="flex-1 overflow-x-auto lg:overflow-y-auto flex lg:flex-col p-2 lg:p-4 gap-1 no-scrollbar">
                            {stages.map((stage, idx) => {
                                const isActive = activeStage === idx;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveStage(idx)}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300 group min-w-[140px] lg:w-full",
                                            isActive 
                                                ? "bg-white/10 text-white shadow-lg border border-white/5" 
                                                : "text-white/40 hover:text-white hover:bg-white/5 border border-transparent"
                                        )}
                                    >
                                        <stage.icon size={16} className={isActive ? "text-[#69B7B2]" : "text-current opacity-50"} />
                                        <div>
                                            <div className="text-xs font-bold uppercase tracking-wider">{stage.label}</div>
                                            <div className="text-[9px] opacity-50 hidden lg:block font-mono mt-0.5">{stage.desc}</div>
                                        </div>
                                        {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#69B7B2] shadow-[0_0_10px_#69B7B2]" />}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* RIGHT CONTENT AREA */}
                    <div className="flex-1 flex flex-col relative bg-[#0c0c0e]">
                        
                        {/* OS Header - With Gito Integrated Top Right */}
                        <WindowHeader 
                            title={`${stages[activeStage].label}_OS`} 
                            icon={stages[activeStage].icon}
                            videoRef={videoRef}
                            isVideoPlaying={isVideoPlaying}
                            toggleVideo={toggleVideo}
                        />

                        {/* Stage Component Container */}
                        <div className="flex-1 relative overflow-hidden bg-[#050505] shadow-inner">
                            {stages.map((stage, idx) => {
                                const Component = stage.comp;
                                const isActive = activeStage === idx;
                                return (
                                    <div 
                                        key={idx}
                                        className={cn(
                                            "absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] flex flex-col",
                                            isActive 
                                                ? "opacity-100 z-10 translate-y-0 scale-100 filter-none" 
                                                : "opacity-0 z-0 translate-y-8 scale-95 pointer-events-none"
                                        )}
                                    >
                                        <Component active={isActive} />
                                    </div>
                                );
                            })}
                        </div>

                    </div>
                </div>

                {/* Mobile Nav Helper */}
                <div className="mt-6 flex justify-between items-center lg:hidden">
                    <button onClick={() => setActiveStage(prev => (prev - 1 + stages.length) % stages.length)} className="text-white/50 hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                        <ArrowLeft size={14} /> Previous
                    </button>
                    <div className="flex gap-1.5">
                        {stages.map((_, i) => (
                            <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === activeStage ? 'bg-[#69B7B2]' : 'bg-white/10'}`} />
                        ))}
                    </div>
                    <button onClick={() => setActiveStage(prev => (prev + 1) % stages.length)} className="text-white/50 hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                        Next <ArrowRight size={14} />
                    </button>
                </div>

            </div>
        </section>
    );
};
