import type { Locale } from "@/i18n/dictionary";

export interface ChecklistItemCopy {
  id: string;
  text: string;
}

export interface ChecklistCopy {
  title: string;
  description: string;
  items: ChecklistItemCopy[];
}

export interface Checklist {
  id: string;
  translations: Record<Locale, ChecklistCopy>;
}

export type ChecklistSummary = Pick<ChecklistCopy, "title" | "description"> & { id: string };
