"use client";

import { ResumeType } from "@/types";
import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "../ui/button";
import { Plus, Sparkles, X } from "lucide-react";
import { Input } from "../ui/input";
import { InputTypes } from "@/lib/constants";
import { UseFormReturn } from "react-hook-form";
import z from "zod";
import { updateResumeSchema } from "@/lib/schemas/resume.schema";

interface SkillsFormProps {
  form: UseFormReturn<z.infer<typeof updateResumeSchema>>;
  resumeData: ResumeType;
  setResumeData: Dispatch<SetStateAction<ResumeType>>;
}

const SkillsForm = ({ form, resumeData, setResumeData }: SkillsFormProps) => {
  const skills = resumeData.skills;
  // const skills = form.getValues("skills") || [];
  const [skill, setSkill] = useState<string>("");

  const addSkill = () => {
    const normalizedSkill = skill.trim().toLowerCase();

    if (!normalizedSkill) return;

    const hasDuplicate = skills.some(
      (s) => s.toLowerCase() === normalizedSkill
    );
    if (hasDuplicate) {
      setSkill("");
      return;
    }
    form.setValue("skills", [skill, ...skills]);
    setResumeData((prev) => ({ ...prev, skills: [skill, ...prev.skills] }));
    setSkill("");
  };

  const removeSkill = (index: number) => {
    const updated = skills.filter((_, i) => i !== index);
    form.setValue("skills", updated);
    setResumeData((prev) => ({ ...prev, skills: updated }));
  };

  return (
    <div className={"space-y-6"}>
      <div>
        <h3 className={"text-base xs:text-lg font-semibold text-gray-900"}>
          Skills
        </h3>
        <p className={"text-xs xs:text-sm text-gray-500"}>
          Add your technical and soft skills
        </p>
      </div>
      <div className={"space-y-4"}>
        <div className={"flex items-center gap-2"}>
          <Input
            type={InputTypes.TEXT}
            placeholder="Enter a skill (e.g., JavaScript, Project Management)"
            className={
              "text-xs xs:text-sm focus-visible:border-blue-600 focus-visible:text-blue-600 focus-visible:placeholder:text-blue-600 rounded-sm selection:bg-blue-600"
            }
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          />
          <Button
            variant={"primary"}
            className={
              "bg-blue-600 hover:bg-blue-700 text-xs xs:text-sm rounded-sm"
            }
            type={'button'}
            onClick={addSkill}
          >
            <Plus /> Add
          </Button>
        </div>
        {skills.length === 0 ? (
          <div className={"text-center py-8 text-gray-500"}>
            <Sparkles className={"size-12 mx-auto mb-3 text-gray-300"} />
            <p>No skills added yet.</p>
            <p className={"text-sm"}>
              Add your technical and soft skills above.
            </p>
          </div>
        ) : (
          <div className={"flex flex-wrap items-center gap-3"}>
            {skills.map((item, index) => (
              <div
                key={index}
                className={
                  "flex items-center gap-1 text-xs xs:text-sm bg-blue-50 text-blue-800 py-1 px-3 rounded-full border border-blue-800"
                }
              >
                <span className={"capitalize"}>{item}</span>
                <X className={"size-3"} onClick={() => removeSkill(index)} />
              </div>
            ))}
          </div>
        )}
        <p
          className={
            "bg-blue-50 text-blue-800 text-xs xs:text-sm p-3 rounded-lg"
          }
        >
          <span className={"font-bold"}>Tip:</span> Add 8-12 relevant skills.
          Include both technical skills (programming languages, tools) and soft
          skills (leadership, communication).
        </p>
      </div>
    </div>
  );
};

export default SkillsForm;
