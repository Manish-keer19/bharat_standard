import express from "express";
import { 
  getPublicArticles, 
  getPublicCategories, 
  getPublicArticleById,
  getPublicListicles,
  getPublicListicleById
} from "./public.controller.js";

const router = express.Router();

router.get("/articles", getPublicArticles);
router.get("/articles/:id", getPublicArticleById);
router.get("/categories", getPublicCategories);
router.get("/listicles", getPublicListicles);
router.get("/listicles/:id", getPublicListicleById);

export default router;
