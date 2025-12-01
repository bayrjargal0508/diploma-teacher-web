"use client";

import Image from "next/image";
import React from "react";

interface Lesson {
  title: string;
  tests: number;
  progress: number;
}
interface Student {
  name: string;
  score: number;
  percentage: number;
  rank: number;
}

const lessons: Lesson[] = [
  { title: "XVII–XX зууны эхэн үеийн Монгол", tests: 40, progress: 89.2 },
  {
    title: "Ардчилсан Монгол ба өнөөгийн дэлхий (1990-ээд оноос одоог хүртэл)",
    tests: 80,
    progress: 85.21,
  },
  {
    title: "Монгол төрийн сэргэн мандалт (1911–1924)",
    tests: 100,
    progress: 80.8,
  },
  {
    title: "Монголын эзэнт гүрний дараах монгол улс",
    tests: 220,
    progress: 74.9,
  },
  { title: "Монголын эзэнт гүрэн (XII–XIV зуун)", tests: 120, progress: 70.6 },
  {
    title: "Монголын эртний улсууд (НТӨ IV–XII зуун)",
    tests: 100,
    progress: 65.4,
  },
  { title: "Монголын өвөг түүх", tests: 10, progress: 60.0 },
  { title: "Нүүдлийн иргэшлийн үе", tests: 45, progress: 55.28 },
  {
    title: "Социализмын үеийн Монгол ба дэлхий дахин (1924–1990 он)",
    tests: 82,
    progress: 50.8,
  },
  { title: "Түүхийг судлах аргууд", tests: 20, progress: 40.2 },
];

const students: Student[] = [
  { name: "Намнансүрэн Баяржаргал", score: 800, percentage: 88.5, rank: 1 },
  { name: "Баярсайхан Төгөлдөр", score: 799, percentage: 80.8, rank: 2 },
  { name: "Батжаргал Баттулга", score: 798, percentage: 78.8, rank: 3 },
  { name: "Ганболд Тэргэл", score: 400, percentage: 68.8, rank: 4 },
  { name: "Оюунбадрах Очбадрах", score: 399, percentage: 58.8, rank: 5 },
  { name: "Оюун-Эрдэнэ Батдорж", score: 299, percentage: 50.8, rank: 6 },
  { name: "Самбууням Оч-Унга", score: 200, percentage: 8.8, rank: 7 },
  { name: "Самбууням Оч-Унга", score: 200, percentage: 8.8, rank: 7 },
];

export default function LessonProgress() {
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
      <div className="grid grid-cols-2 @max-3xl/content:grid-cols-1 gap-2.5 ">
        {/* neg */}
        <div className="bg-background-secondary p-6 w-full rounded-md h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              Хичээлийн агуулгаар гүйцэтгэл тооцох
            </h2>
            <select className="border rounded-md px-3 py-1 text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-200">
              <option>Бүлэг сонгох</option>
              <option>8А</option>
              <option>8Б</option>
              <option>8В</option>
            </select>
          </div>

          <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 text-sm font-medium text-gray-500 dark:text-gray-300 mb-2">
            <p>Агуулга</p>
            <p className="text-center">Тестийн тоо</p>
            <p className="text-center">Гүйцэтгэлийн хувь</p>
          </div>

          <div className="flex flex-col gap-3 overflow-y-auto">
            {lessons.map((lesson, index) => (
              <div
                key={index}
                className="grid grid-cols-[1fr_auto_auto] gap-x-4 items-center text-sm"
              >
                <p className="truncate">{lesson.title}</p>
                <span className="bg-[#E2E8F0] dark:bg-gray-700 text-[#1E293B] dark:text-white px-3 py-1 rounded-md">
                  {lesson.tests} тест
                </span>
                <div className="flex items-center gap-2 w-[150px]">
                  <div className="w-full bg-[#E2E8F0] dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full"
                      style={{ width: `${lesson.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-600 dark:text-gray-200 text-xs w-10 text-right">
                    {lesson.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="bg-background-secondary p-6 w-full rounded-md h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Онооны самбар</h2>
            <select
              title="."
              className="border rounded-md px-3 py-1 text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-200"
            >
              <option>Бүх бүлэг</option>
              <option>8А</option>
              <option>8Б</option>
              <option>8В</option>
            </select>
          </div>

          <div className="grid grid-cols-[1.5fr_1fr_1fr] gap-x-4 text-sm font-medium text-gray-500 dark:text-gray-300 mb-2">
            <p>Сурагчийн нэр</p>
            <p className="text-center">Нийт оноо</p>
            <p className="text-center">Хэмжээсэт оноо</p>
          </div>

          <div className="flex flex-col gap-3 overflow-y-auto">
            {students.map((student, index) => (
              <div
                key={index}
                className="grid grid-cols-[1.5fr_1fr_1fr] gap-x-4 items-center text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md p-1 transition"
              >
                <div className="flex items-center gap-2">
                  <Image
                    src="/assets/photos/logo/female-icon.png"
                    alt="avatar"
                    width={32}
                    height={32}
                    className="rounded-full bg-gray-200"
                  />
                  <p className="truncate">{student.name}</p>
                </div>
                <div className="flex items-center justify-center gap-1 text-gray-700 dark:text-gray-200">
                  <span>
                    <Image
                      src={getRankIcon(index)}
                      width={24}
                      height={24}
                      alt="rank"
                    />
                  </span>
                  <span className="font-medium">{student.score} оноо</span>
                </div>
                <p className="text-center text-gray-700 dark:text-gray-200">
                  {student.percentage}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
