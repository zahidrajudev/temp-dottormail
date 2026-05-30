import MainLayout from "@/layouts/MainLayout";
import SvgIcon from "@/modules/global/icons/svg_icons";
import Section from "@/modules/global/elements/section";
import AnimationDiv from "@/modules/global/animations/animate_div";
import RouterLink from "@/modules/global/elements/router_link";
import { Accordion, AccordionItem } from "@/modules/global/elements/accordion";
import { ReactElement, useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import api from "@/lib/api";
import { useCurrencyStore } from "@/modules/currency/store/useCurrencyStore";
import { getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/router";

// ──────────────────────────────────────────────
// Counter Hook
// ──────────────────────────────────────────────

function useCountUp(target: number, duration: number = 2000, start: boolean = true) {
  const [count, setCount] = useState(0);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) ref.current = requestAnimationFrame(step);
    };
    ref.current = requestAnimationFrame(step);
    return () => {
      if (ref.current) cancelAnimationFrame(ref.current);
    };
  }, [target, duration, start]);

  return count.toLocaleString();
}

// ──────────────────────────────────────────────
// Data
// ──────────────────────────────────────────────

const plans = [
  {
    name: "Starter",
    monthlyPrice: 29,
    annualPrice: 290,
    description: "For individuals and small teams getting started with email verification.",
    credits: "10,000",
    features: ["10,000 verified emails/mo", "Real-time API access", "CSV & TXT uploads", "Basic analytics dashboard", "Email support", "Standard processing queue"],
    cta: "Start Free Trial",
    popular: false,
    icon: "rocket_launch",
  },
  {
    name: "Professional",
    monthlyPrice: 79,
    annualPrice: 790,
    description: "For growing teams that need reliable verification at scale.",
    credits: "100,000",
    features: [
      "100,000 verified emails/mo",
      "Priority API processing",
      "Bulk list management",
      "Advanced analytics & reports",
      "Spam trap detection",
      "Role-based email filtering",
      "Slack & email support",
      "Dedicated processing queue",
    ],
    cta: "Start Free Trial",
    popular: true,
    icon: "bolt",
  },
  {
    name: "Enterprise",
    monthlyPrice: 249,
    annualPrice: 2490,
    description: "For organizations with high-volume verification needs.",
    credits: "1,000,000",
    features: [
      "1,000,000 verified emails/mo",
      "Dedicated processing queue",
      "Custom API integrations",
      "Real-time webhook alerts",
      "Full spam trap suite",
      "Role & syntax filtering",
      "SSO & team management",
      "Priority phone & chat support",
      "Custom SLA guarantees",
      "Dedicated solutions engineer",
    ],
    cta: "Contact Sales",
    popular: false,
    icon: "crown",
  },
];

const allFeatures = [
  { name: "Verified emails per month", starter: "10,000", professional: "100,000", enterprise: "1,000,000+" },
  { name: "API access", starter: true, professional: true, enterprise: true },
  { name: "CSV & TXT uploads", starter: true, professional: true, enterprise: true },
  { name: "Bulk list management", starter: false, professional: true, enterprise: true },
  { name: "Priority processing queue", starter: false, professional: true, enterprise: true },
  { name: "Spam trap detection", starter: false, professional: true, enterprise: true },
  { name: "Role-based email filtering", starter: false, professional: true, enterprise: true },
  { name: "Advanced analytics & reports", starter: false, professional: true, enterprise: true },
  { name: "Real-time webhook alerts", starter: false, professional: false, enterprise: true },
  { name: "SSO & team management", starter: false, professional: false, enterprise: true },
  { name: "Dedicated solutions engineer", starter: false, professional: false, enterprise: true },
  { name: "Custom SLA guarantees", starter: false, professional: false, enterprise: true },
];

