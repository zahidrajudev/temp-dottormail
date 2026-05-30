import { useEffect } from "react";
import api from "@/lib/api";

function SyncPageTranslation() {
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
      Object.entries(updates).forEach(([page, payload]: any) => {
        localStorage.setItem(`translations_${page}`, JSON.stringify(payload.value));
        localStorage.setItem(`translations_version_${page}`, payload.version);
      });
    } catch (err) {
      console.error("Translation sync failed", err);
    }
  };
  // 🔹 Init
  useEffect(() => {
    syncTranslation();

    // 🔁 background sync
    const interval = setInterval(syncTranslation, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
}

export default SyncPageTranslation;
