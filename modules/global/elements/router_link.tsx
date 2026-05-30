import Link from "next/link";
import { useRouter } from "next/router";
import { useLanguageStore } from "@/modules/language/store/useLanguageStore";

interface Props {
  href?: any;
  children?: React.ReactNode;
  className?: string;
  attributes?: any;
  isAddLocale?: boolean;
  activeClassName?: string;
}

function RouterLink({ href = "/view_details", children = "Link Text", className = "", activeClassName = "font-bold", isAddLocale = true, ...props }: Props) {
  const { appSelectedLocale, appDefaultLocale } = useLanguageStore();
  const router = useRouter();
  const handleAddLocaleInUrl = (url: string, currentLocale: any, defaultLocale: any) => {
    if (isAddLocale && currentLocale?.id !== defaultLocale?.id) {
      return `${url}?locale=${currentLocale?.code}`;
    }
    return url;
  };

  const resolvedHref = handleAddLocaleInUrl(href, appSelectedLocale, appDefaultLocale);

  /**
   * `isActive` is true when the current path (including query) matches `href`
   * after locale resolution.
   */
  const isActive = router.asPath === resolvedHref || router.pathname === href;

  // Combine any existing className with the activeClassName when active
  const combinedClassName = `${className} ${isActive ? activeClassName : ""}`.trim();
  return (
    <Link href={resolvedHref} className={combinedClassName} aria-current={isActive ? "page" : undefined} {...props}>
      {children}
    </Link>
  );
}

export default RouterLink;
