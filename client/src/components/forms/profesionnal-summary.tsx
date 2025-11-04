import React from "react";
import { Button } from "../ui/button";
import { Sparkles } from "lucide-react";
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

interface ProfessionnalSummaryProps {
  form: UseFormReturn<z.infer<typeof updateResumeSchema>>;
}

const ProfessionnalSummary = ({ form }: ProfessionnalSummaryProps) => {
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
          className={"ml-auto [&_svg]:size-3.5"}
          disabled={form.getValues("professional_summary").trim() === ""}
        >
          <Sparkles /> AI Enhance
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
