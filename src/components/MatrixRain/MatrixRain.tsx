import React, { useEffect, useRef } from 'react';
import { dataProcessor } from '@/utils/dataProcessor';
import './MatrixRain.scss';

const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 获取术语列表并过滤
    const allTerms = dataProcessor.getAllTerms();
    // 过滤掉过长的术语，只保留 6 个字符以内的，以防视觉过于混乱
    // 优先使用短词 (如 RPG, DOT, 坦克)
    const terms = allTerms
      .map(t => t.term)
      .filter(t => t.length <= 4 && t.length > 0);
    
    // 如果没有数据 (极少情况)，使用默认词库
    const dictionary = terms.length > 0 ? terms : ["RPG", "EXP", "HP", "MP", "STR", "DEX", "INT", "LUK", "DEF", "ATK", "RNG", "AOE", "DPS", "DOT", "PVP", "PVE", "NPC", "GM", "BUG", "LAG", "AFK", "GG", "GL", "HF"];

    // 初始化画布尺寸
    const initCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    initCanvas();

    const fontSize = 7;
    // 适当增加列间距，避免单词过度重叠
    // 之前是 fontSize (14px)，现在设为 20px
    const columnWidth = 14; 
    let columns = Math.floor(canvas.width / columnWidth);
    let drops = Array(columns).fill(1);

    const drawMatrix = () => {
      // 拖尾背景
      ctx.fillStyle = "rgba(26, 27, 38, 0.1)"; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 使用像素字体或更具游戏感的字体，回退到楷体
      // 'Press Start 2P' 主要针对英文，中文使用楷体系列
      ctx.font = `${fontSize}px "Press Start 2P", "KaiTi", "STKaiti", "KaiTi_GB2312", serif`;

      for (let i = 0; i < drops.length; i++) {
        // 随机选取一个术语
        const text = dictionary[Math.floor(Math.random() * dictionary.length)];
        
        ctx.fillStyle = "#fdcb6e"; 
        
        // x 坐标基于 columnWidth
        ctx.fillText(text, i * columnWidth, drops[i] * fontSize);

        // 当超出底部且以一定概率重置为顶部
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    // 启动动画
    const intervalId = setInterval(drawMatrix, 50);

    // 窗口大小变化处理
    const handleResize = () => {
      initCanvas();
      columns = Math.floor(canvas.width / columnWidth);
      drops = Array(columns).fill(1);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="matrix-rain-canvas" />;
};

export default MatrixRain;
