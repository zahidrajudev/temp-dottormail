import DashLayout from "@/layouts/DashLayout";
import ToolEditPage from "@/modules/dashboard/tool/edit";
import Head from "next/head";
import { ReactElement } from "react";

function ToolEditIndex() {
  return (
    <>
      <Head>
        <title>Edit Tool</title>
      </Head>
      <ToolEditPage />
    </>
  );
}

ToolEditIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default ToolEditIndex;
