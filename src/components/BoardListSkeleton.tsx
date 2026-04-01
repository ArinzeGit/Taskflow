export function BoardListSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading boards" className="space-y-2">
      {[1, 2, 3].map((key) => (
        <div
          className="h-[4.25rem] animate-pulse rounded-md border border-slate-200 bg-slate-100/90"
          key={key}
        />
      ))}
    </div>
  );
}
