import { Request, Response } from 'express';
import Review from '../models/Review';
import Rental from '../models/Rental';
import Product from '../models/Product';
import User from '../models/User';
import sequelize from '../config/database';

interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

// POST /api/reviews
export const createReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { rental_id, rating, comment, review_type } = req.body;

    const rental = await Rental.findByPk(rental_id);
    if (!rental || rental.status !== 'completed') {
      res.status(400).json({ success: false, message: 'Can only review completed rentals' });
      return;
    }
    if (rental.renter_id !== req.user!.id && rental.owner_id !== req.user!.id) {
      res.status(403).json({ success: false, message: 'Not authorized' });
      return;
    }

    // Prevent duplicate reviews
    const existing = await Review.findOne({
      where: { rental_id, reviewer_id: req.user!.id, review_type },
    });
    if (existing) {
      res.status(400).json({ success: false, message: 'You have already reviewed this' });
      return;
    }

    const reviewee_id = review_type === 'renter' ? rental.renter_id : rental.owner_id;

    const review = await Review.create({
      rental_id,
      product_id: rental.product_id,
      reviewer_id: req.user!.id,
      reviewee_id,
      rating,
      comment,
      review_type,
    });

    // Update product average rating
    if (review_type === 'product') {
      const result = await Review.findAll({
        where: { product_id: rental.product_id, review_type: 'product' },
        attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'avg_rating']],
        raw: true,
      }) as any[];

      const avgRating = parseFloat(result[0]?.avg_rating || '0');
      await Product.update({ average_rating: avgRating }, { where: { id: rental.product_id } });
    }

    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create review', error });
  }
};

// GET /api/reviews/product/:id
export const getProductReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await Review.findAll({
      where: { product_id: req.params.id, review_type: 'product' },
      include: [{ model: User, as: 'reviewer', attributes: ['id', 'name', 'avatar_url'] }],
      order: [['created_at', 'DESC']],
    });
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed', error });
  }
};

// GET /api/reviews/user/:id
export const getUserReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await Review.findAll({
      where: { reviewee_id: req.params.id },
      include: [{ model: User, as: 'reviewer', attributes: ['id', 'name', 'avatar_url'] }],
      order: [['created_at', 'DESC']],
    });
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed', error });
  }
};
