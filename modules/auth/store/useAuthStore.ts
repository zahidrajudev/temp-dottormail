import { create } from "zustand";
import Api from "@/lib/api";

interface AuthState {
  appUser: any;
  appUserEmailVerified: boolean;
  appPermissions: any;
  appAuth: boolean;
  appUserLoading: boolean;
  isRefreshAuthUser: number;
  refreshAuthUser: () => Promise<void>;
  appUserlogout: () => void;
  hasPermission: (permissionName: string) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  appUser: "",
  appPermissions: "",
  appUserEmailVerified: false,
  appAuth: false,
  appUserLoading: true,
  isRefreshAuthUser: 1,

  refreshAuthUser: async () => {
    try {
      const res = await Api.post("v1/auth/user");
      if (res.status === 200 && res.data.status === true) {
        set((state) => ({
          isRefreshAuthUser: state.isRefreshAuthUser + 1,
        }));

        set({
          appUser: res.data?.data,
          appUserEmailVerified: res.data?.data?.is_email_verified,
          appPermissions: res.data?.up, // up means user permissions
          appAuth: true,
          appUserLoading: false,
        });
      }
    } catch (err) {
      set({ appUser: "", appPermissions: "", appAuth: false, appUserLoading: false });
    }
  },

  /**
   * Check if a permission exists in the user's permission list
   * We use get() to access the current state within the store
   */
  hasPermission: (permissionName: string) => {
    const permissions = get().appPermissions;

    // Safety check: ensure permissions is an array before checking
    if (Array.isArray(permissions)) {
      return permissions.includes(permissionName);
    }

    return false;
  },

  appUserlogout: async () => {
    set({ appUserLoading: true });
    const res = await Api.post("v1/auth/logout");

    if (res.status === 200 && res.data.status === true) {
      set((state) => ({
        isRefreshAuthUser: state.isRefreshAuthUser + 1,
      }));

      set({
        appUser: "",
        appUserEmailVerified: false,
        appPermissions: "", // up means user permissions
        appAuth: false,
        appUserLoading: false,
      });
    } else {
      set({ appUserLoading: true });
    }
  },
}));
