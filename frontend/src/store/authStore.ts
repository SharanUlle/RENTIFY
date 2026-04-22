import { create } from 'zustand'
import { authService } from '../services'

interface User { id: string; name: string; email: string; role: string; avatar_url?: string }

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>
  logout: () => void
  init: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  init: () => {
    const stored = localStorage.getItem('rentify_user')
    const token = localStorage.getItem('rentify_token')
    if (stored && token) {
      set({ user: JSON.parse(stored), isAuthenticated: true })
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const res = await authService.login({ email, password })
      set({ user: res.user, isAuthenticated: true, isLoading: false })
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Login failed', isLoading: false })
      throw err
    }
  },

  register: async (name, email, password, phone) => {
    set({ isLoading: true, error: null })
    try {
      const res = await authService.register({ name, email, password, phone })
      set({ user: res.user, isAuthenticated: true, isLoading: false })
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Registration failed', isLoading: false })
      throw err
    }
  },

  logout: () => {
    authService.logout()
    set({ user: null, isAuthenticated: false })
  },

  clearError: () => set({ error: null }),
}))
