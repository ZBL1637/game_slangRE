import allData from '@/data/words_all_data.json';
import sortData from '@/data/words_sort_data.json';
import scrapedData from '@/data/words_scraped_data.json';

// 定义基础类型
export interface Term {
  title: string;
  summary: string;
}

export interface SortItem {
  "一级分类": string;
  "二级分类": string;
  "三级分类": string | null;
  title: string;
  summary: string;
}

export interface ScrapedItem {
  term: string;
  definition: string;
  game: string;
}

// 统计信息接口
export interface DataStats {
  totalTerms: number;
  totalGames: number;
  totalCategories: number;
  scrapedCount: number;
}

// 获取统计信息
export const getBasicStats = (): DataStats => {
  // 1. 统计总词条数 (从 words_all_data)
  const totalTerms = allData.length;

  // 2. 统计游戏数量 (从 words_scraped_data 的 game 字段去重)
  const uniqueGames = new Set(scrapedData.map(item => item.game));
  const totalGames = uniqueGames.size;

  // 3. 统计分类数量 (从 words_sort_data 的 一级分类 去重)
  const uniqueCategories = new Set(sortData.map(item => item["一级分类"]));
  const totalCategories = uniqueCategories.size;

  // 4. scraped 数据条目数
  const scrapedCount = scrapedData.length;

  return {
    totalTerms,
    totalGames,
    totalCategories,
    scrapedCount
  };
};

// 导出原始数据以便组件直接使用
export const rawData = {
  allData,
  sortData,
  scrapedData
};
