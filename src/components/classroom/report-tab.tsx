import Image from "next/image";
import React from "react";
import LessonProgress from "../dashboard/board-lists";
import AvgScoreChart from "../charts/bar-chart";
import DonutChart from "../charts/chart";

const ReportTab = () => {
  const classData = [
    { name: "8А бүлэг", avg: 90, attendance: 70 },
    { name: "8Б бүлэг", avg: 100, attendance: 90 },
    { name: "8В бүлэг", avg: 95, attendance: 60 },
    { name: "8Г бүлэг", avg: 80, attendance: 40 },
    { name: "8Д бүлэг", avg: 100, attendance: 85 },
  ];
  const stats = [
    { label: "Нийт сурагч", value: 285, src: "/totalstudent.svg" },
    { label: "Дундаж оноо", value: 87, src: "/averagepoint.svg" },
    { label: "Ирц", value: "88.5%", src: "/attendance.svg" },
    { label: "Хэмжээст оноо", value: "92%", src: "/point.svg" },
  ];

  const attendanceData = [
    { name: "Шалгалт", value: 30, color: "#FFD88F" },
    { name: "Даалгавар", value: 15, color: "#5FD4A0" },
    { name: "Ирц", value: 20, color: "#5AB5E5" },
    { name: "Бусад", value: 23.5, color: "#C7E7F7" },
  ];

  const trendData = [
    { month: "6 сар", value: 20 },
    { month: "7 сар", value: 60 },
    { month: "8 сар", value: 35 },
    { month: "9 сар", value: 65 },
    { month: "10 сар", value: 55 },
    { month: "11 сар", value: 80 },
  ];

  return (
    <div className="bg-background rounded-[10px] p-5 space-y-2.5">
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
      <div className="flex gap-3">
        <DonutChart attendanceData={attendanceData} trendData={trendData} />
        <AvgScoreChart data={classData} />
      </div>

      <LessonProgress />
    </div>
  );
};

export default ReportTab;
