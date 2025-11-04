import React, { Dispatch, SetStateAction, useEffect } from "react";
import { Parag } from "../text";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { UseFormReturn } from "react-hook-form";
import z from "zod";
import {
  PersonalInfoSchema,
  updateResumeSchema,
} from "@/lib/schemas/resume.schema";
import {
  BriefcaseBusiness,
  CloudUpload,
  Globe,
  Image,
  Linkedin,
  Mail,
  MapPin,
  Paperclip,
  Phone,
  User,
} from "lucide-react";
import { InputTypes } from "@/lib/constants";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "../ui/file-upload";
import { Switch } from "../ui/switch";
import { PhoneInput } from "../ui/phone-input";
import { ResumeType } from "@/types";

interface PersonalInfoFormProps {
  form: UseFormReturn<z.infer<typeof updateResumeSchema>>;
  profileImage: File | null;
  setProfileImage: Dispatch<SetStateAction<File | null>>;
  removeBackground: boolean;
  setRemoveBackground: Dispatch<SetStateAction<boolean>>;
  setResumeData: Dispatch<SetStateAction<ResumeType>>;
}

const PersonalInfoForm = ({
  form,
  profileImage,
  setProfileImage,
  removeBackground,
  setRemoveBackground,
  setResumeData,
}: PersonalInfoFormProps) => {
  const fields: {
    key: keyof z.infer<typeof PersonalInfoSchema>;
    label: string;
    icon: any;
    type: InputTypes;
    required: boolean;
  }[] = [
    {
      key: "full_name",
      label: "Full Name",
      icon: User,
      type: InputTypes.TEXT,
      required: true,
    },
    {
      key: "email",
      label: "Email Address",
      icon: Mail,
      type: InputTypes.EMAIL,
      required: true,
    },
    {
      key: "phone",
      label: "Phone Number",
      icon: Phone,
      type: InputTypes.TEL,
      required: true,
    },
    {
      key: "location",
      label: "Location",
      icon: MapPin,
      type: InputTypes.TEXT,
      required: false,
    },
    {
      key: "profession",
      label: "Profession",
      icon: BriefcaseBusiness,
      type: InputTypes.TEXT,
      required: true,
    },
    {
      key: "linkedin",
      label: "LinkedIn Profile",
      icon: Linkedin,
      type: InputTypes.URL,
      required: false,
    },
    {
      key: "website",
      label: "Personal Website",
      icon: Globe,
      type: InputTypes.URL,
      required: false,
    },
  ];

  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif"],
    },
  };

  const handleFileChange = (files: File[] | null) => {
    const selected = files && files.length > 0 ? files[0] : null;
    setProfileImage(selected);

    form.setValue("personal_info.image", selected);

    form.trigger("personal_info.image");
  };

  return (
    <div>
      <h3 className={"text-base xs:text-lg font-semibold text-gray-900"}>
        Personal Information
      </h3>
      <p className={"text-xs xs:text-sm text-gray-600"}>
        Get started with personal information.
      </p>

      <div className={"space-y-4 mt-6"}>
        <div className={"space-y-2"}>
          <FormField
            control={form.control}
            name="personal_info.image"
            render={({ field }) => (
              <FormItem>
                <div className={"flex items-center gap-2"}>
                  <Image className={"size-4 text-gray-600"} />
                  <FormLabel
                    className={"text-xs xs:text-sm text-gray-600 font-medium"}
                  >
                    Select File
                  </FormLabel>
                  <span className={"text-red-600"}>*</span>
                </div>
                <FormControl>
                  <FileUploader
                    value={profileImage ? [profileImage] : null}
                    onValueChange={handleFileChange}
                    dropzoneOptions={dropZoneConfig}
                    className="relative bg-background rounded-lg p-2"
                  >
                    <FileInput
                      id="fileInput"
                      className="outline-dashed outline-1 outline-slate-500"
                    >
                      <div className="flex items-center justify-center flex-col p-8 w-full ">
                        <CloudUpload className="text-gray-500 w-10 h-10" />
                        <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>
                          &nbsp; or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          SVG, PNG, JPG or GIF
                        </p>
                      </div>
                    </FileInput>
                    <FileUploaderContent>
                      {profileImage && (
                        <FileUploaderItem key={profileImage.name} index={0}>
                          <Paperclip className="h-4 w-4 stroke-current" />
                          <span>{profileImage.name}</span>
                        </FileUploaderItem>
                      )}
                    </FileUploaderContent>
                  </FileUploader>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {profileImage && (
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>AI Background Remover</FormLabel>
                <FormDescription>
                  Check this option if you want to remove the background from
                  your profile image.
                </FormDescription>
              </div>

              <Switch
                checked={removeBackground}
                onCheckedChange={(checked: boolean) =>
                  setRemoveBackground(checked)
                }
                aria-readonly
              />
            </div>
          )}
        </div>

        {fields.map((item) => {
          const Icon = item.icon;

          return (
            <FormField
              key={item.key}
              control={form.control}
              name={`personal_info.${item.key}`}
              render={({ field }) => (
                <FormItem>
                  <div className={"flex items-center gap-2"}>
                    <Icon className={"size-4 text-gray-600"} />
                    <FormLabel
                      className={"text-xs xs:text-sm text-gray-600 font-medium"}
                    >
                      {item.label}
                    </FormLabel>
                    {item.required && <span className={"text-red-600"}>*</span>}
                  </div>
                  <FormControl>
                    {item.type === InputTypes.TEL ? (
                      <PhoneInput
                        placeholder={`Enter your ${item.label.toLowerCase()}`}
                        {...field}
                        defaultCountry="MA"
                      />
                    ) : (
                      <Input
                        placeholder={`Enter your ${item.label.toLowerCase()}`}
                        type={item.type}
                        {...field}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PersonalInfoForm;
