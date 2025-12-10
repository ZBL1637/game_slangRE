import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SCRIPT } from '../../data';
import { Map, ArrowRight } from 'lucide-react';
import './OutroSection.scss';

export const OutroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="outro-section">
        <div className="content-wrapper">
            <h2>章节总结</h2>
            
            <div className="narration">
                <p>{SCRIPT.ch2_outro_narration_1}</p>
                <p>{SCRIPT.ch2_outro_narration_2}</p>
                <hr className="divider" />
                <p>{SCRIPT.ch2_outro_narration_3}</p>
                <p>{SCRIPT.ch2_outro_narration_4}</p>
                <p className="highlight">{SCRIPT.ch2_outro_narration_5}</p>
            </div>
        </div>

        <div className="actions">
            <div className="action-btn-wrapper">
                 <button 
                    className="action-btn"
                    onClick={() => alert("第三章正在施工中...")}
                 >
                    <div className="btn-label">
                        <span>前往第三章</span>
                        <ArrowRight size={20} />
                    </div>
                    <span className="btn-sub">玩家生态城镇</span>
                </button>
            </div>
           
           <div className="action-btn-wrapper">
                <button 
                    className="action-btn secondary"
                    onClick={() => navigate('/world-map')}
                >
                    <div className="btn-label">
                        <Map size={20} />
                        <span>返回世界地图</span>
                    </div>
                    <span className="btn-sub">选择其他支线</span>
                </button>
           </div>
        </div>
    </section>
  );
};
