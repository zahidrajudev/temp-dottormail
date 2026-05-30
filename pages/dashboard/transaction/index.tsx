import DashLayout from "@/layouts/DashLayout";
import TransactionListPage from "@/modules/dashboard/transaction/list";
import Head from "next/head";
import { ReactElement } from "react";

function TransactionIndex() {
  <Head>
    <title>All Transactions</title>
  </Head>;
  return <TransactionListPage />;
}

TransactionIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default TransactionIndex;
