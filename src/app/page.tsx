import Image from "next/image";
import Link from "next/link";
import { getLoginPathWithDemo } from "@/lib/demo-account";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-12 text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12">
        <section className="w-full max-w-3xl space-y-6 text-center">
          <div className="flex justify-center">
            <div className="rounded-2xl border border-blue-200 bg-white p-2 shadow-sm">
              <Image alt="TaskFlow logo" height={52} priority src="/icon.png" width={52} />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">TaskFlow</h1>
          <p className="text-base text-slate-600 sm:text-lg">
            Plan, assign, and track work with collaborative boards that keep your team aligned in real-time.
          </p>
          <div>
            <span className="inline-flex rounded-full border border-blue-200 bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-900">
              Real-time team task management
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              className="rounded-md bg-blue-500 px-5 py-2.5 font-medium text-white transition-colors hover:bg-blue-400 active:bg-blue-600"
              href="/signup"
            >
              Get Started
            </Link>
            <Link
              className="rounded-md border border-blue-300 bg-white px-5 py-2.5 font-medium text-blue-900 transition-colors hover:bg-blue-100 active:bg-blue-200"
              href="/login"
            >
              Login
            </Link>
          </div>
          <p className="text-sm text-slate-600">
            Want to explore quickly?{" "}
            <Link className="font-medium text-blue-700 hover:text-blue-900" href={getLoginPathWithDemo()}>
              Try the demo account -&gt;
            </Link>
          </p>
        </section>

        <section className="w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-900">Product Launch Board</p>
              <p className="text-xs text-slate-500">Live board preview</p>
            </div>
            <div className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-900">12 tasks</div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">To do</p>
              <div className="rounded-lg border border-slate-200 bg-white p-2.5 text-sm">Draft onboarding copy</div>
              <div className="rounded-lg border border-slate-200 bg-white p-2.5 text-sm">Design release email</div>
            </div>
            <div className="space-y-2 rounded-xl border border-blue-200 bg-blue-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-900">In progress</p>
              <div className="rounded-lg border border-blue-200 bg-white p-2.5 text-sm">Build analytics dashboard</div>
              <div className="rounded-lg border border-blue-200 bg-white p-2.5 text-sm">QA payment flow</div>
            </div>
            <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Done</p>
              <div className="rounded-lg border border-slate-200 bg-white p-2.5 text-sm">Set launch timeline</div>
              <div className="rounded-lg border border-slate-200 bg-white p-2.5 text-sm">Create task templates</div>
            </div>
          </div>
        </section>

        <section className="w-full max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-center text-2xl font-semibold">Why TaskFlow</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="font-semibold text-blue-900">Live collaboration</h3>
              <p className="mt-2 text-sm text-slate-600">
                Keep everyone synced with instant board and task updates across your team.
              </p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="font-semibold text-blue-900">Simple and intuitive</h3>
              <p className="mt-2 text-sm text-slate-600">
                Create boards, organize tasks, and update status without leaving your flow.
              </p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="font-semibold text-blue-900">Secure by default</h3>
              <p className="mt-2 text-sm text-slate-600">
                Built-in authentication and protected routes keep your workspace access controlled.
              </p>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
