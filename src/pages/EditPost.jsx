import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import supabase from '../client'
import TopicSelect from '../components/TopicSelect'

const GENERAL = { value: 'General', label: 'General Discussion', icon: '✦', iconColor: '#5287f4' }

const FALLBACK_TOPICS = [
  GENERAL,
  { value: 'BTC', label: 'BTC · Bitcoin', icon: 'B', iconColor: '#f7931a' },
  { value: 'ETH', label: 'ETH · Ethereum', icon: 'E', iconColor: '#627eea' },
  { value: 'SOL', label: 'SOL · Solana', icon: 'S', iconColor: '#14f195' },
  { value: 'XRP', label: 'XRP · XRP', icon: 'X', iconColor: '#23292f' },
  { value: 'DOGE', label: 'DOGE · Dogecoin', icon: 'D', iconColor: '#c3a634' },
  { value: 'ADA', label: 'ADA · Cardano', icon: 'A', iconColor: '#3cc8c8' },
  { value: 'BNB', label: 'BNB · BNB', icon: 'B', iconColor: '#f0b90b' },
  { value: 'AVAX', label: 'AVAX · Avalanche', icon: 'A', iconColor: '#e84142' },
  { value: 'TRX', label: 'TRX · TRON', icon: 'T', iconColor: '#ff060a' },
  { value: 'LINK', label: 'LINK · Chainlink', icon: 'L', iconColor: '#2a5ada' },
]

const TOP10_URL =
  'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1'

const STORAGE_BUCKET = 'post-images'

function EditPost({ onChanged }) {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageMode, setImageMode] = useState('url')
  const [file, setFile] = useState(null)
  const [topic, setTopic] = useState('General')
  const [topics, setTopics] = useState(FALLBACK_TOPICS)
  const [saving, setSaving] = useState(false)
  const [uploadStatus, setUploadStatus] = useState(null)

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      if (error) console.error(error)
      if (!data) {
        setNotFound(true)
      } else {
        setTitle(data.title || '')
        setContent(data.content || '')
        setImageUrl(data.image_url || '')
        setTopic(data.flag || 'General')
      }
      setLoading(false)
    }
    load()
  }, [id])

  useEffect(() => {
    const loadTopics = async () => {
      try {
        const res = await fetch(TOP10_URL)
        if (!res.ok) return
        const data = await res.json()
        setTopics([
          GENERAL,
          ...data.map((c) => ({
            value: c.symbol.toUpperCase(),
            label: `${c.symbol.toUpperCase()} · ${c.name}`,
            icon: c.image,
            iconImage: true,
          })),
        ])
      } catch {
        // keep fallback
      }
    }
    loadTopics()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)

    let finalImageUrl = imageUrl.trim() || null
    if (imageMode === 'upload' && file) {
      try {
        setUploadStatus('Uploading image…')
        const ext = file.name.split('.').pop()
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
        const { error: upErr } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(path, file, { upsert: false, contentType: file.type })
        if (upErr) throw upErr
        const { data: pub } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(path)
        finalImageUrl = pub.publicUrl
      } catch (err) {
        console.error(err)
        alert(
          `Image upload failed: ${err.message}\n\nMake sure the public bucket "${STORAGE_BUCKET}" exists in Supabase Storage.`,
        )
        setUploadStatus(null)
        setSaving(false)
        return
      }
    }

    const { error } = await supabase
      .from('posts')
      .update({
        title: title.trim(),
        content: content.trim() || null,
        image_url: finalImageUrl,
        flag: topic,
      })
      .eq('id', id)

    setUploadStatus(null)

    if (error) {
      console.error(error)
      alert(`Could not save: ${error.message}`)
      setSaving(false)
      return
    }

    onChanged?.()
    navigate(`/post/${id}`)
  }

  if (loading) return <div className="loading-state">Loading post…</div>

  if (notFound) {
    return (
      <div className="empty-state">
        <h2>Post not found</h2>
        <Link to="/" className="btn btn-primary">Back to Feed</Link>
      </div>
    )
  }

  return (
    <section className="form-page">
      <Link to={`/post/${id}`} className="back-link">← Back to post</Link>
      <h1>Edit Post</h1>
      <p className="form-subtitle">Update your post details below.</p>

      <form onSubmit={handleSubmit} className="crew-form">
        <label className="form-field">
          <span>Title *</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={140}
          />
        </label>

        <label className="form-field">
          <span>Content (optional)</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
          />
        </label>

        <div className="form-field">
          <span>Image (optional)</span>
          <div className="image-toggle">
            <button
              type="button"
              className={`option-btn ${imageMode === 'url' ? 'selected' : ''}`}
              onClick={() => setImageMode('url')}
            >
              Paste URL
            </button>
            <button
              type="button"
              className={`option-btn ${imageMode === 'upload' ? 'selected' : ''}`}
              onClick={() => setImageMode('upload')}
            >
              Upload from device
            </button>
          </div>
          {imageMode === 'url' ? (
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
            />
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="file-input"
            />
          )}
          {file && imageMode === 'upload' && (
            <div className="file-preview">Selected: {file.name}</div>
          )}
          {imageMode === 'upload' && imageUrl && !file && (
            <div className="file-preview">Current image will be replaced if you pick a new file.</div>
          )}
        </div>

        {uploadStatus && <div className="upload-status">{uploadStatus}</div>}

        <div className="form-field">
          <span>Topic</span>
          <TopicSelect value={topic} onChange={setTopic} options={topics} />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving || !title.trim()}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link to={`/post/${id}`} className="btn btn-secondary">Cancel</Link>
        </div>
      </form>
    </section>
  )
}

export default EditPost
