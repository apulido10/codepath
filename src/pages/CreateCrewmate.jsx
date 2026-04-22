import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../client'

const ROLES = ['Engineer', 'Scientist', 'Captain', 'Medic', 'Security']

const SKILLS_BY_ROLE = {
  Engineer: ['Fix Wiring', 'Calibrate Engine', 'Repair Shields', 'Manage Power'],
  Scientist: ['Analyze Samples', 'Download Data', 'Research', 'Run Diagnostics'],
  Captain: ['Navigate', 'Command', 'Strategize', 'Negotiate'],
  Medic: ['Heal', 'Scan', 'Decontaminate', 'Administer Medicine'],
  Security: ['Patrol', 'Monitor Cameras', 'Weapons Check', 'Lockdown'],
}

const SPEEDS = ['Slow', 'Medium', 'Fast']

const COLORS = [
  { name: 'Red', value: '#e74c3c' },
  { name: 'Blue', value: '#3498db' },
  { name: 'Green', value: '#2ecc71' },
  { name: 'Yellow', value: '#f1c40f' },
  { name: 'Purple', value: '#9b59b6' },
  { name: 'Orange', value: '#e67e22' },
  { name: 'Pink', value: '#e84393' },
  { name: 'Cyan', value: '#00cec9' },
]

function CreateCrewmate({ onCreated }) {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [skill, setSkill] = useState('')
  const [speed, setSpeed] = useState('Medium')
  const [color, setColor] = useState('#3498db')
  const [bio, setBio] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const availableSkills = role ? SKILLS_BY_ROLE[role] : []

  const handleRoleChange = (newRole) => {
    setRole(newRole)
    setSkill('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !role || !skill) return
    setSubmitting(true)

    const { error } = await supabase.from('crewmates').insert([
      { name: name.trim(), role, skill, speed, color, bio: bio.trim() },
    ])

    if (error) {
      console.error('Supabase insert error:', error)
      alert(`Error creating crewmate: ${error.message}`)
    } else {
      await onCreated()
      navigate('/gallery')
    }
    setSubmitting(false)
  }

  return (
    <section className="form-page">
      <h1>Create a New Crewmate</h1>
      <p className="form-subtitle">Assemble your crew one member at a time.</p>

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
          <span>Bio (optional, shown on detail page)</span>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write a short backstory for this crewmate..."
            rows={3}
          />
        </label>

        <button
          type="submit"
          className="btn btn-primary submit-btn"
          disabled={submitting || !name.trim() || !role || !skill}
        >
          {submitting ? 'Creating...' : 'Create Crewmate'}
        </button>
      </form>
    </section>
  )
}

export default CreateCrewmate
export { ROLES, SKILLS_BY_ROLE, SPEEDS, COLORS }
