import MainLayout from "@/layouts/MainLayout";
import EmailVerifyPage from "@/modules/auth/pages/email_verify";
import { ReactElement } from "react";

function EmailVerifyIndex() {
  return <EmailVerifyPage />;
}

EmailVerifyIndex.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default EmailVerifyIndex;
