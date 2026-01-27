
import React, { useState } from 'react';
import { Check, X, AlertTriangle, Terminal } from 'lucide-react';
import { PUZZLES } from '../lib/chapter-data';

interface PuzzleProps {
  puzzleId: string;
  onSolve: () => void;
}

export const PuzzleInterface: React.FC<PuzzleProps> = ({ puzzleId, onSolve }) => {
  const puzzle = PUZZLES.find(p => p.id === puzzleId);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [attempts, setAttempts] = useState(0);

  if (!puzzle) return <div>Error: Data Corruption. Puzzle Missing.</div>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.toUpperCase().trim() === puzzle.answer.toUpperCase()) {
      setStatus('success');
      setTimeout(onSolve, 1000);
    } else {
      setStatus('error');
      setAttempts(prev => prev + 1);
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  return (
    <div className="w-full max-w-md bg-black/40 border border-white/10 rounded-xl p-8 backdrop-blur-md">
      <div className="flex items-center gap-3 mb-6 text-amber-glow/80">
        <AlertTriangle size={20} />
        <span className="text-xs font-mono uppercase tracking-widest">Cognitive Checkpoint</span>
      </div>

      <h3 className="text-xl font-serif text-white mb-6 leading-relaxed">
        {puzzle.question}
      </h3>

      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
            <Terminal size={16} className="absolute left-4 text-white/30" />
            <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`w-full bg-white/5 border ${status === 'error' ? 'border-red-500 text-red-400' : status === 'success' ? 'border-green-500 text-green-400' : 'border-white/10 text-white'} rounded-lg py-3 pl-10 pr-12 focus:outline-none focus:bg-white/10 font-mono transition-all`}
            placeholder="INPUT_ANSWER..."
            autoFocus
            />
            <button 
                type="submit"
                className="absolute right-2 p-1.5 bg-white/10 hover:bg-white/20 rounded transition-colors text-white/50"
            >
                {status === 'success' ? <Check size={16} className="text-green-400" /> : status === 'error' ? <X size={16} className="text-red-400" /> : <span className="text-[10px] font-bold">RUN</span>}
            </button>
        </div>
        
        {attempts > 2 && (
             <div className="mt-4 text-xs text-white/30 font-mono animate-pulse">
                HINT_LOG: {puzzle.hint}
             </div>
        )}

        {status === 'success' && (
            <div className="absolute -bottom-8 left-0 text-xs text-green-400 font-mono tracking-widest">
                ACCESS_GRANTED.
            </div>
        )}
      </form>
    </div>
  );
};
