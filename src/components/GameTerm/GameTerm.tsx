import React from 'react';
import { Tooltip } from '@/components/Tooltip/Tooltip';
import { usePlayer } from '@/context/PlayerContext';
import { dataProcessor } from '@/utils/dataProcessor';
import './GameTerm.scss';

interface GameTermProps {
  termId: string; // 术语 ID (对应 words_all_data 中的 title 或 scraped_data 中的 term)
  children?: React.ReactNode; // 可选：如果显示文本与 ID 不同
}

export const GameTerm: React.FC<GameTermProps> = ({ termId, children }) => {
  const { state } = usePlayer();
  const termData = dataProcessor.getTerm(termId);
  
  // 如果找不到术语数据，直接渲染文本
  if (!termData) {
    console.warn(`GameTerm: ID "${termId}" not found.`);
    return <span className="game-term-missing">{children || termId}</span>;
  }

  const displayContent = children || termData.term;

  // 如果新手模式关闭，只渲染高亮文本，不带 Tooltip
  if (!state.newPlayerMode) {
    return <span className="game-term-highlight">{displayContent}</span>;
  }

  // 构造 Tooltip 内容
  const tooltipContent = (
    <div className="term-tooltip-content">
      <div className="term-header">
        <span className="term-title">{termData.term}</span>
        <span className="term-game">{termData.games[0] || 'General'}</span>
      </div>
      <p className="term-def">{termData.definition}</p>
      <div className="term-hint">💡 Click to view in Dictionary</div>
    </div>
  );

  return (
    <Tooltip content={tooltipContent} position="top">
      <span 
        className="game-term active" 
        onClick={() => {
          // TODO: 可以在这里触发跳转到图鉴详情，或者完成"查看术语"的任务
          console.log(`Clicked term: ${termId}`);
        }}
      >
        {displayContent}
      </span>
    </Tooltip>
  );
};
