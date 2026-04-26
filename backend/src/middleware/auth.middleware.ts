import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";

// Authentication middleware
export const isAuthenticated = (req: any, res: any, next: any) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return next(new AppError("Token not found. Login required", 401));
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return next(new AppError("JWT secret is not defined", 500));
    }

    const payload = jwt.verify(token, JWT_SECRET);

    if (typeof payload === "object") {
      req.user = payload;
    }

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError("Token expired", 401));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError("Invalid token", 401));
    }
    return next(
      new AppError("Something went wrong while verifying the token", 500),
    );
  }
};

export const isAdmin = (req: any, res: any, next: any) => {
  try {
    const user = req.user;

    if (!user) {
      return next(new AppError("Unauthorized", 401));
    }

    const userRole = user.role || user.Role;
    if (userRole !== "ADMIN") {
      return next(
        new AppError(
          "Forbidden: You do not have permission to access this resource",
          403,
        ),
      );
    }

    next();
  } catch (error) {
    return next(
      new AppError("Something went wrong while checking admin status", 500),
    );
  }
};



