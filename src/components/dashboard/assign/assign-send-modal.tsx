import { classroom, getStudents } from "@/actions";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Classroom, Students } from "@/lib/types";
import { toast } from "react-toastify";
import { X, ChevronDown, Dot } from "lucide-react";
import { I18nProvider } from "@react-aria/i18n";
import { Button } from "@/components/ui/button";

interface Types {
  onClose: () => void;
  onSuccess?: () => void;
  assignId: string;
}

const AssignSendModal = ({ onClose, assignId }: Types) => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(
    null
  );
  const [studentlist, setStudentlist] = useState<Students[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(
    new Set()
  );

  // Load classrooms on mount
  useEffect(() => {
    const load = async () => {
      try {
        const res = await classroom();
        if (res.result && Array.isArray(res.data)) {
          setClassrooms(res.data);
        } else {
          setClassrooms([]);
        }
      } catch (error) {
        console.error("Error loading classrooms:", error);
        toast.error("Ангийн жагсаалт татахад алдаа гарлаа");
        setClassrooms([]);
      }
    };
    load();
  }, []);

  // Load students when classroom changes
  useEffect(() => {
    const loadStudents = async () => {
      // Reset states when no classroom is selected
      if (!selectedClassroom) {
        setStudentlist([]);
        setSelectedStudents(new Set());
        return;
      }

      setLoadingStudents(true);
      setSelectedStudents(new Set());

      try {
        console.log("Loading students for classroom:", selectedClassroom.id);

        const res = await getStudents(selectedClassroom.id);

        console.log("Students response:", res);

        // The students are in res.data.list, not res.data directly
        // Type assertion to handle the nested list structure
        const responseData = res.data as { list?: Students[] };

        if (
          res.result &&
          responseData?.list &&
          Array.isArray(responseData.list)
        ) {
          setStudentlist(responseData.list);
          console.log("Students loaded:", responseData.list.length);
        } else {
          setStudentlist([]);
          console.log("No students found or invalid response");
        }
      } catch (error) {
        console.error("Error loading students:", error);
        setStudentlist([]);
        toast.error("Сурагчдын жагсаалт татахад алдаа гарлаа");
      } finally {
        setLoadingStudents(false);
      }
    };

    loadStudents();
  }, [selectedClassroom]);

  const handleSend = async () => {
    if (!selectedClassroom) {
      toast.error("Ангиа сонгоно уу!");
      return;
    }
    if (selectedStudents.size === 0) {
      toast.error("Сурагч сонгоно уу!");
      return;
    }

    setLoadingSubmit(true);
    try {
      const studentIds = Array.from(selectedStudents);

      console.log("Sending assignment:", {
        assignId,
        classroomId: selectedClassroom.id,
        studentIds,
      });

      // Add your API call here
      // await sendAssignment(assignId, selectedClassroom.id, studentIds);

      toast.success("Даалгавар амжилттай илгээгдлээ!");
      onClose();
    } catch (error) {
      console.error("Error sending assignment:", error);
      toast.error("Даалгавар илгээхэд алдаа гарлаа");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudents((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(studentId)) {
        newSelected.delete(studentId);
      } else {
        newSelected.add(studentId);
      }
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    if (!studentlist || studentlist.length === 0) return;

    setSelectedStudents((prev) => {
      if (prev.size === studentlist.length) {
        return new Set(); // Deselect all
      } else {
        return new Set(studentlist.map((s) => s.id)); // Select all
      }
    });
  };

  return (
    <I18nProvider locale="mn-MN">
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-label-caption hover:text-gray-700"
          >
            <X size={20} />
          </button>

          <h2 className="mb-6 text-xl font-semibold">Даалгавар илгээх</h2>

          <div className="space-y-4">
            {/* Classroom Selection */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Анги сонгох
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-full justify-between flex border border-stroke-border items-center px-2 py-3 rounded-[10px]">
                    <span>
                      {selectedClassroom
                        ? selectedClassroom.alias
                        : "Анги сонгоно уу"}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-full bg-background-secondary"
                >
                  {classrooms.length === 0 ? (
                    <div className="px-2 py-1.5 text-sm text-label-caption">
                      Анги олдсонгүй
                    </div>
                  ) : (
                    classrooms.map((room) => (
                      <DropdownMenuItem
                        key={room.id}
                        onClick={() => setSelectedClassroom(room)}
                        className={
                          selectedClassroom?.id === room.id ? "bg-gray-100" : ""
                        }
                      >
                        {room.alias}
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Students List */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Сурагчид
                {studentlist.length > 0 && (
                  <span className="ml-2 text-xs text-label-caption">
                    ({selectedStudents.size}/{studentlist.length} сонгосон)
                  </span>
                )}
              </label>
              <div className="max-h-60 overflow-y-auto rounded border border-gray-200 p-2">
                {!selectedClassroom ? (
                  <p className="text-sm text-label-caption p-2">
                    Эхлээд анги сонгоно уу
                  </p>
                ) : loadingStudents ? (
                  <p className="text-sm text-label-caption p-2">
                    Уншиж байна...
                  </p>
                ) : studentlist.length > 0 ? (
                  <div className="space-y-1">
                    <div className="mb-2 flex items-center space-x-2 border-b pb-2">
                      <input
                        type="checkbox"
                        id="select-all"
                        className="h-4 w-4 cursor-pointer"
                        checked={
                          selectedStudents.size === studentlist.length &&
                          studentlist.length > 0
                        }
                        onChange={handleSelectAll}
                      />
                      <label
                        htmlFor="select-all"
                        className="cursor-pointer text-sm font-medium select-none"
                      >
                        Бүгдийг сонгох
                      </label>
                    </div>
                    {studentlist.map((studentData) => (
                      <div
                        key={studentData.id}
                        className="flex items-center space-x-2 rounded p-2 hover:bg-gray-50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          id={`student-${studentData.id}`}
                          className="h-4 w-4 cursor-pointer"
                          checked={selectedStudents.has(studentData.id)}
                          onChange={() => handleStudentToggle(studentData.id)}
                        />
                        <label
                          htmlFor={`student-${studentData.id}`}
                          className="flex-1 flex items-center gap-3 cursor-pointer text-sm select-none"
                        >
                          {studentData.student.lastName}{" "}
                          {studentData.student.firstName}
                          {studentData.student.premium && (
                            <span className="flex items-center gap-1 bg-[#DBF4E6] text-[#41C993] border border-[#41C993] px-2 py-1 rounded-full text-[12px] w-fit">
                              <Dot className="w-5 h-5" />
                              Эрхтэй
                            </span>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-label-caption p-2">
                    Энэ ангид сурагч олдсонгүй
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-between gap-2 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={loadingSubmit}
              >
                Буцах
              </Button>
              <Button
                onClick={handleSend}
                disabled={loadingSubmit || selectedStudents.size === 0}
              >
                {loadingSubmit ? "Илгээж байна..." : "Даалгавар илгээх"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </I18nProvider>
  );
};

export default AssignSendModal;
