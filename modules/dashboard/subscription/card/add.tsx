import api from "@/lib/api";
import { checkErrors, convertToNumber } from "@/lib/helper";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import StripeAddCard from "@/modules/dashboard/gateway/stripe/add_card";
import Button from "@/modules/global/elements/button";
import MediaArea from "@/modules/global/elements/media_area";
import Modal from "@/modules/global/elements/modal";
import Section from "@/modules/global/elements/section";
import SvgIcon from "@/modules/global/icons/svg_icons";
import Input from "@/modules/global/input/input";
import Select from "@/modules/global/input/select";
import LanguageSelectForInputFields from "@/modules/language/components/LanguageSelectForInputFields";
import { useLanguageStore } from "@/modules/language/store/useLanguageStore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function CardAddPage() {
  const router = useRouter();
  const { hasPermission, appUser, refreshAuthUser, isRefreshAuthUser } = useAuthStore();
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

  const [isFoundStripeCustomer, setIsFoundStripeCustomer] = useState(true);
  const [customerCreateTryCount, setCustomerCreateTryCount] = useState(0);

  // Handle Create a record
  const syncCards = async () => {
    try {
      let url = "v1/dashboard/payment-card/sync-cards";
      setLoading(true);
      await api
        .post(url)
        .then((res) => {
          toast.success("Successfully saved");
          router.push("/dashboard/subscription/card");
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message);
          setLoading(false);
        });
    } catch (error) {}
  };

  const handleCreateCustomer = () => {
    let url = "v1/dashboard/subscription/create-customer";
    setIsFoundStripeCustomer(false);
    api
      .post(url)
      .then((res) => {
        setCustomerCreateTryCount((prev) => prev + 1);
        setTimeout(() => {
          refreshAuthUser();
        }, 2000);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err?.response?.data?.message);
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
    if (appUser && appUser?.stripe_customer_id) {
      setIsFoundStripeCustomer(true);
      //getInitialData();
    } else {
      if (customerCreateTryCount < 3) {
        handleCreateCustomer();
      } else {
        toast.error("Failed to prepare your profile for subscription. Please try again later.");
        router.push("/dashboard/subscription/card");
      }
    }
  }, [refresh, isRefreshAuthUser]);

  return (
    <Section permission={hasPermission("card.create")} loading={loading} className="bg-white p-8 border border-gray-200 rounded-lg space-y-10">
      <div className="grid grid-cols-2 gap-6">
        <div className="p-6 rounded bg-fuchsia-50 space-y-6">
          <div className="flex gap-4 items-center">
            <SvgIcon name="add_card" className="size-20 text-fuchsia-400" filled />
            <h1 className="text-3xl font-semibold">Add Your Payment Card</h1>
          </div>
          <StripeAddCard onSuccess={syncCards} />
        </div>
        <div className="p-6 rounded bg-fuchsia-50 space-y-6">
          <div className="p-5 bg-white border border-gray-200 rounded space-y-2">
            <h1 className="text-lg font-semibold">Securely Add Your Card</h1>
            <p className="opacity-80">
              To activate your subscription and ensure uninterrupted service, please add a valid payment card. Your card will be securely stored and used for automatic
              subscription billing according to your selected plan.
            </p>
          </div>
          <div className="p-5 bg-white border border-gray-200 rounded space-y-2">
            <h1 className="text-lg font-semibold">Your Payment Is Secure</h1>
            <ul className="list-decimal list-inside space-y-2 opacity-80">
              <li>We use industry-standard encryption</li>
              <li>Your card details are never stored on our servers</li>
              <li>Payments are processed through a secure payment gateway</li>
              <li>PCI-DSS compliant infrastructure</li>
            </ul>
          </div>
          <div className="p-5 bg-white border border-gray-200 rounded space-y-2">
            <h1 className="text-lg font-semibold">How Billing Works</h1>
            <ul className="list-decimal list-inside space-y-2 opacity-80">
              <li>Your subscription will automatically renew at the end of each billing cycle.</li>
              <li>The amount will be charged to your saved card.</li>
              <li>You can update or remove your payment method anytime.</li>
              <li>Failed payments may temporarily suspend your subscription.</li>
            </ul>
          </div>
        </div>
      </div>

      <Modal maxWidth="w-full max-w-3xl" loading={true} show={!isFoundStripeCustomer} setShow={() => ""}>
        <div className="px-10 py-20">
          <h1 className="text-2xl font-semibold text-center">We are preparing your profile</h1>
        </div>
      </Modal>
    </Section>
  );
}

export default CardAddPage;
