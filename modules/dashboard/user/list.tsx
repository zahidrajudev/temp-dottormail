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
import pageTranslation from "@/modules/language/components/PageTranslation";
import SubHeader from "@/modules/global/widget/sub_header";
import UserListTranslation from "./translation/list";

interface UserData {
  id: string;
  email?: string;
  email_verified?: number;
  status: number;
  updated_at?: string;
  phone?: string;
  username?: string;
  role_id?: string;
  name?: string;
  email_verified_at?: string;
  translate?: {
    name?: string;
    about?: string;
    address?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
  role?: {
    name?: string;
  };
  social_links?: string;
}

function UserListPage() {
  const { hasPermission } = useAuthStore();
  const pageName = "user_list";
  const { appSelectedLocale } = useLanguageStore();
  const { t } = pageTranslation(pageName, appSelectedLocale?.code ?? "en");
  const [showTranslation, setShowTranslation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [marks, setMarks] = useState<any[]>([]);
  const [filterShow, setFilterShow] = useState(false);
  const [mainData, setMainData] = useState<UserData[]>([]);

  const [refresh, setRefresh] = useState(0);
  const refreshPage = () => {
    setRefresh((prev) => prev + 1);
  };
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginateInfo, setPaginateInfo] = useState("");

  const handleTrash = async () => {
    try {
      let url = "user/soft-delete";

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

  const handlePermanentDelete = async () => {
    try {
      let url = "v1/dashboard/user/permanent-delete";

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
    let url = "v1/dashboard/user";
    await api
      .post(url, data)
      .then((res) => {
        setLoading(false);
        setMainData(res.data.data.data);
        setRoleList(res.data.role);
        console.log(res.data.role);
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
      handlePermanentDelete();
    }
    if (action_type == "delete_no") {
      setDeleteConfirm(false);
    }
  };

  const prepareTableData = (data: UserData[]) => {
    const tableData = data.map((dat) => ({
      id: dat.id,
      [t("name")]: dat?.name,
      [t("email")]: dat?.email,
      [t("email_status")]: dat.email_verified_at ? (
        <div className="pl-2 pr-3 py-1 rounded-full bg-green-500/5 border border-green-700 w-max text-green-700 font-semibold">
          <SvgIcon name="check" className="size-4" filled />
          <div className="inline border-l border-green-700 ms-2 pl-2 text-green-700 text-xs">{t("unverified")}</div>
        </div>
      ) : (
        <div className="pl-2 pr-3 py-1 rounded-full bg-red-500/5 border border-red-500 w-max text-red-600 font-semibold">
          <SvgIcon name="close" className="size-4" filled />
          <div className="inline border-l border-red-500 ms-2 pl-2 text-xs">{t("unverified")}</div>
        </div>
      ),
      [t("role")]: dat?.role?.name,
      "account status":
        dat.status === 1 ? (
          <div className="pl-2 pr-3 py-1 rounded-full bg-green-500/5 border border-green-700 w-max text-green-700 font-semibold">
            <SvgIcon name="check" className="size-4" filled />
            <div className="inline border-l border-green-700 ms-2 pl-2 text-green-700 text-xs">{t("active")}</div>
          </div>
        ) : (
          <div className="pl-2 pr-3 py-1 rounded-full bg-red-500/5 border border-red-500 w-max text-red-600 font-semibold">
            <SvgIcon name="close" className="size-4" filled />
            <div className="inline border-l border-red-500 ms-2 pl-2 text-xs">{t("inactive")}</div>
          </div>
        ),
      [`${t("last_activity")} _date`]: dat.updated_at,
      [t("action")]: hasPermission("user.edit") && (
        <div className="text-xs" onClick={() => actionManager("open_update", dat.id)} title="Edit">
          <Button url={`/dashboard/user/edit?id=${dat.id}`} showIcon iconName="edit_note" px="px-3" py="py-1.5">
            {t("edit")}
          </Button>
        </div>
      ),
    }));

    return tableData;
  };

  return (
    <>
      <SubHeader title={t(pageName)} showTranslationIcon TranslationIconAction={() => setShowTranslation(true)} />
      <Section
        permission={hasPermission("user.view")}
        loading={loading}
        confirmation={deleteConfirm}
        confirmation_yes={() => actionManager("delete_yes")}
        confirmation_no={() => actionManager("delete_no")}
        className="space-y-6"
      >
        <Table
          data={prepareTableData(mainData)}
          loading={false}
          showMark={true}
          markItems={marks}
          setMarkItems={setMarks}
          excludeKeys={["id"]}
          showDelete={hasPermission("user.delete")}
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

        <Drawer position="right" permission={hasPermission("user.view")} loading={loading} show={filterShow} set_show={setFilterShow}>
          <div className="flex flex-col justify-between h-full">
            <div className="p-4 text-xl font-semibold bg-blue-950 text-white">{t("filter")}</div>
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="grid grid-cols-1 gap-5 text-sm">
                <Input value={searchName} setValue={setSearchName} label={t("name")} id="searchname" iconName="person" errorMessage={errors?.searchName} />
                <Input value={searchEmail} setValue={setSearchEmail} label={t("email")} id="searchemail" iconName="mail" errorMessage={errors?.searchEmail} />

                <Select items={roleList} value={searchRole} setValue={setSearchRole} showUnselect label={t("role")} id="searchRole" errorMessage={errors?.searchStatus} />

                <Select
                  items={[
                    { name: t("active"), id: 1 },
                    { name: t("inactive"), id: 0 },
                  ]}
                  value={searchStatus}
                  setValue={setSearchStatus}
                  showUnselect
                  label={t("acount_status")}
                  id="searchacount_status"
                  errorMessage={errors?.searchStatus}
                />
                <Select
                  items={[
                    { name: t("verified"), id: 1 },
                    { name: t("unverified"), id: 0 },
                  ]}
                  value={searchVerified}
                  setValue={setSearchVerified}
                  showUnselect
                  label={t("email_status")}
                  id="searchemail_status"
                  errorMessage={errors?.searchVerified}
                />
                <Input type="date" value={searchDateFrom} setValue={setSearchDateFrom} label={t("from")} iconShow={false} id="searchdate_from" />
                <Input type="date" value={searchDateTo} setValue={setSearchDateTo} label={t("to")} iconShow={false} id="searchdate_to" />
              </div>
            </div>
            <div onClick={getInitialData} className="p-4 text-2xl font-semibold bg-blue-950 hover:bg-blue-800 text-white cursor-pointer">
              <SvgIcon name="tune" /> {t("submit")}
            </div>
          </div>
        </Drawer>
      </Section>
      <UserListTranslation show={showTranslation} setShow={setShowTranslation} />
    </>
  );
}

export default UserListPage;