const faqs = [
  {
    id: "faq-1",
    question: "How does the free trial work?",
    answer:
      "Every plan comes with a 14-day free trial — no credit card required. You get full access to all features in your chosen plan, including API access and bulk uploads. Cancel anytime with one click.",
  },
  {
    id: "faq-2",
    question: "What counts as a verified email?",
    answer:
      "A verified email is one that passes our complete validation pipeline: syntax check, domain validation, MX record verification, SMTP handshake, role-based detection, and spam trap analysis. Each email is counted only once per verification.",
  },
  {
    id: "faq-3",
    question: "Can I upgrade or downgrade my plan?",
    answer:
      "Yes, you can change your plan at any time. Upgrades take effect immediately, and you'll be prorated for the remainder of your billing cycle. Downgrades apply at the start of your next billing period.",
  },
  {
    id: "faq-4",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual Enterprise plans. All payments are processed securely through Stripe.",
  },
  {
    id: "faq-5",
    question: "Is there a discount for annual billing?",
    answer:
      "Yes! Annual plans save you approximately 20% compared to monthly billing. We also offer custom pricing for high-volume Enterprise customers — contact our sales team for details.",
  },
  {
    id: "faq-6",
    question: "How is my data protected?",
    answer:
      "All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We are GDPR-compliant, SOC 2 Type II certified, and maintain zero data retention — your email lists are automatically deleted after verification.",
  },
];

const stats = [
  { value: "50M+", label: "Emails Verified" },
  { value: "10K+", label: "Active Customers" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "200+", label: "Countries Served" },
];

// ──────────────────────────────────────────────
// Pricing Page Component
// ──────────────────────────────────────────────

