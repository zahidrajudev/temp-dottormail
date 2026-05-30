import DashLayout from "@/layouts/DashLayout";
import CurrencyEditPage from "@/modules/dashboard/currency/edit";
import Head from "next/head";
import { ReactElement } from "react";

function CurrencyEditIndex() {
  <Head>
    <title>user Management</title>
  </Head>;
  return <CurrencyEditPage />;
}

CurrencyEditIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default CurrencyEditIndex;
