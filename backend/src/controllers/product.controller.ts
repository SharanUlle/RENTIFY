import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Product from '../models/Product';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

// GET /api/products — list with optional filters
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      category,
      city,
      min_price,
      max_price,
      condition,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const where: any = { is_available: true };

    if (category) where.category = category;
    if (city) where.city = { [Op.iLike]: `%${city}%` };
    if (condition) where.condition = condition;
    if (min_price || max_price) {
      where.daily_rate = {
        ...(min_price ? { [Op.gte]: Number(min_price) } : {}),
        ...(max_price ? { [Op.lte]: Number(max_price) } : {}),
      };
    }
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { brand: { [Op.iLike]: `%${search}%` } },
        { model_name: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const offset = (Number(page) - 1) * Number(limit);
    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'avatar_url'] }],
      order: [['created_at', 'DESC']],
      limit: Number(limit),
      offset,
    });

    res.json({
      success: true,
      total: count,
      page: Number(page),
      pages: Math.ceil(count / Number(limit)),
      products: rows,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch products', error });
  }
};

// GET /api/products/:id
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'avatar_url', 'phone'] }],
    });
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching product', error });
  }
};

// POST /api/products — create listing
export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const images: string[] = (req as any).uploadedImages || [];

    const product = await Product.create({
      ...req.body,
      owner_id: req.user!.id,
      images,
      daily_rate: parseFloat(req.body.daily_rate),
      weekly_rate: req.body.weekly_rate ? parseFloat(req.body.weekly_rate) : undefined,
      monthly_rate: req.body.monthly_rate ? parseFloat(req.body.monthly_rate) : undefined,
      deposit: parseFloat(req.body.deposit),
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create listing', error });
  }
};

// PUT /api/products/:id
export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    if (product.owner_id !== req.user!.id) {
      res.status(403).json({ success: false, message: 'Not authorized' });
      return;
    }

    const newImages: string[] = (req as any).uploadedImages || [];
    // existing_images sent by frontend as URLs to keep; new uploaded images are appended
    const existingKept: string[] = req.body.existing_images
      ? (Array.isArray(req.body.existing_images) ? req.body.existing_images : [req.body.existing_images])
      : product.images || [];
    const images = [...existingKept, ...newImages];
    // Remove images field from body to avoid overwrite conflict
    const { existing_images, images: _imgs, ...rest } = req.body;

    await product.update({ ...rest, images });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Update failed', error });
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    if (product.owner_id !== req.user!.id) {
      res.status(403).json({ success: false, message: 'Not authorized' });
      return;
    }
    await product.destroy();
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Delete failed', error });
  }
};

// GET /api/products/owner/me
export const getMyListings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const products = await Product.findAll({
      where: { owner_id: req.user!.id },
      order: [['created_at', 'DESC']],
    });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch listings', error });
  }
};
