import MainLayout from "@/layouts/MainLayout";
import DottormailPricingV2 from "@/modules/dottormail/pages/pricing_v2";
import { ReactElement } from "react";

function PricingIndex() {
  return <DottormailPricingV2 />;
}

export default PricingIndex;

PricingIndex.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
