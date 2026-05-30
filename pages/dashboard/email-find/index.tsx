import DashLayout from "@/layouts/DashLayout";
import DottormailDashboardEmailFinder from "@/modules/dottormail/dashboard/email-find";
import Head from "next/head";
import { ReactElement } from "react";

function EmailverifyIndex() {
  <Head>
    <title>Subscription Management</title>
  </Head>;
  return <DottormailDashboardEmailFinder />;
}

EmailverifyIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default EmailverifyIndex;
