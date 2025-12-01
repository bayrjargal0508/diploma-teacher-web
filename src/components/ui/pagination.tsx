"use client";

import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

type Props = {
  total: number;
  page: number;
  pageSize: number;
  pageSizeList?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

export default function Pagination({
  total,
  page,
  pageSize,
  pageSizeList = [10, 20, 50],
  onPageChange,
  onPageSizeChange,
}: Props) {
  const totalPages = Math.ceil(total / pageSize);

  const nextPage = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  const prevPage = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const maxVisible = 3;

  const start = Math.max(1, page - Math.floor(maxVisible / 2));
  const end = Math.min(totalPages, start + maxVisible - 1);
  const adjustedStart = Math.max(1, end - maxVisible + 1);

  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-[14px] font-medium">
        Нийт: <span>{total}</span>
      </p>

      <div className="flex items-center gap-2.5">
        <p className="text-[14px] font-medium">Нэг хуудсанд:</p>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="bg-background-secondary flex justify-between items-center p-2.5 rounded-[10px] w-16"
            >
              {pageSize}
              <ChevronDown className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-5 p-2 border border-stroke-line rounded-[10px] bg-background-secondary">
            {pageSizeList.map((size) => (
              <DropdownMenuItem
                key={size}
                onClick={() => {
                  onPageSizeChange(size);
                  onPageChange(1);
                }}
                className="cursor-pointer text-sm font-medium"
              >
                {size}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          onClick={prevPage}
          disabled={page === 1}
          className={`p-2 rounded-lg ${page === 1 ? "opacity-30" : ""}`}
        >
          <ChevronLeft size={18} />
        </button>

        {Array.from({ length: end - adjustedStart + 1 }, (_, i) => {
          const pageNum = adjustedStart + i;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-8 h-8 flex items-center justify-center rounded-xl ${
                page === pageNum
                  ? "bg-background-secondary font-semibold"
                  : "text-gray-400"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={nextPage}
          disabled={page === totalPages}
          className={`p-2 rounded-lg ${page === totalPages ? "opacity-30" : ""}`}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
