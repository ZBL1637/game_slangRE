import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '@/context/PlayerContext';
import './WorldMap.scss';

// 区域定义 (添加坐标)
// 坐标基于 16:9 地图的百分比位置 (Top/Left)
const REGIONS = [
  { id: 1, name: '新手村', level: '1-15', desc: '术语基础、分类与历史', time: '3 min', pos: { left: '15%', top: '69%' } },     // 左下
  { id: 2, name: '战斗本体平原', level: '10-25', desc: '副本、RNG与机制黑话', time: '2 min', pos: { left: '38.5%', top: '69%' } },     // 左中下
  { id: 3, name: '玩家生态城镇', level: '20-35', desc: '社群称谓与行为标签', time: '4 min', pos: { left: '67%', top: '72%' } },    // 中心
  { id: 4, name: '经济与氪金之都', level: '30-45', desc: '货币、交易与氪金术语', time: '3 min', pos: { left: '89%', top: '55%' } },    // 右下
  { id: 5, name: '弹幕大峡谷', level: '40-60', desc: '直播弹幕与情绪黑话', time: '4 min', pos: { left: '74%', top: '30%' } },      // 右上
  { id: 6, name: '终章·魔王城', level: '60-100', desc: '算法推荐与平台生态', time: '5 min', pos: { left: '50%', top: '15%' } },     // 顶部正中
];

const WorldMap: React.FC = () => {
  const navigate = useNavigate();
  const { state } = usePlayer();

  const getRegionStatus = (id: number) => {
    if (state.completedChapters.includes(id)) return 'completed';
    if (state.unlockedChapters.includes(id)) return 'unlocked';
    return 'locked';
  };

  const handleNodeClick = (id: number) => {
    const status = getRegionStatus(id);
    if (status !== 'locked') {
      if (id === 1) {
        // Chapter 1 (Tutorial/Origin) redirects to Dictionary for now
        navigate('/dictionary');
      } else if (id === 6) {
        navigate('/chapter/final');
      } else {
        navigate(`/chapter/${id}`);
      }
    }
  };

  return (
    <div className="world-map-container">
      {/* 地图区域 */}
      <div className="map-viewport animate-fade-in-up delay-200">
        {REGIONS.map(region => {
          const status = getRegionStatus(region.id);
          
          return (
            <div 
              key={region.id}
              className={`map-node region-${region.id} status-${status}`}
              style={region.pos}
              onClick={() => handleNodeClick(region.id)}
            >
              <div className="node-icon">
                {status === 'locked' && <span className="icon-lock">🔒</span>}
                {status === 'completed' && <span className="icon-check">🚩</span>}
                {status === 'unlocked' && <span className="icon-marker">📍</span>}
              </div>
            </div>
          );
        })}
        {/* 背景装饰线 (SVG 可以后续添加) */}
      </div>
    </div>
  );
};

export default WorldMap;
