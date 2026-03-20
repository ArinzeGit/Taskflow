import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-3xl font-bold">TaskFlow</h1>
      <p className="text-slate-600">
        Starter project is ready. Begin with authentication, then board and task logic.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link className="rounded-md bg-slate-900 px-4 py-2 text-white" href="/login">
          Go to Login
        </Link>
        <Link className="rounded-md bg-slate-700 px-4 py-2 text-white" href="/signup">
          Go to Signup
        </Link>
        <Link className="rounded-md bg-slate-600 px-4 py-2 text-white" href="/boards">
          Go to Boards
        </Link>
      </div>
    </main>
  );
}
