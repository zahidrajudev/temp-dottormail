"use client";

import api from "@/lib/api";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import Button from "@/modules/global/elements/button";
import Modal from "@/modules/global/elements/modal";
import Section from "@/modules/global/elements/section";
import SvgIcon from "@/modules/global/icons/svg_icons";
import Input from "@/modules/global/input/input";
import pageTranslation from "@/modules/language/components/PageTranslation";
import { useLanguageStore } from "@/modules/language/store/useLanguageStore";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function DashboardSidebarTranslation() {
  const pageName = "dashboard_sidebar";
  const [show, setShow] = useState(false);
  const { hasPermission } = useAuthStore();
  const {} = useLanguageStore();
  const [loading, setLoading] = useState(false);
  const { appSelectedLocale, appLocales } = useLanguageStore();
  const { t } = pageTranslation(pageName, appSelectedLocale?.code ?? "en");
  const mainData: any = {
    manage_sidebar_translations: "Manage Sidebar Translations",
    dashboard: "Dashboard",
    media_files: "Media Files",
    all_files: "All Files",
    trash_files: "Trash Files",
    trash_folders: "Trash Folders",
    manage_tools: "Manage Tools",
    add_new: "Add New",
    all_tools: "All Tools",
    manage_packages: "Manage Packages",
    all_packages: "All Packages",
    billing_payments: "Billing & Payments",
    gateway_intregation: "Gateway Intregation",
    manage_subscriptions: "Manage Subscriptions",
    followup_logs: "FollowUp Logs",
    manage_transactions: "Manage Transactions",
    manage_cards: "Manage Cards",
    manage_currency: "Manage Currency",
    all_currencies: "All Currencies",
    manage_language: "Manage Language",
    all_languages: "All Languages",
    manage_translations: "Manage Translations",
    role_management: "Role Management",
    all_role_permissions: "All Role & Permissions",
    user_management: "User Management",
    all_users: "All Users",
  };

  const [data, setData] = useState<any>({});
  const [search, setSearch] = useState("");

  const defaultLang = "en";

  // ✅ Handle input change
  const handleChange = (lang: string, key: string, value: string) => {
    setData((prev: any) => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [key]: value,
      },
    }));
  };

  // ✅ Auto fill (EN → others)
  const autoFill = () => {
    setData((prev: any) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((lang) => {
        if (lang !== defaultLang) {
          Object.keys(updated[lang]).forEach((key) => {
            if (!updated[lang][key]) {
              updated[lang][key] = updated[defaultLang]?.[key] || "";
            }
          });
        }
      });
      return { ...updated };
    });
  };

  // ✅ Reset single row
  const resetRow = (key: string) => {
    setData((prev: any) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((lang) => {
        updated[lang][key] = mainData[key];
      });
      return updated;
    });
  };

  // ✅ Save API
  const storeTranslation = async () => {
    try {
      setLoading(true);
      await api
        .post("v1/dashboard/translation/create", {
          value: data,
          name: pageName,
        })
        .then((res) => {
          setLoading(false);
          localStorage.removeItem(`translations_${pageName}`);
          toast.success("Saved successfully");
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err?.response?.data?.message);
        });
    } catch (err) {
      setLoading(false);
      toast.error("Something went wrong");
    }
  };

  // ✅ Export JSON
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${pageName}_translations.json`;
    a.click();
  };

  // ✅ Import JSON
  const importJSON = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event: any) => {
      try {
        const parsed = JSON.parse(event.target.result);
        setData(parsed);
      } catch {
        alert("Invalid JSON");
      }
    };
    reader.readAsText(file);
  };

  // ✅ Load
  const loadFromCache = () => {
    const cached = localStorage.getItem(`translations_${pageName}`);

    let finalData: any = {};

    if (cached) {
      const parsed = JSON.parse(cached);
      const cachedData = parsed?.value || {};

      appLocales?.forEach((lang) => {
        const code = lang.code;

        const langCache = cachedData[code] || {};

        let cleanedData: any = {};

        // ✅ Loop ONLY mainData keys (source of truth)
        Object.keys(mainData).forEach((key) => {
          if (langCache.hasOwnProperty(key)) {
            // ✔ Keep existing translation
            cleanedData[key] = langCache[key];
          } else {
            // ✔ Add new key from mainData
            cleanedData[key] = mainData[key];
          }
        });

        finalData[code] = cleanedData;
      });
    } else {
      // Fresh init
      appLocales?.forEach((lang) => {
        finalData[lang.code] = { ...mainData };
      });
    }

    setData(finalData);
  };

  useEffect(() => {
    if (show) {
      loadFromCache();
    }
  }, [show]);

  const keys = Object.keys(data?.[Object.keys(data)[0]] || {}).filter((key) => {
    const searchText = search.toLowerCase();

    // ✅ Match key (i1, i2...)
    const keyMatch = key.toLowerCase().includes(searchText);

    // ✅ Match any language value
    const valueMatch = Object.keys(data).some((lang) => (data?.[lang]?.[key] || "").toString().toLowerCase().includes(searchText));

    return keyMatch || valueMatch;
  });

  return (
    <>
      <div
        onClick={() => setShow(true)}
        className="w-max p-5 rounded hover:bg-violet-600 hover:text-white bg-white font-semibold hover:scale-105 duration-500 cursor-pointer"
      >
        {t("manage_sidebar_translations")}
      </div>
      <Modal show={show} setShow={setShow} maxWidth="w-[90%]">
        <Section fullWidth permission={hasPermission("user.create")} loading={loading} className=" px-6 py-10 space-y-6">
          {/* 🔥 TOP ACTION BAR */}
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <Input value={search} setValue={setSearch} labelShow={false} iconShow={true} iconName="search" placeholder="Search Here..." />
            <div className="flex gap-2 flex-wrap">
              <Button onClick={autoFill}>Auto Fill</Button>
              <Button onClick={storeTranslation}>Save</Button>
            </div>
          </div>

          {/* 🔥 TABLE */}
          <div className="overflow-x-auto">
            <table className="min-w-max table-auto w-full border-collapse">
              <thead className="sticky top-0 bg-linear-to-r from-violet-500 to-fuchsia-500 z-2">
                <tr>
                  <th className="border border-gray-200 p-2 text-left w-6 text-white">Serial</th>

                  {Object.keys(data).map((lang) => {
                    const label = appLocales?.find((l) => l.code === lang)?.name || lang;

                    return (
                      <th key={lang} className="border border-gray-200 p-2 text-white">
                        {label}
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody>
                {keys.map((key, index) => (
                  <tr key={key}>
                    {/* KEY */}
                    <td className="border border-gray-200 p-2 font-medium w-6 text-center">{index + 1}</td>

                    {/* INPUTS */}
                    {Object.keys(data).map((lang) => {
                      const value = data?.[lang]?.[key] || "";
                      const isMissing = !value;

                      return (
                        <td key={lang} className="border border-gray-200 p-2">
                          <Input
                            value={value}
                            setValue={(value: string) => handleChange(lang, key, value)}
                            labelShow={false}
                            iconShow={false}
                            border={isMissing ? "border border-red-400 rounded" : "border border-gray-300 focus:border-violet-500 rounded"}
                            padding="px-2 py-1"
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </Modal>
    </>
  );
}

export default DashboardSidebarTranslation;
