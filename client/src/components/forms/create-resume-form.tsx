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
import { CreateResumeSchema } from "@/lib/schemas/resume.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionResponseType } from "@/types";
import { createResumeAction } from "@/action/resume.action";
import { useRouter } from "next/navigation";
import { DialogClose } from "../ui/dialog";

const CreateResumeForm = () => {
  const form = useForm<z.infer<typeof CreateResumeSchema>>({
    resolver: zodResolver(CreateResumeSchema),
    defaultValues: {
      title: "",
    },
  });

  const router = useRouter();

  const createResumeHandler = (data: z.infer<typeof CreateResumeSchema>) => {
    try {
      toast.promise<ActionResponseType>(
        async () => {
          const result = await createResumeAction(data);

          if (!result.success) {
            throw result;
          }

          return result;
        },
        {
          loading: "Creating...",
          success: (result) => {
            if (result.redirectTo) {
              router.push(result.redirectTo);
            }
            return result.message;
          },
          error: (result) => {
            return result.message || "Something went wrong. Please try again.";
          },
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
        <DialogClose asChild>
          <Button variant={"primary"} type="submit" className={"w-full"}>
            Create Resume
          </Button>
        </DialogClose>
      </form>
    </Form>
  );
};

export default CreateResumeForm;
