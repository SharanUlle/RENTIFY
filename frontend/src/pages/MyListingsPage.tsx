import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { productService, rentalService } from '../services'
import { Link } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import toast from 'react-hot-toast'
import { PlusCircle, Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react'
import styles from './Dashboard.module.css'

const FALLBACK = 'https://placehold.co/300x180/ede9ff/6c47ff?text=📷'
const imgErr = (e: React.SyntheticEvent<HTMLImageElement>) => { (e.target as HTMLImageElement).src = FALLBACK }

export default function MyListingsPage() {
  const qc = useQueryClient()

  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ['my-listings'],
    queryFn: productService.getMyListings,
  })
  const { data: rentals = [], isLoading: loadingRentals } = useQuery({
    queryKey: ['listing-rentals'],
    queryFn: rentalService.getMyListingRentals,
  })

  const deleteMut = useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: () => { toast.success('Listing deleted'); qc.invalidateQueries({ queryKey: ['my-listings'] }) },
  })
  const approveMut = useMutation({
    mutationFn: rentalService.approveRental,
    onSuccess: () => { toast.success('Booking approved'); qc.invalidateQueries({ queryKey: ['listing-rentals'] }) },
  })
  const completeMut = useMutation({
    mutationFn: rentalService.completeRental,
    onSuccess: () => { toast.success('Marked as completed'); qc.invalidateQueries({ queryKey: ['listing-rentals'] }) },
  })
  const rejectMut = useMutation({
    mutationFn: (id: string) => rentalService.cancelRental(id, 'Rejected by owner'),
    onSuccess: () => { toast.success('Booking rejected'); qc.invalidateQueries({ queryKey: ['listing-rentals'] }) },
  })

  return (
    <div className="container section">
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>My Listings</h1>
        <Link to="/list-product" className="btn btn-primary"><PlusCircle size={16} /> New Listing</Link>
      </div>

      {/* Products */}
      {loadingProducts ? <div className="page-loader"><div className="spinner spinner-dark" /></div> : (
        products.length === 0
          ? <div className={styles.empty}><p>No listings yet. <Link to="/list-product">Create one →</Link></p></div>
          : (
            <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
              {products.map((p: any) => (
                <div key={p.id} className={`card ${styles.productCard}`}>
                  <img src={p.images?.[0] || FALLBACK} className={styles.productImg} alt={p.title} onError={imgErr} />
                  <div className={styles.productBody}>
                    <h3>{p.title}</h3>
                    <p className={styles.rentalMeta}>₹{Number(p.daily_rate).toLocaleString('en-IN')}/day · {p.rental_count} rentals</p>
                    <div className={styles.rentalFooter}>
                      <span className={`badge ${p.is_available ? 'badge-approved' : 'badge-cancelled'}`}>
                        {p.is_available ? 'Available' : 'Unavailable'}
                      </span>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link to={`/edit-product/${p.id}`} className="btn btn-ghost btn-sm"><Pencil size={14} /> Edit</Link>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteMut.mutate(p.id)}><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
      )}

      {/* Incoming bookings */}
      <h2 className={styles.sectionTitle}>Incoming Bookings</h2>
      {loadingRentals ? <div className="page-loader"><div className="spinner spinner-dark" /></div> : (
        rentals.length === 0
          ? <p className={styles.empty}>No bookings yet.</p>
          : (
            <div className={styles.list}>
              {rentals.map((r: any) => (
                <div key={r.id} className={`card ${styles.rentalCard}`}>
                  <div className={styles.rentalImg}>
                    <img src={r.product?.images?.[0] || FALLBACK} alt={r.product?.title} onError={imgErr} />
                  </div>
                  <div className={styles.rentalInfo}>
                    <div className={styles.rentalTop}>
                      <h3>{r.product?.title}</h3>
                      <span className={`badge badge-${r.status}`}>{r.status}</span>
                    </div>
                    <p className={styles.rentalMeta}>
                      Renter: <strong>{r.renter?.name}</strong> · {r.renter?.phone}
                    </p>
                    <p className={styles.rentalMeta}>
                      {format(parseISO(r.start_date), 'MMM d')} – {format(parseISO(r.end_date), 'MMM d, yyyy')}
                    </p>
                    <div className={styles.rentalFooter}>
                      <span className={styles.rentalPrice}>₹{Number(r.total_amount).toLocaleString('en-IN')}</span>
                      {r.status === 'pending' && (
                        <>
                          <button className="btn btn-primary btn-sm" onClick={() => approveMut.mutate(r.id)}>
                            <CheckCircle size={14} /> Approve
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => rejectMut.mutate(r.id)}>
                            <XCircle size={14} /> Reject
                          </button>
                        </>
                      )}
                      {r.status === 'active' && (
                        <button className="btn btn-outline btn-sm" onClick={() => completeMut.mutate(r.id)}>
                          Mark Completed
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
      )}
    </div>
  )
}
