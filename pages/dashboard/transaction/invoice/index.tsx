import DashLayout from "@/layouts/DashLayout";
import TransactionInvoicePage from "@/modules/dashboard/transaction/invoice";
import Head from "next/head";
import { ReactElement } from "react";

function TransactionInvoiceIndex() {
  <Head>
    <title>All Transactions</title>
  </Head>;
  return <TransactionInvoicePage />;
}

TransactionInvoiceIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default TransactionInvoiceIndex;
