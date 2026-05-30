import { useEffect, useState } from "react";
import { useGlobalMediaStore } from "@/modules/media/store/useGlobalMediaStore";
import Section from "@/modules/global/elements/section";
import SvgIcon from "@/modules/global/icons/svg_icons";
import Pagination from "@/modules/global/elements/pagination";
import { checkErrors } from "@/lib/helper";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import Api from "@/lib/api";
import { useLanguageStore } from "@/modules/language/store/useLanguageStore";
import { useGlobalStore } from "@/modules/global/store/useGlobalStore";
import DropdownAndTooltip from "@/modules/global/elements/dropdown_tooltip";
import { toast } from "sonner";
import pageTranslation from "@/modules/language/components/PageTranslation";
import SubHeader from "@/modules/global/widget/sub_header";
import MediaTrashFoldersTranslation from "./translation/trash_folders";

interface Props {
  className?: string;
  showUpdateButton?: boolean;
  enableGlobalOptions?: boolean;
  visibleTranslateClass?: string;
  hiddenTranslateClass?: string;
}

// Type definitions
type FileType = {
  id: string | number;
  path: string;
  translate?: {
    name?: string;
    alt?: string;
    des?: string;
    src_name?: string;
  };
  src_link?: string;
  size?: number;
  type?: number;
  [key: string]: any;
};

type PaginationResponse = {
  media: {
    data: FileType[];
    last_page: number;
    to: number;
    total: number;
  };
};

