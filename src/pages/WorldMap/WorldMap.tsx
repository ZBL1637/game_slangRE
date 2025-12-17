import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '@/context/PlayerContext';
import { useInput } from '@/hooks/useInput';
import { SpriteCharacter, generatePlaceholderSpriteSheet, Direction, SPRITE_SIZE, SCALE } from '@/components/SpriteCharacter';
import './WorldMap.scss';

// 区域定义 (添加坐标)
// 坐标基于 16:9 地图的百分比位置 (Top/Left)
// x/y used for logical distance check (0-100)
const REGIONS = [
  // 移除新手村 (id: 0)，它现在是独立区域，不在世界地图上显示
  { id: 1, name: '黑话起源之森', level: '1-15', desc: '术语基础、分类与历史', time: '3 min', x: 15, y: 69, pos: { left: '15%', top: '69%' } },     // 左下 (原位置)
  { id: 2, name: '战斗本体平原', level: '10-25', desc: '副本、RNG与机制黑话', time: '2 min', x: 38.5, y: 69, pos: { left: '38.5%', top: '69%' } },     // 左中下
  { id: 3, name: '玩家生态城镇', level: '20-35', desc: '社群称谓与行为标签', time: '4 min', x: 67, y: 72, pos: { left: '67%', top: '72%' } },    // 中心
  { id: 4, name: '经济与氪金之都', level: '30-45', desc: '货币、交易与氪金术语', time: '3 min', x: 89, y: 55, pos: { left: '89%', top: '55%' } },    // 右下
  { id: 5, name: '弹幕大峡谷', level: '40-60', desc: '直播弹幕与情绪黑话', time: '4 min', x: 74, y: 30, pos: { left: '74%', top: '30%' } },      // 右上
  { id: 6, name: '终章·魔王城', level: '60-100', desc: '算法推荐与平台生态', time: '5 min', x: 50, y: 15, pos: { left: '50%', top: '15%' } },     // 顶部正中
];

const MOVEMENT_SPEED = 4;
const INTERACTION_DISTANCE = 8; // %

