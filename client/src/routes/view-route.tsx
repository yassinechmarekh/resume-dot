import Container from "@/components/container";
import ResumePreview from "@/components/dashboard/resume-preview";
import { Parag } from "@/components/text";
import { ResumeType } from "@/types";
import { ScreenShareOff } from "lucide-react";

interface ViewRouteProps {
  resume: ResumeType;
}

const ViewRoute = ({ resume }: ViewRouteProps) => {
  return (
    <div className={"bg-gray-100 min-h-screen"}>
      <Container className={"flex items-center justify-center min-h-screen"}>
        <div className={"max-w-3xl mx-auto py-10"}>
          <div
            className={
              "sm:hidden text-center"
            }
          >
            <ScreenShareOff className={"size-28 mx-auto mb-3 text-gray-300"} />
            <Parag
              className={"text-base xs:text-lg font-bold text-gray-800 mb-2"}
            >
              Resume Preview Not Available
            </Parag>
            <Parag>
              For a better experience, please switch to a larger screen or
              download your resume to view it.
            </Parag>
          </div>
          <div className={"hidden sm:block"}>
            <ResumePreview
              resume={resume}
              template={resume.template}
              accentColor={resume.accent_color}
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ViewRoute;
