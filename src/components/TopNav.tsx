"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

export function TopNav() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const avatarMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const supabase = getSupabaseClient();

    let mounted = true;

    async function loadSession() {
      try {
        const { data } = await supabase.auth.getSession();
        if (mounted) {
          setIsAuthenticated(!!data.session);
        }
      } finally {
        if (mounted) {
          setIsCheckingSession(false);
        }
      }
    }

    void loadSession();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setIsCheckingSession(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!avatarMenuRef.current) {
        return;
      }
      if (!avatarMenuRef.current.contains(event.target as Node)) {
        setIsAvatarMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    try {
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setIsAvatarMenuOpen(false);
      router.push("/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link className="flex items-center gap-2 rounded-md px-1 py-1 hover:bg-blue-50" href="/">
          <Image alt="TaskFlow logo" height={28} priority src="/icon.png" width={28} />
          <span className="text-base font-semibold text-blue-900">TaskFlow</span>
        </Link>

        {isCheckingSession ? (
          <div className="h-8 w-36 animate-pulse rounded-md bg-slate-100" />
        ) : isAuthenticated ? (
          <div className="flex items-center gap-2">
            <Link
              className="rounded-md border border-blue-300 bg-white px-4 py-2 text-sm font-medium text-blue-900 transition-colors hover:bg-blue-100 active:bg-blue-200"
              href="/boards"
            >
              Boards
            </Link>
            <div className="relative" ref={avatarMenuRef}>
              <button
                aria-expanded={isAvatarMenuOpen}
                aria-haspopup="menu"
                className="inline-flex items-center gap-2 rounded-md border border-blue-300 bg-white px-2.5 py-1.5 text-sm font-medium text-blue-900 transition-colors hover:bg-blue-100"
                onClick={() => setIsAvatarMenuOpen((prev) => !prev)}
                type="button"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-900">
                  <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.8" />
                    <path
                      d="M5.5 18.5c.8-3 3.6-5 6.5-5s5.7 2 6.5 5"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="1.8"
                    />
                  </svg>
                </span>
                <span aria-hidden>▼</span>
                <span className="sr-only">Open account menu</span>
              </button>

              {isAvatarMenuOpen ? (
                <div
                  className="absolute right-0 top-11 z-50 min-w-36 rounded-md border border-slate-200 bg-white p-1 shadow-md"
                  role="menu"
                >
                  <button
                    className="w-full rounded px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                    disabled={isLoggingOut}
                    onClick={() => void handleLogout()}
                    role="menuitem"
                    type="button"
                  >
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-400 active:bg-blue-600"
              href="/signup"
            >
              Get Started
            </Link>
            <Link
              className="rounded-md border border-blue-300 bg-white px-4 py-2 text-sm font-medium text-blue-900 transition-colors hover:bg-blue-100 active:bg-blue-200"
              href="/login"
            >
              Login
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
