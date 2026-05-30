import dynamic from "next/dynamic";
import DashLayout from "@/layouts/DashLayout";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import Head from "next/head";
import { ReactElement, useEffect, useState } from "react";
import DottormailAdminDashboard from "@/modules/dottormail/dashboard/version/admin";
import DottormailUserDashboard from "@/modules/dottormail/dashboard/version/user";

function DashboardIndex() {
  const { hasPermission } = useAuthStore();
  const [dashboard, setDashboard] = useState("");
  useEffect(() => {
    if (hasPermission("dashboard.admin")) {
      setDashboard("admin");
    } else if (hasPermission("dashboard.user")) {
      setDashboard("user");
    } else {
      setDashboard("");
    }
  }, []);
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      {dashboard == "admin" && <DottormailAdminDashboard />}
      {dashboard == "user" && <DottormailUserDashboard />}
    </>
  );
}

DashboardIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default DashboardIndex;
