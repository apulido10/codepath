import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import CryptoTicker from '../components/CryptoTicker'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'top', label: 'Top (Upvotes)' },
]

const formatRelative = (iso) => {
  if (!iso) return ''
  const ms = Date.now() - new Date(iso).getTime()
  const s = Math.floor(ms / 1000)
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d}d ago`
  return new Date(iso).toLocaleDateString()
}

function Home({ posts, onOpenCreate }) {
  const [sort, setSort] = useState('newest')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = posts
    if (q) list = list.filter((p) => (p.title || '').toLowerCase().includes(q))
    list = [...list].sort((a, b) => {
      if (sort === 'top') return (b.upvotes ?? 0) - (a.upvotes ?? 0)
      return new Date(b.created_at) - new Date(a.created_at)
    })
    return list
  }, [posts, sort, query])

  return (
    <>
      <CryptoTicker />

      <section className="feed-section">
        <div className="feed-toolbar">
          <h2>Feed</h2>
          <div className="feed-controls">
            <input
              type="search"
              className="search-input"
              placeholder="Search posts by title..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="sort-group">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`option-btn ${sort === opt.value ? 'selected' : ''}`}
                  onClick={() => setSort(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            {posts.length === 0 ? (
              <>
                <h2>No posts yet</h2>
                <p>Be the first to start a discussion!</p>
                <button type="button" className="btn btn-primary" onClick={onOpenCreate}>
                  Create Post
                </button>
              </>
            ) : (
              <>
                <h2>No posts match your search</h2>
                <p>Try a different query or clear the search.</p>
              </>
            )}
          </div>
        ) : (
          <ul className="post-list">
            {filtered.map((post) => (
              <li key={post.id}>
                <Link to={`/post/${post.id}`} className="post-card">
                  <div className="post-card-meta">
                    <span className="post-topic">{post.flag || 'General'}</span>
                    <span className="post-time">{formatRelative(post.created_at)}</span>
                  </div>
                  <h3 className="post-title">{post.title}</h3>
                  <div className="post-card-foot">
                    <span className="upvote-pill">▲ {post.upvotes ?? 0} upvotes</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}

export default Home
