import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

const languages = [
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "ar", label: "العربية" },
  { code: "bn", label: "বাংলা" },
  { code: "hi", label: "हिन्दी" },
  { code: "pt", label: "Português" },
  { code: "ru", label: "Русский" },
  { code: "zh", label: "中文" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "it", label: "Italiano" },
  { code: "tr", label: "Türkçe" },
  { code: "ur", label: "اردو" },
  { code: "fa", label: "فارسی" },
  { code: "sw", label: "Kiswahili" },
  { code: "pl", label: "Polski" },
  { code: "nl", label: "Nederlands" },
  { code: "vi", label: "Tiếng Việt" },
];

// const getCurrentLang = (): string => {
//   const match = document.cookie.match(/googtrans=\/[^/]+\/([^;]+)/);
//   return match?.[1] || "en";
// };

const getCurrentLang = (): string => {
  const googtrans = getCookie("googtrans");
  // console.log({ googtrans });
  if (typeof googtrans === "string") {
    const parts = googtrans.split("/");
    //console.log({ parts });
    if (parts.length >= 3) {
      //console.log("found", parts[2]);
      return parts[2];
    }
  }
  //console.log("not found, so added en");
  return "en";
};

const CustomTranslator = () => {
  const [currentLang, setCurrentLang] = useState<string>("en");

  useEffect(() => {
    deleteCookie("googtrans", { path: "/", domain: ".globalmedianetwork.com" });
    // Read cookie and set initial language
    setCurrentLang(getCurrentLang());

    // Load Google Translate script
    const script = document.createElement("script");
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement({
        pageLanguage: "en",
        autoDisplay: false,
      });
    };
  }, []);

  const setLanguage = (lang: string) => {
    deleteCookie("googtrans", { path: "/", domain: ".globalmedianetwork.com" }); // Clean old one
    setCookie("googtrans", "/en/" + lang, { path: "/" });
    setCurrentLang(lang);

    const checkCookieAndReload = (attempt = 0) => {
      const current = getCurrentLang();
      if (current === lang) {
        // console.log("Cookie set successfully for lang:", lang);
        window.location.reload();
      } else if (attempt < 5) {
        // console.log(`Attempt ${attempt + 1}: Cookie not set yet, retrying...`);
        setTimeout(() => checkCookieAndReload(attempt + 1), 100);
      } else {
        // console.warn("Failed to verify cookie after multiple attempts. Reloading anyway.");
        window.location.reload();
      }
    };

    checkCookieAndReload();
  };

  return (
    <select
      onChange={(e) => setLanguage(e.target.value)}
      value={currentLang}
      className="px-2 py-1 border border-gray-100 focus:ring-0 rounded bg-white text-sm text-gray-800 w-full"
      translate="no">
      <option value="" disabled className="text-blue-950">
        Language
      </option>
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  );
};

export default CustomTranslator;
