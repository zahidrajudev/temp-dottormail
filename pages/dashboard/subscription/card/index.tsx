import DashLayout from "@/layouts/DashLayout";
import CardListPage from "@/modules/dashboard/subscription/card/list";
import Head from "next/head";
import { ReactElement } from "react";

function PackageIndex() {
  <Head>
    <title>Management Your Payment Cards</title>
  </Head>;
  return <CardListPage />;
}

PackageIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default PackageIndex;
