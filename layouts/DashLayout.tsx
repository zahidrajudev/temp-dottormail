import GlobalMediaGallery from "@/modules/media/components/global_media_gallery";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { useCurrencyStore } from "@/modules/currency/store/useCurrencyStore";
import { useLanguageStore } from "@/modules/language/store/useLanguageStore";
import Section from "@/modules/global/elements/section";
import { useRouter } from "next/router";
import DottormailDashboardSidebar from "@/modules/dottormail/sidebars/dashboard-sidebar";
import DottormailAdminDashboardHeader from "@/modules/dottormail/headers/dashboard_header";

interface Props {
  children: React.ReactNode;
}

function DashLayout({ children }: Props) {
  const router = useRouter();
  const { appUserLoading, hasPermission } = useAuthStore();
  const { appLocaleLoading } = useLanguageStore();
  const { appCurrencyLoading } = useCurrencyStore();

  if (appLocaleLoading || appUserLoading || appCurrencyLoading) {
    return <Section outerClassName="h-screen flex items-center justify-center" loading={true}></Section>;
  }

  if (!hasPermission("dashboard.view")) {
    router.push("/");
    return "";
  }

  return (
    <div className="">
      <GlobalMediaGallery showUpdateButton={true} enableGlobalOptions={true} />
      <div className="flex">
        <DottormailDashboardSidebar />
        <div className="flex-1 relative min-w-0 transition-all duration-700 space-y-10 bg-linear-to-tl from-violet-600/10 via-violet-600/10 to-fuchsia-600/20">
          <DottormailAdminDashboardHeader />
          <div className="px-4 lg:px-12 py-5 min-h-screen w-full relative">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default DashLayout;
