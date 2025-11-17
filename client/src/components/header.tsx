"use client";

import Container from "./container";
import Logo from "./logo";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "./ui/sheet";
import { Menu } from "lucide-react";
import { AuthPages, Routes, menuLinks } from "@/lib/constants";
import { useAuth } from "@/context/auth-context";

const Header = () => {
  const { isAuthenticated } = useAuth();
  return (
    <header>
      <div className="py-2 bg-green-600">
        <Container>
          <p
            className={
              "text-white font-semibold text-center text-xs xs:text-sm"
            }
          >
            <span className="px-3 py-1 rounded-md font-bold text-green-600 bg-white mr-2">
              New
            </span>
            AI Feature Added
          </p>
        </Container>
      </div>
      <nav className="z-50 py-1 backdrop-blur text-slate-800 text-sm">
        <Container className={"flex items-end justify-between"}>
          <Logo />

          <div className="hidden lg:flex items-center gap-8 py-2">
            {menuLinks.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={"hover:text-green-700 font-medium hover-effect"}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {isAuthenticated ? (
            <div className="hidden lg:block">
              <Button variant={"primary"} asChild className={"rounded-full"}>
                <Link href={`/${Routes.DASHBOARD}`}>Dashboard</Link>
              </Button>
            </div>
          ) : (
            <div className="hidden lg:block space-x-3">
              <Button variant={"primary"} asChild className={"rounded-full"}>
                <Link href={`/${Routes.DASHBOARD}`}>Get started</Link>
              </Button>
              <Button
                variant={"secondary"}
                asChild
                className={"rounded-full px-6"}
              >
                <Link href={`/${Routes.AUTH}/${AuthPages.LOGIN}`}>Login</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="lg:hidden bg-white border-0 shadow-none [&_svg:not([class*='size-'])]:size-6"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <Logo />
              </SheetHeader>
              <div className={"grid gap-3 p-4"}>
                {menuLinks.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className={"hover:text-green-700 font-medium hover-effect"}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <SheetFooter>
                {isAuthenticated ? (
                  <Button
                    variant={"primary"}
                    asChild
                    className={"rounded-full"}
                  >
                    <Link href={`/${Routes.DASHBOARD}`}>Dashboard</Link>
                  </Button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button
                      variant={"primary"}
                      asChild
                      className={"rounded-full"}
                    >
                      <Link href={`/${Routes.DASHBOARD}`}>Get started</Link>
                    </Button>
                    <Button
                      variant={"secondary"}
                      asChild
                      className={"rounded-full px-6"}
                    >
                      <Link href={`/${Routes.AUTH}/${AuthPages.LOGIN}`}>
                        Login
                      </Link>
                    </Button>
                  </div>
                )}
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </Container>
      </nav>
    </header>
  );
};

export default Header;
