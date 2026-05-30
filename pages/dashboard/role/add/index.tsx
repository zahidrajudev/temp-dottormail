import DashLayout from "@/layouts/DashLayout";
import RolePermissionAddPage from "@/modules/dashboard/role-permission/add";
import Head from "next/head";
import { ReactElement } from "react";

function RoleAddIndex() {
  <Head>
    <title>Role Permission Management</title>
  </Head>;
  return <RolePermissionAddPage />;
}

RoleAddIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default RoleAddIndex;
