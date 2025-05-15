import { Router } from 'express';
import { protect } from '../middleware/authMiddleware'; 
import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import upload from '../config/multerConfig';
import { uploadOriginalImageHandler } from '../controllers/imageController';

const router = Router();

router.post(
  '/upload',
  protect, // Proteger la ruta con JWT
  (req: Request, res: Response, next: NextFunction) => { // Middleware para manejar errores de Multer específicamente
    // 'imageFile' debe coincidir con el name="" del input type="file" en tu frontend
    const multerUpload = upload.single('imageFile');

    multerUpload(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        // Errores específicos de Multer (ej. tamaño de archivo)
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ errors: [{ msg: 'Archivo demasiado grande. Máximo 5MB.' }] });
        }
        // Otros errores de Multer
        return res.status(400).json({ errors: [{ msg: `Error de Multer: ${err.message}` }] });
      } else if (err) {
        // Otros errores (ej. del fileFilter)
        return res.status(400).json({ errors: [{ msg: err.message || 'Error al subir el archivo.' }] });
      }
      // Si no hay errores de Multer, pero req.file podría no estar si fileFilter lo rechazó sin error explícito
      if (!req.file && !err) {
         // Esto puede ocurrir si fileFilter llama a cb(null, false) y no a cb(new Error(...))
         // aunque nuestro fileFilter actual sí pasa un error. Es bueno tenerlo en cuenta.
        return res.status(400).json({ errors: [{ msg: 'No se subió ningún archivo o el tipo de archivo no es válido.' }] });
      }
      next(); // Pasa al siguiente handler (uploadOriginalImageHandler)
    });
  },
  uploadOriginalImageHandler
);

export default router;