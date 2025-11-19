"use server";

import api from "@/lib/axios";
import {
  CookieKeys,
  DashboardPages,
  HttpStatusCode,
  Routes,
} from "@/lib/constants";
import {
  CreateResumeSchema,
  UploadResumeSchema,
} from "@/lib/schemas/resume.schema";
import { ActionResponseType, ResumeType } from "@/types";
import { cookies } from "next/headers";
import z from "zod";

export const createResumeAction = async (
  data: z.infer<typeof CreateResumeSchema>
): Promise<ActionResponseType> => {
  try {
    const response = await api.post(`/resume/create`, data);

    if (response.status !== HttpStatusCode.CREATED) {
      return {
        success: false,
        message: response.data.message,
      };
    }

    return {
      success: true,
      message: response.data.message,
      redirectTo: `/${Routes.DASHBOARD}/${DashboardPages.BUILDER}/${response.data.resume._id}`,
    };
  } catch (error) {
    console.log("Create Resume Action Error :");
    console.log(error);
    return {
      success: false,
      message: "Internal server error. Please try again.",
    };
  }
};

export const uploadResumeAction = async (
  data: z.infer<typeof UploadResumeSchema>
): Promise<ActionResponseType> => {
  try {
    const response = await api.post(`/resume/upload`, {
      title: data.title,
      resumeText: data.resume,
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
      redirectTo: `/${Routes.DASHBOARD}/${DashboardPages.BUILDER}/${response.data.resume._id}`,
    };
  } catch (error) {
    console.log("Upload Resume Action Error :");
    console.log(error);
    return {
      success: false,
      message: "Internal server error. Please try again.",
    };
  }
};

export const getUserResumesAction = async (): Promise<ResumeType[] | null> => {
  try {
    const response = await api.get(`/resume/all`);

    if (response.status !== HttpStatusCode.OK) {
      return null;
    }

    return response.data.resumes;
  } catch (error) {
    console.log("Get User Resumes Action Error :");
    console.log(error);
    return null;
  }
};

export const updateResumeAction = async (
  data: Partial<ResumeType>,
  resumeId: string,
  updateImage: {
    profileImage: File;
    removeBackground: boolean;
  } | null
): Promise<ActionResponseType> => {
  try {
    console.log("Data to Update : ", data);
    const response = await api.put(`/resume/${resumeId}`, data);

    if (response.status !== HttpStatusCode.OK) {
      console.log("Response false update resume :", response.data);
      return {
        success: false,
        message: response.data.message,
      };
    }

    if (updateImage) {
      const formData = new FormData();
      formData.append("image", updateImage.profileImage);
      formData.append("removeBackground", String(updateImage.removeBackground));

      const result = await api.post(
        `/resume/upload-profile-image/${resumeId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (result.status !== HttpStatusCode.OK) {
        return {
          success: false,
          message: result.data.message,
        };
      }
    }

    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    console.log("Update Resume Action Error :");
    console.log(error);
    return {
      success: false,
      message: "Internal server error. Please try again.",
    };
  }
};

export const deleteResumeAction = async (
  resumeId: string
): Promise<ActionResponseType> => {
  try {
    const response = await api.delete(`/resume/${resumeId}`);

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
    console.log("Delete Resume Action Error :");
    console.log(error);
    return {
      success: false,
      message: "Internal server error. Please try again.",
    };
  }
};

export const getSpecificResumeAction = async (
  resumeId: string
): Promise<ResumeType | null> => {
  try {
    const response = await api.get(`/resume/${resumeId}`);

    if (response.status !== HttpStatusCode.OK) {
      return null;
    }

    return response.data.resume;
  } catch (error) {
    console.log("Get Specific Resume Action Error :");
    console.log(error);
    return null;
  }
};

export const enhanceTextAction = async (
  type: "summary" | "experience_job_description" | "project_description",
  text: string
): Promise<ActionResponseType & { text?: string }> => {
  try {
    const response = await api.post(`/resume/enhance-text`, {
      type,
      text,
    });

    if (response.status !== HttpStatusCode.OK) {
      return {
        success: false,
        message: response.data.message,
      };
    }
    return {
      success: true,
      message: "Text enhanced successfully.",
      text:
        type === "summary"
          ? response.data.enhancedSummary
          : type === "experience_job_description"
          ? response.data.enhancedJobDescription
          : type === "project_description"
          ? response.data.enhancedProjectDescription
          : null,
    };
  } catch (error) {
    console.log("Enhance Text Action Error :");
    console.log(error);
    return {
      success: false,
      message: "Internal server error. Please try again.",
    };
  }
};

export const changeResumeVisibilityAction = async (
  resumeId: string,
  resumeTitle: string,
  isPublic: boolean
): Promise<ActionResponseType> => {
  try {
    const response = await api.put(`/resume/${resumeId}`, {
      public: isPublic,
    });

    if (response.status !== HttpStatusCode.OK) {
      return {
        success: false,
        message: "Something went wrong. Please try again.",
      };
    }

    return {
      success: true,
      message: isPublic
        ? `${resumeTitle.toUpperCase()} is public now.`
        : `${resumeTitle.toUpperCase()} is private now.`,
    };
  } catch (error) {
    console.log("Change Resume Visibility Action Resume :");
    console.log(error);
    return {
      success: false,
      message: "Internal server error. Please try again.",
    };
  }
};
