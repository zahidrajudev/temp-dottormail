import api from "@/lib/api";
import { checkErrors, getQueryParam } from "@/lib/helper";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import Button from "@/modules/global/elements/button";
import Section from "@/modules/global/elements/section";
import Switch from "@/modules/global/elements/switch";
import Table from "@/modules/global/elements/table";
import Input from "@/modules/global/input/input";
import Select from "@/modules/global/input/select";
import pageTranslation from "@/modules/language/components/PageTranslation";
import { useLanguageStore } from "@/modules/language/store/useLanguageStore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function RolePermissionEditPage() {
  const { hasPermission } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mainData, setMainData] = useState<any[]>([]);

  const [refresh, setRefresh] = useState(0);
  const refreshPage = () => {
    setRefresh((prev) => prev + 1);
  };
  // Input Fields States
  const [name, setName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<any[]>([]);
  const pageName = "role_edit";
  const { appSelectedLocale, appDefaultLocale } = useLanguageStore();
  const { t } = pageTranslation(pageName, appSelectedLocale?.code ?? "en");
  const [isDefault, setIsDefault] = useState(0);

  const [actionID, setActionID] = useState<any>(null);

  const handleUpdate = () => {
    let url = "v1/dashboard/role-permission/update";
    let data = {
      id: actionID,
      name,
      permissions: selectedPermissions,
      is_default: isDefault,
    };

    if (checkErrors({ actionID, name, selectedPermissions }, setErrors, false)) {
      return;
    }

    setLoading(true);

    api
      .post(url, data)
      .then((res) => {
        router.push("/dashboard/role");
        setLoading(false);
        toast.success(res?.data?.message);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err?.response?.data?.message);
        setErrors(err?.response?.data?.errors);
      });
  };

  const getInitialData = async (id: any) => {
    setLoading(true);
    let url = "v1/dashboard/role-permission/edit";
    let data = { id };
    await api
      .post(url, data)
      .then((res) => {
        setLoading(false);
        setMainData(res.data.roles);
        const resData = res.data?.data;
        if (resData) {
          setName(resData?.name ?? "");
          setSelectedPermissions(resData?.permissions ?? []);
          setIsDefault(resData?.is_default);
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err?.response?.data?.message);
      });
  };

  useEffect(() => {
    const id = getQueryParam("id");
    if (!id) {
      toast.error("Error: Valid url not found");
      router.back();
    }
    setActionID(id);
    getInitialData(id);
  }, [refresh]);

  const handlePermissionSelection = (permission: any) => {
    if (selectedPermissions.includes(permission)) {
      setSelectedPermissions((prev) => prev.filter((item: any) => item !== permission));
    } else {
      setSelectedPermissions((prev) => [...prev, permission]);
    }
  };

  const permissionList = [
    {
      name: "Dashboard Permissions",
      permissions: [
        {
          id: "dashboard.view",
          name: "Access Dashboard",
          permission: <Switch value={selectedPermissions.includes("dashboard.view")} onChange={(val) => handlePermissionSelection("dashboard.view")} />,
        },
        {
          id: "dashboard.admin",
          name: "View Admin Dashboard",
          permission: <Switch value={selectedPermissions.includes("dashboard.admin")} onChange={(val) => handlePermissionSelection("dashboard.admin")} />,
        },
        {
          id: "dashboard.user",
          name: "View User Dashboard",
          permission: <Switch value={selectedPermissions.includes("dashboard.user")} onChange={(val) => handlePermissionSelection("dashboard.user")} />,
        },
        {
          id: "dashboard.author",
          name: "View Author Dashboard",
          permission: <Switch value={selectedPermissions.includes("dashboard.author")} onChange={(val) => handlePermissionSelection("dashboard.author")} />,
        },
        {
          id: "dashboard.client",
          name: "View Admin Dashboard",
          permission: <Switch value={selectedPermissions.includes("dashboard.client")} onChange={(val) => handlePermissionSelection("dashboard.client")} />,
        },
        {
          id: "",
          name: <div className="p-4"></div>,
          permission: "",
        },
        {
          id: "",
          name: <div className="p-4"></div>,
          permission: "",
        },
      ],
    },
    {
      name: "Role & Permissions",
      permissions: [
        {
          id: "role.view",
          name: "View only own role list",
          permission: <Switch value={selectedPermissions.includes("role.view")} onChange={(val) => handlePermissionSelection("role.view")} />,
        },
        {
          id: "role.view-all",
          name: "View all role list",
          permission: <Switch value={selectedPermissions.includes("role.view-all")} onChange={(val) => handlePermissionSelection("role.view-all")} />,
        },
        {
          id: "role.create",
          name: "Create new role",
          permission: <Switch value={selectedPermissions.includes("role.create")} onChange={(val) => handlePermissionSelection("role.create")} />,
        },
        {
          id: "role.edit",
          name: "Edit only own roles",
          permission: <Switch value={selectedPermissions.includes("role.edit")} onChange={(val) => handlePermissionSelection("role.edit")} />,
        },
        {
          id: "role.edit-all",
          name: "Edit all existing roles",
          permission: <Switch value={selectedPermissions.includes("role.edit-all")} onChange={(val) => handlePermissionSelection("role.edit-all")} />,
        },
        {
          id: "role.delete",
          name: "Delete only own role",
          permission: <Switch value={selectedPermissions.includes("role.delete")} onChange={(val) => handlePermissionSelection("role.delete")} />,
        },
        {
          id: "role.delete-all",
          name: "Delete all existing roles",
          permission: <Switch value={selectedPermissions.includes("role.delete-all")} onChange={(val) => handlePermissionSelection("role.delete-all")} />,
        },
      ],
    },

    {
      name: "User Permissions",
      permissions: [
        {
          id: "user.view",
          name: "View only own user list",
          permission: <Switch value={selectedPermissions.includes("user.view")} onChange={(val) => handlePermissionSelection("user.view")} />,
        },
        {
          id: "user.view-all",
          name: "View all user list",
          permission: <Switch value={selectedPermissions.includes("user.view-all")} onChange={(val) => handlePermissionSelection("user.view-all")} />,
        },
        {
          id: "user.create",
          name: "Create new user",
          permission: <Switch value={selectedPermissions.includes("user.create")} onChange={(val) => handlePermissionSelection("user.create")} />,
        },
        {
          id: "user.edit",
          name: "Edit only own users",
          permission: <Switch value={selectedPermissions.includes("user.edit")} onChange={(val) => handlePermissionSelection("user.edit")} />,
        },
        {
          id: "user.edit-all",
          name: "Edit all existing users",
          permission: <Switch value={selectedPermissions.includes("user.edit-all")} onChange={(val) => handlePermissionSelection("user.edit-all")} />,
        },
        {
          id: "user.delete",
          name: "Delete only own user",
          permission: <Switch value={selectedPermissions.includes("user.delete")} onChange={(val) => handlePermissionSelection("user.delete")} />,
        },
        {
          id: "user.delete-all",
          name: "Delete all existing user",
          permission: <Switch value={selectedPermissions.includes("user.delete-all")} onChange={(val) => handlePermissionSelection("user.delete-all")} />,
        },
      ],
    },

    {
      name: "Language Permissions",
      permissions: [
        {
          id: "language.view",
          name: "View only own language list",
          permission: <Switch value={selectedPermissions.includes("language.view")} onChange={(val) => handlePermissionSelection("language.view")} />,
        },
        {
          id: "language.view-all",
          name: "View all language list",
          permission: <Switch value={selectedPermissions.includes("language.view-all")} onChange={(val) => handlePermissionSelection("language.view-all")} />,
        },
        {
          id: "language.create",
          name: "Create new language",
          permission: <Switch value={selectedPermissions.includes("language.create")} onChange={(val) => handlePermissionSelection("language.create")} />,
        },
        {
          id: "language.edit",
          name: "Edit only own languages",
          permission: <Switch value={selectedPermissions.includes("language.edit")} onChange={(val) => handlePermissionSelection("language.edit")} />,
        },
        {
          id: "language.edit-all",
          name: "Edit all existing languages",
          permission: <Switch value={selectedPermissions.includes("language.edit-all")} onChange={(val) => handlePermissionSelection("language.edit-all")} />,
        },
        {
          id: "language.delete",
          name: "Delete only own language",
          permission: <Switch value={selectedPermissions.includes("language.delete")} onChange={(val) => handlePermissionSelection("language.delete")} />,
        },
        {
          id: "language.delete-all",
          name: "Delete all existing language",
          permission: <Switch value={selectedPermissions.includes("language.delete-all")} onChange={(val) => handlePermissionSelection("language.delete-all")} />,
        },
      ],
    },

    {
      name: "Currency Permissions",
      permissions: [
        {
          id: "currency.view",
          name: "View only own currency list",
          permission: <Switch value={selectedPermissions.includes("currency.view")} onChange={(val) => handlePermissionSelection("currency.view")} />,
        },
        {
          id: "currency.view-all",
          name: "View all currency list",
          permission: <Switch value={selectedPermissions.includes("currency.view-all")} onChange={(val) => handlePermissionSelection("currency.view-all")} />,
        },
        {
          id: "currency.create",
          name: "Create new currency",
          permission: <Switch value={selectedPermissions.includes("currency.create")} onChange={(val) => handlePermissionSelection("currency.create")} />,
        },
        {
          id: "currency.edit",
          name: "Edit only own currencys",
          permission: <Switch value={selectedPermissions.includes("currency.edit")} onChange={(val) => handlePermissionSelection("currency.edit")} />,
        },
        {
          id: "currency.edit-all",
          name: "Edit all existing currencys",
          permission: <Switch value={selectedPermissions.includes("currency.edit-all")} onChange={(val) => handlePermissionSelection("currency.edit-all")} />,
        },
        {
          id: "currency.delete",
          name: "Delete only own currency",
          permission: <Switch value={selectedPermissions.includes("currency.delete")} onChange={(val) => handlePermissionSelection("currency.delete")} />,
        },
        {
          id: "currency.delete-all",
          name: "Delete all existing currency",
          permission: <Switch value={selectedPermissions.includes("currency.delete-all")} onChange={(val) => handlePermissionSelection("currency.delete-all")} />,
        },
      ],
    },

    {
      name: "Media Folder Permissions",
      permissions: [
        {
          id: "media-directory.view",
          name: "View only own media folder list",
          permission: <Switch value={selectedPermissions.includes("media-directory.view")} onChange={(val) => handlePermissionSelection("media-directory.view")} />,
        },
        {
          id: "media-directory.view-all",
          name: "View all media folder list",
          permission: (
            <Switch value={selectedPermissions.includes("media-directory.view-all")} onChange={(val) => handlePermissionSelection("media-directory.view-all")} />
          ),
        },
        {
          id: "media-directory.create",
          name: "Create new media folder",
          permission: <Switch value={selectedPermissions.includes("media-directory.create")} onChange={(val) => handlePermissionSelection("media-directory.create")} />,
        },
        {
          id: "media-directory.edit",
          name: "Edit only own media folders",
          permission: <Switch value={selectedPermissions.includes("media-directory.edit")} onChange={(val) => handlePermissionSelection("media-directory.edit")} />,
        },
        {
          id: "media-directory.edit-all",
          name: "Edit all existing media folders",
          permission: (
            <Switch value={selectedPermissions.includes("media-directory.edit-all")} onChange={(val) => handlePermissionSelection("media-directory.edit-all")} />
          ),
        },
        {
          id: "media-directory.delete",
          name: "Delete only own media folder",
          permission: <Switch value={selectedPermissions.includes("media-directory.delete")} onChange={(val) => handlePermissionSelection("media-directory.delete")} />,
        },
        {
          id: "media-directory.delete-all",
          name: "Delete all existing media folder",
          permission: (
            <Switch value={selectedPermissions.includes("media-directory.delete-all")} onChange={(val) => handlePermissionSelection("media-directory.delete-all")} />
          ),
        },
      ],
    },

    {
      name: "Media File Permissions",
      permissions: [
        {
          id: "media.view",
          name: "View only own media file list",
          permission: <Switch value={selectedPermissions.includes("media.view")} onChange={(val) => handlePermissionSelection("media.view")} />,
        },
        {
          id: "media.view-all",
          name: "View all media file list",
          permission: <Switch value={selectedPermissions.includes("media.view-all")} onChange={(val) => handlePermissionSelection("media.view-all")} />,
        },
        {
          id: "media.create",
          name: "Upload new media files",
          permission: <Switch value={selectedPermissions.includes("media.create")} onChange={(val) => handlePermissionSelection("media.create")} />,
        },
        {
          id: "media.edit",
          name: "Edit only own media files",
          permission: <Switch value={selectedPermissions.includes("media.edit")} onChange={(val) => handlePermissionSelection("media.edit")} />,
        },
        {
          id: "media.edit-all",
          name: "Edit all existing media files",
          permission: <Switch value={selectedPermissions.includes("media.edit-all")} onChange={(val) => handlePermissionSelection("media.edit-all")} />,
        },
        {
          id: "media.delete",
          name: "Delete only own media file",
          permission: <Switch value={selectedPermissions.includes("media.delete")} onChange={(val) => handlePermissionSelection("media.delete")} />,
        },
        {
          id: "media.delete-all",
          name: "Delete all existing media file",
          permission: <Switch value={selectedPermissions.includes("media.delete-all")} onChange={(val) => handlePermissionSelection("media.delete-all")} />,
        },
      ],
    },

    {
      name: "Package Permissions",
      permissions: [
        {
          id: "package.view",
          name: "View only own package list",
          permission: <Switch value={selectedPermissions.includes("package.view")} onChange={(val) => handlePermissionSelection("package.view")} />,
        },
        {
          id: "package.view-all",
          name: "View all package list",
          permission: <Switch value={selectedPermissions.includes("package.view-all")} onChange={(val) => handlePermissionSelection("package.view-all")} />,
        },
        {
          id: "package.create",
          name: "Add new package",
          permission: <Switch value={selectedPermissions.includes("package.create")} onChange={(val) => handlePermissionSelection("package.create")} />,
        },
        {
          id: "package.edit",
          name: "Edit only own package",
          permission: <Switch value={selectedPermissions.includes("package.edit")} onChange={(val) => handlePermissionSelection("package.edit")} />,
        },
        {
          id: "package.edit-all",
          name: "Edit all existing package",
          permission: <Switch value={selectedPermissions.includes("package.edit-all")} onChange={(val) => handlePermissionSelection("package.edit-all")} />,
        },
        {
          id: "package.delete",
          name: "Delete only own package",
          permission: <Switch value={selectedPermissions.includes("package.delete")} onChange={(val) => handlePermissionSelection("package.delete")} />,
        },
        {
          id: "package.delete-all",
          name: "Delete all existing package",
          permission: <Switch value={selectedPermissions.includes("package.delete-all")} onChange={(val) => handlePermissionSelection("package.delete-all")} />,
        },
      ],
    },

    {
      name: "Tool Permissions",
      permissions: [
        {
          id: "tool.view",
          name: "View only own tool list",
          permission: <Switch value={selectedPermissions.includes("tool.view")} onChange={(val) => handlePermissionSelection("tool.view")} />,
        },
        {
          id: "tool.view-all",
          name: "View all tool list",
          permission: <Switch value={selectedPermissions.includes("tool.view-all")} onChange={(val) => handlePermissionSelection("tool.view-all")} />,
        },
        {
          id: "tool.create",
          name: "Add new tool",
          permission: <Switch value={selectedPermissions.includes("tool.create")} onChange={(val) => handlePermissionSelection("tool.create")} />,
        },
        {
          id: "tool.edit",
          name: "Edit only own tool",
          permission: <Switch value={selectedPermissions.includes("tool.edit")} onChange={(val) => handlePermissionSelection("tool.edit")} />,
        },
        {
          id: "tool.edit-all",
          name: "Edit all existing tool",
          permission: <Switch value={selectedPermissions.includes("tool.edit-all")} onChange={(val) => handlePermissionSelection("tool.edit-all")} />,
        },
        {
          id: "tool.delete",
          name: "Delete only own tool",
          permission: <Switch value={selectedPermissions.includes("tool.delete")} onChange={(val) => handlePermissionSelection("tool.delete")} />,
        },
        {
          id: "tool.delete-all",
          name: "Delete all existing tool",
          permission: <Switch value={selectedPermissions.includes("tool.delete-all")} onChange={(val) => handlePermissionSelection("tool.delete-all")} />,
        },
      ],
    },

    {
      name: "Tool Account Permissions",
      permissions: [
        {
          id: "tool-account.view",
          name: "View only own tool account list",
          permission: <Switch value={selectedPermissions.includes("tool-account.view")} onChange={(val) => handlePermissionSelection("tool-account.view")} />,
        },
        {
          id: "tool-account.view-all",
          name: "View all tool account list",
          permission: <Switch value={selectedPermissions.includes("tool-account.view-all")} onChange={(val) => handlePermissionSelection("tool-account.view-all")} />,
        },
        {
          id: "tool-account.create",
          name: "Add new tool account",
          permission: <Switch value={selectedPermissions.includes("tool-account.create")} onChange={(val) => handlePermissionSelection("tool-account.create")} />,
        },
        {
          id: "tool-account.edit",
          name: "Edit only own tool account",
          permission: <Switch value={selectedPermissions.includes("tool-account.edit")} onChange={(val) => handlePermissionSelection("tool-account.edit")} />,
        },
        {
          id: "tool-account.edit-all",
          name: "Edit all existing tool account",
          permission: <Switch value={selectedPermissions.includes("tool-account.edit-all")} onChange={(val) => handlePermissionSelection("tool-account.edit-all")} />,
        },
        {
          id: "tool-account.delete",
          name: "Delete only own tool account",
          permission: <Switch value={selectedPermissions.includes("tool-account.delete")} onChange={(val) => handlePermissionSelection("tool-account.delete")} />,
        },
        {
          id: "tool-account.delete-all",
          name: "Delete all existing tool account",
          permission: <Switch value={selectedPermissions.includes("tool-account.delete-all")} onChange={(val) => handlePermissionSelection("tool-account.delete-all")} />,
        },
      ],
    },

    {
      name: "Gateway Permissions",
      permissions: [
        {
          id: "gateway.view",
          name: "View only own gateway list",
          permission: <Switch value={selectedPermissions.includes("gateway.view")} onChange={(val) => handlePermissionSelection("gateway.view")} />,
        },
        {
          id: "gateway.view-all",
          name: "View all gateway list",
          permission: <Switch value={selectedPermissions.includes("gateway.view-all")} onChange={(val) => handlePermissionSelection("gateway.view-all")} />,
        },
        {
          id: "gateway.create",
          name: "Add new gateway",
          permission: <Switch value={selectedPermissions.includes("gateway.create")} onChange={(val) => handlePermissionSelection("gateway.create")} />,
        },
        {
          id: "gateway.edit",
          name: "Edit only own gateway",
          permission: <Switch value={selectedPermissions.includes("gateway.edit")} onChange={(val) => handlePermissionSelection("gateway.edit")} />,
        },
        {
          id: "gateway.edit-all",
          name: "Edit all existing gateway",
          permission: <Switch value={selectedPermissions.includes("gateway.edit-all")} onChange={(val) => handlePermissionSelection("gateway.edit-all")} />,
        },
        {
          id: "gateway.delete",
          name: "Delete only own gateway",
          permission: <Switch value={selectedPermissions.includes("gateway.delete")} onChange={(val) => handlePermissionSelection("gateway.delete")} />,
        },
        {
          id: "gateway.delete-all",
          name: "Delete all existing gateway",
          permission: <Switch value={selectedPermissions.includes("gateway.delete-all")} onChange={(val) => handlePermissionSelection("gateway.delete-all")} />,
        },
      ],
    },

    {
      name: "Transaction Permissions",
      permissions: [
        {
          id: "transaction.view",
          name: "View only own transaction list",
          permission: <Switch value={selectedPermissions.includes("transaction.view")} onChange={(val) => handlePermissionSelection("transaction.view")} />,
        },
        {
          id: "transaction.view-all",
          name: "View all transaction list",
          permission: <Switch value={selectedPermissions.includes("transaction.view-all")} onChange={(val) => handlePermissionSelection("transaction.view-all")} />,
        },
        {
          id: "transaction.create",
          name: "Can do transaction",
          permission: <Switch value={selectedPermissions.includes("transaction.create")} onChange={(val) => handlePermissionSelection("transaction.create")} />,
        },
        {
          id: "transaction.edit",
          name: "Edit only own transaction",
          permission: <Switch value={selectedPermissions.includes("transaction.edit")} onChange={(val) => handlePermissionSelection("transaction.edit")} />,
        },
        {
          id: "transaction.edit-all",
          name: "Edit all existing transaction",
          permission: <Switch value={selectedPermissions.includes("transaction.edit-all")} onChange={(val) => handlePermissionSelection("transaction.edit-all")} />,
        },
        {
          id: "transaction.delete",
          name: "Delete only own transaction",
          permission: <Switch value={selectedPermissions.includes("transaction.delete")} onChange={(val) => handlePermissionSelection("transaction.delete")} />,
        },
        {
          id: "transaction.delete-all",
          name: "Delete all existing transaction",
          permission: <Switch value={selectedPermissions.includes("transaction.delete-all")} onChange={(val) => handlePermissionSelection("transaction.delete-all")} />,
        },
      ],
    },

    {
      name: "Subscription Permissions",
      permissions: [
        {
          id: "subscription.view",
          name: "View only own Subscription list",
          permission: <Switch value={selectedPermissions.includes("subscription.view")} onChange={(val) => handlePermissionSelection("subscription.view")} />,
        },
        {
          id: "subscription.view-all",
          name: "View all Subscription list",
          permission: <Switch value={selectedPermissions.includes("subscription.view-all")} onChange={(val) => handlePermissionSelection("subscription.view-all")} />,
        },
        {
          id: "subscription.create",
          name: "Add new Subscription",
          permission: <Switch value={selectedPermissions.includes("subscription.create")} onChange={(val) => handlePermissionSelection("subscription.create")} />,
        },
        {
          id: "subscription.edit",
          name: "Edit only own Subscription",
          permission: <Switch value={selectedPermissions.includes("subscription.edit")} onChange={(val) => handlePermissionSelection("subscription.edit")} />,
        },
        {
          id: "subscription.edit-all",
          name: "Edit all existing Subscription",
          permission: <Switch value={selectedPermissions.includes("subscription.edit-all")} onChange={(val) => handlePermissionSelection("subscription.edit-all")} />,
        },
        {
          id: "subscription.delete",
          name: "Delete only own Subscription",
          permission: <Switch value={selectedPermissions.includes("subscription.delete")} onChange={(val) => handlePermissionSelection("subscription.delete")} />,
        },
        {
          id: "subscription.delete-all",
          name: "Delete all existing Subscription",
          permission: <Switch value={selectedPermissions.includes("subscription.delete-all")} onChange={(val) => handlePermissionSelection("subscription.delete-all")} />,
        },
        {
          id: "subscription.log",
          name: "View & Manage Subscription Logs",
          permission: <Switch value={selectedPermissions.includes("subscription.log")} onChange={(val) => handlePermissionSelection("subscription.log")} />,
        },
      ],
    },

    {
      name: "Payment Card Permissions",
      permissions: [
        {
          id: "card.view",
          name: "View only own payment card list",
          permission: <Switch value={selectedPermissions.includes("card.view")} onChange={(val) => handlePermissionSelection("card.view")} />,
        },
        {
          id: "card.view-all",
          name: "View all payment card list",
          permission: <Switch value={selectedPermissions.includes("card.view-all")} onChange={(val) => handlePermissionSelection("card.view-all")} />,
        },
        {
          id: "card.create",
          name: "Add new payment card",
          permission: <Switch value={selectedPermissions.includes("card.create")} onChange={(val) => handlePermissionSelection("card.create")} />,
        },
        {
          id: "card.edit",
          name: "Edit only own payment card",
          permission: <Switch value={selectedPermissions.includes("card.edit")} onChange={(val) => handlePermissionSelection("card.edit")} />,
        },
        {
          id: "card.edit-all",
          name: "Edit all existing payment card",
          permission: <Switch value={selectedPermissions.includes("card.edit-all")} onChange={(val) => handlePermissionSelection("card.edit-all")} />,
        },
        {
          id: "card.delete",
          name: "Delete only own payment card",
          permission: <Switch value={selectedPermissions.includes("card.delete")} onChange={(val) => handlePermissionSelection("card.delete")} />,
        },
        {
          id: "card.delete-all",
          name: "Delete all existing payment card",
          permission: <Switch value={selectedPermissions.includes("card.delete-all")} onChange={(val) => handlePermissionSelection("card.delete-all")} />,
        },
      ],
    },

    {
      name: "Translation Permissions",
      permissions: [
        {
          id: "translation.view",
          name: "View translation option",
          permission: <Switch value={selectedPermissions.includes("translation.view")} onChange={(val) => handlePermissionSelection("translation.view")} />,
        },
        {
          id: "translation.create",
          name: "Add translation",
          permission: <Switch value={selectedPermissions.includes("translation.create")} onChange={(val) => handlePermissionSelection("translation.create")} />,
        },
        {
          id: "translation.edit",
          name: "Edit translation",
          permission: <Switch value={selectedPermissions.includes("translation.edit")} onChange={(val) => handlePermissionSelection("translation.edit")} />,
        },
        {
          id: "translation.delete",
          name: "Delete only own translation",
          permission: <Switch value={selectedPermissions.includes("translation.delete")} onChange={(val) => handlePermissionSelection("translation.delete")} />,
        },
        {
          id: "",
          name: <div className="p-5"></div>,
          permission: "",
        },
        {
          id: "",
          name: <div className="p-5"></div>,
          permission: "",
        },
        {
          id: "",
          name: <div className="p-5"></div>,
          permission: "",
        },
      ],
    },

    {
      name: "Email List Permissions",
      permissions: [
        {
          id: "email-list.view",
          name: "View only own list",
          permission: <Switch value={selectedPermissions.includes("email-list.view")} onChange={(val) => handlePermissionSelection("email-list.view")} />,
        },
        {
          id: "email-list.view-all",
          name: "View all list",
          permission: <Switch value={selectedPermissions.includes("email-list.view-all")} onChange={(val) => handlePermissionSelection("email-list.view-all")} />,
        },
        {
          id: "email-list.create",
          name: "Upload/create list",
          permission: <Switch value={selectedPermissions.includes("email-list.create")} onChange={(val) => handlePermissionSelection("email-list.create")} />,
        },
        {
          id: "email-list.edit",
          name: "Edit only own list",
          permission: <Switch value={selectedPermissions.includes("email-list.edit")} onChange={(val) => handlePermissionSelection("email-list.edit")} />,
        },
        {
          id: "email-list.edit-all",
          name: "Edit all list",
          permission: <Switch value={selectedPermissions.includes("email-list.edit-all")} onChange={(val) => handlePermissionSelection("email-list.edit-all")} />,
        },
        {
          id: "email-list.delete",
          name: "Delete only own list",
          permission: <Switch value={selectedPermissions.includes("email-list.delete")} onChange={(val) => handlePermissionSelection("email-list.delete")} />,
        },
        {
          id: "email-list.delete-all",
          name: "Delete all list",
          permission: <Switch value={selectedPermissions.includes("email-list.delete-all")} onChange={(val) => handlePermissionSelection("email-list.delete-all")} />,
        },
        {
          id: "email-list.verify",
          name: "Verify only own List",
          permission: <Switch value={selectedPermissions.includes("email-list.verify")} onChange={(val) => handlePermissionSelection("email-list.verify")} />,
        },
        {
          id: "email-list.verify-all",
          name: "Verify all List",
          permission: <Switch value={selectedPermissions.includes("email-list.verify-all")} onChange={(val) => handlePermissionSelection("email-list.verify-all")} />,
        },
        {
          id: "email-list.download",
          name: "Download only own List",
          permission: <Switch value={selectedPermissions.includes("email-list.download")} onChange={(val) => handlePermissionSelection("email-list.download")} />,
        },
        {
          id: "email-list.download-all",
          name: "Download all List",
          permission: <Switch value={selectedPermissions.includes("email-list.download-all")} onChange={(val) => handlePermissionSelection("email-list.download-all")} />,
        },
      ],
    },
  ];

  return (
    <Section permission={hasPermission("role.edit")} loading={loading} className="bg-white p-8 border border-gray-200 rounded-lg space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input value={name} setValue={setName} label={t("name")} id="name" iconName="person" errorMessage={errors?.name} required placeholder={t("enter_full_name")} />
        <Select
          items={[
            { name: "Yes", id: 1 },
            { name: "No", id: 0 },
          ]}
          value={isDefault}
          setValue={setIsDefault}
          label="Is Default Role?"
          id="DefaultValuerole"
          errorMessage={errors?.is_default}
          required
          placeholder="Select an Option"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {permissionList.map((itm, index) => (
          <div key={index} className="rounded-lg border border-violet-200 hover:shadow-sm">
            <div className="px-3 py-3 ">
              <h3 className="text-lg font-semibold">{itm?.name}</h3>
            </div>
            <div className="space-y-6">
              <Table
                data={itm?.permissions}
                showHeading={false}
                loading={false}
                showMark={false}
                excludeKeys={["id"]}
                showDelete={hasPermission("user.delete")}
                className=""
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-end">
        <Button onClick={handleUpdate} showIcon>
          Update Now
        </Button>
      </div>
    </Section>
  );
}

export default RolePermissionEditPage;
