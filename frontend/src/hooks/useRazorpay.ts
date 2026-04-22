// Hook to dynamically load Razorpay checkout script and open payment modal
import { useCallback } from 'react'
import { paymentService } from '../services'
import toast from 'react-hot-toast'

declare global {
  interface Window {
    Razorpay: any
  }
}

const loadRazorpayScript = (): Promise<boolean> =>
  new Promise(resolve => {
    if (window.Razorpay) { resolve(true); return }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })

interface PayOptions {
  rental_id: string
  amount: number          // in ₹ (not paise)
  userName: string
  userEmail: string
  onSuccess: (paymentId: string) => void
  onFailure?: () => void
}

export function useRazorpay() {
  const pay = useCallback(async (opts: PayOptions) => {
    const loaded = await loadRazorpayScript()
    if (!loaded) {
      toast.error('Payment gateway failed to load. Check your internet connection.')
      return
    }

    let orderData: { order_id: string; amount: number; currency: string; key: string }
    try {
      orderData = await paymentService.createOrder(opts.rental_id)
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to create payment order'
      toast.error(msg)
      opts.onFailure?.()
      return
    }

    const rzp = new window.Razorpay({
      key: orderData.key,
      amount: orderData.amount,   // paise from server
      currency: orderData.currency,
      name: 'Rentify',
      description: 'Electronics Rental Payment',
      image: 'https://placehold.co/64x64/6c47ff/white?text=R',
      order_id: orderData.order_id,
      prefill: {
        name: opts.userName,
        email: opts.userEmail,
      },
      theme: { color: '#6c47ff' },
      handler: async (response: {
        razorpay_order_id: string
        razorpay_payment_id: string
        razorpay_signature: string
      }) => {
        try {
          await paymentService.verifyPayment({
            rental_id: opts.rental_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          })
          toast.success('Payment successful! 🎉')
          opts.onSuccess(response.razorpay_payment_id)
        } catch {
          toast.error('Payment captured but verification failed. Please contact support.')
          opts.onFailure?.()
        }
      },
      modal: {
        ondismiss: () => {
          toast('Payment cancelled', { icon: 'ℹ️' })
          opts.onFailure?.()
        },
      },
    })

    rzp.open()
  }, [])

  return { pay }
}
