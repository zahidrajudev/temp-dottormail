import { useEffect, useState } from "react";
import Section from "@/modules/global/elements/section";
import SvgIcon from "@/modules/global/icons/svg_icons";
import Table from "@/modules/global/elements/table";
import { toast } from "sonner";
import Modal from "@/modules/global/elements/modal";
import Button from "@/modules/global/elements/button";
import Input from "@/modules/global/input/input";
import Drawer from "@/modules/global/elements/drawer";
import { checkErrors, dateTimeFormat, formatNumber, formatSize, normalizeArrayObjects } from "@/lib/helper";
import ExcelUploader from "@/modules/global/elements/excel_file_uploader";
import Api from "@/lib/api";
import { useRouter } from "next/router";
import LoaderProgress from "@/modules/global/elements/progress";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { useLanguageStore } from "@/modules/language/store/useLanguageStore";
import { useCurrencyStore } from "@/modules/currency/store/useCurrencyStore";

interface Feature {
  id: number;
  icon: string;
  name: string;
}

function DottormailEmailVerifyPage() {
  const router = useRouter();
  const { appSelectedLocale } = useLanguageStore();
  const { appUser, hasPermission } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [marks, setMarks] = useState<any[]>([]);
  const [modalShow, setModalShow] = useState(false);
  const [filterShow, setFilterShow] = useState(false);
  const [action, setAction] = useState<"create" | "update">("create");
  const [actionId, setActionId] = useState<string>("");
  const [mainData, setMainData] = useState<any[]>([]);

  const [credits, setCredits] = useState(0);

  const [refresh, setRefresh] = useState(0);
  const refreshPage = () => {
    setRefresh((prev) => prev + 1);
  };

  const [currentPage, setCurrentPage] = useState(1);

  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchPosition, setSearchPosition] = useState("");
  const [searchCountry, setSearchCountry] = useState("");
  const [searchLanguage, setSearchLanguage] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  const [editModalShow, setEditModalShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [country, setCountry] = useState("");
  const [language, setLanguage] = useState("");
  const [category, setCategory] = useState("");
  const [others, setOthers] = useState("");

  const getInitialData = async () => {
    setLoading(true);
    let url = "v1/dashboard/email-list/credit";
    await Api.post(url)
      .then((res: any) => {
        setCredits(res.data.data?.credit ?? 0);
        setLoading(false);
      })
      .catch((err: any) => {
        setCredits(0);
        setLoading(false);
        toast.error(err?.response?.data?.message);
      });
  };

  useEffect(() => {
    getInitialData();
  }, [refresh, currentPage, appSelectedLocale]);

  const handlePressEnterForSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      getInitialData();
    }
  };

  const actionManager = (actionType: string, actionValue?: any) => {
    if (actionType == "open_create") {
      setAction("create");
      setDataSheet([]);
      setUploadedCount(0);
      setFileInfo("");
      setTotalRecords(0);
      setIsUploadingList(false);
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

  const [dataSheet, setDataSheet] = useState<any[]>([]);
  const [fileInfo, setFileInfo] = useState<any>(null);
  const [totalRecords, setTotalRecords] = useState(0);

  const handleSheetData = (data: any) => {
    if (Array.isArray(data)) {
      const normalize = normalizeArrayObjects(data);
      const filterData = normalize.filter((item) => typeof item?.email === "string" && item?.email.trim() !== "");

      const finalData = filterData.map((itm) => {
        const { email, ...info } = itm;
        return {
          email: email,
          status: 0,
          checked: 0,
          user_id: appUser?.id,
          label_id: "",
          info: JSON.stringify(info),
          created_at: dateTimeFormat(new Date(), "year-month-day hour:minute:second"),
          updated_at: dateTimeFormat(new Date(), "year-month-day hour:minute:second"),
        };
      });
      const recordLength = finalData?.length;
      if (recordLength) {
        setTotalRecords(recordLength);
        setDataSheet(finalData);
        setUploadedCount(0);
        setIsUploadingList(false);
        setCreateListModal(true);
      }
    }
  };

  const [isUploadingList, setIsUploadingList] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);
  const handleDataSheetUpload = async (label_id: any) => {
    if (checkErrors({ label_id })) {
      setIsUploadingList(false);
      return;
    }
    const mainRecords = dataSheet.map((item) => {
      return {
        ...item,
        label_id: label_id,
      };
    });
    if (mainRecords.length <= 1000) {
      await Api.post("v1/dashboard/email-list/store", { data: mainRecords })
        .then((res) => {
          setIsUploadingList(false);
          setUploadedCount(mainRecords.length);
          router.push("/dashboard/email-verify/my-list");
        })
        .catch((error) => {
          toast.error("Something went wrong, Try again later.");
          setIsUploadingList(false);
        });
    } else {
      const chunkSize = 1000;
      let chunkList = [];
      for (let i = 0; i < mainRecords.length; i += chunkSize) {
        const chunk = mainRecords.slice(i, i + chunkSize);
        chunkList.push(chunk);
      }
      for (const list of chunkList) {
        await Api.post("v1/dashboard/email-list/store", { data: list })
          .then((res) => {
            setUploadedCount((prev) => prev + list.length);
          })
          .catch((error) => {
            toast.error("Something went wrong, when uploading.");
          });
      }
      setIsUploadingList(false);
      router.push("/dashboard/email-verify/my-list");
    }
  };

  const createListLabel = async () => {
    if (!fileInfo) {
      return;
    }
    setIsUploadingList(true);
    await Api.post("v1/dashboard/list-label/store", { name: fileInfo?.name })
      .then((res) => {
        const id = res.data?.id;
        handleDataSheetUpload(id);
      })
      .catch((error) => {
        toast.error("Something went wrong, Try again later.");
        setIsUploadingList(false);
      });
  };

  const [fileName, setFileName] = useState("");

  const handleCheckout = async () => {
    if (Array.isArray(marks) && marks?.length) {
      if (checkErrors({ fileName }, setErrors)) {
        return;
      }
      let url = "journalist/initial-download";
      let data = { name: fileName, data: marks };
      setLoading(true);
      await Api.post(url, data)
        .then((res: any) => {
          setLoading(false);
          let list = res.data?.data;
          router.push(`/checkout?id=${list?.id}&type=journalist&qty=1&rdtas=/dashboard/v2/journalist/order`);
        })
        .catch((err: any) => {
          setLoading(false);
        });
    }
  };

  const [createListModal, setCreateListModal] = useState(false);

  const [emailList, setEmailList] = useState<any>("");
  const [seperator, setSeperator] = useState("\n");

  const [emailInputs, setEmailInputs] = useState("");
  const [rawInputValue, setRawInputValue] = useState("");

  const [isCompleteChecking, setIsCompleteChecking] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailCheckCount, setEmailCheckCount] = useState(0);
  const [validatedEmails, setValidatedEmails] = useState<any>([]);

  const handleInputEmails = (value: any) => {
    if (isCheckingEmail) {
      return;
    }
    let updateValue = rawInputValue + value;
    setRawInputValue(updateValue);

    let emailsToArray: any = updateValue;
    if (seperator == "\n") {
      emailsToArray = updateValue.split("\n");
    }
    if (seperator == ",") {
      emailsToArray = updateValue.replaceAll("\n", "").split(",");
    }
    emailsToArray = emailsToArray.filter((em: any) => em && em);
    setEmailList(emailsToArray);
  };

  const removeInputValue = (indx: any) => {
    if (isCheckingEmail) {
      return;
    }
    if (Array.isArray(emailList) && emailList.length) {
      let updateValues = emailList.filter((em, index) => index != indx);
      setEmailList(updateValues);

      let updateRawValues = "";
      updateValues.map((up) => {
        updateRawValues += up + "\n";
      });
      setRawInputValue(updateRawValues);
    }
  };

  const handleEmailCheck = async () => {
    if (!Array.isArray(emailList) || !emailList?.length) {
      return;
    }
    setValidatedEmails([]);
    setIsCompleteChecking(false);
    setIsCheckingEmail(true);
    setEmailCheckCount(0);
    for (const email of emailList) {
      await Api.post("v1/dashboard/email-validator/single", { email })
        .then((res) => {
          setCredits(res.data?.credit);
          setEmailCheckCount((prev) => prev + 1);
          setValidatedEmails((prev: any) => [...prev, res.data.data]);
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message);
        });
    }
    setIsCheckingEmail(false);
  };

  const designMainStatus = (result: number) => {
    if (result === 0) {
      return (
        <div className="flex justify-start">
          <div className="w-[85px] border border-red-200 bg-red-50 px-2 py-1 rounded-md text-xs text-red-600">
            <div className="flex gap-1.5 items-center justify-start">
              <div className="size-1.5 bg-red-600 rounded-full animate-pulse"></div>
              <div className="font-semibold tracking-wider">INVALID</div>
            </div>
          </div>
        </div>
      );
    }

    if (result === 1) {
      return (
        <div className="flex justify-start">
          <div className="w-[85px] border border-emerald-200 bg-emerald-50 px-2 py-1 rounded-md text-xs text-emerald-600">
            <div className="flex gap-1.5 items-center justify-start">
              <div className="size-1.5 bg-emerald-600 rounded-full"></div>
              <div className="font-semibold tracking-wider">VALID</div>
            </div>
          </div>
        </div>
      );
    }

    if (result === 2) {
      return (
        <div className="flex justify-start">
          <div className="w-[90px] border border-cyan-200 bg-cyan-50 px-2 py-1 rounded-md text-[11px] text-cyan-600">
            <div className="flex gap-1.5 items-center justify-start">
              <div className="size-1.5 bg-cyan-600 rounded-full"></div>
              <div className="font-semibold tracking-wider">UNKNOWN</div>
            </div>
          </div>
        </div>
      );
    }

    if (result === 3) {
      return (
        <div className="flex justify-start">
          <div className="w-[85px] border border-gray-200 bg-gray-50 px-2 py-1 rounded-md text-xs text-gray-600">
            <div className="flex gap-1.5 items-center justify-start">
              <div className="size-1.5 bg-gray-500 rounded-full"></div>
              <div className="font-semibold tracking-wider">FAILED</div>
            </div>
          </div>
        </div>
      );
    }

    if (result === 4) {
      return (
        <div className="flex justify-start">
          <div className="w-[85px] border border-amber-200 bg-amber-50 px-2 py-1 rounded-md text-xs text-amber-600">
            <div className="flex gap-1.5 items-center justify-start">
              <div className="size-1.5 bg-amber-500 rounded-full"></div>
              <div className="font-semibold tracking-wider">RISKY</div>
            </div>
          </div>
        </div>
      );
    }
  };

  const designOthervaluesStatus = (result: number) => {
    if (result === 0) {
      return (
        <div className="flex justify-start">
          <div className="w-[85px] border border-red-200 bg-red-50 px-2 py-1 rounded-md text-xs text-red-600">
            <div className="flex gap-1.5 items-center justify-start">
              <div className="size-1.5 bg-red-600 rounded-full"></div>
              <div className="font-semibold tracking-wider">INVALID</div>
            </div>
          </div>
        </div>
      );
    }
    if (result === 1) {
      return (
        <div className="flex justify-start">
          <div className="w-[85px] border border-emerald-200 bg-emerald-50 px-2 py-1 rounded-md text-xs text-emerald-600">
            <div className="flex gap-1.5 items-center justify-start">
              <div className="size-1.5 bg-emerald-600 rounded-full"></div>
              <div className="font-semibold tracking-wider">VALID</div>
            </div>
          </div>
        </div>
      );
    }
  };

  const prepareTableData = (data: any[]) => {
    let tableData: any[] = [];
    if (Array.isArray(data)) {
      data.map((dat, indx) => {
        tableData.push({
          id: indx + 1,
          status: designMainStatus(dat?.status),
          email: <span className="font-medium text-cyan-700">{dat?.email}</span>,
          format: designOthervaluesStatus(dat?.format),
          domain: designOthervaluesStatus(dat?.domain),
          mx: designOthervaluesStatus(dat?.mx),
          user: designMainStatus(dat?.user),
          time: <span className="text-cyan-700 font-mono text-sm">{formatNumber(dat?.time)} s</span>,
        });
      });
    }
    return tableData;
  };

  return (
    <Section
      permission={hasPermission("email-list.verify")}
      loading={loading}
      confirmation={deleteConfirm}
      confirmation_no={() => actionManager("delete_no")}
      confirmation_yes={() => actionManager("delete_yes")}
      className="space-y-8 bg-slate-50/50 min-h-screen p-6 rounded-3xl"
    >
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column: Credits & Quick Verification */}
        <div className="xl:col-span-7 space-y-8">
          {/* Credit Alert */}
          {!loading && !credits && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-700 shadow-sm">
              <SvgIcon name="info" className="size-5" />
              <p className="text-sm font-medium">You don't have any credits. Please purchase credits to continue checking emails.</p>
            </div>
          )}

          {/* Premium Credit Widget */}
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-100/40 to-emerald-100/40 rounded-bl-full -z-10"></div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Available Credits</p>
              <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-teal-600 to-emerald-500">{credits.toLocaleString()}</h1>
            </div>
            <div onClick={handleCheckout}>
              <Button
                url="/pricing"
                border=""
                showIcon={true}
                iconName="arrow_right_alt"
                iconClass="size-4 -rotate-45"
                iconPosition="after"
                iconFilled={false}
                className="bg-cyan-700 hover:bg-teal-700 text-white rounded-xl px-6 py-2.5 transition-all shadow-md hover:shadow-lg font-medium"
              >
                Buy More Credits
              </Button>
            </div>
          </div>

          {/* Quick Email Check Card */}
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Quick Verification</h2>
              <p className="text-sm text-slate-500 mt-1">Paste up to 10 emails below to verify them instantly.</p>
            </div>

            <div className="min-h-[120px] bg-slate-50 border border-slate-200 rounded-xl p-3 focus-within:ring-2 focus-within:ring-cyan-500/20 focus-within:border-cyan-400 transition-all flex flex-wrap content-start gap-2">
              {Array.isArray(emailList) &&
                emailList.map((em, indx) => (
                  <div
                    key={indx}
                    className="flex items-center gap-2 bg-white border border-teal-200 shadow-sm px-3 py-1.5 rounded-lg break-all group transition-all hover:border-teal-400"
                  >
                    <div className="text-sm font-medium text-teal-800">{em}</div>
                    <div onClick={() => removeInputValue(indx)} className="inline w-max cursor-pointer">
                      <SvgIcon name="close" filled className="size-4 text-slate-400 group-hover:text-red-500 transition-colors" />
                    </div>
                  </div>
                ))}
              {emailList && emailList.length === 10 ? null : (
                <textarea
                  rows={1}
                  onChange={(e) => handleInputEmails(e.target.value)}
                  value={emailInputs}
                  className="flex-1 min-w-[200px] bg-transparent text-sm text-slate-700 px-2 py-1.5 border-0 outline-none shadow-none focus:ring-0 resize-none placeholder:text-slate-400"
                  placeholder="Enter email addresses (separated by enter or comma)..."
                />
              )}
            </div>

            <div className="flex flex-wrap justify-between items-center bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <div className="text-sm font-medium text-slate-600">
                <span className="text-slate-400">Total Valid Entries: </span>
                <span className="text-teal-600 font-bold ml-1">{Array.isArray(emailList) ? emailList.length : 0} / 10</span>
              </div>
              <div onClick={handleEmailCheck}>
                <Button
                  border=""
                  showIcon={true}
                  iconName="verified"
                  iconClass="size-4"
                  iconPosition="before"
                  iconFilled={true}
                  className="bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600 text-white rounded-xl px-6 py-2 shadow-md hover:shadow-cyan-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={emailList?.length == 0 || isCheckingEmail}
                >
                  Verify Emails
                </Button>
              </div>
            </div>

            {isCheckingEmail && (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <LoaderProgress PROGRESS_COLOR="bg-teal-500" />
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-slate-500 animate-pulse">Analyzing entries...</span>
                  <span className="text-teal-700 bg-teal-50 px-3 py-1 rounded-full">
                    {emailCheckCount} / {emailList?.length}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Bulk Upload Section */}
        <div className="xl:col-span-5 h-full">
          <div className="h-full bg-linear-to-br from-teal-700 via-cyan-700 to-emerald-700 rounded-3xl p-8 shadow-xl flex flex-col justify-center items-center space-y-8 relative overflow-hidden group">
            {/* Background elements */}
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-teal-500/20 blur-3xl rounded-full"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-cyan-500/20 blur-3xl rounded-full"></div>

            <div className="text-center space-y-3 z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 text-emerald-300 mb-2 backdrop-blur-md border border-white/10 shadow-lg group-hover:scale-105 transition-transform">
                <SvgIcon name="cloud_upload" className="size-8" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-wide">Bulk Email Verification</h1>
              <p className="text-sm text-teal-100/80 max-w-[280px] mx-auto">Upload massive lists to scrub invalid, spam-trap, and bounce emails automatically.</p>
            </div>

            <div className="w-full z-10 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-2 hover:bg-white/10 transition-colors">
              <ExcelUploader
                setData={(dat: any) => handleSheetData(dat)}
                disabled={false}
                showFileInfo={false}
                fileInfo={fileInfo}
                setFileInfo={setFileInfo}
                showLoading={false}
                setLoading={setLoading}
                className="py-10"
                bg=""
                border=""
                fileClass="file:bg-cyan-500 file:p-3 file:text-white file:hover:bg-teal-500"
              />
            </div>

            <div className="space-y-2 text-center z-10">
              <p className="text-xs text-teal-200/60 font-medium bg-white/5 py-1.5 px-4 rounded-full border border-white/5 inline-block">
                Must contain an "Email" column
              </p>
              <p className="text-xs text-teal-200/40">Supported formats: .XLSX, .CSV</p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <SvgIcon name="check" className="size-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Verification Results</h2>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <Table
            data={prepareTableData(validatedEmails)}
            loading={loading}
            showMark={false}
            markItems={marks}
            setMarkItems={setMarks}
            excludeKeys={["id"]}
            showDelete={false}
            handleDelete={() => ""}
            headerBg="bg-linear-to-r from-teal-600 via-cyan-600 to-emerald-600 text-white font-semibold"
          />
        </div>
      </div>

      {/* Upload Confirmation Modal */}
      <Modal
        zIndex="z-[48]"
        loading={loading}
        maxWidth="w-full max-w-4xl"
        permission={hasPermission("email-list.create")}
        show={createListModal}
        setShow={() => {
          isUploadingList ? toast.info("Verification in progress. Please wait.") : setCreateListModal(false);
        }}
        size={4}
      >
        <div className="p-10 space-y-8 bg-white">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-800">Review Your List</h2>
            <p className="text-slate-500">We've processed your document. Review the details before executing.</p>
          </div>

          <div className={Array.isArray(dataSheet) && dataSheet.length > 0 ? "grid md:grid-cols-3 gap-6 pt-6" : "hidden"}>
            <div className="p-6 rounded-2xl bg-cyan-50/50 border border-cyan-100 space-y-5 flex flex-col items-center shadow-sm">
              <div className="flex items-center justify-center relative">
                <div className="absolute inset-0 bg-cyan-200 blur-xl opacity-50 rounded-full"></div>
                <SvgIcon name="folder" className="size-14 p-3 rounded-2xl bg-cyan-500 text-white relative z-10 shadow-md" filled />
              </div>
              <div className="text-center w-full">
                <span className="text-xs font-bold text-cyan-600 uppercase tracking-widest block mb-1">File Name</span>
                <span className="font-semibold text-slate-700 truncate block w-full px-2" title={fileInfo?.name}>
                  {fileInfo?.name}
                </span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-teal-50/50 border border-teal-100 space-y-5 flex flex-col items-center shadow-sm">
              <div className="flex items-center justify-center relative">
                <div className="absolute inset-0 bg-teal-200 blur-xl opacity-50 rounded-full"></div>
                <SvgIcon name="bolt" className="size-14 p-3 rounded-2xl bg-teal-500 text-white relative z-10 shadow-md" filled />
              </div>
              <div className="text-center w-full">
                <span className="text-xs font-bold text-teal-600 uppercase tracking-widest block mb-1">File Size</span>
                <span className="font-semibold text-slate-700 block">{formatSize(fileInfo?.size)}</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-5 flex flex-col items-center shadow-sm">
              <div className="flex items-center justify-center relative">
                <div className="absolute inset-0 bg-emerald-200 blur-xl opacity-50 rounded-full"></div>
                <SvgIcon name="checklist" className="size-14 p-3 rounded-2xl bg-emerald-500 text-white relative z-10 shadow-md" filled />
              </div>
              <div className="text-center w-full">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-1">Valid Records</span>
                <span className="font-bold text-2xl text-slate-800 block">{totalRecords}</span>
              </div>
            </div>
          </div>

          {isUploadingList && (
            <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-4">
              <LoaderProgress PROGRESS_COLOR="bg-teal-500" />
              <div className="flex justify-between items-center font-medium">
                <span className="text-slate-500 animate-pulse">Uploading and verifying list...</span>
                <span className="bg-teal-100 text-teal-800 px-4 py-1.5 rounded-full text-sm font-bold">
                  {uploadedCount} / {dataSheet?.length}
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-center pt-4 border-t border-slate-100">
            <div onClick={!isUploadingList ? createListLabel : undefined}>
              <Button
                border=""
                showIcon={true}
                iconName={isUploadingList ? "hourglass_empty" : "rocket_launch"}
                iconClass={`size-5 ${isUploadingList ? "animate-spin" : ""}`}
                iconPosition="before"
                iconFilled={false}
                className={`rounded-xl px-8 py-3 text-white font-medium shadow-lg transition-all ${
                  isUploadingList
                    ? "bg-slate-400 cursor-not-allowed shadow-none"
                    : "bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 hover:shadow-teal-500/25 cursor-pointer"
                }`}
                disabled={isUploadingList}
              >
                {isUploadingList ? "Processing..." : "Start Verification"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Advanced Filter Drawer */}
      <Drawer position="right" permission={hasPermission("email-list.view")} loading={loading} show={filterShow} set_show={setFilterShow}>
        <div className="flex flex-col justify-between h-full bg-slate-50">
          <div className="p-6 text-xl font-bold bg-gradient-to-r from-teal-800 to-cyan-800 text-white flex items-center gap-3 shadow-md">
            <SvgIcon name="tune" className="size-6 text-teal-200" />
            Advanced Filters
          </div>
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-1 gap-6 text-sm">
              <Input value={searchName} setValue={setSearchName} label="Name" id="searchName" iconName="person" errorMessage={errors?.searchName} />
              <Input value={searchEmail} setValue={setSearchEmail} label="Email Address" id="searchEmail" errorMessage={errors?.searchEmail} iconName="mail" />
              <Input value={searchPosition} setValue={setSearchPosition} label="Position" id="searchPosition" iconName="work" errorMessage={errors?.searchPosition} />
              <Input value={searchCountry} setValue={setSearchCountry} label="Country" id="searchCountry" iconName="public" errorMessage={errors?.searchCountry} />
              <Input value={searchLanguage} setValue={setSearchLanguage} label="Language" id="searchLanguage" iconName="language" errorMessage={errors?.searchLanguage} />
              <Input value={searchCategory} setValue={setSearchCategory} label="Category" id="searchCategory" iconName="category" errorMessage={errors?.searchCategory} />
            </div>
          </div>
          <div
            onClick={() => {
              getInitialData();
              setFilterShow(false);
            }}
            className="p-5 text-lg font-semibold bg-white border-t border-slate-200 text-teal-700 hover:bg-teal-50 cursor-pointer flex items-center justify-center gap-2 transition-colors"
          >
            <SvgIcon name="filter_list" className="size-5" /> Apply Filters
          </div>
        </div>
      </Drawer>
    </Section>
  );
}

export default DottormailEmailVerifyPage;

// import { useEffect, useState } from "react";
// import Section from "@/modules/global/elements/section";
// import SvgIcon from "@/modules/global/icons/svg_icons";
// import Table from "@/modules/global/elements/table";
// import { toast } from "sonner";
// import Modal from "@/modules/global/elements/modal";
// import Button from "@/modules/global/elements/button";
// import Input from "@/modules/global/input/input";
// import Drawer from "@/modules/global/elements/drawer";
// import { checkErrors, dateTimeFormat, formatNumber, formatSize, normalizeArrayObjects } from "@/lib/helper";
// import ExcelUploader from "@/modules/global/elements/excel_file_uploader";
// import Api from "@/lib/api";
// import { useRouter } from "next/router";
// import LoaderProgress from "@/modules/global/elements/progress";
// import { useAuthStore } from "@/modules/auth/store/useAuthStore";
// import { useLanguageStore } from "@/modules/language/store/useLanguageStore";
// import { useCurrencyStore } from "@/modules/currency/store/useCurrencyStore";

// interface Feature {
//   id: number;
//   icon: string;
//   name: string;
// }

// function DottormailEmailVerifyPage() {
//   const router = useRouter();
//   const { appSelectedLocale } = useLanguageStore();
//   const { appUser, hasPermission } = useAuthStore();
//   const [loading, setLoading] = useState(false);
//   const [deleteConfirm, setDeleteConfirm] = useState(false);
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [marks, setMarks] = useState<any[]>([]);
//   const [modalShow, setModalShow] = useState(false);
//   const [filterShow, setFilterShow] = useState(false);
//   const [action, setAction] = useState<"create" | "update">("create");
//   const [actionId, setActionId] = useState<string>("");
//   const [mainData, setMainData] = useState<any[]>([]); // Initialize as an empty array

//   const [credits, setCredits] = useState(0);

//   const [refresh, setRefresh] = useState(0);
//   const refreshPage = () => {
//     setRefresh((prev) => prev + 1);
//   };

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);

