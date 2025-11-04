"use client";

import Logo from "@/components/logo";
import { Parag, Title } from "@/components/text";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { ResetPasswordSchema } from "@/lib/schemas/auth.schema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const ResetPasswordForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirm_password: "",
    },
  });

  const resetPasswordHandler = (data: z.infer<typeof ResetPasswordSchema>) => {
    try {
      setIsLoading(true);
      console.log(data);
    } catch (error) {
      console.log("Reset Password Handler :", error);
      toast.error("Internal server error.", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={"flex flex-col justify-between gap-6 h-full"}>
      <Logo />
      <div className={"space-y-6"}>
        <div className={"space-y-1"}>
          <Title className={"text-xl xs:text-2xl sm:text-3xl"}>
            Reset Password
          </Title>
          <Parag>
            🔒 Enter your new password below to secure your account and continue
            building your professional resume.
          </Parag>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(resetPasswordHandler)}
            className="space-y-8"
          >
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <div
                      className={cn(
                        "flex items-center gap-1",
                        form.formState.errors["newPassword"] && "text-red-500"
                      )}
                    >
                      <LockKeyhole className={"size-4"} />
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <span className={"text-red-500"}>*</span>
                    </div>
                    <FormControl>
                      <PasswordInput
                        id="password"
                        placeholder="********"
                        autoComplete="current-password"
                        error={
                          form.formState.errors["newPassword"] ? true : false
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <div
                      className={cn(
                        "flex items-center gap-1",
                        form.formState.errors["confirm_password"] &&
                          "text-red-500"
                      )}
                    >
                      <LockKeyhole className={"size-4"} />
                      <FormLabel htmlFor="confirm_password">
                        Confirm Password
                      </FormLabel>
                      <span className={"text-red-500"}>*</span>
                    </div>
                    <FormControl>
                      <PasswordInput
                        id="confirm_password"
                        placeholder="********"
                        error={
                          form.formState.errors["confirm_password"]
                            ? true
                            : false
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              variant={"primary"}
              className="w-full"
              disabled={
                Object.keys(form.formState.errors).length > 0 || isLoading
              }
            >
              {isLoading ? (
                <LoaderCircle className={"animate-spin"} />
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </Form>
      </div>
      <div></div>
    </div>
  );
};

export default ResetPasswordForm;
