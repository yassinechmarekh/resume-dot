"use client";

import Container from "@/components/container";
import Logo from "@/components/logo";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { CookieKeys, Routes } from "@/lib/constants";
import { toast } from "sonner";

const GoogleSuccessPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const router = useRouter();

  useEffect(() => {
    if (token) {
      Cookies.set(CookieKeys.ACCESSTOKEN, token, {
        expires: new Date(Date.now() + 15 * 60 * 1000),
      });
      router.replace(`/${Routes.DASHBOARD}`);
    } else {
      toast.error("Invalid google url callback. Please try again.");
    }
  }, []);

  return (
    <Container className={"flex items-center justify-center min-h-screen"}>
      <Logo className={"animate-fade"} />
    </Container>
  );
};

export default GoogleSuccessPage;
