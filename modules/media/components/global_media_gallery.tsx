import React, { useEffect, useState } from "react";
import { useGlobalMediaStore } from "@/modules/media/store/useGlobalMediaStore";
import Section from "@/modules/global/elements/section";
import Button from "@/modules/global/elements/button";
import Modal from "@/modules/global/elements/modal";
import Input from "@/modules/global/input/input";
import Select from "@/modules/global/input/select";
import TextArea from "@/modules/global/input/textarea";
import Table from "@/modules/global/elements/table";
import SvgIcon from "@/modules/global/icons/svg_icons";
import FileInput from "@/modules/global/input/file";
import Pagination from "@/modules/global/elements/pagination";
import ImageBox from "@/modules/global/elements/image_box";
import Drawer from "@/modules/global/elements/drawer";
import { checkErrors, copyToClipboard, formatSize } from "@/lib/helper";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { AxiosRequestConfig, AxiosProgressEvent } from "axios";
import Api from "@/lib/api";
import { useLanguageStore } from "@/modules/language/store/useLanguageStore";
import LanguageSelectForInputFields from "@/modules/language/components/LanguageSelectForInputFields";
import DropdownAndTooltip from "@/modules/global/elements/dropdown_tooltip";
import { useGlobalStore } from "@/modules/global/store/useGlobalStore";
import { toast } from "sonner";
import SubHeader from "@/modules/global/widget/sub_header";
import pageTranslation from "@/modules/language/components/PageTranslation";
import MediaGalleryTranslation from "@/modules/media/components/translation/gallery";

