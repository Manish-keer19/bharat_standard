import express from "express";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

import cors from "cors";

import prisma from "./prisma.js";
import authRoute from "./modules/auth/auth.route.js";
import adminRoute from "./modules/admin/admin.route.js";
import mediaRoute from "./modules/media/media.route.js";
import publicRoute from "./modules/public/public.route.js";
import magazineRoute from "./modules/magazine/magazine.route.js";
import { AppError } from "./utils/AppError.js";
import rateLimit from "express-rate-limit";
import { errorMiddleware } from "./middleware/error.middleware.js";

export const app = express();
app.use(express.json());

// Define CORS options
const corsOptions = {
  origin: "*",
  methods: "GET, POST, PUT, DELETE",
  allowedHeaders: "Content-Type, Authorization",
  credentials: true,
};

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 150, // max 50 requests

  handler: (req, res, next) => {
    next(new AppError("Too many requests, please try again later", 429));
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authlimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 min
  max: 20, // only 20 login attempts
  handler: (req, res, next) => {
    next(new AppError("Too many login attempts, try after 5 minutes", 429));
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.set("trust proxy", 1);
app.use(cors(corsOptions));

app.use((req, res, next) => {
  console.log("IP Address", req.ip);
  next();
});

app.use("/api/v1/auth", authlimit, authRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/public", publicRoute);
app.use("/api/v1/magazine", magazineRoute);

app.get("/", (req: any, res: any) => {
  res.json({
    success: true,
    message: "Welcome to OneBusiness India Backend",
    uptime: process.uptime(),
  });
});

app.get("/health", (req: any, res: any) => {
  res.json({
    success: true,
    message: "All are working",
    uptime: process.uptime(),
  });
});

app.use(errorMiddleware);
