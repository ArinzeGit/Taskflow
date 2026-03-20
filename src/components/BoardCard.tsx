import { Board } from "@/types";

type BoardCardProps = {
  board: Board;
  isSelected?: boolean;
  onSelect?: (boardId: string) => void;
};

export function BoardCard({ board, isSelected = false, onSelect }: BoardCardProps) {
  return (
    <button
      className={`w-full rounded-md border px-3 py-2 text-left transition ${
        isSelected ? "border-slate-900 bg-slate-200" : "border-slate-300 bg-white hover:bg-slate-50"
      }`}
      onClick={() => onSelect?.(board.id)}
      type="button"
    >
      <p className="font-medium">{board.name}</p>
      <p className="text-xs text-slate-500">Board ID: {board.id}</p>
    </button>
  );
}
