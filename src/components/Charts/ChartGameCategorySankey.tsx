import React, { useMemo } from 'react';
import type { EChartsCoreOption } from 'echarts/core';
import { BaseChart } from './BaseChart';
import { dataProcessor } from '@/utils/dataProcessor';
import { Term } from '@/types';

interface SankeyNode {
  name: string;
  itemStyle?: {
    color?: string;
    borderColor?: string;
    borderWidth?: number;
  };
}

interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

/**
 * 展示“游戏 -> 一级分类”的流向关系，用于解释术语从不同游戏汇入不同语义类别的过程。
 */
export const ChartGameCategorySankey: React.FC = () => {
  const { nodes, links } = useMemo(() => {
    const terms = dataProcessor.getAllTerms();
    return buildGameCategorySankey(terms);
  }, []);

  const options: EChartsCoreOption = useMemo(() => {
    return {
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        formatter: (params: any) => {
          if (!params) return '';
          if (params.dataType === 'edge' && params.data) {
            const source = String(params.data.source || '').replace(/^游戏·/, '');
            const target = String(params.data.target || '').replace(/^分类·/, '');
            const value = Number(params.data.value || 0);
            return `${source} → ${target}<br/>术语数量：${value}`;
          }
          if (params.dataType === 'node' && params.data) {
            const name = String(params.data.name || '').replace(/^(游戏|分类)·/, '');
            return name;
          }
          return '';
        }
      },
      series: [
        {
          type: 'sankey',
          data: nodes,
          links,
          emphasis: {
            focus: 'adjacency'
          },
          nodeAlign: 'justify',
          nodeGap: 10,
          draggable: false,
          label: {
            color: '#ddd',
            fontSize: 11,
            formatter: (p: any) => String(p?.data?.name || '').replace(/^(游戏|分类)·/, '')
          },
          lineStyle: {
            color: 'gradient',
            curveness: 0.5,
            opacity: 0.7
          },
          itemStyle: {
            borderWidth: 1,
            borderColor: 'rgba(212,175,55,0.45)'
          }
        }
      ]
    };
  }, [nodes, links]);

  return <BaseChart options={options} style={{ height: '520px' }} />;
};

/**
 * 生成 Sankey 数据：左侧为 Top 游戏节点，右侧为 Top 一级分类节点。
 */
function buildGameCategorySankey(terms: Term[]): { nodes: SankeyNode[]; links: SankeyLink[] } {
  const gameCounts = new Map<string, number>();
  const categoryCounts = new Map<string, number>();

  for (const term of terms) {
    const category = term.category?.l1 || '未分类';
    categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1);

    const games = term.games && term.games.length > 0 ? term.games : ['General'];
    for (const game of games) {
      gameCounts.set(game, (gameCounts.get(game) || 0) + 1);
    }
  }

  const topGames = Array.from(gameCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name]) => name);

  if (!topGames.includes('General')) {
    topGames.push('General');
  }

  const topCategories = Array.from(categoryCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name]) => name);

  const selectedGames = new Set(topGames);
  const selectedCategories = new Set(topCategories);

  const linkCounts = new Map<string, number>();

  for (const term of terms) {
    const category = term.category?.l1 || '未分类';
    if (!selectedCategories.has(category)) continue;

    const games = term.games && term.games.length > 0 ? term.games : ['General'];
    for (const game of games) {
      if (!selectedGames.has(game)) continue;
      const key = `${game}|||${category}`;
      linkCounts.set(key, (linkCounts.get(key) || 0) + 1);
    }
  }

  const gameColor = '#D4AF37';
  const categoryColor = '#4AA3DF';
  const borderColor = 'rgba(124,196,255,0.35)';

  const nodes: SankeyNode[] = [
    ...topGames.map((g) => ({
      name: `游戏·${g}`,
      itemStyle: {
        color: gameColor,
        borderColor,
        borderWidth: 1
      }
    })),
    ...topCategories.map((c) => ({
      name: `分类·${c}`,
      itemStyle: {
        color: categoryColor,
        borderColor,
        borderWidth: 1
      }
    }))
  ];

  const links: SankeyLink[] = Array.from(linkCounts.entries())
    .map(([key, value]) => {
      const [game, category] = key.split('|||');
      return {
        source: `游戏·${game}`,
        target: `分类·${category}`,
        value
      };
    })
    .sort((a, b) => b.value - a.value);

  return { nodes, links };
}
