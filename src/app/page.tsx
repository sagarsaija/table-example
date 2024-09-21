import { TableProvider } from "@/context/TableContext";
import Table from "@/components/table/Table";
import pagesData from "@/data/pages.json";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <TableProvider initialData={pagesData}>
          <Table />
        </TableProvider>
      </div>
      <div className="fixed bottom-4 right-4">
        <ThemeToggle />
      </div>
    </main>
  );
}
