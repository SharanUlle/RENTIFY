import { Router } from 'express';
import {
  createRental,
  getMyRentals,
  getRentalsForMyListings,
  approveRental,
  cancelRental,
  completeRental,
} from '../controllers/rental.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect); // all rental routes require auth

router.post('/', createRental);
router.get('/my-rentals', getMyRentals);
router.get('/my-listings', getRentalsForMyListings);
router.put('/:id/approve', approveRental);
router.put('/:id/cancel', cancelRental);
router.put('/:id/complete', completeRental);

export default router;
