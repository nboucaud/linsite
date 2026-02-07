
import React, { useState, useEffect, useRef } from 'react';
import { 
    ShieldCheck, Activity, FileText, CheckCircle2, 
    Database, Search, Zap, Network, 
    Bot, Minimize, Square, X, ArrowLeft, ArrowRight,
    Folder, Image as ImageIcon, FileSpreadsheet, MoreVertical,
    Grid, List, Clock, Cloud, Lock, Layout,
    Terminal, Code, Play, AlertCircle, Check,
    ChevronRight, ChevronDown, Filter, Download, 
    MoreHorizontal, User, Tag,
    Users, Share2, Globe, Cpu, BarChart3, RefreshCw, Layers,
    MessageSquare, Briefcase, CreditCard, Box,
    File, HardDrive, Plus, Sliders, Table, Columns,
    GitBranch, GitCommit, GitMerge, AlertOctagon,
    ArrowUpRight, PieChart, Bell, Settings,
    Server, Trash2, Sparkles, Mail
} from 'lucide-react';

// --- UTILS ---
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// --- SHARED COMPONENTS ---

const WindowHeader = ({ title, icon: Icon, activeStage }: { title: string, icon: any, activeStage: number }) => (
    <div className="h-12 border-b border-white/10 flex items-center justify-between px-4 bg-[#0a0a0c] select-none rounded-t-xl z-20 relative">
        <div className="flex items-center gap-4">
            <div className="flex gap-2 group">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50" />
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2 text-white/60 text-xs font-medium">
                <Icon size={14} className="text-[#69B7B2]" />
                <span>{title}</span>
            </div>
        </div>
        <div className="flex items-center gap-3 text-white/30">
            <span className="text-[10px] font-mono uppercase tracking-widest">v2.4.0</span>
        </div>
    </div>
);

