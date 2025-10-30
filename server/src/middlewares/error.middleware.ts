import { NextFunction, Request, Response } from "express";
import { Environment, HttpStatusCode } from "../utils/constants";

interface AppError extends Error {
  status?: number;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || HttpStatusCode.INTERNAL_SERVER_ERROR;
  console.log("Error Handler :");
  console.log(err.stack);
  res.status(status).json({
    message: err.message || "Internal server error.",
    stack: process.env.NODE_ENV === Environment.DEVELOPMENT ? err.stack : null,
  });
};
