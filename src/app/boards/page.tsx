"use client";

import { BoardRenameModal } from "@/components/BoardRenameModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/EmptyState";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { TaskCard } from "@/components/TaskCard";
import { TaskEditModal } from "@/components/TaskEditModal";
import { Spinner } from "@/components/Spinner";
import { TaskForm } from "@/components/TaskForm";
import { TaskListSkeleton } from "@/components/TaskListSkeleton";
import { getActionErrorMessage, getErrorMessage } from "@/lib/errors";
import { getSupabaseClient } from "@/lib/supabase";
import { Board, Task } from "@/types";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { RealtimeChannel } from "@supabase/supabase-js";

type BoardRow = {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
};

type TaskRow = {
  id: string;
  board_id: string;
  title: string;
  description: string | null;
  status: "todo" | "in_progress" | "done";
  assignee_id: string | null;
  created_at: string;
  updated_at: string;
};

function mapBoard(row: BoardRow): Board {
  return {
    id: row.id,
    name: row.name,
    ownerId: row.owner_id,
    createdAt: row.created_at
  };
}

function mapTask(row: TaskRow): Task {
  return {
    id: row.id,
    boardId: row.board_id,
    title: row.title,
    description: row.description ?? undefined,
    status: row.status,
    assigneeId: row.assignee_id ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export default function BoardsPage() {
  const router = useRouter();
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [boardsLoadError, setBoardsLoadError] = useState<string | null>(null);
  const [tasksLoadError, setTasksLoadError] = useState<string | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [renamingBoard, setRenamingBoard] = useState<Board | null>(null);
  const [isSavingTaskEdit, setIsSavingTaskEdit] = useState(false);
  const [isSavingBoardRename, setIsSavingBoardRename] = useState(false);
  const [boardDeleteConfirm, setBoardDeleteConfirm] = useState<{ id: string; name: string } | null>(
    null
  );
  const [isDeletingBoard, setIsDeletingBoard] = useState(false);
  const [taskDeleteConfirm, setTaskDeleteConfirm] = useState<{ id: string; title: string } | null>(
    null
  );
  const [isDeletingTask, setIsDeletingTask] = useState(false);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    async function checkSession() {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
          router.replace("/login");
          return;
        }
      } finally {
        setIsCheckingSession(false);
      }
    }

    void checkSession();
  }, [router]);

  const loadBoards = useCallback(async () => {
    setIsLoadingData(true);
    setBoardsLoadError(null);

    try {
      const supabase = getSupabaseClient();
      const { data: boardsData, error: boardsError } = await supabase
        .from("boards")
        .select("id,name,owner_id,created_at")
        .order("created_at", { ascending: true });

      if (boardsError) {
        const msg = getActionErrorMessage(boardsError.message, boardsError.message);
        setBoardsLoadError(msg);
        toast.error("Couldn't load boards", {
          description: msg,
          action: { label: "Retry", onClick: () => void loadBoards() }
        });
        return;
      }

      const mappedBoards = (boardsData ?? []).map((board) => mapBoard(board as BoardRow));
      setBoards(mappedBoards);

      if (mappedBoards.length === 0) {
        setSelectedBoardId(null);
        setTasks([]);
        return;
      }

      setSelectedBoardId((prev) => prev ?? mappedBoards[0].id);
    } catch (error) {
      const msg = getErrorMessage(error, "Failed to load boards.");
      setBoardsLoadError(msg);
      toast.error("Couldn't load boards", {
        description: msg,
        action: { label: "Retry", onClick: () => void loadBoards() }
      });
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (isCheckingSession) {
      return;
    }

    void loadBoards();
  }, [isCheckingSession, loadBoards]);

  useLayoutEffect(() => {
    if (!selectedBoardId) {
      setIsLoadingTasks(false);
      setTasks([]);
      setTasksLoadError(null);
      return;
    }

    setTasksLoadError(null);
    setIsLoadingTasks(true);
    setTasks([]);
  }, [selectedBoardId]);

  const retryLoadTasks = useCallback(async () => {
    if (!selectedBoardId) {
      return;
    }

    setTasksLoadError(null);
    setIsLoadingTasks(true);
    setTasks([]);

    try {
      const supabase = getSupabaseClient();
      const { data: tasksData, error: tasksError } = await supabase
        .from("tasks")
        .select("id,board_id,title,description,status,assignee_id,created_at,updated_at")
        .eq("board_id", selectedBoardId)
        .order("created_at", { ascending: true });

      if (tasksError) {
        const msg = getActionErrorMessage(tasksError.message, tasksError.message);
        setTasksLoadError(msg);
        toast.error("Couldn't load tasks", {
          description: msg,
          action: { label: "Retry", onClick: () => void retryLoadTasks() }
        });
        return;
      }

      setTasks((tasksData ?? []).map((task) => mapTask(task as TaskRow)));
    } catch (error) {
      const msg = getErrorMessage(error, "Failed to load tasks.");
      setTasksLoadError(msg);
      toast.error("Couldn't load tasks", {
        description: msg,
        action: { label: "Retry", onClick: () => void retryLoadTasks() }
      });
    } finally {
      setIsLoadingTasks(false);
    }
  }, [selectedBoardId]);

  useEffect(() => {
    if (!selectedBoardId) {
      return;
    }

    let cancelled = false;

    async function loadTasksForBoard(boardId: string) {
      try {
        const supabase = getSupabaseClient();
        const { data: tasksData, error: tasksError } = await supabase
          .from("tasks")
          .select("id,board_id,title,description,status,assignee_id,created_at,updated_at")
          .eq("board_id", boardId)
          .order("created_at", { ascending: true });

        if (cancelled) {
          return;
        }

        if (tasksError) {
          const msg = getActionErrorMessage(tasksError.message, tasksError.message);
          setTasksLoadError(msg);
          toast.error("Couldn't load tasks", {
            description: msg,
            action: { label: "Retry", onClick: () => void retryLoadTasks() }
          });
          return;
        }

        setTasks((tasksData ?? []).map((task) => mapTask(task as TaskRow)));
      } catch (error) {
        if (!cancelled) {
          const msg = getErrorMessage(error, "Failed to load tasks.");
          setTasksLoadError(msg);
          toast.error("Couldn't load tasks", {
            description: msg,
            action: { label: "Retry", onClick: () => void retryLoadTasks() }
          });
        }
      } finally {
        if (!cancelled) {
          setIsLoadingTasks(false);
        }
      }
    }

    void loadTasksForBoard(selectedBoardId);

    return () => {
      cancelled = true;
    };
  }, [selectedBoardId, retryLoadTasks]);

  useEffect(() => {
    if (!selectedBoardId) {
      if (channelRef.current) {
        getSupabaseClient().removeChannel(channelRef.current);
        channelRef.current = null;
      }
      return;
    }

    const supabase = getSupabaseClient();
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const newChannel = supabase
      .channel(`tasks-${selectedBoardId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks", filter: `board_id=eq.${selectedBoardId}` },
        async () => {
          const { data, error } = await supabase
            .from("tasks")
            .select("id,board_id,title,description,status,assignee_id,created_at,updated_at")
            .eq("board_id", selectedBoardId)
            .order("created_at", { ascending: true });

          if (error) {
            const msg = getActionErrorMessage(error.message, error.message);
            setTasksLoadError(msg);
            toast.error("Couldn't refresh tasks", {
              description: msg,
              action: { label: "Retry", onClick: () => void retryLoadTasks() }
            });
            return;
          }
          setTasks((data ?? []).map((task) => mapTask(task as TaskRow)));
        }
      )
      .subscribe();

    channelRef.current = newChannel;

    return () => {
      supabase.removeChannel(newChannel);
      if (channelRef.current?.topic === newChannel.topic) {
        channelRef.current = null;
      }
    };
  }, [selectedBoardId, retryLoadTasks]);

  async function handleLogout() {
    const supabase = getSupabaseClient();
    if (channelRef.current) {
      await supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  async function handleCreateBoard(payload: { name: string }) {
    setIsCreatingBoard(true);

    try {
      const supabase = getSupabaseClient();
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;

      if (!userId) {
        toast.error("Your session has expired. Please log in again and retry your change.");
        return;
      }

      const { data, error } = await supabase
        .from("boards")
        .insert({ name: payload.name, owner_id: userId })
        .select("id,name,owner_id,created_at")
        .single();

      if (error) {
        toast.error(getActionErrorMessage(error.message, "Action failed."));
        return;
      }

      const newBoard = mapBoard(data as BoardRow);
      setBoards((prev) => [...prev, newBoard]);
      setSelectedBoardId(newBoard.id);
      toast.success("Board created");
    } catch (error) {
      toast.error(getActionErrorMessage(error, "Failed to create board."));
    } finally {
      setIsCreatingBoard(false);
    }
  }

  async function handleCreateTask(payload: { title: string; description: string }) {
    if (!selectedBoardId) {
      return;
    }

    setIsCreatingTask(true);

    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("tasks")
        .insert({
          board_id: selectedBoardId,
          title: payload.title,
          description: payload.description || null,
          status: "todo"
        })
        .select("id,board_id,title,description,status,assignee_id,created_at,updated_at")
        .single();

      if (error) {
        toast.error(getActionErrorMessage(error.message, "Action failed."));
        return;
      }

      setTasks((prev) => [...prev, mapTask(data as TaskRow)]);
      toast.success("Task created");
    } catch (error) {
      toast.error(getActionErrorMessage(error, "Failed to create task."));
    } finally {
      setIsCreatingTask(false);
    }
  }

  async function handleSaveTaskEdit(payload: {
    id: string;
    title: string;
    description: string;
    status: Task["status"];
  }) {
    setIsSavingTaskEdit(true);
    const previousTasks = tasks;
    const now = new Date().toISOString();
    setTasks((prev) =>
      prev.map((item) =>
        item.id === payload.id
          ? {
              ...item,
              title: payload.title,
              description: payload.description || undefined,
              status: payload.status,
              updatedAt: now
            }
          : item
      )
    );

    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("tasks")
        .update({
          title: payload.title,
          description: payload.description || null,
          status: payload.status,
          updated_at: now
        })
        .eq("id", payload.id)
        .select("id,board_id,title,description,status,assignee_id,created_at,updated_at")
        .single();

      if (error) {
        toast.error(getActionErrorMessage(error.message, "Action failed."));
        setTasks(previousTasks);
        return;
      }

      setTasks((prev) =>
        prev.map((item) => (item.id === payload.id ? mapTask(data as TaskRow) : item))
      );
      setEditingTask(null);
      toast.success("Task updated");
    } catch (error) {
      setTasks(previousTasks);
      toast.error(getActionErrorMessage(error, "Failed to update task."));
    } finally {
      setIsSavingTaskEdit(false);
    }
  }

  function handleRenameBoardRequest(boardId: string) {
    const board = boards.find((b) => b.id === boardId);
    if (board) {
      setRenamingBoard(board);
    }
  }

  async function handleSaveBoardRename(name: string) {
    if (!renamingBoard) {
      return;
    }

    setIsSavingBoardRename(true);
    const previousBoards = boards;

    setBoards((prev) =>
      prev.map((b) => (b.id === renamingBoard.id ? { ...b, name } : b))
    );

    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("boards")
        .update({ name })
        .eq("id", renamingBoard.id)
        .select("id,name,owner_id,created_at")
        .single();

      if (error) {
        toast.error(getActionErrorMessage(error.message, "Action failed."));
        setBoards(previousBoards);
        return;
      }

      setBoards((prev) =>
        prev.map((b) => (b.id === renamingBoard.id ? mapBoard(data as BoardRow) : b))
      );
      setRenamingBoard(null);
      toast.success("Board renamed");
    } catch (error) {
      setBoards(previousBoards);
      toast.error(getActionErrorMessage(error, "Failed to rename board."));
    } finally {
      setIsSavingBoardRename(false);
    }
  }

  function handleRequestDeleteBoard(boardId: string) {
    const board = boards.find((b) => b.id === boardId);
    if (board) {
      setBoardDeleteConfirm({ id: board.id, name: board.name });
    }
  }

  async function deleteBoardById(boardId: string): Promise<boolean> {
    const wasSelected = selectedBoardId === boardId;

    try {
      const supabase = getSupabaseClient();
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error("Your session has expired. Please log in again and retry your change.");
        return false;
      }

      const { count, error } = await supabase
        .from("boards")
        .delete({ count: "exact" })
        .eq("id", boardId);

      if (error) {
        toast.error(getActionErrorMessage(error.message, "Action failed."));
        return false;
      }

      if ((count ?? 0) < 1) {
        toast.error("Your session has expired. Please log in again and retry your change.");
        return false;
      }

      const remaining = boards.filter((b) => b.id !== boardId);
      setBoards(remaining);
      if (wasSelected) {
        setSelectedBoardId(remaining[0]?.id ?? null);
        setTasks([]);
      }

      if (editingTask?.boardId === boardId) {
        setEditingTask(null);
      }
      if (renamingBoard?.id === boardId) {
        setRenamingBoard(null);
      }
      return true;
    } catch (error) {
      toast.error(getActionErrorMessage(error, "Failed to delete board."));
      return false;
    }
  }

  async function handleConfirmDeleteBoard() {
    if (!boardDeleteConfirm || isDeletingBoard) {
      return;
    }

    const boardId = boardDeleteConfirm.id;
    setIsDeletingBoard(true);
    try {
      const ok = await deleteBoardById(boardId);
      if (ok) {
        setBoardDeleteConfirm(null);
        toast.success("Board deleted");
      }
    } finally {
      setIsDeletingBoard(false);
    }
  }

  function handleRequestDeleteTask(taskId: string) {
    const task = tasks.find((item) => item.id === taskId);
    if (task) {
      setTaskDeleteConfirm({ id: task.id, title: task.title });
    }
  }

  async function handleDeleteTask(taskId: string): Promise<boolean> {
    const previousTasks = tasks;
    setTasks((prev) => prev.filter((task) => task.id !== taskId));

    try {
      const supabase = getSupabaseClient();
      const { count, error } = await supabase
        .from("tasks")
        .delete({ count: "exact" })
        .eq("id", taskId);

      if (error) {
        toast.error(getActionErrorMessage(error.message, "Action failed."));
        setTasks(previousTasks);
        return false;
      }

      // RLS/session issues may yield 0 affected rows with no explicit error.
      if ((count ?? 0) < 1) {
        toast.error("Your session has expired. Please log in again and retry your change.");
        setTasks(previousTasks);
        return false;
      }
      return true;
    } catch (error) {
      setTasks(previousTasks);
      toast.error(getActionErrorMessage(error, "Failed to delete task."));
      return false;
    }
  }

  async function handleConfirmDeleteTask() {
    if (!taskDeleteConfirm || isDeletingTask) {
      return;
    }

    setIsDeletingTask(true);
    try {
      const ok = await handleDeleteTask(taskDeleteConfirm.id);
      if (ok) {
        setTaskDeleteConfirm(null);
        toast.success("Task deleted");
      }
    } finally {
      setIsDeletingTask(false);
    }
  }

  if (isCheckingSession) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-100">
        <Spinner label="Checking session" size="md" />
        <p className="text-sm text-slate-600">Checking session…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Header
        actions={
          <button
            className="rounded bg-blue-500 px-3 py-2 text-sm text-white transition-colors hover:bg-blue-400 active:bg-blue-600"
            onClick={handleLogout}
            type="button"
          >
            Logout
          </button>
        }
        subtitle="Collaborate on tasks with your team."
        title="Boards"
      />

      <div className="flex flex-col md:flex-row">
        <Sidebar
          boards={boards}
          boardsLoadError={boardsLoadError}
          isCreatingBoard={isCreatingBoard}
          isLoadingBoards={isLoadingData}
          onCreateBoard={handleCreateBoard}
          onDeleteBoard={handleRequestDeleteBoard}
          onRenameBoard={handleRenameBoardRequest}
          onRetryLoadBoards={() => void loadBoards()}
          onSelectBoard={setSelectedBoardId}
          selectedBoardId={selectedBoardId ?? undefined}
        />

        <main className="flex-1 space-y-6 p-6">
          {isLoadingData ? (
            <div
              aria-busy="true"
              aria-label="Loading boards"
              className="flex min-h-[12rem] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-slate-300 bg-white/60 px-6 py-12 text-center"
            >
              <Spinner label="Loading boards" size="md" />
              <p className="text-sm text-slate-600">Loading your boards…</p>
            </div>
          ) : null}

          {!isLoadingData && boards.length === 0 && !boardsLoadError ? (
            <EmptyState
              description="Create a board in the sidebar to get started. Boards keep your tasks grouped—by project, team, or anything you like."
              title="Create your first board"
            />
          ) : null}

          {!isLoadingData && boards.length > 0 ? (
            <>
              <section>
                <h2 className="mb-3 text-lg font-semibold">Add Task</h2>
                <TaskForm
                  disabled={!selectedBoardId || isLoadingTasks}
                  isSubmitting={isCreatingTask}
                  onSubmit={handleCreateTask}
                  submitLabel={isCreatingTask ? "Saving..." : "Save Task"}
                />
              </section>

              <section>
                <div className="mb-3 flex items-center gap-2">
                  <h2 className="text-lg font-semibold">Tasks</h2>
                  {isLoadingTasks ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                      <Spinner label="Loading tasks" />
                      Loading…
                    </span>
                  ) : null}
                </div>
                {tasksLoadError && !isLoadingTasks ? (
                  <div className="rounded border border-dashed border-blue-200 bg-blue-50 px-4 py-6 text-center text-sm text-blue-900">
                    <p className="mb-3">Tasks couldn’t be loaded.</p>
                    <button
                      className="rounded border border-blue-300 bg-white px-3 py-1.5 text-sm font-medium text-blue-900 hover:bg-blue-100 active:bg-blue-200"
                      onClick={() => void retryLoadTasks()}
                      type="button"
                    >
                      Try again
                    </button>
                  </div>
                ) : isLoadingTasks ? (
                  <TaskListSkeleton />
                ) : tasks.length === 0 ? (
                  <EmptyState
                    description="Add a task above to track work on this board. You can edit details, change status, and remove tasks anytime."
                    title="No tasks on this board"
                  />
                ) : (
                  <div className="grid gap-3">
                    {tasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        onDelete={handleRequestDeleteTask}
                        onEdit={setEditingTask}
                        task={task}
                      />
                    ))}
                  </div>
                )}
              </section>
            </>
          ) : null}
        </main>
      </div>

      <TaskEditModal
        isSaving={isSavingTaskEdit}
        onClose={() => setEditingTask(null)}
        onSave={handleSaveTaskEdit}
        task={editingTask}
      />

      <BoardRenameModal
        board={renamingBoard}
        isSaving={isSavingBoardRename}
        onClose={() => setRenamingBoard(null)}
        onSave={handleSaveBoardRename}
      />

      <ConfirmDialog
        cancelLabel="Cancel"
        confirmLabel="Delete board"
        description={
          boardDeleteConfirm
            ? `This will permanently delete “${boardDeleteConfirm.name}” and all tasks on it. This cannot be undone.`
            : ""
        }
        isLoading={isDeletingBoard}
        onCancel={() => {
          if (!isDeletingBoard) {
            setBoardDeleteConfirm(null);
          }
        }}
        onConfirm={handleConfirmDeleteBoard}
        open={!!boardDeleteConfirm}
        title="Delete this board?"
        tone="danger"
      />

      <ConfirmDialog
        cancelLabel="Cancel"
        confirmLabel="Delete task"
        description={
          taskDeleteConfirm
            ? `This will permanently delete “${taskDeleteConfirm.title}”. This cannot be undone.`
            : ""
        }
        isLoading={isDeletingTask}
        onCancel={() => {
          if (!isDeletingTask) {
            setTaskDeleteConfirm(null);
          }
        }}
        onConfirm={handleConfirmDeleteTask}
        open={!!taskDeleteConfirm}
        title="Delete this task?"
        tone="danger"
      />
    </div>
  );
}