// --- 1. LOCATE (Simulated File System / "Drive") ---
const LocateApp = ({ active }: { active: boolean }) => {
    const [loading, setLoading] = useState(true);
    
    // Simulate loading state on mount
    useEffect(() => {
        if(active) {
            setLoading(true);
            setTimeout(() => setLoading(false), 800);
        }
    }, [active]);

    const files = [
        { name: "Q3_Financials.xlsx", type: "sheet", size: "2.4 MB", date: "Just now", status: "sync" },
        { name: "Client_Contracts_2025", type: "folder", size: "--", date: "Yesterday", status: "check" },
        { name: "Vendor_API_Keys.txt", type: "code", size: "4 KB", date: "2 days ago", status: "lock" },
        { name: "Employee_Roster_Full.csv", type: "sheet", size: "1.1 MB", date: "Oct 24", status: "check" },
        { name: "Strategic_Plan_v4.pdf", type: "pdf", size: "8.2 MB", date: "Oct 22", status: "check" },
        { name: "CRM_Export_Raw.json", type: "code", size: "45 MB", date: "Oct 20", status: "check" },
    ];

    return (
        <div className="w-full h-full bg-[#0f0f11] text-gray-300 font-sans flex flex-col">
            {/* Toolbar */}
            <div className="h-14 border-b border-white/5 flex items-center px-4 justify-between bg-[#151517]">
                <div className="flex items-center gap-4 w-full max-w-2xl">
                    <div className="bg-[#1e1e20] rounded-md h-9 flex items-center px-3 gap-2 text-gray-500 w-full border border-white/5 hover:border-white/10 transition-colors">
                        <Search size={14} />
                        <span className="text-xs">Search files, folders, and connected apps...</span>
                    </div>
                </div>
                <div className="flex items-center gap-3 text-gray-500">
                    <Bell size={16} />
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 text-[10px] text-white flex items-center justify-center font-bold">JD</div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-56 border-r border-white/5 py-4 hidden md:flex flex-col bg-[#0f0f11]">
                    <div className="px-4 mb-6">
                        <button className="flex items-center justify-center gap-2 w-full bg-white text-black rounded-lg py-2 text-sm font-bold shadow-lg hover:bg-gray-100 transition-colors">
                            <Plus size={16} /> New Connection
                        </button>
                    </div>
                    <div className="space-y-1 px-2">
                        {[{ l: "All Sources", i: HardDrive, a: true }, { l: "External Drives", i: Server }, { l: "Cloud Apps", i: Cloud }, { l: "Trash", i: Trash2 }].map((item, i) => (
                            <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium cursor-pointer ${item.a ? 'bg-[#69B7B2]/10 text-[#69B7B2]' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}>
                                <item.i size={14} /> {item.l}
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-auto px-4 pb-4">
                        <div className="bg-[#1e1e20] rounded-lg p-3 border border-white/5">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] text-gray-400">Storage</span>
                                <span className="text-[10px] text-[#69B7B2]">82%</span>
                            </div>
                            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-[#69B7B2] w-[82%]" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main View */}
                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-white">Connected Sources</h2>
                        <div className="flex gap-2">
                            <button className="p-1.5 rounded hover:bg-white/5 text-gray-400"><List size={16}/></button>
                            <button className="p-1.5 rounded bg-white/10 text-white"><Grid size={16}/></button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {loading ? (
                            [1,2,3,4].map(i => (
                                <div key={i} className="h-32 bg-white/5 rounded-xl animate-pulse" />
                            ))
                        ) : (
                            files.map((f, i) => (
                                <div key={i} className="group bg-[#1a1a1c] hover:bg-[#202022] border border-white/5 hover:border-white/10 rounded-xl p-4 transition-all cursor-pointer flex flex-col justify-between h-32 relative overflow-hidden">
                                    <div className="flex justify-between items-start">
                                        {f.type === 'folder' ? <Folder className="text-blue-400 fill-blue-400/20" size={24} /> : 
                                         f.type === 'sheet' ? <FileSpreadsheet className="text-green-400" size={24} /> :
                                         f.type === 'code' ? <Code className="text-amber-400" size={24} /> :
                                         <FileText className="text-red-400" size={24} />}
                                        <MoreHorizontal size={14} className="text-gray-600 group-hover:text-gray-400" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-200 truncate mb-1">{f.name}</div>
                                        <div className="flex items-center justify-between text-[10px] text-gray-500">
                                            <span>{f.size}</span>
                                            {f.status === 'sync' ? <RefreshCw size={10} className="animate-spin text-[#69B7B2]" /> : 
                                             f.status === 'lock' ? <Lock size={10} className="text-amber-500" /> :
                                             <CheckCircle2 size={10} className="text-gray-600" />}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        
                        {/* Dropzone visual */}
                        <div className="border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-gray-500 gap-2 h-32 hover:border-[#69B7B2]/50 hover:bg-[#69B7B2]/5 transition-colors cursor-pointer group">
                            <div className="p-2 rounded-full bg-white/5 group-hover:bg-[#69B7B2]/20 transition-colors">
                                <Plus size={16} className="group-hover:text-[#69B7B2]" />
                            </div>
                            <span className="text-xs font-medium group-hover:text-[#69B7B2]">Add Source</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 2. STREAM (Simulated Terminal / Log Aggregator) ---
const StreamApp = ({ active }: { active: boolean }) => {
    const [logs, setLogs] = useState<any[]>([]);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(!active) return;
        
        const types = ['INFO', 'WARN', 'SUCCESS', 'DEBUG'];
        const sources = ['stripe_connector', 'auth_service', 'pdf_parser', 'crm_sync'];
        const messages = [
            "Payment webhook received id=evt_1M",
            "Rate limit approaching (80%)",
            "Successfully extracted metadata from INV-2024.pdf",
            "User session established",
            "Syncing batch #4921...",
            "Detected PII in payload, applying redaction",
            "Latency spike detected on node us-east-1a"
        ];

        const interval = setInterval(() => {
            const newLog = {
                id: Date.now(),
                ts: new Date().toISOString().split('T')[1].split('.')[0],
                type: types[Math.floor(Math.random() * types.length)],
                source: sources[Math.floor(Math.random() * sources.length)],
                msg: messages[Math.floor(Math.random() * messages.length)]
            };
            setLogs(prev => [...prev.slice(-15), newLog]);
        }, 800);

        return () => clearInterval(interval);
    }, [active]);

    useEffect(() => {
        if(bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className="w-full h-full bg-[#0c0c0e] font-mono text-xs flex flex-col">
            <div className="h-10 bg-[#1a1a1c] border-b border-white/5 flex items-center px-4 justify-between">
                <div className="flex gap-4 text-gray-400">
                    <span className="text-white font-bold border-b-2 border-[#69B7B2] pb-2.5">Live Tail</span>
                    <span className="hover:text-white cursor-pointer">Analytics</span>
                    <span className="hover:text-white cursor-pointer">Settings</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-green-500">Connected</span>
                </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-1">
                {logs.map(log => (
                    <div key={log.id} className="grid grid-cols-[80px_60px_120px_1fr] gap-2 hover:bg-white/5 p-1 rounded transition-colors border-l-2 border-transparent hover:border-white/20">
                        <span className="text-gray-500">{log.ts}</span>
                        <span className={`${log.type === 'WARN' ? 'text-amber-400' : log.type === 'SUCCESS' ? 'text-green-400' : log.type === 'DEBUG' ? 'text-gray-600' : 'text-blue-400'} font-bold`}>
                            {log.type}
                        </span>
                        <span className="text-purple-400">{log.source}</span>
                        <span className="text-gray-300 truncate">{log.msg}</span>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            <div className="h-8 bg-[#1a1a1c] border-t border-white/5 flex items-center px-4 text-gray-500 gap-4">
                <Terminal size={12} />
                <span>Filter: service:production</span>
            </div>
        </div>
    );
};

// --- 3. CONTEXT (Simulated Doc Editor / Analysis) ---
const ContextApp = ({ active }: { active: boolean }) => {
    return (
        <div className="w-full h-full bg-[#191919] flex">
            {/* Doc View */}
            <div className="flex-1 bg-white p-8 md:p-12 shadow-inner overflow-y-auto">
                <div className="max-w-2xl mx-auto space-y-6">
                    <div className="h-8 w-3/4 bg-gray-100 rounded animate-pulse" />
                    <div className="space-y-2">
                        <div className="h-4 w-full bg-gray-50 rounded" />
                        <div className="h-4 w-full bg-gray-50 rounded" />
                        <div className="h-4 w-2/3 bg-gray-50 rounded" />
                    </div>
                    
                    {/* Highlighted Section */}
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-100 relative group">
                        <div className="absolute -right-3 -top-3 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform">
                            <Bot size={12} />
                        </div>
                        <p className="text-gray-800 text-sm leading-relaxed">
                            "The Contractor agrees to indemnify the Client against all claims arising from negligence. 
                            <span className="bg-yellow-200/50 px-1 rounded mx-1 cursor-pointer border-b-2 border-yellow-400">Termination requires 30 days notice</span> 
                            via certified mail."
                        </p>
                    </div>

                    <div className="space-y-2">
                        <div className="h-4 w-full bg-gray-50 rounded" />
                        <div className="h-4 w-5/6 bg-gray-50 rounded" />
                    </div>
                </div>
            </div>

            {/* Analysis Sidebar */}
            <div className="w-80 bg-[#0f0f11] border-l border-white/5 flex flex-col">
                <div className="p-4 border-b border-white/5">
                    <h3 className="text-white font-bold text-sm flex items-center gap-2">
                        <Sparkles size={14} className="text-[#69B7B2]" /> Context AI
                    </h3>
                </div>
                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                    {/* Entity Card */}
                    <div className="bg-[#1a1a1c] p-3 rounded-lg border border-white/5">
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 font-bold">Detected Entity</div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center text-blue-400">
                                <Briefcase size={16} />
                            </div>
                            <div>
                                <div className="text-white text-xs font-bold">Termination Clause</div>
                                <div className="text-gray-500 text-[10px]">Legal • High Risk</div>
                            </div>
                        </div>
                    </div>

                    {/* Sentiment */}
                    <div className="bg-[#1a1a1c] p-3 rounded-lg border border-white/5">
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 font-bold">Analysis</div>
                        <p className="text-xs text-gray-300 leading-relaxed">
                            This clause deviates from the standard MSA template. Usually 14 days notice is sufficient. 
                            <span className="text-[#69B7B2] cursor-pointer hover:underline ml-1">View precedent</span>
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                        <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded border border-white/5 text-xs text-white transition-colors">
                            Draft Amendment
                        </button>
                        <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded border border-white/5 text-xs text-white transition-colors">
                            Flag for Review
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 4. CAPTURE (Simulated Workflow/Logic Builder) ---
const CaptureApp = ({ active }: { active: boolean }) => {
    return (
        <div className="w-full h-full bg-[#111113] relative overflow-hidden flex cursor-grab active:cursor-grabbing">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" 
                style={{ 
                    backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', 
                    backgroundSize: '20px 20px' 
                }} 
            />

            {/* Nodes */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2">
                <div className="w-64 bg-[#1a1a1c] border border-green-500/50 rounded-xl shadow-xl p-4 relative group">
                    <div className="absolute -top-3 left-4 bg-green-500/10 border border-green-500/50 text-green-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Trigger</div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-white/5 rounded-lg"><Mail size={16} className="text-white"/></div>
                        <div className="text-sm font-bold text-white">New Invoice Email</div>
                    </div>
                    <div className="text-[10px] text-gray-500">Source: billing@company.com</div>
                    
                    {/* Output Dot */}
                    <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-green-500 rounded-full z-10" />
                </div>
            </div>

            {/* Connector Line */}
            <svg className="absolute inset-0 pointer-events-none">
                <path d="M 350 300 C 450 300, 450 300, 550 300" fill="none" stroke="#69B7B2" strokeWidth="2" strokeDasharray="5 5" className="animate-[dash_20s_linear_infinite]" />
            </svg>

            <div className="absolute top-1/2 left-3/4 -translate-y-1/2 -translate-x-1/2">
                <div className="w-64 bg-[#1a1a1c] border border-blue-500/50 rounded-xl shadow-xl p-4 relative">
                    {/* Input Dot */}
                    <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-blue-500 rounded-full z-10" />
                    
                    <div className="absolute -top-3 left-4 bg-blue-500/10 border border-blue-500/50 text-blue-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Action</div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-white/5 rounded-lg"><Database size={16} className="text-white"/></div>
                        <div className="text-sm font-bold text-white">Update CRM</div>
                    </div>
                    <div className="text-[10px] text-gray-500">Match Record ID & Attach PDF</div>
                </div>
            </div>

            {/* Floating Palette */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#1a1a1c] border border-white/10 rounded-full px-6 py-3 flex gap-6 shadow-2xl">
                <div className="flex flex-col items-center gap-1 group cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors"><Zap size={14} className="text-yellow-400"/></div>
                    <span className="text-[9px] text-gray-500">Trigger</span>
                </div>
                <div className="flex flex-col items-center gap-1 group cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors"><GitMerge size={14} className="text-purple-400"/></div>
                    <span className="text-[9px] text-gray-500">Logic</span>
                </div>
                <div className="flex flex-col items-center gap-1 group cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors"><Play size={14} className="text-blue-400"/></div>
                    <span className="text-[9px] text-gray-500">Action</span>
                </div>
            </div>
        </div>
    );
};

// --- 5. CONTROL (Graph / Knowledge Base) ---
const ControlApp = ({ active }: { active: boolean }) => {
    return (
        <div className="w-full h-full bg-[#050505] relative flex overflow-hidden">
            {/* Sidebar Overlay */}
            <div className="absolute left-4 top-4 z-10 w-64 bg-black/80 backdrop-blur border border-white/10 rounded-lg p-4 shadow-xl">
                <div className="flex items-center gap-2 mb-4 text-white/50 text-xs">
                    <Network size={14} /> Knowledge Graph
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm text-gray-300 bg-white/5 p-2 rounded cursor-pointer hover:bg-white/10">
                        <span>Acme Corp</span>
                        <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 rounded">Client</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-300 bg-white/5 p-2 rounded cursor-pointer hover:bg-white/10">
                        <span>MSA_2024.pdf</span>
                        <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 rounded">Contract</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-300 bg-white/5 p-2 rounded cursor-pointer hover:bg-white/10">
                        <span>Risk Policy A</span>
                        <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 rounded">Rule</span>
                    </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="text-[10px] text-gray-500 mb-2">Cypher Query</div>
                    <div className="font-mono text-[10px] text-[#69B7B2] bg-black p-2 rounded border border-white/10">
                        MATCH (n:Client)-[r:HAS_CONTRACT]->(c) RETURN n,r,c LIMIT 1
                    </div>
                </div>
            </div>

            {/* Simulated Graph */}
            <div className="flex-1 relative flex items-center justify-center">
                {/* Center Node */}
                <div className="absolute w-16 h-16 bg-white rounded-full shadow-[0_0_50px_rgba(255,255,255,0.2)] flex items-center justify-center z-10 border-4 border-[#050505] text-black font-bold text-xs">
                    ACME
                </div>
                
                {/* Connections */}
                {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                    <div key={i} className="absolute w-[200px] h-[2px] bg-white/10 origin-left" style={{ transform: `rotate(${deg}deg) translateX(30px)` }}>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#1a1a1c] border border-white/20 rounded-full flex items-center justify-center hover:scale-125 transition-transform cursor-pointer" style={{ transform: `rotate(${-deg}deg)` }}>
                            {i % 2 === 0 ? <FileText size={12} className="text-red-400"/> : <ShieldCheck size={12} className="text-amber-400"/>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- 6. BRIDGE (Task / Agent Fleet) ---
const BridgeApp = ({ active }: { active: boolean }) => {
    return (
        <div className="w-full h-full bg-[#f4f5f7] text-gray-800 font-sans flex flex-col">
            <div className="h-12 border-b border-gray-200 bg-white flex items-center px-4 justify-between">
                <div className="flex items-center gap-4">
                    <span className="font-bold text-gray-700">Agent Operations</span>
                    <div className="flex bg-gray-100 p-0.5 rounded">
                        <div className="px-3 py-0.5 bg-white shadow rounded text-xs font-medium">Board</div>
                        <div className="px-3 py-0.5 text-gray-500 text-xs font-medium">List</div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">4 Active Agents</span>
                    <div className="flex -space-x-2">
                        {[1,2,3].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white" />
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6 overflow-x-auto flex gap-6">
                {/* Column 1: Backlog */}
                <div className="w-72 flex-shrink-0 flex flex-col">
                    <div className="text-xs font-bold text-gray-500 mb-3 flex justify-between">
                        <span>AWAITING (2)</span>
                        <Plus size={14} />
                    </div>
                    <div className="space-y-3">
                        <div className="bg-white p-3 rounded shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow">
                            <div className="text-sm font-medium mb-2">Parse Q3 Invoices</div>
                            <div className="flex items-center justify-between">
                                <div className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-bold">Finance</div>
                                <Bot size={14} className="text-gray-400" />
                            </div>
                        </div>
                        <div className="bg-white p-3 rounded shadow-sm border border-gray-200 cursor-move">
                            <div className="text-sm font-medium mb-2">Sync Salesforce Contacts</div>
                            <div className="flex items-center justify-between">
                                <div className="bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded text-[10px] font-bold">Sales</div>
                                <Bot size={14} className="text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 2: Active */}
                <div className="w-72 flex-shrink-0 flex flex-col">
                    <div className="text-xs font-bold text-gray-500 mb-3">PROCESSING (1)</div>
                    <div className="space-y-3">
                        <div className="bg-white p-3 rounded shadow-sm border-l-4 border-green-500 cursor-pointer">
                            <div className="text-sm font-medium mb-2">Drafting Renewal Contracts</div>
                            <div className="w-full bg-gray-100 h-1.5 rounded-full mb-3 overflow-hidden">
                                <div className="bg-green-500 h-full w-2/3 animate-[pulse_2s_infinite]" />
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <div className="w-4 h-4 rounded bg-green-100 flex items-center justify-center text-green-600"><Bot size={10}/></div>
                                <span>Legal_Agent_01</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 3: Done */}
                <div className="w-72 flex-shrink-0 flex flex-col">
                    <div className="text-xs font-bold text-gray-500 mb-3">COMPLETE</div>
                    <div className="space-y-3 opacity-60">
                        <div className="bg-white p-3 rounded shadow-sm border border-gray-200">
                            <div className="text-sm font-medium mb-2 line-through text-gray-400">Daily Audit Report</div>
                            <div className="flex items-center justify-between">
                                <div className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-[10px] font-bold">Compliance</div>
                                <Check size={14} className="text-green-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 7. REFLECT (Performance Dashboard) ---
const ReflectApp = ({ active }: { active: boolean }) => {
    return (
        <div className="w-full h-full bg-[#0f1117] text-white p-6 grid grid-cols-3 gap-6">
            {/* Header / Stats */}
            <div className="col-span-3 flex items-end justify-between mb-2">
                <div>
                    <h2 className="text-xl font-bold">Model Performance</h2>
                    <p className="text-xs text-gray-500">Last 24 Hours • Production Env</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors">Retrain</button>
                    <button className="bg-[#1f2937] hover:bg-[#374151] px-3 py-1.5 rounded text-xs font-bold transition-colors">Export Logs</button>
                </div>
            </div>

            {/* Main Chart */}
            <div className="col-span-2 bg-[#1f2937] rounded-xl p-4 border border-white/5 relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-bold text-gray-400 uppercase">Accuracy vs Confidence</span>
                    <MoreHorizontal size={14} className="text-gray-500" />
                </div>
                
                {/* Fake Chart CSS */}
                <div className="h-40 flex items-end justify-between gap-1 px-2">
                    {[40, 65, 55, 80, 70, 85, 90, 85, 95, 92, 96, 94, 98].map((h, i) => (
                        <div key={i} className="w-full bg-blue-500/20 hover:bg-blue-500 transition-colors rounded-t-sm relative group" style={{ height: `${h}%` }}>
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                {h}%
                            </div>
                        </div>
                    ))}
                </div>
                {/* Overlay Line */}
                <svg className="absolute bottom-4 left-6 right-6 h-40 w-[90%] pointer-events-none" preserveAspectRatio="none">
                    <path d="M0,100 C 50,80 100,90 150,40 S 300,50 400,20 S 500,10 600,5" fill="none" stroke="#69B7B2" strokeWidth="2" />
                </svg>
            </div>

            {/* Right Column Stats */}
            <div className="col-span-1 space-y-4">
                <div className="bg-[#1f2937] p-4 rounded-xl border border-white/5">
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Drift Detected</div>
                    <div className="text-2xl font-bold text-amber-400">2.4%</div>
                    <div className="text-[10px] text-gray-500 mt-1">Within tolerance (5%)</div>
                </div>
                <div className="bg-[#1f2937] p-4 rounded-xl border border-white/5">
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Human Review</div>
                    <div className="text-2xl font-bold text-white">14</div>
                    <div className="text-[10px] text-gray-500 mt-1">Items flagged for review</div>
                </div>
                <div className="bg-[#1f2937] p-4 rounded-xl border border-white/5">
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Est. Cost Savings</div>
                    <div className="text-2xl font-bold text-green-400">$4,200</div>
                    <div className="text-[10px] text-gray-500 mt-1">This month</div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN CONTAINER ---
export const FeatureShowcase: React.FC = () => {
    const [activeStage, setActiveStage] = useState(0);

    const stages = [
        { id: 'locate', label: 'Locate', icon: HardDrive, comp: LocateApp, color: '#FF5F56' },
        { id: 'stream', label: 'Stream', icon: Activity, comp: StreamApp, color: '#FFBD2E' },
        { id: 'context', label: 'Context', icon: Layers, comp: ContextApp, color: '#27C93F' },
        { id: 'capture', label: 'Capture', icon: Zap, comp: CaptureApp, color: '#22d3ee' },
        { id: 'control', label: 'Control', icon: Network, comp: ControlApp, color: '#a78bfa' },
        { id: 'bridge', label: 'Bridge', icon: Cpu, comp: BridgeApp, color: '#f472b6' },
        { id: 'reflect', label: 'Reflect', icon: RefreshCw, comp: ReflectApp, color: '#34d399' },
    ];

    const nextStage = () => { setActiveStage(prev => (prev + 1) % stages.length); };
    const prevStage = () => { setActiveStage(prev => (prev - 1 + stages.length) % stages.length); };

    return (
        <section className="py-32 bg-[#020202] border-t border-white/5 relative">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Header */}
                <div className="mb-16 md:flex md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-6xl font-serif text-white leading-tight">
                            The Agentic <span className="text-[#69B7B2] italic">Operating System.</span>
                        </h2>
                        <p className="mt-6 text-lg text-white/50 font-light">
                            Seven specialized engines working in concert to locate, understand, and act on your enterprise data.
                        </p>
                    </div>
                </div>

                {/* Main Content Layout */}
                <div className="flex flex-col gap-8">
                    
                    {/* Navigation Pills */}
                    <div className="flex overflow-x-auto gap-2 pb-4 no-scrollbar">
                        {stages.map((stage, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveStage(idx)}
                                className={cn(
                                    "flex items-center gap-3 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 border flex-shrink-0",
                                    activeStage === idx 
                                        ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]" 
                                        : "bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white"
                                )}
                            >
                                <stage.icon size={14} />
                                {stage.label}
                            </button>
                        ))}
                    </div>

                    {/* App Container (The "Screen") */}
                    <div className="relative w-full aspect-[16/10] md:aspect-[21/9] bg-[#0c0c0e] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col ring-1 ring-white/5">
                        
                        {/* Fake Browser Chrome / Window Header */}
                        <WindowHeader 
                            title={stages[activeStage].label + "_Module"} 
                            icon={stages[activeStage].icon}
                            activeStage={activeStage}
                        />

                        {/* Content Area */}
                        <div className="flex-1 relative overflow-hidden bg-black/50 backdrop-blur-sm">
                            {stages.map((stage, idx) => {
                                const Component = stage.comp;
                                return (
                                    <div 
                                        key={idx}
                                        className={cn(
                                            "absolute inset-0 transition-all duration-500 ease-out flex flex-col",
                                            activeStage === idx 
                                                ? "opacity-100 z-10 translate-y-0 scale-100 filter-none" 
                                                : "opacity-0 z-0 translate-y-4 scale-95 pointer-events-none"
                                        )}
                                    >
                                        <Component active={activeStage === idx} />
                                    </div>
                                );
                            })}
                        </div>

                    </div>
                    
                    {/* Caption / Helper Text */}
                    <div className="flex justify-between items-start text-white/30 text-sm font-mono mt-4">
                        <div className="max-w-md">
                            <span className="text-[#69B7B2] font-bold">
                                {stages[activeStage].label}:
                            </span> 
                            <span className="ml-2">
                                {activeStage === 0 && "Connects to fragmented silos (Drives, ERPs, APIs) to index raw business data."}
                                {activeStage === 1 && "Ingests live operational events in real-time, creating a normalized activity stream."}
                                {activeStage === 2 && "Structures unstructured text, identifying entities, sentiment, and risks."}
                                {activeStage === 3 && "Allows leaders to define deterministic rules and triggers without writing code."}
                                {activeStage === 4 && "Visualizes hidden relationships between clients, contracts, and assets."}
                                {activeStage === 5 && "Deploys autonomous agents to execute tasks within defined boundaries."}
                                {activeStage === 6 && "Monitors agent performance, detecting drift and initiating retraining loops."}
                            </span>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={prevStage} className="hover:text-white transition-colors"><ArrowLeft size={20}/></button>
                            <button onClick={nextStage} className="hover:text-white transition-colors"><ArrowRight size={20}/></button>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
};
