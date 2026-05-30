"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Accordion, AccordionItem } from "@/modules/global/elements/accordion";
import SvgIcon from "@/modules/global/icons/svg_icons";
import { AppLink } from "@/lib/AppLink";
import ImageBox from "@/modules/global/elements/image_box";
import { useGlobalStore } from "@/modules/global/store/useGlobalStore";
import Link from "next/link";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { useLanguageStore } from "@/modules/language/store/useLanguageStore";
import pageTranslation from "@/modules/language/components/PageTranslation";

export default function DottormailDashboardSidebar() {
  const { hasPermission } = useAuthStore();
  const pageName = "dashboard_sidebar";
  const { appSelectedLocale } = useLanguageStore();
  const { t } = pageTranslation(pageName, appSelectedLocale?.code ?? "en");
  const pathname = usePathname();
  const { logo_url } = useGlobalStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isLocked, setIsLocked] = useState(true); // Desktop default: Long
  const [mobileOpen, setMobileOpen] = useState(false);

  // Logic: Sidebar is "Wide" if locked open OR if hovering while short
  const isExpanded = isLocked || isHovered || mobileOpen;

  const closeMobile = () => setMobileOpen(false);

  let menuItems = [
    {
      id: 1,
      name: t("dashboard"),
      icon: "dashboard",
      link: "/dashboard",
      show: hasPermission("dashboard.view"),
    },
    {
      id: 2,
      name: t("media_files"),
      icon: "image",
      show: hasPermission("media.view"),
      submenu: [
        {
          name: t("all_files"),

          icon: "event_list",

          link: "/dashboard/media",

          show: hasPermission("media.view"),
        },

        {
          name: t("trash_files"),

          icon: "delete",

          link: "/dashboard/media/trash-files",

          show: hasPermission("media.view"),
        },
        {
          name: t("trash_folders"),
          icon: "delete",
          link: "/dashboard/media/trash-folders",
          show: hasPermission("media-directory.view"),
        },
      ],
    },

    {
      id: 20,
      name: t("email_verify"),
      icon: "workspaces",
      show: hasPermission("email-list.view"),
      submenu: [
        {
          name: t("quick_verify"),
          icon: "add",
          link: "/dashboard/email-verify/quick-verify",
          show: hasPermission("email-list.view"),
        },
        {
          name: t("my_list"),
          icon: "page_info",
          link: "/dashboard/email-verify/my-list",
          show: hasPermission("email-list.view"),
        },
      ],
    },

    {
      id: 21,
      name: t("email_find"),
      icon: "workspaces",
      show: hasPermission("email-list.view"),
      submenu: [
        {
          name: t("quick_verify"),
          icon: "add",
          link: "/dashboard/email-find",
          show: hasPermission("email-list.view"),
        },
      ],
    },

    {
      id: 4,
      name: t("manage_packages"),
      icon: "diversity_2",
      show: hasPermission("package.view"),
      submenu: [
        {
          name: t("add_new"),
          icon: "add",
          link: "/dashboard/package/add",
          show: hasPermission("package.create"),
        },
        {
          name: t("all_packages"),
          icon: "page_info",
          link: "/dashboard/package",
          show: hasPermission("package.view"),
        },
      ],
    },

    {
      id: 5,
      name: t("billing_payments"),
      icon: "account_balance",
      show: hasPermission("gateway.view") || hasPermission("transaction.view"),
      submenu: [
        {
          name: t("gateway_intregation"),
          icon: "touch_app",
          link: "/dashboard/gateway",
          show: hasPermission("gateway.view"),
        },
        {
          name: t("manage_transactions"),
          icon: "event_list",
          link: "/dashboard/transaction",
          show: hasPermission("transaction.view"),
        },
      ],
    },
    {
      id: 7,
      name: t("manage_currency"),
      icon: "currency_exchange",
      link: "/dashboard/currency",
      show: hasPermission("currency.view"),
      submenu: [
        {
          name: t("add_new"),
          icon: "touch_app",
          link: "/dashboard/currency/add",
          show: hasPermission("currency.create"),
        },
        {
          name: t("all_currencies"),
          icon: "page_info",
          link: "/dashboard/currency",
          show: hasPermission("currency.view"),
        },
      ],
    },
    {
      id: 8,
      name: t("manage_language"),
      icon: "language",
      link: "/dashboard/language",
      show: hasPermission("language.view"),
      submenu: [
        {
          name: t("add_new"),
          icon: "add",
          link: "/dashboard/language/add",
          show: hasPermission("language.create"),
        },
        {
          name: t("all_languages"),
          icon: "page_info",
          link: "/dashboard/language",
          show: hasPermission("language.view"),
        },
        {
          name: t("manage_translations"),
          icon: "page_info",
          link: "/dashboard/language/translation",
          show: hasPermission("language.view"),
        },
      ],
    },
    {
      id: 9,
      name: t("role_management"),
      icon: "security",
      link: "/dashboard/role",
      show: hasPermission("role.view"),
      submenu: [
        {
          name: t("add_new"),
          icon: "add",
          link: "/dashboard/role/add",
          show: hasPermission("role.create"),
        },
        {
          name: t("all_role_permissions"),
          icon: "page_info",
          link: "/dashboard/role",
          show: hasPermission("role.view"),
        },
      ],
    },
    {
      id: 10,
      name: t("user_management"),
      icon: "person",
      link: "/dashboard/user",
      show: hasPermission("user.view"),
      submenu: [
        {
          name: t("add_new"),
          icon: "add",
          link: "/dashboard/user/add",
          show: hasPermission("user.create"),
        },
        {
          name: t("all_users"),
          icon: "page_info",
          link: "/dashboard/user",
          show: hasPermission("user.view"),
        },
      ],
    },

    {
      id: 12,
      name: t("Settings"),
      icon: "settings",
      show: hasPermission("setting.view"),
      submenu: [
        {
          name: t("Update Logo"),
          icon: "image",
          link: "/dashboard/setting/update-logo",
          show: hasPermission("setting.view"),
        },
        {
          name: t("Email Configuration"),
          icon: "mail",
          link: "/dashboard/setting/email-config",
          show: hasPermission("setting.view"),
        },
      ],
    },
  ];

  return (
    <>
      {/* 1. MOBILE TRIGGER: Floating Action Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-110 bg-cyan-600 text-white p-4 rounded-full shadow-2xl active:scale-90 transition-transform"
      >
        <SvgIcon name="menu" className="size-6" />
      </button>

      {/* 2. MOBILE OVERLAY: Dims the background */}
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-100 lg:hidden backdrop-blur-sm" onClick={closeMobile} />}

      {/* 3. LAYOUT SPACER: Only exists on Desktop and matches locked width */}
      <div className={`hidden lg:block shrink-0 transition-all duration-700 ${isLocked ? "w-70" : "w-20"}`} />

      {/* 4. THE SIDEBAR */}
      <aside
        onMouseEnter={() => !isLocked && setIsHovered(true)}
        onMouseLeave={() => !isLocked && setIsHovered(false)}
        className={`
          fixed left-0 top-0 bg-linear-to-bl from-white via-white to-fuchsia-200 h-full border-r border-teal-500/50 z-52 overflow-hidden
          transition-all duration-700 ease-in-out
          ${isExpanded ? "w-70" : "w-0 lg:w-20"} 
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${!isLocked && isHovered ? "shadow-2xl ring-1 ring-black/5" : ""}
        `}
      >
        {/* Header with Toggle Arrow */}
        <div className="h-20 flex items-center px-6 justify-between overflow-hidden border-b border-gray-100 relative z-2">
          <Link href="/" className={`transition-opacity duration-700 ${isExpanded ? "opacity-100" : "opacity-0"}`}>
            <ImageBox src={logo_url} alt="Logo" className="h-10" />
          </Link>

          {/* Toggle Arrow (Desktop Only) */}
          <button
            onClick={() => {
              setIsLocked(!isLocked);
              setIsHovered(false); // Reset hover state on click
            }}
            className="hidden lg:flex p-2 rounded-lg hover:bg-cyan-100 text-teal-800"
          >
            <SvgIcon name="arrow_menu_open" className={`size-5 transition-transform duration-700 ${!isLocked ? "rotate-180" : ""}`} />
          </button>

          {/* Close Button (Mobile Only) */}
          <button onClick={closeMobile} className="lg:hidden p-2">
            <SvgIcon name="close" className="size-6 text-gray-200" />
          </button>
        </div>

        {/* Navigation Area */}
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-80px)] custom-scrollbar overflow-x-hidden relative z-2">
          <Accordion>
            {menuItems
              .filter((i: any) => {
                return i.show;
              })
              .map((item: any) => {
                const isActive = pathname.startsWith(item.link);

                if (item.submenu) {
                  return (
                    <AccordionItem
                      key={item.id}
                      id={item.id}
                      isShort={!isExpanded}
                      title={{
                        icon: <SvgIcon name={item.icon} className={`size-6 ${isActive ? "text-teal-600" : "text-teal-600"}`} />,
                        label: <span className={`size-6 ${isActive ? "text-cyan-600" : "text-cyan-600"}`}>{item.name}</span>,
                      }}
                    >
                      {item.submenu
                        .filter((is: any) => {
                          return is.show;
                        })
                        .map((sub: any) => (
                          <AppLink
                            key={sub.link}
                            href={sub.link}
                            onClick={closeMobile}
                            className="p-2 text-sm text-teal-600 hover:translate-x-2 duration-500 rounded-lg flex items-center gap-3 group"
                            activeClassName="bg-linear-to-r from-teal-500 to-cyan-500 text-white"
                          >
                            <SvgIcon name={sub.icon} className="size-4" />
                            {sub.name}
                          </AppLink>
                        ))}
                    </AccordionItem>
                  );
                }

                return (
                  <AppLink
                    key={item.id}
                    href={item.link}
                    onClick={closeMobile}
                    className="flex items-center gap-3 p-3 rounded-xl text-teal-600 hover:bg-teal-500 hover:text-white transition-all group"
                    activeClassName="bg-linear-to-r from-teal-500 to-cyan-500 text-white"
                  >
                    {/* Icon stays fixed size */}
                    <div className="shrink-0">
                      <SvgIcon name={item.icon} className="size-6" />
                    </div>

                    {/* Text Label Container */}
                    <div className={`transition-all duration-700 ease-in-out overflow-hidden ${isExpanded ? "opacity-100 w-full" : "opacity-0 w-0"}`}>
                      <span className="block whitespace-nowrap font-semibold text-sm w-50">{item.name}</span>
                    </div>
                  </AppLink>
                );
              })}
          </Accordion>
        </nav>
      </aside>
    </>
  );
}
