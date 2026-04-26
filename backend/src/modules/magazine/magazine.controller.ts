import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getMagazine = async (req: Request, res: Response) => {
  try {
    const cover = await prisma.magazineCover.findFirst({
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: cover });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching cover" });
  }
};

export const updateMagazine = async (req: Request, res: Response) => {
  const { imageUrl } = req.body;
  const userId = (req as any).user?.id;

  if (!imageUrl || !userId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const existing = await prisma.magazineCover.findFirst();

    let cover;
    if (existing) {
      cover = await prisma.magazineCover.update({
        where: { id: existing.id },
        data: { imageUrl, userId },
      });
    } else {
      cover = await prisma.magazineCover.create({
        data: { imageUrl, userId },
      });
    }
    res.json({ success: true, data: cover });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating cover" });
  }
};
