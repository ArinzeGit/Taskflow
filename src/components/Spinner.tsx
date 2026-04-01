type SpinnerProps = {
  /** Screen-reader label */
  label?: string;
  className?: string;
  size?: "sm" | "md";
};

export function Spinner({ label = "Loading", className = "", size = "sm" }: SpinnerProps) {
  const sizeClass = size === "md" ? "h-5 w-5 border-2" : "h-4 w-4 border-2";

  return (
    <span className={`inline-flex shrink-0 items-center justify-center ${className}`} role="status">
      <span
        aria-hidden
        className={`${sizeClass} animate-spin rounded-full border-slate-300 border-t-slate-700`}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
