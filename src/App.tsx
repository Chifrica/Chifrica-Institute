 
import './App.css'
import Navbar from './components/navbars'
import Home from './pages/home'
import About from './pages/about'
import Login from './pages/login'
import Statistics from './pages/statistics'
import Register from './pages/register'
import { Routes, Route } from 'react-router-dom'
import Contact from './pages/contact'
import KidsAcademy from './pages/kidAcademy'

function App() {
  return (
    <>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/kidAcademy" element={<KidsAcademy />} />

          {/* Fallback: render Home for unknown routes */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
