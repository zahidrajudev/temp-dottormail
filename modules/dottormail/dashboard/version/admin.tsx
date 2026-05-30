import Head from "next/head";
import { useEffect, useState } from "react";
import Api from "@/lib/api";
import Section from "@/modules/global/elements/section";
import EChart from "@/modules/global/partial/echart";
import SvgIcon from "@/modules/global/icons/svg_icons";
import { checkPermission, formatNumber } from "@/lib/helper";
import ProfileDropdown from "@/modules/global/widget/profile_dropdown";
import Table from "@/modules/global/elements/table";
import Link from "next/link";
import Select from "@/modules/global/input/select";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { useCurrencyStore } from "@/modules/currency/store/useCurrencyStore";

function DottormailAdmindashboard() {
  const { appPermissions, hasPermission } = useAuthStore();
  const { formatPrice } = useCurrencyStore();
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState(7);

  const [transactions, setTransactions] = useState<any>("");

  const [stats, setStats] = useState<any>("");
  const [pieData, setPieData] = useState<any>([]);
  const [chartData, setChartData] = useState<any>([]);

  const getInitialdataLoad = async () => {
    setLoading(true);
    const url = "v1/dashboard/insight/admin";
    await Api.post(url, { days: period })
      .then((res) => {
        const res_data: any = res.data?.data;
        if (res_data) {
          setStats([
            { icon: "person", name: "Total Users", value: res_data?.total_users },
            { icon: "attach_money", name: "Total Earning", value: formatPrice(res_data?.total_revenue) },
            { icon: "mail", name: "Total Emails", value: res_data?.total_emails },
            { icon: "network_node", name: "Total Packages", value: res_data?.total_pkg },
          ]);
          setPieData([
            { name: `Total (${res_data?.total_emails})`, value: res_data?.total_emails },
            { name: `Checked (${res_data?.total_checked})`, value: res_data?.total_checked + 30 },
            { name: `Unchecked (${res_data?.total_unchecked})`, value: res_data?.total_unchecked },
            { name: `Valid (${res_data?.total_valid})`, value: res_data?.total_valid + 20 },
            { name: `Invalid (${res_data?.total_invalid})`, value: res_data?.total_invalid + 35 },
          ]);
        }
        setTransactions(res.data.transactions);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const chartList = [
    { name: "Total Users", value: "users" },
    { name: "Press Realease", value: "press_releases" },
    { name: "Articles", value: "posts" },
    { name: "Transactions", value: "transactions" },
  ];

  const [activeNow, setActiveNow] = useState("users");

  const getChartData = async (value: string) => {
    const url = "v1/dashboard/insight/chart";
    await Api.post(url, { days: period, table: value })
      .then((res) => {
        setChartData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getInitialdataLoad();
    getChartData("transactions");
  }, [period]);

  const prepareTableData = (data: any[]) => {
    if (!Array.isArray(data)) {
      return [];
    }
    const tableData = data.map((dat) => ({
      id: dat.id,
      invoice: dat?.invoice,
      gateway: dat?.gateway?.translate?.name,
      amount: formatNumber(dat.amount) + " " + dat?.currency,
      quantity: dat.qty,
      status:
        (dat.status === 0 && <div className="text-yellow-600 bg-yellow-100 w-max px-4 py-1.5 rounded-full">Pending</div>) ||
        (dat.status == 1 && <div className="text-green-700 bg-green-200 w-max px-4 py-1.5 rounded-full">Paid</div>) ||
        (dat.status == 2 && <div className="text-red-500 bg-red-200 w-max px-4 py-1.5 rounded-full">Failed</div>) ||
        (dat.status == 3 && <div className="text-blue-600 bg-blue-200 w-max px-4 py-1.5 rounded-full">Refunded</div>) ||
        (dat.status == 4 && <div className="text-yellow-600 bg-yellow-200 w-max px-4 py-1.5 rounded-full">Processing</div>),
      type:
        (dat.itm_other === "pkg" && <div className="text-blue-600 bg-blue-100 w-max px-4 py-1.5 rounded-full">Package</div>) ||
        (dat.itm_other === "addon" && <div className="text-blue-600 bg-blue-100 w-max px-4 py-1.5 rounded-full">Addon</div>) ||
        (dat.itm_other === "prd" && <div className="text-blue-600 bg-blue-100 w-max px-4 py-1.5 rounded-full">Product</div>),
      "Last Activity _date": dat.updated_at,
      action: (
        <div className="text-xs flex justify-end" title="View">
          <Link
            href="/dashboard/transaction"
            className="rounded bg-cyan-600 text-white hover:bg-teal-700 px-2 py-1.5 flex items-center gap-1 text-[14px] cursor-pointer group"
          >
            View
            <SvgIcon name="arrow_right_alt" className="size-4 -rotate-45 group-hover:rotate-0" />
          </Link>
        </div>
      ),
    }));

    return tableData;
  };

  return (
    <Section className="space-y-8 p-4 md:p-6 lg:p-8 bg-slate-50/50 min-h-screen rounded-[32px]" permission={hasPermission("dashboard.admin")} loading={loading}>
      {/* Top Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-5 bg-white p-4 rounded-[24px] shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 pl-2">
          <div className="p-2 bg-teal-50 rounded-xl text-teal-600">
            <SvgIcon name="dashboard" className="size-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 hidden sm:block">Dashboard Overview</h1>
        </div>

        <div className="w-full sm:w-auto">
          <div className="w-full sm:w-56 bg-slate-50 border border-slate-200 rounded-xl hover:border-teal-300 transition-colors">
            <Select
              items={[
                { id: 7, name: "Last 7 Days" },
                { id: 15, name: "Last 15 Days" },
                { id: 30, name: "Last 1 Month" },
                { id: 90, name: "Last 3 Months" },
                { id: 180, name: "Last 6 Months" },
                { id: 365, name: "Last 1 Year" },
              ]}
              value={period}
              setValue={setPeriod}
              labelShow={false}
              extraClass="border-none py-2.5 bg-transparent shadow-none focus:ring-0 font-medium text-slate-700"
              dropdownItemExtraClass="text-[13px] sm:text-sm font-medium"
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {Array.isArray(stats) &&
          stats.map((item: any, index: number) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-[24px] bg-white p-6 shadow-sm border border-slate-100 group hover:shadow-md hover:border-teal-200 transition-all duration-300"
            >
              {/* Decorative background blur element */}
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-cyan-100/40 to-emerald-100/40 blur-2xl group-hover:scale-150 transition-transform duration-700 z-0" />

              <div className="flex items-center gap-5 relative z-10">
                <div className="flex items-center justify-center size-14 shrink-0 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/25 group-hover:scale-105 transition-transform duration-300">
                  <SvgIcon name={item.icon} className="size-7" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item?.name}</p>
                  <p className="text-2xl font-extrabold text-slate-800 tracking-tight truncate">{item?.value}</p>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Line Chart */}
        <div className="lg:col-span-2 p-6 bg-white rounded-[24px] shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="flex justify-between items-center mb-6 relative z-10">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Sales Revenue Overview</h2>
              <p className="text-sm text-slate-500 mt-1">Performance metrics over selected period</p>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <SvgIcon name="trending_up" className="size-6" />
            </div>
          </div>

          <div className="w-full overflow-hidden relative z-10">
            <EChart
              height="h-[340px]"
              type="line_area"
              options={{
                data: chartData,
                tooltip: {
                  name: "Total Sale ($)",
                },
                // Adjusted to brand colors: Teal & Emerald
                colors: ["#0d9488", "#10b981"],
                gradientTopColor: "rgba(20, 184, 166, 0.25)",
                gradientBottomColor: "rgba(20, 184, 166, 0)",
              }}
            />
          </div>
        </div>

        {/* Emails Pie Chart */}
        <div className="p-6 bg-white rounded-[24px] shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="mb-2 text-center">
            <h2 className="text-lg font-bold text-slate-800">Email Database Status</h2>
            <p className="text-sm text-slate-500 mt-1">Distribution of current lists</p>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <EChart
              height="h-[320px]"
              type="pie"
              options={{
                name: "Email List",
                data: pieData,
                // Custom brand palette: Cyan, Teal, Emerald, Neutral Slate, Alert Rose
                colors: ["#06b6d4", "#14b8a6", "#10b981", "#64748b", "#f43f5e"],
              }}
            />
          </div>
        </div>
      </div>

      {/* Latest Transactions Table */}
      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-cyan-50 rounded-xl text-cyan-600">
            <SvgIcon name="receipt_long" className="size-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Latest Billing & Payments</h2>
            <p className="text-sm text-slate-500 mt-0.5">Recent financial transactions and invoice statuses</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-100">
          <Table
            data={prepareTableData(transactions)}
            loading={loading}
            showHeading={false}
            showMark={false}
            excludeKeys={["id"]}
            headerBg="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100"
          />
        </div>
      </div>
    </Section>
  );
}

export default DottormailAdmindashboard;
