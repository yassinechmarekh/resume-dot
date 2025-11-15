import { Types } from "mongoose";

export type JWTPayloadType = {
  userId: Types.ObjectId;
};

export type PersonalInfoType = {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  profession: string;
  image: {
    url: string;
    publicId: string;
  };
};

export type ExperinceType = {
  _id: Types.ObjectId;
  company: string;
  position: string;
  start_date: Date;
  end_date?: Date;
  description: string;
  is_current: boolean;
};

export type EducationType = {
  _id: Types.ObjectId;
  institution: string;
  degree: string;
  field: string;
  graduation_date: Date;
};

export type ProjectType = {
  _id: Types.ObjectId;
  name: string;
  type: string;
  description: string;
};

export type TemplateType = "classic" | "minimal" | "modern" | "minimal-image";
