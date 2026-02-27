import { useMemo, useState } from "react";
import { ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyStateCard } from "@/sos/components/common";

export interface DataTableColumn<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render: (row: T) => React.ReactNode;
  sortValue?: (row: T) => string | number;
  mobileLabel?: string;
}

interface DataTableProps<T> {
  rows: T[];
  columns: DataTableColumn<T>[];
  rowKey: (row: T) => string;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function DataTable<T>({
  rows,
  columns,
  rowKey,
  emptyTitle,
  emptyDescription,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const sortedRows = useMemo(() => {
    if (!sortKey) return rows;

    const column = columns.find((entry) => entry.key === sortKey);
    if (!column || !column.sortValue) return rows;

    return [...rows].sort((a, b) => {
      const left = column.sortValue?.(a) ?? "";
      const right = column.sortValue?.(b) ?? "";

      if (left === right) return 0;
      const base = left > right ? 1 : -1;
      return sortDirection === "asc" ? base : -base;
    });
  }, [columns, rows, sortDirection, sortKey]);

  const onSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDirection("asc");
  };

  if (!rows.length) {
    return (
      <EmptyStateCard
        title={emptyTitle || "No records"}
        description={emptyDescription || "Data will appear once activity starts."}
      />
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 md:block">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>
                  {column.sortable ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto px-0 text-xs font-semibold uppercase tracking-wide text-slate-500"
                      onClick={() => onSort(column.key)}
                    >
                      {column.label}
                      {sortKey === column.key ? (
                        sortDirection === "asc" ? (
                          <ArrowUpWideNarrow className="ml-1 h-3.5 w-3.5" />
                        ) : (
                          <ArrowDownWideNarrow className="ml-1 h-3.5 w-3.5" />
                        )
                      ) : null}
                    </Button>
                  ) : (
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {column.label}
                    </span>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRows.map((row) => (
              <TableRow key={rowKey(row)}>
                {columns.map((column) => (
                  <TableCell key={column.key}>{column.render(row)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-2 md:hidden">
        {sortedRows.map((row) => (
          <div key={rowKey(row)} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            {columns.map((column) => (
              <div key={column.key} className="flex items-center justify-between gap-2 py-1">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {column.mobileLabel || column.label}
                </span>
                <span className="text-sm text-slate-700">{column.render(row)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