function DottormailPricingV2() {
  const router = useRouter();
  const [annual, setAnnual] = useState(false);
  const [heroCounted, setHeroCounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeroCounted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(heroRef.current);
    return () => obs.disconnect();
  }, []);

  const verifiedCount = useCountUp(50100000, 3000, heroCounted);
  const customersCount = useCountUp(10000, 2500, heroCounted);

  const { formatPrice } = useCurrencyStore();
  const [mainData, setMainData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const getInitialData = async () => {
    setLoading(true);
    let url = "v1/packages";
    await api
      .get(url)
      .then((res) => {
        setLoading(false);
        setMainData(res.data.data);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getInitialData();
  }, []);

  const handleCheckout = (id: any) => {
    if (!id) return;

    const cookieValue: any = getCookie("cart");
    let itemsToArray: any[] = [];

    // if (cookieValue) {
    //   try {
    //     const parsed = JSON.parse(cookieValue);
    //     if (Array.isArray(parsed)) {
    //       itemsToArray = parsed;
    //     } else {
    //       itemsToArray = [];
    //     }
    //   } catch (error) {
    //     // Invalid JSON – start with fresh array
    //     itemsToArray = [];
    //   }
    // }

    itemsToArray.push(id);
    setCookie("cart", JSON.stringify(itemsToArray));
    router.push("/checkout");
  };

  return (
    <>
      <Head>
        <title>Pricing — Dottor Mail | Simple, Transparent Email Verification</title>
        <meta
          name="description"
          content="Start free and scale as you grow. Transparent pricing for email verification — no hidden fees, no surprises. All plans include our core verification engine."
        />
      </Head>

      {/* ════════════════════════════════════════ */}
      {/* HERO                                       */}
      {/* ════════════════════════════════════════ */}
      <Section fullWidth className="relative min-h-[85vh] overflow-hidden bg-[#fafafa]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-15%] left-[-5%] w-[50%] h-[50%] bg-emerald-400/[0.03] rounded-full blur-[120px]" />
          <div className="absolute bottom-[-15%] right-[-5%] w-[50%] h-[50%] bg-amber-400/[0.02] rounded-full blur-[120px]" />
        </div>
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)", backgroundSize: "48px 48px" }}
        />
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 z-20" />

        <div
          ref={heroRef}
          className="relative z-10 container mx-auto px-5 sm:px-8 pt-32 sm:pt-40 pb-20 min-h-[85vh] flex flex-col items-center justify-center text-center"
        >
          <AnimationDiv initial="opacity-0 translate-y-5" visible="opacity-100 translate-y-0" duration="duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs sm:text-sm font-semibold tracking-wide mb-8 shadow-sm">
              <SvgIcon name="credit_card" className="size-4" />
              Simple, Transparent Pricing
            </div>
          </AnimationDiv>

          <AnimationDiv initial="opacity-0 translate-y-7" visible="opacity-100 translate-y-0" duration="duration-700" delay="delay-100">
            <h1 className="text-[clamp(2.5rem,6.5vw,4.5rem)] font-extrabold text-[#0b1120] leading-[1.05] tracking-[-0.03em] mb-6 max-w-4xl mx-auto">
              The right plan for every{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500">stage</span>
                <span className="absolute -bottom-1 left-0 right-0 h-3 bg-emerald-200/40 -rotate-1 rounded-full" />
              </span>{" "}
              of growth.
            </h1>
          </AnimationDiv>

          <AnimationDiv initial="opacity-0 translate-y-6" visible="opacity-100 translate-y-0" duration="duration-700" delay="delay-200">
            <p className="text-[#4b5563] text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
              Start free and scale as you grow. All plans include our core verification engine with no hidden fees, no long-term contracts, and a 14-day free trial.
            </p>
          </AnimationDiv>

          {/* Trusted stats */}
          <AnimationDiv initial="opacity-0" visible="opacity-100" duration="duration-1000" delay="delay-400">
            <div className="flex items-center justify-center gap-8 sm:gap-12">
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-[#0b1120] tabular-nums">{verifiedCount}+</div>
                <div className="text-xs text-[#6b7280] font-medium mt-0.5">Emails Verified</div>
              </div>
              <div className="w-px h-8 bg-[#e5e7eb]" />
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-[#0b1120] tabular-nums">{customersCount}+</div>
                <div className="text-xs text-[#6b7280] font-medium mt-0.5">Trusted Businesses</div>
              </div>
              <div className="w-px h-8 bg-[#e5e7eb]" />
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-[#0b1120]">14-Day</div>
                <div className="text-xs text-[#6b7280] font-medium mt-0.5">Free Trial</div>
              </div>
            </div>
          </AnimationDiv>
        </div>
      </Section>

      {/* ════════════════════════════════════════ */}
      {/* PRICING CARDS                              */}
      {/* ════════════════════════════════════════ */}
      <Section fullWidth className="relative -mt-24 sm:-mt-32 pb-20 sm:pb-28 overflow-hidden">
        <div className="container mx-auto px-5 sm:px-8">
          <br />
          <br />
          <br />
          {/* Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {Array.isArray(mainData) &&
              mainData.map((plan, idx) => (
                <AnimationDiv
                  key={idx}
                  initial="opacity-0 translate-y-8"
                  visible="opacity-100 translate-y-0"
                  duration="duration-700"
                  delay={`delay-${idx * 150}`}
                  className="relative"
                >
                  <div
                    className={`h-full p-8 sm:p-9 rounded-3xl border-2 transition-all duration-500 flex flex-col ${
                      plan.popular
                        ? "bg-[#0b1120] border-emerald-400/30 shadow-2xl shadow-emerald-500/10 scale-100 lg:scale-105"
                        : "bg-white border-[#e5e7eb] hover:border-emerald-200/50 hover:shadow-xl hover:shadow-emerald-200/10"
                    }`}
                  >
                    {/* Popular badge */}
                    {plan.popular == 1 && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[11px] font-bold tracking-wide shadow-lg shadow-emerald-500/30 whitespace-nowrap">
                        Most Popular
                      </div>
                    )}

                    {/* Plan header */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className={`size-10 rounded-xl flex items-center justify-center ${plan.popular ? "bg-emerald-500/15" : "bg-emerald-50"}`}>
                        <SvgIcon name={plan.icon} className={`size-5 ${plan.popular ? "text-emerald-400" : "text-emerald-600"}`} />
                      </div>
                      <div>
                        <h3 className={`text-lg font-bold ${plan.popular ? "text-white" : "text-[#111827]"}`}>{plan.name}</h3>
                        <p className={`text-[11px] font-medium ${plan.popular ? "text-[#94a3b8]" : "text-[#6b7280]"}`}>{plan.credit} emails/mo</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className={`text-sm mb-6 ${plan.popular ? "text-[#94a3b8]" : "text-[#6b7280]"}`}>{plan.des}</p>

                    {/* Price */}
                    <div className={`mb-6 ${plan.popular ? "text-white" : "text-[#0b1120]"}`}>
                      <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">{formatPrice(plan?.price)}</span>
                      <span className={`text-sm font-medium ${plan.popular ? "text-[#94a3b8]" : "text-[#6b7280]"}`}>/mo</span>
                      {annual && (
                        <div className={`text-xs font-medium mt-1 ${plan.popular ? "text-emerald-400" : "text-emerald-600"}`}>${plan.annualPrice} billed annually</div>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((feat: any, fi: any) => (
                        <li key={fi} className={`flex items-start gap-3 text-sm ${plan.popular ? "text-[#cbd5e1]" : "text-[#4b5563]"}`}>
                          <SvgIcon name="check_circle" className={`size-4 shrink-0 mt-0.5 ${plan.popular ? "text-emerald-400" : "text-emerald-500"}`} filled />
                          {feat?.name}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    {plan.popular ? (
                      <button onClick={() => handleCheckout(plan?.id)}>
                        <div className="w-full py-3.5 rounded-2xl font-bold text-sm text-center bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/25 transition-all duration-300 active:scale-[0.98] cursor-pointer">
                          Start Now
                        </div>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleCheckout(plan?.id)}
                        className="w-full py-3.5 rounded-2xl font-bold text-sm text-center bg-[#f1f5f9] text-[#111827] hover:bg-[#e2e8f0] transition-all duration-300 active:scale-[0.98] block cursor-pointer"
                      >
                        Start Now
                      </button>
                    )}
                  </div>
                </AnimationDiv>
              ))}
          </div>

          {/* Trust line */}
          <AnimationDiv initial="opacity-0" visible="opacity-100" duration="duration-700" delay="delay-600">
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-xs text-[#9ca3af]">
              <div className="flex items-center gap-1.5">
                <SvgIcon name="check_circle" className="size-4 text-emerald-500" filled />
                No credit card required
              </div>
              <div className="flex items-center gap-1.5">
                <SvgIcon name="check_circle" className="size-4 text-emerald-500" filled />
                Free credits
              </div>
              <div className="flex items-center gap-1.5">
                <SvgIcon name="check_circle" className="size-4 text-emerald-500" filled />
                Cancel anytime
              </div>
              <div className="flex items-center gap-1.5">
                <SvgIcon name="check_circle" className="size-4 text-emerald-500" filled />
                No hidden fees
              </div>
            </div>
          </AnimationDiv>
        </div>
      </Section>

      {/* ════════════════════════════════════════ */}
      {/* FEATURE COMPARISON TABLE                   */}
      {/* ════════════════════════════════════════ */}
      <Section fullWidth className="relative py-28 sm:py-36 bg-[#f8fafc] overflow-hidden">
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-emerald-400/[0.02] rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-5 sm:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <AnimationDiv initial="opacity-0 translate-y-6" visible="opacity-100 translate-y-0">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 text-[11px] sm:text-xs font-bold mb-5 tracking-widest uppercase">
                <SvgIcon name="checklist" className="size-3.5" />
                Compare Plans
              </div>
              <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold text-[#0b1120] leading-[1.1] tracking-[-0.02em]">
                Every feature. <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">Side by side.</span>
              </h2>
              <p className="text-[#6b7280] text-base sm:text-lg mt-5 max-w-lg mx-auto leading-relaxed">
                See exactly what you get with each plan. No surprises, no fine print.
              </p>
            </AnimationDiv>
          </div>

          {/* Table */}
          <div className="max-w-4xl mx-auto overflow-x-auto">
            <AnimationDiv initial="opacity-0 translate-y-6" visible="opacity-100 translate-y-0" duration="duration-700">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#e5e7eb]">
                    <th className="text-left py-4 pr-6 text-sm font-semibold text-[#6b7280]">Feature</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-[#6b7280]">Starter</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-emerald-600">Professional</th>
                    <th className="text-center py-4 pl-4 text-sm font-semibold text-[#6b7280]">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {allFeatures.map((feat, idx) => {
                    const renderCell = (val: any) => {
                      if (typeof val === "boolean") {
                        return val ? (
                          <SvgIcon name="done_all" className="size-5 text-emerald-500 mx-auto" filled />
                        ) : (
                          <SvgIcon name="close" className="size-5 text-[#d1d5db] mx-auto" />
                        );
                      }
                      return <span className="text-sm font-medium text-[#111827]">{val}</span>;
                    };

                    return (
                      <tr key={idx} className={`border-b border-[#f1f5f9] transition-colors hover:bg-white/50 ${idx % 2 === 0 ? "bg-white" : "bg-[#fafafa]"}`}>
                        <td className="py-4 pr-6 text-sm text-[#4b5563]">{feat.name}</td>
                        <td className="py-4 px-4 text-center">{renderCell(feat.starter)}</td>
                        <td className="py-4 px-4 text-center">{renderCell(feat.professional)}</td>
                        <td className="py-4 pl-4 text-center">{renderCell(feat.enterprise)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </AnimationDiv>
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════ */}
      {/* ROI STATS                                   */}
      {/* ════════════════════════════════════════ */}
      <Section fullWidth className="relative py-28 sm:py-36 bg-[#0b1120] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-emerald-500/[0.03] rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-teal-500/[0.02] rounded-full blur-[100px]" />
        </div>
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "48px 48px" }}
        />

        <div className="container mx-auto px-5 sm:px-8 relative z-10">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <AnimationDiv initial="opacity-0 translate-y-6" visible="opacity-100 translate-y-0">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] sm:text-xs font-bold mb-5 tracking-widest uppercase border border-emerald-500/10">
                <SvgIcon name="trending_up" className="size-3.5" />
                The ROI of Clean Data
              </div>
              <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold text-white leading-[1.1] tracking-[-0.02em]">
                Verification pays for itself <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">many times over</span>.
              </h2>
              <p className="text-[#94a3b8] text-base sm:text-lg mt-5 leading-relaxed max-w-xl mx-auto">
                Every dollar spent on email verification saves up to $10 in wasted campaign costs, lost customers, and damaged sender reputation.
              </p>
            </AnimationDiv>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {[
              { value: "10x", label: "Average ROI", sub: "Every $1 spent on verification saves $10 in wasted campaign costs." },
              { value: "42%", label: "Avg. Open Rate Lift", sub: "Clean lists see dramatically higher engagement across all metrics." },
              { value: "98%", label: "Bounce Reduction", sub: "Our customers see bounces drop from 3-5% to under 0.1% on average." },
              { value: "4.2x", label: "Better Deliverability", sub: "Verified senders consistently outperform unverified competitors." },
            ].map((stat, idx) => (
              <AnimationDiv key={idx} initial="opacity-0 translate-y-6" visible="opacity-100 translate-y-0" duration="duration-700" delay={`delay-${idx * 100}`}>
                <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-emerald-500/20 transition-all duration-500 h-full group cursor-default">
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mb-1.5 tabular-nums">{stat.value}</div>
                  <div className="text-sm font-semibold text-[#e2e8f0] mb-2">{stat.label}</div>
                  <p className="text-xs text-[#64748b] leading-relaxed">{stat.sub}</p>
                </div>
              </AnimationDiv>
            ))}
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════ */}
      {/* FAQ                                          */}
      {/* ════════════════════════════════════════ */}
      <Section fullWidth className="relative py-28 sm:py-36 bg-white overflow-hidden">
        <div className="absolute top-1/2 left-[-10%] w-[400px] h-[400px] bg-teal-400/[0.02] rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-5 sm:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <AnimationDiv initial="opacity-0 translate-y-6" visible="opacity-100 translate-y-0">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 text-[11px] sm:text-xs font-bold mb-5 tracking-widest uppercase">
                <SvgIcon name="chat_bubble" className="size-3.5" />
                FAQ
              </div>
              <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold text-[#0b1120] leading-[1.1] tracking-[-0.02em]">
                Questions? <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">Answered.</span>
              </h2>
              <p className="text-[#6b7280] text-base sm:text-lg mt-5 max-w-lg mx-auto leading-relaxed">
                Everything you need to know about our pricing, plans, and how email verification works.
              </p>
            </AnimationDiv>
          </div>

          {/* Accordion */}
          <AnimationDiv initial="opacity-0 translate-y-6" visible="opacity-100 translate-y-0" duration="duration-700" delay="delay-200">
            <div className="max-w-2xl mx-auto">
              <Accordion>
                {faqs.map((faq, idx) => (
                  <AccordionItem
                    key={faq.id}
                    id={faq.id}
                    title={{
                      icon: (
                        <div className={`size-8 rounded-lg flex items-center justify-center transition-colors ${idx % 2 === 0 ? "bg-emerald-50" : "bg-amber-50"}`}>
                          <SvgIcon name={idx % 2 === 0 ? "verified" : "star"} className={`size-4 ${idx % 2 === 0 ? "text-emerald-600" : "text-amber-600"}`} filled />
                        </div>
                      ),
                      label: faq.question,
                    }}
                  >
                    <p className="text-sm text-[#6b7280] leading-relaxed px-4 py-3">{faq.answer}</p>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </AnimationDiv>

          {/* Still have questions */}
          <AnimationDiv initial="opacity-0" visible="opacity-100" duration="duration-700" delay="delay-400">
            <div className="text-center mt-12">
              <p className="text-sm text-[#6b7280]">
                Still have questions?{" "}
                <Link href="/contact" className="text-emerald-600 font-semibold hover:text-emerald-700 underline underline-offset-2">
                  Contact our support team
                </Link>
              </p>
            </div>
          </AnimationDiv>
        </div>
      </Section>

      {/* ════════════════════════════════════════ */}
      {/* FINAL CTA                                  */}
      {/* ════════════════════════════════════════ */}
      <Section fullWidth className="relative py-28 sm:py-36 bg-[#f8fafc] overflow-hidden">
        <div className="container mx-auto px-5 sm:px-8">
          <AnimationDiv initial="opacity-0 translate-y-8" visible="opacity-100 translate-y-0" duration="duration-700">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b1120] via-[#111d33] to-[#0b1120] p-10 sm:p-16 lg:p-20 text-center shadow-2xl shadow-[#0b1120]/30">
              <div className="absolute top-[-30%] left-[-15%] w-[400px] h-[400px] bg-emerald-500/[0.04] rounded-full blur-[120px] pointer-events-none" />
              <div className="absolute bottom-[-30%] right-[-15%] w-[400px] h-[400px] bg-teal-500/[0.04] rounded-full blur-[120px] pointer-events-none" />
              <div
                className="absolute inset-0 opacity-[0.015] pointer-events-none"
                style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "32px 32px" }}
              />

              <div className="relative z-10 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] sm:text-xs font-bold mb-6 tracking-widest uppercase border border-emerald-500/10">
                  <SvgIcon name="rocket_launch" className="size-3.5" />
                  Start Free Today
                </div>
                <h2 className="text-[clamp(1.8rem,4.5vw,3.2rem)] font-extrabold text-white leading-[1.1] tracking-[-0.02em] mb-5">
                  Start verifying your emails in minutes.
                </h2>
                <p className="text-[#94a3b8] text-base sm:text-lg mb-10 max-w-md mx-auto leading-relaxed">
                  Join 10,000+ businesses that trust Dottor Mail. No credit card required. Cancel anytime.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <RouterLink href="/register">
                    <div className="group inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold rounded-2xl transition-all duration-300 shadow-xl shadow-emerald-500/25 active:scale-[0.97]">
                      <span className="text-sm sm:text-base">Get Started Free</span>
                      <SvgIcon name="arrow_right_alt" className="size-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </RouterLink>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-8 py-4 text-[#94a3b8] hover:text-white text-sm font-semibold rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    Talk to Sales
                    <SvgIcon name="arrow_right_alt" className="size-4" />
                  </Link>
                </div>
              </div>
            </div>
          </AnimationDiv>
        </div>
      </Section>
    </>
  );
}

// ──────────────────────────────────────────────
// Layout
// ──────────────────────────────────────────────

export default DottormailPricingV2;
