import { useEffect, useRef, useState } from "react";
import Section from "@/modules/global/elements/section";
import SvgIcon from "@/modules/global/icons/svg_icons";
import Table from "@/modules/global/elements/table";
import DefaultPagination from "@/modules/global/elements/pagination";
import { toast } from "sonner";
import Modal from "@/modules/global/elements/modal";
import Button from "@/modules/global/elements/button";
import Input from "@/modules/global/input/input";
import Drawer from "@/modules/global/elements/drawer";
import { checkErrors, checkPermission, dateTimeFormat, formatNumber, getQueryParam } from "@/lib/helper";
import ImageBox from "@/modules/global/elements/image_box";
import Api from "@/lib/api";
import { useRouter } from "next/router";
import SelectInput from "@/modules/global/input/select";
import LoaderProgress from "@/modules/global/elements/progress";
import EChart from "@/modules/global/partial/echart";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { useGlobalStore } from "@/modules/global/store/useGlobalStore";
import { useLanguageStore } from "@/modules/language/store/useLanguageStore";

function DottormailViewListPage() {
  const router = useRouter();
  const { logo_url } = useGlobalStore();
  const { appPermissions, hasPermission } = useAuthStore();
  const { appSelectedLocale } = useLanguageStore();
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [marks, setMarks] = useState<any[]>([]);
  const [modalShow, setModalShow] = useState(false);
  const [filterShow, setFilterShow] = useState(false);
  const [action, setAction] = useState<"create" | "update">("create");
  const [actionId, setActionId] = useState<string>("");
  const [mainData, setMainData] = useState<any[]>([]);
  const [setting, setSetting] = useState<any>(null);

  const [credits, setCredits] = useState(0);

  const [refresh, setRefresh] = useState(0);
  const refreshPage = () => {
    setRefresh((prev) => prev + 1);
  };

  // Pagination
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginateInfo, setPaginateInfo] = useState("");

  // Search strings
  const [searchEmail, setSearchEmail] = useState("");
  const [searchChecked, setSearchChecked] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  const handleDelete = async () => {
    try {
      let url = "v1/dashboard/email-list/delete";

      if (checkErrors({ url, marks })) {
        return;
      }
      setLoading(true);
      await Api.post(url, { marks })
        .then((res: any) => {
          setDeleteConfirm(false);
          refreshPage();
          setMarks([]);
          toast.success(res.data?.message);
          setLoading(false);
        })
        .catch((err: any) => {
          toast.error(err?.response?.data?.message);
          setLoading(false);
        });
    } catch (error: any) {}
  };

  const [editModalShow, setEditModalShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [country, setCountry] = useState("");
  const [language, setLanguage] = useState("");
  const [category, setCategory] = useState("");
  const [others, setOthers] = useState("");

  const [labelID, setLabelID] = useState("");

  const [label, setLabel] = useState<any>("");
  const [reloadChart, setReloadChart] = useState(0);
  const timeoutRef = useRef<any>(null);
  const [checkInterval, setCheckInterval] = useState(0);
  const [stats, setStats] = useState<any>("");

  const handleCalculateInvalid = (data: any) => {
    if (data.checked_count) {
      let _invalid = data.checked_count - (data.valid_count + data.catch_count + data.unknown_count + data.failed_count);
      if (_invalid >= 0) {
        return _invalid;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  };

  const calculatePercentagesForChart = (data: any) => {
    const total: any = data?.checked_count;
    const invalid_count: any = handleCalculateInvalid(data);
    if (total) {
      const percentages = {
        valid: ((data.valid_count / total) * 100).toFixed(2),
        invalid: ((invalid_count / total) * 100).toFixed(2),
        risky: ((data.catch_count / total) * 100).toFixed(2),
        unknown: ((data.unknown_count / total) * 100).toFixed(2),
        duplicate: ((data.duplicate_count / total) * 100).toFixed(2),
        failed: ((data.failed_count / total) * 100).toFixed(2),
      };
      setStats(percentages);
      setReloadChart((prev) => prev + 1);
    } else {
      const percentages = {
        valid: 0,
        invalid: 0,
        risky: 0,
        unknown: 0,
        duplicate: 0,
        failed: 0,
      };
      setStats(percentages);
      setReloadChart((prev) => prev + 1);
    }
  };

  const getInitialData = async (id: any) => {
    setLoading(true);
    let data = {
      id: id,
      page: currentPage,
      email: searchEmail,
      checked: searchChecked,
      status: searchStatus,
    };
    let url = "v1/dashboard/list-label/view";
    await Api.post(url, data)
      .then((res: any) => {
        setLoading(false);
        setLabel(res.data?.label);
        calculatePercentagesForChart(res.data?.label);
        setCheckInterval((prev) => prev + 1);
        setCredits(res.data?.credits?.credit);
        setMainData(res.data.data.data);
        setTotalPage(res.data.data.last_page);
        setPaginateInfo(res.data.data.to + " out of " + res.data.data.total);
      })
      .catch((err: any) => {
        setLoading(false);
        toast.error(err?.response?.data?.message);
      });
  };

  useEffect(() => {
    const id = getQueryParam("id");
    if (id) {
      setLabelID(id);
      getInitialData(id);
    } else {
      toast.error("List not found");
      router.back();
    }
    return () => clearInterval(timeoutRef.current);
  }, [refresh, currentPage, appSelectedLocale]);

  const handlePressEnterForSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      refreshPage();
    }
  };

  const actionManager = (actionType: string, actionValue?: any) => {
    if (actionType == "open_create") {
      setAction("create");
      setDataSheet([]);
      setUploadedCount(0);
      setFileInfo("");
      setTotalRecords(0);
      setCompleteUpload(false);
      setName("");
      setEmail("");
      setPosition("");
      setCountry("");
      setLanguage("");
      setCategory("");
      setOthers("");
      setModalShow(true);
    }
    if (actionType == "open_update") {
      setAction("update");
      setActionId(actionValue);
      Array.isArray(mainData) &&
        mainData.map((md) => {
          if (md.id == actionValue) {
            setName(md?.name ?? "");
            setEmail(md.email ?? "");
            setPosition(md.position ?? "");
            setCountry(md.country ?? "");
            setLanguage(md.language ?? "");
            setCategory(md.category ?? "");
            if (md?.others) {
              setOthers(JSON.parse(md.others) ?? "");
            }
            setEditModalShow(true);
          }
        });
    }
    if (actionType == "delete_confirmation") {
      setDeleteConfirm(true);
    }
    if (actionType == "delete_yes") {
      deleteOrRestore("delete");
    }
    if (actionType == "delete_no") {
      setDeleteConfirm(false);
    }
    if (actionType == "restore") {
      deleteOrRestore("restore");
    }
  };

  const deleteOrRestore = async (type: string) => {
    try {
      setLoading(true);
      let url = type === "delete" ? "package/delete" : "package/restore";
      await Api.post(url, { id: actionId })
        .then((res: any) => {
          toast.success(res?.data?.message);
          setDeleteConfirm(false);
          refreshPage();
          setLoading(false);
        })
        .catch((err: any) => {
          toast.error(err?.response?.data?.message);
          setLoading(false);
        });
    } catch (error: any) {
      setLoading(false);
    }
  };

  const handlePercentage = (data: any, type: any) => {
    if (type === "valid") {
      if (data.checked_count) {
        return ((data.valid_count * 100) / data.checked_count).toFixed(1);
      } else return 0;
    }
    if (type === "invalid") {
      if (data.checked_count) {
        let _invalid = data.checked_count - data.valid_count;
        if (_invalid >= 0) return ((_invalid * 100) / data.checked_count).toFixed(1);
        else return 0;
      } else return 0;
    }
    if (type === "duplicate") {
      if (data.duplicate_count) return ((data.duplicate_count * 100) / data.checked_count).toFixed(1);
      else return 0;
    }
    if (type === "unknown") {
      if (data.unknown_count) return ((data.unknown_count * 100) / data.checked_count).toFixed(1);
      else return 0;
    }
    if (type === "failed") {
      if (data.failed_count) return ((data.failed_count * 100) / data.checked_count).toFixed(1);
      else return 0;
    }
    if (type === "catch") {
      if (data.catch_count) return ((data.catch_count * 100) / data.checked_count).toFixed(1);
      else return 0;
    }
  };

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentData, setCurrentData] = useState<any>(null);

  const handleShowDetails = (id: number) => {
    if (Array.isArray(mainData)) {
      const findRow = mainData.find((row: any) => row.id === id);
      let finalData = [];
      finalData.push({ name: "Status :", value: designMainStatus(findRow?.status, findRow?.checked) });
      finalData.push({ name: "Email:", value: <span className="font-medium text-slate-800">{findRow?.email}</span> });
      finalData.push({ name: "Format :", value: designMainStatus(findRow?.format, findRow?.checked) });
      finalData.push({ name: "Domain :", value: designMainStatus(findRow?.domain, findRow?.checked) });
      finalData.push({ name: "Mx :", value: designMainStatus(findRow?.mx, findRow?.checked) });
      finalData.push({ name: "User :", value: designMainStatus(findRow?.user, findRow?.checked) });
      finalData.push({ name: "Time :", value: findRow?.checked == 1 ? formatNumber(findRow?.time) + " Second" : "__" });
      setCurrentData(finalData);
      setShowDetailsModal(true);
    }
  };

  const designMainStatus = (result: number, isChecked: number) => {
    if (isChecked !== 1) {
      return <span className="text-slate-400 font-medium">Pending...</span>;
    }
    if (result === 0) {
      return (
        <div className="flex justify-start">
          <div className="w-[90px] border border-rose-200 bg-rose-50 px-2 py-1.5 rounded-lg text-[11px] tracking-wide text-rose-600 shadow-sm">
            <div className="flex gap-1.5 items-center justify-start">
              <div className="size-1.5 bg-rose-500 rounded-full"></div>
              <div className="font-bold">INVALID</div>
            </div>
          </div>
        </div>
      );
    }
    if (result === 1) {
      return (
        <div className="flex justify-start">
          <div className="w-[90px] border border-emerald-200 bg-emerald-50 px-2 py-1.5 rounded-lg text-[11px] tracking-wide text-emerald-600 shadow-sm">
            <div className="flex gap-1.5 items-center justify-start">
              <div className="size-1.5 bg-emerald-500 rounded-full"></div>
              <div className="font-bold">VALID</div>
            </div>
          </div>
        </div>
      );
    }
    if (result === 2) {
      return (
        <div className="flex justify-start">
          <div className="w-[90px] border border-cyan-200 bg-cyan-50 px-2 py-1.5 rounded-lg text-[11px] tracking-wide text-cyan-600 shadow-sm">
            <div className="flex gap-1.5 items-center justify-start">
              <div className="size-1.5 bg-cyan-500 rounded-full"></div>
              <div className="font-bold">UNKNOWN</div>
            </div>
          </div>
        </div>
      );
    }
    if (result === 3) {
      return (
        <div className="flex justify-start">
          <div className="w-[90px] border border-slate-200 bg-slate-50 px-2 py-1.5 rounded-lg text-[11px] tracking-wide text-slate-600 shadow-sm">
            <div className="flex gap-1.5 items-center justify-start">
              <div className="size-1.5 bg-slate-500 rounded-full"></div>
              <div className="font-bold">FAILED</div>
            </div>
          </div>
        </div>
      );
    }
    if (result === 4) {
      return (
        <div className="flex justify-start">
          <div className="w-[90px] border border-amber-200 bg-amber-50 px-2 py-1.5 rounded-lg text-[11px] tracking-wide text-amber-600 shadow-sm">
            <div className="flex gap-1.5 items-center justify-start">
              <div className="size-1.5 bg-amber-500 rounded-full"></div>
              <div className="font-bold">RISKY</div>
            </div>
          </div>
        </div>
      );
    }
  };

  const prepareTableData = (data: any[]) => {
    let tableData: any[] = [];
    if (Array.isArray(data)) {
      data.map((dat) => {
        tableData.push({
          id: dat.id,
          status: designMainStatus(dat?.status, dat?.checked),
          email: <span className="font-medium text-slate-700">{dat?.email}</span>,
          time: dat?.checked == 1 ? <span className="font-mono text-sm text-slate-500">{formatNumber(dat?.time)}s</span> : <span className="text-slate-400">__</span>,
          actions: (
            <div className="flex items-center gap-4">
              <div onClick={() => handleShowDetails(dat?.id)}>
                <Button
                  border=""
                  showIcon={true}
                  iconName="visibility"
                  iconClass="size-4"
                  iconPosition="before"
                  iconFilled={false}
                  className="flex items-center gap-2 bg-cyan-50 hover:bg-cyan-600 text-cyan-700 hover:text-white transition-colors duration-300 rounded-lg shadow-sm font-medium px-4"
                >
                  View
                </Button>
              </div>
            </div>
          ),
        });
      });
    }
    return tableData;
  };

  const [searchText, setSearchText] = useState("");

  const [dataSheet, setDataSheet] = useState<any[]>([]);
  const [fileInfo, setFileInfo] = useState<any>(null);
  const [totalRecords, setTotalRecords] = useState(0);

  const [completeUpload, setCompleteUpload] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const [fileName, setFileName] = useState("");

  const startChecking = async () => {
    setLoading(true);
    const url = "v1/dashboard/list-label/start-job";
    const data = { id: label?.id };
    await Api.post(url, data)
      .then((res) => {
        refreshPage();
        toast.success(res.data.message);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        setLoading(false);
      });
  };

  const stopChecking = async () => {
    if (label && label?.status == 1) {
      setLoading(true);
      const url = "v1/dashboard/list-label/stop-job";
      const data = { id: label?.id };
      await Api.post(url, data)
        .then((res) => {
          refreshPage();
          setLoading(false);
          toast.success(res.data.message);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
          setLoading(false);
        });
    } else {
      toast.error("Something went wrong");
    }
  };

  const [createListModal, setCreateListModal] = useState(false);

  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const handleDownload = () => {};

  useEffect(() => {
    if (label?.status == 1) {
      timeoutRef.current = setTimeout(() => {
        refreshPage();
      }, 30000);
    } else {
      clearTimeout(timeoutRef?.current);
    }
  }, [checkInterval]);

  const [isVisible, setIsvisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        clearTimeout(timeoutRef?.current);
        setIsvisible(true);
        setCheckInterval((prev) => prev + 1);
      } else {
        clearTimeout(timeoutRef?.current);
        setIsvisible(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isVisible]);

  const handleCheckStatus = (status: any) => {
    if (status === 0) return "Invalid";
    if (status === 1) return "Valid";
    if (status === 2) return "Unknown";
    if (status === 3) return "Failed";
    if (status === 4) return "Risky";
  };

  const handleExport = async (data: any[], file_name: string) => {
    try {
      if (!data || data.length === 0) {
        toast.error("No data to export");
        return;
      }

      toast.info("Generating Excel Sheet...");

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sheet1");

      const headers = Object.keys(data[0]);
      worksheet.addRow(headers);

      data.forEach((item) => {
        const row = headers.map((key) => item[key] ?? "");
        worksheet.addRow(row);
      });

      worksheet.getRow(1).font = { bold: true };

      worksheet.columns.forEach((column) => {
        let maxLength = 10;
        column.eachCell?.({ includeEmpty: true }, (cell) => {
          const val = cell.value ? cell.value.toString() : "";
          maxLength = Math.max(maxLength, val.length);
        });
        column.width = maxLength + 2;
      });

      const buffer = await workbook.xlsx.writeBuffer();

      saveAs(
        new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        `${file_name}.xlsx`,
      );

      toast.success("Successfully Downloaded");
    } catch (error) {
      console.error(error);
      toast.error("Unable to generate Excel Sheet");
    }
  };

  const handleDownloadEmails = async (value: any) => {
    let data: any = { label: label?.id };
    let status = 1;
    let file_name = label?.name;
    if (value === "valid") {
      data = { ...data, status: 1 };
      file_name = file_name + "_valid_emails";
    }
    if (value === "invalid") {
      data = { ...data, status: 0 };
      file_name = file_name + "_invalid_emails";
    }
    if (value === "both") {
      data = { ...data, status: "both" };
      file_name = file_name + "_valid_and_invalid_emails";
    }
    if (value === "risky") {
      data = { ...data, status: 4 };
      file_name = file_name + "_risky_emails";
    }

    setLoading(true);
    toast.info("We are preparing your file");
    await Api.post("v1/dashboard/list-label/download", data)
      .then((res) => {
        toast.success(res.data.message);

        if (Array.isArray(res.data.data) && res.data.data.length) {
          let dataSet: any = [];
          res.data.data.map((dat: any) => {
            let info = dat.info ? JSON.parse(dat.info) : {};
            let other = {
              email: dat.email,
              status: handleCheckStatus(dat.status),
              format: dat.format === 1 ? "Valid" : "inValid",
              dns: dat.domain === 1 ? "Valid" : "inValid",
              mx: dat.mx === 1 ? "Valid" : "inValid",
              user: dat.user === 1 ? "Valid" : "inValid",
            };
            let merged = { ...other, ...info };
            dataSet.push(merged);
          });
          handleExport(dataSet, file_name);
          setLoading(false);
        } else {
          toast.error("Data not found");
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        setLoading(false);
      });
  };

  const downloadDuplicatesOnly = async () => {
    setLoading(true);
    toast.info("We are preparing your file");
    await Api.post("v1/dashboard/list-label/download", { label: label?.id, download: 1 })
      .then((res) => {
        toast.success(res.data.message);
        let file_name = label?.name;
        setLoading(false);

        if (Array.isArray(res.data.data) && res.data.data.length) {
          let seenEmails = new Set();
          let duplicates = [];

          res.data.data.forEach((item: any) => {
            if (seenEmails.has(item.email)) {
              duplicates.push(item);
            } else {
              seenEmails.add(item.email);
            }
          });

          let data = res.data.data.map((dat: any) => {
            return {
              email: dat.email,
              status: handleCheckStatus(dat.status),
              format: dat.format === 1 ? "Valid" : "inValid",
              dns: dat.domain === 1 ? "Valid" : "inValid",
              mx: dat.mx === 1 ? "Valid" : "inValid",
              user: dat.user ? "Valid" : "inValid",
            };
          });
          handleExport(data, file_name + "_duplicates");
          setLoading(false);
        } else {
          toast.error("Data not found");
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        setLoading(false);
      });
  };

  return (
    <Section
      permission={hasPermission("email-list.view")}
      loading={loading}
      confirmation={deleteConfirm}
      confirmation_no={() => actionManager("delete_no")}
      confirmation_yes={() => handleDelete()}
      className="space-y-8 bg-slate-50/50 min-h-screen rounded-[32px] p-2"
    >
      {/* Top Banner for Active Checking */}
      {label && label?.status == 1 && (
        <div className="p-6 bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600 rounded-2xl shadow-lg relative overflow-hidden flex items-center justify-between">
          <div className="absolute inset-0 bg-white/10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent to-black/20"></div>
          <div className="relative z-10 flex items-center gap-4 text-white">
            <div className="size-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
              <SvgIcon name="sync" className="size-6 text-white animate-spin" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-wide">Verification in Progress</h3>
              <p className="text-cyan-50 text-sm font-medium opacity-90 mt-1">
                Checking emails:{" "}
                <span className="bg-black/20 px-2 py-0.5 rounded ml-1">
                  {label?.checked_count} / {label?.checked_count + label?.unchecked_count}
                </span>
              </p>
            </div>
          </div>
          <div className="relative z-10 w-1/3">
            <LoaderProgress PROGRESS_COLOR="bg-white" />
          </div>
        </div>
      )}

      {/* System Failure Warning */}
      {label && label.failed_count && label?.unchecked_count == 0 ? (
        <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl shadow-sm">
          <SvgIcon name="warning" className="size-6 text-rose-500 shrink-0" />
          <div className="text-sm">
            We found <span className="font-bold">{label?.failed_count}</span> system failed to check. Your credits are safe, we don't deduct credits for system failures.
            Our system will retry only failed emails if you start this process again.
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column: Overview & Stats */}
        <div className="xl:col-span-4 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden sticky top-6">
          <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-cyan-50/50 to-teal-50/50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-500 text-white rounded-lg shadow-md">
                <SvgIcon name="analytics" className="size-5" />
              </div>
              <div className="text-xl font-bold text-slate-800">List Overview</div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-slate-500">Credits</span>
                <span className="font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md">{credits.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-slate-500">File Name</span>
                <span className="font-semibold text-slate-800 truncate max-w-[150px]" title={label?.name}>
                  {label?.name}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-slate-500">Date</span>
                <span className="font-semibold text-slate-800">{dateTimeFormat(label?.created_at, "day monthShort year")}</span>
              </div>
            </div>

            <div className="h-64 relative flex justify-center items-center">
              <EChart
                reload={reloadChart}
                type="pie"
                options={{
                  data: [
                    { value: stats?.valid, name: `Valid: ${label?.valid_count || 0}` },
                    { value: stats?.invalid, name: `Invalid: ${handleCalculateInvalid(label) || 0}` },
                    { value: stats?.risky, name: `Risky: ${label?.catch_count || 0}` },
                    { value: stats?.unknown, name: `Unknown: ${label?.unknown_count || 0}` },
                    { value: stats?.duplicate, name: `Duplicate: ${label?.duplicate_count || 0}` },
                    { value: stats?.failed, name: `Failed: ${label?.failed_count || 0}` },
                  ],
                  colors: ["#10b981", "#f43f5e", "#f59e0b", "#06b6d4", "#14b8a6", "#64748b"], // Emerald, Rose, Amber, Cyan, Teal, Slate
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl flex flex-col justify-between hover:shadow-md transition-all">
                <div className="flex gap-2 items-center text-emerald-700 font-semibold text-xs tracking-wider mb-2">
                  <div className="size-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div> VALID
                </div>
                <div className="text-xl font-bold text-slate-800">{stats?.valid || 0}%</div>
              </div>

              <div className="bg-rose-50/50 border border-rose-100 p-3 rounded-xl flex flex-col justify-between hover:shadow-md transition-all">
                <div className="flex gap-2 items-center text-rose-700 font-semibold text-xs tracking-wider mb-2">
                  <div className="size-2 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)]"></div> INVALID
                </div>
                <div className="text-xl font-bold text-slate-800">{stats?.invalid || 0}%</div>
              </div>

              <div className="bg-amber-50/50 border border-amber-100 p-3 rounded-xl flex flex-col justify-between hover:shadow-md transition-all">
                <div className="flex gap-2 items-center text-amber-700 font-semibold text-xs tracking-wider mb-2">
                  <div className="size-2 bg-amber-500 rounded-full"></div> RISKY
                </div>
                <div className="text-xl font-bold text-slate-800">{stats?.risky || 0}%</div>
              </div>

              <div className="bg-cyan-50/50 border border-cyan-100 p-3 rounded-xl flex flex-col justify-between hover:shadow-md transition-all">
                <div className="flex gap-2 items-center text-cyan-700 font-semibold text-xs tracking-wider mb-2">
                  <div className="size-2 bg-cyan-500 rounded-full"></div> UNKNOWN
                </div>
                <div className="text-xl font-bold text-slate-800">{stats?.unknown || 0}%</div>
              </div>

              <div className="bg-teal-50/50 border border-teal-100 p-3 rounded-xl flex flex-col justify-between hover:shadow-md transition-all">
                <div className="flex gap-2 items-center text-teal-700 font-semibold text-xs tracking-wider mb-2">
                  <div className="size-2 bg-teal-500 rounded-full"></div> DUPLICATE
                </div>
                <div className="text-xl font-bold text-slate-800">{stats?.duplicate || 0}%</div>
              </div>

              <div className="bg-slate-50/50 border border-slate-200 p-3 rounded-xl flex flex-col justify-between hover:shadow-md transition-all">
                <div className="flex gap-2 items-center text-slate-600 font-semibold text-xs tracking-wider mb-2">
                  <div className="size-2 bg-slate-500 rounded-full"></div> FAILED
                </div>
                <div className="text-xl font-bold text-slate-800">{stats?.failed || 0}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Table */}
        <div className="xl:col-span-8 rounded-lg space-y-6">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
            <div onClick={refreshPage}>
              <Button
                border=""
                showIcon={true}
                iconName="sync"
                iconClass="size-4"
                iconPosition="before"
                iconFilled={false}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl px-5 transition-all shadow-sm flex items-center gap-2"
              >
                Refresh List
              </Button>
            </div>
            <div onClick={() => setShowDownloadModal(true)}>
              <Button
                border=""
                showIcon={true}
                iconName="download"
                iconClass="size-4"
                iconPosition="before"
                iconFilled={false}
                className="bg-cyan-50 text-cyan-700 hover:bg-cyan-600 hover:text-white font-semibold rounded-xl px-5 transition-all shadow-sm flex items-center gap-2"
              >
                Export Results
              </Button>
            </div>

            <div className="ml-auto">
              {label?.status == 0 && (
                <div onClick={startChecking}>
                  <Button
                    border=""
                    showIcon={true}
                    iconName="play_circle"
                    iconClass="size-5"
                    iconPosition="before"
                    iconFilled={true}
                    className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold rounded-xl px-6 py-2.5 shadow-md shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5"
                  >
                    Start Checking
                  </Button>
                </div>
              )}
              {label?.status == 1 && (
                <div onClick={stopChecking}>
                  <Button
                    border=""
                    showIcon={true}
                    iconName="stop_circle"
                    iconClass="size-5"
                    iconPosition="before"
                    iconFilled={true}
                    className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-bold rounded-xl px-6 py-2.5 shadow-md shadow-red-500/20 transition-all transform hover:-translate-y-0.5"
                  >
                    Stop Checking
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative bg-white rounded-2xl shadow-sm flex items-center border border-slate-100">
              <div className="pl-6 text-slate-400">
                <SvgIcon name="search" className="size-6" />
              </div>
              <Input
                value={searchEmail}
                setValue={setSearchEmail}
                labelShow={false}
                iconShow={false}
                placeholder="Search by exact email address..."
                id="searchText"
                extraClass="border-none h-[64px] bg-transparent flex-1 text-lg placeholder-slate-400 focus:ring-0 shadow-none"
                padding="pl-4"
                onKeyDown={handlePressEnterForSearch}
              />
              <div className="hidden pr-2">
                <button
                  onClick={() => setFilterShow(!filterShow)}
                  className="flex items-center gap-2 bg-slate-50 hover:bg-teal-50 text-slate-600 hover:text-teal-700 font-medium px-5 py-2.5 rounded-xl transition-all border border-slate-200 hover:border-teal-200"
                >
                  <span>Filters</span>
                  <SvgIcon name="tune" className="size-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <Table
              data={prepareTableData(mainData)}
              loading={loading}
              showMark={true}
              markItems={marks}
              setMarkItems={setMarks}
              excludeKeys={["id"]}
              showDelete={true}
              handleDelete={() => setDeleteConfirm(true)}
              headerBg="bg-gradient-to-r from-slate-50 to-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-xs"
            />
          </div>

          {/* Pagination */}
          <div className="flex justify-center pt-2">
            <DefaultPagination
              design={2}
              currentPage={currentPage}
              totalPages={totalPage}
              onPageChange={setCurrentPage}
              siblingCount={1}
              paginateInfo={paginateInfo}
              className="text-sm font-semibold bg-white shadow-sm border border-slate-100 rounded-2xl p-2 px-4"
            />
          </div>
        </div>
      </div>

      {/* Details Modal */}
      <Modal
        zIndex="z-[48]"
        loading={loading}
        maxWidth="w-full max-w-2xl"
        permission={hasPermission("email-list.view")}
        show={showDetailsModal}
        setShow={setShowDetailsModal}
        size={4}
      >
        <div className="p-0 bg-white overflow-hidden rounded-[32px]">
          <div className="bg-gradient-to-r from-teal-800 to-cyan-900 p-8 flex flex-col items-center justify-center relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="bg-white p-3 rounded-2xl shadow-lg relative z-10 mb-4">
              <ImageBox src={logo_url} className="h-10" image_className="max-w-full max-h-full" zoom_on_hover={false} />
            </div>
            <h2 className="text-2xl font-bold text-white relative z-10 tracking-wide">Email Verification Details</h2>
          </div>

          <div className="p-8">
            <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
              <Table
                data={currentData}
                loading={false}
                showHeading={false}
                showMark={false}
                markItems={marks}
                setMarkItems={setMarks}
                excludeKeys={["id"]}
                showDelete={false}
                handleDelete={() => ""}
                headerBg="hidden"
              />
            </div>
            <div className="mt-8 flex justify-center">
              <Button
                onClick={() => setShowDetailsModal(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-8 py-2.5 rounded-xl transition-colors"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Download Modal */}
      <Modal
        zIndex="z-[48]"
        loading={loading}
        maxWidth="w-full max-w-lg"
        permission={hasPermission("email-list.download")}
        show={showDownloadModal}
        setShow={setShowDownloadModal}
        size={4}
      >
        <div className="p-8 bg-white space-y-6 rounded-3xl">
          <div className="text-center pb-4 border-b border-slate-100">
            <div className="mx-auto w-16 h-16 bg-cyan-50 rounded-2xl flex items-center justify-center mb-4 text-cyan-600">
              <SvgIcon name="cloud_download" className="size-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Export List</h2>
            <p className="text-sm font-medium text-slate-500 mt-1 truncate px-4" title={label?.name}>
              {label?.name}
            </p>
          </div>

          <div className="space-y-3">
            {[
              { label: "Valid Emails Only", val: "valid", icon: "check_circle", color: "emerald" },
              { label: "Invalid Emails Only", val: "invalid", icon: "cancel", color: "rose" },
              { label: "Risky Emails Only", val: "risky", icon: "warning", color: "amber" },
              { label: "All (Valid & Invalid)", val: "both", icon: "list_alt", color: "cyan" },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`p-4 border border-slate-200 rounded-2xl cursor-pointer flex items-center justify-between group hover:border-${item.color}-400 hover:bg-${item.color}-50 transition-all`}
                onClick={() => handleDownloadEmails(item.val)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-${item.color}-100 group-hover:text-${item.color}-600 transition-colors`}>
                    <SvgIcon name={item.icon} className="size-5" />
                  </div>
                  <span className="font-semibold text-slate-700 group-hover:text-slate-900">{item.label}</span>
                </div>
                <SvgIcon name="download" className={`size-5 text-slate-300 group-hover:text-${item.color}-500 transition-colors`} />
              </div>
            ))}

            <div
              className="p-4 border border-slate-200 rounded-2xl cursor-pointer flex items-center justify-between group hover:border-teal-400 hover:bg-teal-50 transition-all"
              onClick={() => downloadDuplicatesOnly()}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-teal-100 group-hover:text-teal-600 transition-colors">
                  <SvgIcon name="content_copy" className="size-5" />
                </div>
                <span className="font-semibold text-slate-700 group-hover:text-slate-900">Duplicates Only</span>
              </div>
              <SvgIcon name="download" className="size-5 text-slate-300 group-hover:text-teal-500 transition-colors" />
            </div>
          </div>
        </div>
      </Modal>

      {/* Advanced Filter Drawer */}
      <Drawer position="right" permission={hasPermission("email-verify.view")} loading={loading} show={filterShow} set_show={setFilterShow}>
        <div className="flex flex-col justify-between h-full bg-slate-50">
          <div className="p-6 bg-gradient-to-r from-teal-800 to-cyan-800 text-white shadow-md flex items-center gap-3">
            <SvgIcon name="tune" className="size-6 text-teal-200" />
            <span className="text-xl font-bold tracking-wide">Advanced Filters</span>
          </div>
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <Input
                value={searchEmail}
                setValue={setSearchEmail}
                label="Email Address"
                id="searchEmail"
                errorMessage={errors?.searchEmail}
                iconName="mail"
                extraClass="border-slate-200 focus:border-teal-500 focus:ring-teal-500/20 rounded-xl"
              />

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Verification Status</label>
                <SelectInput
                  items={[
                    { name: "Checked", id: 1 },
                    { name: "Unchecked", id: 0 },
                  ]}
                  value={searchChecked}
                  setValue={setSearchChecked}
                  labelShow={false}
                  placeholder="Select Checked / Unchecked"
                  label="Status"
                  id="searchChecked"
                  extraClass="text-sm py-3 bg-white px-4 rounded-xl border-slate-200 focus:border-teal-500 shadow-sm"
                  border="border border-slate-200 rounded-xl"
                  errorMessage={errors?.searchChecked}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Result Category</label>
                <SelectInput
                  items={[
                    { name: "Invalid", id: 0 },
                    { name: "Valid", id: 1 },
                    { name: "Unknown", id: 2 },
                    { name: "Failed", id: 3 },
                    { name: "Risky", id: 4 },
                  ]}
                  value={searchStatus}
                  setValue={setSearchStatus}
                  labelShow={false}
                  placeholder="Select Result Category"
                  label="Status"
                  id="searchStatus"
                  extraClass="text-sm py-3 bg-white px-4 rounded-xl border-slate-200 focus:border-teal-500 shadow-sm"
                  border="border border-slate-200 rounded-xl"
                  errorMessage={errors?.searchStatus}
                  required
                />
              </div>
            </div>
          </div>
          <div className="p-6 bg-white border-t border-slate-200">
            <Button
              onClick={() => {
                refreshPage();
                setFilterShow(false);
              }}
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex justify-center items-center gap-2"
            >
              <SvgIcon name="filter_list" className="size-5" />
              Apply Filters
            </Button>
          </div>
        </div>
      </Drawer>
    </Section>
  );
}

export default DottormailViewListPage;

// import { useEffect, useRef, useState } from "react";
// import Section from "@/modules/global/elements/section";
// import SvgIcon from "@/modules/global/icons/svg_icons";
// import Table from "@/modules/global/elements/table";
// import DefaultPagination from "@/modules/global/elements/pagination";
// import { toast } from "sonner";
// import Modal from "@/modules/global/elements/modal";
// import Button from "@/modules/global/elements/button";
// import Input from "@/modules/global/input/input";
// import Drawer from "@/modules/global/elements/drawer";
// import { checkErrors, checkPermission, dateTimeFormat, formatNumber, getQueryParam } from "@/lib/helper";
// import ImageBox from "@/modules/global/elements/image_box";
// import Api from "@/lib/api";
// import { useRouter } from "next/router";
// import SelectInput from "@/modules/global/input/select";
// import LoaderProgress from "@/modules/global/elements/progress";
// import EChart from "@/modules/global/partial/echart";
// import ExcelJS from "exceljs";
// import { saveAs } from "file-saver";
// import { useAuthStore } from "@/modules/auth/store/useAuthStore";
// import { useGlobalStore } from "@/modules/global/store/useGlobalStore";
// import { useLanguageStore } from "@/modules/language/store/useLanguageStore";

// function DottormailViewListPage() {
//   const router = useRouter();
//   const { logo_url } = useGlobalStore();
//   const { appPermissions, hasPermission } = useAuthStore();
//   const { appSelectedLocale } = useLanguageStore();
//   const [loading, setLoading] = useState(false);
//   const [deleteConfirm, setDeleteConfirm] = useState(false);
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [marks, setMarks] = useState<any[]>([]);
//   const [modalShow, setModalShow] = useState(false);
//   const [filterShow, setFilterShow] = useState(false);
//   const [action, setAction] = useState<"create" | "update">("create");
//   const [actionId, setActionId] = useState<string>("");
//   const [mainData, setMainData] = useState<any[]>([]); // Initialize as an empty array
//   const [setting, setSetting] = useState<any>(null);

//   const [credits, setCredits] = useState(0);

//   const [refresh, setRefresh] = useState(0);
//   const refreshPage = () => {
//     setRefresh((prev) => prev + 1);
//   };

//   // Pagination
//   const [totalPage, setTotalPage] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [paginateInfo, setPaginateInfo] = useState("");

//   // Search strings
//   const [searchEmail, setSearchEmail] = useState("");
//   const [searchChecked, setSearchChecked] = useState("");
//   const [searchStatus, setSearchStatus] = useState("");

//   const handleDelete = async () => {
//     try {
//       let url = "v1/dashboard/email-list/delete";

//       if (checkErrors({ url, marks })) {
//         return;
//       }
//       setLoading(true);
//       await Api.post(url, { marks })
//         .then((res: any) => {
//           setDeleteConfirm(false);
//           refreshPage();
//           setMarks([]);
//           toast.success(res.data?.message);
//           setLoading(false);
//         })
//         .catch((err: any) => {
//           toast.error(err?.response?.data?.message);
//           setLoading(false);
//         });
//     } catch (error: any) {}
//   };

//   const [editModalShow, setEditModalShow] = useState(false);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [position, setPosition] = useState("");
//   const [country, setCountry] = useState("");
//   const [language, setLanguage] = useState("");
//   const [category, setCategory] = useState("");
//   const [others, setOthers] = useState("");

//   const [labelID, setLabelID] = useState("");

//   const [label, setLabel] = useState<any>("");
//   const [reloadChart, setReloadChart] = useState(0);
//   const timeoutRef = useRef<any>(null);
//   const [checkInterval, setCheckInterval] = useState(0);
//   const [stats, setStats] = useState<any>("");

//   const handleCalculateInvalid = (data: any) => {
//     if (data.checked_count) {
//       let _invalid = data.checked_count - (data.valid_count + data.catch_count + data.unknown_count + data.failed_count);
//       if (_invalid >= 0) {
//         return _invalid;
//       } else {
//         return 0;
//       }
//     } else {
//       return 0;
//     }
//   };

//   const calculatePercentagesForChart = (data: any) => {
//     const total: any = data?.checked_count;
//     const invalid_count: any = handleCalculateInvalid(data);
//     if (total) {
//       // Calculate percentages and round to 2 decimal places
//       const percentages = {
//         valid: ((data.valid_count / total) * 100).toFixed(2),
//         invalid: ((invalid_count / total) * 100).toFixed(2),
//         risky: ((data.catch_count / total) * 100).toFixed(2),
//         unknown: ((data.unknown_count / total) * 100).toFixed(2),
//         duplicate: ((data.duplicate_count / total) * 100).toFixed(2),
//         failed: ((data.failed_count / total) * 100).toFixed(2),
//       };
//       setStats(percentages);
//       setReloadChart((prev) => prev + 1);
//     } else {
//       // Calculate percentages and round to 2 decimal places
//       const percentages = {
//         valid: 0,
//         invalid: 0,
//         risky: 0,
//         unknown: 0,
//         duplicate: 0,
//         failed: 0,
//       };
//       setStats(percentages);
//       setReloadChart((prev) => prev + 1);
//     }
//   };

//   const getInitialData = async (id: any) => {
//     setLoading(true);
//     let data = {
//       id: id,
//       page: currentPage,
//       email: searchEmail,
//       checked: searchChecked,
//       status: searchStatus,
//     };
//     let url = "v1/dashboard/list-label/view";
//     await Api.post(url, data)
//       .then((res: any) => {
//         setLoading(false);
//         setLabel(res.data?.label);
//         calculatePercentagesForChart(res.data?.label);
//         setCheckInterval((prev) => prev + 1);
//         setCredits(res.data?.credits?.credit);
//         setMainData(res.data.data.data);
//         setTotalPage(res.data.data.last_page);
//         setPaginateInfo(res.data.data.to + " out of " + res.data.data.total);
//       })
//       .catch((err: any) => {
//         setLoading(false);
//         toast.error(err?.response?.data?.message);
//       });
//   };

//   useEffect(() => {
//     const id = getQueryParam("id");
//     if (id) {
//       setLabelID(id);
//       getInitialData(id);
//     } else {
//       toast.error("List not found");
//       router.back();
//     }
//     // Clear the timeout when the component unmounts
//     return () => clearInterval(timeoutRef.current);
//   }, [refresh, currentPage, appSelectedLocale]);

//   const handlePressEnterForSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       refreshPage();
//     }
//   };

//   const actionManager = (actionType: string, actionValue?: any) => {
//     if (actionType == "open_create") {
//       setAction("create");
//       setDataSheet([]);
//       setUploadedCount(0);
//       setFileInfo("");
//       setTotalRecords(0);
//       setCompleteUpload(false);
//       setName("");
//       setEmail("");
//       setPosition("");
//       setCountry("");
//       setLanguage("");
//       setCategory("");
//       setOthers("");
//       setModalShow(true);
//     }
//     if (actionType == "open_update") {
//       setAction("update");
//       setActionId(actionValue);
//       Array.isArray(mainData) &&
//         mainData.map((md) => {
//           if (md.id == actionValue) {
//             setName(md?.name ?? "");
//             setEmail(md.email ?? "");
//             setPosition(md.position ?? "");
//             setCountry(md.country ?? "");
//             setLanguage(md.language ?? "");
//             setCategory(md.category ?? "");
//             if (md?.others) {
//               setOthers(JSON.parse(md.others) ?? "");
//             }
//             setEditModalShow(true);
//           }
//         });
//     }
//     if (actionType == "delete_confirmation") {
//       setDeleteConfirm(true);
//     }
//     if (actionType == "delete_yes") {
//       deleteOrRestore("delete");
//     }
//     if (actionType == "delete_no") {
//       setDeleteConfirm(false);
//     }
//     if (actionType == "restore") {
//       deleteOrRestore("restore");
//     }
//   };

//   const deleteOrRestore = async (type: string) => {
//     try {
//       setLoading(true);
//       let url = type === "delete" ? "package/delete" : "package/restore";
//       await Api.post(url, { id: actionId }) // Assuming actionId is set for specific item delete/restore
//         .then((res: any) => {
//           toast.success(res?.data?.message);
//           setDeleteConfirm(false);
//           refreshPage();
//           setLoading(false);
//         })
//         .catch((err: any) => {
//           toast.error(err?.response?.data?.message);
//           setLoading(false);
//         });
//     } catch (error: any) {
//       setLoading(false);
//     }
//   };

//   const handlePercentage = (data: any, type: any) => {
//     if (type === "valid") {
//       if (data.checked_count) {
//         let percent = (data.valid_count * 100) / data.checked_count;
//         return percent.toFixed(1);
//       } else {
//         return 0;
//       }
//     }
//     if (type === "invalid") {
//       if (data.checked_count) {
//         let _invalid = data.checked_count - data.valid_count;
//         if (_invalid >= 0) {
//           let percent = (_invalid * 100) / data.checked_count;
//           return percent.toFixed(1);
//         } else {
//           return 0;
//         }
//       } else {
//         return 0;
//       }
//     }
//     if (type === "duplicate") {
//       if (data.duplicate_count) {
//         let percent = (data.duplicate_count * 100) / data.checked_count;
//         return percent.toFixed(1);
//       } else {
//         return 0;
//       }
//     }
//     if (type === "unknown") {
//       if (data.unknown_count) {
//         let percent = (data.unknown_count * 100) / data.checked_count;
//         return percent.toFixed(1);
//       } else {
//         return 0;
//       }
//     }
//     if (type === "failed") {
//       if (data.failed_count) {
//         let percent = (data.failed_count * 100) / data.checked_count;
//         return percent.toFixed(1);
//       } else {
//         return 0;
//       }
//     }
//     if (type === "catch") {
//       if (data.catch_count) {
//         let percent = (data.catch_count * 100) / data.checked_count;
//         return percent.toFixed(1);
//       } else {
//         return 0;
//       }
//     }
//   };

//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [currentData, setCurrentData] = useState<any>(null);
//   const handleShowDetails = (id: number) => {
//     if (Array.isArray(mainData)) {
//       const findRow = mainData.find((row: any) => row.id === id);
//       let finalData = [];
//       finalData.push({ name: "Status :", value: designMainStatus(findRow?.status, findRow?.checked) });
//       finalData.push({ name: "Email:", value: findRow?.email });
//       finalData.push({ name: "Format :", value: designMainStatus(findRow?.format, findRow?.checked) });
//       finalData.push({ name: "Domain :", value: designMainStatus(findRow?.domain, findRow?.checked) });
//       finalData.push({ name: "Mx :", value: designMainStatus(findRow?.mx, findRow?.checked) });
//       finalData.push({ name: "User :", value: designMainStatus(findRow?.user, findRow?.checked) });
//       finalData.push({ name: "Time :", value: findRow?.checked == 1 ? formatNumber(findRow?.time) + " Second" : "__" });
//       setCurrentData(finalData);
//       setShowDetailsModal(true);
//     }
//   };
//   const designMainStatus = (result: number, isChecked: number) => {
//     if (isChecked !== 1) {
//       return "__";
//     }
//     if (result === 0) {
//       return (
//         <div className="flex justify-start">
//           <div className="w-[85px] border-2 border-gray-200 dark:border-gray-500 px-2 py-1 rounded-md text-xs text-red-600 dark:text-red-400">
//             <div className="flex gap-1 items-center justify-start">
//               <div className="size-2 bg-red-600 rounded-full"></div>
//               <div className="font-semibold">INVALID</div>
//             </div>
//           </div>
//         </div>
//       );
//     }

//     if (result === 1) {
//       return (
//         <div className="flex justify-start">
//           <div className="w-[85px] border-2 border-gray-200 dark:border-gray-500 px-2 py-1 rounded-md text-xs text-green-600 dark:text-green-400">
//             <div className="flex gap-1 items-center justify-start">
//               <div className="size-2 bg-green-600 rounded-full"></div>
//               <div className="font-semibold">VALID</div>
//             </div>
//           </div>
//         </div>
//       );
//     }
//     if (result === 2) {
//       return (
//         <div className="flex justify-start">
//           <div className="w-[90px] border-2 border-gray-200 dark:border-gray-500 px-2 py-1 rounded-md text-[11px] text-blue-600 dark:text-blue-400">
//             <div className="flex gap-1 items-center justify-start">
//               <div className="size-2 bg-blue-600 rounded-full"></div>
//               <div className="font-semibold">UNKNOWN</div>
//             </div>
//           </div>
//         </div>
//       );
//     }
//     if (result === 3) {
//       return (
//         <div className="flex justify-start">
//           <div className="w-[85px] border-2 border-gray-200 dark:border-gray-500 px-2 py-1 rounded-md text-xs text-gray-600 dark:text-gray-400">
//             <div className="flex gap-1 items-center justify-start">
//               <div className="size-2 bg-gray-600 rounded-full"></div>
//               <div className="font-semibold">FAILED</div>
//             </div>
//           </div>
//         </div>
//       );
//     }
//     if (result === 4) {
//       return (
//         <div className="flex justify-start">
//           <div className="w-[85px] border-2 border-gray-200 dark:border-gray-500 px-2 py-1 rounded-md text-xs text-yellow-600 dark:text-yellow-400">
//             <div className="flex gap-1 items-center justify-start">
//               <div className="size-2 bg-yellow-600 rounded-full"></div>
//               <div className="font-semibold">RISKY</div>
//             </div>
//           </div>
//         </div>
//       );
//     }
//   };

//   const prepareTableData = (data: any[]) => {
//     let tableData: any[] = [];
//     if (Array.isArray(data)) {
//       data.map((dat) => {
//         tableData.push({
//           id: dat.id,
//           status: designMainStatus(dat?.status, dat?.checked),
//           email: dat?.email,
//           time: dat?.checked == 1 ? formatNumber(dat?.time) + " S" : "__",
//           actions: (
//             <div className="flex items-center gap-4">
//               <div onClick={() => handleShowDetails(dat?.id)}>
//                 <Button
//                   border=""
//                   showIcon={true}
//                   iconName="arrow_right_alt"
//                   iconClass="size-4 -rotate-45"
//                   iconPosition="after"
//                   iconFilled={false}
//                   className="bg-blue-950 hover:bg-blue-800 text-white rounded"
//                 >
//                   View
//                 </Button>
//               </div>
//             </div>
//           ),
//         });
//       });
//     }
//     return tableData;
//   };

//   const [searchText, setSearchText] = useState("");

//   const [dataSheet, setDataSheet] = useState<any[]>([]);
//   const [fileInfo, setFileInfo] = useState<any>(null);
//   const [totalRecords, setTotalRecords] = useState(0);

//   const [completeUpload, setCompleteUpload] = useState(false);
//   const [uploadedCount, setUploadedCount] = useState(0);

//   const handleLoadMore = () => {
//     setCurrentPage((prev) => prev + 1);
//   };

//   const [fileName, setFileName] = useState("");

//   const startChecking = async () => {
//     setLoading(true);
//     const url = "v1/dashboard/list-label/start-job";
//     const data = { id: label?.id };
//     await Api.post(url, data)
//       .then((res) => {
//         refreshPage();
//         toast.success(res.data.message);
//         setLoading(false);
//       })
//       .catch((error) => {
//         toast.error(error.response.data.message);
//         setLoading(false);
//       });
//   };

//   const stopChecking = async () => {
//     if (label && label?.status == 1) {
//       setLoading(true);
//       const url = "v1/dashboard/list-label/stop-job";
//       const data = { id: label?.id };
//       await Api.post(url, data)
//         .then((res) => {
//           refreshPage();
//           setLoading(false);
//           toast.success(res.data.message);
//         })
//         .catch((error) => {
//           toast.error(error.response.data.message);
//           setLoading(false);
//         });
//     } else {
//       toast.error("Something went wrong");
//     }
//   };

//   const [createListModal, setCreateListModal] = useState(false);

//   const [showDownloadModal, setShowDownloadModal] = useState(false);
//   const handleDownload = () => {};

//   useEffect(() => {
//     if (label?.status == 1) {
//       timeoutRef.current = setTimeout(() => {
//         refreshPage();
//       }, 30000);
//     } else {
//       clearTimeout(timeoutRef?.current);
//     }
//   }, [checkInterval]);

//   const [isVisible, setIsvisible] = useState(true);

//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (document.visibilityState === "visible") {
//         clearTimeout(timeoutRef?.current);
//         setIsvisible(true);
//         setCheckInterval((prev) => prev + 1);
//       } else {
//         clearTimeout(timeoutRef?.current);
//         setIsvisible(false);
//       }
//     };

//     document.addEventListener("visibilitychange", handleVisibilityChange);

//     return () => {
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//     };
//   }, [isVisible]);

//   const handleCheckStatus = (status: any) => {
//     if (status === 0) {
//       return "Invalid";
//     }
//     if (status === 1) {
//       return "Valid";
//     }
//     if (status === 2) {
//       return "Unknown";
//     }
//     if (status === 3) {
//       return "Failed";
//     }
//     if (status === 4) {
//       return "Risky";
//     }
//   };

//   const handleExport = async (data: any[], file_name: string) => {
//     console.log(data);

//     try {
//       if (!data || data.length === 0) {
//         toast.error("No data to export");
//         return;
//       }

//       toast.info("Generating Excel Sheet...");

//       const workbook = new ExcelJS.Workbook();
//       const worksheet = workbook.addWorksheet("Sheet1");

//       // ✅ Extract headers from first object
//       const headers = Object.keys(data[0]);

//       // ✅ Add header row
//       worksheet.addRow(headers);

//       // ✅ Add data rows
//       data.forEach((item) => {
//         const row = headers.map((key) => item[key] ?? "");
//         worksheet.addRow(row);
//       });

//       // ✅ Optional: make header bold
//       worksheet.getRow(1).font = { bold: true };

//       // ✅ Auto column width (nice UX)
//       worksheet.columns.forEach((column) => {
//         let maxLength = 10;
//         column.eachCell?.({ includeEmpty: true }, (cell) => {
//           const val = cell.value ? cell.value.toString() : "";
//           maxLength = Math.max(maxLength, val.length);
//         });
//         column.width = maxLength + 2;
//       });

//       // ✅ Generate file
//       const buffer = await workbook.xlsx.writeBuffer();

//       // ✅ Save file in browser
//       saveAs(
//         new Blob([buffer], {
//           type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//         }),
//         `${file_name}.xlsx`,
//       );

//       toast.success("Successfully Downloaded");
//     } catch (error) {
//       console.error(error);
//       toast.error("Unable to generate Excel Sheet");
//     }
//   };

//   const handleDownloadEmails = async (value: any) => {
//     let data: any = { label: label?.id };
//     let status = 1;
//     let file_name = label?.name;
//     if (value === "valid") {
//       data = { ...data, status: 1 };
//       file_name = file_name + "_valid_emails";
//     }
//     if (value === "invalid") {
//       data = { ...data, status: 0 };
//       file_name = file_name + "_invalid_emails";
//     }
//     if (value === "both") {
//       data = { ...data, status: "both" };
//       file_name = file_name + "_valid_and_invalid_emails";
//     }
//     if (value === "risky") {
//       data = { ...data, status: 4 };
//       file_name = file_name + "_risky_emails";
//     }

//     setLoading(true);
//     toast.info("We are preparing your file");
//     await Api.post("v1/dashboard/list-label/download", data)
//       .then((res) => {
//         toast.success(res.data.message);

//         if (Array.isArray(res.data.data) && res.data.data.length) {
//           let dataSet: any = [];
//           res.data.data.map((dat: any) => {
//             let info = dat.info ? JSON.parse(dat.info) : {};
//             let other = {
//               email: dat.email,
//               status: handleCheckStatus(dat.status),
//               format: dat.format === 1 ? "Valid" : "inValid",
//               dns: dat.domain === 1 ? "Valid" : "inValid",
//               mx: dat.mx === 1 ? "Valid" : "inValid",
//               user: dat.user === 1 ? "Valid" : "inValid",
//             };
//             let merged = { ...other, ...info };
//             dataSet.push(merged);
//           });
//           //console.log(dataSet);
//           handleExport(dataSet, file_name);
//           setLoading(false);
//         } else {
//           toast.error("Data not found");
//         }
//       })
//       .catch((error) => {
//         toast.error(error.response.data.message);
//         console.log(error);
//         setLoading(false);
//       });
//   };

//   const downloadDuplicatesOnly = async () => {
//     setLoading(true);
//     toast.info("We are preparing your file");
//     await Api.post("v1/dashboard/list-label/download", { label: label?.id, download: 1 })
//       .then((res) => {
//         toast.success(res.data.message);
//         let file_name = label?.name;
//         setLoading(false);

//         if (Array.isArray(res.data.data) && res.data.data.length) {
//           let seenEmails = new Set();
//           let duplicates = [];

//           res.data.data.forEach((item: any) => {
//             if (seenEmails.has(item.email)) {
//               duplicates.push(item);
//             } else {
//               seenEmails.add(item.email);
//             }
//           });

//           let data = res.data.data.map((dat: any) => {
//             return {
//               email: dat.email,
//               status: handleCheckStatus(dat.status),
//               format: dat.format === 1 ? "Valid" : "inValid",
//               dns: dat.domain === 1 ? "Valid" : "inValid",
//               mx: dat.mx === 1 ? "Valid" : "inValid",
//               user: dat.user ? "Valid" : "inValid",
//             };
//           });
//           handleExport(data, file_name + "_duplicates");
//           setLoading(false);
//         } else {
//           toast.error("Data not found");
//         }
//       })
//       .catch((error) => {
//         toast.error(error.response.data.message);
//         console.log(error);
//         setLoading(false);
//       });
//   };

//   return (
//     <Section
//       permission={hasPermission("email-list.view")}
//       loading={loading}
//       confirmation={deleteConfirm}
//       confirmation_no={() => actionManager("delete_no")}
//       confirmation_yes={() => handleDelete()}
//       className="space-y-10"
//     >
//       {label && (
//         <div className="p-5 bg-white rounded-lg space-y-4 ">
//           {label?.status == 1 && <LoaderProgress PROGRESS_COLOR="bg-blue-950" />}

//           <div className="flex justify-center">
//             <div className="font-semibold">
//               <span className="opacity-70">Checked Email: </span>
//               {label?.checked_count}/{label?.checked_count + label?.unchecked_count}
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="grid grid-cols-1 2xl:grid-cols-3 gap-8">
//         <div className="bg-white rounded-lg">
//           <div className="p-5 sticky top-0 space-y-10">
//             <div className="text-lg font-semibold">Overview</div>
//             <div>
//               <div className="mt-3 text-sm text-indigo-600 opacity-80">
//                 <span className="font-semibold text-gray-800">Credits:</span> {credits}
//               </div>
//               <div className="mt-3 text-sm text-indigo-600 opacity-80">
//                 <span className="font-semibold text-gray-800">File Name:</span> {label?.name}
//               </div>
//               <div className="mt-3 text-sm text-indigo-600 opacity-80">
//                 <span className="font-semibold text-gray-800">Date:</span> {dateTimeFormat(label?.created_at, "day monthShort year hour:minute ampm")}
//               </div>
//             </div>
//             <EChart
//               reload={reloadChart}
//               type="pie"
//               options={{
//                 data: [
//                   { value: stats?.valid, name: `valid: ${label.valid_count}` },
//                   { value: stats?.invalid, name: `invalid: ${handleCalculateInvalid(label)}` },
//                   { value: stats?.risky, name: `Risky: ${label.catch_count}` },
//                   { value: stats?.unknown, name: `Unknown: ${label.unknown_count}` },
//                   { value: stats?.duplicate, name: `Duplicate: ${label.duplicate_count}` },
//                   { value: stats?.failed, name: `Failed: ${label.failed_count}` },
//                 ],
//                 colors: ["#4ade80", "#f87171", "#facc15", "#60a5fa", "#6366f1", "#6b7280"],
//               }}
//             />
//             <div className="grid grid-cols-1 gap-5">
//               <div className="flex justify-between text-xs opacity-80 border-b-2 border-gray-200 pb-3">
//                 <div className="flex gap-2 items-center">
//                   <div className="size-3 bg-green-400 rounded-full"></div>
//                   <div>VALID</div>
//                 </div>
//                 <div>{stats?.valid}%</div>
//               </div>
//               <div className="flex justify-between text-xs opacity-80 border-b-2 border-gray-200 pb-3">
//                 <div className="flex gap-2 items-center">
//                   <div className="size-3 bg-red-400 rounded-full"></div>
//                   <div>INVALID</div>
//                 </div>
//                 <div>{stats?.invalid}%</div>
//               </div>
//               <div className="flex justify-between text-xs opacity-80 border-b-2 border-gray-200 pb-3">
//                 <div className="flex gap-2 items-center">
//                   <div className="size-3 bg-yellow-400 rounded-full"></div>
//                   <div>RISKY</div>
//                 </div>
//                 <div>{stats?.risky}%</div>
//               </div>
//               <div className="flex justify-between text-xs opacity-80 border-b-2 border-gray-200 pb-3">
//                 <div className="flex gap-2 items-center">
//                   <div className="size-3 bg-blue-400 rounded-full"></div>
//                   <div>UNKNOWN</div>
//                 </div>
//                 <div>{stats?.unknown}%</div>
//               </div>
//               <div className="flex justify-between text-xs opacity-80 border-b-2 border-gray-200 pb-3">
//                 <div className="flex gap-2 items-center">
//                   <div className="size-3 bg-indigo-500 rounded-full"></div>
//                   <div>DUPLICATE</div>
//                 </div>
//                 <div>{stats?.duplicate}%</div>
//               </div>
//               <div className="flex justify-between text-xs opacity-80 border-b-2 border-gray-200 pb-3">
//                 <div className="flex gap-2 items-center">
//                   <div className="size-3 bg-gray-500 rounded-full"></div>
//                   <div>FAILED</div>
//                 </div>
//                 <div>{stats?.failed}%</div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="col-span-2 rounded-lg space-y-4">
//           <div className="flex flex-wrap justify-between gap-4 items-center">
//             <div onClick={refreshPage}>
//               <Button
//                 border=""
//                 showIcon={true}
//                 iconName="sync"
//                 iconClass="size-4 -rotate-45"
//                 iconPosition="after"
//                 iconFilled={false}
//                 className="bg-blue-950 hover:bg-blue-800 text-white rounded"
//               >
//                 Refresh List
//               </Button>
//             </div>
//             <div onClick={() => setShowDownloadModal(true)}>
//               <Button
//                 border=""
//                 showIcon={true}
//                 iconName="download"
//                 iconClass="size-4"
//                 iconPosition="after"
//                 iconFilled={false}
//                 className="bg-blue-950 hover:bg-blue-800 text-white rounded"
//               >
//                 Download List
//               </Button>
//             </div>
//             {label?.status == 0 && (
//               <div onClick={startChecking}>
//                 <Button
//                   border=""
//                   showIcon={true}
//                   iconName="play_arrow"
//                   iconClass="size-4"
//                   iconPosition="after"
//                   iconFilled={false}
//                   className="bg-blue-950 hover:bg-blue-800 text-white rounded"
//                 >
//                   Start Checking
//                 </Button>
//               </div>
//             )}
//             {label?.status == 1 && (
//               <div onClick={stopChecking}>
//                 <Button
//                   border=""
//                   showIcon={true}
//                   iconName="play_arrow"
//                   iconClass="size-4"
//                   iconPosition="after"
//                   iconFilled={false}
//                   className="bg-red-600 hover:bg-red-700 text-white rounded"
//                 >
//                   Stop Checking
//                 </Button>
//               </div>
//             )}
//           </div>
//           <div className="w-full rounded-[8px] relative">
//             <Input
//               value={searchEmail}
//               setValue={setSearchEmail}
//               labelShow={false}
//               placeholder="Search By Email Only ..."
//               id="searchText"
//               extraClass="border-none h-[60px] bg-white rounded-[8px]"
//               padding="pl-12"
//               iconName="search"
//               iconClass="size-8"
//               onKeyDown={handlePressEnterForSearch}
//             />
//             <div className="absolute top-0 right-1 h-full flex items-center justify-center">
//               <div
//                 onClick={() => setFilterShow(!filterShow)}
//                 className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 hover:bg-blue-950 hover:text-white rounded-full"
//               >
//                 <div>Advance Filter</div> <SvgIcon name="tune" className="size-7 rounded-full bg-white text-blue-950" />
//               </div>
//             </div>
//           </div>
//           {label && label.failed_count && label?.unchecked_count == 0 ? (
//             <div className="text-start text-sm text-red-500 py-2">
//               We found <span className="font-semibold">{label?.failed_count}</span> system failed to check. Your Credits are safe, we don't deduct credits for system
//               failed. Our System will check only failed emails if you start this processes again.
//             </div>
//           ) : (
//             ""
//           )}

//           <Table
//             data={prepareTableData(mainData)}
//             loading={loading}
//             showMark={true}
//             markItems={marks}
//             setMarkItems={setMarks}
//             excludeKeys={["id"]}
//             showDelete={true}
//             handleDelete={() => setDeleteConfirm(true)}
//             headerBg="bg-linear-to-r from-teal-600 via-cyan-600 to-emerald-600 text-white font-semibold"
//           />
//         </div>
//       </div>

//       <DefaultPagination
//         design={2}
//         currentPage={currentPage}
//         totalPages={totalPage}
//         onPageChange={setCurrentPage}
//         siblingCount={1}
//         paginateInfo={paginateInfo}
//         className="text-sm font-semibold bg-white rounded p-3 mt-1"
//       />

//       <Modal
//         zIndex="z-[48]"
//         loading={loading}
//         maxWidth="w-full max-w-xl"
//         permission={hasPermission("email-list.view")}
//         show={showDetailsModal}
//         setShow={setShowDetailsModal}
//         size={4}
//       >
//         <div className="p-12 space-y-6">
//           <div className="flex justify-center">
//             <ImageBox src={logo_url} className="h-20" image_className="max-w-full max-h-full" zoom_on_hover={false} />
//           </div>
//           <Table
//             data={currentData}
//             loading={false}
//             showHeading={false}
//             showMark={false}
//             markItems={marks}
//             setMarkItems={setMarks}
//             excludeKeys={["id"]}
//             showDelete={false}
//             handleDelete={() => ""}
//           />
//         </div>
//       </Modal>

//       <Modal
//         zIndex="z-[48]"
//         loading={loading}
//         maxWidth="w-full max-w-xl"
//         permission={hasPermission("email-list.download")}
//         show={showDownloadModal}
//         setShow={setShowDownloadModal}
//         size={4}
//       >
//         <div className="p-12 space-y-5">
//           <div className="flex justify-center font-semibold text-xl">Your List:{label?.name}</div>

//           <div className="w-full d-block" onClick={() => handleDownloadEmails("valid")}>
//             <Button
//               border=""
//               showIcon={true}
//               iconName="download"
//               iconClass="size-4"
//               iconPosition="after"
//               iconFilled={false}
//               className="w-full bg-blue-950 hover:bg-blue-800 text-white rounded flex justify-between"
//             >
//               Download Only Valid Email List
//             </Button>
//           </div>
//           <div className="w-full d-block" onClick={() => handleDownloadEmails("invalid")}>
//             <Button
//               border=""
//               showIcon={true}
//               iconName="download"
//               iconClass="size-4"
//               iconPosition="after"
//               iconFilled={false}
//               className="w-full bg-blue-950 hover:bg-blue-800 text-white rounded flex justify-between"
//             >
//               Download Only Invalid Email List
//             </Button>
//           </div>
//           <div className="w-full d-block" onClick={() => handleDownloadEmails("both")}>
//             <Button
//               border=""
//               showIcon={true}
//               iconName="download"
//               iconClass="size-4"
//               iconPosition="after"
//               iconFilled={false}
//               className="w-full bg-blue-950 hover:bg-blue-800 text-white rounded flex justify-between"
//             >
//               Download Only Valid & Invalid Email List
//             </Button>
//           </div>
//           <div className="w-full d-block" onClick={() => handleDownloadEmails("risky")}>
//             <Button
//               border=""
//               showIcon={true}
//               iconName="download"
//               iconClass="size-4"
//               iconPosition="after"
//               iconFilled={false}
//               className="w-full bg-blue-950 hover:bg-blue-800 text-white rounded flex justify-between"
//             >
//               Download Only Risky Email List
//             </Button>
//           </div>
//           <div className="w-full d-block" onClick={() => downloadDuplicatesOnly()}>
//             <Button
//               border=""
//               showIcon={true}
//               iconName="download"
//               iconClass="size-4"
//               iconPosition="after"
//               iconFilled={false}
//               className="w-full bg-blue-950 hover:bg-blue-800 text-white rounded flex justify-between"
//             >
//               Download Only Duplicated Email List
//             </Button>
//           </div>
//         </div>
//       </Modal>

//       <Drawer position="right" permission={hasPermission("email-verify.view")} loading={loading} show={filterShow} set_show={setFilterShow}>
//         <div className="flex flex-col justify-between h-full">
//           <div className="p-4 text-xl font-semibold bg-blue-950 text-white">
//             <SvgIcon name="tune" /> Advance Filter
//           </div>
//           <div className="flex-1 p-4 overflow-y-auto">
//             <div className="grid grid-cols-1 gap-5 text-sm">
//               <Input value={searchEmail} setValue={setSearchEmail} label="Email" id="price" errorMessage={errors?.searchEmail} iconName="short_text" />
//               <SelectInput
//                 items={[
//                   { name: "Checked", id: 1 },
//                   { name: "Unchecked", id: 0 },
//                 ]}
//                 value={searchChecked}
//                 setValue={setSearchChecked}
//                 labelShow={false}
//                 placeholder="Select Checked / Unchecked"
//                 label="Status"
//                 id="SattusSelect"
//                 extraClass="text-sm py-[12px] bg-white px-4 rounded-[8px]"
//                 border="border border-gray-200 rounded focus:border-blue-950"
//                 labelClass="text-[18px] text-gray-500 py-2"
//                 errorMessage={errors?.searchChecked}
//                 required
//               />
//               <SelectInput
//                 items={[
//                   { name: "Invalid", id: 0 },
//                   { name: "Valid", id: 1 },
//                   { name: "Unknown", id: 2 },
//                   { name: "Failed", id: 3 },
//                   { name: "Risky", id: 4 },
//                 ]}
//                 value={searchStatus}
//                 setValue={setSearchStatus}
//                 labelShow={false}
//                 placeholder="Select Status"
//                 label="Status"
//                 id="SattusSelect"
//                 extraClass="text-sm py-[12px] bg-white px-4 rounded-[8px]"
//                 border="border border-gray-200 rounded focus:border-blue-950"
//                 labelClass="text-[18px] text-gray-500 py-2"
//                 errorMessage={errors?.searchStatus}
//                 required
//               />
//             </div>
//           </div>
//           <div onClick={refreshPage} className="p-4 text-2xl font-semibold bg-blue-950 hover:bg-blue-800 text-white cursor-pointer">
//             <SvgIcon name="tune" /> Submit
//           </div>
//         </div>
//       </Drawer>
//     </Section>
//   );
// }

// export default DottormailViewListPage;
