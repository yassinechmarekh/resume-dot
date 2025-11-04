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

interface UpdateResumeTitleFormProps {
  resumeTitle: string;
}

const UpdateResumeTitleForm = ({ resumeTitle }: UpdateResumeTitleFormProps) => {
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
      console.log(data);
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
        <Button variant={"primary"} type="submit" className={"w-full"}>
          Update Title
        </Button>
      </form>
    </Form>
  );
};

export default UpdateResumeTitleForm;
