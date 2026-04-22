import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User';

const signToken = (id: string, email: string, role: string): string =>
  jwt.sign({ id, email, role }, process.env.JWT_SECRET as string, {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any,
  });

// POST /api/auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      res.status(400).json({ success: false, message: 'Email already registered' });
      return;
    }

    const user = await User.create({ name, email, password, phone });
    const token = signToken(user.id, user.email, user.role);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed', error });
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const token = signToken(user.id, user.email, user.role);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed', error });
  }
};

// GET /api/auth/me
export const getMe = async (req: Request & { user?: any }, res: Response): Promise<void> => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'reset_token', 'reset_token_expiry'] },
    });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not fetch profile', error });
  }
};

// POST /api/auth/forgot-password
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      // Avoid leaking whether email exists
      res.json({ success: true, message: 'If the email exists, a reset link was sent' });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await user.update({ reset_token: resetToken, reset_token_expiry: expiry });

    // TODO: send email with resetToken using mail.service.ts
    console.log('Reset token (dev only):', resetToken);

    res.json({ success: true, message: 'If the email exists, a reset link was sent' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed', error });
  }
};

// POST /api/auth/reset-password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({ where: { reset_token: token } });

    if (!user || !user.reset_token_expiry || user.reset_token_expiry < new Date()) {
      res.status(400).json({ success: false, message: 'Token invalid or expired' });
      return;
    }

    await user.update({ password: newPassword, reset_token: undefined, reset_token_expiry: undefined });

    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Reset failed', error });
  }
};

// PUT /api/auth/profile — update name, phone, avatar
export const updateProfile = async (req: Request & { user?: any }, res: Response): Promise<void> => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) { res.status(404).json({ success: false, message: 'User not found' }); return; }

    const { name, phone } = req.body;
    const avatar_url = (req as any).uploadedAvatar || user.avatar_url;

    await user.update({
      ...(name ? { name } : {}),
      ...(phone !== undefined ? { phone } : {}),
      avatar_url,
    });

    res.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar_url: user.avatar_url, phone: user.phone },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Update failed', error });
  }
};

// PUT /api/auth/change-password
export const changePassword = async (req: Request & { user?: any }, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) { res.status(404).json({ success: false, message: 'User not found' }); return; }

    if (!(await user.comparePassword(currentPassword))) {
      res.status(400).json({ success: false, message: 'Current password is incorrect' });
      return;
    }
    if (newPassword.length < 6) {
      res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
      return;
    }

    await user.update({ password: newPassword });
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Change password failed', error });
  }
};
