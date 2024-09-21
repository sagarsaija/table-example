"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Page {
  url: string;
  avgScrollPercentage: number;
  totalCount: number;
  bounceCount: number;
  startsWithCount: number;
  endsWithCount: number;
  totalPageviewCount: number;
  totalVisitorCount: number;
}

interface TableContextType {
  data: Page[];
  sortColumn: keyof Page | "score";
  sortDirection: "asc" | "desc";
  currentPage: number;
  itemsPerPage: number;
  setSortColumn: (column: keyof Page | "score") => void;
  setSortDirection: (direction: "asc" | "desc") => void;
  setCurrentPage: (page: number) => void;
}

const TableContext = createContext<TableContextType | undefined>(undefined);

export function useTableContext() {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("useTableContext must be used within a TableProvider");
  }
  return context;
}

export const TableProvider: React.FC<{
  children: ReactNode;
  initialData: Page[];
}> = ({ children, initialData }) => {
  const [data] = useState<Page[]>(initialData);
  const [sortColumn, setSortColumn] = useState<keyof Page | "score">("url");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  return (
    <TableContext.Provider
      value={{
        data,
        sortColumn,
        sortDirection,
        currentPage,
        itemsPerPage,
        setSortColumn,
        setSortDirection,
        setCurrentPage,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};
