import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import logo from "@public/logo.svg";

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <Link href={"/"} className={"hover:opacity-80 hover-effect"}>
      <Image
        src={logo}
        alt={"logo"}
        priority={true}
        className={cn("h-12 w-auto", className)}
      />
    </Link>
  );
};

export default Logo;