function GlobalMediaGalleryFolderTrash({ className = "h-full w-full space-y-5", enableGlobalOptions = true }: Props) {
  // App service hooks with types
  const { refreshGlobalMedia } = useGlobalMediaStore();

  const { appSelectedLocale, appDefaultLocale } = useLanguageStore();
  const { hasPermission } = useAuthStore();
  const { backend_url } = useGlobalStore();

  const [showTranslation, setShowTranslation] = useState(false);

  const pageName = "media_trash_folders";
  const { t } = pageTranslation(pageName, appSelectedLocale?.code ?? "en");

  // State with proper types
  const [mainData, setMainData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
  const [marks, setMarks] = useState<(string | number)[]>([]);
  const [refresh, setRefresh] = useState<number>(0);
  const [currentPath, setCurrentPath] = useState<{ id: string; path: string; name?: string }>({ id: "", path: "", name: "" });
  const initialCurrentFolderData = {
    id: null,
    path: "",
    name: "Root",
    parent_id: null,
    type: null,
    default: null,
  };
  const [currentFolder, setCurrentFolder] = useState<{
    id: number | null;
    path?: string;
    name?: string;
    parent_id?: number | null;
    type?: number | null;
    default?: number | null;
  }>(initialCurrentFolderData);

  // Pagination states
  const [paginateUrl, setPaginateUrl] = useState<string>("media/archive/index");
  const [totalPage, setTotalPage] = useState<number>(0);
  const [paginateInfo, setPaginateInfo] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // File states
  const [files, setFiles] = useState<FileType[]>([]);

  const [inputLanguage, setInputLanguage] = useState<any>(appSelectedLocale?.code ?? appDefaultLocale?.code ?? "en");

  const refreshPage = () => {
    setRefresh((prev) => prev + 1);
  };

  const handlePaginate = async (page_number: number) => {
    if (checkErrors({ paginateUrl })) {
      return;
    }
    const data = {
      id: currentPath?.id,
      page: page_number,
    };
    setLoading(true);
    try {
      const res = await Api.post<PaginationResponse>(paginateUrl, data);
      setLoading(false);
      setFiles(res.data.media.data);
      setTotalPage(res.data.media.last_page);
      setPaginateInfo(`${res.data.media.to} out of ${res.data.media.total}`);
      setCurrentPage(page_number);
    } catch (err: any) {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    }
  };

  const handleRestore = async (id: number) => {
    const url = "v1/dashboard/media-directory/restore";
    const data = { id };
    if (checkErrors({ url, data })) {
      return;
    }
    setLoading(true);
    await Api.post(url, data)
      .then((res) => {
        refreshPage();
        refreshGlobalMedia();
        toast.success(res.data.message);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
        setLoading(false);
      });
  };

  const [actionID, setActionID] = useState<number | null>(null);
  const handlePermanentDelete = async () => {
    setDeleteConfirm(false);
    const url = "v1/dashboard/media-directory/permanent-delete";
    const data = { id: actionID };
    if (checkErrors({ url, data })) {
      return;
    }
    setLoading(true);
    await Api.post(url, data)
      .then((res) => {
        refreshPage();
        toast.success(res.data.message);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
        setLoading(false);
      });
  };

  // Search states
  const [searchName, setSearchName] = useState<string>("");

  const getInitialData = async () => {
    setLoading(true);
    const data = {
      id: currentFolder?.id,
      name: searchName,
    };
    const url = "v1/dashboard/media-directory/trash";
    try {
      const res = await Api.post(url, data);
      setLoading(false);
      setMainData(res.data.data.data);
      setTotalPage(res.data.data.last_page);
      setPaginateInfo(`${res.data.data.to} out of ${res.data.data.total}`);
      // if (checkErrors({ currentPage })) {
      //   setCurrentPath({ id: "", path: "" });
      // }
    } catch (err: any) {
      setLoading(false);
      //toast.error(err?.response?.data?.message);
    }
  };

  useEffect(() => {
    getInitialData();
  }, [refresh, appSelectedLocale]);

  return (
    <>
      <Section fullWidth className={`${className} bg-slate-50/50 min-h-screen p-4 md:p-6 rounded-3xl`} loading={loading}>
        <SubHeader title={t("media_trash_folders")} showTranslationIcon TranslationIconAction={() => setShowTranslation(true)} />

        <Section
          fullWidth
          permission={hasPermission("media-directory.view")}
          className="bg-white rounded-[24px] shadow-sm border border-slate-100 flex flex-col h-[calc(100vh-140px)] overflow-hidden"
          confirmation={deleteConfirm}
          confirmation_yes={handlePermanentDelete}
          confirmation_no={() => setDeleteConfirm(false)}
        >
          <div className="flex-1 bg-slate-50/50 overflow-y-auto scrollbar-width-thin scrollbar-thumb-teal-200 scrollbar-track-transparent p-6 pt-0">
            {/* Sticky Header */}
            <div className="flex gap-3 w-full justify-between items-center sticky top-0 bg-slate-50/90 backdrop-blur-md z-20 py-4 border-b border-slate-100 mb-6">
              <div className="flex justify-start items-center gap-2">
                <div className="flex justify-start items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm text-slate-600">
                  <SvgIcon name="delete_outline" className="size-5 text-rose-500" />
                  <span className="text-sm font-bold tracking-wide">{t("all_trash_folders")}</span>
                </div>
              </div>
            </div>

            {/* Folders Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 pb-8">
              {Array.isArray(mainData) &&
                mainData.map((itm) => (
                  <div
                    key={itm?.id}
                    className="group relative flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-teal-300 hover:ring-1 hover:ring-teal-300/50 transition-all duration-300 overflow-hidden"
                  >
                    {/* Subtle background gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 to-cyan-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    <div className="flex gap-4 items-center relative z-10 w-[85%]">
                      <div className="flex items-center justify-center shrink-0 size-12 rounded-xl bg-slate-100 text-slate-400 group-hover:bg-teal-100 group-hover:text-teal-600 transition-colors">
                        <SvgIcon name="folder" className="size-6" filled />
                      </div>
                      <div className="font-semibold text-slate-700 group-hover:text-teal-900 truncate tracking-tight text-sm md:text-base">{itm?.name}</div>
                    </div>

                    <div className="relative z-10 shrink-0">
                      <DropdownAndTooltip
                        position="bottom"
                        side="right"
                        width="w-[240px]"
                        button={
                          <div className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 cursor-pointer transition-colors">
                            <SvgIcon name="more_vert" className="size-6" filled />
                          </div>
                        }
                      >
                        <div className="pt-2">
                          <div className="p-2 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 space-y-1">
                            {/* Action Menu Header */}
                            <div className="flex gap-2 items-center px-3 py-2 border-b border-slate-50 mb-1">
                              <SvgIcon name="tune" className="size-4 text-slate-400" />
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t("actions")}</span>
                            </div>

                            {/* Restore Action */}
                            <div
                              onClick={() => handleRestore(itm?.id)}
                              className="flex justify-start gap-3 items-center text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl px-3 py-2.5 cursor-pointer transition-colors text-sm font-medium"
                            >
                              <SvgIcon name="restore_from_trash" className="size-5" />
                              <div>{t("restore")}</div>
                            </div>

                            {/* Permanent Delete Action */}
                            <div
                              onClick={() => {
                                setDeleteConfirm(true);
                                setActionID(itm?.id);
                              }}
                              className="flex justify-start gap-3 items-center text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-xl px-3 py-2.5 cursor-pointer transition-colors text-sm font-medium"
                            >
                              <SvgIcon name="delete_forever" className="size-5" />
                              <div>{t("delete_permanently")}</div>
                            </div>
                          </div>
                        </div>
                      </DropdownAndTooltip>
                    </div>
                  </div>
                ))}

              {/* Empty State Fallback (Optional, but good UX if mainData is empty) */}
              {Array.isArray(mainData) && mainData.length === 0 && (
                <div className="col-span-full py-24 flex flex-col items-center justify-center text-slate-400 gap-4 bg-white rounded-3xl border border-dashed border-slate-200">
                  <div className="p-4 bg-slate-50 rounded-full">
                    <SvgIcon name="folder_off" className="size-10 text-slate-300" />
                  </div>
                  <div className="text-sm font-medium text-slate-500">No trashed folders found</div>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-center pb-4">
              <Pagination
                design={2}
                currentPage={currentPage}
                totalPages={totalPage}
                onPageChange={handlePaginate}
                siblingCount={1}
                paginateInfo={paginateInfo}
                className="text-sm font-medium bg-white rounded-xl shadow-sm border border-slate-100 p-2"
              />
            </div>
          </div>
        </Section>

        <MediaTrashFoldersTranslation show={showTranslation} setShow={setShowTranslation} />
      </Section>
    </>
  );
}

export default GlobalMediaGalleryFolderTrash;
