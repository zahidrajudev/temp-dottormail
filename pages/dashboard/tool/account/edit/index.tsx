import DashLayout from "@/layouts/DashLayout";
import ToolAccountEditPage from "@/modules/dashboard/tool/account/edit";
import Head from "next/head";
import { ReactElement } from "react";

function ToolAccountEditIndex() {
  return (
    <>
      <Head>
        <title>Edit Accounts</title>
      </Head>
      <ToolAccountEditPage />
    </>
  );
}

ToolAccountEditIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default ToolAccountEditIndex;
