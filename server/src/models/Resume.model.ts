import { Document, Schema, Types, model } from "mongoose";
import {
  EducationType,
  ExperinceType,
  PersonalInfoType,
  ProjectType,
  TemplateType,
} from "../types";
import { Templates } from "../utils/constants";

export interface IResume extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  public: boolean;
  template: TemplateType;
  accent_color: string;
  personal_info: PersonalInfoType;
  professional_summary: string;
  education: EducationType[];
  experience: ExperinceType[];
  project: ProjectType[];
  skills: string[];
  createdAt: Date;
  updatedAt: Date;
  __v?: number;
}

const ResumeSchema = new Schema<IResume>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    public: {
      type: Boolean,
      default: false,
    },
    template: {
      type: String,
      enum: [
        Templates.CLASSIC,
        Templates.MINIMAL,
        Templates.MODERN,
        Templates.MINIMAL_IMAGE,
      ],
      default: Templates.CLASSIC,
    },
    accent_color: {
      type: String,
      default: "#3B82F6",
    },
    personal_info: {
      full_name: {
        type: String,
        default: "",
      },
      email: {
        type: String,
        default: "",
      },
      phone: {
        type: String,
        default: "",
      },
      location: {
        type: String,
        default: "",
      },
      profession: {
        type: String,
        default: "",
      },
      image: {
        url: {
          type: String,
          default: "",
        },
        publicId: {
          type: String,
          default: null,
        },
      },
      website: {
        type: String,
      },
      linkedin: {
        type: String,
      },
    },
    professional_summary: {
      type: String,
      default: "",
    },
    education: {
      type: [
        {
          institution: {
            type: String,
          },
          degree: {
            type: String,
          },
          field: {
            type: String,
          },
          graduation_date: {
            type: Date,
          },
        },
      ],
      default: [],
    },
    experience: {
      type: [
        {
          company: {
            type: String,
          },
          position: {
            type: String,
          },
          start_date: {
            type: Date,
          },
          end_date: {
            type: Date,
          },
          description: {
            type: String,
          },
          is_current: {
            type: Boolean,
          },
        },
      ],
      default: [],
    },
    project: {
      type: [
        {
          name: {
            type: String,
          },
          type: {
            type: String,
          },
          description: {
            type: String,
          },
        },
      ],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

ResumeSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export const Resume = model<IResume>("Resume", ResumeSchema);
