"use client";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

interface BetResult {
  date: string;
  country: string;
  course: string;
  time: string;
  selection: string;
  result: string;
  bsp: number;
  stake: number;
  liability: number;
  pl: number;
  runningPL: number;
}

interface ResultsTableProps {
  data: BetResult[];
  hasMore: boolean;
  onLoadMore: () => void;
  loading?: boolean;
}

// Format points helper (2 decimal places)
function formatCurrency(num: number): string {
  return num.toFixed(2);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const columns: ColumnDef<BetResult>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => formatDate(row.getValue("date")),
  },
  {
    accessorKey: "country",
    header: "Country",
  },
  {
    accessorKey: "course",
    header: "Course",
  },
  {
    accessorKey: "time",
    header: "Time",
  },
  {
    accessorKey: "selection",
    header: "Selection",
  },
  {
    accessorKey: "result",
    header: "Result",
    cell: ({ row }) => {
      // console.log("row", row);
      const result = row.getValue("result") as string;
      return (
        <span
          className={
            result === "LOST" || result === "PLACED"
              ? "text-green font-semibold"
              : "text-red-600 font-semibold"
          }
        >
          {result}
        </span>
      );
    },
  },
  {
    accessorKey: "bsp",
    header: "BSP",
    cell: ({ row }) => (row.getValue("bsp") as number).toFixed(2),
  },
  {
    accessorKey: "stake",
    header: "Stake",
    cell: ({ row }) => formatCurrency(row.getValue("stake")),
  },
  {
    accessorKey: "liability",
    header: "Liability",
    cell: ({ row }) => formatCurrency(row.getValue("liability")),
  },
  {
    accessorKey: "pl",
    header: "P/L",
    cell: ({ row }) => {
      const pl = row.getValue("pl") as number;
      return (
        <span className={pl >= 0 ? "text-green" : "text-red-600"}>
          {pl >= 0 ? "+" : ""}
          {formatCurrency(pl)}
        </span>
      );
    },
  },
  {
    accessorKey: "runningPL",
    header: "Running P/L",
    cell: ({ row }) => {
      const runningPL = row.getValue("runningPL") as number;
      return (
        <span className={runningPL >= 0 ? "text-green" : "text-red-600"}>
          {runningPL >= 0 ? "+" : ""}
          {formatCurrency(runningPL)}
        </span>
      );
    },
  },
];

export function ResultsTable({
  data,
  hasMore,
  onLoadMore,
  loading = false,
}: ResultsTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8">
      <div className="overflow-x-auto -mx-6 sm:-mx-8 px-6 sm:px-8">
        <table className="w-full min-w-[800px]">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-gray-200">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-left py-3 px-4 text-sm font-semibold text-dark-navy whitespace-nowrap"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="py-3 px-4 text-sm text-dark-navy whitespace-nowrap"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && !loading && (
        <div className="text-center py-12 text-dark-navy">
          No results available
        </div>
      )}

      {hasMore && (
        <div className="mt-6 text-center">
          <Button
            variant="default"
            size="lg"
            onClick={onLoadMore}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More Results"}
          </Button>
        </div>
      )}
    </div>
  );
}
