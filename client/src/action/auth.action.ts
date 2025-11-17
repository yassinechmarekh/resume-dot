"use server";

import api from "@/lib/axios";
import { AuthPages, CookieKeys, HttpStatusCode, Routes } from "@/lib/constants";
import {
  ForgotPasswordSchema,
  RegisterSchema,
  ResetPasswordSchema,
  VerifyEmailSchema,
} from "@/lib/schemas/auth.schema";
import { ActionResponseType, UserType } from "@/types";
import { cookies } from "next/headers";
import z from "zod";

export const getProfileDataAction = async (): Promise<UserType | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(CookieKeys.ACCESSTOKEN)?.value;

    if (!token) {
      return null;
    }

    const response = await api.get(`/auth/profile-data`);

    if (response.status !== HttpStatusCode.OK) {
      return null;
    }

    return response.data.user;
  } catch (error) {
    console.log("Get Profile Data Action Error :");
    console.log(error);
    return null;
  }
};

export const registerAction = async (
  data: z.infer<typeof RegisterSchema>
): Promise<ActionResponseType> => {
  try {
    const response = await api.post(`/auth/register`, {
      username: data.username,
      email: data.email,
      password: data.password,
    });

    if (response.status !== HttpStatusCode.CREATED) {
      return {
        success: false,
        message: response.data.message,
      };
    }

    return {
      success: true,
      message: response.data.message,
      redirectTo: `/${Routes.AUTH}/${AuthPages.VERIFY_EMAIL}/${response.data.user._id}`,
    };
  } catch (error) {
    console.log("Resgiter Action Error :");
    console.log(error);
    return {
      success: false,
      message: "Internal server error. Please try again.",
    };
  }
};

export const verifyEmailAction = async (
  data: z.infer<typeof VerifyEmailSchema>,
  userId: string
): Promise<ActionResponseType> => {
  try {
    const response = await api.post(`/auth/verify-email/${userId}`, {
      otp: data.codeOTP,
    });

    if (response.status !== HttpStatusCode.OK) {
      return {
        success: false,
        message: response.data.message,
      };
    }

    return {
      success: true,
      message: response.data.message,
      redirectTo: `/${Routes.AUTH}/${AuthPages.LOGIN}`,
    };
  } catch (error) {
    console.log("Verify Email Action Error :");
    console.log(error);
    return {
      success: false,
      message: "Internal server error. Please try again.",
    };
  }
};

export const resendOTPAction = async (
  userId: string
): Promise<ActionResponseType> => {
  try {
    const response = await api.get(`/auth/resend-otp/${userId}`);

    if (response.status !== HttpStatusCode.OK) {
      return {
        success: false,
        message: response.data.message,
      };
    }

    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    console.log("Resend OTP Action Error :");
    console.log(error);
    return {
      success: false,
      message: "Internal server error. Please try again.",
    };
  }
};

export const forgotPasswordAction = async (
  data: z.infer<typeof ForgotPasswordSchema>
): Promise<ActionResponseType> => {
  try {
    const response = await api.post(`/auth/forgot-password`, data);

    if (response.status !== HttpStatusCode.OK) {
      return {
        success: false,
        message: response.data.message,
      };
    }

    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    console.log("Forgot Password Action Error :");
    console.log(error);
    return {
      success: false,
      message: "Internal server error. Please try again.",
    };
  }
};

export const verifyResetPasswordTokenAction = async (
  token: string
): Promise<{
  isVerified: boolean;
  isExpired: boolean;
}> => {
  try {
    const response = await api.get(
      `/auth/verify-reset-password-token/${token}`
    );

    return {
      isVerified: response.data.isVerified,
      isExpired: response.data.isExpired,
    };
  } catch (error) {
    console.log("Verify Reset Password Token Action Error :");
    console.log(error);
    return {
      isVerified: false,
      isExpired: false,
    };
  }
};

export const resetPasswordAction = async (
  data: z.infer<typeof ResetPasswordSchema>,
  token: string
): Promise<ActionResponseType> => {
  try {
    const response = await api.post(`/auth/reset-password/${token}`, {
      newPassword: data.newPassword,
    });

    if (response.status !== HttpStatusCode.OK) {
      return {
        success: false,
        message: response.data.message,
      };
    }

    return {
      success: true,
      message: response.data.message,
      redirectTo: `/${Routes.AUTH}/${AuthPages.LOGIN}`,
    };
  } catch (error) {
    console.log("Reset Password Action Error :");
    console.log(error);
    return {
      success: false,
      message: "Internal server error. Please try again.",
    };
  }
};

export const isLoggedInAction = async (): Promise<boolean> => {
  try {
    const response = await api.get(`/auth/verify-token`);

    if (response.status !== HttpStatusCode.OK) {
      return response.data.isAuthenticated || false;
    }

    return response.data.isAuthenticated;
  } catch (error) {
    console.log("IsLoaggedIn Action Error :");
    console.log(error);
    return false;
  }
};
