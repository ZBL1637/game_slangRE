import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '@/context/PlayerContext';
import { TutorialPhase, Dialogue } from './types';
import { DialogBox } from './components/DialogBox';
import { SlangTooltip } from './components/SlangTooltip';
import {
  INTRO_DIALOGUES,
  TUTORIAL_QUIZ,
  POST_QUIZ_DIALOGUE,
  NV00_NARRATION,
  NV04_DIALOGUE,
  NV07_NARRATION
} from './constants';
import villageHeadImg from '@/assets/images/village-head.png';
import newmanImg from '@/assets/images/newman.png';
import './TutorialVillage.scss';

// New Imports for Player Movement
import { useInput } from '@/hooks/useInput';
import { SpriteCharacter, generatePlaceholderSpriteSheet, Direction, SPRITE_SIZE, SCALE } from '@/components/SpriteCharacter';

// --- Constants ---
const MOVEMENT_SPEED = 4; // pixels per frame
const INTERACTION_DISTANCE = 10; // % distance

interface Point { x: number; y: number; }
interface EventZone { 
  id: string; 
  x: number; 
  y: number; 
  label: string;
  trigger?: () => void;
  condition?: (flags: any) => boolean;
}

const TutorialVillage: React.FC = () => {
  const navigate = useNavigate();
  const { state, addExp, unlockAchievement, completeChapter, updateTutorialProgress } = usePlayer();
  
  const [phase, setPhase] = useState<TutorialPhase>(TutorialPhase.ENTERING);
  const [dialogueQueue, setDialogueQueue] = useState<Dialogue[]>([]);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  
  // Visual States
  const [showEntranceText, setShowEntranceText] = useState(false);
  const [showVillageTitle, setShowVillageTitle] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizResult, setQuizResult] = useState<'pending' | 'correct' | 'incorrect'>('pending');

  // Exploration State
  // playerPos is now in PIXELS. Initial state is 0,0, will be set on mount/resize
  const [playerPos, setPlayerPos] = useState<Point>({ x: 0, y: 0 });
  const [direction, setDirection] = useState<Direction>(Direction.DOWN);
  const [isMoving, setIsMoving] = useState(false);
  const [spriteSheet, setSpriteSheet] = useState<string>('');
  
  const [flags, setFlags] = useState({
    firstMove: false,
    roadsignLit: false,
    boardLit: false,
    sproutLit: false,
    chiefMet: false,
    innLit: false,
    gateUnlocked: false
  });
  const [lastTriggeredEventId, setLastTriggeredEventId] = useState<string | null>(null);
  const [showEventPopup, setShowEventPopup] = useState<{title: string, content: React.ReactNode} | null>(null);

  // Refs for movement loop
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);
  const posRef = useRef(playerPos);
  const directionRef = useRef(direction);
  const input = useInput();
  
  // Need to access current state in animation loop without dependencies
  const flagsRef = useRef(flags);
  const phaseRef = useRef(phase);
  const dialogueQueueRef = useRef(dialogueQueue);
  const showEventPopupRef = useRef(showEventPopup);
  const lastTriggeredEventIdRef = useRef(lastTriggeredEventId);

  // Sync refs
  useEffect(() => { posRef.current = playerPos; }, [playerPos]);
  useEffect(() => { directionRef.current = direction; }, [direction]);
  useEffect(() => { flagsRef.current = flags; }, [flags]);
  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { dialogueQueueRef.current = dialogueQueue; }, [dialogueQueue]);
  useEffect(() => { showEventPopupRef.current = showEventPopup; }, [showEventPopup]);
  useEffect(() => { lastTriggeredEventIdRef.current = lastTriggeredEventId; }, [lastTriggeredEventId]);

  // Load Sprite
  useEffect(() => {
    setSpriteSheet(generatePlaceholderSpriteSheet());
  }, []);

  // Initialize Position (center-bottomish: 50%, 90%)
  useEffect(() => {
    if (containerRef.current && playerPos.x === 0 && playerPos.y === 0) {
      const { clientWidth, clientHeight } = containerRef.current;
      setPlayerPos({
        x: clientWidth * 0.45,
        y: clientHeight * 0.8
      });
    }
  }, [containerRef.current]); // eslint-disable-line react-hooks/exhaustive-deps

  // Helper to change phase and save progress
  const changePhase = (newPhase: TutorialPhase, newQueue?: Dialogue[]) => {
    setPhase(newPhase);
    if (newQueue) setDialogueQueue(newQueue);
    setCurrentDialogueIndex(0);
    updateTutorialProgress(newPhase);
  };

  // Define Event Zones (Coordinates in %)
  const eventZones: EventZone[] = [
    { id: 'EVT_roadsign', x: 55.6, y: 68, label: '?', trigger: () => handleRoadsign() },
    { id: 'EVT_noticeboard', x: 43, y: 40, label: '?', trigger: () => handleNoticeboard() },
    { id: 'EVT_inn', x: 82, y: 40, label: '?', trigger: () => handleInn() },
    { id: 'EVT_sprout_npc', x: 63, y: 48, label: '!', trigger: () => handleSprout() },
    { id: 'EVT_village_chief', x: 50, y: 35, label: '!', trigger: () => handleChief() },
    { id: 'EVT_worldgate', x: 63.5, y: 10, label: 'EXIT', trigger: () => handleGate() },
  ];

  // Event Handlers
  const handleRoadsign = () => {
    if (flagsRef.current.roadsignLit) return;
    setFlags(prev => ({ ...prev, roadsignLit: true }));
    addExp(15);
    setShowEventPopup({
      title: '新手村 / Tutorial Village',
      content: (
        <div>
          <p>“如果你听不懂这里的人在说什么——别慌，你不是一个人。”</p>
          <div className="reward-hint">词条点亮：新手村 | EXP +15</div>
        </div>
      )
    });
  };

  const handleNoticeboard = () => {
    if (flagsRef.current.boardLit) return;
    setFlags(prev => ({ ...prev, boardLit: true }));
    addExp(10);
    setShowEventPopup({
      title: '村庄公告栏',
      content: (
        <ul className="notice-list">
          <li>「萌新求带」</li>
          <li>「来个大佬讲讲这个词啥意思」</li>
          <li>「进本前先看说明，别<span style={{color: '#ef4444', fontFamily: 'monospace'}}>出错灭</span>（划重点）」</li>
          <div className="reward-hint" style={{marginTop: '1rem'}}>Quest Updated: 村长在广场喷泉旁 | EXP +10</div>
        </ul>
      )
    });
  };

  const handleInn = () => {
    if (flagsRef.current.innLit) return;
    setFlags(prev => ({ ...prev, innLit: true }));
    setShowEventPopup({
      title: '热闹的酒馆',
      content: <p>里面传来嘈杂的讨论声：“这波团战怎么输的？”“辅助不插眼啊！”</p>
    });
  };

  const handleSprout = () => {
    if (flagsRef.current.sproutLit) return;
    setFlags(prev => ({ ...prev, sproutLit: true }));
    addExp(15);
    changePhase(TutorialPhase.EXPLORATION, NV04_DIALOGUE);
  };

  const handleChief = () => {
    if (flagsRef.current.chiefMet) return;
    changePhase(TutorialPhase.INTRO, INTRO_DIALOGUES);
  };

  const handleGate = () => {
    if (!flagsRef.current.gateUnlocked) {
      if (!showEventPopupRef.current) {
          setShowEventPopup({
            title: '迷雾重重',
            content: <p>浓重的迷雾挡住了去路。也许你应该先去找<b>村长</b>谈谈。</p>
          });
      }
      return;
    }
    changePhase(TutorialPhase.READY_TO_LEAVE, NV07_NARRATION);
  };

  // --- Game Loop (Movement & Event Check) ---
  useEffect(() => {
    const update = () => {
      // Only run update if in EXPLORATION and no blocking UI
      if (
        phaseRef.current === TutorialPhase.EXPLORATION && 
        dialogueQueueRef.current.length === 0 && 
        !showEventPopupRef.current
      ) {
        const { up, down, left, right } = input;
        let { x, y } = posRef.current;
        let newIsMoving = false;
        let newDirection = directionRef.current;
        
        // Movement Logic
        if (up) { 
          y -= MOVEMENT_SPEED; 
          newDirection = Direction.UP; 
          newIsMoving = true; 
        } else if (down) { 
          y += MOVEMENT_SPEED; 
          newDirection = Direction.DOWN; 
          newIsMoving = true; 
        }

        if (left) { 
          x -= MOVEMENT_SPEED; 
          newDirection = Direction.LEFT; 
          newIsMoving = true; 
        } else if (right) { 
          x += MOVEMENT_SPEED; 
          newDirection = Direction.RIGHT; 
          newIsMoving = true; 
        }

        // Direction priority
        if (left && !right && !up && !down) newDirection = Direction.LEFT;
        if (right && !left && !up && !down) newDirection = Direction.RIGHT;
        if (up && !down && !left && !right) newDirection = Direction.UP;
        if (down && !up && !left && !right) newDirection = Direction.DOWN;

        // Boundaries
        if (containerRef.current) {
          const { clientWidth, clientHeight } = containerRef.current;
          // Sprite is centered at x,y. 
          // But SpriteCharacter renders starting at top-left of the sprite box? 
          // User code: transform translate3d(x, y, 0). 
          // And SpriteCharacter has width/height = SPRITE_SIZE * SCALE.
          // Let's assume x,y is the top-left of the sprite box for collision.
          
          const maxX = clientWidth - SPRITE_SIZE * SCALE;
          const maxY = clientHeight - SPRITE_SIZE * SCALE;
          x = Math.max(0, Math.min(x, maxX));
          y = Math.max(0, Math.min(y, maxY));
          
          // --- Event Detection ---
          // Convert current center position to Percentage for event checking
          const centerX = x + (SPRITE_SIZE * SCALE) / 2;
          const centerY = y + (SPRITE_SIZE * SCALE) / 2;
          
          const pctX = (centerX / clientWidth) * 100;
          const pctY = (centerY / clientHeight) * 100;
          
          const nearbyEvent = eventZones.find(zone => {
            const dx = pctX - zone.x;
            const dy = (pctY - zone.y) * (16/9); // Correction
            const dist = Math.sqrt(dx*dx + dy*dy);
            return dist < INTERACTION_DISTANCE;
          });

          // Auto-trigger
          if (nearbyEvent) {
             if (nearbyEvent.id !== lastTriggeredEventIdRef.current) {
                 if (nearbyEvent.trigger) {
                     nearbyEvent.trigger();
                     setLastTriggeredEventId(nearbyEvent.id);
                 }
             }
          } else {
             if (lastTriggeredEventIdRef.current) {
                 setLastTriggeredEventId(null);
             }
          }
        }

        // Update State if changed
        // Optimization: only update if moving or if we need to stop moving
        // But we need to update 'x,y' every frame if moving
        if (newIsMoving || (posRef.current !==  {x,y} as any)) { // Simple check
           // To avoid excessive re-renders when NOT moving, we rely on newIsMoving
        }
        
        setPlayerPos({ x, y });
        setDirection(newDirection);
        setIsMoving(newIsMoving);
        
        if (newIsMoving && !flagsRef.current.firstMove) {
            setFlags(prev => ({ ...prev, firstMove: true }));
        }
      } else {
        setIsMoving(false);
      }

      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);
    return () => {
      if (requestRef.current != null) cancelAnimationFrame(requestRef.current);
    };
  }, [input]); // Dependency on input is fine because input is a stable object ref from hook? 
               // Wait, useInput returns a new object on every render?
               // The user code: `const input = useInput();` -> `useEffect(..., [input])`.
               // `useInput` updates state `input` on key events. 
               // If `input` changes, effect re-runs. 
               // Inside effect, we use `input` values.
               // Actually, `requestAnimationFrame` loop should read the LATEST input.
               // But `input` is closed over by `update`.
               // If `useEffect` re-runs on `input` change, `requestAnimationFrame` is cancelled and restarted with new closure.
               // This is OK.

  // Animation Sequence on Mount or Restore Progress
  useEffect(() => {
    const savedPhase = state.tutorialProgress?.phase as TutorialPhase;
    
    if (savedPhase && savedPhase !== TutorialPhase.ENTERING) {
      setPhase(savedPhase);
      switch (savedPhase) {
        case TutorialPhase.INTRO: setDialogueQueue(INTRO_DIALOGUES); break;
        default: setDialogueQueue([]);
      }
      return;
    }

    let timer1: NodeJS.Timeout, timer2: NodeJS.Timeout, timer3: NodeJS.Timeout;

    if (phase === TutorialPhase.ENTERING) {
      setShowEntranceText(true);
      timer1 = setTimeout(() => {
        setShowEntranceText(false);
        setShowVillageTitle(true);
      }, 3000);

      timer2 = setTimeout(() => {
        setShowVillageTitle(false);
      }, 6000);

      timer3 = setTimeout(() => {
        changePhase(TutorialPhase.ENTERING, NV00_NARRATION); 
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
    
    if (currentDialogue?.action) {
      switch (currentDialogue.action) {
        case 'unlock_gate':
            setFlags(prev => ({ ...prev, chiefMet: true, gateUnlocked: true }));
            addExp(50);
            changePhase(TutorialPhase.EXPLORATION, []);
            return;
        case 'end_tutorial':
          changePhase(TutorialPhase.READY_TO_LEAVE, []);
          handleComplete();
          return;
        case 'highlight_menu':
            // Handle existing actions if needed, or ignore
            break;
      }
    }

    if (currentDialogueIndex < dialogueQueue.length - 1) {
      setCurrentDialogueIndex(prev => prev + 1);
    } else {
      if (phase === TutorialPhase.ENTERING) {
          changePhase(TutorialPhase.EXPLORATION, []);
          return;
      }
      if (phase === TutorialPhase.EXPLORATION) {
          setDialogueQueue([]);
          return;
      }
    }
  };

  const handleQuizOption = (isCorrect: boolean) => {
    if (isCorrect) {
        setQuizResult('correct');
        addExp(20);
        unlockAchievement('first_quiz');
    } else {
        setQuizResult('incorrect');
        addExp(10);
    }
  };

  const closeQuizAndContinue = () => {
    setShowQuizModal(false);
    setQuizResult('pending');
    changePhase(TutorialPhase.EXPLORATION, POST_QUIZ_DIALOGUE);
  };

  const handleComplete = () => {
      unlockAchievement('first_step');
      completeChapter(1);
      navigate('/world-map');
  };

  const isHudHighlighted = phase === TutorialPhase.EXPLAIN_HUD;
  const isMenuHighlighted = phase === TutorialPhase.EXPLAIN_MENU;
  const isSlangHighlighted = phase === TutorialPhase.EXPLAIN_SLANG;
  const isOverlayActive = isHudHighlighted || isMenuHighlighted || isSlangHighlighted;

  // --- Render Exploration ---
  const renderExploration = () => {
      return (
          <>
            {/* Sprite Player */}
            <SpriteCharacter
                image={spriteSheet}
                x={playerPos.x}
                y={playerPos.y}
                direction={direction}
                isMoving={isMoving}
            />

            {/* Events */}
            {eventZones.map(zone => {
                const isCompleted = 
                    (zone.id === 'EVT_roadsign' && flags.roadsignLit) ||
                    (zone.id === 'EVT_noticeboard' && flags.boardLit) ||
                    (zone.id === 'EVT_sprout_npc' && flags.sproutLit) ||
                    (zone.id === 'EVT_village_chief' && flags.chiefMet);

                return (
                    <div 
                        key={zone.id}
                        className={`event-marker ${isCompleted ? 'completed' : ''}`}
                        style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
                    >
                        <span className="marker-label">{zone.label}</span>
                    </div>
                );
            })}

            {/* Gate Visual */}
            <div className={`world-gate ${flags.gateUnlocked ? 'unlocked' : 'locked'}`} style={{ left: '63.5%', top: '5%' }}>
                {flags.gateUnlocked && <div className="gate-glow"></div>}
            </div>

            {/* UI Overlay */}
            {phase !== TutorialPhase.ENTERING && (
                <div className="exploration-ui">
                    {!flags.firstMove && (
                        <div className="tutorial-hint">
                            Quest Added: 在新手村找到「村长」<br/>
                            （WASD 或 方向键移动）
                        </div>
                    )}
                    
                    <div className="mini-quest-log">
                        <div className="log-header">
                            <span className="icon">📜</span>
                            <span className="title">任务日志</span>
                        </div>
                        <div className="log-divider"></div>
                        <div className="log-content">
                            <div className={`quest-item main ${flags.chiefMet ? 'done' : ''}`}>
                                <span className="q-icon">!</span>
                                <span className="q-text">寻找村长 (广场)</span>
                            </div>
                            <div className="quest-item side">
                                <span className="q-icon">🧭</span>
                                <span className="q-text">黑话收集: {[flags.roadsignLit, flags.boardLit, flags.sproutLit].filter(Boolean).length}/3</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Popups */}
            {showEventPopup && (
                <div className="event-popup-overlay" onClick={() => setShowEventPopup(null)}>
                    <div className="event-popup">
                        <h3>{showEventPopup.title}</h3>
                        <div className="popup-content">{showEventPopup.content}</div>
                        <div className="close-hint">Click to close</div>
                    </div>
                </div>
            )}
          </>
      );
  };

  return (
    <div className="tutorial-village-page" ref={containerRef}>
        {/* Background Layer */}
        <div className="bg-layer"></div>

        {/* Entrance Animation Layer */}
        <div 
            className={`entrance-screen ${(showEntranceText || showVillageTitle) ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            style={{ position: 'absolute', inset: 0, zIndex: 10100, transition: 'opacity 1s', pointerEvents: (showEntranceText || showVillageTitle) ? 'auto' : 'none' }}
        >
            <div className={`entrance-text ${showEntranceText ? 'opacity-100' : 'opacity-0'}`}>
                <p>你按下了“开始游戏”...</p>
                <p>以为这只是另一场普通的冒险</p>
            </div>

            <div className={`village-title ${showVillageTitle ? 'opacity-100' : 'opacity-0'}`}>
                <p className="subtitle">CHAPTER 1</p>
                <h1>黑话起源之森</h1>
                <p className="desc">Origin Forest</p>
            </div>
        </div>
        
        {/* Exploration Layer */}
        {(phase === TutorialPhase.EXPLORATION || phase === TutorialPhase.INTRO || phase === TutorialPhase.ENTERING) && renderExploration()}

        {/* --- UI LAYER --- */}

        {/* Global Dark Overlay */}
        <div className={`overlay ${isOverlayActive ? 'active' : ''}`} style={{ pointerEvents: 'none' }}></div>

        {isHudHighlighted && (
            <div className="absolute top-2 right-4 z-[10040] animate-bounce">
                <div className="bg-amber-600 text-white px-3 py-1 rounded text-sm font-bold border border-amber-800 shadow-lg">
                    ▲ 你的等级与经验
                </div>
            </div>
        )}

        {isMenuHighlighted && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[10040] animate-bounce">
                <div className="bg-amber-600 text-white px-3 py-1 rounded text-sm font-bold border border-amber-800 shadow-lg">
                    ▲ 任务、成就与图鉴
                </div>
            </div>
        )}

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

        {(phase === TutorialPhase.PRE_QUIZ) && (
            <div 
                className="quest-marker-floating"
                onClick={() => setShowQuizModal(true)}
            >
                ?
            </div>
        )}



        {dialogueQueue.length > 0 && phase !== TutorialPhase.QUIZ && (
             <DialogBox 
                speaker={dialogueQueue[currentDialogueIndex].speaker}
                text={dialogueQueue[currentDialogueIndex].text}
                onNext={handleNextDialogue}
                showNextArrow={currentDialogueIndex < dialogueQueue.length - 1 || !!dialogueQueue[currentDialogueIndex].action}
                characterImage={
                    dialogueQueue[currentDialogueIndex].speaker === '黑话村长' ? villageHeadImg : 
                    dialogueQueue[currentDialogueIndex].speaker === '萌新' ? newmanImg : undefined
                }
             />
        )}

        {phase !== TutorialPhase.ENTERING && (
            <div className="system-message-bar">
                <span className="prefix">[SYSTEM]</span>
                <span className="message">
                    {phase === TutorialPhase.EXPLORATION ? '探索新手村...' : 
                    phase === TutorialPhase.INTRO ? '点击对话框继续剧情...' : 
                    phase === TutorialPhase.PRE_QUIZ ? '点击村长头上的问号接取任务...' :
                    phase === TutorialPhase.READY_TO_LEAVE ? '旅途才刚刚开始...' :
                    '正在进行新手引导...'}
                </span>
            </div>
        )}

        {showQuizModal && (
            <div className="quiz-modal">
                <div className="quiz-content">
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
