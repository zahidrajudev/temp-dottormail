import DashLayout from "@/layouts/DashLayout";
import CurrencyAddPage from "@/modules/dashboard/currency/add";
import Head from "next/head";
import { ReactElement } from "react";

function CurrencyAddIndex() {
  <Head>
    <title>user Management</title>
  </Head>;
  return <CurrencyAddPage />;
}

CurrencyAddIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default CurrencyAddIndex;
