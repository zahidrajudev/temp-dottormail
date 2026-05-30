"use client";

import Section from "@/modules/global/elements/section";
import SvgIcon from "@/modules/global/icons/svg_icons";
import AnimationDiv from "@/modules/global/animations/animate_div";
import RouterLink from "@/modules/global/elements/router_link";
import { dateTimeFormat } from "@/lib/helper";

// ──────────────────────────────────────────────
// Inline Social SVG Icons (not in SvgIcon set)
// ──────────────────────────────────────────────

const SocialX = ({ className = "size-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const SocialLinkedIn = ({ className = "size-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const SocialGitHub = ({ className = "size-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

// ──────────────────────────────────────────────
// Link data
// ──────────────────────────────────────────────

const productLinks = [
  { label: "Email Verification", href: "/" },
  { label: "Bulk Checker", href: "/bulk" },
  { label: "API Integration", href: "/api" },
  { label: "Pricing", href: "/pricing" },
  { label: "Integrations", href: "/integrations" },
];

const resourceLinks = [
  { label: "Documentation", href: "/docs" },
  { label: "Help Center", href: "/help" },
  { label: "Blog", href: "/blog" },
  { label: "API Status", href: "/status" },
  { label: "Changelog", href: "/changelog" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "GDPR", href: "/gdpr" },
];

const socialLinks = [
  { label: "X / Twitter", icon: SocialX, href: "#" },
  { label: "LinkedIn", icon: SocialLinkedIn, href: "#" },
  { label: "GitHub", icon: SocialGitHub, href: "#" },
];

// ──────────────────────────────────────────────
// Footer Component
// ──────────────────────────────────────────────

const DottormailFooter = () => {
  const year = dateTimeFormat(new Date(), "year");

  return (
    <Section fullWidth className="relative overflow-hidden bg-[#080c16]">
      {/* ── Top decorative gradient bar ── */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
      <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-teal-400/20 to-transparent blur-sm" />

      {/* ── Background mesh ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[10%] w-[400px] h-[400px] bg-emerald-500/[0.02] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[10%] w-[500px] h-[500px] bg-teal-500/[0.02] rounded-full blur-[150px]" />
      </div>

      {/* ── Grid dots overlay ── */}
      <div
        className="absolute inset-0 opacity-[0.012] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "40px 40px" }}
      />

      <div className="relative z-10 container mx-auto px-5 sm:px-8 pt-20 sm:pt-28 pb-8">

        {/* ═══ Main Grid ═══ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* ── Col 1: Brand + Social ── (span 4) ── */}
          <AnimationDiv initial="opacity-0 translate-y-6" visible="opacity-100 translate-y-0" duration="duration-700" className="sm:col-span-2 lg:col-span-4">
            <div className="space-y-6 max-w-xs">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-gradient-to-br from-emerald-500/15 to-teal-500/15 flex items-center justify-center border border-emerald-500/10">
                  <svg viewBox="0 0 24 24" className="size-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="3" />
                    <path d="M22 7l-10 6L2 7" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-white tracking-tight">Dottor Mail</span>
              </div>

              {/* Description */}
              <p className="text-sm text-[#64748b] leading-relaxed">
                AI-powered email verification platform trusted by thousands of businesses worldwide. Reduce bounces, protect sender reputation, and deliver every message with confidence.
              </p>

              {/* Social links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    aria-label={social.label}
                    className="size-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[#64748b] hover:bg-emerald-500/10 hover:border-emerald-500/20 hover:text-emerald-400 transition-all duration-300 group"
                  >
                    <social.icon className="size-4 group-hover:scale-110 transition-transform" />
                  </a>
                ))}
              </div>
            </div>
          </AnimationDiv>

          {/* ── Col 2: Product ── (span 2) ── */}
          <AnimationDiv initial="opacity-0 translate-y-6" visible="opacity-100 translate-y-0" duration="duration-700" delay="delay-100" className="sm:col-span-1 lg:col-span-2">
            <div className="space-y-5">
              <h3 className="text-xs font-bold text-white tracking-[0.15em] uppercase">Product</h3>
              <ul className="space-y-3.5">
                {productLinks.map((link, idx) => (
                  <li key={idx}>
                    <RouterLink href={link.href} className="text-sm text-[#64748b] hover:text-emerald-400 transition-colors duration-200">
                      {link.label}
                    </RouterLink>
                  </li>
                ))}
              </ul>
            </div>
          </AnimationDiv>

          {/* ── Col 3: Resources ── (span 2) ── */}
          <AnimationDiv initial="opacity-0 translate-y-6" visible="opacity-100 translate-y-0" duration="duration-700" delay="delay-200" className="sm:col-span-1 lg:col-span-2">
            <div className="space-y-5">
              <h3 className="text-xs font-bold text-white tracking-[0.15em] uppercase">Resources</h3>
              <ul className="space-y-3.5">
                {resourceLinks.map((link, idx) => (
                  <li key={idx}>
                    <RouterLink href={link.href} className="text-sm text-[#64748b] hover:text-emerald-400 transition-colors duration-200">
                      {link.label}
                    </RouterLink>
                  </li>
                ))}
              </ul>

              {/* Legal */}
              <h3 className="text-xs font-bold text-white tracking-[0.15em] uppercase pt-6">Legal</h3>
              <ul className="space-y-3.5">
                {legalLinks.map((link, idx) => (
                  <li key={idx}>
                    <RouterLink href={link.href} className="text-sm text-[#64748b] hover:text-emerald-400 transition-colors duration-200">
                      {link.label}
                    </RouterLink>
                  </li>
                ))}
              </ul>
            </div>
          </AnimationDiv>

          {/* ── Col 4: Contact + Newsletter ── (span 4) ── */}
          <AnimationDiv initial="opacity-0 translate-y-6" visible="opacity-100 translate-y-0" duration="duration-700" delay="delay-300" className="sm:col-span-2 lg:col-span-4">
            <div className="space-y-7">
              {/* Contact */}
              <div>
                <h3 className="text-xs font-bold text-white tracking-[0.15em] uppercase mb-5">Get in Touch</h3>
                <div className="space-y-4">
                  <a href="mailto:support@dottormail.com" className="flex items-center gap-3 group">
                    <div className="size-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all duration-300">
                      <SvgIcon name="mail" className="size-4 text-[#64748b] group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <span className="text-sm text-[#64748b] group-hover:text-emerald-400 transition-colors">support@dottormail.com</span>
                  </a>
                  <a href="tel:+18885551234" className="flex items-center gap-3 group">
                    <div className="size-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all duration-300">
                      <SvgIcon name="call" className="size-4 text-[#64748b] group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <span className="text-sm text-[#64748b] group-hover:text-emerald-400 transition-colors">+1 (888) 555-1234</span>
                  </a>
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                      <SvgIcon name="support_agent" className="size-4 text-[#64748b]" />
                    </div>
                    <span className="text-sm text-[#64748b]">24/7 Priority Support</span>
                  </div>
                </div>
              </div>

              {/* Newsletter */}
              <div>
                <h3 className="text-xs font-bold text-white tracking-[0.15em] uppercase mb-4">Stay Updated</h3>
                <p className="text-sm text-[#64748b] mb-4 leading-relaxed">Get the latest tips on email deliverability and product updates.</p>
                <div className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-[#475569] focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500/30 transition-all"
                  />
                  <button className="size-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 flex items-center justify-center transition-all duration-300 active:scale-[0.95] shadow-lg shadow-emerald-500/20">
                    <SvgIcon name="arrow_right_alt" className="size-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </AnimationDiv>
        </div>

        {/* ═══ Bottom Divider ═══ */}
        <div className="mt-16 sm:mt-20 mb-8 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        {/* ═══ Bottom Bar ═══ */}
        <AnimationDiv initial="opacity-0" visible="opacity-100" duration="duration-700" delay="delay-500">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            {/* Copyright */}
            <p className="text-xs sm:text-sm text-[#475569] text-center sm:text-left">
              &copy; {year} Dottor Mail. All rights reserved.
            </p>

            {/* Payment methods */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-[#475569] font-medium tracking-wide uppercase">Accepted Payments</span>
              <div className="flex items-center gap-2">
                {[
                  { label: "Visa", icon: "credit_card" },
                  { label: "Mastercard", icon: "credit_card" },
                  { label: "PayPal", icon: "account_balance" },
                  { label: "Stripe", icon: "currency_exchange" },
                ].map((method, idx) => (
                  <div
                    key={idx}
                    title={method.label}
                    className="size-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[#475569] hover:bg-white/[0.08] hover:text-emerald-400 transition-all duration-200"
                  >
                    <SvgIcon name={method.icon} className="size-4" />
                  </div>
                ))}
              </div>
            </div>

            {/* Back to top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-1.5 text-xs text-[#475569] hover:text-emerald-400 transition-colors duration-200 group"
            >
              <span>Back to top</span>
              <SvgIcon name="arrow_right_alt" className="size-4 -rotate-90 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </AnimationDiv>
      </div>
    </Section>
  );
};

export default DottormailFooter;