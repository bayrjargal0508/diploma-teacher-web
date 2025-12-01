import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { classroom, sendExamToClassroom } from "@/actions";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Classroom } from "@/lib/types";
import { toast } from "react-toastify";
import { X } from "lucide-react";

interface Types {
  onClose: () => void;
  onSuccess?: () => void;
  examMetadataId: string;
}

const ExamSendModal = ({ onClose, examMetadataId }: Types) => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [startDate, setStartDate] = useState("");
  const [finishDate, setFinishDate] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(
    null
  );

  useEffect(() => {
    const load = async () => {
      const res = await classroom();

      if (res.result && Array.isArray(res.data)) {
        setClassrooms(res.data);
      } else {
        setClassrooms([]);
      }
    };

    load();
  }, []);

  const formatDate = (value: string) => {
    if (!value) return "";
    const date = new Date(value);

    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");

    return `${yyyy}-${MM}-${dd} ${hh}:${mm}`;
  };

  const handleSend = async () => {
    if (!selectedClassroom) {
      toast.error("Ангиа сонгоно уу!");
      return;
    }
    if (!startDate || !finishDate) {
      toast.error("Огноо бөглөнө үү!");
      return;
    }

    setLoadingSubmit(true);

    const res = await sendExamToClassroom(
      selectedClassroom.id,
      examMetadataId,
      formatDate(startDate),
      formatDate(finishDate)
    );

    setLoadingSubmit(false);

    if (res?.result) {
      toast.success("Амжилттай илгээлээ!");
      onClose();
    } else {
      toast.error(res?.message || "Амжилтгүй боллоо");
    }
  };

  return (
    <div
      id="popup-modal"
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 px-4 w-full"
      onClick={onClose}
    >
      <div
        className="bg-background w-[500px] border rounded-2xl p-5 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <p className="title text-left">Шалгалт илгээх</p>
          <X size={16} onClick={onClose} className="cursor-pointer" />
        </div>
        <div>
          <p className="subTitle pb-2">Анги сонгох</p>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Input
                readOnly
                value={selectedClassroom?.alias || "Ангиа сонгоно уу"}
                className="cursor-pointer text-left"
              />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="z-9999 text-left w-full"
              align="start"
            >
              {classrooms.map((room) => (
                <DropdownMenuItem
                  key={room.id}
                  onSelect={() => setSelectedClassroom(room)}
                >
                  {room.alias}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex justify-between gap-5">
          <div className="flex flex-col gap-2">
            <p className="subTitle">Эхлэх огноо</p>
            <input
              type="datetime-local"
              placeholder="2025.10.14 / 10:00"
              className="border border-stroke-border p-2 rounded-lg w-[220px]"
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className="subTitle">Дуусах огноо</p>
            <input
              type="datetime-local"
              className="border border-stroke-border p-2 rounded-lg w-[220px]"
              onChange={(e) => setFinishDate(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button variant="secondary" onClick={onClose}>
            Буцах
          </Button>

          <Button
            className="w-32"
            onClick={handleSend}
            disabled={loadingSubmit}
          >
            {loadingSubmit ? "Илгээж байна..." : "Шалгалт илгээх"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExamSendModal;
