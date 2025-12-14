"use client";

import { StudentsList } from "@/lib/types";
import { CheckCircle, Clock, Dot, Filter, SearchIcon } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { useRef, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { removeStudent } from "@/actions";
import LogoutConfirmModal from "../custom/log-out";
import MenuSidebar from "../icons/menu-icon";
import Pagination from "../ui/pagination";
import Link from "next/link";

interface TableStudentsProps {
  studentlist: StudentsList | null;
  getStudentData?: () => void;
}

const TableStudents = ({ studentlist, getStudentData }: TableStudentsProps) => {
  const students = useMemo(() => studentlist?.list ?? [], [studentlist]);
  const paginations = studentlist?.pagination;

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedStudent, setSelectedStudent] = useState<{
    classroomId: string;
    studentId: string;
  } | null>(null);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      getStudentData?.();
    }, 400);
  };

  const filteredStudents = useMemo(() => {
    if (!searchQuery) return students;
    return students.filter((s) =>
      `${s.student.firstName} ${s.student.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, students]);
  
  const handleRemove = async (
    classroomId: string,
    classroomStudentId: string
  ) => {
    try {
      const res = await removeStudent(classroomId, classroomStudentId);
      if (res.result) {
        toast.success("Амжилттай сурагч хаслаа!");
        getStudentData?.();
      } else {
        toast.error("Алдаа гарлаа!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Сурагч хасахад алдаа гарлаа!");
    }
  };

  const handleRemoveConfirm = async () => {
    if (selectedStudent) {
      await handleRemove(
        selectedStudent.classroomId,
        selectedStudent.studentId
      );
    }
    setIsRemoveModalOpen(false);
    setSelectedStudent(null);
  };

  const handleRemoveCancel = () => {
    setIsRemoveModalOpen(false);
    setSelectedStudent(null);
  };

  const openRemoveModal = (classroomId: string, studentId: string) => {
    setSelectedStudent({ classroomId, studentId });
    setIsRemoveModalOpen(true);
    setOpenMenu(null);
  };

  const paginatedStudents = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return filteredStudents.slice(start, end);
  }, [filteredStudents, page, pageSize]);

  return (
    <div className="flex flex-col gap-4 mb-5">
      <div className="flex justify-between items-center">
        <p className="font-extrabold text-[18px] text-primary-fifth">
          <span className="text-primary pr-2.5">{paginations?.total || 0}</span>{" "}
          Бүртгэлтэй сурагч
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
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-background_secondary" />
            <input
              type="text"
              placeholder="Хайх"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
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
                <th className="py-[15px] px-5 min-w-[180px] text-left align-middle">
                  Сурагчийн нэр
                </th>
                <th className="py-[15px] px-5 min-w-40 text-left align-middle">
                  Pro эрхтэй эсэх
                </th>
                <th className="py-[15px] px-5 min-w-40 text-left align-middle">
                  Дундаж оноо
                </th>
                <th className="py-[15px] px-5 min-w-40 text-left align-middle">
                  Нийт зарцуулсан цаг
                </th>
                <th className="py-[15px] px-5 min-w-40 text-left align-middle">
                  Оролцсон шалгалт
                </th>
                <th className="py-[15px] px-5 min-w-[100px] text-left align-middle">
                  Үйлдэл
                </th>
              </tr>
            </thead>

            <tbody className="cursor-pointer">
              {paginatedStudents.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-background hover:bg-gray-50 dark:hover:bg-gray-600
                    text-[14px] font-semibold"
                >
                 <td className="py-[15px] px-5 min-w-[180px] text-left align-middle">
                    <Link
                      href={`/dashboard/student/${item.student.id}?classroomId=${item.classroomId}`}
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      <div className="p-1 bg-accent rounded-full">
                        <Image
                          src={
                            item.student.gender === "FEMALE"
                              ? "/assets/photos/logo/female-icon.png"
                              : "/assets/photos/logo/male-icon.png"
                          }
                          width={24}
                          height={24}
                          alt="gender"
                        />
                      </div>
                      {item.student.firstName} {item.student.lastName}
                    </Link>
                  </td>

                  <td className="py-[15px] px-5 text-left align-middle">
                    {item.student.premium ? (
                      <span className="flex items-center gap-1 bg-[#DBF4E6] text-[#41C993] border border-[#41C993] px-3.5 py-1 rounded-full text-[12px] w-fit">
                        <Dot className="w-5 h-5" />
                        Эрхтэй
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 bg-primary-tertiary text-[#CF4D5B] border border-[#E5606A] px-3.5 py-1 rounded-full text-[12px] w-fit">
                        <Dot className="w-5 h-5" />
                        Эрхгүй
                      </span>
                    )}
                  </td>

                  <td className="py-[15px] px-5 text-left align-middle">
                    220 оноо
                  </td>

                  <td className="py-[15px] px-5 text-left flex items-center gap-1 align-middle">
                    <Clock className="w-4 h-4" /> 128 минут
                  </td>

                  <td className="py-[15px] px-5 text-left align-middle">
                    <CheckCircle className="w-4 h-4 text-green-500 inline mr-1" />
                    40 / 40 Шалгалт
                  </td>

                  <td className="py-[15px] px-5 text-left align-middle relative">
                    <button
                      title="menu"
                      onClick={() =>
                        setOpenMenu(openMenu === item.id ? null : item.id)
                      }
                      className="text-gray-500 hover:text-black"
                    >
                      <MenuSidebar />
                    </button>

                    {openMenu === item.id && (
                      <div className="absolute bg-white shadow-lg rounded-md border z-50">
                        <button
                          onClick={() =>
                            openRemoveModal(item.classroomId, item.id)
                          }
                          className="w-full p-2 flex items-center text-sm text-negative hover:bg-gray-100 rounded-md"
                        >
                          Ангиас хасах
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-3 px-1">
          <Pagination
            total={filteredStudents.length}
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
      </div>

      <LogoutConfirmModal
        isOpen={isRemoveModalOpen}
        onConfirm={handleRemoveConfirm}
        onCancel={handleRemoveCancel}
        title="Та сурагч хасахдаа итгэлтэй байна уу?"
      />
    </div>
  );
};

export default TableStudents;
