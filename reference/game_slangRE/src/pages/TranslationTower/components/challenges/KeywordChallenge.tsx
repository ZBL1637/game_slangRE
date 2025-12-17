// KeywordChallenge - 挑战一：关键词对对碰
import React, { useState } from 'react';
import { KEYWORD_DATA } from '../../data';
import './KeywordChallenge.scss';

interface KeywordChallengeProps {
  onComplete: () => void;
  onClose: () => void;
}

export const KeywordChallenge: React.FC<KeywordChallengeProps> = ({
  onComplete,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const currentItem = KEYWORD_DATA[currentIndex];
  const isCorrect = selectedAnswer === currentItem.correctAnswer;

  // 选择答案
  const handleSelectAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  // 提交答案
  const handleSubmit = () => {
    if (!selectedAnswer) return;
    setShowResult(true);
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }
  };

  // 下一题
  const handleNext = () => {
    if (currentIndex < KEYWORD_DATA.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setIsComplete(true);
    }
  };

  // 完成挑战
  const handleFinish = () => {
    if (correctCount >= Math.ceil(KEYWORD_DATA.length * 0.6)) {
      onComplete();
    } else {
      // 重新开始
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setCorrectCount(0);
      setIsComplete(false);
    }
  };

  return (
    <div className="challenge-overlay">
      <div className="challenge-modal keyword-challenge">
        <button className="close-btn" onClick={onClose}>✕</button>

        <div className="challenge-header">
          <span className="challenge-icon">🔤</span>
          <h2>关键词对对碰</h2>
          <p>选择最合适的英文翻译</p>
        </div>

        {!isComplete ? (
          <>
            {/* 进度条 */}
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${((currentIndex + 1) / KEYWORD_DATA.length) * 100}%` }}
              ></div>
              <span className="progress-text">{currentIndex + 1}/{KEYWORD_DATA.length}</span>
            </div>

            {/* 题目区域 */}
            <div className="question-area">
              <div className="chinese-term">
                <span className="term-text">{currentItem.chinese}</span>
                <span className="pinyin">{currentItem.pinyin}</span>
              </div>

              <div className="arrow-indicator">→</div>

              <div className="options-grid">
                {currentItem.options.map((option, index) => (
                  <button
                    key={index}
                    className={`option-btn ${selectedAnswer === option ? 'selected' : ''} ${
                      showResult 
                        ? option === currentItem.correctAnswer 
                          ? 'correct' 
                          : selectedAnswer === option 
                            ? 'incorrect' 
                            : ''
                        : ''
                    }`}
                    onClick={() => handleSelectAnswer(option)}
                    disabled={showResult}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* 结果展示 */}
            {showResult && (
              <div className={`result-area ${isCorrect ? 'correct' : 'incorrect'}`}>
                <div className="result-header">
                  <span className="result-icon">{isCorrect ? '✅' : '❌'}</span>
                  <span className="result-text">{isCorrect ? '正确！' : '错误'}</span>
                </div>
                <div className="explanation">
                  <h4>翻译解析</h4>
                  <p>{currentItem.explanation}</p>
                </div>
                <div className="cultural-note">
                  <h4>文化背景</h4>
                  <p>{currentItem.culturalNote}</p>
                </div>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="action-buttons">
              {!showResult ? (
                <button 
                  className="submit-btn"
                  onClick={handleSubmit}
                  disabled={!selectedAnswer}
                >
                  确认答案
                </button>
              ) : (
                <button className="next-btn" onClick={handleNext}>
                  {currentIndex < KEYWORD_DATA.length - 1 ? '下一题 →' : '查看结果'}
                </button>
              )}
            </div>
          </>
        ) : (
          /* 完成界面 */
          <div className="complete-area">
            <div className={`score-display ${correctCount >= Math.ceil(KEYWORD_DATA.length * 0.6) ? 'pass' : 'fail'}`}>
              <span className="score-icon">
                {correctCount >= Math.ceil(KEYWORD_DATA.length * 0.6) ? '🎉' : '😢'}
              </span>
              <h3>
                {correctCount >= Math.ceil(KEYWORD_DATA.length * 0.6) 
                  ? '挑战成功！' 
                  : '再接再厉'}
              </h3>
              <p className="score-text">
                正确率: {correctCount}/{KEYWORD_DATA.length} 
                ({Math.round((correctCount / KEYWORD_DATA.length) * 100)}%)
              </p>
              <p className="pass-hint">
                {correctCount >= Math.ceil(KEYWORD_DATA.length * 0.6)
                  ? '你已掌握关键词翻译的精髓！'
                  : `需要正确 ${Math.ceil(KEYWORD_DATA.length * 0.6)} 题以上才能通过`}
              </p>
            </div>
            <button className="finish-btn" onClick={handleFinish}>
              {correctCount >= Math.ceil(KEYWORD_DATA.length * 0.6) ? '获得奖励' : '重新挑战'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
