import Container from "@/components/container";
import VerifyEmailForm from "@/components/forms/auth/verify-email-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify email page - Resume."
}

interface VerifyEmailPageProps {
  params: Promise<{ userId: string }>;
}

const VerifyEmailPage = async ({ params }: VerifyEmailPageProps) => {
  const userId = (await params).userId;
  return (
    <div className="bg-backgroundmin-h-screen">
      <Container className={"flex items-center justify-center min-h-screen"}>
        <VerifyEmailForm userId={userId} />
      </Container>
    </div>
  );
};

export default VerifyEmailPage;
