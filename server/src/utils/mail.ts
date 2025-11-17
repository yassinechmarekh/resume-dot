import { randomBytes, randomInt } from "crypto";
import { Types } from "mongoose";
import {
  getUserByIdService,
  updateUserService,
} from "../services/user.service";
import bcrypt from "bcrypt";
import path from "path";
import ejs from "ejs";
import sendEmail from "../config/mail";

export const sendEmailVerification = async (
  userId: Types.ObjectId
): Promise<void> => {
  const user = await getUserByIdService(userId);
  const otp = randomInt(100000, 999999);

  const salt = await bcrypt.genSalt(10);
  const hashedOTP = await bcrypt.hash(otp.toString(), salt);

  await updateUserService(user._id, {
    otp: hashedOTP,
    otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  const templatePath = path.join(__dirname, "../views/email-verification.ejs");
  const template = await ejs.renderFile(templatePath, {
    username: user.username.toUpperCase(),
    otp,
  });

  await sendEmail(
    user.email,
    `${process.env.APP_NAME} - Verify Your Email`,
    template
  );
};

export const sendResetPasswordLink = async (
  userId: Types.ObjectId
): Promise<void> => {
  const user = await getUserByIdService(userId);

  const resetPasswordToken = randomBytes(30).toString("hex");
  const link = `${process.env.CLIENT_DOMAIN}/auth/reset-password/${resetPasswordToken}`;

  await updateUserService(user._id, {
    resetPasswordToken,
    resetPasswordExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  const templatePath = path.join(
    __dirname,
    "../views/reset-password-email.ejs"
  );
  const template = await ejs.renderFile(templatePath, {
    username: user.username.toUpperCase(),
    link,
  });

  await sendEmail(
    user.email,
    `${process.env.APP_NAME} - Reset Password Link`,
    template
  );
};