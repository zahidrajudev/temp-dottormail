import MainLayout from "@/layouts/MainLayout";
import DottormailRegisterV2 from "@/modules/dottormail/pages/register_v2";
import { ReactElement } from "react";

function RegisterIndex() {
  return <DottormailRegisterV2 />;
}

RegisterIndex.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default RegisterIndex;
