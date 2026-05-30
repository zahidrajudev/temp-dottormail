import DashLayout from "@/layouts/DashLayout";
import LanguageEditPage from "@/modules/dashboard/language/edit";
import Head from "next/head";
import { ReactElement } from "react";

function LanguageEditIndex() {
  <Head>
    <title>user Management</title>
  </Head>;
  return <LanguageEditPage />;
}

LanguageEditIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default LanguageEditIndex;
