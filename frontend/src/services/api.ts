import axios from 'axios'

// In production, VITE_API_URL should be set to your backend URL, e.g. https://rentify-api.onrender.com
// In development, the Vite proxy handles /api -> localhost:8000
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rentify_token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('rentify_token')
      localStorage.removeItem('rentify_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
