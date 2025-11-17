"use client";

import Container from "../container";
import { Button } from "../ui/button";
import Logo from "../logo";
import { useAuth } from "@/context/auth-context";
import { Skeleton } from "../ui/skeleton";

const DashboardNavbar = () => {
  const { user, isLoading, logout } = useAuth();
  return (
    <nav
      className={
        "bg-white border-b border-gray-300 py-2 shadow-sm shadow-gray-300"
      }
    >
      <Container className={"flex items-center justify-between"}>
        <Logo />
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-8 rounded-full bg-gray-200" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-36 bg-gray-200" />
              <Skeleton className="h-3 w-28 bg-gray-200" />
            </div>
          </div>
        ) : (
          user && (
            <div className={"flex items-center gap-2"}>
              <span className={"text-xs xs:text-sm"}>
                Hi, {user.username.toUpperCase()}
              </span>
              <Button
                variant={"secondary"}
                size={"sm"}
                className={"rounded-2xl px-6"}
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          )
        )}
      </Container>
    </nav>
  );
};

export default DashboardNavbar;
