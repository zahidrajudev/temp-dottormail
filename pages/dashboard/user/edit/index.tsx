import DashLayout from "@/layouts/DashLayout";
import UserEditPage from "@/modules/dashboard/user/edit";
import Head from "next/head";
import { ReactElement } from "react";

function UserEditIndex() {
  return (
    <>
      <Head>
        <title>Edit User</title>
      </Head>
      <UserEditPage />
    </>
  );
}

UserEditIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default UserEditIndex;
