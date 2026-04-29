import { useEffect, useRef, useState } from 'react'

function TopicIcon({ opt }) {
  if (!opt) return null
  if (opt.iconImage && opt.icon) {
    return <img src={opt.icon} alt="" className="topic-icon-img" />
  }
  if (opt.icon) {
    return (
      <span className="topic-icon" style={{ background: opt.iconColor || '#5287f4' }}>
        {opt.icon}
      </span>
    )
  }
  return null
}

function TopicSelect({ value, onChange, options }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const current = options.find((o) => o.value === value) || options[0]

  return (
    <div className="topic-select" ref={wrapRef}>
      <button
        type="button"
        className={`topic-trigger ${open ? 'open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="topic-trigger-label">
          <TopicIcon opt={current} />
          <span>{current?.label}</span>
        </span>
        <span className={`topic-caret ${open ? 'open' : ''}`}>▾</span>
      </button>

      {open && (
        <ul className="topic-menu" role="listbox">
          {options.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              className={`topic-option ${opt.value === value ? 'selected' : ''}`}
              onClick={() => {
                onChange(opt.value)
                setOpen(false)
              }}
            >
              <TopicIcon opt={opt} />
              <span className="topic-option-label">{opt.label}</span>
              {opt.value === value && <span className="topic-check">✓</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TopicSelect
