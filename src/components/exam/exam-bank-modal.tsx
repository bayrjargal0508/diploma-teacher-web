"use client";

import { useEffect, useState } from "react";
import { X, Search, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ExamItem, PredefinedExamCategory } from "@/lib/types";
import {
  examVarient,
  getPredefinedExams,
  predefinedCategories,
} from "@/actions";
import BookQueue from "../icons/book-queue.";
import { toast } from "react-toastify";

interface Props {
  examId: string;
  variant: string | number;
  onClose: () => void;
  onSuccess?: () => void;
  isOpen: boolean;
}

export default function ExamTestBankModal({
  examId,
  variant,
  onClose,
  onSuccess,
  isOpen,
}: Props) {
  const [variantNumber, setVariantNumber] = useState(Number(variant) || 1);

  const [type, setType] = useState("");
  const [year, setYear] = useState("");
  const [years, setYears] = useState<number[]>([]);
  const [loadingYears, setLoadingYears] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<ExamItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedExam, setSelectedExam] = useState<ExamItem | null>(null);
  const [categories, setCategories] = useState<PredefinedExamCategory[]>([]);

  // === CATEGORY LOAD ===

  useEffect(() => {
    const load = async () => {
      const data = await predefinedCategories();
      setCategories(data ?? []);

      if (data && data.length > 0 && !type) {
        setType(data[0].id);
      }
    };

    load();
  }, []);


  useEffect(() => {
    if (!type || !examId) return;

    setYear("");
    setResults([]);

    const loadYears = async () => {
      setLoadingYears(true);

      try {
        const data = await getPredefinedExams({
          metadataId: examId,
          categoryId: type,
          year: "",
          name: "",
        });

        const yearList = [
          ...new Set(
            (data?.list ?? [])
              .map((item: ExamItem) => Number(item.year))
              .filter((x) => x && x !== 0)
          ),
        ];

        setYears(yearList.sort((a, b) => b - a));
      } finally {
        setLoadingYears(false);
      }
    };

    loadYears();
  }, [type, examId]);

  const handleSearch = async () => {
    const data = await getPredefinedExams({
      metadataId: examId,
      categoryId: type,
      year: year === "0" ? "" : year,
      name: search,
    });

    const q = search.trim().toLowerCase();

    const filtered = data.list.filter((item: ExamItem) => {
      const name = item.name.toLowerCase();

      if (q === "a" || q === "b") {
        return name.endsWith(` ${q}`);
      }

      return name.includes(q);
    });

    setResults(filtered);
  };

  const handleSelect = (item: ExamItem) => {
    setSelectedId(item.id);
    setSelectedExam(item);
  };

  const handleCreate = async () => {
    if (!selectedExam) {
      toast.error("Та нэг сонголт хийнэ үү");
      return;
    }

    try {
      const res = await examVarient(selectedExam.id, examId, variantNumber);
      if (res?.result) {
        toast.success("Амжилттай!");
        onSuccess?.();
        onClose();
      } else {
        toast.error("Амжилтгүй: " + res?.message);
      }
    } catch (error) {
      toast.error(`Алдаа гарлаа ${error}`);
    }
  };

  useEffect(() => {
  setVariantNumber(Number(variant));
}, [variant]);


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 px-4 w-full">
      <div className="bg-background-secondary rounded-2xl shadow-lg w-full max-w-lg p-6 relative space-y-5">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Асуулт нээх</h2>
          <button className="p-1 rounded-full">
            <X size={20} onClick={onClose} className="cursor-pointer" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-medium">Төрөл</label>

            <DropdownMenu>
              <DropdownMenuTrigger className="border border-stroke-border rounded-xl px-3 py-2 flex items-center justify-between">
                <span>
                  {categories.find((c) => c.id === type)?.name ?? "Сонгох"}
                </span>
                <ChevronDown size={18} />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                className="w-full max-h-60 overflow-y-auto bg-background-secondary z-9999"
              >
                {categories.map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    onSelect={() => setType(item.id)}
                  >
                    {item.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-medium">Он сонгох</label>

            <DropdownMenu>
              <DropdownMenuTrigger className="border border-stroke-border rounded-xl px-3 py-2 flex items-center justify-between">
                <span>{year || "Сонгох"}</span>
                <ChevronDown size={18} />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                className="w-full max-h-60 overflow-y-auto bg-background-secondary z-9999"
              >
                {loadingYears && (
                  <div className="p-2 text-center">Уншиж байна...</div>
                )}

                {!loadingYears && years.length === 0 && (
                  <div className="p-2 text-center">Оны мэдээлэл алга</div>
                )}

                {years.map((y) => (
                  <DropdownMenuItem key={y} onSelect={() => setYear(String(y))}>
                    {y}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center border border-stroke-border rounded-xl px-3 py-2 w-full">
            <Search size={20} />
            <input
              value={search}
              placeholder="Хайх"
              onChange={(e) => setSearch(e.target.value)}
              className="w-full outline-none ml-2"
            />
          </div>
          <Button onClick={handleSearch}>Хайх</Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {results.map((item: ExamItem) => (
              <div
                key={item.id}
                onClick={() => handleSelect(item)}
                className="flex items-center justify-between w-full cursor-pointer 
                        border border-stroke-border 
                        border-b-4 
                        rounded-lg p-2.5"
              >
                <p className="flex items-center gap-2">
                  <BookQueue />
                  <span>{item.name}</span>
                </p>
                <input
                  type="checkbox"
                  checked={selectedId === item.id}
                  readOnly
                  className="form-checkbox h-5 w-5 accent-primary"
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between mt-6">
          <Button variant="secondary" onClick={onClose}>
            Буцах
          </Button>

          <Button className="w-[120px]" onClick={handleCreate}>
            Асуулт үүсгэх
          </Button>
        </div>
      </div>
    </div>
  );
}
