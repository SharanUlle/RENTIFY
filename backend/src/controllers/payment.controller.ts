import { Request, Response } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import Rental from '../models/Rental';

interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

// Razorpay instance (lazily initialized to handle missing keys gracefully)
const getRazorpay = () => {
  const keyId = process.env.RAZORPAY_KEY_ID || '';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

// POST /api/payments/create-order
// Creates a Razorpay order for a given rental
export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { rental_id } = req.body;

    const rental = await Rental.findByPk(rental_id);
    if (!rental) {
      res.status(404).json({ success: false, message: 'Rental not found' });
      return;
    }
    if (rental.renter_id !== req.user!.id) {
      res.status(403).json({ success: false, message: 'Not authorized' });
      return;
    }
    if (rental.payment_status === 'paid') {
      res.status(400).json({ success: false, message: 'Already paid' });
      return;
    }
    // Amount in paise (Razorpay expects smallest currency unit)
    const amountPaise = Math.round(Number(rental.total_amount) * 100);

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: `rental_${rental_id.slice(0, 20)}`,
      notes: {
        rental_id,
        renter_id: req.user!.id,
      },
    });

    res.json({
      success: true,
      order_id: order.id,
      amount: amountPaise,
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error('Razorpay create-order error:', error);
    res.status(500).json({ success: false, message: 'Failed to create payment order', error: error.message });
  }
};

// POST /api/payments/verify
// Verifies Razorpay payment signature and marks rental as paid
export const verifyPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { rental_id, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!rental_id || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400).json({ success: false, message: 'Missing payment details' });
      return;
    }

    // Verify HMAC-SHA256 signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      res.status(400).json({ success: false, message: 'Payment verification failed — invalid signature' });
      return;
    }

    // Update rental payment status
    const rental = await Rental.findByPk(rental_id);
    if (!rental) {
      res.status(404).json({ success: false, message: 'Rental not found' });
      return;
    }

    await rental.update({
      payment_status: 'paid',
      payment_intent_id: razorpay_payment_id,
      status: 'approved',  // auto-approve after payment
    });

    res.json({
      success: true,
      message: 'Payment verified successfully',
      rental,
    });
  } catch (error: any) {
    console.error('Razorpay verify error:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed', error: error.message });
  }
};

// GET /api/payments/key
// Returns the Razorpay public key for frontend
export const getKey = (_req: Request, res: Response): void => {
  res.json({ success: true, key: process.env.RAZORPAY_KEY_ID || '' });
};
