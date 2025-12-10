import React, { useEffect, useState } from 'react';
import { RPGTitleCard } from '@/components/RPGTitleCard/RPGTitleCard';
import MatrixRain from '@/components/MatrixRain/MatrixRain';
import './SplashScreen.scss';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // 总持续时间 3.5秒
    // 3秒后开始退出动画
    const timer = setTimeout(() => {
      setExiting(true);
    }, 3000);

    // 3.8秒后通知父组件动画结束
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3800);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`splash-screen ${exiting ? 'exiting' : ''}`}>
      <div className="splash-bg">
         <MatrixRain />
      </div>
      <div className="splash-content">
        <div className="scan-line"></div>
        <div className="logo-container">
           <RPGTitleCard />
        </div>
        <div className="loading-text">
            INITIALIZING SYSTEM...
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
