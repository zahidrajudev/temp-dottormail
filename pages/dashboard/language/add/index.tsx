import DashLayout from "@/layouts/DashLayout";
import LanguageAddPage from "@/modules/dashboard/language/add";
import Head from "next/head";
import { ReactElement } from "react";

function LanguageAddIndex() {
  <Head>
    <title>user Management</title>
  </Head>;
  return <LanguageAddPage />;
}

LanguageAddIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default LanguageAddIndex;
