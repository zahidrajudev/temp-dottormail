import { useLanguageStore } from "@/modules/language/store/useLanguageStore";
import Link from "next/link";
import { useRouter } from "next/router";

export const AppLink = ({ href, children, className = "", activeClassName = "active", ...props }: any) => {
  const router = useRouter();
  const { appSelectedLocale, appDefaultLocale } = useLanguageStore();

  const selected = appSelectedLocale || appDefaultLocale;
  // 1. Logic: Only add ?locale if NOT the default language
  const getLocalizedHref = () => {
    if (!selected || selected.default === 1) return href;

    const localeQuery = { locale: selected.code };

    if (typeof href === "string") {
      const [pathname, search] = href.split("?");
      const params = new URLSearchParams(search);
      params.set("locale", selected.code);
      return `${pathname}?${params.toString()}`;
    }

    return {
      ...href,
      query: { ...href.query, ...localeQuery },
    };
  };

  // 2. Logic: Determine if the link is active
  const currentPath = typeof href === "string" ? href.split("?")[0] : href.pathname;
  const isActive = router.asPath.split("?")[0] === currentPath;

  const finalClass = `${className} ${isActive ? activeClassName : ""}`.trim();

  return (
    <Link href={getLocalizedHref()} className={finalClass} {...props}>
      {children}
    </Link>
  );
};
