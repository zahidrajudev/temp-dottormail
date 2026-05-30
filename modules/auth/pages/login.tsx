import { ReactElement, useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { toast } from "sonner";
import { getCookie } from "cookies-next";

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

function LoginPage() {
  const router = useRouter();

  // 1. Get Auth State & Actions from Zustand
  const { appAuth, appUser, hasPermission, refreshAuthUser, appUserLoading, appPermissions } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any>("");

  useEffect(() => {
    if (appAuth && router.isReady) {
      router.push("/dashboard");
      const redirectUser = () => {
        // A. Check for "Redirect To" cookie (rdt)
        const rdtCheck = getCookie("rdt");
        if (rdtCheck && typeof rdtCheck === "string") {
          try {
            const rdt = JSON.parse(rdtCheck);
            if (rdt?.url) return router.push(rdt.url);
          } catch (e) {
            console.error("RDT Cookie Error", e);
          }
        }

        // B. Role-Based Redirection
        const permissions = appPermissions || {};
        const routes: { [key: string]: string } = {
          admin_das: "/dashboard",
          client_das: "/dashboard/v2",
          author_das: "/dashboard/v3",
          affiliate_das: "/dashboard/v4",
          team_das: "/dashboard/v5",
        };

        // Find the first permission that has 'view === 1'
        const matchedRoute = Object.keys(routes).find((key) => permissions[key]?.view === 1);

        router.push(matchedRoute ? routes[matchedRoute] : "/");
      };

      const timer = setTimeout(redirectUser, 500); // Small delay to ensure state hydration
      return () => clearTimeout(timer);
    }
  }, [appAuth, appPermissions, router.isReady]);

  // 3. Login Logic
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
      // CSRF for Sanctum
      await Api.get("sanctum/csrf-cookie");

      const res = await Api.post("/v1/auth/login", { email, username: email, password });

      toast.success(res.data.message || "Logged in successfully");

      // Update Zustand Store (This triggers the useEffect above)
      await refreshAuthUser();
    } catch (error: any) {
      const apiErrors = error?.response?.data?.errors;
      const message = error?.response?.data?.message || "Login failed";

      setErrors(apiErrors || "");
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const whyUs = [
    {
      icon: "attach_money",
      name: "Save $8,000+ Monthly",
      description: "Get access to 40+ premium tools for a fraction of their combined cost. One subscription replaces dozens of expensive individual tools.",
    },
    {
      icon: "all_inclusive",
      name: "All-In-One Access",
      description: "Everything you need in one dashboard — no juggling multiple subscriptions, logins, or payment methods.",
    },
    {
      icon: "bolt",
      name: "Instant Activation",
      description: "Get immediate access after subscribing. No waiting, no complicated setup process.",
    },
    {
      icon: "security",
      name: "Secure & Managed System",
      description: "We maintain secure access environments and monitor tool stability to ensure smooth performance.",
    },
    {
      icon: "sync",
      name: "Regular Tool Updates",
      description: "We continuously update and maintain access to ensure tools remain functional and reliable.",
    },
    {
      icon: "support_agent",
      name: "Dedicated Support",
      description: "Our support team is ready to assist you whenever you face issues or need guidance.",
    },
    {
      icon: "trending_up",
      name: "Scale Faster",
      description: "Access premium resources that help you grow your business, improve marketing, and boost productivity.",
    },
    {
      icon: "groups",
      name: "Perfect for Teams",
      description: "Ideal for freelancers, agencies, startups, and small teams looking to reduce software expenses.",
    },
    {
      icon: "crown",
      name: "Premium Tools Only",
      description: "We carefully select high-demand, industry-leading tools to maximize your value.",
    },
    {
      icon: "public",
      name: "Global Accessibility",
      description: "Access your tools from anywhere in the world with a stable internet connection.",
    },
    {
      icon: "bar_chart",
      name: "Boost ROI",
      description: "Spend less on software and reinvest savings into marketing, growth, and business expansion.",
    },
    {
      icon: "cancel",
      name: "Cancel Anytime",
      description: "No long-term contracts. Upgrade, downgrade, or cancel whenever you want.",
    },
  ];

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Banner>
        <h1 className="text-center text-white font-black text-2xl sm:text-5xl lg:text-7xl pt-10">{appAuth ? "Welcome Back" : "Login Your Account"}</h1>
      </Banner>
      <Section className="-mt-30 md:-mt-60 lg:-mt-90 px-4 pt-10 pb-10 md:pt-40 relative z-5" fullWidth={true}>
        <div className="flex justify-center items-center w-full">
          <Section
            loading={appUserLoading}
            outerClassName="w-full max-w-lg "
            className="rounded-xl p-8 space-y-8 bg-linear-to-l from-fuchsia-100 to-violet-100 shadow-2xl"
          >
            <div className="text-center">{appAuth && appUser && <h4 className="my-3 text-5xl font-medium text-gray-600">Login Success</h4>}</div>
            <div className="text-center">{appAuth && appUser && <h4 className="my-3 text-xl font-medium text-gray-600">Welcome {appUser?.name || ""}</h4>}</div>
            {appAuth ? (
              <div className="space-y-12">
                <div className="flex justify-center">
                  <div className="bg-green-50 p-6 rounded-full">
                    <Loading show style={2} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
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
                />
                <Input
                  type="password"
                  label="Password"
                  value={password}
                  setValue={setPassword}
                  id="password"
                  placeholder="********"
                  required
                  errorMessage={errors?.password}
                />

                <div className="flex justify-center pt-4">
                  <Button disabled={loading} onClick={handleLogin} border="rounded-full" showIcon px="px-6" py="py-3">
                    Login
                  </Button>
                </div>

                <div className="space-y-3 pt-6 border-t border-gray-100">
                  <div className="flex justify-center">
                    <Link href="/register" className="text-sm text-gray-500 hover:text-blue-900 transition-colors">
                      Don't have an account yet? <span className="font-bold text-blue-900">Register</span>
                    </Link>
                  </div>
                  <div className="flex justify-center">
                    <Link href="/password-reset" className="text-sm text-gray-400 hover:text-red-500 transition-colors">
                      Forgot Password?
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </Section>
        </div>
      </Section>

      <Section fullWidth className="py-10 lg:py-30 px-6">
        <Section className="space-y-8">
          <div className="flex justify-center">
            <AnimationDiv className="px-4 py-1.5 bg-violet-800/5 text-black border border-gray-200 font-semibold rounded-full">why us?</AnimationDiv>
          </div>
          <AnimationDiv className="text-center font-black text-2xl xs:text-3xl md:text-6xl text-black">Why Choose XToolVip?</AnimationDiv>
          <AnimationDiv delay="delay-500" className="text-center text-gray-500">
            Everything you need to dominate e-commerce, all in one powerful platform
          </AnimationDiv>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {whyUs.map((item, index) => (
              <div key={index} className="p-8 rounded-lg bg-violet-50 shadow-custom-5 space-y-5 hover:shadow-custom-6">
                <AnimationDiv className="flex justify-center">
                  <SvgIcon name={item?.icon} className="size-16 text-violet-500 p-4 bg-white rounded-full border border-fuchsia-500" />
                </AnimationDiv>
                <AnimationDiv className="text-xl font-semibold text-violet-800 text-center">{item?.name}</AnimationDiv>
                <AnimationDiv className="text-gray-500 text-center">{item?.description}</AnimationDiv>
              </div>
            ))}
          </div>
        </Section>
      </Section>
    </>
  );
}

export default LoginPage;
