import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { tokens } from '../utils/colors';

const CooccurrenceHeatmap = () => {
  const [data, setData] = useState<{ categories: string[], data: any[] } | null>(null);

  useEffect(() => {
    fetch('/data/heatmap_data.json')
      .then((res) => res.json())
      .then((d) => setData(d));
  }, []);

  if (!data) return <div className="text-center p-10" style={{ color: tokens.text.sub }}>Loading...</div>;

  // Process data: Apply Logarithmic scaling to values
  // This helps visualize long-tail distribution where most values are small but a few are huge.
  // New format: [x, y, logValue, originalValue]
  const processedData = data.data.map((item: any[]) => {
      const val = item[2];
      return [item[0], item[1], Math.log(val + 1), val];
  });

  const maxLogVal = Math.max(...processedData.map(d => d[2]));
  const minLogVal = Math.min(...processedData.map(d => d[2]));

  const option = {
    title: {
      text: '共词矩阵热力图',
      subtext: 'Top 50 High-Frequency Words (Log Scale)',
      left: 'center',
      top: 10,
      textStyle: { color: tokens.text.main },
      subtextStyle: { color: tokens.text.sub }
    },
    tooltip: {
      position: 'top',
      backgroundColor: 'rgba(18, 26, 46, 0.95)',
      borderColor: tokens.line.main,
      textStyle: { color: tokens.text.main },
      formatter: (params: any) => {
          if (!params.data) return '';
          const xIndex = params.data[0];
          const yIndex = params.data[1];
          const realValue = params.data[3];
          const xName = data.categories[xIndex];
          const yName = data.categories[yIndex];
          return `<div style="text-align:center; font-weight:bold">${xName} - ${yName}</div><div>共现强度: ${realValue}</div>`;
      }
    },
    grid: {
      height: '70%',
      top: '15%',
      bottom: '15%', 
      left: '10%',
      right: '10%',
      borderColor: tokens.line.grid
    },
    xAxis: {
      type: 'category',
      data: data.categories,
      splitArea: {
        show: true,
        areaStyle: {
            color: [tokens.bg.canvas, tokens.bg.panel] 
        }
      },
      axisLabel: {
        rotate: 90,
        color: tokens.text.sub,
        fontSize: 10,
        interval: 0
      },
      axisLine: { lineStyle: { color: tokens.line.axis } }
    },
    yAxis: {
      type: 'category',
      data: data.categories,
      splitArea: {
        show: true,
        areaStyle: {
            color: [tokens.bg.canvas, tokens.bg.panel]
        }
      },
      axisLabel: {
        color: tokens.text.sub,
        fontSize: 10,
        interval: 0
      },
      axisLine: { lineStyle: { color: tokens.line.axis } }
    },
    visualMap: {
      min: minLogVal,
      max: maxLogVal, 
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '0%',
      dimension: 2, // Explicitly map color to the log value (index 2)
      inRange: {
        color: [
            '#1e40af', // Blue 800 - Visible base (Low frequency)
            '#3b82f6', // Blue 500
            '#60a5fa', // Blue 400
            '#93c5fd', // Blue 300
            '#FFE17A'  // Yellow (High frequency)
        ]
      },
      textStyle: { color: tokens.text.main },
      formatter: (value: number) => {
          // Display approximate real value on the visualMap slider
          return Math.round(Math.exp(value) - 1).toString();
      }
    },
    series: [
      {
        name: 'Co-occurrence',
        type: 'heatmap',
        data: processedData,
        label: {
          show: false
        },
        itemStyle: {
            borderColor: tokens.bg.canvas,
            borderWidth: 1
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            borderColor: tokens.interaction.hover,
            borderWidth: 1
          }
        }
      }
    ]
  };

  return (
    <div className="relative w-full border p-4 rounded-lg"
         style={{ 
             height: '800px',
             backgroundColor: tokens.bg.canvas,
             borderColor: tokens.border.main,
             boxShadow: `0 0 15px ${tokens.bg.page}`
         }}>
      <ReactECharts option={option} style={{ height: '100%', width: '100%', minHeight: '760px' }} theme="jrpg" />
    </div>
  );
};

export default CooccurrenceHeatmap;
