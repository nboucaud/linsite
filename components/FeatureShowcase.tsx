
import React, { useState, useEffect, useRef } from 'react';
import { 
    Activity, FileText, CheckCircle2, 
    Database, Search, Zap, Network, 
    Bot, ArrowLeft, ArrowRight,
    HardDrive, Plus,
    GitMerge,
    Server, Sparkles, Mail,
    Globe, Shield, Share2,
    PlayCircle,
    Cloud, Box, ChevronRight,
    MousePointer2, Square,
    AlertCircle, Info, RefreshCw, Layers,
    MessageSquare, ShoppingBag, Star, Users, CreditCard, Tag
} from 'lucide-react';

// --- UTILS ---
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// --- SHARED COMPONENTS ---

const GuideOverlay = ({ title, description, onDismiss }: { title: string, description: string, onDismiss: () => void }) => (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-500">
        <div className="bg-[#0c0c0e] border border-white/10 p-8 rounded-2xl shadow-2xl max-w-md text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#69B7B2]" />
            
            <div className="mb-4 flex justify-center">
                <div className="w-12 h-12 bg-[#69B7B2]/10 rounded-full flex items-center justify-center text-[#69B7B2] animate-pulse">
                    <Info size={24} />
                </div>
            </div>
            
            <h3 className="text-2xl font-serif text-white mb-3">{title}</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-8">
                {description}
            </p>
            
            <button 
                onClick={(e) => { e.stopPropagation(); onDismiss(); }}
                className="bg-white text-black hover:bg-[#69B7B2] hover:text-white transition-colors px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg"
            >
                Explore Demo
            </button>
        </div>
    </div>
);

const WindowHeader = ({ title, icon: Icon }: any) => (
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
        
        {/* Scenario Badge */}
        <div className="hidden md:flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/20 font-mono">
            <span>Active Context:</span>
            <span className="text-[#69B7B2]">Main St. Roasters // Retail</span>
        </div>
    </div>
);

