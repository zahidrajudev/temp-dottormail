import api from "@/lib/api";
import { dateTimeFormat, getQueryParam } from "@/lib/helper";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { useCurrencyStore } from "@/modules/currency/store/useCurrencyStore";
import Section from "@/modules/global/elements/section";
import Table from "@/modules/global/elements/table";
import SvgIcon from "@/modules/global/icons/svg_icons";
import { useLanguageStore } from "@/modules/language/store/useLanguageStore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function TransactionInvoicePage() {
  const { hasPermission } = useAuthStore();
  const router = useRouter();
  const { appSelectedLocale, appDefaultLocale } = useLanguageStore();
  const { formatPrice } = useCurrencyStore();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mainData, setMainData] = useState<any>("");

  const [refresh, setRefresh] = useState(0);
  const refreshPage = () => {
    setRefresh((prev) => prev + 1);
  };

  const [actionID, setActionID] = useState<any>(null);

  const getInitialData = async (id: any) => {
    setLoading(true);
    let url = "v1/dashboard/transaction/view";
    let data = { id };
    await api
      .post(url, data)
      .then((res) => {
        setLoading(false);
        setMainData(res.data.data);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err?.response?.data?.message);
      });
  };

  useEffect(() => {
    const id = getQueryParam("id");
    if (!id) {
      toast.error("Error: Valid url not found");
      router.back();
    }
    setActionID(id);
    getInitialData(id);
  }, [refresh]);

  const printStatus = (_status: number) => {
    if (_status == 0) {
      return (
        <div className="pl-2 pr-3 py-1 rounded-full bg-gray-500/5 border border-gray-700 w-max text-gray-700 font-semibold">
          <SvgIcon name="info" className="size-4" filled />
          <div className="inline border-l border-gray-700 ms-2 pl-2 text-gray-700 text-xs">Pending</div>
        </div>
      );
    }
    if (_status == 1) {
      return (
        <div className="pl-2 pr-3 py-1 rounded-full bg-green-500/5 border border-green-700 w-max text-green-700 font-semibold">
          <SvgIcon name="check" className="size-4" filled />
          <div className="inline border-l border-green-700 ms-2 pl-2 text-green-700 text-xs">Paid</div>
        </div>
      );
    }
    if (_status == 2) {
      return (
        <div className="pl-2 pr-3 py-1 rounded-full bg-red-500/5 border border-red-500 w-max text-red-600 font-semibold">
          <SvgIcon name="close" className="size-4" filled />
          <div className="inline border-l border-red-500 ms-2 pl-2 text-xs">Failed</div>
        </div>
      );
    }
    if (_status == 3) {
      return (
        <div className="pl-2 pr-3 py-1 rounded-full bg-blue-500/5 border border-blue-500 w-max text-blue-600 font-semibold">
          <SvgIcon name="check" className="size-4" filled />
          <div className="inline border-l border-blue-500 ms-2 pl-2 text-xs">Refunded</div>
        </div>
      );
    }
    if (_status == 4) {
      return (
        <div className="pl-2 pr-3 py-1 rounded-full bg-yellow-500/5 border border-yellow-500 w-max text-yellow-600 font-semibold">
          <SvgIcon name="info" className="size-4" filled />
          <div className="inline border-l border-yellow-500 ms-2 pl-2 text-xs">Processing</div>
        </div>
      );
    }
  };

  const printSubscriptionStatus = (val: number) => {
    if (val == 0) {
      return <div className="px-4 py-2 rounded-full bg-red-50 text-red-700 font-semibold w-max">Canceled</div>;
    }
    if (val == 1) {
      return <div className="px-4 py-2 rounded-full bg-green-50 text-green-700 font-semibold w-max">Active</div>;
    }
  };

  return (
    <Section permission={hasPermission("transaction.view")} loading={loading} className="bg-white p-8 border border-gray-200 rounded-lg space-y-10">
      <div className="flex justify-center">
        <div className="px-4 py-2 bg-violet-50 font-semibold text-2xl rounded-full">Transaction / Invoice Overview</div>
      </div>
      <div className="grid grid-cols-2 gap-10">
        <div className="border border-violet-200 p-10 rounded-lg">
          <h1 className="text-lg font-semibold px-10">Transaction Details</h1>
          <Table
            data={[
              { id: 1, name: "Invoice:", value: mainData?.invoice },
              { id: 1, name: "Status:", value: printStatus(mainData?.status) },
              { id: 1, name: "Amount:", value: formatPrice(mainData?.amount) },
              { id: 1, name: "Charge Type:", value: mainData?.type == 1 ? "Item Sale" : "Subscription" },
              { id: 1, name: "Date:", value: dateTimeFormat(mainData?.created_at, "day monthShort year hour:minute:second ampm") },
            ]}
            loading={false}
            showMark={false}
            showHeading={false}
            excludeKeys={["id"]}
            showDelete={hasPermission("user.delete")}
          />
        </div>
        {mainData?.subscription && (
          <div className="border border-violet-200 p-10 rounded-lg">
            <h1 className="text-lg font-semibold px-10">Subscription Details</h1>
            <Table
              data={[
                { id: 1, name: "Name:", value: mainData?.subscription?.package?.name },
                { id: 1, name: "Amount:", value: formatPrice(mainData?.subscription?.package?.price) },
                { id: 1, name: "Recurring:", value: mainData?.subscription?.recurring },
                { id: 1, name: "Current Status:", value: printSubscriptionStatus(mainData?.subscription?.status) },
                {
                  id: 1,
                  name: "Next Payment Date:",
                  value:
                    mainData?.subscription?.status == 1 ? dateTimeFormat(mainData?.subscription?.current_period_end, "day monthShort year hour:minute:second ampm") : "-",
                },
              ]}
              loading={false}
              showMark={false}
              showHeading={false}
              excludeKeys={["id"]}
              showDelete={hasPermission("user.delete")}
            />
          </div>
        )}
        {mainData?.subscription?.package ? (
          <div className="border border-violet-200 p-10 rounded-lg">
            <h1 className="text-lg font-semibold px-10">Item Details</h1>
            <Table
              data={[
                { id: 1, name: "Name:", value: mainData?.subscription?.package?.name },
                { id: 1, name: "Description:", value: mainData?.subscription?.package?.des },
                { id: 1, name: "Price:", value: formatPrice(mainData?.subscription?.package?.price) },
              ]}
              loading={false}
              showMark={false}
              showHeading={false}
              excludeKeys={["id"]}
              showDelete={hasPermission("user.delete")}
            />
          </div>
        ) : (
          <div className="border border-violet-200 p-10 rounded-lg">
            <h1 className="text-lg font-semibold px-10">Item Details</h1>
            <Table
              data={[
                { id: 1, name: "Name:", value: mainData?.package?.name },
                { id: 1, name: "Description:", value: mainData?.package?.des },
                { id: 1, name: "Price:", value: formatPrice(mainData?.package?.price) },
                { id: 1, name: "Credit:", value: mainData?.package?.credit },
              ]}
              loading={false}
              showMark={false}
              showHeading={false}
              excludeKeys={["id"]}
              showDelete={hasPermission("user.delete")}
            />
          </div>
        )}
        <div className="border border-violet-200 p-10 rounded-lg">
          <h1 className="text-lg font-semibold px-10">Customer Details</h1>
          <Table
            data={[
              { id: 1, name: "Name:", value: mainData?.user?.name },
              { id: 1, name: "Email:", value: mainData?.user?.email },
            ]}
            loading={false}
            showMark={false}
            showHeading={false}
            excludeKeys={["id"]}
            showDelete={hasPermission("user.delete")}
          />
          <div className="px-9">
            <div className="p-4 bg-violet-50">
              Only <b>{mainData?.user?.name}</b> is the valided customer for this invoice.
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

export default TransactionInvoicePage;
