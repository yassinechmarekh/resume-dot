"use client";

import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import resumes from "@/data/resumes";
import { ResumeType, TemplateType } from "@/types";
import {
  ArrowLeftIcon,
  Briefcase,
  Check,
  ChevronLeft,
  ChevronRight,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  FileText,
  FolderIcon,
  GraduationCap,
  Layout,
  Palette,
  ScreenShareOff,
  Share2Icon,
  Sparkles,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import TemplateSelector from "@/components/dashboard/template-selector";
import ColorPicker from "@/components/dashboard/color-picker";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";
import { updateResumeSchema } from "@/lib/schemas/resume.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import PersonalInfoForm from "@/components/forms/personal-info-form";
import ResumePreview from "@/components/dashboard/resume-preview";
import { urlToFile } from "@/lib/utils";
import ProfessionnalSummary from "@/components/forms/profesionnal-summary";
import ExperienceForm from "@/components/forms/experience-form";
import EducationFrom from "@/components/forms/education-form";
import ProjectForm from "@/components/forms/projects-form";
import SkillsForm from "@/components/forms/skills-form";
import ShareResume from "@/components/dashboard/share-resume";
import { useReactToPrint } from "react-to-print";
import { Parag } from "@/components/text";

const BuilderRoute = () => {
  const { resumeId } = useParams();
  const [resumeData, setResumeData] = useState<ResumeType>({
    _id: resumeId ? resumeId.toString() : "",
    userId: "",
    personal_info: {
      full_name: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      website: "",
      profession: "",
      image: "",
    },
    title: "",
    public: true,
    professional_summary: "",
    skills: [],
    experience: [],
    education: [],
    template: "classic",
    accent_color: "",
    project: [],
    updatedAt: new Date(Date.now()),
    createdAt: new Date(Date.now()),
  });

  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(0);

  const sections = [
    { id: "personal_info", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: FolderIcon },
    { id: "skills", name: "Skills", icon: Sparkles },
  ];

  const activeSection = sections[activeSectionIndex];

  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateType>("classic");
  const [selectedColor, setSelectedColor] = useState<string>("#3B82F6");

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [removeBackground, setRemoveBackground] = useState<boolean>(false);

  const form = useForm<z.infer<typeof updateResumeSchema>>({
    resolver: zodResolver(updateResumeSchema),
    defaultValues: {
      professional_summary: resumeData.professional_summary,
      personal_info: {
        full_name: resumeData.personal_info.full_name,
        email: resumeData.personal_info.email,
        phone: resumeData.personal_info.phone,
        location: resumeData.personal_info.location,
        profession: resumeData.personal_info.profession,
        linkedin: resumeData.personal_info.linkedin,
        website: resumeData.personal_info.website,
      },
      experience: resumeData.experience,
      education: resumeData.education,
      project: resumeData.project,
      skills: resumeData.skills,
    },
  });

  useEffect(() => {
    const loadExistingResume = async () => {
      const resume = resumes.find((resume) => resume._id === resumeId);
      if (resume) {
        setResumeData(resume);
        document.title = resume.title;

        await new Promise((resolve) => setTimeout(resolve, 0));

        form.setValue("professional_summary", resume.professional_summary);
        form.setValue(
          "personal_info.full_name",
          resume.personal_info.full_name
        );
        form.setValue("personal_info.email", resume.personal_info.email);
        form.setValue("personal_info.phone", resume.personal_info.phone);
        form.setValue("personal_info.location", resume.personal_info.location);
        form.setValue(
          "personal_info.profession",
          resume.personal_info.profession
        );
        form.setValue("personal_info.linkedin", resume.personal_info.linkedin);
        form.setValue("personal_info.website", resume.personal_info.website);
        form.setValue("experience", resume.experience);
        form.setValue("education", resume.education);
        form.setValue("project", resume.project);
        form.setValue("skills", resume.skills);

        if (
          resume.personal_info.image &&
          typeof resume.personal_info.image === "string"
        ) {
          const file = await urlToFile(resume.personal_info.image);
          form.setValue("personal_info.image", file);
          setProfileImage(file);
        }

        if (resume.accent_color) {
          setSelectedColor(resume.accent_color);
        }

        if (resume.template) {
          setSelectedTemplate(resume.template);
        }
      }
    };

    loadExistingResume();
  }, []);

  useEffect(() => {
    const subscription = form.watch((values) => {
      setResumeData((prev) => ({
        ...prev,
        ...(values as Partial<ResumeType>),
      }));
    });

    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    if (profileImage) {
      const imageURL = URL.createObjectURL(profileImage);
      setResumeData((prev) => ({
        ...prev,
        personal_info: { ...prev.personal_info, image: imageURL },
      }));

      return () => URL.revokeObjectURL(imageURL);
    } else {
      setResumeData((prev) => ({
        ...prev,
        personal_info: { ...prev.personal_info, image: "" },
      }));
    }
  }, [profileImage, selectedTemplate]);

  const updateResumeHandler = (data: z.infer<typeof updateResumeSchema>) => {
    try {
      console.log(data);
    } catch (error) {
      toast.error("Internal server error", {
        description: "Something went wrong. Please try again.",
      });
    }
  };

  useEffect(() => {
    const errors = form.formState.errors;

    const getFirstError = (errorObj: any): string | null => {
      for (const key in errorObj) {
        const error = errorObj[key];

        if (error?.message) {
          return error.message;
        } else if (Array.isArray(error)) {
          for (const item of error) {
            if (item) {
              const nestedError = getFirstError(item);
              if (nestedError) return nestedError;
            }
          }
        } else if (typeof error === "object") {
          const nestedError = getFirstError(error);
          if (nestedError) return nestedError;
        }
      }
      return null;
    };

    const firstError = getFirstError(errors);

    if (firstError) {
      toast.error(firstError);
    }
  }, [form.formState.errors]);

  useEffect(() => {
    console.log("Form Education :", form.getValues("education"));
  }, [form.getValues("education")]);

  const changeResumeVisibility = async () => {
    setResumeData((prev) => ({ ...prev, public: !prev.public }));
  };

  const resumePdfRef = useRef<HTMLDivElement | null>(null);

  const downloadResumeHandler = useReactToPrint({
    contentRef: resumePdfRef,
    documentTitle: resumeData.title,
  });

  return (
    <div>
      <Container className={"space-y-4"}>
        <Link
          href={"/dashboard"}
          className={
            "inline-flex items-center gap-2 hover:text-green-700 hover-effect"
          }
        >
          <ArrowLeftIcon className={"size-4"} />
          <span>Back To Dashboard</span>
        </Link>
        <div className={"grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-4"}>
          {/* Left Panel - Form */}
          <div
            className={
              "relative lg:col-span-5 bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-6 h-fit"
            }
          >
            {/* progress bar using activeSectionIndex */}
            <hr
              className={
                "absolute top-0 left-0 right-0 border-2 border-gray-200"
              }
            />
            <hr
              className={
                "absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-green-500 to-green-600 border-none hover-effect"
              }
              style={{
                width: `${(activeSectionIndex * 100) / (sections.length - 1)}%`,
              }}
            />

            <div
              className={
                "flex items-center justify-between gap-3 flex-wrap border-b border-gray-300 pb-2"
              }
            >
              {/* Button to change template and color */}
              <div className={"flex items-center gap-2"}>
                {/* Template Drop Menu */}
                <TemplateSelector
                  selectedTemplate={selectedTemplate}
                  setSelectedTemplate={setSelectedTemplate}
                  setResumeData={setResumeData}
                />

                {/* Color Picker */}
                <ColorPicker
                  selectedColor={selectedColor}
                  setSelectedColor={setSelectedColor}
                  setResumeData={setResumeData}
                />
              </div>

              {/* Sections Navigation */}
              <div className={"flex items-center gap-2 ml-auto"}>
                {activeSectionIndex !== 0 && (
                  <Button
                    variant={"ghost"}
                    size={"sm"}
                    onClick={() => setActiveSectionIndex((prev) => prev - 1)}
                    className={"text-sm"}
                  >
                    <ChevronLeft /> Previews
                  </Button>
                )}
                {activeSectionIndex !== sections.length - 1 && (
                  <Button
                    variant={"ghost"}
                    size={"sm"}
                    onClick={() => setActiveSectionIndex((prev) => prev + 1)}
                    className={"text-sm"}
                  >
                    Next <ChevronRight />
                  </Button>
                )}
              </div>
            </div>

            {/* Update Resume Form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(updateResumeHandler)}
                className={"space-y-4"}
              >
                {activeSection.id === "personal_info" && (
                  <PersonalInfoForm
                    form={form}
                    profileImage={profileImage}
                    setProfileImage={setProfileImage}
                    removeBackground={removeBackground}
                    setRemoveBackground={setRemoveBackground}
                    setResumeData={setResumeData}
                  />
                )}

                {activeSection.id === "summary" && (
                  <ProfessionnalSummary form={form} />
                )}

                {activeSection.id === "experience" && (
                  <ExperienceForm
                    form={form}
                    resumeData={resumeData}
                  />
                )}

                {activeSection.id === "education" && (
                  <EducationFrom
                    form={form}
                  />
                )}

                {activeSection.id === "projects" && (
                  <ProjectForm
                    form={form}
                  />
                )}

                {activeSection.id === "skills" && (
                  <SkillsForm
                    resumeData={resumeData}
                    setResumeData={setResumeData}
                  />
                )}

                <Button
                  variant={"primary"}
                  type="submit"
                  className={"w-full rounded-sm"}
                >
                  Save
                </Button>
              </form>
            </Form>
          </div>

          {/* Right Panel - Preview */}
          <div className={"lg:col-span-7"}>
            <div className={"relative w-full"}>
              <div
                className={
                  "absolute bottom-2 left-0 right-0 flex items-center justify-end gap-2"
                }
              >
                {resumeData.public && (
                  <ShareResume
                    resumeId={resumeData._id}
                    title={resumeData.title}
                  />
                )}
                <Button
                  variant={"purple"}
                  className={
                    "hover:from-purple-100 hover:to-purple-200 hover:ring-0 duration-300 border border-purple-600"
                  }
                  onClick={changeResumeVisibility}
                >
                  {resumeData.public ? (
                    <>
                      <EyeOffIcon /> Private
                    </>
                  ) : (
                    <>
                      <EyeIcon /> Public
                    </>
                  )}
                </Button>
                <Button
                  variant={"green"}
                  className={
                    "hover:from-green-100 hover:to-green-200 hover:ring-0 duration-300 border border-green-600"
                  }
                  onClick={downloadResumeHandler}
                >
                  <DownloadIcon />
                  Download
                </Button>
              </div>
            </div>

            {/* Resume Preview */}
            <div>
              <div
                className={
                  "sm:hidden text-center py-12 px-4 bg-white border border-gray-200 rounded-lg shadow-sm"
                }
              >
                <ScreenShareOff
                  className={"size-28 mx-auto mb-3 text-gray-300"}
                />
                <Parag
                  className={
                    "text-base xs:text-lg font-bold text-gray-800 mb-2"
                  }
                >
                  Resume Preview Not Available
                </Parag>
                <Parag>
                  For a better experience, please switch to a larger screen or
                  download your resume to view it.
                </Parag>
              </div>
              <div ref={resumePdfRef} className={"hidden sm:block"}>
                <ResumePreview
                  resume={resumeData}
                  template={resumeData.template}
                  accentColor={resumeData.accent_color}
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default BuilderRoute;
