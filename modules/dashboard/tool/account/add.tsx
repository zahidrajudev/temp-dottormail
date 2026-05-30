import api from "@/lib/api";
import { checkErrors, getQueryParam } from "@/lib/helper";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import Button from "@/modules/global/elements/button";
import Section from "@/modules/global/elements/section";
import Input from "@/modules/global/input/input";
import Select from "@/modules/global/input/select";
import TextArea from "@/modules/global/input/textarea";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function ToolAccountAddPage() {
  const router = useRouter();
  const { hasPermission } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mainData, setMainData] = useState<any>("");
  const [refresh, setRefresh] = useState(0);
  const refreshPage = () => {
    setRefresh((prev) => prev + 1);
  };

  // Input Fields States
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authType, setAuthType] = useState("cookie");
  const [isProxy, setIsProxy] = useState(0);
  const [proxyLogin, setProxyLogin] = useState(0);
  const [cookie, setCookie] = useState("");
  const [token, setToken] = useState("");
  const [maxUseLimit, setMaxUseLimit] = useState("");
  const [actionID, setActionID] = useState<any>(null);

  const [proxyProtocol, setProxyProtocol] = useState("");
  const [proxyUsername, setProxyUserName] = useState("");
  const [proxyPassword, setProxyPassword] = useState("");
  const [proxyIp, setProxyIp] = useState("");
  const [proxyPort, setProxyPort] = useState("");
  const [proxyType, setProxyType] = useState("");

  const safeParse = (value: string) => {
    try {
      return typeof value === "string" ? JSON.parse(value) : value;
    } catch (e) {
      return value; // return original if not valid JSON
    }
  };

  // Handle Create a record
  const handleCreate = () => {
    let url = "v1/dashboard/master-account/create";
    let data = {
      tool_id: actionID,
      username,
      password,
      cookie: safeParse(cookie),
      token: safeParse(token),
      max_usage_limit: maxUseLimit,
      auth_type: authType,
      is_proxy: isProxy,
      proxy_protocol: proxyProtocol,
      proxy_username: proxyUsername,
      proxy_password: proxyPassword,
      proxy_ip: proxyIp,
      proxy_port: proxyPort,
      proxy_type: proxyType,
      proxy_login: proxyLogin,
    };

    if (checkErrors({ username, password, authType }, setErrors, true)) {
      return;
    }

    if (authType == "cookie") {
      if (checkErrors({ cookie }, setErrors, true)) {
        return;
      }
    } else {
      if (checkErrors({ token }, setErrors, true)) {
        return;
      }
    }

    if (isProxy == 1) {
      if (checkErrors({ proxyUsername, proxyPassword, proxyIp, proxyPort }, setErrors, true)) {
        return;
      }
    }

    setLoading(true);

    api
      .post(url, data)
      .then((res) => {
        setLoading(false);
        toast.success(res?.data?.message);
        router.push("/dashboard/tool/account?id=" + actionID);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err?.response?.data?.message);
        setErrors(err?.response?.data?.errors);
      });
  };

  // Fetch initial data
  const getInitialData = async (id: any) => {
    setLoading(true);
    let url = "v1/dashboard/tool/view";
    const data = { id };
    await api
      .post(url, data)
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
    const id = getQueryParam("id");
    if (!id) {
      toast.error("Error: Valid url not found");
      router.back();
    }
    setActionID(id);
    getInitialData(id);
  }, [refresh]);

  return (
    <Section permission={hasPermission("tool-account.create")} loading={loading} className="bg-white p-8 border border-gray-200 rounded-lg space-y-10">
      <div className="flex flex-wrap gap-5 p-5 border border-gray-200 rounded-lg">
        <div className="bg-violet-50 rounded-full px-4 py-1.5">Name: {mainData?.name}</div>
        <div className="bg-violet-50 rounded-full px-4 py-1.5">Category: {mainData?.category}</div>
        <div className="bg-violet-50 rounded-full px-4 py-1.5">Official Url: {mainData?.official_url}</div>
      </div>
      <div className="grid grid-cols-3 gap-10">
        <Input
          value={username}
          setValue={setUsername}
          label="User Name"
          id="username"
          iconName="person"
          errorMessage={errors?.username}
          required
          placeholder="Enter UserName"
        />
        <Input
          value={password}
          setValue={setPassword}
          label="Password"
          id="Password"
          iconName="person"
          errorMessage={errors?.password}
          required
          placeholder="Enter Password"
        />
        <Input
          value={maxUseLimit}
          setValue={setMaxUseLimit}
          label="Max Use Limit"
          id="max_usage_limit"
          iconName="person"
          errorMessage={errors?.max_usage_limit}
          required
          placeholder="Enter Limit"
        />
      </div>
      <div className="grid grid-cols-3 gap-10">
        <Select
          items={[
            { name: "Cookie", id: "cookie" },
            { name: "Token", id: "token" },
          ]}
          value={authType}
          setValue={setAuthType}
          label="Select Authentication Type"
          id="DefaultValue"
          errorMessage={errors?.email_status}
          required
          placeholder="Select an option"
        />
        <Select
          items={[
            { name: "Yes", id: 1 },
            { name: "No", id: 0 },
          ]}
          value={isProxy}
          setValue={setIsProxy}
          label="Using Proxy?"
          id="DefaultValue"
          errorMessage={errors?.email_status}
          required
          placeholder="Select an option"
        />
        <Select
          items={[
            { name: "Yes", id: 1 },
            { name: "No", id: 0 },
          ]}
          value={proxyLogin}
          setValue={setProxyLogin}
          label="Is Proxy Required Login?"
          id="DefaultValue"
          errorMessage={errors?.email_status}
          required
          placeholder="Select an option"
        />
      </div>
      <div className="grid grid-cols-1 gap-10">
        {authType == "cookie" && (
          <TextArea value={cookie} setValue={setCookie} label="Cookie" id="Cookie" errorMessage={errors?.cookie} required placeholder="Enter Cookie" />
        )}
        {authType == "token" && <TextArea value={token} setValue={setToken} label="Token" id="Token" errorMessage={errors?.token} required placeholder="Enter Token" />}
      </div>

      {isProxy == 1 && (
        <div className="grid grid-cols-2 gap-10 border border-gray-200 rounded-lg p-5 bg-fuchsia-50">
          <Input
            value={proxyProtocol}
            setValue={setProxyProtocol}
            label="Proxy Protocol"
            id="proxy_protocol"
            errorMessage={errors?.proxy_protocol}
            placeholder="Enter Proxy Protocol"
          />
          <Input value={proxyIp} setValue={setProxyIp} label="Proxy IP / address" id="proxyip" errorMessage={errors?.proxyIp} required placeholder="Enter Proxy Ip" />
          <Input
            type="number"
            value={proxyPort}
            setValue={setProxyPort}
            label="Proxy Port"
            id="proxyPort"
            errorMessage={errors?.proxyPort}
            required
            placeholder="Enter Proxy Port"
          />
          <Input
            value={proxyUsername}
            setValue={setProxyUserName}
            label="Proxy UserName"
            id="proxyusername"
            errorMessage={errors?.proxyUsername}
            required
            placeholder="Enter Proxy UserName"
          />
          <Input
            value={proxyPassword}
            setValue={setProxyPassword}
            label="Proxy Password"
            id="proxyPassword"
            errorMessage={errors?.proxyPassword}
            required
            placeholder="Enter Proxy Password"
          />
        </div>
      )}

      <div className="flex items-end">
        <Button onClick={handleCreate} showIcon>
          Add Now
        </Button>
      </div>
    </Section>
  );
}

export default ToolAccountAddPage;
