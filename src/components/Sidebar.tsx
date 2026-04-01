"use client";

import { Board } from "@/types";
import { BoardCard } from "./BoardCard";
import { BoardForm } from "./BoardForm";

type SidebarProps = {
  boards: Board[];
  selectedBoardId?: string;
  onCreateBoard?: (payload: { name: string }) => Promise<void> | void;
  onSelectBoard?: (boardId: string) => void;
  onRenameBoard?: (boardId: string) => void;
  onDeleteBoard?: (boardId: string) => void;
  isCreatingBoard?: boolean;
};

export function Sidebar({
  boards,
  selectedBoardId,
  onCreateBoard,
  onSelectBoard,
  onRenameBoard,
  onDeleteBoard,
  isCreatingBoard = false
}: SidebarProps) {
  return (
    <aside className="w-full space-y-4 border-r border-slate-300 bg-slate-50 p-4 md:w-80">
      <div>
        <h2 className="text-lg font-semibold">Boards</h2>
        <p className="text-sm text-slate-600">Create or select a board</p>
      </div>

      <BoardForm isSubmitting={isCreatingBoard} onSubmit={onCreateBoard} />

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
    </aside>
  );
}
