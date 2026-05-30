import MainLayout from "@/layouts/MainLayout";
import HomePageV2 from "@/modules/dottormail/pages/home_v2";
import { ReactElement } from "react";

function HomeIndex() {
  return <HomePageV2 />;
}

HomeIndex.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default HomeIndex;
