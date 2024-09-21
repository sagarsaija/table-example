"use client";

import React, { useMemo, useState } from "react";
import { useTableContext } from "@/context/TableContext";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";

interface Page {
  url: string;
  avgScrollPercentage: number;
  totalCount: number;
  bounceCount: number;
  startsWithCount: number;
  endsWithCount: number;
  totalPageviewCount: number;
  totalVisitorCount: number;
}

const calculateScore = (page: Page) => {
  const pageviewScore = Math.log(page.totalPageviewCount + 1) * 20;
  const timeScore = Math.min(page.totalCount, 300) / 3;
  const scrollScore = page.avgScrollPercentage;
  const bounceScore = Math.max(0, 100 - page.bounceCount * 10);
  const engagementScore = (page.startsWithCount + page.endsWithCount) * 5;
  const visitorScore = Math.log(page.totalVisitorCount + 1) * 15;

  return (
    (pageviewScore +
      timeScore +
      scrollScore +
      bounceScore +
      engagementScore +
      visitorScore) /
    6
  );
};

const getScoreColor = (score: number) => {
  if (score <= 40) return "text-red-500";
  if (score <= 70) return "text-yellow-500";
  return "text-green-500";
};

const Table: React.FC = () => {
  const {
    data,
    sortColumn,
    sortDirection,
    currentPage,
    itemsPerPage,
    setSortColumn,
    setSortDirection,
    setCurrentPage,
  } = useTableContext();
  const [filter, setFilter] = useState("");

  const columns: (keyof Page | "score")[] = [
    "url",
    "avgScrollPercentage",
    "totalCount",
    "bounceCount",
    "startsWithCount",
    "endsWithCount",
    "totalPageviewCount",
    "totalVisitorCount",
    "score",
  ];

  const sortedAndFilteredData = useMemo(() => {
    return [...data]
      .filter((page) => page.url.toLowerCase().includes(filter.toLowerCase()))
      .sort((a, b) => {
        if (sortColumn === "score") {
          return sortDirection === "asc"
            ? calculateScore(a) - calculateScore(b)
            : calculateScore(b) - calculateScore(a);
        }
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
  }, [data, sortColumn, sortDirection, filter]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedAndFilteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedAndFilteredData, currentPage, itemsPerPage]);

  const handleSort = (column: keyof Page | "score") => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return (
    <div className="w-full bg-background text-foreground">
      <div className="flex justify-between items-center bg-background p-4">
        <h2 className="text-2xl font-bold">Pages</h2>
        <input
          type="text"
          placeholder="Filter by URL"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-2 py-1 bg-input rounded w-1/3 text-foreground"
        />
        <div className="flex items-center">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1 text-muted-foreground hover:text-foreground disabled:text-muted"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="px-3 py-1 text-foreground text-2xl font-bold">
            {currentPage}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(
                  prev + 1,
                  Math.ceil(sortedAndFilteredData.length / itemsPerPage)
                )
              )
            }
            disabled={
              currentPage ===
              Math.ceil(sortedAndFilteredData.length / itemsPerPage)
            }
            className="p-1 text-muted-foreground hover:text-foreground disabled:text-muted"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-fixed">
          <colgroup>
            <col className="w-1/3" />
            <col className="w-1/12" />
            <col className="w-1/12" />
            <col className="w-1/12" />
            <col className="w-1/12" />
            <col className="w-1/12" />
            <col className="w-1/12" />
            <col className="w-1/12" />
          </colgroup>
          <thead>
            <tr className="bg-[hsl(var(--table-header))] text-foreground">
              {columns.map((column) => (
                <th
                  key={column}
                  className="p-2 text-left cursor-pointer"
                  onClick={() => handleSort(column)}
                >
                  {column === "url"
                    ? "URL"
                    : column === "avgScrollPercentage"
                    ? "SCROLL"
                    : column === "totalCount"
                    ? "TIME"
                    : column === "bounceCount"
                    ? "BOUNCE"
                    : column === "startsWithCount"
                    ? "ENTERS"
                    : column === "endsWithCount"
                    ? "EXITS"
                    : column === "totalPageviewCount"
                    ? "PAGEVIEWS"
                    : column === "totalVisitorCount"
                    ? "VISITORS"
                    : column === "score"
                    ? "SCORE"
                    : column.toUpperCase()}
                  {sortColumn === column && (
                    <ArrowUpDown className="inline ml-1" size={14} />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((page, index) => (
              <tr key={index} className="border-b border-border hover:bg-muted">
                {columns.map((column) => (
                  <td
                    key={column}
                    className={`p-2 ${
                      column === "url" ? "break-words" : "whitespace-nowrap"
                    } ${
                      column === "score"
                        ? getScoreColor(calculateScore(page))
                        : "text-foreground"
                    }`}
                  >
                    {column === "score"
                      ? calculateScore(page).toFixed(2)
                      : column === "avgScrollPercentage" ||
                        column === "bounceCount"
                      ? `${page[column]}%`
                      : column === "totalCount"
                      ? `${Math.floor(page[column] / 60)}:${(page[column] % 60)
                          .toString()
                          .padStart(2, "0")}`
                      : page[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
