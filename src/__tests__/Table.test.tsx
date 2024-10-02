import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Table from "@/components/table/Table";
import { TableProvider } from "@/context/TableContext";

const mockData = [
  {
    url: "hockeystack.com/blog/example1/",
    totalCount: 10,
    totalVisitorCount: 5,
    bounceCount: 2,
    startsWithCount: 3,
    endsWithCount: 2,
    avgScrollPercentage: 75,
    totalPageviewCount: 100,
  },
  {
    url: "hockeystack.com/blog/example2/",
    totalCount: 15,
    totalVisitorCount: 8,
    bounceCount: 1,
    startsWithCount: 4,
    endsWithCount: 3,
    avgScrollPercentage: 80,
    totalPageviewCount: 150,
  },
];

describe("Table Component", () => {
  const renderTable = () => {
    render(
      <TableProvider initialData={mockData}>
        <Table />
      </TableProvider>
    );
  };

  test("renders table headers", () => {
    renderTable();
    expect(screen.getByText("URL")).toBeInTheDocument();
    expect(screen.getByText("SCROLL")).toBeInTheDocument();
    expect(screen.getByText("TIME")).toBeInTheDocument();
    expect(screen.getByText("SCORE")).toBeInTheDocument();
  });

  test("renders table rows with correct data", () => {
    renderTable();
    expect(
      screen.getByText("hockeystack.com/blog/example1/")
    ).toBeInTheDocument();
    expect(
      screen.getByText("hockeystack.com/blog/example2/")
    ).toBeInTheDocument();
  });

  test("search functionality filters rows", () => {
    renderTable();
    const searchInput = screen.getByPlaceholderText("Search by URL");
    fireEvent.change(searchInput, { target: { value: "example1" } });
    expect(
      screen.getByText("hockeystack.com/blog/example1/")
    ).toBeInTheDocument();
    expect(
      screen.queryByText("hockeystack.com/blog/example2/")
    ).not.toBeInTheDocument();
  });

  test("sorting functionality changes order of rows", () => {
    renderTable();
    const urlHeader = screen.getByText("URL");

    // Check initial order (assuming it's sorted by URL in ascending order)
    let rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("hockeystack.com/blog/example1/");
    expect(rows[2]).toHaveTextContent("hockeystack.com/blog/example2/");

    // First click to sort descending
    fireEvent.click(urlHeader);
    rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("hockeystack.com/blog/example2/");
    expect(rows[2]).toHaveTextContent("hockeystack.com/blog/example1/");

    // Second click to sort ascending again
    fireEvent.click(urlHeader);
    rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("hockeystack.com/blog/example1/");
    expect(rows[2]).toHaveTextContent("hockeystack.com/blog/example2/");
  });
});
