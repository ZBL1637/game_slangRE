import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { SlangTerm } from '../../types';
import { MessageSquare } from 'lucide-react';

interface FrequencyChartProps {
  data: SlangTerm[];
}

export const FrequencyChart: React.FC<FrequencyChartProps> = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const activeItem = data[activeIndex];

  return (
    <div className="grid md:grid-cols-2 gap-8 items-center bg-slate-900/50 p-6 rounded-xl border border-slate-800">
      {/* Chart */}
      <div className="h-64 md:h-80 w-full">
        <h4 className="text-slate-400 text-sm font-bold mb-4 uppercase tracking-wider text-center">术语出现频率</h4>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            onClick={(state) => {
              if (state && state.activeTooltipIndex !== undefined) {
                setActiveIndex(state.activeTooltipIndex);
              }
            }}
          >
            <XAxis type="number" hide />
            <YAxis 
              dataKey="term" 
              type="category" 
              tick={{ fill: '#94a3b8', fontSize: 12 }} 
              width={40}
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24} cursor="pointer">
               {data.map((entry, index) => (
                <Cell 
                    key={`cell-${index}`} 
                    fill={index === activeIndex ? '#0ea5e9' : '#334155'} 
                    onClick={() => setActiveIndex(index)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Danmaku Wall */}
      <div className="bg-slate-950/80 rounded-lg p-4 h-64 md:h-80 border border-slate-700 relative overflow-hidden flex flex-col">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
            <MessageSquare size={16} className="text-cyan-500" />
            <span className="text-slate-300 font-bold">{activeItem.term}</span>
            <span className="text-slate-500 text-xs ml-auto">真实弹幕采样</span>
        </div>
        
        <div className="flex-1 flex flex-col justify-center gap-4 relative">
             {/* Animated Fake Danmaku */}
            {activeItem.examples.map((ex, i) => (
                <div 
                    key={`${activeItem.term}-${i}`}
                    className="bg-slate-800/80 text-cyan-100 px-3 py-2 rounded-full text-sm w-fit shadow-md whitespace-nowrap animate-in fade-in slide-in-from-bottom-4 duration-500"
                    style={{ 
                        alignSelf: i % 2 === 0 ? 'flex-start' : 'flex-end',
                        animationDelay: `${i * 150}ms`
                    }}
                >
                    {ex}
                </div>
            ))}
             <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/20 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};