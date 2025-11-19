import { Types } from "mongoose";
import { IResume, Resume } from "../models/Resume.model";
import { PersonalInfoType } from "../types";

export const createResumeService = async (
  data: Partial<IResume>
): Promise<IResume> => {
  const resume = await Resume.create(data);

  return resume;
};

export const getUserResumeByIdService = async (
  userId: Types.ObjectId,
  resumeId: Types.ObjectId
): Promise<IResume> => {
  const resume = await Resume.findById(resumeId);

  if (!resume) {
    throw new Error("Resume not found.");
  }

  if (!resume.userId.equals(userId)) {
    throw new Error("Access denied. Only owen user.");
  }

  return resume;
};

export const updateResumeService = async (
  resumeId: Types.ObjectId,
  userId: Types.ObjectId,
  updatedData: Partial<Omit<IResume, "personal_info">> & {
    personal_info?: Partial<PersonalInfoType>;
  }
): Promise<IResume> => {
  const resume = await Resume.findById(resumeId);

  if (!resume) {
    throw new Error("Resume not found.");
  }

  if (!resume.userId.equals(userId)) {
    throw new Error("Access denied. Only owner user can update this resume.");
  }

  if (updatedData.personal_info) {
    updatedData.personal_info = {
      ...resume.personal_info,
      ...updatedData.personal_info,
    };
  }

  const updatedResume = await Resume.findByIdAndUpdate(
    resume._id,
    updatedData,
    { new: true }
  );

  if (!updatedResume) {
    throw new Error("The resume update field.");
  }

  return updatedResume;
};

export const deleteResumeService = async (
  userId: Types.ObjectId,
  resumeId: Types.ObjectId
): Promise<IResume> => {
  const resume = await getUserResumeByIdService(userId, resumeId);

  const deletedResume = await Resume.findByIdAndDelete(resume._id);

  if (!deletedResume) {
    throw new Error("Error deleting resume.");
  }

  return deletedResume;
};
