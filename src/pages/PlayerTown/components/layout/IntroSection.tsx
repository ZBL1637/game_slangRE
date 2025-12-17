import React, { useState, useEffect } from 'react';
import { SCRIPT } from '../../data';
import './IntroSection.scss';

interface IntroSectionProps {
  onComplete: () => void;
}

type IntroStep = 'entrance' | 'title';

export const IntroSection: React.FC<IntroSectionProps> = ({
  onComplete
}) => {
  const [step, setStep] = useState<IntroStep>('entrance');
  const [fadeOut, setFadeOut] = useState(false);

  // 入场动画序列
  useEffect(() => {
    const timers: Array<ReturnType<typeof setTimeout>> = [];
    timers.push(setTimeout(() => setStep('title'), 1200));
    timers.push(setTimeout(() => {
      setFadeOut(true);
    }, 2800));
    timers.push(setTimeout(() => {
      onComplete();
    }, 3300));

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <section className={`intro-section ${fadeOut ? 'fade-out' : ''}`}>
      {step === 'entrance' && (
        <div className="entrance-screen">
          <div className="entrance-text animate-fade-in">
            <p>第三章</p>
            <p>CHAPTER 3</p>
          </div>
        </div>
      )}

      {step === 'title' && (
        <div className="title-screen">
          <div className="title-content animate-scale-in">
            <span className="chapter-index">CHAPTER 3</span>
            <h1>{SCRIPT.ch3_title}</h1>
            <p className="subtitle">{SCRIPT.ch3_subtitle}</p>
          </div>
        </div>
      )}
    </section>
  );
};
