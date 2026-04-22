import { Router } from 'express';
import { register, login, getMe, forgotPassword, resetPassword, updateProfile, changePassword } from '../controllers/auth.controller';
import { protect } from '../middleware/auth';
import { uploadAvatar, processAvatar } from '../middleware/upload';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, uploadAvatar.single('avatar'), processAvatar, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
