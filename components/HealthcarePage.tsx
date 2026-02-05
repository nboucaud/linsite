
import React, { useEffect, useRef, useState } from 'react';
import { Activity, Shield, FileText, Lock, Brain, Microscope, BarChart3, Users, Clock, AlertCircle, CheckCircle2, ArrowRight, Database, ChevronDown, ArrowLeft, Maximize2, Zap, X, FileWarning, TrendingUp, Scale, ScanLine, ImageIcon, ChevronUp } from 'lucide-react';
import { HealthcareHeroVisualizer } from './HealthcareHeroVisualizer';
import { IndustryNavigationFooter } from './IndustryNavigationFooter';
import { ViewportSlot } from './ViewportSlot';

// --- TEXT FORMATTER ---
const FormattedContent: React.FC<{ text: string }> = ({ text }) => {
    return (
        <div className="space-y-8 font-sans text-xl leading-relaxed text-white/80">
            {text.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="max-w-4xl">
                    {paragraph.split(/(\*\*.*?\*\*)/g).map((part, i) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={i} className="text-white font-medium font-sans">{part.slice(2, -2)}</strong>;
                        }
                        return <span key={i}>{part}</span>;
                    })}
                </p>
            ))}
        </div>
    );
};

// Enhanced Image Component with JS Canvas Overlay
const ImagePlaceholder: React.FC<{ type: 'wide' | 'portrait' | 'square', label: string, src?: string }> = ({ type, label, src }) => {
    const aspect = type === 'wide' ? 'aspect-[21/9]' : type === 'portrait' ? 'aspect-[3/4]' : 'aspect-square';
    const widthClass = type === 'wide' ? 'w-full' : 'w-full';
    
    // Intersection Observer for Reveal Effect
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        }, { threshold: 0.1 });
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    // Canvas Effect (The ".js" part)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !isVisible) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;

        const render = () => {
            time += 1;
            const w = canvas.parentElement?.clientWidth || 300;
            const h = canvas.parentElement?.clientHeight || 300;
            canvas.width = w;
            canvas.height = h;

            ctx.clearRect(0, 0, w, h);

            // 1. Vertical Scanline
            const scanY = (time * 1.5) % h;
            ctx.fillStyle = 'rgba(20, 184, 166, 0.1)'; // Teal tint
            ctx.fillRect(0, scanY, w, 2);

            // 2. DNA-like Particles
            if (Math.random() > 0.95) {
                const px = Math.random() * w;
                const py = Math.random() * h;
                ctx.fillStyle = 'rgba(45, 212, 191, 0.6)';
                ctx.beginPath();
                ctx.arc(px, py, 2, 0, Math.PI * 2);
                ctx.fill();
            }

            // 3. Grid Markers
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.fillRect(20, h-20, 4, 1);
            ctx.fillRect(20, h-24, 1, 4);
            ctx.fillRect(w-24, 20, 4, 1);
            ctx.fillRect(w-21, 20, 1, 4);

            animationFrameId = requestAnimationFrame(render);
        };
        render();

        return () => cancelAnimationFrame(animationFrameId);
    }, [isVisible]);
    
    return (
        <div ref={containerRef} className={`my-16 group cursor-default ${widthClass} transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className={`w-full ${aspect} bg-[#0c0c0e] border border-white/10 rounded-lg flex flex-col items-center justify-center relative overflow-hidden group shadow-2xl`}>
                {src ? (
                    <>
                        <img 
                            src={src} 
                            alt={label}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Canvas Overlay */}
                        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-60 mix-blend-screen" />
                        
                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out skew-x-12 pointer-events-none" />
                    </>
                ) : (
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                )}
            </div>
        </div>
    );
};

// --- DATA FROM PDF ---

const STATS = [
    {
        value: "2/3",
        label: "MedTech Compliance",
        desc: "Manufacturers report current regulatory intelligence capabilities are insufficient to meet product compliance needs.",
        source: "MedTech Intelligence",
        icon: FileWarning,
        color: "#ef4444", // Red
        url: "https://medtechintelligence.com/news_article/soaring-medical-device-scrutiny-how-is-the-market-adapting/?utm_source=chatgpt.com"
    },
    {
        value: "80%",
        label: "Workforce Challenges",
        desc: "Executives expect external workforce challenges such hiring and retention difficulties to persist.",
        source: "Deloitte",
        icon: Users,
        color: "#f59e0b", // Amber
        url: "https://www.deloitte.com/us/en/insights/industry/health-care/life-sciences-and-health-care-industry-outlooks/2025-global-health-care-executive-outlook.html?utm_source=chatgpt.com"
    },
    {
        value: "49%",
        label: "Specialist Gaps",
        desc: "Nearly half of hospital systems report significant specialist staffing gaps affecting throughput and operations.",
        source: "FTI Strategic Comms",
        icon: Activity,
        color: "#3b82f6", // Blue
        url: "https://fticommunications.com/2025-hospital-operations-survey-report/?utm_source=chatgpt.com"
    },
    {
        value: ">50%",
        label: "Operating Budgets",
        desc: "Labor costs account for more than 50% of operating budgets, even as organizations struggle with turnover.",
        source: "Redesign Health",
        icon: Scale,
        color: "#8b5cf6", // Violet
        url: "https://www.redesignhealth.com/insights/navigating-the-healthcare-workforce-crisis-a-call-for-innovation-in-workforce-optimization?utm_source=chatgpt.com"
    },
    {
        value: "10.4%",
        label: "CAGR Growth",
        desc: "Projected growth in hospital capacity management solutions through 2033, reflecting rising investment.",
        source: "Grand View Research",
        icon: TrendingUp,
        color: "#10b981", // Emerald
        url: "https://www.grandviewresearch.com/industry-analysis/hospital-capacity-management-solutions-market-report?utm_source=chatgpt.com"
    },
    {
        value: "11.5 → 4.4",
        label: "Days Reduction",
        desc: "Average length of stay reduced significantly via intensive quality improvement projects.",
        source: "PMC",
        icon: Clock,
        color: "#14b8a6", // Teal
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10910643/?utm_source=chatgpt.com"
    }
];

