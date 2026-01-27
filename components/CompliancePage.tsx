
import React, { useState, useEffect, useRef } from 'react';
import { Shield, Lock, Eye, CheckCircle2, AlertTriangle, FileCheck, ChevronRight, RefreshCw, Server, Globe, Search, Users, Settings, Bell, Download, Trash2, FolderOpen, X, File as FileGeneric, ShieldCheck, UserX, LogOut, Mail, Database, Slack, Network, Key, Link2, ScanLine, Award, Wifi } from 'lucide-react';
import { ComplianceVisualizer } from './ComplianceVisualizer';
import { useNavigation } from '../context/NavigationContext';

// --- ENHANCED FILE ICON COMPONENT ---
const FileIcon: React.FC<{ type: 'pdf' | 'excel' | 'word' | 'code' | 'image' | 'ppt' | 'csv' | 'zip' | 'txt', className?: string }> = ({ type, className = "w-10 h-12" }) => {
    switch(type) {
        case 'pdf':
            return (
                <div className={`${className} relative flex flex-col shadow-sm group`}>
                    <div className="absolute top-0 right-0 w-3 h-3 bg-red-900/20 rounded-bl-sm z-10" />
                    <div className="flex-1 bg-[#f5f5f5] rounded-sm border-r border-b border-gray-300 relative overflow-hidden flex flex-col items-center shadow-[2px_2px_5px_rgba(0,0,0,0.1)]">
                        <div className="w-full h-2/5 bg-[#ff4d4d] absolute top-0 flex items-center justify-center">
                            <span className="text-white font-black text-[8px] tracking-tighter">PDF</span>
                        </div>
                        <div className="mt-6 space-y-1 w-2/3 opacity-20">
                            <div className="h-0.5 bg-black w-full rounded-full" />
                            <div className="h-0.5 bg-black w-4/5 rounded-full" />
                            <div className="h-0.5 bg-black w-full rounded-full" />
                        </div>
                    </div>
                </div>
            );
        case 'excel':
            return (
                <div className={`${className} relative flex flex-col shadow-sm group`}>
                    <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-900/20 rounded-bl-sm z-10" />
                    <div className="flex-1 bg-[#f5f5f5] rounded-sm border-r border-b border-gray-300 relative overflow-hidden flex flex-col shadow-[2px_2px_5px_rgba(0,0,0,0.1)]">
                        <div className="w-full h-full grid grid-cols-3 grid-rows-5 gap-[1px] bg-emerald-100/50 p-[3px]">
                            {[...Array(15)].map((_, i) => <div key={i} className="bg-white rounded-[1px]" />)}
                        </div>
                        <div className="absolute bottom-1 right-1 bg-[#10b981] w-3.5 h-3.5 flex items-center justify-center rounded-[2px] text-white font-bold text-[7px] z-10">X</div>
                    </div>
                </div>
            );
        case 'word':
            return (
                <div className={`${className} relative flex flex-col shadow-sm group`}>
                    <div className="absolute top-0 right-0 w-3 h-3 bg-blue-900/20 rounded-bl-sm z-10" />
                    <div className="flex-1 bg-[#f5f5f5] rounded-sm border-r border-b border-gray-300 relative overflow-hidden flex flex-col items-center pt-3 shadow-[2px_2px_5px_rgba(0,0,0,0.1)]">
                        <div className="space-y-1 w-3/4">
                            <div className="h-0.5 bg-gray-400 w-full" />
                            <div className="h-0.5 bg-gray-400 w-full" />
                            <div className="h-0.5 bg-gray-400 w-2/3" />
                            <div className="h-0.5 bg-gray-400 w-full" />
                        </div>
                        <div className="absolute bottom-1 left-1 bg-[#3b82f6] w-3.5 h-3.5 flex items-center justify-center rounded-[2px] text-white font-serif font-bold text-[7px]">W</div>
                    </div>
                </div>
            );
        default:
            return (
                <div className={`${className} relative flex flex-col shadow-sm group`}>
                    <div className="flex-1 bg-gray-100 rounded-sm border border-gray-300 flex items-center justify-center">
                        <FileGeneric size={16} className="text-gray-400" />
                    </div>
                </div>
            );
    }
};

