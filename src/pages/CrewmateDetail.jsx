import { useParams, Link } from 'react-router-dom'

function CrewmateDetail({ crewmates }) {
  const { id } = useParams()
  const mate = crewmates.find((c) => String(c.id) === id)

  if (!mate) {
    return (
      <section className="detail-view">
        <Link to="/gallery" className="back-link">← Back to Gallery</Link>
        <div className="empty-state">
          <h2>Crewmate not found</h2>
          <p>This crewmate may have been deleted or doesn't exist.</p>
        </div>
      </section>
    )
  }

  const createdDate = new Date(mate.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <section className="detail-view">
      <Link to="/gallery" className="back-link">← Back to Gallery</Link>

      <div className="detail-card">
        <div className="detail-header">
          <div className="detail-badge" style={{ background: mate.color }}>
            {mate.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2>{mate.name}</h2>
            <p className="detail-subtitle">{mate.role} · {mate.skill}</p>
          </div>
        </div>

        <div className="detail-grid">
          <div className="detail-field">
            <span className="detail-label">Role</span>
            <span className="detail-value">{mate.role}</span>
          </div>
          <div className="detail-field">
            <span className="detail-label">Skill</span>
            <span className="detail-value">{mate.skill}</span>
          </div>
          <div className="detail-field">
            <span className="detail-label">Speed</span>
            <span className="detail-value">{mate.speed}</span>
          </div>
          <div className="detail-field">
            <span className="detail-label">Color</span>
            <span className="detail-value">
              <span className="color-swatch" style={{ background: mate.color }} />
              {mate.color}
            </span>
          </div>
          <div className="detail-field">
            <span className="detail-label">Created</span>
            <span className="detail-value">{createdDate}</span>
          </div>
          <div className="detail-field">
            <span className="detail-label">ID</span>
            <span className="detail-value" style={{ fontSize: '0.85rem' }}>{mate.id}</span>
          </div>
        </div>

        {mate.bio && (
          <div className="detail-bio">
            <h3>Bio</h3>
            <p>{mate.bio}</p>
          </div>
        )}

        <div className="detail-actions">
          <Link to={`/edit/${mate.id}`} className="btn btn-primary">Edit Crewmate</Link>
          <Link to="/gallery" className="btn btn-secondary">Back to Gallery</Link>
        </div>
      </div>
    </section>
  )
}

export default CrewmateDetail
