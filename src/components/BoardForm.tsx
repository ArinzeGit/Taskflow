"use client";

import { FormEvent } from "react";

type BoardFormProps = {
  onSubmit?: (payload: { name: string }) => void;
};

export function BoardForm({ onSubmit }: BoardFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "");

    // TODO: Create board in Supabase and then revalidate list/state.
    onSubmit?.({ name });
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
      <button className="rounded bg-slate-900 px-4 py-2 text-white" type="submit">
        Create Board
      </button>
    </form>
  );
}
