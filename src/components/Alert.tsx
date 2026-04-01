import type { ReactNode } from "react";

type AlertProps = {
  variant: "error" | "success" | "info";
  title?: string;
  children: ReactNode;
  onDismiss?: () => void;
  /** e.g. retry button */
  actions?: ReactNode;
};

const variantStyles: Record<AlertProps["variant"], string> = {
  error: "border-rose-200 bg-rose-50 text-rose-900",
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  info: "border-slate-200 bg-slate-50 text-slate-800"
};

export function Alert({ variant, title, children, onDismiss, actions }: AlertProps) {
  return (
    <div
      className={`flex gap-3 rounded-lg border p-3 text-sm shadow-sm ${variantStyles[variant]}`}
      role={variant === "error" ? "alert" : "status"}
    >
      <div className="min-w-0 flex-1">
        {title ? (
          <>
            <p className="font-medium">{title}</p>
            <div className="mt-1 text-[0.925rem] leading-relaxed opacity-95">{children}</div>
          </>
        ) : (
          <div className="leading-relaxed">{children}</div>
        )}
        {actions ? <div className="mt-3 flex flex-wrap gap-2">{actions}</div> : null}
      </div>
      {onDismiss ? (
        <button
          aria-label="Dismiss"
          className="shrink-0 rounded p-1 text-current opacity-70 hover:bg-black/5 hover:opacity-100"
          onClick={onDismiss}
          type="button"
        >
          ×
        </button>
      ) : null}
    </div>
  );
}
