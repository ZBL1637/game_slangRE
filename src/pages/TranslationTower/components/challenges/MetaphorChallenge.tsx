// MetaphorChallenge - 挑战三：文化隐喻连连看
import React, { useState } from 'react';
import { METAPHOR_DATA } from '../../data';
import './MetaphorChallenge.scss';

interface MetaphorChallengeProps {
  onComplete: () => void;
  onClose: () => void;
}

interface Connection {
  sourceId: string;
  targetId: string;
}

export const MetaphorChallenge: React.FC<MetaphorChallengeProps> = ({
  onComplete,
  onClose
}) => {
  // 随机选择4个题目
  const [questions] = useState(() => {
    const shuffled = [...METAPHOR_DATA].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  });

  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  // 文化源点（左侧）
  const sources = [
    { id: 'buddhism', name: '佛教教义', icon: '☸️' },
    { id: 'taoism', name: '道教文化', icon: '☯️' },
    { id: 'poetry', name: '古典诗词', icon: '📜' },
    { id: 'idiom', name: '成语典故', icon: '📚' }
  ];

  // 游戏元素（右侧）- 打乱顺序
  const [targets] = useState(() => {
    return questions.map(q => ({
      id: q.id,
      name: q.gameElement,
      correctSource: q.sourceType
    })).sort(() => Math.random() - 0.5);
  });

  // 选择源点
  const handleSelectSource = (sourceId: string) => {
    // 如果已经连接过这个源点，取消选择
    if (connections.some(c => c.sourceId === sourceId)) {
      setConnections(prev => prev.filter(c => c.sourceId !== sourceId));
    }
    setSelectedSource(sourceId);
  };

  // 选择目标
  const handleSelectTarget = (targetId: string) => {
    if (!selectedSource) return;
    
    // 如果目标已被连接，先移除旧连接
    const newConnections = connections.filter(c => c.targetId !== targetId && c.sourceId !== selectedSource);
    
    // 添加新连接
    newConnections.push({
      sourceId: selectedSource,
      targetId: targetId
    });
    
    setConnections(newConnections);
    setSelectedSource(null);
  };

  // 检查答案
  const handleSubmit = () => {
    let correct = 0;
    connections.forEach(conn => {
      const target = targets.find(t => t.id === conn.targetId);
      if (target && target.correctSource === conn.sourceId) {
        correct++;
      }
    });
    setCorrectCount(correct);
    setShowResult(true);
  };

  // 获取源点的连接目标
  const getConnectedTarget = (sourceId: string) => {
    return connections.find(c => c.sourceId === sourceId)?.targetId;
  };

  // 获取目标的连接源点
  const getConnectedSource = (targetId: string) => {
    return connections.find(c => c.targetId === targetId)?.sourceId;
  };

  return (
    <div className="challenge-overlay">
      <div className="challenge-modal metaphor-challenge">
        <button className="close-btn" onClick={onClose}>✕</button>

        <div className="challenge-header">
          <span className="challenge-icon">🔗</span>
          <h2>文化隐喻连连看</h2>
          <p>将文化源点与游戏元素正确连接</p>
        </div>

        {!showResult ? (
          <>
            <div className="instruction">
              <p>点击左侧的文化源点，再点击右侧对应的游戏元素进行连接</p>
            </div>

            <div className="matching-area">
              {/* 左侧：文化源点 */}
              <div className="sources-column">
                <h4>文化源点</h4>
                {sources.map(source => {
                  const connectedTarget = getConnectedTarget(source.id);
                  return (
                    <div
                      key={source.id}
                      className={`source-item ${selectedSource === source.id ? 'selected' : ''} ${connectedTarget ? 'connected' : ''}`}
                      onClick={() => handleSelectSource(source.id)}
                    >
                      <span className="item-icon">{source.icon}</span>
                      <span className="item-name">{source.name}</span>
                      {connectedTarget && (
                        <span className="connection-indicator">→</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 连接线区域 */}
              <div className="connection-lines">
                {connections.map((_, index) => (
                  <div key={index} className="connection-line">
                    <span className="line-dot"></span>
                    <span className="line-path"></span>
                    <span className="line-dot"></span>
                  </div>
                ))}
              </div>

              {/* 右侧：游戏元素 */}
              <div className="targets-column">
                <h4>游戏元素</h4>
                {targets.map(target => {
                  const connectedSource = getConnectedSource(target.id);
                  return (
                    <div
                      key={target.id}
                      className={`target-item ${connectedSource ? 'connected' : ''} ${selectedSource && !connectedSource ? 'available' : ''}`}
                      onClick={() => handleSelectTarget(target.id)}
                    >
                      <span className="item-name">{target.name}</span>
                      {connectedSource && (
                        <span className="connected-source">
                          {sources.find(s => s.id === connectedSource)?.icon}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 当前连接状态 */}
            <div className="connections-status">
              <span>已连接: {connections.length}/{targets.length}</span>
            </div>

            <button 
              className="submit-btn"
              onClick={handleSubmit}
              disabled={connections.length < targets.length}
            >
              提交答案
            </button>
          </>
        ) : (
          /* 结果展示 */
          <div className="result-area">
            <div className={`score-display ${correctCount >= 3 ? 'pass' : 'fail'}`}>
              <span className="score-icon">{correctCount >= 3 ? '🎉' : '😢'}</span>
              <h3>{correctCount >= 3 ? '挑战成功！' : '再接再厉'}</h3>
              <p className="score-text">正确连接: {correctCount}/{targets.length}</p>
            </div>

            {/* 详细解析 */}
            <div className="explanations">
              <h4>文化解析</h4>
              {questions.map(q => {
                const userConnection = connections.find(c => c.targetId === q.id);
                const isCorrect = userConnection?.sourceId === q.sourceType;
                
                return (
                  <div key={q.id} className={`explanation-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                    <div className="item-header">
                      <span className="status-icon">{isCorrect ? '✅' : '❌'}</span>
                      <span className="game-element">{q.gameElement}</span>
                      <span className="arrow">←</span>
                      <span className="source-type">
                        {sources.find(s => s.id === q.sourceType)?.name}
                      </span>
                    </div>
                    <p className="item-explanation">{q.explanation}</p>
                  </div>
                );
              })}
            </div>

            <button 
              className="finish-btn" 
              onClick={() => {
                if (correctCount >= 3) {
                  onComplete();
                } else {
                  // 重置
                  setConnections([]);
                  setShowResult(false);
                  setCorrectCount(0);
                }
              }}
            >
              {correctCount >= 3 ? '获得奖励' : '重新挑战'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
