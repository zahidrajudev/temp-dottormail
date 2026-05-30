import DashLayout from "@/layouts/DashLayout";
import GatewayListPage from "@/modules/dashboard/gateway/list";
import Head from "next/head";
import { ReactElement } from "react";

function GatewayIndex() {
  <Head>
    <title>Gateway Management</title>
  </Head>;
  return <GatewayListPage />;
}

GatewayIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default GatewayIndex;
