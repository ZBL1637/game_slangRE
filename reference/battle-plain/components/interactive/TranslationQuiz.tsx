import React, { useState } from 'react';
import { QuizQuestion } from '../../types';
import { Button } from '../ui/Button';
import { CheckCircle2, XCircle } from 'lucide-react';

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
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 max-w-2xl mx-auto shadow-xl">
      <h3 className="text-xl font-bold text-cyan-400 mb-4">{question.question}</h3>
      
      <div className="space-y-3 mb-6">
        {question.options.map((option) => (
          <div 
            key={option.id}
            onClick={() => !isSubmitted && setSelectedId(option.id)}
            className={`
              p-4 rounded-lg border-2 cursor-pointer transition-all
              ${isSubmitted 
                  ? option.isCorrect 
                      ? 'border-green-500 bg-green-500/10' 
                      : option.id === selectedId 
                          ? 'border-red-500 bg-red-500/10' 
                          : 'border-slate-700 opacity-50'
                  : selectedId === option.id 
                      ? 'border-cyan-500 bg-cyan-500/10' 
                      : 'border-slate-600 hover:border-slate-500 bg-slate-700/50'
              }
            `}
          >
            {option.text}
          </div>
        ))}
      </div>

      {!isSubmitted ? (
        <Button onClick={handleSubmit} disabled={!selectedId} fullWidth>
          提交翻译
        </Button>
      ) : (
        <div className={`p-4 rounded-lg flex items-start gap-3 ${isCorrect ? 'bg-green-900/30 text-green-200' : 'bg-red-900/30 text-red-200'}`}>
          {isCorrect ? <CheckCircle2 className="shrink-0" /> : <XCircle className="shrink-0" />}
          <div>
            <p className="font-bold">{isCorrect ? '回答正确' : '回答错误'}</p>
            <p className="text-sm mt-1 opacity-90">{isCorrect ? question.correctFeedback : question.wrongFeedback}</p>
            {!isCorrect && (
                <button 
                    onClick={() => { setIsSubmitted(false); setSelectedId(null); }}
                    className="mt-3 text-xs underline hover:text-white"
                >
                    重试
                </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};