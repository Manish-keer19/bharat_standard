// src/middlewares/error.middleware.ts
import { AppError } from "../utils/AppError"

export const errorMiddleware = (err:any, req:any, res:any, next:any) => {
  console.error(err)  // log the error

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      data: null
    })
  }

  // prisma errors, unexpected crashes etc
  return res.status(500).json({
    success: false,
    message: "Internal server error",
    data: null
  })
}