import DashLayout from "@/layouts/DashLayout";
import UserProfileEditPage from "@/modules/dashboard/user/profile";
import Head from "next/head";
import { ReactElement } from "react";

function UserProfileEditIndex() {
  return (
    <>
      <Head>
        <title>Edit Profile</title>
      </Head>
      <UserProfileEditPage />
    </>
  );
}

UserProfileEditIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default UserProfileEditIndex;