//   // Search strings
//   const [searchName, setSearchName] = useState("");
//   const [searchEmail, setSearchEmail] = useState("");
//   const [searchPosition, setSearchPosition] = useState("");
//   const [searchCountry, setSearchCountry] = useState("");
//   const [searchLanguage, setSearchLanguage] = useState("");
//   const [searchCategory, setSearchCategory] = useState("");

//   const [editModalShow, setEditModalShow] = useState(false);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [position, setPosition] = useState("");
//   const [country, setCountry] = useState("");
//   const [language, setLanguage] = useState("");
//   const [category, setCategory] = useState("");
//   const [others, setOthers] = useState("");

//   const getInitialData = async () => {
//     setLoading(true);
//     let url = "v1/dashboard/email-list/credit";
//     await Api.post(url)
//       .then((res: any) => {
//         setCredits(res.data.data?.credit ?? 0);
//         setLoading(false);
//       })
//       .catch((err: any) => {
//         setCredits(0);
//         setLoading(false);
//         toast.error(err?.response?.data?.message);
//       });
//   };

//   useEffect(() => {
//     getInitialData();
//   }, [refresh, currentPage, appSelectedLocale]);

//   const handlePressEnterForSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       getInitialData();
//     }
//   };

//   const actionManager = (actionType: string, actionValue?: any) => {
//     if (actionType == "open_create") {
//       setAction("create");
//       setDataSheet([]);
//       setUploadedCount(0);
//       setFileInfo("");
//       setTotalRecords(0);
//       setIsUploadingList(false);
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

