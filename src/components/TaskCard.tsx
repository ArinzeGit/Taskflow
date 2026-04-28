import { Task } from "@/types";

type TaskCardProps = {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
};

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const statusLabelMap: Record<Task["status"], string> = {
    todo: "To do",
    in_progress: "In progress",
    done: "Done"
  };

  const statusClassMap: Record<Task["status"], string> = {
    todo: "bg-blue-50 text-blue-800 border border-blue-100",
    in_progress: "bg-amber-50 text-amber-800 border border-amber-100",
    done: "bg-emerald-50 text-emerald-800 border border-emerald-100"
  };

  return (
    <article className="group rounded-md border border-slate-300 bg-white p-3.5 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold leading-snug text-slate-900">{task.title}</h3>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${statusClassMap[task.status]}`}>
          {statusLabelMap[task.status]}
        </span>
      </div>
      <p className="mb-3 text-sm leading-relaxed text-slate-600">
        {task.description?.trim() ? task.description : "No description yet."}
      </p>
      <div className="flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        <button
          className="rounded px-2 py-1 text-sm font-medium text-blue-800 transition-colors hover:bg-blue-50 hover:text-blue-900"
          onClick={() => onEdit?.(task)}
          type="button"
        >
          Edit
        </button>
        <button
          aria-label={`Delete task ${task.title}`}
          className="rounded p-1.5 text-rose-700 transition-colors hover:bg-rose-50 hover:text-rose-800"
          onClick={() => onDelete?.(task.id)}
          type="button"
        >
          <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
            <path
              d="M4 7h16M10 11v6m4-6v6M6 7l1 12h10l1-12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
          </svg>
        </button>
      </div>
    </article>
  );
}
