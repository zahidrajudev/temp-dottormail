import Link from "next/link";
import DropdownAndTooltip from "@/modules/global/elements/dropdown_tooltip";
import { useState } from "react";
import SvgIcon from "@/modules/global/icons/svg_icons";
import Section from "@/modules/global/elements/section";
import ImageBox from "@/modules/global/elements/image_box";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { useGlobalStore } from "@/modules/global/store/useGlobalStore";
import Button from "@/modules/global/elements/button";
import CurrencyDropdown from "@/modules/currency/components/CurrencyDropdown";
import LanguageDropdown from "@/modules/language/components/LanguageDropdown";
import { useRouter } from "next/router";
import api from "@/lib/api";

function MainHeader() {
  const router = useRouter();
  const { appAuth, appUserlogout, appUserLoading } = useAuthStore();
  const { logo_url } = useGlobalStore();
  const [loading, setLoading] = useState(false);
  const [cupon, setCupon] = useState("");

  const getInitialData = async () => {
    setLoading(true);
    await api
      .get("v1/home/cupons")
      .then((res) => {
        setCupon(res.data.data);
        setLoading(false);
      })
      .catch((error) => {
        setCupon("");
        setLoading(false);
      });
  };

  const menu = [
    { name: "Tools", url: "/tools" },
    { name: "Pricing", url: "/pricing" },
    { name: "About Us", url: "/about-us" },
    { name: "Contact Us", url: "/contact-us" },
  ];

  return (
    <>
      {/* For Desktop */}
      <Section fullWidth={true} className="" outerClassName="hidden md:block md:sticky top-2 z-20">
        <Section className="bg-white px-6 py-3 rounded-full max-w-5xl mx-auto flex items-center justify-between shadow-custom-5">
          <div>
            <Link href="/">
              <ImageBox src={logo_url ?? ""} className="h-11" image_className="max-w-full max-h-full" />
            </Link>
          </div>
          <div className="flex items-center justify-center gap-5 font-semibold">
            {menu.map((item, index) => {
              return (
                <Button key={index} variant="link" url={item.url} linkClassName="text-violet-950 hover:text-fuchsia-600">
                  {item.name}
                </Button>
              );
            })}
            <div className="flex border border-violet-200 rounded-full divide-x divide-violet-200">
              <CurrencyDropdown
                className="flex items-center px-2 py-0.5 rounded-l-full hover:bg-violet-500 hover:text-white group cursor-pointer"
                iconClass="size-5 text-violet-500 group-hover:text-white"
              />
              <LanguageDropdown
                className="flex items-center px-2 py-0.5 rounded-r-full hover:bg-violet-500 hover:text-white group cursor-pointer"
                iconClass="size-5 text-violet-500 group-hover:text-white"
              />
            </div>
          </div>
          <div className="">
            {appUserLoading ? (
              <SvgIcon name="" loading loading_front_color="text-violet-600" />
            ) : (
              <div className="flex items-center rounded-full bg-violet-500 divide-x divide-violet-200 overflow-hidden border border-violet-500">
                <div
                  onClick={() => {
                    appAuth ? router.push("/dashboard") : router.push("/login");
                  }}
                  className="flex gap-1 items-center py-2 px-4 text-white hover:bg-white hover:text-black cursor-pointer"
                >
                  {appAuth && <SvgIcon name="dashboard" className="size-4" />}
                  <p>{appAuth ? "Dashboard" : "Login"}</p>
                  {!appAuth && <SvgIcon name="arrow_right_alt" className="size-4" />}
                </div>
                <div className="p-2 text-white hover:bg-white hover:text-black cursor-pointer">
                  <DropdownAndTooltip position="bottom" side="middle" button={<SvgIcon name="keyboard_arrow_down" className="size-5" />}>
                    <div className="max-w-80 w-full px-4 pt-4">
                      <div className="w-full bg-white px-8 py-4 rounded-lg shadow-xl">
                        <div className="space-y-5 font-semibold">
                          {appAuth ? (
                            <>
                              <div className="flex items-center justify-start">
                                <Button variant="link" url="/dashboard">
                                  DASHBOARD
                                </Button>
                              </div>
                              <div className="flex items-center justify-start">
                                <Button variant="link" onClick={appUserlogout}>
                                  LOGOUT
                                </Button>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center justify-start">
                                <Button variant="link" url="/login">
                                  LOGIN
                                </Button>
                              </div>
                              <div className="flex items-center justify-start">
                                <Button variant="link" url="/register">
                                  REGISTARTION
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </DropdownAndTooltip>
                </div>
              </div>
            )}
          </div>
        </Section>
      </Section>

      {/* For Mobile */}

      <Section fullWidth={true} className="" outerClassName="md:hidden top-2 z-10">
        <Section className="bg-white px-6 py-3 rounded-full max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <ImageBox src={logo_url ?? ""} className="h-7" image_className="max-w-full max-h-full" />
          </div>

          <div className="">
            <DropdownAndTooltip
              position="bottom"
              side="left"
              button={
                <Button
                  className="bg-linear-to-l from-fuchsia-500 to-violet-500 text-white font-semibold hover:bg-linear-to-r hover:from-white hover:to-white hover:text-violet-600 border border-white hover:border-fuchsia-600 rounded-full"
                  border=""
                  showIcon
                  iconName="menu"
                  px="px-6"
                  py="py-3"
                ></Button>
              }
            >
              <div className="max-w-80 w-full px-4 pt-2">
                <div className="w-full bg-white px-8 py-4 rounded-lg shadow-xl">
                  <div className="space-y-5 font-semibold">
                    {menu.map((item, index) => {
                      return (
                        <div key={index} className="flex items-center justify-start">
                          <Button variant="link" url={item.url}>
                            {item.name}
                          </Button>
                        </div>
                      );
                    })}
                    <hr />
                    {appAuth ? (
                      <>
                        <div className="flex items-center justify-start">
                          <Button variant="link" url="/dashboard">
                            DASHBOARD
                          </Button>
                        </div>
                        <div className="flex items-center justify-start">
                          <Button variant="link" onClick={appUserlogout}>
                            LOGOUT
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-start">
                          <Button variant="link" url="/login">
                            LOGIN
                          </Button>
                        </div>
                        <div className="flex items-center justify-start">
                          <Button variant="link" url="/register">
                            REGISTARTION
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </DropdownAndTooltip>
          </div>
        </Section>
      </Section>
    </>
  );
}

export default MainHeader;
