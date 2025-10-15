import { useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { VirtualItem } from "@tanstack/react-virtual";
import clsx from "clsx";
import { checklists } from "@/assets/data/checklists";
import { Badge } from "@/components/ui/Badge";

const ChecklistsPage = () => {
  const navigate = useNavigate();
  const parentRef = useRef<HTMLDivElement | null>(null);
  const data = useMemo(() => checklists, []);
  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 128,
    overscan: 4,
  });
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-skin-text">Чек-листи</h1>
        <p className="text-sm text-skin-muted">Підтримуйте стандарти сервісу разом із контрольними списками.</p>
      </div>
      <div
        ref={parentRef}
        className="max-h-[70vh] overflow-y-auto rounded-2xl border border-skin-ring/40 bg-skin-base/80 shadow-inner"
      >
        <div style={{ height: `${rowVirtualizer.getTotalSize()}px` }} className="relative">
          {rowVirtualizer.getVirtualItems().map((virtualRow: VirtualItem) => {
            const checklist = data[virtualRow.index];
            const top = 0;
            return (
              <div
                key={checklist.id}
                className="absolute left-0 right-0 px-4 py-3"
                style={{ transform: `translateY(${virtualRow.start + top}px)` }}
              >
                <button
                  type="button"
                  onClick={() => navigate(`/checklists/${checklist.id}`)}
                  className={clsx(
                    "flex w-full flex-col gap-2 rounded-2xl border border-skin-ring/50 bg-skin-base/90 p-4 text-left shadow-md transition",
                    "hover:border-skin-primary",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-skin-text">{checklist.title}</div>
                    {checklist.nextDueAt ? (
                      <Badge variant="outline">
                        до {new Date(checklist.nextDueAt).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}
                      </Badge>
                    ) : null}
                  </div>
                  <div className="text-xs text-skin-muted">{checklist.description}</div>
                  <div className="flex flex-wrap gap-2 text-[11px] text-skin-muted/80">
                    {checklist.lastCompletedAt ? (
                      <span>
                        Востаннє: {new Date(checklist.lastCompletedAt).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    ) : null}
                    {typeof checklist.reminderMinutes === "number" ? (
                      <span>Нагадування кожні {Math.round(checklist.reminderMinutes / 60)} год</span>
                    ) : null}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChecklistsPage;
