"use client";

import TimeIcon from "../icons/time-icon";
import DateIcon from "../icons/date-icon";
import MenuSidebar from "../icons/menu-icon";
import BookQueue from "../icons/book-queue.";
import { Button } from "../ui/button";
import { ChevronDown, Filter, Search } from "lucide-react";
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
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

    const fetchExamList = async (): Promise<ExamListApiResponse> => {
      try {
        const result = await examClassroomList(classroomId, page, pageSize);
        if (
          result &&
          typeof result === "object" &&
          !Array.isArray(result) &&
          "list" in result &&
          "pagination" in result
        ) {
          const examResponse = result as ExamListApiResponse;
          return examResponse;
        }
        if (Array.isArray(result)) {
          return {
            pagination: {
              currentPage: page,
              pageSize: pageSize,
              total: result.length,
              sortDirection: "ASC",
              sortParams: [],
              current: page,
            },
            list: result,
          };
        }

        throw new Error("Алдаа гарлаа");
      } catch (error) {
        toast.error(`Сүлжээний алдаа. ${error}`);
        return {
          pagination: {
            currentPage: page,
            pageSize: pageSize,
            total: 0,
            sortDirection: "ASC",
            sortParams: [],
            current: page,
          },
          list: [],
        };
      }
    };

    const load = async () => {
      setIsLoading(true);
      const data = await fetchExamList();
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

  useEffect(() => {
    setPage(1);
  }, [classroomId]);

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

    const date = d.toLocaleDateString("en-CA");
    const time = d.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return `${date.replaceAll("-", ".")} / ${time}`;
  };

  if (isLoading)
    return (
      <div className="flex flex-1 items-center justify-center">
        <MonsterLottie />
      </div>
    );

  return (
    <div className="flex flex-col gap-4 min-h-screen">
      <div className="flex justify-between items-center">
        <p className="font-extrabold text-[18px] text-primary-fifth">
          <span className="text-primary">{total}</span> Шалгалт
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

          <div className="relative h-10 w-75">
            <InputGroup>
              <InputGroupInput placeholder="Хайх" />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="overflow-hidden rounded-[10px] border border-background">
          <table className="bg-background-secondary w-full">
            <thead className="border-background border-b">
              <tr className="text-label-caption font-medium text-[14px] leading-4.5">
                <th className="w-1/6 py-3.75 px-5">
                  <div className="flex items-center justify-between">
                    <span>Тестийн нэр</span>
                    <ChevronDown size={16} />
                  </div>
                </th>
                <th className="w-1/7   py-3.75 px-5">
                  <div className="flex items-center justify-between">
                    <span>Төлөв</span>
                    <ChevronDown size={16} />
                  </div>
                </th>
                <th className="w-1/6 py-3.75 px-5">
                  <div className="flex items-center justify-between">
                    <span>Эхлэх оноо</span>
                    <ChevronDown size={16} />
                  </div>
                </th>
                <th className="w-1/6 py-3.75 px-5">
                  <div className="flex items-center justify-between">
                    <span>Дуусах оноо</span>
                    <ChevronDown size={16} />
                  </div>
                </th>
                <th className="w-1/6 py-3.75 px-5">
                  <div className="flex items-center justify-between">
                    <span>Асуултын оноо</span>
                    <ChevronDown size={16} />
                  </div>
                </th>
                <th className="w-1/6 py-3.75 px-5">
                  <div className="flex items-center justify-between">
                    <span>Хугацаа</span>
                    <ChevronDown size={16} />
                  </div>
                </th>
                <th className="py-3.75 px-5">Үйлдэл</th>
              </tr>
            </thead>

            <tbody className="text-[14px] font-semibold">
              {examList.list.length > 0 ? (
                examList.list.map((item: ExamDetailType) => (
                  <tr
                    key={item.id}
                    className="border-b border-background hover:bg-accent dark:hover:text-accent-foreground"
                  >
                    <td
                      className="py-3.75 px-5 min-w-45 text-left hover:text-primary cursor-pointer hover:underline"
                      onClick={() => handleExamClick(item)}
                    >
                      {item.name}
                    </td>

                    <td className="py-3.75 px-5 text-left">
                      {item.status === "INACTIVE" && (
                        <span className="bg-[#D8EEFB] text-[#00A5E3] border border-[#00A5E3] px-3.5 py-1 rounded-full text-[12px]">
                          Идэвхгүй
                        </span>
                      )}
                      {item.status === "ACTIVE" && (
                        <span className="bg-positive/12 text-positive border border-positive px-3.5 py-1 rounded-full text-[12px]">
                          Идэвхтэй
                        </span>
                      )}
                      {item.status === "CLOSED" && (
                        <span className="bg-negative/12 text-negative border border-negative px-3.5 py-1 rounded-full text-[12px]">
                          Дууссан
                        </span>
                      )}
                    </td>

                    <td className="py-3.75 px-5 text-left">
                      <div className="flex items-center gap-2.5">
                        <DateIcon className="size-4 text-label-caption" />
                        <p className="text-sm">{formatDate(item.startDate)}</p>
                      </div>
                    </td>

                    <td className="py-3.75 px-5 text-left">
                      <div className="flex items-center gap-2.5">
                        <DateIcon className="size-4 text-label-caption" />
                        {formatDate(item.finishDate)}
                      </div>
                    </td>

                    <td className="py-3.75 px-5 text-left">
                      <div className="flex items-center gap-2.5">
                        <BookQueue className="size-4 text-label-caption" />
                        {item.questionCount} Асуулт
                      </div>
                    </td>

                    <td className="py-3.75 px-5 text-left">
                      <div className="flex items-center gap-2.5">
                        <TimeIcon className="size-4 text-label-caption" />
                        {item.duration} Минут
                      </div>
                    </td>

                    <td className="py-3.75 px-5 text-left">
                      <button className="text-label-caption hover:text-black dark:hover:text-white cursor-pointer hover:bg-background-secondary px-3.75 py-2.5 rounded-[10px] active:bg-background-secondary focus:outline-none">
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
