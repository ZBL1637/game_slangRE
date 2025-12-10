import React from 'react';

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="w-full h-screen bg-stone-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Grid Animation */}
      <div className="absolute inset-0 opacity-10" 
           style={{ 
             backgroundImage: 'linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)',
             backgroundSize: '40px 40px' 
           }}>
      </div>

      <div className="z-10 text-center space-y-12">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl text-emerald-500 font-bold tracking-widest animate-pulse drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
            游戏黑话
          </h1>
          <h2 className="text-2xl md:text-4xl text-emerald-700 tracking-wider uppercase">
            JRPG Data Adventure
          </h2>
        </div>

        <div className="mt-12">
          <button 
            onClick={onStart}
            className="group relative px-8 py-4 bg-transparent overflow-hidden rounded-md transition-all hover:scale-105 focus:outline-none"
          >
            <div className="absolute inset-0 w-full h-full bg-stone-800 border-4 border-stone-500 group-hover:border-emerald-500 transition-colors duration-300"></div>
            <span className="relative text-2xl font-bold text-stone-300 group-hover:text-emerald-400 tracking-widest flex items-center gap-2">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">▶</span>
              START GAME
            </span>
          </button>
        </div>

        <div className="text-stone-600 text-sm mt-8">
          © 2023 Data Journalism RPG Project
        </div>
      </div>
    </div>
  );
};