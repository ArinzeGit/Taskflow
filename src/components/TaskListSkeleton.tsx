const TITLE_LINE_WIDTHS = ["w-[72%]", "w-[64%]", "w-[80%]"] as const;

export function TaskListSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading tasks" className="grid max-w-3xl gap-3">
      {[1, 2, 3].map((key, index) => (
        <div
          className="box-border flex h-[130.75px] animate-pulse flex-col overflow-hidden rounded-md border border-slate-200 bg-slate-50 p-3.5 shadow-sm"
          key={key}
        >
          <div className="mb-2 flex shrink-0 items-start justify-between gap-3">
            <span
              className={`h-4 max-w-sm rounded bg-slate-300/40 ${TITLE_LINE_WIDTHS[index] ?? TITLE_LINE_WIDTHS[0]}`}
            />
            <span className="h-6 w-[4.25rem] shrink-0 rounded-full bg-slate-200/55" />
          </div>
          <div className="mb-2 shrink-0 space-y-2">
            <span className="block h-3 w-full rounded bg-slate-200/50" />
            <span className="block h-3 w-[88%] rounded bg-slate-200/50" />
          </div>
        </div>
      ))}
    </div>
  );
}
