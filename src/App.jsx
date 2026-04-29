import { useEffect, useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import supabase from './client'
import Home from './pages/Home'
import PostDetail from './pages/PostDetail'
import EditPost from './pages/EditPost'
import PostModal from './components/PostModal'
import './App.css'

function App() {
  const [posts, setPosts] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const location = useLocation()

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      console.error('Supabase fetch error:', error)
    } else {
      setPosts(data || [])
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <Link to="/" className="brand">
            <span className="brand-mark">₿</span>
            <span className="brand-name">BitLedgerly</span>
          </Link>

          <nav className="topnav">
            <Link
              to="/"
              className={`topnav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Feed
            </Link>
            <a
              className="topnav-link"
              href="https://www.coingecko.com/"
              target="_blank"
              rel="noreferrer"
            >
              Markets
            </a>
          </nav>

          <button
            type="button"
            className="topbar-cta"
            onClick={() => setModalOpen(true)}
          >
            New Post
          </button>
        </div>
      </header>

      <main className="page">
        <Routes>
          <Route
            path="/"
            element={<Home posts={posts} onOpenCreate={() => setModalOpen(true)} />}
          />
          <Route path="/post/:id" element={<PostDetail onChanged={fetchPosts} />} />
          <Route path="/edit/:id" element={<EditPost onChanged={fetchPosts} />} />
        </Routes>
      </main>

      <footer className="site-footer">
        Built for the love of crypto · Prices via CoinGecko
      </footer>

      <PostModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={fetchPosts}
      />
    </div>
  )
}

export default App
