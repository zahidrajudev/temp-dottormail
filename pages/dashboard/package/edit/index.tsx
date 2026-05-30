import DashLayout from "@/layouts/DashLayout";
import PackageEditPage from "@/modules/dashboard/package/edit";
import Head from "next/head";
import { ReactElement } from "react";

function PackageEditIndex() {
  return (
    <>
      <Head>
        <title>Edit Subscription</title>
      </Head>
      <PackageEditPage />
    </>
  );
}

PackageEditIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default PackageEditIndex;
