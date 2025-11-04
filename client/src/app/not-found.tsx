import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const NotFound = () => {
  return (
    <Container
      className={"flex flex-col items-center justify-center gap-8 min-h-screen"}
    >
      <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-green-500 to-green-700 bg-clip-text text-transparent">
        404 Not Found
      </h1>
      <div className="h-px w-80 rounded bg-gray-900"></div>
      <p className="md:text-xl text-gray-500 max-w-lg text-center">
        The page you are looking for does not exist or has been moved.
      </p>
      <Button
        variant={"primary"}
        size={"lg"}
        className={"bg-linear-to-r from-green-500 to-green-700 rounded-full"}
        asChild
      >
        <Link href={"/"}>
          <ChevronLeft /> Back to Home
        </Link>
      </Button>
    </Container>
  );
};

export default NotFound;
