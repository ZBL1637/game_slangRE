import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <PlayerProvider>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <Router basename={import.meta.env.BASE_URL}>
        <Layout>
          <Routes>
            <Route path="/" element={<TitlePage />} />
            <Route path="/tutorial" element={<TutorialVillage />} />
            <Route path="/world-map" element={<WorldMap />} />
            <Route path="/chapter/2" element={<BattlePlain />} />
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
