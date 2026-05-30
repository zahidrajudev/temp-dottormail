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

function GatewayEditTranslation({ show, setShow }: any) {
  const pageName = "gateway_edit";
  const { hasPermission } = useAuthStore();
  const { appLocales } = useLanguageStore();
  const [loading, setLoading] = useState(false);
  ``;
  const mainData: any = {
    [pageName]: "Update Gateway",
    payment_method: "payment_method",
    mode: "mode",
    name: "Name",
    status: "status",
    currencies: "currencies",
    select_logo: "select_logo",
    notes: "notes",
    sandbox: "sandbox",
    live: "live",
    update_now: "update_now",
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

export default GatewayEditTranslation;