const WorldMap: React.FC = () => {
  const navigate = useNavigate();
  const { state } = usePlayer();
  
  // Player State
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [direction, setDirection] = useState<Direction>(Direction.DOWN);
  const [isMoving, setIsMoving] = useState(false);
  const [spriteSheet, setSpriteSheet] = useState<string>('');
  const [activeRegion, setActiveRegion] = useState<typeof REGIONS[0] | null>(null);
  const [isReady, setIsReady] = useState(false); // New state to prevent loop before init

  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);
  const input = useInput();
  
  // Refs for loop
  const posRef = useRef(playerPos);
  const directionRef = useRef(direction);

  useEffect(() => { posRef.current = playerPos; }, [playerPos]);
  useEffect(() => { directionRef.current = direction; }, [direction]);

  // Load Sprite
  useEffect(() => {
    setSpriteSheet(generatePlaceholderSpriteSheet());
  }, []);

  // Initialize Position (Spawn near last unlocked or Chapter 0)
  useEffect(() => {
    const initPosition = () => {
        if (containerRef.current && !isReady) {
            const { clientWidth, clientHeight } = containerRef.current;
            if (clientWidth > 0 && clientHeight > 0) {
                // Default spawn at Bottom Left (coming from Tutorial Village)
                const spawnX = clientWidth * 0.05; // 5%
                const spawnY = clientHeight * 0.85; // 85%
                
                setPlayerPos({ x: spawnX, y: spawnY });
                setIsReady(true);
            }
        }
    };

    // Initial check
    initPosition();

    // Observe resize to handle initial layout if dimensions are 0
    const observer = new ResizeObserver(() => {
        initPosition();
    });

    if (containerRef.current) {
        observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isReady]);

  const getRegionStatus = (id: number) => {
    if (state.completedChapters.includes(id)) return 'completed';
    if (state.unlockedChapters.includes(id)) return 'unlocked';
    return 'locked';
  };

  const enterRegion = (id: number) => {
    const status = getRegionStatus(id);
    if (status !== 'locked') {
        navigate(`/chapter/${id}`);
    }
  };

  // Game Loop
  useEffect(() => {
    if (!isReady) return;

    const update = () => {
      if (!containerRef.current) return;
      
      const { up, down, left, right } = input;
      let { x, y } = posRef.current;
      let newIsMoving = false;
      let newDirection = directionRef.current;

      // Interaction check (Space key)
      // Note: input hook prevents default space scrolling, but doesn't expose space state directly 
      // unless we modify it. For now, let's just use proximity auto-prompt + separate key listener for Space?
      // Actually `useInput` filters space prevention but doesn't return space state in the object.
      // Let's add a separate listener for interaction or modify useInput.
      // For simplicity, let's just add a keydown listener for 'Enter' or 'Space' inside this component.

      if (up) { y -= MOVEMENT_SPEED; newDirection = Direction.UP; newIsMoving = true; }
      else if (down) { y += MOVEMENT_SPEED; newDirection = Direction.DOWN; newIsMoving = true; }
      
      if (left) { x -= MOVEMENT_SPEED; newDirection = Direction.LEFT; newIsMoving = true; }
      else if (right) { x += MOVEMENT_SPEED; newDirection = Direction.RIGHT; newIsMoving = true; }

      // Diagonal fix
      if (left && !right && !up && !down) newDirection = Direction.LEFT;
      if (right && !left && !up && !down) newDirection = Direction.RIGHT;
      if (up && !down && !left && !right) newDirection = Direction.UP;
      if (down && !up && !left && !right) newDirection = Direction.DOWN;

      // Boundaries
      const { clientWidth, clientHeight } = containerRef.current;
      const maxX = clientWidth - SPRITE_SIZE * SCALE;
      const maxY = clientHeight - SPRITE_SIZE * SCALE;
      x = Math.max(0, Math.min(x, maxX));
      y = Math.max(0, Math.min(y, maxY));

      setPlayerPos({ x, y });
      setDirection(newDirection);
      setIsMoving(newIsMoving);

      // Check proximity
      const centerX = x + (SPRITE_SIZE * SCALE) / 2;
      const centerY = y + (SPRITE_SIZE * SCALE) / 2;
      const pctX = (centerX / clientWidth) * 100;
      const pctY = (centerY / clientHeight) * 100;

      const nearby = REGIONS.find(r => {
        const dx = pctX - r.x;
        const dy = (pctY - r.y) * (16/9);
        return Math.sqrt(dx*dx + dy*dy) < INTERACTION_DISTANCE;
      });

      setActiveRegion(nearby || null);

      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);
    return () => {
      if (requestRef.current != null) cancelAnimationFrame(requestRef.current);
    };
  }, [input, isReady]);

  // Interaction Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.code === 'Space' || e.code === 'Enter') && activeRegion) {
         enterRegion(activeRegion.id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeRegion]);

  return (
    <div className="world-map-container">
      {/* Map Nodes */}
      <div className="map-viewport animate-fade-in-up delay-200" ref={containerRef}>
        <SpriteCharacter 
            image={spriteSheet}
            x={playerPos.x}
            y={playerPos.y}
            direction={direction}
            isMoving={isMoving}
        />

        {REGIONS.map(region => {
          const status = getRegionStatus(region.id);
          const isActive = activeRegion?.id === region.id;
          
          return (
            <div 
              key={region.id}
              className={`map-node region-${region.id} status-${status} ${isActive ? 'active-target' : ''}`}
              style={region.pos}
            >
              <div className="node-icon">
                {status === 'locked' && <span className="icon-lock">🔒</span>}
                {status === 'completed' && <span className="icon-check">🚩</span>}
                {status === 'unlocked' && <span className="icon-marker">📍</span>}
              </div>
              
              {/* Interaction Prompt */}
              {isActive && status !== 'locked' && (
                <div className="interaction-prompt">
                    <span className="key">SPACE</span>
                    <span className="label">进入</span>
                </div>
              )}
               {isActive && status === 'locked' && (
                <div className="interaction-prompt locked">
                    <span className="label">未解锁</span>
                </div>
              )}
            </div>
          );
        })}

        {/* UI Overlay */}
        <div className="map-ui-overlay">
           <div className="control-hint">
              WASD 移动 / SPACE 进入
           </div>
           {activeRegion && (
               <div className="region-info-card animate-fade-in-up">
                   <h3>{activeRegion.name}</h3>
                   <div className="meta">
                       <span>Lv.{activeRegion.level}</span>
                       <span>⏳ {activeRegion.time}</span>
                   </div>
                   <p>{activeRegion.desc}</p>
               </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default WorldMap;
