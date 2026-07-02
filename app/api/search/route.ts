import { NextResponse } from "next/server";
import { searchAll } from "../../lib/search";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q") ?? "";
  const results = await searchAll(query);

  return NextResponse.json(
    { query: query.trim(), count: results.length, results },
    { headers: { "Cache-Control": "no-store" } },
  );
}