//   const [dataSheet, setDataSheet] = useState<any[]>([]);
//   const [fileInfo, setFileInfo] = useState<any>(null);
//   const [totalRecords, setTotalRecords] = useState(0);

//   const handleSheetData = (data: any) => {
//     if (Array.isArray(data)) {
//       const normalize = normalizeArrayObjects(data);
//       const filterData = normalize.filter((item) => typeof item?.email === "string" && item?.email.trim() !== "");

//       console.log(filterData);

//       const finalData = filterData.map((itm) => {
//         // Remove fields using destructuring
//         const { email, ...info } = itm;
//         return {
//           email: email,
//           status: 0,
//           checked: 0,
//           user_id: appUser?.id,
//           label_id: "",
//           info: JSON.stringify(info),
//           created_at: dateTimeFormat(new Date(), "year-month-day hour:minute:second"),
//           updated_at: dateTimeFormat(new Date(), "year-month-day hour:minute:second"),
//         };
//       });
//       const recordLength = finalData?.length;
//       if (recordLength) {
//         setTotalRecords(recordLength);
//         setDataSheet(finalData);
//         setUploadedCount(0);
//         setIsUploadingList(false);
//         setCreateListModal(true);
//       }
//     }
//   };

//   const [isUploadingList, setIsUploadingList] = useState(false);
//   const [uploadedCount, setUploadedCount] = useState(0);
//   const handleDataSheetUpload = async (label_id: any) => {
//     if (checkErrors({ label_id })) {
//       setIsUploadingList(false);
//       return;
//     }
//     const mainRecords = dataSheet.map((item) => {
//       return {
//         ...item,
//         label_id: label_id,
//       };
//     });
//     if (mainRecords.length <= 1000) {
//       await Api.post("v1/dashboard/email-list/store", { data: mainRecords })
//         .then((res) => {
//           setIsUploadingList(false);
//           setUploadedCount(mainRecords.length);
//           router.push("/dashboard/email-verify/my-list");
//         })
//         .catch((error) => {
//           toast.error("Something went wrong, Try again later.");
//           setIsUploadingList(false);
//         });
//     } else {
//       const chunkSize = 1000;
//       let chunkList = [];
//       for (let i = 0; i < mainRecords.length; i += chunkSize) {
//         const chunk = mainRecords.slice(i, i + chunkSize);
//         chunkList.push(chunk);
//       }
//       for (const list of chunkList) {
//         await Api.post("v1/dashboard/email-list/store", { data: list })
//           .then((res) => {
//             setUploadedCount((prev) => prev + list.length);
//           })
//           .catch((error) => {
//             toast.error("Something went wrong, when uploading.");
//           });
//       }
//       setIsUploadingList(false);
//       router.push("/dashboard/email-verify/my-list");
//     }
//   };

