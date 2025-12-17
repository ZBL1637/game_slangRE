import React, { useState, useEffect, useRef } from 'react';
import { IntroSection } from './components/sections/Intro';
import { OutroSection } from './components/sections/Outro';
import { SkillTree } from './components/visuals/SkillTree';
import { FrequencyChart } from './components/visuals/FrequencyChart';
import { NetworkGraph } from './components/visuals/NetworkGraph';
import { TranslationQuiz } from './components/interactive/TranslationQuiz';
import { LogSortingQuiz } from './components/interactive/LogSortingQuiz';
import { SCRIPT, SKILL_TREE_DATA, FREQUENCY_DATA, NETWORK_NODES, NETWORK_LINKS, QUIZ_1, QUIZ_2_LOGS } from './data';
import { LogSnippet } from './types';
import { Trophy } from 'lucide-react';

function App() {
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
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30">
      
      {/* 1. Intro Section (Full Screen) */}
      <IntroSection onComplete={() => setIntroCompleted(true)} />

      {/* 2. Main Content (Revealed after Intro) */}
      {introCompleted && (
        <div ref={contentRef} className="container mx-auto px-4 sm:px-6 space-y-32 py-24">
          
          {/* Part A: Skill Tree */}
          <section className="space-y-8 animate-in fade-in duration-1000 slide-in-from-bottom-10">
            <div className="text-center max-w-3xl mx-auto space-y-4">
                <h2 className="text-3xl font-bold text-white">战斗技能树</h2>
                <div className="h-1 w-20 bg-cyan-600 mx-auto rounded"></div>
                <p className="text-slate-400">
                    {SCRIPT.ch2_skilltree_intro_1} {SCRIPT.ch2_skilltree_intro_2}
                </p>
                <p className="text-slate-400">
                    {SCRIPT.ch2_skilltree_intro_3} {SCRIPT.ch2_skilltree_intro_4}
                </p>
            </div>
            
            <SkillTree data={SKILL_TREE_DATA} />

            <div className="text-center max-w-2xl mx-auto bg-slate-900/50 p-6 rounded-lg border border-slate-800">
                <p className="text-slate-300 mb-4">{SCRIPT.ch2_skilltree_caption_main}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-400">
                    <p>{SCRIPT.ch2_skilltree_caption_detail_1}</p>
                    <p>{SCRIPT.ch2_skilltree_caption_detail_2}</p>
                    <p>{SCRIPT.ch2_skilltree_caption_detail_3}</p>
                </div>
            </div>
          </section>

          {/* Part B: Frequency & Network */}
          <section className="space-y-16">
             {/* Frequency Chart */}
            <div className="space-y-8">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-white mb-2">高频黑话榜</h2>
                    <p className="text-slate-400">{SCRIPT.ch2_freq_intro_1}</p>
                </div>
                <FrequencyChart data={FREQUENCY_DATA} />
            </div>

            {/* Network Graph */}
            <div className="space-y-8">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-white mb-2">黑话共现网络</h2>
                    <p className="text-slate-400">{SCRIPT.ch2_network_intro_1} {SCRIPT.ch2_network_intro_2}</p>
                </div>
                
                <div className="grid lg:grid-cols-3 gap-8 items-center">
                    <div className="lg:col-span-2">
                        <NetworkGraph nodes={NETWORK_NODES} links={NETWORK_LINKS} />
                    </div>
                    <div className="space-y-6 text-slate-400 text-sm bg-slate-900 p-6 rounded-xl border border-slate-800 h-fit">
                        <p className="flex items-start gap-3">
                            <span className="w-2 h-2 rounded-full bg-rose-500 mt-2 shrink-0"></span>
                            {SCRIPT.ch2_network_case_1}
                        </p>
                        <p className="flex items-start gap-3">
                            <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0"></span>
                            {SCRIPT.ch2_network_case_2}
                        </p>
                        <p className="italic text-slate-500 pt-4 border-t border-slate-800">
                            {SCRIPT.ch2_network_footer}
                        </p>
                    </div>
                </div>
            </div>
          </section>

          {/* Part C: Interactive Tasks */}
          <section className="space-y-24">
            
            {/* Quiz 1 */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 justify-center mb-8">
                    <span className="bg-cyan-900/50 text-cyan-400 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider border border-cyan-700/50">Task 01</span>
                    <h2 className="text-2xl font-bold text-white">术语翻译练习</h2>
                </div>
                <TranslationQuiz 
                    question={QUIZ_1} 
                    onComplete={() => setQuiz1Completed(true)} 
                />
            </div>

            {/* Quiz 2 (Only show after Quiz 1 is done? No, let user browse freely, but maybe fade it in) */}
            <div className={`space-y-8 transition-opacity duration-1000 ${quiz1Completed ? 'opacity-100' : 'opacity-50 pointer-events-none blur-sm'}`}>
                <div className="flex items-center gap-4 justify-center mb-8">
                     <span className="bg-cyan-900/50 text-cyan-400 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider border border-cyan-700/50">Task 02</span>
                    <h2 className="text-2xl font-bold text-white">团灭事故复盘</h2>
                </div>
                <p className="text-center text-slate-400 max-w-xl mx-auto -mt-4 mb-8">
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
                 <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-right duration-700">
                    <div className="bg-slate-800 text-white p-4 rounded-lg shadow-2xl border border-yellow-500/50 flex items-center gap-4 max-w-xs">
                        <div className="bg-yellow-500/20 p-3 rounded-full">
                            <Trophy size={24} className="text-yellow-500" />
                        </div>
                        <div>
                            <h4 className="font-bold text-yellow-400 text-sm">成就解锁</h4>
                            <p className="font-bold">{SCRIPT.ch2_achievement_title.replace("🏆 ", "")}</p>
                            <p className="text-xs text-slate-400 mt-1">{SCRIPT.ch2_achievement_reward}</p>
                        </div>
                    </div>
                </div>
            )}

          </section>

          {/* Outro */}
          {quiz2Completed && (
              <div className="animate-in fade-in duration-1000">
                  <OutroSection />
              </div>
          )}
          
          {/* Fallback Outro button if user gets stuck or lazy (after scrolling to bottom) */}
           {!quiz2Completed && (
              <div className="text-center opacity-50 hover:opacity-100 transition-opacity">
                  <p className="text-xs text-slate-600 mb-4">完成任务以解锁下一章入口... 或者</p>
                  <button onClick={() => setQuiz2Completed(true)} className="text-xs text-slate-500 underline">
                      [跳过练习直接结算]
                  </button>
              </div>
           )}

        </div>
      )}
    </div>
  );
}

export default App;