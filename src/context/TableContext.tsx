"use client";

import { useDebounce } from "use-debounce";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

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

  // Server side pagination and sorting
  // const [data, setData] = useState<Page[]>([]);
  // const [totalPages, setTotalPages] = useState(1);
  // const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   fetchData();
  // }, [sortColumn, sortDirection, currentPage]);

  // const fetchData = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await fetch(
  //   `/api/pages?page=${currentPage}&limit=${itemsPerPage}&  sortColumn=${sortColumn}&sortDirection=${sortDirection}`
  // );
  //     const { pages, totalPages: newTotalPages } = await response.json();
  //     setData(pages);
  //     setTotalPages(newTotalPages);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  //   setIsLoading(false);
  // };

  // Typesense search
  // const [searchTerm, setSearchTerm] = useState('');
  //    const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  //    useEffect(() => {
  //      fetchData();
  //    }, [sortColumn, sortDirection, currentPage, debouncedSearchTerm]);

  //    const fetchData = async () => {
  //      setIsLoading(true);
  //      try {
  //        let url = `/api/pages?page=${currentPage}&limit=${itemsPerPage}&sortColumn=${sortColumn}&sortDirection=${sortDirection}`;
  //        if (debouncedSearchTerm) {
  //          url = `/api/search?q=${encodeURIComponent(debouncedSearchTerm)}&page=${currentPage}&limit=${itemsPerPage}`;
  //        }
  //        const response = await fetch(url);
  //        const data = await response.json();
  //        setData(debouncedSearchTerm ? data.hits : data.pages);
  //        setTotalPages(data.totalPages || Math.ceil(data.found / itemsPerPage));
  //      } catch (error) {
  //        console.error("Error fetching data:", error);
  //      }
  //      setIsLoading(false);
  //    };

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
