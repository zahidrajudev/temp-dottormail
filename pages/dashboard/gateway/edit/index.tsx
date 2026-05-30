import DashLayout from "@/layouts/DashLayout";
import GatewayEditPage from "@/modules/dashboard/gateway/edit";
import Head from "next/head";
import { ReactElement } from "react";

function GatewayEditIndex() {
  <Head>
    <title>Update Gateway</title>
  </Head>;
  return <GatewayEditPage />;
}

GatewayEditIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default GatewayEditIndex;
