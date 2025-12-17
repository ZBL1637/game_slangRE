import React, { useState, useCallback } from 'react';
import { X, Check, AlertCircle, HelpCircle } from 'lucide-react';
import { DataNode } from '../../types';
import { SCRIPT } from '../../data';
import { TermDistributionChart } from '../charts/TermDistributionChart';
import { SentimentDistributionChart } from '../charts/SentimentDistributionChart';
import { CategorySentimentChart } from '../charts/CategorySentimentChart';
import { MultiGameRadarChart } from '../charts/MultiGameRadarChart';
import './DataNodeExplorer.scss';

interface DataNodeExplorerProps {
  node: DataNode;
  onComplete: (nodeId: string) => void;
  onClose: () => void;
}

type ExplorerStep = 'intro' | 'chart' | 'question' | 'result';

export const DataNodeExplorer: React.FC<DataNodeExplorerProps> = ({
  node,
  onComplete,
  onClose
}) => {
  const [step, setStep] = useState<ExplorerStep>('intro');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);

  // 获取NPC介绍文本
  const getNpcIntro = () => {
    switch (node.id) {
      case 'node_1': return SCRIPT.ch4_npc_node1_intro;
      case 'node_2': return SCRIPT.ch4_npc_node2_intro;
      case 'node_3': return SCRIPT.ch4_npc_node3_intro;
      case 'node_4': return SCRIPT.ch4_npc_node4_intro;
      default: return '';
    }
  };

  // 渲染对应的图表
  const renderChart = () => {
    switch (node.id) {
      case 'node_1':
        return <TermDistributionChart />;
      case 'node_2':
        return <SentimentDistributionChart />;
      case 'node_3':
        return <CategorySentimentChart />;
      case 'node_4':
        return <MultiGameRadarChart />;
      default:
        return null;
    }
  };

  // 开始探索
  const handleStartExplore = useCallback(() => {
    setStep('chart');
  }, []);

  // 准备回答问题
  const handleReadyToAnswer = useCallback(() => {
    setStep('question');
  }, []);

  // 提交答案
  const handleSubmitAnswer = useCallback(() => {
    if (selectedOption === null) return;
    
    const correct = selectedOption === node.question.correctIndex;
    setIsCorrect(correct);
    setStep('result');
  }, [selectedOption, node.question.correctIndex]);

  // 完成节点
  const handleComplete = useCallback(() => {
    onComplete(node.id);
  }, [node.id, onComplete]);

  // 重试
  const handleRetry = useCallback(() => {
    setSelectedOption(null);
    setIsCorrect(null);
    setShowHint(false);
    setStep('chart');
  }, []);

  return (
    <div className="data-node-explorer-overlay">
      <div className="explorer-modal">
        {/* 关闭按钮 */}
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* 节点标题 */}
        <div className="node-header" style={{ borderColor: node.color }}>
          <span className="node-icon">{node.icon}</span>
          <div className="node-title">
            <h2>{node.name}</h2>
            <p>{node.description}</p>
          </div>
        </div>

        {/* 介绍阶段 */}
        {step === 'intro' && (
          <div className="intro-content animate-fade-in">
            <div className="npc-message">
              <div className="npc-avatar">🧙</div>
              <div className="message-bubble">
                <p>{getNpcIntro()}</p>
              </div>
            </div>
            <button className="action-btn primary" onClick={handleStartExplore}>
              开始探索
            </button>
          </div>
        )}

        {/* 图表阶段 */}
        {step === 'chart' && (
          <div className="chart-content animate-fade-in">
            <div className="chart-container">
              {renderChart()}
            </div>
            <div className="chart-actions">
              <p className="instruction">仔细观察图表，找出其中的规律</p>
              <button className="action-btn primary" onClick={handleReadyToAnswer}>
                我准备好回答问题了
              </button>
            </div>
          </div>
        )}

        {/* 问题阶段 */}
        {step === 'question' && (
          <div className="question-content animate-fade-in">
            <div className="question-box">
              <h3>{node.question.question}</h3>
              
              {/* 提示 */}
              <div className="hint-section">
                <button 
                  className="hint-btn"
                  onClick={() => setShowHint(!showHint)}
                >
                  <HelpCircle size={16} />
                  {showHint ? '隐藏提示' : '显示提示'}
                </button>
                {showHint && (
                  <p className="hint-text">{node.question.hint}</p>
                )}
              </div>

              {/* 选项 */}
              <div className="options-list">
                {node.question.options.map((option, index) => (
                  <button
                    key={option.value}
                    className={`option-btn ${selectedOption === index ? 'selected' : ''}`}
                    onClick={() => setSelectedOption(index)}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                    <span className="option-label">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="question-actions">
              <button className="action-btn secondary" onClick={() => setStep('chart')}>
                返回查看图表
              </button>
              <button 
                className="action-btn primary" 
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
              >
                提交答案
              </button>
            </div>
          </div>
        )}

        {/* 结果阶段 */}
        {step === 'result' && (
          <div className="result-content animate-fade-in">
            <div className={`result-box ${isCorrect ? 'correct' : 'incorrect'}`}>
              <div className="result-icon">
                {isCorrect ? (
                  <Check size={48} />
                ) : (
                  <AlertCircle size={48} />
                )}
              </div>
              <h3>{isCorrect ? '回答正确！' : '回答错误'}</h3>
              <p className="explanation">{node.question.explanation}</p>
            </div>

            <div className="result-actions">
              {isCorrect ? (
                <button className="action-btn primary" onClick={handleComplete}>
                  完成节点
                </button>
              ) : (
                <>
                  <button className="action-btn secondary" onClick={handleRetry}>
                    重新尝试
                  </button>
                  <button className="action-btn primary" onClick={handleComplete}>
                    继续（跳过）
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