const PILLARS = [
    {
        id: 'compliance',
        title: "Clinical & Device Compliance",
        shortDesc: "Governing regulated systems across complex environments.",
        subtitle: "Governing regulated clinical systems and medical devices across complex regulatory environments",
        icon: Shield,
        visualMode: 'shield',
        color: '#14b8a6', // Teal
        content: {
            problem: "Clinical systems and medical devices operate within regulatory frameworks that are increasingly complex, overlapping, and continuously evolving. Organizations must manage design controls, validation activities, quality processes, and documentation requirements across jurisdictions, often with limited visibility into how compliance obligations intersect with day-to-day operations.\n\n**As systems become more software-driven and interconnected, compliance risk is no longer isolated to a single product or team.** Changes in one area, whether tooling, workflows, or integrations, can introduce downstream exposure elsewhere. Many organizations struggle to maintain consistent traceability and audit readiness as regulatory responsibility becomes distributed across engineering, operations, quality, and IT. The result is an environment where compliance effort grows over time, slowing delivery, increasing manual oversight, and creating uncertainty around regulatory posture, even when teams are acting in good faith.",
            intervene: "The work that still needs to be done is less about “more AI” and more about governance: **defining bounded use cases, enforcing strict source control, ensuring every inference is tied to validated artifacts, and designing human accountability into every workflow.** The goal is operational support that improves consistency and readiness without increasing regulatory exposure. Modern compliance environments generate large volumes of artifacts: requirements, risk analyses, validation evidence, change records, and quality documentation. This is where the operational burden lies in consistency, linkage, and defensibility over time.\n\nWhen used appropriately, AI can support structured review, continuity checks across artifacts, and early detection of compliance drift as systems evolve. Industry leaders are already experimenting with AI-assisted document review, automated classification of quality events, and workflow tools that reduce manual reconciliation between engineering, quality, and regulatory teams. Some organizations are also using AI to improve audit readiness by standardizing artifact formats and accelerating internal review cycles, particularly where compliance responsibilities are distributed across functions.\n\n**Where AI often goes wrong in this space is by producing output that is not auditable.** Systems that summarize, rewrite, or recommend actions without explicit traceability to approved requirements and controlled documents introduce new risk. AI also fails when it treats regulatory frameworks as generic knowledge rather than site- and product-specific constraints. In regulated environments, plausible language is not enough; defensibility depends on evidence, provenance, and controlled change.",
            approach: "Across regulated healthcare environments, the prevailing approach is shifting away from compliance as a downstream verification task and toward compliance as a **continuously governed operational system**. Rather than treating regulatory artifacts as static documents, leaders are reframing them as living records that reflect how systems are designed, changed, and controlled over time. Protecting healthcare providers and systems increasingly depends on compliance approaches that integrate AI in ways that preserve context, traceability, and accountability across regulated clinical and device environments.\n\nRegulatory expectations are not a transient phase of digital transformation, but a permanent operational condition that continues to intensify as systems become more software-driven and interconnected. This work emphasizes **traceability before automation, evidence before inference, and accountability before efficiency.** AI is applied conservatively, in bounded ways that support review, consistency, and early risk detection, never as an authority, but as a structured assistant operating within validated constraints. Progress in this space comes from aligning regulatory intent with operational reality, ensuring that compliance strengthens system reliability rather than slowing it."
        }
    },
    {
        id: 'acute',
        title: "Acute Care Operations",
        shortDesc: "Managing capacity and resilience in high-acuity settings.",
        subtitle: "Managing capacity, coordination, and operational resilience in high-acuity care environments",
        icon: Activity,
        visualMode: 'pulse',
        color: '#f43f5e', // Rose
        content: {
            problem: "Acute care environments face constant operational volatility. Patient demand fluctuates rapidly, staffing availability changes by shift, and physical capacity is constrained by both infrastructure and workforce limitations. Operational decisions must be made continuously, often with incomplete or delayed information.\n\n**Coordination breakdowns across departments, handoffs, and systems can quickly compound into congestion, extended wait times, and resource misalignment.** Even small inefficiencies, such as delayed bed turnover or misaligned staffing, can cascade across the organization, placing additional strain on already stretched teams. Many acute care operations rely on fragmented systems and manual workarounds that limit real-time visibility and proactive decision-making. As a result, leaders are often responding to issues after they surface rather than managing flow and capacity ahead of disruption.",
            intervene: "In Acute Care environments and operations, AI becomes relevant when volatility overwhelms manual coordination. Demand, staffing, bed availability, and downstream constraints shift continuously, while operational decisions must be made quickly across multiple teams and systems. **In this environment, the value of AI is not clinical judgment; it is improved operational visibility, forecasting, and coordination.** Leaders are already adopting predictive and decision-support tools for staffing alignment, surge anticipation, bed management, and throughput monitoring. Many organizations are also investing in operational command centers and integrating data across scheduling, capacity, and hospital logistics systems to improve real-time awareness. These efforts reflect a practical understanding that the acute care constraint is often operational bandwidth and coordination, not the absence of data.\n\nWhere AI goes wrong in acute settings is when tools overpromise autonomy or assume clean, complete inputs. Models that do not account for real-world constraints, such as staffing variability, local policies, incomplete documentation, or downstream bottlenecks, produce recommendations that are technically correct but operationally unusable. AI also fails when it is introduced as an additional interface rather than being embedded into the operational workflows and decision structures leaders already rely on. The work still required involves integrating AI into operational decision-making in ways that respect accountability and local context: **clearer escalation logic, better handling of exceptions, and stronger linkage between prediction and action.** Success depends on systems that support coordination without increasing cognitive load, and on operational approaches that treat AI as a bounded tool for resilience rather than a replacement for human command.",
            approach: "In acute care, effective approaches focus less on optimization in isolation and more on **resilience under pressure, and human augmentation.** Leaders increasingly recognize that operational stability depends on coordination across teams, shared situational awareness, and decision support that respects the realities of staffing, infrastructure, and local regulatory needs. At this time, it is essential that we do not prioritize systems that replace human judgment.\n\nIn 2026, AI is being positioned to surface signals, anticipate strain, and support proactive coordination across teams. The emphasis is on embedding intelligence into existing command structures and workflows, where accountability is clear and decisions remain human-led. The most durable approaches prioritize adaptability over precision, recognizing that acute environments demand systems that respond gracefully to uncertainty."
        }
    },
    {
        id: 'continuity',
        title: "Continuity & Specialty Care",
        shortDesc: "Supporting stable operations across long-term care.",
        subtitle: "Supporting stable, compliant operations across long-term and specialized care environments",
        icon: Clock,
        visualMode: 'flow',
        color: '#8b5cf6', // Violet
        content: {
            problem: "Long-term and specialty care environments face a different class of operational risk. One driven by continuity over time rather than urgency in the moment. These settings depend on stable staffing, consistent documentation, and reliable handoffs across extended care journeys. High turnover, fragmented workflows, and uneven technology adoption create gaps in operational memory.\n\n**Critical context about residents, patients, routines, and risk factors is often held informally by individuals rather than embedded in systems.** When staff changes occur, that context is frequently lost. Over time, these gaps accumulate into compliance exposure, operational drift, and inconsistent care practices. Leaders must balance regulatory obligations with workforce realities, often without the tools needed to preserve continuity and accountability across care environments.",
            intervene: "In continuity and specialty care, we know that knowledge can become trapped across roles, shifts, and settings. Outcomes can become shaped by consistency, documentation discipline, and continuity of operational knowledge. In these contexts, AI has practical relevance where it supports coordination, reduces administrative burden, and **preserves continuity across time**, especially in environments where turnover and staffing instability disrupt operational memory. Leaders in long-term care, assisted living, hospice, and specialty outpatient practices are already adopting workflow digitization, documentation tools, and care coordination systems to reduce reliance on informal processes. Some organizations are also piloting AI-enabled support for scheduling, documentation assistance, and continuity checks across care plans and operational routines, particularly where staffing gaps make consistency difficult to maintain.\n\nWhere AI goes wrong here is when it is treated as a generic “assistant” without understanding the constraints of care environments. Systems often fail to reflect local policy, role-based responsibility, and the realities of how care and operations intersect in residential or specialty settings. AI also fails when it increases documentation burden, forcing staff to work around the tool rather than being supported by it, and when it obscures accountability through recommendations that are difficult to audit or explain. The work still needed is building systems that align with the lived structure of these environments: role-specific workflows, consistent handoff support, and bounded automation that reduces administrative load without compromising compliance. Progress depends on practical integration into daily operations and on approaches that preserve continuity even when staffing and resources are unstable.",
            approach: "In long-term and specialty care settings, the dominant shift is toward preserving continuity in environments shaped by turnover, time, and cumulative risk. We know that these concerns are not abstract challenges or transformation slogans. They are daily operational realities. Effective approaches center on stabilizing operations through consistent processes, role-aligned workflows, and systems that reduce reliance on informal knowledge that disappears the moment staffing changes. Rather than introducing complex automation or chasing novelty, practitioners focus on lowering administrative friction, reinforcing documentation discipline, and supporting handoffs that persist across staffing transitions.\n\n**AI is applied selectively, where it can quietly reinforce consistency and reduce cognitive load, not where it creates new dependencies or obscures responsibility.** The guiding principle is durability: systems that continue to function safely even as people, schedules, and conditions change, because in these environments, fragility is not theoretical, it is costly."
        }
    },
    {
        id: 'context',
        title: "Operational Context Intelligence",
        shortDesc: "Preserving situational awareness and institutional memory.",
        subtitle: "Preserving situational awareness and operational knowledge across care environments",
        icon: Brain,
        visualMode: 'network',
        color: '#f59e0b', // Amber
        content: {
            problem: "Healthcare operations generate essential context that rarely fits into structured systems. Decisions made during shift changes, responses to exceptions, and the reasoning behind operational adjustments are often undocumented or scattered across informal channels. **When this contextual knowledge is lost, organizations repeat the same issues, struggle to explain operational outcomes, and rely heavily on institutional memory held by a shrinking number of experienced staff.** This creates fragility, particularly in environments with high turnover or distributed teams. Without a way to capture and structure operational context, healthcare organizations face growing blind spots. These blind spots increase risk, reduce consistency, and limit the ability to learn from operational experience, despite having extensive data elsewhere in the organization.",
            intervene: "In 2026, Healthcare organizations are increasingly constrained not by the absence of data, but by the absence of interpretable situational and contextual understanding. Much of what shapes operational outcomes, why decisions were made, what conditions were present, what exceptions occurred, lives outside structured systems. In this gap, AI can support the capture and structuring of non-clinical operational context in ways that improve continuity, accountability, and institutional learning, particularly across shift-based environments. Leaders are already seeking lightweight approaches to reduce documentation friction and preserve continuity across teams, including better handoff tools, incident reporting modernization, and controlled forms of context-aware automation. Some organizations are experimenting with ambient and context-aware techniques to reduce manual capture work, but adoption remains cautious due to privacy, governance, and trust considerations.\n\nWhere AI goes wrong in this domain is by behaving like an unbounded recorder or narrator. Capturing more than is necessary, lacking clear consent and governance boundaries, or generating summaries that cannot be audited. AI also fails when it attempts to infer intent or clinical meaning from operational context, which introduces both accuracy risk and regulatory discomfort. The primary problem is not capability; it is uncontrolled scope. The work still required is **governance-first system design**: explicit boundaries on what is captured, strong consent and privacy controls, and reliable methods for linking context to operational events without interfering with care delivery. Successful systems in this domain treat context as an operational asset, structured carefully, governed tightly, and used to support continuity rather than surveillance.",
            approach: "Across healthcare operations, there is growing recognition that context, not just data, shapes outcomes. The emerging approach treats operational context as an asset that must be captured deliberately, governed carefully, and used responsibly. Rather than recording everything, this work prioritizes relevance, consent, and interpretability. This perspective represents a shift away from data accumulation toward contextual understanding. Instead of asking how much information can be collected, the focus is on **which operational signals actually matter, when they matter, and to whom they are accountable.** Context is treated as situational, time-bound, and role-specific, something to be structured and preserved, not abstracted away or generalized. AI is applied to structured context where it adds value, supporting handoffs, explaining decisions, and preserving institutional understanding, while maintaining strict boundaries around privacy and scope. These systems are designed to reinforce operational memory and continuity, not to observe or judge behavior. The focus is on helping organizations remember what happened and why, without turning care environments into monitored spaces or reducing complex human work to unexamined data exhaust."
        }
    }
];

