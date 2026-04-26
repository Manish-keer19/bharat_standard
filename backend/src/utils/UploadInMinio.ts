import fs from "fs";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { minioClient, BUCKET_NAME } from "../config/minio.js";

export async function uploadFileToMinio(
  localFilePath: string,
  objectKey: string,
  contentType: string,
) {
  try {
    // Read the file into a buffer
    const fileBuffer = fs.readFileSync(localFilePath);
    const fileSize = fs.statSync(localFilePath).size;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: objectKey,
      Body: fileBuffer,
      ContentType: contentType,
      ContentLength: fileSize,
    });

    const response = await minioClient.send(command);
    console.log(`✅ Uploaded to MinIO: ${objectKey}`);

    // Return the public URL (Note: logic might vary depending on MinIO public access settings)
    const url = `${process.env.MINIO_ENDPOINT}/${BUCKET_NAME}/${objectKey}`;
    return { response, url };
  } catch (error) {
    console.error("MinIO Upload Error:", error);
    throw error;
  }
}
