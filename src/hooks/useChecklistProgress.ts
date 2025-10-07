import { useEffect, useState } from "react";

const STORAGE_KEY = "ip_checklist_progress";

type ChecklistProgress = Record<string, string[]>;

export const useChecklistProgress = (checklistId: string) => {
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as ChecklistProgress;
      setCompletedIds(parsed[checklistId] ?? []);
    } catch {
      setCompletedIds([]);
    }
  }, [checklistId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as ChecklistProgress) : {};
    parsed[checklistId] = completedIds;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  }, [checklistId, completedIds]);

  const toggle = (itemId: string) => {
    setCompletedIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId],
    );
  };

  const reset = () => setCompletedIds([]);

  return { completedIds, toggle, reset };
};
