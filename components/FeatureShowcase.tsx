
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
    MessageSquare, Briefcase, CreditCard, Box
} from 'lucide-react';

// --- UTILS ---
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// --- SHARED COMPONENTS ---

const WindowHeader = ({ title, color = "bg-[#0c0c0e]" }: { title: string, color?: string }) => (
    <div className={`h-12 border-b border-white/5 flex items-center justify-center px-4 ${color} select-none rounded-t-xl z-20 relative`}>
        <div className="absolute left-4 flex items-center gap-4">
            <div className="flex gap-2 group">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50" />
            </div>
            {/* Fake Browser Tabs */}
            <div className="flex gap-2">
                <div className="px-4 py-1.5 bg-white/10 rounded-t-lg text-[10px] text-white/80 font-medium flex items-center gap-2 border-t border-x border-white/5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-[#69B7B2] animate-pulse"/> {title} <X size={10} className="opacity-50 ml-2" />
                </div>
                <div className="px-4 py-1.5 hover:bg-white/5 rounded-t-lg text-[10px] text-white/40 font-medium flex items-center gap-2 border-b border-transparent hover:border-white/5 transition-colors cursor-pointer">
                    <span className="opacity-50">+</span>
                </div>
            </div>
        </div>
        <div className="hidden md:flex items-center gap-4 text-[10px] font-mono text-white/30 ml-auto">
            infogito-agent-v2.4.0
        </div>
    </div>
);

const Cursor = ({ x, y, label }: { x: number, y: number, label?: string }) => (
    <div 
        className="absolute pointer-events-none transition-all duration-500 ease-in-out z-50 drop-shadow-xl"
        style={{ left: `${x}%`, top: `${y}%` }}
    >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="transform -translate-x-1 -translate-y-1">
            <path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z" fill="#69B7B2" stroke="white"/>
        </svg>
        {label && (
            <div className="absolute left-4 top-4 bg-[#69B7B2] text-black text-[9px] font-bold px-2 py-1 rounded-full whitespace-nowrap shadow-sm">
                {label}
            </div>
        )}
    </div>
);

