"use client";

import { Board } from "@/types";
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
  const showBoardsEmpty = !isLoadingBoards && boards.length === 0 && !boardsLoadError;

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
    <aside className="w-full space-y-4 border-r border-slate-300 bg-slate-50 p-4 md:w-80">
      <section>
        <h2 className="mb-3 text-lg font-semibold">Create Board</h2>
        <BoardForm disabled={isLoadingBoards} isSubmitting={isCreatingBoard} onSubmit={onCreateBoard} />
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Boards</h2>
        <p className="mb-3 text-sm text-slate-600">Select a board to view and manage tasks.</p>
        {renderBoardList()}
      </section>
    </aside>
  );
}
