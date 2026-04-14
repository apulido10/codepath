import { useEffect, useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie,
} from 'recharts'
import Sidebar from './components/Sidebar'
import DetailView from './components/DetailView'
import './App.css'

const fallbackCountries = [
  { id: 'usa', name: 'United States', capital: 'Washington, D.C.', region: 'North America', incomeLevel: 'High income', lendingType: 'Not classified', iso2Code: 'US' },
  { id: 'jpn', name: 'Japan', capital: 'Tokyo', region: 'East Asia & Pacific', incomeLevel: 'High income', lendingType: 'Not classified', iso2Code: 'JP' },
  { id: 'bra', name: 'Brazil', capital: 'Brasilia', region: 'Latin America & Caribbean', incomeLevel: 'Upper middle income', lendingType: 'IBRD', iso2Code: 'BR' },
  { id: 'ind', name: 'India', capital: 'New Delhi', region: 'South Asia', incomeLevel: 'Lower middle income', lendingType: 'IBRD', iso2Code: 'IN' },
  { id: 'ken', name: 'Kenya', capital: 'Nairobi', region: 'Sub-Saharan Africa', incomeLevel: 'Lower middle income', lendingType: 'Blend', iso2Code: 'KE' },
  { id: 'deu', name: 'Germany', capital: 'Berlin', region: 'Europe & Central Asia', incomeLevel: 'High income', lendingType: 'Not classified', iso2Code: 'DE' },
  { id: 'aus', name: 'Australia', capital: 'Canberra', region: 'East Asia & Pacific', incomeLevel: 'High income', lendingType: 'Not classified', iso2Code: 'AU' },
  { id: 'nga', name: 'Nigeria', capital: 'Abuja', region: 'Sub-Saharan Africa', incomeLevel: 'Lower middle income', lendingType: 'Blend', iso2Code: 'NG' },
  { id: 'mex', name: 'Mexico', capital: 'Mexico City', region: 'Latin America & Caribbean', incomeLevel: 'Upper middle income', lendingType: 'IBRD', iso2Code: 'MX' },
  { id: 'fra', name: 'France', capital: 'Paris', region: 'Europe & Central Asia', incomeLevel: 'High income', lendingType: 'Not classified', iso2Code: 'FR' },
  { id: 'zaf', name: 'South Africa', capital: 'Pretoria', region: 'Sub-Saharan Africa', incomeLevel: 'Upper middle income', lendingType: 'IBRD', iso2Code: 'ZA' },
  { id: 'idn', name: 'Indonesia', capital: 'Jakarta', region: 'East Asia & Pacific', incomeLevel: 'Upper middle income', lendingType: 'IBRD', iso2Code: 'ID' },
]

function normalizeCountry(country) {
  return {
    id: country.id ?? country.iso2Code ?? country.name,
    name: country.name ?? 'Unknown Country',
    capital: country.capitalCity || 'N/A',
    region: country.region?.value || 'Other',
    incomeLevel: country.incomeLevel?.value || 'Unknown',
    lendingType: country.lendingType?.value || 'Unknown',
    iso2Code: country.iso2Code || '--',
  }
}

const BAR_COLORS = ['#5287f4', '#4ed2ff', '#f4a752', '#52f4a7', '#f452a7', '#a752f4', '#f4f452']
const PIE_COLORS = ['#5287f4', '#4ed2ff', '#f4a752', '#52f4a7', '#f452a7', '#c8c8c8']

