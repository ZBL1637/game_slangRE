import React, { useEffect, useRef, useState } from 'react';
import { CATEGORY_SENTIMENT_DATA, CHART_COLORS } from '../../data';
import './CategorySentimentChart.scss';

declare global {
  interface Window {
    echarts: any;
  }
}

export const CategorySentimentChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

    if (chartInstance.current) {
      chartInstance.current.dispose();
    }

    chartInstance.current = window.echarts.init(chartRef.current);

    // 准备雷达图指标
    const indicators = CATEGORY_SENTIMENT_DATA.map(item => ({
      name: item.category,
      max: 1.0
    }));

    // 准备三个系列的数据
    const neutralData = CATEGORY_SENTIMENT_DATA.map(item => item.neutral.toFixed(3));
    const positiveData = CATEGORY_SENTIMENT_DATA.map(item => item.positive.toFixed(3));
    const negativeData = CATEGORY_SENTIMENT_DATA.map(item => item.negative.toFixed(3));

    const option = {
      title: {
        text: '术语类别情感分布',
        left: 'center',
        top: 10,
        textStyle: {
          color: '#ffffff',
          fontSize: 18,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: function(params: any) {
          const category = indicators[params.dataIndex]?.name || '';
          const value = (parseFloat(params.value) * 100).toFixed(1);
          return `${category}<br/>${params.seriesName}: ${value}%`;
        },
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderColor: '#7F0056',
        textStyle: {
          color: '#fff'
        }
      },
      legend: {
        data: [
          { name: '中性', itemStyle: { color: CHART_COLORS.neutral } },
          { name: '正面', itemStyle: { color: CHART_COLORS.positive } },
          { name: '负面', itemStyle: { color: CHART_COLORS.negative } }
        ],
        top: 50,
        left: 'center',
        orient: 'horizontal',
        itemGap: 40,
        textStyle: {
          color: '#ffffff',
          fontSize: 13,
          fontWeight: 'bold'
        }
      },
      radar: {
        indicator: indicators.map(ind => ({
          ...ind,
          axisLabel: { show: false }
        })),
        radius: '60%',
        center: ['50%', '58%'],
        startAngle: 90,
        splitNumber: 5,
        shape: 'polygon',
        axisName: {
          color: '#ffffff',
          fontSize: 11,
          fontWeight: 'bold'
        },
        splitLine: {
          lineStyle: {
            color: '#4b5563',
            width: 1
          }
        },
        splitArea: {
          areaStyle: {
            color: ['rgba(127, 0, 86, 0.05)', 'rgba(127, 0, 86, 0.1)']
          }
        },
        axisLine: {
          lineStyle: {
            color: '#6b7280',
            width: 1
          }
        }
      },
      series: [
        {
          name: '中性',
          type: 'radar',
          data: [{
            value: neutralData,
            name: '中性',
            itemStyle: { color: CHART_COLORS.neutral },
            lineStyle: { color: CHART_COLORS.neutral, width: 3 },
            areaStyle: { color: 'rgba(127, 0, 86, 0.2)' }
          }],
          symbol: 'circle',
          symbolSize: 6
        },
        {
          name: '正面',
          type: 'radar',
          data: [{
            value: positiveData,
            name: '正面',
            itemStyle: { color: CHART_COLORS.positive },
            lineStyle: { color: CHART_COLORS.positive, width: 3 },
            areaStyle: { color: 'rgba(166, 0, 107, 0.2)' }
          }],
          symbol: 'diamond',
          symbolSize: 6
        },
        {
          name: '负面',
          type: 'radar',
          data: [{
            value: negativeData,
            name: '负面',
            itemStyle: { color: CHART_COLORS.negative },
            lineStyle: { color: CHART_COLORS.negative, width: 3 },
            areaStyle: { color: 'rgba(90, 0, 61, 0.2)' }
          }],
          symbol: 'triangle',
          symbolSize: 6
        }
      ],
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
      if (params.dataIndex !== undefined) {
        setSelectedCategory(indicators[params.dataIndex]?.name || null);
      }
    });

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  };

  // 获取选中类别的详细信息
  const getCategoryDetail = () => {
    if (!selectedCategory) return null;
    return CATEGORY_SENTIMENT_DATA.find(d => d.category === selectedCategory);
  };

  const categoryDetail = getCategoryDetail();

  return (
    <div className="category-sentiment-chart">
      <div ref={chartRef} className="chart-canvas"></div>

      {/* 选中类别详情 */}
      {categoryDetail && (
        <div className="category-detail-panel">
          <h4>{categoryDetail.category}</h4>
          <div className="detail-bars">
            <div className="bar-item">
              <span className="bar-label">中性</span>
              <div className="bar-track">
                <div 
                  className="bar-fill neutral" 
                  style={{ width: `${categoryDetail.neutral * 100}%` }}
                ></div>
              </div>
              <span className="bar-value">{(categoryDetail.neutral * 100).toFixed(1)}%</span>
            </div>
            <div className="bar-item">
              <span className="bar-label">正面</span>
              <div className="bar-track">
                <div 
                  className="bar-fill positive" 
                  style={{ width: `${categoryDetail.positive * 100}%` }}
                ></div>
              </div>
              <span className="bar-value">{(categoryDetail.positive * 100).toFixed(1)}%</span>
            </div>
            <div className="bar-item">
              <span className="bar-label">负面</span>
              <div className="bar-track">
                <div 
                  className="bar-fill negative" 
                  style={{ width: `${categoryDetail.negative * 100}%` }}
                ></div>
              </div>
              <span className="bar-value">{(categoryDetail.negative * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      )}

      <div className="chart-description">
        <p>
          <strong>图表说明：</strong>
          此雷达图展示了10种术语类别的情感分布。
          三条线分别代表中性、正面和负面情感的占比。
          注意观察哪类术语的负面情感占比最高。
        </p>
      </div>
    </div>
  );
};
