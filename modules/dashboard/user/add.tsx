import api from "@/lib/api";
import { checkErrors } from "@/lib/helper";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import Button from "@/modules/global/elements/button";
import MediaArea from "@/modules/global/elements/media_area";
import Section from "@/modules/global/elements/section";
import Input from "@/modules/global/input/input";
import Select from "@/modules/global/input/select";
import SubHeader from "@/modules/global/widget/sub_header";
import LanguageSelectForInputFields from "@/modules/language/components/LanguageSelectForInputFields";
import pageTranslation from "@/modules/language/components/PageTranslation";
import { useLanguageStore } from "@/modules/language/store/useLanguageStore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import UserAddTranslation from "./translation/add";

function UserAddPage() {
  const router = useRouter();
  const { hasPermission } = useAuthStore();
  const pageName = "user_add";
  const { appSelectedLocale, appDefaultLocale } = useLanguageStore();
  const { t } = pageTranslation(pageName, appSelectedLocale?.code ?? "en");
  const [showTranslation, setShowTranslation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mainData, setMainData] = useState<any[]>([]);

  const [refresh, setRefresh] = useState(0);
  const refreshPage = () => {
    setRefresh((prev) => prev + 1);
  };
  // This Page
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [media, setMedia] = useState<any>("");
  const [status, setStatus] = useState(1);
  const [emailStatus, setEmailStatus] = useState(1);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<string | number | (string | number)[]>("");

  const handleCreate = () => {
    let url = "v1/dashboard/user/create";
    const media_id = Array.isArray(media) ? (media.length ? media[0].id : null) : null;
    let data = {
      name,
      phone,
      username,
      email,
      media: media_id,
      email_status: emailStatus,
      password,
      status,
      role,
    };

    if (checkErrors({ name, email, status, role, password }, setErrors, false)) {
      return;
    }

    if (password != confirmPassword) {
      setErrors({ password: "Both Passwords are not matched" });
      return;
    }

    setLoading(true);

    api
      .post(url, data)
      .then((res) => {
        refreshPage();
        setLoading(false);
        toast.success(res?.data?.message);
        router.push("/dashboard/user");
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err?.response?.data?.message);
        setErrors(err?.response?.data?.errors);
      });
  };

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
    getInitialData();
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
      <SubHeader title={t(pageName)} showTranslationIcon TranslationIconAction={() => setShowTranslation(true)} />

      <Section permission={hasPermission("user.create")} loading={loading} className="bg-white p-8 border border-gray-200 rounded-lg space-y-10">
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
            placeholder={t("enter_full_name")}
          />
          <Input
            value={email}
            setValue={setEmail}
            label={t("email")}
            id="Email"
            iconName="mail"
            errorMessage={errors?.email}
            required
            placeholder={t("enter_email_address")}
          />
          <Input
            value={username}
            setValue={setUsername}
            label={t("username")}
            id="Username"
            placeholder={t("enter_username")}
            iconName="person"
            errorMessage={errors?.username}
            notes={[t("no_whitespace_allowed"), t("example_user123")]}
          />
          <Input
            value={phone}
            setValue={setPhone}
            label={t("phone")}
            id="Phone"
            iconName="call"
            errorMessage={errors?.phone}
            required
            placeholder={t("enter_phone_number")}
            notes={[t("please_add_your")]}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <Select
            items={[
              { name: t("active"), id: 1 },
              { name: t("inactive"), id: 0 },
            ]}
            value={status}
            setValue={setStatus}
            label={t("account_status")}
            id="DefaultValue"
            errorMessage={errors?.status}
            required
            placeholder={t("select_account_status")}
          />

          <Select
            items={[
              { name: t("verified"), id: 1 },
              { name: t("unverified"), id: 0 },
            ]}
            value={emailStatus}
            setValue={setEmailStatus}
            label={t("email_status")}
            id="DefaultValue"
            errorMessage={errors?.email_status}
            required
            placeholder={t("select_email_status")}
          />

          <Select items={mainData} value={role} setValue={setRole} label={t("role")} id="Role" errorMessage={errors?.role} required placeholder={t("select_role")} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Input
            type="password"
            value={password}
            setValue={setPassword}
            label={t("password")}
            id="Password"
            placeholder="*******"
            iconName="person"
            errorMessage={errors?.password}
          />
          <Input
            type="password"
            value={confirmPassword}
            setValue={setConfirmPassword}
            label={t("confirm_password")}
            id="confirm_password"
            iconName="call"
            errorMessage={errors?.password}
            required
            placeholder="*******"
          />
        </div>
        <div className="space-y-2">
          <h6>{t("select_profile_photo")}</h6>
          <MediaArea items={media} setItems={setMedia} maxSelect={1} selectOnlyTypes={["image"]} />
        </div>
        <div className="flex items-end">
          <Button onClick={handleCreate} showIcon>
            {t("add_now")}
          </Button>
        </div>
      </Section>

      <UserAddTranslation show={showTranslation} setShow={setShowTranslation} />
    </>
  );
}

export default UserAddPage;
