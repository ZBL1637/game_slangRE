import React, { useState } from 'react';
import { QuizQuestion } from '../../types';
import { CheckCircle2, XCircle } from 'lucide-react';
import './TranslationQuiz.scss';

interface TranslationQuizProps {
  question: QuizQuestion;
  onComplete: () => void;
}

export const TranslationQuiz: React.FC<TranslationQuizProps> = ({ question, onComplete }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selectedId) return;
    setIsSubmitted(true);
    const selectedOption = question.options.find(o => o.id === selectedId);
    if (selectedOption?.isCorrect) {
      onComplete();
    }
  };

  const selectedOption = question.options.find(o => o.id === selectedId);
  const isCorrect = selectedOption?.isCorrect;

  return (
    <div className="translation-quiz">
      <h3>{question.question}</h3>
      
      <div className="quiz-content">
        <div className="options-list">
            {question.options.map((option) => {
                let statusClass = '';
                if (isSubmitted) {
                    if (option.isCorrect) statusClass = 'correct';
                    else if (option.id === selectedId) statusClass = 'incorrect';
                    else statusClass = 'disabled';
                } else {
                    if (selectedId === option.id) statusClass = 'selected';
                }

                return (
                    <div 
                        key={option.id}
                        onClick={() => !isSubmitted && setSelectedId(option.id)}
                        className={`option-item ${statusClass}`}
                    >
                        {option.text}
                    </div>
                );
            })}
        </div>

        {!isSubmitted ? (
            <div className="quiz-actions">
                <button 
                    onClick={handleSubmit} 
                    disabled={!selectedId} 
                    className="submit-btn"
                >
                    提交翻译
                </button>
            </div>
        ) : (
            <div className={`result-feedback ${isCorrect ? 'success' : 'error'}`}>
                <div className="feedback-text">
                    {isCorrect ? '回答正确' : '回答错误'}
                </div>
                <div className="explanation">
                    {isCorrect ? question.correctFeedback : question.wrongFeedback}
                </div>
                {!isCorrect && (
                    <button 
                        onClick={() => { setIsSubmitted(false); setSelectedId(null); }}
                        style={{ marginTop: '1rem', background: 'transparent', border: 'none', color: 'inherit', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.875rem' }}
                    >
                        重试
                    </button>
                )}
            </div>
        )}
      </div>
    </div>
  );
};
