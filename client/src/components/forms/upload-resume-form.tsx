"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { CloudUpload, Paperclip } from "lucide-react";
import { Button } from "../ui/button";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "../ui/file-upload";
import { InputTypes } from "@/lib/constants";
import { UploadResumeSchema } from "@/lib/schemas/resume.schema";
import pdfToText from "react-pdftotext";
import { ActionResponseType } from "@/types";
import { uploadResumeAction } from "@/action/resume.action";
import { useRouter } from "next/navigation";
import { DialogClose } from "../ui/dialog";

const UploadResumeForm = () => {
  const [file, setFile] = useState<File | null>(null);

  const router = useRouter();

  const dropZoneConfig = {
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
    maxSize: 1024 * 1024 * 4, // 4mb
    maxFiles: 1,
  };

  const form = useForm<z.infer<typeof UploadResumeSchema>>({
    resolver: zodResolver(UploadResumeSchema),
    defaultValues: {
      title: "",
      resume: undefined,
    },
  });

  const handleFileChange = (files: File[] | null) => {
    const selected = files && files.length > 0 ? files[0] : null;
    setFile(selected);

    form.setValue("resume", selected);

    form.trigger("resume");
  };

  const uploadResumeHandler = async (
    data: z.infer<typeof UploadResumeSchema>
  ) => {
    try {
      data.resume = await pdfToText(data.resume);
      toast.promise<ActionResponseType>(
        async () => {
          const result = await uploadResumeAction(data);

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
      console.error("Form submission error", error);
      toast.error("Intenal server error", {
        description: "Something went wrong. Please try again",
      });
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(uploadResumeHandler)}
        className="w-full mt-3 space-y-3"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
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

        <FormField
          control={form.control}
          name="resume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select resume file</FormLabel>
              <FormControl>
                <FileUploader
                  value={file ? [file] : []}
                  onValueChange={handleFileChange}
                  dropzoneOptions={dropZoneConfig}
                  className="relative bg-background rounded-lg p-2"
                >
                  <FileInput
                    id="resume"
                    className="outline-dashed outline-1 outline-slate-500"
                  >
                    <div className="flex items-center justify-center flex-col p-8 w-full ">
                      <CloudUpload className="text-gray-500 w-10 h-10" />
                      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>
                        &nbsp; or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Accept only PDF format
                      </p>
                    </div>
                  </FileInput>
                  <FileUploaderContent>
                    {file && (
                      <FileUploaderItem key={file.name} index={0}>
                        <Paperclip className="h-4 w-4 stroke-current" />
                        <span>{file.name}</span>
                      </FileUploaderItem>
                    )}
                  </FileUploaderContent>
                </FileUploader>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogClose asChild>
          <Button variant={"primary"} type="submit" className={"w-full"}>
            Upload
          </Button>
        </DialogClose>
      </form>
    </Form>
  );
};

export default UploadResumeForm;
