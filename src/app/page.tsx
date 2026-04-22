import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-3xl font-bold">TaskFlow</h1>
      <p className="text-slate-600">
        Starter project is ready. Begin with authentication, then board and task logic.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-400 active:bg-blue-600" href="/login">
          Go to Login
        </Link>
        <Link className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-400 active:bg-blue-700" href="/signup">
          Go to Signup
        </Link>
        <Link className="rounded-md border border-blue-600 bg-white px-4 py-2 text-blue-800 hover:bg-blue-100 active:bg-blue-200" href="/boards">
          Go to Boards
        </Link>
      </div>
    </main>
  );
}
