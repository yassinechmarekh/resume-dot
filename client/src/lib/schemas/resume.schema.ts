import { z } from "zod";

export const PersonalInfoSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number is required"),
  location: z.string().min(1, "Location is required"),
  linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  profession: z.string().min(1, "Profession is required"),
  image: z.any().refine((file) => file instanceof File, {
    message: "Please upload a valid Image file",
  }),
});

export const ExperienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  start_date: z.date({
    error: "Experience start date is required.",
  }),
  end_date: z.date({
    error: "Experience end date is required.",
  }).optional(),
  description: z.string().min(1, "Description is required"),
  is_current: z.boolean(),
});

export const EducationSchema = z.object({
  institution: z.string().min(1, "Institution name is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().optional(),
  graduation_date: z.date({
    error: "The graduation date is required.",
  }),
});

export const ProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  type: z.string().min(1, "Project type is required"),
  description: z.string().min(1, "Project description is required"),
});

// --- Template Enum ---
export const TemplateSchema = z.enum([
  "classic",
  "minimal",
  "modern",
  "minimal-image",
]);

// --- Resume global schema ---
export const ResumeSchema = z.object({
  personal_info: PersonalInfoSchema,
  title: z.string().min(1, "Title is required"),
  public: z.boolean().default(false),
  professional_summary: z.string().min(1, "Professional summary is required"),
  skills: z.array(z.string().min(1)).optional(),
  experience: z.array(ExperienceSchema).optional(),
  education: z.array(EducationSchema).optional(),
  project: z.array(ProjectSchema).optional(),
});

export const CreateResumeSchema = ResumeSchema.pick({
  title: true,
});

export const UploadResumeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  resume: z.any().refine((file) => file instanceof File, {
    message: "Please upload a valid PDF file",
  }),
});

export const updateResumeTitleSchema = ResumeSchema.pick({
  title: true,
});

export const updateResumeSchema = ResumeSchema.pick({
  personal_info: true,
  professional_summary: true,
  experience: true,
  education: true,
  project: true,
  skills: true,
});
