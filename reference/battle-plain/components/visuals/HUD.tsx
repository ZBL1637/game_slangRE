import React from 'react';
import { Shield, Zap, Sword, Skull } from 'lucide-react';

export const HUD: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8 pointer-events-none select-none">
      {/* Top Status Bars */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        {/* Player Status */}
        <div className="w-full md:w-1/3 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-green-400">
            <span>HP 100%</span>
            <span>LV.10</span>
          </div>
          <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-600 relative">
            <div className="absolute top-0 left-0 h-full w-full bg-green-600/80"></div>
          </div>
          <div className="flex items-center justify-between text-xs font-bold text-blue-400">
            <span>MP 85%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden relative">
             <div className="absolute top-0 left-0 h-full w-[85%] bg-blue-500"></div>
          </div>
        </div>

        {/* Target Status */}
        <div className="w-full md:w-1/3 space-y-2 md:text-right">
           <div className="flex items-center justify-between md:justify-end gap-2 text-xs font-bold text-red-500">
            <Skull size={14} />
            <span>BOSS: TRAINING DUMMY</span>
            <span>99.9%</span>
          </div>
          <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-red-900/50 relative">
            <div className="absolute top-0 left-0 h-full w-[99%] bg-red-600"></div>
          </div>
          <div className="flex items-center justify-between md:justify-end gap-2 text-xs font-bold text-orange-400">
            <span>THREAT</span>
          </div>
           <div className="h-2 bg-slate-800 rounded-full overflow-hidden relative flex justify-end">
             <div className="h-full w-[40%] bg-orange-500"></div>
          </div>
        </div>
      </div>

      {/* Skill Bar (Decorative) */}
      <div className="flex justify-center gap-2 mt-4">
        {['Q', 'W', 'E', 'R'].map((key, i) => (
          <div key={key} className="relative group">
            <div className="w-12 h-12 bg-slate-900 border-2 border-slate-600 rounded flex items-center justify-center text-slate-500 relative overflow-hidden">
               {i === 0 && <Sword size={20} />}
               {i === 1 && <Shield size={20} />}
               {i === 2 && <Zap size={20} />}
               {i === 3 && <span className="text-xl font-bold">!</span>}
               {/* CD Overlay simulation */}
               {i === 3 && <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-sm font-bold">5s</div>}
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-slate-800 px-1 rounded text-slate-300">
              {key}
            </div>
          </div>
        ))}
      </div>
      
      {/* AOE Warning (Decorative) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-red-500/30 rounded-full flex items-center justify-center animate-pulse opacity-50 -z-10">
        <div className="w-56 h-56 border border-red-500/50 rounded-full bg-red-500/10 flex items-center justify-center">
            <span className="text-red-400 text-xs font-bold tracking-widest animate-bounce">躲圈!</span>
        </div>
      </div>
    </div>
  );
};