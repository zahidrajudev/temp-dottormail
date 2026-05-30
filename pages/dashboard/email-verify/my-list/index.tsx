import DashLayout from "@/layouts/DashLayout";
import DottormailMyListPage from "@/modules/dottormail/dashboard/my-list";
import Head from "next/head";
import { ReactElement } from "react";

function EmailverifyIndex() {
  <Head>
    <title>Subscription Management</title>
  </Head>;
  return <DottormailMyListPage />;
}

EmailverifyIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default EmailverifyIndex;
