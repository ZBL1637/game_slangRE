// ============================================================================
// 第三章：玩家生态城镇 - 主组件
// ============================================================================

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';

import { IntroSection } from './components/layout/IntroSection';
import { TownMap } from './components/layout/TownMap';
import { DNATest } from './components/interactive/DNATest';
import { DNAReport } from './components/interactive/DNAReport';
import { AIQueryPanel } from './components/interactive/AIQueryPanel';
import { FloatingTerms } from './components/visuals/FloatingTerms';
import { SkillUnlock } from './components/layout/SkillUnlock';
import { OutroSection } from './components/layout/OutroSection';

import { Chapter3Phase, DNAResult } from './types';
import { SCRIPT } from './data';

import './PlayerTown.scss';

export const PlayerTown: React.FC = () => {
  const navigate = useNavigate();
  const { completeChapter } = usePlayer();
  
  // 章节状态
  const [phase, setPhase] = useState<Chapter3Phase>('intro');
  const [dnaCompleted, setDnaCompleted] = useState(false);
  const [dnaResult, setDnaResult] = useState<DNAResult[] | null>(null);
  const [queriedTerms, setQueriedTerms] = useState<string[]>([]);
  const [exploredTerms, setExploredTerms] = useState<string[]>([]);
  const [skillUnlocked, setSkillUnlocked] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const [showSkillToast, setShowSkillToast] = useState(false);
  
  // 当前活动的建筑/功能
  const [, setActiveBuilding] = useState<string | null>(null);
  const [showAIPanel, setShowAIPanel] = useState(false);

  // 完成入场
  const handleIntroComplete = useCallback(() => {
    setPhase('exploration');
  }, []);

  // 进入DNA测试
  const handleEnterDNATest = useCallback(() => {
    setActiveBuilding('identity_center');
    setPhase('dna_test');
  }, []);

  // DNA测试完成
  const handleDNAComplete = useCallback((results: DNAResult[]) => {
    setDnaResult(results);
    setDnaCompleted(true);
    setPhase('dna_result');
  }, []);

  // 关闭DNA报告
  const handleCloseDNAReport = useCallback(() => {
    setActiveBuilding(null);
    setPhase('exploration');
  }, []);

  // 进入档案馆
  const handleEnterArchive = useCallback(() => {
    setActiveBuilding('archive_hall');
    setShowAIPanel(true);
  }, []);

  // 关闭AI面板
  const handleCloseAIPanel = useCallback(() => {
    setShowAIPanel(false);
    setActiveBuilding(null);
  }, []);

  // 查询黑话
  const handleQueryTerm = useCallback((term: string) => {
    if (!queriedTerms.includes(term)) {
      const newQueriedTerms = [...queriedTerms, term];
      setQueriedTerms(newQueriedTerms);
      
      // 检查是否达成目标（查询10个黑话）
      if (newQueriedTerms.length >= 10 && !skillUnlocked) {
        // 显示成就
        setShowAchievement(true);
        setTimeout(() => setShowAchievement(false), 3000);
        
        // 延迟显示技能解锁
        setTimeout(() => {
          setPhase('skill_unlock');
        }, 3500);
      }
    }
  }, [queriedTerms, skillUnlocked]);

  // 探索漂浮词汇
  const handleExploreTerm = useCallback((term: string) => {
    if (!exploredTerms.includes(term)) {
      setExploredTerms(prev => [...prev, term]);
    }
    // 同时计入查询
    handleQueryTerm(term);
  }, [exploredTerms, handleQueryTerm]);

  // 技能解锁完成
  const handleSkillUnlock = useCallback(() => {
    setSkillUnlocked(true);
    setShowSkillToast(true);
    setTimeout(() => setShowSkillToast(false), 4000);
    setPhase('outro');
  }, []);

  // 章节完成
  const handleChapterComplete = useCallback(() => {
    completeChapter(3);
    navigate('/world-map');
  }, [navigate]);

  return (
    <div className="player-town-page">
      <div className="main-content">
        
        {/* 入场阶段 */}
        {phase === 'intro' && <IntroSection onComplete={handleIntroComplete} />}

        {/* 探索阶段 - 城镇地图 */}
        {phase === 'exploration' && (
          <>
            <TownMap
              dnaCompleted={dnaCompleted}
              queriedCount={queriedTerms.length}
              onEnterDNATest={handleEnterDNATest}
              onEnterArchive={handleEnterArchive}
            />
            
            {/* 漂浮黑话词汇 */}
            <FloatingTerms 
              onTermClick={handleExploreTerm}
              exploredTerms={exploredTerms}
            />
            
            {/* 进度提示 */}
            <div className="progress-hint">
              <span>已了解黑话: {queriedTerms.length} / 10</span>
              {queriedTerms.length >= 10 && !skillUnlocked && (
                <span className="complete-hint">✓ 目标达成！</span>
              )}
            </div>
          </>
        )}

        {/* DNA测试 */}
        {phase === 'dna_test' && (
          <DNATest 
            onComplete={handleDNAComplete}
            onClose={() => {
              setActiveBuilding(null);
              setPhase('exploration');
            }}
          />
        )}

        {/* DNA报告 */}
        {phase === 'dna_result' && dnaResult && (
          <DNAReport 
            results={dnaResult}
            onClose={handleCloseDNAReport}
          />
        )}

        {/* AI查询面板 */}
        {showAIPanel && (
          <AIQueryPanel 
            onQuery={handleQueryTerm}
            queriedTerms={queriedTerms}
            onClose={handleCloseAIPanel}
          />
        )}

        {/* 技能解锁 */}
        {phase === 'skill_unlock' && (
          <SkillUnlock onUnlock={handleSkillUnlock} />
        )}

        {/* 结尾 */}
        {phase === 'outro' && (
          <div className="outro-overlay">
            <OutroSection onComplete={handleChapterComplete} />
          </div>
        )}

        {/* 成就通知 */}
        {showAchievement && (
          <div className="achievement-toast">
            <div className="toast-content">
              <div className="icon-box">
                <Trophy size={24} />
              </div>
              <div className="text-box">
                <h4>成就解锁</h4>
                <p className="title">黑话通晓者</p>
                <p className="reward">了解了10个游戏黑话</p>
              </div>
            </div>
          </div>
        )}

        {/* 技能获得通知 */}
        {showSkillToast && (
          <div className="skill-toast">
            <div className="toast-content">
              <div className="icon-box">
                <span>🔊</span>
              </div>
              <div className="text-box">
                <h4>新技能获得</h4>
                <p className="title">{SCRIPT.ch3_skill_name}</p>
                <p className="desc">{SCRIPT.ch3_skill_desc}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PlayerTown;
