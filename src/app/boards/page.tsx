import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { TaskCard } from "@/components/TaskCard";
import { TaskForm } from "@/components/TaskForm";
import { Board, Task } from "@/types";

const placeholderBoards: Board[] = [
  { id: "board-1", name: "Engineering", ownerId: "user-1", createdAt: new Date().toISOString() },
  { id: "board-2", name: "Marketing", ownerId: "user-1", createdAt: new Date().toISOString() }
];

const placeholderTasks: Task[] = [
  {
    id: "task-1",
    boardId: "board-1",
    title: "Set up Supabase schema",
    description: "Create boards/tasks tables and RLS policies.",
    status: "todo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export default function BoardsPage() {
  // TODO: Guard this page by checking authenticated user session.
  // TODO: Load boards and tasks from Supabase based on selected board.
  // TODO: Subscribe to Supabase Realtime channel for board task updates.

  return (
    <div className="min-h-screen bg-slate-100">
      <Header title="Boards" subtitle="Collaborate on tasks with your team." />

      <div className="flex flex-col md:flex-row">
        <Sidebar boards={placeholderBoards} selectedBoardId="board-1" />

        <main className="flex-1 space-y-6 p-6">
          <section>
            <h2 className="mb-3 text-lg font-semibold">Add Task</h2>
            <TaskForm
              onSubmit={() => {
                // TODO: Insert new task into Supabase.
              }}
            />
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">Tasks</h2>
            <div className="grid gap-3">
              {placeholderTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  onDelete={() => {
                    // TODO: Delete task from Supabase.
                  }}
                  onEdit={() => {
                    // TODO: Update task in Supabase.
                  }}
                  task={task}
                />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
