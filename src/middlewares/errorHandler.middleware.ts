import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app.error";

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const isProd = process.env.NODE_ENV === "production";

  const status = err.statusCode ?? 500;

  let message = err.message || "Unexpected error";

  if (status === 500 && isProd) {
    message = "Internal server error";
  }

  const response: Record<string, any> = {
    statusCode: status,
    message,
  };

  if (!isProd) {
    response.stack = err.stack;
    response.details = err.meta;
  }

  return res.status(status).json(response);
}
