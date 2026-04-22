import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import supabase from './client'
import Home from './pages/Home'
import CreateCrewmate from './pages/CreateCrewmate'
import Gallery from './pages/Gallery'
import CrewmateDetail from './pages/CrewmateDetail'
import EditCrewmate from './pages/EditCrewmate'
import './App.css'

function App() {
  const [crewmates, setCrewmates] = useState([])
  const location = useLocation()

  const fetchCrewmates = async () => {
    const { data, error } = await supabase
      .from('crewmates')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      console.error('Supabase fetch error:', error)
    } else {
      setCrewmates(data)
    }
  }

  useEffect(() => {
    fetchCrewmates()
  }, [])

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/create', label: 'Create' },
    { to: '/gallery', label: 'Gallery' },
  ]

  return (
    <div className="app-layout">
      <div className="dashboard-backdrop" />
      <nav className="sidebar">
        <Link to="/" className="sidebar-brand">
          <h2>CrewMates</h2>
        </Link>
        <div className="sidebar-nav">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`sidebar-link ${location.pathname === link.to ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="sidebar-stats">
          <div className="sidebar-stat">
            <span className="sidebar-stat-value">{crewmates.length}</span>
            <span className="sidebar-stat-label">Total Crew</span>
          </div>
          <div className="sidebar-stat">
            <span className="sidebar-stat-value">
              {new Set(crewmates.map((c) => c.role)).size}
            </span>
            <span className="sidebar-stat-label">Roles</span>
          </div>
        </div>
      </nav>
      <main className="dashboard">
        <Routes>
          <Route path="/" element={<Home crewmates={crewmates} />} />
          <Route
            path="/create"
            element={<CreateCrewmate onCreated={fetchCrewmates} />}
          />
          <Route
            path="/gallery"
            element={<Gallery crewmates={crewmates} />}
          />
          <Route
            path="/crewmate/:id"
            element={<CrewmateDetail crewmates={crewmates} />}
          />
          <Route
            path="/edit/:id"
            element={<EditCrewmate crewmates={crewmates} onUpdated={fetchCrewmates} />}
          />
        </Routes>
      </main>
    </div>
  )
}

export default App
