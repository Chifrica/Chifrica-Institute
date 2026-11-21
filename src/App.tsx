 
import { useLayoutEffect } from 'react'
import './App.css'
import Navbar from './components/navbars'
import Home from './pages/home'
import About from './pages/about'
import Login from './pages/login'
import Statistics from './pages/statistics'
import Register from './pages/register'
import { Navigate, Routes, Route, useLocation } from 'react-router-dom'
import Contact from './pages/contact'
import KidsAcademy from './pages/kidAcademy'
import Footer from './components/footers'
import Courses from './pages/courses'
import { isSignedIn } from './auth'

function App() {
  const { pathname, hash } = useLocation()
  const isAuthPage = pathname === '/login' || pathname === '/register'
  const isCourseReader = /^\/courses\/[^/]+(?:\/(?:overview|\d+))?\/?$/.test(pathname)

  useLayoutEffect(() => {
    if (hash) {
      window.requestAnimationFrame(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }, [pathname, hash])

  return (
    <>
      {!isAuthPage && <Navbar />}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/kidAcademy" element={<KidsAcademy />} />
          <Route path="/courses" element={isSignedIn() ? <Courses /> : <Navigate to="/login" replace />} />
          <Route
            path="/courses/:courseId/overview"
            element={isSignedIn() ? <Courses /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/courses/:courseId/:lessonNumber?"
            element={isSignedIn() ? <Courses /> : <Navigate to="/login" replace />}
          />

          {/* Fallback: render Home for unknown routes */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {!isAuthPage && !isCourseReader && <Footer />}

      {!isCourseReader && <div className="ticks"></div>}
      {!isCourseReader && <section id="spacer"></section>}
    </>
  )
}

export default App
