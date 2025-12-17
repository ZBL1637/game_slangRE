import React, { useState, useEffect, useRef } from 'react';
import { PlayerStats, TutorialPhase, Dialogue, QuizQuestion } from '../types';
import { DialogBox } from './ui/DialogBox';
import { SlangTooltip } from './ui/SlangTooltip';
import { 
  INTRO_DIALOGUES, 
  HUD_TUTORIAL_DIALOGUE, 
  MENU_TUTORIAL_DIALOGUE, 
  SLANG_TUTORIAL_DIALOGUE,
  PRE_QUIZ_DIALOGUE,
  TUTORIAL_QUIZ,
  POST_QUIZ_DIALOGUE
} from '../constants';

interface TutorialVillageProps {
  playerStats: PlayerStats;
  updateStats: (newStats: Partial<PlayerStats>) => void;
  onComplete: () => void;
}

export const TutorialVillage: React.FC<TutorialVillageProps> = ({ playerStats, updateStats, onComplete }) => {
  const [phase, setPhase] = useState<TutorialPhase>(TutorialPhase.ENTERING);
  const [dialogueQueue, setDialogueQueue] = useState<Dialogue[]>([]);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [showEntranceText, setShowEntranceText] = useState(false);
  const [showVillageTitle, setShowVillageTitle] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizResult, setQuizResult] = useState<'pending' | 'correct' | 'incorrect'>('pending');

  // Animation Sequence on Mount
  useEffect(() => {
    let timer1: NodeJS.Timeout, timer2: NodeJS.Timeout, timer3: NodeJS.Timeout;

    if (phase === TutorialPhase.ENTERING) {
      // 1. Black screen text
      setShowEntranceText(true);
      timer1 = setTimeout(() => {
        // 2. Village Title
        setShowEntranceText(false);
        setShowVillageTitle(true);
      }, 3000);

      timer2 = setTimeout(() => {
        // 3. Fade Title, Show Village
        setShowVillageTitle(false);
      }, 6000);

      timer3 = setTimeout(() => {
        // 4. Start Intro Dialogue
        setPhase(TutorialPhase.INTRO);
        setDialogueQueue(INTRO_DIALOGUES);
      }, 7000);
    }
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleNextDialogue = () => {
    const currentDialogue = dialogueQueue[currentDialogueIndex];
    
    // Handle specific actions triggered by the current dialogue finishing
    if (currentDialogue?.action) {
      switch (currentDialogue.action) {
        case 'highlight_hud':
          setPhase(TutorialPhase.EXPLAIN_HUD);
          setDialogueQueue(HUD_TUTORIAL_DIALOGUE);
          setCurrentDialogueIndex(0);
          return;
        case 'highlight_menu':
          setPhase(TutorialPhase.EXPLAIN_MENU);
          setDialogueQueue(MENU_TUTORIAL_DIALOGUE);
          setCurrentDialogueIndex(0);
          return;
        case 'highlight_slang':
          setPhase(TutorialPhase.EXPLAIN_SLANG);
          setDialogueQueue(SLANG_TUTORIAL_DIALOGUE);
          setCurrentDialogueIndex(0);
          return;
        case 'show_quiz':
          setPhase(TutorialPhase.PRE_QUIZ);
          setDialogueQueue(PRE_QUIZ_DIALOGUE);
          setCurrentDialogueIndex(0);
          return;
        case 'end_tutorial':
          setPhase(TutorialPhase.READY_TO_LEAVE);
          setDialogueQueue([]);
          return;
      }
    }

    // Normal progression
    if (currentDialogueIndex < dialogueQueue.length - 1) {
      setCurrentDialogueIndex(prev => prev + 1);
    } else {
      // End of current queue, waiting for user interaction (like clicking the NPC)
      // If we are in PRE_QUIZ, we wait for user to click the question mark
      if (phase !== TutorialPhase.PRE_QUIZ) {
          // If queue ends without action, just clear it (shouldn't happen often in this strict flow)
         // setDialogueQueue([]); 
      }
    }
  };

  const handleQuizOption = (isCorrect: boolean) => {
    if (isCorrect) {
      setQuizResult('correct');
      updateStats({
        exp: playerStats.exp + 20,
        achievements: [...playerStats.achievements, '一命通关']
      });
    } else {
      setQuizResult('incorrect');
      updateStats({
        exp: playerStats.exp + 10,
        achievements: [...playerStats.achievements, '第一次团灭']
      });
    }
  };

  const closeQuizAndContinue = () => {
    setShowQuizModal(false);
    setPhase(TutorialPhase.POST_QUIZ);
    setDialogueQueue(POST_QUIZ_DIALOGUE);
    setCurrentDialogueIndex(0);
  };

  // --- Render Helpers ---

  // Black Screen Entrance
  if (phase === TutorialPhase.ENTERING) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center relative">
        <div className={`text-stone-300 text-xl font-mono text-center transition-opacity duration-1000 ${showEntranceText ? 'opacity-100' : 'opacity-0'}`}>
          <p>你按下了开始游戏</p>
          <p className="mt-4">被扔进一个只说黑话的世界...</p>
        </div>
        
        <div className={`absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 transition-opacity duration-1000 ${showVillageTitle ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-4xl md:text-6xl text-amber-500 font-bold border-y-4 border-amber-600 py-4 px-12 bg-black">
            第一幕 · 新手村
          </h1>
          <p className="text-stone-400 mt-4 tracking-widest uppercase">Tutorial Village</p>
          <p className="text-stone-500 text-sm mt-2">这里是你学习第一批‘接头暗号’的地方</p>
        </div>
      </div>
    );
  }

  const isHudHighlighted = phase === TutorialPhase.EXPLAIN_HUD;
  const isMenuHighlighted = phase === TutorialPhase.EXPLAIN_MENU;
  const isSlangHighlighted = phase === TutorialPhase.EXPLAIN_SLANG;
  const isOverlayActive = isHudHighlighted || isMenuHighlighted || isSlangHighlighted;

  return (
    <div className="w-full h-screen relative bg-[#5c7a4c] overflow-hidden">
        {/* Background Layer: Simple pixel art village representation */}
        <div className="absolute inset-0 opacity-80" style={{
            backgroundImage: `
                repeating-linear-gradient(90deg, transparent 0, transparent 40px, #4a633e 40px, #4a633e 41px),
                repeating-linear-gradient(0deg, transparent 0, transparent 40px, #4a633e 40px, #4a633e 41px)
            `,
            backgroundSize: '41px 41px'
        }}></div>
        
        {/* Decorative Village Elements */}
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-[#4a3b2a] border-4 border-[#2a1d12] rounded-sm"></div> {/* House */}
        <div className="absolute top-1/4 left-10 -mt-16 w-36 -ml-2 h-0 border-l-[64px] border-r-[64px] border-b-[64px] border-l-transparent border-r-transparent border-b-[#8b4513]"></div> {/* Roof */}
        <div className="absolute bottom-1/3 right-20 w-16 h-16 bg-[#6b7280] rounded-full border-4 border-[#374151] flex items-center justify-center">
            <div className="w-12 h-12 bg-[#9ca3af] rounded-full opacity-50"></div> {/* Well */}
        </div>
        
        {/* Path to World Map */}
        <div className="absolute top-1/2 left-0 w-40 h-24 bg-[#8b7355] skew-x-12 opacity-80 border-y-2 border-[#5c4033]"></div>

        {/* --- UI LAYER --- */}

        {/* Global Dark Overlay for Tutorial Highlighting */}
        <div className={`absolute inset-0 bg-black/70 z-30 transition-opacity duration-500 pointer-events-none ${isOverlayActive ? 'opacity-100' : 'opacity-0'}`}></div>

        {/* HUD */}
        <div className={`absolute top-4 left-4 flex items-center gap-4 transition-all duration-300 ${isHudHighlighted ? 'z-40 relative scale-110' : 'z-10'}`}>
            <div className="w-16 h-16 bg-indigo-900 border-4 border-white rounded overflow-hidden">
                <img src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Felix" alt="Avatar" className="w-full h-full" />
            </div>
            <div className="flex flex-col gap-1">
                <div className="bg-black/60 text-white px-2 py-0.5 rounded text-xs font-mono border border-white/20">
                    Player <span className="text-amber-400">Lv.{playerStats.level}</span>
                </div>
                <div className="w-32 h-4 bg-stone-900 border border-stone-500 rounded-full overflow-hidden relative">
                    <div 
                        className="h-full bg-green-500 transition-all duration-500" 
                        style={{ width: `${(playerStats.exp / playerStats.maxExp) * 100}%` }}
                    ></div>
                    <span className="absolute inset-0 text-[10px] text-white flex items-center justify-center leading-none">
                        EXP {playerStats.exp}/{playerStats.maxExp}
                    </span>
                </div>
            </div>
            {isHudHighlighted && (
                <div className="absolute top-full left-0 mt-2 text-white text-sm bg-amber-600 px-2 py-1 rounded animate-bounce">
                    ▲ 你的等级与经验
                </div>
            )}
        </div>

        {/* Menu Icons */}
        <div className={`absolute top-4 right-4 flex gap-3 transition-all duration-300 ${isMenuHighlighted ? 'z-40 relative scale-110' : 'z-10'}`}>
            {['📜', '🏅', '📖', '⚙'].map((icon, i) => (
                <button key={i} className="w-10 h-10 bg-stone-800 border-2 border-stone-500 rounded flex items-center justify-center text-xl hover:bg-stone-700 hover:border-amber-400 text-stone-200 shadow-lg">
                    {icon}
                </button>
            ))}
            {isMenuHighlighted && (
                 <div className="absolute top-full right-0 mt-2 text-white text-sm bg-amber-600 px-2 py-1 rounded animate-bounce text-right w-48">
                    ▲ 任务、成就与图鉴
                </div>
            )}
        </div>

        {/* Slang Demo Box (Only visible during Slang Phase) */}
        {isSlangHighlighted && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-stone-900 border-4 border-stone-500 p-6 rounded-lg shadow-2xl w-11/12 max-w-lg">
                <h3 className="text-stone-400 text-sm mb-4 uppercase tracking-widest border-b border-stone-700 pb-2">Example Text</h3>
                <p className="text-lg text-stone-200 leading-loose">
                    在 MOBA 游戏中，负责打输出的常被叫做 <SlangTooltip term="C 位" definition="Carry 位，核心输出" translation="全队的大腿" context="MOBA/FPS" />，
                    而那些只顾自己刷伤害的玩家，有时会被吐槽成 <SlangTooltip term="工具人" definition="为他人做嫁衣的角色" translation="无情的打工仔" context="所有多人游戏" />。
                </p>
                <div className="mt-4 text-center text-sm text-amber-500 animate-pulse">
                    ( 试着点击上面带下划线的词 )
                </div>
            </div>
        )}

        {/* NPC Village Chief */}
        <div className="absolute bottom-16 right-4 md:bottom-20 md:right-20 z-10 flex flex-col items-center group cursor-pointer"
             onClick={() => {
                 if (phase === TutorialPhase.PRE_QUIZ) setShowQuizModal(true);
             }}
        >
            {/* Quest Marker */}
            {(phase === TutorialPhase.PRE_QUIZ) && (
                <div className="mb-2 text-4xl text-yellow-400 animate-bounce drop-shadow-md">?</div>
            )}
            
            <div className="w-24 h-24 md:w-32 md:h-32 transition-transform duration-200 hover:scale-105">
                 {/* CSS Pixel Art Placeholder for NPC */}
                 <div className="w-full h-full bg-stone-300 rounded-t-full relative border-4 border-stone-800 shadow-xl overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-black rounded-full"></div>
                    <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-black rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-16 h-12 bg-white rounded-b-full border-4 border-stone-200"></div> {/* Beard */}
                 </div>
            </div>
            <div className="bg-black/50 text-white text-xs px-2 py-1 rounded mt-1 backdrop-blur-sm">
                黑话村长
            </div>
        </div>

        {/* Leave Village Button */}
        {phase === TutorialPhase.READY_TO_LEAVE && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 animate-fade-in-up">
                <button 
                    onClick={onComplete}
                    className="px-8 py-4 bg-emerald-700 border-4 border-emerald-400 text-white text-xl font-bold rounded shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:bg-emerald-600 hover:scale-105 transition-all"
                >
                    走出新手村 → 前往世界地图
                </button>
            </div>
        )}

        {/* Dialogue Box */}
        {dialogueQueue.length > 0 && phase !== TutorialPhase.QUIZ && (
             <DialogBox 
                speaker={dialogueQueue[currentDialogueIndex].speaker}
                text={dialogueQueue[currentDialogueIndex].text}
                onNext={handleNextDialogue}
                showNextArrow={currentDialogueIndex < dialogueQueue.length - 1 || !!dialogueQueue[currentDialogueIndex].action}
             />
        )}

        {/* System Message Bar (Bottom) */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-black border-t border-stone-700 flex items-center px-4 z-50">
            <span className="text-green-500 mr-2">[SYSTEM]</span>
            <span className="text-stone-400 text-xs md:text-sm animate-pulse">
                {phase === TutorialPhase.INTRO ? '点击对话框继续剧情...' : 
                 phase === TutorialPhase.PRE_QUIZ ? '点击村长头上的问号接取任务...' :
                 phase === TutorialPhase.READY_TO_LEAVE ? '旅途才刚刚开始...' :
                 '正在进行新手引导...'}
            </span>
        </div>

        {/* Quiz Modal */}
        {showQuizModal && (
            <div className="absolute inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
                <div className="bg-[#2a231d] border-4 border-[#8b7355] w-full max-w-lg rounded-lg shadow-2xl relative overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#8b7355] p-3 text-center border-b-4 border-[#5c4033]">
                        <h2 className="text-[#2a231d] font-bold text-xl uppercase tracking-widest">
                            任务：第一次翻译
                        </h2>
                    </div>

                    <div className="p-6">
                        {quizResult === 'pending' ? (
                            <>
                                <p className="text-stone-400 mb-6 text-sm text-center">
                                    既然你已经知道这世界到处是黑话，那就先试着翻译几句常见的弹幕吧。
                                </p>
                                <h3 className="text-xl text-amber-500 mb-6 font-bold text-center">
                                    "{TUTORIAL_QUIZ.question}"
                                </h3>
                                <div className="space-y-3">
                                    {TUTORIAL_QUIZ.options.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => handleQuizOption(option.isCorrect)}
                                            className="w-full text-left p-4 bg-stone-800 border-2 border-stone-600 text-stone-200 hover:bg-stone-700 hover:border-amber-500 hover:text-amber-400 transition-all rounded"
                                        >
                                            <span className="inline-block w-6 font-bold text-stone-500">{option.id.toUpperCase()}.</span>
                                            {option.text}
                                        </button>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="text-center animate-fade-in">
                                <div className="text-6xl mb-4">
                                    {quizResult === 'correct' ? '🎉' : '💀'}
                                </div>
                                <h3 className={`text-2xl font-bold mb-2 ${quizResult === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
                                    {quizResult === 'correct' ? '任务完成！' : '任务完成（但受了点伤）'}
                                </h3>
                                <p className="text-stone-300 mb-6 leading-relaxed">
                                    {quizResult === 'correct' ? TUTORIAL_QUIZ.correctFeedback : TUTORIAL_QUIZ.incorrectFeedback}
                                </p>
                                <button 
                                    onClick={closeQuizAndContinue}
                                    className="px-6 py-2 bg-amber-600 text-white font-bold rounded hover:bg-amber-500 transition-colors"
                                >
                                    继续冒险 ▶
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};