import { useEffect, useState } from 'react';
import Sidebar from '../widgets/sidebar/Sidebar';
import { Home } from '../pages/home/Home';
import { LabaOne } from '../pages/lab1/LabaOne';
import { IntroVideo } from '../features/intro/IntroVideo';
import { AdModal } from '../features/ads/AdModal';
import { BannerRotator } from '@/features/ads/BannerRotator';
import { WordleGate } from '@/features/wordle/wordleGate';

export function App() {
  const [activePage, setActivePage] = useState<'home' | 'laba1' | 'laba2' | 'laba3'>('home');
  const [showIntro, setShowIntro] = useState(true);
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    if (showIntro || showAd) return;

    const delay = 15_000 + Math.random() * 45_000;
    const timer = window.setTimeout(() => {
      setShowAd(true);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [showIntro, showAd]);

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Home />;
      case 'laba1':
        return (
          <WordleGate>
            <LabaOne />
          </WordleGate>
        );
      case 'laba2':
      case 'laba3':
      default:
        return null;
    }
  };

  return (
    <>
      {showIntro && <IntroVideo onEnd={() => setShowIntro(false)} />}
      <AdModal open={showAd} onClose={() => setShowAd(false)} />
      {!showIntro && <BannerRotator />}

      <div className="flex flex-1 flex-row">
        <Sidebar onChangePage={setActivePage} currentPage={activePage} />
        {renderPage()}
      </div>
    </>
  );
}

export default App;