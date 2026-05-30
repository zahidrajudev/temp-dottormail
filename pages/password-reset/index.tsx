import MainLayout from "@/layouts/MainLayout";
import PasswordResetPage from "@/modules/auth/pages/password-reset";
import { ReactElement } from "react";

function PasswordResetIndex() {
  return <PasswordResetPage />;
}

PasswordResetIndex.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default PasswordResetIndex;
