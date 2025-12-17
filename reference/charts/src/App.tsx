import React from 'react';
import * as echarts from 'echarts';
import SunburstChart from './components/SunburstChart';
import CooccurrenceGraph from './components/CooccurrenceGraph';
import CooccurrenceHeatmap from './components/CooccurrenceHeatmap';

import { jrpgTheme } from './utils/jrpgTheme';

// Register theme
echarts.registerTheme('jrpg', jrpgTheme);

function App() {
  return (
    <div className="min-h-screen bg-[#0B1020] text-[#E8F0FF] p-4 md:p-8 font-sans overflow-x-hidden">
      <header className="mb-8 md:mb-12 text-center">
        <h1 className="text-4xl font-bold mb-2 tracking-widest text-[#E8F0FF] drop-shadow-[0_0_10px_rgba(124,196,255,0.5)]">
          RPG 数据可视化
        </h1>
        <p className="text-sm tracking-[0.5em] text-[#A9B7D6] uppercase">
          Role-Playing Game Terminology Analysis
        </p>
        <div className="h-px w-64 bg-gradient-to-r from-transparent via-[#7CC4FF] to-transparent mx-auto mt-4"></div>
      </header>

      <div className="max-w-7xl mx-auto space-y-16">
        <section>
          <div className="flex items-center mb-6">
             <div className="w-1 h-6 bg-[#7CC4FF] mr-4 shadow-[0_0_8px_#7CC4FF]"></div>
             <h2 className="text-2xl font-bold text-[#E8F0FF]">术语体系 (Taxonomy)</h2>
          </div>
          <SunburstChart />
        </section>

        <section>
          <div className="flex items-center mb-6">
             <div className="w-1 h-6 bg-[#7CC4FF] mr-4 shadow-[0_0_8px_#7CC4FF]"></div>
             <h2 className="text-2xl font-bold text-[#E8F0FF]">共词网络 (Co-occurrence Network)</h2>
          </div>
          <CooccurrenceGraph />
        </section>

        <section>
          <div className="flex items-center mb-6">
             <div className="w-1 h-6 bg-[#7CC4FF] mr-4 shadow-[0_0_8px_#7CC4FF]"></div>
             <h2 className="text-2xl font-bold text-[#E8F0FF]">关系矩阵 (Correlation Matrix)</h2>
          </div>
          <CooccurrenceHeatmap />
        </section>
        

      </div>

      <footer className="mt-20 text-center text-[#6F7FA8] text-sm pb-8">
        <p>Data Visualization © 2025</p>
      </footer>
    </div>
  );
}

export default App;
