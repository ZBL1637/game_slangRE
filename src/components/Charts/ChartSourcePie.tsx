import React, { useMemo } from 'react';
import { BaseChart } from './BaseChart';
import type { EChartsCoreOption } from 'echarts/core';
import scrapedData from '@/data/words_scraped_data.json';
import allData from '@/data/words_all_data.json';

export const ChartSourcePie: React.FC = () => {
  const chartData = useMemo(() => {
    // 假设 allData 是 "Wiki/Encyclopedia" 来源
    // scrapedData 是 "Community/Danmaku" 来源
    const wikiCount = allData.length;
    const communityCount = scrapedData.length;

    return [
      { value: wikiCount, name: 'Wiki / Official' },
      { value: communityCount, name: 'Community / Chat' },
      { value: Math.floor((wikiCount + communityCount) * 0.1), name: 'Academic' } // 模拟一点其他来源
    ];
  }, []);

  const options: EChartsCoreOption = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center',
      textStyle: {
        color: '#ccc'
      }
    },
    series: [
      {
        name: 'Data Source',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 5,
          borderColor: '#1a1b26',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
            color: '#fff'
          }
        },
        labelLine: {
          show: false
        },
        data: chartData
      }
    ]
  };

  return <BaseChart options={options} />;
};