// --- 1. LOCATE (Sources) ---
const LocateInterface = ({ active }: { active: boolean }) => {
    const [scanProgress, setScanProgress] = useState<Record<string, number>>({});
    const [cursor, setCursor] = useState({ x: 50, y: 50 });
    
    // SMB / Modern Tech Stack Sources
    const sources = [
        { id: '1', name: 'CRM_Export_Q3', type: 'crm', status: 'connected', icon: Users },
        { id: '2', name: 'Stripe_Transactions', type: 'finance', status: 'indexing', icon: CreditCard },
        { id: '3', name: 'Support_Tickets', type: 'api', status: 'scanning', icon: MessageSquare },
        { id: '4', name: 'Legal_Contracts.pdf', type: 'doc', status: 'synced', icon: FileText },
        { id: '5', name: 'Legacy_SQL_Dump', type: 'db', status: 'ingesting', icon: Database },
        { id: '6', name: 'Slack_History', type: 'cloud', status: 'connected', icon: Briefcase },
    ];

    useEffect(() => {
        if (!active) {
            setScanProgress({});
            return;
        }

        const sequence = async () => {
            setCursor({ x: 20, y: 35 });
            await new Promise(r => setTimeout(r, 600));
            setScanProgress(p => ({ ...p, '1': 100 })); 

            setCursor({ x: 50, y: 35 });
            await new Promise(r => setTimeout(r, 500));
            setScanProgress(p => ({ ...p, '2': 40 })); 

            setCursor({ x: 80, y: 35 });
            await new Promise(r => setTimeout(r, 500));
            setScanProgress(p => ({ ...p, '3': 60 }));

            // Rapid scan rest
            setTimeout(() => { setScanProgress(prev => ({...prev, '2': 100})); }, 1000);
            setTimeout(() => { setScanProgress(prev => ({...prev, '3': 100})); }, 1500);
            setTimeout(() => { setScanProgress(prev => ({...prev, '5': 100})); }, 1800);
        };

        sequence();
    }, [active]);

    return (
        <div className="w-full h-full bg-[#1a1a1c] text-gray-300 font-sans flex flex-col relative overflow-hidden text-xs">
            <Cursor x={cursor.x} y={cursor.y} label="Identifying Sources..." />
            
            {/* Toolbar */}
            <div className="h-14 border-b border-white/5 flex items-center px-4 justify-between bg-[#202124]">
                <div className="flex items-center gap-4 w-full max-w-xl">
                    <span className="text-lg font-medium text-white tracking-tight flex items-center gap-2">
                        <Globe size={18} className="text-[#69B7B2]" />
                        Source Map
                    </span>
                    <div className="flex-1 bg-[#303134] rounded-lg h-9 flex items-center px-4 gap-2 text-gray-400 font-mono text-[10px]">
                        <Search size={14} />
                        <span>Searching integrated ecosystem...</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {sources.map(s => {
                        const scanned = scanProgress[s.id] === 100;
                        const scanning = scanProgress[s.id] > 0 && scanProgress[s.id] < 100;
                        const Icon = s.icon;
                        
                        return (
                            <div key={s.id} className="relative group bg-[#252528] rounded-xl p-4 border border-white/5 hover:border-white/20 transition-all overflow-hidden shadow-lg">
                                {(scanning || scanned) && (
                                    <div className={`absolute inset-0 bg-[#69B7B2]/5 z-10 flex items-center justify-center backdrop-blur-[1px] transition-opacity ${scanned ? 'opacity-0' : 'opacity-100'}`}>
                                        <div className="text-[#69B7B2] font-mono font-bold text-[9px] uppercase tracking-widest animate-pulse">Connecting...</div>
                                    </div>
                                )}
                                {scanned && (
                                    <div className="absolute top-2 right-2 text-[#69B7B2] animate-in zoom-in">
                                        <CheckCircle2 size={14} />
                                    </div>
                                )}

                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`p-2 rounded-lg ${scanned ? 'bg-[#69B7B2]/20 text-[#69B7B2]' : 'bg-white/5 text-white/30'}`}>
                                        <Icon size={16} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-white truncate">{s.name}</div>
                                        <div className="text-[9px] text-white/40 font-mono capitalize">{s.type}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${scanned ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`} />
                                    <span className="text-[9px] uppercase tracking-wider font-bold text-white/30">{scanned ? 'Sync Active' : s.status}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// --- 2. STREAM (Live Events) ---
const StreamInterface = ({ active }: { active: boolean }) => {
    const [lines, setLines] = useState<string[]>([]);
    const [dataRate, setDataRate] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [sparkline, setSparkline] = useState<number[]>(new Array(30).fill(5));

    useEffect(() => {
        if (!active) {
            setLines([]);
            setSparkline(new Array(30).fill(5));
            return;
        }

        const logs = [
            "EVENT: New Ticket #9921 (Billing Issue) received via Email.",
            "INGEST: Parsing PDF attachment 'Invoice_Oct.pdf'...",
            "MATCH: Client 'Acme Corp' identified in CRM.",
            "ACTION: Slack notification sent to #sales-team.",
            "STREAM: Updating revenue dashboard (+$4,200).",
            "WARN: Sentiment Analysis: Negative (Priority Escalated).",
            "EVENT: Stripe payment succeeded for User_882.",
            "LINK: Correlating support ticket with payment history...",
            "DETECT: Churn risk identified based on usage patterns.",
            "SYNC: Operational baseline updated."
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i < logs.length) {
                setLines(prev => [...prev, logs[i]]);
                setDataRate(Math.floor(Math.random() * 800) + 2400);
                setSparkline(prev => [...prev.slice(1), Math.random() * 24]);
                i++;
            } else {
                setLines(prev => [...prev, "STREAM: Monitoring active..."]);
                setSparkline(prev => [...prev.slice(1), Math.random() * 24]);
            }
        }, 300);

        return () => clearInterval(interval);
    }, [active]);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [lines]);

    return (
        <div className="w-full h-full bg-[#0c0c0e] font-mono text-xs md:text-sm p-4 flex flex-col border border-white/5 rounded-b-xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                <div className="flex gap-3 text-white/50 items-center">
                    <Activity size={14} className="text-[#69B7B2] animate-pulse" />
                    <span className="font-bold text-white/80">Business_Stream_v1</span>
                    <span className="bg-[#69B7B2]/10 px-2 py-0.5 rounded text-[9px] text-[#69B7B2] border border-[#69B7B2]/20">LIVE FEED</span>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="flex items-end gap-0.5 h-4 w-24">
                        {sparkline.map((val, i) => (
                            <div key={i} className="w-1 bg-[#69B7B2]" style={{ height: `${val + 2}px`, opacity: i/30 }} />
                        ))}
                    </div>
                    <span className="text-[#69B7B2] text-[10px] font-bold">{dataRate} events/s</span>
                </div>
            </div>
            
            <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-2 text-white/70 font-mono text-[10px] md:text-[11px] leading-relaxed">
                {lines.map((line, i) => (
                    <div key={i} className="animate-in slide-in-from-left-2 fade-in duration-300 flex border-l-2 border-transparent hover:border-white/10 hover:bg-white/5 pl-2 py-0.5">
                        <span className="text-white/20 mr-4 w-14 shrink-0 text-right select-none">
                            {new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' })}
                        </span>
                        <span className={
                            line.includes("WARN") ? "text-amber-400 font-bold" :
                            line.includes("EVENT") ? "text-[#69B7B2]" :
                            line.includes("LINK") ? "text-purple-400" :
                            line.includes("ACTION") ? "text-blue-400" : "text-white/80"
                        }>
                            {line}
                        </span>
                    </div>
                ))}
                <div className="w-2 h-4 bg-[#69B7B2] animate-pulse inline-block align-middle ml-[4.5rem] mt-1" />
            </div>
        </div>
    );
};

// --- 3. CONTEXT (Attribution) ---
const ContextInterface = ({ active }: { active: boolean }) => {
    const [rawText, setRawText] = useState("");
    const [jsonContent, setJsonContent] = useState<any>({});
    const [highlight, setHighlight] = useState(false);

    useEffect(() => {
        if (!active) {
            setRawText("");
            setJsonContent({});
            setHighlight(false);
            return;
        }

        const source = "Received email from 'Enterprise Client A'. Subject: 'Platform issues / Renewal?'. Sentiment score is low. Contract expires in 14 days.";
        
        let i = 0;
        const typeInterval = setInterval(() => {
            setRawText(source.substring(0, i));
            i++;
            if (i > source.length) {
                clearInterval(typeInterval);
                setHighlight(true);
                
                // Build JSON step-by-step
                setTimeout(() => setJsonContent(prev => ({ ...prev, type: "Client_Communication" })), 300);
                setTimeout(() => setJsonContent(prev => ({ ...prev, sentiment: "NEGATIVE" })), 800);
                setTimeout(() => setJsonContent(prev => ({ ...prev, intent: "Renewal_Risk" })), 1200);
                setTimeout(() => setJsonContent(prev => ({ ...prev, deal_value: "$50,000 ARR" })), 1600);
                setTimeout(() => setJsonContent(prev => ({ ...prev, action: "Notify_Founder_Immediate" })), 2000);
            }
        }, 30);

        return () => clearInterval(typeInterval);
    }, [active]);

    // Simple syntax highlighter for JSON
    const renderJSON = (data: any) => {
        if (Object.keys(data).length === 0) return <span className="text-white/20 italic">Awaiting Context...</span>;
        
        return (
            <div className="font-mono text-xs">
                <span className="text-yellow-400">{'{'}</span>
                {Object.entries(data).map(([key, value], idx) => (
                    <div key={key} className="pl-4 animate-in slide-in-from-left-2 fade-in duration-300">
                        <span className="text-sky-300">"{key}"</span>: <span className="text-orange-300">"{value}"</span>
                        {idx < Object.keys(data).length - 1 && <span className="text-white/50">,</span>}
                    </div>
                ))}
                <span className="text-yellow-400">{'}'}</span>
            </div>
        );
    };

    return (
        <div className="w-full h-full bg-[#1e1e1e] flex text-sm font-mono overflow-hidden">
            {/* Sidebar */}
            <div className="w-10 border-r border-white/5 flex flex-col items-center py-4 gap-4 text-white/40 bg-[#252526]">
                <FileText size={18} className="text-white" />
                <Search size={18} />
                <Network size={18} />
            </div>

            {/* Editor Area */}
            <div className="flex-1 flex flex-col md:flex-row">
                {/* Left: Raw Input */}
                <div className="flex-1 border-r border-white/5 relative flex flex-col">
                    <div className="bg-[#2d2d2d] px-4 py-2 text-[10px] uppercase text-white/50 font-bold flex justify-between">
                        <span>input_stream.txt</span>
                        <span className="opacity-50">READ-ONLY</span>
                    </div>
                    <div className="flex-1 p-6 relative bg-[#1e1e1e]">
                        <div className="text-white/60 leading-relaxed whitespace-pre-wrap relative z-10 font-mono text-xs">
                            {rawText}
                        </div>
                        {highlight && <div className="absolute inset-0 bg-[#69B7B2]/5 animate-pulse pointer-events-none" />}
                    </div>
                </div>

                {/* Right: Structured Output */}
                <div className="flex-1 bg-[#1a1a1a] flex flex-col">
                    <div className="bg-[#2d2d2d] px-4 py-2 text-[10px] uppercase text-[#69B7B2] font-bold flex justify-between border-l border-white/5">
                        <span className="flex items-center gap-2"><Bot size={12}/> semantic_layer.json</span>
                        {highlight && <span className="animate-pulse flex items-center gap-1"><RefreshCw size={10} className="animate-spin"/> Attributing...</span>}
                    </div>
                    
                    <div className="flex-1 flex">
                        <div className="w-8 bg-[#1e1e1e] text-right pr-2 pt-6 text-[10px] text-white/20 select-none border-r border-white/5 font-mono leading-relaxed">
                            {[1,2,3,4,5,6,7].map(n => <div key={n}>{n}</div>)}
                        </div>
                        
                        <div className="p-6 flex-1">
                            {renderJSON(jsonContent)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 4. CAPTURE (Logic Builder) ---
interface TaskItem {
    id: string;
    title: string;
    tag: string;
    priority: string;
    avatar: string;
}

const GovernanceCard: React.FC<{ item: TaskItem }> = ({ item }) => (
    <div className="bg-[#2c2c2e] p-3 rounded-lg shadow-md border border-white/5 mb-2 animate-in slide-in-from-bottom-2 fade-in group cursor-default hover:border-white/20 transition-all">
        <div className="flex justify-between items-start mb-2">
            <span className="text-[9px] font-mono text-white/30">{item.id}</span>
            {item.priority === 'High' && (
                <div className="w-4 h-4 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center text-[8px] font-bold">!</div>
            )}
        </div>
        <div className="text-xs font-bold text-white mb-3 leading-tight">{item.title}</div>
        <div className="flex items-center justify-between mt-auto">
            <span className="px-1.5 py-0.5 rounded bg-[#69B7B2]/10 text-[#69B7B2] text-[9px] font-bold uppercase tracking-wider border border-[#69B7B2]/20">{item.tag}</span>
            <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-[8px] font-bold text-white border border-[#2c2c2e] -ml-2">
                {item.avatar}
            </div>
        </div>
    </div>
);

const CaptureInterface = ({ active }: { active: boolean }) => {
    const [columns, setColumns] = useState<{
        todo: TaskItem[];
        active: TaskItem[];
        encoded: TaskItem[];
    }>({
        todo: [
            { id: 'RULE-101', title: 'If Sentiment < Neutral & Value > 10k', tag: 'Logic', priority: 'High', avatar: 'AI' },
            { id: 'RULE-102', title: 'Auto-Draft Response from FAQ', tag: 'Action', priority: 'Med', avatar: 'AI' }
        ],
        active: [],
        encoded: []
    });

    useEffect(() => {
        if (!active) return;

        const moveCard = async () => {
            await new Promise(r => setTimeout(r, 800));
            // Move to Active
            setColumns(prev => {
                if (prev.todo.length === 0) return prev;
                return {
                    todo: [prev.todo[1]],
                    active: [prev.todo[0]],
                    encoded: []
                };
            });

            await new Promise(r => setTimeout(r, 1200));
            // Move to Encoded
            setColumns(prev => {
                if (prev.active.length === 0) return prev;
                return {
                    todo: prev.todo,
                    active: [],
                    encoded: [prev.active[0]]
                };
            });
        };

        moveCard();
    }, [active]);

    return (
        <div className="w-full h-full bg-[#151517] p-6 font-sans flex flex-col">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-white border border-white/10">
                        <Layout size={16} />
                    </div>
                    <div>
                        <h2 className="text-white font-bold text-sm">Logic Engine</h2>
                        <span className="text-[10px] text-white/30 uppercase tracking-widest">Formalizing Rules</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 flex-1">
                {[
                    { id: 'todo', label: 'Context Inputs', items: columns.todo },
                    { id: 'active', label: 'Processing Logic', items: columns.active },
                    { id: 'encoded', label: 'Active Rules', items: columns.encoded }
                ].map((col, i) => (
                    <div key={col.id} className="bg-[#0a0a0c] rounded-xl p-3 border border-white/5 flex flex-col relative">
                        <div className="flex justify-between items-center mb-3 px-1">
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{col.label}</span>
                            <span className="bg-white/5 px-1.5 py-0.5 rounded text-[9px] text-white/30 font-mono">
                                {col.items.length}
                            </span>
                        </div>
                        <div className="space-y-2 flex-1 min-h-[100px] relative">
                            {col.items.map(c => <GovernanceCard key={c.id} item={c} />)}
                            
                            {/* Empty State visual */}
                            {col.items.length === 0 && (
                                <div className="absolute inset-0 border-2 border-dashed border-white/5 rounded-lg flex items-center justify-center">
                                    <span className="text-[9px] text-white/10 uppercase font-bold tracking-widest">Awaiting Signal</span>
                                </div>
                            )}
                        </div>
                        {col.id === 'encoded' && col.items.length > 0 && (
                            <div className="absolute bottom-4 left-0 right-0 text-center animate-in slide-in-from-bottom-2 fade-in">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 text-[9px] font-bold uppercase tracking-widest rounded-full border border-green-500/20">
                                    <Check size={10} /> Logic Enforced
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- 5. CONTROL (Knowledge Graph) ---
const ControlInterface = ({ active }: { active: boolean }) => {
    return (
        <div className="w-full h-full bg-[#050505] relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-20 pointer-events-none" 
                style={{ 
                    backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', 
                    backgroundSize: '30px 30px' 
                }} 
            />

            <div className="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-xl max-w-xs shadow-2xl animate-in fade-in slide-in-from-left duration-700">
                <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Terminal size={10} /> Knowledge Graph
                </div>
                <div className="text-xs text-[#69B7B2] font-mono bg-black/50 p-2 rounded border border-white/5">
                    MATCH (n:Client)-[:HAS_RISK]->(d:Contract)<br/>
                    WHERE d.status == 'Renewal'<br/>
                    RETURN n,d
                </div>
            </div>

            <div className="relative w-64 h-64">
                {/* Center Node */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#69B7B2] rounded-full flex items-center justify-center shadow-[0_0_40px_#69B7B2] z-20 animate-pulse border-4 border-black">
                    <Briefcase className="text-black" size={32} />
                </div>
                
                {/* Orbiting Satellites */}
                {[0, 72, 144, 216, 288].map((deg, i) => (
                    <div 
                        key={i}
                        className={`absolute w-12 h-12 bg-[#1a1a1c] border border-white/20 rounded-full flex items-center justify-center text-white/50 z-10 transition-all duration-1000 ease-out hover:scale-110 hover:border-white hover:text-white cursor-pointer group ${active ? 'opacity-100' : 'opacity-0 scale-0'}`}
                        style={{
                            top: '50%', left: '50%',
                            transform: `translate(-50%, -50%) rotate(${deg}deg) translate(${active ? 140 : 0}px) rotate(-${deg}deg)`
                        }}
                    >
                        {i===0 ? <FileText size={16}/> : i===1 ? <User size={16}/> : i===2 ? <MessageSquare size={16}/> : i===3 ? <CreditCard size={16}/> : <Globe size={16}/>}
                        <div className="absolute top-1/2 left-1/2 w-32 h-px bg-gradient-to-r from-transparent via-white/20 to-[#69B7B2]/50 -z-10 origin-left" style={{ transform: `rotate(${deg + 180}deg)` }} />
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- 6. BRIDGE (Agent Fleet) ---
const BridgeInterface = ({ active }: { active: boolean }) => {
    const agents = [
        { id: 'A-01', name: 'Invoice_Bot', status: 'active', task: 'Processing #INV-291' },
        { id: 'A-02', name: 'Support_Triage', status: 'active', task: 'Escalating Ticket' },
        { id: 'A-03', name: 'Outreach_Agent', status: 'idle', task: 'Awaiting Leads' },
        { id: 'A-04', name: 'Ops_Scheduler', status: 'deploying', task: 'Syncing Cal...' },
    ];

    return (
        <div className="w-full h-full bg-[#08080a] p-8 font-sans flex flex-col">
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                <div>
                    <h2 className="text-white font-bold text-sm flex items-center gap-2">
                        <Cpu size={16} className="text-[#69B7B2]" /> Bridge Command
                    </h2>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Deploying Agents into Workflows</p>
                </div>
                <div className="text-[#69B7B2] text-[10px] font-bold uppercase tracking-widest border border-[#69B7B2]/30 px-3 py-1 rounded-full animate-pulse">
                    4 Agents Online
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 flex-1">
                {agents.map((agent, i) => (
                    <div 
                        key={i} 
                        className={`
                            relative bg-[#121214] border rounded-xl p-4 flex flex-col justify-between transition-all duration-500
                            ${active 
                                ? 'opacity-100 translate-y-0 border-white/10 hover:border-white/20' 
                                : 'opacity-0 translate-y-4 border-transparent'
                            }
                        `}
                        style={{ transitionDelay: `${i * 100}ms` }}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-white/60">
                                <Bot size={16} />
                            </div>
                            <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : agent.status === 'deploying' ? 'bg-amber-500 animate-ping' : 'bg-white/20'}`} />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-white mb-1">{agent.name}</div>
                            <div className="text-[9px] font-mono text-white/40 uppercase">{agent.task}</div>
                        </div>
                        {agent.status === 'active' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500/50" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- 7. REFLECT (Training Dashboard) ---
const ReflectInterface = ({ active }: { active: boolean }) => {
    const [progress, setProgress] = useState(0);
    
    useEffect(() => {
        if (!active) { setProgress(0); return; }
        const interval = setInterval(() => {
            setProgress(p => Math.min(100, p + 1));
        }, 50);
        return () => clearInterval(interval);
    }, [active]);

    return (
        <div className="w-full h-full bg-[#0c0c0e] p-8 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 border border-purple-500/20">
                    <RefreshCw size={24} className={progress < 100 ? "animate-spin" : ""} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white">Reflective Cycle</h2>
                    <p className="text-xs text-white/40 uppercase tracking-widest">Performance Monitoring & Retraining</p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Drift Chart Placeholder */}
                <div className="h-32 bg-[#151517] rounded-xl border border-white/5 relative overflow-hidden flex items-end p-4 gap-1">
                    {[30, 45, 40, 55, 50, 65, 60, 80, 75, 90, 85, 95].map((h, i) => (
                        <div key={i} className="flex-1 bg-[#69B7B2]/20 hover:bg-[#69B7B2] transition-colors rounded-t-sm" style={{ height: `${h}%` }} />
                    ))}
                    <div className="absolute top-4 left-4 text-[9px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
                        <BarChart3 size={12} /> Accuracy Trend
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/50">
                        <span>Model Update 2.4.1</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 transition-all duration-100 ease-out" style={{ width: `${progress}%` }} />
                    </div>
                </div>

                {/* Alerts */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                        <div className="text-[9px] text-white/30 uppercase tracking-widest mb-1">Knowledge Gaps</div>
                        <div className="text-white font-bold">2 Detected</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                        <div className="text-[9px] text-white/30 uppercase tracking-widest mb-1">Drift Status</div>
                        <div className="text-green-400 font-bold">Stable</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN CONTAINER ---
export const FeatureShowcase: React.FC = () => {
    const [activeStage, setActiveStage] = useState(0);
    const [agentMessage, setAgentMessage] = useState<string | null>(null);

    const stages = [
        { id: 'locate', label: 'Locate', desc: "Identify & Connect", icon: Globe, comp: LocateInterface },
        { id: 'stream', label: 'Stream', desc: "Observe & Translate", icon: Activity, comp: StreamInterface },
        { id: 'context', label: 'Context', desc: "Structure & Attribute", icon: Layers, comp: ContextInterface },
        { id: 'capture', label: 'Capture', desc: "Formalize Logic", icon: Zap, comp: CaptureInterface },
        { id: 'control', label: 'Control', desc: "Visualize Knowledge", icon: Network, comp: ControlInterface },
        { id: 'bridge', label: 'Bridge', desc: "Deploy Agents", icon: Cpu, comp: BridgeInterface },
        { id: 'reflect', label: 'Reflect', desc: "Monitor & Develop", icon: RefreshCw, comp: ReflectInterface },
    ];

    const nextStage = () => { setActiveStage(prev => (prev + 1) % stages.length); };
    const prevStage = () => { setActiveStage(prev => (prev - 1 + stages.length) % stages.length); };

    const handleAgentClick = () => {
        const msgs = [
            "Scanning for schema drift...",
            "Just optimized 4TB of logs. Feeling light.",
            "That query latency is looking delicious.",
            "Ingesting unstructured PDFs is my cardio.",
            "Detecting 99.9% uptime vibes.",
            "I dream in SQL.",
            "Checking the data pipeline... flow is clean.",
            "Normalizing JSON objects just for fun."
        ];
        setAgentMessage(msgs[Math.floor(Math.random() * msgs.length)]);
        setTimeout(() => setAgentMessage(null), 3000);
    }

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

                {/* Main Content Layout */}
                <div className="flex flex-col items-center w-full relative group gap-0">
                    
                    {/* Main Window - 16:9 Aspect Ratio Container */}
                    <div className="w-full max-w-[1600px] aspect-video bg-[#0a0a0c] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row ring-1 ring-white/5 relative z-10">
                        
                        {/* Sidebar Nav */}
                        <div className="w-full md:w-64 bg-[#08080a] border-b md:border-b-0 md:border-r border-white/5 flex flex-col z-20 relative h-full">
                            <div className="p-8 hidden md:block">
                                <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">Architecture</div>
                                <div className="h-0.5 w-8 bg-[#69B7B2]" />
                            </div>
                            
                            <div className="flex-1 p-4 space-x-2 md:space-x-0 md:space-y-2 flex md:block overflow-x-auto custom-scrollbar">
                                {stages.map((stage, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => { setActiveStage(idx); }}
                                        className={cn(
                                            "flex-1 md:w-full flex items-center gap-4 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 relative overflow-hidden group/btn min-w-[140px]",
                                            activeStage === idx 
                                                ? "bg-[#151517] text-white shadow-lg border border-white/10" 
                                                : "text-white/30 hover:text-white hover:bg-white/5 border border-transparent"
                                        )}
                                    >
                                        <stage.icon size={16} className={activeStage === idx ? "text-[#69B7B2]" : "text-current opacity-50"} />
                                        <div className="relative z-10 text-left">
                                            <div className="block text-[11px] mb-0.5">{stage.label}</div>
                                            <div className="text-[8px] opacity-50 normal-case tracking-normal hidden md:block font-mono">{stage.desc}</div>
                                        </div>
                                        
                                        {/* Active Indicator Line */}
                                        {activeStage === idx && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#69B7B2]" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Floating "Chat Bubble" Video Agent */}
                            <div className="absolute bottom-6 right-6 z-50 group hidden md:block">
                                {/* Chat Bubble Tooltip */}
                                <div className={`absolute bottom-full right-0 mb-3 w-40 bg-white text-black text-[10px] font-bold p-3 rounded-xl rounded-br-sm shadow-xl transition-all duration-300 transform origin-bottom-right ${agentMessage ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95 pointer-events-none'}`}>
                                    {agentMessage}
                                    <div className="absolute -bottom-1 right-0 w-3 h-3 bg-white rotate-45 translate-x-[-6px]" />
                                </div>

                                {/* Video Bubble */}
                                <div 
                                    onClick={handleAgentClick}
                                    className="w-16 h-16 rounded-full overflow-hidden cursor-pointer hover:scale-110 transition-transform relative group/vid shadow-lg"
                                >
                                    <video 
                                        src="https://jar5gzlwdkvsnpqa.public.blob.vercel-storage.com/Untitled%20design%20%2847%29.webm"
                                        autoPlay 
                                        loop 
                                        muted 
                                        playsInline
                                        className="w-full h-full object-cover opacity-90 mix-blend-screen group-hover/vid:opacity-100 transition-opacity"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 relative bg-[#0c0c0e] flex flex-col h-full overflow-hidden">
                            
                            {/* OS Header */}
                            <WindowHeader title={`${stages[activeStage].label}_Protocol`} />

                            {/* Stage View */}
                            <div className="flex-1 relative overflow-hidden bg-black/20">
                                {stages.map((stage, idx) => {
                                    const Component = stage.comp;
                                    return (
                                        <div 
                                            key={idx}
                                            className={cn(
                                                "absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] flex flex-col",
                                                activeStage === idx 
                                                    ? "opacity-100 z-10 translate-y-0 scale-100 filter-none" 
                                                    : "opacity-0 z-0 translate-y-4 scale-95 blur-sm pointer-events-none"
                                            )}
                                        >
                                            <Component active={activeStage === idx} />
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Bottom Navigation Control Bar */}
                            <div className="h-16 border-t border-white/5 bg-[#0a0a0c] flex items-center justify-between px-8 z-20">
                                <button onClick={prevStage} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors group/nav">
                                    <ArrowLeft size={14} className="group-hover/nav:-translate-x-1 transition-transform" />
                                    Previous Stage
                                </button>
                                
                                <div className="flex gap-2">
                                    {stages.map((_, i) => (
                                        <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${i === activeStage ? 'bg-[#69B7B2] w-4' : 'bg-white/10'}`} />
                                    ))}
                                </div>

                                <button onClick={nextStage} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors group/nav">
                                    Next Stage
                                    <ArrowRight size={14} className="group-hover/nav:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
};