const GitoAgent = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [quote, setQuote] = useState("");
    const [showQuote, setShowQuote] = useState(false);
    const timeoutRef = useRef<any>(null);
    
    // "Deck of cards" logic to prevent repeats
    const availableQuotes = useRef<number[]>([]);

    const ENGINEER_QUOTES = [
        "It works on my machine.",
        "Parsing CSVs is my love language. Kidding, it's pain.",
        "Who dropped the prod database table?",
        "I dream in SQL select statements.",
        "That API response time is suspicious.",
        "Deploying on a Friday? Brave choice.",
        "Regex: Write once, read never.",
        "60% of the time, it works every time.",
        "I'm just here for the GPU compute.",
        "Sanitizing inputs... washing my hands.",
        "Latency is just the network thinking hard.",
        "Did you try restarting the container?",
        "A null pointer walked into a bar...",
        "Collecting garbage... and deprecated code.",
        "My code is compiling, I'm on break.",
        "It's not a bug, it's a surprise feature.",
        "Git push --force and pray.",
        "I see dead pixels.",
        "Warning: Coffee levels critical.",
        "Normalization is for people who hate anomalies.",
        "Your schema is showing.",
        "Is this data clean? (It's never clean).",
        "Ingesting data like a black hole.",
        "404: Motivation not found.",
        "I'm training a model to do my taxes.",
        "JSON or XML? Choose wisely.",
        "Infinite loops are forever.",
        "Refactoring the spaghetti logic.",
        "Hacking the mainframe... beep boop.",
        "Checking for race conditions...",
        "The logs don't lie, but they do confuse.",
        "Running unit tests... skipping the hard ones.",
        "Why is there a timestamp from 1970?",
        "Caching is the root of all evil.",
        "Waiting for the query execution plan.",
        "Converting UTC to Local Time... headache loading.",
        "I don't always test, but when I do, it's in production.",
        "Merge conflict? I choose violence.",
        "Pinging localhost...",
        "Indexing... please hold.",
        "The cloud is just someone else's computer.",
        "Analyzing sentiment: Sarcastic.",
        "Data leakage detected in sector 7.",
        "Optimizing for maximum confusion.",
        "Stack Overflow is down. We go home now.",
        "Compiling... 1 warning, 0 errors. Good enough.",
        "Who needs comments? The code documents itself.",
        "Feeling cute, might delete the repo later.",
        "Analyzing... result: ambiguous.",
        "Buffering intelligence..."
    ];

    const saySomething = (e: React.MouseEvent) => {
        e.stopPropagation();
        
        // Clear existing timeout if clicking rapidly
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Initialize or refill the deck
        if (availableQuotes.current.length === 0) {
            availableQuotes.current = Array.from({length: ENGINEER_QUOTES.length}, (_, i) => i);
        }

        // Pick a random card from the deck
        const randomIndex = Math.floor(Math.random() * availableQuotes.current.length);
        const quoteIndex = availableQuotes.current[randomIndex];
        
        // Remove that card so it doesn't repeat until deck refills
        availableQuotes.current.splice(randomIndex, 1);

        setQuote(ENGINEER_QUOTES[quoteIndex]);
        setShowQuote(true);
        
        // Stay open for 6 seconds so people can read
        timeoutRef.current = setTimeout(() => setShowQuote(false), 6000);
    };

    return (
        <div className="mt-auto p-6 border-t border-white/5 relative flex justify-end">
             {/* Quote Bubble */}
             <div className={`absolute bottom-full mb-4 right-4 bg-white text-black text-[10px] font-bold p-3 rounded-xl rounded-br-none shadow-xl transition-all duration-300 transform origin-bottom-right z-50 w-48 text-right ${showQuote ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                "{quote}"
             </div>

            <div 
                className="relative w-16 h-16 rounded-full overflow-hidden bg-black cursor-pointer hover:scale-105 transition-transform shadow-2xl border-2 border-white/5" 
                onClick={saySomething}
            >
                 <video
                    ref={videoRef}
                    src="https://jar5gzlwdkvsnpqa.public.blob.vercel-storage.com/Untitled%20design%20%2847%29.webm"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover transform scale-110"
                />
                {/* Notification light removed as requested */}
            </div>
        </div>
    );
};

// --- 1. LOCATE (Data Sources) ---
const LocateApp = ({ active }: { active: boolean }) => {
    const [selectedType, setSelectedType] = useState('all');
    const [scannedItems, setScannedItems] = useState<Record<string, number>>({});
    const [showIntro, setShowIntro] = useState(true);

    useEffect(() => {
        if(active) {
            setShowIntro(true);
            const interval = setInterval(() => {
                setScannedItems(prev => {
                    const next = {...prev};
                    Object.keys(prev).forEach(k => {
                        if (next[k] < 100) next[k] += Math.random() * 5;
                    });
                    return next;
                });
            }, 100);
            return () => clearInterval(interval);
        }
    }, [active]);

    useEffect(() => {
        const initial: any = {};
        integrations.forEach(i => initial[i.name] = 0);
        setScannedItems(initial);
    }, []);

    const integrations = [
        { name: "Square POS", type: "sales", icon: CreditCard, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", items: "Transx" },
        { name: "QuickBooks", type: "finance", icon: FileText, color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20", items: "Ledger" },
        { name: "Shopify", type: "sales", icon: ShoppingBag, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20", items: "Orders" },
        { name: "Instagram", type: "marketing", icon: Star, color: "text-pink-400", bg: "bg-pink-400/10", border: "border-pink-400/20", items: "Social" },
        { name: "Google Drive", type: "ops", icon: HardDrive, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20", items: "Docs" },
        { name: "Slack", type: "ops", icon: MessageSquare, color: "text-white", bg: "bg-white/10", border: "border-white/20", items: "Team" },
    ];

    const filtered = selectedType === 'all' ? integrations : integrations.filter(i => i.type === selectedType);

    return (
        <div className="w-full h-full bg-[#0c0c0e] flex flex-col font-sans relative">
            {showIntro && (
                <GuideOverlay 
                    title="Unified Dashboard"
                    description="Connect your POS, accounting, and social apps in one place. See the full picture of your business without opening ten different tabs."
                    onDismiss={() => setShowIntro(false)} 
                />
            )}

            {/* Toolbar */}
            <div className="h-12 border-b border-white/5 flex items-center px-4 justify-between bg-[#151517]">
                <div className="flex gap-2">
                    {['all', 'sales', 'ops', 'finance'].map(t => (
                        <button 
                            key={t}
                            onClick={() => setSelectedType(t)}
                            className={`px-3 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider transition-all ${selectedType === t ? 'bg-white text-black' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-2 w-24 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-2/3 animate-pulse" />
                    </div>
                    <span className="text-[10px] text-white/30 font-mono">SYNCING...</span>
                </div>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {filtered.map((s, i) => {
                        const progress = Math.min(100, Math.round(scannedItems[s.name] || 0));
                        return (
                            <div key={i} className="group bg-[#121214] border border-white/5 hover:border-white/20 p-4 rounded-xl relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                <div className="flex justify-between items-start mb-3">
                                    <div className={`p-2.5 rounded-lg ${s.bg} ${s.color} border ${s.border}`}>
                                        <s.icon size={18} />
                                    </div>
                                    <div className="text-[9px] font-mono text-white/30">{progress}%</div>
                                </div>
                                <h4 className="text-white font-bold text-sm mb-1">{s.name}</h4>
                                <div className="flex items-center gap-2 text-white/40 text-xs">
                                    <span className="font-mono">{s.items}</span>
                                    {progress < 100 && <RefreshCw size={10} className="animate-spin" />}
                                </div>
                                
                                {/* Progress Bar Bottom */}
                                <div className="absolute bottom-0 left-0 h-1 bg-white/5 w-full">
                                    <div 
                                        className={`h-full transition-all duration-300 ${progress === 100 ? 'bg-green-500' : 'bg-[#69B7B2]'}`} 
                                        style={{ width: `${progress}%` }} 
                                    />
                                </div>
                            </div>
                        );
                    })}
                    
                    {/* Add Button */}
                    <button className="border border-dashed border-white/10 hover:border-white/30 rounded-xl flex flex-col items-center justify-center gap-2 text-white/20 hover:text-white/60 transition-all min-h-[120px] bg-white/[0.01] hover:bg-white/[0.03]">
                        <Plus size={24} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Connect App</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- 2. STREAM (Live Ingest) ---
const StreamApp = ({ active }: { active: boolean }) => {
    const [events, setEvents] = useState<any[]>([]);
    const [showIntro, setShowIntro] = useState(true);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    useEffect(() => {
        if (!active) {
            setEvents([]);
            return;
        }
        setShowIntro(true);

        const templates = [
            { type: 'sale', raw: "POS: Oat Latte ($6.50)", status: "Paid", icon: CreditCard, color: "text-green-400" },
            { type: 'review', raw: "Yelp: 5 Stars - 'Great foam!'", status: "New", icon: Star, color: "text-yellow-400" },
            { type: 'stock', raw: "Alert: Coffee Beans < 10lbs", status: "Low", icon: Box, color: "text-red-400" },
            { type: 'social', raw: "Instagram: @jenny mentioned you", status: "Tagged", icon: Users, color: "text-pink-400" }
        ];

        const interval = setInterval(() => {
            const template = templates[Math.floor(Math.random() * templates.length)];
            const newEvent = {
                id: Date.now(),
                ...template,
                progress: 0
            };
            setEvents(prev => [newEvent, ...prev].slice(0, 7));
        }, 1500);

        return () => clearInterval(interval);
    }, [active]);

    // Canvas Visualizer for Traffic
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let w = canvas.parentElement?.clientWidth || 300;
        let h = canvas.parentElement?.clientHeight || 60;
        canvas.width = w;
        canvas.height = h;

        const dataPoints = new Array(Math.ceil(w/4)).fill(0);
        let t = 0;

        const render = () => {
            if (!active) return;
            t += 0.1;
            
            // Shift data
            dataPoints.shift();
            const val = Math.max(0, Math.sin(t) * 10 + Math.random() * 15);
            dataPoints.push(val);

            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = 'rgba(16, 185, 129, 0.2)'; 
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 1;

            ctx.beginPath();
            ctx.moveTo(0, h);
            dataPoints.forEach((v, i) => {
                const x = i * 4;
                const y = h - v;
                ctx.lineTo(x, y);
            });
            ctx.lineTo(w, h);
            ctx.fill();
            ctx.stroke();

            requestAnimationFrame(render);
        };
        render();
    }, [active]);

    return (
        <div className="w-full h-full bg-[#0a0a0c] flex flex-col font-mono text-xs overflow-hidden relative">
            {showIntro && (
                <GuideOverlay 
                    title="Live Business Pulse"
                    description="Watch your business happen in real-time. Sales, reviews, and inventory alerts streaming into one feed."
                    onDismiss={() => setShowIntro(false)} 
                />
            )}

            {/* Live Chart Header */}
            <div className="h-16 bg-[#08080a] border-b border-white/5 relative w-full">
                <canvas ref={canvasRef} className="w-full h-full absolute inset-0" />
                <div className="absolute top-2 right-4 text-[9px] text-green-400 font-bold uppercase tracking-widest flex items-center gap-2 bg-black/50 px-2 rounded">
                    <Activity size={10} /> Live Activity
                </div>
            </div>

            {/* Stream Content */}
            <div className="flex-1 p-4 space-y-3 overflow-hidden relative">
                {events.map((ev) => (
                    <div key={ev.id} className="relative pl-4 group animate-in slide-in-from-right-4 duration-300">
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white/10 group-first:bg-green-500 group-first:shadow-[0_0_10px_#22c55e] transition-colors" />
                        
                        <div className="bg-[#151517] border border-white/5 p-3 rounded hover:bg-white/5 transition-colors flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`p-1.5 rounded bg-white/5 ${ev.color}`}>
                                    <ev.icon size={14} />
                                </div>
                                <div>
                                    <div className="text-white/90 font-bold text-xs">{ev.type.toUpperCase()}</div>
                                    <div className="text-white/50 text-[10px] truncate max-w-[150px] md:max-w-none">{ev.raw}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[9px] text-white/30">{new Date(ev.id).toLocaleTimeString([], {hour12:false, minute:'2-digit', second:'2-digit'})}</div>
                                <div className="text-[9px] font-bold text-green-400 uppercase tracking-wider">{ev.status}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- 3. CONTEXT (Standardization) ---
const ContextApp = ({ active }: { active: boolean }) => {
    const [showIntro, setShowIntro] = useState(true);
    useEffect(() => { if(active) setShowIntro(true); }, [active]);

    return (
        <div className="w-full h-full bg-[#0f0f11] flex flex-col relative overflow-hidden font-sans">
            {showIntro && (
                <GuideOverlay 
                    title="Paper to Digital"
                    description="Stop typing data manually. Upload an invoice from a supplier, and we'll extract the products, prices, and quantities automatically."
                    onDismiss={() => setShowIntro(false)} 
                />
            )}

            {/* Toolbar */}
            <div className="h-10 border-b border-white/5 bg-[#151517] flex items-center px-4 justify-between">
                <div className="flex items-center gap-4 text-xs font-medium text-white/60">
                    <span className="flex items-center gap-2"><FileText size={12}/> Invoice_Oct_BeanCo.pdf</span>
                    <ArrowRight size={12} className="text-white/20" />
                    <span className="flex items-center gap-2 text-[#69B7B2]"><Database size={12}/> Inventory Record</span>
                </div>
                <div className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[9px] font-bold uppercase rounded border border-green-500/20">
                    Confidence: 99%
                </div>
            </div>

            <div className="flex-1 flex relative">
                {/* Left: Unstructured Source */}
                <div className="w-1/2 border-r border-white/5 p-6 bg-[#0c0c0e]">
                    <div className="mb-4 flex justify-between items-center">
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Original Document</span>
                        <span className="text-[9px] font-mono text-white/20">OCR SCAN</span>
                    </div>
                    
                    {/* Simulated Document */}
                    <div className="bg-white p-6 rounded-sm shadow-xl text-black font-serif text-[10px] md:text-xs leading-relaxed opacity-90 relative overflow-hidden group scale-95 origin-top-left transition-transform hover:scale-100">
                        <div className="border-b-2 border-black pb-2 mb-4 flex justify-between items-end">
                            <h2 className="font-bold text-lg">INVOICE</h2>
                            <span className="text-gray-500">#402</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <p className="font-bold text-gray-400 uppercase text-[8px]">Vendor</p>
                                <p className="relative inline-block">
                                    Bean Supply Co.
                                    {active && <span className="absolute inset-0 bg-purple-500/20 border border-purple-500 rounded animate-pulse" />}
                                </p>
                                <p>Seattle, WA</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-gray-400 uppercase text-[8px]">Date</p>
                                <p className="relative inline-block">
                                    Oct 24, 2025
                                    {active && <span className="absolute inset-0 bg-blue-500/20 border border-blue-500 rounded animate-pulse delay-75" />}
                                </p>
                            </div>
                        </div>

                        <div className="text-left border-t border-gray-300 pt-2">
                            <p className="font-bold text-gray-400 uppercase text-[8px]">Items</p>
                            <span className="relative inline-block font-mono font-bold text-sm">
                                50lb / Espresso Roast / Whole Bean
                                {active && <span className="absolute inset-0 bg-amber-500/20 border border-amber-500 rounded animate-pulse delay-150" />}
                            </span>
                        </div>
                        <div className="text-right mt-2 font-bold text-lg">$620.00</div>
                    </div>
                </div>

                {/* Center: Animated Connectors */}
                <div className="absolute inset-0 pointer-events-none z-10">
                    <svg className="w-full h-full">
                        <defs>
                            <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                                <path d="M0,0 L6,3 L0,6 L0,0" fill="#69B7B2" opacity="0.5" />
                            </marker>
                        </defs>
                        {/* Vendor Line */}
                        <path d="M 180 120 C 300 120, 300 100, 480 100" fill="none" stroke="#a855f7" strokeWidth="1" strokeDasharray="4 2" className="animate-[dash_2s_linear_infinite]" markerEnd="url(#arrow)" />
                        
                        {/* Date Line */}
                        <path d="M 320 120 C 380 120, 380 160, 480 160" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 2" className="animate-[dash_2.5s_linear_infinite]" markerEnd="url(#arrow)" />
                        
                        {/* Amount Line */}
                        <path d="M 200 230 C 300 230, 300 220, 480 220" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 2" className="animate-[dash_3s_linear_infinite]" markerEnd="url(#arrow)" />
                    </svg>
                </div>

                {/* Right: Structured Schema */}
                <div className="w-1/2 p-6 bg-[#08080a] flex flex-col">
                    <div className="mb-4 flex justify-between items-center">
                        <span className="text-[10px] font-bold text-[#69B7B2] uppercase tracking-widest">Clean Data</span>
                        <span className="text-[9px] font-mono text-white/20">JSON</span>
                    </div>
                    
                    <div className="space-y-3 font-mono text-xs">
                        <div className="p-3 rounded bg-[#1a1a1c] border-l-2 border-purple-500 flex items-center justify-between group hover:bg-white/5 transition-colors">
                            <div className="flex flex-col">
                                <span className="text-purple-400 font-bold mb-1">vendor_name</span>
                                <span className="text-white/40 text-[8px] uppercase">String</span>
                            </div>
                            <span className="text-white bg-black/40 px-2 py-1 rounded">"Bean Co"</span>
                        </div>

                        <div className="p-3 rounded bg-[#1a1a1c] border-l-2 border-blue-500 flex items-center justify-between group hover:bg-white/5 transition-colors">
                            <div className="flex flex-col">
                                <span className="text-blue-400 font-bold mb-1">invoice_date</span>
                                <span className="text-white/40 text-[8px] uppercase">Date</span>
                            </div>
                            <span className="text-white bg-black/40 px-2 py-1 rounded">2025-10-24</span>
                        </div>

                        <div className="p-3 rounded bg-[#1a1a1c] border-l-2 border-amber-500 flex items-center justify-between group hover:bg-white/5 transition-colors">
                            <div className="flex flex-col">
                                <span className="text-amber-400 font-bold mb-1">total_cost</span>
                                <span className="text-white/40 text-[8px] uppercase">Float</span>
                            </div>
                            <span className="text-white bg-black/40 px-2 py-1 rounded">620.00</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 4. CAPTURE (Visual Logic) ---
const CaptureApp = ({ active }: { active: boolean }) => {
    const [showIntro, setShowIntro] = useState(true);
    useEffect(() => { if(active) setShowIntro(true); }, [active]);

    // Dynamic node positioning for SVG lines
    const [nodes, setNodes] = useState([
        { id: 1, type: 'trigger', label: "Review < 3 Stars", icon: Star, x: 50, y: 15 },
        { id: 2, type: 'logic', label: "Contains 'Rude'?", icon: GitMerge, x: 50, y: 50 },
        { id: 3, type: 'action', label: "Alert Manager", icon: Shield, x: 25, y: 85, color: 'text-red-400' },
        { id: 4, type: 'action', label: "Draft Apology", icon: Mail, x: 75, y: 85, color: 'text-green-400' },
    ]);

    return (
        <div className="w-full h-full bg-[#111] relative overflow-hidden font-sans">
            {showIntro && (
                <GuideOverlay 
                    title="Simple Automation"
                    description="Set up rules to handle busy work. If a customer leaves a bad review, alert the manager and draft an email instantly."
                    onDismiss={() => setShowIntro(false)} 
                />
            )}

            {/* Dot Grid Background */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

            {/* Toolbar */}
            <div className="absolute top-4 left-4 z-10 flex gap-2">
                <div className="bg-[#1a1a1c] border border-white/10 rounded-lg p-1 flex gap-1 shadow-lg">
                    <button className="p-1.5 hover:bg-white/10 rounded text-white/50 hover:text-white"><MousePointer2 size={14} /></button>
                    <button className="p-1.5 bg-white/10 rounded text-white"><GitMerge size={14} /></button>
                    <button className="p-1.5 hover:bg-white/10 rounded text-white/50 hover:text-white"><Square size={14} /></button>
                </div>
            </div>

            <div className="absolute inset-0">
                <svg className="w-full h-full pointer-events-none">
                    {/* Trigger -> Logic */}
                    <path 
                        d="M 50% 25% L 50% 40%" 
                        stroke="#333" strokeWidth="2" 
                    />
                    <path 
                        d="M 50% 25% L 50% 40%" 
                        stroke="#69B7B2" strokeWidth="2" strokeDasharray="4 4" 
                        className="animate-[dash_1s_linear_infinite]" 
                    />

                    {/* Logic -> Left */}
                    <path 
                        d="M 50% 60% C 50% 70%, 25% 70%, 25% 75%" 
                        stroke="#333" strokeWidth="2" fill="none"
                    />
                    <path 
                        d="M 50% 60% C 50% 70%, 25% 70%, 25% 75%" 
                        stroke="#ef4444" strokeWidth="2" strokeDasharray="100" strokeDashoffset={active ? "0" : "100"} 
                        className="transition-all duration-1000 ease-out" fill="none"
                    />

                    {/* Logic -> Right */}
                    <path 
                        d="M 50% 60% C 50% 70%, 75% 70%, 75% 75%" 
                        stroke="#333" strokeWidth="2" fill="none"
                    />
                    <path 
                        d="M 50% 60% C 50% 70%, 75% 70%, 75% 75%" 
                        stroke="#22c55e" strokeWidth="2" strokeDasharray="100" strokeDashoffset={active ? "0" : "100"} 
                        className="transition-all duration-1000 ease-out delay-500" fill="none"
                    />
                </svg>

                {nodes.map(node => (
                    <div 
                        key={node.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 p-3 bg-[#1a1a1c] border border-white/10 rounded-xl shadow-xl hover:scale-105 transition-transform cursor-pointer group"
                        style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    >
                        <div className={`p-2 rounded-lg bg-white/5 ${node.color || 'text-white'}`}>
                            <node.icon size={16} />
                        </div>
                        <div className="text-center">
                            <div className="text-[9px] text-white/40 uppercase font-bold tracking-wider">{node.type}</div>
                            <div className="text-xs font-bold text-white">{node.label}</div>
                        </div>
                        {node.type === 'trigger' && <div className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- 5. CONTROL (Knowledge Graph) ---
const ControlApp = ({ active }: { active: boolean }) => {
    const [showIntro, setShowIntro] = useState(true);
    useEffect(() => { if(active) setShowIntro(true); }, [active]);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [nodes, setNodes] = useState<{id: number, x: number, y: number, r: number, color: string, label: string}[]>([]);
    
    // Init Graph
    useEffect(() => {
        const initialNodes = [
            { id: 0, x: 300, y: 300, r: 30, color: '#fff', label: "Main St. Store" },
            { id: 1, x: 0, y: 0, r: 15, color: '#69B7B2', label: "Product: Latte" },
            { id: 2, x: 0, y: 0, r: 15, color: '#f59e0b', label: "Staff: Sarah" },
            { id: 3, x: 0, y: 0, r: 15, color: '#69B7B2', label: "Cust: Mike" },
            { id: 4, x: 0, y: 0, r: 15, color: '#8b5cf6', label: "Order #1024" },
            { id: 5, x: 0, y: 0, r: 15, color: '#ef4444', label: "Review: 1 Star" },
            { id: 6, x: 0, y: 0, r: 15, color: '#69B7B2', label: "Supplier: BeanCo" },
            { id: 7, x: 0, y: 0, r: 15, color: '#fff', label: "Manager: Dave" },
            { id: 8, x: 0, y: 0, r: 15, color: '#f59e0b', label: "Shift: Morning" }
        ];
        setNodes(initialNodes);
    }, []);

    // Graph Simulation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let frameId: number;
        let time = 0;

        const render = () => {
            time += 0.01;
            const w = canvas.parentElement?.clientWidth || 600;
            const h = canvas.parentElement?.clientHeight || 600;
            canvas.width = w; canvas.height = h;

            const cx = w/2; const cy = h/2;

            ctx.clearRect(0, 0, w, h);

            // Update Nodes (Floating)
            nodes.forEach((n, i) => {
                if (i === 0) { n.x = cx; n.y = cy; return; } // Pin center
                const angle = (i / 8) * Math.PI * 2 + time * 0.1;
                n.x = cx + Math.cos(angle) * 180 + Math.sin(time + i)*10;
                n.y = cy + Math.sin(angle) * 180 + Math.cos(time + i)*10;
            });

            // Draw Connections
            ctx.lineWidth = 1;
            nodes.forEach((n, i) => {
                if (i === 0) return;
                const dist = Math.sqrt((n.x-cx)**2 + (n.y-cy)**2);
                ctx.strokeStyle = `rgba(255,255,255,${0.1 + (1-dist/300)*0.2})`;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(n.x, n.y);
                ctx.stroke();
                
                // Data Packet
                const pProgress = (time * 2 + i * 0.5) % 1;
                const px = cx + (n.x - cx) * pProgress;
                const py = cy + (n.y - cy) * pProgress;
                ctx.fillStyle = '#fff';
                ctx.fillRect(px-1.5, py-1.5, 3, 3);
            });

            // Draw Nodes
            nodes.forEach(n => {
                ctx.fillStyle = n.color;
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
                ctx.fill();
                
                // Hover effect simulation (pulse)
                if (Math.random() > 0.98) {
                    ctx.strokeStyle = n.color;
                    ctx.globalAlpha = 0.5;
                    ctx.beginPath(); ctx.arc(n.x, n.y, n.r + 5, 0, Math.PI*2); ctx.stroke();
                    ctx.globalAlpha = 1;
                }
                
                // Label
                ctx.fillStyle = '#fff';
                ctx.font = '10px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(n.label, n.x, n.y + n.r + 15);
            });

            frameId = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(frameId);
    }, [nodes]);

    return (
        <div className="w-full h-full bg-[#050505] relative overflow-hidden flex flex-col">
            {showIntro && (
                <GuideOverlay 
                    title="Business Map"
                    description="See how everything connects. Which employee served the customer who left the bad review? It's all linked."
                    onDismiss={() => setShowIntro(false)} 
                />
            )}

            <div className="absolute top-4 left-4 z-20 bg-[#1a1a1c] border border-white/10 rounded-full px-4 py-2 flex items-center gap-2 shadow-xl">
                <Search size={14} className="text-white/40" />
                <input type="text" placeholder="Search..." className="bg-transparent border-none text-xs text-white focus:outline-none w-32" value="Order #1024" readOnly />
            </div>
            
            <canvas ref={canvasRef} className="w-full h-full block" />
            
            <div className="absolute bottom-6 right-6 bg-[#1a1a1c]/90 backdrop-blur border border-white/10 p-4 rounded-xl w-48 shadow-2xl">
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Stats</div>
                <div className="space-y-2">
                    <div className="flex justify-between text-[10px] text-white/60">
                        <span>Connections</span>
                        <span className="text-white">124</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-white/60">
                        <span>Sentiment</span>
                        <span className="text-red-400">Mixed</span>
                    </div>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mt-2">
                        <div className="h-full w-3/4 bg-[#69B7B2]" />
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 6. BRIDGE (Chat Assistant) ---
const BridgeApp = ({ active }: { active: boolean }) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [step, setStep] = useState(0);
    const [showIntro, setShowIntro] = useState(true);
    useEffect(() => { if(active) setShowIntro(true); }, [active]);

    // Automation sequence
    useEffect(() => {
        if (!active) {
            setMessages([]);
            setStep(0);
            return;
        }

        const script = [
            { type: 'user', content: 'Draft a promo email for the rainy weekend.', delay: 1000 },
            { type: 'system', sources: ['Weather API', 'Inventory / Pastries', 'Customer List'], delay: 2000 },
            { type: 'assistant', content: "Subject: Rainy Day Special! 🌧️\n\nIt's pouring out! Come warm up at Main St. Roasters. Show this email for **50% off any pastry** with the purchase of a large latte. Stay dry!", delay: 4000 }
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
            {showIntro && (
                <GuideOverlay 
                    title="Your Assistant"
                    description="Ask questions about your business in plain English. 'How were sales yesterday?' or 'Draft an email'."
                    onDismiss={() => setShowIntro(false)} 
                />
            )}

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
                                    <div className="bg-transparent text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
                                        {msg.content.split('**').map((part: string, idx: number) => 
                                            idx % 2 === 1 ? <strong key={idx} className="text-white bg-white/10 px-1 rounded">{part}</strong> : part
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="text-[10px] border border-white/10 px-2 py-1 rounded hover:bg-white/5 transition-colors text-white/40 hover:text-white flex items-center gap-1">
                                            <FileText size={10} /> Edit Draft
                                        </button>
                                        <button className="text-[10px] border border-white/10 px-2 py-1 rounded hover:bg-white/5 transition-colors text-white/40 hover:text-white flex items-center gap-1">
                                            <Share2 size={10} /> Send
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
                        <Cloud size={10} /> Square POS
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-400 text-[10px] font-bold uppercase tracking-wider hover:bg-orange-500/20 transition-colors">
                        <HardDrive size={10} /> Mailchimp
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

// --- 7. REFLECT (Optimization) ---
const ReflectApp = ({ active }: { active: boolean }) => {
    const [showIntro, setShowIntro] = useState(true);
    useEffect(() => { if(active) setShowIntro(true); }, [active]);

    return (
        <div className="w-full h-full bg-[#08080a] p-8 flex flex-col justify-center items-center relative">
            {showIntro && (
                <GuideOverlay 
                    title="Business Health"
                    description="See the big picture. Are you profitable today? Is your staff cost too high? Simple, clear metrics."
                    onDismiss={() => setShowIntro(false)} 
                />
            )}

            <div className="w-full max-w-sm space-y-6">
                <div className="flex items-center justify-between text-white mb-2">
                    <span className="text-sm font-bold">Sales vs Target</span>
                    <span className="text-[#69B7B2] font-mono">+12%</span>
                </div>
                <div className="h-32 flex items-end gap-1">
                    {[40, 65, 50, 80, 75, 90, 85, 95, 92, 98].map((h, i) => (
                        <div key={i} className="flex-1 bg-white/10 hover:bg-[#69B7B2] transition-colors rounded-t-sm" style={{ height: `${h}%` }} />
                    ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                        <div className="text-2xl font-bold text-white mb-1">22%</div>
                        <div className="text-[9px] text-white/40 uppercase tracking-widest">Labor Cost</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                        <div className="text-2xl font-bold text-white mb-1">4.9</div>
                        <div className="text-[9px] text-white/40 uppercase tracking-widest">Avg Rating</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN CONTAINER ---
export const FeatureShowcase: React.FC = () => {
    const [activeStage, setActiveStage] = useState(0);

    const stages = [
        { id: 'locate', label: 'Locate', desc: "Connect & Index", icon: HardDrive, comp: LocateApp },
        { id: 'stream', label: 'Stream', desc: "Real-time Feed", icon: Activity, comp: StreamApp },
        { id: 'context', label: 'Context', desc: "Standardize", icon: Layers, comp: ContextApp },
        { id: 'capture', label: 'Capture', desc: "Logic Builder", icon: Zap, comp: CaptureApp },
        { id: 'control', label: 'Control', desc: "Knowledge Graph", icon: Network, comp: ControlApp },
        { id: 'bridge', label: 'Bridge', desc: "Assistant", icon: Bot, comp: BridgeApp },
        { id: 'reflect', label: 'Reflect', desc: "Optimization", icon: RefreshCw, comp: ReflectApp },
    ];

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

                        {/* GITO AGENT - Sidebar Footer */}
                        <GitoAgent />
                    </div>

                    {/* RIGHT CONTENT AREA */}
                    <div className="flex-1 flex flex-col relative bg-[#0c0c0e]">
                        
                        {/* OS Header */}
                        <WindowHeader 
                            title={`${stages[activeStage].label}_OS`} 
                            icon={stages[activeStage].icon}
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
