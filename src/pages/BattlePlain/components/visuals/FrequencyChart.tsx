import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { SlangTerm } from '../../types';
import { MessageSquare } from 'lucide-react';
import './FrequencyChart.scss';

interface FrequencyChartProps {
  data: SlangTerm[];
}

export const FrequencyChart: React.FC<FrequencyChartProps> = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const activeItem = data[activeIndex];

  return (
    <div className="frequency-chart-container">
      {/* Chart */}
      <div className="chart-wrapper">
        <h4>术语出现频率</h4>
        <ResponsiveContainer width="99%" height="100%">
          <BarChart 
            data={data} 
            layout="vertical"
            margin={{ top: 5, right: 10, left: 10, bottom: 5 }} // Minimal margins
            onClick={(state) => {
              if (state && state.activeTooltipIndex !== undefined) {
                setActiveIndex(state.activeTooltipIndex as number);
              }
            }}
          >
            <XAxis type="number" hide />
            <YAxis 
              dataKey="term" 
              type="category" 
              tick={{ fill: '#b2bec3', fontSize: 12 }} 
              width={50} // Fixed width for labels
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ backgroundColor: '#2d3436', border: 'none', borderRadius: '8px', color: '#fff' }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24} cursor="pointer">
               {data.map((_entry, index) => (
                <Cell 
                    key={`cell-${index}`} 
                    fill={index === activeIndex ? '#00b894' : '#636e72'} 
                    onClick={() => setActiveIndex(index)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Danmaku Wall */}
      <div className="danmaku-wall">
        <div className="wall-header">
            <MessageSquare size={16} color="#00b894" />
            <span className="term-name">{activeItem.term}</span>
            <span className="term-tag">真实弹幕采样</span>
        </div>
        
        <div className="danmaku-content">
             {/* Animated Fake Danmaku */}
            {activeItem.examples.map((ex, i) => (
                <div 
                    key={`${activeItem.term}-${i}`}
                    className="danmaku-item"
                    style={{ 
                        alignSelf: i % 2 === 0 ? 'flex-start' : 'flex-end',
                        animationDelay: `${i * 150}ms`
                    }}
                >
                    {ex}
                </div>
            ))}
             <div className="overlay-gradient"></div>
        </div>
      </div>
    </div>
  );
};
