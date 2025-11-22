import { verifyResetPasswordTokenAction } from "@/action/auth.action";
import Container from "@/components/container";
import ResetPasswordForm from "@/components/forms/auth/reset-password-form";
import { Parag } from "@/components/text";
import { Button } from "@/components/ui/button";
import { AuthPages, Routes } from "@/lib/constants";
import { AlertCircle, Mail } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Reset password page - Resume."
}

const ExpiredLink = () => {
  return (
    <div className={"flex flex-col items-center justify-center h-full py-10"}>
      {/* Error Icon */}
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="w-10 h-10 text-red-500" />
      </div>

      {/* Principal Message */}
      <div className="text-center mb-8">
        <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 mb-3">
          Expired Link
        </h2>
        <Parag className="text-gray-600 leading-relaxed">
          This password reset link has expired or is no longer valid. Password
          reset links are only valid for 10 minutes for security reasons.
        </Parag>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm xs:text-base font-semibold text-blue-900 mb-1">
              What to do next?
            </h3>
            <p className="text-xs xs:text-sm text-blue-700">
              Please return to the login page and click on "Forgot your
              password?" to request a new password reset link.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 w-full">
        <Button variant={"primary"} size={"lg"} className={"w-full"} asChild>
          <Link href={`/${Routes.AUTH}/${AuthPages.LOGIN}`}>Back to Login</Link>
        </Button>
        <Button variant={"secondary"} size={"lg"} className={"w-full"} asChild>
          <Link href={`/${Routes.AUTH}/${AuthPages.FORGOT_PASSWORD}`}>
            Request New Reset Link
          </Link>
        </Button>
      </div>
    </div>
  );
};

interface ResetPasswordPageProps {
  params: Promise<{ resetPasswordToken: string }>;
}

const ResetPasswordPage = async ({ params }: ResetPasswordPageProps) => {
  const token = (await params).resetPasswordToken;
  const result = await verifyResetPasswordTokenAction(token);

  if (result.isExpired) {
    return (
      <>
        <div className="block lg:hidden h-full">
          <Container className={"h-full"}>
            <ExpiredLink />
          </Container>
        </div>
        <div className="hidden lg:block h-full">
          <ExpiredLink />
        </div>
      </>
    );
  }

  if (!result.isVerified) {
    return notFound();
  }
  return (
    <>
      <div className="block lg:hidden h-full">
        <Container className={"h-full"}>
          <ResetPasswordForm token={token} />
        </Container>
      </div>
      <div className="hidden lg:block h-full">
        <ResetPasswordForm token={token} />
      </div>
    </>
  );
};

export default ResetPasswordPage;
