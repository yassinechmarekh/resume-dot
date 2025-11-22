import { NextFunction, Request, Response } from "express";
import {
  AuthProviders,
  CookieKeys,
  Environment,
  HttpStatusCode,
} from "../utils/constants";
import { IUser, User } from "../models/User.model";
import { sendEmailVerification, sendResetPasswordLink } from "../utils/mail";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyResetPasswordToken,
} from "../utils/token";
import { Types } from "mongoose";
import { getUserByIdService } from "../services/user.service";
import bcrypt from "bcrypt";
import { JWTPayloadType } from "../types";
import jwt from "jsonwebtoken";

/**----------------------------------------
 * @desc Register new user
 * @route /api/auth/register
 * @method POST
 * @access public  
 -----------------------------------------*/
export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    let user: IUser | null;
    user = await User.findOne({ email });

    if (user) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Your email already exist. Please login to your account.",
      });
      return;
    }

    user = await User.create({
      username,
      email,
      password,
      providers: [AuthProviders.LOCAL],
    });

    await sendEmailVerification(user._id);

    res.status(HttpStatusCode.CREATED).json({
      message: "We send a verification email. Please check your inbox.",
      user: {
        _id: user._id,
      },
    });
  } catch (error) {
    console.log("Register Controller Error :");
    console.log(error);
    next(error);
  }
};

/**----------------------------------------
 * @desc Login
 * @route /api/auth/login
 * @method POST
 * @access public  
 -----------------------------------------*/
export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.password) {
      res
        .status(HttpStatusCode.NOT_FOUND)
        .json({ message: "Invalid email or password." });
      return;
    }

    if (!user.isVerified) {
      await sendEmailVerification(user._id);
      res.status(HttpStatusCode.FORBIDDEN).json({
        message:
          "You need to verify your account. We send an email verification, please check your inbox.",
      });
      return;
    }

    const passwordIsMatch: boolean = await user.comparePassword(password);

    if (!passwordIsMatch) {
      res
        .status(HttpStatusCode.FORBIDDEN)
        .json({ message: "Invalid email or password." });
      return;
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res
      .status(HttpStatusCode.OK)
      .cookie(CookieKeys.REFRESH_TOKEN, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === Environment.PRODUCTION,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite:
          process.env.NODE_ENV === Environment.PRODUCTION ? "none" : "lax",
        path: "/",
      })
      .json({
        accessToken,
      });
  } catch (error) {
    console.log("Login Controller Error :");
    console.log(error);
    next(error);
  }
};

/**----------------------------------------
 * @desc Verify email
 * @route /api/auth/verify-email/:userId
 * @method POST
 * @access public  
 -----------------------------------------*/
export const verifyEmailController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = new Types.ObjectId(req.params.userId);
    const { otp } = req.body;

    const user = await getUserByIdService(userId, "+otp +otpExpiresAt");

    if (!user.otp || !user.otpExpiresAt) {
      await sendEmailVerification(user._id);
      res.status(HttpStatusCode.FORBIDDEN).json({
        message:
          "OTP code missing, we create new one. Please check our inbox, and retry.",
      });
      return;
    }

    const isExpires = Date.now() > new Date(user.otpExpiresAt).getTime();

    if (isExpires) {
      await sendEmailVerification(user._id);
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message:
          "Your OTP code is Expired. We sent a new one, check your inbox and retry.",
      });
      return;
    }

    const isMatch = await bcrypt.compare(otp.toString(), user.otp);

    if (!isMatch) {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ message: "Invalid OTP code." });
      return;
    }

    await User.updateOne(
      { _id: user._id },
      {
        $set: { isVerified: true },
        $unset: { otp: "", otpExpiresAt: "" },
      }
    );

    res.status(HttpStatusCode.OK).json({
      message: "Your email is verified successfully, please login.",
    });
  } catch (error) {
    console.log("Verify Email Controller Error :");
    console.log(error);
    next(error);
  }
};

/**----------------------------------------
 * @desc Resend email verification
 * @route /api/auth/resend-otp/:userId
 * @method GET
 * @access public  
 -----------------------------------------*/
export const resendEmailVerificationController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = new Types.ObjectId(req.params.userId);

    const user = await getUserByIdService(userId);

    if (user.isVerified) {
      res.status(HttpStatusCode.FORBIDDEN).json({
        message: "Your account already veriifed.",
      });
      return;
    }

    await sendEmailVerification(userId);

    res.status(HttpStatusCode.OK).json({
      message: "We sent a new OTP code, please check your inbox.",
    });
  } catch (error) {
    console.log("Resend Email Verification Error :");
    console.log(error);
    next(error);
  }
};

/**----------------------------------------
 * @desc Forgot password
 * @route /api/auth/forgot-password
 * @method POST
 * @access public  
 -----------------------------------------*/
export const forgotPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(HttpStatusCode.NOT_FOUND).json({
        message: "You have not an account in our platform.",
      });
      return;
    }

    if (!user.isVerified) {
      await sendEmailVerification(user._id);
      res.status(HttpStatusCode.FORBIDDEN).json({
        message:
          "You must first verify your email. We send a verification email, check your inbox.",
      });
    }

    await sendResetPasswordLink(user._id);

    res.status(HttpStatusCode.OK).json({
      message:
        "We sent a link to reset your password. Please check your inbox.",
    });
  } catch (error) {
    console.log("Forgot Password Controller Error :");
    console.log(error);
    next(error);
  }
};

