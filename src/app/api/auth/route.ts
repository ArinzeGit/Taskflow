import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // TODO: Parse body to detect login/signup/logout intent.
  // TODO: Integrate with Supabase Auth server-side helpers.
  // TODO: Return standardized auth response payload.
  void request;
  return NextResponse.json({ message: "Auth API placeholder" }, { status: 501 });
}
