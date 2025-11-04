import { ResumeType, TemplateType } from "@/types";
import { Dispatch, SetStateAction } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Check, Layout } from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplateSelectorProps {
  selectedTemplate: TemplateType;
  setSelectedTemplate: Dispatch<SetStateAction<TemplateType>>;
  setResumeData: Dispatch<SetStateAction<ResumeType>>;
}

const TemplateSelector = ({
  selectedTemplate,
  setSelectedTemplate,
  setResumeData,
}: TemplateSelectorProps) => {
  const templates: {
    id: TemplateType;
    title: string;
    description: string;
  }[] = [
    {
      id: "classic",
      title: "Classic",
      description:
        "A clean, traditional resume format with clear sections and professional typography",
    },
    {
      id: "modern",
      title: "Modern",
      description:
        "Sleek design with strategic use of color and modern font choices",
    },
    {
      id: "minimal-image",
      title: "Minimal Image",
      description: "Minimal design with a single image and clean typography",
    },
    {
      id: "minimal",
      title: "Minimal",
      description: "Ultra-clean design that puts your content front and center",
    },
  ];

  const handleChangeTemplate = (template: TemplateType) => {
    setSelectedTemplate(template);
    setResumeData((prev) => ({ ...prev, template }));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"blue"} size="sm">
          <Layout /> Template
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="w-full sm:w-80 p-2 rounded-sm space-y-2"
      >
        {templates.map((template) => {
          const isSelected = selectedTemplate === template.id;

          return (
            <div
              key={template.id}
              className={cn(
                "relative p-2 border rounded-sm flex flex-col gap-2 cursor-pointer",
                isSelected
                  ? "bg-blue-100 border-blue-400"
                  : "bg-white border-gray-300"
              )}
              onClick={() => handleChangeTemplate(template.id)}
            >
              <h3
                className={
                  "text-sm xs:text-base font-semibold capitalize text-black/80"
                }
              >
                {template.title}
              </h3>
              <p
                className={
                  "text-[11px] xs:text-xs italic p-2 rounded-sm text-slate-700 bg-blue-50"
                }
              >
                {template.description}
              </p>
              {isSelected && (
                <span
                  className={
                    "absolute top-2 right-2 size-5 flex items-center justify-center bg-blue-500 text-white rounded-full"
                  }
                >
                  <Check className={"size-3"} />
                </span>
              )}
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TemplateSelector;
