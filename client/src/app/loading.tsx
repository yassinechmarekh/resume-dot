import Container from "@/components/container";
import Logo from "@/components/logo";

const Loading = () => {
  return (
    <Container className={"flex items-center justify-center min-h-screen"}>
      <Logo className={'animate-fade'} />
    </Container>
  )
}

export default Loading