import DashLayout from "@/layouts/DashLayout";
import ToolListPage from "@/modules/dashboard/tool/list";
import Head from "next/head";
import { ReactElement } from "react";

function ToolAccountIndex() {
  <Head>
    <title>Manage Tools</title>
  </Head>;
  return <ToolListPage />;
}

ToolAccountIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default ToolAccountIndex;
