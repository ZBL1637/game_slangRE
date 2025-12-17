import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PlayerProvider } from '@/context/PlayerContext';
import { Layout } from '@/components/Layout/Layout';
import SplashScreen from '@/components/SplashScreen/SplashScreen';
import TitlePage from '@/pages/TitlePage/TitlePage';
import TutorialVillage from '@/pages/TutorialVillage/TutorialVillage';
import WorldMap from '@/pages/WorldMap/WorldMap';
import ChapterPage from '@/pages/ChapterPage/ChapterPage';
import Dictionary from '@/pages/Dictionary/Dictionary';
import Achievements from '@/pages/Achievements/Achievements';
import Quests from '@/pages/Quests/Quests';
import Lab from '@/pages/Lab/Lab';
import Profile from '@/pages/Profile/Profile';
import BattlePlain from '@/pages/BattlePlain/BattlePlain';
import PlayerTown from '@/pages/PlayerTown/PlayerTown';
import DataMetropolis from '@/pages/DataMetropolis/DataMetropolis';
import TranslationTower from '@/pages/TranslationTower/TranslationTower';
import FinalChapter from '@/pages/FinalChapter/FinalChapter';

/**
 * 计算生产环境下的 base 重定向目标。
 * 用于在 `vite.config.ts` 配置了非根路径 `base` 时，避免用户访问根路径导致白屏。
 */
function getProdBaseRedirectTarget(pathname: string, baseUrl: string): string | null {
  if (!import.meta.env.PROD) return null;

  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  if (normalizedBaseUrl === '/') return null;

  const baseWithoutTrailingSlash = normalizedBaseUrl.replace(/\/$/, '');
  const isUnderBase = pathname === baseWithoutTrailingSlash || pathname.startsWith(normalizedBaseUrl);

  return isUnderBase ? null : normalizedBaseUrl;
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  const prodRedirectTarget = useMemo(
    () => getProdBaseRedirectTarget(window.location.pathname, import.meta.env.BASE_URL),
    []
  );

  useEffect(() => {
    if (prodRedirectTarget) window.location.replace(prodRedirectTarget);
  }, [prodRedirectTarget]);

  if (prodRedirectTarget) return null;

  return (
    <PlayerProvider>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <Router basename={import.meta.env.BASE_URL}>
        <Layout>
          <Routes>
            <Route path="/" element={<TitlePage />} />
            <Route path="/tutorial" element={<Navigate to="/chapter/1" replace />} />
            <Route path="/world-map" element={<WorldMap />} />
            <Route path="/chapter/1" element={<TutorialVillage />} />
            <Route path="/chapter/2" element={<BattlePlain />} />
            <Route path="/chapter/3" element={<PlayerTown />} />
            <Route path="/chapter/4" element={<DataMetropolis />} />
            <Route path="/chapter/5" element={<TranslationTower />} />
            <Route path="/chapter/final" element={<FinalChapter />} />
            <Route path="/chapter/:id" element={<ChapterPage />} />
            <Route path="/dictionary" element={<Dictionary />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/quests" element={<Quests />} />
            <Route path="/lab" element={<Lab />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Layout>
      </Router>
    </PlayerProvider>
  )
}

export default App
