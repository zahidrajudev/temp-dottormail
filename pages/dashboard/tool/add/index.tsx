import DashLayout from "@/layouts/DashLayout";
import PackageAddPage from "@/modules/dashboard/package/add";
import ToolAddPage from "@/modules/dashboard/tool/add";
import Head from "next/head";
import { ReactElement } from "react";

function ToolAddIndex() {
  return (
    <>
      <Head>
        <title>Add New Tool</title>
      </Head>
      <ToolAddPage />
    </>
  );
}

ToolAddIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default ToolAddIndex;
