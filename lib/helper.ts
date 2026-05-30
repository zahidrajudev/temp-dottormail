import { toast } from "sonner";

type PermissionScope = Record<string, 0 | 1 | undefined>;

export const checkPermission = (permissions: Record<string, PermissionScope>, scope: keyof typeof permissions, type: string): 0 | 1 | undefined => {
  return permissions?.[scope]?.[type] === 1 ? 1 : 0;
};

type ErrorBag = Record<string, string>;
export const checkErrors = (fields: Record<string, unknown>, setErrors?: (errors: ErrorBag) => void, notify = false): boolean => {
  const _errors: ErrorBag = {};
  let hasError = false;

  Object.entries(fields).forEach(([key, value]) => {
    const label = key.charAt(0).toUpperCase() + key.slice(1);
    const isEmptyString = typeof value === "string" && value.trim().length === 0;
    const isEmptyNumber = typeof value === "number" && value.toString().trim().length === 0;
    if (value === undefined || value === null || isEmptyString || isEmptyNumber) {
      hasError = true;
      _errors[key] = `This field is required`;
      // _errors[key] = `${label} field is required`;
    } else if (Array.isArray(value) && value.length === 0) {
      hasError = true;
      _errors[key] = `${label} cannot be empty`;
    } else if (typeof value === "object" && Object.keys(value).length === 0) {
      hasError = true;
      _errors[key] = `${label} cannot be empty`;
    }
  });

  /* only call the setter if it was provided */
  setErrors?.(_errors);

  if (hasError && notify) toast.info("Something is wrong on your input fields");
  return hasError;
};

export const isValueSet = (value: string | number | (string | number)[] | null | undefined): boolean => {
  // null / undefined
  if (value == null) return false;

  // array
  if (Array.isArray(value)) return value.length > 0;

  // string
  if (typeof value === "string") return value.trim() !== "";

  // number (0 is fine, NaN is not)
  if (typeof value === "number") return !Number.isNaN(value);

  return false; // fallback, should never be hit with current union
};

export const copyToClipboard = (text: string) => {
  if (typeof navigator !== "undefined") {
    navigator.clipboard.writeText(text);
    toast.success("Copied to your clipboard");
  }
};

export const removeWhiteSpace = (...args: Array<string | undefined | null | false>) => {
  return args
    .filter((val): val is string => typeof val === "string" && val.trim().length > 0)
    .map((str) => str.trim())
    .join(" ");
};

// Start date time advance customizable format function
const monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthNamesLong = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekdayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const weekdayNamesLong = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const formatTokens = {
  day: (date: Date) => date.getDate().toString().padStart(2, "0"),
  month: (date: Date) => (date.getMonth() + 1).toString().padStart(2, "0"),
  year: (date: Date) => date.getFullYear().toString(),
  hour: (date: Date) => (date.getHours() % 12 || 12).toString().padStart(2, "0"), // 12-hour
  hour24: (date: Date) => date.getHours().toString().padStart(2, "0"), // 24-hour
  minute: (date: Date) => date.getMinutes().toString().padStart(2, "0"),
  second: (date: Date) => date.getSeconds().toString().padStart(2, "0"),
  ampm: (date: Date) => (date.getHours() >= 12 ? "PM" : "AM"),

  // Extra tokens
  monthShort: (date: Date) => monthNamesShort[date.getMonth()],
  monthLong: (date: Date) => monthNamesLong[date.getMonth()],
  weekdayShort: (date: Date) => weekdayNamesShort[date.getDay()],
  weekdayLong: (date: Date) => weekdayNamesLong[date.getDay()],
};

export const dateTimeFormat = (
  dateInput: string | Date,
  format: string, // e.g. "weekdayShort, monthLong day, year hour:minute ampm"
): string | null => {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return null;

  return format.replace(/\b(day|month|monthShort|monthLong|year|hour|hour24|minute|second|ampm|weekdayShort|weekdayLong)\b/g, (token) => {
    const formatter = formatTokens[token as keyof typeof formatTokens];
    return formatter ? formatter(date) : token;
  });
};

// end date time advance customizable format function

export function dateTimeDifference(firstDate: Date | string, secondDate: Date | string): string {
  const date1 = new Date(firstDate);
  const date2 = new Date(secondDate);
  const diffMs = Math.abs(date1.getTime() - date2.getTime());

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days >= 1) return `${days} Days`;
  if (hours >= 1) return `${hours} Hours`;
  if (minutes >= 1) return `${minutes} Months`;
  return `${seconds} Seconds`;
}

// urlValidator.ts
export interface UrlValidationOptions {
  allowedProtocols?: string[]; // default ['http:', 'https:']
  allowLocal?: boolean; // default false
  allowedHosts?: string[]; // optional allow-list
  blockedHosts?: string[]; // optional deny-list
  requirePath?: boolean; // pathname must not be "/" if true
  checkReachability?: boolean; // send HEAD request if true
  fetchOptions?: RequestInit; // optional fetch settings
  timeoutMs?: number; // network timeout (ms)
}

export interface UrlValidationResult {
  valid: boolean;
  reachable?: boolean;
  status?: number;
  reason?: string;
}

