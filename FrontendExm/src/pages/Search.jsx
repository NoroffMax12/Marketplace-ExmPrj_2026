/* Product search page.
- Search by name, category or brand using POST /search. */

import {useState} from 'react'
import {useToast} from '../context/ToastContext'
import {searchProducts} from '../api/search.api'


const SEARCH_TYPES = ['Name', 'Category', 'Brand']

// Search component manages the search interface, by storing the user's input in query and the filter categoty.
export default function Search() {
  const {addToast} = useToast()
  const [query, setQuery] = useState('')
  const [type, setType] = useState('Name')
  const [results, setResults] = useState([])
  const [count, setCount] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)


  const handleSearch = async () => { //NTS: handleSearch function initiates the search process -> uses !query.trim() to stop execution if nd prevents useless API calls
    if (!query.trim()) return
    setLoading(true)
    try {
      const key = type.toLowerCase()
      const body = { [key]: query.trim() }
      const res = await searchProducts(body)
      const data = res.data?.data
      setResults(data?.products || [])


      // Use count from backend response
      setCount(data?.count ?? data?.products?.length ?? 0)
      setSearched(true)
    } catch {addToast('Search failed', 'error') }
    finally {setLoading(false)}
  }

  // handleKeyDown function listens for keyboard events (e.key === 'Enter') on the input field and if true handleSearch() function.
  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSearch() }


  return (
    <div className="space-y-4">
      {/* Search controls */}
      <div className="bg-card rounded-xl shadow-card p-5">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Search term</label>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter search term..."
              className="input"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Search by</label>
            <div className="flex gap-4 py-2">
              {SEARCH_TYPES.map(t => (
                <label key={t} className="flex items-center gap-1.5 text-sm cursor-pointer select-none">
                  <input
                    type="radio"
                    name="searchType"
                    value={t}
                    checked={type === t}
                    onChange={() => setType(t)}
                    className="accent-primary"
                  />
                  {t}
                </label>
              ))}
            </div>
          </div>
          <button onClick={handleSearch} disabled={loading} className="btn-primary disabled:opacity-50">
            {loading ? 'Searching...' : '🔍 Search'}
          </button>
        </div>
      </div>


      {/* Results table */}
      {searched && (
        <div className="bg-card rounded-xl shadow-card overflow-hidden">
          <div className="bg-sidebar text-white px-5 py-3.5 text-sm font-medium">
            {count} result{count !== 1 ? 's' : ''} found
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-surface border-b border-border">
                  {['Id','Name','Description','Qty','Price','Brand','Category','isDeleted','Date Added'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.length === 0 ? (
                  <tr><td colSpan={9} className="px-5 py-10 text-center text-muted">No products match your search</td></tr>
                ) : results.map((p, i) => (
                  <tr key={p.id} className={`border-t border-border hover:bg-surface/60 transition-colors ${i % 2 === 0 ? '' : 'bg-surface/40'}`}>
                    <td className="px-4 py-2.5 text-muted">{p.id}</td>
                    <td className="px-4 py-2.5 font-medium max-w-[140px] truncate">{p.name}</td>
                    <td className="px-4 py-2.5 max-w-[200px] truncate text-muted">{p.description}</td>
                    <td className="px-4 py-2.5">{p.quantity}</td>
                    <td className="px-4 py-2.5 font-medium">${p.unitprice}</td>
                    <td className="px-4 py-2.5">{p.brand}</td>
                    <td className="px-4 py-2.5">{p.category}</td>
                    <td className="px-4 py-2.5">
                      <span className={`text-xs font-medium ${p.isdeleted ? 'text-danger' : 'text-primary'}`}>
                        {p.isdeleted ? 'Yes' : 'No'}
                      </span>
                    </td>
                    {/* Backend returns date_added */}
                    <td className="px-4 py-2.5 text-muted whitespace-nowrap">
                      {p.date_added ? new Date(p.date_added).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
