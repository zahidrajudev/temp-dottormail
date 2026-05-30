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

interface MainData {
  id: string;
  updated_at?: string;
  card_brand?: string;
  card_number?: string;
  is_default?: number;
  card_exp_month?: string;
  card_exp_year?: string;
}

function CardListPage() {
  const { hasPermission } = useAuthStore();
  const { appSelectedLocale } = useLanguageStore();
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
  const [deleteID, setDeleteID] = useState<any>(null);

  const handleRemoveCard = async () => {
    try {
      let url = "v1/dashboard/payment-card/permanent-delete";
      //let url = "v1/dashboard/gateway/permanent-delete";

      if (checkErrors({ url, deleteID }, setErrors)) {
        return;
      }
      setLoading(true);
      await api
        .post(url, { id: deleteID })
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

  const makeDefaultCard = async (id: any) => {
    try {
      let url = "v1/dashboard/payment-card/make-default";
      if (checkErrors({ url, id }, setErrors)) {
        return;
      }
      setLoading(true);
      await api
        .post(url, { id })
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
    };
    let url = "v1/dashboard/payment-card";
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
      handleRemoveCard();
    }
    if (action_type == "delete_no") {
      setDeleteConfirm(false);
    }
  };

  const prepareTableData = (data: MainData[]) => {
    const tableData = data.map((dat) => ({
      id: dat.id,
      Brand: (
        <div className="flex items-center gap-2">
          <SvgIcon name="credit_card" className="size-10 text-fuchsia-500" />
          <p className="text-xl font-semibold">{dat?.card_brand}</p>
        </div>
      ),
      "Card number": `XXXX XXXX ${dat?.card_number}`,
      "Card Expire": `${dat?.card_exp_month} / ${dat?.card_exp_year}`,
      "default payment method":
        dat.is_default == 1 ? (
          <div className="pl-2 pr-3 py-1 rounded-full bg-green-500/5 border border-green-700 w-max text-green-700 font-semibold">
            <SvgIcon name="check" className="size-4" filled />
            <div className="inline border-l border-green-700 ms-2 pl-2 text-green-700 text-xs">Yes</div>
          </div>
        ) : (
          <div className="pl-2 pr-3 py-1 rounded-full bg-red-500/5 border border-red-500 w-max text-red-600 font-semibold">
            <SvgIcon name="close" className="size-4" filled />
            <div className="inline border-l border-red-500 ms-2 pl-2 text-xs">No</div>
          </div>
        ),
      "Card Added _date": dat.updated_at,
      action: hasPermission("card.edit") && (
        <div className="text-xs flex items-center gap-4" onClick={() => actionManager("open_update", dat.id)} title="Edit">
          {dat?.is_default == 0 && (
            <Button onClick={() => makeDefaultCard(dat?.id)} showIcon iconName="check" px="px-3" py="py-1.5">
              Make Default
            </Button>
          )}
          <Button
            onClick={() => {
              setDeleteConfirm(true);
              setDeleteID(dat?.id);
            }}
            showIcon
            iconName="delete"
            px="px-3"
            py="py-1.5"
          >
            Remove
          </Button>
        </div>
      ),
    }));

    return tableData;
  };

  const syncCards = async () => {
    try {
      let url = "v1/dashboard/payment-card/sync-cards";
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
      permission={hasPermission("card.view")}
      loading={loading}
      confirmation={deleteConfirm}
      confirmation_yes={() => actionManager("delete_yes")}
      confirmation_no={() => actionManager("delete_no")}
      className="space-y-6"
    >
      <div className="bg-white rounded-lg">
        <div className="flex gap-4 pl-8 pt-4 -mb-4">
          <Button url="/dashboard/subscription/card/add" showIcon iconName="add" border="rounded" px="px-3" py="py-1.5">
            Add New Card
          </Button>
          <Button onClick={syncCards} showIcon iconName="sync" border="rounded" px="px-3" py="py-1.5">
            Refresh Cards
          </Button>
        </div>
        <Table
          data={prepareTableData(mainData)}
          loading={false}
          showMark={false}
          markItems={marks}
          setMarkItems={setMarks}
          excludeKeys={["id"]}
          showDelete={hasPermission("card.delete")}
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

export default CardListPage;
