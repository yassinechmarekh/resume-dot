import ViewRoute from "@/routes/view-route";

interface ViewPageProps {
  params: Promise<{ resumeId: string }>;
}

const ViewPage = async ({ params }: ViewPageProps) => {
  const { resumeId } = await params;
  return <ViewRoute resumeId={resumeId} />;
};

export default ViewPage;
