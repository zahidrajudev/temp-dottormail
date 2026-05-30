import DashLayout from "@/layouts/DashLayout";
import GatewayAddPage from "@/modules/dashboard/gateway/add";
import Head from "next/head";
import { ReactElement } from "react";

function GatewayAddIndex() {
  <Head>
    <title>Add Gateway</title>
  </Head>;
  return <GatewayAddPage />;
}

GatewayAddIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default GatewayAddIndex;
