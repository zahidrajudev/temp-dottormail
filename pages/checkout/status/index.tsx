import MainLayout from "@/layouts/MainLayout";
import DottormailCheckoutStatusPage from "@/modules/dottormail/pages/checkout/status";
import { ReactElement } from "react";

function LoginIndex() {
  return <DottormailCheckoutStatusPage />;
}

LoginIndex.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default LoginIndex;
