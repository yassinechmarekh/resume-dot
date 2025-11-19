"use client";

import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { InputTypes } from "@/lib/constants";
import z from "zod";
import { updateResumeTitleSchema } from "@/lib/schemas/resume.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionResponseType, ResumeType } from "@/types";
import { updateResumeAction } from "@/action/resume.action";
import { DialogClose } from "../ui/dialog";
import { Dispatch, SetStateAction } from "react";

interface UpdateResumeTitleFormProps {
  resumeId: string;
  resumeTitle: string;
  setResumes: Dispatch<SetStateAction<ResumeType[] | null>>;
}

const UpdateResumeTitleForm = ({
  resumeId,
  resumeTitle,
  setResumes,
}: UpdateResumeTitleFormProps) => {
  const form = useForm<z.infer<typeof updateResumeTitleSchema>>({
    resolver: zodResolver(updateResumeTitleSchema),
    defaultValues: {
      title: resumeTitle,
    },
  });

  const updateResumeTitleHandler = (
    data: z.infer<typeof updateResumeTitleSchema>
  ) => {
    try {
      toast.promise<ActionResponseType>(
        async () => {
          const result = await updateResumeAction(
            {
              title: data.title,
            },
            resumeId,
            null
          );

          if (!result.success) {
            throw result;
          }

          setResumes((prev) => {
            if (!prev) return prev;

            return prev.map((resume) =>
              resume._id === resumeId
                ? { ...resume, title: data.title }
                : resume
            );
          });

          return result;
        },
        {
          loading: "Updating...",
          success: (result) => result.message || "Resume updated successfully.",
          error: (result) =>
            result.message || "Something went wrong. Please try again.",
        }
      );
    } catch (error) {
      toast.error("Intenal server error", {
        description: "Something went wrong. Please try again",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(updateResumeTitleHandler)}
        className="w-full mt-3 space-y-3"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Enter resume title"
                  type={InputTypes.TEXT}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogClose asChild>
          <Button variant={"primary"} type="submit" className={"w-full"}>
            Update Title
          </Button>
        </DialogClose>
      </form>
    </Form>
  );
};

export default UpdateResumeTitleForm;
