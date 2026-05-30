import api from "@/lib/api";
import { checkErrors, getQueryParam } from "@/lib/helper";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import Button from "@/modules/global/elements/button";
import MediaArea from "@/modules/global/elements/media_area";
import Section from "@/modules/global/elements/section";
import Input from "@/modules/global/input/input";
import LanguageSelectForInputFields from "@/modules/language/components/LanguageSelectForInputFields";
import { useLanguageStore } from "@/modules/language/store/useLanguageStore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function UserProfileEditPage() {
  const { hasPermission, appUser } = useAuthStore();
  const router = useRouter();
  const { appSelectedLocale, appDefaultLocale } = useLanguageStore();
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

  const handleUpdate = () => {
    let url = "v1/dashboard/user/profile/update";
    const media_id = Array.isArray(media) ? (media.length ? media[0].id : null) : null;
    let data = {
      name,
      phone,
      username,
      media: media_id,
    };

    if (checkErrors({ name }, setErrors, false)) {
      return;
    }

    setLoading(true);

    api
      .post(url, data)
      .then((res) => {
        //router.push("/dashboard/user");
        setLoading(false);
        toast.success(res?.data?.message);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err?.response?.data?.message);
        setErrors(err?.response?.data?.errors);
      });
  };

  const getInitialData = async () => {
    setLoading(true);
    let url = "v1/dashboard/user/profile/edit";
    await api
      .post(url)
      .then((res) => {
        setLoading(false);
        const resData = res.data?.data;
        if (resData) {
          setName(resData?.translations?.name ?? "");
          setPhone(resData?.phone ?? "");
          setUsername(resData?.username ?? "");
          setMedia(resData?.media ?? "");
          if (resData?.media) {
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
    <Section permission={hasPermission("user.edit")} loading={loading} className="bg-white p-8 border border-gray-200 rounded-lg space-y-10">
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

      <div className="space-y-2">
        <h6>Select Profile Photo</h6>
        <MediaArea items={media} setItems={setMedia} maxSelect={1} selectOnlyTypes={["image"]} />
      </div>
      <div className="flex items-end">
        <Button onClick={handleUpdate} showIcon>
          Update Now
        </Button>
      </div>
    </Section>
  );
}

export default UserProfileEditPage;
