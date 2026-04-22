import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { rentalService } from '../services'
import { format, parseISO } from 'date-fns'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { CreditCard } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useRazorpay } from '../hooks/useRazorpay'
import styles from './Dashboard.module.css'

const FALLBACK = 'https://placehold.co/90x80/ede9ff/6c47ff?text=📷'
const imgErr = (e: React.SyntheticEvent<HTMLImageElement>) => { (e.target as HTMLImageElement).src = FALLBACK }

export default function MyRentalsPage() {
  const qc = useQueryClient()
  const { user } = useAuthStore()
  const { pay } = useRazorpay()

  const { data: rentals = [], isLoading } = useQuery({
    queryKey: ['my-rentals'],
    queryFn: rentalService.getMyRentals,
  })

  const cancelMut = useMutation({
    mutationFn: (id: string) => rentalService.cancelRental(id, 'Cancelled by renter'),
    onSuccess: () => { toast.success('Rental cancelled'); qc.invalidateQueries({ queryKey: ['my-rentals'] }) },
    onError: () => toast.error('Failed to cancel'),
  })

  const handlePay = (r: any) => {
    pay({
      rental_id: r.id,
      amount: Number(r.total_amount),
      userName: user?.name || '',
      userEmail: user?.email || '',
      onSuccess: () => qc.invalidateQueries({ queryKey: ['my-rentals'] }),
    })
  }
  if (isLoading) return <div className="page-loader"><div className="spinner spinner-dark" style={{ width: 36, height: 36 }} /></div>

  return (
    <div className="container section">
      <h1 className={styles.pageTitle}>My Rentals</h1>
      {rentals.length === 0
        ? <div className={styles.empty}><p>No rentals yet. <Link to="/">Browse listings →</Link></p></div>
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
                    {format(parseISO(r.start_date), 'MMM d')} – {format(parseISO(r.end_date), 'MMM d, yyyy')}
                    &nbsp;·&nbsp;{r.total_days} {r.rental_type === 'hourly' ? 'hr' : r.rental_type === 'weekly' ? 'wk' : r.rental_type === 'monthly' ? 'mo' : 'day'}{r.total_days > 1 ? 's' : ''}
                    &nbsp;·&nbsp;<span className="badge badge-active" style={{ fontSize: '0.7rem' }}>{r.rental_type || 'daily'}</span>
                  </p>
                  <p className={styles.rentalMeta}>Owner: <strong>{r.owner?.name}</strong></p>
                  <div className={styles.rentalFooter}>
                    <div>
                      <span className={styles.rentalPrice}>₹{Number(r.total_amount).toLocaleString('en-IN')}</span>
                      {r.payment_status === 'paid'
                        ? <span className="badge badge-approved" style={{ marginLeft: '0.5rem' }}>Paid</span>
                        : <span className="badge badge-pending" style={{ marginLeft: '0.5rem' }}>Unpaid</span>
                      }
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {/* Retry payment — in case it failed mid-flow */}
                      {r.payment_status !== 'paid' && r.status !== 'cancelled' && r.status !== 'rejected' && (
                        <button className="btn btn-primary btn-sm" onClick={() => handlePay(r)}>
                          <CreditCard size={14} /> Pay Now
                        </button>
                      )}
                      {(r.status === 'pending' || r.status === 'approved') && (
                        <button className="btn btn-danger btn-sm" onClick={() => cancelMut.mutate(r.id)} disabled={cancelMut.isPending}>
                          Cancel
                        </button>
                      )}
                      <Link to={`/products/${r.product_id}`} className="btn btn-ghost btn-sm">View Item</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  )
}
