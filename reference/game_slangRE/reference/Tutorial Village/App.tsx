import React, { useState } from 'react';
import { StartScreen } from './components/StartScreen';
import { TutorialVillage } from './components/TutorialVillage';
import { ScreenType, PlayerStats } from './types';

function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('start');
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    level: 1,
    exp: 0,
    maxExp: 100,
    achievements: []
  });

  const handleStartGame = () => {
    setCurrentScreen('tutorial');
  };

  const handleCompleteTutorial = () => {
    setCurrentScreen('world_map');
  };

  const updateStats = (newStats: Partial<PlayerStats>) => {
    setPlayerStats(prev => ({ ...prev, ...newStats }));
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 font-mono antialiased selection:bg-amber-500 selection:text-black">
      {currentScreen === 'start' && (
        <StartScreen onStart={handleStartGame} />
      )}

      {currentScreen === 'tutorial' && (
        <TutorialVillage 
          playerStats={playerStats} 
          updateStats={updateStats} 
          onComplete={handleCompleteTutorial} 
        />
      )}

      {currentScreen === 'world_map' && (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-stone-800 text-center p-8 space-y-6">
          <h1 className="text-4xl text-amber-500 font-bold mb-4">世界地图 (World Map)</h1>
          <p className="text-xl text-stone-300">恭喜走出新手村！</p>
          <div className="p-6 bg-black border-4 border-stone-600 rounded max-w-md w-full">
            <div className="text-left space-y-2">
                <p>等级: <span className="text-amber-400">Lv.{playerStats.level}</span></p>
                <p>经验: <span className="text-green-400">{playerStats.exp}/{playerStats.maxExp}</span></p>
                <p>成就: {playerStats.achievements.join(', ') || '无'}</p>
            </div>
          </div>
          <p className="text-stone-500 text-sm italic mt-8">
            (这是目前的演示终点。下一步将是六大区域的探索页面。)
          </p>
          <button 
             onClick={() => setCurrentScreen('start')}
             className="mt-8 text-stone-400 hover:text-white underline decoration-dotted"
          >
            返回标题画面
          </button>
        </div>
      )}
    </div>
  );
}

export default App;