import { create } from "zustand";
import Api from "@/lib/api";

interface GlobalState {
  logo_url?: string;
  logo_light_url?: string;
  frontend_url?: string;
  backend_url?: string;
  site_name?: string;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  logo_url: process.env.NEXT_PUBLIC_LOGO_URL,
  logo_light_url: process.env.NEXT_PUBLIC_LOGO_LIGHT_URL,
  frontend_url: process.env.NEXT_PUBLIC_FRONTEND_URL,
  backend_url: process.env.NEXT_PUBLIC_BACKEND_URL,
  site_name: process.env.NEXT_PUBLIC_SITE_NAME,

  functionName: () => {
    //
  },
}));
