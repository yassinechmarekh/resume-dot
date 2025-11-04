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
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { AuthPages, InputTypes, Routes } from "@/lib/constants";
import { RegisterSchema } from "@/lib/schemas/auth.schema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoaderCircle,
  LockKeyhole,
  LucideIcon,
  Mail,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const fields: {
    name: keyof z.infer<typeof RegisterSchema>;
    icon: LucideIcon;
    label: string;
    type: InputTypes;
    placeholder: string;
  }[] = [
    {
      name: "username",
      icon: User,
      label: "Username",
      type: InputTypes.TEXT,
      placeholder: "John Doe",
    },
    {
      name: "email",
      icon: Mail,
      label: "Email",
      type: InputTypes.TEXT,
      placeholder: "johndoe@email.com",
    },
    {
      name: "password",
      icon: LockKeyhole,
      label: "Password",
      type: InputTypes.PASSWORD,
      placeholder: "*******",
    },
    {
      name: "confirm_password",
      icon: LockKeyhole,
      label: "Confirm Password",
      type: InputTypes.PASSWORD,
      placeholder: "*******",
    },
  ];

  const registerHanlder = (data: z.infer<typeof RegisterSchema>) => {
    try {
      setIsLoading(true);
      console.log(data);
    } catch (error) {
      console.log("Register Handler :", error);
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
          <Title className={"text-xl xs:text-2xl sm:text-3xl"}>Register</Title>
          <Parag>
            Join thousands of job seekers and start building your professional
            resume with AI. Fill out the form below to create your account and
            unlock smart resume tools.
          </Parag>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(registerHanlder)}
            className="space-y-8"
          >
            <div className="grid gap-4">
              {fields.map((item) => (
                <FormField
                  key={item.name}
                  control={form.control}
                  name={item.name}
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <div
                        className={cn(
                          "flex items-center gap-1",
                          form.formState.errors[item.name] && "text-red-500"
                        )}
                      >
                        <item.icon className={"size-4"} />
                        <FormLabel htmlFor={item.name}>{item.label}</FormLabel>
                        <span className={"text-red-500"}>*</span>
                      </div>
                      <FormControl>
                        {item.type === InputTypes.PASSWORD ? (
                          <PasswordInput
                            id={item.name}
                            placeholder={item.placeholder}
                            error={
                              form.formState.errors[item.name] ? true : false
                            }
                            {...field}
                          />
                        ) : (
                          <Input
                            id={item.name}
                            placeholder={item.placeholder}
                            type={item.type}
                            error={
                              form.formState.errors[item.name] ? true : false
                            }
                            {...field}
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
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
                "Register"
              )}
            </Button>
          </form>
        </Form>

        <div className={"flex items-center gap-2 my-8"}>
          <hr className={"flex-1 bg-gray-300"} />
          <p className={"text-xs xs:text-sm text-gray-500 text-nowrap px-2"}>
            or sign up with email
          </p>
          <hr className={"flex-1 bg-gray-300"} />
        </div>

        <Button variant="outline" className="w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="100"
            height="100"
            viewBox="0 0 48 48"
          >
            <path
              fill="#FFC107"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
            <path
              fill="#FF3D00"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            ></path>
            <path
              fill="#4CAF50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            ></path>
            <path
              fill="#1976D2"
              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
          </svg>{" "}
          Sign up with Google
        </Button>
      </div>
      <div className="text-center text-xs xs:text-sm">
        Already have an account?{" "}
        <Button variant={"link"} asChild>
          <Link
            href={`/${Routes.AUTH}/${AuthPages.LOGIN}`}
            className={"underline"}
          >
            Login
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default RegisterForm;
