import type { ReactNode } from "react";
import { Pagination, type PaginationProps } from "./Pagination";

interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
  hideOnMobile?: boolean;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  empty?: ReactNode;
  pagination?: PaginationProps;
  wrapperClassName?: string;
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  empty,
  pagination,
  wrapperClassName,
}: TableProps<T>) {
  if (data.length === 0) {
    return (
      <>
        <div className="py-12 text-center text-sm text-slate-400">
          {empty ?? "No data available"}
        </div>
        {pagination && <Pagination {...pagination} />}
      </>
    );
  }

  return (
    <div className={wrapperClassName}>
      <div className="overflow-x-auto rounded-box border border-base-content/5">
        <table className="w-full text-left text-sm table">
          <thead className="bg-gray-100">
            <tr className="border-b border-slate-200">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 font-medium text-slate-500 ${col.hideOnMobile ? "hidden md:table-cell" : ""} ${col.className ?? ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row) => (
              <tr key={rowKey(row)} className="hover:bg-slate-50">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3 text-slate-700 ${col.hideOnMobile ? "hidden md:table-cell" : ""} ${col.className ?? ""}`}
                  >
                    {col.render ? col.render(row) : String(row[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination && <Pagination {...pagination} />}
    </div>
  );
}