//   const createListLabel = async () => {
//     if (!fileInfo) {
//       return;
//     }
//     setIsUploadingList(true);
//     await Api.post("v1/dashboard/list-label/store", { name: fileInfo?.name })
//       .then((res) => {
//         const id = res.data?.id;
//         handleDataSheetUpload(id);
//       })
//       .catch((error) => {
//         toast.error("Something went wrong, Try again later.");
//         setIsUploadingList(false);
//       });
//   };

//   const [fileName, setFileName] = useState("");

//   const handleCheckout = async () => {
//     if (Array.isArray(marks) && marks?.length) {
//       if (checkErrors({ fileName }, setErrors)) {
//         return;
//       }
//       let url = "journalist/initial-download";
//       let data = { name: fileName, data: marks };
//       setLoading(true);
//       await Api.post(url, data)
//         .then((res: any) => {
//           setLoading(false);
//           let list = res.data?.data;
//           router.push(`/checkout?id=${list?.id}&type=journalist&qty=1&rdtas=/dashboard/v2/journalist/order`);
//         })
//         .catch((err: any) => {
//           setLoading(false);
//           //toast.error(err?.response?.data?.message);
//         });
//     }
//   };

//   const [createListModal, setCreateListModal] = useState(false);

//   const [emailList, setEmailList] = useState<any>("");
//   const [seperator, setSeperator] = useState("\n");

