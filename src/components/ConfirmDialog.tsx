"use client";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** danger = destructive action styling (e.g. delete) */
  tone?: "danger" | "neutral";
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "neutral",
  isLoading = false,
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  if (!open) {
    return null;
  }

  const confirmClass =
    tone === "danger"
      ? "bg-rose-600 text-white hover:bg-rose-700 disabled:bg-rose-400"
      : "bg-blue-500 text-white hover:bg-blue-400 active:bg-blue-600 disabled:bg-blue-300";

  return (
    <div
      aria-labelledby="confirm-dialog-title"
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
      onClick={() => {
        if (!isLoading) {
          onCancel();
        }
      }}
      role="dialog"
    >
      <div
        className="w-full max-w-md rounded-lg border border-slate-300 bg-white p-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-slate-900" id="confirm-dialog-title">
          {title}
        </h2>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            className="rounded border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            disabled={isLoading}
            onClick={onCancel}
            type="button"
          >
            {cancelLabel}
          </button>
          <button
            className={`rounded px-4 py-2 text-sm font-medium disabled:opacity-60 ${confirmClass}`}
            disabled={isLoading}
            onClick={() => void onConfirm()}
            type="button"
          >
            {isLoading ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
