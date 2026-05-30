import DashLayout from "@/layouts/DashLayout";
import EmailConfigSetting from "@/modules/dashboard/setting/email-config";
import Head from "next/head";
import { ReactElement } from "react";

function EmailConfigPage() {
  <Head>
    <title>Email Configuration</title>
  </Head>;
  return <EmailConfigSetting />;
}

EmailConfigPage.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default EmailConfigPage;
