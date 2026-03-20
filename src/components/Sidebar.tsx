"use client";

import { Board } from "@/types";
import { BoardCard } from "./BoardCard";
import { BoardForm } from "./BoardForm";

type SidebarProps = {
  boards: Board[];
  selectedBoardId?: string;
};

export function Sidebar({ boards, selectedBoardId }: SidebarProps) {
  return (
    <aside className="w-full space-y-4 border-r border-slate-300 bg-slate-50 p-4 md:w-80">
      <div>
        <h2 className="text-lg font-semibold">Boards</h2>
        <p className="text-sm text-slate-600">Create or select a board</p>
      </div>

      <BoardForm
        onSubmit={() => {
          // TODO: Trigger board creation and refresh list.
        }}
      />

      <div className="space-y-2">
        {boards.map((board) => (
          <BoardCard
            board={board}
            isSelected={board.id === selectedBoardId}
            key={board.id}
            onSelect={() => {
              // TODO: Update selected board state and sync URL/query param.
            }}
          />
        ))}
      </div>
    </aside>
  );
}
