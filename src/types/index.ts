export type User = {
  id: string;
  email: string;
  createdAt: string;
};

export type Board = {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
};

export type Task = {
  id: string;
  boardId: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  assigneeId?: string;
  createdAt: string;
  updatedAt: string;
};

export type BoardActivityType =
  | "board_created"
  | "board_renamed"
  | "task_created"
  | "task_title_updated"
  | "task_description_updated"
  | "task_status_changed"
  | "task_deleted";

export type BoardActivity = {
  id: string;
  boardId: string;
  actorId: string;
  type: BoardActivityType;
  payload: Record<string, unknown>;
  createdAt: string;
};
