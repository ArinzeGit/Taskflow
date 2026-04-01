export function TaskListSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading tasks" className="space-y-3">
      {[1, 2, 3].map((key) => (
        <div
          className="h-28 animate-pulse rounded-md border border-slate-200 bg-slate-100/90"
          key={key}
        />
      ))}
    </div>
  );
}
