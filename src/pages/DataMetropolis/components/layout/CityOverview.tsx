import React, { useState, useEffect } from 'react';
import { Check, Lock, ChevronRight } from 'lucide-react';
import { DataNode } from '../../types';
import { SCRIPT } from '../../data';
import './CityOverview.scss';

import chapter4Bg from '@/assets/images/chapter4_data_bg.png';

// 导入节点图标图片
import nodeSpectrum from '@/assets/images/node_spectrum.png';
import nodeSentiment from '@/assets/images/node_sentiment.png';
import nodeCategory from '@/assets/images/node_category.png';
import nodeMultigame from '@/assets/images/node_multigame.png';

// 节点图标映射
const nodeIconMap: Record<string, string> = {
  'node_1': nodeSpectrum,
  'node_2': nodeSentiment,
  'node_3': nodeCategory,
  'node_4': nodeMultigame,
};

interface CityOverviewProps {
  nodes: DataNode[];
  onNodeSelect: (nodeId: string) => void;
  allCompleted: boolean;
}

export const CityOverview: React.FC<CityOverviewProps> = ({
  nodes,
  onNodeSelect,
  allCompleted
}) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [dataStreams, setDataStreams] = useState<Array<{ id: number; x: number; delay: number }>>([]);

  // 生成数据流动画
  useEffect(() => {
    const streams = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5
    }));
    setDataStreams(streams);
  }, []);

  // 获取下一个可用节点
  const getNextAvailableNode = () => {
    return nodes.find(n => !n.completed);
  };

  const nextNode = getNextAvailableNode();

  return (
    <section className="city-overview-section">
      <div className="chapter-bg" style={{ backgroundImage: `url(${chapter4Bg})` }} />
      <div className="chapter-bg-overlay" />
      {/* 背景效果 */}
      <div className="city-background">
        {/* 数据流 */}
        <div className="data-streams">
          {dataStreams.map(stream => (
            <div
              key={stream.id}
              className="data-stream"
              style={{
                left: `${stream.x}%`,
                animationDelay: `${stream.delay}s`
              }}
            />
          ))}
        </div>

        {/* 网格 */}
        <div className="grid-overlay"></div>

        {/* 词云星空 */}
        <div className="word-cloud-sky">
          {['YYDS', '破防', '氪金', '肝帝', '欧皇', '非酋', 'GG', 'MVP'].map((word, i) => (
            <span
              key={word}
              className="floating-word"
              style={{
                left: `${10 + i * 12}%`,
                top: `${5 + (i % 3) * 8}%`,
                animationDelay: `${i * 0.5}s`
              }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* 标题 */}
      <div className="section-header">
        <h2>{SCRIPT.ch4_title}</h2>
        <p>完成四个数据节点的解谜挑战</p>
      </div>

      {/* 数据节点网格 */}
      <div className="nodes-container">
        <div className="nodes-grid">
          {nodes.map((node, index) => {
            const isAvailable = index === 0 || nodes[index - 1].completed;
            const isHovered = hoveredNode === node.id;
            const nodeIcon = nodeIconMap[node.id];

            return (
              <div
                key={node.id}
                className={`node-card ${node.completed ? 'completed' : ''} ${isAvailable ? 'available' : 'locked'} ${isHovered ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => isAvailable && onNodeSelect(node.id)}
              >
                {/* 节点光效 */}
                <div className="node-glow" style={{ background: `radial-gradient(circle, ${node.color}40, transparent)` }}></div>

                {/* 节点图标 */}
                <div className="node-icon" style={{ borderColor: node.color }}>
                  {node.completed ? (
                    <Check size={32} className="check-icon" />
                  ) : !isAvailable ? (
                    <Lock size={24} className="lock-icon" />
                  ) : nodeIcon ? (
                    <img src={nodeIcon} alt={node.name} className="node-icon-image" />
                  ) : (
                    <span className="icon-emoji">{node.icon}</span>
                  )}
                </div>

                {/* 节点信息 */}
                <div className="node-info">
                  <h3>{node.name}</h3>
                  <p>{node.description}</p>
                </div>

                {/* 状态标签 */}
                <div className="node-status">
                  {node.completed ? (
                    <span className="status completed">已完成</span>
                  ) : isAvailable ? (
                    <button className="enter-btn" style={{ background: `linear-gradient(135deg, ${node.color}, ${node.color}cc)` }}>
                      进入探索
                      <ChevronRight size={16} />
                    </button>
                  ) : (
                    <span className="status locked">未解锁</span>
                  )}
                </div>

                {/* 连接线 */}
                {index < nodes.length - 1 && (
                  <div className={`connector ${nodes[index].completed ? 'active' : ''}`}></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 任务提示 */}
      <div className="quest-hint">
        <div className="quest-content">
          <span className="quest-icon">📋</span>
          <div className="quest-text">
            <h4>当前任务</h4>
            {allCompleted ? (
              <p>所有数据节点已完成！准备获取技能...</p>
            ) : nextNode ? (
              <p>前往「{nextNode.name}」完成数据解谜</p>
            ) : (
              <p>探索数据之城</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
