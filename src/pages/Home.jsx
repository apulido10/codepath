import { Link } from 'react-router-dom'

function Home({ crewmates }) {
  const recent = crewmates.slice(0, 3)

  return (
    <>
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Week 8 · Project 7</p>
          <h1>CrewMates</h1>
          <p className="hero-text">
            Assemble your ultimate space crew. Create crewmates, assign roles and
            skills, and track your team's readiness for the mission ahead.
          </p>
          <div className="hero-actions">
            <Link to="/create" className="btn btn-primary">Create a Crewmate</Link>
            <Link to="/gallery" className="btn btn-secondary">View Gallery</Link>
          </div>
        </div>
      </section>

      {recent.length > 0 && (
        <section className="recent-section">
          <h2>Recent Crewmates</h2>
          <div className="crew-grid">
            {recent.map((mate) => (
              <Link to={`/crewmate/${mate.id}`} key={mate.id} className="crew-card-link">
                <div className="crew-card">
                  <div className="crew-avatar" style={{ background: mate.color }}>
                    {mate.name.charAt(0).toUpperCase()}
                  </div>
                  <h3>{mate.name}</h3>
                  <span className="info-pill">{mate.role}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {crewmates.length === 0 && (
        <section className="empty-state">
          <h2>No crewmates yet</h2>
          <p>Start building your crew by creating your first crewmate!</p>
          <Link to="/create" className="btn btn-primary">Get Started</Link>
        </section>
      )}
    </>
  )
}

export default Home
