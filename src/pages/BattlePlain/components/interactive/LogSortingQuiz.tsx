import React, { useState, useEffect } from 'react';
import { LogSnippet } from '../../types';
import { ArrowRight, RefreshCcw, Check } from 'lucide-react';
import './LogSortingQuiz.scss';

interface LogSortingQuizProps {
  logs: LogSnippet[];
  onComplete: () => void;
  explanations: string[];
}

export const LogSortingQuiz: React.FC<LogSortingQuizProps> = ({ logs, onComplete, explanations }) => {
  // Store snippets in two lists: available and timeline
  const [available, setAvailable] = useState<LogSnippet[]>([]);
  const [timeline, setTimeline] = useState<LogSnippet[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [mistakeCount, setMistakeCount] = useState(0);

  useEffect(() => {
    // Shuffle initial
    const shuffled = [...logs].sort(() => Math.random() - 0.5);
    setAvailable(shuffled);
  }, [logs]);

  const addToTimeline = (snippet: LogSnippet) => {
    setAvailable(prev => prev.filter(p => p.id !== snippet.id));
    setTimeline(prev => [...prev, snippet]);
  };

  const removeFromTimeline = (snippet: LogSnippet) => {
    setTimeline(prev => prev.filter(p => p.id !== snippet.id));
    setAvailable(prev => [...prev, snippet]);
  };

  const checkOrder = () => {
    const currentOrder = timeline.map(t => t.order);
    const sortedOrder = [...currentOrder].sort((a, b) => a - b);
    
    // Check if fully filled and sorted
    const isFull = timeline.length === logs.length;
    const isSorted = JSON.stringify(currentOrder) === JSON.stringify(sortedOrder);
    
    if (isFull && isSorted) {
      setIsCorrect(true);
      setShowResult(true);
      onComplete();
    } else {
      setIsCorrect(false);
      setShowResult(true);
      setMistakeCount(prev => prev + 1);
    }
  };

  const reset = () => {
    setTimeline([]);
    setAvailable([...logs].sort(() => Math.random() - 0.5));
    setShowResult(false);
    setIsCorrect(false);
  };

  return (
    <div className="log-sorting-quiz">
      
      {/* Timeline Area */}
      <div className="timeline-area">
        <div className="header">
          <h4>
            <span>战斗时间轴 (点击下方选项填入)</span>
          </h4>
          <span className="count">{timeline.length} / {logs.length}</span>
        </div>
        
        <div className="timeline-list">
            {timeline.length === 0 && (
                <div className="empty-state">
                    时间轴为空，请从下方选择事件...
                </div>
            )}
            {timeline.map((item, index) => (
                <div key={item.id} className="timeline-item">
                    <div className="time-label">00:0{index + 1}</div>
                    <button 
                        onClick={() => !showResult && removeFromTimeline(item)}
                        className="item-button"
                        disabled={showResult}
                    >
                        {item.text}
                        {!showResult && <span className="remove-hint">移除</span>}
                    </button>
                </div>
            ))}
        </div>
      </div>

      {/* Available Snippets */}
      {!showResult && (
        <div className="available-snippets">
            {available.map(item => (
                <button
                    key={item.id}
                    onClick={() => addToTimeline(item)}
                    className="snippet-button"
                >
                    <span>{item.text}</span>
                </button>
            ))}
        </div>
      )}

      {/* Action Bar */}
      {!showResult && timeline.length === logs.length && (
          <div className="action-bar">
              <button onClick={checkOrder} className="verify-btn">验证顺序</button>
          </div>
      )}

      {/* Result Area */}
      {showResult && (
          <div className={`result-area ${isCorrect ? 'success' : 'failure'}`}>
              <div className="result-header">
                  {isCorrect ? <Check size={24} className="icon" /> : <RefreshCcw size={24} className="icon" />}
                  <h3>
                      {isCorrect ? '复盘成功' : '顺序有误'}
                  </h3>
              </div>
              
              {!isCorrect ? (
                  <div className="retry-section">
                      <p>事情发展的逻辑似乎不太对... 试试重新排序？</p>
                      {mistakeCount >= 3 && (
                        <p className="hint-text" style={{ color: '#fdcb6e', fontSize: '0.875rem', marginBottom: '1rem' }}>
                          💡 提示：先是 <b>CD全交</b> 导致输出过高，然后 <b>T没拉住OT</b>，接着 <b>机制混乱</b>，最后 <b>团灭</b>。
                        </p>
                      )}
                      <button onClick={reset} className="retry-btn">重新复盘</button>
                  </div>
              ) : (
                  <div className="explanation-section">
                      <p className="title">团灭真相解析：</p>
                      <ul>
                          {explanations.map((exp, i) => (
                              <li key={i}>
                                  <ArrowRight size={16} className="bullet-icon" />
                                  <span>{exp}</span>
                              </li>
                          ))}
                      </ul>
                  </div>
              )}
          </div>
      )}
    </div>
  );
};
