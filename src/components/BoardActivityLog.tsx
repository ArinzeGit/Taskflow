import type { BoardActivity } from "@/types";
import { formatBoardActivityLine } from "@/lib/board-activities";

type BoardActivityLogProps = {
  activities: BoardActivity[];
  isLoading?: boolean;
};

export function BoardActivityLog({ activities, isLoading = false }: BoardActivityLogProps) {
  return (
    <section className="max-w-3xl border-t border-slate-200 pt-6">
      <h2 className="mb-3 text-lg font-semibold">Activity</h2>
      {isLoading ? (
        <p className="text-sm text-slate-500">Loading activity…</p>
      ) : activities.length === 0 ? (
        <p className="text-sm text-slate-500">No activity recorded yet.</p>
      ) : (
        <ul className="space-y-2.5">
          {activities.map((activity) => (
            <li className="flex gap-3 text-sm text-slate-700" key={activity.id}>
              <time
                className="shrink-0 tabular-nums text-slate-400"
                dateTime={activity.createdAt}
                title={new Date(activity.createdAt).toLocaleString()}
              >
                {new Date(activity.createdAt).toLocaleString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit"
                })}
              </time>
              <span className="min-w-0 leading-snug">{formatBoardActivityLine(activity)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
