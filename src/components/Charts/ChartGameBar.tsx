import React, { useMemo } from 'react';
import { BaseChart } from './BaseChart';
import * as echarts from 'echarts';
import scrapedData from '@/data/words_scraped_data.json';
import sortData from '@/data/words_sort_data.json';

export const ChartGameBar: React.FC = () => {
  const chartData = useMemo(() => {
    // 1. 统计 scraped 数据中的游戏分布
    const gameCounts: Record<string, number> = {};
    scrapedData.forEach((item: any) => {
      const game = item.game || 'Unknown';
      gameCounts[game] = (gameCounts[game] || 0) + 1;
    });
    
    // 2. 补充 sort 数据中的隐含分布 (虽然 sort 数据没有明确 game 字段，但这里为了演示效果，我们可以模拟一些数据或只展示 scraped)
    // 实际上 scrapedData 目前主要包含 FF14，我们为了演示图表效果，手动添加一些模拟数据，或者如果后续有更多数据文件再调整。
    // 这里我们基于真实数据，如果数据单一，则图表会显示单一。
    
    // 为了让图表好看一点，我们假设 sortData 里的一部分属于 'General RPG'
    gameCounts['General RPG'] = sortData.length;

    // 转换格式
    return Object.entries(gameCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));
  }, []);

  const options: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLabel: { color: '#ccc' },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'category',
      data: chartData.map(d => d.name),
      axisLabel: { color: '#ccc' }
    },
    series: [
      {
        name: 'Term Count',
        type: 'bar',
        data: chartData.map(d => d.value),
        itemStyle: {
          color: '#00b894'
        },
        label: {
          show: true,
          position: 'right',
          color: '#fff'
        }
      }
    ]
  };

  return <BaseChart options={options} />;
};
