import React, { useState } from 'react';
import { SCRIPT, NPC_OPTIONS } from '../../data';
import { Button } from '../ui/Button';
import { HUD } from '../visuals/HUD';
import { User, MessageCircle } from 'lucide-react';

interface IntroSectionProps {
  onComplete: () => void;
}

export const IntroSection: React.FC<IntroSectionProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'narration' | 'dialogue_choice' | 'dialogue_result'>('narration');
  const [npcResponse, setNpcResponse] = useState<string>("");

  const handleOptionSelect = (response: string) => {
    setNpcResponse(response);
    setStep('dialogue_result');
  };

  const finishIntro = () => {
    onComplete();
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black -z-20"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 -z-10"></div>
      
      <div className="max-w-4xl w-full z-10">
        <div className="text-center mb-12 animate-in fade-in duration-1000 slide-in-from-top-10">
            <h1 className="text-cyan-500 text-sm font-bold tracking-[0.5em] mb-2">{SCRIPT.ch2_title_chapter_index}</h1>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                {SCRIPT.ch2_title_main}
            </h2>
            <p className="text-xl text-slate-400 italic font-light">{SCRIPT.ch2_title_sub}</p>
        </div>

        {/* HUD is always visible as "environment" */}
        <HUD />

        <div className="bg-slate-950/80 backdrop-blur-md border border-slate-700 p-8 rounded-2xl shadow-2xl max-w-2xl mx-auto mt-8">
            {/* NPC Header */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-800">
                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center border-2 border-yellow-500/50">
                    <User size={32} className="text-yellow-500" />
                </div>
                <div>
                    <h3 className="text-yellow-400 font-bold text-lg">{SCRIPT.ch2_npc_captain_name}</h3>
                    <p className="text-slate-500 text-xs">LV. ?? ?? ??</p>
                </div>
            </div>

            {/* Content Switcher */}
            <div className="min-h-[120px]">
                {step === 'narration' && (
                    <div className="space-y-4 animate-in fade-in duration-500">
                        <p className="text-slate-300 leading-relaxed">"{SCRIPT.ch2_dialog_captain_intro_1}"</p>
                        <p className="text-white text-xl font-bold font-mono tracking-wider">{SCRIPT.ch2_dialog_captain_intro_2}</p>
                        <div className="pt-4">
                             <Button onClick={() => setStep('dialogue_choice')} fullWidth variant="secondary">
                                 <MessageCircle size={18} className="inline mr-2" />
                                 回应团长
                             </Button>
                        </div>
                    </div>
                )}

                {step === 'dialogue_choice' && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-right-8 duration-300">
                        {NPC_OPTIONS.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => handleOptionSelect(opt.response)}
                                className="w-full text-left p-4 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-cyan-500 transition-all group"
                            >
                                <span className="text-slate-400 group-hover:text-cyan-300 mr-3">➢</span>
                                <span className="text-slate-200">{opt.text}</span>
                            </button>
                        ))}
                    </div>
                )}

                {step === 'dialogue_result' && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <p className="text-slate-200 text-lg leading-relaxed border-l-4 border-yellow-500 pl-4 py-2 bg-yellow-500/5 rounded-r">
                            {npcResponse}
                        </p>
                        <Button onClick={finishIntro} fullWidth>
                            开启技能树教程
                        </Button>
                    </div>
                )}
            </div>
        </div>
      </div>
      
      {/* Scroll Hint (Only after intro complete logic, effectively handled by next section appearing) */}
    </section>
  );
};