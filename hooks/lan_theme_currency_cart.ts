import { setCookie, getCookie, hasCookie } from "cookies-next";
import { useEffect } from "react";
import { useState } from "react";
import Api from "@/lib/api";
import { useRouter } from "next/router";
import { toast } from "sonner";

interface Locale {
  code: string;
  name: string;
  default?: boolean;
  flag?: string;
}

interface Currency {
  code: string;
  symbol: string;
  default?: boolean;
}

interface User {
  [key: string]: any;
}

interface Permission {
  [key: string]: {
    [key: string]: boolean;
  };
}

export const LanguageThemeCurrencyCart = () => {
  const router = useRouter();
  const { pathname, query } = router;

  //User Loding
  const [appUserLoading, setAppUserLoading] = useState<boolean>(true);

  // Authentication
  const [appAuth, setAppAuth] = useState<boolean>(false);
  const [appUser, setAppUser] = useState<User | "">("");

  // User permissions
  const [appPermissions, setAppPermissions] = useState<Permission | "">("");

  //Logout
  const appUserlogout = async () => {
    setAppAuth(false);
    setAppUser("");
    setAppPermissions("");
    router.push({ pathname: "/", query: router.query });
    await Api.post("/logout")
      .then(() => {
        toast.success("Logged Out Success");
      })
      .catch((err) => {
        setAppAuth(false);
      });
  };

  const refreshAuthUser = async () => {
    // setAppUserLoading(true);
    await Api.get("v1/user")
      .then((res) => {
        if (res.status === 200 && res.data.status === true) {
          let userData = res.data.data;
          let permits = res.data.permits;
          setAppAuth(true);
          setAppUser(userData);
          setAppPermissions(permits);
          setAppUserLoading(false);
        } else {
          setAppAuth(false);
          setAppUser("");
          setAppPermissions("");
          setAppUserLoading(false);
        }
      })
      .catch((err) => {
        setAppAuth(false);
        setAppUser("");
        setAppPermissions("");
        setAppUserLoading(false);
        if (err.response?.data?.rdt === true) {
          router.push({ pathname: err.response.data?.url, query: router.query });
        }
      });
  };

  const [appLanguageSetting, setAppLanguageSetting] = useState<object | "">("");
  const [appCurrencySetting, setAppCurrencySetting] = useState<object | "">("");

  const refreshAppSetting = async () => {
    await Api.get("v1/global/setting")
      .then((res) => {
        let settings = res.data.data;

        if (Array.isArray(settings)) {
          settings.map((item) => {
            if (item.identity === 1) {
              setAppLanguageSetting(item?.value_int);
            }
            if (item.identity === 2) {
              setAppCurrencySetting(item?.value_int);
            }
          });
        }
      })
      .catch((err) => {
        return null;
      });
  };

  const [appLocaleLoading, setAppLocaleLoading] = useState<boolean>(true);
  const [appLocales, setAppLocales] = useState<Locale[] | "">("");
  const [appSelectedLocale, setAppSelectedLocale] = useState<Locale | "">("");
  const [appDefaultLocale, setAppDefaultLocale] = useState<Locale | "">("");

  const handleSelectLocaleWithQuery = (locale: Locale) => {
    setAppSelectedLocale(locale);
    //console.log("Locale select function is running");
    const newQuery = { ...query };
    if (locale.default) {
      if (query.locale) {
        delete newQuery.locale;
        router.replace({
          pathname,
          query: newQuery,
        });
      }
    } else {
      router.replace({
        pathname,
        query: { ...query, locale: locale.code },
      });
    }
  };
  // this function for users for navigating available languages
  const changeLocale = (code: string) => {
    if (Array.isArray(appLocales) && appLocales.length) {
      appLocales.map((locale) => {
        if (locale.code === code) {
          handleSelectLocaleWithQuery(locale);
        }
      });
    }
  };

  // when admin will change default language then we will call this function to show him the changes
  const refreshLocales = async () => {
    //setAppLocaleLoading(true);
    await Api.get("v1/global/language")
      .then((res) => {
        let resLocales = res.data.data;
        if (Array.isArray(resLocales) && resLocales.length) {
          let nameWithFlag = resLocales.map((loc) => {
            return { ...loc, name: loc.name + " " + loc.flag };
          });
          setAppLocales(nameWithFlag);
          nameWithFlag.map((locale) => {
            if (locale.default) {
              setAppDefaultLocale(locale);
            }
          });

          if (query.locale) {
            let code = query.locale;
            let isFundLocale = false;
            nameWithFlag.map((locale) => {
              if (locale.code === code) {
                handleSelectLocaleWithQuery(locale);
                isFundLocale = true;
              }
            });
            if (!isFundLocale) {
              nameWithFlag.map((locale) => {
                if (locale.default) {
                  handleSelectLocaleWithQuery(locale);
                }
              });
            }
          } else {
            nameWithFlag.map((locale) => {
              if (locale.default) {
                handleSelectLocaleWithQuery(locale);
              }
            });
          }
        }
      })
      .catch((err) => {
        return null;
      });
  };

  // Theme
  const [appDark, setAppDark] = useState<boolean>(false);

  const toggleAppDarkMode = () => {
    const element = document.getElementById("mainHtml");
    if (element?.classList.contains("dark")) {
      element.classList.remove("dark");
      setAppDark(false);
      setCookie("dark", "false");
    } else {
      element?.classList.add("dark");
      setAppDark(true);
      setCookie("dark", "true");
    }
  };

  // Currency
  const [appCurrencyLoading, setAppCurrencyLoading] = useState<boolean>(true);
  const [appCurrencies, setAppCurrencies] = useState<Currency[] | "">("");
  const [appSelectedCurrency, setAppSelectedCurrency] = useState<Currency | "">("");
  const [appDefaultCurrency, setAppDefaultCurrency] = useState<Currency | "">("");

  const changeCurrency = (code: string) => {
    if (Array.isArray(appCurrencies) && appCurrencies.length) {
      appCurrencies.map((currency) => {
        if (currency.code === code) {
          setAppSelectedCurrency(currency);
          setCookie("currency", currency.code);
        }
      });
    }
  };

  const refreshCurrency = async () => {
    await Api.get("v1/global/currency")
      .then((res) => {
        let resCurrencies = res.data.data;
        if (Array.isArray(resCurrencies) && resCurrencies.length) {
          let codeWithSymbol = resCurrencies.map((curr) => {
            return { ...curr, name: curr.code + " " + curr.symbol };
          });
          setAppCurrencies(codeWithSymbol);
          codeWithSymbol.map((currency) => {
            if (currency.default) {
              setAppDefaultCurrency(currency);
            }
          });

          if (hasCookie("currency")) {
            let code = getCookie("currency");
            let isFundCurrency = false;
            codeWithSymbol.map((currency) => {
              if (currency.code === code) {
                setAppSelectedCurrency(currency);
                isFundCurrency = true;
              }
            });
            if (!isFundCurrency) {
              codeWithSymbol.map((currency) => {
                if (currency.default) {
                  setAppSelectedCurrency(currency);
                  setCookie("currency", currency.code);
                }
              });
            }
          } else {
            codeWithSymbol.map((currency) => {
              if (currency.default) {
                setAppSelectedCurrency(currency);
                setCookie("currency", currency.code);
              }
            });
          }
        }
      })
      .catch((err) => {
        return null;
      });
  };

  const getAlldata = async () => {
    setAppLocaleLoading(true);
    setAppCurrencyLoading(true);
    await Api.get("v1/global/packet")
      .then((res) => {
        setAppLocaleLoading(false);
        setAppCurrencyLoading(false);
        let locales = res.data.languages;
        let currencies = res.data.currencies;
        let settings = res.data.settings;

        if (Array.isArray(settings)) {
          settings.map((item) => {
            if (item.identity === 1) {
              setAppLanguageSetting(item?.value_int);
            }
            if (item.identity === 2) {
              setAppCurrencySetting(item?.value_int);
            }
          });
        }

        if (Array.isArray(locales) && locales.length) {
          let nameWithFlag = locales.map((loc) => {
            return { ...loc, name: loc.name };
          });
          setAppLocales(nameWithFlag);

          nameWithFlag.map((locale) => {
            if (locale.default) {
              setAppDefaultLocale(locale);
            }
          });

          const searchParams = new URLSearchParams(window.location.search);
          const localeFromQuery = searchParams.get("locale");

          if (localeFromQuery) {
            console.log("found locale on query");
            let code = localeFromQuery;
            console.log("Query code=" + code);
            let isFundLocale = false;
            locales.map((locale) => {
              if (locale.code === code) {
                handleSelectLocaleWithQuery(locale);
                isFundLocale = true;
              }
            });
            if (!isFundLocale) {
              console.log("Query locale not found on the list");
              nameWithFlag.map((locale) => {
                if (locale.default) {
                  handleSelectLocaleWithQuery(locale);
                }
              });
            }
          } else {
            console.log("No locale found on the query");
            nameWithFlag.map((locale) => {
              if (locale.default) {
                handleSelectLocaleWithQuery(locale);
              }
            });
          }
        }

        if (Array.isArray(currencies) && currencies.length) {
          let codeWithSymbol = currencies.map((curr) => {
            return { ...curr, name: curr.code };
          });
          setAppCurrencies(codeWithSymbol);

          codeWithSymbol.map((currency) => {
            if (currency.default) {
              setAppDefaultCurrency(currency);
            }
          });

          if (hasCookie("currency")) {
            let code = getCookie("currency");
            let isFundCurrency = false;
            codeWithSymbol.map((currency) => {
              if (currency.code === code) {
                setAppSelectedCurrency(currency);
                isFundCurrency = true;
              }
            });
            if (!isFundCurrency) {
              codeWithSymbol.map((currency) => {
                if (currency.default) {
                  setAppSelectedCurrency(currency);
                  setCookie("currency", currency.code);
                }
              });
            }
          } else {
            codeWithSymbol.map((currency) => {
              if (currency.default) {
                setAppSelectedCurrency(currency);
                setCookie("currency", currency.code);
              }
            });
          }
        }
      })
      .catch((err) => {
        setAppLocaleLoading(false);
        setAppCurrencyLoading(false);
      });
  };

  useEffect(() => {
    getAlldata();
    refreshAuthUser();
  }, []);

  const [isDebug, setIsDebug] = useState(false);
  const [debugLogs, setDebugLogs] = useState<any>("");
  const addDebugLog = (log: any) => {
    if (!isDebug) {
      return;
    }
    setDebugLogs((prev: any) => [log, ...prev]);
  };
  const clearDebugLogs = () => {
    setDebugLogs("");
  };

  const [appMediaShow, setAppMediaShow] = useState<boolean>(false);
  const [appMediaReload, setAppMediaReload] = useState<number>(1);
  const [appMediaItems, setAppMediaItems] = useState([]);
  const [appMediaSelectOnly, setAppMediaSelectOnly] = useState<number[]>([]); // 1 =image, 2 = video, 3 = audio, 4 = docs or file
  const [appMediaMaxSelect, setAppMediaMaxSelect] = useState<Number>(0); // 0 = no limit
  const [appMediaFor, setAppMediaFor] = useState("");
  const [appMediaForceClose, setAppMediaForceClose] = useState(false);
  const refreshGlobalMedia = () => {
    setAppMediaReload((prev) => prev + 1);
  };

  const [showUserProfile, setShowUserProfile] = useState(false);

  return {
    appAuth,
    appUser,
    appUserLoading,
    refreshAuthUser,
    appUserlogout,
    appPermissions,
    appSelectedLocale,
    appSelectedCurrency,
    appLanguageSetting,
    appCurrencySetting,
    refreshAppSetting,
    appLocaleLoading,
    appLocales,
    appDefaultLocale,
    changeLocale,
    refreshLocales,
    appDark,
    toggleAppDarkMode,
    appCurrencyLoading,
    appCurrencies,
    appDefaultCurrency,
    changeCurrency,
    refreshCurrency,
    debugLogs,
    addDebugLog,
    isDebug,
    setIsDebug,
    clearDebugLogs,
    appMediaShow,
    setAppMediaShow,
    appMediaReload,
    setAppMediaReload,
    appMediaItems,
    setAppMediaItems,
    appMediaSelectOnly,
    setAppMediaSelectOnly,
    appMediaMaxSelect,
    setAppMediaMaxSelect,
    refreshGlobalMedia,
    appMediaFor,
    setAppMediaFor,
    appMediaForceClose,
    setAppMediaForceClose,
    showUserProfile,
    setShowUserProfile,
  };
};
