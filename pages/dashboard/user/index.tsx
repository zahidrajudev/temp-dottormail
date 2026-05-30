import DashLayout from "@/layouts/DashLayout";
import UserListPage from "@/modules/dashboard/user/list";
import Head from "next/head";
import { ReactElement } from "react";

function UserIndex() {
  
  <Head>
    <title>user Management</title>
  </Head>;
  return <UserListPage />;
}

UserIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default UserIndex;
