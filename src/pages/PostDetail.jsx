import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import supabase from '../client'

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : ''

const UPVOTES_KEY = 'bitledgerly_upvoted_posts'

const readUpvoted = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem(UPVOTES_KEY) || '[]'))
  } catch {
    return new Set()
  }
}

const writeUpvoted = (set) => {
  localStorage.setItem(UPVOTES_KEY, JSON.stringify([...set]))
}

function PostDetail({ onChanged }) {
  const { id } = useParams()
  const navigate = useNavigate()

  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [commentAuthor, setCommentAuthor] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [upvoting, setUpvoting] = useState(false)
  const [hasUpvoted, setHasUpvoted] = useState(false)

  useEffect(() => {
    setHasUpvoted(readUpvoted().has(String(id)))
  }, [id])

  const loadPost = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (error) {
      console.error(error)
    }
    if (!data) {
      setNotFound(true)
    } else {
      setPost(data)
    }
    setLoading(false)
  }

  const loadComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', id)
      .order('created_at', { ascending: true })
    if (error) {
      console.error(error)
      return
    }
    setComments(data || [])
  }

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    loadPost()
    loadComments()
  }, [id])

  const handleUpvote = async () => {
    if (!post || upvoting) return
    setUpvoting(true)
    const wasUpvoted = hasUpvoted
    const delta = wasUpvoted ? -1 : 1
    const prev = post.upvotes ?? 0
    const next = Math.max(0, prev + delta)

    setPost({ ...post, upvotes: next })
    setHasUpvoted(!wasUpvoted)

    const { error } = await supabase
      .from('posts')
      .update({ upvotes: next })
      .eq('id', id)

    if (error) {
      console.error(error)
      setPost({ ...post, upvotes: prev })
      setHasUpvoted(wasUpvoted)
      alert(`Could not update vote: ${error.message}`)
    } else {
      const set = readUpvoted()
      if (wasUpvoted) set.delete(String(id))
      else set.add(String(id))
      writeUpvoted(set)
      onChanged?.()
    }
    setUpvoting(false)
  }

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return
    const prev = comments
    setComments(comments.filter((c) => c.id !== commentId))
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
    if (error) {
      console.error(error)
      alert(`Could not delete: ${error.message}`)
      setComments(prev)
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    const text = commentText.trim()
    if (!text) return
    setSubmitting(true)
    const { error } = await supabase.from('comments').insert([
      {
        post_id: id,
        author: commentAuthor.trim() || 'Anonymous',
        content: text,
      },
    ])
    if (error) {
      console.error(error)
      alert(`Could not add comment: ${error.message}`)
    } else {
      setCommentText('')
      await loadComments()
    }
    setSubmitting(false)
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return
    await supabase.from('comments').delete().eq('post_id', id)
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (error) {
      alert(`Could not delete: ${error.message}`)
      return
    }
    onChanged?.()
    navigate('/')
  }

  if (loading) {
    return <div className="loading-state">Loading post…</div>
  }

  if (notFound || !post) {
    return (
      <div className="empty-state">
        <h2>Post not found</h2>
        <p>It may have been deleted.</p>
        <Link to="/" className="btn btn-primary">Back to Feed</Link>
      </div>
    )
  }

  return (
    <div className="detail-view">
      <Link to="/" className="back-link">← Back to feed</Link>

      <article className="detail-card">
        <div className="post-card-meta">
          <span className="post-topic">{post.flag || 'General'}</span>
          <span className="post-time">Posted {formatDate(post.created_at)}</span>
        </div>
        <h1 className="detail-title">{post.title}</h1>

        {post.image_url && (
          <img
            src={post.image_url}
            alt=""
            className="detail-image"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        )}

        {post.content && <p className="detail-content">{post.content}</p>}

        <div className="detail-actions">
          <button
            type="button"
            className={`btn upvote-btn ${hasUpvoted ? 'upvoted' : ''}`}
            onClick={handleUpvote}
            disabled={upvoting}
            aria-pressed={hasUpvoted}
          >
            ▲ {hasUpvoted ? 'Upvoted' : 'Upvote'} · {post.upvotes ?? 0}
          </button>
          <Link to={`/edit/${post.id}`} className="btn btn-secondary">Edit</Link>
          <button type="button" className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </article>

      <section className="comments-section">
        <h2>Comments ({comments.length})</h2>

        <form className="comment-form" onSubmit={handleAddComment}>
          <input
            type="text"
            className="comment-author-input"
            placeholder="Your name (optional)"
            value={commentAuthor}
            onChange={(e) => setCommentAuthor(e.target.value)}
            maxLength={40}
          />
          <textarea
            className="comment-input"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows={3}
            required
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting || !commentText.trim()}
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>

        {comments.length === 0 ? (
          <p className="comments-empty">No comments yet — start the conversation.</p>
        ) : (
          <ul className="comment-list">
            {comments.map((c) => (
              <li key={c.id} className="comment-item">
                <div className="comment-head">
                  <strong>{c.author || 'Anonymous'}</strong>
                  <div className="comment-meta">
                    <span className="comment-time">{formatDate(c.created_at)}</span>
                    <button
                      type="button"
                      className="comment-delete"
                      onClick={() => handleDeleteComment(c.id)}
                      aria-label="Delete comment"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="comment-text">{c.content}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default PostDetail
