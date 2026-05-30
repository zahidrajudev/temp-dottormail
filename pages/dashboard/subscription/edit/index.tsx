import DashLayout from "@/layouts/DashLayout";
import SubscriptionEditPage from "@/modules/dashboard/subscription/edit";
import Head from "next/head";
import { ReactElement } from "react";

function PackageEditIndex() {
  return (
    <>
      <Head>
        <title>Edit Subscription</title>
      </Head>
      <SubscriptionEditPage />
    </>
  );
}

PackageEditIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default PackageEditIndex;
