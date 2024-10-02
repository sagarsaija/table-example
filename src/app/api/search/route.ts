import { NextResponse } from "next/server";
import client from "@/lib/typesense";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const searchParameters = {
    q: query,
    query_by: "url",
    page,
    per_page: limit,
    prefix: false,
    num_typos: 2,
  };

  try {
    const searchResults = await client
      .collections("pages")
      .documents()
      .search(searchParameters);
    return NextResponse.json(searchResults);
  } catch (error) {
    console.error("Typesense search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
