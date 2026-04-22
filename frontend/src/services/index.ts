import api from './api'

export const authService = {
  register: async (data: { name: string; email: string; password: string; phone?: string }) => {
    const res = await api.post('/auth/register', data)
    localStorage.setItem('rentify_token', res.data.token)
    localStorage.setItem('rentify_user', JSON.stringify(res.data.user))
    return res.data
  },
  login: async (data: { email: string; password: string }) => {
    const res = await api.post('/auth/login', data)
    localStorage.setItem('rentify_token', res.data.token)
    localStorage.setItem('rentify_user', JSON.stringify(res.data.user))
    return res.data
  },
  logout: () => {
    localStorage.removeItem('rentify_token')
    localStorage.removeItem('rentify_user')
  },
  getMe: async () => {
    const res = await api.get('/auth/me')
    return res.data.user
  },
  updateProfile: async (formData: FormData) => {
    const res = await api.put('/auth/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    const user = res.data.user
    localStorage.setItem('rentify_user', JSON.stringify(user))
    return user
  },
  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const res = await api.put('/auth/change-password', data)
    return res.data
  },
}

export const productService = {
  getProducts: async (params = {}) => {
    const res = await api.get('/products', { params })
    return res.data
  },
  getProduct: async (id: string) => {
    const res = await api.get(`/products/${id}`)
    return res.data.product
  },
  createProduct: async (formData: FormData) => {
    const res = await api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data.product
  },
  updateProduct: async (id: string, formData: FormData) => {
    const res = await api.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data.product
  },
  deleteProduct: async (id: string) => {
    const res = await api.delete(`/products/${id}`)
    return res.data
  },
  getMyListings: async () => {
    const res = await api.get('/products/owner/me')
    return res.data.products
  },
}

export const rentalService = {
  createRental: async (data: { product_id: string; start_date: string; end_date?: string; rental_type: string; total_units?: number; notes?: string }) => {
    const res = await api.post('/rentals', data)
    return res.data
  },
  getMyRentals: async () => {
    const res = await api.get('/rentals/my-rentals')
    return res.data.rentals
  },
  getMyListingRentals: async () => {
    const res = await api.get('/rentals/my-listings')
    return res.data.rentals
  },
  approveRental: async (id: string) => {
    const res = await api.put(`/rentals/${id}/approve`)
    return res.data.rental
  },
  cancelRental: async (id: string, reason?: string) => {
    const res = await api.put(`/rentals/${id}/cancel`, { reason })
    return res.data.rental
  },
  completeRental: async (id: string) => {
    const res = await api.put(`/rentals/${id}/complete`)
    return res.data.rental
  },
}

export const reviewService = {
  createReview: async (data: { rental_id: string; rating: number; comment: string; review_type: string }) => {
    const res = await api.post('/reviews', data)
    return res.data.review
  },
  getProductReviews: async (id: string) => {
    const res = await api.get(`/reviews/product/${id}`)
    return res.data.reviews
  },
}

export const paymentService = {
  getKey: async (): Promise<string> => {
    const res = await api.get('/payments/key')
    return res.data.key
  },
  createOrder: async (rental_id: string) => {
    const res = await api.post('/payments/create-order', { rental_id })
    return res.data as { order_id: string; amount: number; currency: string; key: string }
  },
  verifyPayment: async (data: {
    rental_id: string
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
  }) => {
    const res = await api.post('/payments/verify', data)
    return res.data
  },
}
