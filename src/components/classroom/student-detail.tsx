"use client";
import Image from "next/image";
import TrendAreaChart from "../charts/area-chart";
import MenuSidebar from "../icons/menu-icon";
import { ExamDetailType } from "@/lib/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { examClassroomList } from "@/actions";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import CircleTimeIcon from "../icons/circle-time-icon";
import { Check } from "lucide-react";
import { useContent } from "../providers/content-categories";

interface ClassroomDetailProps {
  classroomId: string;
}

const stats = [
  { label: "Дундаж оноо", value: 87, src: "/averagepoint.svg" },
  { label: "Ирц", value: "88.5%", src: "/attendance.svg" },
  { label: "Хэмжээст оноо", value: "92%", src: "/point.svg" },
];

const trendData = [
  { month: "6 сар", value: 20 },
  { month: "7 сар", value: 60 },
  { month: "8 сар", value: 35 },
  { month: "9 сар", value: 65 },
  { month: "10 сар", value: 55 },
  { month: "11 сар", value: 80 },
];

function getColor(percent: number) {
  if (percent <= 50) return "#ef4444";
  if (percent <= 70) return "#facc15";
  return "#22c55e";
}

const StudentDetail = ({ classroomId }: ClassroomDetailProps) => {
  const { content, loading: contentLoading } = useContent();
  const [examList, setExamList] = useState<ExamDetailType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!classroomId) return;

    const load = async () => {
      try {
        setIsLoading(true);
        const result = await examClassroomList(classroomId);
        console.log("exam list =>", result);

        if (Array.isArray(result)) {
          setExamList(result);
        } else if (result && typeof result === "object" && "list" in result) {
          setExamList((result as { list: ExamDetailType[] }).list);
        } else {
          setExamList([]);
        }
      } catch (error) {
        console.error("Error loading exam list:", error);
        toast.error("Шалгалтын жагсаалт ачаалахад алдаа гарлаа");
        setExamList([]);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [classroomId]);

  return (
    <div className="space-y-5 h-full">
      <div className="grid grid-cols-3 gap-5 w-full">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-background-secondary flex justify-between items-start py-5 px-8 rounded-md border border-stroke-border w-full gap-2.5"
          >
            <div>
              <p className="text-label-caption text-sm">{item.label}</p>
              <p className="profileHeader text-foreground mt-3">{item.value}</p>
            </div>
            <Image src={item.src} alt="icon" width={50} height={70} />
          </div>
        ))}
      </div>
      <div className="flex gap-2.5 w-full h-80">
        <div className="flex-1 bg-background-secondary py-5 px-[30px] rounded-[10px] h-full flex flex-col border border-stroke-border">
          <TrendAreaChart trendData={trendData} />
        </div>
        <div className="flex-1 bg-background-secondary py-5 px-[30px] rounded-[10px] h-full flex flex-col border border-stroke-border overflow-y-auto">
          <div className="flex justify-between items-center pb-4">
            <h2 className="text-base font-semibold">
              Хичээлийн агуулгаар гүйцэтгэл тооцох
            </h2>
          </div>

          <table className="w-full text-sm font-medium text-accent-foreground">
            <thead>
              <tr>
                <th className="text-xs text-left">Агуулга</th>
                <th className="text-center">Тестийн тоо</th>
                <th className="text-center">Гүйцэтгэлийн хувь</th>
              </tr>
            </thead>

            <tbody>
              {contentLoading ? (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-gray-500">
                    Ачааллаж байна...
                  </td>
                </tr>
              ) : !content || content.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-gray-500">
                    Мэдээлэл байхгүй байна
                  </td>
                </tr>
              ) : (
                content.map((lesson, index) => (
                  <tr key={lesson.id ?? `lesson-${index}`} className="h-12 text-label-paragraph">
                    <td>{lesson.name}</td>

                    <td className="text-center">
                      <span className="bg-accent text-accent-foreground px-3 py-1 rounded-[10px]">
                        20 тест
                      </span>
                    </td>

                    <td>
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-[150px] rounded-full h-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full"
                            style={{ width: "90%" }}
                          ></div>
                        </div>
                        <span className="text-xs w-10 text-right">
                          89%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex flex-col gap-4 mb-5">
        <div className="overflow-x-auto">
          <div className="overflow-hidden rounded-[10px] border border-background">
            <table className="bg-background-secondary w-full">
              <thead className="border-background border-b">
                <tr className="text-label-caption font-medium text-[14px] leading-[18px]">
                  <th className="py-[15px] px-5 min-w-[180px] text-left">
                    Шалгалтын нэр
                  </th>
                  <th className="py-[15px] px-5 min-w-40 text-left">
                    Нийт оноо
                  </th>
                  <th className="py-[15px] px-5 min-w-40 text-left">
                    Зарцуулсан цаг
                  </th>
                  <th className="py-[15px] px-5 min-w-40 text-left">Үр дүн</th>
                  <th className="py-[15px] px-5 min-w-40 text-right">Үйлдэл</th>
                </tr>
              </thead>

              <tbody className="text-[14px] font-semibold">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-[15px] px-5 text-center text-gray-500"
                    >
                      Ачааллаж байна...
                    </td>
                  </tr>
                ) : examList.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-[15px] px-5 text-center text-gray-500"
                    >
                      Одоогоор шалгалт байхгүй байна.
                    </td>
                  </tr>
                ) : (
                  examList.map((item: ExamDetailType) => (
                    <tr
                      key={item.id}
                      className="border-b border-background hover:bg-accent dark:hover:accent"
                    >
                      <td className="py-[15px] px-5 min-w-[180px] text-left hover:text-primary cursor-pointer hover:underline">
                        {item.name}
                      </td>

                      <td className="py-[15px] px-5 text-left flex items-center gap-3">
                        <div className="size-8">
                          <CircularProgressbar
                            value={item.questionCount}
                            styles={buildStyles({
                              pathColor: getColor(item.questionCount),
                              trailColor: "#e5e7eb",
                            })}
                            strokeWidth={15}
                          />
                        </div>
                        <p>
                          A/<span>{item.questionCount}</span>%
                        </p>
                      </td>

                      <td className="py-[15px] px-5 text-left">
                        <div className="flex items-center gap-1">
                          <CircleTimeIcon />
                          {item.questionCount} Минут
                        </div>
                      </td>

                      <td className="py-[15px] px-5 text-left">
                        <div className="flex items-center gap-1">
                          <div className="bg-positive size-5 rounded-full flex items-center justify-center">
                            <Check
                              className="text-background-secondary"
                              size={15}
                            />
                          </div>
                          {item.questionCount} ТЕСТ
                        </div>
                      </td>

                      <td className="py-[15px] px-5 text-right">
                        <button title="more" className="text-access">
                          <MenuSidebar />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;