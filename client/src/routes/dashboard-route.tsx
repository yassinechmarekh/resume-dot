import Container from "@/components/container";
import CreateResumeCard from "@/sections/dashboard/create-resume-card";
import ResumesList from "@/sections/dashboard/resumes-list";
import UploadResumeCard from "@/sections/dashboard/upload-resume-card";

const DashboardRoute = () => {
  return (
    <div>
      <Container>
        <div className={"flex flex-col sm:flex-row items-center gap-3 border-b border-slate-300 pb-4"}>
          <CreateResumeCard />
          <UploadResumeCard />
        </div>
        <div className={'mt-4'}>
          <ResumesList />
        </div>
      </Container>
    </div>
  );
};

export default DashboardRoute;
