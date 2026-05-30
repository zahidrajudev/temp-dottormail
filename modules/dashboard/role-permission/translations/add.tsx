"use client";

import api from "@/lib/api";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import Button from "@/modules/global/elements/button";
import Modal from "@/modules/global/elements/modal";
import Section from "@/modules/global/elements/section";
import Input from "@/modules/global/input/input";
import { useLanguageStore } from "@/modules/language/store/useLanguageStore";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function RoleAddTranslation({ show, setShow }: any) {
  const pageName = "role_add";
  const { hasPermission } = useAuthStore();
  const { appLocales } = useLanguageStore();
  const [loading, setLoading] = useState(false);

  const mainData: any = {
    [pageName]: "Add User",
    name: "Name",
    enter_full_name: "Enter Full Name",
    select_profile_photo: "Select Profile Photo",
    add_now: "Add Now",
    dashboard_permissions: "Dashboard Permissions",
    access_dashboard: "Access Dashboard",
    admin_dashboard_analytics: "Admin Dashboard Analytics",
    user_dashboard_analytics: "User Dashboard Analytics",
    author_dashboard_analytics: "Author Dashboard Analytics",
    client_dashboard_analytics: "Client Dashboard Analytics",
    role_and_permissions: "Role & Permissions",
    view_only_own: "View only own role list",
    view_all_role: "View all role list",
    create_new_role: "Create new role",
    edit_only_own: "Edit only own roles",
    edit_all_existing: "Edit all existing roles",
    delete_only_own: "Delete only own role",
    delete_all_existing: "Delete all existing roles",
    user_permissions: "User Permissions",
    view_all_user: "View all user list",
    create_new_user: "Create new user",
    language_permissions: "Language Permissions",
    view_all_language: "View all language list",
    create_new_language: "Create new language",
    currency_permissions: "Currency Permissions",
    view_all_currency: "View all currency list",
    create_new_currency: "Create new currency",
    edit_only_own_currencys: "Edit only own currencys",
    edit_all_existing_currencys: "Edit all existing currencys",
    media_folder_permissions: "Media Folder Permissions",
    view_all_media: "View all media folder list",
    create_new_media: "Create new media folder",
    media_file_permissions: "Media File Permissions",
    upload_new_media: "Upload new media files",
    package_permissions: "Package Permissions",
    view_all_package: "View all package list",
    add_new_package: "Add new package",
    tool_permissions: "Tool Permissions",
    view_all_tool: "View all tool list",
    add_new_tool: "Add new tool",
    tool_account_permissions: "Tool Account Permissions",
    view_all_tool_account: "View all tool account list",
    add_new_tool_account: "Add new tool account",
    gateway_permissions: "Gateway Permissions",
    view_all_gateway: "View all gateway list",
    add_new_gateway: "Add new gateway",
    transaction_permissions: "Transaction Permissions",
    view_all_transaction: "View all transaction list",
    can_do_transaction: "Can do transaction",
    subscription_permissions: "Subscription Permissions",
    view_all_subscription: "View all Subscription list",
    add_new_subscription: "Add new Subscription",
    view_and_manage: "View & Manage Subscription Logs",
    payment_card_permissions: "Payment Card Permissions",
    view_all_payment: "View all payment card list",
    add_new_payment: "Add new payment card",
    translation_permissions: "Translation Permissions",
    view_translation_option: "View translation option",
    add_translation: "Add translation",
    edit_translation: "Edit translation",
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
  );
}

export default RoleAddTranslation;
