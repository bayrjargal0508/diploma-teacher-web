"use client";

import TimeIcon from "../icons/time-icon";
import DateIcon from "../icons/date-icon";
import MenuSidebar from "../icons/menu-icon";
import BookQueue from "../icons/book-queue.";
import { Button } from "../ui/button";
import { Filter, Search } from "lucide-react";
import { toast } from "react-toastify";
import { examClassroomList, classroomExamCount } from "@/actions";
import { useEffect, useState, useRef } from "react";
import {
  ExamDetailType,
  ExamListApiResponse,
  StudentExamResult,
} from "@/lib/types";
import ExamResultModal from "./exam-result-modal";
import Pagination from "../ui/pagination";
import { useExamTotal } from "../providers/exam-total";
import MonsterLottie from "../ui/loader";

interface Types {
  classroomId: string;
}

const ExamTab = ({ classroomId }: Types) => {
  const [examList, setExamList] = useState<ExamListApiResponse>({
    pagination: {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      sortDirection: "ASC",
      sortParams: [],
      current: 1,
    },
    list: [],
  });

  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedExam, setSelectedExam] = useState<ExamDetailType | null>(null);
  const [examCountData, setExamCountData] = useState<
    StudentExamResult[] | null
  >(null);

  const [isLoadingCount, setIsLoadingCount] = useState(false);
  
  const { getTotalForClassroom, setTotalForClassroom } = useExamTotal();
  const total = getTotalForClassroom(classroomId);
  
  const setTotalRef = useRef(setTotalForClassroom);
  setTotalRef.current = setTotalForClassroom;

  useEffect(() => {
    let isMounted = true;

    const fetchExamList = async (
      currentPage: number,
      currentPageSize: number
    ): Promise<ExamListApiResponse> => {
      try {
        const result = await examClassroomList(classroomId);

        if (
          result &&
          typeof result === "object" &&
          "list" in result &&
          "pagination" in result
        ) {
          return result as ExamListApiResponse;
        }

        if (Array.isArray(result)) {
          return {
            pagination: {
              currentPage,
              pageSize: currentPageSize,
              total: result.length,
              sortDirection: "ASC",
              sortParams: [],
              current: currentPage,
            },
            list: result,
          };
        }

        throw new Error("Алдаа гарлаа");
      } catch (error) {
        toast.error(`Сүлжээний алдаа. ${error}`);
        return {
          pagination: {
            currentPage,
            pageSize: currentPageSize,
            total: 0,
            sortDirection: "ASC",
            sortParams: [],
            current: currentPage,
          },
          list: [],
        };
      }
    };

    const load = async () => {
      setIsLoading(true);
      const data = await fetchExamList(page, pageSize);
      if (isMounted) {
        setExamList(data);
        setTotalRef.current(classroomId, data.pagination.total);
        setIsLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [classroomId, page, pageSize]);

  const handleExamClick = async (exam: ExamDetailType) => {
    setSelectedExam(exam);
    setIsLoadingCount(true);
    setOpen(true);

    try {
      const response = await classroomExamCount(classroomId, exam.id);

      if (Array.isArray(response)) {
        setExamCountData(null);
        toast.error("Өгөгдөл олдсонгүй.");
        return;
      }

      if (response?.data && Array.isArray(response.data)) {
        setExamCountData(response.data);
      } else {
        setExamCountData(null);
        toast.error("Мэдээлэл олдсонгүй.");
      }
    } catch (error) {
      toast.error(`Мэдээлэл татахад алдаа гарлаа. ${error}`);
      setExamCountData(null);
    } finally {
      setIsLoadingCount(false);
    }
  };

  const formatDate = (iso: string | null) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return d
      .toLocaleString("en-CA", { hour12: false })
      .replace(",", "")
      .slice(0, 16);
  };

  if (isLoading)
    return (
      <div className="flex flex-1 items-center justify-center">
        <MonsterLottie />
      </div>
    );

  return (
    <div className="flex flex-col gap-4 mb-5 h-screen">
      <div className="flex justify-between items-center">
        <p className="font-extrabold text-[18px] text-primary-fifth">
          <span className="text-primary pr-2.5">{total}</span> Шалгалт
        </p>

        <div className="flex gap-2.5 items-center">
          <Button
            variant="secondary"
            size="sm"
            className="font-bold flex items-center text-[12px]"
          >
            <Filter />
            Шүүлтүүр
          </Button>

          <div className="relative h-10 w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-background_secondary" />
            <input
              type="text"
              placeholder="Хайх"
              className="pl-10 pr-3 rounded-lg border border-gray-300 h-full w-full text-[16px] leading-6
              font-semibold placeholder:text-gray-400 focus:border-primary_primary focus:outline-none dark:bg-[#313437]"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="overflow-hidden rounded-[10px] border border-background">
          <table className="bg-background-secondary w-full">
            <thead className="border-background border-b">
              <tr className="text-label-caption font-medium text-[14px] leading-[18px]">
                <th className="py-[15px] px-5 min-w-[180px] text-left">
                  Тестийн нэр
                </th>
                <th className="py-[15px] px-5 min-w-40 text-left">Төлөв</th>
                <th className="py-[15px] px-5 min-w-40 text-left">
                  Эхлэх оноо
                </th>
                <th className="py-[15px] px-5 min-w-40 text-left">
                  Дуусах оноо
                </th>
                <th className="py-[15px] px-5 min-w-40 text-left">
                  Асуултын оноо
                </th>
                <th className="py-[15px] px-5 min-w-40 text-left">Хугацаа</th>
                <th className="py-[15px] px-5 min-w-[100px] text-left">
                  Үйлдэл
                </th>
              </tr>
            </thead>

            <tbody className="text-[14px] font-semibold">
              {examList.list.length > 0 ? (
                examList.list.map((item: ExamDetailType) => (
                  <tr
                    key={item.id}
                    className="border-b border-background hover:bg-accent dark:hover:accent"
                  >
                    <td
                      className="py-[15px] px-5 min-w-[180px] text-left hover:text-primary cursor-pointer hover:underline"
                      onClick={() => handleExamClick(item)}
                    >
                      {item.name}
                    </td>

                    <td className="py-[15px] px-5 text-left">
                      {item.status === "INACTIVE" && (
                        <span className="bg-[#D8EEFB] text-[#00A5E3] border border-[#00A5E3] px-3.5 py-1 rounded-full text-[12px]">
                          Идэвхгүй
                        </span>
                      )}
                      {item.status === "ACTIVE" && (
                        <span className="bg-[#DBF4E6] text-[#78D5AA] border border-[#78D5AA] px-3.5 py-1 rounded-full text-[12px]">
                          Идэвхтэй
                        </span>
                      )}
                      {item.status === "CLOSED" && (
                        <span className="bg-[#E5D6D5] text-[#E59698] border border-[#E59698] px-3.5 py-1 rounded-full text-[12px]">
                          Дууссан
                        </span>
                      )}
                    </td>

                    <td className="py-[15px] px-5 text-left">
                      <div className="flex items-center gap-1">
                        <DateIcon />
                        <p>{formatDate(item.startDate)}</p>
                      </div>
                    </td>

                    <td className="py-[15px] px-5 text-left">
                      <div className="flex items-center gap-1">
                        <DateIcon />
                        {formatDate(item.finishDate)}
                      </div>
                    </td>

                    <td className="py-[15px] px-5 text-left">
                      <div className="flex items-center gap-1">
                        <BookQueue />
                        {item.questionCount} Асуулт
                      </div>
                    </td>

                    <td className="py-[15px] px-5 text-left">
                      <div className="flex items-center gap-1">
                        <TimeIcon />
                        {item.duration} Минут
                      </div>
                    </td>

                    <td className="py-[15px] px-5 text-left">
                      <button
                        title="more"
                        className="text-access0 hover:text-black"
                      >
                        <MenuSidebar />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-500">
                    Шалгалт олдсонгүй
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        total={examList.pagination.total}
        page={page}
        pageSizeList={[10, 20, 30]}
        pageSize={pageSize}
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />

      {open && selectedExam && (
        <ExamResultModal
          onClose={() => {
            setOpen(false);
            setSelectedExam(null);
            setExamCountData(null);
          }}
          exam={selectedExam}
          examCountData={examCountData}
          isLoadingCount={isLoadingCount}
        />
      )}
    </div>
  );
};

export default ExamTab;