import MainLayout from "@/layouts/MainLayout";
import DottormailCheckoutPage from "@/modules/dottormail/pages/checkout/checkout";
import { ReactElement } from "react";

function LoginIndex() {
  return <DottormailCheckoutPage />;
}

LoginIndex.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default LoginIndex;
