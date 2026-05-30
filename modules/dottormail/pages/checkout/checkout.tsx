"use client";

import React, { useEffect, useState } from "react";
import { AppLink } from "@/lib/AppLink";
import Button from "@/modules/global/elements/button";
import Section from "@/modules/global/elements/section";
import SvgIcon from "@/modules/global/icons/svg_icons";
import ImageBox from "@/modules/global/elements/image_box";
import { deleteCookie, getCookie } from "cookies-next";
import api from "@/lib/api";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { useCurrencyStore } from "@/modules/currency/store/useCurrencyStore";
import StripePaymentForm from "./stripe/payment-form";
import DottormailStripePaymentForm from "./stripe/payment-form";

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

const DottormailCheckoutPage = () => {
  const router = useRouter();
  const { appAuth, appUser } = useAuthStore();
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
  const [gtys, setGtys] = useState("");

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
        // deleteCookie("cart");
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let cartItems: any[] = [];
    let cookieValue: any = getCookie("cart");
    if (cookieValue) {
      try {
        const parsed = JSON.parse(cookieValue);
        if (Array.isArray(parsed)) {
          cartItems = parsed;
        } else {
          cartItems = [];
        }
      } catch (error) {
        // Invalid JSON – start with fresh array
        cartItems = [];
      }
    }
    if (Array.isArray(cartItems) && cartItems.length) {
      setItemIds(cartItems);
      getInitialData(cartItems);
      getPaymentGetways();
    }
  }, []);

  const steps = [
    { key: "summary", label: "Order Summary", icon: "shopping_cart" },
    { key: "billing", label: "Billing Details", icon: "person" },
    { key: "payment", label: "Payment", icon: "credit_card" },
  ];

  if (orderComplete) {
    return (
      <Section fullWidth className="min-h-[100vh] bg-linear-to-b from-slate-950 via-violet-950 to-fuchsia-950 relative overflow-hidden py-45 -mt-20">
        <div className="max-w-lg mx-auto text-center">
          {/* Success Icon */}
          <div className="mx-auto w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border-2 border-green-500/30">
            <SvgIcon name="check_circle" filled className="w-14 h-14 text-green-500" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">Order Confirmed!</h1>
          <p className="text-violet-300 text-lg mb-8">
            Thank you for your purchase. A confirmation email has been sent to <span className="text-fuchsia-400">{email || "your email"}</span>.
          </p>

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
  }

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

  useEffect(() => {
    if (appSelectedCurrency) {
      // console.log({ appSelectedCurrency, gateways });
      if (Array.isArray(gateways)) {
        let final: any = [];
        gateways.map((itm) => {
          const currentCode = appSelectedCurrency?.code?.toLowerCase();
          const supportedCodes = Array.isArray(itm?.currency) ? itm?.currency : [];
          console.log({ currentCode, supportedCodes });
          if (supportedCodes.includes(currentCode) || supportedCodes.includes(appSelectedCurrency?.code)) {
            final.push(itm);
          }
        });
        setGtys(final);
      }
    }
  }, [appSelectedCurrency, gateways]);

  return (
    <Section permission={appAuth} fullWidth className="relative min-h-screen overflow-hidden bg-[#0b1120] py-25">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[55%] h-[55%] bg-emerald-500/[0.03] rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] bg-cyan-500/[0.03] rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-teal-500/[0.015] rounded-full blur-[180px]" />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Complete Your <span className="bg-linear-to-r from-teal-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">Purchase</span>
          </h1>
          <p className="text-violet-300/80 mt-3 max-w-xl mx-auto">Review your order, enter your details, and confirm payment to get instant access.</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-0 sm:gap-4 mb-10">
          {steps.map((step, index) => (
            <React.Fragment key={step.key}>
              {/* Step Button */}
              <button className={`group relative flex flex-col items-center gap-2 focus:outline-none ${index < steps.length - 1 ? "sm:flex-row sm:gap-3" : ""}`}>
                <div
                  className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    activeTab === step.key
                      ? "border-teal-400 bg-emerald-500/20 text-cyan-400 shadow-lg shadow-fuchsia-500/30"
                      : activeTab === "billing" && step.key === "billing"
                        ? "border-teal-400 bg-cyan-500/20 text-emerald-400 shadow-lg shadow-violet-500/30"
                        : "border-white/20 text-white/40"
                  }`}
                >
                  <SvgIcon
                    name={step.icon}
                    filled
                    className={`w-5 h-5 ${activeTab === step.key ? "" : activeTab === "billing" && step.key === "billing" ? "" : "opacity-50"}`}
                  />
                </div>
                <span
                  className={`text-xs font-medium mt-2 transition-colors ${
                    activeTab === step.key ? "text-teal-400" : activeTab === "billing" && step.key === "billing" ? "text-cyan-400" : "text-white/40"
                  }`}
                >
                  {step.label}
                </span>
              </button>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden sm:block w-8 sm:w-16 h-0.5 bg-white/10 mx-2 rounded-full">
                  <div
                    className={`h-full bg-linear-to-r rounded-full transition-all duration-500 ${
                      index === 0 && activeTab !== "summary"
                        ? "bg-linear-to-r from-teal-400 to-cyan-400 w-full"
                        : index === 1 && activeTab === "payment"
                          ? "bg-linear-to-r from-cyan-400 to-teal-400 w-full"
                          : "bg-white/10 w-1/3"
                    }`}
                  ></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ============ STEP 1: ORDER SUMMARY ============ */}
        {activeTab === "summary" && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <SvgIcon name="receipt_long" className="w-6 h-6 text-teal-400" />
                  Order Items
                </h2>

                {Array.isArray(mainData) &&
                  mainData.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 flex gap-5 items-center hover:border-white/40 transition-all duration-300"
                    >
                      <div className="w-20 h-20 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
                        <ImageBox src={item?.media?.path} alt={item?.name} className="w-14 h-14" image_className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-bold text-lg truncate">{item?.name}</h3>
                        <p className="text-violet-300/70 text-sm mt-1">{item?.des}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold text-lg">{formatPrice(item?.price)}</p>
                        <p className="text-violet-300/50 text-xs">Qty: 1</p>
                      </div>
                    </div>
                  ))}

                {/* Promo Code */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/20">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter promo code"
                      className="flex-1 bg-white/10 border border-white/20 rounded-xl px-5 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 transition-all"
                    />
                    <button
                      onClick={handleApplyPromo}
                      disabled={appliedPromo}
                      className={`px-6 py-3.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
                        appliedPromo
                          ? "bg-green-500/20 text-green-400 border border-green-500/30 cursor-default"
                          : "bg-linear-to-r from-cyan-600 to-teal-600 text-white hover:from-emerald-500 hover:to-cyan-500 shadow-lg shadow-violet-500/20"
                      }`}
                    >
                      {appliedPromo ? "✓ Applied" : "Apply"}
                    </button>
                  </div>
                  {appliedPromo && (
                    <p className="text-green-400 text-sm mt-2 flex items-center gap-1">
                      <SvgIcon name="check_circle" filled className="w-4 h-4" />
                      15% discount applied!
                    </p>
                  )}
                </div>
              </div>

              {/* Order Totals */}
              <div className="space-y-4 flex flex-col">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <SvgIcon name="receipt" className="w-6 h-6 text-teal-400" />
                  Order Summary
                </h2>

                <div className="flex-1 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-violet-300/80">Subtotal</span>
                    <span className="text-white font-medium">{formatPrice(calculateSubtotal(mainData))}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-violet-300/80">Tax (0%)</span>
                    <span className="text-white font-medium">{formatPrice(0)}0</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between items-center">
                      <span className="text-green-400">Discount (15%)</span>
                      <span className="text-green-400 font-medium">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-white/10 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold text-lg">Total</span>
                      <span className="text-white font-bold text-lg bg-linear-to-r from-teal-400 to-violet-400 bg-clip-text">
                        {formatPrice(calculateSubtotal(mainData))}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleGotoBilling}
                  className="w-full bg-linear-to-r from-emerald-600 to-teal-600 text-white font-bold text-lg shadow-2xl shadow-teal-500/30 hover:shadow-teal-500/50 hover:scale-[1.02] transition-all duration-300"
                  border="rounded-full"
                  px="px-10"
                  py="py-3.5"
                  showIcon
                  iconName="arrow_right_alt"
                >
                  Continue to Billing
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ============ STEP 2: BILLING DETAILS ============ */}
        {activeTab === "billing" && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Billing Form */}
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <SvgIcon name="person" className="w-6 h-6 text-violet-400" />
                  Billing Information
                </h2>
                <p className="text-violet-300/60 text-sm mb-6">Enter your contact and shipping details below.</p>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 space-y-5">
                  {/* Name */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-violet-200/80 text-sm font-medium block">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John"
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/30 transition-all"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-violet-200/80 text-sm font-medium block">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/30 transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-violet-200/80 text-sm font-medium block">Phone Number</label>
                    <input
                      type="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 7643 3555 3222 222"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/30 transition-all"
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-1.5">
                    <label className="text-violet-200/80 text-sm font-medium block">Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 Main Street, Apt 4B"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/30 transition-all"
                    />
                  </div>

                  {/* City / Country / ZIP */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-violet-200/80 text-sm font-medium block">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="New York"
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/30 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-violet-200/80 text-sm font-medium block">Country</label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/30 transition-all appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-slate-900 text-white">
                          Select Country
                        </option>
                        <option value="US" className="bg-slate-900 text-white">
                          United States
                        </option>
                        <option value="UK" className="bg-slate-900 text-white">
                          United Kingdom
                        </option>
                        <option value="CA" className="bg-slate-900 text-white">
                          Canada
                        </option>
                        <option value="AU" className="bg-slate-900 text-white">
                          Australia
                        </option>
                        <option value="DE" className="bg-slate-900 text-white">
                          Germany
                        </option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-violet-200/80 text-sm font-medium block">ZIP Code</label>
                      <input
                        type="text"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        placeholder="10001"
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/30 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center pt-4">
                  <Button
                    onClick={() => setActiveTab("summary")}
                    className="bg-white/10 text-white hover:bg-white/20 border border-white/20"
                    border="rounded-full"
                    px="px-8"
                    py="py-3.5"
                    showIcon
                    iconName="arrow_left_alt"
                    iconPosition="before"
                  >
                    Back to Summary
                  </Button>
                  <Button
                    onClick={() => setActiveTab("payment")}
                    className="bg-linear-to-r from-teal-600 to-violet-600 text-white font-bold shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50"
                    border="rounded-full"
                    px="px-10"
                    py="py-3.5"
                    showIcon
                    iconName="arrow_right_alt"
                  >
                    Continue to Payment
                  </Button>
                </div>
              </div>

              {/* Order Recap */}
              <div className="space-y-4 flex flex-col">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <SvgIcon name="receipt" className="w-6 h-6 text-cyan-400" />
                  Order Recap
                </h2>
                <div className="flex-1 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 space-y-3">
                  {Array.isArray(mainData) &&
                    mainData.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-linear-to-br from-violet-500 to-cyan-500 shrink-0"></div>
                          <span className="text-violet-200 text-sm">{item?.name}</span>
                        </div>
                        <span className="text-white font-medium text-sm">{formatPrice(item?.price)} × 1</span>
                      </div>
                    ))}
                  <div className="border-t border-white/10 pt-3 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-violet-300/80 text-sm">Subtotal</span>
                      <span className="text-white font-medium">{formatPrice(calculateSubtotal(mainData))}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-violet-300/80 text-sm">Tax</span>
                      <span className="text-white font-medium">{formatPrice(0)}0</span>
                    </div>
                    {appliedPromo && (
                      <div className="flex justify-between items-center">
                        <span className="text-green-400 text-sm">Discount</span>
                        <span className="text-green-400 font-medium">-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t border-white/10 pt-3 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-bold">Total</span>
                        <span className="text-white font-bold bg-linear-to-r from-cyan-400 to-violet-400 bg-clip-text">{formatPrice(calculateSubtotal(mainData))}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============ STEP 3: PAYMENT ============ */}
        {activeTab === "payment" && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Payment Form */}
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <SvgIcon name="credit_card" className="w-6 h-6 text-cyan-400" />
                  Payment Method
                </h2>
                <p className="text-cyan-300/60 text-sm mb-6">Choose your preferred payment method and enter your details.</p>

                {/* Payment Method Cards */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {Array.isArray(gtys) &&
                    gtys.map((method) => (
                      <button
                        key={method.code}
                        type="button"
                        onClick={() => setPaymentMethod(method.code as typeof paymentMethod)}
                        aria-pressed={paymentMethod === method.code}
                        className={`relative p-5 rounded-2xl border-2 transition-all duration-300 text-center flex items-center gap-4 ${
                          paymentMethod === method.code
                            ? "border-fuchsia-400 bg-fuchsia-500/20 shadow-lg shadow-fuchsia-500/20 text-white"
                            : "border-white/20 text-white/60 hover:border-white/40 hover:bg-white/5"
                        }`}
                      >
                        <ImageBox src={method?.media?.path} className="h-12 flex items-center" />
                        <span className="text-sm font-medium">{method?.name}</span>
                      </button>
                    ))}
                </div>

                {/* Card Form */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 space-y-5">
                  {paymentMethod === "stripe" && <DottormailStripePaymentForm item_id={itemID} currency_code={appSelectedCurrency?.code ?? ""} />}
                  {paymentMethod === "paypal" && (
                    <div className="text-center py-10">
                      <SvgIcon name="paypal" className="w-16 h-16 mx-auto mb-4" filled />
                      <p className="text-cyan-300 text-sm">You will be redirected to PayPal to complete your payment.</p>
                    </div>
                  )}
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3">
                  <input type="checkbox" id="terms" className="mt-1 w-4 h-4 rounded border-white/20 text-fuchsia-500 focus:ring-fuchsia-400/30" />
                  <label htmlFor="terms" className="text-sm text-cyan-300/70">
                    I agree to the{" "}
                    <AppLink href="/terms" className="text-fuchsia-400 hover:underline">
                      Terms of Service
                    </AppLink>{" "}
                    and{" "}
                    <AppLink href="/privacy" className="text-fuchsia-400 hover:underline">
                      Privacy Policy
                    </AppLink>
                  </label>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center pt-6">
                  <Button
                    onClick={() => setActiveTab("billing")}
                    className="bg-white/10 text-white hover:bg-white/20 border border-white/20"
                    border="rounded-full"
                    px="px-8"
                    py="py-3.5"
                    showIcon
                    iconName="arrow_left_alt"
                    iconPosition="before"
                  >
                    Back to Billing
                  </Button>
                  {paymentMethod !== "stripe" && (
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="bg-linear-to-r from-emerald-600 to-cyan-600 text-white font-bold text-lg shadow-2xl shadow-fuchsia-500/40 hover:shadow-fuchsia-500/60 hover:scale-[1.02] transition-all duration-300 disabled:opacity-75"
                      border="rounded-full"
                      px="px-12"
                      py="py-3.5"
                      showIcon
                      iconName={isProcessing ? "loading" : "arrow_right_alt"}
                      iconPosition="after"
                    >
                      {isProcessing ? "Processing..." : "Place Order"}
                    </Button>
                  )}
                </div>
              </div>

              {/* Order Summary Sidebar */}
              <div className="space-y-4 flex flex-col">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <SvgIcon name="receipt" className="w-6 h-6 text-fuchsia-400" />
                  Order Summary
                </h2>
                <div className="flex-1 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 space-y-4">
                  {Array.isArray(mainData) &&
                    mainData.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
                          <ImageBox src={item.image} alt={item.name} className="w-8 h-8" image_className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-semibold truncate">{item.name}</p>
                          <p className="text-cyan-400 text-xs">Qty: 1</p>
                        </div>
                        <p className="text-white font-semibold text-sm">{formatPrice(calculateSubtotal(mainData))}</p>
                      </div>
                    ))}
                  <div className="border-t border-white/10 pt-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-cyan-300/80 text-sm">Subtotal</span>
                      <span className="text-white font-medium text-sm">{formatPrice(calculateSubtotal(mainData))}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-cyan-300/80 text-sm">Tax (0%)</span>
                      <span className="text-white font-medium text-sm">{formatPrice(0)}0</span>
                    </div>
                    {appliedPromo && (
                      <div className="flex justify-between items-center">
                        <span className="text-green-400 text-sm">Promo Code</span>
                        <span className="text-green-400 font-medium text-sm">-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t border-white/10 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-bold">Total</span>
                        <span className="text-white font-bold bg-linear-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-lg">
                          {formatPrice(calculateSubtotal(mainData))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center gap-3">
                    <SvgIcon name="security" filled className="w-6 h-6 text-green-400" />
                    <div>
                      <p className="text-white font-medium text-sm">Secure Checkout</p>
                      <p className="text-cyan-400 text-xs">256-bit SSL encryption</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
};

export default DottormailCheckoutPage;
