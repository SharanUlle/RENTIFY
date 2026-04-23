import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { useAuthStore } from './store/authStore'

import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProductDetailPage from './pages/ProductDetailPage'
import MyRentalsPage from './pages/MyRentalsPage'
import MyListingsPage from './pages/MyListingsPage'
import CreateListingPage from './pages/CreateListingPage'
import EditProductPage from './pages/EditProductPage'
import ProfilePage from './pages/ProfilePage'
import DashboardPage from './pages/DashboardPage'
import SecurityHubPage from './pages/SecurityHubPage'
import BrowsePage from './pages/BrowsePage'
import ListingWizardPage from './pages/ListingWizardPage'
import PaymentsPage from './pages/PaymentsPage'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } },
})

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function AppRoutes() {
  const init = useAuthStore(s => s.init)
  useEffect(() => { init() }, [])

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/login-old" element={<LoginPage />} />
        <Route path="/register-old" element={<RegisterPage />} />
        <Route path="/my-rentals" element={<PrivateRoute><MyRentalsPage /></PrivateRoute>} />
        <Route path="/my-listings" element={<PrivateRoute><MyListingsPage /></PrivateRoute>} />
        <Route path="/list-product" element={<PrivateRoute><CreateListingPage /></PrivateRoute>} />
        <Route path="/list-wizard" element={<PrivateRoute><ListingWizardPage /></PrivateRoute>} />
        <Route path="/edit-product/:id" element={<PrivateRoute><EditProductPage /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/security" element={<PrivateRoute><SecurityHubPage /></PrivateRoute>} />
        <Route path="/payments" element={<PrivateRoute><PaymentsPage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
