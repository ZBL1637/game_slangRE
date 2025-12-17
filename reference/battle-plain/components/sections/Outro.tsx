import React from 'react';
import { SCRIPT } from '../../data';
import { Button } from '../ui/Button';
import { Map, ArrowRight } from 'lucide-react';

export const OutroSection: React.FC = () => {
  return (
    <section className="py-24 px-6 flex flex-col items-center justify-center bg-gradient-to-t from-slate-950 to-slate-900 border-t border-slate-800">
        <div className="max-w-2xl text-center space-y-8 mb-16">
            <h2 className="text-3xl font-bold text-white mb-8">章节总结</h2>
            
            <div className="space-y-4 text-slate-400 leading-relaxed text-lg">
                <p>{SCRIPT.ch2_outro_narration_1}</p>
                <p>{SCRIPT.ch2_outro_narration_2}</p>
                <hr className="border-slate-800 w-1/3 mx-auto my-6" />
                <p>{SCRIPT.ch2_outro_narration_3}</p>
                <p>{SCRIPT.ch2_outro_narration_4}</p>
                <p className="text-cyan-400 font-bold text-xl animate-pulse">{SCRIPT.ch2_outro_narration_5}</p>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg">
            <div className="flex-1">
                 <Button fullWidth className="h-full flex flex-col items-center justify-center gap-2 py-6">
                    <div className="flex items-center gap-2 text-lg">
                        <span>前往第三章</span>
                        <ArrowRight size={20} />
                    </div>
                    <span className="text-xs font-normal opacity-70">玩家生态城镇</span>
                </Button>
            </div>
           
           <div className="flex-1">
                <Button variant="secondary" fullWidth className="h-full flex flex-col items-center justify-center gap-2 py-6">
                    <div className="flex items-center gap-2 text-lg">
                        <Map size={20} />
                        <span>返回世界地图</span>
                    </div>
                    <span className="text-xs font-normal opacity-70">选择其他支线</span>
                </Button>
           </div>
        </div>
    </section>
  );
};