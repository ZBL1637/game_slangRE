import React, { useEffect, useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { tokens } from '../utils/colors';

const CooccurrenceGraph = () => {
  const [rawData, setRawData] = useState<{ nodes: any[], links: any[] } | null>(null);
  const [weightThreshold, setWeightThreshold] = useState(50); 
  const [topK, setTopK] = useState(3); 
  const [showTopKOnly, setShowTopKOnly] = useState(true);
  const [nodeValueThreshold, setNodeValueThreshold] = useState(200); 

  useEffect(() => {
    fetch('/data/graph_data.json')
      .then((res) => res.json())
      .then((d) => setRawData(d));
  }, []);

  const getCategoryColor = (cat: string) => {
    if (!cat) return tokens.palette[0];
    let hash = 0;
    for (let i = 0; i < cat.length; i++) {
        hash = cat.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % tokens.palette.length;
    return tokens.palette[index];
  };

  const filteredData = useMemo(() => {
    if (!rawData) return { nodes: [], links: [] };

    let activeLinks = rawData.links.filter(l => l.value >= weightThreshold);

    if (showTopKOnly) {
      const adj: Record<string, any[]> = {};
      rawData.nodes.forEach(n => adj[n.id] = []);
      
      activeLinks.forEach(l => {
        if (adj[l.source]) adj[l.source].push(l);
        if (adj[l.target]) adj[l.target].push(l);
      });

      const keptLinks = new Set();
      Object.keys(adj).forEach(nodeId => {
        const edges = adj[nodeId];
        edges.sort((a, b) => b.value - a.value);
        edges.slice(0, topK).forEach(l => keptLinks.add(l));
      });
      activeLinks = Array.from(keptLinks) as any[];
    }

    const activeNodeIds = new Set();
    const safeLinks = activeLinks.map(l => ({ ...l }));
    
    safeLinks.forEach(l => {
      activeNodeIds.add(l.source);
      activeNodeIds.add(l.target);
    });

    const activeNodes = rawData.nodes
      .filter(n => activeNodeIds.has(n.id) && (n.value || 0) >= nodeValueThreshold)
      .map(n => ({
        ...n, 
        symbolSize: Math.max(3, Math.min(35, Math.log(n.value || 1) * 5)), // Reduced size: max 35, scale factor 5
        label: {
          show: n.value > 500
        },
        itemStyle: {
            color: getCategoryColor(n.category),
            borderColor: '#fff', // White border for better contrast
            borderWidth: 1.5,
            shadowBlur: 10,
            shadowColor: getCategoryColor(n.category) // Glow effect matching node color
        }
      }));
      
    const finalNodeIds = new Set(activeNodes.map(n => n.id));
    const finalLinks = safeLinks.filter(l => finalNodeIds.has(l.source) && finalNodeIds.has(l.target));

    return { nodes: activeNodes, links: finalLinks };
  }, [rawData, weightThreshold, topK, showTopKOnly, nodeValueThreshold]);

  const option = {
    title: {
      text: '共词网络图',
      subtext: 'Force-directed Graph',
      left: 'center',
      top: 10,
      textStyle: { color: tokens.text.main },
      subtextStyle: { color: tokens.text.sub }
    },
    tooltip: {
        backgroundColor: 'rgba(18, 26, 46, 0.95)',
        borderColor: tokens.line.main,
        textStyle: { color: tokens.text.main }
    },
    series: [
      {
        type: 'graph',
        layout: 'force',
        data: filteredData.nodes,
        links: filteredData.links,
        roam: true,
        label: {
          show: true,
          position: 'right',
          color: tokens.text.main, // Brighter text
          fontSize: 12,
          fontWeight: 'bold', // Bolder text
          textBorderColor: tokens.bg.page, // Halo effect
          textBorderWidth: 2
        },
        force: {
          repulsion: 1000,
          gravity: 0.05,
          edgeLength: [50, 300],
          layoutAnimation: true
        },
        lineStyle: {
          color: 'rgba(169, 183, 214, 0.2)', // Changed to a subtle cool grey/silver
          curveness: 0.1, // Reduced curveness for cleaner look
          opacity: 1,
          width: 1
        },
        emphasis: {
            focus: 'adjacency',
            lineStyle: {
                width: 2,
                color: 'rgba(255,225,122,0.75)'
            },
            label: {
                show: true,
                color: tokens.text.main
            },
            itemStyle: {
                borderColor: tokens.interaction.selected,
                borderWidth: 2
            }
        },
        select: {
            itemStyle: {
                borderColor: tokens.interaction.selected,
                borderWidth: 2
            },
            lineStyle: {
                color: tokens.interaction.selected,
                width: 3
            }
        }
      }
    ]
  };

  return (
    <div className="relative w-full border p-4 rounded-lg"
         style={{ 
             backgroundColor: tokens.bg.canvas,
             borderColor: tokens.border.main,
             boxShadow: `0 0 15px ${tokens.bg.page}`
         }}>
      <div className="flex flex-wrap gap-4 mb-4 text-sm items-center z-10 relative" style={{ color: tokens.text.main }}>
        <div className="flex flex-col min-w-[200px]">
            <label className="mb-1">边权阈值 (Weight): {weightThreshold}</label>
            <input 
                type="range" 
                min="5" 
                max="200" 
                value={weightThreshold} 
                onChange={e => setWeightThreshold(Number(e.target.value))} 
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                style={{ accentColor: tokens.line.main }}
            />
        </div>
        <div className="flex flex-col min-w-[200px]">
            <label className="mb-1">Top K 关联 (Neighbors): {topK}</label>
            <input 
                type="range" 
                min="1" 
                max="20" 
                value={topK} 
                onChange={e => setTopK(Number(e.target.value))} 
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                style={{ accentColor: tokens.line.main }}
            />
        </div>
        <div className="flex flex-col min-w-[200px]">
            <label className="mb-1">词频过滤 (Min Value): {nodeValueThreshold}</label>
            <input 
                type="range" 
                min="1" 
                max="2000" 
                step="50"
                value={nodeValueThreshold} 
                onChange={e => setNodeValueThreshold(Number(e.target.value))} 
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                style={{ accentColor: tokens.line.main }}
            />
        </div>
        <div className="flex items-center mt-2">
            <input 
                type="checkbox" 
                checked={showTopKOnly} 
                onChange={e => setShowTopKOnly(e.target.checked)} 
                className="mr-2 w-4 h-4"
                style={{ accentColor: tokens.line.main }}
            />
            <label>仅显示 Top K</label>
        </div>
        <div className="ml-auto mt-2 md:mt-0" style={{ color: tokens.text.sub }}>
            Nodes: {filteredData.nodes.length} | Edges: {filteredData.links.length}
        </div>
      </div>
      
      <div className="h-[600px]" style={{ height: '600px' }}>
        <ReactECharts option={option} style={{ height: '100%', width: '100%', minHeight: '600px' }} theme="jrpg" />
      </div>
    </div>
  );
};

export default CooccurrenceGraph;
