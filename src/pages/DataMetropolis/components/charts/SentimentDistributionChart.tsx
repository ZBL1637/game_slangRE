import React, { useEffect, useRef, useState } from 'react';
import { SENTIMENT_DATA, CHART_COLORS } from '../../data';
import './SentimentDistributionChart.scss';

declare global {
  interface Window {
    echarts: any;
  }
}

export const SentimentDistributionChart: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartInstances = useRef<any[]>([]);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  useEffect(() => {
    const loadECharts = async () => {
      if (!window.echarts) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js';
        script.async = true;
        document.head.appendChild(script);
        
        await new Promise(resolve => {
          script.onload = resolve;
        });
      }
      
      initCharts();
    };

    loadECharts();

    return () => {
      chartInstances.current.forEach(instance => {
        if (instance) instance.dispose();
      });
    };
  }, []);

  const initCharts = () => {
    if (!containerRef.current || !window.echarts) return;

    // 清理已存在的实例
    chartInstances.current.forEach(instance => {
      if (instance) instance.dispose();
    });
    chartInstances.current = [];

    // 清空容器
    const gridContainer = containerRef.current.querySelector('.charts-grid');
    if (gridContainer) {
      gridContainer.innerHTML = '';
    }

    // 为每个游戏创建饼图
    SENTIMENT_DATA.forEach((gameData, index) => {
      const pieContainer = document.createElement('div');
      pieContainer.className = 'pie-chart-container';
      pieContainer.id = `sentiment-pie-${index}`;
      
      const grid = containerRef.current?.querySelector('.charts-grid');
      if (grid) {
        grid.appendChild(pieContainer);
      }

      const pieChart = window.echarts.init(pieContainer);
      chartInstances.current.push(pieChart);

      const pieData = [
        { 
          name: '中性', 
          value: gameData.neutral, 
          itemStyle: { color: CHART_COLORS.neutral } 
        },
        { 
          name: '正面', 
          value: gameData.positive, 
          itemStyle: { color: CHART_COLORS.positive } 
        },
        { 
          name: '负面', 
          value: gameData.negative, 
          itemStyle: { color: CHART_COLORS.negative } 
        }
      ];

      const option = {
        title: {
          text: gameData.game,
          left: 'center',
          bottom: 5,
          textStyle: {
            fontSize: 12,
            fontWeight: 'bold',
            color: '#ffffff'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}% ({d}%)',
          backgroundColor: 'rgba(0,0,0,0.8)',
          borderColor: '#7F0056',
          textStyle: {
            color: '#fff'
          }
        },
        series: [{
          name: '情感分布',
          type: 'pie',
          radius: ['25%', '55%'],
          center: ['50%', '45%'],
          data: pieData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            show: true,
            position: 'outside',
            formatter: '{d}%',
            fontSize: 10,
            color: '#ffffff'
          },
          labelLine: {
            show: true,
            length: 10,
            length2: 5,
            lineStyle: {
              color: '#ffffff',
              width: 1
            }
          }
        }],
        animationDuration: 800,
        animationEasing: 'cubicOut'
      };

      pieChart.setOption(option);

      // 点击事件
      pieChart.on('click', () => {
        setSelectedGame(gameData.game);
      });
    });

    // 响应式
    const handleResize = () => {
      chartInstances.current.forEach(instance => {
        instance?.resize();
      });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  };

  // 获取选中游戏的详细信息
  const getGameDetail = () => {
    if (!selectedGame) return null;
    return SENTIMENT_DATA.find(d => d.game === selectedGame);
  };

  const gameDetail = getGameDetail();

  return (
    <div className="sentiment-distribution-chart" ref={containerRef}>
      {/* 图例 */}
      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-color" style={{ background: CHART_COLORS.neutral }}></span>
          <span>中性</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: CHART_COLORS.positive }}></span>
          <span>正面</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: CHART_COLORS.negative }}></span>
          <span>负面</span>
        </div>
      </div>

      {/* 图表网格 */}
      <div className="charts-grid"></div>

      {/* 选中游戏详情 */}
      {gameDetail && (
        <div className="game-detail-panel">
          <h4>{gameDetail.game} 情感分布</h4>
          <div className="detail-stats">
            <div className="stat-item">
              <span className="stat-label">中性</span>
              <span className="stat-value">{gameDetail.neutral.toFixed(1)}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">正面</span>
              <span className="stat-value">{gameDetail.positive.toFixed(1)}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">负面</span>
              <span className="stat-value">{gameDetail.negative.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      )}

      <div className="chart-description">
        <p>
          <strong>图表说明：</strong>
          每个环形图展示一款游戏黑话的情感分布。
          注意观察哪款游戏的正面情感占比最高。
        </p>
      </div>
    </div>
  );
};
