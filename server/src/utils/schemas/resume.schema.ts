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
  start_date: z.coerce.date({
    error: "Experience start date is required.",
  }),
  end_date: z.coerce.date({
      error: "Experience end date is required.",
    })
    .optional(),
  description: z.string().min(1, "Description is required"),
  is_current: z.boolean(),
});

export const EducationSchema = z.object({
  institution: z.string().min(1, "Institution name is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().optional(),
  graduation_date: z.coerce.date({
    error: "The graduation date is required.",
  }),
});

export const ProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  type: z.string().min(1, "Project type is required"),
  description: z.string().min(1, "Project description is required"),
});

// --- Template Enum ---
export const TemplateSchema = z
  .enum(["classic", "minimal", "modern", "minimal-image"], {
    error:
      "Invalid template type. Allowed values are: classic, minimal, modern, and minimal-image.",
  });

// --- Resume global schema ---
export const ResumeSchema = z.object({
  personal_info: PersonalInfoSchema,
  title: z.string().min(1, "Title is required"),
  public: z.boolean().default(false),
  template: TemplateSchema,
  accent_color: z.string(),
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
  title: z.string().min(1, "Title is required."),
  resumeText: z.string().min(1, "Resume is required."),
});

export const UpdateResumeSchema = z.object({
  title: z
    .string({ error: "Title must be a string." })
    .min(1, "Title cannot be empty.")
    .optional(),
  public: z
    .boolean({ error: "Public field must be a boolean value." })
    .optional(),
  template: TemplateSchema.optional(),
  accent_color: z
    .string({
      error: "Accent color must be a string.",
    })
    .regex(
      /^#([0-9A-F]{3}){1,2}$/i,
      "Accent color must be a valid HEX code (e.g. #ff5733)."
    )
    .optional(),
  personal_info: z
    .object({
      full_name: z
        .string({ error: "Full name must be a string." })
        .min(1, "Full name cannot be empty.")
        .optional(),
      email: z
        .string()
        .email("Please provide a valid email address.")
        .optional(),
      phone: z
        .string({ error: "Phone number must be a string." })
        .regex(
          /^[\d\s()+-]+$/,
          "Phone number can only contain digits and symbols (+, -, ())."
        )
        .optional(),
      location: z.string({ error: "Location must be a string." }).optional(),
      linkedin: z
        .string()
        .url("Please enter a valid LinkedIn profile URL.")
        .optional()
        .or(z.literal("")),
      website: z
        .string()
        .url("Please enter a valid website URL.")
        .optional()
        .or(z.literal("")),
      profession: z
        .string({ error: "Profession must be a string." })
        .optional(),
    })
    .optional(),
  professional_summary: z
    .string({ error: "Professional summary must be a string." })
    .optional(),
  education: z
    .array(EducationSchema, {
      error: "Education must be an array of valid education entries.",
    })
    .optional(),
  experience: z
    .array(ExperienceSchema, {
      error: "Experience must be an array of valid experience entries.",
    })
    .optional(),
  project: z
    .array(ProjectSchema, {
      error: "Project must be an array of valid project entries.",
    })
    .optional(),
  skills: z
    .array(
      z.string().min(1, "Each skill must contain at least one character."),
      {
        error: "Skills must be an array of strings.",
      }
    )
    .optional(),
});

export const UploadResumeImageSchema = z.object({
  removeBackground: z
    .string()
    .optional()
    .transform((val) => val === "true")
    .pipe(z.boolean())
    .default(false),
});

export const EnhanceTextSchema = z.object({
  type: z.enum(
    ["summary", "experience_job_description", "project_description"],
    {
      error:
        "Invalid template type. Allowed values are: summary, experience_job_description and project_description.",
    }
  ),
  text: z.string().nonempty({ error: "Text is required." }),
});
