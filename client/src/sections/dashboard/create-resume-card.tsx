import CreateResumeForm from "@/components/forms/create-resume-form";
import { Parag } from "@/components/text";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";

const CreateResumeCard = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span
          className={
            "w-full p-4 bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 hover:border-indigo-500 hover:shadow-lg hover-effect cursor-pointer group"
          }
        >
          <PlusIcon
            className={
              "size-11 p-2.5 bg-linear-to-br from-indigo-300 to-indigo-500 text-white rounded-full"
            }
          />
          <Parag
            className={
              "text-xs xs:text-sm group-hover:text-indigo-600 hover-effect"
            }
          >
            Create Resume
          </Parag>
        </span>
      </DialogTrigger>
      <DialogContent className={"sm:max-w-md"}>
        <DialogHeader>
          <DialogTitle>
            Create a Resume
          </DialogTitle>
          <DialogDescription>
            Craft your professional resume in minutes with AI-powered guidance.
            Stand out to recruiters and showcase your skills effortlessly.
          </DialogDescription>

          {/* Create Resume Form */}
          <CreateResumeForm />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateResumeCard;
