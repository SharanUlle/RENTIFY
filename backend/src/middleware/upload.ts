import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';

// Ensure upload directories exist
const UPLOADS_DIR = path.join(__dirname, '../../uploads');
const PRODUCTS_DIR = path.join(UPLOADS_DIR, 'products');
const AVATARS_DIR = path.join(UPLOADS_DIR, 'avatars');
[PRODUCTS_DIR, AVATARS_DIR].forEach(d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });

// Disk storage — saves files locally under /uploads
const productStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, PRODUCTS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `product-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const avatarStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, AVATARS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${Date.now()}${ext}`);
  },
});

const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpg, png, webp)'));
  }
};

export const uploadProductImages = multer({
  storage: productStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
});

export const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
});

// Attach public URLs to req.uploadedImages after multer saves files
export const processProductImages = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.files && (req.files as Express.Multer.File[]).length) {
    const files = req.files as Express.Multer.File[];
    (req as any).uploadedImages = files.map(
      f => `http://localhost:${process.env.PORT || 8000}/uploads/products/${f.filename}`
    );
  }
  next();
};

export const processAvatar = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.file) {
    (req as any).uploadedAvatar = `http://localhost:${process.env.PORT || 8000}/uploads/avatars/${req.file.filename}`;
  }
  next();
};
