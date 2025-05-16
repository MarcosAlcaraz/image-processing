import { Schema, model, Document, Types } from 'mongoose';

interface ITransformation {
  type: string;
  details?: string;
}

export interface IImageMetadata extends Document {
  user: Types.ObjectId; // Is From user id reference
  originalFileName: string; 
  storageFileNameOriginal: string; 
  storageFileNameProcessed: string; 
  pathOriginal: string;
  pathProcessed: string; 
  mimeTypeOriginal: string; 
  sizeOriginalBytes: number; 
  mimeTypeProcessed?: string;
  sizeProcessedBytes?: number;
  appliedTransformations: ITransformation[];
}

const TransformationSchema = new Schema<ITransformation>(
  {
    type: { type: String, required: true },
    details: { type: String },
  },
  { _id: false }
);

const ImageMetadataSchema = new Schema<IImageMetadata>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User', 
      required: [true, 'User ID is a mandatory field'],
      index: true, 
    },
    originalFileName: {
      type: String,
      required: [true, 'Original file name is a mandatory field'],
      trim: true,
    },
    storageFileNameOriginal: {
      type: String,
      required: [true, 'Storage file name is a mandatory field'],
      unique: true,
    },
    storageFileNameProcessed: {
      type: String,
      required: [true, 'Storage file name for processed image is a mandatory field'],
      unique: true,
    },
    pathOriginal: {
      type: String,
      required: [true, 'Path to the original file is mandatory'],
    },
    pathProcessed: {
      type: String,
      required: [true, 'Path to the processed file is mandatory'],
    },
    mimeTypeOriginal: {
      type: String,
      required: [true, 'MIME type of the original file is mandatory'],
    },
    sizeOriginalBytes: {
      type: Number,
      required: [true, 'File size in bytes is mandatory'],
    },
    mimeTypeProcessed: {
      type: String
    },
    sizeProcessedBytes: { 
      type: Number 
    },
    appliedTransformations: {
      type: [TransformationSchema],
      validate: [
        (val: ITransformation[]) => val.length >= 3, // Three transformations are required and set as default here
        'Three transformations are required to apply.',
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const ImageMetadata = model<IImageMetadata>(
  'ImageMetadata',
  ImageMetadataSchema
);

export default ImageMetadata;