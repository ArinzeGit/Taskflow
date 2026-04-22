"use client";

import { FormEvent } from "react";

type BoardFormProps = {
  onSubmit?: (payload: { name: string }) => Promise<void> | void;
  isSubmitting?: boolean;
  disabled?: boolean;
};

export function BoardForm({ onSubmit, isSubmitting = false, disabled = false }: BoardFormProps) {
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
          disabled={disabled}
          id="board-name"
          name="name"
          placeholder="Product Roadmap"
          required
          type="text"
        />
      </div>
      <button
        className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-400 active:bg-blue-600 disabled:opacity-60"
        disabled={isSubmitting || disabled}
        type="submit"
      >
        {isSubmitting ? "Creating..." : "Create Board"}
      </button>
    </form>
  );
}
