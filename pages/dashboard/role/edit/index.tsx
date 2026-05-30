import DashLayout from "@/layouts/DashLayout";
import RolePermissionEditPage from "@/modules/dashboard/role-permission/edit";
import RolePermissionListPage from "@/modules/dashboard/role-permission/list";
import Head from "next/head";
import { ReactElement } from "react";

function RoleEditIndex() {
  <Head>
    <title>Role Permission Management</title>
  </Head>;
  return <RolePermissionEditPage />;
}

RoleEditIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default RoleEditIndex;
