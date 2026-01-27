
import React, { useEffect, useRef, useState } from 'react';
import { 
    Zap, MessageSquare, Clock, ShieldAlert, CheckCircle, Mail, 
    Play, Settings, GripVertical, Plus, Trash2,
    Bell, UserPlus, FileText, MousePointer2, PhoneCall,
    X, Edit3, Layers, Copy, ChevronDown, ChevronUp, ZoomIn, ZoomOut, Move,
    Building2, Database, Cloud, Server, Share2, Globe, Lock, BrainCircuit,
    Circle, Truck, Package, MapPin, Radio, Loader2
} from 'lucide-react';

// --- TYPES ---

type NodeType = 'trigger' | 'action' | 'condition' | 'wait' | 'entity' | 'database' | 'neuron' | 'hub';

interface WorkflowNode {
    id: string;
    x: number; // Percentage 0-100
    y: number; // Percentage 0-100
    label: string;
    subtext?: string;
    icon: any;
    type: NodeType;
    active?: boolean; // Visual pulse state
    executions: number; // Stats
}

interface WorkflowConnection {
    from: string;
    to: string;
    label?: string; // e.g., "Yes", "No", "Owner"
    type?: 'flow' | 'static'; // Flow has particles, Static is a solid line
}

interface Preset {
    id: string;
    title: string;
    desc: string;
    nodes: WorkflowNode[];
    connections: WorkflowConnection[];
    type: 'workflow' | 'graph'; // Changes visual behavior
}

// Particle System Types
interface TrailParticle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
    size: number;
}

// --- DATA PRESETS ---

