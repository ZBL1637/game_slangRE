import { rawData } from './dataLoader';
import { Term, GameIndex, CategoryIndex, ChartData, QuizItem } from '@/types';

// 辅助函数：标准化游戏名称 (简单处理)
const normalizeGameName = (game: string): string => {
  if (!game) return 'General';
  const g = game.toLowerCase().trim();
  if (g.includes('ff14') || g.includes('final fantasy')) return 'FF14';
  if (g.includes('lol') || g.includes('league')) return 'LoL';
  if (g.includes('wow') || g.includes('warcraft')) return 'WoW';
  if (g.includes('csgo')) return 'CS:GO';
  if (g.includes('dota')) return 'Dota2';
  return game;
};

// 1. 数据处理核心类
class DataProcessor {
  private terms: Map<string, Term> = new Map();
  private gameIndex: GameIndex = {};
  private categoryIndex: CategoryIndex = {};
  
  constructor() {
    this.processData();
    this.buildIndices();
  }

  // 处理并合并数据
  private processData() {
    // A. 处理 words_sort_data (作为骨架，因为它有分类信息)
    rawData.sortData.forEach((item: any) => {
      const id = String(item.title);
      const term: Term = {
        id,
        term: String(item.title),
        definition: item.summary,
        games: [], // 初始为空，稍后补充
        category: {
          l1: item["一级分类"] || 'Uncategorized',
          l2: item["二级分类"] || 'General',
          l3: item["三级分类"]
        },
        source: 'encyclopedia',
        tags: []
      };
      this.terms.set(id, term);
    });

    // B. 处理 words_scraped_data (补充游戏信息和新词)
    rawData.scrapedData.forEach((item: any) => {
      const id = String(item.term); // 注意：这里可能与 sortData 的 title 重复，也可能是新词
      const game = normalizeGameName(item.game);

      if (this.terms.has(id)) {
        // 已存在：补充游戏信息，标记 source 为 mixed
        const existingTerm = this.terms.get(id)!;
        if (!existingTerm.games.includes(game)) {
          existingTerm.games.push(game);
        }
        existingTerm.source = 'mixed';
        // 可以考虑合并 definition，这里暂且保留百科的（通常质量更高）
      } else {
        // 不存在：新增 scraped 词条
        // 尝试推断分类 (或者放入默认分类)
        const term: Term = {
          id,
          term: String(item.term),
          definition: item.definition,
          games: [game],
          category: {
            l1: '玩家社区黑话', // 默认分类
            l2: '其他',
          },
          source: 'scraped',
          tags: ['scraped']
        };
        this.terms.set(id, term);
      }
    });

    // C. 处理 words_all_data (查漏补缺)
    rawData.allData.forEach((item: any) => {
       const id = String(item.title);
       if (!this.terms.has(id)) {
         // 如果 sortData 里没涵盖（理论上 sortData 应该是全集，但以防万一）
         const term: Term = {
           id,
           term: String(item.title),
           definition: item.summary,
           games: [],
           category: {
             l1: '未分类',
             l2: '未分类'
           },
           source: 'encyclopedia',
           tags: []
         };
         this.terms.set(id, term);
       }
    });
  }

  // 建立索引
  private buildIndices() {
    this.terms.forEach(term => {
      // Game Index
      if (term.games.length === 0) {
        // 通用术语
        this.addToGameIndex('General', term.id);
      } else {
        term.games.forEach(g => this.addToGameIndex(g, term.id));
      }

      // Category Index
      const { l1, l2 } = term.category;
      if (!this.categoryIndex[l1]) {
        this.categoryIndex[l1] = {};
      }
      if (!this.categoryIndex[l1][l2]) {
        this.categoryIndex[l1][l2] = [];
      }
      this.categoryIndex[l1][l2].push(term.id);
    });
  }

  private addToGameIndex(game: string, id: string) {
    if (!this.gameIndex[game]) {
      this.gameIndex[game] = [];
    }
    this.gameIndex[game].push(id);
  }

  // 获取所有处理后的术语
  public getAllTerms(): Term[] {
    return Array.from(this.terms.values());
  }

  public getTerm(id: string): Term | undefined {
    return this.terms.get(id);
  }

  public getGameIndex(): GameIndex {
    return this.gameIndex;
  }

  public getCategoryIndex(): CategoryIndex {
    return this.categoryIndex;
  }

  // 生成图表数据
  public getChartData(): ChartData {
    // 1. Sunburst Data (Category -> L1 -> L2 -> Count)
    const sunburstData = Object.entries(this.categoryIndex).map(([l1, l2Map]) => {
      return {
        name: l1,
        children: Object.entries(l2Map).map(([l2, ids]) => ({
          name: l2,
          value: ids.length
        }))
      };
    });

    // 2. Radar Data (Game Term Counts - Top 6 Games)
    const gameCounts = Object.entries(this.gameIndex)
      .map(([game, ids]) => ({ name: game, value: ids.length }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // 取前8个
    
    const gameRadarData = {
      indicator: gameCounts.map(g => ({ name: g.name, max: gameCounts[0].value })),
      data: [
        {
          value: gameCounts.map(g => g.value),
          name: '术语数量'
        }
      ]
    };

    // 3. Word Cloud (Scraped Frequency - Simulated for now)
    // 真实情况应该统计 scrapedData 中出现的频次，这里简单用 filter scraped source 的
    const wordCloudData = Array.from(this.terms.values())
      .filter(t => t.source === 'scraped' || t.source === 'mixed')
      .map(t => ({
        name: t.term,
        value: Math.floor(Math.random() * 100) + 10 // 模拟热度，后续可替换为真实频次
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 50);

    return {
      sunburstData,
      gameRadarData,
      wordCloudData
    };
  }

  // 生成测验题库 (Simple Generator)
  public generateQuizBank(count: number = 5): QuizItem[] {
    const terms = this.getAllTerms().filter(t => t.definition && t.definition.length > 10);
    const quizBank: QuizItem[] = [];

    for (let i = 0; i < count; i++) {
      if (terms.length === 0) break;
      const randomIndex = Math.floor(Math.random() * terms.length);
      const targetTerm = terms[randomIndex];
      
      // 生成干扰项
      const options = [targetTerm.term];
      while (options.length < 4) {
        const randomDistractor = terms[Math.floor(Math.random() * terms.length)].term;
        if (!options.includes(randomDistractor)) {
          options.push(randomDistractor);
        }
      }
      
      // 打乱选项
      options.sort(() => Math.random() - 0.5);

      quizBank.push({
        id: `quiz-${i}`,
        question: `以下哪个术语的定义是："${targetTerm.definition.substring(0, 50)}..."？`,
        options,
        answer: targetTerm.term,
        relatedTermId: targetTerm.id
      });
    }
    return quizBank;
  }
}

// 导出单例实例
export const dataProcessor = new DataProcessor();
