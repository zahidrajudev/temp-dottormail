import { ReactElement, useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { toast } from "sonner";
import { getCookie, hasCookie } from "cookies-next";

// Standardized Imports
import MainLayout from "@/layouts/MainLayout";
import Api from "@/lib/api";
import Section from "@/modules/global/elements/section";
import LoaderProgress from "@/modules/global/elements/progress";
import Input from "@/modules/global/input/input";
import SvgIcon from "@/modules/global/icons/svg_icons";

// New Zustand Store
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import Banner from "@/modules/global/widget/banner";
import Button from "@/modules/global/elements/button";
import Loading from "@/modules/global/elements/loading";
import AnimationDiv from "@/modules/global/animations/animate_div";

function LoginPageV2() {
  const router = useRouter();

  // 1. Get Auth State & Actions from Zustand
  const { appAuth, appUser, hasPermission, refreshAuthUser, appUserLoading, appPermissions } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any>("");
  const [message, setMessage] = useState("");

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

  const handleLogin = async () => {
    setErrors("");

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return setErrors({
        email: !email ? "Email is Required" : "",
        password: !password ? "Password is Required" : "",
      });
    }

    setLoading(true);
    try {
      await Api.get("sanctum/csrf-cookie");
      await Api.post("/v1/auth/login", { email, username: email, password })
        .then(async (res) => {
          if (res.data?.is_verified) {
            toast.success(res.data.message || "Logged in successfully");
            await refreshAuthUser();
          } else {
            router.push("/email-verify");
          }
        })
        .catch((err) => {});
    } catch (error: any) {
      setMessage("Re-Chek your email and password. Login failed.");
      const apiErrors = error?.response?.data?.errors;
      const message = error?.response?.data?.message || "Login failed";
      setErrors(apiErrors || "");
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: "security", text: "Secure Login" },
    { icon: "bolt", text: "Instant Access" },
    { icon: "support_agent", text: "24/7 Support" },
  ];

  const stats = [
    { value: "20+", label: "Premium Tools" },
    { value: "$8K+", label: "Monthly Savings" },
    { value: "10K+", label: "Happy Users" },
  ];

  const whyUs = [
    {
      icon: "attach_money",
      name: "Save $8,000+ Monthly",
      description: "Get 40+ premium tools for a fraction of the cost",
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-500/10 to-teal-500/10",
    },
    {
      icon: "all_inclusive",
      name: "All-In-One Access",
      description: "Everything in one dashboard, no juggling",
      gradient: "from-violet-500 to-fuchsia-600",
      bgGradient: "from-violet-500/10 to-fuchsia-500/10",
    },
    {
      icon: "bolt",
      name: "Instant Activation",
      description: "Get immediate access, no waiting",
      gradient: "from-amber-500 to-orange-600",
      bgGradient: "from-amber-500/10 to-orange-500/10",
    },
    {
      icon: "security",
      name: "Secure & Managed",
      description: "99% uptime with enterprise security",
      gradient: "from-blue-500 to-cyan-600",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
    },
    {
      icon: "sync",
      name: "Regular Updates",
      description: "Always fresh, always functional",
      gradient: "from-pink-500 to-rose-600",
      bgGradient: "from-pink-500/10 to-rose-500/10",
    },
    {
      icon: "support_agent",
      name: "24/7 Support",
      description: "Expert help whenever you need",
      gradient: "from-purple-500 to-violet-600",
      bgGradient: "from-purple-500/10 to-violet-500/10",
    },
    {
      icon: "trending_up",
      name: "Scale Faster",
      description: "Premium resources for growth",
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-500/10 to-emerald-500/10",
    },
    {
      icon: "groups",
      name: "Team Ready",
      description: "Perfect for agencies & startups",
      gradient: "from-indigo-500 to-blue-600",
      bgGradient: "from-indigo-500/10 to-blue-500/10",
    },
  ];

  return (
    <>
      <Head>
        <title>Login - XToolVip</title>
        <meta name="description" content="Login to access 40+ premium tools" />
      </Head>

      {/* Main Container */}
      <div className="relative min-h-screen flex overflow-hidden -mt-30 pt-40">
        {/* Background Gradient Mesh */}
        <div className="absolute inset-0 bg-linear-to-br from-violet-950 via-fuchsia-950 to-violet-900"></div>

        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-fuchsia-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-fuchsia-600/20 to-violet-600/20 rounded-full blur-3xl"></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>

        {/* Content Container */}
        <div className="relative z-10 w-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Login Form Card */}
            <div className="flex items-center">
              <div className="w-full">
                {/* Logo/Brand Section */}
                <AnimationDiv className="text-center mb-8">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">Welcome Back</h1>
                  <p className="text-violet-200/80 mt-2 text-sm sm:text-base">Sign in to continue</p>
                </AnimationDiv>

                {/* Login Card - Glassmorphism */}
                <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 space-y-6">
                  {appAuth && appUser ? (
                    <div className="text-center space-y-6">
                      <div className="flex justify-center">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-linear-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                          <SvgIcon name="check" filled className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xl sm:text-2xl font-bold text-white">Login Successful!</h4>
                        <p className="text-violet-200/80 mt-1">Welcome back, {appUser?.name || "User"}</p>
                      </div>
                      <div className="flex justify-center">
                        <Loading show style={2} />
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Feature Badges */}
                      <div className="flex justify-center gap-2 sm:gap-3 mb-6 flex-wrap">
                        {features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                            <SvgIcon name={feature.icon} className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-fuchsia-300" />
                            <span className="text-xs font-medium text-violet-100">{feature.text}</span>
                          </div>
                        ))}
                      </div>
                      {message && <div className="text-center text-red-500 bg-red-100 p-2 rounded">{message}</div>}

                      <Input
                        type="email"
                        label="Email Address"
                        iconName="mail"
                        value={email}
                        setValue={setEmail}
                        id="email"
                        placeholder="name@email.com"
                        errorMessage={errors?.email}
                        required
                        extraClass="bg-white/10 focus:bg-white/20 border-white/20 focus:border-fuchsia-400 text-white placeholder:text-violet-300/50"
                        labelClass="pb-2 text-violet-100 text-sm"
                      />

                      <Input
                        type="password"
                        label="Password"
                        value={password}
                        setValue={setPassword}
                        id="password"
                        placeholder="Enter your password"
                        errorMessage={errors?.password}
                        required
                        extraClass="bg-white/10 focus:bg-white/20 border-white/20 focus:border-fuchsia-400 text-white placeholder:text-violet-300/50"
                        labelClass="pb-2 text-violet-100 text-sm"
                      />

                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 rounded border-violet-300 text-fuchsia-600 focus:ring-fuchsia-500 focus:ring-offset-0" />
                          <span className="text-sm text-violet-200/80">Remember me</span>
                        </label>
                        <Link href="/password-reset" className="text-sm font-medium text-fuchsia-300 hover:text-fuchsia-200 transition-colors">
                          Forgot password?
                        </Link>
                      </div>

                      <Button
                        disabled={loading}
                        onClick={handleLogin}
                        border="rounded-full"
                        showIcon
                        px="px-8"
                        py="py-3.5"
                        className="flex items-center justify-between w-full bg-linear-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white"
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <SvgIcon name="loading" loading className="size-5" />
                            Signing in...
                          </div>
                        ) : (
                          "Sign In"
                        )}
                      </Button>

                      <div className="text-center pt-4 border-t border-white/20">
                        <p className="text-sm text-violet-200/80">
                          Don't have an account?{" "}
                          <Link href="/register" className="font-semibold text-fuchsia-300 hover:text-fuchsia-200 transition-colors">
                            Create account
                          </Link>
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Trust Badges */}
                <AnimationDiv delay="delay-200" className="mt-6 text-center">
                  <div className="flex items-center justify-center gap-4 text-xs text-violet-300/70">
                    <div className="flex items-center gap-1.5">
                      <SvgIcon name="security" className="w-4 h-4 text-fuchsia-400" />
                      <span>SSL Encrypted</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <SvgIcon name="check_circle" className="w-4 h-4 text-violet-400" />
                      <span>Verified Secure</span>
                    </div>
                  </div>
                </AnimationDiv>
              </div>
            </div>

            {/* Right Column - Visual Content */}
            <div className="hidden lg:flex flex-col justify-center items-center text-center space-y-8">
              <AnimationDiv>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
                  <SvgIcon name="crown" filled className="w-5 h-5 text-fuchsia-300" />
                  <span className="text-sm font-medium text-violet-100">Premium Tool Access</span>
                </div>
              </AnimationDiv>

              <AnimationDiv delay="delay-100">
                <h2 className="text-4xl xl:text-5xl font-black leading-tight text-white">
                  Unlock Your
                  <span className="block bg-linear-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent">Full Potential</span>
                </h2>
              </AnimationDiv>

              <AnimationDiv delay="delay-200">
                <p className="text-base text-violet-200/80 max-w-md mx-auto">
                  Access 20+ premium tools in one powerful dashboard. Save time, reduce costs, and scale your business faster.
                </p>
              </AnimationDiv>

              {/* Stats */}
              <AnimationDiv delay="delay-300">
                <div className="grid grid-cols-3 gap-6 pt-8">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                      <div className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent">{stat.value}</div>
                      <div className="text-xs sm:text-sm text-violet-300/70 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </AnimationDiv>

              {/* Floating Icons */}
              <div className="absolute top-20 right-20 w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 animate-bounce">
                <SvgIcon name="bolt" filled className="w-7 h-7 text-fuchsia-300" />
              </div>
              <div className="absolute bottom-32 left-20 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 animate-bounce delay-500">
                <SvgIcon name="security" filled className="w-6 h-6 text-violet-300" />
              </div>
              <div className="absolute top-1/3 right-10 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20 animate-bounce delay-700">
                <SvgIcon name="trending_up" filled className="w-5 h-5 text-fuchsia-300" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Section fullWidth className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-16">
            <AnimationDiv>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-fuchsia-100 rounded-full">
                <SvgIcon name="favorite" className="w-5 h-5 text-fuchsia-600" />
                <span className="text-sm font-bold text-fuchsia-700 uppercase tracking-wider">Why Choose Us</span>
              </div>
            </AnimationDiv>
            <AnimationDiv delay="delay-100">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-800">
                Why Thousands Choose
                <span className="block bg-linear-to-r from-fuchsia-600 to-violet-600 bg-clip-text text-transparent"> XToolVip</span>
              </h2>
            </AnimationDiv>
            <AnimationDiv delay="delay-200">
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">Everything you need to dominate your industry, all in one powerful platform</p>
            </AnimationDiv>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((item, index) => (
              <AnimationDiv key={index} delay={`delay-${index * 75}`}>
                <div className="group relative bg-white rounded-3xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 h-full overflow-hidden">
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-linear-to-br ${item.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                  {/* Content */}
                  <div className="relative z-10 text-center">
                    <div
                      className={`w-20 h-20 mx-auto mb-4 bg-linear-to-br ${item.gradient} rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                    >
                      <SvgIcon name={item.icon} filled className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-gray-900 transition-colors">{item.name}</h3>
                    <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">{item.description}</p>
                  </div>
                </div>
              </AnimationDiv>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}

export default LoginPageV2;
