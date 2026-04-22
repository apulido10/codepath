import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import supabase from '../client'
import { ROLES, SKILLS_BY_ROLE, SPEEDS, COLORS } from './CreateCrewmate'

function EditCrewmate({ crewmates, onUpdated }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const mate = crewmates.find((c) => String(c.id) === id)

  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [skill, setSkill] = useState('')
  const [speed, setSpeed] = useState('Medium')
  const [color, setColor] = useState('#3498db')
  const [bio, setBio] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (mate) {
      setName(mate.name)
      setRole(mate.role)
      setSkill(mate.skill)
      setSpeed(mate.speed)
      setColor(mate.color)
      setBio(mate.bio || '')
    }
  }, [mate])

  if (!mate) {
    return (
      <section className="form-page">
        <Link to="/gallery" className="back-link">← Back to Gallery</Link>
        <div className="empty-state">
          <h2>Crewmate not found</h2>
        </div>
      </section>
    )
  }

  const availableSkills = role ? SKILLS_BY_ROLE[role] : []

  const handleRoleChange = (newRole) => {
    setRole(newRole)
    if (!SKILLS_BY_ROLE[newRole].includes(skill)) {
      setSkill('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !role || !skill) return
    setSubmitting(true)

    const { error } = await supabase
      .from('crewmates')
      .update({ name: name.trim(), role, skill, speed, color, bio: bio.trim() })
      .eq('id', id)

    if (!error) {
      await onUpdated()
      navigate(`/crewmate/${id}`)
    }
    setSubmitting(false)
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(`Are you sure you want to delete ${mate.name}?`)
    if (!confirmed) return

    const { error } = await supabase.from('crewmates').delete().eq('id', id)
    if (!error) {
      await onUpdated()
      navigate('/gallery')
    }
  }

  return (
    <section className="form-page">
      <Link to={`/crewmate/${id}`} className="back-link">← Back to Detail</Link>
      <h1>Edit Crewmate</h1>
      <p className="form-subtitle">Update {mate.name}'s attributes or remove them from the crew.</p>

      <form onSubmit={handleSubmit} className="crew-form">
        <label className="form-field">
          <span>Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter crewmate name"
            required
          />
        </label>

        <div className="form-field">
          <span>Role (Category)</span>
          <div className="option-group">
            {ROLES.map((r) => (
              <button
                key={r}
                type="button"
                className={`option-btn ${role === r ? 'selected' : ''}`}
                onClick={() => handleRoleChange(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {role && (
          <div className="form-field">
            <span>Skill (based on {role} role)</span>
            <div className="option-group">
              {availableSkills.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`option-btn ${skill === s ? 'selected' : ''}`}
                  onClick={() => setSkill(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="form-field">
          <span>Speed</span>
          <div className="option-group">
            {SPEEDS.map((s) => (
              <button
                key={s}
                type="button"
                className={`option-btn ${speed === s ? 'selected' : ''}`}
                onClick={() => setSpeed(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="form-field">
          <span>Color</span>
          <div className="color-group">
            {COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                className={`color-btn ${color === c.value ? 'selected' : ''}`}
                style={{ background: c.value }}
                onClick={() => setColor(c.value)}
                title={c.name}
              />
            ))}
          </div>
        </div>

        <label className="form-field">
          <span>Bio (optional)</span>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write a short backstory..."
            rows={3}
          />
        </label>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary submit-btn"
            disabled={submitting || !name.trim() || !role || !skill}
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" className="btn btn-danger" onClick={handleDelete}>
            Delete Crewmate
          </button>
        </div>
      </form>
    </section>
  )
}

export default EditCrewmate
