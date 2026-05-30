import api from "@/lib/api";
import { checkErrors } from "@/lib/helper";
import { useCurrencyStore } from "@/modules/currency/store/useCurrencyStore";
import Button from "@/modules/global/elements/button";
import DropdownAndTooltip from "@/modules/global/elements/dropdown_tooltip";
import Section from "@/modules/global/elements/section";
import Table from "@/modules/global/elements/table";
import SvgIcon from "@/modules/global/icons/svg_icons";
import EChart from "@/modules/global/partial/echart";
import pageTranslation from "@/modules/language/components/PageTranslation";
import { useLanguageStore } from "@/modules/language/store/useLanguageStore";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AdminDashboardTranslation from "./translations/admin";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";

function AdminDashboardPage() {
  const pageName = "admin_dashboard";
  const { hasPermission } = useAuthStore();
  const [showTranslation, setShowTranslation] = useState(false);
  const { appSelectedLocale } = useLanguageStore();
  const { t } = pageTranslation(pageName, appSelectedLocale?.code ?? "en");

  const { formatPrice } = useCurrencyStore();
  const flushPermissions = async () => {
    const url = "v1/dashboard/role-permission/flush-cache";
    await api
      .get(url)
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
      });
  };

  const prepareTableData = (data: any) => {
    if (!Array.isArray(data)) {
      return [];
    }
    const tableData = data.map((dat: any) => ({
      id: dat.id,
      [t("invoice")]: dat?.invoice,
      [t("amount")]: formatPrice(dat?.amount),
      [t("status")]:
        dat.status == 1 ? (
          <div className="pl-2 pr-3 py-1 rounded-full bg-green-500/5 border border-green-700 w-max text-green-700 font-semibold">
            <SvgIcon name="check" className="size-4" filled />
            <div className="inline border-l border-green-700 ms-2 pl-2 text-green-700 text-xs">{t("paid")}</div>
          </div>
        ) : (
          <div className="pl-2 pr-3 py-1 rounded-full bg-red-500/5 border border-red-500 w-max text-red-600 font-semibold">
            <SvgIcon name="close" className="size-4" filled />
            <div className="inline border-l border-red-500 ms-2 pl-2 text-xs">{t("failed")}</div>
          </div>
        ),
      [t("charge_for")]: dat?.subscription?.package?.name,
      [`${t("payment_at")} _date`]: dat?.created_at,
      action: (
        <div className="text-xs flex items-center gap-4" title="View">
          <Button url={`/dashboard/transaction/invoice?id=${dat.id}`} showIcon border="rounded">
            {t("view")}
          </Button>
        </div>
      ),
    }));

    return tableData;
  };

  const demoTransactions = [
    { id: 1, invoice: "INV-1234", amount: 150, status: 1, subscription: { package: { name: "Basic Plan" } }, created_at: "2023-06-01" },
    { id: 1, invoice: "INV-1234", amount: 150, status: 1, subscription: { package: { name: "Basic Plan" } }, created_at: "2023-06-01" },
    { id: 1, invoice: "INV-1234", amount: 150, status: 2, subscription: { package: { name: "Basic Plan" } }, created_at: "2023-06-01" },
    { id: 1, invoice: "INV-1234", amount: 150, status: 1, subscription: { package: { name: "Basic Plan" } }, created_at: "2023-06-01" },
    { id: 1, invoice: "INV-1234", amount: 150, status: 1, subscription: { package: { name: "Basic Plan" } }, created_at: "2023-06-01" },
  ];

  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(7);
  const [mainData, setMainData] = useState<any>("");

  const getInitialData = async () => {
    setLoading(true);
    let data = { days };
    let url = "v1/dashboard/insight/admin";
    await api
      .post(url, data)
      .then((res) => {
        setLoading(false);
        setMainData(res.data);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err?.response?.data?.message);
      });
  };

  useEffect(() => {
    getInitialData();
  }, [days]);

  const calculatePrice = (data: any) => {
    let _amount = 0;
    if (Array.isArray(data)) {
      data.map((itm: any) => {
        _amount += Number(itm?.amount);
      });
    }
    return _amount;
  };

  return (
    <Section permission={hasPermission("dashboard.admin")} loading={loading} className="space-y-4 -mt-4 pb-6">
      <div className="grid grid-cols-1 2xl:grid-cols-4 gap-4">
        <div className="max-w-full overflow-hidden">
          <div className="flex flex-col gap-4">
            <div className="bg-white p-5 rounded-lg">
              <div className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold">{t("filter_by")}</p>
                  {hasPermission("translation.view") && (
                    <div className="cursor-pointer flex items-center" onClick={() => setShowTranslation(true)} title="Manage Translations">
                      <SvgIcon name="language" className="text-violet-600 size-6 rotate-90 rounded hover:bg-violet-600 hover:text-white p-0.5 mt-1" />
                    </div>
                  )}
                </div>

                <DropdownAndTooltip
                  position="bottom"
                  side="right"
                  width="w-[110px]"
                  button={
                    <div className="flex justify-between items-center gap-1 bg-violet-50 rounded px-2 py-1">
                      <div className="">
                        {days == 7 && t("week")}
                        {days == 30 && t("month")}
                        {days == 180 && t("quarter")}
                        {days == 360 && t("year")}
                      </div>
                      <SvgIcon name="keyboard_arrow_down" className="size-5" />
                    </div>
                  }
                >
                  <div className="py-3">
                    <div className=" bg-white rounded space-y-3 shadow-lg">
                      <ul className="s">
                        <li onClick={() => setDays(7)} className={`px-4 py-2 ${days == 7 ? "bg-violet-500 text-white" : "hover:bg-violet-500 hover:text-white"}`}>
                          {t("week")}
                        </li>
                        <li onClick={() => setDays(30)} className={`px-4 py-2 ${days == 30 ? "bg-violet-500 text-white" : "hover:bg-violet-500 hover:text-white"}`}>
                          {t("month")}
                        </li>
                        <li onClick={() => setDays(180)} className={`px-4 py-2 ${days == 180 ? "bg-violet-500 text-white" : "hover:bg-violet-500 hover:text-white"}`}>
                          {t("quarter")}
                        </li>
                        <li onClick={() => setDays(360)} className={`px-4 py-2 ${days == 360 ? "bg-violet-500 text-white" : "hover:bg-violet-500 hover:text-white"}`}>
                          {t("year")}
                        </li>
                      </ul>
                    </div>
                  </div>
                </DropdownAndTooltip>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg">
              <div className="">
                <h3 className="text-2xl font-semibold">{t("data_use_overview")}</h3>
              </div>
              <EChart
                height="h-[400px]"
                type="bar"
                options={{
                  data: {
                    name: ["One", "Two", "Three", "Four"],
                    value: [100, 40, 200, 60],
                  },
                  tooltip: {
                    name: "Data Use",
                  },
                  colors: ["#7f22fe", "yellow"],
                  gradientTopColor: "rgb(22, 36, 86,0.2)",
                  gradientBottomColor: "rgb(22, 36, 86,0)",
                }}
              />
            </div>
          </div>
        </div>
        <div className="2xl:col-span-3 space-y-4">
          <div className="grid md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            <div className="p-5 bg-white rounded-lg space-y-14">
              <div className="flex justify-between items-center gap-4">
                <div>
                  <p className="opacity-70">{t("total_profits")}</p>
                </div>

                <div className="px-4 py-1 rounded-full flex items-center bg-violet-50 gap-2 text-xs">
                  <h1 className="text-2xl font-semibold">$ {mainData?.profit}</h1>
                </div>
              </div>

              <div className="flex justify-between gap-4">
                <EChart
                  height="h-[100px]"
                  type="pie_donut"
                  options={{
                    data: [
                      { value: mainData?.profit, name: t("total") },
                      { value: mainData?.active_subs, name: t("active") },
                    ],
                    tooltip: {
                      name: "Total ($)",
                    },
                    colors: ["#e12afb", "#7f22fe"],
                    gradientTopColor: "rgb(22, 36, 86,0.2)",
                    gradientBottomColor: "rgb(22, 36, 86,0)",
                  }}
                />
                <div className="flex items-center">
                  <Button url="/dashboard/transaction" showIcon border="rounded" px="px-2" py="py-1.5"></Button>
                </div>
              </div>
            </div>
            <div className="p-5 bg-white rounded-lg space-y-14">
              <div className="flex justify-between items-center gap-4">
                <div>
                  <p className="opacity-70">{t("active_subscriptions")}</p>
                </div>

                <div className="px-4 py-1 rounded-full flex items-center bg-violet-50 gap-2 text-xs">
                  <h1 className="text-2xl font-semibold">$ {mainData?.active_subs}</h1>
                </div>
              </div>

              <div className="flex justify-between gap-4">
                <EChart
                  height="h-[100px]"
                  type="pie_donut"
                  options={{
                    data: [
                      { value: mainData?.active_subs, name: t("active") },
                      { value: mainData?.canceled_subs, name: t("canceled") },
                    ],
                    tooltip: {
                      name: "Total ($)",
                    },
                    colors: ["#e12afb", "#7f22fe"],
                    gradientTopColor: "rgb(22, 36, 86,0.2)",
                    gradientBottomColor: "rgb(22, 36, 86,0)",
                  }}
                />
                <div className="flex items-center">
                  <Button url="/dashboard/subscription" showIcon border="rounded" px="px-2" py="py-1.5"></Button>
                </div>
              </div>
            </div>
            <div className="p-5 bg-white rounded-lg space-y-14">
              <div className="flex justify-between items-center gap-4">
                <div>
                  <p className="opacity-70">{t("canceled_subscriptions")}</p>
                </div>

                <div className="px-4 py-1 rounded-full flex items-center bg-violet-50 gap-2 text-xs">
                  <h1 className="text-2xl font-semibold">$ {mainData?.canceled_subs}</h1>
                </div>
              </div>

              <div className="flex justify-between gap-4">
                <EChart
                  height="h-[100px]"
                  type="pie_donut"
                  options={{
                    data: [
                      { value: mainData?.profit, name: t("total") },
                      { value: mainData?.canceled_subs, name: t("canceled") },
                    ],
                    tooltip: {
                      name: "Total Sale ($)",
                    },
                    colors: ["#e12afb", "#7f22fe"],
                    gradientTopColor: "rgb(22, 36, 86,0.2)",
                    gradientBottomColor: "rgb(22, 36, 86,0)",
                  }}
                />
                <div className="flex items-center">
                  <Button url="/dashboard/subscription" showIcon border="rounded" px="px-2" py="py-1.5"></Button>
                </div>
              </div>
            </div>
          </div>
          <div className="grid xl:grid-cols-2 gap-4">
            <div className="p-5 bg-white rounded-lg space-y-6">
              <div className="flex justify-between items-center gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <SvgIcon name="group" className="bg-violet-50 text-violet-500 size-10 p-2 rounded-full border border-violet-200" />
                  <div>
                    <p className="opacity-70">{t("total_master_accounts")}</p>
                  </div>
                </div>
                <div className="px-4 py-1 rounded-full flex items-center bg-violet-50 gap-2 text-xs">
                  <h1 className="text-2xl font-semibold">{mainData?.total_accounts}</h1>
                </div>
              </div>
              <div className="flex flex-wrap gap-2"></div>
              <EChart
                height="h-[170px]"
                type="line_area"
                options={{
                  data: mainData?.insights_area_chart,
                  tooltip: {
                    name: "Total ($)",
                  },
                  colors: ["#e12afb", "yellow"],
                  gradientTopColor: "rgb(22, 36, 86,0.2)",
                  gradientBottomColor: "rgb(22, 36, 86,0)",
                }}
              />
            </div>
            <div className="p-5 bg-white rounded-lg space-y-14">
              <div className="grid grid-cols-2">
                <div className="space-y-8">
                  <div className="flex items-center gap-2 pl-8">
                    <SvgIcon name="settings" className="bg-violet-50 text-violet-500 size-10 p-2 rounded-full border border-violet-200" />
                    <div>
                      <h1 className="text-2xl font-semibold">{mainData?.total_tool_insights}</h1>
                      <p className="opacity-70">{t("tool_activity")}</p>
                    </div>
                  </div>
                  <EChart
                    height="h-[200px]"
                    type="pie_half_donut"
                    options={{
                      data: [
                        { name: "Live", value: mainData?.tools_chart?.live_percentage },
                        { name: "Down", value: mainData?.tools_chart?.issue_percentage },
                      ],
                      tooltip: {
                        name: t("tool_activity"),
                      },
                      colors: ["#e12afb", "#7f22fe"],
                      gradientTopColor: "rgb(22, 36, 86,0.2)",
                      gradientBottomColor: "rgb(22, 36, 86,0)",
                    }}
                  />
                </div>
                <div className="space-y-8">
                  <div className="flex items-center gap-2 pl-8">
                    <SvgIcon name="settings" className="bg-violet-50 text-violet-500 size-10 p-2 rounded-full border border-violet-200" />
                    <div>
                      <h1 className="text-2xl font-semibold">{mainData?.total_tool_insights}</h1>
                      <p className="opacity-70">{t("account_activity")}</p>
                    </div>
                  </div>
                  <EChart
                    height="h-[200px]"
                    type="pie_half_donut"
                    options={{
                      data: [
                        { name: "Live", value: mainData?.accounts_chart?.working_percentage },
                        { name: "Down", value: mainData?.accounts_chart?.broken_percentage },
                      ],
                      tooltip: {
                        name: t("account_activity"),
                      },
                      colors: ["#e12afb", "#7f22fe"],
                      gradientTopColor: "rgb(22, 36, 86,0.2)",
                      gradientBottomColor: "rgb(22, 36, 86,0)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <div className="px-5 py-10 bg-white rounded-lg flex items-center gap-4">
          <SvgIcon name="person" className="size-12 p-2 bg-violet-50 rounded-full text-violet-500" />
          <div>
            <h1 className="text-2xl font-semibold">{mainData?.total_users}</h1>
            <h6 className="opacity-70">{t("total_users")}</h6>
          </div>
        </div>
        <div className="px-5 py-10 bg-white rounded-lg flex items-center gap-4">
          <SvgIcon name="security" className="size-12 p-2 bg-violet-50 rounded-full text-violet-500" />
          <div>
            <h1 className="text-2xl font-semibold">{mainData?.total_roles}</h1>
            <h6 className="opacity-70">{t("total_roles")}</h6>
          </div>
        </div>
        <div className="px-5 py-10 bg-white rounded-lg flex items-center gap-4">
          <SvgIcon name="language" className="size-12 p-2 bg-violet-50 rounded-full text-violet-500" />
          <div>
            <h1 className="text-2xl font-semibold">{mainData?.total_languages}</h1>
            <h6 className="opacity-70">{t("total_languages")}</h6>
          </div>
        </div>
        <div className="px-5 py-10 bg-white rounded-lg flex items-center gap-4">
          <SvgIcon name="currency_exchange" className="size-12 p-2 bg-violet-50 rounded-full text-violet-500" />
          <div>
            <h1 className="text-2xl font-semibold">{mainData?.total_currencies}</h1>
            <h6 className="opacity-70">{t("total_currency")}</h6>
          </div>
        </div>
        <div className="px-5 py-10 bg-white rounded-lg flex items-center gap-4">
          <SvgIcon name="diversity_2" className="size-12 p-2 bg-violet-50 rounded-full text-violet-500" />
          <div>
            <h1 className="text-2xl font-semibold">{mainData?.total_packages}</h1>
            <h6 className="opacity-70">{t("total_packages")}</h6>
          </div>
        </div>
        <div className="px-5 py-10 bg-white rounded-lg flex items-center gap-4">
          <SvgIcon name="image" className="size-12 p-2 bg-violet-50 rounded-full text-violet-500" />
          <div>
            <h1 className="text-2xl font-semibold">{mainData?.total_medias}</h1>
            <h6 className="opacity-70">{t("total_media_files")}</h6>
          </div>
        </div>
        <div className="px-5 py-10 bg-white rounded-lg flex items-center gap-4">
          <SvgIcon name="folder_open" className="size-12 p-2 bg-violet-50 rounded-full text-violet-500" />
          <div>
            <h1 className="text-2xl font-semibold">{mainData?.total_media_directories}</h1>
            <h6 className="opacity-70">{t("total_media_folders")}</h6>
          </div>
        </div>
        <div className="px-5 py-10 bg-white rounded-lg flex items-center gap-4">
          <SvgIcon name="credit_card" className="size-12 p-2 bg-violet-50 rounded-full text-violet-500" />
          <div>
            <h1 className="text-2xl font-semibold">{mainData?.total_gateways}</h1>
            <h6 className="opacity-70">{t("total_payment_gateways")}</h6>
          </div>
        </div>
        <div className="px-5 py-10 bg-white rounded-lg flex items-center gap-4">
          <SvgIcon name="crown" className="size-12 p-2 bg-violet-50 rounded-full text-violet-500" />
          <div>
            <h1 className="text-2xl font-semibold">{mainData?.total_tools}</h1>
            <h6 className="opacity-70">{t("total_tools")}</h6>
          </div>
        </div>
        <div className="px-5 py-10 bg-white rounded-lg flex items-center gap-4">
          <SvgIcon name="event_list" className="size-12 p-2 bg-violet-50 rounded-full text-violet-500" />
          <div>
            <h1 className="text-2xl font-semibold">{mainData?.total_accounts}</h1>
            <h6 className="opacity-70">{t("total_accounts")}</h6>
          </div>
        </div>
      </div>
      <div className="px-5 py-10 bg-white rounded-lg space-y-6">
        <div className="flex justify-between items-center gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <SvgIcon name="bar_chart" className="bg-violet-50 text-violet-500 size-10 p-2 rounded-full border border-violet-200" />
            <h1 className="lg:text-2xl font-semibold">{t("last_transactions")}</h1>
          </div>
          <div className="px-4 py-1 rounded-full flex items-center bg-violet-50 gap-2 text-xs">
            <h1 className="text-2xl font-semibold">{formatPrice(calculatePrice(mainData?.transactions))}</h1>
          </div>
        </div>

        <Table className="" data={prepareTableData(mainData?.transactions)} loading={false} showMark={false} excludeKeys={["id"]} />
      </div>
      <AdminDashboardTranslation show={showTranslation} setShow={setShowTranslation} />
    </Section>
  );
}

export default AdminDashboardPage;
