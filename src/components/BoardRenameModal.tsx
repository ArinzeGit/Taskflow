"use client";

import { Board } from "@/types";
import { FormEvent, useEffect, useState } from "react";

type BoardRenameModalProps = {
  board: Board | null;
  onClose: () => void;
  onSave: (name: string) => Promise<void>;
  isSaving?: boolean;
};

export function BoardRenameModal({ board, onClose, onSave, isSaving = false }: BoardRenameModalProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (board) {
      setName(board.name);
    }
  }, [board]);

  if (!board) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }
    await onSave(trimmed);
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
        <h2 className="mb-4 text-lg font-semibold">Rename board</h2>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="rename-board-name">
              Board name
            </label>
            <input
              className="w-full rounded border border-slate-300 px-3 py-2"
              disabled={isSaving}
              id="rename-board-name"
              onChange={(e) => setName(e.target.value)}
              required
              type="text"
              value={name}
            />
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
