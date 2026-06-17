import { getSession } from "@/app/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ role: null }, { status: 401 });
  }

  return NextResponse.json({
    role: session.role,
    name: session.name,
    institution: session.institution,
  });
}
