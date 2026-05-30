import DashLayout from "@/layouts/DashLayout";
import PackageAddPage from "@/modules/dashboard/package/add";
import Head from "next/head";
import { ReactElement } from "react";

function PackageAddIndex() {
  return (
    <>
      <Head>
        <title>Add New Subscription</title>
      </Head>
      <PackageAddPage />
    </>
  );
}

PackageAddIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default PackageAddIndex;
