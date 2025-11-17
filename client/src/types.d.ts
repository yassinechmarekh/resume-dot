export type PersonalInfoType = {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  profession: string;
  image: string;
};

export type ExperinceType = {
  _id: string;
  company: string;
  position: string;
  start_date: Date;
  end_date?: Date;
  description: string;
  is_current: boolean;
};

export type EducationType = {
  _id: string;
  institution: string;
  degree: string;
  field: string;
  graduation_date: Date;
};

export type ProjectType = {
  _id: string;
  name: string;
  type: string;
  description: string;
};

export type TemplateType = "classic" | "minimal" | "modern" | "minimal-image";

export type ResumeType = {
  _id: string;
  userId: string;
  personal_info: PersonalInfoType;
  title: string;
  public: boolean;
  professional_summary: string;
  skills: string[];
  experience: ExperinceType[];
  education: EducationType[];
  template: TemplateType;
  accent_color: string;
  project: ProjectType[];
  updatedAt: Date;
  createdAt: Date;
};

export type UserType = {
  _id: string;
  username: string;
  email: string;
};

export type ActionResponseType = {
  success: boolean;
  message: string;
  redirectTo?: string;
};
