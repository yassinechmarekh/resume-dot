"use client";

import { ResumeType } from "@/types";
import {
  FilePenLineIcon,
  PencilIcon,
  TrashIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import UpdateResumeTitleForm from "../forms/update-resume-title-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Dispatch, SetStateAction } from "react";
import { deleteResumeAction } from "@/action/resume.action";
import { toast } from "sonner";

interface ResumeCardProps {
  baseColor: string;
  resume: ResumeType;
  setResumes: Dispatch<SetStateAction<ResumeType[] | null>>;
}

const ResumeCard = ({ baseColor, resume, setResumes }: ResumeCardProps) => {
  const router = useRouter();

  const deleteResumeHanlder = async (resumeId: string) => {
    try {
      const result = await deleteResumeAction(resumeId);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      setResumes((prev) => {
        if (!prev) return prev;
        return prev.filter((resume) => resume._id !== resumeId);
      });

      toast.success(result.message);
    } catch (error) {
      console.log("Delete Resume Handler Error :");
      console.log(error);
      toast.error("Internal server error.", {
        description: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div
      className={
        "relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center gap-2 rounded-lg hover:shadow-lg cursor-pointer hover-effect group"
      }
      style={{
        background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`,
        borderColor: baseColor + "40",
      }}
      onClick={() => router.push(`/dashboard/builder/${resume._id}`)}
    >
      <FilePenLineIcon
        className={"size-7 group-hover:scale-105 hover-effect"}
        style={{ color: baseColor }}
      />
      <p
        className={
          "text-xs sm:text-sm text-center line-clamp-2 px-2 group-hover:scale-105 hover-effect"
        }
        style={{ color: baseColor }}
      >
        {resume.title}
      </p>
      <p
        className={
          "absolute bottom-1 text-center text-[10px] xs:text-[11px] px-2"
        }
        style={{ color: baseColor + "90" }}
      >
        Update on {new Date(resume.updatedAt).toLocaleDateString()}
      </p>
      <div
        className={
          "absolute top-1 right-1 group-hover:flex items-center gap-1 hidden"
        }
      >
        {/* Update Resume Title Modal */}
        <Dialog>
          <DialogTrigger asChild>
            <PencilIcon
              className={
                "size-7 p-1.5 rounded group-hover:bg-white/50 text-slate-700"
              }
              onClick={(e) => e.stopPropagation()}
            />
          </DialogTrigger>
          <DialogContent onClick={(e) => e.stopPropagation()}>
            <DialogHeader>
              <DialogTitle>Update Resume Title</DialogTitle>
              <DialogDescription>
                Give your resume a new title to better reflect your skills or
                target role. Keep your documents organized and make a stronger
                impression with every version.
              </DialogDescription>
            </DialogHeader>

            <UpdateResumeTitleForm
              resumeId={resume._id}
              resumeTitle={resume.title}
              setResumes={setResumes}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Resume Modal */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <TrashIcon
              className={
                "size-7 p-1.5 rounded group-hover:bg-white/50 text-slate-700"
              }
              onClick={(e) => e.stopPropagation()}
            />
          </AlertDialogTrigger>
          <AlertDialogContent onClick={(e) => e.stopPropagation()}>
            <AlertDialogHeader className="items-center">
              <div className="bg-destructive/10 mx-auto mb-2 flex size-12 items-center justify-center rounded-full">
                <TriangleAlertIcon className="text-destructive size-6" />
              </div>
              <AlertDialogTitle className="text-center">
                Are you sure you want to delete{" "}
                <span className={"capitalize"}>"{resume.title}"</span> ?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center">
                This action cannot be undone. Your resume and all related data
                will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => deleteResumeHanlder(resume._id)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default ResumeCard;
