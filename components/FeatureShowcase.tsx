
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
    PlayCircle, PauseCircle, Scan
} from 'lucide-react';

// --- UTILS ---
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// --- SHARED COMPONENTS ---

const WindowHeader = ({ title, icon: Icon }: { title: string, icon: any }) => (
    <div className="h-10 border-b border-white/10 flex items-center justify-between px-4 bg-[#0a0a0c] select-none rounded-t-xl z-20 relative">
        <div className="flex items-center gap-4">
            <div className="flex gap-1.5 group">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-[#E0443E]/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-[#1AAB29]/50" />
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2 text-white/60 text-[10px] font-medium font-mono uppercase tracking-wider">
                <Icon size={12} className="text-[#69B7B2]" />
                <span>{title}</span>
            </div>
        </div>
        <div className="flex items-center gap-3 text-white/20">
            <Settings size={12} />
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
                setScannedCount(prev => Math.min(prev + 1, 6));
            }, 300);
            return () => clearInterval(interval);
        }
    }, [active]);

    const sources = [
        { name: "SharePoint_Legal", type: "cloud", size: "1.2 TB", status: "Indexing...", color: "text-blue-400" },
        { name: "Salesforce_CRM", type: "db", size: "450 GB", status: "Connected", color: "text-sky-400" },
        { name: "Q3_Invoices_S3", type: "server", size: "85 GB", status: "Scanning", color: "text-amber-400" },
        { name: "Slack_History", type: "chat", size: "12 GB", status: "Waiting", color: "text-purple-400" },
        { name: "Legacy_Oracle", type: "db", size: "4.5 TB", status: "Queued", color: "text-red-400" },
        { name: "Email_Archive", type: "mail", size: "890 GB", status: "Paused", color: "text-gray-400" },
    ];

    return (
        <div className="w-full h-full bg-[#0c0c0e] flex flex-col font-sans">
            <div className="h-12 border-b border-white/5 flex items-center px-4 justify-between bg-[#151517]">
                <div className="flex items-center gap-2 text-white/40 text-xs">
                    <span className="hover:text-white cursor-pointer">Sources</span>
                    <span className="text-white/20">/</span>
                    <span className="text-white">Active Connections</span>
                </div>
                <button className="bg-[#69B7B2] text-black text-[10px] font-bold px-3 py-1.5 rounded flex items-center gap-2 hover:bg-[#5aa09c] transition-colors">
                    <Plus size={12} /> Add Source
                </button>
            </div>

            <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto">
                {sources.map((s, i) => {
                    const isScanned = i < scannedCount;
                    return (
                        <div key={i} className={`group bg-[#121214] border border-white/5 p-4 rounded-xl relative overflow-hidden transition-all duration-500 ${isScanned ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                            {isScanned && i % 2 === 0 && (
                                <div className="absolute top-0 left-0 w-full h-0.5 bg-[#69B7B2] animate-[loading_2s_ease-in-out_infinite]" />
                            )}
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-2.5 rounded-lg bg-white/5 ${s.color}`}>
                                    {s.type === 'cloud' ? <Globe size={18} /> : 
                                     s.type === 'db' ? <Database size={18} /> : 
                                     s.type === 'server' ? <Server size={18} /> : 
                                     s.type === 'mail' ? <Mail size={18} /> :
                                     <MessageSquare size={18} />}
                                </div>
                                <div className={`text-[9px] font-bold uppercase px-2 py-1 rounded border ${i === 2 ? 'border-[#69B7B2]/30 text-[#69B7B2] bg-[#69B7B2]/10 animate-pulse' : 'border-white/10 text-white/30'}`}>
                                    {i === 2 ? 'Scanning' : s.status}
                                </div>
                            </div>
                            <h4 className="text-white font-medium text-sm mb-1">{s.name}</h4>
                            <p className="text-white/30 text-xs font-mono">{s.size}</p>
                        </div>
                    );
                })}
                
                <div className="border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 text-white/20 hover:text-white/40 hover:border-white/20 transition-all cursor-pointer min-h-[120px]">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                        <Plus size={16} />
                    </div>
                    <span className="text-xs font-medium">Connect New</span>
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
            
            setEvents(prev => [newEvent, ...prev].slice(0, 6)); // Keep last 6
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
                    <span className="font-bold">LIVE_FEED</span>
                </div>
                <div className="flex-1 h-px bg-white/5" />
                <div className="text-white/30">4 Agents Active</div>
            </div>

            {/* Stream Content */}
            <div className="flex-1 p-4 space-y-4 overflow-hidden relative">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '100% 20px' }} />

                {events.map((ev) => (
                    <div key={ev.id} className="relative pl-8 group animate-in slide-in-from-top-2 duration-500">
                        {/* Timeline Line */}
                        <div className="absolute left-3 top-0 bottom-0 w-px bg-white/10 group-last:bg-gradient-to-b group-last:from-white/10 group-last:to-transparent" />
                        
                        {/* Status Dot */}
                        <div className={`absolute left-[9px] top-4 w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                            ev.status === 'done' ? 'bg-[#69B7B2] shadow-[0_0_8px_#69B7B2]' : 
                            ev.status === 'processing' ? 'bg-amber-400 animate-ping' : 
                            'bg-white/20'
                        }`} />

                        <div className={`relative p-3 rounded-lg border transition-all duration-500 ${
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
                                <div className={`inline-flex items-center gap-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${ev.bg} ${ev.color} ${ev.border} border`}>
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
                                <div className="mt-2 flex gap-2 animate-in fade-in">
                                    <span className="bg-[#69B7B2]/10 text-[#69B7B2] px-1.5 py-0.5 rounded border border-[#69B7B2]/20 flex items-center gap-1">
                                        <CheckCircle2 size={8} /> Processed
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
                    <div className="text-white/60 text-xs leading-relaxed font-mono p-4 bg-white/5 rounded-lg border border-white/5 shadow-inner">
                        <span className="bg-blue-500/20 text-blue-300 px-1 rounded">INVOICE #9921</span><br/>
                        Vendor: <span className="bg-purple-500/20 text-purple-300 px-1 rounded">Acme Corp</span><br/>
                        Date: <span className="bg-green-500/20 text-green-300 px-1 rounded">Oct 24, 2025</span><br/>
                        Items: Server Racks (x4)<br/>
                        Total: <span className="bg-amber-500/20 text-amber-300 px-1 rounded">$12,400.00</span>
                    </div>
                </div>

                {/* Center: Connector Lines (Canvas simulated via SVG) */}
                <div className="absolute inset-0 pointer-events-none">
                    <svg className="w-full h-full">
                        <path d="M 200 120 C 300 120, 300 100, 400 100" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_1s_linear_infinite]" />
                        <path d="M 200 140 C 300 140, 300 160, 400 160" fill="none" stroke="#a855f7" strokeWidth="2" strokeOpacity="0.5" />
                        <path d="M 200 200 C 300 200, 300 220, 400 220" fill="none" stroke="#f59e0b" strokeWidth="2" strokeOpacity="0.5" />
                    </svg>
                </div>

                {/* Right: Structured Schema */}
                <div className="w-1/2 p-6 space-y-4 bg-[#0a0a0c]">
                    <div className="text-[10px] font-bold text-[#69B7B2] uppercase tracking-widest mb-2 flex items-center gap-2">
                        <FileJson size={12} /> Normalized Schema
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 rounded bg-[#1a1a1c] border border-blue-500/30">
                            <span className="text-blue-400 text-xs font-bold">id</span>
                            <span className="text-white text-xs">"INV-9921"</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-[#1a1a1c] border border-purple-500/30">
                            <span className="text-purple-400 text-xs font-bold">entity</span>
                            <span className="text-white text-xs">"Acme Corp"</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-[#1a1a1c] border border-white/5">
                            <span className="text-gray-500 text-xs font-bold">date_iso</span>
                            <span className="text-white text-xs">"2025-10-24"</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-[#1a1a1c] border border-amber-500/30">
                            <span className="text-amber-400 text-xs font-bold">amount</span>
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
            <div className="absolute left-4 top-4 bg-black/80 backdrop-blur border border-white/10 p-4 rounded-xl w-48">
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

// --- 6. BRIDGE (Agent Fleet) ---
const BridgeApp = ({ active }: { active: boolean }) => {
    const agents = [
        { name: "Compliance_Bot", status: "Auditing", progress: 65, color: "bg-blue-500" },
        { name: "Risk_Analyzer", status: "Idle", progress: 0, color: "bg-white/20" },
        { name: "Outreach_Agent", status: "Sending", progress: 32, color: "bg-green-500" },
        { name: "Data_Miner", status: "Extraction", progress: 88, color: "bg-purple-500" }
    ];

    return (
        <div className="w-full h-full bg-[#0c0c0e] p-8 grid grid-cols-2 gap-4 overflow-y-auto">
            {agents.map((a, i) => (
                <div key={i} className="bg-[#151517] border border-white/5 p-4 rounded-xl flex flex-col justify-between hover:border-white/20 transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                            <Bot size={20} className="text-white/60" />
                        </div>
                        <div className={`text-[9px] font-bold uppercase px-2 py-1 rounded ${a.status === 'Idle' ? 'bg-white/5 text-white/30' : 'bg-white/10 text-white'}`}>
                            {a.status}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-xs mb-2">{a.name}</h4>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full ${a.color} transition-all duration-1000`} style={{ width: `${a.progress}%` }} />
                        </div>
                    </div>
                </div>
            ))}
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
        { id: 'bridge', label: 'Bridge', desc: "Agent Fleet", icon: Cpu, comp: BridgeApp },
        { id: 'reflect', label: 'Reflect', desc: "Optimization", icon: RefreshCw, comp: ReflectApp },
    ];

    const toggleVideo = () => {
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
                            The Agentic <span className="text-[#69B7B2] italic">OS.</span>
                        </h2>
                        <p className="mt-6 text-lg text-white/50 font-light">
                            A complete operating system for enterprise intelligence. From raw data ingestion to autonomous action.
                        </p>
                    </div>
                </div>

                {/* --- MAIN INTERFACE --- */}
                <div className="flex flex-col lg:flex-row h-[700px] lg:h-[600px] bg-[#0c0c0e] rounded-3xl border border-white/10 shadow-2xl overflow-hidden ring-1 ring-white/5 relative z-10">
                    
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

                        {/* GITO VIDEO AGENT (Bottom Sidebar) */}
                        <div className="p-4 border-t border-white/5 hidden lg:block">
                            <div className="relative group cursor-pointer" onClick={toggleVideo}>
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#69B7B2] to-blue-500 rounded-full opacity-30 group-hover:opacity-70 blur transition duration-500" />
                                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-black bg-black">
                                    <video 
                                        ref={videoRef}
                                        src="https://jar5gzlwdkvsnpqa.public.blob.vercel-storage.com/Untitled%20design%20%2847%29.webm"
                                        autoPlay 
                                        loop 
                                        muted 
                                        playsInline
                                        className="w-full h-full object-cover transform scale-110"
                                    />
                                    {/* Play/Pause Overlay */}
                                    {!isVideoPlaying && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <PlayCircle size={20} className="text-white" />
                                        </div>
                                    )}
                                </div>
                                
                                {/* Status Indicator */}
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full z-10" />
                                
                                {/* Tooltip */}
                                <div className="absolute left-16 top-1/2 -translate-y-1/2 w-32 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                    <div className="bg-white text-black text-[9px] font-bold px-3 py-2 rounded-lg shadow-xl relative">
                                        <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-white rotate-45" />
                                        Gito is online.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT CONTENT AREA */}
                    <div className="flex-1 flex flex-col relative bg-[#0c0c0e]">
                        
                        {/* OS Header */}
                        <WindowHeader title={`${stages[activeStage].label}_OS`} icon={stages[activeStage].icon} />

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
