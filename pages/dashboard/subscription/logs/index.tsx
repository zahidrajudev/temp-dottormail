import DashLayout from "@/layouts/DashLayout";
import SubscriptionLogsPage from "@/modules/dashboard/subscription/logs";
import Head from "next/head";
import { ReactElement } from "react";

function SubscriptionLogsIndex() {
  <Head>
    <title>Subscription Management</title>
  </Head>;
  return <SubscriptionLogsPage />;
}

SubscriptionLogsIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default SubscriptionLogsIndex;
