import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Api from "@/lib/api";
import Section from "@/modules/global/elements/section";
import Input from "@/modules/global/input/input";
import SvgIcon from "@/modules/global/icons/svg_icons";
import { checkErrors } from "@/lib/helper";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import Banner from "@/modules/global/widget/banner";
import Button from "@/modules/global/elements/button";
import AnimationDiv from "@/modules/global/animations/animate_div";
import { toast } from "sonner";

function RegisterPage() {
  const { appAuth, appUser, appPermissions, appUserlogout } = useAuthStore();

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
  //states
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

  //CSRF
  const csrf = () => Api.get("sanctum/csrf-cookie");

  //Registration Submit
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
      .then((res) => {
        setLoading(false);
        toast.success("Welcome " + name);
        toast.success(res.data.message);
        router.push("/login");
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
        //console.log(finalData);
        setRoleList(finalData);
      })
      .catch((err: any) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getInitialData();
  }, []);

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
        <title>Registration</title>
      </Head>
      <Banner>
        <h1 className="text-center text-white font-black text-2xl sm:text-5xl lg:text-7xl pt-10">Register Your Account</h1>
      </Banner>

      <Section loading={loading} className="-mt-30 md:-mt-60 lg:-mt-90 px-4 pt-10 pb-10 md:pt-40 relative z-5" fullWidth={true}>
        <div className="flex justify-center items-center w-full">
          <div className="w-full max-w-lg rounded-xl p-5 space-y-8 bg-linear-to-l from-fuchsia-100 to-violet-100 shadow-2xl">
            <div className="text-center">
              <h1 className={`text-4xl font-bold`}>{appAuth ? "Authenticated" : ""}</h1>
              {appAuth && <h4 className={` my-3 text-xl font-bold`}>Welcome {appUser?.translate?.name}</h4>}
            </div>
            {appAuth ? (
              <div className="space-y-12">
                <div className="flex justify-center">
                  <SvgIcon name="check" className="size-24 text-green-600 rounded-full bg-blue-100" />
                </div>
                <div className="">
                  <div className="mb-2 text-center  font-bold">Redirecting to Dashboard</div>
                  {/* <Loader PROGRESS_COLOR="bg-blue-950" /> */}
                </div>
                <button onClick={() => appUserlogout()} className="bg-blue-950 text-white hover:bg-blue-800 w-full px-8 py-3 font-semibold rounded-md shadow-4-hover">
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                <Input
                  type="text"
                  label="Full Name"
                  iconName="person"
                  value={name}
                  setValue={setName}
                  id="fullname"
                  placeholder="Your Full Name"
                  errorMessage={errors && errors.name ? errors.name : ""}
                  required
                />
                <Input
                  type="email"
                  label="Email Address"
                  iconName="mail"
                  value={email}
                  setValue={setEmail}
                  id="email"
                  placeholder="name@email.com | username"
                  errorMessage={errors && errors.email ? errors.email : ""}
                  required
                />
                <Input
                  type="password"
                  label="Password"
                  value={password}
                  setValue={setPassword}
                  id="password"
                  placeholder="********"
                  errorMessage={errors && errors.password ? errors.password : ""}
                  required
                />
                <Input
                  type="password"
                  label="Confirm Password"
                  value={confirm_p}
                  setValue={setConfirm_p}
                  id="password_p"
                  placeholder="********"
                  errorMessage={errors && errors.confirm_p ? errors.confirm_p : ""}
                  required
                />
                <div className="flex justify-center">
                  <Button disabled={loading} onClick={handleRegister} border="rounded-full" showIcon px="px-6" py="py-3">
                    Sign Up
                  </Button>
                </div>
              </div>
            )}
          </div>
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

export default RegisterPage;
