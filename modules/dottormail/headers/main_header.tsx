"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import SvgIcon from "@/modules/global/icons/svg_icons";
import RouterLink from "@/modules/global/elements/router_link";
import CurrencyDropdown from "@/modules/currency/components/CurrencyDropdown";
import LanguageDropdown from "@/modules/language/components/LanguageDropdown";
import DropdownAndTooltip from "@/modules/global/elements/dropdown_tooltip";

// ──────────────────────────────────────────────
// Navigation Data
// ──────────────────────────────────────────────

const navLinks = [
  { label: "Email Find", href: "/email-find" },
  { label: "About Us", href: "/about-us" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact Us", href: "/contact-us" },
];

// ──────────────────────────────────────────────
// Header Component
// ──────────────────────────────────────────────

const DottormailHeader = () => {
  const router = useRouter();
  const appAuth = 0;
  const appUserlogout = () => "";
  const appUserLoading = false;
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // ── Scroll listener ──
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Lock body scroll when mobile menu open ──
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // ── Close mobile menu on route change ──
  useEffect(() => {
    const onRouteChange = () => setMobileOpen(false);
    router.events.on("routeChangeStart", onRouteChange);
    return () => router.events.off("routeChangeStart", onRouteChange);
  }, [router.events]);

  // ── Close mobile menu ──
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // ── Logo block ──
  const logoBlock = (
    <Link href="/" className="flex items-center gap-2.5 group shrink-0" aria-label="Dottor Mail home">
      <div className="size-8 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center border border-emerald-500/15 group-hover:from-emerald-500/30 group-hover:to-teal-500/30 transition-all duration-300">
        <svg viewBox="0 0 24 24" className="size-[18px] text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="3" />
          <path d="M22 7l-10 6L2 7" />
        </svg>
      </div>
      <span className="text-base font-bold text-white tracking-tight">Dottor Mail</span>
    </Link>
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#080c16]/90 backdrop-blur-xl border-b border-white/[0.06] shadow-lg shadow-black/10"
          : "bg-[#080c16]/80 backdrop-blur-xl border-b border-white/[0.06] shadow-lg shadow-black/10"
      }`}
    >
      <div className="container mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* ── Logo ── */}
          {logoBlock}

          {/* ── Desktop Navigation ── */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => {
              const isActive = router.pathname === link.href;
              return (
                <RouterLink
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive ? "text-emerald-400 bg-emerald-500/10" : "text-[#94a3b8] hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  {link.label}
                </RouterLink>
              );
            })}
            <div className="flex border border-[#94a3b8] rounded-full divide-x divide-[#94a3b8]">
              <CurrencyDropdown
                className="flex items-center px-2 py-0.5 rounded-l-full text-[#94a3b8] hover:text-white hover:bg-white/[0.04] group cursor-pointer"
                iconClass="size-5 text-[#94a3b8] group-hover:text-white"
              />
              <LanguageDropdown
                className="flex items-center px-2 py-0.5 rounded-r-full text-[#94a3b8] hover:text-white hover:bg-white/[0.04] group cursor-pointer"
                iconClass="size-5 text-[#94a3b8] group-hover:text-white"
              />
            </div>
          </nav>

          {/* ── Desktop Auth ── */}
          <div className="hidden md:flex items-center gap-3">
            {appUserLoading ? (
              <div className="size-5 rounded-full border-2 border-emerald-400/30 border-t-emerald-400 animate-spin" />
            ) : appAuth ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#94a3b8] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] rounded-xl border border-white/[0.06] hover:border-white/[0.12] transition-all duration-200"
                >
                  <SvgIcon name="dashboard" className="size-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={appUserlogout}
                  className="p-2 text-[#64748b] hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200"
                  aria-label="Sign out"
                >
                  <SvgIcon name="logout" className="size-5" />
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 text-sm font-medium text-[#94a3b8] hover:text-white transition-colors duration-200">
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="relative inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 rounded-xl transition-all duration-300 active:scale-[0.97] shadow-lg shadow-emerald-500/20"
                >
                  <span>Get Started</span>
                  <SvgIcon name="arrow_right_alt" className="size-4" />
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile Hamburger ── */}
          <DropdownAndTooltip
            position="bottom"
            side="middle"
            width="w-60"
            button={
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden relative size-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#94a3b8] hover:text-white hover:bg-white/[0.08] transition-all duration-200"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
              >
                <span className="relative flex flex-col items-center justify-center gap-[5px] w-5 h-5">
                  <span className={`block h-px w-full bg-current rounded-full transition-all duration-300 ${mobileOpen ? "translate-y-[6px] rotate-45" : ""}`} />
                  <span className={`block h-px w-full bg-current rounded-full transition-all duration-300 ${mobileOpen ? "opacity-0 scale-0" : ""}`} />
                  <span className={`block h-px w-full bg-current rounded-full transition-all duration-300 ${mobileOpen ? "-translate-y-[6px] -rotate-45" : ""}`} />
                </span>
              </button>
            }
          >
            <div className="pt-2">
              <div className="space-y-12 bg-white rounded shadow-custom-6 overflow-hidden p-5">
                <nav className="flex flex-col gap-1.5" aria-label="Mobile navigation">
                  {navLinks.map((link, idx) => {
                    const isActive = router.pathname === link.href;
                    return (
                      <div key={link.href}>
                        <RouterLink
                          href={link.href}
                          className={`block px-5 py-2 text-base font-semibold transition-all duration-200 ${
                            isActive
                              ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/15"
                              : "text-blue-950 hover:text-white hover:bg-white/[0.04] border border-transparent"
                          }`}
                        >
                          {link.label}
                        </RouterLink>
                      </div>
                    );
                  })}
                </nav>

                {/* Auth buttons */}
                <div>
                  {appAuth ? (
                    <>
                      <Link
                        href="/dashboard"
                        onClick={closeMobile}
                        className="flex items-center justify-center gap-2.5 w-full px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl transition-all duration-300 active:scale-[0.97] shadow-lg shadow-emerald-500/20"
                      >
                        <SvgIcon name="dashboard" className="size-5" />
                        <span>Dashboard</span>
                      </Link>
                      <button
                        onClick={() => {
                          appUserlogout();
                          closeMobile();
                        }}
                        className="flex items-center justify-center gap-2 w-full px-6 py-3.5 text-sm font-medium text-[#94a3b8] hover:text-red-400 bg-white/[0.04] hover:bg-red-500/10 rounded-2xl border border-white/[0.06] transition-all duration-200"
                      >
                        <SvgIcon name="logout" className="size-5" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/register"
                        onClick={closeMobile}
                        className="flex items-center justify-center gap-2.5 w-full px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl transition-all duration-300 active:scale-[0.97] shadow-lg shadow-emerald-500/20"
                      >
                        <SvgIcon name="arrow_right_alt" className="size-5" />
                        <span>Get Started Free</span>
                      </Link>
                      <Link
                        href="/login"
                        onClick={closeMobile}
                        className="flex items-center justify-center gap-2 w-full px-6 py-3.5 text-sm font-medium text-[#94a3b8] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] rounded-2xl border border-white/[0.06] transition-all duration-200"
                      >
                        <span>Sign In</span>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </DropdownAndTooltip>
        </div>
      </div>

      {/* ════════════════════════════════════════ */}
      {/* MOBILE OVERLAY MENU                         */}
      {/* ════════════════════════════════════════ */}
    </header>
  );
};

export default DottormailHeader;
