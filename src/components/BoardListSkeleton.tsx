const TITLE_LINE_WIDTHS = ["w-[62%]", "w-[76%]", "w-[54%]"] as const;

export function BoardListSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading boards" className="flex flex-col gap-1">
      {[1, 2, 3].map((key, index) => (
        <div
          className="box-border flex h-[42px] animate-pulse items-center rounded-md border border-slate-200 bg-slate-50/80 px-2 py-1"
          key={key}
        >
          <span
            className={`h-3 max-w-[14rem] rounded bg-slate-300/40 ${TITLE_LINE_WIDTHS[index] ?? TITLE_LINE_WIDTHS[0]}`}
          />
        </div>
      ))}
    </div>
  );
}
