import express from "express";
import { uploadMedia, uploadMultipleMedia } from "./media.controller.js";
import { upload } from "../../middleware/multer.middleware.js";
import { isAuthenticated, isAdmin } from "../../middleware/auth.middleware.js";

const router = express.Router();

// Route specifically for uploading article images
router.post("/upload", isAuthenticated, isAdmin, upload.single("file"), uploadMedia);
router.post("/upload-multiple", isAuthenticated, isAdmin, upload.array("files", 10), uploadMultipleMedia);

export default router;
