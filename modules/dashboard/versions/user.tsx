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

function UserDashboardPage() {
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
    let url = "v1/dashboard/insight/user";
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
    <Section permission={hasPermission("dashboard.user")} loading={loading} className="space-y-4 -mt-4 pb-6">
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
                height="h-[370px]"
                type="bar"
                options={{
                  data: {
                    name: mainData?.charts?.data_use_bar?.name,
                    value: mainData?.charts?.data_use_bar?.value,
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
                  <p className="opacity-70">{t("Active Subscription")}</p>
                </div>

                <div className="px-4 py-1 rounded-full flex items-center bg-violet-50 gap-2 text-xs">
                  <h1 className="text-2xl font-semibold">{mainData?.subscriptions?.active_total}</h1>
                </div>
              </div>

              <div className="flex justify-between gap-4">
                <EChart
                  height="h-[100px]"
                  type="pie_donut"
                  options={{
                    data: [
                      { value: mainData?.subscriptions?.active_total, name: t("total") },
                      { value: mainData?.subscriptions?.active_percentage, name: t("active") },
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
                  <p className="opacity-70">{t("Canceled Subscription")}</p>
                </div>

                <div className="px-4 py-1 rounded-full flex items-center bg-violet-50 gap-2 text-xs">
                  <h1 className="text-2xl font-semibold">{mainData?.subscriptions?.canceled_total}</h1>
                </div>
              </div>

              <div className="flex justify-between gap-4">
                <EChart
                  height="h-[100px]"
                  type="pie_donut"
                  options={{
                    data: [
                      { value: mainData?.subscriptions?.canceled_total, name: t("active") },
                      { value: mainData?.subscriptions?.canceled_percentage, name: t("canceled") },
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
                  <p className="opacity-70">{t("Total Tool Launches")}</p>
                </div>

                <div className="px-4 py-1 rounded-full flex items-center bg-violet-50 gap-2 text-xs">
                  <h1 className="text-2xl font-semibold">{mainData?.tool_launches?.total}</h1>
                </div>
              </div>

              <div className="flex justify-between gap-4">
                <EChart
                  height="h-[100px]"
                  type="pie_donut"
                  options={{
                    data: [
                      { value: mainData?.tool_launches?.success_percentage, name: t("Success") },
                      { value: mainData?.tool_launches?.failed_percentage, name: t("Failed") },
                    ],
                    tooltip: {
                      name: "Total",
                    },
                    colors: ["#e12afb", "#7f22fe"],
                    gradientTopColor: "rgb(22, 36, 86,0.2)",
                    gradientBottomColor: "rgb(22, 36, 86,0)",
                  }}
                />
                <div className="flex items-center">
                  <Button url="#" showIcon border="rounded" px="px-2" py="py-1.5"></Button>
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
                    <p className="opacity-70">{t("Tool Access Activities")}</p>
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
                  data: mainData?.charts?.access_activities_area,
                  tooltip: {
                    name: "Activities",
                  },
                  colors: ["#e12afb", "yellow"],
                  gradientTopColor: "rgb(22, 36, 86,0.2)",
                  gradientBottomColor: "rgb(22, 36, 86,0)",
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-8 bg-white rounded-lg ">
                  <div className="h-full flex items-center gap-2 pl-8">
                    <SvgIcon name="attach_money" className="bg-violet-50 text-violet-500 size-10 p-2 rounded-full border border-violet-200" />
                    <div>
                      <h1 className="text-xl font-semibold">$ {mainData?.billing?.total_spent}</h1>
                      <p className="opacity-70">{t("Total Spent")}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 bg-white rounded-lg p-5">
                  <div className="flex items-center gap-2">
                    <SvgIcon name="calendar_month" className="bg-violet-50 text-violet-500 size-10 p-2 rounded-full border border-violet-200" />
                    <div>
                      <p className="opacity-70">{t("Next Payment Dates")}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {Array.isArray(mainData?.billing?.next_payment_dates) &&
                      mainData?.billing?.next_payment_dates.map((itm: any, indx: any) => (
                        <div className="px-2 py-1 rounded-full bg-violet-100 text-xs w-max" key={indx}>
                          {itm}
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-8 bg-white rounded-lg ">
                  <div className="h-full flex items-center gap-2 pl-8">
                    <SvgIcon name="credit_card" className="bg-violet-50 text-violet-500 size-10 p-2 rounded-full border border-violet-200" />
                    <div>
                      <h1 className="text-xl font-semibold">{mainData?.billing?.payment_cards_count}</h1>
                      <p className="opacity-70">{t("Connected Cards")}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-8 bg-white rounded-lg ">
                  <div className="h-full flex items-center gap-2 pl-8">
                    <SvgIcon name="attach_money" className="bg-violet-50 text-violet-500 size-10 p-2 rounded-full border border-violet-200" />
                    <div>
                      <h1 className="text-xl font-semibold">$ {mainData?.billing?.next_payment_amount}</h1>
                      <p className="opacity-70">{t("Upcoming Payment")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

export default UserDashboardPage;
