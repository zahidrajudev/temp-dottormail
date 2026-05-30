import Section from "@/modules/global/elements/section";
import MainLayout from "@/layouts/MainLayout";
import SvgIcon from "@/modules/global/icons/svg_icons";
import RouterLink from "@/modules/global/elements/router_link";
import AnimationDiv from "@/modules/global/animations/animate_div";
import { ReactElement, useState, useEffect, useRef } from "react";
import Link from "next/link";
import Head from "next/head";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";

// ──────────────────────────────────────────────
// Data
// ──────────────────────────────────────────────

const steps = [
  {
    number: "01",
    title: "Connect Your List",
    description: "Upload your email list or connect directly via API. We support CSV, TXT, and real-time API integration — no manual work required.",
    icon: "cloud_upload",
  },
  {
    number: "02",
    title: "AI-Powered Scanning",
    description: "Our engine runs 12+ validation checks — syntax, domain, MX records, mailbox status, role-based detection, and spam trap identification.",
    icon: "sensors",
  },
  {
    number: "03",
    title: "Review & Refine",
    description: "Get a color-coded breakdown of valid, invalid, risky, and unknown addresses. Drill into each result with full transparency.",
    icon: "visibility",
  },
  {
    number: "04",
    title: "Export & Send Confidently",
    description: "Download your clean, verified list or push it directly to your email service provider. Start campaigns knowing every address counts.",
    icon: "download",
  },
];

const features = [
  {
    title: "Real-Time Verification",
    description: "Validate emails instantly via our API or dashboard. Results return in milliseconds with detailed status codes for every address.",
    stat: "< 200ms",
    statLabel: "Avg. Response Time",
    icon: "speed",
  },
  {
    title: "Bulk Processing Engine",
    description: "Upload and verify millions of emails in a single batch. Our distributed architecture processes large lists without slowing down.",
    stat: "1M+",
    statLabel: "Emails per Hour",
    icon: "rocket_launch",
  },
  {
    title: "Spam Trap Detection",
    description: "Identify and remove spam traps, honeypots, and abuse addresses before they damage your sender reputation and deliverability.",
    stat: "99.97%",
    statLabel: "Trap Detection Rate",
    icon: "security",
  },
  {
    title: "Role-Based Email Filter",
    description: "Detect and filter role-based addresses (info@, sales@, support@) that typically have low engagement and high unsubscribe rates.",
    stat: "85%",
    statLabel: "Avg. Engagement Lift",
    icon: "group",
  },
  {
    title: "MX & SMTP Validation",
    description: "Deep-level mail server verification checks that the receiving server exists, accepts mail, and the specific mailbox is active.",
    stat: "99.9%",
    statLabel: "Accuracy Rate",
    icon: "verified",
  },
  {
    title: "Seamless Integrations",
    description: "Connect with Mailchimp, SendGrid, HubSpot, and 50+ platforms. Zapier support enables custom workflows without development effort.",
    stat: "50+",
    statLabel: "Native Integrations",
    icon: "extension",
  },
];

