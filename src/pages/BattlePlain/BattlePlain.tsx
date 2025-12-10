import React, { useState, useEffect, useRef } from 'react';
import { IntroSection } from './components/layout/IntroSection';
import { OutroSection } from './components/layout/OutroSection';
import { SkillTree } from './components/visuals/SkillTree';
import { FrequencyChart } from './components/visuals/FrequencyChart';
import { NetworkGraph } from './components/visuals/NetworkGraph';
import { TranslationQuiz } from './components/interactive/TranslationQuiz';
import { LogSortingQuiz } from './components/interactive/LogSortingQuiz';
import { SCRIPT, SKILL_TREE_DATA, FREQUENCY_DATA, NETWORK_NODES, NETWORK_LINKS, QUIZ_1, QUIZ_2_LOGS } from './data';
import { Trophy } from 'lucide-react';
import './BattlePlain.scss';

const BattlePlain: React.FC = () => {
  const [introCompleted, setIntroCompleted] = useState(false);
  const [quiz1Completed, setQuiz1Completed] = useState(false);
  const [quiz2Completed, setQuiz2Completed] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (introCompleted && contentRef.current) {
        setTimeout(() => {
            contentRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
  }, [introCompleted]);

  return (
    <div className="battle-plain-page">
      
      {/* 1. Intro Section (Full Screen) */}
      <IntroSection onComplete={() => setIntroCompleted(true)} />

      {/* 2. Main Content (Revealed after Intro) */}
      {introCompleted && (
        <div ref={contentRef} className="main-content">
          
          {/* Part A: Skill Tree */}
          <section className="skill-tree-section">
            <div className="intro-text">
                <h2>战斗技能树</h2>
                <div className="divider"></div>
                <p>
                    {SCRIPT.ch2_skilltree_intro_1} {SCRIPT.ch2_skilltree_intro_2}
                </p>
                <p>
                    {SCRIPT.ch2_skilltree_intro_3} {SCRIPT.ch2_skilltree_intro_4}
                </p>
            </div>
            
            <SkillTree data={SKILL_TREE_DATA} />

            <div className="caption-box">
                <p className="main-caption">{SCRIPT.ch2_skilltree_caption_main}</p>
                <div className="details">
                    <p>{SCRIPT.ch2_skilltree_caption_detail_1}</p>
                    <p>{SCRIPT.ch2_skilltree_caption_detail_2}</p>
                    <p>{SCRIPT.ch2_skilltree_caption_detail_3}</p>
                </div>
            </div>
          </section>

          {/* Part B: Frequency & Network */}
          <section className="data-vis-section">
             {/* Frequency Chart */}
            <div className="chart-container">
                <div className="header">
                    <h2>高频黑话榜</h2>
                    <p>{SCRIPT.ch2_freq_intro_1}</p>
                </div>
                <FrequencyChart data={FREQUENCY_DATA} />
            </div>

            {/* Network Graph */}
            <div className="chart-container">
                <div className="header">
                    <h2>黑话共现网络</h2>
                    <p>{SCRIPT.ch2_network_intro_1} {SCRIPT.ch2_network_intro_2}</p>
                </div>
                
                <div className="network-layout">
                    <div className="graph-wrapper">
                        <NetworkGraph nodes={NETWORK_NODES} links={NETWORK_LINKS} />
                    </div>
                    <div className="case-study">
                        <div className="case-item">
                            <span className="dot rose"></span>
                            <p>{SCRIPT.ch2_network_case_1}</p>
                        </div>
                        <div className="case-item">
                            <span className="dot blue"></span>
                            <p>{SCRIPT.ch2_network_case_2}</p>
                        </div>
                        <p className="footer">
                            {SCRIPT.ch2_network_footer}
                        </p>
                    </div>
                </div>
            </div>
          </section>

          {/* Part C: Interactive Tasks */}
          <section className="interactive-section">
            
            {/* Quiz 1 */}
            <div className="quiz-block">
                <div className="quiz-header">
                    <span className="tag">Task 01</span>
                    <h2>术语翻译练习</h2>
                </div>
                <TranslationQuiz 
                    question={QUIZ_1} 
                    onComplete={() => setQuiz1Completed(true)} 
                />
            </div>

            {/* Quiz 2 */}
            <div className={`quiz-block ${quiz1Completed ? '' : 'locked'}`}>
                <div className="quiz-header">
                     <span className="tag">Task 02</span>
                    <h2>团灭事故复盘</h2>
                </div>
                <p className="instruction">
                    {SCRIPT.ch2_quiz2_instruction}
                </p>
                <LogSortingQuiz 
                    logs={QUIZ_2_LOGS}
                    onComplete={() => setQuiz2Completed(true)}
                    explanations={[
                        SCRIPT.ch2_quiz2_result_explanation_1,
                        SCRIPT.ch2_quiz2_result_explanation_2,
                        SCRIPT.ch2_quiz2_result_explanation_3,
                        SCRIPT.ch2_quiz2_result_explanation_4
                    ]}
                />
            </div>

            {/* Achievement Notification */}
            {quiz2Completed && (
                 <div className="achievement-toast">
                    <div className="toast-content">
                        <div className="icon-box">
                            <Trophy size={24} />
                        </div>
                        <div className="text-box">
                            <h4>成就解锁</h4>
                            <p className="title">{SCRIPT.ch2_achievement_title.replace("🏆 ", "")}</p>
                            <p className="reward">{SCRIPT.ch2_achievement_reward}</p>
                        </div>
                    </div>
                </div>
            )}

          </section>

          {/* Outro */}
          {quiz2Completed && (
              <div style={{ animation: 'fadeIn 1s ease-out' }}>
                  <OutroSection />
              </div>
          )}
          
          {/* Fallback Outro button */}
           {!quiz2Completed && (
              <div className="skip-option">
                  <p>完成任务以解锁下一章入口... 或者</p>
                  <button onClick={() => setQuiz2Completed(true)}>
                      [跳过练习直接结算]
                  </button>
              </div>
           )}

        </div>
      )}
    </div>
  );
};

export default BattlePlain;