export const isValidUrl = async (raw: string, opts: UrlValidationOptions = {}): Promise<boolean | UrlValidationResult> => {
  const {
    allowedProtocols = ["http:", "https:"],
    allowLocal = false,
    allowedHosts,
    blockedHosts,
    requirePath = false,
    checkReachability = false,
    fetchOptions = { method: "HEAD" },
    timeoutMs = 5000,
  } = opts;

  /* ---------- basic input ---------- */
  if (!raw || typeof raw !== "string") {
    return checkReachability ? { valid: false, reachable: false } : false;
  }

  /* ---------- parse ---------- */
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return checkReachability ? { valid: false, reachable: false } : false;
  }

  /* ---------- rule checks ---------- */
  const protocolOk = allowedProtocols.includes(url.protocol);

  const hostAllowed = !allowedHosts || allowedHosts.includes(url.hostname);
  const hostBlocked = blockedHosts?.includes(url.hostname) ?? false;

  // make sure we always end up with a boolean
  const hasPath = url.pathname !== "/" && url.pathname !== "";
  const pathOk = requirePath ? hasPath : true;

  const localHostPatterns: (string | RegExp)[] = ["localhost", "127.0.0.1", "0.0.0.0", "::1", /^192\.168\./, /^10\./, /^172\.(1[6-9]|2\d|3[0-1])\./];

  const isLocal = localHostPatterns.some((p) => (typeof p === "string" ? url.hostname === p : p.test(url.hostname)));

  // !! casts the whole expression to a strict boolean
  const valid = !!(protocolOk && hostAllowed && !hostBlocked && pathOk && (allowLocal || !isLocal));

  /* ---------- quick return if no reachability check ---------- */
  if (!checkReachability || !valid) {
    return checkReachability ? { valid, reachable: false } : valid;
  }

  /* ---------- optional network check ---------- */
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url.toString(), {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(timer);
    return { valid, reachable: true, status: res.status };
  } catch (err) {
    clearTimeout(timer);
    return {
      valid,
      reachable: false,
      reason: (err as Error).message,
    };
  }
};

type Unit = "B" | "KB" | "MB" | "GB" | "TB" | "PB";

/**
 * Convert an arbitrary file-size value to a friendly string
 * (e.g. "1.25 MB", "512 KB", …).
 *
 * @param value       Numeric part of the size
 * @param inputUnit   Unit the value is expressed in (default "B")
 * @param precision   Decimal places in the result (default 2)
 * @returns           Human-readable size string
 */
export const formatSize = (value: number, inputUnit: Unit = "B", precision = 2): string => {
  if (!value) return "0 Bytes";

  // Map each unit to its multiplier in bytes
  const FACTOR: Record<Unit, number> = {
    B: 1,
    KB: 1024,
    MB: 1024 ** 2,
    GB: 1024 ** 3,
    TB: 1024 ** 4,
    PB: 1024 ** 5,
  };

  // Always normalise to bytes first
  const bytes = value * FACTOR[inputUnit];

  // Choose the best unit for display
  const k = 1024;
  const UNITS: Unit[] = ["B", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  const sized = bytes / k ** i;
  return `${parseFloat(sized.toFixed(precision))} ${UNITS[i]}`;
};

export function formatNumber(value: number | string): string {
  const number = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(number)) return "0";

  // Convert to integer if decimal part is .00
  const formatted = number % 1 === 0 ? number.toLocaleString("en-US", { maximumFractionDigits: 0 }) : number.toLocaleString("en-US");

  return formatted;
}

export function convertToNumber(value: number | string, afterDecimalPoints = 2): number {
  const number = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(number)) return 0;

  const factor = Math.pow(10, afterDecimalPoints);
  return Math.round(number * factor) / factor; // ✅ rounds to nearest cent/paisa
}

export const getQueryParam = (key: string): string | null => {
  if (typeof window === "undefined") return null;

  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key);
};

export function normalizeArrayObjects<T extends Record<string, any>>(array: T[]): T[] {
  if (!Array.isArray(array)) return [];

  return array.map((obj) => {
    const newObj: Record<string, any> = {};

    Object.keys(obj).forEach((key) => {
      const newKey = key.toLowerCase().replace(/\s+/g, "_");
      newObj[newKey] = obj[key];
    });

    return newObj as T;
  });
}

export const sanitizeString = (value: any, max = 500): string => {
  if (!value && value !== 0) return "";
  if (typeof value !== "string") value = String(value);

  // 1. Remove newlines and stray braces, trim
  let s = value
    .replace(/[\r\n]+/g, " ")
    .replace(/[}]+/g, " ")
    .trim();

  // 2. Collapse multiple whitespace to single space
  s = s.replace(/\s+/g, " ");

  // 3. Count quotes
  const quoteCount = (s.match(/"/g) || []).length;
  const startsWithQuote = s.startsWith('"');
  const endsWithQuote = s.endsWith('"');

  // 4. Fix surrounding/mismatched quotes
  if (startsWithQuote && endsWithQuote && quoteCount >= 2) {
    // well-formed surrounding quotes -> strip outer quotes
    s = s.slice(1, -1).trim();
  } else if (startsWithQuote && !endsWithQuote) {
    // leading quote with no closing -> remove leading
    s = s.slice(1).trim();
  } else if (!startsWithQuote && endsWithQuote) {
    `  `;
    // trailing quote only -> remove trailing
    s = s.slice(0, -1).trim();
  } else if (quoteCount % 2 !== 0) {
    // odd number of quotes (unpaired) -> remove all quote chars
    s = s.replace(/"+/g, "").trim();
  }

  // 5. Final trim and truncate to max
  s = s.trim();
  if (typeof max === "number" && s.length > max) s = s.slice(0, max);

  return s;
};

export function isFutureDate(dateString: string): boolean {
  const inputDate = new Date(dateString);

  // Invalid date check
  if (isNaN(inputDate.getTime())) {
    return false;
  }

  // Normalize input date to 00:00:00
  inputDate.setHours(0, 0, 0, 0);

  // Today's date at 00:00:00
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return inputDate > today;
}

export function isFutureDateAndTime(dateTimeString: string): boolean {
  const inputDateTime = new Date(dateTimeString);

  // Invalid datetime check
  if (isNaN(inputDateTime.getTime())) {
    return false;
  }

  const now = new Date();

  // Compare full datetime
  return inputDateTime > now;
}
