import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '@/context/PlayerContext';
import { TutorialPhase, Dialogue } from './types';
import { DialogBox } from './components/DialogBox';
import { SlangTooltip } from './components/SlangTooltip';
import {
  INTRO_DIALOGUES,
  HUD_TUTORIAL_DIALOGUE,
  MENU_TUTORIAL_DIALOGUE,
  SLANG_TUTORIAL_DIALOGUE,
  PRE_QUIZ_DIALOGUE,
  TUTORIAL_QUIZ,
  POST_QUIZ_DIALOGUE
} from './constants';
import './TutorialVillage.scss';

const TutorialVillage: React.FC = () => {
  const navigate = useNavigate();
  const { addExp, unlockAchievement, unlockChapter } = usePlayer();
  
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
      // End of current queue
    }
  };

  const handleQuizOption = (isCorrect: boolean) => {
    if (isCorrect) {
      setQuizResult('correct');
      addExp(20);
      unlockAchievement('perfect_clear'); // 一命通关
    } else {
      setQuizResult('incorrect');
      addExp(10);
      unlockAchievement('first_wipe'); // 第一次团灭
    }
  };

  const closeQuizAndContinue = () => {
    setShowQuizModal(false);
    setPhase(TutorialPhase.POST_QUIZ);
    setDialogueQueue(POST_QUIZ_DIALOGUE);
    setCurrentDialogueIndex(0);
  };
  
  const handleComplete = () => {
      unlockAchievement('first_step'); // 初出茅庐
      // Unlock Chapter 2 when leaving tutorial
      unlockChapter(2);
      navigate('/world-map');
  };

  // --- Render Helpers ---

  // Black Screen Entrance
  if (phase === TutorialPhase.ENTERING) {
    return (
      <div className="tutorial-village-page">
        <div className="entrance-screen">
            <div className={`entrance-text ${showEntranceText ? 'opacity-100' : 'opacity-0'}`}>
                <p>你按下了开始游戏</p>
                <p>被扔进一个只说黑话的世界...</p>
            </div>
            
            <div className={`village-title ${showVillageTitle ? 'opacity-100' : 'opacity-0'}`}>
                <p className="subtitle">CHAPTER 1</p>
                <h1>新手村</h1>
                <p className="desc">Tutorial Village</p>
            </div>
        </div>
      </div>
    );
  }

  const isHudHighlighted = phase === TutorialPhase.EXPLAIN_HUD;
  const isMenuHighlighted = phase === TutorialPhase.EXPLAIN_MENU;
  const isSlangHighlighted = phase === TutorialPhase.EXPLAIN_SLANG;
  const isOverlayActive = isHudHighlighted || isMenuHighlighted || isSlangHighlighted;

  return (
    <div className="tutorial-village-page">
        {/* Background Layer */}
        <div className="bg-layer"></div>
        
        {/* Decorative Elements - Removed as they are now in the background image
        <div className="house"></div>
        <div className="roof"></div>
        <div className="well-container">
            <div className="well-water"></div>
        </div>
        
        <div className="path-to-map"></div>
        */}

        {/* --- UI LAYER --- */}

        {/* Global Dark Overlay */}
        <div className={`overlay ${isOverlayActive ? 'active' : ''}`}></div>

        {/* Highlight Tooltips (Pointing to global HUD) */}
        {isHudHighlighted && (
            <div className="absolute top-2 right-4 z-40 animate-bounce">
                <div className="bg-amber-600 text-white px-3 py-1 rounded text-sm font-bold border border-amber-800 shadow-lg">
                    ▲ 你的等级与经验
                </div>
            </div>
        )}

        {isMenuHighlighted && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 animate-bounce">
                <div className="bg-amber-600 text-white px-3 py-1 rounded text-sm font-bold border border-amber-800 shadow-lg">
                    ▲ 任务、成就与图鉴
                </div>
            </div>
        )}

        {/* Slang Demo Box */}
        {isSlangHighlighted && (
            <div className="slang-demo-box">
                <h3>Example Text</h3>
                <p>
                    在 MOBA 游戏中，负责打输出的常被叫做 <SlangTooltip term="C 位" definition="Carry 位，核心输出" translation="全队的大腿" context="MOBA/FPS" />，
                    而那些只顾自己刷伤害的玩家，有时会被吐槽成 <SlangTooltip term="工具人" definition="为他人做嫁衣的角色" translation="无情的打工仔" context="所有多人游戏" />。
                </p>
                <div className="hint">
                    ( 试着点击上面带下划线的词 )
                </div>
            </div>
        )}

        {/* NPC Village Chief - Interaction Zone Only */}
        {/* <div className="npc-container" ... removed /> */}

        {/* Quest Marker (Floating) */}
        {(phase === TutorialPhase.PRE_QUIZ) && (
            <div 
                className="quest-marker-floating"
                onClick={() => setShowQuizModal(true)}
            >
                ?
            </div>
        )}

        {/* Leave Village Button */}
        {phase === TutorialPhase.READY_TO_LEAVE && (
            <div className="leave-btn-container">
                <button 
                    onClick={handleComplete}
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
                characterImage="../../src/assets/images/village-head.png"
             />
        )}

        {/* System Message Bar */}
        <div className="system-message-bar">
            <span className="prefix">[SYSTEM]</span>
            <span className="message">
                {phase === TutorialPhase.INTRO ? '点击对话框继续剧情...' : 
                 phase === TutorialPhase.PRE_QUIZ ? '点击村长头上的问号接取任务...' :
                 phase === TutorialPhase.READY_TO_LEAVE ? '旅途才刚刚开始...' :
                 '正在进行新手引导...'}
            </span>
        </div>

        {/* Quiz Modal */}
        {showQuizModal && (
            <div className="quiz-modal">
                <div className="quiz-content">
                    {/* Header */}
                    <div className="header">
                        <h2>
                            任务：第一次翻译
                        </h2>
                    </div>

                    <div className="body">
                        {quizResult === 'pending' ? (
                            <>
                                <p className="intro-text">
                                    既然你已经知道这世界到处是黑话，那就先试着翻译几句常见的弹幕吧。
                                </p>
                                <h3 className="question">
                                    "{TUTORIAL_QUIZ.question}"
                                </h3>
                                <div className="options">
                                    {TUTORIAL_QUIZ.options.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => handleQuizOption(option.isCorrect)}
                                        >
                                            <span className="opt-id">{option.id.toUpperCase()}.</span>
                                            {option.text}
                                        </button>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="result">
                                <div className="emoji">
                                    {quizResult === 'correct' ? '🎉' : '💀'}
                                </div>
                                <h3 className={quizResult === 'correct' ? 'correct' : 'incorrect'}>
                                    {quizResult === 'correct' ? '任务完成！' : '任务完成（但受了点伤）'}
                                </h3>
                                <p>
                                    {quizResult === 'correct' ? TUTORIAL_QUIZ.correctFeedback : TUTORIAL_QUIZ.incorrectFeedback}
                                </p>
                                <button 
                                    onClick={closeQuizAndContinue}
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

export default TutorialVillage;
