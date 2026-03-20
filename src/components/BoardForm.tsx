"use client";

import { FormEvent } from "react";

type BoardFormProps = {
  onSubmit?: (payload: { name: string }) => Promise<void> | void;
  isSubmitting?: boolean;
};

export function BoardForm({ onSubmit, isSubmitting = false }: BoardFormProps) {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "");

    await onSubmit?.({ name });
    form.reset();
  }

  return (
    <form className="space-y-3 rounded-md border border-slate-300 bg-white p-4" onSubmit={handleSubmit}>
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="board-name">
          Board name
        </label>
        <input
          className="w-full rounded border border-slate-300 px-3 py-2"
          id="board-name"
          name="name"
          placeholder="Product Roadmap"
          required
          type="text"
        />
      </div>
      <button className="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-60" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Creating..." : "Create Board"}
      </button>
    </form>
  );
}
