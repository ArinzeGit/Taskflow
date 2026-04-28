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
    todo: "bg-blue-100 text-blue-900 border border-blue-200",
    in_progress: "bg-amber-100 text-amber-900 border border-amber-200",
    done: "bg-emerald-100 text-emerald-900 border border-emerald-200"
  };

  return (
    <article className="group rounded-md border border-slate-300 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold leading-snug text-slate-900">{task.title}</h3>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${statusClassMap[task.status]}`}>
          {statusLabelMap[task.status]}
        </span>
      </div>
      <p className="mb-4 text-sm leading-relaxed text-slate-600">
        {task.description?.trim() ? task.description : "No description yet."}
      </p>
      <div className="flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        <button
          className="rounded bg-blue-500 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-400 active:bg-blue-600"
          onClick={() => onEdit?.(task)}
          type="button"
        >
          Edit
        </button>
        <button
          className="rounded bg-rose-600 px-3 py-1 text-sm text-white"
          onClick={() => onDelete?.(task.id)}
          type="button"
        >
          Delete
        </button>
      </div>
    </article>
  );
}
