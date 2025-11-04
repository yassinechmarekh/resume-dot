import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className }: ContainerProps) => {
  return (
    <div
      className={cn(
        "mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-32 2xl:mx-auto 2xl:max-w-384",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Container;
