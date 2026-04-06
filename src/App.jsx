import { useEffect, useState } from 'react'
import './App.css'

const fallbackCountries = [
  {
    id: 'usa',
    name: 'United States',
    capital: 'Washington, D.C.',
    region: 'North America',
    incomeLevel: 'High income',
    lendingType: 'Not classified',
    iso2Code: 'US',
  },
  {
    id: 'jpn',
    name: 'Japan',
    capital: 'Tokyo',
    region: 'East Asia & Pacific',
    incomeLevel: 'High income',
    lendingType: 'Not classified',
    iso2Code: 'JP',
  },
  {
    id: 'bra',
    name: 'Brazil',
    capital: 'Brasilia',
    region: 'Latin America & Caribbean',
    incomeLevel: 'Upper middle income',
    lendingType: 'IBRD',
    iso2Code: 'BR',
  },
  {
    id: 'ind',
    name: 'India',
    capital: 'New Delhi',
    region: 'South Asia',
    incomeLevel: 'Lower middle income',
    lendingType: 'IBRD',
    iso2Code: 'IN',
  },
  {
    id: 'ken',
    name: 'Kenya',
    capital: 'Nairobi',
    region: 'Sub-Saharan Africa',
    incomeLevel: 'Lower middle income',
    lendingType: 'Blend',
    iso2Code: 'KE',
  },
  {
    id: 'deu',
    name: 'Germany',
    capital: 'Berlin',
    region: 'Europe & Central Asia',
    incomeLevel: 'High income',
    lendingType: 'Not classified',
    iso2Code: 'DE',
  },
  {
    id: 'aus',
    name: 'Australia',
    capital: 'Canberra',
    region: 'East Asia & Pacific',
    incomeLevel: 'High income',
    lendingType: 'Not classified',
    iso2Code: 'AU',
  },
  {
    id: 'nga',
    name: 'Nigeria',
    capital: 'Abuja',
    region: 'Sub-Saharan Africa',
    incomeLevel: 'Lower middle income',
    lendingType: 'Blend',
    iso2Code: 'NG',
  },
  {
    id: 'mex',
    name: 'Mexico',
    capital: 'Mexico City',
    region: 'Latin America & Caribbean',
    incomeLevel: 'Upper middle income',
    lendingType: 'IBRD',
    iso2Code: 'MX',
  },
  {
    id: 'fra',
    name: 'France',
    capital: 'Paris',
    region: 'Europe & Central Asia',
    incomeLevel: 'High income',
    lendingType: 'Not classified',
    iso2Code: 'FR',
  },
  {
    id: 'zaf',
    name: 'South Africa',
    capital: 'Pretoria',
    region: 'Sub-Saharan Africa',
    incomeLevel: 'Upper middle income',
    lendingType: 'IBRD',
    iso2Code: 'ZA',
  },
  {
    id: 'idn',
    name: 'Indonesia',
    capital: 'Jakarta',
    region: 'East Asia & Pacific',
    incomeLevel: 'Upper middle income',
    lendingType: 'IBRD',
    iso2Code: 'ID',
  },
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

function App() {
  const [countries, setCountries] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('All')
  const [selectedIncome, setSelectedIncome] = useState('All')
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

            if (!response.ok) {
              throw new Error(`Request failed on page ${page}`)
            }

            const data = await response.json()
            return Array.isArray(data?.[1]) ? data[1] : []
          }),
        )

        const normalizedCountries = results
          .flat()
          .filter((country) => country.region?.value && country.region.value !== 'Aggregates')
          .map(normalizeCountry)

        if (!normalizedCountries.length) {
          throw new Error('No country data available')
        }

        if (isMounted) {
          setCountries(normalizedCountries)
        }
      } catch {
        if (isMounted) {
          setCountries(fallbackCountries)
          setErrorMessage(
            'Live World Bank data is unavailable, so the dashboard is showing a local backup dataset.',
          )
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchCountries()

    return () => {
      isMounted = false
    }
  }, [])

  const regionOptions = ['All', ...new Set(countries.map((country) => country.region))]
  const incomeOptions = ['All', ...new Set(countries.map((country) => country.incomeLevel))]

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

  const totalCountries = countries.length
  const totalRegions = new Set(countries.map((country) => country.region)).size
  const totalIncomeGroups = new Set(countries.map((country) => country.incomeLevel)).size
  const featuredCountry =
    [...countries].sort((a, b) => a.name.localeCompare(b.name))[0] ?? null

  return (
    <div className="dashboard-shell">
      <div className="dashboard-backdrop" />

      <main className="dashboard">
        <section className="hero-panel">
          <div className="hero-copy">
            <p className="eyebrow">Week 6 · Project 5</p>
            <h1>WorldScope</h1>
            <p className="hero-text">
              A World Bank country dashboard with live search, layered filters, and
              global summary statistics powered by public API data.
            </p>
          </div>

          <div className="spotlight-card">
            <p className="spotlight-label">Featured Country</p>
            <h2>{featuredCountry?.name ?? 'Loading selection'}</h2>
            <p>
              {featuredCountry?.capital ?? 'Loading'} · {featuredCountry?.region ?? 'Global'}
            </p>
            <span>{featuredCountry?.incomeLevel ?? 'Awaiting data'}</span>
          </div>
        </section>

        <section className="stats-grid" aria-label="Summary statistics">
          <article className="stat-card">
            <span>Total Countries</span>
            <strong>{totalCountries}</strong>
            <p>Country profiles currently loaded into the dashboard.</p>
          </article>
          <article className="stat-card">
            <span>Regions</span>
            <strong>{totalRegions}</strong>
            <p>World Bank regions represented in the dataset.</p>
          </article>
          <article className="stat-card">
            <span>Income Groups</span>
            <strong>{totalIncomeGroups}</strong>
            <p>Distinct income classifications across all countries.</p>
          </article>
        </section>

        <section className="controls-panel" aria-label="Search and filter controls">
          <label className="control-field">
            <span>Search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by country, capital, or ISO code"
            />
          </label>

          <label className="control-field">
            <span>Region</span>
            <select
              value={selectedRegion}
              onChange={(event) => setSelectedRegion(event.target.value)}
            >
              {regionOptions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </label>

          <label className="control-field">
            <span>Income Level</span>
            <select
              value={selectedIncome}
              onChange={(event) => setSelectedIncome(event.target.value)}
            >
              {incomeOptions.map((incomeLevel) => (
                <option key={incomeLevel} value={incomeLevel}>
                  {incomeLevel}
                </option>
              ))}
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
                      <div className="country-cell">
                        <div className="country-badge">{country.iso2Code}</div>
                        <div>
                          <strong>{country.name}</strong>
                          <span>{country.capital}</span>
                        </div>
                      </div>
                    </td>
                    <td>{country.iso2Code}</td>
                    <td>{country.capital}</td>
                    <td>{country.region}</td>
                    <td>
                      <span className="info-pill">{country.incomeLevel}</span>
                    </td>
                    <td>{country.lendingType}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!loading && filteredCountries.length === 0 ? (
              <div className="empty-results">
                No countries match the current search and filter settings.
              </div>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
