import api from "@/lib/api";
import { checkErrors, convertToNumber } from "@/lib/helper";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { useCurrencyStore } from "@/modules/currency/store/useCurrencyStore";
import Button from "@/modules/global/elements/button";
import MediaArea from "@/modules/global/elements/media_area";
import Section from "@/modules/global/elements/section";
import SubHeader from "@/modules/global/widget/sub_header";
import pageTranslation from "@/modules/language/components/PageTranslation";
import { useLanguageStore } from "@/modules/language/store/useLanguageStore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import UpdateLogoTranslation from "./translation/update-logo";

function LogoSetting() {
  const router = useRouter();
  const pageName = "update_logo";
  const { hasPermission } = useAuthStore();
  const [showTranslation, setShowTranslation] = useState(false);
  const { appSelectedLocale, appDefaultLocale, appLocales } = useLanguageStore();
  const { t } = pageTranslation(pageName, appSelectedLocale?.code ?? "en");
  const { appDefaultCurrency } = useCurrencyStore();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mainData, setMainData] = useState<any[]>([]);

  const [refresh, setRefresh] = useState(0);
  const refreshPage = () => {
    setRefresh((prev) => prev + 1);
  };

  const [darkLogo, setDarkLogo] = useState<any>("");
  const [whiteLogo, setWhiteLogo] = useState<any>("");
  // Handle Create a record
  const handleCreateOrUpdate = () => {
    if (checkErrors({ whiteLogo, darkLogo }, setErrors, true)) {
      return;
    }

    let url = "v1/dashboard/settings/create-or-update";
    const logs: any = {};
    if (Array.isArray(darkLogo) && darkLogo?.length) {
      logs.dark_logo = darkLogo[0]?.path;
    }
    if (Array.isArray(whiteLogo) && whiteLogo?.length) {
      logs.white_logo = whiteLogo[0]?.path;
    }
    let data = {
      name: "logo",
      value_text: JSON.stringify(logs),
    };

    setLoading(true);

    api
      .post(url, data)
      .then((res) => {
        setLoading(false);
        toast.success(res?.data?.message);
        refreshPage();
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err?.response?.data?.message);
        setErrors(err?.response?.data?.errors);
      });
  };

  // Fetch initial data
  const getInitialData = async () => {
    setLoading(true);
    const data = { name: "logo" };
    let url = "v1/dashboard/settings";
    await api
      .post(url, data)
      .then((res) => {
        setLoading(false);
        let resData = res?.data?.data;
        if (Array.isArray(resData) && resData?.length) {
          resData = resData[0];
        }
        if (resData && resData?.value_text) {
          const parseData = JSON.parse(resData?.value_text);
          console.log(parseData);
          const dark = [{ id: "", type: 1, path: parseData?.dark_logo }];
          setDarkLogo(dark);
          const white = [{ id: "", type: 1, path: parseData?.white_logo }];
          setWhiteLogo(white);
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err?.response?.data?.message);
      });
  };

  useEffect(() => {
    getInitialData();
  }, [refresh]);

  return (
    <Section permission={hasPermission("tool.create")} loading={loading} className="bg-white p-8 border border-gray-200 rounded-lg space-y-10">
      <SubHeader title={t(pageName)} showTranslationIcon TranslationIconAction={() => setShowTranslation(true)} />

      <div className="space-y-2">
        <h6>{t("select_dark_logo")}</h6>
        <MediaArea items={darkLogo} setItems={setDarkLogo} maxSelect={1} selectOnlyTypes={["image"]} />
      </div>

      <div className="space-y-2">
        <h6>{t("select_white_logo")}</h6>
        <MediaArea items={whiteLogo} setItems={setWhiteLogo} maxSelect={1} selectOnlyTypes={["image"]} />
      </div>

      <div className="flex items-end">
        <Button onClick={handleCreateOrUpdate} showIcon>
          {t("submit_now")}
        </Button>
      </div>
      <UpdateLogoTranslation show={showTranslation} setShow={setShowTranslation} />
    </Section>
  );
}

export default LogoSetting;
