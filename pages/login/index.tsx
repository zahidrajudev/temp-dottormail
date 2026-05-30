import MainLayout from "@/layouts/MainLayout";
import LoginPage from "@/modules/auth/pages/login";
import LoginPageV2 from "@/modules/auth/pages/login_v2";
import DottormailLoginV2 from "@/modules/dottormail/pages/login_v2";
import { ReactElement } from "react";

function LoginIndex() {
  return <DottormailLoginV2 />;
}

LoginIndex.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default LoginIndex;
