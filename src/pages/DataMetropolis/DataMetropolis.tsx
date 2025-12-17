import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '@/context/PlayerContext';
import { GamePhase, DataNode } from './types';
import { DATA_NODES } from './data';
import { IntroSection } from './components/layout/IntroSection';
import { CityOverview } from './components/layout/CityOverview';
import { DataNodeExplorer } from './components/layout/DataNodeExplorer';
import { SkillUnlock } from './components/layout/SkillUnlock';
import { OutroSection } from './components/layout/OutroSection';
import './DataMetropolis.scss';

export const DataMetropolis: React.FC = () => {
  const navigate = useNavigate();
  const { completeChapter } = usePlayer();
  
  // 游戏状态
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [nodes, setNodes] = useState<DataNode[]>(DATA_NODES);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [skillUnlocked, setSkillUnlocked] = useState(false);
  
  // 检查是否所有节点都已完成
  const allNodesCompleted = nodes.every(node => node.completed);
  
  // 当所有节点完成时，显示技能解锁
  useEffect(() => {
    if (allNodesCompleted && phase === 'city_overview' && !skillUnlocked) {
      setTimeout(() => {
        setPhase('skill_unlock');
      }, 1000);
    }
  }, [allNodesCompleted, phase, skillUnlocked]);
  
  // 完成入场
  const handleIntroComplete = useCallback(() => {
    setPhase('city_overview');
  }, []);
  
  // 选择数据节点
  const handleNodeSelect = useCallback((nodeId: string) => {
    setCurrentNodeId(nodeId);
    const nodePhase = nodeId as GamePhase;
    setPhase(nodePhase);
  }, []);
  
  // 完成数据节点
  const handleNodeComplete = useCallback((nodeId: string) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, completed: true } : node
    ));
    setCurrentNodeId(null);
    setPhase('city_overview');
  }, []);
  
  // 关闭数据节点
  const handleNodeClose = useCallback(() => {
    setCurrentNodeId(null);
    setPhase('city_overview');
  }, []);
  
  // 技能解锁完成
  const handleSkillUnlock = useCallback(() => {
    setSkillUnlocked(true);
    setPhase('outro');
  }, []);
  
  // 章节完成
  const handleChapterComplete = useCallback(() => {
    completeChapter(4);
    navigate('/world-map');
  }, [navigate, completeChapter]);
  
  // 跳过章节（开发用）
  const handleSkip = useCallback(() => {
    setPhase('outro');
  }, []);
  
  // 获取当前节点
  const currentNode = currentNodeId 
    ? nodes.find(n => n.id === currentNodeId) 
    : null;
  
  return (
    <div className="data-metropolis-page">
      <main className="main-content">
        {/* 入场动画 */}
        {phase === 'intro' && (
          <IntroSection onComplete={handleIntroComplete} />
        )}
        
        {/* 城市概览 */}
        {phase === 'city_overview' && (
          <CityOverview 
            nodes={nodes}
            onNodeSelect={handleNodeSelect}
            allCompleted={allNodesCompleted}
          />
        )}
        
        {/* 数据节点探索 */}
        {currentNode && (
          <DataNodeExplorer
            node={currentNode}
            onComplete={handleNodeComplete}
            onClose={handleNodeClose}
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
      </main>
      
      {/* 跳过选项（开发用；技能解锁阶段不显示） */}
      {phase !== 'outro' && phase !== 'skill_unlock' && (
        <div className="skip-option">
          <p>开发选项</p>
          <button onClick={handleSkip}>跳过章节</button>
        </div>
      )}
      
      {/* 进度提示 */}
      {phase === 'city_overview' && (
        <div className="progress-hint">
          <span>已完成: {nodes.filter(n => n.completed).length} / {nodes.length}</span>
          {allNodesCompleted && (
            <span className="complete-hint">全部完成！</span>
          )}
        </div>
      )}
    </div>
  );
};

export default DataMetropolis;