// --- HYBRID PAC-MAN ENGINE ---
const PacManVisualizer = () => {
    // ... (Keep existing implementation logic) ...
    // Note: To save tokens, assume the logic inside this component is unchanged from previous version unless requested.
    // I will include the full logic to ensure file validity.
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>(null);
    
    // --- STATE ---
    const [score, setScore] = useState(0);

    // --- CONSTANTS ---
    const PACMAN_X = 140; 
    const PACMAN_SIZE = 60; 
    const SPEED = 2.5;
    const SPACING = 140;
    
    // --- STATE REFS ---
    const filesRef = useRef(Array.from({ length: 15 }, (_, i) => ({
        id: i,
        type: ['pdf', 'excel', 'word', 'ppt', 'csv', 'zip', 'code'][i % 7],
        x: 300 + i * SPACING,
        eaten: false,
        scale: 1,
        opacity: 1,
        rotation: 0,
        isShiny: Math.random() < 0.15 
    })));

    const particlesRef = useRef<{
        x: number, y: number, vx: number, vy: number, 
        life: number, color: string, char: string, size: number 
    }[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        if(!ctx) return;

        let frameCount = 0;

        const loop = () => {
            frameCount++;
            const w = canvas.width = canvas.parentElement?.clientWidth || 800;
            const h = canvas.height = canvas.parentElement?.clientHeight || 300;
            const cy = h / 2;

            ctx.clearRect(0, 0, w, h);

            // 1. DRAW TRACK
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.fillRect(0, cy - 1, w, 2); // Center line
            
            // Track dashes moving left
            const dashOffset = (frameCount * SPEED) % 40;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            for(let i=0; i<w; i+=40) {
                ctx.fillRect(i - dashOffset, cy - 4, 10, 8);
            }

            // 2. DRAW AUDIT RISK (CHASER)
            const chaserX = PACMAN_X - 110 + Math.sin(frameCount * 0.05) * 20; 
            const chaserY = cy + Math.sin(frameCount * 0.1) * 8; 

            ctx.save();
            ctx.translate(chaserX, chaserY);
            
            ctx.shadowBlur = 30;
            ctx.shadowColor = 'rgba(239, 68, 68, 0.5)';

            ctx.fillStyle = '#ef4444'; 
            ctx.beginPath();
            ctx.arc(0, -10, 30, Math.PI, 0); 
            ctx.lineTo(30, 25);
            ctx.lineTo(20, 15); ctx.lineTo(10, 25);
            ctx.lineTo(0, 15); ctx.lineTo(-10, 25);
            ctx.lineTo(-20, 15); ctx.lineTo(-30, 25);
            ctx.lineTo(-30, -10);
            ctx.fill();

            ctx.fillStyle = 'white';
            ctx.beginPath(); ctx.ellipse(-12, -12, 8, 10, 0, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(12, -12, 8, 10, 0, 0, Math.PI*2); ctx.fill();
            
            ctx.fillStyle = '#1e3a8a'; // Dark blue
            ctx.beginPath(); ctx.arc(-6, -12, 4, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(18, -12, 4, 0, Math.PI*2); ctx.fill();

            ctx.strokeStyle = 'white';
            ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(-20, -22); ctx.lineTo(-5, -18); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(5, -18); ctx.lineTo(20, -22); ctx.stroke();

            ctx.shadowBlur = 0;
            ctx.fillStyle = '#fca5a5';
            ctx.font = 'bold 10px monospace';
            ctx.textAlign = 'center';
            ctx.fillText("AUDIT RISK", 0, -50);
            
            ctx.restore();

            // 3. DRAW PAC-MAN
            const mouthOpen = 0.2 + Math.sin(frameCount * 0.15) * 0.15;
            
            ctx.save();
            ctx.translate(PACMAN_X, cy);
            
            ctx.shadowBlur = 20;
            ctx.shadowColor = 'rgba(105, 183, 178, 0.6)';
            
            ctx.fillStyle = '#69B7B2';
            ctx.beginPath();
            ctx.arc(0, 0, PACMAN_SIZE/2, mouthOpen * Math.PI, (2 - mouthOpen) * Math.PI);
            ctx.lineTo(0, 0);
            ctx.fill();
            
            if (frameCount % 60 < 30) {
                ctx.fillStyle = '#3b82f6';
                ctx.beginPath();
                ctx.arc(-10, -35, 4, 0, Math.PI*2);
                ctx.moveTo(-10, -42);
                ctx.lineTo(-7, -35);
                ctx.lineTo(-13, -35);
                ctx.fill();
            }
            
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(5, -15, 4, 0, Math.PI*2);
            ctx.fill();
            
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(6, -16, 1.5, 0, Math.PI*2);
            ctx.fill();

            ctx.restore();

            // 4. DRAW PARTICLES
            for (let i = particlesRef.current.length - 1; i >= 0; i--) {
                const p = particlesRef.current[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.02;
                p.vx *= 0.95; 

                if (p.life <= 0) {
                    particlesRef.current.splice(i, 1);
                    continue;
                }

                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.life;
                ctx.font = `${p.size}px monospace`;
                ctx.fillText(p.char, p.x, p.y);
            }
            ctx.globalAlpha = 1;

            // 5. UPDATE FILES
            if (containerRef.current) {
                const fileElements = containerRef.current.children;
                filesRef.current.forEach((file, i) => {
                    const el = fileElements[i] as HTMLElement;
                    if (!el) return;
                    file.x -= SPEED;
                    const EAT_POINT = PACMAN_X + 20; 
                    
                    if (!file.eaten && file.x < EAT_POINT) {
                        file.eaten = true;
                        const points = file.isShiny ? 100 : 10;
                        setScore(prev => prev + points);
                        const color = file.isShiny ? '#fbbf24' : (file.type === 'pdf' ? '#ef4444' : file.type === 'excel' ? '#10b981' : '#3b82f6');
                        const pCount = file.isShiny ? 25 : 12; 
                        
                        for(let k=0; k<pCount; k++) {
                            particlesRef.current.push({
                                x: PACMAN_X + 10,
                                y: cy,
                                vx: (Math.random() * 2) - 4,
                                vy: (Math.random() - 0.5) * 6,
                                life: 1.0,
                                color: color,
                                char: Math.random() > 0.5 ? '1' : '0',
                                size: 10 + Math.random() * 8
                            });
                        }
                    }

                    if (file.x < -100) {
                        let maxX = -Infinity;
                        filesRef.current.forEach(f => maxX = Math.max(maxX, f.x));
                        file.x = maxX + SPACING;
                        file.eaten = false;
                        file.scale = 1;
                        file.opacity = 1;
                        file.rotation = 0;
                        const types = ['pdf', 'excel', 'word', 'ppt', 'csv', 'zip', 'code'];
                        file.type = types[Math.floor(Math.random() * types.length)];
                        file.isShiny = Math.random() < 0.15;
                    }

                    if (file.eaten) {
                        file.scale = Math.max(0, file.scale - 0.15); 
                        file.rotation += 15;
                        file.opacity = Math.max(0, file.opacity - 0.1);
                        el.style.filter = "none"; 
                    } else {
                        file.scale = 1;
                        file.rotation = 0;
                        file.opacity = 1;
                        if (file.isShiny) {
                            const pulse = 1 + Math.sin(frameCount * 0.1) * 0.2;
                            el.style.filter = `drop-shadow(0 0 15px rgba(251, 191, 36, 0.8)) brightness(${pulse})`;
                            el.style.zIndex = "10"; 
                        } else {
                            el.style.filter = "none";
                            el.style.zIndex = "1";
                        }
                    }
                    el.style.transform = `translate3d(${file.x}px, -50%, 0) scale(${file.scale}) rotate(${file.rotation}deg)`;
                    el.style.opacity = file.opacity.toString();
                });
            }
            requestRef.current = requestAnimationFrame(loop);
        };
        requestRef.current = requestAnimationFrame(loop);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    return (
        <div className="w-full h-full bg-[#0c0c0e] relative overflow-hidden flex items-center rounded-3xl">
            <div className="absolute inset-0 opacity-20 pointer-events-none" 
                style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
            />
            <canvas ref={canvasRef} className="absolute inset-0 z-20 w-full h-full pointer-events-none" />
            <div ref={containerRef} className="absolute top-1/2 left-0 w-full h-0 z-10 pointer-events-none">
                {filesRef.current.map((file) => (
                    <div key={file.id} className="absolute top-0 left-0 will-change-transform">
                        <FileIcon type={file.type as any} className="w-12 h-16 shadow-2xl" />
                    </div>
                ))}
            </div>
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0c0c0e] to-transparent z-30" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0c0c0e] to-transparent z-30" />
            <div className="absolute bottom-6 right-6 z-40">
                <div className="flex flex-col gap-2 items-end">
                    <div className="flex items-center gap-3 bg-[#0a0a0c]/90 border border-amber-glow/20 px-4 py-3 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-in slide-in-from-bottom-4 duration-700">
                        <div className="p-1.5 bg-amber-glow/10 rounded-md text-amber-glow animate-pulse">
                            <ShieldCheck size={16} />
                        </div>
                        <div>
                            <div className="text-[9px] text-white/40 font-bold uppercase tracking-widest mb-px">Data Analyzed</div>
                            <div className="text-sm font-mono font-bold text-white tabular-nums leading-none tracking-tight">
                                {score.toLocaleString()} <span className="text-[8px] text-white/20 align-top font-sans">MB</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ... (AccessKillSwitch - Kept mostly same but updated border/radius if needed)
const AccessKillSwitch = () => {
    // ... (Use same logic, just update container styles below)
    const [revoking, setRevoking] = useState(false);
    const [accessState, setAccessState] = useState<'granted' | 'revoked'>('granted');
    const [progress, setProgress] = useState(0);

    const apps = [
        { id: 'gsuite', name: 'Google Workspace', icon: Mail, type: 'Email & Drive' },
        { id: 'slack', name: 'Slack', icon: Slack, type: 'Messaging' },
        { id: 'aws', name: 'AWS Production', icon: Server, type: 'Infrastructure' },
        { id: 'salesforce', name: 'Salesforce CRM', icon: Database, type: 'Customer Data' },
        { id: 'vpn', name: 'Corporate VPN', icon: Network, type: 'Network Access' },
    ];

    const handleRevoke = () => {
        if (revoking || accessState === 'revoked') return;
        setRevoking(true);
        setProgress(0);
        apps.forEach((app, i) => {
            setTimeout(() => { setProgress(i + 1); }, i * 400 + 200);
        });
        setTimeout(() => {
            setAccessState('revoked');
            setRevoking(false);
        }, apps.length * 400 + 600);
    };

    const handleReset = () => {
        setAccessState('granted');
        setProgress(0);
    };

    return (
        <div className="w-full max-w-5xl mx-auto grid md:grid-cols-2 gap-8 bg-[#0c0c0e] rounded-[2rem] border border-white/10 p-8 shadow-2xl overflow-hidden relative">
            <div className="flex flex-col justify-between space-y-8 z-10">
                <div>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-gray-200 border-2 border-white/10 flex items-center justify-center text-2xl font-bold text-gray-500 overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-400" />
                            <span className="relative z-10">AM</span>
                            {accessState === 'revoked' && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[1px]">
                                    <Lock size={20} className="text-white" />
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Alex Mercer</h3>
                            <p className="text-sm text-white/40">Senior DevOps Engineer</p>
                            <div className={`mt-2 inline-flex items-center gap-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${
                                accessState === 'granted' 
                                ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                                : 'bg-red-500/10 border-red-500/30 text-red-400'
                            }`}>
                                {accessState === 'granted' ? <><CheckCircle2 size={10} /> Active Employee</> : <><UserX size={10} /> Terminated</>}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                            <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Security Clearance</div>
                            <div className="text-sm text-white font-medium">Level 4 (Admin)</div>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed">
                            When an employee leaves, you can't afford loose ends. Our "Kill Switch" instantly rotates API keys, invalidates session tokens, and locks accounts across your entire stack in one click.
                        </p>
                    </div>
                </div>

                {accessState === 'granted' ? (
                    <button 
                        onClick={handleRevoke}
                        disabled={revoking}
                        className="group relative w-full py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 rounded-xl flex items-center justify-center gap-3 text-red-400 font-bold uppercase tracking-widest transition-all overflow-hidden active:scale-[0.98]"
                    >
                        {revoking && <div className="absolute inset-0 bg-red-500/10 animate-pulse" />}
                        <LogOut size={18} className={revoking ? "animate-pulse" : ""} />
                        {revoking ? "Revoking Access..." : "Offboard User"}
                    </button>
                ) : (
                    <button 
                        onClick={handleReset}
                        className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center gap-3 text-white/40 font-bold uppercase tracking-widest transition-all hover:text-white active:scale-[0.98]"
                    >
                        <RefreshCw size={18} /> Reset Demo
                    </button>
                )}
            </div>

            <div className="relative bg-[#050505] rounded-xl border border-white/5 p-6 flex flex-col">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Active Sessions</span>
                    <span className={`text-xs font-mono font-bold ${accessState === 'revoked' ? "text-red-500" : "text-green-500"}`}>
                        {accessState === 'revoked' ? '0/5 Active' : '5/5 Active'}
                    </span>
                </div>

                <div className="space-y-3 flex-1">
                    {apps.map((app, i) => {
                        const isRevoked = accessState === 'revoked' || (revoking && progress > i);
                        return (
                            <div key={app.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 transition-all duration-300">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-md transition-colors duration-500 ${isRevoked ? 'bg-red-500/10 text-red-500 grayscale' : 'bg-white/5 text-white'}`}>
                                        <app.icon size={16} />
                                    </div>
                                    <div>
                                        <div className={`text-sm font-medium transition-colors ${isRevoked ? 'text-white/40 line-through' : 'text-white'}`}>
                                            {app.name}
                                        </div>
                                        <div className="text-[10px] text-white/20">{app.type}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {isRevoked ? (
                                        <div className="px-2 py-1 rounded bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-500 uppercase tracking-wider flex items-center gap-1 animate-in zoom-in duration-300">
                                            <Lock size={10} /> Locked
                                        </div>
                                    ) : (
                                        <div className="px-2 py-1 rounded bg-green-500/10 border border-green-500/20 text-[10px] font-bold text-green-500 uppercase tracking-wider flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const DocumentWorkspace = () => {
    const [selectedFile, setSelectedFile] = useState<number | null>(null);
    const [scanning, setScanning] = useState(false);
    const [files, setFiles] = useState([
        { id: 1, name: "Q3_Financial_Audit.xlsx", type: "excel", size: "2.4 MB", status: "unsafe", risk: "High", issues: ["Social Security #s", "Credit Card Data"] },
        { id: 2, name: "Patient_Intake_Form.pdf", type: "pdf", size: "842 KB", status: "unsafe", risk: "Critical", issues: ["Medical History", "Home Address"] },
        { id: 3, name: "Meeting_Notes_Aug.docx", type: "word", size: "145 KB", status: "unsafe", risk: "Medium", issues: ["Phone Numbers"] },
        { id: 4, name: "Backend_Config.json", type: "code", size: "4 KB", status: "safe", risk: "None", issues: [] },
    ]);

    const activeDoc = files.find(f => f.id === selectedFile);

    const handleScan = () => {
        if (!selectedFile) return;
        setScanning(true);
        setTimeout(() => {
            setFiles(prev => prev.map(f => f.id === selectedFile ? { ...f, status: "safe", risk: "Secured" } : f));
            setScanning(false);
        }, 2000);
    };

    return (
        <div className="w-full max-w-5xl mx-auto h-[600px] bg-[#0c0c0e] rounded-[2rem] border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-700 select-none">
            {/* UPDATED HEADER to match FeatureShowcase */}
            <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#0c0c0e] select-none">
                <div className="flex items-center gap-4">
                    <div className="flex gap-2 group">
                        <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50 group-hover:brightness-110 transition-all" />
                        <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50 group-hover:brightness-110 transition-all" />
                        <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50 group-hover:brightness-110 transition-all" />
                    </div>
                    <div className="h-4 w-px bg-white/10 mx-2" />
                    <div className="flex items-center gap-2 text-[10px] font-mono text-white/40 bg-white/5 px-3 py-1 rounded-full border border-white/5 shadow-inner">
                        <Lock size={10} />
                        <span>infogito://secure-vault-01</span>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-widest text-white/30">
                    <span className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Online
                    </span>
                    <Wifi size={12} />
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-64 bg-[#08080a] border-r border-white/5 flex flex-col">
                    <div className="p-5 text-[10px] font-bold text-white/30 uppercase tracking-widest font-mono">Drives</div>
                    <div className="space-y-1 px-3">
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-[#69B7B2]/10 text-white text-xs font-bold border border-[#69B7B2]/20 shadow-sm">
                            <FolderOpen size={14} className="text-[#69B7B2]" />
                            Incoming Files <span className="ml-auto bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">{files.filter(f => f.status === 'unsafe').length}</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-white/50 text-xs transition-colors">
                            <ShieldCheck size={14} />
                            Safe Vault
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-white/50 text-xs transition-colors">
                            <Trash2 size={14} />
                            Quarantine
                        </button>
                    </div>

                    <div className="mt-8 p-5 text-[10px] font-bold text-white/30 uppercase tracking-widest font-mono">Recent Uploads</div>
                    <div className="flex-1 overflow-y-auto px-3 space-y-2 pb-4 custom-scrollbar">
                        {files.map(file => (
                            <button
                                key={file.id}
                                onClick={() => setSelectedFile(file.id)}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all border group ${
                                    selectedFile === file.id 
                                        ? 'bg-[#1a1a1c] border-white/10 shadow-lg' 
                                        : 'bg-transparent border-transparent hover:bg-white/5'
                                }`}
                            >
                                <FileIcon type={file.type as any} className="w-8 h-10 shadow-md group-hover:scale-105 transition-transform" />
                                <div className="text-left overflow-hidden">
                                    <div className={`text-xs font-medium truncate ${selectedFile === file.id ? 'text-white' : 'text-white/70'}`}>
                                        {file.name}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        {file.status === 'safe' ? (
                                            <span className="text-[9px] bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded border border-green-500/20 flex items-center gap-1">
                                                <CheckCircle2 size={8} /> Safe
                                            </span>
                                        ) : (
                                            <span className="text-[9px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded border border-red-500/20 flex items-center gap-1">
                                                <AlertTriangle size={8} /> Risk
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-[#0c0c0e] relative flex flex-col bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                    <div className="absolute inset-0 bg-black/50" /> 
                    
                    {activeDoc ? (
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="h-14 border-b border-white/5 flex items-center justify-between px-8 bg-[#0c0c0e]/95 backdrop-blur">
                                <div className="flex items-center gap-4">
                                    <FileIcon type={activeDoc.type as any} className="w-6 h-8" />
                                    <div>
                                        <h3 className="text-white text-sm font-bold">{activeDoc.name}</h3>
                                        <p className="text-[10px] text-white/40 font-mono mt-0.5">Last modified: Just now</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {activeDoc.status === 'unsafe' && (
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full animate-pulse">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                            <span className="text-[10px] font-bold text-red-400 uppercase tracking-wide">PII Detected</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 p-8 overflow-y-auto flex justify-center items-start custom-scrollbar">
                                <div className="w-full max-w-[600px] bg-white rounded-sm shadow-2xl p-10 relative transition-all duration-500 min-h-[700px] text-gray-800 font-serif">
                                    
                                    {scanning && (
                                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#69B7B2] shadow-[0_0_30px_#69B7B2] z-20 animate-scan">
                                            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-t from-[#69B7B2]/30 to-transparent" />
                                        </div>
                                    )}

                                    <div className="space-y-8 relative">
                                        <div className="flex justify-between items-end border-b-2 border-gray-800 pb-4 mb-8">
                                            <div>
                                                <h1 className="text-3xl font-bold tracking-tight text-black">INVOICE</h1>
                                                <p className="text-xs text-gray-500 mt-1">#INV-2026-001</p>
                                            </div>
                                            <div className="text-right text-xs">
                                                <div className="font-bold">Infogito Health Services</div>
                                                <div>123 Compliance Way</div>
                                                <div>New York, NY 10012</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-8 mb-8">
                                            <div className="p-4 bg-gray-50 rounded border border-gray-100">
                                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Bill To</div>
                                                <div className="text-sm font-medium">
                                                    <span className="text-gray-400 mr-2">Name:</span>
                                                    {activeDoc.status === 'safe' ? <span className="bg-black text-black px-1">John Doe</span> : <span className="text-red-600 bg-red-50 px-1 border border-red-100">John Doe</span>}
                                                </div>
                                                <div className="text-sm font-medium mt-1">
                                                    <span className="text-gray-400 mr-2">SSN:</span>
                                                    {activeDoc.status === 'safe' ? <span className="bg-black text-black px-1">000-00-0000</span> : <span className="text-red-600 bg-red-50 px-1 border border-red-100">512-42-1923</span>}
                                                </div>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded border border-gray-100">
                                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Payment Details</div>
                                                <div className="text-sm font-medium">
                                                    <span className="text-gray-400 mr-2">Card:</span>
                                                    {activeDoc.status === 'safe' ? <span className="bg-black text-black px-1">**** **** **** 1234</span> : <span className="text-red-600 bg-red-50 px-1 border border-red-100">4242 4242 4242 4242</span>}
                                                </div>
                                                <div className="text-sm font-medium mt-1">
                                                    <span className="text-gray-400 mr-2">CVV:</span>
                                                    {activeDoc.status === 'safe' ? <span className="bg-black text-black px-1">***</span> : <span className="text-red-600 bg-red-50 px-1 border border-red-100">892</span>}
                                                </div>
                                            </div>
                                        </div>

                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-gray-100 text-gray-600 font-bold">
                                                <tr>
                                                    <th className="p-2">Description</th>
                                                    <th className="p-2 text-right">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                <tr>
                                                    <td className="p-2">Medical Consultation - Dr. Smith</td>
                                                    <td className="p-2 text-right">$450.00</td>
                                                </tr>
                                                <tr>
                                                    <td className="p-2">Lab Analysis (Bloodwork)</td>
                                                    <td className="p-2 text-right">$125.00</td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        {activeDoc.status === 'safe' && (
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                                                <div className="border-8 border-green-500/20 text-green-500/20 font-black text-6xl -rotate-12 p-8 rounded-xl uppercase tracking-widest mix-blend-multiply">
                                                    REDACTED
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="h-20 border-t border-white/5 bg-[#0a0a0c] p-4 flex items-center justify-between relative z-20">
                                <div>
                                    {activeDoc.status === 'unsafe' ? (
                                        <div className="text-red-400 text-xs font-bold flex items-center gap-2">
                                            <AlertTriangle size={14} />
                                            {activeDoc.issues.length} Sensitive Items Exposed
                                        </div>
                                    ) : (
                                        <div className="text-green-400 text-xs font-bold flex items-center gap-2">
                                            <CheckCircle2 size={14} />
                                            File secured and ready for export.
                                        </div>
                                    )}
                                </div>
                                
                                {activeDoc.status === 'unsafe' && (
                                    <button 
                                        onClick={handleScan}
                                        disabled={scanning}
                                        className="bg-[#69B7B2] hover:bg-[#589c97] hover:scale-105 text-black px-8 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(105,183,178,0.3)] flex items-center gap-3"
                                    >
                                        {scanning ? (
                                            <>
                                                <RefreshCw size={16} className="animate-spin" />
                                                Scrubbing Data...
                                            </>
                                        ) : (
                                            <>
                                                <Shield size={16} />
                                                Redact & Secure
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-white/20 gap-6">
                            <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center shadow-2xl">
                                <Search size={48} />
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-serif text-white/40 mb-1">No Document Selected</p>
                                <p className="text-xs text-white/20 font-mono">Select a file from the vault to inspect.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ComplianceChecker = () => {
    const [checks, setChecks] = useState({
        hipaa: true,
        gdpr: false,
        soc2: false,
        iso: false
    });

    const toggle = (key: keyof typeof checks) => setChecks(prev => ({ ...prev, [key]: !prev[key] }));

    const activeCount = Object.values(checks).filter(Boolean).length;
    const coverage = activeCount * 25;

    return (
        <div className="bg-[#0a0a0c] border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden h-full flex flex-col justify-center">
            <div className="absolute top-0 right-0 p-32 bg-[#69B7B2]/5 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="flex flex-col gap-8">
                {/* Visual Status */}
                <div className="flex items-center justify-center">
                    <div className="relative w-48 h-48 flex items-center justify-center">
                        <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#1a1a1c" strokeWidth="8" />
                            <circle 
                                cx="50" cy="50" r="45" 
                                fill="none" 
                                stroke="#69B7B2" 
                                strokeWidth="8" 
                                strokeDasharray="283" 
                                strokeDashoffset={283 - (283 * coverage / 100)} 
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="text-4xl font-serif font-bold text-white tracking-tighter">{coverage}%</div>
                            <div className="text-[9px] uppercase tracking-widest text-white/40 mt-1">Compliance</div>
                        </div>
                    </div>
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-2 gap-3">
                    <div onClick={() => toggle('hipaa')} className={`p-4 rounded-xl border cursor-pointer transition-all ${checks.hipaa ? 'bg-[#69B7B2]/10 border-[#69B7B2]/50 text-white' : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'}`}>
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-xs">HIPAA</span>
                            {checks.hipaa && <CheckCircle2 size={14} className="text-[#69B7B2]" />}
                        </div>
                        <div className="text-[9px] opacity-60">Healthcare Privacy</div>
                    </div>
                    <div onClick={() => toggle('gdpr')} className={`p-4 rounded-xl border cursor-pointer transition-all ${checks.gdpr ? 'bg-[#69B7B2]/10 border-[#69B7B2]/50 text-white' : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'}`}>
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-xs">GDPR</span>
                            {checks.gdpr && <CheckCircle2 size={14} className="text-[#69B7B2]" />}
                        </div>
                        <div className="text-[9px] opacity-60">EU Data Rights</div>
                    </div>
                    <div onClick={() => toggle('soc2')} className={`p-4 rounded-xl border cursor-pointer transition-all ${checks.soc2 ? 'bg-[#69B7B2]/10 border-[#69B7B2]/50 text-white' : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'}`}>
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-xs">SOC2</span>
                            {checks.soc2 && <CheckCircle2 size={14} className="text-[#69B7B2]" />}
                        </div>
                        <div className="text-[9px] opacity-60">Security Controls</div>
                    </div>
                    <div onClick={() => toggle('iso')} className={`p-4 rounded-xl border cursor-pointer transition-all ${checks.iso ? 'bg-[#69B7B2]/10 border-[#69B7B2]/50 text-white' : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'}`}>
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-xs">ISO</span>
                            {checks.iso && <CheckCircle2 size={14} className="text-[#69B7B2]" />}
                        </div>
                        <div className="text-[9px] opacity-60">Global Standard</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AirlockVisualizer = () => {
    return (
        <div className="w-full bg-[#0a0a0c] border border-white/10 rounded-[2rem] p-8 md:p-12 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center gap-12">
                {/* Text Explanation */}
                <div className="flex-1 space-y-6 z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-widest">
                        <Link2 size={12} />
                        <span>MCP Decontamination Protocol</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-serif text-white leading-tight">The Airlock.</h3>
                    <p className="text-white/60 leading-relaxed text-lg">
                        Data doesn't just "pass through" our system. It enters a quarantine chamber.
                    </p>
                    <p className="text-white/60 leading-relaxed text-lg">
                        Our <strong>Model Context Protocol (MCP)</strong> acts as a physical barrier. It strips sensitive data (names, SSNs, financial records) atom by atom, replacing them with anonymous tokens before the AI ever sees them.
                    </p>
                </div>

                {/* Right: The Visual */}
                <div className="flex-1 w-full h-[350px] relative flex items-center justify-center bg-[#050505] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 z-20">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-full bg-gradient-to-r from-red-500/10 to-blue-500/10 blur-xl" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-32 bg-white blur-[1px] animate-pulse" />
                    </div>

                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <defs>
                            <linearGradient id="unsafeToSafe" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="45%" stopColor="#ef4444" />
                                <stop offset="55%" stopColor="#3b82f6" />
                            </linearGradient>
                        </defs>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <g key={i}>
                                <rect x="-50" y={50 + i * 50} width="60" height="12" fill="url(#unsafeToSafe)" opacity="0.8" rx="4">
                                    <animate attributeName="x" from="-60" to="120%" dur={`${4 + i * 0.5}s`} repeatCount="indefinite" begin={`${i * 0.8}s`} />
                                </rect>
                                <text x="-50" y={45 + i * 50} fontSize="8" fill="white" fontFamily="monospace" opacity="0.5">
                                    {i % 2 === 0 ? "SSN: ***-**-****" : "USER_ID"}
                                    <animate attributeName="x" from="-60" to="120%" dur={`${4 + i * 0.5}s`} repeatCount="indefinite" begin={`${i * 0.8}s`} />
                                </text>
                            </g>
                        ))}
                    </svg>

                    <div className="absolute top-6 left-6 text-[9px] font-bold text-red-500 uppercase tracking-widest border border-red-500/30 px-3 py-1.5 rounded-lg bg-red-900/10 backdrop-blur-md">
                        Unsafe Zone
                    </div>
                    <div className="absolute top-6 right-6 text-[9px] font-bold text-blue-500 uppercase tracking-widest border border-blue-500/30 px-3 py-1.5 rounded-lg bg-blue-900/10 backdrop-blur-md">
                        Sanitized Zone
                    </div>
                </div>
            </div>
        </div>
    );
};

export const CompliancePage: React.FC = () => {
  const { navigateTo } = useNavigation();

  return (
    <div className="relative min-h-screen bg-[#020202] text-white font-sans overflow-x-hidden selection:bg-[#69B7B2]/30 selection:text-[#69B7B2]">
      
      {/* HEADER REMOVED: Managed by GlobalNav */}

      {/* --- HERO SECTION --- */}
      <section className="relative pt-40 pb-20 md:pt-60 md:pb-32 px-6 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
              <ComplianceVisualizer />
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-16">
              <div className="w-full lg:w-1/2 space-y-8">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#69B7B2]/30 bg-[#69B7B2]/10 text-[#69B7B2] text-[10px] font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-4 duration-700">
                      <Shield size={12} />
                      <span>Bank-Grade Security</span>
                  </div>
                  
                  <h1 className="text-5xl md:text-7xl font-serif text-white leading-[1.1] tracking-tight">
                      Data privacy, <br/>
                      <span className="text-[#69B7B2] italic">guaranteed.</span>
                  </h1>
                  
                  <p className="text-lg text-white/70 leading-relaxed max-w-xl">
                      You don't need to be a cybersecurity expert to keep your data safe. We handle the heavy lifting—redacting sensitive info, locking down access, and keeping clear records for auditors.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <button className="px-8 py-4 bg-[#69B7B2] hover:bg-[#5aa09c] text-black font-bold uppercase tracking-widest text-xs rounded transition-colors shadow-[0_0_20px_rgba(105,183,178,0.4)] flex items-center justify-center gap-2">
                          Start Secure Trial <ChevronRight size={16} />
                      </button>
                      <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase tracking-widest text-xs rounded transition-colors">
                          Read Security Whitepaper
                      </button>
                  </div>
              </div>

              {/* INTERACTIVE CHECKER */}
              <div className="w-full lg:w-1/2 h-full">
                  <ComplianceChecker />
              </div>
          </div>
      </section>

      {/* --- INTEGRATIONS (FILE TYPES) --- */}
      <section className="py-24 bg-[#080808]">
          <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row items-center gap-16">
                  <div className="w-full md:w-1/2">
                      <h2 className="text-3xl font-serif text-white mb-6">Works with everything you use.</h2>
                      <p className="text-white/60 text-lg leading-relaxed mb-8">
                          No need to change your workflow. Drag and drop your existing files, and we'll handle the rest. We support OCR for scanned PDFs, native Excel formulas, and complex Word formatting.
                      </p>
                      
                      <div className="flex flex-wrap gap-8 p-8 bg-white/[0.02] border border-white/5 rounded-2xl">
                          <FileIcon type="pdf" />
                          <FileIcon type="excel" />
                          <FileIcon type="word" />
                          <FileIcon type="ppt" />
                          <FileIcon type="csv" />
                      </div>
                  </div>
                  
                  {/* RIGHT SIDE: PAC-MAN VISUALIZER */}
                  <div className="w-full md:w-1/2 h-[300px] border border-white/10 rounded-[2rem] overflow-hidden relative shadow-2xl">
                      <PacManVisualizer />
                  </div>
              </div>
          </div>
      </section>

      {/* --- HOW IT WORKS (Timeline) --- */}
      <section className="py-24 bg-[#050505] border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-serif text-white mb-4">How We Protect You</h2>
                  <p className="text-white/50">Three simple steps to total compliance.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                  {/* Connector Line (Desktop) */}
                  <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#69B7B2]/30 to-transparent z-0" />

                  {/* Step 1 */}
                  <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="w-24 h-24 bg-[#0a0a0c] border border-[#69B7B2]/30 rounded-full flex items-center justify-center text-[#69B7B2] mb-6 shadow-[0_0_30px_rgba(105,183,178,0.1)]">
                          <Eye size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">1. Auto-Scan</h3>
                      <p className="text-white/60 text-sm leading-relaxed px-4">
                          Upload a document. Our AI instantly reads it and finds sensitive info like SSNs, names, or addresses.
                      </p>
                  </div>

                  {/* Step 2 */}
                  <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="w-24 h-24 bg-[#0a0a0c] border border-[#69B7B2]/30 rounded-full flex items-center justify-center text-[#69B7B2] mb-6 shadow-[0_0_30px_rgba(105,183,178,0.1)]">
                          <Lock size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">2. Smart Redaction</h3>
                      <p className="text-white/60 text-sm leading-relaxed px-4">
                          We blackout the private parts automatically. The clean version is safe to share with your team.
                      </p>
                  </div>

                  {/* Step 3 */}
                  <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="w-24 h-24 bg-[#0a0a0c] border border-[#69B7B2]/30 rounded-full flex items-center justify-center text-[#69B7B2] mb-6 shadow-[0_0_30px_rgba(105,183,178,0.1)]">
                          <FileCheck size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">3. Audit Record</h3>
                      <p className="text-white/60 text-sm leading-relaxed px-4">
                          We log exactly who accessed the file and when. Perfect for government audits.
                      </p>
                  </div>
              </div>
          </div>
      </section>

      {/* --- LARGE VISUAL SECTION (Interactive OS) --- */}
      <section className="py-24 bg-[#080808]">
          <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col lg:flex-row items-center gap-16">
                  
                  {/* Text */}
                  <div className="w-full lg:w-1/3 space-y-8">
                      <h2 className="text-3xl md:text-4xl font-serif text-white">
                          Keep your team <br /> on the same page.
                      </h2>
                      <p className="text-white/60 text-lg leading-relaxed">
                          Managing permissions shouldn't be a headache. Our workspace lets you redact files instantly and decide who sees what with just a few clicks.
                      </p>
                      <ul className="space-y-4">
                          <li className="flex items-center gap-3 text-white/80">
                              <CheckCircle2 className="text-[#69B7B2]" size={20} />
                              Simple "Manager" vs "Viewer" roles
                          </li>
                          <li className="flex items-center gap-3 text-white/80">
                              <CheckCircle2 className="text-[#69B7B2]" size={20} />
                              Works with your existing login (SSO)
                          </li>
                          <li className="flex items-center gap-3 text-white/80">
                              <CheckCircle2 className="text-[#69B7B2]" size={20} />
                              Instant access revocation
                          </li>
                      </ul>
                  </div>

                  {/* Interactive Dashboard Component */}
                  <div className="w-full lg:w-2/3">
                      <DocumentWorkspace />
                  </div>

              </div>
          </div>
      </section>

      {/* --- SECTION: ACCESS KILL SWITCH (New) --- */}
      <section className="py-24 bg-[#050505] border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6">
              <div className="mb-16">
                  <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Total Control.</h2>
                  <p className="text-white/50 max-w-2xl text-lg">
                      Manage identity and access across your entire organization from a single pane of glass. When an employee leaves, secure your data instantly.
                  </p>
              </div>
              <AccessKillSwitch />
          </div>
      </section>

      {/* --- SECTION: MCP AIRLOCK (New) --- */}
      <section className="py-24 bg-[#020202] border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6">
              <div className="mb-16">
                  <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Protocol-Level Security.</h2>
                  <p className="text-white/50 max-w-2xl text-lg">
                      We use the Model Context Protocol (MCP) to enforce strict boundaries. AI agents never touch raw data without passing through our security filters first.
                  </p>
              </div>
              <AirlockVisualizer />
          </div>
      </section>

      {/* --- FAQ / DETAILS --- */}
      <section className="py-24 bg-[#020202] border-t border-white/10">
          <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl font-serif text-white mb-12 text-center">Frequently Asked Questions</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                  <div className="p-6 bg-white/5 rounded-xl border border-white/5 hover:border-[#69B7B2]/30 transition-colors">
                      <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                          <Server size={16} className="text-[#69B7B2]" /> Where is my data stored?
                      </h4>
                      <p className="text-sm text-white/60">
                          You choose. We can host it in secure US-based servers, or you can keep it entirely on your own private servers ("On-Premise").
                      </p>
                  </div>

                  <div className="p-6 bg-white/5 rounded-xl border border-white/5 hover:border-[#69B7B2]/30 transition-colors">
                      <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                          <Globe size={16} className="text-[#69B7B2]" /> Is this GDPR compliant?
                      </h4>
                      <p className="text-sm text-white/60">
                          Absolutely. We include tools to "forget" user data instantly upon request, keeping you fully compliant with European laws.
                      </p>
                  </div>

                  <div className="p-6 bg-white/5 rounded-xl border border-white/5 hover:border-[#69B7B2]/30 transition-colors">
                      <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                          <AlertTriangle size={16} className="text-[#69B7B2]" /> What if we get hacked?
                      </h4>
                      <p className="text-sm text-white/60">
                          Our data is encrypted "At Rest" and "In Transit". Even if someone stole the hard drive, the files would look like gibberish without the key.
                      </p>
                  </div>

                  <div className="p-6 bg-white/5 rounded-xl border border-white/5 hover:border-[#69B7B2]/30 transition-colors">
                      <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                          <RefreshCw size={16} className="text-[#69B7B2]" /> Can I export reports?
                      </h4>
                      <p className="text-sm text-white/60">
                          Yes. One-click PDF or Excel exports of all audit logs, ready to hand over to any government inspector.
                      </p>
                  </div>
              </div>
          </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-black border-t border-white/10 pt-16 pb-8 text-sm">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center opacity-50">
              <div className="mb-4 md:mb-0">
                  <img src="https://uapriywlkpcpupdp.public.blob.vercel-storage.com/brand_logo_infogito.webp" alt="Infogito" className="h-6 w-auto grayscale" />
              </div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-white/50">
                  © 2026 Infogito Security Division.
              </div>
          </div>
      </footer>
    </div>
  );
};
