import express from "express";
import { isAuthenticated, isAdmin } from "../../middleware/auth.middleware.js";
import {
  createArticle,
  getArticlesForAdmin,
  getArticleForAdmin,
  updateArticle,
  deleteArticle,
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  bulkCreateArticles,
  bulkCreateCategories,
  createListicle,
  getListiclesForAdmin,
  getListicleForAdmin,
  updateListicle,
  deleteListicle
} from "./admin.controller.js";

const router = express.Router();

// Apply auth and admin middleware to all routes in this file
router.use(isAuthenticated, isAdmin);

// Article routes
router.post("/articles", createArticle);
router.get("/articles", getArticlesForAdmin);
router.get("/articles/:id", getArticleForAdmin);
router.put("/articles/:id", updateArticle);
router.delete("/articles/:id", deleteArticle);
router.post("/articles/bulk", bulkCreateArticles);

// Category routes
router.post("/categories", createCategory);
router.get("/categories", getCategories);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);
router.post("/categories/bulk", bulkCreateCategories);

// Listicle routes
router.post("/listicles", createListicle);
router.get("/listicles", getListiclesForAdmin);
router.get("/listicles/:id", getListicleForAdmin);
router.put("/listicles/:id", updateListicle);
router.delete("/listicles/:id", deleteListicle);

export default router;
