import { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { LabaOne } from './LabaOne'
import { Home } from './Home';
import { IntroVideo } from './IntroVideo';
import { AdModal } from './AdModal';

function App() {
  const [activePage, setActivePage] = useState<"home" | "laba1" | "laba2" | "laba3">("home");
  const [showIntro, setShowIntro] = useState(true)
  const [showAd, setShowAd] = useState(false)

  useEffect(() => {
    if (showIntro) return

    let timer: number

    const scheduleAd = () => {
      const delay = 15000 + Math.random() * 45000
      timer = window.setTimeout(() => {
        setShowAd(true)
      }, delay)
    }

    if (!showAd) scheduleAd()

    return () => window.clearTimeout(timer)
  }, [showIntro, showAd])

  const renderPage = () => {
    switch(activePage) {
      case "home": return <Home/>
      case "laba1": return <LabaOne/>
      case "laba2": return
      case "laba3": return
      default: return
    }
  }

  return (
    <>
      {showIntro && <IntroVideo onEnd={() => setShowIntro(false)} />}
      {showAd && <AdModal onClose={() => setShowAd(false)} />}
      <div className='flex flex-1 flex-row'>
        <Sidebar onChangePage={setActivePage} currentPage={activePage}/>
        {renderPage()}
      </div>
    </>
  )
}

export default App