const PRESETS: Record<string, Preset> = {
    missed_call: {
        id: 'missed_call',
        title: "Missed Call Rescue",
        desc: "Auto-text leads when you can't pick up.",
        type: 'workflow',
        nodes: [
            { id: '1', x: 15, y: 50, label: "Inbound Call", subtext: "Status: Missed", icon: ShieldAlert, type: 'trigger', executions: 0 },
            { id: '2', x: 40, y: 50, label: "Business Hours?", subtext: "Mon-Fri, 9-5", icon: Clock, type: 'condition', executions: 0 },
            { id: '3', x: 65, y: 30, label: "SMS: 'Hi there...'", subtext: "Template: Missed Call", icon: MessageSquare, type: 'action', executions: 0 },
            { id: '4', x: 65, y: 70, label: "Voicemail Drop", subtext: "After-hours.mp3", icon: Mail, type: 'action', executions: 0 },
            { id: '5', x: 90, y: 50, label: "Notify Team", subtext: "Slack #leads", icon: Bell, type: 'action', executions: 0 }
        ],
        connections: [
            { from: '1', to: '2', type: 'flow' },
            { from: '2', to: '3', label: "Yes", type: 'flow' },
            { from: '2', to: '4', label: "No", type: 'flow' },
            { from: '3', to: '5', type: 'flow' },
            { from: '4', to: '5', type: 'flow' }
        ]
    },
    entity_map: {
        id: 'entity_map',
        title: "Corporate Structure",
        desc: "Visualizing ownership & liability.",
        type: 'graph',
        nodes: [
            { id: '1', x: 50, y: 50, label: "Holdings Inc", subtext: "Parent Co.", icon: Building2, type: 'entity', executions: 0 },
            { id: '2', x: 20, y: 20, label: "North LLC", subtext: "Delaware", icon: FileText, type: 'entity', executions: 0 },
            { id: '3', x: 80, y: 20, label: "South LLC", subtext: "Nevada", icon: FileText, type: 'entity', executions: 0 },
            { id: '4', x: 50, y: 85, label: "IP Trust", subtext: "Asset Protection", icon: Lock, type: 'entity', executions: 0 },
            { id: '5', x: 85, y: 50, label: "Offshore", subtext: "Cayman", icon: Globe, type: 'entity', executions: 0 }
        ],
        connections: [
            { from: '1', to: '2', label: "100%", type: 'static' },
            { from: '1', to: '3', label: "100%", type: 'static' },
            { from: '1', to: '4', label: "Licensing", type: 'static' },
            { from: '1', to: '5', label: "Equity", type: 'static' }
        ]
    },
    data_sync: {
        id: 'data_sync',
        title: "Data Sync Loop",
        desc: "Bi-directional database sync.",
        type: 'workflow',
        nodes: [
            { id: '1', x: 20, y: 50, label: "CRM (Salesforce)", subtext: "Source of Truth", icon: Cloud, type: 'database', executions: 0 },
            { id: '2', x: 50, y: 20, label: "Transform", subtext: "Normalize Data", icon: Share2, type: 'action', executions: 0 },
            { id: '3', x: 80, y: 50, label: "Data Warehouse", subtext: "Postgres DB", icon: Database, type: 'database', executions: 0 },
            { id: '4', x: 50, y: 80, label: "Enrichment", subtext: "Clearbit API", icon: Server, type: 'action', executions: 0 }
        ],
        connections: [
            { from: '1', to: '2', type: 'flow' },
            { from: '2', to: '3', type: 'flow' },
            { from: '3', to: '4', type: 'flow' },
            { from: '4', to: '1', type: 'flow', label: "Update" }
        ]
    },
    neural_net: {
        id: 'neural_net',
        title: "AI Inference",
        desc: "Neural network topology visualization.",
        type: 'graph',
        nodes: [
            { id: 'i1', x: 15, y: 30, label: "Input 1", icon: Circle, type: 'neuron', executions: 0 },
            { id: 'i2', x: 15, y: 50, label: "Input 2", icon: Circle, type: 'neuron', executions: 0 },
            { id: 'i3', x: 15, y: 70, label: "Input 3", icon: Circle, type: 'neuron', executions: 0 },
            
            { id: 'h1', x: 45, y: 20, label: "Hidden 1", icon: BrainCircuit, type: 'neuron', executions: 0 },
            { id: 'h2', x: 45, y: 40, label: "Hidden 2", icon: BrainCircuit, type: 'neuron', executions: 0 },
            { id: 'h3', x: 45, y: 60, label: "Hidden 3", icon: BrainCircuit, type: 'neuron', executions: 0 },
            { id: 'h4', x: 45, y: 80, label: "Hidden 4", icon: BrainCircuit, type: 'neuron', executions: 0 },

            { id: 'o1', x: 75, y: 35, label: "Class A", icon: Zap, type: 'neuron', executions: 0 },
            { id: 'o2', x: 75, y: 65, label: "Class B", icon: Zap, type: 'neuron', executions: 0 },
        ],
        connections: [
            // Fully connected I -> H
            { from: 'i1', to: 'h1', type: 'static' }, { from: 'i1', to: 'h2', type: 'static' }, { from: 'i1', to: 'h3', type: 'static' }, { from: 'i1', to: 'h4', type: 'static' },
            { from: 'i2', to: 'h1', type: 'static' }, { from: 'i2', to: 'h2', type: 'static' }, { from: 'i2', to: 'h3', type: 'static' }, { from: 'i2', to: 'h4', type: 'static' },
            { from: 'i3', to: 'h1', type: 'static' }, { from: 'i3', to: 'h2', type: 'static' }, { from: 'i3', to: 'h3', type: 'static' }, { from: 'i3', to: 'h4', type: 'static' },
            // Fully connected H -> O
            { from: 'h1', to: 'o1', type: 'static' }, { from: 'h1', to: 'o2', type: 'static' },
            { from: 'h2', to: 'o1', type: 'static' }, { from: 'h2', to: 'o2', type: 'static' },
            { from: 'h3', to: 'o1', type: 'static' }, { from: 'h3', to: 'o2', type: 'static' },
            { from: 'h4', to: 'o1', type: 'static' }, { from: 'h4', to: 'o2', type: 'static' },
        ]
    },
    logistics: {
        id: 'logistics',
        title: "Global Logistics",
        desc: "Supply chain routing network.",
        type: 'workflow',
        nodes: [
            { id: '1', x: 50, y: 50, label: "Central Hub", subtext: "Distribution", icon: Building2, type: 'hub', executions: 0 },
            { id: '2', x: 20, y: 20, label: "Supplier A", subtext: "Raw Mats", icon: Package, type: 'trigger', executions: 0 },
            { id: '3', x: 80, y: 20, label: "Supplier B", subtext: "Electronics", icon: Package, type: 'trigger', executions: 0 },
            { id: '4', x: 20, y: 80, label: "Region West", subtext: "Delivery", icon: Truck, type: 'action', executions: 0 },
            { id: '5', x: 80, y: 80, label: "Region East", subtext: "Delivery", icon: Truck, type: 'action', executions: 0 },
            { id: '6', x: 50, y: 85, label: "Fleet Mgr", subtext: "Tracking", icon: MapPin, type: 'database', executions: 0 },
        ],
        connections: [
            { from: '2', to: '1', type: 'flow' },
            { from: '3', to: '1', type: 'flow' },
            { from: '1', to: '4', type: 'flow' },
            { from: '1', to: '5', type: 'flow' },
            { from: '4', to: '6', type: 'static', label: "GPS" },
            { from: '5', to: '6', type: 'static', label: "GPS" }
        ]
    }
};

