import MainLayout from "@/layouts/MainLayout";
import DottormailContactV2 from "@/modules/dottormail/pages/contact_v2";
import { ReactElement } from "react";

function ContactIndex() {
  return <DottormailContactV2 />;
}

export default ContactIndex;

ContactIndex.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
