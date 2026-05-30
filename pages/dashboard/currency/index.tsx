import DashLayout from "@/layouts/DashLayout";
import CurrencyListPage from "@/modules/dashboard/currency/list";
import Head from "next/head";
import { ReactElement } from "react";

function CurrencyIndex() {
  <Head>
    <title>user Management</title>
  </Head>;
  return <CurrencyListPage />;
}

CurrencyIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default CurrencyIndex;
