"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { LocalStorageKeys } from "@/lib/constants";
import { toast } from "sonner";
import { resendOTPAction } from "@/action/auth.action";

const TIMER_DURATION = 120;

interface ResendEmailVerificationProps {
  userId: string;
}

const ResendEmailVerification = ({ userId }: ResendEmailVerificationProps) => {
  const [intervalTime, setIntervalTime] = useState<number>(0);

  const getRemainingTimeFromStorage = () => {
    const savedTime = localStorage.getItem(LocalStorageKeys.OTP_TIMER);
    if (savedTime) {
      const elapsed = Math.floor((Date.now() - parseInt(savedTime)) / 1000);
      const remaining = TIMER_DURATION - elapsed;
      return remaining > 0 ? remaining : 0;
    }
    return 0;
  };

  useEffect(() => {
    setIntervalTime(getRemainingTimeFromStorage());
  }, []);

  const handleResendOTP = async () => {
    try {
      const result = await resendOTPAction(userId);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
    } catch (error) {
      console.log(error);
      toast.error("Internal server error", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      const now = Date.now();
      localStorage.setItem(LocalStorageKeys.OTP_TIMER, now.toString());
      setIntervalTime(getRemainingTimeFromStorage());
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (intervalTime > 0) {
      timer = setInterval(() => {
        setIntervalTime((prev) => {
          if (prev <= 1) {
            localStorage.removeItem(LocalStorageKeys.OTP_TIMER);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [intervalTime]);

  return intervalTime > 0 ? (
    <p className="text-center text-sm">
      You can resend the code in <strong>{intervalTime}</strong> seconds.
    </p>
  ) : (
    <p className="text-center text-sm">
      Didn&apos;t receive the code?{" "}
      <Button
        type="button"
        variant={"link"}
        className="font-medium"
        onClick={handleResendOTP}
      >
        Resend Code
      </Button>
    </p>
  );
};

export default ResendEmailVerification;
