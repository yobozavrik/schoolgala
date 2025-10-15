export interface ChecklistSummary {
  id: string;
  title: string;
  description: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
}

export interface Checklist extends ChecklistSummary {
  items: ChecklistItem[];
}
