import { Board } from "@/types";

type BoardCardProps = {
  board: Board;
  isSelected?: boolean;
  onSelect?: (boardId: string) => void;
  onRename?: (boardId: string) => void;
  onDelete?: (boardId: string) => void;
};

export function BoardCard({
  board,
  isSelected = false,
  onSelect,
  onRename,
  onDelete
}: BoardCardProps) {
  return (
    <div
      className={`overflow-hidden rounded-md border transition ${
        isSelected ? "border-slate-900 bg-slate-200" : "border-slate-300 bg-white"
      }`}
    >
      <button
        className="w-full px-3 py-2 text-left hover:bg-slate-50/80"
        onClick={() => onSelect?.(board.id)}
        type="button"
      >
        <p className="font-medium">{board.name}</p>
        <p className="text-xs text-slate-500">Board ID: {board.id}</p>
      </button>
      <div className="flex gap-2 border-t border-slate-200 bg-slate-50/80 px-2 py-1.5">
        <button
          className="rounded px-2 py-1 text-xs text-slate-700 hover:bg-slate-200"
          onClick={(e) => {
            e.stopPropagation();
            onRename?.(board.id);
          }}
          type="button"
        >
          Rename
        </button>
        <button
          className="rounded px-2 py-1 text-xs text-rose-700 hover:bg-rose-100"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(board.id);
          }}
          type="button"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
