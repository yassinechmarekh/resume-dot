import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { StringValue } from "ms";
import { JWTPayloadType } from "../types";
import { User } from "../models/User.model";

export const generateAccessToken = (userId: Types.ObjectId) => {
  const payload: JWTPayloadType = { userId };
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY as string, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES as StringValue,
  });
};

export const generateRefreshToken = (userId: Types.ObjectId) => {
  const payload: JWTPayloadType = { userId };
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET_KEY as string, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES as StringValue,
  });
};

export const verifyResetPasswordToken = async (
  token: string
): Promise<{
  isVerified: boolean;
  isExpired: boolean;
}> => {
  const user = await User.findOne({ resetPasswordToken: token }).select(
    "+resetPasswordToken + resetPasswordExpiresAt"
  );

  if (!user || !user.resetPasswordExpiresAt) {
    return {
      isVerified: false,
      isExpired: false,
    };
  }

  const isExpired = Date.now() > user.resetPasswordExpiresAt.getTime();

  if(isExpired) {
    return {
      isVerified: true,
      isExpired: true,
    };
  }

  return {
    isVerified: true,
    isExpired: false,
  };
};