//   const [emailInputs, setEmailInputs] = useState("");
//   const [rawInputValue, setRawInputValue] = useState("");

//   const [isCompleteChecking, setIsCompleteChecking] = useState(false);
//   const [isCheckingEmail, setIsCheckingEmail] = useState(false);
//   const [emailCheckCount, setEmailCheckCount] = useState(0);
//   const [validatedEmails, setValidatedEmails] = useState<any>([]);

//   const handleInputEmails = (value: any) => {
//     if (isCheckingEmail) {
//       return;
//     }
//     let updateValue = rawInputValue + value;
//     setRawInputValue(updateValue);

//     let emailsToArray: any = updateValue;
//     if (seperator == "\n") {
//       emailsToArray = updateValue.split("\n");
//     }
//     if (seperator == ",") {
//       emailsToArray = updateValue.replaceAll("\n", "").split(",");
//     }
//     emailsToArray = emailsToArray.filter((em: any) => em && em);
//     // let emailObj = emailsToArray.map((em) => {
//     //     return { email: em }
//     // })
//     setEmailList(emailsToArray);
//   };

//   const removeInputValue = (indx: any) => {
//     if (isCheckingEmail) {
//       return;
//     }
//     if (Array.isArray(emailList) && emailList.length) {
//       let updateValues = emailList.filter((em, index) => index != indx);
//       setEmailList(updateValues);

