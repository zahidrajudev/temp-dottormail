import DashLayout from "@/layouts/DashLayout";
import ToolAccountListPage from "@/modules/dashboard/tool/account/list";
import Head from "next/head";
import { ReactElement } from "react";

function ToolIndex() {
  <Head>
    <title>Manage Accounts</title>
  </Head>;
  return <ToolAccountListPage />;
}

ToolIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default ToolIndex;
