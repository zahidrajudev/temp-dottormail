import { useEffect, useState } from "react";
import Section from "@/modules/global/elements/section";
import SvgIcon from "@/modules/global/icons/svg_icons";
import Table from "@/modules/global/elements/table";
import DefaultPagination from "@/modules/global/elements/pagination";
import { toast } from "sonner";
import Modal from "@/modules/global/elements/modal";
import Button from "@/modules/global/elements/button";
import Input from "@/modules/global/input/input";
import Drawer from "@/modules/global/elements/drawer";
import { checkErrors, checkPermission } from "@/lib/helper";
import ProfileDropdown from "@/modules/global/widget/profile_dropdown";
import Api from "@/lib/api";
import { useRouter } from "next/router";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { useLanguageStore } from "@/modules/language/store/useLanguageStore";

interface Feature {
  id: number;
  icon: string;
  name: string;
}

function DottormailMyListPage() {
  const router = useRouter();
  const { appSelectedLocale } = useLanguageStore();
  const { appPermissions, hasPermission } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [marks, setMarks] = useState<any[]>([]);
  const [modalShow, setModalShow] = useState(false);
  const [filterShow, setFilterShow] = useState(false);
  const [action, setAction] = useState<"create" | "update">("create");
  const [actionId, setActionId] = useState<string>("");
  const [mainData, setMainData] = useState<any[]>([]); // Initialize as an empty array
  const [setting, setSetting] = useState<any>(null);

  const [refresh, setRefresh] = useState(0);
  const refreshPage = () => {
    setRefresh((prev) => prev + 1);
  };

  // Pagination
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginateInfo, setPaginateInfo] = useState("");

  const handleDelete = async () => {
    try {
      let url = "v1/dashboard/list-label/delete";

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

  // Search strings
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

  const handleUpdate = () => {
    let url: string = "v1/dashboard/list-label/update";
    let data: any;
    data = {
      id: actionId,
      name,
    };
    if (checkErrors({ actionId, name })) {
      return;
    }
    setLoading(true);
    Api.post(url, data)
      .then((res: any) => {
        refreshPage();
        setEditModalShow(false);
        setLoading(false);
        toast.success(res?.data?.message);
      })
      .catch((err: any) => {
        setLoading(false);
        toast.error(err?.response?.data?.message);
      });
  };

  const getInitialData = async (is_filter: any) => {
    setLoading(true);
    let data = {
      page: currentPage,
      name: searchName,
    };
    let url = "v1/dashboard/list-label";
    await Api.post(url, data)
      .then((res: any) => {
        setLoading(false);
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
    getInitialData(false);
  }, [refresh, currentPage, appSelectedLocale]);

  const handlePressEnterForSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      getInitialData(true);
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
      await Api.post(url, { id: actionId }) // Assuming actionId is set for specific item delete/restore
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

  const openForEdit = (id: any) => {
    let findRecord = mainData.find((md: any) => md.id == id);
    if (findRecord) {
      setActionId(findRecord.id);
      setName(findRecord?.name ?? "");
      setEditModalShow(true);
    }
  };

  const prepareTableData = (data: any[]) => {
    let tableData: any[] = [];
    if (Array.isArray(data)) {
      data.map((dat) => {
        tableData.push({
          id: dat.id,
          name: dat?.name,
          emails: (
            <div className="space-y-1">
              <p>{dat?.valid_count} Valid Emails</p>
              <p className="opacity-70">
                {dat?.checked_count} checked out of {dat?.checked_count + dat?.unchecked_count}
              </p>
            </div>
          ),
          "Checking status":
            dat?.status == 1 ? (
              <div className="text-green-600 font-semibold flex items-center gap-2">
                Checking <SvgIcon name="loading" loading className="size-5" />
              </div>
            ) : (
              <div className="text-red-600 font-semibold">OFF</div>
            ),
          actions: (
            <div className="flex items-center gap-4">
              <div onClick={() => router.push(`/dashboard/email-verify/my-list/view?id=${dat.id}`)}>
                <Button
                  border=""
                  showIcon={true}
                  iconName="arrow_right_alt"
                  iconClass="size-4 -rotate-45"
                  iconPosition="after"
                  iconFilled={false}
                  className="bg-linear-to-br from-teal-500 via-cyan-500 to-emerald-500 text-white rounded"
                >
                  View
                </Button>
              </div>
              <div onClick={() => openForEdit(dat?.id)}>
                <Button
                  border=""
                  showIcon={true}
                  iconName="arrow_right_alt"
                  iconClass="size-4 -rotate-45"
                  iconPosition="after"
                  iconFilled={false}
                  className="bg-linear-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white rounded"
                >
                  Edit
                </Button>
              </div>
            </div>
          ),
        });
      });
    }
    return tableData;
  };

  const [dataSheet, setDataSheet] = useState<any[]>([]);
  const [fileInfo, setFileInfo] = useState<any>(null);
  const [totalRecords, setTotalRecords] = useState(0);

  const [completeUpload, setCompleteUpload] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);

  return (
    <Section
      permission={hasPermission("email-list.view")}
      loading={loading}
      confirmation={deleteConfirm}
      confirmation_no={() => actionManager("delete_no")}
      confirmation_yes={() => handleDelete()}
      className="space-y-10"
    >
      <Table
        data={prepareTableData(mainData)}
        loading={loading}
        showMark={true}
        markItems={marks}
        setMarkItems={setMarks}
        excludeKeys={["id"]}
        showDelete={true}
        handleDelete={() => setDeleteConfirm(true)}
        headerBg="bg-linear-to-r from-teal-600 via-cyan-600 to-emerald-600 text-white font-semibold"
      />

      <DefaultPagination
        design={2}
        currentPage={currentPage}
        totalPages={totalPage}
        onPageChange={setCurrentPage}
        siblingCount={1}
        paginateInfo={paginateInfo}
        className="text-sm font-semibold bg-white rounded p-3 mt-1"
      />

      <Modal
        zIndex="z-[48]"
        loading={loading}
        maxWidth="w-full max-w-xl"
        permission={hasPermission("email-list.edit")}
        show={editModalShow}
        setShow={setEditModalShow}
        size={4}
      >
        <div className="p-12 space-y-6">
          <div className="text-center text-[34px] font-bold">Update List Name</div>
          <Input
            value={name}
            setValue={setName}
            labelShow={true}
            label="Your List Name"
            placeholder="Your List Name"
            id="searchText"
            padding="pl-12"
            iconName="short_text"
            iconClass="size-8"
            errorMessage={errors?.fileName}
          />
          <div onClick={handleUpdate}>
            <Button
              border=""
              showIcon={true}
              iconName="arrow_right_alt"
              iconClass="size-4 -rotate-45"
              iconPosition="after"
              iconFilled={false}
              className="bg-cyan-700 hover:bg-teal-800 text-white rounded"
            >
              Update Now
            </Button>
          </div>
        </div>
      </Modal>

      <Drawer position="right" permission={hasPermission("email-list.view")} loading={loading} show={filterShow} set_show={setFilterShow}>
        <div className="flex flex-col justify-between h-full">
          <div className="p-4 text-xl font-semibold bg-blue-950 text-white">
            <SvgIcon name="tune" /> Advance Filter
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="grid grid-cols-1 gap-5 text-sm">
              <Input value={searchName} setValue={setSearchName} label="Name" id="searchName" iconName="short_text" errorMessage={errors?.searchName} />
              <Input value={searchEmail} setValue={setSearchEmail} label="Email" id="price" errorMessage={errors?.searchEmail} iconName="short_text" />
              <Input value={searchPosition} setValue={setSearchPosition} label="Position" id="credit" iconName="short_text" errorMessage={errors?.searchPosition} />

              <Input value={searchCountry} setValue={setSearchCountry} label="Country" id="credit" iconName="short_text" errorMessage={errors?.searchCountry} />
              <Input value={searchLanguage} setValue={setSearchLanguage} label="Language" id="credit" iconName="short_text" errorMessage={errors?.searchLanguage} />
              <Input value={searchCategory} setValue={setSearchCategory} label="Category" id="credit" iconName="short_text" errorMessage={errors?.searchCategory} />
            </div>
          </div>
          <div onClick={() => getInitialData(true)} className="p-4 text-2xl font-semibold bg-blue-950 hover:bg-blue-800 text-white cursor-pointer">
            <SvgIcon name="tune" /> Submit
          </div>
        </div>
      </Drawer>
    </Section>
  );
}

export default DottormailMyListPage;
