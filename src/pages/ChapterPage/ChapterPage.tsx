import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Panel } from '@/components/Panel/Panel';
import { Button } from '@/components/Button/Button';
import { GameTerm } from '@/components/GameTerm/GameTerm';
import { usePlayer } from '@/context/PlayerContext';
import { QUESTS } from '@/data/quests';
import { DialogBox } from '@/components/DialogBox/DialogBox';
import { 
  ChartSunburst, 
  ChartGameBar, 
  ChartSourcePie, 
  ChartTrend
} from '@/components/Charts';
import './ChapterPage.scss';

type ChapterCharts = {
  partA?: React.FC;
  partB?: React.FC;
};

const CHART_MAPPING: Record<string, ChapterCharts> = {
  '3': { partA: ChartGameBar },
  '4': { partA: ChartSourcePie },
  '5': { partA: ChartTrend },
  '6': { partA: ChartSunburst }
};

const CHAPTER_TITLES: Record<string, string> = {
  '3': '玩家生态城镇',
  '4': '经济与氪金之都',
  '5': '弹幕大峡谷',
  '6': '终章·魔王城'
};

const CHAPTER_SUBTITLES: Record<string, string> = {
  '3': '玩家小镇',
  '4': '氪金之都',
  '5': '弹幕峡谷',
  '6': '算法城堡'
};

// Chapter Content Data
const CHAPTER_CONTENT: Record<string, {
  intro: { text: string, speaker: string },
  partA: { title: string, text: React.ReactNode },
  partB: { title: string, text: React.ReactNode },
  outro: { text: string }
}> = {
  '3': {
    intro: {
      speaker: '镇长',
      text: '欢迎来到我们的小镇！在这里，“Troll” 不指巨魔，“Smurf” 也不是蓝精灵。这关乎你在社区中的身份。'
    },
    partA: {
      title: '玩家原型',
      text: (
        <>
          <p>社区是由人建立的。有些人是正在摸索门道的 <GameTerm termId="Newbie">萌新</GameTerm>，而另一些则是指引方向的 <GameTerm termId="Pro">大佬</GameTerm>。</p>
          <p>当心那些破坏和平的 <GameTerm termId="Troll">喷子</GameTerm>，或者是碾压低级玩家的 <GameTerm termId="Smurf">炸鱼者</GameTerm>。</p>
        </>
      )
    },
    partB: {
      title: '社交动态',
      text: (
        <>
          <p>公会、帮派、联盟。我们抱团生存。柱状图展示了哪些游戏拥有最活跃的社交术语。</p>
          <p>你是“独狼”还是“团队玩家”？你的选择决定了你的体验。</p>
        </>
      )
    },
    outro: {
      text: '你已经认识了当地人。现在，让我们谈谈生意。黄金之城在等待着你。'
    }
  },
  '4': {
    intro: {
      speaker: '地精商人',
      text: '时间就是金钱，朋友！“F2P”，“P2W”，“微交易”。如果你想要最好的装备，你得了解市场。'
    },
    partA: {
      title: '游戏经济学',
      text: (
        <>
          <p>这游戏是 <GameTerm termId="F2P">免费游玩</GameTerm> 吗？还是 <GameTerm termId="P2W">氪金致胜</GameTerm>？界限往往很模糊。</p>
          <p>我们的饼图揭示了这些术语的来源——是官方营销还是愤怒的玩家？</p>
        </>
      )
    },
    partB: {
      title: '鲸鱼与小虾米',
      text: (
        <>
          <p><GameTerm termId="Whale">氪金大佬（鲸鱼）</GameTerm> 一掷千金。小虾米一毛不拔。生态系统两者都需要。</p>
          <p>在掏空钱包之前，学会识别“抽卡”陷阱！</p>
        </>
      )
    },
    outro: {
      text: '你的钱包变轻了，但你的头脑变富有了。下一站：充满梗的混乱峡谷。'
    }
  },
  '5': {
    intro: {
      speaker: '玩梗大师',
      text: '2333！666！你会说互联网的语言吗？在峡谷里，文字的传播速度比光还快。'
    },
    partA: {
      title: '病毒式传播',
      text: (
        <>
          <p>黑话通过直播和聊天传播。<GameTerm termId="Pog">Pog</GameTerm> 起初是一个表情，现在它是一种感觉。</p>
          <p>趋势线展示了一个术语的人气是如何迅速飙升——又迅速跌落的。</p>
        </>
      )
    },
    partB: {
      title: '语境为王',
      text: (
        <>
          <p>在游戏葬礼上说 <GameTerm termId="F">F</GameTerm> 是表示尊敬，但在其他地方可能会让人困惑。</p>
          <p>掌握这些细微差别是区分“老古董”和“Z世代”的关键。</p>
        </>
      )
    },
    outro: {
      text: '你经受住了尴尬的考验。你已经准备好迎接最终的试炼。魔王在等待。'
    }
  },
  '6': {
    intro: {
      speaker: '魔王',
      text: '那么，你已经走到了这一步。你了解了词汇、系统、人群。但你能将它们融会贯通吗？'
    },
    partA: {
      title: '宏伟档案馆',
      text: (
        <>
          <p>我们穿越了森林、平原、城镇、城市和峡谷。</p>
          <p>最后看一眼旭日图。这是我们整个文化的地图。</p>
        </>
      )
    },
    partB: {
      title: '你的传承',
      text: (
        <>
          <p>你不再是一个 <GameTerm termId="Newbie">萌新</GameTerm>。你是知识的守护者。</p>
          <p>去吧，分享这些知识。游戏从未结束，它只是在更新。</p>
        </>
      )
    },
    outro: {
      text: '恭喜你，玩家。你通关了游戏。……或者是吗？二周目已开启。'
    }
  }
};

const ChapterPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { completeChapter, state } = usePlayer();
  const [activeSection, setActiveSection] = useState('intro');
  const [showIntroDialog, setShowIntroDialog] = useState(true);

  // 获取当前章节关联的任务
  const chapterQuest = useMemo(() => {
    return QUESTS.find(q => q.chapterId === Number(id) && q.type === 'main');
  }, [id]);

  const isChapterCompleted = state.completedChapters.includes(Number(id));

  const charts = id ? CHART_MAPPING[id] : undefined;
  const PartAChart = charts?.partA || null;
  const PartBChart = charts?.partB || null;
  const chapterTitle = id ? CHAPTER_TITLES[id] : 'Unknown Chapter';
  const chapterSubtitle = id ? CHAPTER_SUBTITLES[id] : '';
  
  // Fallback content if specific chapter content is missing
  const content = (id && CHAPTER_CONTENT[id]) || {
    intro: { speaker: '系统', text: '正在加载章节数据...' },
    partA: { title: '分析', text: <p>本章节内容正在建设中。</p> },
    partB: { title: '案例研究', text: <p>更多数据分析即将推出。</p> },
    outro: { text: '章节已完成。' }
  };

  const handleComplete = () => {
    completeChapter(Number(id));
    navigate('/world-map');
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(`section-${sectionId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="chapter-container">
      {/* 左侧导航 */}
      <Panel className="chapter-sidebar">
        <h3 className="sidebar-title">Chapter {id}</h3>
        
        {chapterQuest && (
           <div className="chapter-quest-card">
             <div className="quest-label">主线任务</div>
             <div className="quest-name">{chapterQuest.title}</div>
             <div className={`quest-status ${isChapterCompleted ? 'completed' : 'active'}`}>
                {isChapterCompleted ? '✅ 已完成' : '⭕ 进行中'}
             </div>
           </div>
        )}

        <ul className="chapter-nav">
          <li className={activeSection === 'intro' ? 'active' : ''} onClick={() => scrollToSection('intro')}>
            序幕：引入
          </li>
          <li className={activeSection === 'part-a' ? 'active' : ''} onClick={() => scrollToSection('part-a')}>
            第一节：深度解析
          </li>
          <li className={activeSection === 'part-b' ? 'active' : ''} onClick={() => scrollToSection('part-b')}>
            第二节：案例研究
          </li>
          <li className={activeSection === 'outro' ? 'active' : ''} onClick={() => scrollToSection('outro')}>
            结语
          </li>
        </ul>
        
        <div className="sidebar-footer">
           <Button size="sm" variant="secondary" onClick={() => navigate(-1)}>退出</Button>
        </div>
      </Panel>

      {/* 右侧内容区 (滚动) */}
      <Panel className="chapter-content animate-fade-in-up delay-200">
        <div className="content-scroll">
          
          {/* Scene 0: Intro */}
          <div id="section-intro" className="story-section animate-fade-in-up delay-300">
            <h1 className="section-title">
              {chapterTitle}
              <span className="section-subtitle">{chapterSubtitle}</span>
            </h1>
            
            {showIntroDialog ? (
              <DialogBox 
                text={content.intro.text}
                speaker={content.intro.speaker}
                avatar={<div className="npc-avatar">🧙‍♂️</div>}
                onComplete={() => {}}
              />
            ) : (
              <div className="intro-recap" onClick={() => setShowIntroDialog(true)}>
                重播剧情
              </div>
            )}
          </div>

          {/* Part A */}
          <div id="section-part-a" className="story-section">
            <h2>{content.partA.title}</h2>
            <div className="text-content">{content.partA.text}</div>
            <div className="chart-container">
              {PartAChart ? <PartAChart /> : <div className="chart-placeholder">图表加载中...</div>}
            </div>
          </div>

          {/* Part B */}
          <div id="section-part-b" className="story-section">
            <h2>{content.partB.title}</h2>
            <div className="text-content">{content.partB.text}</div>
            {PartBChart && (
              <div className="chart-container">
                <PartBChart />
              </div>
            )}
            {/* Interactive Placeholder */}
            <div className="interactive-placeholder">
              <div className="placeholder-icon">🎮</div>
              <p>互动任务：术语拖拽（即将上线）</p>
            </div>
          </div>

          {/* Outro */}
          <div id="section-outro" className="story-section">
            <h2>结语</h2>
            <p className="narrative-text">{content.outro.text}</p>
            <div className="chapter-actions">
              <Button onClick={handleComplete} className="animate-pulse">完成章节</Button>
            </div>
          </div>

        </div>
      </Panel>
    </div>
  );
};

export default ChapterPage;
