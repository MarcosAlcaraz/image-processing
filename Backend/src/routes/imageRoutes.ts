import { Router } from 'express';
import { param } from 'express-validator';
import { protect } from '../middleware/authMiddleware';
import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import upload from '../config/multerConfig';
import {
  uploadOriginalImageHandler,
  getUserImagesHandler,
  getImageByIdHandler,
} from '../controllers/imageController';
import { handleValidationErrors } from '../middleware/validationErrorHandler';

const router = Router();

// POST /api/images/upload
router.post(
  '/upload',
  protect,
  (req: Request, res: Response, next: NextFunction) => {
    const multerUpload = upload.single('imageFile');
    multerUpload(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ errors: [{ msg: 'File is too large. Max size is 20MB.' }] });
        }
        return res.status(400).json({ errors: [{ msg: `Multer error: ${err.message}` }] });
      } else if (err) {
        return res.status(400).json({ errors: [{ msg: err.message || 'Error uploading file.' }] });
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
  getUserImagesHandler
);

// GET /api/images/:imageId
const imageIdValidationRules = [
  param('imageId')
    .isMongoId().withMessage('Image ID must be a valid MongoDB ObjectId.'),
];

router.get(
  '/:imageId',
  protect,
  imageIdValidationRules,
  handleValidationErrors,
  getImageByIdHandler
);

export default router;