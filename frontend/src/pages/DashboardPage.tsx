import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Package, ShoppingBag, Wallet, Shield,
  ChevronLeft, ChevronRight, TrendingUp, Bell, Search,
  ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, XCircle, Zap
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Package, label: 'My Listings', href: '/my-listings' },
  { icon: ShoppingBag, label: 'My Rentals', href: '/my-rentals' },
  { icon: Wallet, label: 'Payments', href: '/payments' },
  { icon: Shield, label: 'Security', href: '/security' },
]

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const norm = (v: number) => ((v - min) / (max - min || 1)) * 30
  const points = data.map((v, i) => `${(i / (data.length - 1)) * 80},${30 - norm(v)}`).join(' ')
  return (
    <svg width="80" height="32" className="opacity-70">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

const stats = [
  { label: 'Total Earnings', value: '₹24,800', change: '+12%', up: true, data: [12, 18, 14, 22, 19, 25, 24], color: '#6c47ff' },
  { label: 'Active Rentals', value: '7', change: '+3', up: true, data: [2, 4, 3, 5, 6, 7, 7], color: '#10b981' },
  { label: 'Listings', value: '12', change: '+1', up: true, data: [8, 9, 9, 10, 11, 11, 12], color: '#f59e0b' },
  { label: 'Avg Rating', value: '4.8', change: '+0.2', up: true, data: [4.2, 4.4, 4.5, 4.6, 4.7, 4.7, 4.8], color: '#ef4444' },
]

const activity = [
  { type: 'rental', label: 'Sony Camera rented by Priya S.', time: '2 mins ago', status: 'active' },
  { type: 'payment', label: 'Received ₹3,200 from Rahul M.', time: '1 hour ago', status: 'completed' },
  { type: 'rental', label: 'DJI Drone rental request', time: '3 hours ago', status: 'pending' },
  { type: 'review', label: 'Got 5★ review on MacBook Pro', time: '5 hours ago', status: 'completed' },
  { type: 'rental', label: 'Canon EF Lens — rental ended', time: 'Yesterday', status: 'completed' },
  { type: 'rental', label: 'GoPro booking cancelled', time: '2 days ago', status: 'cancelled' },
]

const statusConfig: Record<string, { color: string; icon: typeof CheckCircle2 }> = {
  active: { color: 'bg-blue-100 text-blue-700', icon: Clock },
  pending: { color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  completed: { color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  cancelled: { color: 'bg-red-100 text-red-700', icon: XCircle },
}

export default function DashboardPage() {
  const [collapsed, setCollapsed] = useState(false)
  const [search, setSearch] = useState('')
  const { user } = useAuthStore()
  const location = useLocation()

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <motion.aside animate={{ width: collapsed ? 72 : 240 }} transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="bg-white border-r border-gray-100 flex flex-col shadow-sm z-10 overflow-hidden">
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-100">
          <div className="w-9 h-9 bg-[#6c47ff] rounded-xl flex items-center justify-center flex-shrink-0">
            <Zap size={16} className="text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="font-bold text-gray-900 text-lg whitespace-nowrap">Rentify</motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map(item => {
            const active = location.pathname === item.href
            return (
              <Link key={item.href} to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${active ? 'bg-[#6c47ff] text-white shadow-md shadow-[#6c47ff]/20' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
                <item.icon size={18} className="flex-shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="text-sm font-medium whitespace-nowrap">{item.label}</motion.span>
                  )}
                </AnimatePresence>
              </Link>
            )
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="px-2 pb-4">
          <button onClick={() => setCollapsed(c => !c)}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all">
            {collapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /><span className="text-sm">Collapse</span></>}
          </button>
        </div>
      </motion.aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4">
          <div className="flex-1 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search products, rentals..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#6c47ff]/20 focus:border-[#6c47ff] transition-all" />
          </div>
          <button className="relative p-2 hover:bg-gray-50 rounded-xl transition-colors">
            <Bell size={18} className="text-gray-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#6c47ff] rounded-full flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.name || 'User'}</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Good morning, {user?.name?.split(' ')[0] || 'there'} 👋</h1>
            <p className="text-gray-500 text-sm">Here's what's happening with your account today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                  <div className={`flex items-center gap-0.5 text-xs font-semibold ${s.up ? 'text-green-500' : 'text-red-500'}`}>
                    {s.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {s.change}
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-3">{s.value}</p>
                <Sparkline data={s.data} color={s.color} />
              </motion.div>
            ))}
          </div>

          {/* Activity Feed */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <TrendingUp size={16} className="text-[#6c47ff]" /> Recent Activity
              </h2>
              <Link to="/my-rentals" className="text-sm text-[#6c47ff] hover:underline font-medium">View all →</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {activity.map((item, i) => {
                const cfg = statusConfig[item.status]
                const Icon = cfg.icon
                return (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.05 }}
                    className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon size={14} className="text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 font-medium truncate">{item.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${cfg.color}`}>
                      {item.status}
                    </span>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
