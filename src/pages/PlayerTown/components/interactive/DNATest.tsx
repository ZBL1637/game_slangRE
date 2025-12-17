import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { DNA_QUESTIONS, GENRES, SCRIPT } from '../../data';
import { DNAResult, GameGenre } from '../../types';
import './DNATest.scss';

interface DNATestProps {
  onComplete: (results: DNAResult[]) => void;
  onClose: () => void;
}

export const DNATest: React.FC<DNATestProps> = ({ onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0); // 0 = intro, 1-8 = questions
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  const currentQuestion = DNA_QUESTIONS[currentStep - 1];
  const isIntro = currentStep === 0;
  const isLastQuestion = currentStep === DNA_QUESTIONS.length;
  const totalQuestions = DNA_QUESTIONS.length;

  // 选择选项
  const handleSelectOption = (optionIndex: number) => {
    if (!currentQuestion) return;

    if (currentQuestion.multi) {
      // 多选
      const maxPick = currentQuestion.maxPick || 2;
      if (selectedOptions.includes(optionIndex)) {
        setSelectedOptions(prev => prev.filter(i => i !== optionIndex));
      } else if (selectedOptions.length < maxPick) {
        setSelectedOptions(prev => [...prev, optionIndex]);
      }
    } else {
      // 单选
      setSelectedOptions([optionIndex]);
    }
  };

  // 下一题
  const handleNext = () => {
    if (isIntro) {
      setCurrentStep(1);
      return;
    }

    if (selectedOptions.length === 0) return;

    // 保存答案
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: selectedOptions
    };
    setAnswers(newAnswers);

    if (isLastQuestion) {
      // 计算结果
      const results = calculateResults(newAnswers);
      onComplete(results);
    } else {
      setCurrentStep(prev => prev + 1);
      setSelectedOptions([]);
    }
  };

  // 上一题
  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      const prevQuestion = DNA_QUESTIONS[currentStep - 2];
      setSelectedOptions(answers[prevQuestion.id] || []);
    }
  };

  // 计算结果
  const calculateResults = (finalAnswers: Record<string, number[]>): DNAResult[] => {
    const scores: Record<GameGenre, number> = {
      'MOBA': 0, '二次元': 0, '沙盒': 0, 'FPS': 0, '竞速': 0, '休闲': 0
    };

    DNA_QUESTIONS.forEach(question => {
      const picks = finalAnswers[question.id] || [];
      picks.forEach(index => {
        const option = question.options[index];
        GENRES.forEach(genre => {
          scores[genre] += option.weights[genre] || 0;
        });
      });
    });

    // 计算百分比
    const total = GENRES.reduce((sum, genre) => sum + scores[genre], 0) || 1;
    const percents = GENRES.map(genre => ({
      genre,
      percent: Math.round(scores[genre] / total * 100)
    }));

    // 确保总和为100%
    const sum = percents.reduce((acc, item) => acc + item.percent, 0);
    const diff = 100 - sum;
    if (diff !== 0) {
      const maxIndex = percents.reduce((maxIdx, item, idx, arr) =>
        item.percent > arr[maxIdx].percent ? idx : maxIdx, 0);
      percents[maxIndex].percent += diff;
    }

    return percents.sort((a, b) => b.percent - a.percent);
  };

  return (
    <div className="dna-test-overlay">
      <div className="dna-test-modal">
        {/* 关闭按钮 */}
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>

        {/* 进度条 */}
        {!isIntro && (
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${(currentStep / totalQuestions) * 100}%` }}
            ></div>
            <span className="progress-text">{currentStep} / {totalQuestions}</span>
          </div>
        )}

        {/* 介绍页 */}
        {isIntro && (
          <div className="intro-card">
            <div className="dna-icon">🧬</div>
            <h2>黑话DNA测试</h2>
            <p>{SCRIPT.ch3_dna_intro}</p>
            <p className="hint">回答8个问题，发现你的游戏语言基因</p>
            <button className="start-btn" onClick={handleNext}>
              开始测试
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* 问题卡片 */}
        {!isIntro && currentQuestion && (
          <div className="question-card">
            <h3 className="question-title">{currentQuestion.title}</h3>
            {currentQuestion.subtitle && (
              <p className="question-subtitle">{currentQuestion.subtitle}</p>
            )}

            <div className="options-list">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  className={`option-btn ${selectedOptions.includes(index) ? 'selected' : ''}`}
                  onClick={() => handleSelectOption(index)}
                >
                  <span className="option-check">
                    {selectedOptions.includes(index) ? (
                      <Check size={16} />
                    ) : (
                      <span className="empty-check"></span>
                    )}
                  </span>
                  <span className="option-label">{option.label}</span>
                </button>
              ))}
            </div>

            <div className="navigation">
              {currentStep > 1 && (
                <button className="nav-btn prev" onClick={handlePrev}>
                  <ArrowLeft size={18} />
                  上一题
                </button>
              )}
              <button 
                className="nav-btn next"
                onClick={handleNext}
                disabled={selectedOptions.length === 0}
              >
                {isLastQuestion ? '查看结果' : '下一题'}
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
