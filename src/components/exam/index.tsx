"use client";
import { useCallback, useEffect, useState } from "react";
import { examMetadata } from "@/actions";
import { ExamListResponse } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Edit, FunnelIcon, Loader2, Plus, Send, Trash } from "lucide-react";
import MenuSidebar from "../icons/menu-icon";
import CreateExam from "./create-exam-modal";
import { useRouter } from "next/navigation";
import DateIcon from "../icons/date-icon";
import TimeIcon from "../icons/time-icon";
import BookQueue from "../icons/book-queue.";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ExamSendModal from "./exam-send-modal";
import ExamDeleteModal from "./delete-exam";
import EditExamMetadata from "./edit-metadata";
import Pagination from "../ui/pagination";
import { useTitleContext } from "../providers/title-provider";

type DataStatus = "PROCESSED" | "PROCESSING";

const ExamList = () => {
  const [exams, setExams] = useState<ExamListResponse["list"]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenSend, setIsOpenSend] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const router = useRouter();
  const { setTitle } = useTitleContext();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [teacherQuestionCounts, setTeacherQuestionCounts] = useState<
    Record<string, number>
  >({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await examMetadata(page, pageSize);
      const list = res?.data?.list ?? [];
      const totalCount = res?.data?.pagination?.total ?? 0;

      setExams(list);
      setTotal(totalCount);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    let cancelled = false;
    const teacherExams = exams.filter(
      (exam) => exam.type === "TEACHER_LIBRARY"
    );

    if (teacherExams.length === 0) {
      setTeacherQuestionCounts({});
      return;
    }

    const controller = new AbortController();

    const loadTeacherCounts = async () => {
      try {
        const entries = await Promise.all(
          teacherExams.map(async (exam) => {
            try {
              const res = await fetch(
                `http://localhost:4000/api/exams/questions?examId=${exam.id}`,
                { signal: controller.signal }
              );
              if (!res.ok) {
                throw new Error("Failed to fetch teacher library questions");
              }
              const data = await res.json();
              return [
                exam.id,
                Array.isArray(data) ? data.length : 0,
              ] as const;
            } catch (err) {
              if ((err as Error).name === "AbortError") {
                return [exam.id, 0] as const;
              }
              console.error("Failed to fetch question count:", err);
              return [exam.id, 0] as const;
            }
          })
        );

        if (!cancelled) {
          setTeacherQuestionCounts((prev) => {
            const next = { ...prev };
            entries.forEach(([id, count]) => {
              next[id] = count;
            });
            return next;
          });
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error(err);
        }
      }
    };

    loadTeacherCounts();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [exams]);

  const openDeleteModal = (id: string) => {
    setSelectedId(id);
    setIsDeleteOpen(true);
  };

  const handleClick = (examId: string) => {
    router.push(`/dashboard/exam/${examId}?examMetaName`);
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const statusLabel: Record<DataStatus, string> = {
    PROCESSED: "Дууссан",
    PROCESSING: "Үргэлжлүүлэх",
  };
  const statusColor: Record<DataStatus, string> = {
    PROCESSED: "text-positive border px-2 py-1 rounded-xl bg-[#DBF4E6]",
    PROCESSING: "text-negative border px-2 py-1 rounded-xl bg-[#E59698]",
  };
  if (exams.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen w-full bg-background rounded-[10px]">
        <div className="flex flex-col items-center text-center p-5 w-[300px] space-y-2">
          <Image
            src="/assets/photos/empty-monster.png"
            alt="empty monster image"
            width={250}
            height={150}
            className="mb-4"
          />
          <p className="title">Одоогоор шалгалтын асуулт үүсгээгүй байна.</p>
          <p className="text-label-paragraph paragraphText max-w-md">
            Та Yesh.mn-ийн тестийн сангаас тухайн хичээлийн агуулгаар нь
            шалгалтын асуулт үүсгэх боломжтой.
          </p>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => setIsOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Асуулт үүсгэх
          </Button>
          {isOpen && <CreateExam onClose={() => setIsOpen(false)} />}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background p-5 rounded-[10px] min-h-screen">
      <div className="flex gap-2 mb-3 justify-between items-center px-1">
        <p className="title ">Таны үүсгэсэн шалгалтууд</p>
        <div className="flex gap-2">
          <Button variant="secondary" className="">
            <FunnelIcon />
          </Button>
          <Button
            variant="secondary"
            className="w-36"
            onClick={() => setIsOpen(true)}
          >
            <Plus />
            Шалгалт нээх
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg bg-background-secondary">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="text-sm text-label-caption">
            <tr>
              <th className="px-4 py-3 font-medium w-[200px]">Шалгалтын нэр</th>
              <th className="px-4 py-3 font-medium w-[120px]">Вариант</th>
              <th className="px-4 py-3 font-medium w-[180px]">
                Шалгалт үүсгэсэн огноо
              </th>
              <th className="px-4 py-3 font-medium w-[100px]">Анги</th>
              <th className="px-4 py-3 font-medium w-[130px]">Асуултын тоо</th>
              <th className="px-4 py-3 font-medium w-[130px]">Хугацаа</th>
              <th className="px-4 py-3 font-medium w-[130px]">Үйл явц</th>
              <th className="px-4 py-3 font-medium w-20 text-right">Үйлдэл</th>
            </tr>
          </thead>

          <tbody>
            {exams.map((exam) => {
              const teacherCreatedCount =
                teacherQuestionCounts[exam.id] ?? 0;
              const questionSummary =
                exam.type === "TEACHER_LIBRARY"
                  ? `${teacherCreatedCount}/${exam.questionCount} Асуулт`
                  : `${exam.questionCount} Асуулт`;
              const computedStatus: DataStatus =
                exam.type === "TEACHER_LIBRARY"
                  ? teacherCreatedCount >= exam.questionCount
                    ? "PROCESSED"
                    : "PROCESSING"
                  : exam.dataStatus;

              return (
              <DropdownMenu
                key={exam.id}
                onOpenChange={(open) => setSelectedRowId(open ? exam.id : null)}
              >
                <tr
                  className={`text-foreground border-t border-stroke-border ${
                    selectedRowId === exam.id ? "bg-accent" : "hover:bg-accent"
                  }`}
                >
                  <td
                    onClick={() => {
                      setTitle(exam.name);
                      handleClick(exam.id);
                    }}
                    className="px-4 py-3 align-middle hover:underline cursor-pointer hover:text-primary "
                  >
                    {exam.name}
                  </td>

                  <td className="px-4 py-3 align-middle">
                    {exam.variantCount}
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <p className="flex gap-2.5">
                      <DateIcon className="text-label-caption" />
                      <span>{exam.createdDateText}</span>
                    </p>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    {exam.classNumber}-р анги
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <p className="flex gap-2.5">
                      <BookQueue className="text-label-caption" />
                      <span>{questionSummary}</span>
                    </p>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <p className="flex gap-2.5">
                      <TimeIcon className="text-label-caption" />
                      <span> {exam.duration} Минут</span>
                    </p>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <p className="flex gap-2.5">
                      <span className={statusColor[computedStatus]}>
                        {statusLabel[computedStatus]}
                      </span>
                    </p>
                  </td>

                  <td className="px-4 py-3 align-middle text-right">
                    <DropdownMenuTrigger asChild>
                      <button
                        title="menu"
                        className="cursor-pointer hover:bg-background-secondary px-[15px] py-2.5 rounded-[10px] active:bg-background-secondary focus:outline-none"
                      >
                        <MenuSidebar />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      side="bottom"
                      align="end"
                      className="w-48 p-2 border border-stroke-line rounded-[10px] bg-background-secondary"
                    >
                      <DropdownMenuItem>
                        <p
                          className="flex items-center justify-start gap-1.5 text-sm font-semibold"
                          onClick={() => {
                            setSelectedExamId(exam.id);
                            setIsOpenSend(true);
                          }}
                        >
                          <Send size={16} /> Шалгалт авах
                        </p>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="mt-2.5"
                        onClick={() => {
                          setSelectedExamId(exam.id);
                          setIsOpenEdit(true);
                        }}
                      >
                        <p className="flex items-center justify-start gap-1.5 text-sm font-semibold">
                          <Edit size={16} />
                          Шалгалт засах
                        </p>
                      </DropdownMenuItem>

                      <DropdownMenuItem className="mt-2.5">
                        <p
                          className="flex items-center justify-start gap-1.5 text-negative text-sm font-semibold"
                          onClick={() => openDeleteModal(exam.id)}
                        >
                          <Trash size={16} />
                          Устгах
                        </p>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </td>
                </tr>
              </DropdownMenu>
            );
            })}
          </tbody>
        </table>
      </div>
      <div className="pt-3 px-1">
        <Pagination
          total={total}
          page={page}
          pageSize={pageSize}
          pageSizeList={[10, 20, 30]}
          onPageChange={(p) => setPage(p)}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </div>
      <div>
        {isDeleteOpen && selectedId && (
          <ExamDeleteModal
            id={selectedId}
            onClose={() => setIsDeleteOpen(false)}
            onSuccess={() => {
              fetchData();
            }}
          />
        )}
      </div>
      {isOpenSend && selectedExamId && (
        <ExamSendModal
          examMetadataId={selectedExamId}
          onClose={() => setIsOpenSend(false)}
        />
      )}

      {isOpen && (
        <CreateExam
          onClose={() => setIsOpen(false)}
          onSuccess={() => fetchData()}
        />
      )}
      {isOpenEdit && (
        <EditExamMetadata
          onClose={() => setIsOpenEdit(false)}
          examId={selectedExamId}
        />
      )}
    </div>
  );
};

export default ExamList;
