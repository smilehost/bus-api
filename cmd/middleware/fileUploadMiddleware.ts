import multer from 'multer';
import { Request } from 'express';

// Configure storage
const storage = multer.memoryStorage();

// Create multer instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
      cb(null, false);
      return;
    }
    cb(null, true);
  }
});

// Middleware for single file upload
export const uploadSlipImage = upload.single('slipImage');