//       let updateRawValues = "";
//       updateValues.map((up) => {
//         updateRawValues += up + "\n";
//       });
//       setRawInputValue(updateRawValues);
//     }
//   };

//   const handleEmailCheck = async () => {
//     if (!Array.isArray(emailList) || !emailList?.length) {
//       return;
//     }
//     setValidatedEmails([]);
//     setIsCompleteChecking(false);
//     setIsCheckingEmail(true);
//     setEmailCheckCount(0);
//     for (const email of emailList) {
//       await Api.post("v1/dashboard/email-validator/single", { email })
//         .then((res) => {
//           setCredits(res.data?.credit);
//           setEmailCheckCount((prev) => prev + 1);
//           setValidatedEmails((prev: any) => [...prev, res.data.data]);
//         })
//         .catch((error) => {
//           toast.error(error?.response?.data?.message);
//         });
//     }
//     setIsCheckingEmail(false);
//   };

//   const designCheckStatus = (result: number) => {
//     if (result === 1) {
//       return (
//         <div className="flex justify-start">
//           <div className="w-[85px] border-2 border-gray-200 dark:border-gray-500 px-2 py-1 rounded-md text-xs text-green-600 dark:text-green-400">
//             <div className="flex gap-1 items-center justify-start">
//               <div className="size-2 bg-green-600 rounded-full"></div>
//               <div className="font-semibold">CHECKED</div>
//             </div>
//           </div>
//         </div>
//       );
//     }

