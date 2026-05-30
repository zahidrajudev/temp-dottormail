import MainLayout from "@/layouts/MainLayout";
import EmailFinderPage from "@/modules/dottormail/pages/email-find";
import { ReactElement } from "react";

function HomeIndex() {
  return <EmailFinderPage />;
}

HomeIndex.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default HomeIndex;
