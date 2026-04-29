import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../client'
import TopicSelect from './TopicSelect'

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

function PostModal({ open, onClose, onCreated }) {
  const navigate = useNavigate()
  const dialogRef = useRef(null)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [topic, setTopic] = useState('General')
  const [imageMode, setImageMode] = useState('url')
  const [imageUrl, setImageUrl] = useState('')
  const [file, setFile] = useState(null)
  const [topics, setTopics] = useState(FALLBACK_TOPICS)
  const [submitting, setSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(null)

  useEffect(() => {
    if (!open) return
    const load = async () => {
      try {
        const res = await fetch(TOP10_URL)
        if (!res.ok) throw new Error('failed')
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
        // keep fallback list
      }
    }
    load()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const reset = () => {
    setTitle('')
    setContent('')
    setTopic('General')
    setImageMode('url')
    setImageUrl('')
    setFile(null)
    setUploadProgress(null)
  }

  const handleClose = () => {
    if (submitting) return
    reset()
    onClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    setSubmitting(true)

    let finalImageUrl = null
    if (imageMode === 'url' && imageUrl.trim()) {
      finalImageUrl = imageUrl.trim()
    } else if (imageMode === 'upload' && file) {
      try {
        setUploadProgress('Uploading image…')
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
          `Image upload failed: ${err.message}\n\nMake sure you've created a public bucket named "${STORAGE_BUCKET}" in Supabase Storage.`,
        )
        setUploadProgress(null)
        setSubmitting(false)
        return
      }
    }

    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          title: title.trim(),
          content: content.trim() || null,
          image_url: finalImageUrl,
          flag: topic,
          upvotes: 0,
        },
      ])
      .select()
      .single()

    setUploadProgress(null)

    if (error) {
      console.error(error)
      alert(`Error creating post: ${error.message}`)
      setSubmitting(false)
      return
    }

    await onCreated?.()
    setSubmitting(false)
    reset()
    onClose()
    navigate(`/post/${data.id}`)
  }

  if (!open) return null

  return (
    <div className="modal-overlay" onMouseDown={handleClose}>
      <div
        ref={dialogRef}
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <h2 id="modal-title">Create a Post</h2>
          <button
            type="button"
            className="modal-close"
            onClick={handleClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <label className="form-field">
            <span>Title *</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's on your mind?"
              required
              maxLength={140}
              autoFocus
            />
          </label>

          <div className="form-field">
            <span>Topic</span>
            <TopicSelect value={topic} onChange={setTopic} options={topics} />
          </div>

          <label className="form-field">
            <span>Content (optional)</span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Add details, your take, links, charts…"
              rows={4}
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
          </div>

          {uploadProgress && <div className="upload-status">{uploadProgress}</div>}

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || !title.trim()}
            >
              {submitting ? 'Posting…' : 'Post'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PostModal
