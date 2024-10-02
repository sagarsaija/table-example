import { NextResponse } from "next/server";
import pagesData from "@/data/pages.json";
import { Page } from "@/context/TableContext";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";
  const sortColumn = searchParams.get("sortColumn") || "url";
  const sortDirection = searchParams.get("sortDirection") || "asc";

  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);

  let sortedData = [...pagesData];
  if (sortColumn === "score") {
    sortedData.sort((a, b) => {
      const scoreA = calculateScore(a);
      const scoreB = calculateScore(b);
      return sortDirection === "asc" ? scoreA - scoreB : scoreB - scoreA;
    });
  } else {
    sortedData.sort((a, b) => {
      const aValue = a[sortColumn as keyof Page];
      const bValue = b[sortColumn as keyof Page];
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }

  const startIndex = (pageNumber - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(sortedData.length / pageSize);

  return NextResponse.json({ pages: paginatedData, totalPages });
}

function calculateScore(page: Page): number {
  // same score calculation logic
}
