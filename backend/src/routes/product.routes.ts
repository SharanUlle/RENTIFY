import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyListings,
} from '../controllers/product.controller';
import { protect } from '../middleware/auth';
import { uploadProductImages, processProductImages } from '../middleware/upload';

const router = Router();

router.get('/', getProducts);
router.get('/owner/me', protect, getMyListings);
router.get('/:id', getProductById);
router.post('/', protect, uploadProductImages.array('images', 5), processProductImages, createProduct);
router.put('/:id', protect, uploadProductImages.array('images', 5), processProductImages, updateProduct);
router.delete('/:id', protect, deleteProduct);

export default router;
