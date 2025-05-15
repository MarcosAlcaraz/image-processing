import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const uploadOriginalImageHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ errors: [{ msg: 'Upload a valid file.' }] });
      return;
    }

    const { filename, path: filePath, mimetype, size, originalname } = req.file;
    const userId = req.user?.id;

    // Aquí es donde, en pasos futuros (Paso 5 y 6), harías:
    // 1. Procesamiento de la imagen (crear versiones transformadas).
    // 2. Guardar los metadatos en MongoDB (incluyendo userId, paths, originalname, etc.).

    res.status(201).json({
      message: 'File uploaded and saved successfully (The original one).',
      fileInfo: {
        userId,
        originalName: originalname,
        fileNameOnStorage: filename,
        path: filePath,
        mimeType: mimetype,
        sizeInBytes: size,
      },
    });
  } catch (error) {
    console.error('Error in uploadOriginalImageHandler:', error);
    next(error); // Pass the error to the GLOBAL error handler
  }
};