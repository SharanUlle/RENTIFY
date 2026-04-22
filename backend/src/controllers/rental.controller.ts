import { Request, Response } from 'express';
import Product from '../models/Product';
import Rental from '../models/Rental';
import { RentalType } from '../models/Rental';
import User from '../models/User';
import Notification from '../models/Notification';

interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

const calculatePrice = (product: Product, units: number, type: RentalType): number => {
  switch (type) {
    case 'hourly':
      return (product.hourly_rate ?? (Number(product.daily_rate) / 8)) * units;
    case 'weekly':
      return (product.weekly_rate ?? (Number(product.daily_rate) * 7 * 0.85)) * units;
    case 'monthly':
      return (product.monthly_rate ?? (Number(product.daily_rate) * 30 * 0.7)) * units;
    default: // daily
      return Number(product.daily_rate) * units;
  }
};

// POST /api/rentals — create booking request
export const createRental = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { product_id, start_date, end_date, rental_type = 'daily', total_units, notes } = req.body;

    const product = await Product.findByPk(product_id);
    if (!product || !product.is_available) {
      res.status(400).json({ success: false, message: 'Product not available' });
      return;
    }
    if (product.owner_id === req.user!.id) {
      res.status(400).json({ success: false, message: 'You cannot rent your own product' });
      return;
    }

    const type: RentalType = rental_type;
    let units: number;
    // Use plain date string YYYY-MM-DD for DATEONLY columns
    const toDateStr = (d: Date): string => d.toISOString().split('T')[0];

    let startDateStr: string;
    let endDateStr: string;

    if (type === 'hourly') {
      units = Number(total_units);
      if (!units || units < 1) {
        res.status(400).json({ success: false, message: 'Minimum 1 hour required' });
        return;
      }
      const startDt = new Date(start_date);
      const endDt = new Date(startDt.getTime() + units * 60 * 60 * 1000);
      startDateStr = toDateStr(startDt);
      // For multi-day hourly rentals end date may differ; use end date
      endDateStr = toDateStr(endDt) === startDateStr
        ? toDateStr(new Date(startDt.getTime() + 24 * 60 * 60 * 1000)) // next day if same date
        : toDateStr(endDt);
    } else if (type === 'daily') {
      if (!end_date) {
        res.status(400).json({ success: false, message: 'End date required for daily rental' });
        return;
      }
      startDateStr = start_date.split('T')[0];
      endDateStr = end_date.split('T')[0];
      units = Math.ceil((new Date(endDateStr).getTime() - new Date(startDateStr).getTime()) / (24 * 60 * 60 * 1000));
      if (units < 1) {
        res.status(400).json({ success: false, message: 'End date must be after start date' });
        return;
      }
    } else if (type === 'weekly') {
      units = Number(total_units);
      if (!units || units < 1) {
        res.status(400).json({ success: false, message: 'Minimum 1 week required' });
        return;
      }
      startDateStr = start_date.split('T')[0];
      const endDt = new Date(startDateStr);
      endDt.setDate(endDt.getDate() + units * 7);
      endDateStr = toDateStr(endDt);
    } else { // monthly
      units = Number(total_units);
      if (!units || units < 1) {
        res.status(400).json({ success: false, message: 'Minimum 1 month required' });
        return;
      }
      startDateStr = start_date.split('T')[0];
      const endDt = new Date(startDateStr);
      endDt.setMonth(endDt.getMonth() + units);
      endDateStr = toDateStr(endDt);
    }

    const rentalPrice = calculatePrice(product, units, type);
    const depositAmount = Number(product.deposit);
    const totalAmount = rentalPrice + depositAmount;

    const rental = await Rental.create({
      product_id,
      renter_id: req.user!.id,
      owner_id: product.owner_id,
      start_date: startDateStr as any,
      end_date: endDateStr as any,
      rental_type: type,
      total_days: units,
      rental_price: rentalPrice,
      deposit_amount: depositAmount,
      total_amount: totalAmount,
      notes,
    });

    // Notify owner
    await Notification.create({
      user_id: product.owner_id,
      type: 'booking_request',
      title: 'New Booking Request',
      message: `Someone wants to rent your ${product.title}`,
      data: { rental_id: rental.id, product_id },
    });

    res.status(201).json({ success: true, rental });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Booking failed', error });
  }
};

// GET /api/rentals/my-rentals — as renter
export const getMyRentals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const rentals = await Rental.findAll({
      where: { renter_id: req.user!.id },
      include: [
        { model: Product, as: 'product' },
        { model: User, as: 'owner', attributes: ['id', 'name', 'avatar_url', 'phone'] },
      ],
      order: [['created_at', 'DESC']],
    });
    res.json({ success: true, rentals });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch rentals', error });
  }
};

// GET /api/rentals/my-listings — as owner
export const getRentalsForMyListings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const rentals = await Rental.findAll({
      where: { owner_id: req.user!.id },
      include: [
        { model: Product, as: 'product' },
        { model: User, as: 'renter', attributes: ['id', 'name', 'avatar_url', 'phone'] },
      ],
      order: [['created_at', 'DESC']],
    });
    res.json({ success: true, rentals });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed', error });
  }
};

// PUT /api/rentals/:id/approve
export const approveRental = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const rental = await Rental.findByPk(req.params.id);
    if (!rental || rental.owner_id !== req.user!.id) {
      res.status(403).json({ success: false, message: 'Not authorized' });
      return;
    }
    await rental.update({ status: 'approved' });

    await Notification.create({
      user_id: rental.renter_id,
      type: 'booking_approved',
      title: 'Booking Approved!',
      message: 'Your rental request has been approved. Proceed to payment.',
      data: { rental_id: rental.id },
    });

    res.json({ success: true, rental });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed', error });
  }
};

// PUT /api/rentals/:id/cancel
export const cancelRental = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const rental = await Rental.findByPk(req.params.id);
    if (!rental) {
      res.status(404).json({ success: false, message: 'Rental not found' });
      return;
    }
    const isOwner = rental.owner_id === req.user!.id;
    const isRenter = rental.renter_id === req.user!.id;
    if (!isOwner && !isRenter) {
      res.status(403).json({ success: false, message: 'Not authorized' });
      return;
    }

    await rental.update({
      status: 'cancelled',
      cancellation_reason: req.body.reason || 'No reason provided',
    });

    res.json({ success: true, message: 'Rental cancelled', rental });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed', error });
  }
};

// PUT /api/rentals/:id/complete
export const completeRental = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const rental = await Rental.findByPk(req.params.id, {
      include: [{ model: Product, as: 'product' }],
    });
    if (!rental || rental.owner_id !== req.user!.id) {
      res.status(403).json({ success: false, message: 'Not authorized' });
      return;
    }
    await rental.update({ status: 'completed' });
    await Product.increment('rental_count', { where: { id: rental.product_id } });

    await Notification.create({
      user_id: rental.renter_id,
      type: 'rental_completed',
      title: 'Rental Completed',
      message: 'Your rental has been marked as completed. Please leave a review!',
      data: { rental_id: rental.id },
    });

    res.json({ success: true, rental });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed', error });
  }
};
