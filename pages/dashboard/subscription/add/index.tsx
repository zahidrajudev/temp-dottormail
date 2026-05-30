import DashLayout from "@/layouts/DashLayout";
import SubscriptionAddPage from "@/modules/dashboard/subscription/add";
import Head from "next/head";
import { ReactElement } from "react";

function PackageAddIndex() {
  return (
    <>
      <Head>
        <title>Add New Subscription</title>
      </Head>
      <SubscriptionAddPage />
    </>
  );
}

PackageAddIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default PackageAddIndex;
