const minutesToMs = (minutes: number): number => Math.max(minutes, 0) * 60 * 1000;

const parseMinutes = (value: string | undefined): number | undefined => {
  if (!value) return undefined;
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return undefined;
  }
  return parsed;
};

const defaultStaleMinutes = 5;
const defaultGcMinutes = 30;

export const enableStaticPrefetch = import.meta.env.VITE_ENABLE_STATIC_PREFETCH === "true";

export const queryStaleTime = minutesToMs(
  parseMinutes(import.meta.env.VITE_QUERY_STALE_MINUTES) ?? defaultStaleMinutes,
);

export const queryGcTime = minutesToMs(
  parseMinutes(import.meta.env.VITE_QUERY_GC_MINUTES) ?? defaultGcMinutes,
);

export const queryRefetchOnWindowFocus = import.meta.env.VITE_QUERY_REFETCH_ON_WINDOW_FOCUS === "true";
