import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

const SankeyChart = () => {
  const [data, setData] = useState<{ nodes: any[], links: any[] } | null>(null);

  useEffect(() => {
    fetch('/data/sankey_data.json')
      .then((res) => res.json())
      .then((d) => setData(d));
  }, []);

  if (!data) return <div>Loading...</div>;

  const option = {
    title: {
      text: '分类流向图',
      subtext: 'Sankey Diagram',
      left: 'center',
      top: 10,
      textStyle: { color: '#d4af37' }
    },
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove'
    },
    series: [
      {
        type: 'sankey',
        data: data.nodes,
        links: data.links,
        emphasis: {
          focus: 'adjacency'
        },
        lineStyle: {
          color: 'gradient',
          curveness: 0.5
        },
        label: {
            color: '#ddd',
            fontSize: 10
        },
        itemStyle: {
            borderWidth: 1,
            borderColor: '#d4af37'
        }
      }
    ]
  };

  return (
    <div className="relative w-full h-[600px] border border-[#d4af37] bg-[#0b0d12] p-4 rounded-lg shadow-[0_0_15px_rgba(212,175,55,0.3)]" style={{ height: '600px' }}>
      <ReactECharts option={option} style={{ height: '100%', width: '100%', minHeight: '560px' }} theme="jrpg" />
    </div>
  );
};

export default SankeyChart;
