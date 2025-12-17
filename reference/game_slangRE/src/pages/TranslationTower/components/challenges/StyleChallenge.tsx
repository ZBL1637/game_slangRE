// StyleChallenge - 挑战二：风格转换器
import React, { useState } from 'react';
import { TranslationStyle } from '../../types';
import { STYLE_DATA } from '../../data';
import './StyleChallenge.scss';

interface StyleChallengeProps {
  onComplete: () => void;
  onClose: () => void;
}

export const StyleChallenge: React.FC<StyleChallengeProps> = ({
  onComplete,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState<TranslationStyle | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [merchantReaction, setMerchantReaction] = useState<'neutral' | 'confused' | 'happy'>('neutral');
  const [experiencedCount, setExperiencedCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const currentItem = STYLE_DATA[currentIndex];

  // 选择翻译风格
  const handleSelectStyle = (style: TranslationStyle) => {
    setSelectedStyle(style);
    setShowComparison(true);
    
    // 根据选择更新商人反应
    const styleData = style === 'foreignization' 
      ? currentItem.foreignization 
      : currentItem.domestication;
    
    if (styleData.accessibility >= 80) {
      setMerchantReaction('happy');
    } else if (styleData.accessibility >= 60) {
      setMerchantReaction('neutral');
    } else {
      setMerchantReaction('confused');
    }
  };

  // 下一题
  const handleNext = () => {
    setExperiencedCount(prev => prev + 1);
    
    if (currentIndex < STYLE_DATA.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedStyle(null);
      setShowComparison(false);
      setMerchantReaction('neutral');
    } else {
      setIsComplete(true);
    }
  };

  // 获取商人表情
  const getMerchantEmoji = () => {
    switch (merchantReaction) {
      case 'happy': return '😊';
      case 'confused': return '😕';
      default: return '🤔';
    }
  };

  return (
    <div className="challenge-overlay">
      <div className="challenge-modal style-challenge">
        <button className="close-btn" onClick={onClose}>✕</button>

        <div className="challenge-header">
          <span className="challenge-icon">🔄</span>
          <h2>风格转换器</h2>
          <p>体验"异化"与"归化"两种翻译策略的差异</p>
        </div>

        {!isComplete ? (
          <>
            {/* 进度条 */}
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${((currentIndex + 1) / STYLE_DATA.length) * 100}%` }}
              ></div>
              <span className="progress-text">{currentIndex + 1}/{STYLE_DATA.length}</span>
            </div>

            {/* 原文展示 */}
            <div className="original-section">
              <div className="chinese-text">
                <span className="label">原文</span>
                <p className="text">{currentItem.chinese}</p>
              </div>
              <div className="context-text">
                <span className="label">语境</span>
                <p className="text">{currentItem.context}</p>
              </div>
            </div>

            {/* 风格选择按钮 */}
            <div className="style-buttons">
              <button
                className={`style-btn foreignization ${selectedStyle === 'foreignization' ? 'selected' : ''}`}
                onClick={() => handleSelectStyle('foreignization')}
                disabled={showComparison}
              >
                <span className="style-icon">🌏</span>
                <span className="style-name">异化翻译</span>
                <span className="style-desc">保留文化特色</span>
              </button>
              <button
                className={`style-btn domestication ${selectedStyle === 'domestication' ? 'selected' : ''}`}
                onClick={() => handleSelectStyle('domestication')}
                disabled={showComparison}
              >
                <span className="style-icon">🌍</span>
                <span className="style-name">归化翻译</span>
                <span className="style-desc">更易于理解</span>
              </button>
            </div>

            {/* 比较展示 */}
            {showComparison && selectedStyle && (
              <div className="comparison-section animate-fade-in">
                {/* 商人反应 */}
                <div className="merchant-reaction">
                  <span className="merchant-emoji">{getMerchantEmoji()}</span>
                  <span className="reaction-text">
                    {merchantReaction === 'happy' && '波斯商人：我完全理解了！'}
                    {merchantReaction === 'confused' && '波斯商人：这是什么意思？'}
                    {merchantReaction === 'neutral' && '波斯商人：大概明白了...'}
                  </span>
                </div>

                {/* 翻译结果 */}
                <div className="translation-result">
                  <div className="result-card selected">
                    <h4>你选择的翻译</h4>
                    <p className="translation-text">
                      {selectedStyle === 'foreignization' 
                        ? currentItem.foreignization.translation 
                        : currentItem.domestication.translation}
                    </p>
                    <p className="explanation">
                      {selectedStyle === 'foreignization' 
                        ? currentItem.foreignization.explanation 
                        : currentItem.domestication.explanation}
                    </p>
                  </div>
                </div>

                {/* 对比数据 */}
                <div className="comparison-bars">
                  <div className="bar-group">
                    <span className="bar-label">文化保留度</span>
                    <div className="bars">
                      <div className="bar foreignization">
                        <div 
                          className="bar-fill"
                          style={{ width: `${currentItem.foreignization.culturalPreservation}%` }}
                        ></div>
                        <span className="bar-value">{currentItem.foreignization.culturalPreservation}%</span>
                      </div>
                      <div className="bar domestication">
                        <div 
                          className="bar-fill"
                          style={{ width: `${currentItem.domestication.culturalPreservation}%` }}
                        ></div>
                        <span className="bar-value">{currentItem.domestication.culturalPreservation}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="bar-group">
                    <span className="bar-label">可理解度</span>
                    <div className="bars">
                      <div className="bar foreignization">
                        <div 
                          className="bar-fill"
                          style={{ width: `${currentItem.foreignization.accessibility}%` }}
                        ></div>
                        <span className="bar-value">{currentItem.foreignization.accessibility}%</span>
                      </div>
                      <div className="bar domestication">
                        <div 
                          className="bar-fill"
                          style={{ width: `${currentItem.domestication.accessibility}%` }}
                        ></div>
                        <span className="bar-value">{currentItem.domestication.accessibility}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="legend">
                    <span className="legend-item foreignization">🌏 异化</span>
                    <span className="legend-item domestication">🌍 归化</span>
                  </div>
                </div>

                <button className="next-btn" onClick={handleNext}>
                  {currentIndex < STYLE_DATA.length - 1 ? '下一个 →' : '完成挑战'}
                </button>
              </div>
            )}
          </>
        ) : (
          /* 完成界面 */
          <div className="complete-area">
            <div className="complete-content">
              <span className="complete-icon">🎉</span>
              <h3>挑战完成！</h3>
              <p className="complete-text">
                你已经体验了 {experiencedCount} 个翻译风格对比，
                理解了异化与归化策略在文化传播中的不同作用。
              </p>
              <div className="insight-box">
                <h4>核心洞察</h4>
                <p>
                  <strong>异化翻译</strong>保留原文的文化特色，适合传播独特的文化概念；
                  <strong>归化翻译</strong>更易于目标受众理解，适合日常交流。
                  优秀的翻译往往需要在两者之间找到平衡。
                </p>
              </div>
            </div>
            <button className="finish-btn" onClick={onComplete}>
              获得奖励
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
