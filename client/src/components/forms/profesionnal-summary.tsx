import React, { Dispatch, SetStateAction, useState } from "react";
import { Button } from "../ui/button";
import { LoaderCircle, Sparkles } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import z from "zod";
import { updateResumeSchema } from "@/lib/schemas/resume.schema";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { enhanceTextAction } from "@/action/resume.action";
import { ResumeType } from "@/types";

interface ProfessionnalSummaryProps {
  form: UseFormReturn<z.infer<typeof updateResumeSchema>>;
  setResumeData: Dispatch<SetStateAction<ResumeType>>;
}

const ProfessionnalSummary = ({
  form,
  setResumeData,
}: ProfessionnalSummaryProps) => {
  const [enhanceLoading, setEnhanceLoading] = useState<boolean>(false);

  const enhanceProfesionnalSummaryHandler = async () => {
    try {
      setEnhanceLoading(true);
      const text = form.getValues("professional_summary");
      const result = await enhanceTextAction("summary", text);

      if (result.success) {
        if (result.text) {
          form.setValue("professional_summary", result.text.trim());
          setResumeData((prev) => ({
            ...prev,
            professional_summary: result.text?.trim() as string,
          }));
        }
        return;
      } else {
        toast.error("Internal server error", {
          description: "Something went wrong. Please try again.",
        });
        return;
      }
    } catch (error) {
      console.log("Enhance Profesionnal Summary Hanlder Error :");
      console.log(error);
      toast.error("Internal server error", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setEnhanceLoading(false);
    }
  };
  return (
    <div className={"space-y-6"}>
      <div className={"flex flex-wrap items-center justify-between gap-3"}>
        <div>
          <h3 className={"text-base xs:text-lg font-semibold text-gray-900"}>
            Professional Summary
          </h3>
          <p className={"text-xs xs:text-sm text-gray-500"}>
            Add summary for your resume here
          </p>
        </div>
        <Button
          variant={"purple"}
          size={"sm"}
          type={"button"}
          className={"ml-auto [&_svg]:size-3.5 min-w-24"}
          disabled={
            form.getValues("professional_summary").trim() === "" ||
            enhanceLoading
          }
          onClick={enhanceProfesionnalSummaryHandler}
        >
          {enhanceLoading ? (
            <>
              <LoaderCircle className={"animate-spin"} /> Enhancing...
            </>
          ) : (
            <>
              <Sparkles /> AI Enhance
            </>
          )}
        </Button>
      </div>
      <FormField
        control={form.control}
        name="professional_summary"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea
                placeholder="Write a compelling professional summary that highlights your key strengths and career objectives..."
                className="resize-none h-48"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  setResumeData((prev) => ({
                    ...prev,
                    professional_summary: e.target.value,
                  }));
                }}
              />
            </FormControl>
            <FormDescription
              className={"text-[10px] xs:text-xs text-center text-gray-500"}
            >
              Tip: Keep it concise (3-4 sentences) and focus on your most
              relevant achievements and skills.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ProfessionnalSummary;
