"use client";

import { ResumeType } from "@/types";
import { useEffect, useState } from "react";
import allResumes from "@/data/resumes";
import ResumeCard from "@/components/dashboard/resume-card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileUser } from "lucide-react";
import { Parag } from "@/components/text";

const ResumesList = () => {
  const [resumes, setResumes] = useState<ResumeType[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const colors = ["#9333eb", "#d97705", "#dc2626", "#0185c7", "#15a34a"];

  const loadAllResumes = async () => {
    setIsLoading(true);
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        setResumes(allResumes);
        resolve();
      }, 1000);
    });
    setIsLoading(false);
  };

  useEffect(() => {
    loadAllResumes();
  }, []);

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
            <p className={'text-base xs:text-lg font-semibold'}>No resume created yet.</p>
            <Parag>Click "Create Resume" to get started.</Parag>
          </div>
      ) : (
        resumes.map((resume, index) => {
          const baseColor = colors[index % colors.length];
          return (
            <ResumeCard key={index} baseColor={baseColor} resume={resume} />
          );
        })
      )}
    </div>
  );
};

export default ResumesList;
