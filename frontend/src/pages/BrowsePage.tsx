import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, MapPin, Clock, Calendar, Shield, ChevronUp, ChevronDown } from 'lucide-react'

const categories = ['All', 'Cameras', 'Drones', 'Laptops', 'Audio', 'Gaming', 'Lenses']

const products = [
  { id: 1, title: 'Sony A7 III Mirrorless Camera', category: 'Cameras', city: 'Bengaluru', rating: 4.9, reviews: 34, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80', hourly: 150, daily: 800, weekly: 4500, monthly: 14000, deposit: 5000 },
  { id: 2, title: 'DJI Mavic 3 Pro Drone', category: 'Drones', city: 'Mumbai', rating: 4.8, reviews: 21, image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&q=80', hourly: 300, daily: 1500, weekly: 8000, monthly: 25000, deposit: 10000 },
  { id: 3, title: 'MacBook Pro M3 16"', category: 'Laptops', city: 'Pune', rating: 4.7, reviews: 18, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80', hourly: 200, daily: 1000, weekly: 5500, monthly: 18000, deposit: 8000 },
  { id: 4, title: 'Canon EF 70-200mm f/2.8 Lens', category: 'Lenses', city: 'Bengaluru', rating: 4.9, reviews: 45, image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&q=80', hourly: 100, daily: 500, weekly: 2800, monthly: 9000, deposit: 3000 },
  { id: 5, title: 'Sony WH-1000XM5 Headphones', category: 'Audio', city: 'Delhi', rating: 4.6, reviews: 29, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80', hourly: 50, daily: 250, weekly: 1400, monthly: 4500, deposit: 1500 },
  { id: 6, title: 'PlayStation 5 Console', category: 'Gaming', city: 'Hyderabad', rating: 4.8, reviews: 52, image: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=400&q=80', hourly: 80, daily: 400, weekly: 2200, monthly: 7000, deposit: 3000 },
]

type RentalType = 'hourly' | 'daily' | 'weekly' | 'monthly'

function RentalModal({ product, onClose }: { product: typeof products[0]; onClose: () => void }) {
  const [type, setType] = useState<RentalType>('daily')
  const [qty, setQty] = useState(1)

  const rates: Record<RentalType, number> = {
    hourly: product.hourly, daily: product.daily, weekly: product.weekly, monthly: product.monthly
  }
  const labels: Record<RentalType, string> = { hourly: 'Hour', daily: 'Day', weekly: 'Week', monthly: 'Month' }
  const platformFee = Math.round(rates[type] * qty * 0.05)
  const total = rates[type] * qty + product.deposit + platformFee

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}>
      <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}>

        {/* Image header */}
        <div className="relative h-48">
          <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
            <X size={16} />
          </button>
          <div className="absolute bottom-3 left-4">
            <h3 className="text-white font-bold text-lg leading-tight">{product.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1 text-yellow-300 text-sm">
                <Star size={12} fill="currentColor" /> {product.rating}
              </div>
              <span className="text-white/70 text-xs">({product.reviews} reviews)</span>
              <span className="text-white/70 text-xs flex items-center gap-1"><MapPin size={10} />{product.city}</span>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Rental type tiles */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Select Duration Type</p>
            <div className="grid grid-cols-4 gap-2">
              {(['hourly', 'daily', 'weekly', 'monthly'] as RentalType[]).map(t => (
                <motion.button key={t} whileTap={{ scale: 0.96 }} onClick={() => { setType(t); setQty(1) }}
                  className={`py-2.5 rounded-xl text-xs font-semibold capitalize transition-all border-2 ${type === t ? 'border-[#6c47ff] bg-[#6c47ff] text-white shadow-lg shadow-[#6c47ff]/20' : 'border-gray-200 text-gray-600 hover:border-[#6c47ff]/40'}`}>
                  {t}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Quantity stepper */}
          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
            <span className="text-sm text-gray-700 font-medium">
              Number of {labels[type]}s
            </span>
            <div className="flex items-center gap-3">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:border-[#6c47ff] transition-colors shadow-sm">
                <ChevronDown size={16} />
              </button>
              <span className="w-6 text-center font-bold text-gray-900">{qty}</span>
              <button onClick={() => setQty(q => q + 1)}
                className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:border-[#6c47ff] transition-colors shadow-sm">
                <ChevronUp size={16} />
              </button>
            </div>
          </div>

          {/* Cost breakdown */}
          <div className="bg-purple-50 rounded-xl p-4 space-y-2">
            <p className="text-sm font-semibold text-gray-700 mb-3">Cost Breakdown</p>
            {[
              [`Base Price (${qty} ${labels[type]}${qty > 1 ? 's' : ''} × ₹${rates[type].toLocaleString('en-IN')})`, rates[type] * qty],
              ['Security Deposit (refundable)', product.deposit],
              ['Platform Fee (5%)', platformFee],
            ].map(([label, val]) => (
              <div key={label as string} className="flex justify-between text-sm">
                <span className="text-gray-600">{label}</span>
                <span className="font-medium text-gray-800">₹{(val as number).toLocaleString('en-IN')}</span>
              </div>
            ))}
            <div className="border-t border-purple-200 mt-2 pt-2 flex justify-between">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-[#6c47ff] text-lg">₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex items-center gap-1 text-xs text-gray-500 flex-1">
              <Shield size={12} className="text-green-500" /> Secure payment · Instant confirmation
            </div>
            <motion.button whileTap={{ scale: 0.97 }}
              className="px-6 py-3 bg-[#6c47ff] text-white rounded-xl font-semibold text-sm hover:bg-[#5535e0] transition-colors shadow-lg shadow-[#6c47ff]/25">
              Book & Pay ₹{total.toLocaleString('en-IN')}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function ProductCard({ product, onClick }: { product: typeof products[0]; onClick: () => void }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={onClick}>
      <div className="relative h-48 overflow-hidden">
        <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700">
          {product.category}
        </span>
        <div className="absolute top-3 right-3 px-2.5 py-1 bg-[#6c47ff] rounded-full text-xs font-bold text-white">
          ₹{product.daily.toLocaleString('en-IN')}/day
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-2 line-clamp-2">{product.title}</h3>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Star size={11} className="text-yellow-400 fill-yellow-400" />
            <span className="font-medium text-gray-700">{product.rating}</span>
            <span>({product.reviews})</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={11} />
            {product.city}
          </div>
        </div>
        <div className="flex gap-2 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
            <Clock size={10} /> ₹{product.hourly}/hr
          </span>
          <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
            <Calendar size={10} /> ₹{product.weekly.toLocaleString('en-IN')}/wk
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default function BrowsePage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null)

  const filtered = activeCategory === 'All' ? products : products.filter(p => p.category === activeCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Equipment</h1>
          <p className="text-gray-500">Rent premium electronics from verified owners near you</p>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {categories.map(cat => (
            <motion.button key={cat} whileTap={{ scale: 0.95 }} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-[#6c47ff] text-white shadow-md shadow-[#6c47ff]/25' : 'bg-white text-gray-600 border border-gray-200 hover:border-[#6c47ff]/40'}`}>
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Product Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map(p => (
              <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <ProductCard product={p} onClick={() => setSelectedProduct(p)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedProduct && <RentalModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      </AnimatePresence>
    </div>
  )
}
