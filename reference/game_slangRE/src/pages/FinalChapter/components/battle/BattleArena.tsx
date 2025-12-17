// ============================================================================
// BattleArena - 回合制Boss战核心组件
// ============================================================================

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  FinalChapterState,
  BattlePhase,
  PlayerSkill,
  BossSkill,
  BattleLogEntry,
  MinionState,
  StatusEffect
} from '../../types';
import {
  BATTLE_TIPS,
  BASIC_ATTACK,
  MINION_TEMPLATE,
  NPC_DIALOGUES
} from '../../data';

import BossDisplay from './BossDisplay';
import PlayerDisplay from './PlayerDisplay';
import SkillPanel from './SkillPanel';
import BattleLog from './BattleLog';
import TurnIndicator from './TurnIndicator';
import BattleEffects from './BattleEffects';

import './BattleArena.scss';

interface BattleArenaProps {
  gameState: FinalChapterState;
  updateGameState: (updates: Partial<FinalChapterState>) => void;
  setPhase: (phase: BattlePhase) => void;
}

const BattleArena: React.FC<BattleArenaProps> = ({
  gameState,
  updateGameState,
  setPhase
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState<string | null>(null);
  const [showTip, setShowTip] = useState<string | null>(null);
  const [, setSelectedAction] = useState<'attack' | 'skill' | null>(null);

  // 添加战斗日志
  const addLog = useCallback((entry: Omit<BattleLogEntry, 'timestamp'>) => {
    updateGameState({
      battleLog: [
        ...gameState.battleLog,
        { ...entry, timestamp: Date.now() }
      ]
    });
  }, [gameState.battleLog, updateGameState]);

  // 检查战斗结束条件
  useEffect(() => {
    if (gameState.boss.currentHp <= 0) {
      setPhase('victory');
    } else if (gameState.player.currentHp <= 0) {
      setPhase('defeat');
    } else if (gameState.currentTurn > gameState.maxTurns) {
      setPhase('defeat');
    }
  }, [gameState.boss.currentHp, gameState.player.currentHp, gameState.currentTurn, gameState.maxTurns, setPhase]);

  // 计算伤害（考虑暴击）
  const calculateDamage = useCallback((baseDamage: number, isCrit: boolean = false): number => {
    const critMultiplier = isCrit ? BASIC_ATTACK.critMultiplier : 1;
    return Math.floor(baseDamage * critMultiplier);
  }, []);

  // 检查是否暴击
  const checkCrit = useCallback((): boolean => {
    const critChance = 10 + gameState.player.critBoost;
    return Math.random() * 100 < critChance;
  }, [gameState.player.critBoost]);

  // 玩家普通攻击
  const handlePlayerAttack = useCallback(() => {
    if (isAnimating || !gameState.isPlayerTurn) return;

    setIsAnimating(true);
    setCurrentAnimation('player_attack');

    const isCrit = checkCrit();
    let damage = calculateDamage(BASIC_ATTACK.baseDamage, isCrit);
    let target = 'boss';
    let actualDamage = damage;

    // 检查是否有小怪
    const aliveMinions = gameState.minions.filter(m => m.isAlive);
    if (aliveMinions.length > 0) {
      // 攻击转移到小怪
      const targetMinion = aliveMinions[0];
      target = 'minion';
      
      const newMinions = gameState.minions.map(m => {
        if (m.id === targetMinion.id) {
          const newHp = Math.max(0, m.currentHp - damage);
          return { ...m, currentHp: newHp, isAlive: newHp > 0 };
        }
        return m;
      });

      addLog({
        turn: gameState.currentTurn,
        actor: 'player',
        action: '普通攻击',
        detail: `对${targetMinion.name}造成 ${damage} 点伤害${isCrit ? '（暴击！）' : ''}`
      });

      updateGameState({ minions: newMinions });
    } else {
      // 攻击Boss
      // 检查Boss护盾
      if (gameState.boss.shield > 0) {
        actualDamage = Math.floor(damage * 0.9); // 护盾减伤10%
      }

      const newBossHp = Math.max(0, gameState.boss.currentHp - actualDamage);

      addLog({
        turn: gameState.currentTurn,
        actor: 'player',
        action: '普通攻击',
        detail: `对算法霸主造成 ${actualDamage} 点伤害${isCrit ? '（暴击！）' : ''}${gameState.boss.shield > 0 ? '（护盾减伤）' : ''}`
      });

      updateGameState({
        boss: { ...gameState.boss, currentHp: newBossHp }
      });
    }

    setTimeout(() => {
      setIsAnimating(false);
      setCurrentAnimation(null);
      endPlayerTurn();
    }, 1000);
  }, [isAnimating, gameState, checkCrit, calculateDamage, addLog, updateGameState]);

  // 使用玩家技能
  const handleUseSkill = useCallback((skill: PlayerSkill) => {
    if (isAnimating || !gameState.isPlayerTurn) return;
    if (skill.currentCooldown > 0 || skill.isDisabled) return;

    setIsAnimating(true);
    setCurrentAnimation(`skill_${skill.id}`);

    let newPlayerState = { ...gameState.player };
    let newBossState = { ...gameState.boss };
    let logDetail = '';

    switch (skill.id) {
      case 'time_freeze':
        // 时之凝固：眩晕Boss 2回合
        newBossState.isStunned = true;
        newBossState.stunnedTurns = 2;
        // 打断充能
        if (newBossState.isCharging) {
          newBossState.isCharging = false;
          newBossState.chargeProgress = 0;
          logDetail = '时间被冻结！算法霸主被眩晕2回合，终极过滤充能被打断！';
        } else {
          logDetail = '时间被冻结！算法霸主被眩晕2回合！';
        }
        break;

      case 'resonance':
        // 共鸣之声：复制Boss上一个技能
        if (gameState.lastBossSkill) {
          const copiedSkill = newBossState.skills.find(s => s.id === gameState.lastBossSkill);
          if (copiedSkill) {
            // 以50%效果释放
            if (copiedSkill.id === 'cocoon') {
              newPlayerState.shield = 5; // 10%的护盾效果的一半
              logDetail = `复制了"信息茧房"！获得5%减伤护盾！`;
            } else if (copiedSkill.id === 'traffic') {
              const damage = Math.floor((copiedSkill.damage || 35) * 0.5);
              newBossState.currentHp = Math.max(0, newBossState.currentHp - damage);
              logDetail = `复制了"流量操纵"！对Boss造成${damage}点伤害！`;
            } else {
              logDetail = `复制了"${copiedSkill.name}"，但效果不明显...`;
            }
          }
        } else {
          logDetail = 'Boss尚未使用技能，无法复制！';
        }
        break;

      case 'weakness':
        // 弱点分析：3回合内暴击率+50%
        newPlayerState.critBoost = 50;
        newPlayerState.statusEffects = [
          ...newPlayerState.statusEffects,
          {
            id: 'crit_boost',
            name: '弱点分析',
            icon: '🎯',
            type: 'crit_boost',
            value: 50,
            remainingTurns: 3,
            source: 'player'
          }
        ];
        logDetail = '洞察到Boss的弱点！接下来3回合暴击率提升50%！';
        break;

      case 'logos':
        // 言灵·转化：激活伤害转化
        newPlayerState.damageConvert = true;
        newPlayerState.statusEffects = [
          ...newPlayerState.statusEffects,
          {
            id: 'damage_convert',
            name: '言灵·转化',
            icon: '🔮',
            type: 'damage_convert',
            value: 30,
            remainingTurns: 1,
            source: 'player'
          }
        ];
        logDetail = '言灵·转化已激活！Boss的下次攻击有30%几率转化为治疗！';
        break;
    }

    // 设置技能冷却
    newPlayerState.skills = newPlayerState.skills.map(s =>
      s.id === skill.id ? { ...s, currentCooldown: s.cooldown } : s
    );

    addLog({
      turn: gameState.currentTurn,
      actor: 'player',
      action: skill.name,
      detail: logDetail
    });

    updateGameState({
      player: newPlayerState,
      boss: newBossState
    });

    setTimeout(() => {
      setIsAnimating(false);
      setCurrentAnimation(null);
      endPlayerTurn();
    }, 1500);
  }, [isAnimating, gameState, addLog, updateGameState]);

  // 结束玩家回合
  const endPlayerTurn = useCallback(() => {
    updateGameState({ isPlayerTurn: false });
    
    // 延迟后执行Boss回合
    setTimeout(() => {
      executeBossTurnRef.current();
    }, 500);
  }, [updateGameState]);

  // 执行Boss回合
  const executeBossTurn = useCallback(() => {
    let newBossState = { ...gameState.boss };
    let newPlayerState = { ...gameState.player };
    let newMinions = [...gameState.minions];
    let logDetail = '';
    let usedSkillId: string | null = null;

    // 检查Boss是否被眩晕
    if (newBossState.isStunned && newBossState.stunnedTurns > 0) {
      newBossState.stunnedTurns -= 1;
      if (newBossState.stunnedTurns <= 0) {
        newBossState.isStunned = false;
      }
      
      addLog({
        turn: gameState.currentTurn,
        actor: 'boss',
        action: '眩晕中',
        detail: `算法霸主被冻结，无法行动！剩余${newBossState.stunnedTurns}回合`
      });

      finishBossTurn(newBossState, newPlayerState, newMinions, null);
      return;
    }

    // 检查是否在充能
    if (newBossState.isCharging) {
      newBossState.chargeProgress += 1;
      
      if (newBossState.chargeProgress >= 3) {
        // 充能完成，释放终极技能
        newPlayerState.currentHp = 0;
        logDetail = '终极过滤释放！信息过载！';
        usedSkillId = 'filter';
      } else {
        logDetail = `终极过滤充能中...（${newBossState.chargeProgress}/3）`;
        usedSkillId = 'filter';
      }

      addLog({
        turn: gameState.currentTurn,
        actor: 'boss',
        action: '终极过滤',
        detail: logDetail
      });

      finishBossTurn(newBossState, newPlayerState, newMinions, usedSkillId);
      return;
    }

    // Boss AI选择技能
    const availableSkills = newBossState.skills.filter(s => s.currentCooldown === 0);
    let selectedSkill: BossSkill | null = null;

    // 优先级逻辑
    const bossHpPercent = newBossState.currentHp / newBossState.maxHp;
    
    // 血量低于30%且终极过滤可用，开始充能
    if (bossHpPercent < 0.3 && availableSkills.find(s => s.id === 'filter')) {
      selectedSkill = availableSkills.find(s => s.id === 'filter')!;
    }
    // 没有护盾时优先开护盾
    else if (newBossState.shield === 0 && availableSkills.find(s => s.id === 'cocoon')) {
      selectedSkill = availableSkills.find(s => s.id === 'cocoon')!;
    }
    // 没有小怪时召唤小怪
    else if (newMinions.filter(m => m.isAlive).length === 0 && availableSkills.find(s => s.id === 'barrier')) {
      selectedSkill = availableSkills.find(s => s.id === 'barrier')!;
    }
    // 随机选择攻击或禁用技能
    else {
      const attackSkills = availableSkills.filter(s => s.id === 'traffic' || s.id === 'decay');
      if (attackSkills.length > 0) {
        selectedSkill = attackSkills[Math.floor(Math.random() * attackSkills.length)];
      }
    }

    // 如果没有可用技能，使用普通攻击
    if (!selectedSkill) {
      const damage = 12;
      let actualDamage = damage;

      // 检查玩家的伤害转化
      if (newPlayerState.damageConvert) {
        const convertRoll = Math.random() * 100;
        if (convertRoll < 30) {
          // 转化为治疗
          newPlayerState.currentHp = Math.min(newPlayerState.maxHp, newPlayerState.currentHp + damage);
          logDetail = `普通攻击被言灵·转化！转化为${damage}点治疗！`;
        } else {
          newPlayerState.currentHp = Math.max(0, newPlayerState.currentHp - actualDamage);
          logDetail = `普通攻击对玩家造成${actualDamage}点伤害！`;
        }
        newPlayerState.damageConvert = false;
      } else {
        newPlayerState.currentHp = Math.max(0, newPlayerState.currentHp - actualDamage);
        logDetail = `普通攻击对玩家造成${actualDamage}点伤害！`;
      }

      addLog({
        turn: gameState.currentTurn,
        actor: 'boss',
        action: '普通攻击',
        detail: logDetail
      });

      finishBossTurn(newBossState, newPlayerState, newMinions, null);
      return;
    }

    // 执行选中的技能
    usedSkillId = selectedSkill.id;

    switch (selectedSkill.id) {
      case 'cocoon':
        newBossState.shield = 10;
        newBossState.statusEffects = [
          ...newBossState.statusEffects,
          {
            id: 'shield',
            name: '信息茧房',
            icon: '🛡️',
            type: 'shield',
            value: 10,
            remainingTurns: 2,
            source: 'boss'
          }
        ];
        logDetail = '信息茧房激活！受到的伤害降低10%，持续2回合！';
        break;

      case 'traffic':
        let damage = selectedSkill.damage || 20;
        
        // 检查玩家的伤害转化
        if (newPlayerState.damageConvert) {
          const convertRoll = Math.random() * 100;
          if (convertRoll < 30) {
            newPlayerState.currentHp = Math.min(newPlayerState.maxHp, newPlayerState.currentHp + damage);
            logDetail = `流量操纵被言灵·转化！转化为${damage}点治疗！`;
          } else {
            // 检查玩家护盾
            if (newPlayerState.shield > 0) {
              damage = Math.floor(damage * (1 - newPlayerState.shield / 100));
            }
            newPlayerState.currentHp = Math.max(0, newPlayerState.currentHp - damage);
            logDetail = `流量操纵对玩家造成${damage}点伤害！`;
          }
          newPlayerState.damageConvert = false;
        } else {
          if (newPlayerState.shield > 0) {
            damage = Math.floor(damage * (1 - newPlayerState.shield / 100));
          }
          newPlayerState.currentHp = Math.max(0, newPlayerState.currentHp - damage);
          logDetail = `流量操纵对玩家造成${damage}点伤害！`;
        }
        break;

      case 'decay':
        // 随机禁用一个技能
        const enabledSkills = newPlayerState.skills.filter(s => !s.isDisabled);
        if (enabledSkills.length > 0) {
          const targetSkill = enabledSkills[Math.floor(Math.random() * enabledSkills.length)];
          newPlayerState.skills = newPlayerState.skills.map(s =>
            s.id === targetSkill.id ? { ...s, isDisabled: true, disabledTurns: 2 } : s
          );
          logDetail = `语义退化！"${targetSkill.name}"被禁用2回合！`;
        } else {
          logDetail = '语义退化释放，但没有可禁用的技能！';
        }
        break;

      case 'barrier':
        // 召唤两个小怪
        newMinions = [
          { ...MINION_TEMPLATE, id: 'minion_1', currentHp: MINION_TEMPLATE.maxHp },
          { ...MINION_TEMPLATE, id: 'minion_2', currentHp: MINION_TEMPLATE.maxHp }
        ];
        logDetail = '圈层壁垒！召唤了两个守门人！必须先消灭它们才能攻击Boss！';
        setShowTip(BATTLE_TIPS.minions);
        break;

      case 'filter':
        // 开始充能
        newBossState.isCharging = true;
        newBossState.chargeProgress = 1;
        logDetail = '终极过滤开始充能！（1/3）必须在3回合内打断！';
        setShowTip(BATTLE_TIPS.charging);
        break;
    }

    // 设置技能冷却
    newBossState.skills = newBossState.skills.map(s =>
      s.id === selectedSkill!.id ? { ...s, currentCooldown: s.cooldown } : s
    );

    addLog({
      turn: gameState.currentTurn,
      actor: 'boss',
      action: selectedSkill.name,
      detail: logDetail
    });

    finishBossTurn(newBossState, newPlayerState, newMinions, usedSkillId);
  }, [gameState, addLog]);

  const executeBossTurnRef = useRef<() => void>(() => {});
  useEffect(() => {
    executeBossTurnRef.current = executeBossTurn;
  }, [executeBossTurn]);

  // 完成Boss回合
  const finishBossTurn = useCallback((
    newBossState: typeof gameState.boss,
    newPlayerState: typeof gameState.player,
    newMinions: MinionState[],
    usedSkillId: string | null
  ) => {
    // 减少所有冷却时间
    newBossState.skills = newBossState.skills.map(s => ({
      ...s,
      currentCooldown: Math.max(0, s.currentCooldown - 1)
    }));

    newPlayerState.skills = newPlayerState.skills.map(s => ({
      ...s,
      currentCooldown: Math.max(0, s.currentCooldown - 1),
      disabledTurns: Math.max(0, s.disabledTurns - 1),
      isDisabled: s.disabledTurns > 1
    }));

    // 减少状态效果持续时间
    newBossState.statusEffects = newBossState.statusEffects
      .map(e => ({ ...e, remainingTurns: e.remainingTurns - 1 }))
      .filter(e => e.remainingTurns > 0);

    newPlayerState.statusEffects = newPlayerState.statusEffects
      .map(e => ({ ...e, remainingTurns: e.remainingTurns - 1 }))
      .filter(e => e.remainingTurns > 0);

    // 检查护盾是否过期
    if (!newBossState.statusEffects.find(e => e.type === 'shield')) {
      newBossState.shield = 0;
    }
    if (!newPlayerState.statusEffects.find(e => e.type === 'shield')) {
      newPlayerState.shield = 0;
    }

    // 检查暴击提升是否过期
    if (!newPlayerState.statusEffects.find(e => e.type === 'crit_boost')) {
      newPlayerState.critBoost = 0;
    }

    updateGameState({
      boss: newBossState,
      player: newPlayerState,
      minions: newMinions,
      lastBossSkill: usedSkillId as any,
      currentTurn: gameState.currentTurn + 1,
      isPlayerTurn: true
    });
  }, [gameState.currentTurn, updateGameState]);

  return (
    <div className="battle-arena">
      {/* 回合指示器 */}
      <TurnIndicator
        currentTurn={gameState.currentTurn}
        maxTurns={gameState.maxTurns}
        isPlayerTurn={gameState.isPlayerTurn}
      />

      {/* 战斗提示 */}
      {showTip && (
        <div className="battle-tip">
          <span className="tip-icon">💡</span>
          <span className="tip-text">{showTip}</span>
          <button className="close-tip" onClick={() => setShowTip(null)}>×</button>
        </div>
      )}

      {/* Boss显示区 */}
      <BossDisplay
        boss={gameState.boss}
        minions={gameState.minions}
        isAnimating={isAnimating}
        currentAnimation={currentAnimation}
      />

      {/* 战斗效果层 */}
      <BattleEffects animation={currentAnimation} />

      {/* 玩家显示区 */}
      <PlayerDisplay
        player={gameState.player}
        isAnimating={isAnimating}
      />

      {/* 技能面板 */}
      <SkillPanel
        skills={gameState.player.skills}
        isPlayerTurn={gameState.isPlayerTurn}
        isAnimating={isAnimating}
        onAttack={handlePlayerAttack}
        onUseSkill={handleUseSkill}
        lastBossSkill={gameState.lastBossSkill}
      />

      {/* 战斗日志 */}
      <BattleLog logs={gameState.battleLog} />
    </div>
  );
};

export default BattleArena;
