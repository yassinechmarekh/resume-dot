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
import { createResumeSchema } from "@/lib/schemas/resume.schema";
import { zodResolver } from "@hookform/resolvers/zod";

const CreateResumeForm = () => {
  const form = useForm<z.infer<typeof createResumeSchema>>({
    resolver: zodResolver(createResumeSchema),
    defaultValues: {
      title: "",
    },
  });

  const createResumeHandler = (data: z.infer<typeof createResumeSchema>) => {
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
        onSubmit={form.handleSubmit(createResumeHandler)}
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
          Create Resume
        </Button>
      </form>
    </Form>
  );
};

export default CreateResumeForm;
