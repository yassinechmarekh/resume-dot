import Container from "@/components/container";
import LoginForm from "@/components/forms/auth/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login page - Resume."
}

const LoginPage = () => {
  return (
    <>
      <div className="block lg:hidden h-full">
        <Container className={'h-full'}>
          <LoginForm />
        </Container>
      </div>

      <div className="hidden lg:block h-full">
        <LoginForm />
      </div>
    </>
  );
};

export default LoginPage;
