"use client";

import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share2Icon } from "lucide-react";

interface ShareResumeProps {
  resumeId: string;
  title: string;
}

const ShareResume = ({ resumeId, title }: ShareResumeProps) => {
  const shareHandler = () => {
    navigator.share({
      url: `${process.env.NEXT_PUBLIC_CLIENT_DOMAIN}/view/${resumeId}`,
      text: title,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"blue"}
          className={
            "hover:from-blue-100 hover:to-blue-200 hover:ring-0 duration-300 border border-blue-600"
          }
        >
          <Share2Icon /> Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue={`${process.env.NEXT_PUBLIC_CLIENT_DOMAIN}/view/${resumeId}`}
              readOnly
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button type="button" variant="primary" onClick={shareHandler}>
            Share
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareResume;
