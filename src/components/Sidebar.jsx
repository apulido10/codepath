import { Link } from 'react-router-dom'

export default function Sidebar({ totalCountries, totalRegions, totalIncomeGroups }) {
  return (
    <aside className="sidebar">
      <Link to="/" className="sidebar-brand">
        <h2>WorldScope</h2>
      </Link>

      <nav className="sidebar-nav">
        <Link to="/" className="sidebar-link">Dashboard</Link>
      </nav>

      <div className="sidebar-stats">
        <div className="sidebar-stat">
          <span className="sidebar-stat-value">{totalCountries}</span>
          <span className="sidebar-stat-label">Countries</span>
        </div>
        <div className="sidebar-stat">
          <span className="sidebar-stat-value">{totalRegions}</span>
          <span className="sidebar-stat-label">Regions</span>
        </div>
        <div className="sidebar-stat">
          <span className="sidebar-stat-value">{totalIncomeGroups}</span>
          <span className="sidebar-stat-label">Income Groups</span>
        </div>
      </div>
    </aside>
  )
}
