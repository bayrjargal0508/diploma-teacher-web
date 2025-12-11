"use client";

import { Label } from "@/components/ui/label";

type AnswerType = "truefalse" | "multiple" | null;

interface Props {
  value: AnswerType;
  onChange: (type: AnswerType) => void;
}

export default function AnswerTypeDropdown({ value, onChange }: Props) {
  return (
    <div className="flex gap-3 my-3">
      <button
        type="button"
        onClick={() => onChange("truefalse")}
        className={`flex gap-3 border px-5 py-2 rounded-[10px] transition-colors ${
          value === "truefalse"
            ? "border-primary bg-primary/20"
            : "border-primary hover:bg-primary/10"
        }`}
      >
        <Label className="font-medium">Үнэн / Худал</Label>
      </button>
      <button
        type="button"
        onClick={() => onChange("multiple")}
        className={`flex gap-3 border px-5 py-2 rounded-[10px] transition-colors ${
          value === "multiple"
            ? "border-primary bg-primary/20"
            : "border-primary hover:bg-primary/10"
        }`}
      >
        <Label className="font-medium">Олон хариулттай</Label>
      </button>
    </div>
  );
}
