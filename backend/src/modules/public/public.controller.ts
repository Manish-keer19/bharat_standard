import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendResponse } from "../../utils/response.js";
import prisma from "../../prisma.js";

export const getPublicArticles = asyncHandler(async (req: any, res: any) => {
  const { category } = req.query;

  const where: any = {
    published: true,
  };

  if (category) {
    where.category = {
      name: {
        equals: category,
        mode: 'insensitive',
      },
    };
  }

  const articles = await prisma.article.findMany({
    where,
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return sendResponse(res, {
    status: 200,
    success: true,
    message: "Public articles fetched properly",
    data: articles,
  });
});

export const getPublicCategories = asyncHandler(async (req: any, res: any) => {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc"
    }
  });

  return sendResponse(res, {
    status: 200,
    success: true,
    message: "Public categories fetched properly",
    data: categories,
  });
});

export const getPublicArticleById = asyncHandler(async (req: any, res: any) => {
  const { id } = req.params;

  const article = await prisma.article.findUnique({
    where: {
      id,
      published: true
    },
    include: {
      category: true,
      
    }
  });

  if (!article) {
    return sendResponse(res, {
      status: 404,
      success: false,
      message: "Article not found",
    });
  }

  return sendResponse(res, {
    status: 200,
    success: true,
    message: "Article fetched properly",
    data: article,
  });
});

export const getPublicListicles = asyncHandler(async (req: any, res: any) => {
  const listicles = await (prisma as any).listicle.findMany({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return sendResponse(res, {
    status: 200,
    success: true,
    message: "Public listicles fetched properly",
    data: listicles,
  });
});

export const getPublicListicleById = asyncHandler(async (req: any, res: any) => {
  const { id } = req.params;

  const listicle = await (prisma as any).listicle.findUnique({
    where: {
      id,
      published: true
    }
  });

  if (!listicle) {
    return sendResponse(res, {
      status: 404,
      success: false,
      message: "Listicle not found",
    });
  }

  return sendResponse(res, {
    status: 200,
    success: true,
    message: "Listicle fetched properly",
    data: listicle,
  });
});

