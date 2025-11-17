"use client";

import { verifyEmailAction } from "@/action/auth.action";
import Logo from "@/components/logo";
import ResendEmailVerification from "@/components/resend-email-verification";
import { Parag } from "@/components/text";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { VerifyEmailSchema } from "@/lib/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface VerifyEmailFormProps {
  userId: string;
}

const VerifyEmailForm = ({ userId }: VerifyEmailFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof VerifyEmailSchema>>({
    resolver: zodResolver(VerifyEmailSchema),
    defaultValues: {
      codeOTP: 0,
    },
  });

  const verifyEmailHandler = async (
    data: z.infer<typeof VerifyEmailSchema>
  ) => {
    try {
      setIsLoading(true);
      const response = await verifyEmailAction(data, userId);

      if (response.success) {
        if (response.redirectTo) {
          router.replace(response.redirectTo);
        }
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log("Verify Email Handler :", error);
      toast.error("Internal server error.", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={"w-full max-w-md"}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(verifyEmailHandler)}
          className="space-y-6"
        >
          <Logo className={"mx-auto"} />
          <div className="flex flex-col items-center gap-2 text-center mt-6">
            <h1 className="text-xl font-bold">Enter verification code</h1>
            <Parag>We sent a 6-digit code to your email address</Parag>
          </div>
          <div className={"space-y-4 w-fit mx-auto"}>
            <FormField
              control={form.control}
              name="codeOTP"
              render={({ field }) => (
                <FormItem className={"w-full"}>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      pattern="^\d+$"
                      inputMode="numeric"
                      {...field}
                      value={field.value === 0 ? "" : field.value.toString()}
                      onChange={(value: string) => {
                        field.onChange(Number(value));
                      }}
                      containerClassName="gap-2 xs:gap-4 mx-auto"
                    >
                      <InputOTPGroup className="gap-2.5 xs:*:data-[slot=input-otp-slot]:h-11 xs:*:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup className="gap-2.5 xs:*:data-[slot=input-otp-slot]:h-11 xs:*:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage className="text-center" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant={"primary"}
              className={"w-full h-11 text-sm xs:text-base"}
              disabled={
                Object.keys(form.formState.errors).length > 0 || isLoading
              }
            >
              {isLoading ? (
                <LoaderCircle className={"animate-spin"} />
              ) : (
                "Verify"
              )}
            </Button>
          </div>
          <ResendEmailVerification userId={userId} />
        </form>
      </Form>
    </div>
  );
};

export default VerifyEmailForm;
