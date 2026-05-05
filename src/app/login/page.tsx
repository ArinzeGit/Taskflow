"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { getSafePostAuthRedirect } from "@/lib/auth-redirect";
import { DEMO_EMAIL, DEMO_LOGIN_PARAM, DEMO_LOGIN_VALUE, DEMO_PASSWORD } from "@/lib/demo-account";
import { getErrorMessage } from "@/lib/errors";
import { getSupabaseClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [pendingEmailConfirmation, setPendingEmailConfirmation] = useState<string | null>(null);

  useEffect(() => {
    async function redirectIfAuthenticated() {
      try {
        const supabase = getSupabaseClient();
        const { data } = await supabase.auth.getSession();

        if (data.session) {
          const next = new URLSearchParams(window.location.search).get("next");
          router.replace(getSafePostAuthRedirect(next));
          return;
        }
      } finally {
        setIsCheckingSession(false);
      }
    }

    void redirectIfAuthenticated();
  }, [router]);

  useEffect(() => {
    if (isCheckingSession || typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get(DEMO_LOGIN_PARAM) !== DEMO_LOGIN_VALUE) {
      return;
    }

    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    params.delete(DEMO_LOGIN_PARAM);

    const rest = params.toString();
    const path = rest ? `/login?${rest}` : "/login";
    router.replace(path, { scroll: false });
  }, [isCheckingSession, router]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPendingEmailConfirmation(null);
    setIsSubmitting(true);

    const emailTrimmed = email.trim();

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: emailTrimmed,
        password
      });

      if (error) {
        toast.error("Login failed", { description: error.message });
        if (error.message.toLowerCase().includes("email not confirmed")) {
          setPendingEmailConfirmation(emailTrimmed);
        }
        return;
      }

      const next = new URLSearchParams(window.location.search).get("next");
      router.push(getSafePostAuthRedirect(next));
      router.refresh();
    } catch (error) {
      toast.error("Login failed", {
        description: getErrorMessage(error, "Unable to login right now.")
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResendConfirmation() {
    if (!pendingEmailConfirmation) {
      return;
    }

    setIsResending(true);

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: pendingEmailConfirmation
      });

      if (error) {
        toast.error("Couldn’t resend email", { description: error.message });
        return;
      }

      toast.success("Confirmation email sent. Check your inbox and spam folder.");
    } catch (error) {
      toast.error("Couldn’t resend email", {
        description: getErrorMessage(error, "Unable to resend confirmation email.")
      });
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
        <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2.5 text-sm text-blue-800">
          <p className="font-semibold text-blue-900">Want to explore quickly?</p>
          <p className="mt-0.5 text-xs text-gray-600">
          👤 Demo User: <span className="font-mono">{DEMO_EMAIL}</span> /{" "}
            <span className="font-mono">{DEMO_PASSWORD}</span>
          </p>
          <button
            className="mt-2.5 rounded bg-blue-500 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-400 active:bg-blue-600 sm:text-sm"
            onClick={() => {
              setEmail(DEMO_EMAIL);
              setPassword(DEMO_PASSWORD);
            }}
            type="button"
          >
            Continue as Demo User
          </button>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            autoComplete="email"
            className="w-full rounded border border-slate-300 px-3 py-2"
            id="email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="password">
            Password
          </label>
          <input
            autoComplete="current-password"
            className="w-full rounded border border-slate-300 px-3 py-2"
            id="password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
        </div>

        <button
          className="w-full rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-400 active:bg-blue-600"
          type="submit"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        {pendingEmailConfirmation ? (
          <button
            className="w-full rounded border border-blue-300 bg-blue-50 px-4 py-2 text-sm text-blue-900 transition-colors hover:bg-blue-100 disabled:opacity-60"
            disabled={isResending}
            onClick={handleResendConfirmation}
            type="button"
          >
            {isResending ? "Resending..." : "Resend confirmation email"}
          </button>
        ) : null}
      </form>

      <p className="mt-4 text-sm text-slate-600">
        Need an account?{" "}
        <Link className="font-medium text-blue-700 underline hover:text-blue-900" href="/signup">
          Sign up
        </Link>
      </p>
    </main>
  );
}
