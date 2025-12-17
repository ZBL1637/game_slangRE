import React, { useState, useEffect } from 'react';
import { LogSnippet } from '../../types';
import { Button } from '../ui/Button';
import { ArrowRight, RefreshCcw, Check } from 'lucide-react';

interface LogSortingQuizProps {
  logs: LogSnippet[];
  onComplete: () => void;
  explanations: string[];
}

export const LogSortingQuiz: React.FC<LogSortingQuizProps> = ({ logs, onComplete, explanations }) => {
  // Store snippets in two lists: available and timeline
  const [available, setAvailable] = useState<LogSnippet[]>([]);
  const [timeline, setTimeline] = useState<LogSnippet[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    // Shuffle initial
    const shuffled = [...logs].sort(() => Math.random() - 0.5);
    setAvailable(shuffled);
  }, [logs]);

  const addToTimeline = (snippet: LogSnippet) => {
    setAvailable(prev => prev.filter(p => p.id !== snippet.id));
    setTimeline(prev => [...prev, snippet]);
  };

  const removeFromTimeline = (snippet: LogSnippet) => {
    setTimeline(prev => prev.filter(p => p.id !== snippet.id));
    setAvailable(prev => [...prev, snippet]);
  };

  const checkOrder = () => {
    const currentOrder = timeline.map(t => t.order);
    const sortedOrder = [...currentOrder].sort((a, b) => a - b);
    
    // Check if fully filled and sorted
    const isFull = timeline.length === logs.length;
    const isSorted = JSON.stringify(currentOrder) === JSON.stringify(sortedOrder);
    
    if (isFull && isSorted) {
      setIsCorrect(true);
      setShowResult(true);
      onComplete();
    } else {
      setIsCorrect(false);
      setShowResult(true);
    }
  };

  const reset = () => {
    setTimeline([]);
    setAvailable([...logs].sort(() => Math.random() - 0.5));
    setShowResult(false);
    setIsCorrect(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Timeline Area */}
      <div className="bg-slate-900/80 p-6 rounded-xl border border-slate-700 min-h-[120px]">
        <h4 className="text-slate-400 text-sm font-bold mb-4 uppercase tracking-wider flex items-center justify-between">
            <span>战斗时间轴 (点击下方选项填入)</span>
            <span className="text-cyan-500">{timeline.length} / {logs.length}</span>
        </h4>
        
        <div className="space-y-3">
            {timeline.length === 0 && (
                <div className="text-slate-600 text-center py-4 italic border border-dashed border-slate-700 rounded">
                    时间轴为空，请从下方选择事件...
                </div>
            )}
            {timeline.map((item, index) => (
                <div key={item.id} className="flex items-center gap-4 animate-in slide-in-from-left-4 fade-in duration-300">
                    <div className="text-slate-500 font-mono text-xs w-12 text-right">00:0{index + 1}</div>
                    <button 
                        onClick={() => !showResult && removeFromTimeline(item)}
                        className="flex-1 text-left bg-slate-800 hover:bg-red-900/30 hover:border-red-500/50 border border-slate-600 p-3 rounded text-sm transition-colors group relative"
                        disabled={showResult}
                    >
                        {item.text}
                        {!showResult && <span className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-red-400 text-xs">移除</span>}
                    </button>
                    {index < timeline.length - 1 && (
                         <div className="absolute left-6 h-4 w-px bg-slate-700 -bottom-4 z-0"></div>
                    )}
                </div>
            ))}
        </div>
      </div>

      {/* Available Snippets */}
      {!showResult && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {available.map(item => (
                <button
                    key={item.id}
                    onClick={() => addToTimeline(item)}
                    className="bg-slate-800 hover:bg-cyan-900/30 hover:border-cyan-500 border border-slate-600 p-4 rounded text-left transition-all hover:-translate-y-1 shadow-md active:scale-95"
                >
                    <span className="text-slate-300">{item.text}</span>
                </button>
            ))}
        </div>
      )}

      {/* Action Bar */}
      {!showResult && timeline.length === logs.length && (
          <div className="flex justify-center">
              <Button onClick={checkOrder} className="px-12">验证顺序</Button>
          </div>
      )}

      {/* Result Area */}
      {showResult && (
          <div className={`p-6 rounded-xl border ${isCorrect ? 'bg-green-950/30 border-green-500/50' : 'bg-red-950/30 border-red-500/50'} animate-in zoom-in-95`}>
              <div className="flex items-center gap-3 mb-4">
                  {isCorrect ? <Check size={24} className="text-green-400" /> : <RefreshCcw size={24} className="text-red-400" />}
                  <h3 className={`text-xl font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                      {isCorrect ? '复盘成功' : '顺序有误'}
                  </h3>
              </div>
              
              {!isCorrect ? (
                  <div className="text-slate-300">
                      <p>事情发展的逻辑似乎不太对... 试试重新排序？</p>
                      <Button onClick={reset} variant="secondary" className="mt-4">重新复盘</Button>
                  </div>
              ) : (
                  <div className="space-y-4">
                      <p className="font-bold text-slate-200 mb-2">团灭真相解析：</p>
                      <ul className="space-y-2 text-slate-300 text-sm">
                          {explanations.map((exp, i) => (
                              <li key={i} className="flex gap-2">
                                  <ArrowRight size={16} className="mt-1 shrink-0 text-cyan-500" />
                                  <span>{exp}</span>
                              </li>
                          ))}
                      </ul>
                  </div>
              )}
          </div>
      )}
    </div>
  );
};