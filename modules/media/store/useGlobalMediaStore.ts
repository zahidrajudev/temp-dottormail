import { create } from "zustand";

interface MediaSelection {
  id?: string | number;
  path: string;
  type: number | any;
  alt?: string;
}

interface GlobalState {
  // Media Gallery States
  appMediaShow: boolean;
  appMediaItems: MediaSelection[];
  appMediaMaxSelect: number | any;
  appMediaSelectOnly: number[] | any; // [1, 2] for Images and Videos only
  globalRefreshNumber: number;

  activeCallerId: string | null; // <--- Add this

  // Actions
  setAppMediaShow: (show: boolean) => void;
  setAppMediaItems: (items: MediaSelection[] | any) => void;
  openMediaGallery: (config?: { id: any; max?: number; types?: number[]; items?: MediaSelection[] }) => void;
  closeMediaGallery: () => void;
  refreshGlobalMedia: () => void;
}

export const useGlobalMediaStore = create<GlobalState>((set) => ({
  appMediaShow: false,
  appMediaItems: [],
  appMediaMaxSelect: 0,
  appMediaSelectOnly: [],
  globalRefreshNumber: 0,

  activeCallerId: null,

  setAppMediaShow: (show) => set({ appMediaShow: show }),

  setAppMediaItems: (items) => set({ appMediaItems: items }),

  openMediaGallery: (config) =>
    set({
      appMediaShow: true,
      activeCallerId: config?.id || "default", // Set the ID
      appMediaMaxSelect: config?.max || 0,
      appMediaSelectOnly: config?.types || [],
      appMediaItems: config?.items ?? [],
    }),

  closeMediaGallery: () => set({ appMediaShow: false }),
  refreshGlobalMedia: () =>
    set((state) => ({
      globalRefreshNumber: state.globalRefreshNumber + 1,
    })),
}));
