import Container from "@/components/container";
import RegisterForm from "@/components/forms/auth/register-form";

const RegisterPage = () => {
  return (
    <>
      <div className="block lg:hidden h-full">
        <Container className={'h-full'}>
          <RegisterForm />
        </Container>
      </div>

      <div className="hidden lg:block h-full">
        <RegisterForm />
      </div>
    </>
  );
};

export default RegisterPage;
