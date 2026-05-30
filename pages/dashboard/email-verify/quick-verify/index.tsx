import DashLayout from "@/layouts/DashLayout";
import DottormailEmailVerifyPage from "@/modules/dottormail/dashboard/email-verify";
import Head from "next/head";
import { ReactElement } from "react";

function EmailverifyIndex() {
  <Head>
    <title>Subscription Management</title>
  </Head>;
  return <DottormailEmailVerifyPage />;
}

EmailverifyIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default EmailverifyIndex;
