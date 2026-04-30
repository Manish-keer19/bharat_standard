import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendResponse } from "../../utils/response.js";
import prisma from "../../prisma.js";

export const getPublicArticles = asyncHandler(async (req: any, res: any) => {
  const { category, page = 1, limit = 100, search } = req.query;
  
  const pageNumber = parseInt(page as string, 10) || 1;
  const limitNumber = parseInt(limit as string, 10) || 100;
  const skip = (pageNumber - 1) * limitNumber;

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

  if (search) {
    where.OR = [
      { title: { contains: search as string, mode: 'insensitive' } },
      { excerpt: { contains: search as string, mode: 'insensitive' } },
      { content: { contains: search as string, mode: 'insensitive' } },
    ];
  }

  const [articles, totalCount] = await Promise.all([
    prisma.article.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc"
      },
      skip,
      take: limitNumber,
    }),
    prisma.article.count({ where })
  ]);

  return sendResponse(res, {
    status: 200,
    success: true,
    message: "Public articles fetched properly",
    data: articles,
    meta: {
      page: pageNumber,
      limit: limitNumber,
      totalCount,
      totalPages: Math.ceil(totalCount / limitNumber)
    }
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
  const { page = 1, limit = 100 } = req.query;
  
  const pageNumber = parseInt(page as string, 10) || 1;
  const limitNumber = parseInt(limit as string, 10) || 100;
  const skip = (pageNumber - 1) * limitNumber;

  const where = { published: true };

  const [listicles, totalCount] = await Promise.all([
    (prisma as any).listicle.findMany({
      where,
      orderBy: {
        createdAt: "desc"
      },
      skip,
      take: limitNumber,
    }),
    (prisma as any).listicle.count({ where })
  ]);

  return sendResponse(res, {
    status: 200,
    success: true,
    message: "Public listicles fetched properly",
    data: listicles,
    meta: {
      page: pageNumber,
      limit: limitNumber,
      totalCount,
      totalPages: Math.ceil(totalCount / limitNumber)
    }
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

