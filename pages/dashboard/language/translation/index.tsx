import DashLayout from "@/layouts/DashLayout";
import ComponentTranslations from "@/modules/language/components/ComponentsTranslation";
import Head from "next/head";
import { ReactElement } from "react";

function LanguageIndex() {
  <Head>
    <title>Manage Translations</title>
  </Head>;
  return <ComponentTranslations />;
}

LanguageIndex.getLayout = function getLayout(page: ReactElement) {
  return <DashLayout>{page}</DashLayout>;
};

export default LanguageIndex;
