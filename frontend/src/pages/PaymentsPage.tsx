import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wallet, ArrowDownCircle, ArrowUpCircle, Download, Filter, CreditCard, CheckCircle2 } from 'lucide-react'

const transactions = [
  { id: 'TXN001', desc: 'Sony Camera rental — Priya S.', date: '22 Apr 2026', amount: 3200, type: 'credit', status: 'completed' },
  { id: 'TXN002', desc: 'Security deposit refund', date: '20 Apr 2026', amount: 5000, type: 'credit', status: 'completed' },
  { id: 'TXN003', desc: 'DJI Drone rental payment', date: '18 Apr 2026', amount: 1500, type: 'debit', status: 'completed' },
  { id: 'TXN004', desc: 'MacBook Pro rental — Rahul M.', date: '15 Apr 2026', amount: 4500, type: 'credit', status: 'pending' },
  { id: 'TXN005', desc: 'Platform fee', date: '15 Apr 2026', amount: 225, type: 'debit', status: 'completed' },
  { id: 'TXN006', desc: 'Canon Lens rental earnings', date: '10 Apr 2026', amount: 2800, type: 'credit', status: 'completed' },
  { id: 'TXN007', desc: 'Withdrawal to bank account', date: '05 Apr 2026', amount: 10000, type: 'debit', status: 'completed' },
]

const paymentMethods = [
  { id: 'razorpay', name: 'Razorpay', sub: 'UPI, Cards, Wallets', icon: '⚡', color: 'blue' },
  { id: 'upi', name: 'UPI Direct', sub: 'GPay, PhonePe, BHIM', icon: '🇮🇳', color: 'green' },
  { id: 'card', name: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay', icon: '💳', color: 'purple' },
  { id: 'wallet', name: 'Paytm Wallet', sub: 'Instant transfer', icon: '👛', color: 'blue' },
]

const statusColors: Record<string, string> = {
  completed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700',
}

export default function PaymentsPage() {
  const [activeMethod, setActiveMethod] = useState('razorpay')
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? transactions : transactions.filter(t => t.type === filter)
  const available = 8200
  const pending = 4500
  const totalEarned = transactions.filter(t => t.type === 'credit').reduce((a, b) => a + b.amount, 0)

  const handleExport = () => {
    const csv = ['ID,Description,Date,Amount,Type,Status',
      ...transactions.map(t => `${t.id},"${t.desc}",${t.date},${t.amount},${t.type},${t.status}`)
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
    a.download = 'rentify-transactions.csv'; a.click()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Wallet className="text-[#6c47ff]" size={24} /> Payments & Wallet
        </h1>

        {/* Wallet Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Available to Withdraw', value: `₹${available.toLocaleString('en-IN')}`, icon: ArrowUpCircle, color: 'text-green-500', bg: 'bg-green-50', action: true },
            { label: 'Pending Clearance', value: `₹${pending.toLocaleString('en-IN')}`, icon: ArrowDownCircle, color: 'text-yellow-500', bg: 'bg-yellow-50', action: false },
            { label: 'Total Earned (Ever)', value: `₹${totalEarned.toLocaleString('en-IN')}`, icon: Wallet, color: 'text-[#6c47ff]', bg: 'bg-purple-50', action: false },
          ].map((card, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center`}>
                  <card.icon size={20} className={card.color} />
                </div>
                {card.action && (
                  <motion.button whileTap={{ scale: 0.96 }}
                    className="text-xs px-3 py-1.5 bg-[#6c47ff] text-white rounded-lg font-semibold hover:bg-[#5535e0] transition-colors">
                    Withdraw
                  </motion.button>
                )}
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{card.value}</p>
              <p className="text-sm text-gray-500">{card.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Payment Methods */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <CreditCard size={16} className="text-[#6c47ff]" /> Payment Methods
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {paymentMethods.map(m => (
              <motion.button key={m.id} whileTap={{ scale: 0.97 }} onClick={() => setActiveMethod(m.id)}
                className={`relative p-4 rounded-xl border-2 text-left transition-all ${activeMethod === m.id ? 'border-[#6c47ff] bg-purple-50' : 'border-gray-200 hover:border-gray-300 bg-gray-50'}`}>
                {activeMethod === m.id && (
                  <span className="absolute top-2 right-2">
                    <CheckCircle2 size={14} className="text-[#6c47ff]" />
                  </span>
                )}
                <span className="text-2xl mb-2 block">{m.icon}</span>
                <p className="font-semibold text-gray-800 text-xs">{m.name}</p>
                <p className="text-gray-500 text-xs mt-0.5">{m.sub}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Transaction Table */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Transactions</h2>
            <div className="flex items-center gap-2">
              {/* Filter */}
              <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1 border border-gray-200">
                <Filter size={12} className="text-gray-400 ml-1" />
                {['all', 'credit', 'debit'].map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${filter === f ? 'bg-white text-[#6c47ff] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                    {f}
                  </button>
                ))}
              </div>
              <motion.button whileTap={{ scale: 0.96 }} onClick={handleExport}
                className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                <Download size={12} /> Export
              </motion.button>
            </div>
          </div>

          <div className="divide-y divide-gray-50">
            {filtered.map((t, i) => (
              <motion.div key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${t.type === 'credit' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {t.type === 'credit'
                    ? <ArrowDownCircle size={16} className="text-green-600" />
                    : <ArrowUpCircle size={16} className="text-red-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{t.desc}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{t.date} · {t.id}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[t.status]} hidden sm:block`}>
                  {t.status}
                </span>
                <p className={`font-bold text-sm whitespace-nowrap ${t.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>
                  {t.type === 'credit' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                </p>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-12 text-center text-gray-400">
              <Wallet size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No transactions found</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
