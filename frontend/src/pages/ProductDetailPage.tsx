import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { MapPin, Star, Calendar, Shield, ChevronLeft, User, Clock, CreditCard } from 'lucide-react'
import { productService, rentalService, reviewService } from '../services'
import { useAuthStore } from '../store/authStore'
import { useRazorpay } from '../hooks/useRazorpay'
import toast from 'react-hot-toast'
import { format, addHours, addWeeks, addMonths } from 'date-fns'
import styles from './ProductDetailPage.module.css'

const FALLBACK = 'https://placehold.co/800x500/ede9ff/6c47ff?text=Rentify'
const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  (e.target as HTMLImageElement).src = FALLBACK
}

type RentalType = 'hourly' | 'daily' | 'weekly' | 'monthly'

const RENTAL_TYPES: { value: RentalType; label: string; icon: React.ReactNode }[] = [
  { value: 'hourly', label: 'Hourly', icon: <Clock size={14} /> },
  { value: 'daily', label: 'Daily', icon: <Calendar size={14} /> },
  { value: 'weekly', label: 'Weekly', icon: <Calendar size={14} /> },
  { value: 'monthly', label: 'Monthly', icon: <Calendar size={14} /> },
]

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const { pay } = useRazorpay()
  const [imgIdx, setImgIdx] = useState(0)
  const [rentalType, setRentalType] = useState<RentalType>('daily')
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('10:00')
  const [endDate, setEndDate] = useState('')
  const [hourlyCount, setHourlyCount] = useState(1)
  const [weeklyCount, setWeeklyCount] = useState(1)
  const [monthlyCount, setMonthlyCount] = useState(1)
  const [notes, setNotes] = useState('')
  const [paying, setPaying] = useState(false)

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProduct(id!),
  })

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => reviewService.getProductReviews(id!),
    enabled: !!id,
  })

  const bookMutation = useMutation({
    mutationFn: (payload: Parameters<typeof rentalService.createRental>[0]) =>
      rentalService.createRental(payload),
    onError: (err: any) => toast.error(err.response?.data?.message || 'Booking failed'),
  })

  if (isLoading) return <div className="page-loader"><div className="spinner spinner-dark" style={{ width: 40, height: 40 }} /></div>
  if (!product) return <div className="container section"><p>Product not found.</p></div>

  const images = product.images?.length ? product.images : [FALLBACK]
  const isOwner = user?.id === product.owner_id

  // Derived rate & unit label based on selected type
  const getRate = (): number => {
    switch (rentalType) {
      case 'hourly': return product.hourly_rate ? Number(product.hourly_rate) : Math.round(Number(product.daily_rate) / 8)
      case 'weekly': return product.weekly_rate ? Number(product.weekly_rate) : Math.round(Number(product.daily_rate) * 7 * 0.85)
      case 'monthly': return product.monthly_rate ? Number(product.monthly_rate) : Math.round(Number(product.daily_rate) * 30 * 0.7)
      default: return Number(product.daily_rate)
    }
  }

  const getUnits = (): number => {
    if (rentalType === 'hourly') return hourlyCount
    if (rentalType === 'weekly') return weeklyCount
    if (rentalType === 'monthly') return monthlyCount
    // daily: diff between dates
    if (startDate && endDate) {
      const diff = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000)
      return diff > 0 ? diff : 0
    }
    return 0
  }

  const rate = getRate()
  const units = getUnits()
  const rentalPrice = units > 0 ? rate * units : 0
  const deposit = Number(product.deposit)
  const totalPrice = rentalPrice + deposit

  const unitLabel: Record<RentalType, string> = { hourly: 'hr', daily: 'day', weekly: 'wk', monthly: 'mo' }

  const getEndPreview = (): string => {
    if (!startDate) return ''
    const base = rentalType === 'hourly' ? new Date(`${startDate}T${startTime}`) : new Date(startDate)
    if (rentalType === 'hourly') return format(addHours(base, hourlyCount), 'dd MMM yyyy, h:mm a')
    if (rentalType === 'weekly') return format(addWeeks(base, weeklyCount), 'dd MMM yyyy')
    if (rentalType === 'monthly') return format(addMonths(base, monthlyCount), 'dd MMM yyyy')
    return ''
  }

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) { navigate('/login'); return }
    if (units < 1) { toast.error('Please select a valid duration'); return }

    setPaying(true)
    try {
      // Build payload
      const startISO = rentalType === 'hourly'
        ? new Date(`${startDate}T${startTime}`).toISOString()
        : startDate

      const endISO = rentalType === 'daily' ? endDate : undefined
      const total_units = rentalType !== 'daily' ? units : undefined

      const result = await bookMutation.mutateAsync({
        product_id: id!,
        start_date: startISO,
        end_date: endISO,
        rental_type: rentalType,
        total_units,
        notes,
      })

      const rental = result.rental
      // Immediately open Razorpay
      await pay({
        rental_id: rental.id,
        amount: Number(rental.total_amount),
        userName: user?.name || '',
        userEmail: user?.email || '',
        onSuccess: () => {
          navigate('/my-rentals')
        },
        onFailure: () => {
          // Rental exists but payment failed — navigate to my-rentals so they can retry
          navigate('/my-rentals')
        },
      })
    } finally {
      setPaying(false)
    }
  }

  return (
    <div className="container section">
      <button onClick={() => navigate(-1)} className={`btn btn-ghost btn-sm ${styles.back}`}>
        <ChevronLeft size={18} /> Back
      </button>

      <div className={styles.grid}>
        {/* Left: Images + Info */}
        <div>
          {/* Image gallery */}
          <div className={styles.gallery}>
            <img src={images[imgIdx]} alt={product.title} className={styles.mainImage} onError={handleImgError} />
            {images.length > 1 && (
              <div className={styles.thumbs}>
                {images.map((img: string, i: number) => (
                  <img key={i} src={img} alt="" className={`${styles.thumb} ${i === imgIdx ? styles.thumbActive : ''}`}
                    onClick={() => setImgIdx(i)} onError={handleImgError} />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className={`card ${styles.infoCard}`}>
            <div className={styles.topMeta}>
              <span className="badge badge-active">{product.category}</span>
              <span className={`badge ${product.condition === 'new' ? 'badge-approved' : 'badge-active'}`}>
                {product.condition?.replace('_', ' ')}
              </span>
            </div>
            <h1 className={styles.title}>{product.title}</h1>
            <div className={styles.meta}>
              <span><MapPin size={14} /> {product.city}, {product.state}</span>
              {product.average_rating > 0 && (
                <span><Star size={14} fill="#f59e0b" color="#f59e0b" /> {product.average_rating.toFixed(1)} ({product.rental_count} rentals)</span>
              )}
            </div>
            <p className={styles.description}>{product.description}</p>

            {/* Pricing grid */}
            <div className={styles.ratesGrid}>
              {product.hourly_rate && (
                <div className={styles.rateCard}>
                  <Clock size={14} />
                  <span className={styles.rateAmt}>₹{Number(product.hourly_rate).toLocaleString('en-IN')}</span>
                  <span className={styles.rateLabel}>/hour</span>
                </div>
              )}
              <div className={styles.rateCard}>
                <Calendar size={14} />
                <span className={styles.rateAmt}>₹{Number(product.daily_rate).toLocaleString('en-IN')}</span>
                <span className={styles.rateLabel}>/day</span>
              </div>
              {product.weekly_rate && (
                <div className={styles.rateCard}>
                  <Calendar size={14} />
                  <span className={styles.rateAmt}>₹{Number(product.weekly_rate).toLocaleString('en-IN')}</span>
                  <span className={styles.rateLabel}>/week</span>
                </div>
              )}
              {product.monthly_rate && (
                <div className={styles.rateCard}>
                  <Calendar size={14} />
                  <span className={styles.rateAmt}>₹{Number(product.monthly_rate).toLocaleString('en-IN')}</span>
                  <span className={styles.rateLabel}>/month</span>
                </div>
              )}
              <div className={styles.rateCard} style={{ background: '#fff7ed' }}>
                <span className={styles.rateLabel}>Deposit</span>
                <span className={styles.rateAmt}>₹{Number(product.deposit).toLocaleString('en-IN')}</span>
                <span className={styles.rateLabel}>(refundable)</span>
              </div>
            </div>

            <div className={styles.specs}>
              <div className={styles.spec}><span>Brand</span><strong>{product.brand}</strong></div>
              <div className={styles.spec}><span>Model</span><strong>{product.model_name}</strong></div>
            </div>

            {/* Owner */}
            <div className={styles.ownerCard}>
              <div className={styles.ownerAvatar}>
                {product.owner?.avatar_url
                  ? <img src={product.owner.avatar_url} alt={product.owner.name} />
                  : <div className={styles.ownerInitial}>{product.owner?.name?.[0]?.toUpperCase()}</div>}
              </div>
              <div>
                <div className={styles.ownerName}>{product.owner?.name}</div>
                <div className={styles.ownerLabel}>Owner</div>
              </div>
            </div>
          </div>

          {/* Reviews */}
          {reviews.length > 0 && (
            <div className={`card ${styles.reviewsCard}`}>
              <h2 className={styles.sectionTitle}>Reviews</h2>
              {reviews.map((r: any) => (
                <div key={r.id} className={styles.review}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewerName}>{r.reviewer?.name}</div>
                    <div className={styles.stars}>
                      {[1,2,3,4,5].map(s => <Star key={s} size={13} fill={s <= r.rating ? '#f59e0b' : 'none'} color={s <= r.rating ? '#f59e0b' : '#d1d5db'} />)}
                    </div>
                  </div>
                  <p className={styles.reviewComment}>{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Booking */}
        <div>
          <div className={`card ${styles.bookingCard}`}>
            <div className={styles.priceHeader}>
              <span className={styles.price}>₹{rate.toLocaleString('en-IN')}</span>
              <span className={styles.priceUnit}>/{unitLabel[rentalType]}</span>
            </div>

            {isOwner ? (
              <div className={styles.ownerNote}>
                <Shield size={16} /> This is your listing
              </div>
            ) : !product.is_available ? (
              <div className={styles.unavailable}>Currently unavailable</div>
            ) : (
              <form onSubmit={handleBook} className={styles.bookForm}>

                {/* Rental type tabs */}
                <div className={styles.rentalTypeTabs}>
                  {RENTAL_TYPES.map(rt => (
                    <button key={rt.value} type="button"
                      className={`${styles.typeTab} ${rentalType === rt.value ? styles.typeTabActive : ''}`}
                      onClick={() => setRentalType(rt.value)}>
                      {rt.icon} {rt.label}
                    </button>
                  ))}
                </div>

                {/* Hourly inputs */}
                {rentalType === 'hourly' && (
                  <div className={styles.durationBlock}>
                    <div className={styles.field}>
                      <label><Calendar size={13} /> Date</label>
                      <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                        min={format(new Date(), 'yyyy-MM-dd')} required />
                    </div>
                    <div className={styles.field}>
                      <label><Clock size={13} /> Start Time</label>
                      <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required />
                    </div>
                    <div className={styles.field}>
                      <label><Clock size={13} /> Duration (hours)</label>
                      <div className={styles.stepper}>
                        <button type="button" onClick={() => setHourlyCount(h => Math.max(1, h - 1))}>−</button>
                        <span>{hourlyCount}h</span>
                        <button type="button" onClick={() => setHourlyCount(h => h + 1)}>+</button>
                      </div>
                    </div>
                    {startDate && <div className={styles.endPreview}>Ends: {getEndPreview()}</div>}
                  </div>
                )}

                {/* Daily inputs */}
                {rentalType === 'daily' && (
                  <div className={styles.dateRow}>
                    <div>
                      <label><Calendar size={14} /> Start Date</label>
                      <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                        min={format(new Date(), 'yyyy-MM-dd')} required />
                    </div>
                    <div>
                      <label><Calendar size={14} /> End Date</label>
                      <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                        min={startDate || format(new Date(), 'yyyy-MM-dd')} required />
                    </div>
                  </div>
                )}

                {/* Weekly inputs */}
                {rentalType === 'weekly' && (
                  <div className={styles.durationBlock}>
                    <div className={styles.field}>
                      <label><Calendar size={13} /> Start Date</label>
                      <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                        min={format(new Date(), 'yyyy-MM-dd')} required />
                    </div>
                    <div className={styles.field}>
                      <label>Number of Weeks</label>
                      <div className={styles.stepper}>
                        <button type="button" onClick={() => setWeeklyCount(w => Math.max(1, w - 1))}>−</button>
                        <span>{weeklyCount} {weeklyCount === 1 ? 'week' : 'weeks'}</span>
                        <button type="button" onClick={() => setWeeklyCount(w => w + 1)}>+</button>
                      </div>
                    </div>
                    {startDate && <div className={styles.endPreview}>Ends: {getEndPreview()}</div>}
                  </div>
                )}

                {/* Monthly inputs */}
                {rentalType === 'monthly' && (
                  <div className={styles.durationBlock}>
                    <div className={styles.field}>
                      <label><Calendar size={13} /> Start Date</label>
                      <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                        min={format(new Date(), 'yyyy-MM-dd')} required />
                    </div>
                    <div className={styles.field}>
                      <label>Number of Months</label>
                      <div className={styles.stepper}>
                        <button type="button" onClick={() => setMonthlyCount(m => Math.max(1, m - 1))}>−</button>
                        <span>{monthlyCount} {monthlyCount === 1 ? 'month' : 'months'}</span>
                        <button type="button" onClick={() => setMonthlyCount(m => m + 1)}>+</button>
                      </div>
                    </div>
                    {startDate && <div className={styles.endPreview}>Ends: {getEndPreview()}</div>}
                  </div>
                )}

                <textarea value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="Any notes for the owner? (optional)" rows={2} />

                {units > 0 && (
                  <div className={styles.priceSummary}>
                    <div className={styles.priceRow}>
                      <span>₹{rate.toLocaleString('en-IN')} × {units} {unitLabel[rentalType]}{units > 1 ? 's' : ''}</span>
                      <span>₹{rentalPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div className={styles.priceRow}>
                      <span>Deposit (refundable)</span>
                      <span>₹{deposit.toLocaleString('en-IN')}</span>
                    </div>
                    <div className={`${styles.priceRow} ${styles.priceTotal}`}>
                      <span>Total</span>
                      <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                )}

                {isAuthenticated ? (
                  <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}
                    disabled={paying || bookMutation.isPending || units < 1}>
                    {paying || bookMutation.isPending
                      ? <><span className="spinner" /> Processing...</>
                      : <><CreditCard size={17} /> Book & Pay ₹{totalPrice > 0 ? totalPrice.toLocaleString('en-IN') : ''}</>
                    }
                  </button>
                ) : (
                  <Link to="/login" className="btn btn-primary btn-lg" style={{ display:'flex', justifyContent:'center' }}>
                    <User size={16} /> Login to Book
                  </Link>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
