import cloudinary from './cloudinary.js';
import { UploadApiResponse, UploadApiOptions } from 'cloudinary';

export const uploadFileToCloudinary = async (
  filePath: string,
  folder: string,
  height?: number,
  quality?: string | number,
  originalName?: string
): Promise<UploadApiResponse> => {
  try {
    const options: UploadApiOptions = { folder, resource_type: 'auto' };

    if (height) options.height = height;
    if (quality) options.quality = quality;

    // Optional: Validate PDF file type if originalName is provided
    if (originalName && originalName.endsWith('.pdf')) {
       options.resource_type = 'raw';
    }

    const result = await cloudinary.uploader.upload(filePath, options);
    return result;
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    throw error;
  }
};
