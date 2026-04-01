import { Task } from "@/types";

type TaskCardProps = {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
};

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <article className="rounded-md border border-slate-300 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-semibold">{task.title}</h3>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">{task.status}</span>
      </div>
      <p className="mb-4 text-sm text-slate-600">{task.description ?? "No description yet."}</p>
      <div className="flex gap-2">
        <button
          className="rounded bg-slate-800 px-3 py-1 text-sm text-white"
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
