import { useEffect, useState } from "react";
import { useGlobalMediaStore } from "@/modules/media/store/useGlobalMediaStore";
import Section from "@/modules/global/elements/section";
import Button from "@/modules/global/elements/button";
import Modal from "@/modules/global/elements/modal";
import Input from "@/modules/global/input/input";
import TextArea from "@/modules/global/input/textarea";
import SvgIcon from "@/modules/global/icons/svg_icons";
import Pagination from "@/modules/global/elements/pagination";
import ImageBox from "@/modules/global/elements/image_box";
import { checkErrors, copyToClipboard, formatSize } from "@/lib/helper";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import Api from "@/lib/api";
import { useLanguageStore } from "@/modules/language/store/useLanguageStore";
import LanguageSelectForInputFields from "@/modules/language/components/LanguageSelectForInputFields";
import { useGlobalStore } from "@/modules/global/store/useGlobalStore";
import { toast } from "sonner";
import MediaTrashFilesTranslation from "./translation/trash_files";
import SubHeader from "@/modules/global/widget/sub_header";
import pageTranslation from "@/modules/language/components/PageTranslation";

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

type ActionType = "create" | "update";
type UploadSource = "disk" | "url";

function GlobalMediaGalleryTrash({ className = "h-full w-full space-y-5", enableGlobalOptions = true }: Props) {
  // App service hooks with types
  const { refreshGlobalMedia } = useGlobalMediaStore();
  const [showTranslation, setShowTranslation] = useState(false);
  const { appSelectedLocale, appDefaultLocale } = useLanguageStore();
  const { hasPermission } = useAuthStore();
  const { backend_url } = useGlobalStore();

  const pageName = "media_trash_files";
  const { t } = pageTranslation(pageName, appSelectedLocale?.code ?? "en");

  // State with proper types
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
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
  const [fileArea, setFileArea] = useState<boolean>(false);
  const [currentFile, setCurrentFile] = useState<FileType | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [altTag, setAltTag] = useState<string>("");
  const [fileDescription, setFileDescription] = useState<string>("");
  const [source, setSource] = useState<string>("");
  const [sourceLink, setSourceLink] = useState<string>("");

  const [inputLanguage, setInputLanguage] = useState<any>(appSelectedLocale?.code ?? appDefaultLocale?.code ?? "en");

  const refreshPage = () => {
    setRefresh((prev) => prev + 1);
  };

  const handleMarkItems = (id: string | number, notify = true) => {
    if (Array.isArray(marks)) {
      if (marks.includes(id)) {
        setMarks((prev) => prev.filter((m) => m !== id));
        return;
      }
      setMarks((prev) => [...prev, id]);
      return;
    }
    setMarks([id]);
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

  const handleTrashFiles = async () => {
    const url = "v1/dashboard/media/soft-delete";
    const data = { marks };
    if (checkErrors({ url, data })) {
      return;
    }
    setLoading(true);
    await Api.post(url, data)
      .then((res) => {
        if (!enableGlobalOptions) {
          refreshPage();
        }
        refreshGlobalMedia();
        toast.success(res.data.message);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
        setLoading(false);
      });
  };

  const handleRestore = async () => {
    const url = "v1/dashboard/media/restore";
    const data = { marks };
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

  const handlePermanentDelete = async () => {
    setDeleteConfirm(false);
    const url = "v1/dashboard/media/permanent-delete";
    const data = { marks };
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

  const handleMultiLanguageInput = (inputValue: any, setInputState: any) => {
    if (!inputLanguage) {
      toast.info("Please select a Lnguage first");
      return;
    }
    setInputState((prev: any) => {
      return {
        ...prev,
        [inputLanguage]: inputValue,
      };
    });
  };

  // Search states
  const [searchName, setSearchName] = useState<string>("");
  const [searchType, setSearchType] = useState<string>("");

  const handlePressEnterForSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      refreshPage();
    }
  };

  const getInitialData = async () => {
    setLoading(true);
    const data = {
      id: currentFolder?.id,
      name: searchName,
      type: searchType,
    };
    const url = "v1/dashboard/media/trash";
    try {
      const res = await Api.post(url, data);
      setLoading(false);
      setFiles(res.data.data.data);
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

  const [fileInfoLoading, setFileInfoLoading] = useState(false);
  const openFile = (file: FileType) => {
    setInputLanguage(appSelectedLocale?.code ?? appDefaultLocale?.code ?? "en");
    setCurrentFile(file);
    setFileArea(true);
    setErrors({});
    // const url = "v1/dashboard/media/edit";
    // const data = { id: file?.id };
    //setFileInfoLoading(true);

    // Api.post(url, data)
    //   .then((res) => {
    //     const resData = res.data?.data;
    //     setFileName(resData?.translations?.name ?? "");
    //     setAltTag(resData?.translations?.alt ?? "");
    //     setFileDescription(resData?.translations?.des ?? "");
    //     setSource(resData?.translations?.src_name ?? "");
    //     setSourceLink(resData?.src_link ?? "");
    //     setFileInfoLoading(false);
    //   })
    //   .catch((err) => {
    //     setFileInfoLoading(false);
    //     toast.error(err?.response?.data?.message);
    //   });
  };

  const updateFile = (id: string | number) => {
    const url = "v1/dashboard/media/update";
    const data = {
      id,
      fileName,
      altTag,
      fileDescription,
      source,
      sourceLink,
    };

    if (checkErrors({ id, fileName })) {
      return;
    }
    setLoading(true);

    Api.post(url, data)
      .then((res) => {
        if (!enableGlobalOptions) {
          refreshPage();
        }
        refreshGlobalMedia();
        setLoading(false);
        toast.success(res?.data?.message);
      })
      .catch((err) => {
        setErrors(err?.response?.data?.errors || {});
        setLoading(false);
        toast.error(err?.response?.data?.message);
      });
  };

  const actionManager = (action_type: string, action_value: any = "") => {
    switch (action_type) {
      case "toggole_mark_all":
        if (marks.length) {
          setMarks([]);
        } else {
          setMarks(files.map((fil) => fil.id));
        }
        break;

      case "mark_file":
        setMarks((prev) => [...prev, action_value]);
        break;

      case "unmark_file":
        setMarks((prev) => prev.filter((itm) => itm !== action_value));
        break;

      default:
        break;
    }
  };

  const printMedia = (file: FileType, height = "h-40") => {
    if (file?.type === 1) {
      return <ImageBox src={file?.path} className={height} image_className="h-full w-full object-cover" />;
    } else {
      return (
        <div className={`${height} w-full relative flex justify-center items-center bg-blue-100`}>
          {file?.type === 2 && <SvgIcon name="smart_display" className="size-24 text-blue-950/50" filled />}
          {file?.type === 3 && <SvgIcon name="headphones" className="size-24 text-blue-950/50" filled />}
          {file?.type === 4 && <SvgIcon name="docs" className="size-24 text-blue-950/50" filled />}
        </div>
      );
    }
  };

  const printViewMedia = (file: any, height = "h-[500px]") => {
    if (file?.type === 1) {
      return <ImageBox src={file?.path} zoom_on_hover={false} className={height} image_className="h-full w-full object-contain" />;
    } else {
      return (
        <div className={`${height} w-full relative flex justify-center items-center`}>
          {file?.type === 2 && (
            <video controls className="max-h-full max-w-full">
              <source src={file?.path} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          {file?.type === 3 && (
            <audio controls>
              <source src={file?.path} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}
          {file?.type === 4 && <SvgIcon name="docs" className="size-72 text-blue-950/50" filled />}
        </div>
      );
    }
  };

  return (
    <>
      <Section fullWidth className={`${className} bg-slate-50/50 min-h-screen p-4 md:p-6 rounded-3xl`} loading={loading}>
        <SubHeader title={t("media_trash_files")} showTranslationIcon TranslationIconAction={() => setShowTranslation(true)} />

        <Section
          fullWidth
          permission={hasPermission("media.view")}
          className="bg-white rounded-[24px] shadow-sm border border-slate-100 flex flex-col h-[calc(100vh-140px)] overflow-hidden"
          confirmation={deleteConfirm}
          confirmation_yes={handlePermanentDelete}
          confirmation_no={() => setDeleteConfirm(false)}
        >
          {/* Top Action Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-5 bg-white border-b border-slate-100">
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
              {/* Restore Button */}
              <div className="flex justify-center shrink-0">
                {marks.length ? (
                  <Button
                    onClick={handleRestore}
                    border=""
                    showIcon={true}
                    iconName="restore_from_trash"
                    iconClass="size-5"
                    iconPosition="before"
                    iconFilled={false}
                    className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold rounded-xl px-6 py-2.5 shadow-md shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 w-full sm:w-auto"
                  >
                    {t("restore")} ({marks.length})
                  </Button>
                ) : (
                  <Button
                    border=""
                    showIcon={true}
                    iconName="restore_from_trash"
                    iconClass="size-5"
                    iconPosition="before"
                    iconFilled={false}
                    className="bg-slate-100 text-slate-400 font-semibold rounded-xl px-6 py-2.5 cursor-not-allowed w-full sm:w-auto"
                    disabled
                  >
                    {t("restore")}
                  </Button>
                )}
              </div>

              {/* Search Input */}
              <div className="w-full sm:w-[320px] relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <SvgIcon name="search" className="size-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                </div>
                <Input
                  value={searchName}
                  setValue={setSearchName}
                  labelShow={false}
                  placeholder="Search trashed files..."
                  id="search_trash_input"
                  extraClass="border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10 py-2.5 rounded-xl transition-all text-sm w-full"
                  padding="pl-11 pr-4"
                  onKeyDown={handlePressEnterForSearch}
                />
              </div>
            </div>

            {/* Permanent Delete Button */}
            <div className="w-full md:w-auto flex justify-center">
              {marks.length ? (
                <Button
                  onClick={() => setDeleteConfirm(true)}
                  border=""
                  showIcon={true}
                  iconName="delete_forever"
                  iconClass="size-5"
                  iconPosition="before"
                  iconFilled={false}
                  className="bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl px-6 py-2.5 shadow-md shadow-rose-500/20 transition-all transform hover:-translate-y-0.5 w-full sm:w-auto"
                >
                  {t("delete_permanently")}
                </Button>
              ) : (
                <Button
                  border=""
                  showIcon={true}
                  iconName="delete_forever"
                  iconClass="size-5"
                  iconPosition="before"
                  iconFilled={false}
                  className="bg-slate-100 text-slate-400 font-semibold rounded-xl px-6 py-2.5 cursor-not-allowed w-full sm:w-auto"
                  disabled
                >
                  {t("delete_permanently")}
                </Button>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-slate-50/50 overflow-y-auto scrollbar-width-thin scrollbar-thumb-teal-200 scrollbar-track-transparent p-6 pt-0">
            {/* Sticky Header */}
            <div className="flex gap-3 w-full justify-between items-center sticky top-0 bg-slate-50/90 backdrop-blur-md z-20 py-4 border-b border-slate-100 mb-6">
              <div className="flex justify-start items-center gap-2">
                <div className="flex justify-start items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm text-slate-600">
                  <SvgIcon name="delete_outline" className="size-5 text-rose-500" />
                  <span className="text-sm font-bold tracking-wide">{t("all_trash_files")}</span>
                </div>
              </div>

              {/* Mark All Toggle */}
              <div
                onClick={() => actionManager("toggole_mark_all")}
                className="group flex items-center gap-2 cursor-pointer bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 px-4 py-2 rounded-xl transition-all shadow-sm"
              >
                {Array.isArray(marks) && Array.isArray(files) && marks.length && files.length === marks.length ? (
                  <div title="Unmark All" className="flex items-center gap-2 text-emerald-700 font-medium text-sm">
                    <SvgIcon name="check_box" className="size-5 text-emerald-500" filled />
                    <span>All Selected</span>
                  </div>
                ) : (
                  <div title="Mark All" className="flex items-center gap-2 text-slate-500 group-hover:text-emerald-700 font-medium text-sm transition-colors">
                    <SvgIcon name="check_box_outline_blank" className="size-5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                    <span>Select All</span>
                  </div>
                )}
                {marks?.length > 0 && <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-md ml-1">{marks.length}</span>}
              </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 lg:gap-6 pb-20">
              {Array.isArray(files) &&
                files.map((file, indx) => {
                  const isSelected = Array.isArray(marks) && marks.includes(file.id);
                  return (
                    <div
                      key={indx + "files"}
                      className={`group relative flex flex-col bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                        isSelected
                          ? "border-emerald-400 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-400"
                          : "border-slate-200 shadow-sm hover:shadow-lg hover:border-teal-300"
                      }`}
                    >
                      {/* Media Preview Area */}
                      <div
                        className="relative aspect-square overflow-hidden bg-slate-100 cursor-pointer flex items-center justify-center"
                        onClick={() => handleMarkItems(file.id)}
                      >
                        <div className="w-full h-full transform group-hover:scale-105 transition-transform duration-500 flex items-center justify-center opacity-80 group-hover:opacity-100 filter grayscale group-hover:grayscale-0">
                          {printMedia(file)}
                        </div>

                        {/* Dark Overlay */}
                        <div className={`absolute inset-0 bg-teal-900/5 opacity-0 group-hover:opacity-100 transition-opacity ${isSelected ? "opacity-0" : ""}`} />

                        {/* Checkmark Indicator */}
                        <div
                          className={`absolute top-3 right-3 z-10 transition-transform ${isSelected ? "scale-100" : "scale-0 group-hover:scale-100 opacity-50 hover:opacity-100"}`}
                        >
                          <SvgIcon
                            name="check_circle"
                            filled
                            className={`size-6 rounded-full bg-white shadow-sm ${isSelected ? "text-emerald-500" : "text-slate-300"}`}
                          />
                        </div>
                      </div>

                      {/* File Info Area */}
                      <div className="flex items-center justify-between gap-2 p-3 bg-white border-t border-slate-100 z-10">
                        <div className="w-full truncate text-xs font-medium text-slate-500 line-through decoration-slate-300" title={file?.name}>
                          {file?.name}
                        </div>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            openFile(file);
                          }}
                          className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 cursor-pointer transition-colors"
                          title={t("view")}
                        >
                          <SvgIcon name="visibility" className="size-4" />
                        </div>
                      </div>
                    </div>
                  );
                })}

              {loading ? (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-teal-600 gap-4">
                  <SvgIcon name="sync" className="size-8 animate-spin" />
                  <span className="text-sm font-medium animate-pulse">Loading trash...</span>
                </div>
              ) : (
                <>
                  {!Array.isArray(files) || !files.length ? (
                    <div className="col-span-full py-24 flex flex-col items-center justify-center text-slate-400 gap-4 bg-white rounded-3xl border border-dashed border-slate-200">
                      <div className="p-4 bg-slate-50 rounded-full">
                        <SvgIcon name="delete_outline" className="size-10 text-slate-300" />
                      </div>
                      <div className="text-sm font-medium text-slate-500">Trash is completely empty</div>
                    </div>
                  ) : null}
                </>
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

        {/* File Details Modal */}
        <Modal maxWidth="w-full max-w-6xl" loading={loading} permission={hasPermission("media.view")} show={fileArea} setShow={setFileArea}>
          <div className="bg-white rounded-[32px] overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
            {/* Left: Preview */}
            <div className="w-full md:w-7/12 bg-slate-50 flex flex-col justify-center items-center p-8 border-b md:border-b-0 md:border-r border-slate-200 relative">
              <div className="absolute top-4 left-4 bg-rose-50 border border-rose-100 text-rose-600 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5">
                <SvgIcon name="delete" className="size-4" />
                Trashed File
              </div>
              <div className="absolute top-4 right-4 bg-white/80 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 shadow-sm">
                {formatSize(currentFile?.size ?? 0, "KB")}
              </div>
              <div className="w-full h-full flex items-center justify-center drop-shadow-md">{printViewMedia(currentFile)}</div>
            </div>

            {/* Right: Meta Info Form (Kept exactly as requested, hidden by default) */}
            <Section loading={fileInfoLoading} className="hidden w-full md:w-5/12 p-6 md:p-8 bg-white overflow-y-auto">
              <div className="mb-6 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800">File Details</h3>
                <LanguageSelectForInputFields currentLanguage={inputLanguage} setCurrentLnaguage={setInputLanguage} />
              </div>

              <div className="space-y-5 text-sm">
                <Input
                  required
                  label="File Name"
                  value={fileName && fileName[inputLanguage] ? fileName[inputLanguage] : ""}
                  setValue={(val) => handleMultiLanguageInput(val, setFileName)}
                  extraClass="bg-slate-50 border-slate-200 focus:bg-white focus:border-teal-500 focus:ring-teal-500/20 rounded-xl"
                  errorMessage={errors?.fileName}
                  iconName="short_text"
                />
                <Input
                  label="Alt Tag"
                  value={altTag && altTag[inputLanguage] ? altTag[inputLanguage] : ""}
                  setValue={(val) => handleMultiLanguageInput(val, setAltTag)}
                  extraClass="bg-slate-50 border-slate-200 focus:bg-white focus:border-teal-500 focus:ring-teal-500/20 rounded-xl"
                  errorMessage={errors?.altTag}
                />
                <Input
                  label="Source"
                  value={source}
                  setValue={setSource}
                  extraClass="bg-slate-50 border-slate-200 focus:bg-white focus:border-teal-500 focus:ring-teal-500/20 rounded-xl"
                  errorMessage={errors?.source}
                />
                <Input
                  label="Source Link"
                  value={sourceLink && sourceLink[inputLanguage] ? sourceLink[inputLanguage] : ""}
                  setValue={(val) => handleMultiLanguageInput(val, setSourceLink)}
                  extraClass="bg-slate-50 border-slate-200 focus:bg-white focus:border-teal-500 focus:ring-teal-500/20 rounded-xl"
                  errorMessage={errors?.sourceLink}
                />
                <TextArea
                  label="Description"
                  value={fileDescription && fileDescription[inputLanguage] ? fileDescription[inputLanguage] : ""}
                  setValue={(val) => handleMultiLanguageInput(val, setFileDescription)}
                  extraClass="bg-slate-50 border-slate-200 focus:bg-white focus:border-teal-500 focus:ring-teal-500/20 rounded-xl"
                  errorMessage={errors?.fileDescription}
                  rows={3}
                />
                <div className="group cursor-copy relative" onClick={() => copyToClipboard(`${backend_url}${currentFile?.path}`)}>
                  <div className="absolute right-3 top-[38px] text-slate-400 group-hover:text-teal-600 bg-slate-50 pl-2">
                    <SvgIcon name="content_copy" className="size-5" />
                  </div>
                  <Input
                    label="Direct Link"
                    value={`${backend_url}${currentFile?.path}`}
                    setValue={() => ""}
                    extraClass="bg-slate-50 border-slate-200 text-slate-500 pr-10 rounded-xl cursor-copy"
                  />
                </div>

                <div className="pt-4">
                  <Button
                    onClick={() => updateFile(currentFile?.id ?? "")}
                    showIcon
                    iconName="save"
                    iconPosition="before"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl shadow-md transition-all"
                  >
                    Update
                  </Button>
                </div>
              </div>
            </Section>
          </div>
        </Modal>

        <MediaTrashFilesTranslation show={showTranslation} setShow={setShowTranslation} />
      </Section>
    </>
  );
}

export default GlobalMediaGalleryTrash;