interface Props {
  className?: string;
  showSubHeader?: boolean;
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

type UploadFileType = {
  id: number;
  file?: File;
  url: string;
  name: string;
  size: string | number;
  type: string;
  status: string;
  progress: number;
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

function GlobalMediaGallery({
  className = "fixed top-0 right-0 p-2 space-y-2 lg:p-5 lg:space-y-5 h-full w-full  transition-all duration-1000 z-106 bg-gray-100",
  showSubHeader = false,
  showUpdateButton = true,
  enableGlobalOptions = true,
  visibleTranslateClass = "translate-x-0",
  hiddenTranslateClass = "translate-x-full",
}: Props) {
  // App service hooks with types
  const { appMediaShow, globalRefreshNumber, appMediaItems, setAppMediaItems, appMediaSelectOnly, appMediaMaxSelect, refreshGlobalMedia, closeMediaGallery } =
    useGlobalMediaStore();
  const pageName = "media_gallery";
  const { appSelectedLocale, appDefaultLocale } = useLanguageStore();
  const [showTranslation, setShowTranslation] = useState(false);
  const { t } = pageTranslation(pageName, appSelectedLocale?.code ?? "en");
  const { hasPermission } = useAuthStore();
  const { backend_url } = useGlobalStore();

  // State with proper types
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [marks, setMarks] = useState<any[]>([]);
  const [filterShow, setFilterShow] = useState<boolean>(false);
  const [mainData, setMainData] = useState<any>([]);
  const [refresh, setRefresh] = useState<number>(0);
  const [currentPath, setCurrentPath] = useState<{ id: string; path: string; name?: string }>({ id: "", path: "", name: "" });
  const [currentFolderID, setCurrentFolderID] = useState<number | null>(null);
  const initialCurrentFolderData = {
    id: null,
    path: "",
    name: "Root",
    parent_id: null,
    type: null,
    default: null,
  };
  const [currentFolder, setCurrentFolder] = useState<{
    id: number | null | any;
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

  // Modal states
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [name, setName] = useState<any>("");
  const [description, setDescription] = useState<string>("");
  const [action, setAction] = useState<ActionType>("create");
  const [actionID, setActionID] = useState<number | null>(null);

  // Upload states
  const [uploadArea, setUploadArea] = useState<boolean>(false);
  const [uploadFrom, setUploadFrom] = useState<UploadSource>("disk");
  const [uploadFiles, setUploadFiles] = useState<UploadFileType[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadUrls, setUploadUrls] = useState<string>("");
  const [uploadingUrls, setUploadingUrls] = useState<any>([]);

  const [inputLanguage, setInputLanguage] = useState<any>(appSelectedLocale?.code ?? appDefaultLocale?.code ?? "en");

  const refreshPage = () => {
    setRefresh((prev) => prev + 1);
  };

  const checkSelectRestrictions = () => {
    if (!enableGlobalOptions) {
      return false;
    }
    if (appMediaMaxSelect > 0) {
      if (Array.isArray(marks) && marks.length > appMediaMaxSelect) {
        toast.error("You can select maximum " + appMediaMaxSelect + " files");
        return true;
      }
    }
    let isFoundTypeLimit = false;
    if (Array.isArray(appMediaSelectOnly) && appMediaSelectOnly.length > 0) {
      if (Array.isArray(marks)) {
        marks.map((id) => {
          const checkFile = files.find((f) => f.id === id);
          if (!appMediaSelectOnly.includes(checkFile?.type)) {
            isFoundTypeLimit = true;
          }
        });
      }
    }
    if (isFoundTypeLimit) {
      let allowTexts = appMediaSelectOnly.join(",");
      allowTexts = allowTexts.replace("1", "Image").replace("2", "Video").replace("3", "Audio").replace("4", "Document");
      toast.error("Please select only " + allowTexts);
      return true;
    }
    return false;
  };

  const handleSelectForGlobalMedia = () => {
    if (Array.isArray(marks)) {
      if (checkSelectRestrictions()) {
        return;
      }
      let finalSelected: {}[] = [];
      marks.map((id) => {
        files.map((fil) => {
          if (fil.id === id) {
            finalSelected.push({ id: fil?.id, path: fil?.path, type: fil?.type, alt: fil?.translate?.alt });
          }
        });
      });
      setAppMediaItems(finalSelected);
      closeMediaGallery();
      return;
    }
    setAppMediaItems([]);
    closeMediaGallery();
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

  const handleTrashFolder = async (id: number) => {
    const url = "v1/dashboard/media-directory/soft-delete";
    const data = { id };
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

  const CreateOrUpdateFolder = () => {
    let url: string;
    let data: Record<string, any>;

    if (action == "create") {
      url = "v1/dashboard/media-directory/create";
      data = {
        name,
        parent: currentFolder?.id,
      };
      if (checkErrors({ name, url }, setErrors, true)) {
        return;
      }
    } else {
      url = "v1/dashboard/media-directory/update";
      data = {
        id: actionID,
        name,
      };
      if (checkErrors({ name, url, id: data.id }, setErrors, true)) {
        return;
      }
    }

    setLoading(true);

    Api.post(url, data)
      .then((res) => {
        if (!enableGlobalOptions) {
          refreshPage();
        }
        refreshGlobalMedia();
        setModalShow(false);
        setLoading(false);
        toast.success(res?.data?.message);
      })
      .catch((err) => {
        setLoading(false);
        setErrors(err?.response?.data?.errors);
        toast.error(err?.response?.data?.message);
      });
  };

  const openArchiveEditModal = (id: number) => {
    setActionID(null);
    const url = "v1/dashboard/media-directory/edit";
    const data = { id };
    setLoading(true);

    Api.post(url, data)
      .then((res) => {
        const resData = res.data?.data;
        setName(resData?.translations?.name);
        setModalShow(true);
        setAction("update");
        setActionID(resData?.id);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err?.response?.data?.message);
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

  const [breadCumbs, setBreadCumbs] = useState<any>([]);
  const generateBreadcrumbs = (node: any) => {
    const items = [];
    let current = node;

    while (current) {
      items.unshift({
        id: current.id,
        name: current.name,
      });

      current = current.parent_recursive;
    }
    setBreadCumbs(items);
  };

  const getInitialData = async () => {
    setLoading(true);
    const data = {
      id: currentFolderID,
      name: searchName,
      type: searchType,
    };
    const url = "v1/dashboard/media";
    try {
      const res = await Api.post(url, data);
      setLoading(false);
      generateBreadcrumbs(res.data?.breadCumbs);
      setCurrentFolder(res.data?.breadCumbs);
      setCurrentFolderID(res.data?.breadCumbs?.id);
      setMainData(res.data?.folders);
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
  }, [refresh, currentFolderID, appSelectedLocale]);

  useEffect(() => {
    if (enableGlobalOptions && appMediaShow) {
      if (Array.isArray(appMediaItems)) {
        setMarks(appMediaItems.map((fl) => fl?.id));
      }
    }
  }, [appMediaShow]);

  useEffect(() => {
    if (enableGlobalOptions) {
      getInitialData();
    }
  }, [globalRefreshNumber]);

  const uploadFileFromUrl = async (id: number, isRefreshPage: boolean = false) => {
    try {
      let fileWillbeUpload = uploadingUrls.find((fil: any) => fil.id === id);

      if (!fileWillbeUpload || fileWillbeUpload?.status == "Success") {
        return;
      }

      const url = "v1/dashboard/media/file/upload-from-url";
      const data = {
        id: currentPath?.id,
        path: currentPath?.path,
        file: fileWillbeUpload.url,
      };

      setUploadingUrls((prev: any) => prev.map((obj: any) => (obj.id === id ? { ...obj, status: "Uploading", progress: 0 } : obj)));
      setUploading(true);

      await Api.post(url, data)
        .then((res) => {
          setUploadingUrls((prev: any) => prev.map((obj: any) => (obj.id === id ? { ...obj, status: "Success", progress: 100 } : obj)));
          if (isRefreshPage) {
            if (!enableGlobalOptions) {
              refreshPage();
            }
            refreshGlobalMedia();
          }
        })
        .catch((err) => {
          setUploadingUrls((prev: any) => prev.map((obj: any) => (obj.id === id ? { ...obj, status: "Failed" } : obj)));
        });

      setUploading(false);
    } catch (error) {
      setUploading(false);
      setUploadingUrls((prev: any) => prev.map((obj: any) => (obj.id === id ? { ...obj, status: "Failed" } : obj)));
    }
  };

  const inputUrls = (value: string) => {
    setUploadUrls(value);

    const getFileName = (url_string: string) => {
      let fileName = url_string.split("\n");
      let finalFileName = "";
      if (Array.isArray(fileName)) {
        finalFileName = fileName.pop() || "";
        if (fileName.length > 50) {
          finalFileName = finalFileName.substring(0, 50) + " ...";
        }
        return finalFileName;
      }
      return finalFileName;
    };

    if (value) {
      let convertToArray = value.split("\n").map((item) => item.trim());
      const convertToObject = convertToArray.map((obj, indx) => ({
        id: indx,
        url: obj,
        file: obj,
        name: getFileName(obj),
        size: "",
        type: "",
        status: "Not Uploaded",
        progress: 0,
      }));
      setUploadingUrls(convertToObject);
    } else {
      setUploadingUrls([]);
    }
  };

  const handleUploadAllFromUrls = async () => {
    if (Array.isArray(uploadingUrls) && uploadingUrls.length > 0) {
      const lastId = uploadingUrls.filter((fil) => fil.status !== "Success").pop();

      for (const fileObj of uploadingUrls) {
        if (fileObj.status != "Success") {
          if (lastId?.id === fileObj.id) {
            await uploadFileFromUrl(fileObj.id, true);
          } else {
            await uploadFileFromUrl(fileObj.id);
          }
        }
      }
    }
  };

  const uploadFileDeleteForUrl = (id: number) => {
    setUploadingUrls((prev: any) => prev.filter((obj: any) => obj.id !== id));
  };

  const uploadFile = async (id: number, isRefreshPage = false) => {
    /* -------- Axios request config -------- */
    const config: AxiosRequestConfig<FormData> = {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        // AxiosProgressEvent.loaded / total can be undefined, so co-alesce.
        const { loaded = 0, total = 1 } = progressEvent;
        const progress = Math.round((loaded / total) * 100);

        setUploadFiles((prev) => prev.map((obj) => (obj.id === id ? { ...obj, progress } : obj)));
      },
    };

    /* -------- Locate the file in local state -------- */
    const fileToUpload = uploadFiles.find((f) => f.id === id);
    if (!fileToUpload || fileToUpload.status === "Success") return;

    /* -------- Build multipart body -------- */
    const body = new FormData();
    body.append("id", currentFolder?.id ?? "");
    body.append("path", currentFolder?.path ?? "");
    body.append("file", fileToUpload.file as File);

    /* -------- UI state: mark Uploading -------- */
    setUploadFiles((prev) => prev.map((obj) => (obj.id === id ? { ...obj, status: "Uploading", progress: 0 } : obj)));
    setUploading(true);

    try {
      await Api.post("v1/dashboard/media/create", body, config);

      setUploadFiles((prev) => prev.map((obj) => (obj.id === id ? { ...obj, status: "Success" } : obj)));
      if (isRefreshPage) {
        if (!enableGlobalOptions) {
          refreshPage();
        }
        refreshGlobalMedia();
      }
    } catch (err) {
      setUploadFiles((prev) => prev.map((obj) => (obj.id === id ? { ...obj, status: "Failed" } : obj)));
    } finally {
      setUploading(false);
    }
  };

  const handleUploadAll = async () => {
    if (Array.isArray(uploadFiles) && uploadFiles.length > 0) {
      setUploadFiles((prev) => prev.map((fil) => (fil.status !== "Success" ? { ...fil, status: "Uploading" } : fil)));

      const lastId = uploadFiles.filter((fil) => fil.status !== "Success").pop();

      for (const fileObj of uploadFiles) {
        if (fileObj.status !== "Success") {
          if (lastId?.id === fileObj.id) {
            await uploadFile(fileObj.id, true);
          } else {
            await uploadFile(fileObj.id);
          }
        }
      }
    }
  };

  const uploadFileDelete = (id: number) => {
    setUploadFiles((prev) => prev.filter((obj) => obj.id !== id));
  };

  const inputFiles = (files: File[] | File) => {
    if (Array.isArray(files)) {
      const newFileObjects = Array.from(files).map((file, indx) => ({
        id: indx,
        file,
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        type: file.type,
        status: "Not Uploaded",
        progress: 0,
      }));

      setUploadFiles(newFileObjects);
    }
  };

  const [fileInfoLoading, setFileInfoLoading] = useState(false);
  const openFile = (file: FileType) => {
    setInputLanguage(appSelectedLocale?.code ?? appDefaultLocale?.code ?? "en");
    setCurrentFile(file);
    setFileArea(true);
    setErrors({});
    const url = "v1/dashboard/media/edit";
    const data = { id: file?.id };
    setFileInfoLoading(true);

    Api.post(url, data)
      .then((res) => {
        const resData = res.data?.data;
        setFileName(resData?.translations?.name ?? "");
        setAltTag(resData?.translations?.alt ?? "");
        setFileDescription(resData?.translations?.des ?? "");
        setSource(resData?.translations?.src_name ?? "");
        setSourceLink(resData?.src_link ?? "");
        setFileInfoLoading(false);
      })
      .catch((err) => {
        setFileInfoLoading(false);
        toast.error(err?.response?.data?.message);
      });
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
        setErrors({});
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

  type ActionManagerParams = {
    action_type: string;
    action_value?: any;
  };

  const actionManager = (action_type: string, action_value: any = "") => {
    switch (action_type) {
      case "select_current_path":
        setCurrentPage(1);
        setCurrentPath({ id: action_value?.id, path: action_value?.path, name: action_value?.name });
        break;

      case "open_create_folder":
        setAction("create");
        setName("");
        setDescription("");
        setErrors({});
        setModalShow(true);
        break;

      case "open_update_folder":
        setAction("update");
        setErrors({});
        // openArchiveEditModal();
        break;

      case "trash_folder":
        handleTrashFolder(action_value);
        break;

      case "root_folder":
        setCurrentPath({ id: "", path: "", name: "Root" });
        getInitialData();
        break;

      case "toggole_upload_area":
        setUploadArea(!uploadArea);
        setFileArea(false);
        setUploadFiles([]);
        setUploadUrls("");
        break;

      case "upload_from":
        setUploadFrom(action_value);
        break;

      case "upload_file":
        if (uploadFrom == "disk") {
          uploadFile(action_value, true);
        } else {
          uploadFileFromUrl(action_value, true);
        }
        break;

      case "upload_file_all":
        if (uploadFrom == "disk") {
          handleUploadAll();
        } else {
          handleUploadAllFromUrls();
        }
        break;

      case "delete_upload_file":
        if (uploadFrom == "disk") {
          uploadFileDelete(action_value);
        } else {
          uploadFileDeleteForUrl(action_value);
        }
        break;

      case "delete_upload_file_all":
        if (uploadFrom == "disk") {
          setUploadFiles([]);
        } else {
          setUploadUrls("");
          setUploadingUrls([]);
        }
        break;

      case "toggole_file_area":
        setUploadArea(false);
        if (fileArea) {
          setFileArea(false);
        } else {
          openFile(action_value);
        }
        break;

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

      case "trash_file":
        handleTrashFiles();
        break;

      default:
        break;
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0 || !bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const generateUploadTable = (dataFiles: UploadFileType[]) => {
    return dataFiles.map((df) => ({
      id: df.id,
      [t("preview")]: (
        <div className="h-16 flex justify-start p-2">
          <img className="max-h-full max-w-full" src={df.url} alt="" />{" "}
        </div>
      ),
      [t("name")]: df.name,
      [t("size")]: formatBytes(Number(df.size)),
      [t("status")]: df.status,
      [t("progress")]: df.progress + "%",
      [t("action")]: (
        <div className="flex gap-2 text-xs">
          <div onClick={() => (df.status == "Uploading" ? null : actionManager("upload_file", df.id))}>
            <Button
              loading={df.status == "Uploading"}
              className="flex items-center bg-blue-950 rounded hover:bg-blue-800 text-white"
              showIcon={true}
              iconName={df.status == "Success" ? "check" : "upload"}
            >
              {df.status == "Success" ? "" : t("upload")}
            </Button>
          </div>

          <div onClick={() => (df.status == "Uploading" ? null : actionManager("delete_upload_file", df.id))}>
            <Button
              loading={df.status == "Uploading"}
              className="flex items-center bg-red-600 rounded hover:bg-red-500 text-white"
              showIcon={true}
              iconPosition="after"
              iconName="delete"
            >
              {t("remove")}
            </Button>
          </div>
        </div>
      ),
    }));
  };

  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});

  const toggleFolder = (id: string) => {
    setOpenFolders((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const generateFolder = (folder: any, isShort: boolean = false) => {
    const isOpen = !!openFolders[folder.id];
    const hasChildren = folder.children && folder.children.length > 0;

    return (
      <div className="w-full" key={folder.id}>
        <div
          onClick={() => {
            if (hasChildren) toggleFolder(folder.id);
            actionManager("select_current_path", folder);
          }}
          className={`flex items-center w-full gap-3 p-2 rounded-lg cursor-pointer transition-all 
          ${folder.path === currentPath?.path ? "bg-violet-100 text-violet-600 font-bold" : "hover:bg-gray-100 text-gray-600"}`}
        >
          <div className="shrink-0">
            <SvgIcon name={isOpen ? "folder_open" : "folder"} filled={isOpen} className={`size-5 ${isOpen ? "text-violet-600" : "text-gray-400"}`} />
          </div>

          {!isShort && <div className="flex-1 text-left truncate text-sm">{folder?.name}</div>}

          {hasChildren && !isShort && <SvgIcon name="chevron_right" className={`size-3 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`} />}
        </div>

        {/* RECURSIVE NESTING */}
        {hasChildren && (
          <div className={`grid transition-all duration-300 ${isOpen && !isShort ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 invisible"}`}>
            <div className="overflow-hidden">
              {/* Visual Guide Line for Multi-level */}
              <div className="flex flex-col gap-1 pl-4 mt-1 border-l-2 border-gray-100 ml-4">{folder.children.map((child: any) => generateFolder(child, isShort))}</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // const generateFolder = (folder: FolderType, isShort: boolean = false) => {
  //   const isOpen = !!openFolders[folder.id]; // Read from main state
  //   const hasChildren = !!(folder.child && folder.child.length);

  //   return (
  //     <div className="w-full" key={folder.id}>
  //       <div
  //         onClick={() => {
  //           if (hasChildren) toggleFolder(folder.id);
  //           actionManager("select_current_path", folder);
  //         }}
  //         className={`flex items-center w-full gap-3 p-2 rounded-lg cursor-pointer transition-all
  //         ${folder.path === currentPath?.path ? "bg-orange-50 text-orange-600 font-semibold" : "hover:bg-gray-100 text-gray-600"}`}>
  //         <div className="shrink-0">
  //           <SvgIcon name={isOpen ? "folder_open" : "folder"} filled={isOpen} className={`size-5 transition-transform duration-300 ${isOpen ? "rotate-12" : ""}`} />
  //         </div>

  //         {!isShort && (
  //           <div className="flex-1 text-left truncate">
  //             <span className="text-sm">{folder?.name}</span>
  //           </div>
  //         )}

  //         {hasChildren && !isShort && <SvgIcon name="chevron_right" className={`size-4 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`} />}
  //       </div>

  //       {/* Recursive Children Container */}
  //       {hasChildren && (
  //         <div className={`grid transition-all duration-300 ease-in-out ${isOpen && !isShort ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 invisible"}`}>
  //           <div className="overflow-hidden">
  //             <div className="flex flex-col gap-1 pl-4 mt-1 border-l border-gray-100 ml-4">{folder.child.map((sub) => generateFolder(sub, isShort))}</div>
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   );
  // };
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

  const text = "text-violet-600";
  const hover_text = "text-violet-600";
  const bg = "bg-violet-600";
  const hover_bg = "bg-violet-600";
  const bg_gradient = "bg-linear-to-r from-violet-500 to-fuchsia-500 hover:from-violet-700 hover:to-fuchsia-700";
  const hover_bg_gradient = "bg-linear-to-r from-violet-500 to-fuchsia-500 hover:from-violet-700 hover:to-fuchsia-700";
  const border = "border-violet-500";
  const hover_border = "border-violet-500";

  const getColor = (type: string) => {
    if (type == "text") {
      return text;
    }
    if (type == "hover:text") {
      return hover_text;
    }
    if (type == "bg") {
      return bg;
    }
    if (type == "bg_gradient") {
      return bg_gradient;
    }
    if (type == "border") {
      return border;
    }
  };

  return (
    <>
      <Section
        fullWidth
        className={`${className} ${appMediaShow ? visibleTranslateClass : hiddenTranslateClass} bg-slate-50/50 min-h-screen p-4 md:p-6 rounded-2xl`}
        loading={loading}
      >
        {showSubHeader && <SubHeader title={t("media_gallery")} showTranslationIcon TranslationIconAction={() => setShowTranslation(true)} />}

        <Section
          fullWidth
          permission={hasPermission("media.view")}
          className="space-y-6 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[calc(100vh-100px)]"
        >
          {/* Top Action Bar */}
          <div className="flex flex-col xl:flex-row justify-between gap-4 p-5 border-b border-slate-100 bg-white">
            <div className="flex flex-wrap items-center gap-3">
              {/* Hidden but preserved actions */}
              <div className="hidden justify-center" onClick={() => actionManager("trash_file")}>
                <Button
                  border="border border-slate-200"
                  showIcon={true}
                  iconName="sync_alt"
                  iconClass="size-5 text-slate-500"
                  iconPosition="after"
                  iconFilled={false}
                  className="hover:bg-slate-50 text-slate-700 rounded-xl transition-all"
                >
                  Move
                </Button>
              </div>
              <div className="hidden justify-center">
                <Button
                  border="border border-slate-200"
                  showIcon={true}
                  iconName="content_copy"
                  iconClass="size-5 text-slate-500"
                  iconPosition="after"
                  iconFilled={false}
                  className="hover:bg-slate-50 text-slate-700 rounded-xl transition-all"
                >
                  Copy
                </Button>
              </div>

              {/* Trash Action */}
              <div className="flex justify-center">
                {marks.length ? (
                  <Button
                    className="flex items-center text-white bg-rose-500 hover:bg-rose-600 shadow-sm shadow-rose-500/20 rounded-xl transition-all"
                    onClick={handleTrashFiles}
                    border=""
                    showIcon={true}
                    iconName="delete"
                    iconClass="size-5"
                    iconPosition="after"
                    iconFilled={false}
                  >
                    Trash
                  </Button>
                ) : (
                  <Button
                    className="flex items-center text-slate-400 bg-slate-100 rounded-xl cursor-not-allowed"
                    border=""
                    showIcon={true}
                    iconName="delete"
                    iconClass="size-5"
                    iconPosition="after"
                    iconFilled={false}
                    disabled
                  >
                    {t("trash")}
                  </Button>
                )}
              </div>

              {/* Search Input */}
              <div className="w-full sm:w-[300px] rounded-xl relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <SvgIcon name="search" className="size-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                </div>
                <Input
                  value={searchName}
                  setValue={setSearchName}
                  labelShow={false}
                  placeholder="Search files..."
                  id="search_media_input"
                  extraClass="border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10 py-2.5 rounded-xl transition-all text-sm w-full"
                  padding="pl-11 pr-4"
                  onKeyDown={handlePressEnterForSearch}
                />
              </div>

              {/* Translation Icon */}
              <div
                className="cursor-pointer flex items-center justify-center size-10 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50 text-slate-500 hover:text-teal-600 transition-all ml-1"
                onClick={() => setShowTranslation(true)}
                title="Manage Translations"
              >
                <SvgIcon name="language" className="size-5" />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex shrink-0 justify-center" onClick={() => actionManager("open_create_folder")}>
                <Button
                  className="flex items-center text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition-all"
                  showIcon={true}
                  iconName="create_new_folder"
                  iconClass="size-5"
                  iconPosition="before"
                  iconFilled={true}
                >
                  {t("add_folder")}
                </Button>
              </div>
              <div className="flex shrink-0 justify-center" onClick={() => actionManager("toggole_upload_area")}>
                <Button
                  className="flex items-center text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-md shadow-emerald-500/20 rounded-xl transition-all"
                  border=""
                  showIcon={true}
                  iconName="cloud_upload"
                  iconClass="size-5"
                  iconPosition="before"
                  iconFilled={false}
                >
                  {t("upload_files")}
                </Button>
              </div>
              <div className="flex shrink-0 justify-center" onClick={() => setFilterShow(true)}>
                <Button
                  className="flex items-center text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all"
                  showIcon={true}
                  iconName="filter_list"
                  iconClass="size-5"
                  iconPosition="before"
                  iconFilled={false}
                >
                  {t("filter_media")}
                </Button>
              </div>
            </div>
          </div>

          {/* Main Gallery Content */}
          <div className="flex-1 overflow-y-auto scrollbar-width-thin scrollbar-thumb-teal-200 scrollbar-track-transparent p-6 pt-0 bg-slate-50/30">
            {/* Sticky Top Bar: Breadcrumbs & Selection */}
            <div className="flex gap-3 w-full justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-20 py-4 border-b border-slate-100/50 mb-6">
              <div className="flex flex-wrap justify-start items-center gap-2 text-sm">
                {Array.isArray(breadCumbs) &&
                  breadCumbs.map((itm, index) => (
                    <React.Fragment key={index}>
                      <div
                        className={`flex justify-start items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer font-medium transition-all ${
                          currentFolderID === itm?.id ? "bg-teal-50 text-teal-700" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                        }`}
                        onClick={() => setCurrentFolderID(itm?.id)}
                      >
                        <SvgIcon
                          name={currentFolderID === itm?.id ? "folder_open" : "folder"}
                          className={`size-4 ${currentFolderID === itm?.id ? "text-teal-500" : "text-slate-400"}`}
                          filled={currentFolderID === itm?.id}
                        />
                        <span className="truncate max-w-[150px]">{itm?.name}</span>
                      </div>
                      {index !== breadCumbs.length - 1 && <SvgIcon name="chevron_right" className="size-4 text-slate-300" />}
                    </React.Fragment>
                  ))}
              </div>

              {/* Mark All Toggle */}
              <div
                onClick={() => actionManager("toggole_mark_all")}
                className="group flex items-center gap-2 cursor-pointer bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-all shadow-sm"
              >
                {Array.isArray(marks) && Array.isArray(files) && marks.length && files.length === marks.length ? (
                  <div title="Unmark All" className="flex items-center gap-2 text-emerald-700 font-medium text-sm">
                    <SvgIcon name="check_box" className="size-5 text-emerald-500" filled />
                    <span>All Selected</span>
                  </div>
                ) : (
                  <div title="Mark All" className="flex items-center gap-2 text-slate-600 group-hover:text-emerald-700 font-medium text-sm transition-colors">
                    <SvgIcon name="check_box_outline_blank" className="size-5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                    <span>Select All</span>
                  </div>
                )}
                {marks?.length > 0 && <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-md ml-1">{marks.length}</span>}
              </div>
            </div>

            {/* Folders Grid */}
            {Array.isArray(mainData) && mainData.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
                {mainData.map((itm) => (
                  <div
                    key={itm?.id}
                    onDoubleClick={() => setCurrentFolderID(itm?.id)}
                    className={`group relative p-4 rounded-2xl cursor-pointer ${
                      itm?.id == currentFolder?.id ? "hidden" : "flex"
                    } justify-between items-center bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-cyan-300 transition-all duration-300 overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 to-teal-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex gap-3 items-center relative z-10 w-[80%]">
                      <div className="p-2 bg-cyan-50 rounded-xl group-hover:bg-cyan-100 transition-colors">
                        <SvgIcon name="folder" className="size-6 text-cyan-500" filled />
                      </div>
                      <div className="font-semibold text-slate-700 group-hover:text-teal-800 truncate leading-tight">{itm?.name}</div>
                    </div>

                    <div className="relative z-10">
                      <DropdownAndTooltip
                        position="bottom"
                        side="right"
                        width="w-[220px]"
                        button={
                          <div className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors">
                            <SvgIcon name="more_vert" className="size-5" />
                          </div>
                        }
                      >
                        <div className="pt-2">
                          <div className="p-2 bg-white rounded-xl border border-slate-100 shadow-xl shadow-slate-200/50 space-y-0.5">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 py-2 border-b border-slate-50 mb-1">{t("actions")}</div>
                            <div
                              onClick={() => setCurrentFolderID(itm?.id)}
                              className="flex justify-start gap-3 items-center text-slate-600 hover:bg-teal-50 hover:text-teal-700 rounded-lg px-3 py-2 cursor-pointer transition-colors text-sm font-medium"
                            >
                              <SvgIcon name="folder_open" className="size-4" />
                              <div>{t("open")}</div>
                            </div>
                            <div
                              onClick={() => openArchiveEditModal(itm?.id)}
                              className="flex justify-start gap-3 items-center text-slate-600 hover:bg-cyan-50 hover:text-cyan-700 rounded-lg px-3 py-2 cursor-pointer transition-colors text-sm font-medium"
                            >
                              <SvgIcon name="edit" className="size-4" />
                              <div>{t("rename")}</div>
                            </div>
                            <div
                              onClick={() => handleTrashFolder(itm?.id)}
                              className="flex justify-start gap-3 items-center text-rose-600 hover:bg-rose-50 rounded-lg px-3 py-2 cursor-pointer transition-colors text-sm font-medium"
                            >
                              <SvgIcon name="delete" className="size-4" />
                              <div>{t("move_to_trash")}</div>
                            </div>
                          </div>
                        </div>
                      </DropdownAndTooltip>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Files Grid */}
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
                        className="relative aspect-square overflow-hidden bg-slate-50 cursor-pointer flex items-center justify-center"
                        onClick={() => handleMarkItems(file.id)}
                      >
                        {/* Assuming printMedia handles the img/icon rendering. Apply a scale on hover. */}
                        <div className="w-full h-full transform group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                          {printMedia(file)}
                        </div>

                        {/* Dark Overlay on Hover */}
                        <div className={`absolute inset-0 bg-teal-900/10 opacity-0 group-hover:opacity-100 transition-opacity ${isSelected ? "opacity-0" : ""}`} />

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
                        <div className="w-full truncate text-xs font-medium text-slate-600" title={file?.name}>
                          {file?.name}
                        </div>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            openFile(file);
                          }}
                          className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 cursor-pointer transition-colors"
                          title="View Details"
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
                  <span className="text-sm font-medium animate-pulse">Loading media...</span>
                </div>
              ) : (
                <>
                  {!Array.isArray(files) || !files.length ? (
                    <div className="col-span-full py-24 flex flex-col items-center justify-center text-slate-400 gap-4 bg-white rounded-3xl border border-dashed border-slate-200">
                      <div className="p-4 bg-slate-50 rounded-full">
                        <SvgIcon name="image_not_supported" className="size-10 text-slate-300" />
                      </div>
                      <div className="text-sm font-medium text-slate-500">No files found in this folder</div>
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

        {/* Floating Update Button */}
        {showUpdateButton && (
          <div className="fixed bottom-6 lg:bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl border border-slate-200">
            <div className="text-sm font-bold text-slate-600 mr-2 hidden sm:block">
              <span className="text-emerald-600">{marks.length}</span> item(s) selected
            </div>
            <div className="flex justify-center" onClick={() => closeMediaGallery()}>
              <Button
                border=""
                showIcon={true}
                iconName="close"
                iconClass="size-4"
                iconPosition="before"
                iconFilled={false}
                className="flex items-center gap-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-medium rounded-xl px-5 py-2.5 cursor-pointer transition-all"
              >
                <span>Cancel</span>
              </Button>
            </div>
            <div className="flex justify-center" onClick={handleSelectForGlobalMedia}>
              <Button
                border=""
                showIcon={true}
                iconName="check_circle"
                iconClass="size-5"
                iconPosition="before"
                iconFilled={false}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-xl px-8 py-2.5 shadow-lg shadow-teal-500/30 transition-transform transform hover:-translate-y-0.5"
              >
                <span>Confirm Selection</span>
              </Button>
            </div>
          </div>
        )}

        {/* Modals & Drawers */}

        {/* Upload Modal */}
        <Modal maxWidth="w-full max-w-4xl" loading={loading} permission={hasPermission("media.create")} show={uploadArea} setShow={setUploadArea}>
          <div className="bg-white p-6 sm:p-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800">Upload Media</h2>
              <p className="text-slate-500 mt-1 text-sm">Add new files to your gallery</p>
            </div>

            <div className="mx-auto flex w-full max-w-sm justify-center items-center gap-2 bg-slate-100 p-1.5 rounded-xl text-sm font-medium mb-8">
              <div className="flex-1" onClick={() => actionManager("upload_from", "disk")}>
                <Button
                  showIcon={true}
                  iconName="hard_drive"
                  iconClass="size-4"
                  iconPosition="before"
                  iconFilled={false}
                  className={`w-full py-2.5 rounded-lg transition-all ${
                    uploadFrom == "disk" ? "bg-white text-teal-700 shadow-sm border-none" : "bg-transparent text-slate-500 hover:text-slate-700 border-none"
                  }`}
                >
                  {t("upload_from_disk")}
                </Button>
              </div>
              <div className="flex-1" onClick={() => actionManager("upload_from", "url")}>
                <Button
                  showIcon={true}
                  iconName="link"
                  iconClass="size-4"
                  iconPosition="before"
                  iconFilled={false}
                  className={`w-full py-2.5 rounded-lg transition-all ${
                    uploadFrom == "url" ? "bg-white text-teal-700 shadow-sm border-none" : "bg-transparent text-slate-500 hover:text-slate-700 border-none"
                  }`}
                >
                  {t("upload_from_url")}
                </Button>
              </div>
            </div>

            {uploadFrom == "disk" && (
              <div className="w-full space-y-6">
                <div className="border-2 border-dashed border-teal-200 bg-teal-50/50 hover:bg-teal-50 rounded-3xl transition-colors">
                  <FileInput multiple={true} setFiles={inputFiles} className="py-16 text-teal-700 font-medium" text={t("drag_drop")} />
                </div>

                {uploadFiles && uploadFiles.length ? (
                  <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                    <div className="flex w-full justify-between items-center text-sm gap-4 pb-4 border-b border-slate-100 mb-4">
                      <span className="font-semibold text-slate-700">{uploadFiles.length} file(s) ready</span>
                      <div className="flex gap-3">
                        <div onClick={() => actionManager("delete_upload_file_all")}>
                          <Button
                            loading={uploading}
                            className="bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg px-4 py-2 font-medium transition-colors"
                            border=""
                            showIcon={true}
                            iconName="delete_sweep"
                          >
                            {t("remove_all")}
                          </Button>
                        </div>
                        <div onClick={() => actionManager("upload_file_all")}>
                          <Button
                            loading={uploading}
                            showIcon={true}
                            iconName="cloud_upload"
                            className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-6 py-2 shadow-sm font-medium transition-colors"
                          >
                            {t("upload_all")}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto pr-2 scrollbar-width-thin scrollbar-thumb-slate-200">
                      <Table data={generateUploadTable(uploadFiles)} loading={uploading} excludeKeys={["id"]} notFoundText={t("no_files_found")} />
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {uploadFrom == "url" && (
              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <TextArea
                    label={t("list_of_valid_links")}
                    value={uploadUrls}
                    setValue={inputUrls}
                    id="ImageUrls"
                    required={true}
                    extraClass="bg-white focus:ring-teal-500 border-slate-200 rounded-xl"
                    placeholder="Example: https://domain.com/image1.png, https://domain.com/image2.jpg"
                    rows={4}
                  />
                </div>

                {uploadingUrls && uploadingUrls.length ? (
                  <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                    <div className="flex w-full justify-between items-center text-sm gap-4 pb-4 border-b border-slate-100 mb-4">
                      <span className="font-semibold text-slate-700">{uploadingUrls.length} link(s) ready</span>
                      <div className="flex gap-3">
                        <div onClick={() => actionManager("delete_upload_file_all")}>
                          <Button
                            loading={uploading}
                            className="bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg px-4 py-2 font-medium transition-colors"
                            border=""
                            showIcon={true}
                            iconName="delete_sweep"
                          >
                            {t("remove_all")}
                          </Button>
                        </div>
                        <div onClick={() => actionManager("upload_file_all")}>
                          <Button
                            loading={uploading}
                            showIcon={true}
                            iconName="cloud_upload"
                            className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-6 py-2 shadow-sm font-medium transition-colors"
                          >
                            {t("upload_all")}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto pr-2 scrollbar-width-thin scrollbar-thumb-slate-200">
                      <Table data={generateUploadTable(uploadingUrls)} loading={uploading} excludeKeys={["size", "id"]} notFoundText={t("no_links_found")} />
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </Modal>

        {/* File Details Edit Modal */}
        <Modal maxWidth="w-full max-w-6xl" loading={false} permission={hasPermission("media.view")} show={fileArea} setShow={setFileArea}>
          <div className="bg-white flex flex-col md:flex-row max-h-[90vh]">
            {/* Left: Preview */}
            <div className="w-full md:w-12/12 bg-slate-50 flex flex-col justify-center items-center p-8 border-b md:border-b-0 md:border-r border-slate-200 relative">
              <div className="absolute top-4 left-4 bg-white/80 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 shadow-sm">
                {formatSize(currentFile?.size ?? 0, "KB")}
              </div>
              <div className="w-full h-full flex items-center justify-center drop-shadow-md">{printViewMedia(currentFile)}</div>
            </div>

            {/* Right: Meta Info Form */}
            <Section loading={fileInfoLoading} className="flex-1 p-6 md:p-8 bg-white overflow-y-auto">
              <div className="space-y-5 text-sm">
                <LanguageSelectForInputFields currentLanguage={inputLanguage} setCurrentLnaguage={setInputLanguage} />
                <Input
                  required
                  label={t("file_name")}
                  value={fileName && fileName[inputLanguage] ? fileName[inputLanguage] : ""}
                  setValue={(val) => handleMultiLanguageInput(val, setFileName)}
                  extraClass="bg-slate-50 border-slate-200 focus:bg-white focus:border-teal-500 focus:ring-teal-500/20 rounded-xl"
                  errorMessage={errors?.fileName}
                  iconName="short_text"
                />
                <Input
                  label={t("alt_tag")}
                  value={altTag && altTag[inputLanguage] ? altTag[inputLanguage] : ""}
                  setValue={(val) => handleMultiLanguageInput(val, setAltTag)}
                  extraClass="bg-slate-50 border-slate-200 focus:bg-white focus:border-teal-500 focus:ring-teal-500/20 rounded-xl"
                  errorMessage={errors?.altTag}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label={t("source_name")}
                    value={source && source[inputLanguage] ? source[inputLanguage] : ""}
                    setValue={(val) => handleMultiLanguageInput(val, setSource)}
                    extraClass="bg-slate-50 border-slate-200 focus:bg-white focus:border-teal-500 focus:ring-teal-500/20 rounded-xl"
                    errorMessage={errors?.source}
                  />
                  <Input
                    label={t("source_link")}
                    value={sourceLink}
                    setValue={setSourceLink}
                    extraClass="bg-slate-50 border-slate-200 focus:bg-white focus:border-teal-500 focus:ring-teal-500/20 rounded-xl"
                    errorMessage={errors?.sourceLink}
                  />
                </div>
                <TextArea
                  label={t("description")}
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
                    label={t("direct_link")}
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
                    {t("update_details")}
                  </Button>
                </div>
              </div>
            </Section>
          </div>
        </Modal>

        {/* Create/Update Folder Modal */}
        <Modal maxWidth="w-full max-w-md" loading={loading} show={modalShow} setShow={setModalShow}>
          <div className="bg-white p-8">
            <div className="flex items-center justify-center w-16 h-16 bg-teal-50 rounded-2xl mb-6 mx-auto">
              <SvgIcon name="folder" className="size-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-center text-slate-800 mb-6">{t("folder_details")}</h3>

            <div className=" justify-center mb-6">
              <LanguageSelectForInputFields currentLanguage={inputLanguage} setCurrentLnaguage={setInputLanguage} />
            </div>

            <div className="space-y-6">
              <Input
                value={name && name[inputLanguage] ? name[inputLanguage] : ""}
                setValue={(val) => handleMultiLanguageInput(val, setName)}
                label={t("folder_name")}
                id="archive_name"
                iconName="folder"
                errorMessage={errors?.name}
                required
                extraClass="bg-slate-50 border-slate-200 focus:bg-white focus:border-teal-500 rounded-xl"
              />

              <Button
                onClick={CreateOrUpdateFolder}
                border=""
                showIcon={true}
                iconName="arrow_forward"
                iconClass="size-5"
                iconPosition="after"
                iconFilled={false}
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex justify-center items-center"
              >
                {t("submit_now")}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Advanced Filter Drawer */}
        <Drawer position="right" permission={hasPermission("media.view")} loading={loading} show={filterShow} set_show={setFilterShow}>
          <div className="flex flex-col justify-between h-full bg-slate-50">
            <div className="p-6 bg-gradient-to-r from-teal-800 to-cyan-800 text-white shadow-md flex items-center gap-3">
              <SvgIcon name="tune" className="size-6 text-teal-200" />
              <span className="text-xl font-bold tracking-wide">{t("advance_filter")}</span>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <Input
                  value={searchName}
                  setValue={setSearchName}
                  label={t("name")}
                  id="filter_name"
                  errorMessage={errors?.name}
                  iconName="search"
                  extraClass="bg-slate-50 border-slate-200 focus:border-teal-500 rounded-xl"
                />

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">{t("file_type")}</label>
                  <Select
                    items={[
                      { name: t("image"), id: 1 },
                      { name: t("video"), id: 2 },
                      { name: t("zip_rar"), id: 3 },
                      { name: t("pdf"), id: 4 },
                      { name: t("audio"), id: 5 },
                      { name: t("doc"), id: 6 },
                    ]}
                    value={searchType}
                    setValue={setSearchType}
                    label={t("type")}
                    labelShow={false}
                    id="filter_type"
                    errorMessage={errors?.searchType}
                    extraClass="bg-slate-50 border-slate-200 focus:border-teal-500 rounded-xl w-full"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 bg-white border-t border-slate-200">
              <Button
                onClick={getInitialData}
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex justify-center items-center gap-2"
              >
                <SvgIcon name="filter_list" className="size-5" />
                Apply Filters
              </Button>
            </div>
          </div>
        </Drawer>

        <MediaGalleryTranslation show={showTranslation} setShow={setShowTranslation} />
      </Section>
    </>
  );
}

export default GlobalMediaGallery;
