import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, SlidersHorizontal, Zap } from 'lucide-react'
import { productService } from '../services'
import ProductCard from '../components/ui/ProductCard'
import styles from './HomePage.module.css'

const CATEGORIES = ['All', 'Cameras', 'Laptops', 'Drones', 'Gaming', 'Audio', 'Phones', 'Tablets', 'Other']

export default function HomePage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({ min_price: '', max_price: '', condition: '', city: '' })
  const [page, setPage] = useState(1)
  const LIMIT = 12

  const { data, isLoading } = useQuery({
    queryKey: ['products', search, category, filters, page],
    queryFn: () => productService.getProducts({
      search: search || undefined,
      category: category || undefined,
      min_price: filters.min_price || undefined,
      max_price: filters.max_price || undefined,
      condition: filters.condition || undefined,
      city: filters.city || undefined,
      limit: LIMIT,
      page,
    }),
    staleTime: 30000,
  })

  const products = data?.products || []
  const totalPages = data?.pages || 1

  return (
    <div>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}><Zap size={14} /> Electronics Rental Platform</div>
          <h1 className={styles.heroTitle}>Rent Premium Electronics<br /><span>Without Buying</span></h1>
          <p className={styles.heroSub}>Cameras, drones, laptops, gaming gear and more — rent from people near you.</p>
          <div className={styles.searchBar}>
            <Search size={18} className={styles.searchIcon} />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search cameras, drones, laptops..."
              className={styles.searchInput}
            />
          </div>
        </div>
      </div>

      <div className="container section">
        {/* Category pills */}
        <div className={styles.categories}>
          {CATEGORIES.map(c => (
            <button
              key={c}
              className={`${styles.catPill} ${category === (c === 'All' ? '' : c) ? styles.catActive : ''}`}
              onClick={() => { setCategory(c === 'All' ? '' : c); setPage(1) }}
            >{c}</button>
          ))}
          <button
            className={`${styles.filterBtn} ${showFilters ? styles.filterActive : ''}`}
            onClick={() => setShowFilters(v => !v)}
          ><SlidersHorizontal size={15} /> Filters</button>
        </div>

        {/* Expandable filters */}
        {showFilters && (
          <div className={styles.filterPanel}>
            <div className={styles.filterRow}>
              <div>
                <label>Min Price/day (₹)</label>
                <input type="number" value={filters.min_price}
                  onChange={e => setFilters(f => ({ ...f, min_price: e.target.value }))} placeholder="0" />
              </div>
              <div>
                <label>Max Price/day (₹)</label>
                <input type="number" value={filters.max_price}
                  onChange={e => setFilters(f => ({ ...f, max_price: e.target.value }))} placeholder="500" />
              </div>
              <div>
                <label>Condition</label>
                <select value={filters.condition} onChange={e => setFilters(f => ({ ...f, condition: e.target.value }))}>
                  <option value="">Any</option>
                  <option value="new">New</option>
                  <option value="like_new">Like New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                </select>
              </div>
              <div>
                <label>City</label>
                <input value={filters.city}
                  onChange={e => setFilters(f => ({ ...f, city: e.target.value }))} placeholder="New York" />
              </div>
            </div>
              <button className="btn btn-ghost btn-sm" onClick={() => { setFilters({ min_price: '', max_price: '', condition: '', city: '' }); setPage(1) }}>
              Clear Filters
            </button>
          </div>
        )}

        {/* Results */}
        <div className={styles.resultsHeader}>
          <h2>{isLoading ? 'Loading...' : `${data?.total ?? 0} items available`}</h2>
        </div>

        {isLoading ? (
          <div className="page-loader"><div className="spinner spinner-dark" style={{ width: 36, height: 36 }} /></div>
        ) : products.length === 0 ? (
          <div className={styles.empty}>
            <p>No products found. Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid-4">
            {products.map((p: any) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>
              ← Prev
            </button>
            <span className={styles.pageInfo}>Page {page} of {totalPages}</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
