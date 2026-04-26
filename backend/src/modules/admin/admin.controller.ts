import prisma from "../../prisma";
import { asyncHandler } from "../../utils/asyncHandler";
import { AppError } from "../../utils/AppError";
import { sendResponse } from "../../utils/response";

export const createArticle = asyncHandler(async (req: any, res: any) => {
  const { title, excerpt, content, imageUrl, images, author, published, categoryId, createdAt } = req.body;
  const userId = req.user?.id; // Assuming authentication middleware sets req.user

  if (!title || !content || !categoryId) {
    throw new AppError("Title, content, and categoryId are required", 400);
  }

  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) {
    throw new AppError("Category not found", 404);
  }

  const article = await prisma.article.create({
    data: {
      title,
      excerpt,
      content,
      imageUrl,
      images: Array.isArray(images) ? images : [],
      author,
      published: published ?? false,
      categoryId,
      userId,
      createdAt: createdAt ? new Date(createdAt) : undefined,
    },
  });

  return sendResponse(res, {
    status: 201,
    success: true,
    message: "Article created successfully",
    data: article,
  });
});

export const getArticlesForAdmin = asyncHandler(async (req: any, res: any) => {
  const articles = await prisma.article.findMany({
    include: {
      category: true,
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return sendResponse(res, {
    status: 200,
    success: true,
    message: "Articles retrieved successfully",
    data: articles,
  });
});

export const getArticleForAdmin = asyncHandler(async (req: any, res: any) => {
  const { id } = req.params;

  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      category: true,
      user: { select: { id: true, name: true, email: true } },
    },
  });

  if (!article) {
    throw new AppError("Article not found", 404);
  }

  return sendResponse(res, {
    status: 200,
    success: true,
    message: "Article retrieved successfully",
    data: article,
  });
});

export const updateArticle = asyncHandler(async (req: any, res: any) => {
  const { id } = req.params;
  const { title, excerpt, content, imageUrl, images, author, published, categoryId, createdAt } = req.body;

  const existingArticle = await prisma.article.findUnique({ where: { id } });
  if (!existingArticle) {
    throw new AppError("Article not found", 404);
  }

  if (categoryId) {
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      throw new AppError("Category not found", 404);
    }
  }

  const updatedArticle = await prisma.article.update({
    where: { id },
    data: {
      title,
      excerpt,
      content,
      imageUrl,
      images: Array.isArray(images) ? images : undefined,
      author,
      published,
      categoryId,
      createdAt: createdAt ? new Date(createdAt) : undefined,
    },
  });

  return sendResponse(res, {
    status: 200,
    success: true,
    message: "Article updated successfully",
    data: updatedArticle,
  });
});

export const deleteArticle = asyncHandler(async (req: any, res: any) => {
  const { id } = req.params;

  const existingArticle = await prisma.article.findUnique({ where: { id } });
  if (!existingArticle) {
    throw new AppError("Article not found", 404);
  }

  await prisma.article.delete({ where: { id } });

  return sendResponse(res, {
    status: 200,
    success: true,
    message: "Article deleted successfully",
    data: null,
  });
});

// =======================
// CATEGORY CRUD
// =======================

export const createCategory = asyncHandler(async (req: any, res: any) => {
  const { name, description } = req.body;
  const userId = req.user?.id; // Assuming auth middleware provides req.user

  if (!name) {
    throw new AppError("Category name is required", 400);
  }

  const existingCategory = await prisma.category.findUnique({ where: { name } });
  if (existingCategory) {
    throw new AppError("Category with this name already exists", 400);
  }

  const category = await prisma.category.create({
    data: {
      name,
      description,
      userId,
    },
  });

  return sendResponse(res, {
    status: 201,
    success: true,
    message: "Category created successfully",
    data: category,
  });
});

