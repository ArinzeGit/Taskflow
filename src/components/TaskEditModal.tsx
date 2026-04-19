"use client";

import { Task } from "@/types";
import { FormEvent, useEffect, useState } from "react";

type TaskEditModalProps = {
  task: Task | null;
  onClose: () => void;
  onSave: (payload: {
    id: string;
    title: string;
    description: string;
    status: Task["status"];
  }) => Promise<void>;
  isSaving?: boolean;
};

export function TaskEditModal({ task, onClose, onSave, isSaving = false }: TaskEditModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Task["status"]>("todo");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? "");
      setStatus(task.status);
    }
  }, [task]);

  if (!task) {
    return null;
  }

  const activeTask = task;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }
    await onSave({
      id: activeTask.id,
      title: trimmedTitle,
      description: description.trim(),
      status
    });
  }

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="dialog"
    >
      <div
        className="w-full max-w-md rounded-lg border border-slate-300 bg-white p-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-lg font-semibold">Edit task</h2>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="edit-task-title">
              Title
            </label>
            <input
              className="w-full rounded border border-slate-300 px-3 py-2"
              disabled={isSaving}
              id="edit-task-title"
              onChange={(e) => setTitle(e.target.value)}
              required
              type="text"
              value={title}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="edit-task-description">
              Description
            </label>
            <textarea
              className="w-full rounded border border-slate-300 px-3 py-2"
              disabled={isSaving}
              id="edit-task-description"
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              value={description}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="edit-task-status">
              Status
            </label>
            <select
              className="w-full rounded border border-slate-300 px-3 py-2"
              disabled={isSaving}
              id="edit-task-status"
              onChange={(e) => setStatus(e.target.value as Task["status"])}
              value={status}
            >
              <option value="todo">To do</option>
              <option value="in_progress">In progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              className="rounded border border-slate-300 px-4 py-2 text-sm"
              disabled={isSaving}
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="rounded bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-60"
              disabled={isSaving}
              type="submit"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
