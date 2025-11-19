import { getSpecificResumeAction } from "@/action/resume.action";
import ViewRoute from "@/routes/view-route";
import { notFound } from "next/navigation";

interface ViewPageProps {
  params: Promise<{ resumeId: string }>;
}

const ViewPage = async ({ params }: ViewPageProps) => {
  const resumeId = (await params).resumeId;
  const resume = await getSpecificResumeAction(resumeId);

  if(!resume || !resume.public) {
    return notFound();
  }
  return <ViewRoute resume={resume} />;
};

export default ViewPage;
