import api from "@/lib/api";
import { checkErrors } from "@/lib/helper";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import Button from "@/modules/global/elements/button";
import EmailConfigTranslation from "@/modules/dashboard/setting/translation/email-config";
import Section from "@/modules/global/elements/section";
import Input from "@/modules/global/input/input";
import Select from "@/modules/global/input/select";
import SubHeader from "@/modules/global/widget/sub_header";
import pageTranslation from "@/modules/language/components/PageTranslation";
import { useLanguageStore } from "@/modules/language/store/useLanguageStore";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function EmailConfigSetting() {
  const { hasPermission } = useAuthStore();
  const pageName = "email_config";
  const { appSelectedLocale } = useLanguageStore();
  const { t } = pageTranslation(pageName, appSelectedLocale?.code ?? "en");
  const [showTranslation, setShowTranslation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [refresh, setRefresh] = useState(0);
  const refreshPage = () => {
    setRefresh((prev) => prev + 1);
  };

  // Input Fields States
  const [adminEmail, setAdminEmail] = useState("");
  const [mailer, setMailer] = useState("smtp");
  const [host, setHost] = useState("");
  const [port, setPort] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [encription, setEncription] = useState("tls");
  const [fromAddress, setFromAddress] = useState("");
  const [fromName, setFromName] = useState("");

  const handleCreateOrUpdate = () => {
    if (checkErrors({ adminEmail, mailer, host, port, username, password, fromAddress, fromName }, setErrors, true)) {
      return;
    }

    let url = "v1/dashboard/settings/create-or-update";
    let credentials = { admin_email: adminEmail, mailer, host, port, username, password, encription, from_address: fromAddress, from_name: fromName };
    let data = {
      name: "email",
      value_text: JSON.stringify(credentials),
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
    const data = { name: "email" };
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
          setAdminEmail(parseData?.admin_email);
          setMailer(parseData?.mailer);
          setHost(parseData?.host);
          setPort(parseData?.port);
          setUsername(parseData?.username);
          setPassword(parseData?.password);
          setEncription(parseData?.encription);
          setFromAddress(parseData?.from_address);
          setFromName(parseData?.from_name);
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border border-gray-200 p-8 rounded">
        <Select
          items={[
            { name: "SMTP", id: "smtp" },
            // { name: "Sendmail", id: "sendmail" },
            // { name: "Mailgun", id: "mailgun" },
            // { name: "Amazon SES", id: "ses" },
            // { name: "Postmark", id: "postmark" },
            // { name: "Log (Testing)", id: "log" },
          ]}
          value={mailer}
          setValue={setMailer}
          label={t("mailer")}
          id="mailer"
          errorMessage={errors?.mailer}
          required
          placeholder={t("mailer")}
        />

        <Input value={host} setValue={setHost} label={t("host")} id="host" errorMessage={errors?.host} required placeholder={t("name")} />
        <Input type="number" value={port} setValue={setPort} label={t("port")} id="port" errorMessage={errors?.port} required placeholder={t("port")} />
        <Input value={username} setValue={setUsername} label={t("username")} id="username" errorMessage={errors?.username} required placeholder={t("username")} />
        <Input value={password} setValue={setPassword} label={t("password")} id="password" errorMessage={errors?.password} required placeholder={t("password")} />
        <Select
          items={[
            { name: "TLS", id: "tls" },
            { name: "SSL", id: "ssl" },
            { name: "None", id: "" },
          ]}
          value={encription}
          setValue={setEncription}
          label={t("encription")}
          id="encription"
          errorMessage={errors?.encription}
          placeholder={t("encription")}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border border-gray-200 p-8 rounded">
        <Input
          value={fromAddress}
          setValue={setFromAddress}
          label={t("from_address")}
          id="fromAddress"
          errorMessage={errors?.fromAddress}
          required
          placeholder={t("from_address")}
        />
        <Input value={fromName} setValue={setFromName} label={t("from_name")} id="fromName" errorMessage={errors?.fromName} required placeholder={t("from_name")} />
        <Input
          value={adminEmail}
          setValue={setAdminEmail}
          label={t("admin_email")}
          id="adminEmail"
          errorMessage={errors?.adminEmail}
          required
          placeholder={t("admin_email")}
        />
      </div>

      <div className="flex items-end">
        <Button onClick={handleCreateOrUpdate} showIcon>
          {t("submit_now")}
        </Button>
      </div>

      <EmailConfigTranslation show={showTranslation} setShow={setShowTranslation} />
    </Section>
  );
}

export default EmailConfigSetting;
