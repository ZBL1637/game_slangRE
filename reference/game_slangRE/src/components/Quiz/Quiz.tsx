import React, { useState, useEffect } from 'react';
import { Panel } from '@/components/Panel/Panel';
import { Button } from '@/components/Button/Button';
import { usePlayer } from '@/context/PlayerContext';
import { dataProcessor } from '@/utils/dataProcessor';
import { QuizItem } from '@/types';
import './Quiz.scss';

interface QuizProps {
  count?: number;
  onComplete?: (score: number) => void;
}

export const Quiz: React.FC<QuizProps> = ({ count = 5, onComplete }) => {
  const [questions, setQuestions] = useState<QuizItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  
  const { addExp } = usePlayer();

  useEffect(() => {
    setQuestions(dataProcessor.generateQuizBank(count));
  }, [count]);

  const handleOptionClick = (option: string) => {
    if (selectedOption) return; // Prevent double click
    setSelectedOption(option);
    
    const currentQuestion = questions[currentIndex];
    const isCorrect = option === currentQuestion.answer;
    
    setFeedback(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    // Auto advance after delay
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
        setFeedback(null);
      } else {
        setIsFinished(true);
        if (onComplete) onComplete(score + (isCorrect ? 1 : 0));
      }
    }, 1500);
  };

  const handleRestart = () => {
    setQuestions(dataProcessor.generateQuizBank(count));
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsFinished(false);
    setFeedback(null);
  };

  const handleClaimReward = () => {
    const exp = score * 50;
    addExp(exp);
    alert(`Claimed ${exp} EXP!`);
    handleRestart(); // Or close
  };

  if (questions.length === 0) return <div>Loading quiz...</div>;

  if (isFinished) {
    return (
      <Panel className="quiz-result">
        <h3>Quiz Completed!</h3>
        <div className="score-display">
          Score: {score} / {questions.length}
        </div>
        <div className="result-actions">
          <Button onClick={handleClaimReward}>Claim Reward & Restart</Button>
        </div>
      </Panel>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="quiz-container">
      <div className="quiz-progress">
        Question {currentIndex + 1} / {questions.length}
      </div>
      
      <Panel className="question-card">
        <p className="question-text">{currentQ.question}</p>
      </Panel>

      <div className="options-grid">
        {currentQ.options.map((opt, idx) => {
          let statusClass = '';
          if (selectedOption) {
            if (opt === currentQ.answer) statusClass = 'correct';
            else if (opt === selectedOption) statusClass = 'wrong';
            else statusClass = 'disabled';
          }

          return (
            <Button 
              key={idx} 
              className={`quiz-option ${statusClass}`}
              onClick={() => handleOptionClick(opt)}
              disabled={!!selectedOption}
              variant="secondary"
            >
              {opt}
            </Button>
          );
        })}
      </div>
      
      {feedback && (
        <div className={`feedback-toast ${feedback}`}>
          {feedback === 'correct' ? 'CORRECT! 🎉' : 'WRONG! ❌'}
        </div>
      )}
    </div>
  );
};
