import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function copyAuthCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie);
  });
}

export async function middleware(request: NextRequest) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({
    request
  });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      }
    }
  });

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  if (pathname === "/login" || pathname === "/signup") {
    if (user) {
      const redirectResponse = NextResponse.redirect(new URL("/boards", request.url));
      copyAuthCookies(supabaseResponse, redirectResponse);
      return redirectResponse;
    }
    return supabaseResponse;
  }

  if (pathname.startsWith("/boards")) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      const nextPath = pathname + request.nextUrl.search;
      loginUrl.searchParams.set("next", nextPath);
      const redirectResponse = NextResponse.redirect(loginUrl);
      copyAuthCookies(supabaseResponse, redirectResponse);
      return redirectResponse;
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/boards/:path*", "/login", "/signup"]
};
