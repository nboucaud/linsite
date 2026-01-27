
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useAudio } from '../context/AudioContext';
import { TRACKS } from '../lib/data';
import { generateCharacterResponse, CharacterPersona } from '../lib/gemini';
import { Send, X, Loader2, RefreshCw } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'model';
  character?: CharacterPersona; // Track who said it
  content: string;
}

interface CuratorChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CuratorChat: React.FC<CuratorChatProps> = ({ isOpen, onClose }) => {
  const { currentTrackId, isPlaying } = useAudio();
  const [activeCharacter, setActiveCharacter] = useState<CharacterPersona>('carey');
  
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'init', 
      role: 'model', 
      character: 'carey',
      content: "welcome to the garden. i'm still planting seeds here. what do you need?" 
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeTrack = useMemo(() => 
    TRACKS.find(t => t.id === currentTrackId) || TRACKS[0], 
  [currentTrackId]);

  const CAREY_IMG = "https://yfvjva8h23yczien.public.blob.vercel-storage.com/Posters/13.webp";
  const VICTOR_IMG = "https://yfvjva8h23yczien.public.blob.vercel-storage.com/Posters/1.webp";

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const apiHistory = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
      
      const responseText = await generateCharacterResponse(
          apiHistory, 
          activeCharacter,
          activeTrack.title
      );
      
      const modelMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        character: activeCharacter,
        content: responseText || "..." 
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = activeCharacter === 'carey' ? [
      { label: "The Meaning?", text: "What is the heart of this song?" },
      { label: "The Memory?", text: "Where were you when you wrote this?" },
      { label: "How do you feel?", text: "Are you okay right now?" }
  ] : [
      { label: "The Cost?", text: "What did this track cost us?" },
      { label: "The Strategy?", text: "Why did we release this?" },
      { label: "Status Report", text: "Give me a status update." }
  ];

  const themeColor = activeCharacter === 'carey' ? 'text-sage-green' : 'text-muted-purple';
  const borderColor = activeCharacter === 'carey' ? 'border-sage-green' : 'border-muted-purple';
  const bgGlow = activeCharacter === 'carey' ? 'bg-sage-green/10' : 'bg-muted-purple/10';

  if (!isOpen) return null;

  return (
    <div className={`fixed bottom-0 md:bottom-24 right-0 md:right-12 w-full md:w-[400px] h-[80vh] md:h-[650px] bg-[#0a0a0c]/95 backdrop-blur-3xl border border-white/10 md:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] flex flex-col z-[130] animate-in slide-in-from-bottom-10 fade-in duration-300 overflow-hidden ring-1 ${borderColor} ring-opacity-20`}>
      
      {/* HEADER: DUAL PERSONA SWITCH */}
      <div className="p-1 pb-0 bg-black/40">
        <div className="flex h-24 relative">
            
            {/* CAREY BUTTON */}
            <button 
                onClick={() => setActiveCharacter('carey')}
                className={`flex-1 relative group overflow-hidden transition-all duration-500 ${activeCharacter === 'carey' ? 'opacity-100' : 'opacity-40 grayscale hover:opacity-70'}`}
            >
                <img src={CAREY_IMG} className="absolute inset-0 w-full h-full object-cover object-top" alt="Carey" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-3 left-0 w-full text-center">
                    <div className="font-serif font-bold text-sage-green text-lg leading-none">Carey</div>
                    <div className="text-[9px] uppercase tracking-widest text-white/60">Architect</div>
                </div>
                {activeCharacter === 'carey' && (
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-sage-green shadow-[0_0_15px_#739472]" />
                )}
            </button>

            {/* SEPARATOR */}
            <div className="w-px bg-white/10 z-10" />

            {/* VICTOR BUTTON */}
            <button 
                onClick={() => setActiveCharacter('victor')}
                className={`flex-1 relative group overflow-hidden transition-all duration-500 ${activeCharacter === 'victor' ? 'opacity-100' : 'opacity-40 grayscale hover:opacity-70'}`}
            >
                <img src={VICTOR_IMG} className="absolute inset-0 w-full h-full object-cover object-top" alt="Victor" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-3 left-0 w-full text-center">
                    <div className="font-serif font-bold text-muted-purple text-lg leading-none">Victor</div>
                    <div className="text-[9px] uppercase tracking-widest text-white/60">Executive</div>
                </div>
                {activeCharacter === 'victor' && (
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-muted-purple shadow-[0_0_15px_#80729C]" />
                )}
            </button>
            
            {/* CLOSE */}
            <button 
                onClick={onClose} 
                className="absolute top-2 right-2 z-20 p-2 bg-black/50 hover:bg-white rounded-full text-white/50 hover:text-black transition-colors"
            >
                <X size={14} />
            </button>
        </div>
      </div>

      {/* TRACK CONTEXT */}
      <div className="px-4 py-2 bg-white/5 border-y border-white/5 flex justify-between items-center">
         <div className="flex items-center gap-2 overflow-hidden">
             {isPlaying ? <RefreshCw size={10} className="animate-spin text-green-400"/> : <div className="w-2 h-2 rounded-full bg-white/20" />}
             <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest truncate">
                 Playing: {activeTrack.title}
             </span>
         </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            
            {/* AVATAR FOR MODEL */}
            {msg.role === 'model' && (
               <div className={`w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 border ${msg.character === 'carey' ? 'border-sage-green/50' : 'border-muted-purple/50'}`}>
                  <img src={msg.character === 'carey' ? CAREY_IMG : VICTOR_IMG} className="w-full h-full object-cover" alt="Avatar" />
               </div>
            )}

            <div className={`p-3.5 rounded-2xl max-w-[80%] text-sm leading-relaxed whitespace-pre-wrap shadow-lg ${
              msg.role === 'user' 
                ? 'bg-white/10 text-white rounded-tr-sm border border-white/5' 
                : `${msg.character === 'carey' ? 'bg-[#739472]/10 border-sage-green/20' : 'bg-[#80729C]/10 border-muted-purple/20'} border text-gray-200 rounded-tl-sm`
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3 animate-pulse">
             <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                <Loader2 size={14} className="animate-spin text-white/40" />
             </div>
             <div className="text-[10px] text-white/30 self-center font-mono uppercase tracking-widest">
                 {activeCharacter} is typing...
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* QUICK PROMPTS */}
      <div className="px-4 pb-3 flex gap-2 overflow-x-auto custom-scrollbar no-scrollbar">
          {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qp.text)}
                disabled={isLoading}
                className={`flex-shrink-0 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:${borderColor} rounded-lg text-[10px] uppercase tracking-wider text-white/60 hover:text-white transition-all disabled:opacity-50`}
              >
                  {qp.label}
              </button>
          ))}
      </div>

      {/* INPUT AREA */}
      <div className="p-4 bg-black/40 border-t border-white/5 backdrop-blur-md">
        <div className="relative flex items-center group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${activeCharacter}...`}
            className={`w-full bg-white/5 focus:bg-white/10 border border-white/5 focus:${borderColor} rounded-xl py-3.5 pl-4 pr-12 text-sm text-white focus:outline-none transition-all placeholder:text-white/20 font-sans`}
          />
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className={`absolute right-2 p-2 rounded-lg transition-all disabled:opacity-0 disabled:scale-75 ${activeCharacter === 'carey' ? 'bg-sage-green text-black hover:bg-white' : 'bg-muted-purple text-white hover:bg-white hover:text-black'}`}
          >
            <Send size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};