const testimonials = [
  {
    quote:
      "We cut our bounce rate from 4.2% to 0.3% in the first week. Dottor Mail is now an essential part of our email workflow — I can't imagine sending campaigns without it.",
    author: "Sarah Chen",
    role: "Head of Marketing, ScaleUp Inc.",
    rating: 5,
  },
  {
    quote: "The spam trap detection alone paid for itself within a month. Our deliverability has never been better, and our IT team loves the detailed SMTP logs.",
    author: "Marcus Rivera",
    role: "Email Operations Lead, NexusMedia",
    rating: 5,
  },
  {
    quote:
      "We tried five different verification services before Dottor. None matched the accuracy, speed, or API documentation quality. This is genuinely enterprise-grade.",
    author: "Dr. Aisha Patel",
    role: "CTO, MailStream Technologies",
    rating: 5,
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "For individuals and small teams getting started with email verification.",
    credits: "10,000",
    features: ["10,000 verified emails/mo", "Real-time API access", "CSV & TXT uploads", "Basic analytics dashboard", "Email support"],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Professional",
    price: "$79",
    period: "/month",
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
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$249",
    period: "/month",
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
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

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
// Main Component
// ──────────────────────────────────────────────

function HomePageV2() {
  const [emailDraft, setEmailDraft] = useState("");
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

  const verifiedCount = useCountUp(12478653, 2500, heroCounted);
  const accuracyCount = useCountUp(999, 2000, heroCounted);

  return (
    <>
      {/* ─── SEO ─── */}
      <Head>
        <title>Dottor Mail — Intelligent Email Verification for Modern Teams</title>
        <meta
          name="description"
          content="Enterprise-grade email verification powered by AI. Reduce bounces, protect sender reputation, and deliver every message with confidence."
        />
      </Head>

      {/* ════════════════════════════════════════ */}
      {/* HERO                                              */}
      {/* ════════════════════════════════════════ */}
      <Section fullWidth className="relative min-h-screen overflow-hidden bg-[#fafafa]">
        {/* Animated background blobs */}
        <motion.div className="absolute inset-0 pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
          <motion.div
            className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-400/[0.03] rounded-full blur-[120px]"
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          />
          <motion.div
            className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-400/[0.03] rounded-full blur-[120px]"
            animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          />
        </motion.div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #000 1px, transparent 0)`,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Top gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 z-20" />

        {/* ── Hero content ── */}
        <div className="relative z-10 container mx-auto px-5 sm:px-8 pt-28 sm:pt-36 pb-20 min-h-screen flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* ── Left column ── */}
          <div className="flex-1 max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
            {/* Pill badge with pulse */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs sm:text-sm font-semibold tracking-wide mb-8 shadow-sm relative overflow-hidden">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                Now processing {verifiedCount}+ emails
                {/* Subtle shimmer */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "linear", delay: 1 }}
                />
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              className="text-[clamp(2.5rem,7vw,5rem)] font-extrabold text-[#0b1120] leading-[1.04] tracking-[-0.03em] mb-6"
            >
              Every email{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500">verified</span>
                <motion.span
                  className="absolute -bottom-1 left-0 right-0 h-3 bg-emerald-200/40 -rotate-1 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                  style={{ originX: 0 }}
                />
              </span>
              , every send{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600">delivered</span>
                <motion.span
                  className="absolute -bottom-1 left-0 right-0 h-3 bg-cyan-200/40 rotate-1 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
                  style={{ originX: 0 }}
                />
              </span>
              .
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="text-[#4b5563] text-base sm:text-lg lg:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10"
            >
              Powerful email verification that eliminates bounces, detects spam traps, and ensures your campaigns reach real, active inboxes — every time.
            </motion.p>

            {/* CTA & input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto lg:mx-0 mb-5"
            >
              <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#9ca3af] group-focus-within:text-emerald-500 transition-colors">
                  <SvgIcon name="mail" className="size-5" />
                </div>
                <input
                  type="email"
                  placeholder="Try it — enter any email"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#e5e7eb] rounded-2xl text-sm text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all shadow-sm"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="group relative flex items-center justify-center gap-2 px-7 py-3.5 bg-[#0b1120] text-white font-semibold rounded-2xl transition-colors duration-300 shadow-lg shadow-[#0b1120]/20 overflow-hidden"
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: 2 }}
                />
                <span className="relative z-10 text-sm">Verify Free</span>
                <SvgIcon name="arrow_right_alt" className="size-4 group-hover:translate-x-1 transition-transform relative z-10" />
              </motion.button>
            </motion.div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-[#9ca3af] text-xs text-center lg:text-left">
              3 free checks per day. No credit card required.
            </motion.p>

            {/* Stats row with animated counters */}
            <div className="hidden sm:flex items-center gap-8 mt-12 pt-10 border-t border-[#e5e7eb]/60">
              <div ref={heroRef}>
                <motion.span className="block text-2xl font-extrabold text-[#0b1120] tabular-nums">{verifiedCount}+</motion.span>
                <div className="text-xs text-[#6b7280] font-medium mt-0.5">Emails Verified</div>
              </div>
              <div className="w-px h-10 bg-[#e5e7eb]" />
              <div ref={heroRef}>
                <motion.span className="block text-2xl font-extrabold text-[#0b1120] tabular-nums">{(Number(accuracyCount) / 10).toFixed(1)}%</motion.span>
                <div className="text-xs text-[#6b7280] font-medium mt-0.5">Accuracy Rate</div>
              </div>
              <div className="w-px h-10 bg-[#e5e7eb]" />
              <div>
                <div className="text-2xl font-extrabold text-[#0b1120]">24/7</div>
                <div className="text-xs text-[#6b7280] font-medium mt-0.5">Support</div>
              </div>
            </div>
          </div>

          {/* ── Right column — Dashboard mockup with tilt ── */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
            className="flex-1 w-full max-w-lg lg:max-w-none"
          >
            <motion.div className="relative" style={{ perspective: 1000 }}>
              {/* Glow backdrop */}
              <div className="absolute -inset-8 bg-gradient-to-br from-emerald-400/10 via-teal-400/5 to-cyan-400/10 rounded-3xl blur-3xl" />

              {/* Main card with subtle hover tilt */}
              <motion.div
                whileHover={{ rotateY: -3, rotateX: 2, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="relative bg-white rounded-3xl shadow-2xl shadow-[#0b1120]/10 border border-[#e5e7eb]/80 overflow-hidden"
              >
                {/* Card header */}
                <div className="flex items-center gap-3 px-6 py-4 border-b border-[#f1f5f9]">
                  <div className="flex gap-1.5">
                    <div className="size-3 rounded-full bg-[#f43f5e]" />
                    <div className="size-3 rounded-full bg-[#fbbf24]" />
                    <div className="size-3 rounded-full bg-[#22c55e]" />
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-xs font-semibold text-[#64748b] tracking-wide">Verification Dashboard</span>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-6 space-y-5">
                  {[
                    { email: "john@company.com", status: "Valid", color: "emerald" },
                    { email: "invalid-email", status: "Invalid", color: "red" },
                    { email: "info@domain.org", status: "Risky", color: "amber" },
                    { email: "sarah@startup.io", status: "Valid", color: "emerald" },
                    { email: "contact@unknown.net", status: "Unknown", color: "blue" },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 + i * 0.1, ease: "easeOut" }}
                      whileHover={{ backgroundColor: "#f1f5f9" }}
                      className="flex items-center justify-between py-2.5 px-3.5 rounded-xl bg-[#f8fafc] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="size-2 rounded-full shrink-0 bg-[#e2e8f0] group-hover:bg-[#cbd5e1] transition-colors" />
                        <span className="text-sm font-medium text-[#334155] truncate">{item.email}</span>
                      </div>
                      <span
                        className={`shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-lg ${
                          item.color === "emerald"
                            ? "bg-emerald-50 text-emerald-700"
                            : item.color === "red"
                              ? "bg-red-50 text-red-700"
                              : item.color === "amber"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </motion.div>
                  ))}

                  {/* Animated progress bar */}
                  <div className="pt-3">
                    <div className="flex justify-between text-xs text-[#64748b] mb-2">
                      <span className="font-medium">Verification Progress</span>
                      <motion.span className="font-semibold text-emerald-600" initial={{ width: 0 }} animate={{ width: "auto" }}>
                        92%
                      </motion.span>
                    </div>
                    <div className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "92%" }}
                        transition={{ duration: 1.5, delay: 1.8, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating badges with subtle bounce */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur-md border border-[#e5e7eb] rounded-xl px-4 py-2.5 shadow-lg hidden sm:block"
              >
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <SvgIcon name="check_circle" className="size-5 text-emerald-500" filled />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#111827]">Zero bounces detected</div>
                    <div className="text-[10px] text-[#6b7280] font-medium">All clear for delivery</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 0.5 }}
                className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-md border border-[#e5e7eb] rounded-xl px-4 py-2.5 shadow-lg hidden sm:block"
              >
                <div className="flex items-center gap-2">
                  <SvgIcon name="speed" className="size-5 text-teal-500" />
                  <span className="text-xs font-bold text-[#111827]">12ms avg</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </Section>

      {/* ════════════════════════════════════════ */}
      {/* TRUST BAR — Logo Cloud                            */}
      {/* ════════════════════════════════════════ */}
      <Section fullWidth className="py-12 sm:py-16 bg-[#f8fafc] border-y border-[#e5e7eb]/50">
        <div className="container mx-auto px-5 sm:px-8 text-center">
          <AnimationDiv initial="opacity-0" visible="opacity-100" duration="duration-700">
            <p className="text-xs sm:text-sm font-semibold text-[#6b7280] tracking-[0.2em] uppercase mb-10">Trusted by Engineering &amp; Marketing Teams at</p>
          </AnimationDiv>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-40">
            {["Mailchimp", "HubSpot", "Salesforce", "Shopify", "Stripe", "Notion"].map((name) => (
              <div key={name} className="text-lg sm:text-xl font-extrabold text-[#0b1120] tracking-tight select-none">
                {name}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════ */}
      {/* HOW IT WORKS — Vertical Timeline                  */}
      {/* ════════════════════════════════════════ */}
      <Section fullWidth className="relative py-28 sm:py-36 bg-white overflow-hidden">
        {/* Subtle decorative */}
        <div className="absolute top-1/3 left-[-10%] w-[400px] h-[400px] bg-emerald-400/[0.02] rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-5 sm:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-20">
            <AnimationDiv initial="opacity-0 translate-y-6" visible="opacity-100 translate-y-0">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] sm:text-xs font-bold mb-5 tracking-widest uppercase">
                How It Works
              </div>
              <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold text-[#0b1120] leading-[1.1] tracking-[-0.02em]">
                From messy list to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">campaign-ready</span> in minutes.
              </h2>
              <p className="text-[#6b7280] text-base sm:text-lg mt-5 max-w-lg mx-auto leading-relaxed">
                No technical skills needed. Upload, scan, review, and export — a clean email list in four simple steps.
              </p>
            </AnimationDiv>
          </div>

          {/* Timeline */}
          <div className="relative max-w-4xl mx-auto">
            {/* Vertical line */}
            <div className="hidden lg:block absolute left-[50%] top-0 bottom-0 w-px bg-gradient-to-b from-emerald-200 via-teal-200 to-cyan-200" />

            <div className="space-y-16 lg:space-y-28">
              {steps.map((step, idx) => (
                <div key={idx} className={`relative flex flex-col ${idx % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-8 lg:gap-16`}>
                  {/* Connector dot */}
                  <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 z-10 size-10 rounded-full bg-white border-2 border-emerald-400 items-center justify-center shadow-lg shadow-emerald-200/30">
                    <div className="size-3 rounded-full bg-emerald-500" />
                  </div>

                  {/* Text side */}
                  <AnimationDiv
                    initial="opacity-0 translate-y-8"
                    visible="opacity-100 translate-y-0"
                    duration="duration-700"
                    delay={`delay-${idx * 120}`}
                    className={`flex-1 ${idx % 2 === 0 ? "lg:text-right lg:pr-16" : "lg:text-left lg:pl-16"}`}
                  >
                    <span className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#e5e7eb] leading-none select-none block mb-2">{step.number}</span>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#111827] mt-2 mb-3">{step.title}</h3>
                    <p className="text-[#6b7280] text-sm sm:text-base leading-relaxed max-w-md lg:max-w-none">{step.description}</p>
                  </AnimationDiv>

                  {/* Icon side */}
                  <AnimationDiv
                    initial="opacity-0 scale-90"
                    visible="opacity-100 scale-100"
                    duration="duration-700"
                    delay={`delay-${idx * 120 + 80}`}
                    className={`flex-1 flex ${idx % 2 === 0 ? "lg:justify-start" : "lg:justify-end"}`}
                  >
                    <div className="size-24 sm:size-28 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center shadow-lg shadow-emerald-200/20 border border-emerald-100/60 group hover:shadow-xl hover:shadow-emerald-200/30 hover:border-emerald-200 transition-all duration-500">
                      <SvgIcon name={step.icon} className="size-10 sm:size-12 text-emerald-600 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  </AnimationDiv>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════ */}
      {/* FEATURES — Bento-style Grid                      */}
      {/* ════════════════════════════════════════ */}
      <Section fullWidth className="relative py-28 sm:py-36 bg-[#f8fafc] overflow-hidden">
        {/* Background accents */}
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-teal-400/[0.02] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-[-5%] right-[-5%] w-[400px] h-[400px] bg-emerald-400/[0.02] rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-5 sm:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <AnimationDiv initial="opacity-0 translate-y-6" visible="opacity-100 translate-y-0">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 text-[11px] sm:text-xs font-bold mb-5 tracking-widest uppercase">
                <SvgIcon name="stars" className="size-3.5" filled />
                Powerful Features
              </div>
              <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold text-[#0b1120] leading-[1.1] tracking-[-0.02em]">
                Built for precision. <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">Engineered for scale.</span>
              </h2>
              <p className="text-[#6b7280] text-base sm:text-lg mt-5 max-w-xl mx-auto leading-relaxed">
                Every feature is designed to maximize deliverability, protect your reputation, and save your team hours of manual work.
              </p>
            </AnimationDiv>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Hero feature — spans 2 cols */}
            <AnimationDiv initial="opacity-0 translate-y-6" visible="opacity-100 translate-y-0" duration="duration-700" className="md:col-span-2 lg:col-span-2">
              <div className="relative p-8 sm:p-10 bg-gradient-to-br from-[#0b1120] to-[#1a2332] rounded-3xl overflow-hidden group cursor-default h-full">
                {/* Decorative */}
                <div className="absolute top-[-30%] right-[-20%] w-[300px] h-[300px] bg-emerald-500/[0.06] rounded-full blur-[80px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[200px] h-[200px] bg-teal-500/[0.04] rounded-full blur-[60px]" />

                <div className="relative z-10 flex flex-col lg:flex-row items-start gap-8">
                  <div className="flex-1">
                    <div className="size-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/10">
                      <SvgIcon name="speed" className="size-7 text-emerald-400" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">Real-Time Verification Engine</h3>
                    <p className="text-[#94a3b8] text-sm sm:text-base leading-relaxed max-w-md">
                      Every email is checked against 12+ validation layers in under 200ms. Syntax, domain, MX, SMTP, role-based detection, and spam trap analysis — all in
                      parallel.
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-6 p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                    <div className="text-center">
                      <div className="text-4xl sm:text-5xl font-extrabold text-emerald-400 tabular-nums">&lt;200</div>
                      <div className="text-xs text-[#94a3b8] font-medium mt-1">milliseconds</div>
                    </div>
                    <div className="w-px h-12 bg-white/[0.08]" />
                    <div className="text-center">
                      <div className="text-4xl sm:text-5xl font-extrabold text-emerald-400">12+</div>
                      <div className="text-xs text-[#94a3b8] font-medium mt-1">validation layers</div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimationDiv>

            {/* Regular feature cards */}
            {features.slice(1).map((feat, idx) => (
              <AnimationDiv
                key={idx}
                initial="opacity-0 translate-y-6"
                visible="opacity-100 translate-y-0"
                duration="duration-700"
                delay={`delay-${idx * 80}`}
                className="group"
              >
                <div className="h-full p-7 sm:p-8 bg-white rounded-3xl border border-[#e5e7eb]/80 hover:border-emerald-200/60 hover:shadow-xl hover:shadow-emerald-200/10 transition-all duration-500 cursor-default flex flex-col">
                  <div className="size-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-5 group-hover:bg-emerald-100 transition-colors duration-300">
                    <SvgIcon name={feat.icon} className="size-6 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-bold text-[#111827] mb-2 group-hover:text-emerald-700 transition-colors">{feat.title}</h3>
                  <p className="text-sm text-[#6b7280] leading-relaxed flex-1">{feat.description}</p>
                  <div className="mt-5 pt-4 border-t border-[#f1f5f9] flex items-center justify-between">
                    <span className="text-xl font-extrabold text-[#0b1120]">{feat.stat}</span>
                    <span className="text-[11px] text-[#9ca3af] font-medium">{feat.statLabel}</span>
                  </div>
                </div>
              </AnimationDiv>
            ))}
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════ */}
      {/* STATS / DIFFERENTIATORS                           */}
      {/* ════════════════════════════════════════ */}
      <Section fullWidth className="relative py-28 sm:py-36 bg-[#0b1120] overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-emerald-500/[0.03] rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-teal-500/[0.02] rounded-full blur-[100px]" />
        </div>

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`, backgroundSize: "48px 48px" }}
        />

        <div className="container mx-auto px-5 sm:px-8 relative z-10">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-20">
            <AnimationDiv initial="opacity-0 translate-y-6" visible="opacity-100 translate-y-0">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] sm:text-xs font-bold mb-5 tracking-widest uppercase border border-emerald-500/10">
                Why Dottor Mail
              </div>
              <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold text-white leading-[1.1] tracking-[-0.02em]">
                Not just accurate. <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Relentless.</span>
              </h2>
              <p className="text-[#94a3b8] text-base sm:text-lg mt-5 leading-relaxed">
                We obsess over deliverability so you don&apos;t have to. Here&apos;s what sets us apart.
              </p>
            </AnimationDiv>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { value: "99.9%", label: "Verification Accuracy", sub: "Industry-leading precision across all validation layers", icon: "verified" },
              { value: "12+", label: "Validation Checks", sub: "Syntax, domain, MX, SMTP, role, trap, and more per email", icon: "checklist" },
              { value: "50M+", label: "Emails Processed", sub: "Trusted by thousands of businesses to clean their lists", icon: "rocket_launch" },
              { value: "99%", label: "Customer Retention", sub: "Our platform delivers results that keep teams coming back", icon: "group" },
            ].map((stat, idx) => (
              <AnimationDiv key={idx} initial="opacity-0 translate-y-8" visible="opacity-100 translate-y-0" duration="duration-700" delay={`delay-${idx * 100}`}>
                <div className="relative p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-emerald-500/20 transition-all duration-500 group cursor-default h-full">
                  <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-5 group-hover:bg-emerald-500/20 transition-colors">
                    <SvgIcon name={stat.icon} className="size-5 text-emerald-400" filled />
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1.5 tabular-nums">{stat.value}</div>
                  <div className="text-sm font-semibold text-[#e2e8f0] mb-2">{stat.label}</div>
                  <p className="text-xs text-[#64748b] leading-relaxed">{stat.sub}</p>
                </div>
              </AnimationDiv>
            ))}
          </div>

          {/* Bottom feature comparison list */}
          <AnimationDiv initial="opacity-0" visible="opacity-100" duration="duration-700" delay="delay-500">
            <div className="mt-16 p-8 sm:p-10 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  "Real-time syntax & domain validation",
                  "Deep MX & SMTP server checks",
                  "Spam trap & honeypot detection",
                  "Role-based email identification",
                  "Disposable email detection",
                  "Duplicate removal & list merging",
                  "Bulk upload (CSV, TXT, API)",
                  "Webhook & Zapier integrations",
                  "Detailed analytics & export logs",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-[#cbd5e1]">
                    <div className="size-5 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
                      <SvgIcon name="done_all" className="size-3 text-emerald-400" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </AnimationDiv>
        </div>
      </Section>

      {/* ════════════════════════════════════════ */}
      {/* PRICING PREVIEW                                   */}
      {/* ════════════════════════════════════════ */}
      <Section fullWidth className="relative py-28 sm:py-36 bg-white overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-amber-400/[0.02] rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-5 sm:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <AnimationDiv initial="opacity-0 translate-y-6" visible="opacity-100 translate-y-0">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 text-[11px] sm:text-xs font-bold mb-5 tracking-widest uppercase">
                <SvgIcon name="credit_card" className="size-3.5" />
                Simple Pricing
              </div>
              <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold text-[#0b1120] leading-[1.1] tracking-[-0.02em]">
                Transparent plans. <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">No surprises.</span>
              </h2>
              <p className="text-[#6b7280] text-base sm:text-lg mt-5 max-w-lg mx-auto leading-relaxed">
                Start free and scale as you grow. All plans include our core verification engine with no hidden fees.
              </p>
            </AnimationDiv>
          </div>

          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan, idx) => (
              <AnimationDiv
                key={idx}
                initial="opacity-0 translate-y-8"
                visible="opacity-100 translate-y-0"
                duration="duration-700"
                delay={`delay-${idx * 120}`}
                className="relative"
              >
                <div
                  className={`h-full p-8 rounded-3xl border-2 transition-all duration-500 flex flex-col ${
                    plan.popular
                      ? "bg-[#0b1120] border-emerald-400/30 shadow-2xl shadow-emerald-500/10 scale-105 md:scale-110"
                      : "bg-white border-[#e5e7eb] hover:border-emerald-200/50 hover:shadow-xl hover:shadow-emerald-200/10"
                  }`}
                >
                  {/* Popular badge */}
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[11px] font-bold tracking-wide shadow-lg shadow-emerald-500/30 whitespace-nowrap">
                      Most Popular
                    </div>
                  )}

                  <div className={`mb-6 ${plan.popular ? "text-white" : "text-[#111827]"}`}>
                    <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                    <p className={`text-sm ${plan.popular ? "text-[#94a3b8]" : "text-[#6b7280]"}`}>{plan.description}</p>
                  </div>

                  <div className={`mb-6 ${plan.popular ? "text-white" : "text-[#0b1120]"}`}>
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    <span className={`text-sm font-medium ${plan.popular ? "text-[#94a3b8]" : "text-[#6b7280]"}`}>{plan.period}</span>
                    <div className={`text-xs font-medium mt-1 ${plan.popular ? "text-emerald-400" : "text-emerald-600"}`}>{plan.credits} emails included</div>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feat, fi) => (
                      <li key={fi} className={`flex items-start gap-2.5 text-sm ${plan.popular ? "text-[#cbd5e1]" : "text-[#4b5563]"}`}>
                        <SvgIcon name="done_all" className={`size-4 shrink-0 mt-0.5 ${plan.popular ? "text-emerald-400" : "text-emerald-500"}`} filled />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 active:scale-[0.98] ${
                      plan.popular
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/25"
                        : "bg-[#f1f5f9] text-[#111827] hover:bg-[#e2e8f0]"
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </AnimationDiv>
            ))}
          </div>

          {/* Footnote */}
          <AnimationDiv initial="opacity-0" visible="opacity-100" duration="duration-700" delay="delay-500">
            <p className="text-center text-sm text-[#9ca3af] mt-10">
              All plans include a 14-day free trial. No credit card required.{" "}
              <Link href="/pricing" className="text-emerald-600 font-semibold hover:text-emerald-700 underline underline-offset-2">
                View full pricing →
              </Link>
            </p>
          </AnimationDiv>
        </div>
      </Section>

      {/* ════════════════════════════════════════ */}
      {/* TESTIMONIALS — Featured Cards                     */}
      {/* ════════════════════════════════════════ */}
      <Section fullWidth className="relative py-28 sm:py-36 bg-[#f8fafc] overflow-hidden">
        <div className="absolute top-1/2 left-[-10%] w-[400px] h-[400px] bg-teal-400/[0.02] rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-5 sm:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <AnimationDiv initial="opacity-0 translate-y-6" visible="opacity-100 translate-y-0">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 text-[11px] sm:text-xs font-bold mb-5 tracking-widest uppercase">
                <SvgIcon name="star" className="size-3.5" filled />
                Testimonials
              </div>
              <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold text-[#0b1120] leading-[1.1] tracking-[-0.02em]">
                Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">thousands</span> of teams.
              </h2>
              <p className="text-[#6b7280] text-base sm:text-lg mt-5 max-w-lg mx-auto leading-relaxed">
                Don&apos;t take our word for it. Here&apos;s what our customers have to say.
              </p>
            </AnimationDiv>
          </div>

          {/* Testimonial cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, idx) => (
              <AnimationDiv key={idx} initial="opacity-0 translate-y-8" visible="opacity-100 translate-y-0" duration="duration-700" delay={`delay-${idx * 150}`}>
                <div className="h-full p-8 bg-white rounded-3xl border border-[#e5e7eb]/80 hover:border-amber-200/50 hover:shadow-xl hover:shadow-amber-200/10 transition-all duration-500 flex flex-col cursor-default group">
                  {/* Quote icon */}
                  <div className="text-4xl leading-none text-amber-200 group-hover:text-amber-300 transition-colors mb-4 select-none">&ldquo;</div>

                  {/* Stars */}
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <SvgIcon key={i} name="star" className="size-4 text-amber-400" filled />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-sm sm:text-[15px] text-[#4b5563] leading-relaxed flex-1">{t.quote}</blockquote>

                  {/* Author */}
                  <div className="mt-6 pt-5 border-t border-[#f1f5f9]">
                    <div className="font-bold text-sm text-[#111827]">{t.author}</div>
                    <div className="text-xs text-[#6b7280] mt-0.5">{t.role}</div>
                  </div>
                </div>
              </AnimationDiv>
            ))}
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════ */}
      {/* FINAL CTA                                          */}
      {/* ════════════════════════════════════════ */}
      <Section fullWidth className="relative py-28 sm:py-36 bg-white overflow-hidden">
        <div className="container mx-auto px-5 sm:px-8">
          <AnimationDiv initial="opacity-0 translate-y-8" visible="opacity-100 translate-y-0" duration="duration-700">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b1120] via-[#111d33] to-[#0b1120] p-10 sm:p-16 lg:p-20 text-center shadow-2xl shadow-[#0b1120]/30">
              {/* Decorative */}
              <div className="absolute top-[-30%] left-[-15%] w-[400px] h-[400px] bg-emerald-500/[0.04] rounded-full blur-[120px] pointer-events-none" />
              <div className="absolute bottom-[-30%] right-[-15%] w-[400px] h-[400px] bg-teal-500/[0.04] rounded-full blur-[120px] pointer-events-none" />
              <div
                className="absolute inset-0 opacity-[0.015] pointer-events-none"
                style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`, backgroundSize: "32px 32px" }}
              />

              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-[clamp(1.8rem,4.5vw,3.2rem)] font-extrabold text-white leading-[1.1] tracking-[-0.02em] mb-5">
                  Ready to clean your list and boost delivery?
                </h2>
                <p className="text-[#94a3b8] text-base sm:text-lg mb-10 max-w-md mx-auto leading-relaxed">
                  Join 10,000+ businesses that trust Dottor Mail for email verification. Start free — no credit card needed.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <RouterLink href="/register">
                    <div className="group inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold rounded-2xl transition-all duration-300 shadow-xl shadow-emerald-500/25 active:scale-[0.97]">
                      <span className="text-sm sm:text-base">Start Free — No Payment Required</span>
                      <SvgIcon name="arrow_right_alt" className="size-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </RouterLink>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-2 px-8 py-4 text-[#94a3b8] hover:text-white text-sm font-semibold rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    Compare plans
                    <SvgIcon name="arrow_right_alt" className="size-4" />
                  </Link>
                </div>

                {/* Trust line */}
                <div className="flex items-center justify-center gap-6 mt-10 pt-8 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-xs text-[#64748b]">
                    <SvgIcon name="check_circle" className="size-4 text-emerald-500" filled />
                    No credit card
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#64748b]">
                    <SvgIcon name="check_circle" className="size-4 text-emerald-500" filled />
                    14-day free trial
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#64748b]">
                    <SvgIcon name="check_circle" className="size-4 text-emerald-500" filled />
                    Cancel anytime
                  </div>
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

export default HomePageV2;

HomePageV2.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
