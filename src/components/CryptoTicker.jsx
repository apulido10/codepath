import { useEffect, useState } from 'react'

const URL =
  'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&price_change_percentage=24h'

const formatPrice = (n) => {
  if (n == null) return '—'
  if (n >= 1) return `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 6 })}`
}

const formatMarketCap = (n) => {
  if (n == null) return ''
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
  return `$${n.toLocaleString()}`
}

function CryptoTicker() {
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatedAt, setUpdatedAt] = useState(null)

  const load = async () => {
    try {
      const res = await fetch(URL)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setCoins(data)
      setUpdatedAt(new Date())
      setError(null)
    } catch (e) {
      setError(e.message || 'Failed to load prices')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const id = setInterval(load, 60_000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="ticker-panel">
      <div className="ticker-head">
        <div>
          <p className="eyebrow">Live Markets</p>
          <h2>Top 10 Cryptocurrencies</h2>
        </div>
        <div className="ticker-meta">
          {loading && coins.length === 0 && <span className="ticker-status">Loading…</span>}
          {error && <span className="ticker-status ticker-error">⚠ {error}</span>}
          {updatedAt && !error && (
            <span className="ticker-status">
              Updated {updatedAt.toLocaleTimeString()}
            </span>
          )}
          <button className="btn-small" onClick={load} disabled={loading}>
            Refresh
          </button>
        </div>
      </div>

      <div className="ticker-grid">
        {coins.map((c) => {
          const change = c.price_change_percentage_24h ?? 0
          const up = change >= 0
          return (
            <div key={c.id} className="ticker-card">
              <div className="ticker-rank">#{c.market_cap_rank}</div>
              {c.image ? (
                <img src={c.image} alt={c.symbol} className="ticker-logo" />
              ) : (
                <div className="ticker-symbol">{c.symbol?.charAt(0).toUpperCase()}</div>
              )}
              <div className="ticker-body">
                <div className="ticker-name">
                  <strong>{c.symbol?.toUpperCase()}</strong>
                  <span>{c.name}</span>
                </div>
                <div className="ticker-price">{formatPrice(c.current_price)}</div>
                <div className="ticker-row">
                  <span className={`ticker-change ${up ? 'up' : 'down'}`}>
                    {up ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
                  </span>
                  <span className="ticker-cap">{formatMarketCap(c.market_cap)}</span>
                </div>
              </div>
            </div>
          )
        })}
        {loading && coins.length === 0 && (
          <div className="ticker-skeleton">Fetching live prices from CoinGecko…</div>
        )}
      </div>
    </section>
  )
}

export default CryptoTicker
