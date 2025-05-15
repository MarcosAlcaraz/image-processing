import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import path from 'path';
import fs from 'fs';
import ImageMetadata from '../models/ImageMetadata';
import mongoose from 'mongoose';

import Jimp from 'jimp';

const PROCESSED_IMAGES_DIR = path.join(__dirname, '../../public/uploads/processed');

if (!fs.existsSync(PROCESSED_IMAGES_DIR)) {
  fs.mkdirSync(PROCESSED_IMAGES_DIR, { recursive: true });
}

export const uploadOriginalImageHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ errors: [{ msg: 'No file was uploaded or the file type is not valid.' }] });
      return;
    }

    // Only if validation middleware doesn't work
    const userId = req.user?.id;
    if (!userId) { 
        res.status(401).json({ errors: [{ msg: 'Usuario not authenticated.' }] });
        return;
    }

    const originalImageDetails = {
      originalFileName: req.file.originalname,
      storageFileNameOriginal: req.file.filename,
      pathOriginal: req.file.path,
      mimeTypeOriginal: req.file.mimetype,
      sizeOriginalBytes: req.file.size,
    };

    const transformationsAppliedStrings: string[] = [];
    const processedImageFileName = `processed-${originalImageDetails.storageFileNameOriginal}`;
    const processedImageFullPath = path.join(PROCESSED_IMAGES_DIR, processedImageFileName);

    const image = await Jimp.read(originalImageDetails.pathOriginal);

    // Six transformations applied to the image
    image.resize(800, Jimp.AUTO);
    transformationsAppliedStrings.push('resized_to_800px_width');

    image.greyscale();
    transformationsAppliedStrings.push('greyscale');

    image.sepia();
    transformationsAppliedStrings.push('sepia_filter');

    image.rotate(90);
    transformationsAppliedStrings.push('rotated_90_deg');

    image.quality(80);
    transformationsAppliedStrings.push('quality_80');

    image.crop(10, 10, 200, 200);
    transformationsAppliedStrings.push('cropped_200x200_at_10,10');

    await image.writeAsync(processedImageFullPath);

    const appliedTransformationsForDB = transformationsAppliedStrings.map(desc => ({ type: desc, details: desc }));

    const newImageMetadata = new ImageMetadata({
      user: userId,
      originalFileName: originalImageDetails.originalFileName,
      storageFileNameOriginal: originalImageDetails.storageFileNameOriginal,
      pathOriginal: originalImageDetails.pathOriginal, 
      mimeTypeOriginal: originalImageDetails.mimeTypeOriginal,
      sizeOriginalBytes: originalImageDetails.sizeOriginalBytes,
      storageFileNameProcessed: processedImageFileName,
      pathProcessed: processedImageFullPath,
      appliedTransformations: appliedTransformationsForDB, 
    });

    await newImageMetadata.save();

    res.status(201).json({
      message: 'File uploaded, processed, and metadata saved successfully.',
      metadataId: newImageMetadata._id,
      userId,
      originalImage: {
        path: originalImageDetails.pathOriginal,
        originalName: originalImageDetails.originalFileName,
      },
      processedImage: {
        path: processedImageFullPath,
        transformations: transformationsAppliedStrings,
      },
    });

  } catch (error) {
    console.error('Error in uploadOriginalImageHandler (including processing):', error);
    next(error);
  }
};

export const getUserImagesHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ errors: [{ msg: 'User is not authenticated.' }] });
      return;
    }

    const images = await ImageMetadata.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json(images);

  } catch (error) {
    console.error('Error in getUserImagesHandler:', error);
    next(error);
  }
};

export const getImageByIdHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { imageId } = req.params;

    if (!userId) {
      res.status(401).json({ errors: [{ msg: 'User is not authenticated.' }] });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(imageId)) {
      res.status(400).json({ errors: [{ msg: 'Image ID is not valid.' }] });
      return;
    }

    const imageRecord = await ImageMetadata.findOne({ _id: imageId, user: userId });

    if (!imageRecord) {
      res.status(404).json({ errors: [{ msg: 'Image not found or does not belong to the user.' }] });
      return;
    }

    const imagePath = imageRecord.pathProcessed;
    const mimeType = imageRecord.mimeTypeProcessed || imageRecord.mimeTypeOriginal;

    if (!fs.existsSync(imagePath)) {
        console.error(`Error: File not found on disk: ${imagePath}`);
        res.status(404).json({ errors: [{ msg: 'Image file not found on server.' }]});
        return;
    }

    res.contentType(mimeType || 'image/jpeg');
    res.sendFile(imagePath);

  } catch (error) {
    console.error('Error in getImageByIdHandler:', error);
    if ((error as any).kind === 'ObjectId') {
        res.status(400).json({ errors: [{ msg: 'Invalid ID image format.' }] });
        return;
    }
    next(error);
  }
};