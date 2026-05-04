import type { SupabaseClient } from "@supabase/supabase-js";
import type { BoardActivity, BoardActivityType, Task } from "@/types";

export function taskStatusLabel(status: Task["status"]): string {
  const map: Record<Task["status"], string> = {
    todo: "To do",
    in_progress: "In progress",
    done: "Done"
  };
  return map[status];
}

export function formatBoardActivityLine(activity: BoardActivity): string {
  const p = activity.payload;

  switch (activity.type) {
    case "board_created":
      return `Board “${String(p.name ?? "")}” was created.`;
    case "board_renamed":
      return `Board renamed from “${String(p.previousName ?? "")}” to “${String(p.newName ?? "")}”.`;
    case "task_created":
      return `Created task “${String(p.title ?? "")}”.`;
    case "task_title_updated":
      return `Updated task title from “${String(p.previousTitle ?? "")}” to “${String(p.title ?? "")}”.`;
    case "task_description_updated":
      return `Updated description for task “${String(p.taskTitle ?? "")}”.`;
    case "task_status_changed": {
      const from = p.fromStatus as Task["status"];
      const to = p.toStatus as Task["status"];
      return `Changed status of “${String(p.taskTitle ?? "")}” from "${taskStatusLabel(from)}" to "${taskStatusLabel(to)}".`;
    }
    case "task_deleted":
      return `Deleted task “${String(p.title ?? "")}”.`;
    default:
      return "Activity recorded.";
  }
}

export async function insertBoardActivity(
  supabase: SupabaseClient,
  params: {
    boardId: string;
    actorId: string;
    type: BoardActivityType;
    payload: Record<string, unknown>;
  }
): Promise<void> {
  const { error } = await supabase.from("board_activities").insert({
    board_id: params.boardId,
    actor_id: params.actorId,
    type: params.type,
    payload: params.payload
  });
  if (error) {
    console.warn("[board_activities] insert failed:", error.message);
  }
}

export async function insertBoardActivities(
  supabase: SupabaseClient,
  boardId: string,
  actorId: string,
  entries: { type: BoardActivityType; payload: Record<string, unknown> }[]
): Promise<void> {
  if (entries.length === 0) {
    return;
  }

  const { error } = await supabase.from("board_activities").insert(
    entries.map((entry) => ({
      board_id: boardId,
      actor_id: actorId,
      type: entry.type,
      payload: entry.payload
    }))
  );
  if (error) {
    console.warn("[board_activities] batch insert failed:", error.message);
  }
}
