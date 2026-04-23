import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Mail, Phone, CreditCard, Smartphone, CheckCircle2, XCircle, Trash2, Monitor, Clock } from 'lucide-react'

function RadialScore({ score }: { score: number }) {
  const r = 54
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'
  const label = score >= 80 ? 'Excellent' : score >= 50 ? 'Good' : 'Needs Work'

  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="140" className="-rotate-90">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <motion.circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeLinecap="round" strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }} />
      </svg>
      <div className="-mt-20 text-center">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="text-4xl font-bold" style={{ color }}>{score}</motion.p>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
      </div>
      <div className="mt-16" />
    </div>
  )
}

function OTPInput() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const handleChange = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return
    const next = [...otp]; next[i] = v; setOtp(next)
    if (v && i < 5) (document.getElementById(`otp-${i + 1}`) as HTMLInputElement)?.focus()
  }
  return (
    <div className="flex gap-2 justify-center mt-4">
      {otp.map((v, i) => (
        <input key={i} id={`otp-${i}`} maxLength={1} value={v} onChange={e => handleChange(i, e.target.value)}
          className="w-11 h-12 text-center text-lg font-bold rounded-xl border-2 border-gray-200 focus:border-[#6c47ff] focus:outline-none transition-all" />
      ))}
    </div>
  )
}

const sessions = [
  { device: 'MacBook Pro', location: 'Bengaluru, IN', time: 'Active now', icon: Monitor, current: true },
  { device: 'iPhone 15 Pro', location: 'Bengaluru, IN', time: '2 hours ago', icon: Smartphone, current: false },
  { device: 'Chrome on Windows', location: 'Mumbai, IN', time: '3 days ago', icon: Monitor, current: false },
]

const verificationCards = [
  { icon: Mail, label: 'Email', sub: 'you@example.com', verified: true },
  { icon: Phone, label: 'Phone', sub: '+91 98765 43210', verified: true },
  { icon: CreditCard, label: 'Bank Account', sub: 'Add for withdrawals', verified: false },
]

export default function SecurityHubPage() {
  const [twoFAStep, setTwoFAStep] = useState<'idle' | 'setup' | 'verify'>('idle')
  const securityScore = 72

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="text-[#6c47ff]" size={24} /> Security Settings
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage your account security and active sessions</p>
        </div>

        {/* Score + 2FA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Security Score */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-800 mb-2">Security Score</h2>
            <p className="text-sm text-gray-500 mb-4">Based on your account settings</p>
            <RadialScore score={securityScore} />
            <div className="space-y-2 mt-2">
              {[
                { label: 'Email verified', done: true },
                { label: 'Phone verified', done: true },
                { label: '2FA enabled', done: false },
                { label: 'Bank linked', done: false },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2 text-sm">
                  {item.done
                    ? <CheckCircle2 size={15} className="text-green-500" />
                    : <XCircle size={15} className="text-gray-300" />}
                  <span className={item.done ? 'text-gray-700' : 'text-gray-400'}>{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 2FA Setup */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-800 mb-1">Two-Factor Authentication</h2>
            <p className="text-sm text-gray-500 mb-4">Add an extra layer of security to your account</p>

            {twoFAStep === 'idle' && (
              <div className="flex flex-col items-center gap-4 py-6">
                <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center">
                  <Smartphone className="text-[#6c47ff]" size={28} />
                </div>
                <p className="text-sm text-gray-600 text-center">Protect your account with a one-time code sent to your phone</p>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => setTwoFAStep('setup')}
                  className="px-6 py-2.5 bg-[#6c47ff] text-white rounded-xl text-sm font-semibold hover:bg-[#5535e0] transition-colors">
                  Enable 2FA
                </motion.button>
              </div>
            )}

            {twoFAStep === 'setup' && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
                  We'll send a 6-digit OTP to your registered phone number. Enter it below to enable 2FA.
                </div>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => setTwoFAStep('verify')}
                  className="w-full py-2.5 bg-[#6c47ff] text-white rounded-xl text-sm font-semibold">
                  Send OTP →
                </motion.button>
                <button onClick={() => setTwoFAStep('idle')} className="w-full py-2 text-gray-400 text-sm">Cancel</button>
              </div>
            )}

            {twoFAStep === 'verify' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 text-center">Enter the 6-digit code sent to your phone</p>
                <OTPInput />
                <motion.button whileTap={{ scale: 0.97 }}
                  onClick={() => { setTwoFAStep('idle') }}
                  className="w-full py-2.5 bg-green-500 text-white rounded-xl text-sm font-semibold mt-4">
                  Verify & Enable
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>

        {/* Verification Status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-4">Verification Status</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {verificationCards.map(card => (
              <div key={card.label} className={`rounded-xl p-4 border-2 ${card.verified ? 'border-green-100 bg-green-50' : 'border-gray-100 bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.verified ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <card.icon size={18} className={card.verified ? 'text-green-600' : 'text-gray-400'} />
                  </div>
                  {card.verified
                    ? <CheckCircle2 size={18} className="text-green-500" />
                    : <XCircle size={18} className="text-gray-300" />}
                </div>
                <p className="font-semibold text-gray-800 text-sm">{card.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{card.sub}</p>
                {!card.verified && (
                  <button className="mt-3 text-xs text-[#6c47ff] font-semibold hover:underline">Verify now →</button>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Active Sessions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-4">Active Sessions</h2>
          <div className="space-y-3">
            {sessions.map((s, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <s.icon size={18} className="text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-800 text-sm">{s.device}</p>
                    {s.current && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">Current</span>}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <span>{s.location}</span>
                    <span>·</span>
                    <Clock size={10} />
                    <span>{s.time}</span>
                  </div>
                </div>
                {!s.current && (
                  <motion.button whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors font-medium">
                    <Trash2 size={12} /> Revoke
                  </motion.button>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
