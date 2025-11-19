import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../utils/constants";
import {
  createResumeService,
  deleteResumeService,
  getUserResumeByIdService,
  updateResumeService,
} from "../services/resume.service";
import { IResume, Resume } from "../models/Resume.model";
import openai from "../config/open-ai";
import { Types } from "mongoose";
import imageKit from "../config/image-kit";
import fs from "fs";
import { PersonalInfoType } from "../types";

/**----------------------------------------
 * @desc Create a new Resume
 * @route /api/resume/create
 * @method POST
 * @access private  
 -----------------------------------------*/
export const createResumeController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;
    const { title } = req.body;

    if (!user) {
      res.status(HttpStatusCode.FORBIDDEN).json({
        message: "Only authenticated user.",
      });
      return;
    }

    const resume = await Resume.findOne({ userId: user._id, title });

    if (resume) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "You already have resume with this title.",
      });
      return;
    }

    const newResume = await createResumeService({
      userId: user._id,
      title,
    });

    res.status(HttpStatusCode.CREATED).json({
      message: `"${newResume.title}" is created successfully.`,
      resume: {
        _id: newResume._id,
      },
    });
  } catch (error) {
    console.log("Create Resume Controller Error :");
    console.log(error);
    next(error);
  }
};

/**----------------------------------------
 * @desc Upload resume
 * @route /api/resume/upload
 * @method POST
 * @access private  
 -----------------------------------------*/
export const uploadResumeController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { title, resumeText } = req.body;

    if (!userId) {
      res.status(HttpStatusCode.FORBIDDEN).json({
        message: "You need to authenticate.",
      });
      return;
    }

    const response = await openai.chat.completions.create({
      model: process.env.OPEN_AI_MODELE as string,
      messages: [
        {
          role: "system",
          content:
            "You are an expert AI agent to extract data from resume. Always return valid JSON and preserve the original language of the resume content.",
        },
        {
          role: "user",
          content: `Extract data from this resume : ${resumeText}.
            Provide data in the following JSON format with no additional text before or after :
            {
              personal_info: {
                full_name: string;
                email: string;
                phone: string;
                location: string;
                linkedin?: string;
                website?: string;
                profession: string;
              };
              professional_summary: string;
              education: {
                institution: string;
                degree: string;
                field: string;
                graduation_date: Date;
              }[];
              experience:  {
                company: string;
                position: string;
                start_date: Date;
                end_date?: Date;
                description: string;
                is_current: boolean;
              }[];
              project: {
                name: string;
                type: string;
                description: string;
              }[];
              skills: string[];
            }

            CRITICAL RULES:
            - If a position is current (Present, Ongoing, etc.), set "is_current": true and "end_date": null
            - If a position has ended, set "is_current": false and provide the "end_date"
            - Never use "Present", "Current", or similar text values for end_date
          `,
        },
      ],
      response_format: { type: "json_object" },
    });

    const messageContent = response.choices[0].message.content;

    if (!messageContent) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Failed to extract resume data. Please try again.",
      });
      return;
    }

    const resumeData = JSON.parse(messageContent);

    if (!resumeData.personal_info || !resumeData.personal_info.full_name) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: "Could not extract essential information from resume.",
      });
      return;
    }

    const newResume = await createResumeService({
      userId,
      title,
      ...resumeData,
    });

    res.status(HttpStatusCode.CREATED).json({
      message: `"${newResume.title.toUpperCase()}" created successfully.`,
      resume: {
        _id: newResume._id,
      },
    });
  } catch (error) {
    console.log("Upload Resume Controller Error :"), console.log(error);
    next(error);
  }
};

/**----------------------------------------
 * @desc Update resume
 * @route /api/resume/:resumeId
 * @method PUT
 * @access private  
 -----------------------------------------*/
export const updateResumeController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const resumeId = new Types.ObjectId(req.params.resumeId);
    const userId = req.user?._id;
    const body = req.body;

    if (!userId) {
      res.status(HttpStatusCode.FORBIDDEN).json({
        message: "You need to authenticate.",
      });
      return;
    }

    const resume = await getUserResumeByIdService(userId, resumeId);

    await updateResumeService(resume._id, userId, body);

    res.status(HttpStatusCode.OK).json({
      message: "Resume updated successfully.",
    });
  } catch (error) {
    console.log("Update Resume Controller Error :"), console.log(error);
    next(error);
  }
};

/**----------------------------------------
 * @desc Get specific resume
 * @route /api/resume/:resumeId
 * @method GET
 * @access private  
 -----------------------------------------*/
export const getSpecificResumeController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const resumeId = new Types.ObjectId(req.params.resumeId);
    const userId = req.user?._id;

    if (!userId) {
      res.status(HttpStatusCode.FORBIDDEN).json({
        message: "You need to authenticate.",
      });
      return;
    }

    const resume = await getUserResumeByIdService(userId, resumeId);

    res.status(HttpStatusCode.OK).json({
      resume,
    });
  } catch (error) {
    console.log("Get Specific Resume Controller Error :");
    console.log(error);
    next(error);
  }
};

