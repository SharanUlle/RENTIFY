import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { productService } from '../services'
import toast from 'react-hot-toast'
import { Upload, X, ChevronLeft } from 'lucide-react'
import styles from './CreateListingPage.module.css'

const CATEGORIES = ['Cameras', 'Laptops', 'Drones', 'Gaming', 'Audio', 'Phones', 'Tablets', 'Other']
const CONDITIONS = [
  { value: 'new', label: 'New' },
  { value: 'like_new', label: 'Like New' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
]

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProduct(id!),
  })

  const [form, setForm] = useState({
    title: '', description: '', category: '', brand: '', model_name: '',
    daily_rate: '', weekly_rate: '', monthly_rate: '', deposit: '',
    condition: 'good', city: '', state: '',
  })
  const [newImages, setNewImages] = useState<File[]>([])
  const [newPreviews, setNewPreviews] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])

  useEffect(() => {
    if (product) {
      setForm({
        title: product.title || '',
        description: product.description || '',
        category: product.category || '',
        brand: product.brand || '',
        model_name: product.model_name || '',
        daily_rate: String(product.daily_rate || ''),
        weekly_rate: String(product.weekly_rate || ''),
        monthly_rate: String(product.monthly_rate || ''),
        deposit: String(product.deposit || ''),
        condition: product.condition || 'good',
        city: product.city || '',
        state: product.state || '',
      })
      setExistingImages(product.images || [])
    }
  }, [product])

  const mutation = useMutation({
    mutationFn: (fd: FormData) => productService.updateProduct(id!, fd),
    onSuccess: () => {
      toast.success('Listing updated!')
      qc.invalidateQueries({ queryKey: ['product', id] })
      qc.invalidateQueries({ queryKey: ['my-listings'] })
      navigate('/my-listings')
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update listing'),
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleNewImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 5 - existingImages.length)
    setNewImages(files)
    setNewPreviews(files.map(f => URL.createObjectURL(f)))
  }

  const removeExisting = (i: number) => setExistingImages(imgs => imgs.filter((_, idx) => idx !== i))
  const removeNew = (i: number) => {
    setNewImages(imgs => imgs.filter((_, idx) => idx !== i))
    setNewPreviews(ps => ps.filter((_, idx) => idx !== i))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (existingImages.length === 0 && newImages.length === 0) {
      toast.error('At least one image is required')
      return
    }
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v) })
    existingImages.forEach(url => fd.append('existing_images', url))
    newImages.forEach(img => fd.append('images', img))
    mutation.mutate(fd)
  }

  if (isLoading) return <div className="page-loader"><div className="spinner spinner-dark" style={{ width: 36, height: 36 }} /></div>
  if (!product) return <div className="container section"><p>Product not found.</p></div>

  const totalImgs = existingImages.length + newPreviews.length

  return (
    <div className="container section">
      <button onClick={() => navigate(-1)} className={`btn btn-ghost btn-sm ${styles.back || ''}`} style={{ marginBottom: '1.25rem' }}>
        <ChevronLeft size={18} /> Back
      </button>
      <h1 className={styles.title}>Edit Listing</h1>
      <p className={styles.sub}>Update your electronics listing details</p>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Images */}
        <div className={styles.section}>
          <h2>Photos</h2>
          <div className={styles.imageGrid}>
            {/* Existing images */}
            {existingImages.map((src, i) => (
              <div key={`ex-${i}`} className={styles.previewWrap}>
                <img src={src} alt="" className={styles.preview} onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x80/ede9ff/6c47ff?text=📷' }} />
                <button type="button" className={styles.removeImg} onClick={() => removeExisting(i)}><X size={14} /></button>
              </div>
            ))}
            {/* New image previews */}
            {newPreviews.map((src, i) => (
              <div key={`new-${i}`} className={styles.previewWrap}>
                <img src={src} alt="" className={styles.preview} />
                <button type="button" className={styles.removeImg} onClick={() => removeNew(i)}><X size={14} /></button>
              </div>
            ))}
            {totalImgs < 5 && (
              <label className={styles.uploadArea}>
                <Upload size={24} />
                <span>Add Photos</span>
                <input type="file" accept="image/*" multiple onChange={handleNewImages} style={{ display: 'none' }} />
              </label>
            )}
          </div>
          <p className={styles.hint}>Up to 5 photos · JPG, PNG, WebP · Max 5MB each</p>
        </div>

        {/* Basic Info */}
        <div className={styles.section}>
          <h2>Basic Info</h2>
          <div className="grid-2">
            <div className={styles.field}><label>Title *</label><input name="title" value={form.title} onChange={handleChange} required /></div>
            <div className={styles.field}><label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange} required>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className={styles.field}><label>Brand *</label><input name="brand" value={form.brand} onChange={handleChange} required /></div>
            <div className={styles.field}><label>Model</label><input name="model_name" value={form.model_name} onChange={handleChange} /></div>
            <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
              <label>Condition</label>
              <div className={styles.conditionRow}>
                {CONDITIONS.map(c => (
                  <label key={c.value} className={`${styles.conditionOption} ${form.condition === c.value ? styles.conditionSelected : ''}`}>
                    <input type="radio" name="condition" value={c.value} checked={form.condition === c.value} onChange={handleChange} style={{ display: 'none' }} />
                    {c.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.field} style={{ marginTop: '1rem' }}>
            <label>Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} required />
          </div>
        </div>

        {/* Pricing */}
        <div className={styles.section}>
          <h2>Pricing</h2>
          <div className="grid-2">
            <div className={styles.field}><label>Daily Rate (₹) *</label><input type="number" name="daily_rate" value={form.daily_rate} onChange={handleChange} min="1" required /></div>
            <div className={styles.field}><label>Weekly Rate (₹)</label><input type="number" name="weekly_rate" value={form.weekly_rate} onChange={handleChange} min="1" /></div>
            <div className={styles.field}><label>Monthly Rate (₹)</label><input type="number" name="monthly_rate" value={form.monthly_rate} onChange={handleChange} min="1" /></div>
            <div className={styles.field}><label>Security Deposit (₹) *</label><input type="number" name="deposit" value={form.deposit} onChange={handleChange} min="0" required /></div>
          </div>
        </div>

        {/* Location */}
        <div className={styles.section}>
          <h2>Location</h2>
          <div className="grid-2">
            <div className={styles.field}><label>City *</label><input name="city" value={form.city} onChange={handleChange} required /></div>
            <div className={styles.field}><label>State *</label><input name="state" value={form.state} onChange={handleChange} required /></div>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn btn-primary btn-lg" disabled={mutation.isPending}>
            {mutation.isPending ? <span className="spinner" /> : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
