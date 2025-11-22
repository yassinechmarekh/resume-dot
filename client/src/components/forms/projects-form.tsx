"use client";

import { ProjectType, ResumeType } from "@/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { FolderIcon, LoaderCircle, Plus, Sparkles, Trash2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Input } from "../ui/input";
import { InputTypes } from "@/lib/constants";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { UseFormReturn } from "react-hook-form";
import z from "zod";
import { updateResumeSchema } from "@/lib/schemas/resume.schema";
import { enhanceTextAction } from "@/action/resume.action";
import { toast } from "sonner";

interface ProjectFormProps {
  form: UseFormReturn<z.infer<typeof updateResumeSchema>>;
  resumeData: ResumeType;
  setResumeData: Dispatch<SetStateAction<ResumeType>>;
}

const ProjectForm = ({ form, resumeData, setResumeData }: ProjectFormProps) => {
  const projects = resumeData.project;
  const [enhanceLoading, setEnhanceLoading] = useState<boolean[]>([]);

  const addProject = () => {
    const newProject: ProjectType = {
      name: "",
      type: "",
      description: "",
    };
    form.setValue("project", [newProject, ...projects]);
    setResumeData((prev) => ({
      ...prev,
      project: [newProject, ...prev.project],
    }));
  };

  const removeProject = (index: number) => {
    const updatedProjects = projects.filter((_, i) => i !== index);
    form.setValue("project", updatedProjects);
    setResumeData((prev) => ({ ...prev, project: updatedProjects }));
  };

  const updateProject = (
    index: number,
    field: keyof ProjectType,
    value: string
  ) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    form.setValue("project", updated);
    setResumeData((prev) => ({ ...prev, project: updated }));
  };

  useEffect(() => {
    setEnhanceLoading((prev) => {
      if (projects.length > prev.length) {
        return [...prev, ...Array(projects.length - prev.length).fill(false)];
      } else if (projects.length < prev.length) {
        return prev.slice(0, projects.length);
      }

      return prev;
    });
  }, [projects.length]);

  const setLoadingFor = (index: number, value: boolean) => {
    setEnhanceLoading((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const enhancedProjectDescriptionHanlder = async (index: number) => {
    try {
      setLoadingFor(index, true);
      const text = projects[index].description;
      const result = await enhanceTextAction("project_description", text);

      if (result.success) {
        if (result.text) {
          updateProject(index, "description", result.text.trim());
        }
        return;
      } else {
        toast.error("Internal server error", {
          description: "Something went wrong. Please try again.",
        });
        return;
      }
    } catch (error) {
      console.log("Enhance Project Description Hanlder Error :");
      console.log(error);
      toast.error("Internal server error", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setLoadingFor(index, false);
    }
  };

  return (
    <div className={"space-y-6"}>
      <div className={"flex flex-wrap items-center justify-between gap-3"}>
        <div>
          <h3 className={"text-base xs:text-lg font-semibold text-gray-900"}>
            Projects
          </h3>
          <p className={"text-xs xs:text-sm text-gray-500"}>
            Add your projects
          </p>
        </div>
        <Button
          variant={"green"}
          size={"sm"}
          type="button"
          className={"ml-auto"}
          onClick={addProject}
        >
          <Plus /> Add Project
        </Button>
      </div>
      <div>
        {projects.length === 0 ? (
          <div className={"text-center py-8 text-gray-500"}>
            <FolderIcon className={"size-12 mx-auto mb-3 text-gray-300"} />
            <p>No project added yet.</p>
            <p className={"text-sm"}>Click "Add Project" to get started.</p>
          </div>
        ) : (
          <Accordion
            type="single"
            collapsible
            defaultValue={`project-0`}
            className={"space-y-4"}
          >
            {projects.map((project, index) => (
              <div
                key={index}
                className={"p-3 border border-gray-700 rounded-sm"}
              >
                <AccordionItem value={`project-${index}`}>
                  <AccordionTrigger className={"py-0 hover:no-underline"}>
                    <div
                      className={
                        "flex items-center justify-between gap-3 w-full"
                      }
                    >
                      <h3
                        className={
                          "text-sm xs:text-base text-gray-700 font-semibold"
                        }
                      >
                        Project #{index + 1}
                      </h3>
                      <Trash2
                        className={
                          "size-4 hover:scale-105 text-red-500 hover:text-red-600 transition-all cursor-pointer"
                        }
                        onClick={() => removeProject(index)}
                      />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className={"space-y-2 mt-3"}>
                    <div className={"flex flex-col-reverse gap-1"}>
                      <Input
                        type={InputTypes.TEXT}
                        placeholder="Ex : Blogify"
                        className={"h-8 text-xs xs:text-sm peer"}
                        value={project.name}
                        onChange={(e) =>
                          updateProject(index, "name", e.target.value)
                        }
                      />
                      <Label
                        className={
                          "text-xs xs:text-sm font-semibold text-gray-500 peer-focus-visible:text-green-600"
                        }
                      >
                        Project Name
                      </Label>
                    </div>
                    <div className={"flex flex-col-reverse gap-1"}>
                      <Input
                        type={InputTypes.TEXT}
                        placeholder="Ex : Social Media Platform"
                        className={"h-8 text-xs xs:text-sm peer"}
                        value={project.type}
                        onChange={(e) =>
                          updateProject(index, "type", e.target.value)
                        }
                      />
                      <Label
                        className={
                          "text-xs xs:text-sm font-semibold text-gray-500 peer-focus-visible:text-green-600"
                        }
                      >
                        Project Type
                      </Label>
                    </div>
                    <div className={"flex flex-col-reverse gap-2"}>
                      <Textarea
                        className={"min-h-32 text-xs xs:text-sm peer"}
                        placeholder="Describe your key responsibilities and achievements..."
                        value={project.description}
                        onChange={(e) =>
                          updateProject(index, "description", e.target.value)
                        }
                      />
                      <div
                        className={
                          "peer-focus-visible:text-green-600 flex items-center justify-between gap-2"
                        }
                      >
                        <Label
                          className={
                            "text-xs xs:text-sm font-semibold text-gray-500"
                          }
                        >
                          Project Description
                        </Label>
                        <Button
                          className={
                            "text-[10px] xs:text-xs [&_svg]:size-3 h-6 rounded-sm"
                          }
                          variant={"purple"}
                          size={"sm"}
                          type={"button"}
                          disabled={
                            projects[index].description.trim() === "" ||
                            enhanceLoading[index]
                          }
                          onClick={() =>
                            enhancedProjectDescriptionHanlder(index)
                          }
                        >
                          {enhanceLoading[index] ? (
                            <>
                              <LoaderCircle className={"animate-spin"} />{" "}
                              Enhancing...
                            </>
                          ) : (
                            <>
                              <Sparkles /> Enhance With AI
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </div>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
};

export default ProjectForm;
