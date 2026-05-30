import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/api";
import { setCookie, getCookie } from "cookies-next";

interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Added conversion rate from your DB
  default?: number; // 1 = default
}

interface CurrencyState {
  appCurrencies: Currency[];
  appSelectedCurrency: Currency | null;
  appCurrencyLoading: boolean;
  appDefaultCurrency: Currency | null;
  // Actions
  fetchCurrencies: () => Promise<void>;
  changeCurrency: (code: string) => void;
  formatPrice: (amount: number | undefined) => string | undefined;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      appCurrencies: [],
      appSelectedCurrency: null,
      appCurrencyLoading: false,
      appDefaultCurrency: null,

      fetchCurrencies: async () => {
        set({ appCurrencyLoading: true });
        try {
          const res = await api.get("v1/currencies");
          const currencies = res.data.data;

          // Logic: Check Cookie first, then Default, then First item
          const savedCode = getCookie("currency");
          const defaultCurr = currencies.find((c: Currency) => c.code === savedCode) || currencies.find((c: Currency) => c.default) || currencies[0];

          if (Array.isArray(currencies)) {
            const defaultCurr = currencies.find((l: Currency) => l.default === 1) || currencies[0];
            set({ appDefaultCurrency: defaultCurr });
          }

          set({
            appCurrencies: currencies,
            appSelectedCurrency: defaultCurr,
            appCurrencyLoading: false,
          });
        } catch (error) {
          set({ appCurrencyLoading: false });
        }
      },

      changeCurrency: (code: string) => {
        const selected = get().appCurrencies.find((c) => c.code === code);
        if (selected) {
          set({ appSelectedCurrency: selected });
          setCookie("currency", selected.code);
        }
      },

      formatPrice: (amount: number | undefined) => {
        const selected = get().appSelectedCurrency;

        if (amount == undefined || !amount) {
          return selected?.symbol;
        }

        // 1. Fallback if no currency is loaded yet
        if (!selected) return amount.toString();

        // 2. Perform the Calculation
        // Multiply Base Price (USD) * Selected Rate (BDT/EUR/etc)
        const convertedAmount = amount * selected.rate;

        // 3. Format with Dynamic Decimals
        // If it's a whole number, 0 decimals. If it has cents, up to 2 decimals.
        const formattedValue = new Intl.NumberFormat(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(convertedAmount);

        // 4. Return Symbol + Formatted Number
        return `${selected.symbol} ${formattedValue}`;
      },
    }),
    {
      name: "app-currency-store",
      partialize: (state) => ({ appSelectedCurrency: state.appSelectedCurrency }),
    },
  ),
);
