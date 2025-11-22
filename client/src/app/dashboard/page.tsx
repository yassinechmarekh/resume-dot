import DashboardRoute from "@/routes/dashboard-route";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home - Resume."
}

const DashboardPage = () => {
  return <DashboardRoute />;
};

export default DashboardPage;
