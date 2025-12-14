"use client";

import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useContent } from "../providers/content-categories";

interface Student {
  name: string;
  score: number;
  percentage: number;
  rank: number;
}

const students: Student[] = [
  { name: "Намнансүрэн Баяржаргал", score: 800, percentage: 88.5, rank: 1 },
  { name: "Намнансүрэн Баяржаргал", score: 800, percentage: 88.5, rank: 1 },
  { name: "Баярсайхан Төгөлдөр", score: 799, percentage: 80.8, rank: 2 },
  { name: "Батжаргал Баттулга", score: 798, percentage: 78.8, rank: 3 },
  // { name: "Ганболд Тэргэл", score: 400, percentage: 68.8, rank: 4 },
  // { name: "Оюунбадрах Очбадрах", score: 399, percentage: 58.8, rank: 5 },
  // { name: "Оюун-Эрдэнэ Батдорж", score: 299, percentage: 50.8, rank: 6 },
  // { name: "Самбууням Оч-Унга", score: 200, percentage: 8.8, rank: 7 },
  // { name: "Самбууням Оч-Унга", score: 200, percentage: 8.8, rank: 7 },
];

export default function LessonProgress() {
  const { content, loading } = useContent();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 0:
        return "/assets/trophy-gold.png";
      case 1:
        return "/assets/trophy-silver.png";
      case 2:
        return "/assets/trophy-bronze.png";
      default:
        return "/assets/trophy.png";
    }
  };

  return (
    <div className="w-full">
      <div className="grid lg:grid-cols-2 gap-2.5 ">
        {/* Left - Lessons Table */}
        <div className="bg-background-secondary p-5 w-full rounded-[10px] h-full flex flex-col border border-stroke-border">
          <div className="flex justify-between items-center pb-4">
            <h2 className="text-lg font-semibold">
              Хичээлийн агуулгаар гүйцэтгэл тооцох
            </h2>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <p className="flex items-center gap-1 border rounded-[10px] px-3 py-1 border-stroke-border">
                  Шалгалт сонгох <ChevronDown size={16} />
                </p>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="bg-background-secondary"
              >
                <DropdownMenuItem>12А</DropdownMenuItem>
                <DropdownMenuItem>12Б</DropdownMenuItem>
                <DropdownMenuItem>12В</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <table className="w-full text-sm font-medium text-gray-600 dark:text-gray-300">
            <thead>
              <tr>
                <th className="py-2 text-left">Агуулга</th>
                <th className="py-2 text-center">Тестийн тоо</th>
                <th className="py-2 text-center">Гүйцэтгэлийн хувь</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
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
                  <tr key={lesson.id ?? `lesson-${index}`} className="h-12">
                    <td className="py-2">{lesson.name}</td>

                    <td className="py-2 text-center">
                      <span className="bg-accent text-label-paragraph dark:text-black px-3 py-1 rounded-[10px]">
                        20 тест
                      </span>
                    </td>

                    <td className="py-2">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-[150px] rounded-full h-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full"
                            style={{ width: "90%" }}
                          ></div>
                        </div>
                        <span className="text-label-paragraph text-xs w-10 text-right">
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

        {/* Right - Students Leaderboard */}
        <div className="bg-background-secondary p-5 w-full rounded-[10px] h-full flex flex-col border border-stroke-border">
          <div className="flex justify-between items-center pb-4">
            <h2 className="text-lg font-semibold">Онооны самбар</h2>
          </div>
          <div className="rounded-2xl border border-stroke-border overflow-hidden">
            <table className="w-full text-sm font-medium text-label-paragraph">
              <thead>
                <tr className="border-b border-stroke-border">
                  <th className="py-2.5 px-5 text-left">Сурагчийн нэр</th>
                  <th className="py-2.5 px-5 text-center">Нийт оноо</th>
                  <th className="py-2.5 px-5 text-center">Хэмжээсэт оноо</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-stroke-border">
                {students.map((student, index) => (
                  <tr key={index} className="transition rounded-[10px] p-4">
                    <td className="py-2.5 px-5">
                      <div className="flex items-center gap-2">
                        <div className="bg-accent rounded-full size-[34px] flex items-center justify-center">
                          <Image
                            src="/assets/photos/logo/female-icon.png"
                            alt="avatar"
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                        </div>
                        <p className="smallInput">{student.name}</p>
                      </div>
                    </td>

                    <td className="py-2.5">
                      <div className="flex items-center justify-center gap-1">
                        <Image
                          src={getRankIcon(index)}
                          width={24}
                          height={24}
                          alt="rank"
                        />
                        <span className="font-medium">
                          {student.score} оноо
                        </span>
                      </div>
                    </td>

                    <td className="py-2.5 text-center">
                      {student.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}