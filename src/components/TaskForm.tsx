"use client";

import { FormEvent } from "react";

type TaskFormProps = {
  onSubmit?: (payload: { title: string; description: string }) => void;
  submitLabel?: string;
};

export function TaskForm({ onSubmit, submitLabel = "Save Task" }: TaskFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "");
    const description = String(formData.get("description") ?? "");

    // TODO: Add validation and connect this handler to Supabase insert/update logic.
    onSubmit?.({ title, description });
  }

  return (
    <form className="space-y-3 rounded-md border border-slate-300 bg-white p-4" onSubmit={handleSubmit}>
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="task-title">
          Task title
        </label>
        <input
          className="w-full rounded border border-slate-300 px-3 py-2"
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
          id="task-description"
          name="description"
          placeholder="Add acceptance criteria..."
          rows={3}
        />
      </div>
      <button className="rounded bg-slate-900 px-4 py-2 text-white" type="submit">
        {submitLabel}
      </button>
    </form>
  );
}
