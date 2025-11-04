"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";
import authImage from "@public/images/auth.png";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const pathname = usePathname();
  const isNormal =
    pathname.includes("login") || pathname.includes("forgot-password");

  return (
    <div
      className={cn(
        "flex flex-row min-h-screen",
        isNormal ? "flex-row" : "flex-row-reverse"
      )}
    >
      {/* <div className="h-full min-h-screen lg:w-1/2 hidden lg:inline-block overflow-hidden">
        <Image
          className="object-cover h-full min-h-screen w-full"
          src={authImage}
          alt="auth image"
          priority={true}
        />
      </div> */}

      <div className="min-h-screen lg:w-1/2 hidden lg:inline-block overflow-hidden sticky top-0 h-screen">
        <Image
          className="object-cover h-full w-full"
          src={authImage}
          alt="auth image"
          priority={true}
        />
      </div>

      <div className="min-h-screen w-full lg:w-1/2 py-10 lg:px-8 lg:py-8">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
