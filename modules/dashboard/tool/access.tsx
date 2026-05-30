import { useEffect, useState } from "react";
import Section from "@/modules/global/elements/section";
import SvgIcon from "@/modules/global/icons/svg_icons";
import Table from "@/modules/global/elements/table";
import Pagination from "@/modules/global/elements/pagination";
import api from "@/lib/api";
import { checkErrors } from "@/lib/helper";
import { useLanguageStore } from "@/modules/language/store/useLanguageStore";
import { toast } from "sonner";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import Button from "@/modules/global/elements/button";
import ImageBox from "@/modules/global/elements/image_box";
import pageTranslation from "@/modules/language/components/PageTranslation";
import SubHeader from "@/modules/global/widget/sub_header";
import ToolAccessTranslation from "./translation/access";

interface MainData {
  id: string;
  status: number;
  updated_at?: string;
  name?: string;
  media?: any;
  category?: string;
  official_url?: string;
}

function ToolAccessPage() {
  const { hasPermission } = useAuthStore();
  const [showTranslation, setShowTranslation] = useState(false);
  const pageName = "tool_access";
  const { appSelectedLocale } = useLanguageStore();
  const { t } = pageTranslation(pageName, appSelectedLocale?.code ?? "en");
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [marks, setMarks] = useState<any[]>([]);
  const [mainData, setMainData] = useState<MainData[]>([]);

  const [refresh, setRefresh] = useState(0);
  const refreshPage = () => {
    setRefresh((prev) => prev + 1);
  };
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

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

  const getInitialData = async () => {
    setLoading(true);
    let data = {
      page: currentPage,
    };
    let url = "v1/tools";
    await api
      .get(url)
      .then((res) => {
        setLoading(false);
        setMainData(res.data.data);
        // setTotalPage(res.data.data.last_page);
        // setPaginateInfo(res.data.data.to + " out of " + res.data.data.total);
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
    if (!Array.isArray(data)) {
      return [];
    }
    const tableData = data.map((dat) => ({
      id: dat.id,
      [t("logo")]: <ImageBox src={dat.media?.path} className="h-10 rounded max-w-10" />,
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
    }));

    return tableData;
  };

  return (
    <Section
      permission={true}
      loading={loading}
      confirmation={deleteConfirm}
      confirmation_yes={() => actionManager("delete_yes")}
      confirmation_no={() => actionManager("delete_no")}
      className="space-y-6"
    >
      <SubHeader title={t(pageName)} showTranslationIcon TranslationIconAction={() => setShowTranslation(true)} />
      <div className="grid grid-cols-2 bg-white">
        <Table
          data={prepareTableData(mainData)}
          showHeading={false}
          loading={false}
          showMark={false}
          markItems={marks}
          setMarkItems={setMarks}
          excludeKeys={["id"]}
          showDelete={hasPermission("tool.delete")}
          handleDelete={() => actionManager("delete_confirmation")}
        />

        <div className="p-8 space-y-10">
          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-center">{t("unlock")}</h1>
            <p className="text-center text-gray-600">{t("our_custom")}</p>
          </div>
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex gap-6 items-center">
                <div className="font-semibold text-lg flex items-center justify-center bg-violet-500 text-white rounded-full size-10">1</div>
                <div className="font-semibold text-lg">{t("download_the")}</div>
              </div>
              <div className="space-y-3 pl-11 ml-5 border-l border-dashed border-violet-500">
                <h1 className="text-gray-600">{t("step1")}</h1>
                <p className="text-gray-600">{t("our_secure")}</p>
                <Button>{t("download_for")}</Button>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex gap-6 items-center">
                <div className="font-semibold text-lg flex items-center justify-center bg-violet-500 text-white rounded-full size-10">2</div>
                <div className="font-semibold text-lg">{t("log_in_to")}</div>
              </div>
              <div className="space-y-3 pl-11 ml-5 border-l border-dashed border-violet-500">
                <h1 className="text-gray-600">{t("step2")}</h1>
                <p className="text-gray-600">{t("launch_the")}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex gap-6 items-center">
                <div className="font-semibold text-lg flex items-center justify-center bg-violet-500 text-white rounded-full size-10">3</div>
                <div className="font-semibold text-lg">{t("launch_and_create")}</div>
              </div>
              <div className="space-y-3 pl-11 ml-5 border-l border-dashed border-violet-500">
                <h1 className="text-gray-600">{t("step3")}</h1>
                <p className="text-gray-600">{t("navigate_to")}</p>
              </div>
            </div>
          </div>
        </div>
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

      <ToolAccessTranslation show={showTranslation} setShow={setShowTranslation} />
    </Section>
  );
}

export default ToolAccessPage;
