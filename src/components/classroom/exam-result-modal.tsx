"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { X, Loader2 } from "lucide-react";
import { ExamDetailType, StudentExamResult } from "@/lib/types";

interface ExamResultModalProps {
  onClose: () => void;
  exam: ExamDetailType;
  examCountData: StudentExamResult[] | null;
  isLoadingCount: boolean;
}

export default function ExamResultModal({
  onClose,
  examCountData,
  isLoadingCount,
}: ExamResultModalProps) {
  const [tab, setTab] = useState<"score" | "content">("score");

  function getColor(percent: number) {
    if (percent <= 50) return "#ef4444";
    if (percent <= 70) return "#facc15";
    return "#22c55e";
  }
  function getRankIcon(index: number) {
    if (index === 0) return "/assets/trophy-gold.png";
    if (index === 1) return "/assets/trophy-silver.png";
    if (index === 2) return "/assets/trophy-bronze.png";
    return "/assets/trophy.png";
  }

  const maxOld = Math.max(
    ...(examCountData?.map((item) => item.score || 0) || [0])
  );

  function convertScore(score: number) {
    const minNew = 200;
    const maxNew = 800;
    if (!maxOld) return minNew;
    return Math.round((score / maxOld) * (maxNew - minNew) + minNew);
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-background-secondary dark:bg-gray-800 w-full max-w-3xl rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Шалгалтын үр дүн</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-accent-foreground"
          >
            <X size={24} className="cursor-pointer" />
          </button>
        </div>

        <div className="flex justify-center border-b border-stroke-border">
          <button
            onClick={() => setTab("score")}
            className={`subTitle px-8 py-3 -mb-px w-full cursor-pointer ${
              tab === "score"
                ? "border-b-2 border-primary text-primary"
                : "text-text-caption"
            }`}
          >
            Онооны самбар
          </button>

          <button
            onClick={() => setTab("content")}
            className={`subTitle px-8 py-3 -mb-px w-full cursor-pointer ${
              tab === "content"
                ? "border-b-2 border-primary text-primary"
                : "text-text-caption"
            }`}
          >
            Шалгалтын агуулга
          </button>
        </div>

        {tab === "score" && (
          <div className="rounded-xl border border-stroke-border mt-5">
            {isLoadingCount ? (
              <div className="text-center py-12 flex justify-center text-primary">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            ) : !examCountData || examCountData.length === 0 ? (
              <div className="text-center py-12 text-label-caption">
                Шалгалтын үр дүн олдсонгүй.
              </div>
            ) : (
              <div className="h-[400px] overflow-y-auto">
                <table className="w-full">
                  <thead>
                    <tr className="mediumButton text-label-caption font-normal border-b border-stroke-border">
                      <th className="text-left px-5 py-[15px]">
                        Сурагчийн нэр
                      </th>
                      <th className="text-left">Нийт оноо</th>
                      <th className="text-left">Хэмжээст оноо</th>
                    </tr>
                  </thead>

                  <tbody>
                    {examCountData
                      .sort(
                        (a, b) => Number(b.score || 0) - Number(a.score || 0)
                      )
                      .map((item, index) => (
                        <tr
                          key={item.studentId}
                          className="border-t border-stroke-border"
                        >
                          <td className="p-3 flex items-center gap-2.5">
                            <div className="p-1 bg-accent rounded-full">
                              <Image
                                src="/assets/photos/male-icon.png"
                                alt="icon"
                                width={24}
                                height={24}
                              />
                            </div>
                            {item.studentName}
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <Image
                                src={getRankIcon(index)}
                                width={24}
                                height={24}
                                alt="rank"
                              />
                              {convertScore(item.score)}
                            </div>
                          </td>
                          <td className="p-3 flex items-center gap-2">
                            <div className="size-8">
                              <CircularProgressbar
                                value={item.score}
                                styles={buildStyles({
                                  pathColor: getColor(item.score),
                                  trailColor: "#e5e7eb",
                                })}
                                strokeWidth={15}
                              />
                            </div>
                            {item.grade}/{item.successRate}%
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === "content" && (
          <div className="rounded-xl border border-stroke-border mt-5 h-[400px] overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="mediumButton text-label-caption font-normal border-b border-stroke-border">
                  <th className="text-left px-5 py-[15px]">Агуулга</th>
                  <th className="">Асуултын тоо</th>
                  <th className="">Амжилт</th>
                </tr>
              </thead>

              <tbody>
                <tr className="hover:bg-accent">
                  <td className="px-5 py-[15px] w-[50%]">Хэл зүй </td>

                  <td className="p-3">
                    <div className="inline-block px-3 py-1 bg-accent rounded-lg text-sm font-medium">
                      50 тест
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="flex items-center gap-4">
                      <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#00C48C] rounded-full"
                          style={{ width: "89.2%" }}
                        />
                      </div>
                      <span className="text-sm font-semibold">89.2%</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <div className="pt-6">
          <Button onClick={onClose} className="w-full">
            Хаах
          </Button>
        </div>
      </div>
    </div>
  );
}
