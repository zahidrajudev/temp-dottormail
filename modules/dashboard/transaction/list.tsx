import { useEffect, useState } from "react";
import Section from "@/modules/global/elements/section";
import Select from "@/modules/global/input/select";
import SvgIcon from "@/modules/global/icons/svg_icons";
import Table from "@/modules/global/elements/table";
import Pagination from "@/modules/global/elements/pagination";
import api from "@/lib/api";
import Input from "@/modules/global/input/input";
import Drawer from "@/modules/global/elements/drawer";
import { checkErrors } from "@/lib/helper";
import { useLanguageStore } from "@/modules/language/store/useLanguageStore";
import { toast } from "sonner";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import Button from "@/modules/global/elements/button";
import { useCurrencyStore } from "@/modules/currency/store/useCurrencyStore";

interface MainData {
  id: number;
  amount?: number;
  is_default?: number;
  status: number;
  last_payment_at?: string;
  created_at?: string;
  recurring?: string;
  package?: {
    name?: string;
  };
  invoice?: string;
  subscription?: {
    package?: {
      name?: string;
    };
  };
}

function TransactionListPage() {
  const { hasPermission } = useAuthStore();
  const { appSelectedLocale } = useLanguageStore();
  const { formatPrice } = useCurrencyStore();
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [marks, setMarks] = useState<any[]>([]);
  const [filterShow, setFilterShow] = useState(false);
  const [mainData, setMainData] = useState<MainData[]>([]);

  const [refresh, setRefresh] = useState(0);
  const refreshPage = () => {
    setRefresh((prev) => prev + 1);
  };
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginateInfo, setPaginateInfo] = useState("");

  const handleTrash = async () => {
    try {
      let url = "v1/dashboard/user/soft-delete";
      //let url = "v1/dashboard/gateway/permanent-delete";

      if (checkErrors({ url, marks }, setErrors)) {
        return;
      }
      setLoading(true);
      await api
        .post(url, { marks })
        .then((res) => {
          refreshPage();
          setMarks([]);
          toast.success(res.data?.message);
          setLoading(false);
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message);
          setLoading(false);
        });
    } catch (error) {}
  };

  const handleMakeDefault = async (id: number) => {
    setLoading(true);
    let data = { id };
    let url = "v1/dashboard/subscription/make-default";
    await api
      .post(url, data)
      .then((res) => {
        setLoading(false);
        refreshPage();
        toast.success(res?.data?.message);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err?.response?.data?.message);
      });
  };

  const handleCancel = async (id: number) => {
    setLoading(true);
    let data = { id };
    let url = "v1/dashboard/subscription/cancel";
    await api
      .post(url, data)
      .then((res) => {
        setLoading(false);
        refreshPage();
        toast.success(res?.data?.message);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err?.response?.data?.message);
      });
  };

  const [roleList, setRoleList] = useState<any[]>([]);
  // Search strings
  const [searchName, setSearchName] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [searchVerified, setSearchVerified] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchRole, setSearchRole] = useState("");
  const [searchDateFrom, setSearchDateFrom] = useState("");
  const [searchDateTo, setSearchDateTo] = useState("");

  const getInitialData = async () => {
    setLoading(true);
    let data = {
      page: currentPage,
      name: searchName,
      status: searchStatus,
      verified: searchVerified,
      email: searchEmail,
      role: searchRole,
      from: searchDateFrom,
      to: searchDateTo,
    };
    let url = "v1/dashboard/transaction";
    await api
      .post(url, data)
      .then((res) => {
        setLoading(false);
        setMainData(res.data.data.data);
        setTotalPage(res.data.data.last_page);
        setPaginateInfo(res.data.data.to + " out of " + res.data.data.total);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err?.response?.data?.message);
      });
  };

  useEffect(() => {
    getInitialData();
  }, [refresh, currentPage, appSelectedLocale]);

  const actionManager = (action_type: string, action_value?: any) => {
    if (action_type == "delete_confirmation") {
      setDeleteConfirm(true);
    }
    if (action_type == "delete_yes") {
      setDeleteConfirm(false);
      handleTrash();
    }
    if (action_type == "delete_no") {
      setDeleteConfirm(false);
    }
  };

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

  const prepareTableData = (data: MainData[]) => {
    const tableData = data.map((dat) => ({
      id: dat.id,
      invoice: dat?.invoice,
      amount: formatPrice(dat?.amount),
      status: printStatus(dat?.status),
      "charge for": dat?.package?.name,
      "Payment At _date": dat?.created_at,
      action: hasPermission("transaction.view") && (
        <div className="text-xs flex items-center gap-4" onClick={() => actionManager("open_update", dat.id)} title="Edit">
          <Button url={`/dashboard/transaction/invoice?id=${dat.id}`} showIcon border="rounded">
            View
          </Button>
        </div>
      ),
    }));

    return tableData;
  };

  const syncSubscription = async () => {
    try {
      let url = "v1/dashboard/subscription/sync-subscriptions";
      setLoading(true);
      await api
        .post(url)
        .then((res) => {
          refreshPage();
          toast.success(res.data?.message);
          setLoading(false);
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message);
          setLoading(false);
        });
    } catch (error) {}
  };

  return (
    <Section
      permission={hasPermission("transaction.view")}
      loading={loading}
      confirmation={deleteConfirm}
      confirmation_yes={() => actionManager("delete_yes")}
      confirmation_no={() => actionManager("delete_no")}
      className="space-y-6"
    >
      <Table
        data={prepareTableData(mainData)}
        loading={false}
        showMark={false}
        markItems={marks}
        setMarkItems={setMarks}
        excludeKeys={["id"]}
        showDelete={hasPermission("transaction.delete")}
        handleDelete={() => actionManager("delete_confirmation")}
      />

      <Pagination
        design={2}
        currentPage={currentPage}
        totalPages={totalPage}
        onPageChange={setCurrentPage}
        siblingCount={1}
        paginateInfo={""}
        className="text-sm font-semibold bg-white rounded-lg p-3 mt-1"
      />

      <Drawer position="right" permission={hasPermission("transaction.view")} loading={loading} show={filterShow} set_show={setFilterShow}>
        <div className="flex flex-col justify-between h-full">
          <div className="p-4 text-xl font-semibold bg-blue-950 text-white">Filter</div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="grid grid-cols-1 gap-5 text-sm">
              <Input value={searchName} setValue={setSearchName} label="Name" id="searchname" iconName="person" errorMessage={errors?.searchName} />
              <Input value={searchEmail} setValue={setSearchEmail} label="Email" id="searchemail" iconName="mail" errorMessage={errors?.searchEmail} />

              <Select items={roleList} value={searchRole} setValue={setSearchRole} showUnselect label="Role" id="searchRole" errorMessage={errors?.searchStatus} />

              <Select
                items={[
                  { name: "Active", id: 1 },
                  { name: "Inactive", id: 0 },
                ]}
                value={searchStatus}
                setValue={setSearchStatus}
                showUnselect
                label="Acount Status"
                id="searchacount_status"
                errorMessage={errors?.searchStatus}
              />
              <Select
                items={[
                  { name: "Verified", id: 1 },
                  { name: "Unverified", id: 0 },
                ]}
                value={searchVerified}
                setValue={setSearchVerified}
                showUnselect
                label="Email Status"
                id="searchemail_status"
                errorMessage={errors?.searchVerified}
              />
              <Input type="date" value={searchDateFrom} setValue={setSearchDateFrom} label="From" iconShow={false} id="searchdate_from" />
              <Input type="date" value={searchDateTo} setValue={setSearchDateTo} label="To" iconShow={false} id="searchdate_to" />
            </div>
          </div>
          <div onClick={getInitialData} className="p-4 text-2xl font-semibold bg-blue-950 hover:bg-blue-800 text-white cursor-pointer">
            <SvgIcon name="tune" /> Submit
          </div>
        </div>
      </Drawer>
    </Section>
  );
}

export default TransactionListPage;
