import { useState } from 'react'
import './App.css'

function App() {
  const [anime, setAnime] = useState(null)
  const [banList, setBanList] = useState([])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchAnime = async () => {
    setLoading(true)
    const maxAttempts = 10
    let attempts = 0

    try {
      while (attempts < maxAttempts) {
        attempts++
        const randomPage = Math.floor(Math.random() * 500) + 1
        const response = await fetch(
          `https://api.jikan.moe/v4/anime?page=${randomPage}&limit=25&sfw=true`
        )
        const data = await response.json()

        if (!data.data || data.data.length === 0) continue

        const validAnime = data.data.filter((item) => {
          if (!item.images?.jpg?.large_image_url) return false

          const type = item.type || ''
          const episodes = item.episodes ? `${item.episodes} eps` : ''
          const rating = item.rating || ''
          const source = item.source || ''

          const attributes = [type, episodes, rating, source].filter(Boolean)
          return !attributes.some((attr) => banList.includes(attr))
        })

        if (validAnime.length === 0) continue

        const pick = validAnime[Math.floor(Math.random() * validAnime.length)]

        const animeData = {
          name: pick.title || 'Unknown',
          type: pick.type || 'Unknown',
          episodes: pick.episodes ? `${pick.episodes} eps` : 'Unknown',
          rating: pick.rating || 'Unknown',
          source: pick.source || 'Unknown',
          score: pick.score ? `${pick.score}/10` : 'N/A',
          image: pick.images.jpg.large_image_url,
        }

        setAnime(animeData)
        setHistory((prev) => [animeData, ...prev])
        setLoading(false)
        return
      }

      setAnime(null)
    } catch (error) {
      console.error('Failed to fetch anime:', error)
    }
    setLoading(false)
  }

  const addToBanList = (attribute) => {
    if (!banList.includes(attribute)) {
      setBanList((prev) => [...prev, attribute])
    }
  }

  const removeFromBanList = (attribute) => {
    setBanList((prev) => prev.filter((item) => item !== attribute))
  }

  return (
    <div className="app-layout">
      <aside className="sidebar history-sidebar">
        <h2 className="sidebar-title">What have we seen so far?</h2>
        {history.length === 0 ? (
          <p className="sidebar-empty">Discover anime to see history</p>
        ) : (
          <ul className="history-list">
            {history.map((item, index) => (
              <li key={index} className="history-item">
                <img src={item.image} alt={item.name} className="history-image" />
                <span className="history-text">
                  {item.name} ({item.type})
                </span>
              </li>
            ))}
          </ul>
        )}
      </aside>

      <main className="main-content">
        <h1 className="app-title">Veni Vici!</h1>
        <p className="app-subtitle">Discover anime from your wildest dreams!</p>
        <div className="emojis">{'🍥🔥⚔️🌸✨💫🎌🗡️🍜'}</div>

        {anime ? (
          <div className="item-display">
            <h2 className="item-name">{anime.name}</h2>
            <p className="item-score">Score: {anime.score}</p>
            <div className="attributes">
              <button className="attribute-btn" onClick={() => addToBanList(anime.type)}>
                {anime.type}
              </button>
              <button className="attribute-btn" onClick={() => addToBanList(anime.episodes)}>
                {anime.episodes}
              </button>
              <button className="attribute-btn" onClick={() => addToBanList(anime.rating)}>
                {anime.rating}
              </button>
              <button className="attribute-btn" onClick={() => addToBanList(anime.source)}>
                {anime.source}
              </button>
            </div>
            <img src={anime.image} alt={anime.name} className="item-image" />
          </div>
        ) : (
          <div className="empty-state">
            {banList.length > 0 && !loading ? (
              <p>No anime match your criteria. Try removing some bans!</p>
            ) : null}
          </div>
        )}

        <button className="discover-btn" onClick={fetchAnime} disabled={loading}>
          {'🎌 '}
          {loading ? 'Discovering...' : 'Discover!'}
        </button>
      </main>

      <aside className="sidebar ban-sidebar">
        <h2 className="sidebar-title">Ban List</h2>
        <p className="ban-description">Select an attribute in your listing to ban it</p>
        {banList.length === 0 ? (
          <p className="sidebar-empty">No bans yet</p>
        ) : (
          <div className="ban-list">
            {banList.map((item) => (
              <button key={item} className="ban-item" onClick={() => removeFromBanList(item)}>
                {item}
              </button>
            ))}
          </div>
        )}
      </aside>
    </div>
  )
}

export default App
