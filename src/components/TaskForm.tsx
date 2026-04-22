"use client";

import { FormEvent } from "react";

type TaskFormProps = {
  onSubmit?: (payload: { title: string; description: string }) => Promise<void> | void;
  submitLabel?: string;
  isSubmitting?: boolean;
  disabled?: boolean;
};

export function TaskForm({ onSubmit, submitLabel = "Save Task", isSubmitting = false, disabled = false }: TaskFormProps) {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = String(formData.get("title") ?? "");
    const description = String(formData.get("description") ?? "");

    await onSubmit?.({ title, description });
    form.reset();
  }

  return (
    <form className="space-y-3 rounded-md border border-slate-300 bg-white p-4" onSubmit={handleSubmit}>
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="task-title">
          Task title
        </label>
        <input
          className="w-full rounded border border-slate-300 px-3 py-2"
          disabled={disabled}
          id="task-title"
          name="title"
          placeholder="Write docs"
          required
          type="text"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="task-description">
          Description
        </label>
        <textarea
          className="w-full rounded border border-slate-300 px-3 py-2"
          disabled={disabled}
          id="task-description"
          name="description"
          placeholder="Add acceptance criteria..."
          rows={3}
        />
      </div>
      <button
        className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-400 active:bg-blue-600 disabled:opacity-60"
        disabled={isSubmitting || disabled}
        type="submit"
      >
        {submitLabel}
      </button>
    </form>
  );
}
