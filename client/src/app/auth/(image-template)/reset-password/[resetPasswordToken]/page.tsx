import Container from "@/components/container";
import ResetPasswordForm from "@/components/forms/auth/reset-password-form";

const ResetPasswordPage = () => {
  return (
    <>
      <div className="block lg:hidden h-full">
        <Container className={"h-full"}>
          <ResetPasswordForm />
        </Container>
      </div>
      <div className="hidden lg:block h-full">
        <ResetPasswordForm />
      </div>
    </>
  );
};

export default ResetPasswordPage;
