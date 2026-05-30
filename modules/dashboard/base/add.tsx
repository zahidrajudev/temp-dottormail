import api from "@/lib/api";
import { checkErrors, convertToNumber } from "@/lib/helper";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import Button from "@/modules/global/elements/button";
import MediaArea from "@/modules/global/elements/media_area";
import Section from "@/modules/global/elements/section";
import Input from "@/modules/global/input/input";
import Select from "@/modules/global/input/select";
import LanguageSelectForInputFields from "@/modules/language/components/LanguageSelectForInputFields";
import { useLanguageStore } from "@/modules/language/store/useLanguageStore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function BaseAddPage() {
  const router = useRouter();
  const { hasPermission } = useAuthStore();
  const { appSelectedLocale, appDefaultLocale } = useLanguageStore();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mainData, setMainData] = useState<any[]>([]);

  const [refresh, setRefresh] = useState(0);
  const refreshPage = () => {
    setRefresh((prev) => prev + 1);
  };
  // Input Fields States
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

  // Handle Create a record
  const handleCreate = () => {
    let url = "v1/dashboard/user/create";
    const media_id = Array.isArray(media) ? (media.length ? media[0].id : null) : null;
    let data = {
      name,
      phone,
      username,
      email,
      media: convertToNumber(media_id),
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
        router.push("/dashboard/base");
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
    <Section permission={hasPermission("user.create")} loading={loading} className="bg-white p-8 border border-gray-200 rounded-lg space-y-10">
      <LanguageSelectForInputFields currentLanguage={inputLanguage} setCurrentLnaguage={setInputLanguage} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <Input
          value={name && name[inputLanguage] ? name[inputLanguage] : ""}
          setValue={(val) => handleMultiLanguageInput(val, setName)}
          label="Name"
          id="name"
          iconName="person"
          errorMessage={errors?.name}
          required
          placeholder="Enter Full Name"
        />
        <Input value={email} setValue={setEmail} label="Email" id="Email" iconName="mail" errorMessage={errors?.email} required placeholder="Enter Email Address" />
        <Input
          value={username}
          setValue={setUsername}
          label="Username"
          id="Username"
          placeholder="Enter Username"
          iconName="person"
          errorMessage={errors?.username}
          notes={["No whitespace allowed and Username must be unique.", "Example: user123"]}
        />
        <Input
          value={phone}
          setValue={setPhone}
          label="Phone"
          id="Phone"
          iconName="call"
          errorMessage={errors?.phone}
          required
          placeholder="Enter Phone Number"
          notes={["Please add your country code."]}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <Select
          items={[
            { name: "Active", id: 1 },
            { name: "Inactive", id: 0 },
          ]}
          value={status}
          setValue={setStatus}
          label="Account Status"
          id="DefaultValue"
          errorMessage={errors?.status}
          required
          placeholder="Select Account Status"
        />

        <Select
          items={[
            { name: "Verified", id: 1 },
            { name: "Unverified", id: 0 },
          ]}
          value={emailStatus}
          setValue={setEmailStatus}
          label="Email Status"
          id="DefaultValue"
          errorMessage={errors?.email_status}
          required
          placeholder="Select Email Status"
        />

        <Select items={mainData} value={role} setValue={setRole} label="Role" id="Role" errorMessage={errors?.role} required placeholder="Select Role" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <Input type="password" value={password} setValue={setPassword} label="Password" id="Password" placeholder="*******" iconName="person" errorMessage={errors?.password} />
        <Input
          type="password"
          value={confirmPassword}
          setValue={setConfirmPassword}
          label="Confirm Password"
          id="confirm_password"
          iconName="call"
          errorMessage={errors?.password}
          required
          placeholder="*******"
        />
      </div>
      <div className="space-y-2">
        <h6>Select Profile Photo</h6>
        <MediaArea items={media} setItems={setMedia} maxSelect={1} selectOnlyTypes={["image"]} />
      </div>
      <div className="flex items-end">
        <Button onClick={handleCreate} showIcon>
          Add Now
        </Button>
      </div>
    </Section>
  );
}

export default BaseAddPage;
