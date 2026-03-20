"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [pendingEmailConfirmation, setPendingEmailConfirmation] = useState<string | null>(null);

  useEffect(() => {
    async function redirectIfAuthenticated() {
      try {
        const supabase = getSupabaseClient();
        const { data } = await supabase.auth.getSession();

        if (data.session) {
          router.replace("/boards");
          return;
        }
      } finally {
        setIsCheckingSession(false);
      }
    }

    void redirectIfAuthenticated();
  }, [router]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);
    setPendingEmailConfirmation(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setErrorMessage(error.message);
        if (error.message.toLowerCase().includes("email not confirmed")) {
          setPendingEmailConfirmation(email);
        }
        return;
      }

      router.push("/boards");
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to login right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResendConfirmation() {
    if (!pendingEmailConfirmation) {
      return;
    }

    setIsResending(true);
    setErrorMessage(null);
    setInfoMessage(null);

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: pendingEmailConfirmation
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setInfoMessage("Confirmation email resent. Check your inbox and spam folder.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to resend confirmation email.");
    } finally {
      setIsResending(false);
    }
  }

  if (isCheckingSession) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center p-6">
        <p className="text-sm text-slate-600">Checking session...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center p-6">
      <h1 className="mb-1 text-2xl font-bold">Login</h1>
      <p className="mb-6 text-sm text-slate-600">Access your collaborative boards.</p>

      <form className="space-y-4 rounded-md border border-slate-300 bg-white p-4" onSubmit={handleLogin}>
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            className="w-full rounded border border-slate-300 px-3 py-2"
            id="email"
            name="email"
            required
            type="email"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="password">
            Password
          </label>
          <input
            className="w-full rounded border border-slate-300 px-3 py-2"
            id="password"
            name="password"
            required
            type="password"
          />
        </div>
        <button className="w-full rounded bg-slate-900 px-4 py-2 text-white" type="submit">
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
        {errorMessage ? <p className="text-sm text-rose-700">{errorMessage}</p> : null}
        {pendingEmailConfirmation ? (
          <button
            className="w-full rounded border border-slate-300 px-4 py-2 text-sm text-slate-700 disabled:opacity-60"
            disabled={isResending}
            onClick={handleResendConfirmation}
            type="button"
          >
            {isResending ? "Resending..." : "Resend confirmation email"}
          </button>
        ) : null}
        {infoMessage ? <p className="text-sm text-emerald-700">{infoMessage}</p> : null}
      </form>

      <p className="mt-4 text-sm text-slate-600">
        Need an account?{" "}
        <Link className="font-medium text-slate-900 underline" href="/signup">
          Sign up
        </Link>
      </p>
    </main>
  );
}
