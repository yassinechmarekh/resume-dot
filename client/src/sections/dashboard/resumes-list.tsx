"use client";

import { ResumeType } from "@/types";
import { useEffect, useState } from "react";
import allResumes from "@/data/resumes";
import ResumeCard from "@/components/dashboard/resume-card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, FileUser } from "lucide-react";
import { Parag } from "@/components/text";
import { getUserResumesAction } from "@/action/resume.action";

const ResumesList = () => {
  const [resumes, setResumes] = useState<ResumeType[] | null>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const colors = ["#9333eb", "#d97705", "#dc2626", "#0185c7", "#15a34a"];

  const loadAllResumes = async () => {
    setIsLoading(true);
    try {
      setResumes(await getUserResumesAction());
    } catch (error) {
      console.log("Load All Resumes Error :");
      console.log(error);
      setResumes(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadAllResumes();
  }, []);

  if (!resumes) {
    return (
      <div className="flex flex-col items-center text-center max-w-md mx-auto py-10">
        <div className="size-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="size-8 text-red-600" />
        </div>

        <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Loading Error
        </h2>

        <Parag className="text-gray-600 mb-6">
          Unable to load your summaries. Please check your internet connection
          and try again.
        </Parag>
      </div>
    );
  }

  return (
    <div className={"grid grid-cols-2 sm:flex flex-wrap gap-3"}>
      {isLoading ? (
        Array.from({ length: 12 }).map((_, index) => {
          return (
            <div
              key={index}
              className="relative bg-gray-200 p-4 w-full sm:max-w-36 h-48 flex flex-col items-center justify-center gap-2 rounded-lg"
            >
              <Skeleton className="size-10 rounded-lg" />
              <Skeleton className={"h-4 w-full rounded-[1px]"} />
              <Skeleton className={"absolute bottom-2 h-3 w-2/3"} />
              <div className={"absolute top-2 right-2 flex items-center gap-1"}>
                <Skeleton className="size-7 rounded" />
                <Skeleton className="size-7 rounded" />
              </div>
            </div>
          );
        })
      ) : resumes.length === 0 ? (
        <div className={"text-center py-12 text-gray-700 w-full"}>
          <FileUser className={"size-20 mx-auto mb-3 text-gray-300"} />
          <p className={"text-base xs:text-lg font-semibold"}>
            No resume created yet.
          </p>
          <Parag>Click "Create Resume" to get started.</Parag>
        </div>
      ) : (
        resumes.map((resume, index) => {
          const baseColor = colors[index % colors.length];
          return (
            <ResumeCard
              key={index}
              baseColor={baseColor}
              resume={resume}
              setResumes={setResumes}
            />
          );
        })
      )}
    </div>
  );
};

export default ResumesList;
