"use client";

import Image from "next/image";
import { Check, SearchIcon, X } from "lucide-react";
import { StudentsList } from "@/lib/types";
import {
  acceptAllStudents,
  acceptStudent,
  declineAllStudent,
  declineStudent,
} from "@/actions";
import { toast } from "react-toastify";
import { useMemo, useRef, useState } from "react";
import Pagination from "../ui/pagination";

interface PendingStudentsProps {
  pendingstudentlist: StudentsList | null;
  getStudentData?: () => void;
}
interface AcceptAllResponse {
  result: boolean;
  message?: string;
  data?: {
    processed: string[];
    skipped: Record<string, string>;
    failed: Record<string, string>;
  };
}

const PendingStudents = ({
  pendingstudentlist,
  getStudentData,
}: PendingStudentsProps) => {
  const students = useMemo(
    () => pendingstudentlist?.list ?? [],
    [pendingstudentlist?.list]
  );
  const paginations = pendingstudentlist?.pagination;

  const [selected, setSelected] = useState<string[]>([]);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAllAccept = async () => {
    if (selected.length === 0) {
      toast.error("Сурагч сонгоно уу!");
      return;
    }

    try {
      const res = (await acceptAllStudents(selected)) as AcceptAllResponse;

      if (res.result === true) {
        const skipped = res.data?.skipped ?? {};

        if (Object.keys(skipped).length > 0) {
          Object.values(skipped).forEach((msg) => toast.error(msg));
        } else {
          toast.success("Сонгосон сурагчдыг амжилттай зөвшөөрлөө!");
        }

        setSelected([]);
        getStudentData?.();
      } else {
        toast.error(res.message || "Алдаа гарлаа!");
      }
    } catch (error) {
      toast.error("Алдаа гарлаа!");
      console.error(error);
    }
  };

  const handleAllDecline = async () => {
    if (selected.length === 0) {
      toast.error("Сурагч сонгоно уу!");
      return;
    }

    try {
      const res = await declineAllStudent(selected);

      if (res.result === true) {
        toast.success("Сонгосон сурагчдыг амжилттай татгалзлаа!");
        setSelected([]);
        getStudentData?.();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Алдаа гарлаа!");
      console.error(error);
    }
  };

  const handleAccept = async (id: string) => {
    try {
      const res = await acceptStudent(id);

      if (res.result === true) {
        toast.success("Амжилттай зөвшөөрлөө!");
        getStudentData?.();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Сурагч нэмэхэд алдаа гарлаа!");
    }
  };
  const handleDecline = async (id: string) => {
    try {
      const res = await declineStudent(id);
      if (res.result === true) {
        toast.success("Амжилттай татгалзлаа!");
        getStudentData?.();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Алдаа гарлаа!");
    }
  };

  return (
    <div className=" flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center">
        <p className="font-extrabold text-[18px] text-primary-fifth">
          <span className="text-primary">{paginations?.total || 0}</span>{" "}
          Хүлээгдэж байгаа
        </p>

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

      <div className="bg-background-secondary mt-4 mb-2.5 text-primary-fifth text-[14px] leading-5 font-bold h-10 w-full rounded-[10px] flex items-center justify-between px-5">
        <div className="flex items-center gap-1">
          Сонгогдсон{" "}
          <span className="text-primary-fifth">{selected.length}</span> мөр
        </div>

        <div className="flex items-center gap-3">
          {/* Check button */}
          <button
            title="approve"
            onClick={handleAllAccept}
            className="w-5 h-5 rounded-md bg-[#3b3f47] flex items-center justify-center text-white hover:opacity-80 transition"
          >
            <Check size={16} />
          </button>

          {/* X button */}
          <button
            title="reject"
            onClick={handleAllDecline}
            className="w-5 h-5 rounded-md bg-[#c4cbd8] flex items-center justify-center text-white hover:opacity-80 transition"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="overflow-hidden rounded-[10px] border border-background">
          <table className=" bg-background-secondary w-full ">
            <thead className="border-background border-b">
              <tr className="text-label-caption font-medium text-[14px] leading-[18px]">
                <th className="py-[15px] px-5 w-10 text-left">
                  <input
                    type="checkbox"
                    checked={
                      students.length > 0 && selected.length === students.length
                    }
                    className="accent-amber-600"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelected(students.map((s) => s.id));
                      } else {
                        setSelected([]);
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </th>
                <th className="py-[15px] px-5 min-w-[180px] text-left align-middle">
                  <div className="flex items-center gap-2">Сурагчийн нэр</div>
                </th>

                <th className="py-[15px] px-5 min-w-40 text-left align-middle">
                  Имэйл хаяг
                </th>
                <th className="py-[15px] px-5 min-w-40 text-left align-middle">
                  Хүсэлт илгээсэн огноо
                </th>

                <th className="py-[15px] px-5 min-w-[100px] text-left align-middle">
                  Үйлдэл
                </th>
              </tr>
            </thead>
            <tbody className="cursor-pointer w-full">
              {filteredStudents.map((item, idx) => (
                <tr
                  key={item.id}
                  className={`border-b border-background hover:bg-gray-50 text-[14px] font-semibold ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } w-full`}
                  onClick={() => toggleSelect(item.id)} // <-- Add this
                >
                  <td className="py-[15px] px-5 w-10">
                    <input
                      type="checkbox"
                      className="accent-amber-600"
                      checked={selected.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      onClick={(e) => e.stopPropagation()} // prevent double toggle
                    />
                  </td>
                  <td className="py-[15px] px-5 min-w-[180px] text-left flex items-center gap-2 align-middle">
                    <Image
                      src={
                        item.student.gender === "FEMALE"
                          ? "/assets/photos/logo/female-icon.png"
                          : "/assets/photos/logo/male-icon.png"
                      }
                      width={20}
                      height={20}
                      alt={item.student.gender === "FEMALE" ? "female" : "male"}
                    />
                    <span>
                      {item.student.firstName} {item.student.lastName}
                    </span>
                  </td>

                  <td className="py-[15px] px-5">{item.student.email}</td>

                  <td className="py-[15px] px-5 text-left align-middle">
                    {item.createdDateText}
                  </td>

                  <td className="py-[15px] px-5 text-left align-middle">
                    <div className="flex gap-2 font-semibold text-[14px]">
                      <button
                        className="text-black hover:underline "
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAccept(item.id);
                        }}
                      >
                        Зөвшөөрөх
                      </button>

                      <button
                        className=" text-[#E66A63] hover:underline hover:underline-[#E66A63]"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDecline(item.id);
                        }}
                      >
                        Татгалзах
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="pt-3 px-1">
          <Pagination
            total={paginations?.total || 0}
            page={page}
            pageSizeList={[10, 20, 30]}
            pageSize={pageSize}
            onPageChange={(p) => setPage(p)}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PendingStudents;
