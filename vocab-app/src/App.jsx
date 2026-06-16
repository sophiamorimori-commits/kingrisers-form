import { HashRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Learn from './pages/Learn'
import Progress from './pages/Progress'
import Settings from './pages/Settings'

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <div className="min-h-screen bg-[#FAF7F0]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
          <BottomNav />
        </div>
      </HashRouter>
    </AppProvider>
  )
}
