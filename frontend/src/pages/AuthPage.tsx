import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Phone, ShieldCheck, Star, Zap } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ]
  const score = checks.filter(Boolean).length
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const colors = ['', 'bg-red-500', 'bg-yellow-400', 'bg-blue-500', 'bg-green-500']

  if (!password) return null
  return (
    <div className="mt-1">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= score ? colors[score] : 'bg-gray-200'}`} />
        ))}
      </div>
      <p className={`text-xs font-medium ${score <= 1 ? 'text-red-500' : score === 2 ? 'text-yellow-500' : score === 3 ? 'text-blue-500' : 'text-green-500'}`}>
        {labels[score]}
      </p>
    </div>
  )
}

export default function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const navigate = useNavigate()
  const { login, register } = useAuthStore()
  const [isLogin, setIsLogin] = useState(mode === 'login')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isLogin) {
        await login(form.email, form.password)
        toast.success('Welcome back!')
      } else {
        await register(form.name, form.email, form.password, form.phone)
        toast.success('Account created!')
      }
      navigate('/')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const testimonials = [
    { name: 'Priya S.', text: 'Rented a camera for a week — saved ₹40,000!', rating: 5 },
    { name: 'Rahul M.', text: 'Listed my drone and earned ₹12,000 last month.', rating: 5 },
    { name: 'Ananya K.', text: 'Super smooth booking experience.', rating: 5 },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#6c47ff] via-[#7c5cfc] to-[#a78bfa] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full border border-white"
              style={{ width: `${(i + 1) * 120}px`, height: `${(i + 1) * 120}px`, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
          ))}
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Zap className="text-white" size={20} />
            </div>
            <span className="text-white text-2xl font-bold">Rentify</span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Rent anything.<br />Earn everything.
          </h1>
          <p className="text-white/80 text-lg">
            India's smartest electronics rental platform. Save money, make money.
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          {testimonials.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex gap-1 mb-2">
                {[...Array(t.rating)].map((_, j) => <Star key={j} size={12} className="text-yellow-300 fill-yellow-300" />)}
              </div>
              <p className="text-white/90 text-sm mb-2">"{t.text}"</p>
              <p className="text-white/60 text-xs font-medium">— {t.name}</p>
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 flex gap-6">
          {[['10K+', 'Users'], ['5K+', 'Products'], ['₹2Cr+', 'Saved']].map(([n, l]) => (
            <div key={l}>
              <p className="text-white text-xl font-bold">{n}</p>
              <p className="text-white/60 text-xs">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gray-50">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            {/* Tab toggle */}
            <div className="flex bg-gray-100 rounded-2xl p-1 mb-8">
              {(['login', 'register'] as const).map(tab => (
                <button key={tab} onClick={() => setIsLogin(tab === 'login')}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all duration-300 ${isLogin === (tab === 'login') ? 'bg-white shadow text-[#6c47ff]' : 'text-gray-500 hover:text-gray-700'}`}>
                  {tab === 'login' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={isLogin ? 'login' : 'register'} initial={{ opacity: 0, x: isLogin ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {isLogin ? 'Welcome back!' : 'Create account'}
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  {isLogin ? 'Sign in to your Rentify account' : 'Start renting or earning today'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input type="text" value={form.name} onChange={set('name')} required={!isLogin}
                          placeholder="Sharan Ulle"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6c47ff]/30 focus:border-[#6c47ff] text-sm transition-all" />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input type="email" value={form.email} onChange={set('email')} required
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6c47ff]/30 focus:border-[#6c47ff] text-sm transition-all" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={set('password')} required
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6c47ff]/30 focus:border-[#6c47ff] text-sm transition-all" />
                      <button type="button" onClick={() => setShowPassword(s => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {!isLogin && <PasswordStrength password={form.password} />}
                  </div>

                  {!isLogin && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Phone (optional)</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input type="tel" value={form.phone} onChange={set('phone')}
                          placeholder="+91 98765 43210"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6c47ff]/30 focus:border-[#6c47ff] text-sm transition-all" />
                      </div>
                    </div>
                  )}

                  {isLogin && (
                    <div className="flex justify-end">
                      <Link to="#" className="text-sm text-[#6c47ff] hover:underline">Forgot password?</Link>
                    </div>
                  )}

                  <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 bg-[#6c47ff] hover:bg-[#5535e0] text-white rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-60 shadow-lg shadow-[#6c47ff]/25 mt-2">
                    {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
                  </motion.button>
                </form>

                <div className="mt-4 flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-gray-400 text-xs">or</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <ShieldCheck size={14} className="text-green-500" />
                  Secured with 256-bit encryption
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
