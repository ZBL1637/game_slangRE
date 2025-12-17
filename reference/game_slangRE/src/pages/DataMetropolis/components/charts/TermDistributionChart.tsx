import React, { useEffect, useRef, useState } from 'react';
import { TERM_DISTRIBUTION_DATA, TERM_CATEGORIES, CHART_COLORS } from '../../data';
import './TermDistributionChart.scss';

// 注意：此组件使用ECharts库，需要在项目中安装：npm install echarts
// 如果使用其他图表库（如Recharts），需要相应修改

declare global {
  interface Window {
    echarts: any;
  }
}

export const TermDistributionChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  useEffect(() => {
    // 动态加载ECharts
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
      
      initChart();
    };

    loadECharts();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, []);

  const initChart = () => {
    if (!chartRef.current || !window.echarts) return;

    // 清理已存在的实例
    if (chartInstance.current) {
      chartInstance.current.dispose();
    }

    chartInstance.current = window.echarts.init(chartRef.current);

    // 准备数据
    const games = TERM_DISTRIBUTION_DATA.map(d => d.game);
    
    // 构建系列数据
    const series = TERM_CATEGORIES.map((category, index) => ({
      name: category,
      type: 'bar',
      stack: 'total',
      data: TERM_DISTRIBUTION_DATA.map(d => d.categories[category] || 0),
      itemStyle: {
        color: CHART_COLORS.categories[index % CHART_COLORS.categories.length]
      },
      emphasis: {
        focus: 'series'
      }
    }));

    const option = {
      title: {
        text: '游戏术语分类分布',
        left: 'center',
        top: 10,
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold',
          color: '#ffffff'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params: any) {
          let result = params[0].axisValue + '<br/>';
          params.forEach((param: any) => {
            if (param.value > 0) {
              result += param.marker + param.seriesName + ': ' + (param.value * 100).toFixed(1) + '%<br/>';
            }
          });
          return result;
        },
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderColor: '#7F0056',
        textStyle: {
          color: '#fff'
        }
      },
      legend: {
        type: 'scroll',
        orient: 'horizontal',
        top: 40,
        left: 'center',
        itemWidth: 14,
        itemHeight: 14,
        textStyle: {
          fontSize: 11,
          color: '#e5e7eb'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: 100,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: games,
        axisLabel: {
          rotate: 45,
          fontSize: 11,
          color: '#e5e7eb'
        },
        axisLine: {
          lineStyle: {
            color: '#4b5563'
          }
        }
      },
      yAxis: {
        type: 'value',
        max: 1,
        axisLabel: {
          formatter: function(value: number) {
            return (value * 100) + '%';
          },
          fontSize: 11,
          color: '#e5e7eb'
        },
        axisLine: {
          lineStyle: {
            color: '#4b5563'
          }
        },
        splitLine: {
          lineStyle: {
            color: '#374151'
          }
        }
      },
      series: series,
      animationDuration: 1000,
      animationEasing: 'cubicOut'
    };

    chartInstance.current.setOption(option);

    // 响应式
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    // 点击事件
    chartInstance.current.on('click', (params: any) => {
      setSelectedGame(params.name);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  };

  return (
    <div className="term-distribution-chart">
      <div ref={chartRef} className="chart-canvas"></div>
      
      {selectedGame && (
        <div className="game-detail">
          <h4>选中游戏: {selectedGame}</h4>
          <p>点击图表中的不同游戏查看详细分布</p>
        </div>
      )}
      
      <div className="chart-description">
        <p>
          <strong>图表说明：</strong>
          此堆叠柱状图展示了14款游戏的术语分类分布。
          每种颜色代表一种术语类别，柱子高度表示该类别在游戏术语中的占比。
        </p>
      </div>
    </div>
  );
};
