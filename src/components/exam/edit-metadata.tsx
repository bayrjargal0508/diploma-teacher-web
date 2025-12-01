import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ChevronDown, X } from "lucide-react";
import { editExamMetadata } from "@/actions";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useForm } from "react-hook-form";

interface Types {
  onClose: () => void;
  examId: string | null;
  examData?: {
    id: string;
    name: string;
    description: string;
    classNumber: number;
    type: "SHUFFLE" | "YESH_LIBRARY" | "TEACHER_LIBRARY";
    duration: number;
    questionCount: number;
    variantCount: number;
  };
}

interface FormValues {
  id: string;
  name: string;
  description: string;
  type: "SHUFFLE" | "YESH_LIBRARY" | "TEACHER_LIBRARY";
  classNumber: number;
  variantCount: string;
  questionCount: string;
  duration: string;
}

const EditExamMetadata = ({ onClose, examId, examData }: Types) => {
  const { setValue, watch } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      type: examData?.type || "SHUFFLE",
      classNumber: 12,
      variantCount: examData?.variantCount?.toString() || "2",
    },
  });

  const selectedType = watch("type");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    id: examData?.id || "",
    name: examData?.name || "",
    description: examData?.description || "",
    type: (examData?.type || "SHUFFLE") as
      | "SHUFFLE"
      | "YESH_LIBRARY"
      | "TEACHER_LIBRARY",
    duration: examData?.duration?.toString() || "",
    classNumber: examData?.classNumber?.toString() || "",
    questionCount: examData?.questionCount?.toString() || "",
    variantCount: examData?.variantCount?.toString() || "",
  });

  useEffect(() => {
    if (examData) {
      setForm({
        id: examData.id || "",
        name: examData.name || "",
        description: examData.description || "",
        type: examData.type || "SHUFFLE",
        classNumber: examData.classNumber?.toString() || "",
        duration: examData.duration?.toString() || "",
        questionCount: examData.questionCount?.toString() || "",
        variantCount: examData.variantCount?.toString() || "",
      });
      setValue("type", examData.type || "SHUFFLE");
    }
  }, [examData, setValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!examId) {
      console.error("examId алга");
      toast.error("Шалгалтын ID олдсонгүй");
      setLoading(false);
      return;
    }

    if (
      !form.type ||
      !["SHUFFLE", "YESH_LIBRARY", "TEACHER_LIBRARY"].includes(form.type)
    ) {
      toast.error("Шалгалтын төрөл сонгоно уу");
      setLoading(false);
      return;
    }

    const payload = {
      id: examId,
      name: form.name,
      description: form.description,
      type: form.type,
      classNumber: form.classNumber,
      duration: Number(form.duration),
      questionCount: Number(form.questionCount),
      variantCount: Number(form.variantCount),
    };

    try {
      const res = await editExamMetadata(payload);
      if (res.result) {
        toast.success("Амжилттай хадгаллаа");
        onClose();
      } else {
        toast.error(res.message || "Алдаа гарлаа. Дахин оролдоно уу.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = () => {
    switch (selectedType) {
      case "SHUFFLE":
        return "Шалгалтын асуулт шаафл хийнэ";
      case "YESH_LIBRARY":
        return "Тестийн сан ашиглах";
      case "TEACHER_LIBRARY":
        return "Багшийн сан ашиглах";
      default:
        return "Шалгалт үүсгэх төрөл";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="rounded-lg bg-background-secondary p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Шалгалтын мэдээлэл засах</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-5">
          <div className="space-y-4 ">
            <div>
              <label className="block text-sm font-medium">Нэр засах</label>
              <Input name="name" value={form.name} onChange={handleChange} />
            </div>

            <div>
              <label className="block text-sm font-medium">Анги засах</label>
              <Input
                name="classNumber"
                value={form.classNumber}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Шалгалтын төрөл өөрчлөх
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="px-[15px] py-2 border border-stroke-line w-full rounded-lg flex items-center justify-between">
                    {getTypeLabel()}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-full bg-background-secondary"
                  align="start"
                >
                  <DropdownMenuItem
                    onClick={() => {
                      setValue("type", "SHUFFLE");
                      setForm((prev) => ({ ...prev, type: "SHUFFLE" }));
                    }}
                  >
                    Шалгалтын асуулт шаафл хийнэ
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setValue("type", "YESH_LIBRARY");
                      setForm((prev) => ({ ...prev, type: "YESH_LIBRARY" }));
                    }}
                  >
                    Тестийн сан ашиглах
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setValue("type", "TEACHER_LIBRARY");
                      setForm((prev) => ({ ...prev, type: "TEACHER_LIBRARY" }));
                    }}
                  >
                    Багшийн сан ашиглах
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="space-y-4 ">
            <div>
              <label className="block text-sm font-medium">Вариант</label>
              <Input
                name="variantCount"
                type="number"
                value={form.variantCount}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Асуултын тоо</label>
              <Input
                name="questionCount"
                type="number"
                value={form.questionCount}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Тест бөглөх хугацаа
              </label>
              <Input
                name="duration"
                type="number"
                value={form.duration}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-between gap-2">
          <Button variant="secondary" onClick={onClose}>
            Болих
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="w-[100px]">
            {loading ? "Уншиж байна..." : "Хадгалах"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditExamMetadata;
