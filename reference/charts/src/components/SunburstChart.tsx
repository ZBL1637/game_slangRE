import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { tokens } from '../utils/colors';

const SunburstChart = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch('/data/sunburst_data.json')
      .then((res) => res.json())
      .then((d) => setData(d));
  }, []);

  const option = {
    color: tokens.palette,
    title: {
      text: '旭日图',
      subtext: 'Sunburst Chart',
      left: 'center',
      top: 20,
      textStyle: {
        fontSize: 24,
        color: tokens.text.main,
        textShadowColor: 'rgba(124, 196, 255, 0.5)',
        textShadowBlur: 10
      },
      subtextStyle: {
        color: tokens.text.sub
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}',
      backgroundColor: 'rgba(18, 26, 46, 0.95)',
      borderColor: tokens.line.main,
      textStyle: { color: tokens.text.main }
    },
    series: [
      {
        type: 'sunburst',
        data: data,
        radius: ['15%', '80%'],
        itemStyle: {
          borderRadius: 0,
          borderColor: 'rgba(124,196,255,0.55)',
          borderWidth: 1.5
        },
        label: {
          rotate: 'radial',
          color: tokens.text.main,
          fontSize: 10,
          minAngle: 5
        },
        levels: [
          {},
          {
            r0: '15%',
            r: '40%',
            itemStyle: {
              opacity: 0.85,
              borderWidth: 2
            },
            label: {
              rotate: 'tangential',
              fontSize: 14,
              fontWeight: 'bold',
              color: tokens.text.main
            }
          },
          {
            r0: '40%',
            r: '70%',
            itemStyle: {
                opacity: 0.70
            },
            label: {
              align: 'center',
              minAngle: 5,
              opacity: 1
            }
          },
          {
            r0: '70%',
            r: '75%',
            itemStyle: {
                opacity: 0.55
            },
            label: {
              position: 'outside',
              padding: 3,
              silent: false,
              minAngle: 5,
              color: tokens.text.sub
            }
          }
        ],
        emphasis: {
            itemStyle: {
                borderColor: tokens.interaction.hover,
                borderWidth: 2,
                shadowBlur: 10,
                shadowColor: 'rgba(255,225,122,0.25)'
            },
            label: {
                color: tokens.text.main
            }
        }
      }
    ]
  };

  return (
    <div className="relative w-full border p-4 rounded-lg" 
         style={{ 
             height: '600px',
             backgroundColor: tokens.bg.canvas,
             borderColor: tokens.border.main,
             boxShadow: `0 0 15px ${tokens.bg.page}`
         }}>
        {/* Corner Decorations */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: tokens.line.main }}></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: tokens.line.main }}></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2" style={{ borderColor: tokens.line.main }}></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: tokens.line.main }}></div>
        
      <ReactECharts option={option} style={{ height: '100%', width: '100%', minHeight: '560px' }} theme="jrpg" />
    </div>
  );
};

export default SunburstChart;
