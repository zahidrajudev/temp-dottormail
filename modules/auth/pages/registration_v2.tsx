import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Api from "@/lib/api";
import Input from "@/modules/global/input/input";
import SvgIcon from "@/modules/global/icons/svg_icons";
import { checkErrors } from "@/lib/helper";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import Button from "@/modules/global/elements/button";
import AnimationDiv from "@/modules/global/animations/animate_div";
import { toast } from "sonner";
import Link from "next/link";
import Section from "@/modules/global/elements/section";

function RegisterPageV2() {
  const { appAuth, appUser, appPermissions, appUserlogout, refreshAuthUser } = useAuthStore();

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timeOutId: NodeJS.Timeout;
    if (appAuth) {
      timeOutId = setTimeout(() => {
        let url = "/";
        if (appPermissions && appPermissions?.admin_das?.view === 1) {
          url = "/dashboard";
          router.push(url);
          return;
        }
        if (appPermissions && appPermissions?.client_das?.view === 1) {
          url = "/dashboard/v2";
          router.push(url);
          return;
        }
        if (appPermissions && appPermissions?.author_das?.view === 1) {
          url = "/dashboard/v3";
          router.push(url);
          return;
        }
        if (appPermissions && appPermissions?.affiliate_das?.view === 1) {
          url = "/dashboard/v4";
          router.push(url);
          return;
        }
        if (appPermissions && appPermissions?.team_das?.view === 1) {
          url = "/dashboard/v5";
          router.push(url);
          return;
        }
        router.push(url);
      }, 50);
    }
    return () => clearTimeout(timeOutId);
  }, [router.asPath, appAuth]);

  const [roleList, setRoleList] = useState<any>("");
  const [selectedRole, setSelectedRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_p, setConfirm_p] = useState("");

  interface Errors {
    [key: string]: string;
  }
  const [errors, setErrors] = useState<Errors | "">("");

  const csrf = () => Api.get("sanctum/csrf-cookie");

  const handleRegister = async () => {
    if (checkErrors({ name, email, password, confirm_p }, setErrors, true)) {
      return;
    }
    if (confirm_p && password) {
      if (password != confirm_p) {
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

  const getInitialData = async () => {
    setLoading(true);
    let url = "v1/home/gmn/login-page";
    await Api.get(url)
      .then((res: any) => {
        setLoading(false);
        const data = res.data.data;
        let finalData: any = [];
        Object.entries(data).forEach(([key, val]) => {
          finalData.push({ name: key, id: val });
        });
        setRoleList(finalData);
      })
      .catch((err: any) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getInitialData();
  }, []);

  const benefits = [
    { icon: "attach_money", title: "Save $8,000+", desc: "Monthly on tools" },
    { icon: "all_inclusive", title: "20+ Tools", desc: "All in one place" },
    { icon: "bolt", title: "Instant Access", desc: "Get started now" },
    { icon: "support_agent", title: "24/7 Support", desc: "Always here to help" },
  ];

  const features = [
    "Access to 20+ premium tools",
    "Unlimited usage & downloads",
    "Priority customer support",
    "Regular tool updates",
    "Secure & managed access",
    "Cancel anytime - no contracts",
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
        <title>Register - XToolVip</title>
        <meta name="description" content="Create your account and access 40+ premium tools" />
      </Head>

      <div className="relative min-h-screen flex overflow-hidden -mt-30 pt-45">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-fuchsia-950 via-violet-950 to-fuchsia-900"></div>

        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-fuchsia-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 rounded-full blur-3xl"></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>

        {/* Content Container */}
        <div className="relative z-10 w-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Visual Content (Mobile: Hidden, Desktop: Left) */}
            <div className="hidden lg:flex flex-col justify-center items-center text-center space-y-8">
              <AnimationDiv>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4">
                  <SvgIcon name="crown" filled className="w-5 h-5 text-fuchsia-300" />
                  <span className="text-sm font-medium text-violet-100">Join 10,000+ Happy Users</span>
                </div>
              </AnimationDiv>

              <AnimationDiv delay="delay-100">
                <h2 className="text-4xl xl:text-5xl font-black leading-tight text-white">
                  Start Your
                  <span className="block bg-linear-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Free Journey</span>
                </h2>
              </AnimationDiv>

              <AnimationDiv delay="delay-200">
                <p className="text-base text-violet-200/80 max-w-md mx-auto">
                  Create your account today and get instant access to premium tools that will transform your workflow.
                </p>
              </AnimationDiv>

              {/* Benefits Grid */}
              <AnimationDiv delay="delay-300">
                <div className="grid grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/15 transition-colors">
                      <div className="w-12 h-12 bg-linear-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center mb-3 mx-auto">
                        <SvgIcon name={benefit.icon} filled className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-sm font-semibold text-white">{benefit.title}</div>
                      <div className="text-xs text-violet-300/70">{benefit.desc}</div>
                    </div>
                  ))}
                </div>
              </AnimationDiv>

              {/* What You Get */}
              {/* <AnimationDiv delay="delay-400">
                <div className="space-y-4 pt-4">
                  <h3 className="text-xl font-bold text-white">What you'll get:</h3>
                  <div className="space-y-3">
                    {features.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-linear-to-br from-fuchsia-500 to-violet-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <SvgIcon name="check" filled className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm text-violet-100">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimationDiv> */}

              {/* Floating Elements */}
              <div className="absolute top-16 right-16 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 animate-float">
                <SvgIcon name="trending_up" filled className="w-8 h-8 text-fuchsia-300" />
              </div>
              <div className="absolute bottom-40 right-10 w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 animate-float delay-500">
                <SvgIcon name="all_inclusive" filled className="w-7 h-7 text-violet-300" />
              </div>
            </div>

            {/* Right Column - Registration Form */}
            <div className="flex items-center">
              <div className="w-full max-w-2xl mx-auto">
                {/* Logo/Brand */}
                <AnimationDiv className="text-center mb-8">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">Create Account</h1>
                  <p className="text-violet-200/80 mt-2 text-sm sm:text-base">Join thousands of satisfied users today</p>
                </AnimationDiv>

                {/* Registration Card - Glassmorphism */}
                <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 space-y-6">
                  {appAuth ? (
                    <div className="text-center space-y-6">
                      <div className="flex justify-center">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-linear-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                          <SvgIcon name="check" filled className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xl sm:text-2xl font-bold text-white">Account Ready!</h4>
                        <p className="text-violet-200/80 mt-1">Welcome, {appUser?.translate?.name || appUser?.name}</p>
                      </div>
                      <div className="text-sm text-violet-200/80">Redirecting to Dashboard...</div>
                      <button
                        onClick={() => appUserlogout()}
                        className="w-full bg-linear-to-r from-violet-600 to-fuchsia-600 text-white font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Progress Indicator */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-linear-to-br from-fuchsia-500 to-violet-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                            1
                          </div>
                          <span className="text-sm font-medium text-violet-100 hidden sm:inline">Account Info</span>
                        </div>
                        <div className="flex-1 mx-4 h-0.5 bg-gradient-to-r from-fuchsia-500/50 to-violet-500/50"></div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-violet-300/70 text-sm font-bold border border-white/20">
                            2
                          </div>
                          <span className="text-sm text-violet-300/70 hidden sm:inline">Verification</span>
                        </div>
                      </div>

                      <Input
                        type="text"
                        label="Full Name"
                        iconName="person"
                        value={name}
                        setValue={setName}
                        id="fullname"
                        placeholder="John Doe"
                        errorMessage={errors && errors.name ? errors.name : ""}
                        required
                        extraClass="bg-white/10 focus:bg-white/20 border-white/20 focus:border-fuchsia-400 text-white placeholder:text-violet-300/50"
                        labelClass="pb-2 text-violet-100 text-sm"
                        iconClass="size-5 text-gray-200"
                      />

                      <Input
                        type="email"
                        label="Email Address"
                        iconName="mail"
                        value={email}
                        setValue={setEmail}
                        id="email"
                        placeholder="name@email.com"
                        errorMessage={errors && errors.email ? errors.email : ""}
                        required
                        extraClass="bg-white/10 focus:bg-white/20 border-white/20 focus:border-fuchsia-400 text-white placeholder:text-violet-300/50"
                        labelClass="pb-2 text-violet-100 text-sm"
                        iconClass="size-5 text-gray-200"
                      />

                      <Input
                        type="password"
                        label="Password"
                        value={password}
                        setValue={setPassword}
                        id="password"
                        placeholder="Create a strong password"
                        errorMessage={errors && errors.password ? errors.password : ""}
                        required
                        extraClass="bg-white/10 focus:bg-white/20 border-white/20 focus:border-fuchsia-400 text-white placeholder:text-violet-300/50"
                        labelClass="pb-2 text-violet-100 text-sm"
                        iconClass="size-5 text-gray-200"
                      />

                      <Input
                        type="password"
                        label="Confirm Password"
                        value={confirm_p}
                        setValue={setConfirm_p}
                        id="password_p"
                        placeholder="Re-enter your password"
                        errorMessage={errors && errors.confirm_p ? errors.confirm_p : ""}
                        required
                        extraClass="bg-white/10 focus:bg-white/20 border-white/20 focus:border-fuchsia-400 text-white placeholder:text-violet-300/50"
                        labelClass="pb-2 text-violet-100 text-sm"
                        iconClass="size-5 text-gray-200"
                      />

                      {/* Password Requirements */}
                      <div className="hidden p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                        <div className="flex items-center gap-2 mb-2">
                          <SvgIcon name="info" className="w-4 h-4 text-fuchsia-300" />
                          <span className="text-xs font-semibold text-violet-100">Password must contain:</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-violet-200/80">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-400"></div>
                            <span>At least 8 characters</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-violet-400"></div>
                            <span>One uppercase letter</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-400"></div>
                            <span>One number</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-violet-400"></div>
                            <span>One special character</span>
                          </div>
                        </div>
                      </div>

                      {/* Terms Checkbox */}
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 mt-0.5 rounded border-violet-300 text-fuchsia-600 focus:ring-fuchsia-500 focus:ring-offset-0" />
                        <span className="text-sm text-violet-200/80">
                          I agree to the{" "}
                          <Link href="/terms" className="text-fuchsia-300 hover:text-fuchsia-200 font-medium">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" className="text-fuchsia-300 hover:text-fuchsia-200 font-medium">
                            Privacy Policy
                          </Link>
                        </span>
                      </label>

                      <Button
                        disabled={loading}
                        onClick={handleRegister}
                        border="rounded-full"
                        showIcon
                        px="px-8"
                        py="py-3.5"
                        className="flex items-center justify-between text-white w-full bg-linear-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <SvgIcon name="loading" className="w-5 h-5" />
                            Creating Account...
                          </span>
                        ) : (
                          "Create Account"
                        )}
                      </Button>

                      <div className="text-center pt-4 border-t border-white/20">
                        <p className="text-sm text-violet-200/80">
                          Already have an account?{" "}
                          <Link href="/login" className="font-semibold text-fuchsia-300 hover:text-fuchsia-200 transition-colors">
                            Sign in
                          </Link>
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Trust Indicators */}
                <AnimationDiv delay="delay-200" className="mt-6 text-center">
                  <div className="flex items-center justify-center gap-4 text-xs text-violet-300/70">
                    <div className="flex items-center gap-1.5">
                      <SvgIcon name="security" className="w-4 h-4 text-fuchsia-400" />
                      <span>Encrypted & Secure</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <SvgIcon name="no_adult_content" className="w-4 h-4 text-violet-400" />
                      <span>No Spam, Ever</span>
                    </div>
                  </div>
                </AnimationDiv>
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

      {/* Custom Animation Styles */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}

export default RegisterPageV2;
