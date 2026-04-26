import prisma from "../../prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { asyncHandler } from "../../utils/asyncHandler";
import { AppError } from "../../utils/AppError";
import { sendResponse } from "../../utils/response";

dotenv.config();

const generateAuthToken = (user: any) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
    },
    (process.env.JWT_SECRET as string) || "manish",
  );
};

export const registerAdmin = asyncHandler(async (req: any, res: any) => {
  const { email, password, name } = req.body;

  console.log("req.body is ", req.body);

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError("Email already in use", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: "ADMIN",
    },
  });

  const token = generateAuthToken(admin);

  return sendResponse(res, {
    status: 201,
    success: true,
    message: "Admin registered successfully",
    data: { user: admin, token },
  });
});

export const login = asyncHandler(async (req: any, res: any) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateAuthToken(user);

  return sendResponse(res, {
    status: 200,
    success: true,
    message: "Logged in successfully",
    data: { user, token },
  });
});