//     if (result === 2) {
//       return (
//         <div className="flex justify-start">
//           <div className="w-[85px] border-2 border-gray-200 dark:border-gray-500 px-2 py-1 rounded-md text-xs text-red-600 dark:text-red-600">
//             <div className="flex gap-1 items-center justify-start">
//               <div className="size-2 bg-red-600 rounded-full"></div>
//               <div className="font-semibold">FAILED</div>
//             </div>
//           </div>
//         </div>
//       );
//     }
//   };

//   const designMainStatus = (result: number) => {
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

//   const designOthervaluesStatus = (result: number) => {
//     if (result === 0) {
//       return (
//         <div className="flex justify-start">
//           <div className="w-[85px] border-2 border-gray-200 dark:border-gray-500 px-2 py-1 rounded-md text-xs text-red-600 dark:text-red-600">
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
//   };

//   const prepareTableData = (data: any[]) => {
//     let tableData: any[] = [];
//     if (Array.isArray(data)) {
//       data.map((dat, indx) => {
//         tableData.push({
//           id: indx + 1,
//           status: designMainStatus(dat?.status),
//           email: dat?.email,
//           format: designOthervaluesStatus(dat?.format),
//           domain: designOthervaluesStatus(dat?.domain),
//           mx: designOthervaluesStatus(dat?.mx),
//           user: designMainStatus(dat?.user),
//           time: formatNumber(dat?.time) + " S",
//         });
//       });
//     }
//     return tableData;
//   };

//   return (
//     <Section
//       permission={hasPermission("email-list.verify")}
//       loading={loading}
//       confirmation={deleteConfirm}
//       confirmation_no={() => actionManager("delete_no")}
//       confirmation_yes={() => actionManager("delete_yes")}
//       className="space-y-10"
//     >
//       <div className="grid grid-cols-1 2xl:grid-cols-2 gap-8">
//         <div className="space-y-8 order-2 2xl:order-none">
//           {!loading && !credits ? <p className="p-2 rounded bg-red-50 text-red-600">You don't have any credits. Please buy credits to check email.</p> : ""}
//           <div className="p-5 bg-white rounded-lg flex flex-wrap items-center justify-between">
//             <h1>Your Credits: {credits}</h1>
//             <div onClick={handleCheckout}>
//               <Button
//                 url="/pricing"
//                 border=""
//                 showIcon={true}
//                 iconName="arrow_right_alt"
//                 iconClass="size-4 -rotate-45"
//                 iconPosition="after"
//                 iconFilled={false}
//                 className="bg-cyan-600 hover:bg-teal-800 text-white rounded"
//               >
//                 Buy More
//               </Button>
//             </div>
//           </div>
//           <div className="p-5 bg-white rounded-lg space-y-4">
//             <div className="flex flex-wrap items-center gap-2 py-2 px-4 rounded-lg border border-gray-200 mt-4">
//               {Array.isArray(emailList) &&
//                 emailList.map((em, indx) => (
//                   <div key={indx} className="flex items-center gap-2 bg-indigo-200 px-2 py-0.5 rounded-full break-all">
//                     <div className="leading-0">{em}</div>
//                     <div onClick={() => removeInputValue(indx)} className="inline w-max">
//                       <SvgIcon name="close" filled className="size-5 p-0.5 hover:bg-red-500 hover:text-white rounded-full cursor-pointer" />
//                     </div>
//                   </div>
//                 ))}
//               {emailList && emailList.length === 10 ? (
//                 ""
//               ) : (
//                 <textarea
//                   rows={1}
//                   onChange={(e) => handleInputEmails(e.target.value)}
//                   value={emailInputs}
//                   className="inline-block w-full px-0 py-1 border-0 outline-none shadow-none focus:outline-none focus-visible:outline-none focus:ring-0 focus:border-0 focus:shadow-none"
//                   placeholder="Write your Email | Max 10 Emails"
//                 />
//               )}
//             </div>
//             <div className="flex flex-wrap justify-between gap-4 items-center">
//               <div className="opacity-70">Total Emails: {Array.isArray(emailList) && emailList.length}</div>
//               <div onClick={handleEmailCheck}>
//                 <Button
//                   border=""
//                   showIcon={true}
//                   iconName="arrow_right_alt"
//                   iconClass="size-4 -rotate-45"
//                   iconPosition="after"
//                   iconFilled={false}
//                   className="bg-teal-600 hover:bg-cyan-800 text-white rounded"
//                   disabled={emailList?.length == 0 || isCheckingEmail}
//                 >
//                   Check Now
//                 </Button>
//               </div>
//             </div>
//           </div>
//           <div className="p-5 bg-white rounded-lg space-y-4 ">
//             {isCheckingEmail && <LoaderProgress PROGRESS_COLOR="bg-blue-950" />}

//             <div className="flex justify-center">
//               <div className="font-semibold">
//                 <span className="opacity-70">Checked Email: </span>
//                 {emailCheckCount} / {emailList?.length}
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white rounded-lg p-10 space-y-6">
//           <div className="space-y-2">
//             <h1 className="text-center text-2xl font-semibold">Upload Your Email List</h1>
//           </div>
//           <ExcelUploader
//             setData={(dat: any) => handleSheetData(dat)}
//             disabled={false}
//             showFileInfo={false}
//             fileInfo={fileInfo}
//             setFileInfo={setFileInfo}
//             showLoading={false}
//             setLoading={setLoading}
//           />
//           <div className="space-y-2">
//             <p className="text-center text-sm opacity-70">Ensure your file contains a column labeled "Email" for successful processing.</p>
//             <p className="text-center text-sm opacity-70">Supported file formats: XLSX, CSV.</p>
//           </div>
//         </div>
//       </div>

