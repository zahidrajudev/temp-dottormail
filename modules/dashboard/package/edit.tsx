import api from "@/lib/api";
import { checkErrors, convertToNumber, getQueryParam } from "@/lib/helper";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { useCurrencyStore } from "@/modules/currency/store/useCurrencyStore";
import Button from "@/modules/global/elements/button";
import MediaArea from "@/modules/global/elements/media_area";
import Section from "@/modules/global/elements/section";
import Switch from "@/modules/global/elements/switch";
import Input from "@/modules/global/input/input";
import Select from "@/modules/global/input/select";
import TextArea from "@/modules/global/input/textarea";
import LanguageSelectForInputFields from "@/modules/language/components/LanguageSelectForInputFields";
import { useLanguageStore } from "@/modules/language/store/useLanguageStore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PackageEditTranslation from "./translations/edit";
import pageTranslation from "@/modules/language/components/PageTranslation";
import SubHeader from "@/modules/global/widget/sub_header";

function PackageEditPage() {
  const pageName = "package_edit";
  const [showTranslation, setShowTranslation] = useState(false);
  const { appSelectedLocale, appDefaultLocale, appLocales } = useLanguageStore();
  const { t } = pageTranslation(pageName, appSelectedLocale?.code ?? "en");
  const { hasPermission } = useAuthStore();
  const router = useRouter();

  const { appDefaultCurrency } = useCurrencyStore();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mainData, setMainData] = useState<any[]>([]);

  const [refresh, setRefresh] = useState(0);
  const refreshPage = () => {
    setRefresh((prev) => prev + 1);
  };

  // Input Fields States
  const [name, setName] = useState("");
  const [status, setStatus] = useState(1);
  const [visible, setVisible] = useState(1);
  const [defaultValue, setDefaultValue] = useState(0);
  const [popular, setPopular] = useState(0);
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState<any[]>([]); // Initialize as Feature[]
  const [price, setPrice] = useState<number | string>("");
  const [credit, setCredit] = useState<number | string>("");
  const [day, setDay] = useState<number | string>("");
  const [media, setMedia] = useState<any>("");
  const [isSubscription, setIsSubscription] = useState<any>(0);
  const [recurring, setrecurring] = useState<any>("");
  const [changePrice, setChangePrice] = useState(0);
  const [moveCustomer, setMoveCustomer] = useState(0);

  const [inputLanguage, setInputLanguage] = useState<any>(appSelectedLocale?.code ?? appDefaultLocale?.code ?? "en");

  const [actionID, setActionID] = useState<any>(null);

  const addNewFeatureField = () => {
    setFeatures((prev) => {
      const updatedFeatures = { ...prev };

      appLocales.forEach((locale) => {
        const langCode: any = locale.code;
        const currentList = updatedFeatures[langCode] || [];

        const newItem = {
          id: currentList.length + 1,
          icon: "done_all",
          name: `Feature Name ${currentList.length + 1}`,
        };

        updatedFeatures[langCode] = [...currentList, newItem];
      });

      return updatedFeatures;
    });
  };

  const removeFeatureField = (id: number) => {
    setFeatures((prev) => {
      const updatedFeatures = { ...prev };

      appLocales.forEach((locale) => {
        const langCode: any = locale.code;
        const currentList = updatedFeatures[langCode] || [];

        updatedFeatures[langCode] = currentList
          .filter((item: any) => item.id !== id)
          .map((item: any, index: number) => ({
            ...item,
            id: index + 1,
          }));
      });

      return updatedFeatures;
    });
  };

  const setValueForFeatureField = (id: number, value: string) => {
    setFeatures((prev) => {
      const currentList = prev[inputLanguage] || [];

      const newList = currentList.map((item: any) => (item.id === id ? { ...item, name: value } : item));

      return {
        ...prev,
        [inputLanguage]: newList,
      };
    });
  };

  const setIconForFeatureField = (id: number, icon: string) => {
    setFeatures((prev) => {
      const updatedFeatures = { ...prev };

      appLocales.forEach((locale) => {
        const langCode: any = locale.code;
        const currentList = updatedFeatures[langCode] || [];

        updatedFeatures[langCode] = currentList.map((item: any) => (item.id === id ? { ...item, icon } : item));
      });

      return updatedFeatures;
    });
  };

  const handleUpdate = () => {
    let url = "v1/dashboard/package/update";
    const media_id = Array.isArray(media) ? (media.length ? media[0]?.id : null) : null;
    let data = {
      id: actionID,
      name,
      currency: appDefaultCurrency?.code,
      price: convertToNumber(price),
      credit: convertToNumber(credit),
      status: convertToNumber(status),
      visible: convertToNumber(visible),
      default: convertToNumber(defaultValue),
      popular: convertToNumber(popular),
      features,
      media_id: convertToNumber(media_id),
      description,
      is_subscription: isSubscription,
      recurring,
      change_price: changePrice,
      move_customer: moveCustomer,
    };

    if (checkErrors({ actionID, name, price, credit }, setErrors, false)) {
      return;
    }

    setLoading(true);

    api
      .post(url, data)
      .then((res) => {
        router.push("/dashboard/package");
        setLoading(false);
        toast.success(res?.data?.message);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err?.response?.data?.message);
        setErrors(err?.response?.data?.errors);
      });
  };

  const getInitialData = async (id: any) => {
    setLoading(true);
    let url = "v1/dashboard/package/edit";
    let data = { id };
    await api
      .post(url, data)
      .then((res) => {
        setLoading(false);
        setMainData(res.data.roles);
        const resData = res.data?.data;
        if (resData) {
          setName(resData?.translations?.name ?? "");
          setDescription(resData?.translations?.des ?? "");
          setFeatures(resData?.translations?.features ?? []);
          setPrice(resData?.price ?? 0);
          setCredit(resData?.credit ?? 0);
          setDefaultValue(resData?.default ?? 0);
          setIsSubscription(resData?.is_subscription ?? 0);
          setrecurring(resData?.recurring ?? 0);
          setStatus(resData?.status ?? 0);
          setVisible(resData?.visible ?? 0);
          setPopular(resData?.popular ?? 0);
          if (typeof resData?.media === "object") {
            setMedia([resData?.media]);
          }
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err?.response?.data?.message);
      });
  };

  useEffect(() => {
    const id = getQueryParam("id");
    if (!id) {
      toast.error("Error: Valid url not found");
      router.back();
    }
    setActionID(id);
    getInitialData(id);
  }, [refresh]);

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
      <Section permission={hasPermission("package.edit")} loading={loading} className="bg-white p-8 border border-gray-200 rounded-lg space-y-10">
        <LanguageSelectForInputFields currentLanguage={inputLanguage} setCurrentLnaguage={setInputLanguage} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Input
            value={name && name[inputLanguage] ? name[inputLanguage] : ""}
            setValue={(val) => handleMultiLanguageInput(val, setName)}
            label={t("name")}
            id="name"
            iconName="person"
            errorMessage={errors?.name}
            required
            placeholder="Enter Name"
          />
          {isSubscription !== 1 && (
            <Input
              value={price}
              setValue={setPrice}
              label={`${t("price")} (${appDefaultCurrency?.symbol})`}
              id="EPricel"
              errorMessage={errors?.price}
              required
              placeholder="Enter Price"
              notes={[`Price should be in ${appDefaultCurrency?.code} currency`]}
            />
          )}
          <Input value={credit} setValue={setCredit} label="Credit" id="Credit" placeholder="Enter Credit" errorMessage={errors?.credit} />

          {/* <Select
          items={[
            { name: "Yes", id: 1 },
            { name: "No", id: 0 },
          ]}
          value={isSubscription}
          setValue={setIsSubscription}
          label="Is Subscription?"
          id="isSubscription"
          errorMessage={errors?.isSubscription}
          required
          placeholder="Select an Option"
        /> */}

          {/* <Select
            items={[
              { name: t("daily"), id: "day" },
              { name: t("weekly"), id: "week" },
              { name: t("monthly"), id: "month" },
              { name: t("yearly"), id: "year" },
            ]}
            value={recurring}
            setValue={setrecurring}
            label={t("subscription_recurring")}
            id="isSubscription"
            errorMessage={errors?.recurring}
            required
            placeholder="Select an Option"
          /> */}

          {/* <Select
          items={[
            { name: "Yes", id: 1 },
            { name: "No", id: 0 },
          ]}
          value={defaultValue}
          setValue={setDefaultValue}
          label="Is Default Package?"
          id="DefaultValue"
          errorMessage={errors?.default}
          required
          placeholder="Select an Option"
        /> */}

          {/* <Select
          items={[
            { name: "Yes", id: 1 },
            { name: "No", id: 0 },
          ]}
          value={visible}
          setValue={setVisible}
          label="Visible to Users?"
          id="DefaultValue"
          errorMessage={errors?.visible}
          required
          placeholder="Select an Option"
        /> */}

          {/* <Select
          items={[
            { name: "Active", id: 1 },
            { name: "Inactive", id: 0 },
          ]}
          value={status}
          setValue={setStatus}
          label="Status"
          id="DefaultValue"
          errorMessage={errors?.status}
          required
          placeholder="Select Status"
        /> */}

          <Select
            items={[
              { name: "Yes", id: 1 },
              { name: "No", id: 0 },
            ]}
            value={popular}
            setValue={setPopular}
            label="Mark as Popular?"
            id="DefaultValue"
            errorMessage={errors?.popular}
            required
            placeholder="Select Email Status"
          />
        </div>
        {isSubscription == 1 && (
          <div className="flex flex-wrap justify-between items-center bg-fuchsia-50 p-5 rounded">
            <div>{t("change_price")}</div>
            <div className="">
              <Switch value={changePrice === 1} onChange={(val) => setChangePrice(val ? 1 : 0)} />
            </div>
          </div>
        )}
        {changePrice ? (
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
            <div>
              <Input
                value={price}
                setValue={setPrice}
                label={`${t("price")} (${appDefaultCurrency?.symbol})`}
                id="EPricel"
                errorMessage={errors?.price}
                required
                placeholder="Enter Price"
                notes={[`Price should be in ${appDefaultCurrency?.code} currency`]}
              />
            </div>
            <div className="flex flex-wrap justify-between items-center bg-fuchsia-50 p-3 rounded">
              <div>{t("move_customers")}</div>
              <div className="">
                <Switch value={moveCustomer === 1} onChange={(val) => setMoveCustomer(val ? 1 : 0)} />
              </div>
            </div>
          </div>
        ) : (
          ""
        )}

        <div className="flex">
          <div>
            <Button onClick={addNewFeatureField} border="rounded" showIcon={true} iconName="add">
              {t("add_feature")}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {features?.[inputLanguage]?.map((fea: any, indx: number) => (
            <div key={indx} className="flex gap-2 items-center">
              <div className="max-w-48 w-full">
                <Select
                  items={[
                    { name: t("included"), id: "done_all" },
                    { name: t("excluded"), id: "close" },
                  ]}
                  value={fea?.icon}
                  setValue={(value: string) => setIconForFeatureField(fea?.id, value)}
                  labelShow={false}
                  id={`${fea?.id}-icon`}
                />
              </div>

              <div className="flex-1">
                <Input
                  value={fea?.name}
                  setValue={(value: string) => setValueForFeatureField(fea?.id, value)}
                  labelShow={false}
                  iconShow={false}
                  id={`${fea?.id}-name`}
                />
              </div>

              <div className="cursor-pointer" onClick={() => removeFeatureField(fea?.id)} title="Remove">
                <Button border="rounded" showIcon={true} iconName="close" />
              </div>
            </div>
          ))}
        </div>

        <div>
          <TextArea
            value={description && description[inputLanguage] ? description[inputLanguage] : ""}
            setValue={(val) => handleMultiLanguageInput(val, setDescription)}
            label={t("description")}
            id="Description"
            placeholder="Enter Description"
            errorMessage={errors?.description}
          />
        </div>

        {/* <div className="space-y-2">
        <h6>Select Photo</h6>
        <MediaArea items={media} setItems={setMedia} maxSelect={1} selectOnlyTypes={["image"]} />
      </div> */}

        <div className="flex items-end">
          <Button onClick={handleUpdate} showIcon>
            {t("update_now")}
          </Button>
        </div>

        <PackageEditTranslation show={showTranslation} setShow={setShowTranslation} />
      </Section>
    </>
  );
}

export default PackageEditPage;
