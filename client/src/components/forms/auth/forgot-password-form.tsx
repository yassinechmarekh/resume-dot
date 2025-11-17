"use client";

import { forgotPasswordAction } from "@/action/auth.action";
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
import { Input } from "@/components/ui/input";
import { AuthPages, InputTypes, Routes } from "@/lib/constants";
import { ForgotPasswordSchema } from "@/lib/schemas/auth.schema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const forgotPasswordHandler = async (
    data: z.infer<typeof ForgotPasswordSchema>
  ) => {
    try {
      setIsLoading(true);
      const result = await forgotPasswordAction(data);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
    } catch (error) {
      console.log("Forgot Password Handler :", error);
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
            Forgot Password
          </Title>
          <Parag>
            No worries! Enter your email address below, and we’ll send you a
            link to reset your password quickly.
          </Parag>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(forgotPasswordHandler)}
            className="space-y-8"
          >
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <div
                      className={cn(
                        "flex items-center gap-1",
                        form.formState.errors["email"] && "text-red-500"
                      )}
                    >
                      <Mail className={"size-4"} />
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <span className={"text-red-500"}>*</span>
                    </div>
                    <FormControl>
                      <Input
                        id="email"
                        placeholder="johndoe@mail.com"
                        type={InputTypes.TEXT}
                        autoComplete="email"
                        error={form.formState.errors["email"] ? true : false}
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
                "Send Reset Link"
              )}
            </Button>
          </form>
        </Form>
      </div>
      <div className="text-center text-xs xs:text-sm">
        Don&apos;t have an account?{" "}
        <Button variant={"link"} asChild>
          <Link
            href={`/${Routes.AUTH}/${AuthPages.REGISTER}`}
            className={"underline"}
          >
            Sign up
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default ForgotPasswordForm;
