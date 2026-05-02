import { TaskListSkeleton } from "./TaskListSkeleton";

/** Shown while boards are loading so the task column matches the loaded layout (title + add task + task cards). */
export function TasksMainSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading board and tasks">
      <div className="mb-6 h-[28px] max-w-[min(10rem,36%)] animate-pulse rounded-md bg-blue-200/40" />

      <div className="mb-4 flex h-[42px] w-full items-center rounded-md border border-slate-300 bg-white px-4 text-left text-sm text-slate-500">
        + Add a task...
      </div>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-lg font-semibold text-slate-900">Tasks</h2>
        </div>
        <TaskListSkeleton />
      </section>
    </div>
  );
}
