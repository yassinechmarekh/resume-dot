import DashboardNavbar from "@/components/dashboard/dashboard-navbar";
import React from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className={"flex flex-col min-h-screen"}>
      <DashboardNavbar />
      <div className={"flex-1 bg-gray-100 py-4"}>{children}</div>
    </div>
  );
};

export default DashboardLayout;
