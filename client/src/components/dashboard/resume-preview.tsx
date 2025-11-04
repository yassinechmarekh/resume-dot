"use client";

import { ResumeType, TemplateType } from "@/types";
import ClassicTemplate from "../templates/ClassicTemplate";
import MinimalTemplate from "../templates/MinimalTemplate";
import ModernTemplate from "../templates/ModernTemplate";
import MinimalImageTemplate from "../templates/MinimalImageTemplate";
import { cn } from "@/lib/utils";

interface ResumePreviewProps {
  resume: ResumeType;
  template: TemplateType;
  accentColor: string;
  className?: string;
}

const ResumePreview = ({
  resume,
  template,
  accentColor,
  className,
}: ResumePreviewProps) => {
  const renderTemplate = () => {
    switch (template) {
      case "classic":
        return <ClassicTemplate resume={resume} accentColor={accentColor} />;
      case "minimal":
        return <MinimalTemplate resume={resume} accentColor={accentColor} />;
      case "modern":
        return <ModernTemplate resume={resume} accentColor={accentColor} />;
      case "minimal-image":
        return (
          <MinimalImageTemplate resume={resume} accentColor={accentColor} />
        );
      default:
        return <ClassicTemplate resume={resume} accentColor={accentColor} />;
    }
  };
  return (
    <div className={"w-full bg-gray-100"}>
      <div
        id="resume-preview"
        className={cn(
          "border border-gray-200 print:shadow-none print:border-none",
          className
        )}
      >
        {renderTemplate()}
      </div>

      <style jsx>
        {`
          @page {
            size: letter;
            margin: 0;
          }
          @media print {
            html,
            body {
              width: 8.5in;
              height: 11in;
              overflow: hidden;
            }
            body * {
              visibility: hidden;
            }
            #resume-preview,
            #resume-preview * {
              visibility: visible;
            }
            #resume-preview {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: auto;
              margin: 0;
              padding: 0;
              box-shadow: none !important;
              border: none !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ResumePreview;