/**----------------------------------------
 * @desc Reset Password
 * @route /api/auth/reset-password/:token
 * @method POST
 * @access public  
 -----------------------------------------*/
export const resetPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.params.token;
    const { newPassword } = req.body;

    const isVerified = (await verifyResetPasswordToken(token)).isVerified;
    const isExpired = (await verifyResetPasswordToken(token)).isExpired;

    if (!isVerified) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Invalid token.",
      });
      return;
    }

    const user = await User.findOne({ resetPasswordToken: token }).select(
      "+resetPasswordToken +resetPasswordExpiresAt +password"
    );

    if (!user) {
      res.status(HttpStatusCode.NOT_FOUND).json({
        message: "Invalid token.",
      });
      return;
    }

    if (isExpired) {
      await sendResetPasswordLink(user._id);
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message:
          "Your token is expired. We sent a new reset password link, check your inbox.",
      });
      return;
    }

    user.password = newPassword;
    user.markModified("password");
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    res.status(HttpStatusCode.OK).json({
      message: "Your password is updated successfully. Please login.",
    });
  } catch (error) {
    console.log("Reset Password Controller Error :");
    console.log(error);
    next(error);
  }
};

/**----------------------------------------
 * @desc Verify Reset Password Token
 * @route /api/auth/verify-reset-password-token/:token
 * @method GET
 * @access public  
 -----------------------------------------*/
export const verifyResetPasswordTokenController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const token = req.params.token;

    const isVerified = (await verifyResetPasswordToken(token)).isVerified;
    const isExpired = (await verifyResetPasswordToken(token)).isExpired;

    res.status(HttpStatusCode.OK).json({
      isVerified,
      isExpired,
    });
  } catch (error) {
    console.log("Verify Reset Password Token :");
    console.log(error);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      isVerified: false,
      isExpired: false,
    });
  }
};

/**----------------------------------------
 * @desc Get profile data logeddin
 * @route /api/auth/profile-data
 * @method GET
 * @access private  
 -----------------------------------------*/
export const getProfileDataController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "No authenticated.",
      });
      return;
    }

    res.status(HttpStatusCode.OK).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("Get Profile Data Controller Error :");
    console.log(error);
    next(error);
  }
};

/**----------------------------------------
 * @desc Logout
 * @route /api/auth/logout
 * @method GET
 * @access private  
 -----------------------------------------*/
export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshToken = req.cookies[CookieKeys.REFRESH_TOKEN];

    if (!refreshToken) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "No token provided.",
      });
      return;
    }

    res
      .clearCookie(CookieKeys.REFRESH_TOKEN, {
        httpOnly: true,
        secure: process.env.NODE_ENV === Environment.PRODUCTION,
        sameSite:
          process.env.NODE_ENV === Environment.PRODUCTION ? "none" : "lax",
        path: "/",
      })
      .status(HttpStatusCode.OK)
      .json({
        message: "You are logout.",
      });
  } catch (error) {
    console.log("Logout Controller Error :");
    console.log(error);
    next(error);
  }
};

/**----------------------------------------
 * @desc Refresh Token
 * @route /api/auth/refresh
 * @method GET
 * @access public  
 -----------------------------------------*/
export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshToken = req.cookies[CookieKeys.REFRESH_TOKEN];

    if (!refreshToken) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Missing refresh token.",
      });
      return;
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY as string
    ) as JWTPayloadType;

    const user = await getUserByIdService(decoded.userId);

    const newAccessToken = generateAccessToken(user._id);

    res.status(HttpStatusCode.OK).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(HttpStatusCode.FORBIDDEN).json({
        message: "Expired token.",
      });
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(HttpStatusCode.FORBIDDEN).json({
        message: "Invalid token provided.",
      });
      return;
    }
    console.log("Refresh Token Controller Error :");
    console.log(error);
    next(error);
  }
};

/**----------------------------------------
 * @desc Verify Access Token (is authenticated ?)
 * @route /api/auth/verify-token
 * @method GET
 * @access public  
 -----------------------------------------*/
export const verifyAccessTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeaders = req.headers.authorization;

    if (!authHeaders) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        isAuthenticated: false,
        message: "No token provided.",
      });
      return;
    }

    const accessToken = authHeaders.startsWith("Bearer ")
      ? authHeaders.split(" ")[1]
      : null;

    if (!accessToken) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        isAuthenticated: false,
        message: "No access token provided.",
      });
      return;
    }

    jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET_KEY as string,
      async (err, decoded) => {
        if (err || !decoded) {
          res.status(HttpStatusCode.UNAUTHORIZED).json({
            isAuthenticated: false,
            message: "Invalid or expired token.",
          });
          return;
        }

        res.status(HttpStatusCode.OK).json({
          isAuthenticated: true,
          message: "Valid token.",
        });
      }
    );
  } catch (error) {
    console.log("Verify Access Token Controller Error :");
    console.log(error);
    next(error);
  }
};

/**----------------------------------------
 * @desc Google callback
 * @route /api/auth/google/callback
 * @method GET
 * @access public  
 -----------------------------------------*/
export const googleCallbackController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      res.status(HttpStatusCode.FORBIDDEN).json({
        message: "No user provided by google auth.",
      });
      return;
    }

    const accesToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res
      .cookie(CookieKeys.REFRESH_TOKEN, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === Environment.PRODUCTION,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .redirect(
        `${process.env.CLIENT_DOMAIN}/auth/google/success?token=${accesToken}`
      );
  } catch (error) {
    console.log("Google Callback Controller Error :");
    console.log(error);
    next(error);
  }
};
