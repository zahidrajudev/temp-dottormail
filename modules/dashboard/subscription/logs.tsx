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
  message?: any;
  des?: any;
}

function SubscriptionLogsPage() {
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

  const handleDeleteLogs = async () => {
    setLoading(true);
    let url = "v1/dashboard/subscription/logs/clear";
    await api
      .post(url)
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
      from: searchDateFrom,
      to: searchDateTo,
    };
    let url = "v1/dashboard/subscription/logs";
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

  const prepareTableData = (data: MainData[]) => {
    const tableData = data.map((dat) => ({
      id: dat.id,
      status:
        dat.status == 1 ? (
          <div className="pl-2 pr-3 py-1 rounded-full bg-green-500/5 border border-green-700 w-max text-green-700 font-semibold">
            <SvgIcon name="check" className="size-4" filled />
            <div className="inline border-l border-green-700 ms-2 pl-2 text-green-700 text-xs">Success</div>
          </div>
        ) : (
          <div className="pl-2 pr-3 py-1 rounded-full bg-red-500/5 border border-red-500 w-max text-red-600 font-semibold">
            <SvgIcon name="close" className="size-4" filled />
            <div className="inline border-l border-red-500 ms-2 pl-2 text-xs">Failed</div>
          </div>
        ),
      message: (
        <div>
          <p className="font-semibold">{dat?.message}</p>
          <p className="opacity-70">{dat?.des}</p>
        </div>
      ),
      "Date & Time _date": dat?.created_at,
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
      permission={hasPermission("subscription.view")}
      loading={loading}
      confirmation={deleteConfirm}
      confirmation_yes={() => actionManager("delete_yes")}
      confirmation_no={() => actionManager("delete_no")}
      className="space-y-6"
    >
      <div className="flex gap-4"></div>

      <div className="bg-white rounded-lg">
        <div className="flex gap-4 pl-8 pt-4 -mb-4">
          <Button onClick={handleDeleteLogs} showIcon iconName="delete" border="rounded" px="px-3" py="py-1.5">
            Remove All Logs
          </Button>
          <Button onClick={refreshPage} showIcon iconName="sync" border="rounded" px="px-3" py="py-1.5">
            Refresh Logs
          </Button>
        </div>
        <Table
          data={prepareTableData(mainData)}
          loading={false}
          showMark={false}
          markItems={marks}
          setMarkItems={setMarks}
          excludeKeys={["id"]}
          showDelete={hasPermission("subscription.delete")}
          handleDelete={() => actionManager("delete_confirmation")}
        />
      </div>
      <Pagination
        design={2}
        currentPage={currentPage}
        totalPages={totalPage}
        onPageChange={setCurrentPage}
        siblingCount={1}
        paginateInfo={""}
        className="text-sm font-semibold bg-white rounded-lg p-3 mt-1"
      />

      <Drawer position="right" permission={hasPermission("user.view")} loading={loading} show={filterShow} set_show={setFilterShow}>
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

export default SubscriptionLogsPage;
