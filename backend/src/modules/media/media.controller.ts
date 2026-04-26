import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { sendResponse } from "../../utils/response.js";
import { MediaService } from "../../utils/MediaService.js";

// Uploads an image, returns URL
export const uploadMedia = asyncHandler(async (req: any, res: any) => {
  if (!req.file) {
    throw new AppError("No file provided", 400);
  }

  // Upload file via our MediaService (which handles Cloudinary)
  const result = await MediaService.uploadFile(req.file, "articles");

  return sendResponse(res, {
    status: 200,
    success: true,
    message: "Media uploaded successfully",
    data: {
      url: result.url,
      mediaType: result.mediaType
    },
  });
});

export const uploadMultipleMedia = asyncHandler(async (req: any, res: any) => {
  if (!req.files || req.files.length === 0) {
    throw new AppError("No files provided", 400);
  }

  const results = await Promise.all(
    req.files.map((file: any) => MediaService.uploadFile(file, "articles"))
  );

  return sendResponse(res, {
    status: 200,
    success: true,
    message: `${results.length} media files uploaded successfully`,
    data: results.map(r => ({ url: r.url, mediaType: r.mediaType })),
  });
});
