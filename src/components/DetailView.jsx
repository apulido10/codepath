import { useParams, Link } from 'react-router-dom'

export default function DetailView({ countries }) {
  const { id } = useParams()
  const country = countries.find((c) => c.id === id)

  if (!country) {
    return (
      <div className="detail-view">
        <Link to="/" className="back-link">Back to Dashboard</Link>
        <div className="detail-card">
          <h2>Country not found</h2>
          <p>No country matches the ID &ldquo;{id}&rdquo;.</p>
        </div>
      </div>
    )
  }

  const sameRegion = countries.filter(
    (c) => c.region === country.region && c.id !== country.id,
  )
  const sameIncome = countries.filter(
    (c) => c.incomeLevel === country.incomeLevel && c.id !== country.id,
  )

  return (
    <div className="detail-view">
      <Link to="/" className="back-link">Back to Dashboard</Link>

      <div className="detail-card">
        <div className="detail-header">
          <div className="detail-badge">{country.iso2Code}</div>
          <div>
            <h2>{country.name}</h2>
            <p className="detail-subtitle">{country.capital}</p>
          </div>
        </div>

        <div className="detail-grid">
          <div className="detail-field">
            <span className="detail-label">ISO Code</span>
            <span className="detail-value">{country.iso2Code}</span>
          </div>
          <div className="detail-field">
            <span className="detail-label">Capital</span>
            <span className="detail-value">{country.capital}</span>
          </div>
          <div className="detail-field">
            <span className="detail-label">Region</span>
            <span className="detail-value">{country.region}</span>
          </div>
          <div className="detail-field">
            <span className="detail-label">Income Level</span>
            <span className="detail-value">{country.incomeLevel}</span>
          </div>
          <div className="detail-field">
            <span className="detail-label">Lending Type</span>
            <span className="detail-value">{country.lendingType}</span>
          </div>
          <div className="detail-field">
            <span className="detail-label">Country ID</span>
            <span className="detail-value">{country.id}</span>
          </div>
        </div>
      </div>

      <div className="detail-card">
        <h3>Countries in {country.region}</h3>
        <p className="detail-meta">{sameRegion.length} other countries share this region</p>
        <div className="related-list">
          {sameRegion.slice(0, 8).map((c) => (
            <Link key={c.id} to={`/country/${c.id}`} className="related-chip">
              {c.iso2Code} — {c.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="detail-card">
        <h3>Countries with {country.incomeLevel}</h3>
        <p className="detail-meta">{sameIncome.length} other countries share this income level</p>
        <div className="related-list">
          {sameIncome.slice(0, 8).map((c) => (
            <Link key={c.id} to={`/country/${c.id}`} className="related-chip">
              {c.iso2Code} — {c.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
