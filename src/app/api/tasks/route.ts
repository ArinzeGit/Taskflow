import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // TODO: Read boardId query parameter and fetch tasks from Supabase.
  // TODO: Ensure user is authorized to access this board.
  void request;
  return NextResponse.json({ tasks: [] }, { status: 200 });
}

export async function POST(request: NextRequest) {
  // TODO: Insert a new task in Supabase.
  // TODO: Broadcast/update Realtime listeners through Supabase changes.
  void request;
  return NextResponse.json({ message: "Create task placeholder" }, { status: 501 });
}

export async function PATCH(request: NextRequest) {
  // TODO: Update existing task fields in Supabase.
  // TODO: Validate allowed status transitions if needed.
  void request;
  return NextResponse.json({ message: "Update task placeholder" }, { status: 501 });
}

export async function DELETE(request: NextRequest) {
  // TODO: Delete a task in Supabase.
  // TODO: Enforce board membership checks before deletion.
  void request;
  return NextResponse.json({ message: "Delete task placeholder" }, { status: 501 });
}
