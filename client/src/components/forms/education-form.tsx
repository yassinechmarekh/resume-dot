"use client";

import { EducationType, ResumeType } from "@/types";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Button } from "../ui/button";
import { GraduationCap, Plus, Sparkles, Trash2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Input } from "../ui/input";
import { InputTypes } from "@/lib/constants";
import { Label } from "../ui/label";
import { UseFormReturn } from "react-hook-form";
import z from "zod";
import { updateResumeSchema } from "@/lib/schemas/resume.schema";

interface EducationFromProps {
  form: UseFormReturn<z.infer<typeof updateResumeSchema>>;
  resumeData: ResumeType;
  setResumeData: Dispatch<SetStateAction<ResumeType>>;
}

const EducationFrom = ({ form, resumeData, setResumeData }: EducationFromProps) => {
  // const educationItems = form.getValues("education") || [];
  const educationItems = resumeData.education;

  const addEducationItem = () => {
    const newEducationItem: EducationType = {
      institution: "",
      degree: "",
      field: "",
      graduation_date: new Date(),
    };
    form.setValue("education", [newEducationItem, ...educationItems]);
    setResumeData((prev) => ({
      ...prev,
      education: [newEducationItem, ...prev.education],
    }));
  };

  const removeEducationItem = (index: number) => {
    const updatedEducationItems = educationItems.filter((_, i) => i !== index);
    form.setValue("education", updatedEducationItems);
    setResumeData((prev) => ({ ...prev, education: updatedEducationItems }));
  };

  const updateEducationItem = (
    index: number,
    field: keyof EducationType,
    value: string | Date
  ) => {
    const updated = [...educationItems];
    updated[index] = { ...updated[index], [field]: value };
    form.setValue("education", updated);
    setResumeData((prev) => ({ ...prev, education: updated }));
  };

  return (
    <div className={"space-y-6"}>
      <div className={"flex flex-wrap items-center justify-between gap-3"}>
        <div>
          <h3 className={"text-base xs:text-lg font-semibold text-gray-900"}>
            Education
          </h3>
          <p className={"text-xs xs:text-sm text-gray-500"}>
            Add your education details
          </p>
        </div>
        <Button
          variant={"green"}
          size={"sm"}
          type="button"
          className={"ml-auto"}
          onClick={addEducationItem}
        >
          <Plus /> Add Education
        </Button>
      </div>

      {educationItems.length === 0 ? (
        <div className={"text-center py-8 text-gray-500"}>
          <GraduationCap className={"size-12 mx-auto mb-3 text-gray-300"} />
          <p>No education added yet.</p>
          <p className={"text-sm"}>Click "Add Education" to get started.</p>
        </div>
      ) : (
        <Accordion
          type="single"
          collapsible
          defaultValue={`education-0`}
          className={"space-y-4"}
        >
          {educationItems.map((educationItem, index) => (
            <div
              key={index}
              className={"p-3 border border-gray-700 rounded-sm"}
            >
              <AccordionItem value={`education-${index}`}>
                <AccordionTrigger className={"py-0 hover:no-underline"}>
                  <div
                    className={"flex items-center justify-between gap-3 w-full"}
                  >
                    <h3
                      className={
                        "text-sm xs:text-base text-gray-700 font-semibold"
                      }
                    >
                      Education #{index + 1}
                    </h3>
                    <Trash2
                      className={
                        "size-4 hover:scale-105 text-red-500 hover:text-red-600 transition-all cursor-pointer"
                      }
                      onClick={() => removeEducationItem(index)}
                    />
                  </div>
                </AccordionTrigger>
                <AccordionContent className={"space-y-2 mt-3"}>
                  <div className={"flex flex-col-reverse gap-1"}>
                    <Input
                      type={InputTypes.TEXT}
                      placeholder="Ex : Faculty of Science and Technology"
                      className={"h-8 text-xs xs:text-sm peer"}
                      value={educationItem.institution}
                      onChange={(e) =>
                        updateEducationItem(
                          index,
                          "institution",
                          e.target.value
                        )
                      }
                    />
                    <Label
                      className={
                        "text-xs xs:text-sm font-semibold text-gray-500 peer-focus-visible:text-green-600"
                      }
                    >
                      Institution Name
                    </Label>
                  </div>
                  <div className={"flex flex-col-reverse gap-1"}>
                    <Input
                      type={InputTypes.TEXT}
                      placeholder="Ex : Bachelor's, Master's"
                      className={"h-8 text-xs xs:text-sm peer"}
                      value={educationItem.degree}
                      onChange={(e) =>
                        updateEducationItem(index, "degree", e.target.value)
                      }
                    />
                    <Label
                      className={
                        "text-xs xs:text-sm font-semibold text-gray-500 peer-focus-visible:text-green-600"
                      }
                    >
                      Degree
                    </Label>
                  </div>
                  <div className={"flex flex-col-reverse gap-1"}>
                    <Input
                      type={InputTypes.TEXT}
                      placeholder="Ex : Computer Science"
                      className={"h-8 text-xs xs:text-sm peer"}
                      value={educationItem.field}
                      onChange={(e) =>
                        updateEducationItem(index, "field", e.target.value)
                      }
                    />
                    <Label
                      className={
                        "text-xs xs:text-sm font-semibold text-gray-500 peer-focus-visible:text-green-600"
                      }
                    >
                      Field of Study
                    </Label>
                  </div>
                  <div className={"flex flex-col-reverse gap-1"}>
                    <Input
                      type={InputTypes.MONTH}
                      className={"h-8 text-xs xs:text-sm peer"}
                      value={
                        educationItem.graduation_date
                          ? new Date(educationItem.graduation_date)
                              .toISOString()
                              .slice(0, 7)
                          : ""
                      }
                      onChange={(e) =>
                        updateEducationItem(
                          index,
                          "graduation_date",
                          new Date(e.target.value)
                        )
                      }
                    />
                    <Label
                      className={
                        "text-xs xs:text-sm font-semibold text-gray-500 peer-focus-visible:text-green-600"
                      }
                    >
                      Graduation Date
                    </Label>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </div>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default EducationFrom;
