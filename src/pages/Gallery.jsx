import { Link } from 'react-router-dom'
import { ROLES } from './CreateCrewmate'

function Gallery({ crewmates }) {
  // --- Stretch: Summary statistics ---
  const roleCounts = {}
  crewmates.forEach((c) => {
    roleCounts[c.role] = (roleCounts[c.role] || 0) + 1
  })

  const speedCounts = {}
  crewmates.forEach((c) => {
    speedCounts[c.speed] = (speedCounts[c.speed] || 0) + 1
  })

  // --- Stretch: Success metric ---
  // Crew readiness = how many unique roles are filled out of 5 possible
  const uniqueRoles = new Set(crewmates.map((c) => c.role)).size
  const readiness = crewmates.length === 0 ? 0 : Math.round((uniqueRoles / ROLES.length) * 100)

  let readinessLabel = 'Not Ready'
  let readinessClass = 'readiness-low'
  if (readiness >= 80) {
    readinessLabel = 'Mission Ready!'
    readinessClass = 'readiness-high'
  } else if (readiness >= 50) {
    readinessLabel = 'Getting There'
    readinessClass = 'readiness-mid'
  }

  return (
    <section className="gallery-page">
      <h1>Crewmate Gallery</h1>
      <p className="form-subtitle">All your crewmates, sorted by most recently created.</p>

      {crewmates.length > 0 && (
        <>
          {/* Stretch: Success metric banner */}
          <div className={`readiness-banner ${readinessClass}`}>
            <div className="readiness-info">
              <h3>Crew Readiness: {readiness}%</h3>
              <span>{readinessLabel}</span>
              <p>
                {uniqueRoles} of {ROLES.length} roles filled.{' '}
                {readiness < 100
                  ? `Add a ${ROLES.find((r) => !crewmates.some((c) => c.role === r)) || 'new role'} to improve readiness!`
                  : 'Your crew is fully balanced!'}
              </p>
            </div>
            <div className="readiness-bar-wrap">
              <div className="readiness-bar" style={{ width: `${readiness}%` }} />
            </div>
          </div>

          {/* Stretch: Summary statistics */}
          <div className="stats-grid">
            <article className="stat-card">
              <span>Total Crewmates</span>
              <strong>{crewmates.length}</strong>
            </article>
            {Object.entries(roleCounts).map(([role, count]) => (
              <article className="stat-card" key={role}>
                <span>{role}s</span>
                <strong>{count}</strong>
                <p>{Math.round((count / crewmates.length) * 100)}% of crew</p>
              </article>
            ))}
          </div>
        </>
      )}

      {crewmates.length === 0 ? (
        <div className="empty-state">
          <h2>No crewmates yet!</h2>
          <p>Your crew is empty. Start by creating your first crewmate.</p>
          <Link to="/create" className="btn btn-primary">Create a Crewmate</Link>
        </div>
      ) : (
        <div className="crew-grid">
          {crewmates.map((mate) => (
            <div className="crew-card" key={mate.id}>
              <Link to={`/crewmate/${mate.id}`} className="crew-card-link">
                <div className="crew-avatar" style={{ background: mate.color }}>
                  {mate.name.charAt(0).toUpperCase()}
                </div>
                <h3>{mate.name}</h3>
                <span className="info-pill">{mate.role}</span>
                <p className="crew-card-skill">{mate.skill}</p>
                <p className="crew-card-speed">Speed: {mate.speed}</p>
              </Link>
              <Link to={`/edit/${mate.id}`} className="btn btn-small">Edit</Link>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default Gallery
