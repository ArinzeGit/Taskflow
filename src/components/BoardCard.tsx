import { Board } from "@/types";
import { useEffect, useRef, useState } from "react";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!menuRef.current) {
        return;
      }
      if (!menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [board.id]);

  return (
    <div
      className={`group relative flex items-center gap-2 rounded-md border px-2 py-1.5 transition ${
        isSelected
          ? "border-blue-300 bg-blue-100 ring-1 ring-blue-200"
          : "border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-white"
      }`}
    >
      <span className={`h-7 w-1 rounded-full ${isSelected ? "bg-blue-500" : "bg-transparent"}`} />
      <button
        className="min-w-0 flex-1 rounded px-2 py-1.5 text-left"
        onClick={() => onSelect?.(board.id)}
        type="button"
      >
        <p className={`truncate text-sm font-medium ${isSelected ? "text-blue-900" : "text-slate-800"}`}>
          {board.name}
        </p>
      </button>
      <div className="relative" ref={menuRef}>
        <button
          aria-expanded={isMenuOpen}
          aria-haspopup="menu"
          className={`rounded p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 ${
            isMenuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen((prev) => !prev);
          }}
          type="button"
        >
          <span aria-hidden>...</span>
          <span className="sr-only">Open board actions</span>
        </button>

        {isMenuOpen ? (
          <div
            className="absolute right-0 top-9 z-20 w-32 rounded-md border border-slate-200 bg-white p-1 shadow-md"
            role="menu"
          >
            <button
              className="w-full rounded px-2 py-1.5 text-left text-xs text-blue-900 hover:bg-blue-100"
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(false);
                onRename?.(board.id);
              }}
              role="menuitem"
              type="button"
            >
              Rename
            </button>
            <button
              className="w-full rounded px-2 py-1.5 text-left text-xs text-rose-700 hover:bg-rose-100"
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(false);
                onDelete?.(board.id);
              }}
              role="menuitem"
              type="button"
            >
              Delete
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
