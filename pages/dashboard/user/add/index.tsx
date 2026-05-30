import DashLayout from "@/layouts/DashLayout";
import UserAddPage from "@/modules/dashboard/user/add";
import Head from "next/head";
import { ReactElement } from "react";

function UserAddIndex() {
  return (
    <>
      <Head>
        <title>Add New User</title>
      </Head>
      <UserAddPage />
    </>
  );
}

UserAddIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default UserAddIndex;
