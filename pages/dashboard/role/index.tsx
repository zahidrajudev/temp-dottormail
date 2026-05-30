import DashLayout from "@/layouts/DashLayout";
import RolePermissionListPage from "@/modules/dashboard/role-permission/list";
import Head from "next/head";
import { ReactElement } from "react";

function RoleIndex() {
  <Head>
    <title>Role Permission Management</title>
  </Head>;
  return <RolePermissionListPage />;
}

RoleIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default RoleIndex;
