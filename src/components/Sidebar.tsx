"use client";

import { Board } from "@/types";
import { useEffect, useRef, useState } from "react";
import { BoardCard } from "./BoardCard";
import { BoardForm } from "./BoardForm";
import { BoardListSkeleton } from "./BoardListSkeleton";
import { EmptyState } from "./EmptyState";

type SidebarProps = {
  boards: Board[];
  selectedBoardId?: string;
  onCreateBoard?: (payload: { name: string }) => Promise<void> | void;
  onSelectBoard?: (boardId: string) => void;
  onRenameBoard?: (boardId: string) => void;
  onDeleteBoard?: (boardId: string) => void;
  onRetryLoadBoards?: () => void;
  isCreatingBoard?: boolean;
  isLoadingBoards?: boolean;
  /** When set, suppresses empty state; list area stays minimal (details + retry live in main column). */
  boardsLoadError?: string | null;
};

export function Sidebar({
  boards,
  selectedBoardId,
  onCreateBoard,
  onSelectBoard,
  onRenameBoard,
  onDeleteBoard,
  onRetryLoadBoards,
  isCreatingBoard = false,
  isLoadingBoards = false,
  boardsLoadError = null
}: SidebarProps) {
  const [isBoardComposerOpen, setIsBoardComposerOpen] = useState(false);
  const previousBoardCountRef = useRef(boards.length);
  const showBoardsEmpty = !isLoadingBoards && boards.length === 0 && !boardsLoadError;

  useEffect(() => {
    if (boards.length > previousBoardCountRef.current) {
      setIsBoardComposerOpen(false);
    }
    previousBoardCountRef.current = boards.length;
  }, [boards.length]);

  function renderBoardList() {
    if (boardsLoadError) {
      return (
        <div className="rounded border border-rose-100 bg-rose-50/80 px-3 py-2 text-xs text-rose-800">
          <p className="mb-2">Boards could not be loaded.</p>
          {onRetryLoadBoards ? (
            <button
              className="w-full rounded border border-rose-200 bg-white px-2 py-1.5 text-xs font-medium text-rose-900 hover:bg-rose-100"
              onClick={() => onRetryLoadBoards()}
              type="button"
            >
              Try again
            </button>
          ) : null}
        </div>
      );
    }
    if (isLoadingBoards) {
      return <BoardListSkeleton />;
    }
    if (showBoardsEmpty) {
      return (
        <EmptyState
          description="Name a board above and it will show up here. You can add several boards for different projects or teams."
          title="No boards yet"
          variant="compact"
        />
      );
    }
    return (
      <div className="space-y-2">
        {boards.map((board) => (
          <BoardCard
            board={board}
            isSelected={board.id === selectedBoardId}
            key={board.id}
            onDelete={onDeleteBoard}
            onRename={onRenameBoard}
            onSelect={onSelectBoard}
          />
        ))}
      </div>
    );
  }

  return (
    <aside className="w-full space-y-4 border-r border-slate-300 bg-slate-100/90 p-4 md:w-80 md:shadow-[inset_-1px_0_0_0_rgba(148,163,184,0.25)]">
      <section>
        <h2 className="mb-2 text-lg font-semibold">Boards</h2>
        <p className="mb-3 text-sm text-slate-600">Select a board to view and manage tasks.</p>
        {renderBoardList()}
      </section>

      <section>
        {isBoardComposerOpen ? (
          <div className="space-y-2">
            <BoardForm disabled={isLoadingBoards} isSubmitting={isCreatingBoard} onSubmit={onCreateBoard} />
            <div className="flex justify-end">
              <button
                className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                onClick={() => setIsBoardComposerOpen(false)}
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            className="w-full rounded border border-slate-300 bg-white px-4 py-2.5 text-left text-sm text-slate-500 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isLoadingBoards}
            onClick={() => setIsBoardComposerOpen(true)}
            type="button"
          >
            + Create a board...
          </button>
        )}
      </section>
    </aside>
  );
}
