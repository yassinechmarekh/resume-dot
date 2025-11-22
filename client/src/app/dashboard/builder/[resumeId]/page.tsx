import { getSpecificResumeAction } from "@/action/resume.action";
import BuilderRoute from "@/routes/builder-route";
import { notFound } from "next/navigation";

interface BuilderPageProps {
  params: Promise<{ resumeId: string }>;
}

export const generateMetadata = async ({ params }: BuilderPageProps) => {
  const resumeId = (await params).resumeId;
  const resume = await getSpecificResumeAction(resumeId);

  if (!resume) {
    return {
      title: "Resume not found",
    };
  }

  return {
    title: `${resume.title.toUpperCase()} - Resume.`,
  };
};

const BuilderPage = async ({ params }: BuilderPageProps) => {
  const resumeId = (await params).resumeId;
  const resume = await getSpecificResumeAction(resumeId);

  if (!resume) {
    return notFound();
  }

  return <BuilderRoute resume={resume} />;
};

export default BuilderPage;
