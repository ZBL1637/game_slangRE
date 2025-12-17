import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import './Charts.scss';

export interface BaseChartProps {
  options: echarts.EChartsOption;
  style?: React.CSSProperties;
  className?: string;
  onInit?: (instance: echarts.ECharts) => void;
}

export const BaseChart: React.FC<BaseChartProps> = ({ options, style, className = '', onInit }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Init chart
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current, 'dark', {
        renderer: 'canvas'
      });
      if (onInit) onInit(chartInstance.current);
    }

    // Set options
    chartInstance.current.setOption(options);

    // Resize handler
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, [options, onInit]);

  return (
    <div 
      ref={chartRef} 
      className={`rpg-chart ${className}`} 
      style={{ width: '100%', height: '400px', ...style }} 
    />
  );
};
