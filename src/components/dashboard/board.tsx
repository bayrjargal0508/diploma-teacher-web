"use client";

import { Filter } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import DashboardCharts from "../charts";
import LessonProgress from "./board-lists";
import { classroom } from "@/actions";
import { toast } from "react-toastify";

const Board = () => {
  const [classroomIcon, setClassroomIcon] = useState<string | null>(null);
  const [classroomSubjectName, setClassroomSubjectName] = useState("");

  const stats = [
    { label: "Нийт сурагч", value: 285, src: "/totalstudent.svg" },
    { label: "Дундаж оноо", value: 87, src: "/averagepoint.svg" },
    { label: "Ирц", value: "88.5%", src: "/attendance.svg" },
    { label: "Хэмжээст оноо", value: "92%", src: "/point.svg" },
  ];

  const fetchClassroomData = async () => {
    const res = await classroom();
    if (res.result && Array.isArray(res.data) && res.data.length > 0) {
      const item = res.data[0];

      setClassroomIcon(item.classroomIcon);
      setClassroomSubjectName(item.classroomSubjectName);
    } else {
      toast.error(res.message);
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchClassroomData();
    };
    loadData();
  }, []);
  return (
    <div className="bg-background rounded-[10px] p-5 space-y-2.5">
      <div
        className="lg:h-[120px] rounded-sm px-5 py-2.5 lg:flex items-center justify-between gap-3 bg-cover bg-center"
        style={{
          backgroundImage: "url('/assets/photos/board-bg.png')",
        }}
      >
        <div className="flex gap-2.5">
          <Image
            src={classroomIcon || "/assets/photos/default-classroom-icon.png"}
            alt="icon"
            width={100}
            height={40}
          />

          <div className="py-2 flex flex-col gap-2.5">
            <p className="profileHeader md:profileHeader sm:subTitle text-background-secondary">
              {classroomSubjectName}
            </p>
            <p className="paragraphText text-background-secondary bg-[#FFFFFF47] px-[15px] py-0.5 rounded-[5px] w-fit">
              Нийт сурагч: 128{" "}
            </p>
          </div>
        </div>
        <div className="flex gap-2.5">
          {/* <DropdownMenu>
            <DropdownMenuTrigger className="w-[200px] h-10 flex items-center justify-between gap-2 rounded-md border border-stroke-border bg-background-secondary px-4 py-2 text-sm outline-hidden hover:bg-accent">
              Бүх анги
              <ChevronDown className="size-4 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[140px] bg-background-secondary">
              <DropdownMenuItem>12A</DropdownMenuItem>
              <DropdownMenuItem>12Б</DropdownMenuItem>
              <DropdownMenuItem>12В</DropdownMenuItem>
              <DropdownMenuItem>12Г</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
          <div className="bg-background-secondary px-4 py-2 rounded-md font-bold text-sm flex items-center gap-2.5">
            <Image
              src={classroomIcon || "/assets/photos/default-classroom-icon.png"}
              alt="icon"
              width={24}
              height={24}
            />
            <span>Анги харьцуулах</span>
          </div>
          <div className="bg-background-secondary px-4 py-2 rounded-md text-sm">
            <Filter size={20} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 w-full">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-background-secondary flex justify-between items-start py-5 px-8 rounded-md border border-stroke-border w-full gap-2.5"
          >
            <div>
              <p className="text-gray-500 text-sm">{item.label}</p>
              <p className="profileHeader text-foreground mt-3">{item.value}</p>
            </div>
            <Image src={item.src} alt="icon" width={50} height={70} />
          </div>
        ))}
      </div>
      <DashboardCharts />
      <LessonProgress />
    </div>
  );
};

export default Board;