export const getCategories = asyncHandler(async (req: any, res: any) => {
  const categories = await prisma.category.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      _count: { select: { articles: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return sendResponse(res, {
    status: 200,
    success: true,
    message: "Categories retrieved successfully",
    data: categories,
  });
});

export const updateCategory = asyncHandler(async (req: any, res: any) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const existingCategory = await prisma.category.findUnique({ where: { id } });
  if (!existingCategory) {
    throw new AppError("Category not found", 404);
  }

  if (name && name !== existingCategory.name) {
    const nameExists = await prisma.category.findUnique({ where: { name } });
    if (nameExists) {
      throw new AppError("Another category with this name already exists", 400);
    }
  }

  const updatedCategory = await prisma.category.update({
    where: { id },
    data: {
      name,
      description,
    },
  });

  return sendResponse(res, {
    status: 200,
    success: true,
    message: "Category updated successfully",
    data: updatedCategory,
  });
});

export const deleteCategory = asyncHandler(async (req: any, res: any) => {
  const { id } = req.params;

  const existingCategory = await prisma.category.findUnique({ 
    where: { id },
    include: { _count: { select: { articles: true } } }
  });

  if (!existingCategory) {
    throw new AppError("Category not found", 404);
  }

  if (existingCategory._count.articles > 0) {
    throw new AppError("Cannot delete category with existing articles. Delete the articles first.", 400);
  }

  await prisma.category.delete({ where: { id } });

  return sendResponse(res, {
    status: 200,
    success: true,
    message: "Category deleted successfully",
    data: null,
  });
});

export const bulkCreateArticles = asyncHandler(async (req: any, res: any) => {
  const { articles } = req.body;
  const userId = req.user?.id;

  if (!Array.isArray(articles) || articles.length === 0) {
    throw new AppError("Payload must be a non-empty array of articles", 400);
  }

  // Pre-process data to include userId
  const dataToInsert = articles.map((art: any) => ({
    ...art,
    userId,
    published: art.published ?? false,
  }));

  const result = await prisma.article.createMany({
    data: dataToInsert,
  });

  return sendResponse(res, {
    status: 201,
    success: true,
    message: `${result.count} articles created successfully`,
    data: result,
  });
});

export const bulkCreateCategories = asyncHandler(async (req: any, res: any) => {
  const { categories, names } = req.body;
  const userId = req.user?.id;

  let categoriesToCreate: any[] = [];

  if (names && typeof names === "string") {
    // Handle comma-separated string
    const nameList = names.split(",").map(name => name.trim()).filter(name => name.length > 0);
    categoriesToCreate = nameList.map(name => ({
      name,
      userId,
    }));
  } else if (Array.isArray(categories)) {
    // Handle array of objects
    categoriesToCreate = categories.map((cat: any) => ({
      ...cat,
      userId,
    }));
  }

  if (categoriesToCreate.length === 0) {
    throw new AppError("No categories provided to create", 400);
  }

  // Filter out existing categories to avoid unique constraint violations
  const existingCategories = await prisma.category.findMany({
    where: {
      name: { in: categoriesToCreate.map(c => c.name) }
    },
    select: { name: true }
  });

  const existingNames = new Set(existingCategories.map(c => c.name));
  const uniqueCategoriesToCreate = categoriesToCreate.filter(c => !existingNames.has(c.name));

  if (uniqueCategoriesToCreate.length === 0) {
    return sendResponse(res, {
      status: 200,
      success: true,
      message: "All categories already exist",
      data: { count: 0 },
    });
  }

  const result = await prisma.category.createMany({
    data: uniqueCategoriesToCreate,
  });

  return sendResponse(res, {
    status: 201,
    success: true,
    message: `${result.count} categories created successfully`,
    data: result,
  });
});

// =======================
// LISTICLE CRUD
// =======================

export const createListicle = asyncHandler(async (req: any, res: any) => {
  const { title, intro, coverUrl, items, published, createdAt } = req.body;
  const userId = req.user?.id;

  if (!title || !items || !Array.isArray(items)) {
    throw new AppError("Title and items (array) are required", 400);
  }

  const listicle = await (prisma as any).listicle.create({
    data: {
      title,
      intro,
      coverUrl,
      items,
      published: published ?? false,
      userId,
      createdAt: createdAt ? new Date(createdAt) : undefined,
    },
  });

  return sendResponse(res, {
    status: 201,
    success: true,
    message: "Listicle created successfully",
    data: listicle,
  });
});

export const getListiclesForAdmin = asyncHandler(async (req: any, res: any) => {
  const listicles = await (prisma as any).listicle.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return sendResponse(res, {
    status: 200,
    success: true,
    message: "Listicles retrieved successfully",
    data: listicles,
  });
});

export const getListicleForAdmin = asyncHandler(async (req: any, res: any) => {
  const { id } = req.params;

  const listicle = await (prisma as any).listicle.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });

  if (!listicle) {
    throw new AppError("Listicle not found", 404);
  }

  return sendResponse(res, {
    status: 200,
    success: true,
    message: "Listicle retrieved successfully",
    data: listicle,
  });
});

export const updateListicle = asyncHandler(async (req: any, res: any) => {
  const { id } = req.params;
  const { title, intro, coverUrl, items, published, createdAt } = req.body;

  const existing = await (prisma as any).listicle.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError("Listicle not found", 404);
  }

  const updated = await (prisma as any).listicle.update({
    where: { id },
    data: {
      title,
      intro,
      coverUrl,
      items,
      published,
      createdAt: createdAt ? new Date(createdAt) : undefined,
    },
  });

  return sendResponse(res, {
    status: 200,
    success: true,
    message: "Listicle updated successfully",
    data: updated,
  });
});

export const deleteListicle = asyncHandler(async (req: any, res: any) => {
  const { id } = req.params;

  const existing = await (prisma as any).listicle.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError("Listicle not found", 404);
  }

  await (prisma as any).listicle.delete({ where: { id } });

  return sendResponse(res, {
    status: 200,
    success: true,
    message: "Listicle deleted successfully",
    data: null,
  });
});



