import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: string;
  children?: ReactNode;
  /** Use "compact" in sidebars; "default" for main content */
  variant?: "default" | "compact";
};

export function EmptyState({ title, description, children, variant = "default" }: EmptyStateProps) {
  const padding = variant === "compact" ? "px-3 py-6" : "px-6 py-12";
  const titleClass = variant === "compact" ? "text-sm font-semibold text-slate-800" : "text-base font-semibold text-slate-800";
  const descClass = variant === "compact" ? "mt-1 text-xs text-slate-600" : "mt-2 max-w-sm mx-auto text-sm text-slate-600";

  return (
    <div
      className={`rounded-lg border border-dashed border-slate-300 bg-white/60 text-center ${padding}`}
      role="status"
    >
      <p className={titleClass}>{title}</p>
      <p className={descClass}>{description}</p>
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}
