export interface ChecklistSummary {
  id: string;
  title: string;
  description: string;
  lastCompletedAt?: string;
  reminderMinutes?: number;
  nextDueAt?: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  helperLink?: string;
}

export interface Checklist extends ChecklistSummary {
  items: ChecklistItem[];
}
