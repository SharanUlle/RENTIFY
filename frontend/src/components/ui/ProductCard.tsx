import { Link } from 'react-router-dom'
import { MapPin, Star } from 'lucide-react'
import styles from './ProductCard.module.css'

const FALLBACK = 'https://placehold.co/400x260/ede9ff/6c47ff?text=Rentify'

interface Props {
  product: any
}

export default function ProductCard({ product }: Props) {
  const image = product.images?.[0] || FALLBACK

  return (
    <Link to={`/products/${product.id}`} className={`card ${styles.card}`}>
      <div className={styles.imageWrap}>
        <img
          src={image}
          alt={product.title}
          className={styles.image}
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK }}
        />
        <span className={styles.category}>{product.category}</span>
      </div>
      <div className={styles.body}>
        <div className={styles.brand}>{product.brand} · {product.model_name}</div>
        <h3 className={styles.title}>{product.title}</h3>
        <div className={styles.meta}>
          <span className={styles.location}><MapPin size={13} />{product.city}</span>
          {product.average_rating > 0 && (
            <span className={styles.rating}><Star size={13} fill="#f59e0b" color="#f59e0b" />{product.average_rating.toFixed(1)}</span>
          )}
        </div>
        <div className={styles.footer}>
          <div className={styles.price}>
            <span className={styles.amount}>₹{Number(product.daily_rate).toLocaleString('en-IN')}</span>
            <span className={styles.per}>/day</span>
          </div>
          <span className={`badge ${product.condition === 'new' ? 'badge-approved' : 'badge-active'}`}>
            {product.condition?.replace('_', ' ')}
          </span>
        </div>
      </div>
    </Link>
  )
}
