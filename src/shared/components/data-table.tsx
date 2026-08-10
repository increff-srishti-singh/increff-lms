"use client";

import React from "react";
import Link from "next/link";

interface DataTableProps {
  headers: string[];
  rows: React.ReactNode[][];
  emptyMessage?: string;
}

export function DataTable({ headers, rows, emptyMessage = "No results" }: DataTableProps) {
  return (
    <div className="bg-white border border-slate-200 rounded overflow-auto">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className="bg-slate-100 text-left px-3 py-2.5 font-semibold border-b border-slate-300 whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length}
                className="text-center text-slate-400 py-12 text-sm"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci} className="px-3 py-3 border-b border-slate-100 text-slate-700">
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
