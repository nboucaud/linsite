
import React, { useState } from 'react';
import { useAudio } from '../context/AudioContext';
import { TRACKS } from '../lib/data';
import { Settings, FileImage, FileVideo, FileAudio, X, CheckCircle2, Cloud, AlertTriangle, Upload } from 'lucide-react';

export const AssetManager: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { trackAssets, updateAsset } = useAudio();
  const [activeTab, setActiveTab] = useState<'media' | 'hosting'>('media');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, trackId: string) => {
      const file = e.target.files?.[0];
      if (file) {
          const objectUrl = URL.createObjectURL(file);
          updateAsset(trackId, 'audio', objectUrl);
      }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12 animate-in fade-in zoom-in duration-300">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-3xl" onClick={onClose} />
      
      <div className="relative w-full max-w-6xl glass-container rounded-[2.5rem] flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-glow/10 flex items-center justify-center text-amber-glow">
              <Settings size={20} />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-white">Asset Studio</h2>
              <p className="text-[10px] text-white/30 uppercase tracking-[0.3em]">Studio Configuration</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 rounded-full hover:bg-white/5 transition-colors text-white/40 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5">
          <button 
            onClick={() => setActiveTab('media')}
            className={`flex-1 py-4 text-xs uppercase tracking-widest font-bold transition-colors ${activeTab === 'media' ? 'bg-white/5 text-white' : 'text-white/30 hover:bg-white/[0.02]'}`}
          >
            Media Mapping
          </button>
          <button 
            onClick={() => setActiveTab('hosting')}
            className={`flex-1 py-4 text-xs uppercase tracking-widest font-bold transition-colors ${activeTab === 'hosting' ? 'bg-indigo-500/10 text-indigo-400' : 'text-white/30 hover:bg-white/[0.02]'}`}
          >
            Permanent Hosting Guide
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {activeTab === 'media' ? (
            <table className="w-full text-left border-separate border-spacing-y-4">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.2em] text-white/20">
                  <th className="px-4 py-2 font-normal w-1/4">Track Details</th>
                  <th className="px-4 py-2 font-normal">Audio Source (Local)</th>
                  <th className="px-4 py-2 font-normal">Visual Assets (URL)</th>
                </tr>
              </thead>
              <tbody>
                {TRACKS.map(track => {
                  const assets = trackAssets[track.id] || {};
                  const hasCustomAudio = !!assets.audio;

                  return (
                    <tr key={track.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-4 align-top">
                        <div className="font-serif text-lg text-white/90">{track.title}</div>
                        <div className="text-[9px] text-white/20 uppercase font-mono mt-1">{track.id}</div>
                      </td>
                      <td className="px-4 py-4 align-top">
                          <div className={`relative flex items-center gap-3 p-3 rounded-lg border transition-all ${hasCustomAudio ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/5'}`}>
                              <FileAudio size={16} className={hasCustomAudio ? "text-green-400" : "text-white/20"} />
                              <div className="flex-1 overflow-hidden">
                                  <div className={`text-xs font-mono truncate ${hasCustomAudio ? "text-green-400" : "text-white/70"}`}>
                                      {hasCustomAudio ? "Local File Loaded" : "Default Stream"}
                                  </div>
                              </div>
                              <label className="cursor-pointer p-2 bg-white/10 hover:bg-white/20 rounded-md text-white/60 hover:text-white transition-colors">
                                  <Upload size={14} />
                                  <input type="file" accept="audio/*" className="hidden" onChange={(e) => handleFileUpload(e, track.id)} />
                              </label>
                          </div>
                      </td>
                      <td className="px-4 py-4 space-y-3">
                        <div className="relative flex items-center gap-2 group/input">
                          <FileImage size={14} className="absolute left-3 text-white/20 group-focus-within/input:text-amber-glow transition-colors" />
                          <input 
                            type="text"
                            placeholder="Cover Image URL"
                            value={assets.image || ''}
                            onChange={(e) => updateAsset(track.id, 'image', e.target.value)}
                            className="w-full bg-white/5 border border-white/5 rounded-lg py-2.5 pl-10 pr-4 text-xs font-mono text-white/60 focus:outline-none focus:border-amber-glow/40 focus:bg-white/[0.08] transition-all"
                          />
                        </div>
                        <div className="relative flex items-center gap-2 group/input">
                          <FileVideo size={14} className="absolute left-3 text-white/20 group-focus-within/input:text-stage-teal transition-colors" />
                          <input 
                            type="text"
                            placeholder="Background Video URL"
                            value={assets.video || ''}
                            onChange={(e) => updateAsset(track.id, 'video', e.target.value)}
                            className="w-full bg-white/5 border border-white/5 rounded-lg py-2.5 pl-10 pr-4 text-xs font-mono text-white/60 focus:outline-none focus:border-stage-teal/40 focus:bg-white/[0.08] transition-all"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
             <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-8">
                <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-2">
                    <Cloud size={32} />
                </div>
                <h3 className="text-3xl font-serif text-white">How to Host Assets</h3>
                <div className="max-w-xl text-left space-y-6 text-white/70 bg-white/5 p-8 rounded-xl border border-white/10">
                    <div>
                        <h4 className="font-bold text-white mb-2">Option 1: Vercel / Public Folder</h4>
                        <p className="text-sm">Place your .mp3, .jpg, and .mp4 files into the <code>public/</code> folder of your project repo. Then reference them as <code>/filename.mp3</code>.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-2">Option 2: Cloud Storage (AWS S3 / Google Cloud)</h4>
                        <p className="text-sm">Upload files to a bucket with public read access. Copy the full <code>https://...</code> URL and paste it into the "Media Mapping" tab.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-2">Option 3: GitHub Raw</h4>
                        <p className="text-sm">Upload to a repo, click "Raw" on the file, and use that link (Best for small images/text, bad for streaming audio).</p>
                    </div>
                </div>
             </div>
          )}
        </div>

        <div className="p-8 bg-black/20 border-t border-white/5 flex justify-between items-center">
          <p className="text-[10px] text-white/20 font-sans italic max-w-sm">
            {activeTab === 'media' ? 'Audio overrides are session-only. Images/Videos are saved locally.' : 'Use direct links only. No Google Drive viewer links.'}
          </p>
          <button 
            onClick={onClose}
            className="flex items-center gap-2 bg-amber-glow/10 hover:bg-amber-glow/20 text-amber-glow px-6 py-2.5 rounded-full transition-all text-xs font-bold uppercase tracking-widest"
          >
            <CheckCircle2 size={14} /> Done
          </button>
        </div>
      </div>
    </div>
  );
};
