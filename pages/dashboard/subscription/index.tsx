import DashLayout from "@/layouts/DashLayout";
import SubscriptionListPage from "@/modules/dashboard/subscription/list";
import Head from "next/head";
import { ReactElement } from "react";

function SubscriptionListIndex() {
  <Head>
    <title>Subscription Management</title>
  </Head>;
  return <SubscriptionListPage />;
}

SubscriptionListIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default SubscriptionListIndex;
