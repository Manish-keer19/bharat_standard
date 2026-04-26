import express from "express";
import { isAuthenticated, isAdmin } from "../../middleware/auth.middleware.js";
import { getMagazine, updateMagazine } from "./magazine.controller";

const router = express.Router();

// Publicly accessible for the frontend
router.get("/", getMagazine);

// Admin only for updates
router.put("/", isAuthenticated, isAdmin, updateMagazine);

export default router;
