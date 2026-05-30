import DashLayout from "@/layouts/DashLayout";
import ToolAccessPage from "@/modules/dashboard/tool/access";
import Head from "next/head";
import { ReactElement } from "react";

function ToolAccessIndex() {
  <Head>
    <title>Manage Tools</title>
  </Head>;
  return <ToolAccessPage />;
}

ToolAccessIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default ToolAccessIndex;
