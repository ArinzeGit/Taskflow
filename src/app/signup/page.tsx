"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      if (data.session) {
        router.push("/boards");
        router.refresh();
        return;
      }

      setSuccessMessage("Signup successful. Check your email for a confirmation link, then log in.");
      router.push("/login");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to sign up right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center p-6">
      <h1 className="mb-1 text-2xl font-bold">Create Account</h1>
      <p className="mb-6 text-sm text-slate-600">Start collaborating on boards in real-time.</p>

      <form className="space-y-4 rounded-md border border-slate-300 bg-white p-4" onSubmit={handleSignup}>
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
          {isSubmitting ? "Creating account..." : "Sign up"}
        </button>
        {errorMessage ? <p className="text-sm text-rose-700">{errorMessage}</p> : null}
        {successMessage ? <p className="text-sm text-emerald-700">{successMessage}</p> : null}
      </form>

      <p className="mt-4 text-sm text-slate-600">
        Already have an account?{" "}
        <Link className="font-medium text-slate-900 underline" href="/login">
          Login
        </Link>
      </p>
    </main>
  );
}
