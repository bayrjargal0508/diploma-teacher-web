"use client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import DashboardCharts from "../charts";
import LessonProgress from "./board-lists";
import { classroom } from "@/actions";
import { toast } from "react-toastify";

const Board = () => {
  const [classroomIcon, setClassroomIcon] = useState<string | null>(null);
  const [alias, setAlias] = useState("");

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
      setAlias(item.alias);
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
      <div className="h-[120px] bg-blue-300 rounded-sm px-5 py-2.5 flex items-center justify-between gap-3 ">
        <div className="flex gap-2.5">
          <Image
            src={classroomIcon || "/assets/photos/default-classroom-icon.png"}
            alt="icon"
            width={80}
            height={40}
          />

          <div className="pt-3">
            <p className="profileHeader text-background-secondary">{alias}</p>
            <p className="paragraphText text-background-secondary bg-[#FFFFFF47] px-[15px] py-0.5 rounded-[5px] w-fit">
              Нийт сурагч: 128{" "}
            </p>
          </div>
        </div>
        <div className="flex gap-2.5">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-[140px] h-10 flex items-center justify-between gap-2 rounded-md border border-stroke-border bg-background px-4 py-2 text-sm outline-hidden hover:bg-accent">
              Бүх анги
              <ChevronDown className="size-4 opacity-50" />
            </DropdownMenuTrigger>

            {/* <DropdownMenuContent align="end" className="w-[300px]">
              {[
                { id: 1, name: "Монгол хэл" },
                { id: 2, name: "Математик" },
                { id: 3, name: "Физик" },
                { id: 4, name: "Хими" },
              ].map((subject) => (
                <DropdownMenuItem key={subject.id}>
                  {subject.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent> */}
          </DropdownMenu>
          <div className="w-[200px] h-10 bg-background px-4 py-2 rounded-md border border-stroke-border text-sm">
            <p>2025.10.22 - 2025.10.22</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 w-full">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-background-secondary flex justify-between items-start py-5 px-8 rounded-md shadow-sm w-full gap-2.5"
          >
            <div>
              <p className="text-gray-500 text-sm">{item.label}</p>
              <p className="profileHeader text-foreground mt-3">{item.value}</p>
            </div>
            <Image src={item.src} alt="icon" width={70} height={70} />
          </div>
        ))}
      </div>
      <DashboardCharts />
      <LessonProgress />
    </div>
  );
};

export default Board;
