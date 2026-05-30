import DashLayout from "@/layouts/DashLayout";
import ToolAccountAddPage from "@/modules/dashboard/tool/account/add";
import Head from "next/head";
import { ReactElement } from "react";

function ToolAccountAddIndex() {
  return (
    <>
      <Head>
        <title>Add Accounts</title>
      </Head>
      <ToolAccountAddPage />
    </>
  );
}

ToolAccountAddIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default ToolAccountAddIndex;
