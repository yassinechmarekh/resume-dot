import Container from "@/components/container";
import VerifyEmailForm from "@/components/forms/auth/verify-email-form";

const VerifyEmailPage = () => {
  return (
    <div className="bg-backgroundmin-h-screen">
      <Container className={"flex items-center justify-center min-h-screen"}>
        <VerifyEmailForm />
      </Container>
    </div>
  );
};

export default VerifyEmailPage;
