import React from 'react';
import { BaseChart } from './BaseChart';
import * as echarts from 'echarts';

export const ChartTrend: React.FC = () => {
  // 模拟数据：不同年份的新增术语数量
  const years = ['2010', '2012', '2014', '2016', '2018', '2020', '2022', '2024'];
  const data = [15, 25, 40, 55, 90, 120, 150, 180];

  const options: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: years,
      axisLabel: { color: '#ccc' }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#ccc' },
      splitLine: {
        lineStyle: {
          color: 'rgba(255,255,255,0.1)'
        }
      }
    },
    series: [
      {
        data: data,
        type: 'line',
        smooth: true,
        lineStyle: {
          color: '#00b894',
          width: 3
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
                offset: 0, color: 'rgba(0, 184, 148, 0.5)'
            }, {
                offset: 1, color: 'rgba(0, 184, 148, 0)'
            }]
          }
        },
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: '#00b894',
          borderColor: '#fff',
          borderWidth: 2
        }
      }
    ]
  };

  return <BaseChart options={options} />;
};
