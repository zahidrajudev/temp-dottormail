import DashLayout from "@/layouts/DashLayout";
import LanguageListPage from "@/modules/dashboard/language/list";
import Head from "next/head";
import { ReactElement } from "react";

function LanguageIndex() {
  <Head>
    <title>user Management</title>
  </Head>;
  return <LanguageListPage />;
}

LanguageIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default LanguageIndex;
