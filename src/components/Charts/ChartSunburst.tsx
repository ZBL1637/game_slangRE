import React, { useMemo } from 'react';
import { BaseChart } from './BaseChart';
import * as echarts from 'echarts';
import rawData from '@/data/words_sort_data.json';

// Type definitions for the raw data
interface RawTerm {
  一级分类: string;
  二级分类: string;
  三级分类: string | null;
  title: string;
}

export const ChartSunburst: React.FC = () => {
  const chartData = useMemo(() => {
    const data = rawData as RawTerm[];
    const root: any = { name: 'DataNews', children: [] };

    data.forEach(item => {
      const l1 = item.一级分类 || 'Uncategorized';
      const l2 = item.二级分类 || 'General';
      
      let l1Node = root.children.find((c: any) => c.name === l1);
      if (!l1Node) {
        l1Node = { name: l1, children: [] };
        root.children.push(l1Node);
      }

      let l2Node = l1Node.children.find((c: any) => c.name === l2);
      if (!l2Node) {
        l2Node = { name: l2, children: [], value: 0 };
        l1Node.children.push(l2Node);
      }

      l2Node.children.push({ name: item.title, value: 1 });
    });

    return root.children;
  }, []);

  const options: echarts.EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} terms'
    },
    series: {
      type: 'sunburst',
      data: chartData,
      radius: [0, '90%'],
      label: {
        rotate: 'radial',
        color: '#fff'
      },
      itemStyle: {
        borderRadius: 0,
        borderColor: '#1a1b26',
        borderWidth: 1
      },
      levels: [
        {},
        {
          r0: '0%',
          r: '35%',
          itemStyle: {
            color: '#c0a080'
          },
          label: {
            rotate: 'tangential'
          }
        },
        {
          r0: '35%',
          r: '70%',
          label: {
            align: 'right'
          },
          itemStyle: {
            // Let echarts pick colors
          }
        },
        {
          r0: '70%',
          r: '75%',
          label: {
            position: 'outside',
            padding: 3,
            silent: false,
            color: '#999'
          },
          itemStyle: {
            borderWidth: 1
          }
        }
      ]
    }
  };

  return <BaseChart options={options} />;
};
