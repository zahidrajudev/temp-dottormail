import MainLayout from "@/layouts/MainLayout";
import ToolsPage from "@/modules/xtoolvip/pages/tools";
import { ReactElement } from "react";

function ToolsIndex() {
  return <ToolsPage />;
}

export default ToolsIndex;

ToolsIndex.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
