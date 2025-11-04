import Container from "@/components/container";
import ForgotPasswordForm from "@/components/forms/auth/forgot-password-form";

const ForgotPasswordPage = () => {
  return (
    <>
      <div className="block lg:hidden h-full">
        <Container className={"h-full"}>
          <ForgotPasswordForm />
        </Container>
      </div>
      <div className="hidden lg:block h-full">
        <ForgotPasswordForm />
      </div>
    </>
  );
};

export default ForgotPasswordPage;
