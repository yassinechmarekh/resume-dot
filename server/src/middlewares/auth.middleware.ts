import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../utils/constants";
import jwt from "jsonwebtoken";
import { JWTPayloadType } from "../types";
import { getUserByIdService } from "../services/user.service";
import { IUser } from "../models/User.model";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeaders = req.headers.authorization;

  if (!authHeaders) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      message: "No access token provided.",
    });
    return;
  }

  const accessToken = authHeaders.startsWith("Bearer")
    ? authHeaders.split(" ")[1]
    : null;

  if (!accessToken) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      message: "Invalid token format.",
    });
    return;
  }

  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET_KEY as string
    ) as JWTPayloadType;

    if (!decoded.userId) {
      res
        .status(HttpStatusCode.UNAUTHORIZED)
        .json({ message: "Invalid token payload." });
      return;
    }

    req.user = await getUserByIdService(decoded.userId);
    next();
  } catch (error) {
    res
      .status(HttpStatusCode.UNAUTHORIZED)
      .json({ message: "Invalid or expired access token." });
    return;
  }
};
