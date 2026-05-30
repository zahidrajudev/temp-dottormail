"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

function pageTranslation(pageName: string, lang: string) {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const cacheKey = `translations_${pageName}`;

  const loadFromCache = () => {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      const value = parsed?.value || {};
      setData(value[lang] || {});
      setLoading(false);
    } else {
      syncTranslation();
    }
  };

  const syncTranslation = async () => {
    try {
      // Collect all stored versions
      const versions: Record<string, number> = {};

      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("translations_")) {
          const page = key.replace("translations_", "");
          const item = JSON.parse(localStorage.getItem(key) || "{}");
          const version = item?.version;
          versions[page] = Number(version);
        }
      });

      // 🔥 Send batch request
      const res = await api.post("v1/translation/sync", { versions });

      const updates = res.data.data; // { {name:"home",..}, {name:"about",..} }
      if (Array.isArray(updates)) {
        updates.forEach((item: any) => {
          localStorage.setItem(`translations_${item.name}`, JSON.stringify(item));
        });
      }
      // Update current page instantly
      if (updates[pageName]) {
        setData(updates[pageName].value[lang] || {});
      }
    } catch (err) {
      console.error("Translation sync failed", err);
    }
  };

  useEffect(() => {
    loadFromCache();
  }, [pageName, lang]);

  const t = (key: string) => {
    const keys = key.split(".");
    let value = data;

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  };

  return {
    t,
    data,
    loading,
    syncTranslation,
  };
}

export default pageTranslation;