// ... (ECOSYSTEM, STATCARD, PILLAR CANVAS, DOMAIN CARD - SAME AS BEFORE)
const ECOSYSTEM = [
    "Epic Systems", "Oracle Health", "MEDITECH", "Allscripts Veradigm", 
    "Athenahealth", "eClinicalWorks", "InterSystems HealthShare", 
    "Palantir", "TeleTracking", "Arbutus Software", "R1 RCM", 
    "Change Healthcare (Optum)", "Microsoft Azure", "Amazon Web Services", 
    "Google Cloud", "Salesforce"
];

// Enhanced StatCard with animations and color themes
const StatCard: React.FC<{ stat: typeof STATS[0], index: number }> = ({ stat, index }) => {
    const cardRef = useRef<HTMLAnchorElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <a 
            ref={cardRef}
            href={stat.url}
            target="_blank"
            rel="noopener noreferrer"
            onMouseMove={handleMouseMove}
            className="group relative p-8 bg-[#0c0c0e] border border-white/5 rounded-2xl transition-all duration-500 overflow-hidden hover:-translate-y-1 block cursor-pointer"
            style={{ '--card-color': stat.color } as React.CSSProperties}
        >
            <div className="absolute inset-0 border border-transparent group-hover:border-[var(--card-color)] opacity-0 group-hover:opacity-50 rounded-2xl transition-all duration-500 pointer-events-none" />
            
            {/* Interactive Spotlight */}
            <div 
                className="pointer-events-none absolute -inset-px transition duration-300 opacity-0 group-hover:opacity-100"
                style={{ 
                    background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, ${stat.color}15, transparent 40%)` 
                }}
            />

            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none" 
                 style={{ 
                     backgroundImage: `linear-gradient(${stat.color} 1px, transparent 1px), linear-gradient(90deg, ${stat.color} 1px, transparent 1px)`, 
                     backgroundSize: '30px 30px' 
                 }} 
            />
            
            {/* Watermark Icon */}
            <div className="absolute -right-8 -bottom-8 text-white/5 group-hover:text-[var(--card-color)] group-hover:opacity-10 transition-all duration-700 pointer-events-none transform group-hover:scale-110 group-hover:rotate-12">
                {React.createElement(stat.icon, { size: 140, strokeWidth: 0.5 })}
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white transition-colors border border-white/5 group-hover:bg-[var(--card-color)] group-hover:border-transparent shadow-lg">
                            {React.createElement(stat.icon, { size: 24 })}
                        </div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 group-hover:text-[var(--card-color)] transition-colors border border-white/10 px-2 py-1 rounded bg-[#0a0a0c]">
                            {stat.source}
                        </span>
                    </div>
                    
                    <div className="text-4xl md:text-5xl font-mono font-bold text-white mb-2 tracking-tight group-hover:scale-105 transition-transform origin-left">
                        {stat.value}
                    </div>
                    <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-4 group-hover:text-white transition-colors">{stat.label}</h4>
                </div>

                <p className="text-sm text-white/60 leading-relaxed border-t border-white/5 pt-4 group-hover:border-white/10 transition-colors">
                    {stat.desc}
                </p>
            </div>
        </a>
    );
};

const PillarCanvas: React.FC<{ mode: string, color: string }> = ({ mode, color }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (canvasRef.current) {
                const rect = canvasRef.current.getBoundingClientRect();
                mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
            }
        };
        // Attach global listener to track mouse even if not over canvas for ambient effects
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let w = canvas.width;
        let h = canvas.height;
        let time = 0;
        let animationFrameId: number;

        // --- SHIELD (Hex Grid) ---
        const drawShield = () => {
            const hexSize = 60;
            const rows = Math.ceil(h / (hexSize * 1.5)) + 2;
            const cols = Math.ceil(w / (hexSize * Math.sqrt(3))) + 2;
            
            for(let r=0; r<rows; r++) {
                for(let c=0; c<cols; c++) {
                    const xOffset = (r % 2) * (hexSize * Math.sqrt(3) / 2);
                    const x = c * hexSize * Math.sqrt(3) + xOffset - 50;
                    const y = r * hexSize * 1.5 - 50;
                    
                    const dx = x - mouseRef.current.x;
                    const dy = y - mouseRef.current.y;
                    const mouseDist = Math.sqrt(dx*dx + dy*dy);
                    const interaction = Math.max(0, 1 - mouseDist / 400);

                    const cx = w/2; const cy = h/2;
                    const dist = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
                    const wave = Math.sin(dist * 0.005 - time * 1.5) * 0.5 + 0.5;
                    
                    if (wave > 0.85 || Math.random() > 0.998 || interaction > 0.1) {
                        ctx.strokeStyle = color;
                        ctx.globalAlpha = (wave - 0.85) * 3 * 0.4 + (interaction * 0.4);
                        ctx.lineWidth = 1 + interaction;
                        
                        if (interaction > 0.1) {
                            ctx.shadowBlur = 20 * interaction;
                            ctx.shadowColor = color;
                        } else {
                            ctx.shadowBlur = 0;
                        }

                        ctx.beginPath();
                        for (let i = 0; i < 6; i++) {
                            const angle = Math.PI / 3 * i + Math.PI / 6;
                            const hx = x + Math.cos(angle) * (hexSize * (1 - interaction * 0.2));
                            const hy = y + Math.sin(angle) * (hexSize * (1 - interaction * 0.2));
                            if (i === 0) ctx.moveTo(hx, hy); else ctx.lineTo(hx, hy);
                        }
                        ctx.closePath();
                        ctx.stroke();
                        
                        if (interaction > 0.5) {
                            ctx.fillStyle = color;
                            ctx.globalAlpha = interaction * 0.1;
                            ctx.fill();
                        }
                        ctx.shadowBlur = 0;
                    }
                }
            }
        };

        const drawPulse = () => {
            const count = 40;
            for(let i=0; i<count; i++) {
                let x = (i * w/count + time * 150) % (w + 400) - 200;
                
                const dy = (h/2) - mouseRef.current.y;
                const distY = Math.abs((h/2) - mouseRef.current.y);
                const repel = Math.max(0, 1 - distY / 300) * 100 * (dy > 0 ? 1 : -1);

                const amplitude = h * 0.15;
                const y = h/2 + Math.sin(x * 0.01 + time * 3) * amplitude * Math.sin(time + i) - repel;
                
                const speed = (i % 5) + 1;
                const len = 100 * speed;
                
                ctx.strokeStyle = color;
                ctx.globalAlpha = 0.05 + (Math.sin(x/w * Math.PI) * 0.2);
                ctx.lineWidth = 2 + (Math.sin(time * 5 + i) + 1);
                
                if (i % 5 === 0) {
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = color;
                } else {
                    ctx.shadowBlur = 0;
                }

                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x - len, y);
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
        };

        const drawFlow = () => {
            const layers = 10;
            for(let i=0; i<layers; i++) {
                const gradient = ctx.createLinearGradient(0, 0, w, 0);
                gradient.addColorStop(0, 'transparent');
                gradient.addColorStop(0.5, color);
                gradient.addColorStop(1, 'transparent');
                ctx.strokeStyle = gradient;

                ctx.beginPath();
                for(let x=0; x<=w; x+=20) {
                    const dx = x - mouseRef.current.x;
                    const dist = Math.sqrt(dx*dx);
                    const pull = Math.max(0, 1 - dist / 500) * (mouseRef.current.y - h/2) * 0.5;

                    const y = h/2 + 
                        Math.sin(x * 0.003 + time * 0.5 + i) * 100 + 
                        Math.sin(x * 0.01 - time * 0.2) * 50 +
                        (i - layers/2) * 60 + pull;
                        
                    if (x===0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                }
                
                ctx.globalAlpha = 0.15;
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }
        };

        const drawNetwork = () => {
            const count = 70;
            const nodes = [];
            for(let i=0; i<count; i++) {
                const angle = i * 137.5;
                const r = 20 * Math.sqrt(i) + Math.sin(time * 0.5 + i)*50;
                let x = w/2 + Math.cos(angle + time*0.05) * r * 4;
                let y = h/2 + Math.sin(angle + time*0.05) * r * 3;
                
                const dx = x - mouseRef.current.x;
                const dy = y - mouseRef.current.y;
                const d = Math.sqrt(dx*dx + dy*dy);
                if (d < 200) {
                    const push = (200 - d) * 0.1;
                    x += (dx/d) * push;
                    y += (dy/d) * push;
                }

                nodes.push({x, y});
            }
            
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            
            for(let i=0; i<count; i++) {
                for(let j=i+1; j<count; j++) {
                    const d = Math.sqrt(Math.pow(nodes[i].x - nodes[j].x, 2) + Math.pow(nodes[i].y - nodes[j].y, 2));
                    if (d < 150) {
                        ctx.globalAlpha = (1 - d/150) * 0.3; 
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
                ctx.fillStyle = color;
                ctx.globalAlpha = 0.6;
                ctx.beginPath(); ctx.arc(nodes[i].x, nodes[i].y, 2, 0, Math.PI*2); ctx.fill();
            }
        };

        const render = () => {
            time += 0.01;
            ctx.clearRect(0, 0, w, h);
            ctx.globalCompositeOperation = 'lighter'; 
            
            if (mode === 'shield') drawShield();
            else if (mode === 'pulse') drawPulse();
            else if (mode === 'flow') drawFlow();
            else if (mode === 'network') drawNetwork();

            ctx.globalCompositeOperation = 'source-over';
            animationFrameId = requestAnimationFrame(render);
        };
        
        const handleResize = () => {
            if (canvas.parentElement) {
                w = canvas.width = canvas.parentElement.clientWidth;
                h = canvas.height = canvas.parentElement.clientHeight;
            } else {
                w = canvas.width = window.innerWidth;
                h = canvas.height = window.innerHeight;
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize(); // Init size
        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [mode, color]);

    return <canvas ref={canvasRef} className="w-full h-full block opacity-80" />;
};

const DomainCard: React.FC<{ pillar: any, onClick: () => void }> = ({ pillar, onClick }) => {
    return (
        <div 
            onClick={onClick}
            className="group relative h-[450px] bg-[#0c0c0e] border border-white/10 rounded-3xl overflow-hidden cursor-pointer hover:border-white/30 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col"
        >
            {/* Visualizer Background */}
            <div className="absolute inset-0 opacity-40 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-screen">
                <PillarCanvas mode={pillar.visualMode} color={pillar.color} />
            </div>

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-transparent opacity-80" />

            {/* Content */}
            <div className="relative z-10 p-8 flex flex-col h-full pointer-events-none">
                <div className="w-12 h-12 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center text-white/50 group-hover:text-white group-hover:scale-110 transition-all backdrop-blur-md mb-auto group-hover:bg-white/10 group-hover:border-white/20">
                    {React.createElement(pillar.icon, { size: 20 })}
                </div>

                <div className="bg-[#0c0c0e]/80 backdrop-blur-xl p-6 -mx-8 -mb-8 border-t border-white/10 group-hover:border-white/20 transition-colors">
                    <h3 className="text-lg font-serif text-white mb-2 group-hover:text-amber-400 transition-colors">{pillar.title}</h3>
                    <p className="text-xs text-white/50 leading-relaxed mb-4 line-clamp-3">{pillar.shortDesc}</p>
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-white/30 group-hover:text-white transition-colors">
                        <span>Initialize Protocol</span>
                        <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export const HealthcarePage: React.FC = () => {
    const [expandedPillarId, setExpandedPillarId] = useState<string | null>(null);
    const activePillar = PILLARS.find(p => p.id === expandedPillarId);

    // Scroll Progress Hook logic
    const modalRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [showBackToTop, setShowBackToTop] = useState(false);

    const handleScroll = () => {
        if (!modalRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = modalRef.current;
        const progress = scrollTop / (scrollHeight - clientHeight);
        setScrollProgress(progress);
        setShowBackToTop(scrollTop > 500);
    };

    const scrollToTop = () => {
        if (modalRef.current) {
            modalRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleExpand = (id: string) => {
        setExpandedPillarId(id);
        window.scrollTo(0, 0); 
    };

    const handleClose = () => {
        setExpandedPillarId(null);
        setTimeout(() => {
            const el = document.getElementById('strategic-domains');
            if (el) {
                el.scrollIntoView({ behavior: 'instant', block: 'start' }); 
            }
        }, 10);
    };

    return (
        <div className="relative min-h-screen bg-[#020202] text-white pt-24 font-sans overflow-x-hidden selection:bg-teal-500/30 selection:text-teal-400">
            <style>
                {`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 40s linear infinite;
                }
                `}
            </style>
            
            {/* --- MAIN PAGE CONTENT (Hidden when expanded) --- */}
            {!expandedPillarId && (
                <>
                    {/* --- HERO --- */}
                    <div className="relative h-[85vh] min-h-[600px] flex flex-col justify-center border-b border-white/10 bg-[#020202] overflow-hidden animate-in fade-in duration-500">
                        <div className="absolute inset-0 z-0 opacity-100">
                            <HealthcareHeroVisualizer />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#020202] via-[#020202]/90 to-transparent z-10" />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#020202] via-transparent to-[#020202] z-10" />
                        
                        <div className="relative z-20 max-w-[1800px] mx-auto px-6 md:px-12 w-full">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-bold uppercase tracking-widest mb-8 animate-in slide-in-from-left duration-700 backdrop-blur-md">
                                <Activity size={14} />
                                <span>Healthcare Strategy</span>
                            </div>
                            <h1 className="text-6xl md:text-8xl font-serif text-white mb-8 max-w-5xl leading-[0.9] tracking-tight">
                                AI Strategy & <br/>
                                <span className="text-teal-400 italic">Operational Transformation.</span>
                            </h1>
                            <p className="text-xl text-white/60 max-w-2xl leading-relaxed mb-12 font-light">
                                Reducing operational risk, bottlenecks, and compliance overhead in regulated care environments.
                            </p>
                            <div className="flex gap-4">
                                <button onClick={() => document.getElementById('strategic-domains')?.scrollIntoView({behavior: 'smooth'})} className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-black font-bold uppercase tracking-widest text-xs rounded transition-all shadow-[0_0_30px_rgba(20,184,166,0.3)] hover:shadow-[0_0_50px_rgba(20,184,166,0.5)]">
                                    Read Strategy
                                </button>
                            </div>
                        </div>
                        
                        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/20 animate-bounce z-20">
                            <ChevronDown size={24} />
                        </div>
                    </div>

                    {/* --- SECTOR CONTEXT --- */}
                    <ViewportSlot minHeight="600px">
                        <section className="py-32 bg-[#050505] border-b border-white/5 relative overflow-hidden animate-in fade-in duration-700">
                            <div className="absolute top-0 right-0 p-64 bg-teal-500/5 blur-[120px] rounded-full pointer-events-none" />
                            
                            <div className="max-w-[1800px] mx-auto px-6 md:px-12 text-center relative z-10">
                                <h2 className="text-3xl md:text-4xl font-serif text-white mb-12">The Operational Reality</h2>
                                <p className="text-lg md:text-xl text-white/60 leading-relaxed text-justify font-light max-w-4xl mx-auto">
                                    Healthcare organizations are operating in an environment of rising scrutiny, constrained labor, and increasing operational complexity. Driven by regulatory complexity, workforce shortages, and fragmented care environments. Care delivery now spans acute, long-term, and specialized settings, where small operational failures can cascade into patient harm, compliance exposure, and financial risk. As systems grow more interconnected, leaders are under pressure to improve visibility, coordination, and continuity without disrupting care or violating regulatory boundaries. Moving forward requires rethinking how operational decisions, documentation, and accountability are supported across the healthcare ecosystem.
                                </p>
                            </div>
                        </section>
                    </ViewportSlot>

                    {/* --- STATS GRID --- */}
                    <section className="py-24 bg-[#08080a] border-b border-white/5 animate-in fade-in duration-700">
                        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {STATS.map((stat, i) => (
                                    <StatCard key={i} stat={stat} index={i} />
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* --- PILLAR GRID (Selection View) --- */}
                    <ViewportSlot minHeight="800px" id="strategic-domains">
                        <section className="py-24 bg-[#020202] animate-in fade-in zoom-in-95 duration-700 scroll-mt-24">
                            <div className="max-w-[1800px] mx-auto px-6 md:px-12">
                                <div className="text-center mb-20">
                                    <h2 className="text-4xl font-serif text-white mb-6">Strategic Domains</h2>
                                    <p className="text-white/50 max-w-2xl mx-auto">Select a core operational pillar to explore our specific interventions and technical approach.</p>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {PILLARS.map((pillar) => (
                                        <DomainCard 
                                            key={pillar.id} 
                                            pillar={pillar} 
                                            onClick={() => handleExpand(pillar.id)} 
                                        />
                                    ))}
                                </div>
                            </div>
                        </section>
                    </ViewportSlot>

                    {/* --- ECOSYSTEM FOOTER --- */}
                    <section className="py-32 border-t border-white/5 bg-[#050505]">
                        <div className="max-w-[1800px] mx-auto px-6 md:px-12 text-center">
                            <p className="text-xs font-mono uppercase tracking-widest text-white/30 mb-12">Integrated Ecosystem</p>
                            
                            <div className="relative w-full overflow-hidden mb-16">
                                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10" />
                                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10" />
                                
                                <div className="flex w-max animate-marquee">
                                    {[...ECOSYSTEM, ...ECOSYSTEM].map((tech, i) => (
                                        <div key={i} className="mx-8 text-white/40 font-serif text-2xl hover:text-teal-400 transition-colors cursor-default whitespace-nowrap">
                                            {tech}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* --- NEW CROSS-NAVIGATION FOOTER --- */}
                    <IndustryNavigationFooter currentId="healthcare" />
                </>
            )}

            {/* --- EXCLUSIVE SUB-PAGE VIEW (Full Screen - Hard Redesign) --- */}
            {activePillar && (
                <div 
                    ref={modalRef} 
                    onScroll={handleScroll}
                    className="fixed inset-0 z-[100] bg-[#020202] overflow-y-auto animate-in fade-in duration-500 custom-scrollbar"
                >
                    {/* Progress Bar */}
                    <div className="fixed top-0 left-0 h-1 bg-teal-400 z-[120] transition-all duration-100 ease-out" style={{ width: `${scrollProgress * 100}%` }} />

                    {/* Content Body */}
                    <div className="relative min-h-screen flex flex-col">
                        
                        {/* HEADER BAR */}
                        <div className="fixed top-0 left-0 right-0 h-28 bg-[#0a0a0c]/95 backdrop-blur-xl border-b border-white/10 z-[110] flex items-center px-8 md:px-16 justify-between">
                            <div className="flex items-center gap-6">
                                <button 
                                    onClick={handleClose}
                                    className="p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all text-white/50 hover:text-white"
                                >
                                    <X size={20} />
                                </button>
                                <div className="h-8 w-px bg-white/10" />
                                <div>
                                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: activePillar.color }}>
                                        {React.createElement(activePillar.icon, { size: 14 })}
                                        <span>Active Module</span>
                                    </div>
                                    <h2 className="text-xl font-serif text-white tracking-wide">{activePillar.title}</h2>
                                </div>
                            </div>
                            
                            <div className="hidden md:flex items-center gap-4 text-[10px] font-mono text-white/30 uppercase tracking-widest">
                                <span>Status: Live</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            </div>
                        </div>

                        {/* VISUAL BACKGROUND LAYER (Fixed) */}
                        <div className="fixed inset-0 z-0 top-28">
                            <div className="absolute inset-0 bg-[#020202]" /> 
                            <PillarCanvas mode={activePillar.visualMode} color={activePillar.color} />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-[#020202]/50" />
                        </div>

                        {/* NEW EDITORIAL LAYOUT */}
                        <div className="relative z-10 pt-32 pb-32 w-full flex justify-center">
                            <div className="max-w-[1600px] w-full px-6 md:px-20">
                                
                                {/* Article Header */}
                                <div className="mb-24 text-center">
                                    <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-500 text-[10px] font-bold uppercase tracking-widest">
                                        <Activity size={12} />
                                        <span>Strategic Domain</span>
                                    </div>
                                    <h1 className="text-5xl md:text-8xl font-serif text-white mb-8 leading-[1.1] tracking-tight">
                                        {activePillar.title}
                                    </h1>
                                    <p className="text-xl md:text-3xl text-white/60 leading-relaxed font-light max-w-4xl mx-auto">
                                        {activePillar.shortDesc}
                                    </p>
                                </div>

                                {/* Main Content Column */}
                                <div className="max-w-4xl mx-auto space-y-32">
                                    
                                    {/* SECTION 1: PROBLEM */}
                                    <section>
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-12 h-px bg-red-500/50" />
                                            <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest">The Friction</h3>
                                        </div>
                                        <FormattedContent text={activePillar.content.problem} />
                                    </section>
                                    
                                    {/* VISUAL BREAK 1: WIDE */}
                                    <ImagePlaceholder 
                                        type="wide" 
                                        label="Workflow Analysis" 
                                        src="https://jar5gzlwdkvsnpqa.public.blob.vercel-storage.com/info_site_brushed_steel_diffused_cyan_tinted_lighting_rectilinear_geometry_sterile_industrial_vibe.jpg" 
                                    />

                                    {/* SECTION 2: INTERVENTION */}
                                    <section>
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-12 h-px bg-amber-400/50" />
                                            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest">Intervention Point</h3>
                                        </div>
                                        <FormattedContent text={activePillar.content.intervene} />
                                    </section>

                                    {/* VISUAL BREAK 2: PORTRAIT GRID */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
                                        <ImagePlaceholder 
                                            type="portrait" 
                                            label="Compliance Log" 
                                            src="https://jar5gzlwdkvsnpqa.public.blob.vercel-storage.com/info_site_digital_phosphor_cyan_glow_orthogonal_grid_cybernetic_void_luminescent_pixels.jpg"
                                        />
                                        <ImagePlaceholder 
                                            type="portrait" 
                                            label="Patient Flow" 
                                            src="https://jar5gzlwdkvsnpqa.public.blob.vercel-storage.com/info_site_cybernetic_noir_data_constellation_chromatic_aberration_linear_trajectories_diffuse_glow_numeric_overlays.jpg"
                                        />
                                    </div>

                                    {/* SECTION 3: APPROACH */}
                                    <section>
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-12 h-px bg-teal-400/50" />
                                            <h3 className="text-xs font-bold text-teal-400 uppercase tracking-widest">Operational Approach</h3>
                                        </div>
                                        <FormattedContent text={activePillar.content.approach} />
                                    </section>

                                    {/* FINAL VISUAL */}
                                    <ImagePlaceholder 
                                        type="square" 
                                        label="Command Center" 
                                        src="https://jar5gzlwdkvsnpqa.public.blob.vercel-storage.com/info_site_matte_ceramic_polished_marble_warm_diffused_glow_low_profile_minimalism_serene_domesticity.jpg"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Back To Top FAB */}
                        <button 
                            onClick={scrollToTop}
                            className={`fixed bottom-8 right-8 z-[120] p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full text-white transition-all duration-500 transform ${showBackToTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
                        >
                            <ChevronUp size={24} />
                        </button>
                        
                        {/* FOOTER NAV (Fixed Bottom) */}
                        <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#020202] to-transparent z-[110] flex items-center justify-center pointer-events-none">
                            <div className="pointer-events-auto">
                                <button onClick={handleClose} className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-all backdrop-blur-md">
                                    Close Module
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};
