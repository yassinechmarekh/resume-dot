"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

const PersonalInfoSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number is required"),
  location: z.string().min(1, "Location is required"),
  linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  profession: z.string().min(1, "Profession is required"),
  image: z.string().url("Invalid image URL").optional().or(z.literal("")),
});

const ExperienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  start_date: z.date(),
  end_date: z.date().optional(),
  description: z.string().min(1, "Description is required"),
  is_current: z.boolean(),
});

const EducationSchema = z.object({
  institution: z.string().min(1, "Institution name is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().min(1, "Field of study is required"),
  graduation_date: z.date(),
  gpa: z.string().optional(),
});

export const ProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  type: z.string().min(1, "Project type is required"),
  description: z.string().min(1, "Project description is required"),
});

const updateResumeSchema = z.object({
  personal_info: PersonalInfoSchema,
  professional_summary: z.string().min(1, "Professional summary is required"),
  skills: z.array(z.string().min(1)).min(1, "At least one skill is required"),
  experience: z.array(ExperienceSchema).optional(),
  education: z.array(EducationSchema).optional(),
  project: z.array(ProjectSchema).optional(),
});

const Test = () => {
  const form = useForm<z.infer<typeof updateResumeSchema>>({
    resolver: zodResolver(updateResumeSchema),
  });
  return <div>Test</div>;
};

export default Test;
