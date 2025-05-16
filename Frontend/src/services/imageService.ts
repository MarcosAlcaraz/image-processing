import apiClient from './api';

export interface ImageFileDetails {
  path: string;
  originalName: string;
}

export interface ProcessedImageDetails {
  path: string;
  transformations: string[];
}

export interface ImageUploadResponse {
  message: string;
  metadataId: string;
  userId: string;
  originalImage: ImageFileDetails;
  processedImage: ProcessedImageDetails;
}

export interface ImageMetadata {
  _id: string;
  user: string; // User ID
  originalFileName: string;
  storageFileNameOriginal: string;
  pathOriginal: string;
  mimeTypeOriginal: string;
  sizeOriginalBytes: number;
  storageFileNameProcessed: string;
  pathProcessed: string;
  mimeTypeProcessed?: string;
  sizeProcessedBytes?: number;
  appliedTransformations: Array<{ type: string; details?: string }>;
  createdAt: string; // i'm shure it is a string, but i can change it to Date because mongodb manage it
  updatedAt: string; // Him too
}


export const uploadImage = async (formData: FormData): Promise<ImageUploadResponse> => {
  try {
    const response = await apiClient.post<ImageUploadResponse>('/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  }
};

export const getUserImages = async (): Promise<ImageMetadata[]> => {
  try {
    const response = await apiClient.get<ImageMetadata[]>('/images');
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  }
};

export const getImageDataUrl = (imageId: string | null): string => { // For now i dont use "token: string" to have an image preview
  return `${apiClient.defaults.baseURL}/images/${imageId}`;
};

export const fetchImageAsBlob = async (imageId: string): Promise<Blob> => {
    try {
        const response = await apiClient.get(`/images/${imageId}`, {
            responseType: 'blob',
        });
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            try {
                const errorText = await (error.response.data as Blob).text();
                const errorJson = JSON.parse(errorText);
                throw errorJson;
            } catch (parseError) {
                throw error;
            }
        }
        throw error;
    }
};