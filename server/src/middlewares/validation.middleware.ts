import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { HttpStatusCode } from "../utils/constants";
import { Types } from "mongoose";
import fs from "fs";

export const validateBody =
  (schema: ZodType) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.body) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "All fileds are required.",
      });
      return;
    }

    const validation = schema.safeParse(req.body);

    if (!validation.success) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: validation.error.issues[0].message,
      });
      return;
    }

    req.body = validation.data;
    next();
  };

export const validateParam =
  (paramName: string) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const param = req.params[paramName];

    if (!param) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: `Parameter '${paramName}' is required.`,
      });
      return;
    }

    next();
  };

export const validateObjectId =
  (paramName: string) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const id = req.params[paramName];

    if (!id) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: `Parameter '${paramName}' is required.`,
      });
      return;
    }

    if (!Types.ObjectId.isValid(id)) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: `Parameter '${paramName}' is not valid ObjectId.`,
      });
      return;
    }

    next();
  };

export const validateImageUploaded =
  (imageName: string) => (req: Request, res: Response, next: NextFunction) => {
    const image = req.file;

    if (!image) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: `${imageName} is required.`,
      });
      return;
    }

    const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowed.includes(image.mimetype)) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Only image files are allowed!",
      });
      fs.unlinkSync(image.path);
      return;
    }

    if (image.size > 5 * 1024 * 1024) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        messgae: `${imageName} size exceeds 5MB limit!`,
      });
      fs.unlinkSync(image.path);
      return;
    }

    next();
  };
