"use client";

import { Briefcase, LoaderCircle, Plus, Sparkles, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { ExperinceType, ResumeType } from "@/types";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { InputTypes } from "@/lib/constants";
import { FormDescription } from "../ui/form";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { UseFormReturn } from "react-hook-form";
import z from "zod";
import { updateResumeSchema } from "@/lib/schemas/resume.schema";
import { enhanceTextAction } from "@/action/resume.action";
import { toast } from "sonner";

interface ExperienceFormProps {
  resumeData: ResumeType;
  setResumeData: Dispatch<SetStateAction<ResumeType>>;
  form: UseFormReturn<z.infer<typeof updateResumeSchema>>;
}

const ExperienceForm = ({
  resumeData,
  setResumeData,
  form,
}: ExperienceFormProps) => {
  const experiences = resumeData.experience;
  const [enhanceLoading, setEnhanceLoading] = useState<boolean[]>([]);

  const addExperience = () => {
    const newExperience: ExperinceType = {
      company: "",
      position: "",
      description: "",
      start_date: new Date(),
      end_date: undefined,
      is_current: false,
    };
    form.setValue("experience", [newExperience, ...experiences]);
    setResumeData((prev) => ({
      ...prev,
      experience: [newExperience, ...prev.experience],
    }));
  };

  const removeExperience = (index: number) => {
    const updatedExperiences = experiences.filter((_, i) => i !== index);
    form.setValue("experience", updatedExperiences);
    setResumeData((prev) => ({
      ...prev,
      experience: updatedExperiences,
    }));
  };

  const updateExperience = (
    index: number,
    field: keyof ExperinceType,
    value: string | Date | boolean
  ) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    form.setValue("experience", updated);
    setResumeData((prev) => ({
      ...prev,
      experience: updated,
    }));
  };

  useEffect(() => {
    setEnhanceLoading((prev) => {
      if (experiences.length > prev.length) {
        return [
          ...prev,
          ...Array(experiences.length - prev.length).fill(false),
        ];
      } else if (experiences.length < prev.length) {
        return prev.slice(0, experiences.length);
      }

      return prev;
    });
  }, [experiences.length]);

  const setLoadingFor = (index: number, value: boolean) => {
    setEnhanceLoading((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const enhanceExperienceDescriptionHandler = async (index: number) => {
    try {
      setLoadingFor(index, true);
      const text = experiences[index].description;
      const result = await enhanceTextAction(
        "experience_job_description",
        text
      );

      if (result.success) {
        if (result.text) {
          updateExperience(index, "description", result.text.trim());
        }
        return;
      } else {
        toast.error("Internal server error", {
          description: "Something went wrong. Please try again.",
        });
        return;
      }
    } catch (error) {
      console.log("Enhance Experience Description Hanlder Error :");
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
            Professional Experience
          </h3>
          <p className={"text-xs xs:text-sm text-gray-500"}>
            Add your job experience
          </p>
        </div>
        <Button
          variant={"green"}
          size={"sm"}
          type="button"
          className={"ml-auto"}
          onClick={addExperience}
        >
          <Plus /> Add Experience
        </Button>
      </div>
      <div>
        {experiences.length === 0 ? (
          <div className={"text-center py-8 text-gray-500"}>
            <Briefcase className={"size-12 mx-auto mb-3 text-gray-300"} />
            <p>No work experience added yet.</p>
            <p className={"text-sm"}>Click "Add Experience" to get started.</p>
          </div>
        ) : (
          <Accordion
            type="single"
            collapsible
            defaultValue={`experience-0`}
            className={"space-y-4"}
          >
            {experiences.map((experience, index) => (
              <div
                key={index}
                className={"p-3 border border-gray-700 rounded-sm"}
              >
                <AccordionItem value={`experience-${index}`}>
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
                        Experience #{index + 1}
                      </h3>
                      <Trash2
                        className={
                          "size-4 hover:scale-105 text-red-500 hover:text-red-600 transition-all cursor-pointer"
                        }
                        onClick={() => removeExperience(index)}
                      />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className={"space-y-2 mt-3"}>
                    <div className={"flex flex-col-reverse gap-1"}>
                      <Input
                        type={InputTypes.TEXT}
                        placeholder="Ex : MT Informatique"
                        className={"h-8 text-xs xs:text-sm peer"}
                        value={experience.company}
                        onChange={(e) =>
                          updateExperience(index, "company", e.target.value)
                        }
                      />
                      <Label
                        className={
                          "text-xs xs:text-sm font-semibold text-gray-500 peer-focus-visible:text-green-600"
                        }
                      >
                        Company Name
                      </Label>
                    </div>
                    <div className={"flex flex-col-reverse gap-1"}>
                      <Input
                        type={InputTypes.TEXT}
                        placeholder="Ex : Web Developer"
                        className={"h-8 text-xs xs:text-sm peer"}
                        value={experience.position}
                        onChange={(e) =>
                          updateExperience(index, "position", e.target.value)
                        }
                      />
                      <Label
                        className={
                          "text-xs xs:text-sm font-semibold text-gray-500 peer-focus-visible:text-green-600"
                        }
                      >
                        Job Title
                      </Label>
                    </div>
                    <div className={"flex flex-col-reverse gap-1"}>
                      <Input
                        type={InputTypes.MONTH}
                        className={"h-8 text-xs xs:text-sm peer"}
                        value={new Date(experience.start_date)
                          .toISOString()
                          .slice(0, 7)}
                        onChange={(e) => {
                          updateExperience(
                            index,
                            "start_date",
                            new Date(e.target.value)
                          );
                        }}
                      />
                      <Label
                        className={
                          "text-xs xs:text-sm font-semibold text-gray-500 peer-focus-visible:text-green-600"
                        }
                      >
                        Start Date
                      </Label>
                    </div>
                    <div className={"flex flex-col-reverse gap-1"}>
                      <FormDescription className={"flex items-center gap-1"}>
                        <Checkbox
                          id="isCurrent"
                          checked={resumeData.experience[index].is_current}
                          className={"size-3 [&_svg]:size-2.5 rounded-[3px]"}
                          onCheckedChange={(checked) =>
                            updateExperience(index, "is_current", checked)
                          }
                        />
                        <Label
                          htmlFor="isCurrent"
                          className={"text-[10px] xs:text-xs"}
                        >
                          Currently working here
                        </Label>
                      </FormDescription>
                      <Input
                        type={InputTypes.MONTH}
                        className={"h-8 text-xs xs:text-sm peer"}
                        value={
                          experience.end_date
                            ? new Date(experience.end_date)
                                .toISOString()
                                .slice(0, 7)
                            : ""
                        }
                        disabled={resumeData.experience[index].is_current}
                        onChange={(e) =>
                          updateExperience(
                            index,
                            "end_date",
                            new Date(e.target.value)
                          )
                        }
                      />
                      <Label
                        className={
                          "text-xs xs:text-sm font-semibold text-gray-500 peer-focus-visible:text-green-600"
                        }
                      >
                        End Date
                      </Label>
                    </div>
                    <div className={"flex flex-col-reverse gap-2"}>
                      <Textarea
                        className={"min-h-32 text-xs xs:text-sm peer"}
                        placeholder="Describe your key responsibilities and achievements..."
                        value={experience.description}
                        onChange={(e) =>
                          updateExperience(index, "description", e.target.value)
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
                          Job Description
                        </Label>
                        <Button
                          className={
                            "text-[10px] xs:text-xs [&_svg]:size-3 h-6 rounded-sm"
                          }
                          variant={"purple"}
                          type={"button"}
                          size={"sm"}
                          disabled={
                            resumeData.experience[index].description.trim() ===
                              "" || enhanceLoading[index]
                          }
                          onClick={() =>
                            enhanceExperienceDescriptionHandler(index)
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

export default ExperienceForm;
