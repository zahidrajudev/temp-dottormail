import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/api";
import { setCookie, getCookie } from "cookies-next";

interface Locale {
  name: string;
  flag: string | null;
  code: string;
  default: number;
  dir: "ltr" | "rtl";
}

interface LanguageState {
  appLocales: Locale[];
  appSelectedLocale: Locale | null;
  appDefaultLocale: Locale | null;
  appLocaleLoading: boolean;
  fetchLocales: () => Promise<void>;
  changeLocale: (locale: Locale) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      appLocales: [],
      appSelectedLocale: null,
      appDefaultLocale: null,
      appLocaleLoading: false,

      fetchLocales: async () => {
        set({ appLocaleLoading: true });
        try {
          const res = await api.get("v1/languages");
          const locales = res.data.data;

          if (Array.isArray(locales)) {
            const defaultLoc = locales.find((l: Locale) => l.default === 1) || locales[0];
            set({ appDefaultLocale: defaultLoc });
          }

          // 1. Check Cookie first, then Default DB entry
          const cookieCode = getCookie("locale");
          const defaultLoc = locales.find((l: Locale) => l.default === 1) || locales[0];
          const matched = locales.find((l: Locale) => l.code === cookieCode);

          const finalLocale = matched || defaultLoc;

          set({
            appLocales: locales,
            appSelectedLocale: finalLocale,
            appLocaleLoading: false,
          });

          // Ensure environment stays in sync
          document.documentElement.dir = finalLocale.dir;
          document.documentElement.lang = finalLocale.code;
          setCookie("locale", finalLocale.code);
        } catch (error) {
          set({ appLocaleLoading: false });
        }
      },

      changeLocale: (locale) => {
        set({ appSelectedLocale: locale });
        setCookie("locale", locale.code);
        document.documentElement.dir = locale.dir;
        document.documentElement.lang = locale.code;
      },
    }),
    {
      name: "app-language-storage",
      partialize: (state) => ({ appSelectedLocale: state.appSelectedLocale }),
    },
  ),
);
