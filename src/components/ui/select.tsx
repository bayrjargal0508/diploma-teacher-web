"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  placeholder?: string;
  className?: string;
}

export function Select({ value, children, placeholder }: SelectProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative inline-block w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span>{value || placeholder || "Select"}</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {open && (
        <div
          className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg"
          onMouseLeave={() => setOpen(false)}
        >
          <div className="py-1">{children}</div>
        </div>
      )}
    </div>
  );
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function SelectItem({
  value,
  children,
  onSelect,
}: {
  value: string;
  children: React.ReactNode;
  onSelect?: (value: string) => void;
}) {
  return (
    <div
      className="cursor-pointer px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-10"
      onClick={() => onSelect?.(value)}
    >
      {children}
    </div>
  );
}

export function SelectTrigger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("w-full", className)}>{children}</div>;
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  return <span>{placeholder || "Select..."}</span>;
}
