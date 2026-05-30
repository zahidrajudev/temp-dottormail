import api from "@/lib/api";
import { checkErrors, convertToNumber } from "@/lib/helper";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { useCurrencyStore } from "@/modules/currency/store/useCurrencyStore";
import AnimationDiv from "@/modules/global/animations/animate_div";
import Button from "@/modules/global/elements/button";
import MediaArea from "@/modules/global/elements/media_area";
import Section from "@/modules/global/elements/section";
import SvgIcon from "@/modules/global/icons/svg_icons";
import Input from "@/modules/global/input/input";
import Select from "@/modules/global/input/select";
import LanguageSelectForInputFields from "@/modules/language/components/LanguageSelectForInputFields";
import { useLanguageStore } from "@/modules/language/store/useLanguageStore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function SubscriptionAddPage() {
  const router = useRouter();
  const { hasPermission } = useAuthStore();
  const { appSelectedLocale, appDefaultLocale } = useLanguageStore();
  const { formatPrice } = useCurrencyStore();
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

  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginateInfo, setPaginateInfo] = useState("");

  const [cards, setCards] = useState<any>(null);
  const [isDefaultCard, setIsDefaultCard] = useState<boolean>(false);
  const [defaultCardDetails, setDefaultCardDetails] = useState<any>("");

  const checkIfAnyCardConnected = async () => {
    setLoading(true);
    let data = {
      page: currentPage,
    };
    let url = "v1/dashboard/payment-card/list";
    await api
      .post(url, data)
      .then((res) => {
        const resData = res.data?.data;
        // setLoading(false);
        setCards(resData);
        if (Array.isArray(resData)) {
          resData.map((itm) => {
            if (itm.is_default == 1) {
              setIsDefaultCard(true);
              setDefaultCardDetails(itm);
            }
          });
        }
      })
      .catch((err) => {
        // setLoading(false);
        //toast.error(err?.response?.data?.message);
      });
  };

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
    let url = "v1/packages";
    await api
      .get(url)
      .then((res) => {
        checkIfAnyCardConnected();
        setLoading(false);
        setMainData(res.data.data);
        //setTotalPage(res.data.data.last_page);
        //setPaginateInfo(res.data.data.to + " out of " + res.data.data.total);
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

  const printRecurring = (value: string) => {
    if (value == "day") {
      return "Daily";
    }
    if (value == "week") {
      return "Weekly";
    }
    if (value == "month") {
      return "Monthly";
    }
    if (value == "year") {
      return "Yearly";
    }
  };

  const [selectedPkg, setSelectedPkg] = useState<any>(null);
  const [steps, setSteps] = useState(1);

  const handleSubscribePackage = async () => {
    if (Array.isArray(cards) && cards.length > 0 && isDefaultCard) {
      if (selectedPkg) {
        setLoading(true);
        let data = {
          pkg_id: selectedPkg?.id,
        };
        let url = "v1/dashboard/subscription/create";
        await api
          .post(url, data)
          .then((res) => {
            setLoading(false);
            toast.success(res?.data?.message);
            //router.push("/dashboard/subscription");
            setSteps(3);
          })
          .catch((err) => {
            setLoading(false);
            toast.error(err?.response?.data?.message);
          });
      }
    }
  };

  const handleSteps = (step_number: number, data: any = "") => {
    if (step_number == 2) {
      if (data) {
        setSelectedPkg(data);
        setSteps(2);
      }
    }
    if (step_number == 3) {
      handleSubscribePackage();
    }
  };

  return (
    <Section permission={hasPermission("subscription.create")} loading={loading} className="bg-white p-8 border border-gray-200 rounded-lg space-y-10">
      <div className="flex items-center justify-center">
        <div className="size-10 rounded-full bg-violet-600 flex items-center justify-center text-white font-black text-xl">1</div>
        <div className="max-w-30 w-full">
          <hr />
        </div>
        <div className={`size-10 rounded-full bg-violet-600 flex items-center justify-center text-white font-black text-xl ${steps > 1 ? "opacity-100" : "opacity-50"}`}>
          2
        </div>
        <div className="max-w-30 w-full">
          <hr />
        </div>
        <div className={`size-10 rounded-full bg-violet-600 flex items-center justify-center text-white font-black text-xl ${steps > 2 ? "opacity-100" : "opacity-50"}`}>
          3
        </div>
      </div>
      {steps == 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-2">
          {Array.isArray(mainData) &&
            mainData.map((plan, index) => (
              <div key={index} className="flex justify-center rounded-xl shadow-custom-5">
                <div className="h-full bg-white p-4 md:p-10 rounded-3xl space-y-6">
                  <div className="w-full flex justify-start">
                    <AnimationDiv className="px-4 py-2 rounded-full bg-violet-600 text-white font-bold">{printRecurring(plan?.recurring)}</AnimationDiv>
                  </div>

                  <div className="space-y-1">
                    <AnimationDiv className="text-start font-semibold text-3xl">{plan?.name}</AnimationDiv>
                    <AnimationDiv className="text-start">{plan?.des}</AnimationDiv>
                  </div>

                  <div className="w-full flex justify-start">
                    <AnimationDiv className="px-4 py-2 rounded-full bg-fuchsia-600 text-white font-bold text-5xl">{formatPrice(plan?.price)}</AnimationDiv>
                  </div>
                  <hr className="border-gray-600/30" />
                  <AnimationDiv>
                    <div className="space-y-4">
                      {Array.isArray(plan?.features) &&
                        plan?.features.map((feature: any, indexf: any) => (
                          <div key={indexf} className="flex items-center gap-1">
                            <SvgIcon name={feature?.icon} className="text-green-800 size-6" />
                            <p className="text-gray-700">{feature?.name}</p>
                          </div>
                        ))}
                    </div>
                  </AnimationDiv>
                  <Button onClick={() => handleSteps(2, plan)} border="rounded-full" showIcon>
                    Select
                  </Button>
                </div>
              </div>
            ))}
        </div>
      )}
      {steps == 2 && (
        <div className="p-10 space-y-8">
          <div className="grid grid-cols-2 gap-10">
            <div className="p-5 border border-violet-200 rounded space-y-2">
              <div className="px-5 py-2 rounded-full bg-violet-600 w-max text-white font-semibold">Selected Plan</div>
              <h1 className="text-xl font-semibold">
                {selectedPkg?.name} ({formatPrice(selectedPkg?.price)})
              </h1>
              <p>{selectedPkg?.des}</p>
            </div>
            <div className="p-5 border border-violet-200 rounded space-y-2">
              <div className="px-5 py-2 rounded-full bg-violet-600 w-max text-white font-semibold">Billed {printRecurring(selectedPkg?.recurring)}</div>
              <h3 className="text-lg">
                {formatPrice(selectedPkg?.price)} will be billed {printRecurring(selectedPkg?.recurring)} automatically from your connected payment card.
              </h3>
              <p>You can cancel your subscription at any time.</p>
            </div>
          </div>
          {Array.isArray(cards) && cards.length > 0 ? (
            <div className="p-5 border-violet-200 rounded bg-green-50 text-green-800"> Great! You have {cards?.length} saved payment Cards.</div>
          ) : (
            <div className="p-5 border-violet-200 rounded bg-red-50 text-red-600">
              Sorry! You have no saved payment Cards.&nbsp; &nbsp; <Button url="/dashboard/subscription/card">Add or Manage Cards</Button>
            </div>
          )}

          {isDefaultCard ? (
            <div className="p-5 border-violet-200 rounded bg-green-50 text-green-800">
              Great! You have default payment Card. The payment will be process from your{" "}
              <b>
                {defaultCardDetails?.card_brand} (XXXX XXXX {defaultCardDetails?.card_number})
              </b>
              &nbsp; Card.
            </div>
          ) : (
            <div className="p-5 border-violet-200 rounded bg-red-50 text-red-600">
              Sorry! You have no default payment Cards.&nbsp; &nbsp; <Button url="/dashboard/subscription/card">Make Default Card</Button>
            </div>
          )}
          <div className="flex justify-center gap-6">
            <Button onClick={() => setSteps(1)} border="rounded-full" showIcon iconName="keyboard_arrow_down" iconClass="size-5 rotate-90" iconPosition="before">
              Back
            </Button>
            {Array.isArray(cards) && cards.length > 0 && isDefaultCard ? (
              <Button onClick={() => handleSteps(3)} border="rounded-full" showIcon>
                Add Subscription Now
              </Button>
            ) : (
              ""
            )}
          </div>
        </div>
      )}

      {steps == 3 && (
        <div className="p-10">
          <div className="border border-violet-200 rounded p-10 space-y-5">
            <div className="flex justify-center">
              <SvgIcon name="check" className="size-20 text-green-700 p-2 bg-green-100 rounded-full" />
            </div>
            <div className="text-center text-4xl font-semibold text-green-700">Congratulations!</div>
            <div className="text-center text-gray-500">You have successfully subscribed to {selectedPkg?.name} plan.</div>
            <div className="flex justify-center">
              <Button url="/dashboard/tool/access" border="rounded-full" showIcon>
                Access Your Tools Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}

export default SubscriptionAddPage;