/**----------------------------------------
 * @desc Delete resume
 * @route /api/resume/:resumeId
 * @method DELETE
 * @access private  
 -----------------------------------------*/
export const deleteResumeController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const resumeId = new Types.ObjectId(req.params.resumeId);
    const userId = req.user?._id;

    if (!userId) {
      res.status(HttpStatusCode.FORBIDDEN).json({
        message: "Your need to authenticate.",
      });
      return;
    }

    const resume = await deleteResumeService(userId, resumeId);

    res.status(HttpStatusCode.OK).json({
      message: `"${resume.title.toLocaleUpperCase()}" delete successfully.`,
    });
  } catch (error) {
    console.log("Delete Resume Controller Error :");
    console.log(error);
    next(error);
  }
};

/**----------------------------------------
 * @desc Get User Resumes
 * @route /api/resume/all
 * @method GET
 * @access private  
 -----------------------------------------*/
export const getUserResumesController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(HttpStatusCode.FORBIDDEN).json({
        message: "You need to authenticate.",
      });
      return;
    }

    const resumes = await Resume.find({ userId }).sort({ createdAt: -1 });

    res.status(HttpStatusCode.OK).json({
      resumes,
    });
  } catch (error) {
    console.log("Get User Resumes Controller Error :");
    console.log(error);
    next(error);
  }
};

/**----------------------------------------
 * @desc Upload profile image of resume
 * @route /api/resume/upload-profile-image/:resumeId
 * @method POST
 * @access private  
 -----------------------------------------*/
export const uploadResumeImageController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id;
    const resumeId = new Types.ObjectId(req.params.resumeId);
    const { removeBackground } = req.body;
    const image = req.file;

    if (!userId) {
      res.status(HttpStatusCode.FORBIDDEN).json({
        message: "You need to authenticate.",
      });
      return;
    }

    if (!image) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        messgae: "Resume profile image is required.",
      });
      return;
    }

    const resume = await getUserResumeByIdService(userId, resumeId);

    if (resume.personal_info.image.publicId) {
      await imageKit.files.delete(resume.personal_info.image.publicId);
    }

    await imageKit.files
      .upload({
        file: fs.createReadStream(image.path),
        fileName: `resume-profile-image-${resume._id}.png`,
        folder: "ai-resume-builder/user-resumes",
        transformation: {
          pre:
            "w-300,h-300,fo-face,z-0.75" +
            (removeBackground ? ",e-bgremove" : ""),
        },
      })
      .then(async (res) => {
        fs.unlinkSync(image.path);
        resume.personal_info.image.url = res.url as string;
        resume.personal_info.image.publicId = res.fileId as string;

        await resume.save();
      });

    res.status(HttpStatusCode.OK).json({
      message: "Image updated succesfully.",
    });
  } catch (error) {
    console.log("Upload Resume Image Controller Error :");
    console.log(error);
    next(error);
  }
};

/**----------------------------------------
 * @desc Enhance text
 * @route /api/resume/enhance-text
 * @method POST
 * @access public  
 -----------------------------------------*/
export const enhanceTextController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { type, text } = req.body;

    let systemPrompt;
    let userPrompt;

    if (type === "summary") {
      systemPrompt =
        "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly. and only return text no options or anything else.";
      userPrompt = `Enhance my profesionnal summary : ${text}`;
    } else if (type === "experience_job_description") {
      systemPrompt =
        "You are an expert in resume writing. Your task is to enhance the job description of a resume. The job description should be only in 1-2 sentence also highlighting key responsibilities and achevements. Use action verbs and quantifiable results where possible. Make it ATS-friendly. and only return text no options or anything else.";
      userPrompt = `Enhance this job description : ${text}`;
    } else if (type === "project_description") {
      systemPrompt =
        "You are an expert in resume writing. Your task is to enhance the project description section of a resume. The description should be concise (1-2 sentences) and highlight the project's purpose, key technologies, responsibilities, and measurable impact when possible. Use clear action verbs, ensure the result is ATS-friendly, and only return text with no options or additional formatting.";
      userPrompt = `Enhance this project description: ${text}`;
    }

    const response = await openai.chat.completions
      .create({
        model: process.env.OPEN_AI_MODELE as string,
        messages: [
          { role: "system", content: `${systemPrompt}` },
          {
            role: "user",
            content: `${userPrompt}`,
          },
        ],
      })
      .then((result) => {
        if (type === "summary") {
          res.status(HttpStatusCode.OK).json({
            enhancedSummary: result.choices[0].message.content,
          });
          return;
        } else if (type === "experience_job_description") {
          res.status(HttpStatusCode.OK).json({
            enhancedJobDescription: result.choices[0].message.content,
          });
          return;
        } else if (type === "project_description") {
          res.status(HttpStatusCode.OK).json({
            enhancedProjectDescription: result.choices[0].message.content,
          });
          return;
        }
      });
  } catch (error) {
    console.log("Enhance Text Controller Error :");
    console.log(error);
    next(error);
  }
};
