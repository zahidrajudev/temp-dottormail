import DashLayout from "@/layouts/DashLayout";
import DottormailViewListPage from "@/modules/dottormail/dashboard/view-list";
import Head from "next/head";
import { ReactElement } from "react";

function EmailverifyIndex() {
  <Head>
    <title>Subscription Management</title>
  </Head>;
  return <DottormailViewListPage />;
}

EmailverifyIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default EmailverifyIndex;
