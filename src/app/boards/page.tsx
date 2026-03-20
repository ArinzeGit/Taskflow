"use client";

import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { TaskCard } from "@/components/TaskCard";
import { TaskForm } from "@/components/TaskForm";
import { getSupabaseClient } from "@/lib/supabase";
import { Board, Task } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
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

  useEffect(() => {
    if (isCheckingSession) {
      return;
    }

    async function loadInitialData() {
      setIsLoadingData(true);
      setErrorMessage(null);

      try {
        const supabase = getSupabaseClient();
        const { data: boardsData, error: boardsError } = await supabase
          .from("boards")
          .select("id,name,owner_id,created_at")
          .order("created_at", { ascending: true });

        if (boardsError) {
          setErrorMessage(boardsError.message);
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
        setErrorMessage(error instanceof Error ? error.message : "Failed to load boards.");
      } finally {
        setIsLoadingData(false);
      }
    }

    void loadInitialData();
  }, [isCheckingSession]);

  useEffect(() => {
    if (!selectedBoardId) {
      setTasks([]);
      return;
    }

    async function loadTasksForBoard(boardId: string) {
      setErrorMessage(null);

      try {
        const supabase = getSupabaseClient();
        const { data: tasksData, error: tasksError } = await supabase
          .from("tasks")
          .select("id,board_id,title,description,status,assignee_id,created_at,updated_at")
          .eq("board_id", boardId)
          .order("created_at", { ascending: true });

        if (tasksError) {
          setErrorMessage(tasksError.message);
          return;
        }

        setTasks((tasksData ?? []).map((task) => mapTask(task as TaskRow)));
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Failed to load tasks.");
      }
    }

    void loadTasksForBoard(selectedBoardId);
  }, [selectedBoardId]);

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

          if (!error) {
            setTasks((data ?? []).map((task) => mapTask(task as TaskRow)));
          }
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
  }, [selectedBoardId]);

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
    setErrorMessage(null);

    try {
      const supabase = getSupabaseClient();
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;

      if (!userId) {
        router.replace("/login");
        return;
      }

      const { data, error } = await supabase
        .from("boards")
        .insert({ name: payload.name, owner_id: userId })
        .select("id,name,owner_id,created_at")
        .single();

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      const newBoard = mapBoard(data as BoardRow);
      setBoards((prev) => [...prev, newBoard]);
      setSelectedBoardId(newBoard.id);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to create board.");
    } finally {
      setIsCreatingBoard(false);
    }
  }

  async function handleCreateTask(payload: { title: string; description: string }) {
    if (!selectedBoardId) {
      return;
    }

    setIsCreatingTask(true);
    setErrorMessage(null);

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
        setErrorMessage(error.message);
        return;
      }

      setTasks((prev) => [...prev, mapTask(data as TaskRow)]);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to create task.");
    } finally {
      setIsCreatingTask(false);
    }
  }

  async function handleDeleteTask(taskId: string) {
    setErrorMessage(null);
    const previousTasks = tasks;
    setTasks((prev) => prev.filter((task) => task.id !== taskId));

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from("tasks").delete().eq("id", taskId);

      if (error) {
        setErrorMessage(error.message);
        setTasks(previousTasks);
      }
    } catch (error) {
      setTasks(previousTasks);
      setErrorMessage(error instanceof Error ? error.message : "Failed to delete task.");
    }
  }

  async function handleCycleTaskStatus(taskId: string) {
    const task = tasks.find((item) => item.id === taskId);
    if (!task) {
      return;
    }

    const nextStatus =
      task.status === "todo" ? "in_progress" : task.status === "in_progress" ? "done" : "todo";

    setErrorMessage(null);
    const previousTasks = tasks;
    setTasks((prev) =>
      prev.map((item) =>
        item.id === taskId
          ? { ...item, status: nextStatus, updatedAt: new Date().toISOString() }
          : item
      )
    );

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from("tasks")
        .update({ status: nextStatus, updated_at: new Date().toISOString() })
        .eq("id", taskId);

      if (error) {
        setErrorMessage(error.message);
        setTasks(previousTasks);
      }
    } catch (error) {
      setTasks(previousTasks);
      setErrorMessage(error instanceof Error ? error.message : "Failed to update task.");
    }
  }

  if (isCheckingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-sm text-slate-600">Checking session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Header
        actions={
          <button className="rounded bg-slate-900 px-3 py-2 text-sm text-white" onClick={handleLogout} type="button">
            Logout
          </button>
        }
        subtitle="Collaborate on tasks with your team."
        title="Boards"
      />

      <div className="flex flex-col md:flex-row">
        <Sidebar
          boards={boards}
          isCreatingBoard={isCreatingBoard}
          onCreateBoard={handleCreateBoard}
          onSelectBoard={setSelectedBoardId}
          selectedBoardId={selectedBoardId ?? undefined}
        />

        <main className="flex-1 space-y-6 p-6">
          {isLoadingData ? <p className="text-sm text-slate-600">Loading boards...</p> : null}
          {errorMessage ? <p className="rounded border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{errorMessage}</p> : null}

          <section>
            <h2 className="mb-3 text-lg font-semibold">Add Task</h2>
            <TaskForm
              disabled={!selectedBoardId}
              isSubmitting={isCreatingTask}
              onSubmit={handleCreateTask}
              submitLabel={isCreatingTask ? "Saving..." : "Save Task"}
            />
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">Tasks</h2>
            <div className="grid gap-3">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  onDelete={handleDeleteTask}
                  onEdit={handleCycleTaskStatus}
                  task={task}
                />
              ))}
            </div>
            {!isLoadingData && tasks.length === 0 ? <p className="mt-3 text-sm text-slate-600">No tasks yet for this board.</p> : null}
          </section>
        </main>
      </div>
    </div>
  );
}