export const WorkflowVisualizer: React.FC = () => {
    // STATE
    const [activePresetId, setActivePresetId] = useState<string>('missed_call');
    const [nodes, setNodes] = useState<WorkflowNode[]>([]);
    const [connections, setConnections] = useState<WorkflowConnection[]>([]);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    // PAN & ZOOM STATE
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [dragNode, setDragNode] = useState<{ id: string, startX: number, startY: number, initX: number, initY: number } | null>(null);
    const lastMousePos = useRef({ x: 0, y: 0 });
    const dragStartPos = useRef({ x: 0, y: 0 }); // To detect click vs drag

    // VISUAL STATE
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    // Refs for animation loop data to avoid re-renders
    const packetsRef = useRef<{ from: string, to: string, progress: number, speed: number, color: string }[]>([]);
    const particlesRef = useRef<TrailParticle[]>([]);
    const animationRef = useRef<number>(null);
    const timeRef = useRef(0);

    // --- INITIALIZATION ---
    useEffect(() => {
        const preset = PRESETS[activePresetId];
        setNodes(JSON.parse(JSON.stringify(preset.nodes)).map((n: any, i: number) => ({
            ...n,
            icon: preset.nodes[i].icon 
        }))); 
        setConnections(preset.connections);
        setIsRunning(false);
        packetsRef.current = [];
        particlesRef.current = [];
        setSelectedNodeId(null);
        // Reset view
        setPan({ x: 0, y: 0 });
        setZoom(1);
    }, [activePresetId]);

    // --- SIMULATION LOGIC ---
    const runSimulation = () => {
        if (isRunning) return;
        setIsRunning(true);
        // Trigger start nodes based on preset type
        const startTypes = ['trigger', 'database', 'entity', 'neuron', 'hub'];
        const triggers = nodes.filter(n => startTypes.includes(n.type) && connections.some(c => c.from === n.id));
        
        // If no obvious triggers, trigger everything with outbound connections
        const actualTriggers = triggers.length > 0 ? triggers : nodes.filter(n => connections.some(c => c.from === n.id));

        setNodes(prev => prev.map(n => ({ ...n, executions: 0 })));
        
        actualTriggers.forEach(t => {
            triggerNode(t.id);
            spawnPacketsFrom(t.id);
        });

        // Safety timeout to reset if nothing happens (e.g. broken loop)
        setTimeout(() => setIsRunning(false), 8000);
    };

    const triggerNode = (id: string) => {
        setNodes(prev => prev.map(n => {
            if (n.id === id) {
                return { ...n, active: true, executions: n.executions + 1 };
            }
            return n;
        }));
        setTimeout(() => {
            setNodes(prev => prev.map(n => n.id === id ? { ...n, active: false } : n));
        }, 300);
    };

    const spawnPacketsFrom = (nodeId: string) => {
        const outbound = connections.filter(c => c.from === nodeId);
        outbound.forEach(c => {
            // Logic: Normal flow gets yellow packets. Static graph gets fast cyan signal packets.
            const isStatic = c.type === 'static';
            
            packetsRef.current.push({ 
                from: c.from, 
                to: c.to, 
                progress: 0, 
                speed: isStatic ? 0.04 : 0.01 + Math.random() * 0.005, // Static is faster (signal)
                color: isStatic ? '#22d3ee' : '#fbbf24' // Cyan vs Amber
            });
        });
    };

    // --- ANIMATION LOOP ---
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const render = () => {
            timeRef.current += 0.02;
            const w = canvas.parentElement?.clientWidth || 800;
            const h = canvas.parentElement?.clientHeight || 600;
            if (canvas.width !== w || canvas.height !== h) {
                canvas.width = w; canvas.height = h;
            }

            ctx.clearRect(0, 0, w, h);
            
            // APPLY TRANSFORM
            ctx.save();
            ctx.translate(pan.x + w/2, pan.y + h/2);
            ctx.scale(zoom, zoom);
            ctx.translate(-w/2, -h/2);

            // 0. DYNAMIC GRID BACKGROUND
            const gridSize = 50;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
            const startX = Math.floor((-pan.x - w/2/zoom) / gridSize) * gridSize;
            const startY = Math.floor((-pan.y - h/2/zoom) / gridSize) * gridSize;
            const endX = startX + w/zoom + gridSize;
            const endY = startY + h/zoom + gridSize;

            for(let gx = startX; gx < endX; gx += gridSize) {
                for(let gy = startY; gy < endY; gy += gridSize) {
                    ctx.beginPath();
                    ctx.arc(gx, gy, 1, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // 1. DRAW CONNECTIONS
            connections.forEach(conn => {
                const fromNode = nodes.find(n => n.id === conn.from);
                const toNode = nodes.find(n => n.id === conn.to);
                
                if (fromNode && toNode) {
                    const startX = (fromNode.x / 100) * w;
                    const startY = (fromNode.y / 100) * h;
                    const endX = (toNode.x / 100) * w;
                    const endY = (toNode.y / 100) * h;

                    const deltaX = Math.abs(endX - startX);
                    const cp1x = startX + deltaX * 0.5; const cp1y = startY;
                    const cp2x = endX - deltaX * 0.5; const cp2y = endY;

                    // STATIC vs FLOW style
                    if (conn.type === 'static') {
                        // Solid lines for Knowledge Graph / Neural Net
                        ctx.strokeStyle = 'rgba(105, 183, 178, 0.15)';
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.moveTo(startX, startY);
                        ctx.lineTo(endX, endY);
                        ctx.stroke();
                    } else {
                        // Curved lines for Workflows
                        const grad = ctx.createLinearGradient(startX, startY, endX, endY);
                        grad.addColorStop(0, 'rgba(105, 183, 178, 0.2)');
                        grad.addColorStop(1, 'rgba(105, 183, 178, 0.5)');
                        
                        ctx.beginPath();
                        ctx.moveTo(startX, startY);
                        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
                        ctx.strokeStyle = grad;
                        ctx.lineWidth = 3;
                        ctx.stroke();

                        // Animated Dash
                        ctx.beginPath();
                        ctx.moveTo(startX, startY);
                        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
                        ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)';
                        ctx.lineWidth = 1;
                        ctx.setLineDash([5, 15]);
                        ctx.lineDashOffset = -timeRef.current * 20;
                        ctx.stroke();
                        ctx.setLineDash([]);
                    }

                    // Connection Label
                    if (conn.label) {
                        const t = 0.5;
                        let labelX, labelY;
                        
                        if (conn.type === 'static') {
                            labelX = (startX + endX) / 2;
                            labelY = (startY + endY) / 2;
                        } else {
                            // Cubic bezier center point approximation
                            labelX = (startX + 3*cp1x + 3*cp2x + endX) / 8;
                            labelY = (startY + 3*cp1y + 3*cp2y + endY) / 8;
                        }

                        ctx.fillStyle = '#0c0c0e';
                        ctx.beginPath(); ctx.arc(labelX, labelY, 14 / zoom, 0, Math.PI*2); ctx.fill();
                        ctx.strokeStyle = '#69B7B2'; ctx.lineWidth = 1 / zoom; ctx.stroke();
                        
                        ctx.fillStyle = '#fff';
                        ctx.font = `bold ${10 / zoom}px sans-serif`;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(conn.label, labelX, labelY);
                    }
                }
            });

            // 2. DRAW PACKETS & SPAWN TRAILS
            for (let i = packetsRef.current.length - 1; i >= 0; i--) {
                const p = packetsRef.current[i];
                p.progress += p.speed;

                const fromNode = nodes.find(n => n.id === p.from);
                const toNode = nodes.find(n => n.id === p.to);
                
                if (fromNode && toNode) {
                    const startX = (fromNode.x / 100) * w;
                    const startY = (fromNode.y / 100) * h;
                    const endX = (toNode.x / 100) * w;
                    const endY = (toNode.y / 100) * h;

                    let px, py;

                    // Calculate position based on line type
                    const conn = connections.find(c => c.from === p.from && c.to === p.to);
                    const isStatic = conn?.type === 'static';

                    if (isStatic) {
                        // Linear interpolation
                        px = startX + (endX - startX) * p.progress;
                        py = startY + (endY - startY) * p.progress;
                    } else {
                        // Bezier interpolation
                        const t = p.progress;
                        const deltaX = Math.abs(endX - startX);
                        const cp1x = startX + deltaX * 0.5; const cp1y = startY;
                        const cp2x = endX - deltaX * 0.5; const cp2y = endY;
                        
                        const cx = 3 * (cp1x - startX);
                        const bx = 3 * (cp2x - cp1x) - cx;
                        const ax = endX - startX - cx - bx;
                        px = (ax * Math.pow(t, 3)) + (bx * Math.pow(t, 2)) + (cx * t) + startX;

                        const cy = 3 * (cp1y - startY);
                        const by = 3 * (cp2y - cp1y) - cy;
                        const ay = endY - startY - cy - by;
                        py = (ay * Math.pow(t, 3)) + (by * Math.pow(t, 2)) + (cy * t) + startY;
                    }

                    // Draw Packet Head
                    const packetSize = isStatic ? 3 : 5;
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = p.color;
                    ctx.fillStyle = p.color === '#22d3ee' ? '#fff' : p.color; // White core for cyan
                    ctx.beginPath(); ctx.arc(px, py, packetSize, 0, Math.PI*2); ctx.fill();
                    ctx.shadowBlur = 0;

                    // Spawn Trail Particles (Less for static signals)
                    if (Math.random() > (isStatic ? 0.5 : 0.2)) {
                        particlesRef.current.push({
                            x: px + (Math.random()-0.5)*4,
                            y: py + (Math.random()-0.5)*4,
                            vx: (Math.random()-0.5)*0.5,
                            vy: (Math.random()-0.5)*0.5,
                            life: 1.0,
                            color: p.color,
                            size: Math.random() * 2 + 1
                        });
                    }

                    if (p.progress >= 1) {
                        const targetNode = nodes.find(n => n.id === p.to);
                        if (targetNode) {
                            triggerNode(targetNode.id);
                            spawnPacketsFrom(targetNode.id);
                        }
                        packetsRef.current.splice(i, 1);
                    }
                }
            }

            // 3. DRAW PARTICLES
            for (let i = particlesRef.current.length - 1; i >= 0; i--) {
                const p = particlesRef.current[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.04;
                if (p.life <= 0) {
                    particlesRef.current.splice(i, 1);
                    continue;
                }
                ctx.globalAlpha = p.life;
                ctx.fillStyle = p.color;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
            }
            ctx.globalAlpha = 1;

            ctx.restore();
            animationRef.current = requestAnimationFrame(render);
        };

        render();
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [nodes, connections, isRunning, pan, zoom]);

    // --- INTERACTION HANDLERS ---

    const handleWheel = (e: React.WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            e.stopPropagation();
            const delta = -e.deltaY * 0.001;
            setZoom(z => Math.min(Math.max(0.3, z + delta), 2.5));
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).tagName === 'CANVAS' || (e.target as HTMLElement).classList.contains('canvas-container')) {
            setIsPanning(true);
            lastMousePos.current = { x: e.clientX, y: e.clientY };
            dragStartPos.current = { x: e.clientX, y: e.clientY };
        }
    };

    const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string, nodeX: number, nodeY: number) => {
        e.stopPropagation();
        setDragNode({ id: nodeId, startX: e.clientX, startY: e.clientY, initX: nodeX, initY: nodeY });
        lastMousePos.current = { x: e.clientX, y: e.clientY };
        dragStartPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isPanning) {
            const dx = e.clientX - lastMousePos.current.x;
            const dy = e.clientY - lastMousePos.current.y;
            setPan(p => ({ x: p.x + dx, y: p.y + dy }));
            lastMousePos.current = { x: e.clientX, y: e.clientY };
        } else if (dragNode && containerRef.current) {
            const w = containerRef.current.clientWidth;
            const h = containerRef.current.clientHeight;
            
            const dx = ((e.clientX - dragNode.startX) / (w * zoom)) * 100;
            const dy = ((e.clientY - dragNode.startY) / (h * zoom)) * 100;

            setNodes(prev => prev.map(n => {
                if (n.id === dragNode.id) {
                    return {
                        ...n,
                        x: Math.max(0, Math.min(100, dragNode.initX + dx)),
                        y: Math.max(0, Math.min(100, dragNode.initY + dy))
                    };
                }
                return n;
            }));
        }
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        const dist = Math.sqrt(
            Math.pow(e.clientX - dragStartPos.current.x, 2) + 
            Math.pow(e.clientY - dragStartPos.current.y, 2)
        );

        if (dist < 5) {
            if (dragNode) setSelectedNodeId(dragNode.id);
            else setSelectedNodeId(null);
        }

        setIsPanning(false);
        setDragNode(null);
    };

    const updateNodeProperty = (key: 'label' | 'subtext', value: string) => {
        if (!selectedNodeId) return;
        setNodes(prev => prev.map(n => n.id === selectedNodeId ? { ...n, [key]: value } : n));
    };

    const getNodeStyles = (type: NodeType, isSelected: boolean) => {
        let base = "border-2 transition-all duration-300 shadow-2xl relative z-10 ";
        if (isSelected) base += "ring-4 ring-white/20 scale-110 ";
        
        switch(type) {
            case 'trigger': return base + 'bg-[#1a1a1c] border-amber-500 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]';
            case 'action': return base + 'bg-[#1a1a1c] border-blue-500 text-blue-500';
            case 'condition': return base + 'bg-[#1a1a1c] border-purple-500 text-purple-500 rotate-45';
            case 'wait': return base + 'bg-[#1a1a1c] border-white/20 text-white/50 border-dashed';
            case 'entity': return base + 'bg-[#1a1a1c] border-green-500 text-green-500 rounded-sm';
            case 'database': return base + 'bg-[#1a1a1c] border-indigo-500 text-indigo-500 rounded-full';
            case 'neuron': return base + 'bg-[#1a1a1c] border-cyan-500 text-cyan-500 rounded-full scale-75';
            case 'hub': return base + 'bg-[#1a1a1c] border-pink-500 text-pink-500 rounded-lg';
            default: return base + 'bg-[#1a1a1c] border-white/20 text-white';
        }
    };

    const selectedNode = nodes.find(n => n.id === selectedNodeId);

    return (
        <div className="flex flex-col md:flex-row h-full min-h-[500px] w-full bg-[#0c0c0e] rounded-3xl overflow-hidden shadow-2xl">
            
            {/* LEFT SIDEBAR: PRESETS */}
            <div className={`md:w-64 bg-[#08080a] border-b md:border-b-0 md:border-r border-white/10 flex flex-col z-20 transition-all duration-300 ${mobileMenuOpen ? 'h-1/2' : 'h-16'} md:h-auto`}>
                <div 
                    className="p-6 border-b border-white/5 flex justify-between items-center cursor-pointer md:cursor-default"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <h3 className="text-white font-bold text-sm flex items-center gap-2">
                        <Zap size={16} className="text-amber-glow" /> Workflows
                    </h3>
                    <div className="md:hidden text-white/50">
                        {mobileMenuOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                </div>
                
                <div className={`flex-1 overflow-y-auto p-4 space-y-2 ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
                    {Object.values(PRESETS).map(preset => (
                        <button
                            key={preset.id}
                            onClick={() => { setActivePresetId(preset.id); setMobileMenuOpen(false); }}
                            className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group ${
                                activePresetId === preset.id 
                                ? 'bg-white/10 border-white/20 text-white' 
                                : 'bg-transparent border-transparent text-white/40 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <div className="font-bold text-xs mb-1 flex items-center gap-2">
                                {preset.type === 'graph' ? <Layers size={10} /> : <Zap size={10} />}
                                {preset.title}
                            </div>
                            <div className="text-[10px] opacity-70 leading-relaxed truncate">{preset.desc}</div>
                        </button>
                    ))}
                </div>
                <div className={`p-4 border-t border-white/5 ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
                    <button className="w-full py-3 border border-dashed border-white/20 rounded-xl text-white/30 text-xs font-bold uppercase tracking-widest hover:border-white/40 hover:text-white transition-colors flex items-center justify-center gap-2">
                        <Plus size={14} /> New Flow
                    </button>
                </div>
            </div>

            {/* MAIN EDITOR AREA */}
            <div className="flex-1 flex flex-col relative bg-[#0c0c0e]">
                
                {/* TOOLBAR */}
                <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0c0c0e]/90 backdrop-blur z-30">
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-white/50 uppercase tracking-widest flex items-center gap-2">
                            <Edit3 size={14} /> Editor Mode
                        </span>
                        <div className="flex items-center bg-white/5 rounded-lg border border-white/5 h-8">
                            <button onClick={() => setZoom(z => Math.max(0.3, z - 0.2))} className="h-full px-3 hover:bg-white/10 text-white/50 hover:text-white transition-colors border-r border-white/5 flex items-center justify-center"><ZoomOut size={14}/></button>
                            <span className="text-[10px] font-mono w-12 text-center text-white/50">{Math.round(zoom * 100)}%</span>
                            <button onClick={() => setZoom(z => Math.min(2.5, z + 0.2))} className="h-full px-3 hover:bg-white/10 text-white/50 hover:text-white transition-colors border-l border-white/5 flex items-center justify-center"><ZoomIn size={14}/></button>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={runSimulation}
                            disabled={isRunning}
                            className={`
                                flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300
                                ${isRunning 
                                    ? 'bg-amber-glow/10 text-amber-glow border border-amber-glow/20 cursor-not-allowed' 
                                    : 'bg-amber-glow text-black hover:bg-[#f59e0b] hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] active:scale-95'
                                }
                            `}
                        >
                            {isRunning ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" /> Simulating...
                                </>
                            ) : (
                                <>
                                    <Play size={14} fill="currentColor" /> Test Run
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* CANVAS */}
                <div className="flex-1 relative overflow-hidden flex">
                    <div className="absolute top-4 left-4 z-20 pointer-events-none text-[9px] text-white/20 font-mono uppercase tracking-widest">
                        Hold CTRL to Zoom • Drag to Pan
                    </div>

                    <div 
                        ref={containerRef}
                        className="absolute inset-0 z-0 canvas-container cursor-grab active:cursor-grabbing"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onWheel={handleWheel}
                    >
                        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />

                        <div 
                            className="absolute inset-0 z-20 pointer-events-none"
                            style={{ 
                                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                                transformOrigin: 'center center',
                                width: '100%',
                                height: '100%'
                            }}
                        >
                            {nodes.map(node => {
                                const Icon = node.icon || Zap; 
                                return (
                                    <div
                                        key={node.id}
                                        onMouseDown={(e) => handleNodeMouseDown(e, node.id, node.x, node.y)}
                                        className={`absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-grab active:cursor-grabbing transition-transform duration-200 ${node.active ? 'scale-110' : 'scale-100'}`}
                                        style={{ left: `${node.x}%`, top: `${node.y}%` }}
                                    >
                                        {node.executions > 0 && (
                                            <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-green-500 border-2 border-[#0c0c0e] flex items-center justify-center text-[10px] font-bold text-white z-50 animate-in zoom-in shadow-lg">
                                                {node.executions}
                                            </div>
                                        )}

                                        <div className={`w-14 h-14 flex items-center justify-center rounded-2xl ${getNodeStyles(node.type, selectedNodeId === node.id)}`}>
                                            <Icon size={24} />
                                            {node.active && <div className="absolute inset-0 rounded-2xl bg-amber-glow/40 animate-ping" />}
                                        </div>

                                        <div className={`mt-4 px-3 py-2 rounded-lg bg-[#0c0c0e] border border-white/20 text-center backdrop-blur-md transition-colors duration-300 min-w-[100px] shadow-xl ${node.active ? 'border-amber-glow/50' : ''}`}>
                                            <div className={`text-[10px] font-bold uppercase tracking-wider ${node.active ? 'text-amber-glow' : 'text-white'}`}>{node.label}</div>
                                            {node.subtext && <div className="text-[9px] text-white/40 font-mono mt-0.5">{node.subtext}</div>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR: INSPECTOR */}
                    <div 
                        className={`absolute top-0 right-0 h-full w-80 bg-[#08080a] border-l border-white/10 shadow-2xl z-30 transform transition-transform duration-300 ease-out ${selectedNodeId ? 'translate-x-0' : 'translate-x-full'}`}
                    >
                        {selectedNode ? (
                            <div className="flex flex-col h-full">
                                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0c0c0e]">
                                    <h3 className="text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                                        <Settings size={14} /> Inspector
                                    </h3>
                                    <button onClick={() => setSelectedNodeId(null)} className="text-white/40 hover:text-white"><X size={16}/></button>
                                </div>
                                <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Step Name</label>
                                        <input 
                                            type="text" 
                                            value={selectedNode.label} 
                                            onChange={(e) => updateNodeProperty('label', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-glow focus:outline-none transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Description</label>
                                        <input 
                                            type="text" 
                                            value={selectedNode.subtext || ''} 
                                            onChange={(e) => updateNodeProperty('subtext', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-glow focus:outline-none transition-colors"
                                        />
                                    </div>
                                    
                                    <div className="pt-6 border-t border-white/5">
                                        <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4">Runtime Stats</div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                                <div className="text-2xl font-mono text-white">{selectedNode.executions}</div>
                                                <div className="text-[9px] text-white/30 uppercase">Executions</div>
                                            </div>
                                            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                                <div className="text-2xl font-mono text-green-400">100%</div>
                                                <div className="text-[9px] text-white/30 uppercase">Success Rate</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-4">
                                        <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-2 transition-colors">
                                            <Copy size={14} /> Duplicate
                                        </button>
                                        <button className="flex-1 py-3 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-xs font-bold text-red-400 flex items-center justify-center gap-2 transition-colors">
                                            <Trash2 size={14} /> Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-white/20 p-8 text-center">
                                <Layers size={48} className="mb-4 opacity-50" />
                                <p className="text-xs uppercase tracking-widest font-bold">No Node Selected</p>
                                <p className="text-[10px] mt-2">Click any node on the canvas to edit its properties.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
