import { Router } from 'express';
import { protect } from '../middleware/authMiddleware'; 
import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import upload from '../config/multerConfig';
import {
  uploadOriginalImageHandler,
  getUserImagesHandler,
  getImageByIdHandler,
} from '../controllers/imageController';
const router = Router();

router.post(
  '/upload',
  protect,
  (req: Request, res: Response, next: NextFunction) => { 
    const multerUpload = upload.single('imageFile');

    multerUpload(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ errors: [{ msg: 'Max size is 20MB.' }] });
        }
        return res.status(400).json({ errors: [{ msg: `Error from Multer: ${err.message}` }] });
      } else if (err) {
        return res.status(400).json({ errors: [{ msg: err.message || 'Error to upload file.' }] });
      }
      if (!req.file && !err) {
        return res.status(400).json({ errors: [{ msg: 'No file was uploaded or the file type is not valid.' }] });
      }
      next();
    });
  },
  uploadOriginalImageHandler
);

// GET /api/images
router.get(
  '/',
  protect,
  getUserImagesHandler // List user images
);

// GET /api/images/:imageId
router.get(
  '/:imageId',
  protect,
  getImageByIdHandler // Download image by ID
);

export default router;