//       <div className="p-5 bg-white rounded-lg space-y-6">
//         <h1>Validated Email Results:</h1>

//         <Table
//           data={prepareTableData(validatedEmails)}
//           loading={loading}
//           showMark={false}
//           markItems={marks}
//           setMarkItems={setMarks}
//           excludeKeys={["id"]}
//           showDelete={false}
//           handleDelete={() => ""}
//         />
//       </div>

//       <Modal
//         zIndex="z-[48]"
//         loading={loading}
//         maxWidth="w-full max-w-4xl"
//         permission={hasPermission("email-list.create")}
//         show={createListModal}
//         setShow={() => {
//           isUploadingList ? toast.info("You can not close this modal now") : setCreateListModal(false);
//         }}
//         size={4}
//       >
//         <div className="p-12 space-y-6">
//           <div className="text-center text-[34px] font-bold">Upload Your List</div>

//           <div className={Array.isArray(dataSheet) && dataSheet.length > 0 ? "grid md:grid-cols-3 gap-5 pt-10" : "hidden md:grid-cols-3 gap-5 pt-10"}>
//             <div className="p-5 rounded-lg bg-white space-y-4 border-2 border-blue-100">
//               <div className="text-center flex items-center justify-center">
//                 <SvgIcon name="folder" className="size-12 p-3 rounded-full bg-blue-100 text-blue-950" filled />
//                 <span className="px-2 text-xs py-1 rounded-r-full bg-blue-100 text-blue-600 -ms-1">File Name</span>
//               </div>
//               <div className=" text-center font-semibold">{fileInfo?.name}</div>
//             </div>
//             <div className="p-5 rounded-lg bg-white space-y-4 border-2 border-blue-100">
//               <div className="text-center flex items-center justify-center">
//                 <SvgIcon name="bolt" className="size-12 p-3 rounded-full bg-blue-100 text-blue-950" filled />
//                 <span className="px-2 text-xs py-1 rounded-r-full bg-blue-100 text-blue-600 -ms-1">File Size</span>
//               </div>
//               <div className=" text-center font-semibold">{formatSize(fileInfo?.size)}</div>
//             </div>
//             <div className="p-5 rounded-lg bg-white space-y-4 border-2 border-blue-100">
//               <div className="text-center flex items-center justify-center">
//                 <SvgIcon name="sort" className="size-12 p-3 rounded-full bg-blue-100 text-blue-950" filled />
//                 <span className="px-2 text-xs py-1 rounded-r-full bg-blue-100 text-blue-600 -ms-1">Valid Records</span>
//               </div>
//               <div className=" text-center font-semibold">{totalRecords}</div>
//             </div>
//           </div>

//           <div className="p-5 bg-white rounded-lg space-y-4 ">
//             {isUploadingList && <LoaderProgress PROGRESS_COLOR="bg-blue-950" />}

//             <div className="flex justify-center">
//               <div className="font-semibold">
//                 <span className="opacity-70">Uploaded Emails: </span>
//                 {uploadedCount}/{dataSheet?.length}
//               </div>
//             </div>
//           </div>
//           <div className="flex justify-center">
//             {isUploadingList ? (
//               <div>
//                 <Button
//                   border=""
//                   showIcon={true}
//                   iconName="arrow_right_alt"
//                   iconClass="size-4 -rotate-45"
//                   iconPosition="after"
//                   iconFilled={false}
//                   className="bg-blue-950 hover:bg-blue-800 text-white rounded"
//                   disabled
//                 >
//                   Upload Now
//                 </Button>
//               </div>
//             ) : (
//               <div onClick={createListLabel}>
//                 <Button
//                   border=""
//                   showIcon={true}
//                   iconName="arrow_right_alt"
//                   iconClass="size-4 -rotate-45"
//                   iconPosition="after"
//                   iconFilled={false}
//                   className="bg-blue-950 hover:bg-blue-800 text-white rounded"
//                 >
//                   Upload Now
//                 </Button>
//               </div>
//             )}
//           </div>
//         </div>
//       </Modal>

//       <Drawer position="right" permission={hasPermission("email-list.view")} loading={loading} show={filterShow} set_show={setFilterShow}>
//         <div className="flex flex-col justify-between h-full">
//           <div className="p-4 text-xl font-semibold bg-blue-950 text-white">
//             <SvgIcon name="tune" /> Advance Filter
//           </div>
//           <div className="flex-1 p-4 overflow-y-auto">
//             <div className="grid grid-cols-1 gap-5 text-sm">
//               <Input value={searchName} setValue={setSearchName} label="Name" id="searchName" iconName="short_text" errorMessage={errors?.searchName} />
//               <Input value={searchEmail} setValue={setSearchEmail} label="Email" id="price" errorMessage={errors?.searchEmail} iconName="short_text" />
//               <Input value={searchPosition} setValue={setSearchPosition} label="Position" id="credit" iconName="short_text" errorMessage={errors?.searchPosition} />

//               <Input value={searchCountry} setValue={setSearchCountry} label="Country" id="credit" iconName="short_text" errorMessage={errors?.searchCountry} />
//               <Input value={searchLanguage} setValue={setSearchLanguage} label="Language" id="credit" iconName="short_text" errorMessage={errors?.searchLanguage} />
//               <Input value={searchCategory} setValue={setSearchCategory} label="Category" id="credit" iconName="short_text" errorMessage={errors?.searchCategory} />
//             </div>
//           </div>
//           <div onClick={() => getInitialData(true)} className="p-4 text-2xl font-semibold bg-blue-950 hover:bg-blue-800 text-white cursor-pointer">
//             <SvgIcon name="tune" /> Submit
//           </div>
//         </div>
//       </Drawer>
//     </Section>
//   );
// }

// export default DottormailEmailVerifyPage;
