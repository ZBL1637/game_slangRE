import React, { useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts/core';
import type { EChartsCoreOption, EChartsType } from 'echarts/core';
import { BarChart, LineChart, PieChart, SankeyChart, SunburstChart, TreemapChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import './Charts.scss';

export interface BaseChartProps {
  options: EChartsCoreOption;
  style?: React.CSSProperties;
  className?: string;
  onInit?: (instance: EChartsType) => void;
}

const ECHARTS_MODULES = [
  BarChart,
  LineChart,
  PieChart,
  SankeyChart,
  SunburstChart,
  TreemapChart,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  CanvasRenderer
] as const;

export const BaseChart: React.FC<BaseChartProps> = ({ options, style, className = '', onInit }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<EChartsType | null>(null);

  const resize = useMemo(() => {
    return () => {
      chartInstance.current?.resize();
    };
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;

    echarts.use([...ECHARTS_MODULES]);

    chartInstance.current = echarts.init(chartRef.current, undefined, {
      renderer: 'canvas'
    });

    if (onInit) onInit(chartInstance.current);

    const ro = new ResizeObserver(resize);
    ro.observe(chartRef.current);
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      ro.disconnect();
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, [onInit, resize]);

  useEffect(() => {
    if (!chartInstance.current) return;
    chartInstance.current.setOption(options, { notMerge: true });
    resize();
  }, [options, resize]);

  return (
    <div 
      ref={chartRef} 
      className={`rpg-chart ${className}`} 
      style={{ width: '100%', height: '400px', ...style }} 
    />
  );
};
