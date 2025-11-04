import { cn } from "@/lib/utils";
import React from "react";

interface TextProps {
  children: React.ReactNode;
  className?: string;
}

const Title = ({ children, className }: TextProps) => {
  return (
    <h1
      className={cn(
        "text-gray-900 text-2xl xs:text-3xl sm:text-4xl font-semibold",
        className
      )}
    >
      {children}
    </h1>
  );
};

const Parag = ({ children, className }: TextProps) => {
  return (
    <p className={cn("text-sm xs:text-base text-foreground", className)}>
      {children}
    </p>
  );
};

export { Parag, Title };