function Dashboard({ countries, loading, errorMessage }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('All')
  const [selectedIncome, setSelectedIncome] = useState('All')
  const [showRegionChart, setShowRegionChart] = useState(true)
  const [showIncomeChart, setShowIncomeChart] = useState(true)

  const regionOptions = ['All', ...new Set(countries.map((c) => c.region))]
  const incomeOptions = ['All', ...new Set(countries.map((c) => c.incomeLevel))]

  const filteredCountries = countries.filter((country) => {
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      country.name.toLowerCase().includes(query) ||
      country.capital.toLowerCase().includes(query) ||
      country.iso2Code.toLowerCase().includes(query)
    const matchesRegion = selectedRegion === 'All' || country.region === selectedRegion
    const matchesIncome = selectedIncome === 'All' || country.incomeLevel === selectedIncome
    return matchesSearch && matchesRegion && matchesIncome
  })

  // Chart data: countries per region
  const regionCounts = {}
  countries.forEach((c) => {
    regionCounts[c.region] = (regionCounts[c.region] || 0) + 1
  })
  const regionChartData = Object.entries(regionCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)

  // Chart data: countries per income level
  const incomeCounts = {}
  countries.forEach((c) => {
    incomeCounts[c.incomeLevel] = (incomeCounts[c.incomeLevel] || 0) + 1
  })
  const incomeChartData = Object.entries(incomeCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  const featuredCountry =
    [...countries].sort((a, b) => a.name.localeCompare(b.name))[0] ?? null

  return (
    <>
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Week 6 · Project 6</p>
          <h1>WorldScope</h1>
          <p className="hero-text">
            A World Bank country dashboard with live search, layered filters, and
            global summary statistics powered by public API data.
          </p>
        </div>
        <div className="spotlight-card">
          <p className="spotlight-label">Featured Country</p>
          <h2>{featuredCountry?.name ?? 'Loading selection'}</h2>
          <p>{featuredCountry?.capital ?? 'Loading'} · {featuredCountry?.region ?? 'Global'}</p>
          <span>{featuredCountry?.incomeLevel ?? 'Awaiting data'}</span>
        </div>
      </section>

      <section className="stats-grid" aria-label="Summary statistics">
        <article className="stat-card">
          <span>Total Countries</span>
          <strong>{countries.length}</strong>
          <p>Country profiles currently loaded into the dashboard.</p>
        </article>
        <article className="stat-card">
          <span>Regions</span>
          <strong>{new Set(countries.map((c) => c.region)).size}</strong>
          <p>World Bank regions represented in the dataset.</p>
        </article>
        <article className="stat-card">
          <span>Income Groups</span>
          <strong>{new Set(countries.map((c) => c.incomeLevel)).size}</strong>
          <p>Distinct income classifications across all countries.</p>
        </article>
      </section>

      {/* Insights */}
      <section className="insights-card">
        <h3>Data Insights</h3>
        <p>
          Sub-Saharan Africa dominates in country count while high-income nations cluster in
          Europe &amp; Central Asia. Try filtering by <strong>Region</strong> to compare lending
          types within a geographic area, or select an <strong>Income Level</strong> to see how
          countries at similar economic stages are distributed globally.
        </p>
      </section>

      {/* Chart toggles */}
      <div className="chart-toggles">
        <button
          className={`toggle-btn ${showRegionChart ? 'active' : ''}`}
          onClick={() => setShowRegionChart((v) => !v)}
        >
          {showRegionChart ? 'Hide' : 'Show'} Region Chart
        </button>
        <button
          className={`toggle-btn ${showIncomeChart ? 'active' : ''}`}
          onClick={() => setShowIncomeChart((v) => !v)}
        >
          {showIncomeChart ? 'Hide' : 'Show'} Income Chart
        </button>
      </div>

      {/* Charts Section */}
      {(showRegionChart || showIncomeChart) && (
        <section className="charts-grid">
          {showRegionChart && (
            <div className="chart-card">
              <h3>Countries by Region</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={regionChartData} margin={{ top: 10, right: 20, bottom: 60, left: 0 }}>
                  <XAxis dataKey="name" angle={-35} textAnchor="end" tick={{ fill: '#9bbce6', fontSize: 11 }} interval={0} />
                  <YAxis tick={{ fill: '#9bbce6' }} />
                  <Tooltip contentStyle={{ background: '#0a1d37', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, color: '#eef4ff' }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {regionChartData.map((_, i) => (
                      <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {showIncomeChart && (
            <div className="chart-card">
              <h3>Income Level Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={incomeChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                  >
                    {incomeChartData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0a1d37', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, color: '#eef4ff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      )}

      <section className="controls-panel" aria-label="Search and filter controls">
        <label className="control-field">
          <span>Search</span>
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by country, capital, or ISO code" />
        </label>
        <label className="control-field">
          <span>Region</span>
          <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
            {regionOptions.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>
        <label className="control-field">
          <span>Income Level</span>
          <select value={selectedIncome} onChange={(e) => setSelectedIncome(e.target.value)}>
            {incomeOptions.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </label>
      </section>

      {errorMessage ? <p className="notice">{errorMessage}</p> : null}

      <section className="table-panel" aria-label="Country dashboard list">
        <div className="table-header">
          <div>
            <h2>Country Profiles</h2>
            <p>{loading ? 'Loading countries...' : `${filteredCountries.length} results shown`}</p>
          </div>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Country</th>
                <th>Code</th>
                <th>Capital</th>
                <th>Region</th>
                <th>Income Level</th>
                <th>Lending Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredCountries.map((country) => (
                <tr key={country.id}>
                  <td>
                    <Link to={`/country/${country.id}`} className="country-cell-link">
                      <div className="country-cell">
                        <div className="country-badge">{country.iso2Code}</div>
                        <div>
                          <strong>{country.name}</strong>
                          <span>{country.capital}</span>
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td>{country.iso2Code}</td>
                  <td>{country.capital}</td>
                  <td>{country.region}</td>
                  <td><span className="info-pill">{country.incomeLevel}</span></td>
                  <td>{country.lendingType}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && filteredCountries.length === 0 ? (
            <div className="empty-results">No countries match the current search and filter settings.</div>
          ) : null}
        </div>
      </section>
    </>
  )
}

function App() {
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    const fetchCountries = async () => {
      setLoading(true)
      setErrorMessage('')

      try {
        const pages = [1, 2, 3]
        const results = await Promise.all(
          pages.map(async (page) => {
            const response = await fetch(
              `https://api.worldbank.org/v2/country?format=json&per_page=100&page=${page}`,
            )
            if (!response.ok) throw new Error(`Request failed on page ${page}`)
            const data = await response.json()
            return Array.isArray(data?.[1]) ? data[1] : []
          }),
        )

        const normalizedCountries = results
          .flat()
          .filter((c) => c.region?.value && c.region.value !== 'Aggregates')
          .map(normalizeCountry)

        if (!normalizedCountries.length) throw new Error('No country data available')
        if (isMounted) setCountries(normalizedCountries)
      } catch {
        if (isMounted) {
          setCountries(fallbackCountries)
          setErrorMessage('Live World Bank data is unavailable, so the dashboard is showing a local backup dataset.')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchCountries()
    return () => { isMounted = false }
  }, [])

  const totalCountries = countries.length
  const totalRegions = new Set(countries.map((c) => c.region)).size
  const totalIncomeGroups = new Set(countries.map((c) => c.incomeLevel)).size

  return (
    <div className="app-layout">
      <div className="dashboard-backdrop" />
      <Sidebar
        totalCountries={totalCountries}
        totalRegions={totalRegions}
        totalIncomeGroups={totalIncomeGroups}
      />
      <main className="dashboard">
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                countries={countries}
                loading={loading}
                errorMessage={errorMessage}
              />
            }
          />
          <Route
            path="/country/:id"
            element={<DetailView countries={countries} />}
          />
        </Routes>
      </main>
    </div>
  )
}

export default App
