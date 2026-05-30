import api from "@/lib/api";
import { checkErrors } from "@/lib/helper";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { useCurrencyStore } from "@/modules/currency/store/useCurrencyStore";
import Button from "@/modules/global/elements/button";
import MediaArea from "@/modules/global/elements/media_area";
import Section from "@/modules/global/elements/section";
import Input from "@/modules/global/input/input";
import Select from "@/modules/global/input/select";
import TextArea from "@/modules/global/input/textarea";
import SubHeader from "@/modules/global/widget/sub_header";
import LanguageSelectForInputFields from "@/modules/language/components/LanguageSelectForInputFields";
import pageTranslation from "@/modules/language/components/PageTranslation";
import { useLanguageStore } from "@/modules/language/store/useLanguageStore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import GatewayAddTranslation from "./translations/add";

function GatewayAddPage() {
  const pageName = "gateway_add";
  const [showTranslation, setShowTranslation] = useState(false);
  const { appSelectedLocale, appDefaultLocale, appLocales } = useLanguageStore();
  const { t } = pageTranslation(pageName, appSelectedLocale?.code ?? "en");

  const router = useRouter();
  const { hasPermission } = useAuthStore();
  const { appCurrencies, appSelectedCurrency } = useCurrencyStore();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mainData, setMainData] = useState<any[]>([]);

  const [refresh, setRefresh] = useState(0);
  const refreshPage = () => {
    setRefresh((prev) => prev + 1);
  };

  const methods = [
    { id: "paypal", name: "Paypal" },
    { id: "stripe", name: "Stripe" },
    // { id: "coinbase", name: "Coinbase" },
    // { id: "binance", name: "Binance" },
    // { id: "bkash", name: "Bkash" },
    // { id: "nagad", name: "Nagad" },
  ];
  // This Page
  const [name, setName] = useState("");
  const [des, setDes] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState(1);
  const [mode, setMode] = useState("");
  const [key, setKey] = useState("");
  const [pubKey, setPubKey] = useState("");
  const [secret, setSecret] = useState("");
  const [number, setNumber] = useState("");
  const [media, setMedia] = useState<any[]>([]);
  const [currency, setCurrency] = useState<any[]>([appSelectedCurrency?.code]);
  const [showOptions, setShowOptions] = useState({
    mode: true,
    key: { status: false, name: "" },
    pub_key: { status: false, name: "" },
    secret: { status: false, name: "" },
    number: { status: false, name: "" },
  });

  const handleMethodSelect = (value: string, isName = true) => {
    if (value === "paypal") {
      setCode(value);
      isName && handleMultiLanguageInput("Paypal", setName);
      setShowOptions({
        mode: true,
        key: { status: true, name: "Paypal Key" },
        pub_key: { status: false, name: "" },
        secret: { status: true, name: "Paypal Secret" },
        number: { status: false, name: "" },
      });
    }
    if (value === "stripe") {
      setCode(value);
      isName && handleMultiLanguageInput("Stripe", setName);
      setShowOptions({
        mode: true,
        key: { status: false, name: "" },
        pub_key: { status: true, name: "Stripe Publishable key" },
        secret: { status: true, name: "Stripe Secret" },
        number: { status: false, name: "" },
      });
    }
    if (value === "coinbase") {
      setCode(value);
      isName && handleMultiLanguageInput("Coinbase", setName);
      setShowOptions({
        mode: true,
        key: { status: true, name: "Coinbase Api Key" },
        pub_key: { status: false, name: "" },
        secret: { status: false, name: "Coinbase Api Secret" },
        number: { status: false, name: "" },
      });
    }
    if (value === "binance") {
      setCode(value);
      isName && handleMultiLanguageInput("Binance", setName);
      setShowOptions({
        mode: true,
        key: { status: true, name: "Binance Key" },
        pub_key: { status: false, name: "" },
        secret: { status: true, name: "Binance Secret" },
        number: { status: false, name: "" },
      });
    }
    if (value === "bkash") {
      setCode(value);
      isName && handleMultiLanguageInput("Bkash", setName);
      setShowOptions({
        mode: true,
        key: { status: false, name: "" },
        pub_key: { status: false, name: "" },
        secret: { status: false, name: "" },
        number: { status: true, name: "Bkash Number" },
      });
    }
    if (value === "nagad") {
      setCode(value);
      isName && handleMultiLanguageInput("Nagad", setName);
      setShowOptions({
        mode: true,
        key: { status: false, name: "" },
        pub_key: { status: false, name: "" },
        secret: { status: false, name: "" },
        number: { status: true, name: "Nagad Number" },
      });
    }
    if (value === "") {
      setCode("");
      setShowOptions({
        mode: true,
        key: { status: false, name: "" },
        pub_key: { status: false, name: "" },
        secret: { status: false, name: "" },
        number: { status: false, name: "" },
      });
    }
    setErrors({});
  };

  // Handle Create a record
  const handleCreate = () => {
    let url = "v1/dashboard/gateway/create";
    const media_id = Array.isArray(media) ? (media.length ? media[0].id : null) : null;
    let data = {
      name,
      des,
      code,
      status,
      mode,
      key,
      pub_key: pubKey,
      secret,
      number,
      currency,
      logo: media_id,
    };

    let validation: any = { code, name, status, mode, currency };
    if (showOptions.key.status) {
      validation = { ...validation, key };
    }
    if (showOptions.pub_key.status) {
      validation = { ...validation, pubKey };
    }
    if (showOptions.secret.status) {
      validation = { ...validation, secret };
    }
    if (showOptions.number.status) {
      validation = { ...validation, number };
    }

    if (checkErrors({ ...validation, url }, setErrors, true)) {
      // console.log(errors);
      return;
    }

    setLoading(true);

    api
      .post(url, data)
      .then((res) => {
        setLoading(false);
        toast.success(res?.data?.message);
        router.push("/dashboard/gateway");
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
    let url = "v1/dashboard/role-permission/list";
    await api
      .post(url)
      .then((res) => {
        setLoading(false);
        setMainData(res.data.data);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err?.response?.data?.message);
      });
  };

  useEffect(() => {
    // getInitialData();
  }, [refresh]);

  const [inputLanguage, setInputLanguage] = useState<any>(appSelectedLocale?.code ?? appDefaultLocale?.code ?? "en");

  const handleMultiLanguageInput = (inputValue: any, setInputState: any) => {
    if (!inputLanguage) {
      toast.info("Please select a Lnguage first");
      return;
    }
    setInputState((prev: any) => {
      return {
        ...prev,
        [inputLanguage]: inputValue,
      };
    });
  };

  return (
    <>
      <SubHeader title={t(pageName)} showTranslationIcon={hasPermission("translation.view")} TranslationIconAction={() => setShowTranslation(true)} />

      <Section permission={hasPermission("gateway.create")} loading={loading} className="bg-white p-8 border border-gray-200 rounded-lg space-y-10">
        <LanguageSelectForInputFields currentLanguage={inputLanguage} setCurrentLnaguage={setInputLanguage} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Select items={methods} value={code} setValue={handleMethodSelect} label="Payment Method" id="Payment_Method" errorMessage={errors?.code} required />
          <Select
            items={[
              { name: "Sandbox", id: 0 },
              { name: "Live", id: 1 },
            ]}
            value={mode}
            setValue={setMode}
            label="Mode"
            id="Mode"
            errorMessage={errors?.mode}
            required
          />
          <Input
            value={name && name[inputLanguage] ? name[inputLanguage] : ""}
            setValue={(val) => handleMultiLanguageInput(val, setName)}
            label="Name"
            id="name"
            errorMessage={errors?.name}
            required
          />
          {showOptions.key.status && <Input value={key} setValue={setKey} label={showOptions.key.name} id="key" errorMessage={errors?.key} required />}
          {showOptions.secret.status && <Input value={secret} setValue={setSecret} label={showOptions.secret.name} id="secret" errorMessage={errors?.secret} required />}
          {showOptions.pub_key.status && (
            <Input value={pubKey} setValue={setPubKey} label={showOptions.pub_key.name} id="pubKey" errorMessage={errors?.pubKey} required />
          )}
          {showOptions.number.status && <Input value={number} setValue={setNumber} label={showOptions.number.name} id="number" errorMessage={errors?.number} required />}
          <Select
            items={[
              { name: "Active", id: 1 },
              { name: "Inactive", id: 0 },
            ]}
            value={status}
            setValue={setStatus}
            label="Status"
            id="Status"
            errorMessage={errors?.status}
            required
          />
          <Select
            items={appCurrencies}
            itemLabelName="code"
            itemValueName="code"
            value={currency}
            setValue={setCurrency}
            label="Currencies"
            id="Currencies"
            errorMessage={errors?.currency}
            required
            multiSelect
          />
        </div>
        <div className="space-y-2">
          <h6>Select Logo</h6>
          <MediaArea items={media} setItems={setMedia} maxSelect={1} selectOnlyTypes={["image"]} />
        </div>
        <div className="space-y-2">
          <TextArea
            value={des && des[inputLanguage] ? des[inputLanguage] : ""}
            setValue={(val) => handleMultiLanguageInput(val, setDes)}
            label="Notes / Description / Instructions"
            id="des"
            errorMessage={errors?.des}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={handleCreate} showIcon>
            Add Now
          </Button>
        </div>
        <GatewayAddTranslation show={showTranslation} setShow={setShowTranslation} />
      </Section>
    </>
  );
}

export default GatewayAddPage;
