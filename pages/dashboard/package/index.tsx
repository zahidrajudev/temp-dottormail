import DashLayout from "@/layouts/DashLayout";
import PackageListPage from "@/modules/dashboard/package/list";
import Head from "next/head";
import { ReactElement } from "react";

function PackageIndex() {
  <Head>
    <title>Subscription Management</title>
  </Head>;
  return <PackageListPage />;
}

PackageIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default PackageIndex;
