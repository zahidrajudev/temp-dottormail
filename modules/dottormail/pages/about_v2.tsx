import MainLayout from "@/layouts/MainLayout";
import SvgIcon from "@/modules/global/icons/svg_icons";
import Section from "@/modules/global/elements/section";
import AnimationDiv from "@/modules/global/animations/animate_div";
import RouterLink from "@/modules/global/elements/router_link";
import { ReactElement, useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";

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

const values = [
  {
    title: "Uncompromising Accuracy",
    description: "Every email is validated against 12+ verification layers. We obsess over precision so your campaigns land in real inboxes, every time.",
    icon: "verified",
    stats: "99.9%",
    statLabel: "Accuracy Rate",
  },
  {
    title: "Radical Transparency",
    description: "We show you exactly why each email passed or failed — from syntax checks to SMTP handshake logs. No black boxes, no guesswork.",
    icon: "visibility",
    stats: "12+",
    statLabel: "Validation Layers",
  },
  {
    title: "Privacy by Design",
    description: "Your data is encrypted in transit and at rest. We never share, sell, or store your email lists beyond verification. GDPR-compliant by default.",
    icon: "security",
    stats: "GDPR",
    statLabel: "Compliant",
  },
  {
    title: "Relentless Innovation",
    description: "Our engineering team continuously adapts to changing email standards, spam filters, and security protocols so you stay ahead of the curve.",
    icon: "rocket_launch",
    stats: "24/7",
    statLabel: "Monitoring & Updates",
  },
];

const milestones = [
  { year: "2021", title: "The Idea", description: "Founded by a team of email engineers who saw that businesses were losing millions to undelivered messages." },
  { year: "2022", title: "Platform Launch", description: "Launched our core verification engine with 8 validation layers, processing 100K emails in the first month." },
  { year: "2023", title: "Scale & Accuracy", description: "Expanded to 12+ validation layers, processed 10M+ emails, and achieved 99.9% accuracy certification." },
  { year: "2024", title: "Enterprise Ready", description: "Introduced bulk processing, API access, spam trap detection, and integrations with major ESPs." },
  { year: "2025", title: "Global Trust", description: "Surpassed 50M emails processed, trusted by 10K+ businesses across 200+ countries worldwide." },
];

const leadership = [
  { name: "Alex Chen", role: "CEO & Co-Founder", bio: "15+ years in email infrastructure. Previously led engineering at a major ESP." },
  { name: "Dr. Maya Patel", role: "CTO & Co-Founder", bio: "PhD in Distributed Systems. Built verification algorithms processing millions of emails daily." },
  { name: "James Okafor", role: "VP of Engineering", bio: "Former infrastructure lead at SendGrid. Specializes in scalable email processing systems." },
  { name: "Sarah Lindqvist", role: "Head of Product", bio: "10+ years in B2B SaaS. Passionate about making complex verification simple and intuitive." },
];

const trustSignals = [
  { label: "GDPR Compliant", icon: "verified" },
  { label: "SOC 2 Type II", icon: "security" },
  { label: "99.9% Uptime SLA", icon: "monitoring" },
  { label: "AES-256 Encryption", icon: "lock" },
  { label: "ISO 27001 Certified", icon: "verified_user" },
  { label: "Zero Data Retention", icon: "delete" },
];

// ──────────────────────────────────────────────
// About Page Component
// ──────────────────────────────────────────────

function DottormailAboutV2() {
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
  const accuracyCount = useCountUp(999, 2500, heroCounted);
  const customersCount = useCountUp(10000, 2500, heroCounted);
  const countriesCount = useCountUp(200, 2000, heroCounted);

  return (
    <>
      <Head>
        <title>About Us — Dottor Mail | Intelligent Email Verification</title>
        <meta
          name="description"
          content="Dottor Mail is on a mission to make email deliverability reliable for every business. AI-powered verification, radical transparency, and privacy by design."
        />
      </Head>

      {/* ════════════════════════════════════════ */}
      {/* HERO SECTION                              */}
      {/* ════════════════════════════════════════ */}
      <Section fullWidth className="relative min-h-[90vh] overflow-hidden bg-[#fafafa]">
        {/* Subtle background mesh */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-15%] left-[-5%] w-[50%] h-[50%] bg-emerald-400/[0.03] rounded-full blur-[120px]" />
          <div className="absolute bottom-[-15%] right-[-5%] w-[50%] h-[50%] bg-teal-400/[0.03] rounded-full blur-[120px]" />
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)", backgroundSize: "48px 48px" }}
        />

        {/* Top gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 z-20" />

        <div
          ref={heroRef}
          className="relative z-10 container mx-auto px-5 sm:px-8 pt-32 sm:pt-40 pb-20 min-h-[90vh] flex flex-col lg:flex-row items-center gap-16 lg:gap-24"
        >
          {/* Left column */}
          <div className="flex-1 max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
            <AnimationDiv initial="opacity-0 translate-y-5" visible="opacity-100 translate-y-0" duration="duration-700">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs sm:text-sm font-semibold tracking-wide mb-8 shadow-sm">
                <SvgIcon name="info" className="size-4" />
                About Dottor Mail
              </div>
            </AnimationDiv>

            <AnimationDiv initial="opacity-0 translate-y-7" visible="opacity-100 translate-y-0" duration="duration-700" delay="delay-100">
              <h1 className="text-[clamp(2.5rem,6.5vw,4.5rem)] font-extrabold text-[#0b1120] leading-[1.05] tracking-[-0.03em] mb-6">
                We make email{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500">deliverable</span>
                  <span className="absolute -bottom-1 left-0 right-0 h-3 bg-emerald-200/40 -rotate-1 rounded-full" />
                </span>{" "}
                for everyone.
              </h1>
            </AnimationDiv>

            <AnimationDiv initial="opacity-0 translate-y-6" visible="opacity-100 translate-y-0" duration="duration-700" delay="delay-200">
              <p className="text-[#4b5563] text-base sm:text-lg lg:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10">
                We believe every message deserves to reach its destination. That&apos;s why we built an email verification platform that combines AI-powered precision
                with radical transparency — so businesses can send with confidence, every time.
              </p>
            </AnimationDiv>

            <AnimationDiv initial="opacity-0 translate-y-6" visible="opacity-100 translate-y-0" duration="duration-700" delay="delay-300">
              <div className="flex flex-col sm:flex-row gap-4 items-center lg:items-start">
                <RouterLink href="/register">
                  <div className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#0b1120] hover:bg-[#1a2332] text-white font-semibold rounded-2xl transition-all duration-300 active:scale-[0.97] shadow-lg shadow-[#0b1120]/20">
                    <span className="text-sm">Start Verifying Free</span>
                    <SvgIcon name="arrow_right_alt" className="size-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </RouterLink>
                <Link
                  href="#story"
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-[#4b5563] hover:text-[#0b1120] text-sm font-medium transition-colors duration-200"
                >
                  <SvgIcon name="arrow_right_alt" className="size-4 -rotate-90" />
                  <span>Our Story</span>
                </Link>
              </div>
            </AnimationDiv>

            {/* Hero stats */}
            <AnimationDiv initial="opacity-0" visible="opacity-100" duration="duration-1000" delay="delay-500">
              <div className="hidden sm:flex items-center gap-8 mt-14 pt-10 border-t border-[#e5e7eb]/60">
                <div className="text-left">
                  <div className="text-2xl font-extrabold text-[#0b1120] tabular-nums">{verifiedCount}+</div>
                  <div className="text-xs text-[#6b7280] font-medium mt-0.5">Emails Verified</div>
                </div>
                <div className="w-px h-10 bg-[#e5e7eb]" />
                <div className="text-left">
                  <div className="text-2xl font-extrabold text-[#0b1120] tabular-nums">{accuracyCount}%</div>
                  <div className="text-xs text-[#6b7280] font-medium mt-0.5">Accuracy Rate</div>
                </div>
                <div className="w-px h-10 bg-[#e5e7eb]" />
                <div className="text-left">
                  <div className="text-2xl font-extrabold text-[#0b1120] tabular-nums">{customersCount}+</div>
                  <div className="text-xs text-[#6b7280] font-medium mt-0.5">Trusted Businesses</div>
                </div>
                <div className="w-px h-10 bg-[#e5e7eb]" />
                <div className="text-left">
                  <div className="text-2xl font-extrabold text-[#0b1120] tabular-nums">{countriesCount}+</div>
                  <div className="text-xs text-[#6b7280] font-medium mt-0.5">Countries Served</div>
                </div>
              </div>
            </AnimationDiv>
          </div>

          {/* Right column — visual */}
          <AnimationDiv
            initial="opacity-0 translate-y-12 scale-[0.96]"
            visible="opacity-100 translate-y-0 scale-100"
            duration="duration-1000"
            delay="delay-400"
            className="flex-1 w-full max-w-lg lg:max-w-none"
          >
            <div className="relative">
              <div className="absolute -inset-8 bg-gradient-to-br from-emerald-400/10 via-teal-400/5 to-cyan-400/10 rounded-3xl blur-3xl" />

              {/* Brand illustration card */}
              <div className="relative bg-white rounded-3xl shadow-2xl shadow-[#0b1120]/10 border border-[#e5e7eb]/80 overflow-hidden">
                {/* Top accent */}
                <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

                <div className="p-8 sm:p-10">
                  {/* Mission quote */}
                  <div className="mb-8">
                    <div className="text-5xl leading-none text-emerald-200 select-none mb-2">&ldquo;</div>
                    <p className="text-base sm:text-lg text-[#4b5563] leading-relaxed italic">
                      Every bounced email is a lost opportunity. We&apos;re here to make sure that never happens.
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="size-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-sm font-bold">
                        DM
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#111827]">Dottor Mail Team</div>
                        <div className="text-xs text-[#6b7280]">Founded 2021</div>
                      </div>
                    </div>
                  </div>

                  {/* Quick facts grid */}
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[#f1f5f9]">
                    {[
                      { label: "Founded", value: "2021" },
                      { label: "Team Size", value: "45+" },
                      { label: "Integrations", value: "50+" },
                      { label: "Avg. Response", value: "<200ms" },
                    ].map((fact, idx) => (
                      <div key={idx} className="p-3 sm:p-4 rounded-xl bg-[#f8fafc]">
                        <div className="text-lg sm:text-xl font-extrabold text-[#0b1120]">{fact.value}</div>
                        <div className="text-[11px] text-[#6b7280] font-medium">{fact.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-white/90 backdrop-blur-md border border-[#e5e7eb] rounded-xl px-4 py-2.5 shadow-lg hidden sm:block">
                <div className="flex items-center gap-2">
                  <SvgIcon name="verified" className="size-5 text-emerald-500" filled />
                  <span className="text-xs font-bold text-[#111827]">AI-Powered Engine</span>
                </div>
              </div>
            </div>
          </AnimationDiv>
        </div>
      </Section>

      {/* ════════════════════════════════════════ */}
      {/* OUR STORY — Timeline                      */}
      {/* ════════════════════════════════════════ */}
      <Section fullWidth id="story" className="relative py-28 sm:py-36 bg-white overflow-hidden">
        <div className="absolute top-1/3 right-[-10%] w-[400px] h-[400px] bg-emerald-400/[0.02] rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-5 sm:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-20">
            <AnimationDiv initial="opacity-0 translate-y-6" visible="opacity-100 translate-y-0">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] sm:text-xs font-bold mb-5 tracking-widest uppercase">
                Our Story
              </div>
              <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold text-[#0b1120] leading-[1.1] tracking-[-0.02em]">
                From a simple idea to a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">global platform</span>.
              </h2>
              <p className="text-[#6b7280] text-base sm:text-lg mt-5 max-w-lg mx-auto leading-relaxed">
                What started as a frustration with poor email deliverability became a mission to fix it for everyone.
              </p>
            </AnimationDiv>
          </div>

          {/* Timeline */}
          <div className="relative max-w-3xl mx-auto">
            {/* Vertical line */}
            <div className="hidden sm:block absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-200 via-teal-200 to-cyan-200" />

            <div className="space-y-12 sm:space-y-16">
              {milestones.map((m, idx) => (
                <div key={idx} className="relative flex flex-col sm:flex-row gap-6 sm:gap-10">
                  {/* Dot + year */}
                  <div className="flex sm:flex-col items-center sm:items-center gap-4 sm:gap-2 shrink-0 sm:w-16">
                    <div className="relative z-10 size-8 sm:size-10 rounded-full bg-white border-2 border-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-200/30 shrink-0">
                      <div className="size-2 sm:size-3 rounded-full bg-emerald-500" />
                    </div>
                    <AnimationDiv initial="opacity-0" visible="opacity-100" duration="duration-500" delay={`delay-${idx * 100}`}>
                      <span className="text-xs sm:text-sm font-extrabold text-emerald-600 tracking-wide whitespace-nowrap">{m.year}</span>
                    </AnimationDiv>
                  </div>

                  {/* Content card */}
                  <AnimationDiv
                    initial="opacity-0 translate-x-6"
                    visible="opacity-100 translate-x-0"
                    duration="duration-700"
                    delay={`delay-${idx * 120}`}
                    className="flex-1"
                  >
                    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e5e7eb] hover:border-emerald-200/50 hover:shadow-lg hover:shadow-emerald-200/10 transition-all duration-300">
                      <h3 className="text-base sm:text-lg font-bold text-[#111827] mb-1.5">{m.title}</h3>
                      <p className="text-sm text-[#6b7280] leading-relaxed">{m.description}</p>
                    </div>
                  </AnimationDiv>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════ */}
      {/* CORE VALUES — Bento Cards                 */}
      {/* ════════════════════════════════════════ */}
      <Section fullWidth className="relative py-28 sm:py-36 bg-[#f8fafc] overflow-hidden">
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-teal-400/[0.02] rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-5 sm:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <AnimationDiv initial="opacity-0 translate-y-6" visible="opacity-100 translate-y-0">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 text-[11px] sm:text-xs font-bold mb-5 tracking-widest uppercase">
                <SvgIcon name="stars" className="size-3.5" filled />
                Core Values
              </div>
              <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold text-[#0b1120] leading-[1.1] tracking-[-0.02em]">
                What drives us <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">every day</span>.
              </h2>
              <p className="text-[#6b7280] text-base sm:text-lg mt-5 max-w-xl mx-auto leading-relaxed">
                These principles guide every decision we make — from how we build our technology to how we treat our customers&apos; data.
              </p>
            </AnimationDiv>
          </div>

          {/* Values grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {/* Hero value — spans full width */}
            <AnimationDiv initial="opacity-0 translate-y-6" visible="opacity-100 translate-y-0" duration="duration-700" className="md:col-span-2">
              <div className="relative p-8 sm:p-10 bg-gradient-to-br from-[#0b1120] to-[#1a2332] rounded-3xl overflow-hidden group cursor-default">
                <div className="absolute top-[-30%] right-[-20%] w-[300px] h-[300px] bg-emerald-500/[0.06] rounded-full blur-[80px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[200px] h-[200px] bg-teal-500/[0.04] rounded-full blur-[60px]" />

                <div className="relative z-10 flex flex-col lg:flex-row items-start gap-6 lg:gap-10">
                  <div className="size-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/10 shrink-0">
                    <SvgIcon name="verified" className="size-7 text-emerald-400" filled />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">Uncompromising Accuracy</h3>
                    <p className="text-[#94a3b8] text-sm sm:text-base leading-relaxed max-w-2xl">
                      Every email is validated against 12+ verification layers. We obsess over precision so your campaigns land in real inboxes, every time. Our engine
                      cross-references syntax, domain, MX records, SMTP handshake, role-based detection, and spam trap analysis in parallel.
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-6 p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                    <div className="text-center">
                      <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">99.9%</div>
                      <div className="text-[11px] text-[#94a3b8] font-medium mt-1">Accuracy</div>
                    </div>
                    <div className="w-px h-10 bg-white/[0.08]" />
                    <div className="text-center">
                      <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">12+</div>
                      <div className="text-[11px] text-[#94a3b8] font-medium mt-1">Checks</div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimationDiv>

            {/* Regular value cards */}
            {values.slice(1).map((val, idx) => (
              <AnimationDiv key={idx} initial="opacity-0 translate-y-6" visible="opacity-100 translate-y-0" duration="duration-700" delay={`delay-${idx * 100}`}>
                <div className="h-full p-7 sm:p-8 bg-white rounded-3xl border border-[#e5e7eb]/80 hover:border-emerald-200/60 hover:shadow-xl hover:shadow-emerald-200/10 transition-all duration-500 cursor-default group flex flex-col">
                  <div className="size-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-5 group-hover:bg-emerald-100 transition-colors duration-300">
                    <SvgIcon name={val.icon} className="size-6 text-emerald-600" filled />
                  </div>
                  <h3 className="text-lg font-bold text-[#111827] mb-2 group-hover:text-emerald-700 transition-colors">{val.title}</h3>
                  <p className="text-sm text-[#6b7280] leading-relaxed flex-1">{val.description}</p>
                  <div className="mt-5 pt-4 border-t border-[#f1f5f9] flex items-center justify-between">
                    <span className="text-lg font-extrabold text-[#0b1120]">{val.stats}</span>
                    <span className="text-[11px] text-[#9ca3af] font-medium">{val.statLabel}</span>
                  </div>
                </div>
              </AnimationDiv>
            ))}
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════ */}
      {/* TRUST & SECURITY                           */}
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
                <SvgIcon name="security" className="size-3.5" />
                Trust &amp; Security
              </div>
              <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold text-white leading-[1.1] tracking-[-0.02em]">
                Built on a foundation of <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">trust</span>.
              </h2>
              <p className="text-[#94a3b8] text-base sm:text-lg mt-5 leading-relaxed max-w-xl mx-auto">
                Security isn&apos;t a feature — it&apos;s the bedrock of everything we build. Your data is protected by enterprise-grade encryption and industry-leading
                compliance standards.
              </p>
            </AnimationDiv>
          </div>

          {/* Trust signals */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {trustSignals.map((signal, idx) => (
              <AnimationDiv key={idx} initial="opacity-0 translate-y-6" visible="opacity-100 translate-y-0" duration="duration-600" delay={`delay-${idx * 80}`}>
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-emerald-500/20 transition-all duration-300 text-center group cursor-default h-full flex flex-col items-center justify-center gap-3">
                  <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                    <SvgIcon name={signal.icon} className="size-5 text-emerald-400" filled />
                  </div>
                  <span className="text-xs font-semibold text-[#cbd5e1] leading-tight">{signal.label}</span>
                </div>
              </AnimationDiv>
            ))}
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════ */}
      {/* LEADERSHIP TEAM                            */}
      {/* ════════════════════════════════════════ */}
      <Section fullWidth className="relative py-28 sm:py-36 bg-white overflow-hidden">
        <div className="absolute top-1/2 left-[-10%] w-[400px] h-[400px] bg-teal-400/[0.02] rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-5 sm:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <AnimationDiv initial="opacity-0 translate-y-6" visible="opacity-100 translate-y-0">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 text-[11px] sm:text-xs font-bold mb-5 tracking-widest uppercase">
                <SvgIcon name="group" className="size-3.5" />
                Leadership
              </div>
              <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold text-[#0b1120] leading-[1.1] tracking-[-0.02em]">
                Meet the team behind <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">Dottor Mail</span>.
              </h2>
              <p className="text-[#6b7280] text-base sm:text-lg mt-5 max-w-lg mx-auto leading-relaxed">
                A group of engineers, product builders, and email infrastructure experts on a mission to fix deliverability.
              </p>
            </AnimationDiv>
          </div>

          {/* Team grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {leadership.map((person, idx) => (
              <AnimationDiv key={idx} initial="opacity-0 translate-y-6" visible="opacity-100 translate-y-0" duration="duration-700" delay={`delay-${idx * 120}`}>
                <div className="h-full p-6 sm:p-7 bg-white rounded-3xl border border-[#e5e7eb]/80 hover:border-emerald-200/50 hover:shadow-xl hover:shadow-emerald-200/10 transition-all duration-500 group cursor-default flex flex-col">
                  {/* Avatar placeholder */}
                  <div className="size-16 sm:size-18 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-5 group-hover:from-emerald-200 group-hover:to-teal-200 transition-colors duration-300">
                    <span className="text-xl sm:text-2xl font-extrabold text-emerald-600">
                      {person.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#111827] mb-0.5 group-hover:text-emerald-700 transition-colors">{person.name}</h3>
                  <p className="text-xs font-semibold text-emerald-600 mb-3">{person.role}</p>
                  <p className="text-xs sm:text-sm text-[#6b7280] leading-relaxed flex-1">{person.bio}</p>
                </div>
              </AnimationDiv>
            ))}
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════ */}
      {/* WHY CHOOSE US — Comparison Grid           */}
      {/* ════════════════════════════════════════ */}
      <Section fullWidth className="relative py-28 sm:py-36 bg-[#f8fafc] overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-amber-400/[0.02] rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-5 sm:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <AnimationDiv initial="opacity-0 translate-y-6" visible="opacity-100 translate-y-0">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] sm:text-xs font-bold mb-5 tracking-widest uppercase">
                <SvgIcon name="star" className="size-3.5" filled />
                Why Choose Us
              </div>
              <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold text-[#0b1120] leading-[1.1] tracking-[-0.02em]">
                What makes us <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">different</span>.
              </h2>
              <p className="text-[#6b7280] text-base sm:text-lg mt-5 max-w-xl mx-auto leading-relaxed">
                We don&apos;t just verify emails — we optimize your entire deliverability strategy.
              </p>
            </AnimationDiv>
          </div>

          {/* Differentiators */}
          <div className="max-w-4xl mx-auto space-y-4">
            {[
              {
                title: "AI-Powered Detection",
                description: "Machine learning models that adapt to new spam patterns, trap domains, and abuse signatures in real time.",
                icon: "sensors",
              },
              {
                title: "Full-Stack Validation",
                description: "12+ layers from syntax to SMTP handshake. No other platform digs deeper into every email address.",
                icon: "network_node",
              },
              {
                title: "Enterprise-Grade Security",
                description: "AES-256 encryption, SOC 2 controls, GDPR compliance, and zero data retention after verification.",
                icon: "security",
              },
              {
                title: "Developer-First Platform",
                description: "RESTful API, webhooks, Zapier integration, and SDKs that make integration a matter of minutes, not days.",
                icon: "code",
              },
              {
                title: "Real-Time Analytics",
                description: "Detailed dashboards with bounce predictions, trend analysis, and actionable recommendations for your lists.",
                icon: "monitoring",
              },
              {
                title: "Dedicated Support",
                description: "24/7 engineering support with average response times under 5 minutes for priority customers.",
                icon: "support_agent",
              },
            ].map((item, idx) => (
              <AnimationDiv key={idx} initial="opacity-0 translate-y-4" visible="opacity-100 translate-y-0" duration="duration-600" delay={`delay-${idx * 80}`}>
                <div className="group flex items-start gap-5 p-5 sm:p-6 rounded-2xl bg-white border border-[#e5e7eb]/80 hover:border-emerald-200/50 hover:shadow-md hover:shadow-emerald-200/10 transition-all duration-300">
                  <div className="size-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                    <SvgIcon name={item.icon} className="size-5 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-[#111827] mb-1 group-hover:text-emerald-700 transition-colors">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-[#6b7280] leading-relaxed">{item.description}</p>
                  </div>
                  <div className="hidden sm:flex shrink-0 mt-1">
                    <SvgIcon name="arrow_right_alt" className="size-5 text-[#d1d5db] group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </AnimationDiv>
            ))}
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════ */}
      {/* FINAL CTA                                  */}
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
                style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "32px 32px" }}
              />

              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-[clamp(1.8rem,4.5vw,3.2rem)] font-extrabold text-white leading-[1.1] tracking-[-0.02em] mb-5">
                  Ready to transform your email deliverability?
                </h2>
                <p className="text-[#94a3b8] text-base sm:text-lg mb-10 max-w-md mx-auto leading-relaxed">
                  Join 10,000+ businesses that trust Dottor Mail. Start free — no credit card needed. No commitment required.
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

export default DottormailAboutV2;
