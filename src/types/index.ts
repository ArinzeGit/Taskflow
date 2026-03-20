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
