"use client";

import { useEffect, useState } from "react";
import { AppLink } from "@/lib/AppLink";
import Button from "@/modules/global/elements/button";
import Section from "@/modules/global/elements/section";
import SvgIcon from "@/modules/global/icons/svg_icons";
import { deleteCookie } from "cookies-next";
import api from "@/lib/api";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { useCurrencyStore } from "@/modules/currency/store/useCurrencyStore";
import { formatNumber } from "@/lib/helper";

interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
}

const mockCartItems: CartItem[] = [
  {
    id: 1,
    name: "XToolVIP Pro Plan",
    description: "Full access to 40+ premium tools",
    price: 29.99,
    quantity: 1,
    image: "/images/img6.svg",
  },
  {
    id: 2,
    name: "Marketing Toolkit Addon",
    description: "Advanced SEO & ad spy tools",
    price: 14.99,
    quantity: 1,
    image: "/images/img6.svg",
  },
];

const DottormailCheckoutStatusPage = () => {
  const router = useRouter();
  const { appAuth, appUser, appUserLoading } = useAuthStore();
  const { formatPrice, appSelectedCurrency } = useCurrencyStore();
  const [activeTab, setActiveTab] = useState<"summary" | "billing" | "payment">("summary");
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "stripe">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [reload, setReload] = useState(0);

  const subtotal = mockCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const discount = appliedPromo ? subtotal * 0.15 : 0;
  const total = subtotal + tax - discount;

  const refreshPage = () => {
    setReload((prev) => prev + 1);
  };

  const [itemIds, setItemIds] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [mainData, setMainData] = useState<any>("");
  const [itemID, setItemID] = useState<any>();
  const [gateways, setGateways] = useState("");
  const [gtys, setGtys] = useState<any>();

  const [invoice, setInvoice] = useState("");

  const getInitialData = async (id: any) => {
    if (!appAuth) {
      toast.info("Login required");
      router.push("/login");
      return;
    }
    setLoading(true);
    let data = { invoice: id };
    let url = "v1/checkout/status";
    await api
      .post(url, data)
      .then((res) => {
        setLoading(false);
        setMainData(res.data.data);
        deleteCookie("cart");
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!appUserLoading) {
      if (appAuth) {
        const urlParams = new URLSearchParams(window.location.search);
        const invoiceID: any = urlParams.get("invoice");
        setInvoice(invoiceID);
        if (invoiceID) {
          router.replace(`/checkout/status?invoice=${invoiceID}`);
          getInitialData(invoiceID);
        } else {
          toast.error("Something went wrong");
          //Router.push("/");
        }
      }
    }
  }, [reload]);

  const printStatus = (_status: number) => {
    if (_status == 0) {
      return (
        <>
          <div onClick={refreshPage} className="mx-auto w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6 border-2 border-yellow-500/30">
            <SvgIcon name="info" filled className="w-14 h-14 text-yellow-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-yellow-500 mb-4">Order Pending!</h1>
          <p className="text-emerald-300 text-lg mb-8">Thank you for your patient.</p>
        </>
      );
    }
    if (_status == 1) {
      return (
        <>
          <div onClick={refreshPage} className="mx-auto w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border-2 border-green-500/30">
            <SvgIcon name="check_circle" filled className="w-14 h-14 text-green-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">Order Confirmed!</h1>
          <p className="text-emerald-300 text-lg mb-8">Thank you for your purchase.</p>
        </>
      );
    }
    if (_status == 2) {
      return (
        <>
          <div onClick={refreshPage} className="mx-auto w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border-2 border-red-500/30">
            <SvgIcon name="close" filled className="w-14 h-14 text-red-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-red-500 mb-4">Payment Failed!</h1>
          <p className="text-emerald-300 text-lg mb-8">Thank you for your patient.</p>
        </>
      );
    }
    if (_status == 3) {
      return (
        <>
          <div onClick={refreshPage} className="mx-auto w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 border-2 border-blue-500/30">
            <SvgIcon name="check" filled className="w-14 h-14 text-blue-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-blue-500 mb-4">Payment Refunded!</h1>
          <p className="text-emerald-300 text-lg mb-8">Thank you for your patient.</p>
        </>
      );
    }
    if (_status == 4) {
      return (
        <>
          <div onClick={refreshPage} className="mx-auto w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6 border-2 border-yellow-500/30">
            <SvgIcon name="info" filled className="w-14 h-14 text-yellow-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-yellow-500 mb-4">Payment Processing!</h1>
          <p className="text-emerald-300 text-lg mb-8">Thank you for your patient.</p>
        </>
      );
    }
  };

  return (
    <Section loading={appUserLoading} fullWidth className="relative min-h-screen overflow-hidden bg-[#0b1120] py-30">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[55%] h-[55%] bg-emerald-500/[0.03] rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] bg-cyan-500/[0.03] rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-teal-500/[0.015] rounded-full blur-[180px]" />
      </div>
      <div className="max-w-lg mx-auto text-center mt-20">
        {printStatus(mainData?.status)}

        {/* Order Details Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 text-left space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-cyan-300">Invoice</span>
            <span className="text-white font-semibold">{mainData?.invoice}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-cyan-300">Amount Paid</span>
            <span className="text-white font-bold text-lg">
              {formatNumber(mainData?.amount)} {mainData?.currency}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-cyan-300">Payment Method</span>
            <span className="text-teal-300 capitalize font-medium">{mainData?.gateway?.name}</span>
          </div>
        </div>

        <AppLink href="/dashboard/transaction">
          <Button className="mt-8 bg-linear-to-r from-teal-600 to-cyan-600 text-white shadow-xl shadow-emerald-500/30" border="rounded-full" px="px-10" py="py-4">
            Back to Dashboard
          </Button>
        </AppLink>
      </div>
    </Section>
  );
};

export default DottormailCheckoutStatusPage;
