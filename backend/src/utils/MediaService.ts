import fs from "fs";
import { uploadFileToCloudinary } from "../config/imageUploader.js";
import { uploadFileToMinio } from "./UploadInMinio.js";
import { BUCKET_NAME } from "../config/minio.js";

export type StorageProvider = "minio" | "cloudinary";

export interface UploadResult {
  url: string;
  mediaType: "PHOTO" | "VIDEO" | "AUDIO";
  provider: StorageProvider;
}

export class MediaService {
  private static defaultProvider: StorageProvider =
    (process.env.STORAGE_PROVIDER as StorageProvider) || "cloudinary";

  /**
   * Upload a file to the specified storage provider (defaults to environment config or MinIO).
   *
   * @param file The Multer file object or any object containing path, originalname, and mimetype.
   * @param folder Destination folder/prefix for the file.
   * @param provider Explicitly choose "minio" or "cloudinary".
   * @returns Promise containing URL, media type, and provider used.
   */
  static async uploadFile(
    file: any,
    folder: string = "articles",
    provider?: StorageProvider,
  ): Promise<UploadResult> {
    const storageType: StorageProvider = provider || this.defaultProvider;

    // Ensure the folder is always within 'survey'
    const targetFolder = folder.startsWith("articles")
      ? folder
      : `articles/${folder}`;
    let resultUrl: string;
    let mediaType: "PHOTO" | "VIDEO" | "AUDIO";

    // Standardize file access - handles single file or array of files from fields()
    const targetFile = Array.isArray(file) ? file[0] : file;

    if (!targetFile || !targetFile.path) {
      throw new Error(
        "Invalid file object provided to MediaService. File must have a 'path' property.",
      );
    }

    try {
      if (storageType === "minio") {
        const objectKey = `${targetFolder}/${Date.now()}-${targetFile.originalname.replace(/\s/g, "_")}`;
        await uploadFileToMinio(
          targetFile.path,
          objectKey,
          targetFile.mimetype,
        );

        resultUrl = `${process.env.MINIO_ENDPOINT}/${BUCKET_NAME}/${objectKey}`;
        mediaType = this.getMediaType(targetFile.mimetype);
      } else {
        const cloudinaryResult = await uploadFileToCloudinary(
          targetFile.path,
          targetFolder,
        );
        resultUrl = cloudinaryResult.secure_url;
        mediaType = this.getCloudinaryMediaType(cloudinaryResult.resource_type);
      }

      // Cleanup local file
      this.cleanupFile(targetFile.path);

      return {
        url: resultUrl,
        mediaType,
        provider: storageType,
      };
    } catch (error) {
      this.cleanupFile(targetFile.path);
      throw error;
    }
  }

  private static getMediaType(mimetype: string): "PHOTO" | "VIDEO" | "AUDIO" {
    if (mimetype.startsWith("video")) return "VIDEO";
    if (mimetype.startsWith("audio")) return "AUDIO";
    return "PHOTO";
  }

  private static getCloudinaryMediaType(
    resourceType: string,
  ): "PHOTO" | "VIDEO" | "AUDIO" {
    if (resourceType === "video") return "VIDEO";
    if (resourceType === "image") return "PHOTO";
    return "AUDIO";
  }

  private static cleanupFile(filePath: string) {
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error(`Failed to delete local file: ${filePath}`, err);
      }
    }
  }
}
