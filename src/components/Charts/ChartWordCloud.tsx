import React, { useMemo } from 'react';
import { BaseChart } from './BaseChart';
import * as echarts from 'echarts';
import sortData from '@/data/words_sort_data.json';

// 使用 Treemap 替代 WordCloud
export const ChartWordCloud: React.FC = () => {
  const chartData = useMemo(() => {
    // 按一级分类聚合，展示每个分类下的 Top 5 词汇
    const categories: Record<string, any[]> = {};
    
    sortData.forEach((item: any) => {
      const cat = item.一级分类 || 'Other';
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(item);
    });

    // 构建 Treemap 数据
    return Object.keys(categories).map(cat => ({
      name: cat,
      value: categories[cat].length,
      children: categories[cat].slice(0, 8).map(item => ({
        name: item.title,
        value: 1 // 均等大小，或者可以用字数等作为权重
      }))
    }));
  }, []);

  const options: echarts.EChartsOption = {
    tooltip: {
      formatter: '{b}'
    },
    series: [
      {
        type: 'treemap',
        data: chartData,
        breadcrumb: {
          show: false
        },
        label: {
          show: true,
          formatter: '{b}'
        },
        upperLabel: {
          show: true,
          height: 30,
          color: '#fff',
          backgroundColor: 'rgba(0,0,0,0.3)'
        },
        itemStyle: {
          borderColor: '#1a1b26'
        },
        levels: [
          {
            itemStyle: {
              borderWidth: 0,
              gapWidth: 5
            }
          },
          {
            itemStyle: {
              gapWidth: 1
            }
          },
          {
            colorSaturation: [0.35, 0.5],
            itemStyle: {
              gapWidth: 1,
              borderColorSaturation: 0.6
            }
          }
        ]
      }
    ]
  };

  return <BaseChart options={options} />;
};
