import MainLayout from "@/layouts/MainLayout";
import DottormailAboutV2 from "@/modules/dottormail/pages/about_v2";
import { ReactElement } from "react";

function AboutIndex() {
  return <DottormailAboutV2 />;
}

export default AboutIndex;

AboutIndex.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
