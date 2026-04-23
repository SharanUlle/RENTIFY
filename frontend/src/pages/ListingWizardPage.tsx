import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Check, ChevronRight, ChevronLeft, Camera, DollarSign, Tag, MapPin } from 'lucide-react'

const STEPS = [
  { label: 'Details', icon: Tag },
  { label: 'Pricing', icon: DollarSign },
  { label: 'Media', icon: Camera },
]

const categories = ['Cameras', 'Drones', 'Laptops', 'Audio', 'Gaming', 'Lenses', 'Lighting', 'Stabilizers', 'Other']
const conditions = ['Brand New', 'Like New', 'Good', 'Fair']

type Form = {
  title: string; category: string; condition: string; description: string; city: string
  hourly: string; daily: string; weekly: string; monthly: string; deposit: string
  images: File[]
}

function StepDetails({ form, set }: { form: Form; set: (k: keyof Form, v: any) => void }) {
  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Product Title *</label>
        <input value={form.title} onChange={e => set('title', e.target.value)}
          placeholder="e.g. Sony A7 III Mirrorless Camera"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6c47ff]/20 focus:border-[#6c47ff] text-sm transition-all" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Category *</label>
          <select value={form.category} onChange={e => set('category', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6c47ff]/20 focus:border-[#6c47ff] text-sm bg-white transition-all appearance-none">
            <option value="">Select category</option>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Condition *</label>
          <select value={form.condition} onChange={e => set('condition', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6c47ff]/20 focus:border-[#6c47ff] text-sm bg-white transition-all appearance-none">
            <option value="">Select condition</option>
            {conditions.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Description *</label>
        <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={4}
          placeholder="Describe the product, what's included, any accessories..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6c47ff]/20 focus:border-[#6c47ff] text-sm resize-none transition-all" />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">City / Location *</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input value={form.city} onChange={e => set('city', e.target.value)}
            placeholder="e.g. Bengaluru"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6c47ff]/20 focus:border-[#6c47ff] text-sm transition-all" />
        </div>
      </div>
    </motion.div>
  )
}

function PriceInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">₹</span>
        <input type="number" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6c47ff]/20 focus:border-[#6c47ff] text-sm transition-all" />
      </div>
    </div>
  )
}

function StepPricing({ form, set }: { form: Form; set: (k: keyof Form, v: any) => void }) {
  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
      <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700 border border-blue-100">
        Set competitive rates to attract more renters. You can leave fields blank for durations you don't offer.
      </div>
      <div className="grid grid-cols-2 gap-4">
        <PriceInput label="Hourly Rate" value={form.hourly} onChange={v => set('hourly', v)} placeholder="150" />
        <PriceInput label="Daily Rate *" value={form.daily} onChange={v => set('daily', v)} placeholder="800" />
        <PriceInput label="Weekly Rate" value={form.weekly} onChange={v => set('weekly', v)} placeholder="4500" />
        <PriceInput label="Monthly Rate" value={form.monthly} onChange={v => set('monthly', v)} placeholder="14000" />
      </div>
      <PriceInput label="Security Deposit *" value={form.deposit} onChange={v => set('deposit', v)} placeholder="5000" />
      <p className="text-xs text-gray-500">The deposit is fully refunded when the rental ends without issues.</p>
    </motion.div>
  )
}

function DropZone({ images, setImages }: { images: File[]; setImages: (imgs: File[]) => void }) {
  const [dragging, setDragging] = useState(false)

  const addFiles = useCallback((files: FileList | null) => {
    if (!files) return
    const valid = Array.from(files).filter(f => f.type.startsWith('image/')).slice(0, 6 - images.length)
    setImages([...images, ...valid])
  }, [images, setImages])

  const removeImage = (i: number) => setImages(images.filter((_, j) => j !== i))

  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files) }}
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all ${dragging ? 'border-[#6c47ff] bg-purple-50' : 'border-gray-200 hover:border-[#6c47ff]/50 hover:bg-gray-50'}`}>
        <input type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={e => addFiles(e.target.files)} />
        <Upload className="mx-auto mb-3 text-gray-400" size={28} />
        <p className="font-semibold text-gray-700 text-sm">Drag & drop images here</p>
        <p className="text-gray-400 text-xs mt-1">or click to browse · Up to 6 images · PNG, JPG, WEBP</p>
        <p className="text-gray-400 text-xs mt-1">{images.length}/6 images added</p>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((img, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square rounded-xl overflow-hidden group">
              <img src={URL.createObjectURL(img)} alt="" className="w-full h-full object-cover" />
              {i === 0 && <span className="absolute top-1 left-1 bg-[#6c47ff] text-white text-xs px-2 py-0.5 rounded-full">Cover</span>}
              <button onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <X size={12} className="text-white" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default function ListingWizardPage() {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState<Form>({
    title: '', category: '', condition: '', description: '', city: '',
    hourly: '', daily: '', weekly: '', monthly: '', deposit: '', images: []
  })

  const set = (k: keyof Form, v: any) => setForm(f => ({ ...f, [k]: v }))

  const canNext = [
    form.title && form.category && form.condition && form.city,
    form.daily && form.deposit,
    true,
  ]

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-10 text-center shadow-xl max-w-sm w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="text-green-500" size={36} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Listing Created!</h2>
          <p className="text-gray-500 text-sm">Your product is now live and visible to renters.</p>
          <button onClick={() => { setSubmitted(false); setStep(0); setForm({ title: '', category: '', condition: '', description: '', city: '', hourly: '', daily: '', weekly: '', monthly: '', deposit: '', images: [] }) }}
            className="mt-6 px-6 py-3 bg-[#6c47ff] text-white rounded-xl font-semibold text-sm w-full">
            List Another Item
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-xl overflow-hidden">
        {/* Progress header */}
        <div className="bg-gradient-to-r from-[#6c47ff] to-[#a78bfa] p-6">
          <h1 className="text-white font-bold text-xl mb-4">List Your Item</h1>
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${i < step ? 'bg-white' : i === step ? 'bg-white/30 border-2 border-white' : 'bg-white/10'}`}>
                  {i < step
                    ? <Check size={14} className="text-[#6c47ff]" />
                    : <s.icon size={14} className="text-white" />}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${i === step ? 'text-white' : 'text-white/60'}`}>{s.label}</span>
                {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 rounded-full ${i < step ? 'bg-white' : 'bg-white/20'}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === 0 && <StepDetails key="details" form={form} set={set} />}
            {step === 1 && <StepPricing key="pricing" form={form} set={set} />}
            {step === 2 && <DropZone key="media" images={form.images} setImages={v => set('images', v)} />}
          </AnimatePresence>

          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors">
                <ChevronLeft size={16} /> Back
              </motion.button>
            )}
            <motion.button whileTap={{ scale: 0.97 }} disabled={!canNext[step]}
              onClick={() => step < 2 ? setStep(s => s + 1) : setSubmitted(true)}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#6c47ff] text-white rounded-xl font-semibold text-sm hover:bg-[#5535e0] transition-colors disabled:opacity-40 shadow-lg shadow-[#6c47ff]/20">
              {step === 2 ? 'Publish Listing' : <><span>Continue</span><ChevronRight size={16} /></>}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}
