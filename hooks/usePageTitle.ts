// hooks/usePageTitle.ts
import pageTranslation from "@/modules/language/components/PageTranslation";
import { useLanguageStore } from "@/modules/language/store/useLanguageStore";
import { useRouter } from "next/router";

export const usePageTitle = () => {
  const router = useRouter();
  const { appSelectedLocale } = useLanguageStore();
  // const { t } = pageTranslation("dashboard", appSelectedLocale?.code ?? "en");
  // const { t } = pageTranslation("media", appSelectedLocale?.code ?? "en");
  const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/dashboard/media": "Media Management",
    "/dashboard/media/trash-files": "Media Trash Files",
    "/dashboard/media/trash-folders": "Media Trash Folders",
    "/dashboard/tool": "Manage Tools",
    "/dashboard/tool/add": "Add New Tool",
    "/dashboard/tool/edit": "Edit Tool",
    "/dashboard/package": "Manage Packages",
    "/dashboard/package/add": "Add New Package",
    "/dashboard/package/edit": "Edit Package",
    "/dashboard/gateway": "Manage Payment Gateways",
    "/dashboard/gateway/add": "Add New Gateway",
    "/dashboard/gateway/edit": "Edit Gateway",
    "/dashboard/subscription": "Manage Subscriptions",
    "/dashboard/subscription/add": "Add New Subscription",
    "/dashboard/transaction": "Manage Payment Transactions",
    "/dashboard/subscription/card": "Manage Payment Cards",
    "/dashboard/subscription/card/add": "Add New Card",
    "/dashboard/currency": "Manage Currencys",
    "/dashboard/currency/add": "Add New Currency",
    "/dashboard/currency/edit": "Edit Currency",
    "/dashboard/language": "Manage Languages",
    "/dashboard/language/add": "Add New Language",
    "/dashboard/language/edit": "Edit Language",
    "/dashboard/role": "Manage Roles",
    "/dashboard/role/add": "Add New Role",
    "/dashboard/role/edit": "Edit Role",
    "/dashboard/user": "Manage Users",
    "/dashboard/user/add": "Add New User",
    "/dashboard/user/edit": "Edit Language",
  };

  const getTitleFromPath = (path: string) => {
    // Exact match
    if (pageTitles[path]) {
      return pageTitles[path];
    }

    // Pattern match for dynamic routes
    for (const [route, title] of Object.entries(pageTitles)) {
      if (path.startsWith(route) && route !== "/dashboard") {
        return title;
      }
    }

    // Fallback: format path
    const lastSegment = path.split("/").pop() || "Dashboard";
    return lastSegment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return getTitleFromPath(router.pathname);
};
