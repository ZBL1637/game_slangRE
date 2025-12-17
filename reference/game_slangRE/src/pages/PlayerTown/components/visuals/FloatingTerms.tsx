import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { FLOATING_TERMS } from '../../data';
import { FloatingTerm } from '../../types';
import './FloatingTerms.scss';

interface FloatingTermsProps {
  onTermClick: (term: string) => void;
  exploredTerms: string[];
}

interface TermPosition {
  id: string;
  x: number;
  y: number;
  speed: number;
  delay: number;
  direction: number;
}

export const FloatingTerms: React.FC<FloatingTermsProps> = ({
  onTermClick,
  exploredTerms
}) => {
  const [positions, setPositions] = useState<TermPosition[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<FloatingTerm | null>(null);
  const [visibleTerms, setVisibleTerms] = useState<FloatingTerm[]>([]);

  // 初始化漂浮词汇位置
  useEffect(() => {
    // 随机选择15个词汇显示
    const shuffled = [...FLOATING_TERMS].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 15);
    setVisibleTerms(selected);

    // 读取城镇容器矩形，避开该区域
    const townEl = document.querySelector('.town-container') as HTMLElement | null;
    const rect = townEl?.getBoundingClientRect();
    const margin = 24; // 额外避让边距

    const pickPos = (_index: number): { x: number; y: number; speed: number; delay: number; direction: number } => {
      let attempts = 0;
      let xPct = 5 + Math.random() * 90; // 5% - 95%
      let yPct = 8 + Math.random() * 84; // 8% - 92%
      const winW = window.innerWidth || 1920;
      const winH = window.innerHeight || 1080;
      let xPx = (xPct / 100) * winW;
      let yPx = (yPct / 100) * winH;

      const intersectsTown = () => {
        if (!rect) return false;
        return xPx >= rect.left - margin && xPx <= rect.right + margin &&
               yPx >= rect.top - margin && yPx <= rect.bottom + margin;
      };

      while (intersectsTown() && attempts < 100) {
        xPct = 5 + Math.random() * 90;
        yPct = 8 + Math.random() * 84;
        xPx = (xPct / 100) * winW;
        yPx = (yPct / 100) * winH;
        attempts++;
      }

      return {
        x: xPct,
        y: yPct,
        speed: 0.5 + Math.random() * 1.5,
        delay: _index * 0.2,
        direction: Math.random() > 0.5 ? 1 : -1
      };
    };

    const newPositions: TermPosition[] = selected.map((term, _index) => ({
      id: term.id,
      ...pickPos(_index)
    }));
    setPositions(newPositions);

    const handleResize = () => {
      setPositions(selected.map((term, _index) => ({ id: term.id, ...pickPos(_index) })));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 点击词汇
  const handleTermClick = useCallback((term: FloatingTerm) => {
    setSelectedTerm(term);
  }, []);

  // 关闭详情
  const handleCloseDetail = useCallback(() => {
    if (selectedTerm) {
      onTermClick(selectedTerm.term);
    }
    setSelectedTerm(null);
  }, [selectedTerm, onTermClick]);

  // 获取情感颜色
  const getEmotionColor = (emotion?: string) => {
    switch (emotion) {
      case 'positive': return '#22c55e';
      case 'negative': return '#ef4444';
      default: return '#3b82f6';
    }
  };

  // 获取情感标签
  const getEmotionLabel = (emotion?: string) => {
    switch (emotion) {
      case 'positive': return '正面';
      case 'negative': return '负面';
      default: return '中性';
    }
  };

  return (
    <div className={`floating-terms-container ${selectedTerm ? 'has-detail' : ''}`}>
      {/* 漂浮词汇 */}
      {visibleTerms.map((term, _index) => {
        const pos = positions.find(p => p.id === term.id);
        const isExplored = exploredTerms.includes(term.term);
        
        if (!pos) return null;

        return (
          <div
            key={term.id}
            className={`floating-term ${isExplored ? 'explored' : ''}`}
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              animationDelay: `${pos.delay}s`,
              animationDuration: `${3 + pos.speed}s`
            }}
            onClick={() => handleTermClick(term)}
          >
            <span className="term-text">{term.term}</span>
            {isExplored && <span className="explored-mark">✓</span>}
          </div>
        );
      })}

      {/* 词汇详情弹窗 */}
      {selectedTerm && (
        <div className="term-detail-overlay" onClick={handleCloseDetail}>
          <div className="term-detail-card" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={handleCloseDetail}>
              <X size={20} />
            </button>

            <div className="term-header">
              <h3 className="term-name">{selectedTerm.term}</h3>
              <span 
                className="term-category"
                style={{ borderColor: getEmotionColor(selectedTerm.emotion) }}
              >
                {selectedTerm.category}
              </span>
            </div>

            <div className="term-content">
              <div className="info-row">
                <span className="label">📖 释义</span>
                <p>{selectedTerm.definition}</p>
              </div>

              <div className="info-row">
                <span className="label">💬 例句</span>
                <p className="example">"{selectedTerm.example}"</p>
              </div>

              <div className="info-row inline">
                <span className="label">🎭 情感</span>
                <span 
                  className="emotion-tag"
                  style={{ 
                    background: getEmotionColor(selectedTerm.emotion),
                    color: '#fff'
                  }}
                >
                  {getEmotionLabel(selectedTerm.emotion)}
                </span>
              </div>

              {selectedTerm.origin && (
                <div className="info-row">
                  <span className="label">📜 起源</span>
                  <p>{selectedTerm.origin}</p>
                </div>
              )}
            </div>

            <button className="confirm-btn" onClick={handleCloseDetail}>
              我学会了！
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
