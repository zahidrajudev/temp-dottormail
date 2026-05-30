import { useEffect, useState } from "react";
import Section from "@/modules/global/elements/section";
import SvgIcon from "@/modules/global/icons/svg_icons";
import api from "@/lib/api";
import { checkErrors } from "@/lib/helper";
import { useLanguageStore } from "@/modules/language/store/useLanguageStore";
import { toast } from "sonner";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import Button from "@/modules/global/elements/button";
import ImageBox from "@/modules/global/elements/image_box";
import pageTranslation from "@/modules/language/components/PageTranslation";
import SubHeader from "@/modules/global/widget/sub_header";
import TranslationPageTranslation from "@/modules/language/translation/translation-page";
import DashboardSidebarTranslation from "@/modules/language/translation/dashboard-sidebar";
import DashboardTableTranslation from "@/modules/language/translation/table_translation";
import DashboardPaginationTranslation from "@/modules/language/translation/pagination_translation";

interface MainData {
  id: string;
  status: number;
  updated_at?: string;
  name?: string;
  media?: any;
  category?: string;
  official_url?: string;
}

function ComponentTranslation() {
  const [showTranslation, setShowTranslation] = useState(false);
  const { hasPermission } = useAuthStore();
  const { appSelectedLocale } = useLanguageStore();
  const { t } = pageTranslation("translation_page", appSelectedLocale?.code ?? "en");
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
      let url = "v1/dashboard/tool/permanent-delete";
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
    let url = "v1/dashboard/tool";
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
      handleTrash();
    }
    if (action_type == "delete_no") {
      setDeleteConfirm(false);
    }
  };

  const prepareTableData = (data: MainData[]) => {
    const tableData = data.map((dat) => ({
      id: dat.id,
      [t("logo")]: <ImageBox src={dat.media?.path} className="h-10 rounded" />,
      [t("name")]: dat?.name,
      [t("status")]:
        dat.status == 1 ? (
          <div className="pl-2 pr-3 py-1 rounded-full bg-green-500/5 border border-green-700 w-max text-green-700 font-semibold">
            <SvgIcon name="check" className="size-4" filled />
            <div className="inline border-l border-green-700 ms-2 pl-2 text-green-700 text-xs">{t("active")}</div>
          </div>
        ) : (
          <div className="pl-2 pr-3 py-1 rounded-full bg-red-500/5 border border-red-500 w-max text-red-600 font-semibold">
            <SvgIcon name="close" className="size-4" filled />
            <div className="inline border-l border-red-500 ms-2 pl-2 text-xs">{t("down")}</div>
          </div>
        ),
      [t("category")]: dat?.category,
      [t("official_url")]: dat?.official_url,
      [`${t("last_activity")}_date`]: dat.updated_at,
      action: hasPermission("user.edit") && (
        <div className="text-xs flex items-center gap-4" onClick={() => actionManager("open_update", dat.id)} title="Edit">
          <Button url={`/dashboard/tool/edit?id=${dat.id}`} border="rounded" showIcon iconName="edit_note" px="px-3" py="py-1.5">
            {t("edit")}
          </Button>
          <Button url={`/dashboard/tool/account?id=${dat.id}`} border="rounded" showIcon iconName="edit_note" px="px-3" py="py-1.5">
            {t("manage_accounts")}
          </Button>
        </div>
      ),
    }));

    return tableData;
  };

  return (
    <Section
      permission={hasPermission("user.view")}
      loading={loading}
      confirmation={deleteConfirm}
      confirmation_yes={() => actionManager("delete_yes")}
      confirmation_no={() => actionManager("delete_no")}
      className="space-y-6">
      <SubHeader title={t("manage_translations")} showTranslationIcon TranslationIconAction={() => setShowTranslation(true)} />
      <div className="flex flex-wrap gap-6 items-center">
        <DashboardSidebarTranslation />
        <DashboardTableTranslation />
        <DashboardPaginationTranslation />
      </div>

      <TranslationPageTranslation show={showTranslation} setShow={setShowTranslation} />
    </Section>
  );
}

export default ComponentTranslation;
