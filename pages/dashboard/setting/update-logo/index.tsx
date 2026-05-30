import DashLayout from "@/layouts/DashLayout";
import LogoSetting from "@/modules/dashboard/setting/update-logo";
import Head from "next/head";
import { ReactElement } from "react";

function UpdateLogoPage() {
  <Head>
    <title>Email Configuration</title>
  </Head>;
  return <LogoSetting />;
}

UpdateLogoPage.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default UpdateLogoPage;
