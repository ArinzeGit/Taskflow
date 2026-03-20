import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  // TODO: Fetch boards visible to the authenticated user from Supabase.
  return NextResponse.json({ boards: [] }, { status: 200 });
}

export async function POST(request: NextRequest) {
  // TODO: Create a new board in Supabase for the authenticated user.
  // TODO: Validate board name and enforce permissions.
  void request;
  return NextResponse.json({ message: "Create board placeholder" }, { status: 501 });
}
