"use client";

import React, { useEffect, useState } from "react";
import { AppLink } from "@/lib/AppLink";
import Button from "@/modules/global/elements/button";
import Section from "@/modules/global/elements/section";
import SvgIcon from "@/modules/global/icons/svg_icons";
import AnimationDiv from "@/modules/global/animations/animate_div";
import ImageBox from "../global/elements/image_box";
import { deleteCookie, getCookie } from "cookies-next";
import api from "@/lib/api";
import { useAuthStore } from "../auth/store/useAuthStore";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { useCurrencyStore } from "../currency/store/useCurrencyStore";
import StripePaymentForm from "./stripe/payment-form";

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

const CheckoutStatusPage = () => {
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

  const subtotal = mockCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const discount = appliedPromo ? subtotal * 0.15 : 0;
  const total = subtotal + tax - discount;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "WELCOME15") {
      setAppliedPromo(true);
    }
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setOrderComplete(true);
    }, 2500);
  };

  const [itemIds, setItemIds] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [mainData, setMainData] = useState("");
  const [itemID, setItemID] = useState<any>();
  const [gateways, setGateways] = useState("");
  const [gtys, setGtys] = useState<any>();

  const [invoice, setInvoice] = useState("");

  const getPaymentGetways = async () => {
    if (!appAuth) {
      return;
    }
    let url = "v1/dashboard/gateway/list";
    await api
      .post(url)
      .then((res) => {
        setGateways(res.data.data);
        deleteCookie("cart");
      })
      .catch((err) => {});
  };

  const getInitialData = async (ids: any) => {
    if (!appAuth) {
      toast.info("Login required");
      router.push("/login");
      return;
    }
    setLoading(true);
    let data = { ids };
    let url = "v1/dashboard/package/by-id";
    await api
      .post(url, data)
      .then((res) => {
        setLoading(false);
        setMainData(res.data.data);
        if (Array.isArray(res.data.data)) {
          let item = res.data.data[0];
          setItemID(item?.id);
        }
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
  }, []);

  const handleGotoBilling = () => {
    if (appUser) {
      setName(appUser?.name);
      setEmail(appUser?.email);
      setPhone(appUser?.phone);
      setActiveTab("billing");
    }
  };

  const calculateSubtotal = (_items: any) => {
    if (Array.isArray(_items)) {
      let price = 0;
      _items.map((itm) => {
        let priceInt = Math.floor(itm?.price);
        price += priceInt;
      });
      return price;
    } else {
      return 0;
    }
  };

  return (
    <Section
      loading={appUserLoading}
      fullWidth
      className="min-h-screen bg-linear-to-b from-slate-950 via-violet-950 to-fuchsia-950 relative overflow-hidden py-45 -mt-20"
    >
      <div className="max-w-lg mx-auto text-center">
        {/* Success Icon */}
        <div className="mx-auto w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border-2 border-green-500/30">
          <SvgIcon name="check_circle" filled className="w-14 h-14 text-green-500" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">Order Confirmed!</h1>
        <p className="text-violet-300 text-lg mb-8">Thank you for your purchase.</p>

        {/* Order Details Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 text-left space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-violet-300">Order #</span>
            <span className="text-white font-semibold">{`XTV-${Date.now().toString().slice(-8)}`}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-violet-300">Amount Paid</span>
            <span className="text-white font-bold text-lg">${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-violet-300">Payment Method</span>
            <span className="text-fuchsia-300 capitalize font-medium">{paymentMethod}</span>
          </div>
        </div>

        <AppLink href="/dashboard">
          <Button className="mt-8 bg-linear-to-r from-violet-600 to-fuchsia-600 text-white shadow-xl shadow-violet-500/30" border="rounded-full" px="px-10" py="py-4">
            Back to Dashboard
          </Button>
        </AppLink>
      </div>
    </Section>
  );
};

export default CheckoutStatusPage;
