import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { productService } from '../services'
import toast from 'react-hot-toast'
import { Upload, X } from 'lucide-react'
import styles from './CreateListingPage.module.css'

const CATEGORIES = ['Cameras', 'Laptops', 'Drones', 'Gaming', 'Audio', 'Phones', 'Tablets', 'Other']
const CONDITIONS = [
  { value: 'new', label: 'New' },
  { value: 'like_new', label: 'Like New' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
]

export default function CreateListingPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '', description: '', category: '', brand: '', model_name: '',
    daily_rate: '', weekly_rate: '', monthly_rate: '', hourly_rate: '', deposit: '',
    condition: 'good', city: '', state: '',
  })
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  const mutation = useMutation({
    mutationFn: (fd: FormData) => productService.createProduct(fd),
    onSuccess: () => { toast.success('Listing created!'); navigate('/my-listings') },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to create listing'),
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 5)
    setImages(files)
    setPreviews(files.map(f => URL.createObjectURL(f)))
  }

  const removeImage = (i: number) => {
    setImages(imgs => imgs.filter((_, idx) => idx !== i))
    setPreviews(ps => ps.filter((_, idx) => idx !== i))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (images.length === 0) { toast.error('Add at least one image'); return }
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v) })
    images.forEach(img => fd.append('images', img))
    mutation.mutate(fd)
  }

  return (
    <div className="container section">
      <h1 className={styles.title}>List Your Item</h1>
      <p className={styles.sub}>Fill in the details to start renting out your electronics</p>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Images */}
        <div className={styles.section}>
          <h2>Photos</h2>
          <div className={styles.imageGrid}>
            {previews.map((src, i) => (
              <div key={i} className={styles.previewWrap}>
                <img src={src} alt="" className={styles.preview} />
                <button type="button" className={styles.removeImg} onClick={() => removeImage(i)}><X size={14} /></button>
              </div>
            ))}
            {previews.length < 5 && (
              <label className={styles.uploadArea}>
                <Upload size={24} />
                <span>Add Photos</span>
                <input type="file" accept="image/*" multiple onChange={handleImages} style={{ display: 'none' }} />
              </label>
            )}
          </div>
          <p className={styles.hint}>Up to 5 photos · JPG, PNG, WebP · Max 5MB each</p>
        </div>

        {/* Basic Info */}
        <div className={styles.section}>
          <h2>Basic Info</h2>
          <div className="grid-2">
            <div className={styles.field}><label>Title *</label><input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Sony A7III Camera Body" required /></div>
            <div className={styles.field}><label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange} required>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className={styles.field}><label>Brand *</label><input name="brand" value={form.brand} onChange={handleChange} placeholder="Sony, Apple, DJI..." required /></div>
            <div className={styles.field}><label>Model *</label><input name="model_name" value={form.model_name} onChange={handleChange} placeholder="e.g. A7 III" required /></div>
            <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
              <label>Condition *</label>
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
            <textarea name="description" value={form.description} onChange={handleChange} rows={4}
              placeholder="Describe your item, its accessories, what's included..." required />
          </div>
        </div>

        {/* Pricing */}
        <div className={styles.section}>
          <h2>Pricing</h2>
          <div className="grid-2">
            <div className={styles.field}><label>Hourly Rate (₹)</label><input type="number" name="hourly_rate" value={form.hourly_rate} onChange={handleChange} placeholder="100" min="1" /></div>
            <div className={styles.field}><label>Daily Rate (₹) *</label><input type="number" name="daily_rate" value={form.daily_rate} onChange={handleChange} placeholder="500" min="1" required /></div>
            <div className={styles.field}><label>Weekly Rate (₹)</label><input type="number" name="weekly_rate" value={form.weekly_rate} onChange={handleChange} placeholder="3000" min="1" /></div>
            <div className={styles.field}><label>Monthly Rate (₹)</label><input type="number" name="monthly_rate" value={form.monthly_rate} onChange={handleChange} placeholder="10000" min="1" /></div>
            <div className={styles.field}><label>Security Deposit (₹) *</label><input type="number" name="deposit" value={form.deposit} onChange={handleChange} placeholder="2000" min="0" required /></div>
          </div>
        </div>

        {/* Location */}
        <div className={styles.section}>
          <h2>Location</h2>
          <div className="grid-2">
            <div className={styles.field}><label>City *</label><input name="city" value={form.city} onChange={handleChange} placeholder="New York" required /></div>
            <div className={styles.field}><label>State *</label><input name="state" value={form.state} onChange={handleChange} placeholder="NY" required /></div>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn btn-primary btn-lg" disabled={mutation.isPending}>
            {mutation.isPending ? <span className="spinner" /> : 'Publish Listing'}
          </button>
        </div>
      </form>
    </div>
  )
}
