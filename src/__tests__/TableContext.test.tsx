import React from "react";
import { render, act } from "@testing-library/react";
import { TableProvider, useTableContext } from "@/context/TableContext";

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

const TestComponent = () => {
  const context = useTableContext();
  return (
    <div>
      <div data-testid="currentPage">{context.currentPage}</div>
      <div data-testid="sortColumn">{context.sortColumn}</div>
      <div data-testid="sortDirection">{context.sortDirection}</div>
      <button onClick={() => context.setCurrentPage(2)}>Next Page</button>
      <button onClick={() => context.setSortColumn("totalCount")}>
        Sort by Total Count
      </button>
      <button onClick={() => context.setSortDirection("desc")}>
        Sort Descending
      </button>
    </div>
  );
};

describe("TableContext", () => {
  test("provides initial context values", () => {
    const { getByTestId } = render(
      <TableProvider initialData={mockData}>
        <TestComponent />
      </TableProvider>
    );

    expect(getByTestId("currentPage")).toHaveTextContent("1");
    expect(getByTestId("sortColumn")).toHaveTextContent("url");
    expect(getByTestId("sortDirection")).toHaveTextContent("asc");
  });

  test("updates context values when actions are dispatched", () => {
    const { getByTestId, getByText } = render(
      <TableProvider initialData={mockData}>
        <TestComponent />
      </TableProvider>
    );

    act(() => {
      getByText("Next Page").click();
    });
    expect(getByTestId("currentPage")).toHaveTextContent("2");

    act(() => {
      getByText("Sort by Total Count").click();
    });
    expect(getByTestId("sortColumn")).toHaveTextContent("totalCount");

    act(() => {
      getByText("Sort Descending").click();
    });
    expect(getByTestId("sortDirection")).toHaveTextContent("desc");
  });
});
