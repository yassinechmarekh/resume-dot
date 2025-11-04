import UploadResumeForm from "@/components/forms/upload-resume-form";
import { Parag } from "@/components/text";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UploadCloudIcon } from "lucide-react";

const UploadResumeCard = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span
          className={
            "w-full p-4 bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 hover:border-indigo-500 hover:shadow-lg hover-effect cursor-pointer group"
          }
        >
          <UploadCloudIcon
            className={
              "size-11 p-2.5 bg-linear-to-br from-purple-300 to-purple-500 text-white rounded-full"
            }
          />
          <Parag
            className={
              "text-xs xs:text-sm group-hover:text-purple-600 hover-effect"
            }
          >
            Upload Existing
          </Parag>
        </span>
      </DialogTrigger>
      <DialogContent className={"sm:max-w-md"}>
        <DialogHeader>
          <DialogTitle>Upload Resume</DialogTitle>
          <DialogDescription>
            Easily upload your existing resume and let our AI enhance it.
            Improve wording, highlight your strengths, and make your application
            stand out — all in minutes.
          </DialogDescription>

          {/* Upload Resume Form */}
          <UploadResumeForm />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default UploadResumeCard;
