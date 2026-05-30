import MainLayout from "@/layouts/MainLayout";
import SvgIcon from "@/modules/global/icons/svg_icons";
import AnimationDiv from "@/modules/global/animations/animate_div";
import { ReactElement, useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "sonner";
import Api from "@/lib/api";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { useLanguageStore } from "@/modules/language/store/useLanguageStore";
import { checkErrors } from "@/lib/helper";
import { sendGTMEvent } from "@next/third-parties/google";
import { getCookie, hasCookie } from "cookies-next";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

// ──────────────────────────────────────────────
// Inline Social SVGs (same set as login_v2)
// ──────────────────────────────────────────────

const GoogleIcon = ({ className = "size-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const GitHubIcon = ({ className = "size-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

// ──────────────────────────────────────────────
// Password strength calculator
// ──────────────────────────────────────────────

function getPasswordStrength(pw: string): { score: number; label: string; color: string; bg: string } {
  let score = 0;
  if (pw.length >= 6) score += 20;
  if (pw.length >= 10) score += 15;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 20;
  if (/\d/.test(pw)) score += 20;
  if (/[^a-zA-Z0-9]/.test(pw)) score += 25;

  if (score < 20) return { score, label: "Weak", color: "text-red-500", bg: "bg-red-500" };
  if (score < 45) return { score, label: "Fair", color: "text-orange-500", bg: "bg-orange-500" };
  if (score < 70) return { score, label: "Good", color: "text-amber-500", bg: "bg-amber-500" };
  return { score, label: "Strong", color: "text-emerald-500", bg: "bg-emerald-500" };
}

// ──────────────────────────────────────────────
// Register Page Component
// ──────────────────────────────────────────────

function DottormailRegisterV2() {
  const router = useRouter();
  const { appDefaultLocale } = useLanguageStore();
  const { appAuth, appUser, appPermissions, appUserlogout, refreshAuthUser, hasPermission } = useAuthStore();

  useEffect(() => {
    if (appAuth && router.isReady) {
      //router.push("/dashboard");
      const redirectUser = async () => {
        const rdtCheck = getCookie("rdt");
        if (rdtCheck && typeof rdtCheck === "string") {
          try {
            const rdt = JSON.parse(rdtCheck);
            if (rdt?.url) return router.push(rdt.url);
          } catch (e) {
            console.error("RDT Cookie Error", e);
          }
        }

        if (hasCookie("cart")) {
          router.push("/checkout");
        } else {
          if (hasPermission("dashboard.view")) {
            router.push("/dashboard");
          } else {
            router.push("/");
          }
        }
      };

      const timer = setTimeout(redirectUser, 500);
      return () => clearTimeout(timer);
    }
  }, [appAuth, appPermissions, router.isReady]);

  // ── Form state ──
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmP, setConfirmP] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const strength = getPasswordStrength(password);

  const csrf = () => Api.get("sanctum/csrf-cookie");

  const handleRegister = async () => {
    if (checkErrors({ name, email, password, confirmP }, setErrors, true)) {
      return;
    }
    if (confirmP && password) {
      if (password != confirmP) {
        setErrors({ password: "Both Passwords are not matched" });
        toast.error("Both Passwords are not matched");
        return;
      }
    }

    setLoading(true);
    await csrf();
    let data = { name, email, password };
    await Api.post("/v1/auth/register", data)
      .then(async (res) => {
        setLoading(false);
        toast.success("Welcome " + name);
        toast.success(res.data.message);
        await refreshAuthUser();
        router.push("/email-verify");
      })
      .catch((error) => {
        setErrors(error.response.data.errors);
        setLoading(false);
        toast.error(error.response.data.message);
      });
  };

  return (
    <>
      <Head>
        <title>Create Account — Dottor Mail | Start for Free</title>
        <meta name="description" content="Create your Dottor Mail account and start verifying emails for free. No credit card required. Join 10,000+ businesses." />
      </Head>

      {/* ════════════════════════════════════════ */}
      {/* SPLIT-SCREEN REGISTER                     */}
      {/* ════════════════════════════════════════ */}
      <div className="relative min-h-screen flex flex-col lg:flex-row bg-white">
        {/* ────────────────────────────────────── */}
        {/* LEFT: Brand Showcase                   */}
        {/* ────────────────────────────────────── */}
        <div className="relative flex-1 flex items-center min-h-[40vh] lg:min-h-screen bg-[#0b1120] overflow-hidden p-6 sm:p-10 lg:p-14 xl:p-18">
          {/* Background decorations */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-emerald-500/[0.04] rounded-full blur-[180px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-teal-500/[0.03] rounded-full blur-[150px]" />
            <div className="absolute top-1/3 left-1/3 w-[50%] h-[50%] bg-cyan-500/[0.02] rounded-full blur-[120px]" />
          </div>
          <div
            className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "48px 48px" }}
          />
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 z-20" />

          {/* ── Center: Hero content ── */}
          <div className="relative z-10 max-w-lg mx-auto lg:mx-0 my-auto py-16 lg:py-0 space-y-10">
            <AnimationDiv initial="opacity-0 translate-y-6" visible="opacity-100 translate-y-0" duration="duration-700">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 text-[10px] font-bold tracking-widest uppercase mb-6">
                <SvgIcon name="rocket_launch" className="size-3" />
                Start Free — No Credit Card
              </div>
            </AnimationDiv>

            <AnimationDiv initial="opacity-0 translate-y-7" visible="opacity-100 translate-y-0" duration="duration-700" delay="delay-100">
              <h1 className="text-[clamp(2rem,4.5vw,3.2rem)] font-extrabold text-white leading-[1.1] tracking-[-0.02em] mb-5">
                Start verifying emails in <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">minutes</span>, not
                days.
              </h1>
            </AnimationDiv>

            <AnimationDiv initial="opacity-0 translate-y-6" visible="opacity-100 translate-y-0" duration="duration-700" delay="delay-200">
              <p className="text-[#94a3b8] text-sm sm:text-base leading-relaxed max-w-sm mb-10">
                Join 10,000+ businesses that trust Dottor Mail for accurate email verification, better deliverability, and cleaner campaigns.
              </p>
            </AnimationDiv>

            {/* Feature perks */}
            <AnimationDiv initial="opacity-0" visible="opacity-100" duration="duration-700" delay="delay-300">
              <div className="space-y-4 max-w-sm">
                {[
                  { icon: "verified", text: "99.9% email verification accuracy" },
                  { icon: "speed", text: "Real-time results in under 200ms" },
                  { icon: "security", text: "AES-256 encrypted & GDPR compliant" },
                  { icon: "download", text: "Bulk verify up to 1M+ emails per hour" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="size-7 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <SvgIcon name={item.icon} className="size-3.5 text-emerald-400" filled />
                    </div>
                    <span className="text-[13px] text-[#cbd5e1]">{item.text}</span>
                  </div>
                ))}
              </div>
            </AnimationDiv>
            {/* ── Bottom: trust bar ── */}
            <AnimationDiv initial="opacity-0" visible="opacity-100" duration="duration-1000" delay="delay-500">
              <div className="relative z-10 border-t border-white/[0.06] pt-6">
                <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                  <span className="text-[10px] font-semibold text-[#475569] uppercase tracking-widest">Trusted by</span>
                  {["ScaleUp Inc.", "NexusMedia", "CloudCart", "FinFlow"].map((name, idx) => (
                    <span key={idx} className="text-sm font-bold text-[#475569] tracking-tight opacity-60">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </AnimationDiv>
          </div>
        </div>

        {/* ────────────────────────────────────── */}
        {/* RIGHT: Register Form                    */}
        {/* ────────────────────────────────────── */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-14 xl:p-18 bg-white min-h-[60vh] lg:min-h-screen">
          <div className="w-full max-w-md mx-auto">
            {/* ── Authenticated state ── */}
            {appAuth ? (
              <AnimationDiv initial="opacity-0 translate-y-4" visible="opacity-100 translate-y-0" duration="duration-700">
                <div className="text-center space-y-8">
                  <div className="space-y-3">
                    <div className="size-20 mx-auto rounded-full bg-emerald-50 flex items-center justify-center">
                      <SvgIcon name="check_circle" className="size-10 text-emerald-500" filled />
                    </div>
                    <h2 className="text-2xl font-extrabold text-[#0b1120]">Account created!</h2>
                    <p className="text-[#6b7280] text-sm">Welcome{appUser?.translate?.name ? `, ${appUser.translate.name}` : ""}</p>
                  </div>
                  <div className="space-y-3">
                    <div className="h-1.5 rounded-full bg-[#f1f5f9] overflow-hidden">
                      <div className="h-full w-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-pulse" />
                    </div>
                    <p className="text-xs text-[#9ca3af]">Redirecting to your dashboard...</p>
                  </div>
                  <button
                    onClick={appUserlogout}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#e5e7eb] text-sm font-semibold text-[#6b7280] hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all duration-200"
                  >
                    <SvgIcon name="logout" className="size-4" />
                    Sign Out
                  </button>
                </div>
              </AnimationDiv>
            ) : (
              /* ── Register form ── */
              <AnimationDiv initial="opacity-0 translate-y-4" visible="opacity-100 translate-y-0" duration="duration-700">
                <div className="space-y-7">
                  {/* Header */}
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b1120] tracking-[-0.02em]">Create your account</h2>
                    <p className="text-sm text-[#6b7280] mt-2">
                      Already have an account?{" "}
                      <Link href="/login" className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
                        Sign in
                      </Link>
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleRegister} className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label htmlFor="reg-name" className="block text-xs font-semibold text-[#4b5563] mb-1.5 tracking-wide uppercase">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                          <SvgIcon name="person" className="size-4 text-[#9ca3af]" />
                        </div>
                        <input
                          id="reg-name"
                          type="text"
                          autoComplete="name"
                          placeholder="John Doe"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (errors.name) setErrors((p) => ({ ...p, name: "" }));
                          }}
                          className={`w-full pl-11 pr-4 py-3 rounded-xl bg-[#f9fafb] text-sm text-[#111827] placeholder:text-[#9ca3af] border transition-all duration-200 focus:outline-none focus:ring-2 ${
                            errors.name
                              ? "border-red-300 focus:ring-red-500/20 focus:border-red-400"
                              : "border-[#e5e7eb] focus:ring-emerald-500/30 focus:border-emerald-400"
                          }`}
                        />
                      </div>
                      {errors.name && <p className="text-xs text-red-500 mt-1.5">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="reg-email" className="block text-xs font-semibold text-[#4b5563] mb-1.5 tracking-wide uppercase">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                          <SvgIcon name="mail" className="size-4 text-[#9ca3af]" />
                        </div>
                        <input
                          id="reg-email"
                          type="email"
                          autoComplete="email"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors((p) => ({ ...p, email: "" }));
                          }}
                          className={`w-full pl-11 pr-4 py-3 rounded-xl bg-[#f9fafb] text-sm text-[#111827] placeholder:text-[#9ca3af] border transition-all duration-200 focus:outline-none focus:ring-2 ${
                            errors.email
                              ? "border-red-300 focus:ring-red-500/20 focus:border-red-400"
                              : "border-[#e5e7eb] focus:ring-emerald-500/30 focus:border-emerald-400"
                          }`}
                        />
                      </div>
                      {errors.email && <p className="text-xs text-red-500 mt-1.5">{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div>
                      <label htmlFor="reg-password" className="block text-xs font-semibold text-[#4b5563] mb-1.5 tracking-wide uppercase">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                          <SvgIcon name="lock" className="size-4 text-[#9ca3af]" />
                        </div>
                        <input
                          id="reg-password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="Create a strong password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (errors.password) setErrors((p) => ({ ...p, password: "" }));
                          }}
                          className={`w-full pl-11 pr-11 py-3 rounded-xl bg-[#f9fafb] text-sm text-[#111827] placeholder:text-[#9ca3af] border transition-all duration-200 focus:outline-none focus:ring-2 ${
                            errors.password
                              ? "border-red-300 focus:ring-red-500/20 focus:border-red-400"
                              : "border-[#e5e7eb] focus:ring-emerald-500/30 focus:border-emerald-400"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#9ca3af] hover:text-[#6b7280] transition-colors"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          <SvgIcon name={showPassword ? "visibility" : "visibility_off"} className="size-4" />
                        </button>
                      </div>
                      {errors.password && <p className="text-xs text-red-500 mt-1.5">{errors.password}</p>}

                      {/* Password strength */}
                      {password.length > 0 && (
                        <div className="mt-3 space-y-1.5">
                          <div className="h-1 rounded-full bg-[#f1f5f9] overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-500 ${strength.bg}`} style={{ width: `${Math.min(strength.score, 100)}%` }} />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={`text-[11px] font-medium ${strength.color}`}>{strength.label}</span>
                            <span className="text-[10px] text-[#9ca3af]">
                              {password.length < 6 ? "Min 6 characters" : strength.score >= 70 ? "Great password!" : "Add uppercase, number, or symbol"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label htmlFor="reg-confirm" className="block text-xs font-semibold text-[#4b5563] mb-1.5 tracking-wide uppercase">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                          <SvgIcon name="lock" className="size-4 text-[#9ca3af]" />
                        </div>
                        <input
                          id="reg-confirm"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="Re-enter your password"
                          value={confirmP}
                          onChange={(e) => {
                            setConfirmP(e.target.value);
                            if (errors.confirmP) setErrors((p) => ({ ...p, confirmP: "" }));
                          }}
                          className={`w-full pl-11 pr-4 py-3 rounded-xl bg-[#f9fafb] text-sm text-[#111827] placeholder:text-[#9ca3af] border transition-all duration-200 focus:outline-none focus:ring-2 ${
                            errors.confirmP
                              ? "border-red-300 focus:ring-red-500/20 focus:border-red-400"
                              : "border-[#e5e7eb] focus:ring-emerald-500/30 focus:border-emerald-400"
                          }`}
                        />
                      </div>
                      {errors.confirmP && <p className="text-xs text-red-500 mt-1.5">{errors.confirmP}</p>}
                      {confirmP && password && confirmP === password && (
                        <p className="text-xs text-emerald-600 mt-1.5 flex items-center gap-1">
                          <SvgIcon name="check_circle" className="size-3" filled />
                          Passwords match
                        </p>
                      )}
                    </div>

                    {/* Terms */}
                    <div className="flex items-start gap-2.5 pt-1">
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={agreeTerms}
                        onClick={() => setAgreeTerms(!agreeTerms)}
                        className={`size-4 rounded border-2 flex items-center justify-center transition-all duration-200 shrink-0 mt-0.5 ${
                          agreeTerms ? "bg-emerald-500 border-emerald-500" : "border-[#d1d5db] hover:border-[#9ca3af]"
                        }`}
                      >
                        {agreeTerms && <SvgIcon name="check" className="size-3 text-white" />}
                      </button>
                      <label onClick={() => setAgreeTerms(!agreeTerms)} className="text-xs sm:text-sm text-[#6b7280] cursor-pointer select-none leading-relaxed">
                        I agree to the{" "}
                        <Link href="/terms" className="text-emerald-600 hover:text-emerald-700 font-semibold underline underline-offset-2">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-emerald-600 hover:text-emerald-700 font-semibold underline underline-offset-2">
                          Privacy Policy
                        </Link>
                        .
                      </label>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/20 transition-all duration-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        <>
                          Create Free Account
                          <SvgIcon name="arrow_right_alt" className="size-4" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="hidden relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#e5e7eb]" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-white px-4 text-[#9ca3af]">or sign up with</span>
                    </div>
                  </div>

                  {/* Social buttons */}
                  <div className="hidden grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border border-[#e5e7eb] bg-white hover:bg-[#fafafa] hover:border-[#d1d5db] transition-all duration-200 text-sm font-medium text-[#4b5563]"
                    >
                      <GoogleIcon />
                      <span className="hidden sm:inline">Google</span>
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border border-[#e5e7eb] bg-white hover:bg-[#fafafa] hover:border-[#d1d5db] transition-all duration-200 text-sm font-medium text-[#4b5563]"
                    >
                      <GitHubIcon />
                      <span className="hidden sm:inline">GitHub</span>
                    </button>
                  </div>

                  {/* 14-day trial note */}
                  <div className="flex items-center justify-center gap-2 text-[11px] text-[#9ca3af]">
                    <SvgIcon name="credit_card" className="size-3" />
                    No credit card required &bull; Cancel anytime
                  </div>
                </div>
              </AnimationDiv>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ──────────────────────────────────────────────
// Layout
// ──────────────────────────────────────────────

export default DottormailRegisterV2;
